/**
 * Extracted from subpackages/Game2Bundle/game.js.
 * define("subpackages/Game2Bundle/game.js") body.
 */

'use strict';
var t, e;
(System.register(
  'chunks:///_virtual/fruit2.ts',
  ['./rollupPluginModLoBabelHelpers.js', 'cc'],
  function (t) {
    var e, r, u, n;
    return {
      setters: [
        function (t) {
          e = t.inheritsLoose;
        },
        function (t) {
          ((r = t.cclegacy), (u = t._decorator), (n = t.Component));
        }
      ],
      execute: function () {
        var i;
        r._RF.push({}, '2fd1aGtpKVOF4gwqe0Is37a', 'fruit', void 0);
        var s = u.ccclass;
        (u.property,
          t(
            'fruit',
            s('fruit')(
              (i = (function (t) {
                function r() {
                  return t.apply(this, arguments) || this;
                }
                e(r, t);
                var u = r.prototype;
                return ((u.start = function () {}), (u.update = function (t) {}), r);
              })(n))
            ) || i
          ),
          r._RF.pop());
      }
    };
  }
),
  System.register('chunks:///_virtual/Game2Bundle', ['./fruit2.ts'], function () {
    return { setters: [null], execute: function () {} };
  }),
  (t = 'virtual:///prerequisite-imports/Game2Bundle'),
  (e = 'chunks:///_virtual/Game2Bundle'),
  System.register(t, [e], function (t, e) {
    return {
      setters: [
        function (e) {
          var r = {};
          for (var u in e) 'default' !== u && '__esModule' !== u && (r[u] = e[u]);
          t(r);
        }
      ],
      execute: function () {}
    };
  }));
