/**
 * Extracted from game.js.
 * define("game.js") body.
 */

'use strict';
function e() {
  ((globalThis.__wxRequire = require), require('./web-adapter'));
  var e = require('./first-screen');
  (require('src/polyfills.bundle.43263.js'),
    require('src/system.bundle.f45da.js'),
    require('subpackages-bootstrap.js'));
  var n = wx.getSystemInfoSync();
  if (canvas) {
    var t = canvas.width,
      r = canvas.height;
    (n.screenWidth < n.screenHeight
      ? canvas.width > canvas.height && ((t = canvas.height), (r = canvas.width))
      : canvas.width < canvas.height && ((t = canvas.height), (r = canvas.width)),
      (canvas.width = t),
      (canvas.height = r));
  }
  canvas &&
    window.devicePixelRatio >= 2 &&
    ((canvas.width *= n.devicePixelRatio), (canvas.height *= n.devicePixelRatio));
  var i = require('src/import-map.ae243.js').default;
  (System.warmup({
    importMap: i,
    importMapUrl: 'src/import-map.ae243.js',
    defaultHandler: function (e) {
      require('.' + e);
    },
    handlers: {
      'plugin:': function (e) {
        requirePlugin(e);
      },
      'project:': function (e) {
        require(e);
      }
    }
  }),
    e
      .start('default', 'default', 'false')
      .then(function () {
        return System.import('./application.67fff.js');
      })
      .then(function (n) {
        return e.setProgress(0.2).then(function () {
          return Promise.resolve(n);
        });
      })
      .then(function (e) {
        return new (0, e.Application)();
      })
      .then(function (n) {
        return e.setProgress(0.4).then(function () {
          return Promise.resolve(n);
        });
      })
      .then(function (n) {
        return (function (n) {
          return System.import('cc')
            .then(function (n) {
              return e.setProgress(0.6).then(function () {
                return Promise.resolve(n);
              });
            })
            .then(function (e) {
              return (require('./engine-adapter'), n.init(e));
            })
            .then(function () {
              return e.end().then(function () {
                return n.start();
              });
            });
        })(n);
      })
      .catch(function (e) {
        console.error(e);
      }));
}
'android' === wx.getSystemInfoSync().platform.toLocaleLowerCase()
  ? GameGlobal.requestAnimationFrame(e)
  : e();
