/**
 * Extracted from subpackages/main/game.js.
 * define("subpackages/main/game.js") body.
 */

'use strict';
var e, t;
(System.register('chunks:///_virtual/main', [], function () {
  return { execute: function () {} };
}),
  (e = 'virtual:///prerequisite-imports/main'),
  (t = 'chunks:///_virtual/main'),
  System.register(e, [t], function (e, t) {
    return {
      setters: [
        function (t) {
          var r = {};
          for (var i in t) 'default' !== i && '__esModule' !== i && (r[i] = t[i]);
          e(r);
        }
      ],
      execute: function () {}
    };
  }));
