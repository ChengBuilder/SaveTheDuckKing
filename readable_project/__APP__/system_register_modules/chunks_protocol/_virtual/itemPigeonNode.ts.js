/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/itemPigeonNode.ts")
 */

System.register(
  'chunks:///_virtual/itemPigeonNode.ts',
  ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameModel2.ts', './ResManager.ts'],
  function (e) {
    var t, n, i, o, r, a, s, l, c, u, d, h, p;
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
            (l = e.Sprite),
            (c = e.Color),
            (u = e.Label),
            (d = e.Component));
        },
        function (e) {
          h = e.GameModel;
        },
        function (e) {
          p = e.ResManager;
        }
      ],
      execute: function () {
        var f, g, m, v, y, _, b, S, C, w, N, k, T, B, A, P, M, I, F;
        r._RF.push({}, '92eb795x+pMi6QNKwK+74OB', 'itemPigeonNode', void 0);
        var R = a.ccclass,
          L = a.property;
        (e(
          'itemPigeonNode',
          ((f = R('itemPigeonNode')),
          (g = L(s)),
          (m = L(s)),
          (v = L(s)),
          (y = L(s)),
          (_ = L(s)),
          (b = L(s)),
          (S = L(s)),
          (C = L(s)),
          f(
            ((k = t(
              (N = (function (e) {
                function t() {
                  for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
                    r[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(r)) || this),
                    i(t, 'noNode', k, o(t)),
                    i(t, 'pigeonSprite', T, o(t)),
                    i(t, 'pigeonShadow', B, o(t)),
                    i(t, 'pigeonName', A, o(t)),
                    i(t, 'newTag', P, o(t)),
                    i(t, 'useTag', M, o(t)),
                    i(t, 'useLight', I, o(t)),
                    i(t, 'AdTag', F, o(t)),
                    (t.id = 0),
                    t
                  );
                }
                n(t, e);
                var r = t.prototype;
                return (
                  (r.start = function () {}),
                  (r.initPigeonItem = function () {
                    var e = this;
                    if (2 == h.instance.pigeonNumArr[this.id - 1]) {
                      ((this.node.getComponent(l).color = c.WHITE),
                        (this.pigeonSprite.getComponent(l).color = c.WHITE));
                      var t = h.PigeonNameArr[this.id - 1];
                      ((this.pigeonName.active = !0),
                        (this.pigeonShadow.active = !0),
                        (this.pigeonName.getComponent(u).string = t));
                      var n = 'tex/book/鸽鸽图鉴/皮肤图鉴/p' + this.id.toString() + '/spriteFrame';
                      (p.instance.bundleLoad('uiBundle', n, null, function (t, n) {
                        t
                          ? console.error(t)
                          : e.node && (e.pigeonSprite.getComponent(l).spriteFrame = n);
                      }),
                        this.updateAdTime(),
                        h.instance.pigeonName == h.PigeonNameArr[this.id - 1] &&
                          ((this.useTag.active = !0), (this.useLight.active = !0)));
                    } else {
                      ((this.node.getComponent(l).color = c.GRAY),
                        (this.pigeonSprite.getComponent(l).color = c.GRAY));
                      var i = h.PigeonNameArr[this.id - 1];
                      ((this.pigeonName.active = !0),
                        (this.pigeonShadow.active = !0),
                        (this.pigeonName.getComponent(u).string = i));
                      var o = 'tex/book/鸽鸽图鉴/皮肤图鉴/p' + this.id.toString() + '/spriteFrame';
                      (p.instance.bundleLoad('uiBundle', o, null, function (t, n) {
                        t
                          ? console.error(t)
                          : e.node && (e.pigeonSprite.getComponent(l).spriteFrame = n);
                      }),
                        this.updateAdTime());
                    }
                  }),
                  (r.showUnlock = function () {
                    ((this.node.getComponent(l).color = c.WHITE),
                      (this.pigeonSprite.getComponent(l).color = c.WHITE));
                  }),
                  (r.updateAdTime = function () {
                    ((this.AdTag.getChildByName('ADNum').getComponent(u).string =
                      '（' + h.instance.pigeonNumArr[this.id - 1] + '/2）'),
                      h.instance.pigeonNumArr[this.id - 1] >= 2 &&
                        ((this.AdTag.active = !1), this.showUnlock()));
                  }),
                  (r.hide = function () {
                    ((this.node.active = !1),
                      (this.useTag.active = !1),
                      (this.useLight.active = !1),
                      (this.newTag.active = !1),
                      (this.pigeonShadow.active = !1),
                      (this.pigeonName.active = !1),
                      (this.pigeonSprite.getComponent(l).spriteFrame = null),
                      (this.AdTag.active = !0),
                      (this.AdTag.getChildByName('ADNum').getComponent(u).string = '（0/2）'),
                      (this.node.getComponent(l).color = c.WHITE));
                  }),
                  t
                );
              })(d)).prototype,
              'noNode',
              [g],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                }
              }
            )),
            (T = t(N.prototype, 'pigeonSprite', [m], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (B = t(N.prototype, 'pigeonShadow', [v], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (A = t(N.prototype, 'pigeonName', [y], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (P = t(N.prototype, 'newTag', [_], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (M = t(N.prototype, 'useTag', [b], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (I = t(N.prototype, 'useLight', [S], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (F = t(N.prototype, 'AdTag', [C], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (w = N))
          ) || w)
        ),
          r._RF.pop());
      }
    };
  }
);
