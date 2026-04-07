/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/AdManager.ts")
 */

System.register(
  'chunks:///_virtual/AdManager.ts',
  [
    'cc',
    './Enum.ts',
    './GameModel2.ts',
    './AdManager_KS.ts',
    './AdManager_WX.ts',
    './AdManager_ZJ.ts'
  ],
  function (e) {
    var t, n, i, o, r, a;
    return {
      setters: [
        function (e) {
          t = e.cclegacy;
        },
        function (e) {
          n = e.releaseType;
        },
        function (e) {
          i = e.GameModel;
        },
        function (e) {
          o = e.AdManager_KS;
        },
        function (e) {
          r = e.AdManager_WX;
        },
        function (e) {
          a = e.AdManager_ZJ;
        }
      ],
      execute: function () {
        (t._RF.push({}, '86665mr20VHx4VjrDNtHUC7', 'AdManager', void 0),
          (e(
            'AdManager',
            (function () {
              function e() {}
              return (
                (e.loadAds = function () {
                  this.isLoadAd ||
                    (i.instance.releaseType == n.applet_ziJie
                      ? a._ins.loadAllAd()
                      : (i.instance.releaseType == n.applet_wechat ||
                          i.instance.releaseType == n.applet_kuaishou) &&
                        r._ins.loadAllAd(),
                    (this.isLoadAd = !0));
                }),
                (e.showBanner = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.showBanner()
                    : i.instance.releaseType == n.applet_wechat
                      ? r._ins.showBanner()
                      : i.instance.releaseType == n.applet_kuaishou && o._ins.showBanner();
                }),
                (e.hideBanner = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.hideBanner()
                    : i.instance.releaseType == n.applet_wechat
                      ? r._ins.hideBanner()
                      : i.instance.releaseType == n.applet_kuaishou && o._ins.hideBanner();
                }),
                (e.showIntersAd = function () {
                  var e = i.instance.releaseType;
                  e != n.test_TEST &&
                    (e == n.applet_ziJie
                      ? a._ins.showIntersAd()
                      : i.instance.releaseType == n.applet_wechat
                        ? r._ins.showIntersAd()
                        : i.instance.releaseType == n.applet_kuaishou && o._ins.showIntersAd());
                }),
                (e.showVideoAd = function (e, t) {
                  var s = i.instance.releaseType;
                  s != n.test_TEST
                    ? s == n.applet_ziJie
                      ? a._ins.showVideoAd(e, t)
                      : i.instance.releaseType == n.applet_wechat
                        ? r._ins.showVideoAd(e, t)
                        : i.instance.releaseType == n.applet_kuaishou && o._ins.showVideoAd(e, t)
                    : e && e();
                }),
                (e.share = function (e, t) {
                  i.instance.releaseType != n.test_TEST
                    ? i.instance.releaseType == n.applet_ziJie
                      ? a._ins.shareGame(e, t)
                      : i.instance.releaseType == n.applet_wechat
                        ? r._ins.shareGame()
                        : i.instance.releaseType == n.applet_kuaishou && o._ins.shareGame()
                    : e && e();
                }),
                (e.createScreenVideo = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.createVideoScreen()
                    : i.instance.releaseType == n.applet_kuaishou && o._ins.createVideoScreen();
                }),
                (e.shareScreenVideo = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.shareScreenVideo()
                    : i.instance.releaseType == n.applet_kuaishou && o._ins.shareScreenVideo();
                }),
                (e.stopScreenVideo = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.stopVideoScreen()
                    : i.instance.releaseType == n.applet_kuaishou && o._ins.stopVideoScreen();
                }),
                (e.goSidebar = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.goSidebar()
                    : i.instance.releaseType == n.applet_kuaishou && o._ins.goSidebar();
                }),
                (e.login = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.login()
                    : i.instance.releaseType == n.applet_wechat
                      ? r._ins.login()
                      : i.instance.releaseType == n.applet_kuaishou && o._ins.login();
                }),
                (e.showRank = function () {
                  i.instance.releaseType == n.applet_ziJie && a._ins.getImRankList();
                }),
                (e.setImRankData = function (e, t, o) {
                  (void 0 === o && (o = 0),
                    i.instance.releaseType == n.applet_ziJie && a._ins.setImRankData(e, t, o));
                }),
                (e.showAddTable = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.addTable()
                    : i.instance.releaseType == n.applet_kuaishou && o._ins.addTable();
                }),
                (e.reStart = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.reStart()
                    : i.instance.releaseType == n.applet_wechat
                      ? r._ins.reStart()
                      : i.instance.releaseType == n.applet_kuaishou && o._ins.reStart();
                }),
                (e.vibrate = function () {
                  i.instance.vibrateFlag &&
                    (i.instance.releaseType == n.applet_ziJie
                      ? a._ins.vibrate()
                      : i.instance.releaseType == n.applet_wechat && r._ins.vibrate());
                }),
                (e.vibrateLong = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.vibrateLong()
                    : i.instance.releaseType == n.applet_wechat && r._ins.vibrate();
                }),
                (e.startGyroscope = function (e) {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.StartGyroscope(e)
                    : i.instance.releaseType == n.applet_wechat && r._ins.StartGyroscope(e);
                }),
                (e.stopGyroscope = function () {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.StopGyroscope()
                    : i.instance.releaseType == n.applet_wechat && r._ins.StopGyroscope();
                }),
                (e.onShow = function (e) {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.onShow(e)
                    : i.instance.releaseType == n.applet_wechat && r._ins.onShow(e);
                }),
                (e.onHide = function (e) {
                  i.instance.releaseType == n.applet_ziJie
                    ? a._ins.onHide(e)
                    : i.instance.releaseType == n.applet_wechat && r._ins.onHide(e);
                }),
                e
              );
            })()
          ).isLoadAd = !1),
          t._RF.pop());
      }
    };
  }
);
