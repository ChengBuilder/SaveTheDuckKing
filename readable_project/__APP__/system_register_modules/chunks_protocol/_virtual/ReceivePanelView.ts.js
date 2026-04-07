/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/ReceivePanelView.ts")
 */

System.register(
  'chunks:///_virtual/ReceivePanelView.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './AudioManager.ts',
    './GameModel2.ts',
    './GameCtrl.ts',
    './Enum.ts',
    './Util.ts'
  ],
  function (e) {
    var t, n, i, o, r, a, s, l, c, u, d, h, p, f, g, m, v, y, _, b, S, C, w;
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
            (c = e.SpriteFrame),
            (u = e.v3),
            (d = e.tween),
            (h = e.UIOpacity),
            (p = e.Sprite),
            (f = e.UITransform),
            (g = e.Label),
            (m = e.Color),
            (v = e.HorizontalTextAlignment),
            (y = e.Component));
        },
        function (e) {
          _ = e.AudioManager;
        },
        function (e) {
          b = e.GameModel;
        },
        function (e) {
          S = e.GameCtrl;
        },
        function (e) {
          C = e.PROP_TYPE;
        },
        function (e) {
          w = e.Util;
        }
      ],
      execute: function () {
        var N, k, T, B, A, P, M, I, F, R, L, x, D, G, E, O, H;
        r._RF.push({}, 'bd8ef5IcKZAW6EbHxFJrbaO', 'ReceivePanelView', void 0);
        var V = a.ccclass,
          U = a.property;
        (e(
          'ReceivePanelView',
          ((N = V('ReceivePanelView')),
          (k = U(s)),
          (T = U(s)),
          (B = U(l)),
          (A = U(s)),
          (P = U(s)),
          (M = U([c])),
          (I = U([c])),
          N(
            ((L = t(
              (R = (function (e) {
                function t() {
                  for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
                    r[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(r)) || this),
                    i(t, 'black', L, o(t)),
                    i(t, 'panel', x, o(t)),
                    i(t, 'sureBtn', D, o(t)),
                    i(t, 'wordSpr', G, o(t)),
                    i(t, 'propSpr', E, o(t)),
                    (t.propType = null),
                    i(t, 'wordSpriteFrame', O, o(t)),
                    i(t, 'propSpriteFrame', H, o(t)),
                    (t.isShareFriendRewardMode = !1),
                    (t.shareDuckSpriteNode = null),
                    (t.shareDuckNameNode = null),
                    (t.sharePropCountNode = null),
                    (t.propSprDefaultPosition = u()),
                    (t.shareRewardPairOffsetX = 120),
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
                    (d(this.black.getComponent(h)).to(0.1, { opacity: 220 }).start(),
                      d(this.panel)
                        .delay(0.1)
                        .to(0.3, { position: u(0, 0, 0) }, { easing: 'backOut' })
                        .call(function () {
                          S.instance.btnCanTouch = !0;
                        })
                        .start());
                  }),
                  (r.onEnable = function () {
                    this.registerEvents();
                  }),
                  (r.onDisable = function () {
                    this.unregisterEvents();
                  }),
                  (r.initPanel = function () {
                    ((this.black.getComponent(h).opacity = 0),
                      this.panel.setPosition(0, b.instance.screenHeight),
                      this.panel.setScale(1, 1, 1),
                      (this.propSprDefaultPosition = this.propSpr.position.clone()));
                  }),
                  (r.setPanel = function (e) {
                    ((this.isShareFriendRewardMode = !1),
                      this.resetShareFriendRewardLayout(),
                      (this.propType = w.getRandomNum(0, 1, !0)),
                      (this.wordSpr.getComponent(p).spriteFrame = this.wordSpriteFrame[e]),
                      (this.propSpr.getComponent(p).spriteFrame =
                        this.propSpriteFrame[this.propType]));
                  }),
                  (r.setShareFriendRewardPanel = function (e, t) {
                    ((this.isShareFriendRewardMode = !0),
                      (this.propType = null),
                      this.resetShareFriendRewardLayout(),
                      (this.wordSpr.getComponent(p).spriteFrame = this.wordSpriteFrame[2] || null),
                      (this.wordSpr.active = !0),
                      this.showShareFriendRewardLayout(e, t));
                  }),
                  (r.registerEvents = function () {
                    this.sureBtn.node.on('click', this.onSure, this);
                  }),
                  (r.unregisterEvents = function () {
                    this.sureBtn.node.off('click', this.onSure, this);
                  }),
                  (r.onSure = function () {
                    if (S.instance.btnCanTouch) {
                      if (
                        ((S.instance.btnCanTouch = !1),
                        _.instance.playSound('click'),
                        !this.isShareFriendRewardMode)
                      )
                        switch (this.propType) {
                          case C.PROP1:
                            b.instance.freeProp1Num = b.instance.freeProp1Num + 1;
                            break;
                          case C.PROP2:
                            b.instance.freeProp2Num = b.instance.freeProp2Num + 1;
                            break;
                          case C.PROP3:
                            b.instance.freeProp3Num = b.instance.freeProp3Num + 1;
                        }
                      this.closePanel();
                    }
                  }),
                  (r.closePanel = function () {
                    var e = this;
                    (d(this.panel)
                      .to(0.3, { position: u(0, b.instance.screenHeight, 0) }, { easing: 'backIn' })
                      .start(),
                      d(this.black.getComponent(h))
                        .delay(0.3)
                        .to(0.1, { opacity: 0 })
                        .call(function () {
                          ((S.instance.btnCanTouch = !0),
                            e.cleanupRewardSpritesBeforeDestroy(),
                            e.node.destroy());
                        })
                        .start());
                  }),
                  (r.cleanupRewardSpritesBeforeDestroy = function () {
                    ((this.wordSpr.getComponent(p).spriteFrame = null),
                      (this.propSpr.getComponent(p).spriteFrame = null),
                      this.shareDuckSpriteNode &&
                        (this.shareDuckSpriteNode.getComponent(p).spriteFrame = null));
                  }),
                  (r.showShareFriendRewardLayout = function (e, t) {
                    this.ensureShareFriendRewardNodes();
                    var n = Boolean(e.duckName),
                      i = this.propSpr.getChildByName('redSpr');
                    (i && (i.active = !1),
                      this.propSpr.setPosition(
                        n ? u(this.shareRewardPairOffsetX, 40, 0) : this.propSprDefaultPosition
                      ),
                      this.updateShareFriendPropSprite(),
                      this.updateShareFriendPropCountLabel(e.propRewardCount, n),
                      this.updateShareFriendDuckDisplay(e.duckName, t, n));
                  }),
                  (r.ensureShareFriendRewardNodes = function () {
                    if (
                      (this.shareDuckSpriteNode ||
                        ((this.shareDuckSpriteNode = new s('shareDuckSprite')),
                        this.shareDuckSpriteNode.setParent(this.panel),
                        this.shareDuckSpriteNode.setPosition(
                          u(-this.shareRewardPairOffsetX, 40, 0)
                        ),
                        this.shareDuckSpriteNode.addComponent(f).setContentSize(153, 168),
                        (this.shareDuckSpriteNode.addComponent(p).sizeMode = p.SizeMode.TRIMMED),
                        (this.shareDuckSpriteNode.active = !1)),
                      !this.shareDuckNameNode)
                    ) {
                      ((this.shareDuckNameNode = new s('shareDuckName')),
                        this.shareDuckNameNode.setParent(this.panel),
                        this.shareDuckNameNode.setPosition(
                          u(-this.shareRewardPairOffsetX, -110, 0)
                        ),
                        this.shareDuckNameNode.addComponent(f).setContentSize(240, 50));
                      var e = this.shareDuckNameNode.addComponent(g);
                      (this.applyShareFriendRewardLabelStyle(e, 28),
                        (this.shareDuckNameNode.active = !1));
                    }
                    if (!this.sharePropCountNode) {
                      ((this.sharePropCountNode = new s('sharePropCount')),
                        this.sharePropCountNode.setParent(this.panel),
                        this.sharePropCountNode.addComponent(f).setContentSize(260, 60));
                      var t = this.sharePropCountNode.addComponent(g);
                      (this.applyShareFriendRewardLabelStyle(t, 30),
                        (this.sharePropCountNode.active = !1));
                    }
                  }),
                  (r.applyShareFriendRewardLabelStyle = function (e, t) {
                    ((e.fontSize = t),
                      (e.lineHeight = t + 10),
                      (e.color = m.WHITE),
                      (e.horizontalAlign = v.CENTER),
                      (e.isBold = !1),
                      (e.enableOutline = !0),
                      (e.outlineColor = m.BLACK),
                      (e.outlineWidth = 5));
                  }),
                  (r.updateShareFriendPropSprite = function () {
                    ((this.propSpr.getComponent(p).spriteFrame = this.propSpriteFrame[2] || null),
                      (this.propSpr.active = !0));
                  }),
                  (r.updateShareFriendPropCountLabel = function (e, t) {
                    this.sharePropCountNode &&
                      ((this.sharePropCountNode.active = !0),
                      this.sharePropCountNode.setPosition(
                        u(t ? this.shareRewardPairOffsetX + 30 : 0, -110, 0)
                      ),
                      (this.sharePropCountNode.getComponent(g).string = '随机道具x' + e));
                  }),
                  (r.updateShareFriendDuckDisplay = function (e, t, n) {
                    if (this.shareDuckSpriteNode && this.shareDuckNameNode) {
                      if (!n || !e || !t)
                        return (
                          (this.shareDuckSpriteNode.active = !1),
                          void (this.shareDuckNameNode.active = !1)
                        );
                      ((this.shareDuckSpriteNode.getComponent(p).spriteFrame = t),
                        (this.shareDuckSpriteNode.active = !0),
                        (this.shareDuckNameNode.active = !0),
                        (this.shareDuckNameNode.getComponent(g).string = e));
                    }
                  }),
                  (r.resetShareFriendRewardLayout = function () {
                    (this.propSpr.setPosition(this.propSprDefaultPosition),
                      (this.propSpr.active = !0));
                    var e = this.propSpr.getChildByName('redSpr');
                    (e && (e.active = !0),
                      this.shareDuckSpriteNode && (this.shareDuckSpriteNode.active = !1),
                      this.shareDuckNameNode && (this.shareDuckNameNode.active = !1),
                      this.sharePropCountNode && (this.sharePropCountNode.active = !1));
                  }),
                  t
                );
              })(y)).prototype,
              'black',
              [k],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                }
              }
            )),
            (x = t(R.prototype, 'panel', [T], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (D = t(R.prototype, 'sureBtn', [B], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (G = t(R.prototype, 'wordSpr', [A], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (E = t(R.prototype, 'propSpr', [P], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (O = t(R.prototype, 'wordSpriteFrame', [M], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return [];
              }
            })),
            (H = t(R.prototype, 'propSpriteFrame', [I], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return [];
              }
            })),
            (F = R))
          ) || F)
        ),
          r._RF.pop());
      }
    };
  }
);
