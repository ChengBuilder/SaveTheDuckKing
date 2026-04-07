/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/SubscribePanelView.ts")
 */

System.register(
  'chunks:///_virtual/SubscribePanelView.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './AudioManager.ts',
    './GameModel2.ts',
    './ResManager.ts',
    './GameCtrl.ts',
    './Enum.ts',
    './ReceivePanelView.ts',
    './ConfigTable.ts',
    './TooYueManager.ts',
    './AdManager_ZJ.ts',
    './ServiceManager.ts'
  ],
  function (e) {
    var t, n, o, r, a, s, l, c, u, d, h, p, f, g, m, v, y, _, b, S, C, w, N, k, T, B, A, P, M;
    return {
      setters: [
        function (e) {
          ((t = e.applyDecoratedDescriptor),
            (n = e.inheritsLoose),
            (o = e.initializerDefineProperty),
            (r = e.assertThisInitialized),
            (a = e.asyncToGenerator));
        },
        function (e) {
          ((s = e.cclegacy),
            (l = e._decorator),
            (c = e.Node),
            (u = e.Button),
            (d = e.SpriteFrame),
            (h = e.tween),
            (p = e.UIOpacity),
            (f = e.v3),
            (g = e.assetManager),
            (m = e.Prefab),
            (v = e.Sprite),
            (y = e.Component),
            (_ = e.find),
            (b = e.instantiate));
        },
        function (e) {
          S = e.AudioManager;
        },
        function (e) {
          C = e.GameModel;
        },
        function (e) {
          w = e.ResManager;
        },
        function (e) {
          N = e.GameCtrl;
        },
        function (e) {
          k = e.releaseType;
        },
        function (e) {
          T = e.ReceivePanelView;
        },
        function (e) {
          B = e.UIConfigTable;
        },
        function (e) {
          A = e.TooYueManager;
        },
        function (e) {
          P = e.AdManager_ZJ;
        },
        function (e) {
          M = e.default;
        }
      ],
      execute: function () {
        var I, F, R, L, x, D, G, E, O, H, V, U, z, W, j;
        s._RF.push({}, '9d2a0sKg81KCayI7ESgEIYl', 'SubscribePanelView', void 0);
        var J = l.ccclass,
          Y = l.property;
        (e(
          'SubscribePanelView',
          ((I = J('SubscribePanelView')),
          (F = Y(c)),
          (R = Y(c)),
          (L = Y(u)),
          (x = Y(u)),
          (D = Y([d])),
          (G = Y([d])),
          I(
            ((H = t(
              (O = (function (e) {
                function t() {
                  for (var t, n = arguments.length, i = new Array(n), a = 0; a < n; a++)
                    i[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(i)) || this),
                    o(t, 'black', H, r(t)),
                    o(t, 'panel', V, r(t)),
                    o(t, 'closeBtn', U, r(t)),
                    o(t, 'receiveBtn', z, r(t)),
                    o(t, 'btnSpriteFrame', W, r(t)),
                    o(t, 'btnWordSpriteFrame', j, r(t)),
                    (t.model = null),
                    t
                  );
                }
                n(t, e);
                var s = t.prototype;
                return (
                  (s.onLoad = function () {
                    this.initPanel();
                  }),
                  (s.start = function () {
                    (h(this.black.getComponent(p)).to(0.1, { opacity: 220 }).start(),
                      h(this.panel)
                        .delay(0.1)
                        .to(0.3, { position: f(0, 0, 0) }, { easing: 'backOut' })
                        .call(function () {
                          N.instance.btnCanTouch = !0;
                        })
                        .start());
                  }),
                  (s.onEnable = function () {
                    this.registerEvents();
                  }),
                  (s.onDisable = function () {
                    (this.unregisterEvents(),
                      g.getBundle('uiBundle').release(B.AddTableUI.path, m));
                  }),
                  (s.initPanel = function () {
                    ((this.black.getComponent(p).opacity = 0),
                      this.panel.setPosition(0, C.instance.screenHeight),
                      this.panel.setScale(1, 1, 1));
                  }),
                  (s.setPanel = function (e) {
                    ((this.model = e),
                      (this.receiveBtn.node.getComponent(v).spriteFrame = this.btnSpriteFrame[e]));
                  }),
                  (s.registerEvents = function () {
                    (this.receiveBtn.node.on('click', this.onReceive, this),
                      this.closeBtn.node.on('click', this.onClose, this));
                  }),
                  (s.unregisterEvents = function () {
                    (this.receiveBtn.node.off('click', this.onReceive, this),
                      this.closeBtn.node.off('click', this.onClose, this));
                  }),
                  (s.onClose = function () {
                    var e = this;
                    N.instance.btnCanTouch &&
                      ((N.instance.btnCanTouch = !1),
                      S.instance.playSound('click'),
                      h(this.panel)
                        .to(
                          0.3,
                          { position: f(0, C.instance.screenHeight, 0) },
                          { easing: 'backIn' }
                        )
                        .start(),
                      h(this.black.getComponent(p))
                        .delay(0.3)
                        .to(0.1, { opacity: 0 })
                        .call(function () {
                          (e.node.destroy(), (N.instance.btnCanTouch = !0));
                        })
                        .start());
                  }),
                  (s.onReceive = function () {
                    var e = this;
                    N.instance.btnCanTouch &&
                      ((this.receiveBtn.interactable = !1),
                      (N.instance.btnCanTouch = !1),
                      S.instance.playSound('click'),
                      h(this.panel)
                        .to(
                          0.3,
                          { position: f(0, C.instance.screenHeight, 0) },
                          { easing: 'backIn' }
                        )
                        .start(),
                      h(this.black.getComponent(p))
                        .delay(0.3)
                        .to(0.1, { opacity: 0 })
                        .call(function () {
                          e.node.destroy();
                        })
                        .start(),
                      C.instance.releaseType == k.applet_ziJie &&
                        P._ins.feedSubscribe(this.addFinishBack, this.addFailBack));
                  }),
                  (s.addFinishBack = (function () {
                    var e = a(
                      i().mark(function e() {
                        return i().wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                A.feedSubscribeStatus
                                  ? (N.instance.btnCanTouch = !0)
                                  : ((_('Canvas/subscribeBtn/奖').active = !1),
                                    (_('Canvas/subscribeBtn').active = !1),
                                    (C.instance.isAlreadyFeed = 1),
                                    M.instance.setStorageToServer(),
                                    w.instance.bundleLoad(
                                      'uiBundle',
                                      B.ReceiveUI.path,
                                      null,
                                      function (e, t) {
                                        if (e)
                                          return (
                                            console.log(e),
                                            void (N.instance.btnCanTouch = !0)
                                          );
                                        var n = b(t);
                                        ((n.parent = _('Canvas')), n.getComponent(T).setPanel(1));
                                      }
                                    ));
                              case 1:
                              case 'end':
                                return e.stop();
                            }
                        }, e);
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (s.addFailBack = function () {
                    N.instance.btnCanTouch = !0;
                  }),
                  t
                );
              })(y)).prototype,
              'black',
              [F],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                }
              }
            )),
            (V = t(O.prototype, 'panel', [R], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (U = t(O.prototype, 'closeBtn', [L], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (z = t(O.prototype, 'receiveBtn', [x], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (W = t(O.prototype, 'btnSpriteFrame', [D], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return [];
              }
            })),
            (j = t(O.prototype, 'btnWordSpriteFrame', [G], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return [];
              }
            })),
            (E = O))
          ) || E)
        ),
          s._RF.pop());
      }
    };
  }
);
