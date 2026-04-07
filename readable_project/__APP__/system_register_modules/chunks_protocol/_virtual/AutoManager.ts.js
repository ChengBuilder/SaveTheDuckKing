/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/AutoManager.ts")
 */

System.register(
  'chunks:///_virtual/AutoManager.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './DuckController.ts',
    './Nail.ts',
    './Wood.ts',
    './GameCtrl.ts',
    './Util.ts'
  ],
  function (e) {
    var t, n, i, o, r, a, s, l, c, u, d;
    return {
      setters: [
        function (e) {
          ((t = e.inheritsLoose), (n = e.createClass));
        },
        function (e) {
          ((i = e.cclegacy), (o = e._decorator), (r = e.find), (a = e.Component));
        },
        function (e) {
          s = e.DuckController;
        },
        function (e) {
          l = e.Nail;
        },
        function (e) {
          c = e.Wood;
        },
        function (e) {
          u = e.GameCtrl;
        },
        function (e) {
          d = e.Util;
        }
      ],
      execute: function () {
        var h, p;
        i._RF.push({}, '79d7bkRGTRGU4jbM+ZzgZaj', 'AutoManager', void 0);
        var f = o.ccclass;
        (o.property,
          e(
            'AutoManager',
            f('AutoManager')(
              (((p = (function (e) {
                function i() {
                  var t;
                  return (
                    ((t = e.call(this) || this).MainGameTS = null),
                    (t.isAuto = !1),
                    (t.propTime = 0),
                    t
                  );
                }
                t(i, e);
                var o = i.prototype;
                return (
                  (o.start = function () {
                    ((this.propTime = 0), (this.MainGameTS = r('Canvas').getComponent(s)));
                  }),
                  (o.AutoGetNail = function () {
                    var e = this;
                    if (!u.instance.gameIsOver && this.isAuto)
                      if (u.instance.canTouch) {
                        var t = null;
                        if (0 == this.MainGameTS.DeleteGridArr.length) {
                          var n = this.GetOneCanTouchNail();
                          n && (t = n);
                        } else if (
                          this.MainGameTS.DeleteGridArr.length <= this.MainGameTS.maxLenGridNum
                        ) {
                          var i = this.GetSameColorNail();
                          if (i) t = i;
                          else if (this.propTime > 5) {
                            var o = this.GetOneCanTouchNail();
                            o && (t = o);
                          } else if (
                            this.MainGameTS.DeleteGridArr.length < this.MainGameTS.maxLenGridNum
                          ) {
                            var r = this.GetOneCanTouchNail();
                            r && (t = r);
                          }
                        }
                        if (t) ((this.propTime = 0), this.MainGameTS.touchNail(t));
                        else {
                          this.propTime++;
                          var a = d.getRandomNum(0, 1, !0);
                          ((a = 1),
                            this.CheckSameColorNail() || (a = 0),
                            this.MainGameTS.onPropClick(null, a.toString()));
                        }
                        this.scheduleOnce(function () {
                          e.AutoGetNail();
                        }, 2);
                      } else
                        this.scheduleOnce(function () {
                          e.AutoGetNail();
                        }, 2);
                  }),
                  (o.CheckSameColorNail = function () {
                    for (
                      var e =
                          this.MainGameTS.DeleteGridArr[
                            this.MainGameTS.DeleteGridArr.length - 1
                          ].getComponent(l).type,
                        t = this.GetAllNail(),
                        n = t.length - 1;
                      n >= 0;
                      n--
                    ) {
                      var i = t[n];
                      if (i.getComponent(l).type == e && !i.getComponent(l).isIceLock) return !0;
                    }
                    return !1;
                  }),
                  (o.GetAllNail = function () {
                    for (var e = this.MainGameTS.woodArr, t = [], n = 0; n < e.length; n++)
                      if (e[n])
                        for (var i = 0; i < e[n].getComponent(c).nailArr.length; i++)
                          e[n].getComponent(c).nailArr[i] &&
                            t.push(e[n].getComponent(c).nailArr[i]);
                    return t;
                  }),
                  (o.GetOneCanTouchNail = function () {
                    this.MainGameTS.woodArr;
                    for (var e, t = null, n = (e = this.GetAllNail()).length - 1; n >= 0; n--) {
                      var i = e[n];
                      if (this.MainGameTS.checkCanTouch(i) && !i.getComponent(l).isIceLock) {
                        t = i;
                        break;
                      }
                    }
                    return t;
                  }),
                  (o.GetSameColorNail = function () {
                    for (
                      var e = null,
                        t =
                          this.MainGameTS.DeleteGridArr[
                            this.MainGameTS.DeleteGridArr.length - 1
                          ].getComponent(l).type,
                        n = this.GetAllNail(),
                        i = n.length - 1;
                      i >= 0;
                      i--
                    ) {
                      var o = n[i];
                      if (
                        o.getComponent(l).type == t &&
                        this.MainGameTS.checkCanTouch(o) &&
                        !o.getComponent(l).isIceLock
                      ) {
                        e = o;
                        break;
                      }
                    }
                    return e;
                  }),
                  (o.update = function (e) {}),
                  n(i, null, [
                    {
                      key: '_ins',
                      get: function () {
                        return this._instance;
                      }
                    }
                  ]),
                  i
                );
              })(a))._instance = new p()),
              (h = p))
            ) || h
          ),
          i._RF.pop());
      }
    };
  }
);
