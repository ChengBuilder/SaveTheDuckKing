/**
 * Extracted from game.js.
 * Parent define module: subpackages-bootstrap.js
 * System.register("chunks:///_virtual/fruit2.ts")
 */

System.register(
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
);
