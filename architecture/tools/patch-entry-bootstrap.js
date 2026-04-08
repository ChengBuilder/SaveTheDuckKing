'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 把打包产物中的压缩启动入口替换为可维护的架构入口。
 * 这样后续启动逻辑统一在 architecture/boot/game-bootstrap.js 维护。
 */
function patchEntryBootstrap() {
  const gamePath = path.resolve(__dirname, '..', '..', 'game.js');
  const source = fs.readFileSync(gamePath, 'utf8');

  const entryStart = 'define("game.js", function(require, module, exports){';
  const subpackageStart = 'define("subpackages-bootstrap.js", function(require, module, exports){';

  const startIndex = source.indexOf(entryStart);
  const nextIndex = source.indexOf(subpackageStart);

  if (startIndex === -1 || nextIndex === -1 || nextIndex <= startIndex) {
    throw new Error('未找到可替换的入口区块，请确认 game.js 结构未变化。');
  }

  const replacement = [
    'define("game.js", function(require, module, exports){',
    '"use strict";',
    'var bootModule = require("./architecture/boot/game-bootstrap.js");',
    'bootModule.bootGameRuntime(require); ',
    '\t\t\t}); \t'
  ].join('\n');

  const patched = source.slice(0, startIndex) + replacement + source.slice(nextIndex);
  fs.writeFileSync(gamePath, patched);

  console.log('[patch-entry-bootstrap] patched:', gamePath);
}

patchEntryBootstrap();

