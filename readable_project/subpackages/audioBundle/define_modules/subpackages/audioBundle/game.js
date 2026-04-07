/**
 * Extracted from subpackages/audioBundle/game.js.
 * define("subpackages/audioBundle/game.js") body.
 */

'use strict';
var e, u;
(System.register('chunks:///_virtual/audioBundle', [], function () {
  return { execute: function () {} };
}),
  (e = 'virtual:///prerequisite-imports/audioBundle'),
  (u = 'chunks:///_virtual/audioBundle'),
  System.register(e, [u], function (e, u) {
    return {
      setters: [
        function (u) {
          var t = {};
          for (var r in u) 'default' !== r && '__esModule' !== r && (t[r] = u[r]);
          e(t);
        }
      ],
      execute: function () {}
    };
  }));
