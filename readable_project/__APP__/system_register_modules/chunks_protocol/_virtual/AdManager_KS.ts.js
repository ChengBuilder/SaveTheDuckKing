/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/AdManager_KS.ts")
 */

System.register(
  'chunks:///_virtual/AdManager_KS.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './Enum.ts',
    './ServiceManager.ts',
    './GameModel2.ts'
  ],
  function (e) {
    var t, n, i, o, r;
    return {
      setters: [
        function (e) {
          t = e.createClass;
        },
        function (e) {
          n = e.cclegacy;
        },
        function (e) {
          i = e.releaseType;
        },
        function (e) {
          o = e.default;
        },
        function (e) {
          r = e.GameModel;
        }
      ],
      execute: function () {
        var a;
        n._RF.push({}, 'f4ebdXngkdLq5Pb1ki5CfQR', 'AdManager_KS', void 0);
        var s = e(
          'AdManager_KS',
          (function () {
            function e() {
              ((this.app_id = 'ks699183843526581479'),
                (this.ad_banner_id = 'adunit-'),
                (this.ad_inter_id = '2300019041_02'),
                (this.ad_video_id = '2300019041_01'),
                (this.recorder = null),
                (this.videoPath = null),
                (this.videoTimer = null),
                (this.ad_banner = null),
                (this.ad_video = null),
                (this.gameName = ''),
                (this.videoBack = void 0),
                (this.errorBack = void 0));
            }
            var n = e.prototype;
            return (
              (n.loadAllAd = function () {
                (this.initVideoAd(), this.initBanner());
              }),
              (n.initVideoAd = function () {}),
              (n.initBanner = function () {}),
              (n.showBanner = function () {
                this.ad_banner || this.initBanner();
              }),
              (n.hideBanner = function () {
                this.ad_banner;
              }),
              (n.showIntersAd = function () {
                var e = {};
                e.adUnitId = this.ad_inter_id;
                var t = ks.createInterstitialAd(e);
                (t
                  ? (t.onClose(function (e) {}),
                    t.onError(function (e) {}),
                    t
                      .show()
                      .then(function (e) {
                        console.log('show interstitial ad success, result is ' + e);
                      })
                      .catch(function (e) {
                        (console.log('show interstitial ad failed, error is ' + e), e.code);
                      }))
                  : console.log('创建插屏广告组件失败'),
                  console.log('showIntersAd'));
              }),
              (n.showVideoAd = function (e, t) {
                ((this.videoBack = null),
                  (this.errorBack = null),
                  e && (this.videoBack = e),
                  t && (this.errorBack = t));
                var n = this,
                  i = {};
                i.adUnitId = this.ad_video_id;
                var o = ks.createRewardedVideoAd(i);
                o
                  ? (o.onClose(function (e) {
                      e && e.isEnded ? n.finishVideo() : n.errorVideo();
                    }),
                    o.onError(function (e) {
                      n.errorVideo();
                    }),
                    o
                      .show()
                      .then(function (e) {
                        console.log('show rewarded video ad success, result is ' + e);
                      })
                      .catch(function (e) {
                        (n.errorVideo(),
                          console.log('show rewarded video ad failed, error is ' + e));
                      }))
                  : (n.errorVideo(), console.log('创建激励视频组件失败'));
              }),
              (n.finishVideo = function () {
                (this.videoBack && this.videoBack(),
                  (this.videoBack = null),
                  (this.errorBack = null));
              }),
              (n.errorVideo = function (e) {
                (void 0 === e && (e = !1),
                  this.errorBack && this.errorBack(e),
                  (this.videoBack = null),
                  (this.errorBack = null));
              }),
              (n.createVideoScreen = function () {
                if (r.instance.releaseType == i.applet_kuaishou) {
                  null !== this.videoTimer &&
                    (clearTimeout(this.videoTimer), (this.videoTimer = null));
                  var e = this;
                  ((this.recorder = ks.getGameRecorder()),
                    this.recorder.start(),
                    (this.videoTimer = setTimeout(function () {
                      e.stopVideoScreen();
                    }, 28e4)));
                }
              }),
              (n.stopVideoScreen = function () {
                var e = this;
                r.instance.releaseType == i.applet_kuaishou &&
                  (null !== this.videoTimer &&
                    (clearTimeout(this.videoTimer), (this.videoTimer = null)),
                  this.recorder &&
                    this.recorder.stop &&
                    (this.recorder.on('stop', function (t) {
                      t && t.videoID
                        ? (console.log('videoID is ' + t.videoID),
                          console.log('录屏停止，录制成功'),
                          (e.videoPath = t.videoID))
                        : console.log('录屏停止，录制失败');
                    }),
                    this.recorder.stop()));
              }),
              (n.shareScreenVideo = function (e, t) {
                r.instance.releaseType == i.applet_kuaishou &&
                  (this.recorder.publishVideo({
                    video: this.videoPath,
                    callback: function (e) {
                      null == e || null == e
                        ? console.log('分享录屏成功')
                        : console.log('分享录屏失败: ' + JSON.stringify(e));
                    }
                  }),
                  console.log('shareScreenVideo'));
              }),
              (n.addTable = function () {
                r.instance.releaseType == i.applet_kuaishou &&
                  ks.addShortcut({
                    success: function () {
                      console.log('添加桌面成功');
                    },
                    fail: function (e) {
                      -10005 === e.code
                        ? console.log('暂不支持该功能')
                        : console.log('添加桌面失败', e.msg);
                    }
                  });
              }),
              (n.isAddTable = function () {
                r.instance.releaseType == i.applet_kuaishou &&
                  ks.checkShortcut({
                    success: function (e) {
                      console.log('是否已添加快捷方式', e.installed);
                    },
                    fail: function (e) {
                      -10005 === e.code
                        ? console.log('暂不支持该功能')
                        : console.log('检查快捷方式失败', e.msg);
                    }
                  });
              }),
              (n.login = function () {
                r.instance.releaseType == i.applet_kuaishou &&
                  ks.login({
                    success: function (e) {
                      (console.log(e.code), (o.instance.code = e.code));
                    },
                    fail: function (e) {
                      console.error(e);
                    },
                    complete: function () {
                      console.log('login complete');
                    }
                  });
              }),
              (n.shareGame = function () {
                r.instance.releaseType == i.applet_kuaishou &&
                  ks.shareAppMessage({
                    templateId: '去旅行',
                    query: '',
                    success: function (e) {},
                    fail: function (e) {}
                  });
              }),
              (n.vibrate = function () {
                try {
                  ks.vibrateShort({
                    type: 'medium',
                    success: function () {},
                    fail: function (e) {
                      console.log('短震动失败:', e);
                    }
                  });
                } catch (e) {
                  console.log('震动API调用异常:', e);
                }
              }),
              (n.vibrateLong = function () {
                try {
                  ks.vibrateLong({
                    success: function () {},
                    fail: function (e) {
                      console.log('短震动失败:', e);
                    }
                  });
                } catch (e) {
                  console.log('震动API调用异常:', e);
                }
              }),
              (n.goSidebar = function () {
                ks.checkSliderBarIsAvailable({ success: function (e) {}, fail: function (e) {} });
              }),
              (n.reStart = function () {}),
              t(e, null, [
                {
                  key: '_ins',
                  get: function () {
                    return this._instance;
                  }
                }
              ]),
              e
            );
          })()
        );
        ((a = s), (s._instance = new a()), n._RF.pop());
      }
    };
  }
);
