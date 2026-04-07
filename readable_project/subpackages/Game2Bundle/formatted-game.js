var global = (function () {
  return this;
})();
if (!global && typeof GameGlobal !== 'undefined') global = GameGlobal;
var pluginInfoMap = {};
global.requirePlugin =
  global.requirePlugin ||
  function (path) {
    var position = path.indexOf('/');
    var alias = '';
    var pagePath = '';
    if (position !== -1) {
      alias = path.substr(0, position);
      pagePath = path.substr(position + 1, path.length);
    } else {
      alias = path;
    }
    if (pluginInfoMap.hasOwnProperty(alias)) {
      var realPath = '';
      if (pagePath.length === 0) {
        realPath = '__plugin__/' + pluginInfoMap[alias].appid;
        return require(realPath);
      } else {
        realPath = '__plugin__/' + pluginInfoMap[alias].appid + '/' + pagePath;
        return require(realPath);
      }
    } else {
      console.error('not found alias: ', alias);
      throw new Error('Plugin ' + alias + ' is not defined.');
    }
  };
define('subpackages/Game2Bundle/game.js', function (require, module, exports) {
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
});
require('subpackages/Game2Bundle/game.js');
