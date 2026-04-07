/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/MoreGamePanelView.ts")
 */

System.register(
  'chunks:///_virtual/MoreGamePanelView.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './AudioManager.ts',
    './GameModel2.ts',
    './GameCtrl.ts',
    './ConfigTable.ts'
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
            (l = e.Button),
            (c = e.tween),
            (u = e.UIOpacity),
            (d = e.v3),
            (h = e.assetManager),
            (p = e.Prefab),
            (f = e.director),
            (g = e.Component));
        },
        function (e) {
          m = e.AudioManager;
        },
        function (e) {
          v = e.GameModel;
        },
        function (e) {
          y = e.GameCtrl;
        },
        function (e) {
          _ = e.UIConfigTable;
        }
      ],
      execute: function () {
        var b, S, C, w, N, k, T, B, A, P, M, I, F, R, L;
        r._RF.push({}, 'ca237WsrkdLw6XD3c0mXDW8', 'MoreGamePanelView', void 0);
        var x = a.ccclass,
          D = a.property;
        (e(
          'MoreGamePanelView',
          ((b = x('MoreGamePanelView')),
          (S = D(s)),
          (C = D(s)),
          (w = D(l)),
          (N = D(s)),
          (k = D(s)),
          (T = D(s)),
          b(
            ((P = t(
              (A = (function (e) {
                function t() {
                  for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
                    r[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(r)) || this),
                    i(t, 'black', P, o(t)),
                    i(t, 'panel', M, o(t)),
                    i(t, 'closeBtn', I, o(t)),
                    i(t, 'pigeonBtn', F, o(t)),
                    i(t, 'cowBtn', R, o(t)),
                    i(t, 'mathBtn', L, o(t)),
                    (t.levelArr = [5, 9, 14]),
                    t
                  );
                }
                n(t, e);
                var r = t.prototype;
                return (
                  (r.onLoad = function () {
                    this.initPanel();
                  }),
                  (r.start = function () {
                    (c(this.black.getComponent(u)).to(0.1, { opacity: 220 }).start(),
                      c(this.panel)
                        .delay(0.1)
                        .to(0.3, { position: d(0, 0, 0) }, { easing: 'backOut' })
                        .call(function () {
                          y.instance.btnCanTouch = !0;
                        })
                        .start());
                  }),
                  (r.onEnable = function () {
                    this.registerEvents();
                  }),
                  (r.onDisable = function () {
                    (this.unregisterEvents(),
                      h.getBundle('uiBundle').release(_.MoreGamePanelUI.path, p));
                  }),
                  (r.initPanel = function () {
                    ((this.black.getComponent(u).opacity = 0),
                      this.panel.setPosition(0, v.instance.screenHeight),
                      this.panel.setScale(1, 1, 1),
                      this.lockBtn());
                  }),
                  (r.lockBtn = function () {
                    (v.instance.level >= this.levelArr[0] &&
                      ((this.pigeonBtn.getChildByName('按钮').active = !1),
                      (this.pigeonBtn.getChildByName('black').active = !1),
                      console.log(v.instance.pigeonGameTouched),
                      0 == v.instance.pigeonGameTouched &&
                        (this.pigeonBtn.getChildByName('叹号更多玩法').active = !0)),
                      v.instance.level >= this.levelArr[1] &&
                        ((this.cowBtn.getChildByName('按钮').active = !1),
                        (this.cowBtn.getChildByName('black').active = !1),
                        0 == v.instance.cowGameTouched &&
                          (this.cowBtn.getChildByName('叹号更多玩法').active = !0)),
                      v.instance.level >= this.levelArr[2] &&
                        ((this.mathBtn.getChildByName('按钮').active = !1),
                        (this.mathBtn.getChildByName('black').active = !1),
                        0 == v.instance.mathGameTouched &&
                          (this.mathBtn.getChildByName('叹号更多玩法').active = !0)));
                  }),
                  (r.pigeonBtnClick = function () {
                    v.instance.level < this.levelArr[0] ||
                      (0 == v.instance.pigeonGameTouched && (v.instance.pigeonGameTouched = 1),
                      m.instance.playSound('click'),
                      f.loadScene(v.instance.PigeonSceneName));
                  }),
                  (r.cowBtnClick = function () {
                    v.instance.level < this.levelArr[1] ||
                      (0 == v.instance.cowGameTouched && (v.instance.cowGameTouched = 1),
                      m.instance.playSound('click'),
                      f.loadScene(v.instance.CowSceneName));
                  }),
                  (r.mathBtnClick = function () {
                    v.instance.level < this.levelArr[2] ||
                      (0 == v.instance.mathGameTouched && (v.instance.mathGameTouched = 1),
                      m.instance.playSound('click'),
                      f.loadScene(v.instance.MathSceneName));
                  }),
                  (r.registerEvents = function () {
                    (this.pigeonBtn.on('click', this.pigeonBtnClick, this),
                      this.cowBtn.on('click', this.cowBtnClick, this),
                      this.mathBtn.on('click', this.mathBtnClick, this),
                      this.closeBtn.node.on('click', this.onClose, this));
                  }),
                  (r.unregisterEvents = function () {
                    (this.pigeonBtn.off('click', this.pigeonBtnClick, this),
                      this.cowBtn.off('click', this.cowBtnClick, this),
                      this.mathBtn.off('click', this.mathBtnClick, this),
                      this.closeBtn.node.off('click', this.onClose, this));
                  }),
                  (r.onClose = function () {
                    var e = this;
                    y.instance.btnCanTouch &&
                      ((y.instance.btnCanTouch = !1),
                      m.instance.playSound('click'),
                      c(this.panel)
                        .to(
                          0.3,
                          { position: d(0, v.instance.screenHeight, 0) },
                          { easing: 'backIn' }
                        )
                        .start(),
                      c(this.black.getComponent(u))
                        .delay(0.3)
                        .to(0.1, { opacity: 0 })
                        .call(function () {
                          (e.node.destroy(), (y.instance.btnCanTouch = !0));
                        })
                        .start());
                  }),
                  t
                );
              })(g)).prototype,
              'black',
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
            (M = t(A.prototype, 'panel', [C], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (I = t(A.prototype, 'closeBtn', [w], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (F = t(A.prototype, 'pigeonBtn', [N], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (R = t(A.prototype, 'cowBtn', [k], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (L = t(A.prototype, 'mathBtn', [T], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (B = A))
          ) || B)
        ),
          r._RF.pop());
      }
    };
  }
);
