/**
 * Extracted from subpackages/aniBundle/game.js.
 * define("subpackages/aniBundle/game.js") body.
 */

'use strict';
var e, t;
(System.register('chunks:///_virtual/aniBundle', [], function () {
  return { execute: function () {} };
}),
  (e = 'virtual:///prerequisite-imports/aniBundle'),
  (t = 'chunks:///_virtual/aniBundle'),
  System.register(e, [t], function (e, t) {
    return {
      setters: [
        function (t) {
          var n = {};
          for (var u in t) 'default' !== u && '__esModule' !== u && (n[u] = t[u]);
          e(n);
        }
      ],
      execute: function () {}
    };
  }));
