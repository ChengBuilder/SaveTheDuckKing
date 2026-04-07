/**
 * Extracted from subpackages/uiBundle/game.js.
 * define("subpackages/uiBundle/game.js") body.
 */

'use strict';
var e, u;
(System.register('chunks:///_virtual/uiBundle', [], function () {
  return { execute: function () {} };
}),
  (e = 'virtual:///prerequisite-imports/uiBundle'),
  (u = 'chunks:///_virtual/uiBundle'),
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
