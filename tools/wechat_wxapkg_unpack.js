#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const V1MMWX_HEADER = Buffer.from("V1MMWX", "utf8");
const DEFAULT_SALT = "saltiest";
const DEFAULT_IV = "the iv: 16 bytes";

function usage() {
  console.error(
    [
      "Usage:",
      "  node scripts/wechat_wxapkg_unpack.js --appid <wxid> --source <wxapkg-file-or-dir> --output <output-dir>",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    result[key] = value;
    i += 1;
  }
  if (!result.appid || !result.source || !result.output) {
    usage();
    throw new Error("Missing required arguments.");
  }
  return result;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listWxapkgFiles(sourcePath) {
  const stat = fs.statSync(sourcePath);
  if (stat.isFile()) {
    return [sourcePath];
  }
  return fs
    .readdirSync(sourcePath)
    .filter((name) => name.endsWith(".wxapkg"))
    .sort((left, right) => {
      if (left === "__APP__.wxapkg") {
        return -1;
      }
      if (right === "__APP__.wxapkg") {
        return 1;
      }
      return left.localeCompare(right);
    })
    .map((name) => path.join(sourcePath, name));
}

function decryptPcWxapkg(buffer, appid) {
  if (!buffer.subarray(0, V1MMWX_HEADER.length).equals(V1MMWX_HEADER)) {
    return { buffer, encrypted: false };
  }
  const key = crypto.pbkdf2Sync(appid, DEFAULT_SALT, 1000, 32, "sha1");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(DEFAULT_IV, "utf8"),
  );
  const encryptedHeader = buffer.subarray(V1MMWX_HEADER.length, V1MMWX_HEADER.length + 1024);
  const decryptedHeader = Buffer.concat([
    decipher.update(encryptedHeader),
    decipher.final(),
  ]);
  const xorKey = appid.length >= 2 ? appid.charCodeAt(appid.length - 2) : 0x66;
  const encryptedBody = buffer.subarray(V1MMWX_HEADER.length + 1024);
  const decryptedBody = Buffer.allocUnsafe(encryptedBody.length);
  for (let i = 0; i < encryptedBody.length; i += 1) {
    decryptedBody[i] = encryptedBody[i] ^ xorKey;
  }
  return {
    buffer: Buffer.concat([decryptedHeader, decryptedBody]),
    encrypted: true,
  };
}

function unpackWxapkg(buffer, outputDir) {
  const firstMark = buffer.readUInt8(0);
  const unknownInfo = buffer.readUInt32BE(1);
  const infoListLength = buffer.readUInt32BE(5);
  const dataLength = buffer.readUInt32BE(9);
  const lastMark = buffer.readUInt8(13);

  if (firstMark !== 0xbe || lastMark !== 0xed) {
    throw new Error(
      `Invalid wxapkg header: firstMark=0x${firstMark.toString(16)}, lastMark=0x${lastMark.toString(16)}`,
    );
  }

  const fileCount = buffer.readUInt32BE(14);
  let cursor = 18;
  const files = [];

  for (let i = 0; i < fileCount; i += 1) {
    const nameLength = buffer.readUInt32BE(cursor);
    cursor += 4;
    const name = buffer.subarray(cursor, cursor + nameLength).toString("utf8");
    cursor += nameLength;
    const offset = buffer.readUInt32BE(cursor);
    cursor += 4;
    const size = buffer.readUInt32BE(cursor);
    cursor += 4;
    files.push({ name, offset, size });
  }

  for (const file of files) {
    const relativePath = file.name.replace(/^\/+/, "");
    if (relativePath.startsWith("..")) {
      throw new Error(`Unsafe file path inside wxapkg: ${file.name}`);
    }
    const targetPath = path.join(outputDir, relativePath);
    const resolvedTarget = path.resolve(targetPath);
    const resolvedOutput = path.resolve(outputDir);
    if (!resolvedTarget.startsWith(resolvedOutput)) {
      throw new Error(`Path escape detected: ${file.name}`);
    }
    ensureDir(path.dirname(resolvedTarget));
    fs.writeFileSync(resolvedTarget, buffer.subarray(file.offset, file.offset + file.size));
  }

  return {
    header: {
      firstMark,
      unknownInfo,
      infoListLength,
      dataLength,
      lastMark,
      fileCount,
    },
    files,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceFiles = listWxapkgFiles(args.source);
  if (sourceFiles.length === 0) {
    throw new Error(`No .wxapkg files found under: ${args.source}`);
  }

  const outputRoot = path.resolve(args.output);
  const rawDir = path.join(outputRoot, "raw");
  const decryptedDir = path.join(outputRoot, "decrypted");
  const unpackedDir = path.join(outputRoot, "unpacked_by_pkg");
  ensureDir(rawDir);
  ensureDir(decryptedDir);
  ensureDir(unpackedDir);

  const summary = {
    appid: args.appid,
    source: path.resolve(args.source),
    output: outputRoot,
    generatedAt: new Date().toISOString(),
    packages: [],
  };

  for (const sourceFile of sourceFiles) {
    const baseName = path.basename(sourceFile);
    const packageName = baseName.replace(/\.wxapkg$/i, "");
    const rawTarget = path.join(rawDir, baseName);
    fs.copyFileSync(sourceFile, rawTarget);

    const inputBuffer = fs.readFileSync(sourceFile);
    const decrypted = decryptPcWxapkg(inputBuffer, args.appid);
    const decryptedTarget = path.join(decryptedDir, `${packageName}.decrypted.wxapkg`);
    fs.writeFileSync(decryptedTarget, decrypted.buffer);

    const packageOutputDir = path.join(unpackedDir, packageName);
    ensureDir(packageOutputDir);
    const unpacked = unpackWxapkg(decrypted.buffer, packageOutputDir);

    summary.packages.push({
      packageName,
      sourceFile: path.resolve(sourceFile),
      rawCopy: rawTarget,
      decryptedFile: decryptedTarget,
      unpackedDir: packageOutputDir,
      encrypted: decrypted.encrypted,
      header: unpacked.header,
      previewFiles: unpacked.files.slice(0, 20),
    });
  }

  const summaryPath = path.join(outputRoot, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Unpacked ${summary.packages.length} package(s) for ${args.appid}`);
  console.log(`Summary: ${summaryPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
