/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/Set2UIPanelView.ts")
 */

System.register(
  'chunks:///_virtual/Set2UIPanelView.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './GameModel2.ts',
    './GameCtrl.ts',
    './AdManager.ts',
    './AudioManager.ts',
    './DuckController.ts'
  ],
  function (e) {
    var t, n, i, o, r, a, s, l, c, u, d, h, p, f, g, m, v, y, _;
    return {
      setters: [
        function (e) {
          ((t = e.applyDecoratedDescriptor),
            (n = e.inheritsLoose),
            (i = e.initializerDefineProperty),
            (o = e.assertThisInitialized));
        },
        function (e) {
          ((r = e.cclegacy),
            (a = e._decorator),
            (s = e.Node),
            (l = e.tween),
            (c = e.UIOpacity),
            (u = e.v3),
            (d = e.find),
            (h = e.Label),
            (p = e.director),
            (f = e.Component));
        },
        function (e) {
          g = e.GameModel;
        },
        function (e) {
          m = e.GameCtrl;
        },
        function (e) {
          v = e.AdManager;
        },
        function (e) {
          y = e.AudioManager;
        },
        function (e) {
          _ = e.DuckController;
        }
      ],
      execute: function () {
        var b, S, C, w, N, k, T, B, A, P, M, I, F;
        r._RF.push({}, '20e2cAqXPpOcIepzmZGluya', 'Set2UIPanelView', void 0);
        var R = a.ccclass,
          L = a.property;
        (e(
          'Set2UIPanelView',
          ((b = R('Set2UIPanelView')),
          (S = L(s)),
          (C = L(s)),
          (w = L(s)),
          (N = L(s)),
          (k = L(s)),
          b(
            ((A = t(
              (B = (function (e) {
                function t() {
                  for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
                    r[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(r)) || this),
                    i(t, 'closeBtn', A, o(t)),
                    i(t, 'tryBtn', P, o(t)),
                    i(t, 'labelNode', M, o(t)),
                    i(t, 'black', I, o(t)),
                    i(t, 'panel', F, o(t)),
                    t
                  );
                }
                n(t, e);
                var r = t.prototype;
                return (
                  (r.onLoad = function () {
                    (this.initPanel(), this.black.on(s.EventType.TOUCH_END, this.tryBack, this));
                  }),
                  (r.start = function () {
                    ((m.instance.canTouch = !1),
                      l(this.black.getComponent(c)).to(0.1, { opacity: 220 }).start(),
                      l(this.panel)
                        .delay(0.1)
                        .to(0.3, { position: u(0, 0, 0) }, { easing: 'backOut' })
                        .call(function () {
                          m.instance.btnCanTouch = !0;
                        })
                        .start());
                  }),
                  (r.initPanel = function () {
                    ((this.black.getComponent(c).opacity = 0),
                      this.panel.setPosition(0, g.instance.screenHeight),
                      this.panel.setScale(1, 1, 1));
                    var e = d('Canvas').getComponent(_),
                      t = Math.floor((e.popNum / e.nailNum) * 100);
                    this.labelNode.getComponent(h).string = '' + t;
                  }),
                  (r.tryBack = function () {
                    (y.instance.playSound('click'),
                      (m.instance.canTouch = !0),
                      (m.instance.btnCanTouch = !0),
                      this.black.off(s.EventType.TOUCH_END, this.tryBack, this),
                      this.node.destroy());
                  }),
                  (r.HomeBack = function () {
                    (y.instance.playSound('click'),
                      v.stopGyroscope(),
                      p.loadScene(g.instance.HomeSceneName));
                  }),
                  (r.onDestroy = function () {}),
                  t
                );
              })(f)).prototype,
              'closeBtn',
              [S],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                }
              }
            )),
            (P = t(B.prototype, 'tryBtn', [C], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (M = t(B.prototype, 'labelNode', [w], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (I = t(B.prototype, 'black', [N], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (F = t(B.prototype, 'panel', [k], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (T = B))
          ) || T)
        ),
          r._RF.pop());
      }
    };
  }
);
