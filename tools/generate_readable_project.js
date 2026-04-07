"use strict";

const path = require("path");
const { generateReadableProject } = require("./readable_project_tools");

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const runtimeDir = path.join(rootDir, "runnable_wechat_project");
  const outputDir = path.join(rootDir, "readable_project");

  const summary = await generateReadableProject(runtimeDir, outputDir);
  console.log(`Generated readable project at: ${outputDir}`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
