/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/Singleton.ts")
 */

System.register('chunks:///_virtual/Singleton.ts', ['cc'], function (e) {
  var t;
  return {
    setters: [
      function (e) {
        t = e.cclegacy;
      }
    ],
    execute: function () {
      (t._RF.push({}, 'db49fGb+xREEaIys56PtfDZ', 'Singleton', void 0),
        (e(
          'default',
          (function () {
            function e() {}
            return (
              (e.getInstance = function () {
                return (null === this._instance && (this._instance = new this()), this._instance);
              }),
              e
            );
          })()
        )._instance = null),
        t._RF.pop());
    }
  };
});
