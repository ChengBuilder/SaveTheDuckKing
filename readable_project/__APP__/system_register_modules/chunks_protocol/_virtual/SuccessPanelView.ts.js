/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/SuccessPanelView.ts")
 */

System.register(
  'chunks:///_virtual/SuccessPanelView.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './GameModel2.ts',
    './AudioManager.ts',
    './AdManager.ts',
    './Enum.ts',
    './EventManager.ts',
    './GameCtrl.ts',
    './ConfigTable.ts',
    './Util.ts',
    './ServiceManager.ts',
    './ResManager.ts',
    './TooYueManager.ts',
    './AdManager_ZJ.ts',
    './AddTablePanelView.ts',
    './AutoManager.ts'
  ],
  function (e) {
    var t,
      n,
      o,
      r,
      a,
      s,
      l,
      c,
      u,
      d,
      h,
      p,
      f,
      g,
      m,
      v,
      y,
      _,
      b,
      S,
      C,
      w,
      N,
      k,
      T,
      B,
      A,
      P,
      M,
      I,
      F,
      R,
      L,
      x,
      D,
      G,
      E,
      O,
      H,
      V,
      U,
      z,
      W;
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
            (h = e.director),
            (p = e.find),
            (f = e.v2),
            (g = e.v3),
            (m = e.tween),
            (v = e.sp),
            (y = e.Label),
            (_ = e.instantiate),
            (b = e.UIOpacity),
            (S = e.Sprite),
            (C = e.UITransform),
            (w = e.ProgressBar),
            (N = e.Tween),
            (k = e.assetManager),
            (T = e.Prefab),
            (B = e.Component),
            (A = e.Vec3));
        },
        function (e) {
          P = e.GameModel;
        },
        function (e) {
          M = e.AudioManager;
        },
        function (e) {
          I = e.AdManager;
        },
        function (e) {
          ((F = e.releaseType), (R = e.EVENT_KEYS), (L = e.GAME2_EVENT_KEYS));
        },
        function (e) {
          x = e.default;
        },
        function (e) {
          D = e.GameCtrl;
        },
        function (e) {
          G = e.UIConfigTable;
        },
        function (e) {
          E = e.Util;
        },
        function (e) {
          O = e.default;
        },
        function (e) {
          H = e.ResManager;
        },
        function (e) {
          V = e.TooYueManager;
        },
        function (e) {
          U = e.AdManager_ZJ;
        },
        function (e) {
          z = e.AddTablePanelView;
        },
        function (e) {
          W = e.AutoManager;
        }
      ],
      execute: function () {
        var j,
          J,
          Y,
          q,
          K,
          X,
          Q,
          Z,
          $,
          ee,
          te,
          ne,
          ie,
          oe,
          re,
          ae,
          se,
          le,
          ce,
          ue,
          de,
          he,
          pe,
          fe,
          ge,
          me,
          ve,
          ye,
          _e;
        s._RF.push({}, 'e6f1eHN1PVBW4mmuwhnQzzo', 'SuccessPanelView', void 0);
        var be = l.ccclass,
          Se = l.property;
        (e(
          'SuccessPanelView',
          ((j = be('SuccessPanelView')),
          (J = Se(c)),
          (Y = Se(c)),
          (q = Se(c)),
          (K = Se(u)),
          (X = Se(u)),
          (Q = Se(u)),
          (Z = Se(u)),
          ($ = Se(u)),
          (ee = Se(c)),
          (te = Se(c)),
          (ne = Se(c)),
          (ie = Se([d])),
          (oe = Se(c)),
          j(
            ((se = t(
              (ae = (function (e) {
                function t() {
                  for (var t, n = arguments.length, i = new Array(n), a = 0; a < n; a++)
                    i[a] = arguments[a];
                  return (
                    (t = e.call.apply(e, [this].concat(i)) || this),
                    o(t, 'black', se, r(t)),
                    o(t, 'panel', le, r(t)),
                    o(t, 'aniNode', ce, r(t)),
                    o(t, 'nextLevelBtn', ue, r(t)),
                    o(t, 'shareVideoBtn', de, r(t)),
                    o(t, 'shareBtn', he, r(t)),
                    o(t, 'bookBtn', pe, r(t)),
                    o(t, 'goSideBarBtn', fe, r(t)),
                    o(t, 'duckSprite', ge, r(t)),
                    o(t, 'gooseProgress', me, r(t)),
                    o(t, 'fruitWinAni', ve, r(t)),
                    o(t, 'tipsFrame', ye, r(t)),
                    o(t, 'specialDuckNode', _e, r(t)),
                    (t.startProgress = 0),
                    (t.endProgress = 1),
                    (t.levelNum = P.instance.level),
                    (t.isShowSpecial = !1),
                    (t.ITime = 0),
                    (t.createStarTime = 0.5),
                    (t.duckLzTime = 0),
                    (t.DuckLzCd = 0.3),
                    t
                  );
                }
                n(t, e);
                var s = t.prototype;
                return (
                  (s.onLoad = function () {
                    (h.getScene().name == P.instance.DuckSceneName
                      ? (this.levelNum = P.instance.level)
                      : h.getScene().name == P.instance.Game2SceneName
                        ? (this.levelNum = P.instance.level2)
                        : h.getScene().name == P.instance.FruitSceneName &&
                          (this.levelNum = P.instance.level3),
                      this.initDuckSkin(),
                      this.initUi(),
                      (P.instance.currentLevelPlayNum = 0),
                      h.getScene().name == P.instance.DuckSceneName
                        ? (P.instance.level += 1)
                        : h.getScene().name == P.instance.Game2SceneName
                          ? (P.instance.level2 += 1)
                          : h.getScene().name == P.instance.FruitSceneName &&
                            (P.instance.level3 += 1),
                      h.getScene().name == P.instance.DuckSceneName
                        ? (this.levelNum = P.instance.level)
                        : h.getScene().name == P.instance.Game2SceneName
                          ? (this.levelNum = P.instance.level2)
                          : h.getScene().name == P.instance.FruitSceneName &&
                            (this.levelNum = P.instance.level3),
                      M.instance.playSound('success1'));
                    var e = this.panel.getChildByName('banner');
                    (E.playRibbonAni(60, p('Canvas'), f(0, e.y - 100)), this.uiAnimation());
                  }),
                  (s.start = function () {
                    var e = this;
                    ((P.instance.releaseType != F.applet_ziJie &&
                      P.instance.releaseType != F.applet_wechat) ||
                      this.setLevelNum(),
                      P.isAuto &&
                        this.scheduleOnce(
                          function () {
                            var t = g(e.nextLevelBtn.node.scale);
                            m(e.nextLevelBtn.node)
                              .to(0.1, { scale: g(t.x + 0.1, t.y + 0.1, t.z + 0.1) })
                              .to(0.1, { scale: t })
                              .call(function () {
                                e.onNextLevel();
                              })
                              .start();
                          },
                          2 + E.getRandomNum(2, 4)
                        ));
                  }),
                  (s.update = function (e) {
                    ((this.ITime += e),
                      this.ITime > this.createStarTime &&
                        (this.createStar(),
                        this.createStar(this.specialDuckNode.getChildByName('starNode')),
                        (this.createStarTime = this.ITime + E.getRandomNum(0.2, 0.4, !1))),
                      this.duckLzCreate(e));
                  }),
                  (s.duckLzCreate = function (e) {
                    ((this.duckLzTime += e),
                      this.duckLzTime > this.DuckLzCd &&
                        ((this.duckLzTime = 0),
                        (this.DuckLzCd = E.getRandomNum(0.1, 0.3)),
                        E.FlyLzMove(
                          this.gooseProgress.getChildByName('duck').getChildByName('光圈')
                        )));
                  }),
                  (s.initUi = function () {
                    (P.instance.releaseType == F.applet_wechat &&
                      ((this.shareVideoBtn.node.active = !1), (this.goSideBarBtn.node.active = !1)),
                      h.getScene().name == P.instance.FruitSceneName &&
                        ((this.aniNode.active = !1),
                        (this.fruitWinAni.active = !0),
                        P.instance.level3 > 101 && (this.gooseProgress.active = !1)));
                    var e = this.aniNode.getChildByName('DuckAni').getComponent(v.Skeleton),
                      t = this.GetTypeNumber();
                    (1 == t
                      ? (e.getComponent(v.Skeleton).animation = 'laugh2')
                      : 0 == t && e.setAnimation(0, 'laugh', !1),
                      this.scheduleOnce(function () {
                        ((e.timeScale = 3),
                          1 == t
                            ? (e.getComponent(v.Skeleton).animation = 'daiji2')
                            : 0 == t && e.setAnimation(0, 'daiji', !0));
                      }, 5.4));
                    var n = this.aniNode.getChildByName('name').getComponent(y),
                      i = this.levelNum - 1 - 1 < 0 ? 0 : this.levelNum - 1 - 1,
                      o = !1;
                    1 == t && (o = !0);
                    var r = i >= P.instance.MaxDuckTypeNum ? i % 100 : i;
                    ((n.string = P.cockNameArr[r]), o && (n.string = n.string.replace('鸭', '鹅')));
                    var a = this.levelNum;
                    if (
                      ((1 == a || a > 701) && (this.gooseProgress.active = !1),
                      1 == a && (this.bookBtn.node.active = !1),
                      1 == a)
                    ) {
                      var s = this.aniNode.getChildByName('DuckAni'),
                        l = this.aniNode.getChildByName('Pigeon');
                      ((s.active = !1), (l.active = !0), (n.string = '鸽子'));
                    }
                    if (0 == P.instance.receiveSideBarGriftNum) {
                      var c = this.goSideBarBtn.node.getChildByName('奖');
                      ((c.active = !0),
                        E.btnShake(c),
                        this.goSideBarBtn.node
                          .getComponent(v.Skeleton)
                          .setAnimation(0, 'animation', !0));
                    }
                  }),
                  (s.GetTypeNumber = function () {
                    var e = 0;
                    return (
                      this.levelNum < 102
                        ? (e = 0)
                        : this.levelNum < 202
                          ? (e = 1)
                          : this.levelNum < 302
                            ? (e = 0)
                            : this.levelNum < 402
                              ? (e = 1)
                              : this.levelNum < 502
                                ? (e = 0)
                                : this.levelNum < 602
                                  ? (e = 1)
                                  : this.levelNum < 702 && (e = 0),
                      e
                    );
                  }),
                  (s.createStar = function (e) {
                    var t = this;
                    H.instance.bundleLoad(
                      'DuckBundle',
                      'prefab/successStar',
                      null,
                      function (n, i) {
                        if (n) console.error(n);
                        else {
                          var o = _(i);
                          e ? e.addChild(o) : t.aniNode.getChildByName('starNode').addChild(o);
                          var r = g(E.getRandomNum(-50, 50), E.getRandomNum(-50, 50));
                          ((o.layer = 1 << 25), o.setPosition(r));
                          var a = E.getAngleForPos(f(0, 0), f(r.x, r.y)),
                            s = E.getRandomNum(250, 300),
                            l = E.getPosForAngleLen(a, s, r),
                            c = E.getRandomNum(1.5, 2.5);
                          (m(o)
                            .to(c, { position: l, scale: g(0.5, 0.5) })
                            .call(function () {
                              o.destroy();
                            })
                            .start(),
                            m(o.getComponent(b)).to(c, { opacity: 100 }).start());
                        }
                      }
                    );
                  }),
                  (s.initDuckSkin = function () {
                    var e = this.levelNum - 1;
                    e > P.instance.MaxDuckTypeNum &&
                      0 == (e %= P.instance.MaxDuckTypeNum) &&
                      (e = P.instance.MaxDuckTypeNum);
                    var t = 'y' + e.toString();
                    (this.aniNode.getChildByName('DuckAni').getComponent(v.Skeleton).setSkin(t),
                      this.initGooseProgress());
                  }),
                  (s.initGooseProgress = function () {
                    this.levelNum;
                    var e = this.gooseProgress.getChildByName('duckLabel').getChildByName('last'),
                      t = this.gooseProgress.getChildByName('duck').getChildByName('剪影');
                    h.getScene().name == P.instance.Game2SceneName
                      ? this.initGame2Last(e, t)
                      : h.getScene().name == P.instance.DuckSceneName
                        ? this.initGame1Last(e, t)
                        : h.getScene().name == P.instance.FruitSceneName &&
                          this.initGame3Last(e, t);
                  }),
                  (s.initGame1Last = function (e, t) {
                    this.levelNum < 102 ||
                      (this.levelNum < 202
                        ? ((e.getComponent(S).spriteFrame = this.tipsFrame[1]),
                          (t.getChildByName('百鸭朝鹅').active = !1),
                          (t.getChildByName('百鹅朝凤').active = !0))
                        : this.levelNum < 302
                          ? ((e.getComponent(S).spriteFrame = this.tipsFrame[2]),
                            (t.getChildByName('百鸭朝鹅').active = !1),
                            (t.getChildByName('百鸭朝龙').active = !0))
                          : this.levelNum < 402
                            ? ((e.getComponent(S).spriteFrame = this.tipsFrame[3]),
                              (t.getChildByName('百鸭朝鹅').active = !1),
                              (t.getChildByName('百鹅朝麟').active = !0))
                            : this.levelNum < 502
                              ? ((e.getComponent(S).spriteFrame = this.tipsFrame[4]),
                                (t.getChildByName('百鸭朝鹅').active = !1),
                                (t.getChildByName('百鸭朝雀').active = !0))
                              : this.levelNum < 602
                                ? ((e.getComponent(S).spriteFrame = this.tipsFrame[5]),
                                  (t.getChildByName('百鸭朝鹅').active = !1),
                                  (t.getChildByName('百鹅朝鹏').active = !0))
                                : this.levelNum < 702 &&
                                  ((e.getComponent(S).spriteFrame = this.tipsFrame[6]),
                                  (t.getChildByName('百鸭朝鹅').active = !1),
                                  (t.getChildByName('百鸭朝鲲').active = !0)));
                  }),
                  (s.initGame2Last = function (e, t) {
                    this.levelNum < 102
                      ? (e.getComponent(S).spriteFrame = H.instance.getSpriteFrame('game2_s1'))
                      : this.levelNum < 202
                        ? (e.getComponent(S).spriteFrame = H.instance.getSpriteFrame('game2_s2'))
                        : this.levelNum < 302
                          ? (e.getComponent(S).spriteFrame = H.instance.getSpriteFrame('game2_s3'))
                          : this.levelNum < 402
                            ? (e.getComponent(S).spriteFrame =
                                H.instance.getSpriteFrame('game2_s4'))
                            : this.levelNum < 502
                              ? (e.getComponent(S).spriteFrame =
                                  H.instance.getSpriteFrame('game2_s5'))
                              : this.levelNum < 602
                                ? (e.getComponent(S).spriteFrame =
                                    H.instance.getSpriteFrame('game2_s6'))
                                : this.levelNum < 702 &&
                                  (e.getComponent(S).spriteFrame =
                                    H.instance.getSpriteFrame('game2_s7'));
                  }),
                  (s.initGame3Last = function (e, t) {
                    ((this.gooseProgress
                      .getChildByName('duckLabel')
                      .getChildByName('front')
                      .getComponent(S).spriteFrame = H.instance.getSpriteFrame('game3_front')),
                      this.levelNum < 102 &&
                        (e.getComponent(S).spriteFrame = H.instance.getSpriteFrame('game3_s1')));
                  }),
                  (s.uiAnimation = function () {
                    var e = this;
                    ((this.black.getComponent(b).opacity = 0),
                      m(this.black.getComponent(b))
                        .to(0.1, { opacity: 220 })
                        .call(function () {
                          D.instance.btnCanTouch = !0;
                        })
                        .start());
                    var t = P.instance.screenWidth,
                      n = P.instance.screenHeight,
                      i = this.panel.getChildByName('banner'),
                      o = i.position.y;
                    i.y = n / 2 + i.getComponent(C).height / 2;
                    var r = g(this.aniNode.scale),
                      a = g(this.gooseProgress.scale);
                    (this.aniNode.setScale(0, 0, 0), this.gooseProgress.setScale(0, 0, 0));
                    var s = this.shareBtn.node.x;
                    this.shareBtn.node.x = t / 2 + this.shareBtn.getComponent(C).width / 2;
                    var l = this.shareVideoBtn.node.x;
                    this.shareVideoBtn.node.x =
                      -t / 2 - this.shareVideoBtn.getComponent(C).width / 2;
                    var c = this.bookBtn.node.x;
                    this.bookBtn.node.x = t / 2 + this.bookBtn.getComponent(C).width / 2;
                    var u = this.goSideBarBtn.node.x;
                    this.goSideBarBtn.node.x = -t / 2 - this.goSideBarBtn.getComponent(C).width / 2;
                    var d = g(this.nextLevelBtn.node.scale);
                    if (
                      (this.nextLevelBtn.node.setScale(0, 0, 0),
                      h.getScene().name == P.instance.FruitSceneName &&
                        (M.instance.playLongSound('fruitGame/FruitWin', 0.5),
                        this.fruitWinAni.getComponent(v.Skeleton).setAnimation(0, 'laugh', !1),
                        this.scheduleOnce(function () {
                          ((e.fruitWinAni.getComponent(v.Skeleton).loop = !0),
                            (e.fruitWinAni.getComponent(v.Skeleton).animation = 'stand by'));
                        }, 3.5)),
                      m(i).to(0.5, { y: o }, { easing: 'backOut' }).start(),
                      m(this.aniNode)
                        .delay(0.5)
                        .call(function () {
                          h.getScene().name != P.instance.FruitSceneName &&
                            M.instance.playLongSound('winDuck', 0.5);
                        })
                        .to(0.5, { scale: r }, { easing: 'backOut' })
                        .start(),
                      m(this.gooseProgress)
                        .delay(0.7)
                        .to(0.5, { scale: a }, { easing: 'backOut' })
                        .start(),
                      m(this.shareBtn.node)
                        .delay(1)
                        .to(0.35, { x: s }, { easing: 'backOut' })
                        .start(),
                      P.instance.shareSuccessNum < V._ins.shareGift)
                    ) {
                      var p = this.shareBtn.node.getChildByName('shareTips');
                      m(p)
                        .delay(1.35)
                        .to(0.2, { scale: g(1.1, 0.9) })
                        .to(0.1, { scale: g(0.9, 1.1) })
                        .to(0.1, { scale: g(1, 1) })
                        .start();
                    }
                    (m(this.bookBtn.node)
                      .delay(1)
                      .to(0.35, { x: c }, { easing: 'backOut' })
                      .call(function () {
                        (console.log('this.levelNum - 1', e.levelNum - 1),
                          e.levelNum - 1 != 1 &&
                            (h.getScene().name == P.instance.FruitSceneName
                              ? e.gooseProgressMoveToBookBtn(0)
                              : e.newDuckSpriteMoveToBookBtn()));
                      })
                      .start(),
                      m(this.goSideBarBtn.node)
                        .delay(1)
                        .to(0.35, { x: u }, { easing: 'backOut' })
                        .start(),
                      m(this.shareVideoBtn.node)
                        .delay(1)
                        .to(0.35, { x: l }, { easing: 'backOut' })
                        .start(),
                      m(this.nextLevelBtn.node)
                        .delay(2.5)
                        .to(0.5, { scale: d }, { easing: 'backOut' })
                        .call(function () {
                          E.btnShake(e.nextLevelBtn.node);
                        })
                        .start(),
                      W._ins.isAuto &&
                        this.scheduleOnce(function () {
                          e.onNextLevel();
                        }, 4));
                    var f = this.aniNode.getChildByName('name');
                    m(f)
                      .to(0.2, { scale: g(1.1, 1.1) })
                      .to(0.2, { scale: g(1, 1) })
                      .union()
                      .repeatForever()
                      .start();
                  }),
                  (s.gooseProgressMoveToBookBtn = function (e) {
                    var t = this,
                      n = this.gooseProgress.getChildByName('ProgressBar'),
                      i = this.gooseProgress.getChildByName('duckLabel').getChildByName('Label'),
                      o = (this.gooseProgress.getChildByName('duck'), this.levelNum - 1 - 1);
                    this.levelNum <= 102 ||
                      (this.levelNum <= 202
                        ? (o -= 100)
                        : this.levelNum <= 302
                          ? (o -= 200)
                          : this.levelNum <= 402
                            ? (o -= 300)
                            : this.levelNum <= 502
                              ? (o -= 400)
                              : this.levelNum <= 602
                                ? (o -= 500)
                                : this.levelNum <= 702 && (o -= 600));
                    var r = o / 100;
                    (n.getComponent(w).totalLength,
                      m(n.getComponent(w))
                        .delay(e)
                        .to(0.5, { progress: r }, { easing: 'quadOut' })
                        .start(),
                      m(i.getComponent(y))
                        .delay(e)
                        .to(0.5, { string: (100 - o).toString() }, { easing: 'quadOut' })
                        .call(function () {
                          h.getScene().name == P.instance.DuckSceneName
                            ? t.judgeSpecialDuck()
                            : h.getScene().name == P.instance.Game2SceneName
                              ? t.judgeSpecialFruitDuck()
                              : h.getScene().name == P.instance.FruitSceneName && t.judgeDWWDuck();
                        })
                        .start());
                  }),
                  (s.newDuckSpriteMoveToBookBtn = function (e) {
                    var t = this,
                      n = this.levelNum - 1 - 1;
                    n > P.instance.MaxDuckTypeNum &&
                      0 == (n %= P.instance.MaxDuckTypeNum) &&
                      (n = P.instance.MaxDuckTypeNum);
                    var i = 'tex/book/duck/y' + n.toString() + '/spriteFrame';
                    (e && (i = e),
                      H.instance.bundleLoad('uiBundle', i, null, function (n, i) {
                        if (n) console.error(n);
                        else if (t.node.isValid) {
                          var o = 0.6;
                          ((t.duckSprite.getComponent(S).spriteFrame = i),
                            t.duckSprite.setPosition(g(0, 0, 0)),
                            t.duckSprite.setScale(g(1, 1)),
                            e && t.duckSprite.setScale(g(2, 2)),
                            E.parabolaTween(
                              t.duckSprite,
                              o,
                              g(t.duckSprite.x, t.duckSprite.y),
                              g((t.bookBtn.node.x + t.duckSprite.x) / 2, t.duckSprite.y + 250),
                              g(t.bookBtn.node.x, t.bookBtn.node.y),
                              !1
                            ),
                            t.gooseProgressMoveToBookBtn(o),
                            m(t.duckSprite)
                              .to(o, { scale: g(0, 0) })
                              .start(),
                            (t.bookBtn.node.getChildByName('new').active = !0),
                            m(t.bookBtn.node.getChildByName('new'))
                              .delay(o - 0.2)
                              .to(0.2, { scale: g(1.1, 0.9) })
                              .to(0.1, { scale: g(0.9, 1.1) })
                              .to(0.1, { scale: g(1, 1) })
                              .start(),
                            m(t.bookBtn.node.getChildByName('bookSpr'))
                              .delay(o)
                              .call(function () {
                                (M.instance.playSound('click'), M.instance.playSound('getDuck', 1));
                              })
                              .to(0.1, { scale: g(1.2, 0.8) })
                              .to(0.1, { scale: g(0.8, 1.2) })
                              .to(0.1, { scale: g(1, 1) })
                              .start());
                        }
                      }));
                  }),
                  (s.getPromoteIndex = function () {
                    var e;
                    return -1 != (e = P.instance.promoteLevelArr.indexOf(this.levelNum)) ? e : null;
                  }),
                  (s.setLevelNum = function () {
                    (O.instance.setStorageToServer(),
                      h.getScene().name != P.instance.DuckSceneName ||
                        V.userMsg.userTags.includes('gm') ||
                        I.setImRankData(0, this.levelNum.toString()));
                  }),
                  (s.judgeSpecialDuck = (function () {
                    var e = a(
                      i().mark(function e() {
                        var t, n, o, r, a, s;
                        return i().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    ((t = this),
                                    (n = (P.instance.level - 2) % 100),
                                    (o = (P.instance.level - 2) / 100 - 1 - 1),
                                    P.instance.level < 200 ||
                                      0 != n ||
                                      this.isShowSpecial ||
                                      o >= P.SpecialNameArr.length)
                                  ) {
                                    e.next = 13;
                                    break;
                                  }
                                  return (
                                    (this.isShowSpecial = !0),
                                    (r =
                                      '神兽动画合集/' +
                                      P.SpecialNameArr[o] +
                                      '/' +
                                      P.SpecialNameArr[o]),
                                    (a = this.specialDuckNode.getChildByName('skeleton')),
                                    (s = null),
                                    (e.next = 6),
                                    H.instance.bundleLoad('aniBundle', r, null, function (e, t) {
                                      e ? console.error(e) : (s = t);
                                    })
                                  );
                                case 6:
                                  (this.specialDuckNode.setScale(A.ZERO),
                                    (a.getComponent(v.Skeleton).skeletonData = s),
                                    a.getComponent(v.Skeleton).setAnimation(0, 'animation', !0),
                                    (this.specialDuckNode.active = !0),
                                    (this.specialDuckNode
                                      .getChildByName('specialName')
                                      .getComponent(y).string = P.SpecialNameArr[o]),
                                    this.hideBasicAni(),
                                    m(this.specialDuckNode)
                                      .delay(0.4)
                                      .to(0.5, { scale: g(1, 1) }, { easing: 'backOut' })
                                      .call(function () {
                                        var e =
                                          'tex/book/特殊图鉴/' +
                                          P.SpecialNameArr[o] +
                                          '/spriteFrame';
                                        t.newDuckSpriteMoveToBookBtn(e);
                                      })
                                      .start());
                                case 13:
                                case 'end':
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (s.judgeSpecialFruitDuck = (function () {
                    var e = a(
                      i().mark(function e() {
                        var t, n, o, r, a;
                        return i().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    ((t = this),
                                    (n = (P.instance.level2 - 2) % 100),
                                    (o = (P.instance.level2 - 2) / 100 - 1),
                                    P.instance.level2 < 100 ||
                                      0 != n ||
                                      this.isShowSpecial ||
                                      o >= P.FruitNameArr.length)
                                  ) {
                                    e.next = 17;
                                    break;
                                  }
                                  return (
                                    (this.isShowSpecial = !0),
                                    (r =
                                      this.specialDuckNode.getChildByName('skeleton')).setPosition(
                                      g(0, -150, 0)
                                    ),
                                    (a = null),
                                    (e.next = 8),
                                    H.instance.bundleLoad(
                                      'aniBundle',
                                      '骨骼动画/鸭子动画/duck',
                                      null,
                                      function (e, t) {
                                        e ? console.error(e) : (a = t);
                                      }
                                    )
                                  );
                                case 8:
                                  (this.specialDuckNode.setScale(A.ZERO),
                                    (r.getComponent(v.Skeleton).skeletonData = a),
                                    r.getComponent(v.Skeleton).setSkin('f' + (o + 1).toString()),
                                    r.getComponent(v.Skeleton).setAnimation(0, 'daiji', !0),
                                    (r.getComponent(v.Skeleton).timeScale = 3),
                                    (this.specialDuckNode
                                      .getChildByName('specialName')
                                      .getComponent(y).string = P.FruitNameArr[o]),
                                    this.hideBasicAni(),
                                    (this.specialDuckNode.active = !0),
                                    m(this.specialDuckNode)
                                      .delay(0.4)
                                      .to(0.5, { scale: g(1, 1) }, { easing: 'backOut' })
                                      .call(function () {
                                        var e =
                                          'tex/book/水果鸭/' + P.FruitNameArr[o] + '/spriteFrame';
                                        t.newDuckSpriteMoveToBookBtn(e);
                                      })
                                      .start());
                                case 17:
                                case 'end':
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (s.judgeDWWDuck = (function () {
                    var e = a(
                      i().mark(function e() {
                        var t, n, o, r, a;
                        return i().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    ((t = this),
                                    (n = (P.instance.level3 - 2) % 100),
                                    (o = (P.instance.level3 - 2) / 100 - 1),
                                    P.instance.level3 < 100 ||
                                      0 != n ||
                                      this.isShowSpecial ||
                                      o >= P.DaWeiWangNameArr.length)
                                  ) {
                                    e.next = 17;
                                    break;
                                  }
                                  return (
                                    (this.isShowSpecial = !0),
                                    (r =
                                      this.specialDuckNode.getChildByName('skeleton')).setPosition(
                                      g(0, -150, 0)
                                    ),
                                    (a = null),
                                    (e.next = 8),
                                    H.instance.bundleLoad(
                                      'aniBundle',
                                      '骨骼动画/鸭子动画/duck',
                                      null,
                                      function (e, t) {
                                        e ? console.error(e) : (a = t);
                                      }
                                    )
                                  );
                                case 8:
                                  (this.specialDuckNode.setScale(A.ZERO),
                                    (r.getComponent(v.Skeleton).skeletonData = a),
                                    r.getComponent(v.Skeleton).setSkin('w' + (o + 1).toString()),
                                    r.getComponent(v.Skeleton).setAnimation(0, 'daiji', !0),
                                    (r.getComponent(v.Skeleton).timeScale = 3),
                                    (this.specialDuckNode
                                      .getChildByName('specialName')
                                      .getComponent(y).string = P.DaWeiWangNameArr[o]),
                                    this.hideBasicAni(),
                                    (this.specialDuckNode.active = !0),
                                    m(this.specialDuckNode)
                                      .delay(0.4)
                                      .to(0.5, { scale: g(1, 1) }, { easing: 'backOut' })
                                      .call(function () {
                                        var e =
                                          'tex/book/大胃王鸭/' +
                                          P.DaWeiWangNameArr[o] +
                                          '/spriteFrame';
                                        t.newDuckSpriteMoveToBookBtn(e);
                                      })
                                      .start());
                                case 17:
                                case 'end':
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (s.hideBasicAni = function () {
                    (m(this.aniNode)
                      .to(0.3, { scale: g(0, 0) })
                      .start(),
                      m(this.gooseProgress)
                        .to(0.3, { scale: g(0, 0) })
                        .start(),
                      m(this.fruitWinAni)
                        .to(0.3, { scale: g(0, 0) })
                        .start());
                  }),
                  (s.onEnable = function () {
                    this.registerEvents();
                  }),
                  (s.onDisable = function () {
                    (this.unregisterEvents(),
                      N.stopAllByTarget(this.node),
                      k.getBundle('uiBundle').release(G.SuccessUI.path, T));
                  }),
                  (s.closeShareTips = function () {
                    this.shareBtn.node.getChildByName('shareTips').active = !1;
                  }),
                  (s.registerEvents = function () {
                    (this.nextLevelBtn.node.on('click', this.onNextLevel, this),
                      this.shareBtn.node.on('click', this.share, this),
                      this.shareVideoBtn.node.on('click', this.shareVideo, this),
                      x.instance.on(R.CLOSE_SHARETIPS, this.closeShareTips, this),
                      x.instance.on(R.SIDE_REWARD, this.closeTips, this));
                  }),
                  (s.unregisterEvents = function () {
                    var e, t, n;
                    (M.instance.stopLongSound(),
                      null != (e = this.nextLevelBtn) &&
                        e.node &&
                        this.nextLevelBtn.node.off('click', this.onNextLevel, this),
                      null != (t = this.shareBtn) &&
                        t.node &&
                        this.shareBtn.node.off('click', this.share, this),
                      null != (n = this.shareVideoBtn) &&
                        n.node &&
                        this.shareVideoBtn.node.off('click', this.shareVideo, this),
                      x.instance.on(R.CLOSE_SHARETIPS, this.closeShareTips, this),
                      x.instance.off(R.SIDE_REWARD, this.closeTips, this));
                  }),
                  (s.onNextLevel = function () {
                    var e = this;
                    if (D.instance.btnCanTouch) {
                      if (0 == P.instance.isShowSubscribeUI && !W._ins.isAuto)
                        return ((P.instance.isShowSubscribeUI = 1), void this.subscribeBack());
                      ((D.instance.btnCanTouch = !1),
                        M.instance.playSound('click'),
                        V._ins.stopRecordVideo(),
                        m(this.panel.getComponent(b))
                          .delay(0)
                          .to(0.3, { opacity: 0 }, { easing: 'smooth' })
                          .call(function () {
                            (h.getScene().name == P.instance.DuckSceneName ||
                            h.getScene().name == P.instance.FruitSceneName
                              ? x.instance.emit(R.NEXT_LEVEL)
                              : h.getScene().name == P.instance.Game2SceneName &&
                                x.instance.emit(L.NEXT_LEVEL),
                              (D.instance.btnCanTouch = !0),
                              e.node.destroy());
                          })
                          .start());
                    }
                  }),
                  (s.share = function () {
                    var e = this;
                    (M.instance.playSound('click'),
                      P.instance.shareSuccessNum < V._ins.shareGift
                        ? H.instance.bundleLoad('uiBundle', G.ShareUI.path, null, function (t, n) {
                            if (t) return (console.log(t), void (D.instance.btnCanTouch = !0));
                            _(n).parent = e.node;
                          })
                        : (V._ins.shareApp(), (D.instance.btnCanTouch = !0)));
                  }),
                  (s.shareVideo = function () {
                    (M.instance.playSound('click'), V._ins.stopAndShareRecord());
                  }),
                  (s.bookBtnClick = function () {
                    var e = this;
                    (console.log('打开手册'),
                      M.instance.playSound('click'),
                      H.instance.bundleLoad('uiBundle', G.BookUI.path, null, function (t, n) {
                        t
                          ? console.log(t)
                          : (N.stopAllByTarget(e.bookBtn.node.getChildByName('new')),
                            e.bookBtn.node.getChildByName('new').setScale(0, 0, 0),
                            (e.bookBtn.node.getChildByName('new').active = !1),
                            (_(n).parent = e.node));
                      }));
                  }),
                  (s.subscribeBack = function () {
                    var e = this;
                    V.feedSubscribeStatus
                      ? 0 == P.instance.addTableBtnClickNum &&
                        H.instance.bundleLoad('uiBundle', G.AddTableUI.path, null, function (t, n) {
                          if (t) return (console.log(t), void (D.instance.btnCanTouch = !0));
                          var i = _(n);
                          ((i.parent = e.node), i.getComponent(z).setPanel(0));
                        })
                      : U._ins.feedSubscribe();
                  }),
                  (s.goSideBarBack = function () {
                    var e = this;
                    !1 !== D.instance.btnCanTouch &&
                      ((D.instance.btnCanTouch = !1),
                      console.log('侧边栏'),
                      M.instance.playSound('click'),
                      H.instance.bundleLoad('uiBundle', G.SideBarUI.path, null, function (t, n) {
                        t ? console.log(t) : (_(n).parent = e.node);
                      }));
                  }),
                  (s.closeTips = function () {
                    this.goSideBarBtn.node.getChildByName('奖').active = !1;
                  }),
                  t
                );
              })(B)).prototype,
              'black',
              [J],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                }
              }
            )),
            (le = t(ae.prototype, 'panel', [Y], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (ce = t(ae.prototype, 'aniNode', [q], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (ue = t(ae.prototype, 'nextLevelBtn', [K], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (de = t(ae.prototype, 'shareVideoBtn', [X], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (he = t(ae.prototype, 'shareBtn', [Q], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (pe = t(ae.prototype, 'bookBtn', [Z], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (fe = t(ae.prototype, 'goSideBarBtn', [$], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (ge = t(ae.prototype, 'duckSprite', [ee], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (me = t(ae.prototype, 'gooseProgress', [te], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (ve = t(ae.prototype, 'fruitWinAni', [ne], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (ye = t(ae.prototype, 'tipsFrame', [ie], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return [];
              }
            })),
            (_e = t(ae.prototype, 'specialDuckNode', [oe], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              }
            })),
            (re = ae))
          ) || re)
        ),
          s._RF.pop());
      }
    };
  }
);
