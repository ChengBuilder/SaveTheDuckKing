/**
 * Restored module: chunks:///_virtual/AdManager_ZJ.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => cclegacy
 * - c => Util
 * - d => GameModel
 * - f => Game2Controller
 * - h => DuckController
 * - l => find
 * - n => createForOfIteratorHelperLoose
 * - o => createClass
 * - p => TooYueManager
 * - r => asyncToGenerator
 * - s => director
 * - t => extends
 * - u => releaseType
 */
System.register("chunks:///_virtual/AdManager_ZJ.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Util.ts","./Enum.ts","./GameModel2.ts","./DuckController.ts","./TooYueManager.ts","./Game2Controller.ts"],(function(e){
  var t,n,o,r,a,s,l,c,u,d,h,p,f;
  return{
    setters:[function(e){
      t=e.extends,n=e.createForOfIteratorHelperLoose,o=e.createClass,r=e.asyncToGenerator}
    ,function(e){
      a=e.cclegacy,s=e.director,l=e.find}
    ,function(e){
      c=e.Util}
    ,function(e){
      u=e.releaseType}
    ,function(e){
      d=e.GameModel}
    ,function(e){
      h=e.DuckController}
    ,function(e){
      p=e.TooYueManager}
    ,function(e){
      f=e.Game2Controller}
    ],execute:function(){
      var g;
      a._RF.push({
      }
      ,"f553ffQ1ItD9oVq51K/TErA","AdManager_ZJ",void 0);
      var m=e("AdManager_ZJ",function(){
        function e(){
          this.app_id="tt15f563488af957ba07",this.ad_inter_id="",this.ad_video_id="",this.ad_banner_id="",this.recorder=null,this.videoPath=null,this.videoTimer=null,this.ad_banner=null,this.ad_video=null,this.videoBack=void 0,this.errorBack=void 0,this.templateId=["3ha82x46psq17fkpo0","25mq7n7fhkka19j076","5m6uhnoqlf4aff14bk","2sjtf774fv2ickm1j9","en9gbmnlqflj7iki3i","4276a7ibgeif92kigh","1b26ln05il681c9q8h"],this.isShowSubGuide=!1,this.GroupId=null}
        var a=e.prototype;
        return a.loadAllAd=function(){
          d.instance.releaseType==u.applet_ziJie&&(this.initBanner(),this.initVideoAd())}
        ,a.initVideoAd=function(){
          this.ad_video=tt.createRewardedVideoAd({
            adUnitId:this.ad_video_id}
          ),this.ad_video.onLoad((function(){
            console.log("视频广告加载完成!")}
          )),this.ad_video.load()}
        ,a.initBanner=function(){
          var e=tt.getSystemInfoSync(),t={
            left:e.screenWidth,top:e.screenHeight,width:e.screenWidth}
          ;
          this.ad_banner=tt.createBannerAd({
            adUnitId:this.ad_banner_id,adIntervals:20,style:t}
          )}
        ,a.showBanner=function(){
          var e=this;
          d.instance.releaseType==u.applet_ziJie&&(this.ad_banner||this.initBanner(),this.ad_banner.show&&this.ad_banner.show(),this.ad_banner.onLoad((function(){
            e.ad_banner.show().then((function(){
              console.log("广告显示成功")}
            )).catch((function(t){
              console.log("广告组件出现问题",t),e.ad_banner=null}
            ))}
          )))}
        ,a.hideBanner=function(){
          d.instance.releaseType==u.applet_ziJie&&this.ad_banner&&this.ad_banner.hide()}
        ,a.showIntersAd=function(){
          if(d.instance.releaseType==u.applet_ziJie){
            var e=tt.createInterstitialAd({
              adUnitId:this.ad_inter_id}
            );
            e.load().then((function(){
              e.show().then((function(){
                console.log("插屏广告展示成功")}
              ))}
            )).catch((function(e){
              console.log(e)}
            )),console.log("showIntersAd")}
        }
        ,a.showVideoAd=function(e,t){
          var n=this;
          d.instance.releaseType==u.applet_ziJie&&(this.videoBack=null,this.errorBack=null,e&&(this.videoBack=e),t&&(this.errorBack=t),this.ad_video||this.initVideoAd(),this.ad_video.show().then((function(){
            console.log("广告显示成功")}
          )).catch((function(e){
            n.errorVideo(),console.log("广告组件出现问题",e),n.ad_video.load().then((function(){
              console.log("手动加载成功"),n.ad_video.show()}
            ))}
          )),this.ad_video.onClose((function(e){
            e.isEnded?(console.log("获取奖励"),n.finishVideo()):(console.log("没有观看完毕--"),n.errorVideo(!0)),e.count}
          )))}
        ,a.finishVideo=function(){
          this.videoBack&&this.videoBack(),this.videoBack=null,this.errorBack=null}
        ,a.errorVideo=function(e){
          void 0===e&&(e=!1),this.errorBack&&this.errorBack(e),this.videoBack=null,this.errorBack=null}
        ,a.createVideoScreen=function(){
          if(d.instance.releaseType==u.applet_ziJie){
            this.stopVideoScreen(),null!==this.videoTimer&&(clearTimeout(this.videoTimer),this.videoTimer=null);
            var e=this;
            this.recorder=tt.getGameRecorderManager(),this.recorder.onStart((function(e){
              console.log("开始录屏:",e)}
            )),this.recorder.onError((function(e){
              console.log("录屏错误:",e)}
            )),this.recorder.start({
              duration:300}
            ),this.videoTimer=setTimeout((function(){
              e.stopVideoScreen()}
            ),28e4)}
        }
        ,a.stopVideoScreen=function(){
          if(d.instance.releaseType==u.applet_ziJie){
            null!==this.videoTimer&&(clearTimeout(this.videoTimer),this.videoTimer=null);
            var e=this;
            console.log(this.recorder),this.recorder&&this.recorder.stop&&(this.recorder.onStop((function(t){
              e.videoPath=t.videoPath}
            )),this.recorder.stop())}
        }
        ,a.shareScreenVideo=function(e,t){
          d.instance.releaseType==u.applet_ziJie&&(e=e||["大战小黑"],t=t||"来大战25个回合~~",tt.shareAppMessage({
            channel:"video",title:t,imageUrl:"",query:"",extra:{
              videoPath:this.videoPath,videoTopics:e}
            ,success:function(){
              console.log("分享视频成功")}
            ,fail:function(e){
              console.log("分享视频失败"+e)}
          }
          ),console.log("shareScreenVideo"))}
        ,a.addMoreGame=function(){
          d.instance.releaseType==u.applet_ziJie&&setTimeout((function(){
            var e=tt.getSystemInfoSync();
            console.log(e),tt.showGridGamePanel({
              query:{
                "花花僵尸":"ttd12aa7974e142ca002"}
              ,type:"one",size:"medium",position:{
                top:e.screenHeight/2-70,left:e.screenWidth-70}
              ,fail:function(e){
                console.log(e)}
            }
            )}
          ),100)}
        ,a.hideMoreGame=function(){
          d.instance.releaseType==u.applet_ziJie&&tt.hideGridGamePanel()}
        ,a.addTable=function(){
          d.instance.releaseType==u.applet_ziJie&&tt.addShortcut({
            success:function(e){
              console.log("添加桌面成功！"+e)}
            ,fail:function(e){
              console.log("添加桌面失败！"+e)}
          }
          )}
        ,a.isAddTable=function(){
          d.instance.releaseType==u.applet_ziJie&&tt.checkShortcut({
            success:function(e){
              console.log(e.status),e.status.exist&&console.log("已经添加桌面了")}
            ,fail:function(e){
            }
          }
          )}
        ,a.reStart=function(){
          tt.restartMiniProgramSync()}
        ,a.setImRankData=function(e,t,n){
          d.instance.releaseType==u.applet_ziJie&&"Toutiao"!=tt.getSystemInfoSync().appName&&tt.setImRankData({
            dataType:e,value:t,priority:n,extra:"extra",success:function(e){
              console.log("写入排行榜数据成功: "+e)}
            ,fail:function(e){
              console.log("写入排行榜数据错误: "+e.errMsg)}
          }
          )}
        ,a.getImRankList=function(e,t,n){
          void 0===e&&(e=0),void 0===t&&(t="排行榜"),void 0===n&&(n="关"),d.instance.releaseType==u.applet_ziJie&&"Toutiao"!=tt.getSystemInfoSync().appName&&tt.getImRankList({
            relationType:"default",dataType:e,rankType:"week",suffix:n,rankTitle:t,success:function(e){
              console.log("获取排行榜数据成功: "+e)}
            ,fail:function(e){
              console.log("获取排行榜数据错误: "+e.errMsg)}
          }
          )}
        ,a.login=function(){
        }
        ,a.goSidebar=function(){
          tt.navigateToScene({
            scene:"sidebar",success:function(e){
              console.log("navigate to scene success")}
            ,fail:function(e){
              console.log("navigate to scene fail: ",e)}
          }
          )}
        ,a.shareGame=function(e,t){
          d.instance.releaseType==u.applet_ziJie&&tt.shareAppMessage({
            templateId:this.templateId[c.getRandomNum(0,this.templateId.length-1,!0)],query:"",success:function(){
              console.log("分享成功"),e&&e()}
            ,fail:function(e){
              console.log("分享失败"),t&&t()}
          }
          )}
        ,a.vibrate=function(){
          try{
            tt.vibrateShort({
              success:function(){
              }
              ,fail:function(e){
                console.log("短震动失败:",e)}
            }
            )}
          catch(e){
            console.log("震动API调用异常:",e)}
        }
        ,a.vibrateLong=function(){
          try{
            tt.vibrateLong({
              success:function(){
              }
              ,fail:function(e){
                console.log("短震动失败:",e)}
            }
            )}
          catch(e){
            console.log("震动API调用异常:",e)}
        }
        ,a.StartGyroscope=function(e){
          d.instance.releaseType==u.applet_ziJie&&(tt.startGyroscope({
            interval:20,fail:function(e){
              console.warn(e)}
          }
          ),tt.onGyroscopeChange((function(e){
            if(e.x>2||e.x<-2){
              var t=e.x;
              e.x>5?t=5:e.x<-5&&(t=-5),s.getScene().name==d.instance.DuckSceneName?l("Canvas").getComponent(h).woodAddLinerVelocity(-t,0):s.getScene().name==d.instance.Game2SceneName&&l("Canvas").getComponent(f).moveFruitByGyroscope(t,0)}
          }
          )))}
        ,a.StopGyroscope=function(){
          d.instance.releaseType==u.applet_ziJie&&tt.stopGyroscope()}
        ,a.GyroscopeChanged=function(e,t,n,i,o,r,a,s){
        }
        ,a.checkFeedSubscribe=function(){
          var e=r(i().mark((function e(){
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(d.instance.releaseType!=u.applet_ziJie||"Toutiao"==tt.getSystemInfoSync().appName){
                  e.next=10;
                  break}
                return e.prev=1,e.next=4,tt.checkFeedSubscribeStatus({
                  type:"play",scene:3,success:function(e){
                    return console.log("是否订阅",e),p.feedSubscribeStatus=e.status,console.log("是否订阅",p.feedSubscribeStatus),e.status}
                  ,fail:function(e){
                    console.log(e.errMsg)}
                }
                );
                case 4:return e.abrupt("return",!1);
                case 7:e.prev=7,e.t0=e.catch(1),console.log("checkFeedSubscribeStatus API调用异常:",e.t0);
                case 10:case"end":return e.stop()}
            }
            ),e,null,[[1,7]])}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),a.feedSubscribe=function(e,t){
          if(d.instance.releaseType==u.applet_ziJie&&(console.log("订阅游戏"),"Toutiao"!=tt.getSystemInfoSync().appName))try{
            tt.requestFeedSubscribe({
              type:"play",scene:3,contentIDs:[p.sub_Content_id],success:function(n){
                console.log(n.success),n.success?(e&&e(),p.feedSubscribeStatus=!0):t&&t()}
              ,fail:function(e){
                console.log(e.errMsg),t&&t()}
            }
            )}
          catch(e){
            t&&t()}
        }
        ,a.reportScene=function(){
          d.instance.releaseType==u.applet_ziJie&&tt.reportScene({
            sceneId:7001,costTime:350,success:function(e){
              console.log(e)}
            ,fail:function(e){
              console.log(e)}
          }
          )}
        ,a.getLaunchOptionsSync=function(){
          var e=r(i().mark((function e(){
            var t;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(d.instance.releaseType!=u.applet_ziJie){
                  e.next=11;
                  break}
                return e.prev=1,e.next=4,tt.getLaunchOptionsSync();
                case 4:return t=e.sent,e.abrupt("return",(console.log("获取启动参数:",t),t));
                case 8:e.prev=8,e.t0=e.catch(1),console.log("获取启动参数失败:",e.t0);
                case 11:case"end":return e.stop()}
            }
            ),e,null,[[1,8]])}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),a.onFeedStatusChange=function(e,t){
          d.instance.releaseType==u.applet_ziJie&&tt.onFeedStatusChange((function(n){
            var i=n.type;
            "feedEnter"===i&&(e&&e(),console.log("从Feed流进入小游戏")),"feedExit"===i&&(t&&t(),console.log("从小游戏退回到Feed流"))}
          ))}
        ,a.storeFeedData=function(){
          d.instance.releaseType==u.applet_ziJie&&"Toutiao"!=tt.getSystemInfoSync().appName&&tt.storeFeedData({
            scene:3,contentID:p.sub_Content_id,status:1,leftValue:"timeStampMs",operator:">=",rightValue:"1744949793000",success:function(e){
              console.log("storeFeedData success",e)}
            ,fail:function(e){
              console.log("storeFeedData fail",e)}
          }
          )}
        ,a.checkFollowAwemeState=function(){
          var e=r(i().mark((function e(){
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(e.t0=d.instance.releaseType==u.applet_ziJie,!e.t0){
                  e.next=7;
                  break}
                return e.t1=tt,e.next=5,{
                  success:function(e){
                    console.log("checkFollowAwemeState success",e),p.isFollowAweme=e.hasFollowed}
                  ,fail:function(e){
                    console.log("checkFollowAwemeState fail",e)}
                }
                ;
                case 5:e.t2=e.sent,e.t1.checkFollowAwemeState.call(e.t1,e.t2);
                case 7:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),a.openAwemeUserProfile=function(e,t){
          d.instance.releaseType==u.applet_ziJie&&tt.openAwemeUserProfile({
            success:function(t){
              console.log("openAwemeUserProfile success",t),e&&e(),p.isFollowAweme=t.hasFollowed}
            ,fail:function(e){
              t&&t(),console.log("openAwemeUserProfile fail",e)}
          }
          )}
        ,a.getSystemInfoSync=function(){
          if(d.instance.releaseType==u.applet_ziJie){
            var e=tt.getSystemInfoSync();
            return"windows"==e.platform&&(d.isZJ_PC=!0,tt.onMouseUp((function(e){
              console.log("onMouseUp",e)}
            ))),e.appName}
        }
        ,a.reportAnalyticsEvent=function(e,n){
          if(d.instance.releaseType==u.applet_ziJie)try{
            tt.reportAnalytics(e,t({
            }
            ,n)),console.log("上报事件成功:",e,n)}
          catch(e){
            console.log("上报事件失败:",e)}
        }
        ,a.checkGroupInfo=function(){
          var e=r(i().mark((function e(){
            var t,n;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(d.instance.releaseType!=u.applet_ziJie){
                  e.next=19;
                  break}
                if(t="","JJWY"!=d.GameId){
                  e.next=6;
                  break}
                t="_000us0Jt5KJHoTdDA4di2UOaDmN2YPPYrqa",e.next=9;
                break;
                case 6:if("ZGBJD"==d.GameId){
                  e.next=8;
                  break}
                return e.abrupt("return");
                case 8:t="_000zfhB5zMFS2_hts8IkINnlv-wygeA_Lhh";
                case 9:return n=this,e.prev=10,e.next=13,tt.checkGroupInfo({
                  openid:t,success:function(e){
                    console.log("checkGroupInfo success",e),n.getGroupId(e.data.groupInfoList)}
                }
                );
                case 13:return e.abrupt("return",e.sent);
                case 16:e.prev=16,e.t0=e.catch(10),console.log(e.t0);
                case 19:case"end":return e.stop()}
            }
            ),e,this,[[10,16]])}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),a.getGroupId=function(e){
          for(var t,i=n(e);
          !(t=i()).done;
          ){
            var o=t.value;
            if(Number(o.exist_num)<Number(o.max_num)){
              this.GroupId=o.group_id;
              break}
          }
        }
        ,a.joinGroup=function(){
          if(d.instance.releaseType==u.applet_ziJie){
            var e="";
            "JJWY"==d.GameId?e="@4F8A1KfEXc02PSP1NdtpQ/f91WeGOv6DPpV3oQOvKlgTbvb93nbjf2Iujgn96zUFsEzJQc/aZGKzrEfGXUFoYQ==":"ZGBJD"==d.GameId&&(e="@4F8Cg6HFBJppPiGgMYlvFKnz1WeGOv6DOZB2rAmmLVUVbfT503DoemIujgn96zUFTtbVLMdV6hci7cQprZ7+8Q=="),this.GroupId&&(e=this.GroupId),tt.joinGroup({
              groupid:e,success:function(e){
                console.log("加入群聊成功",e)}
              ,fail:function(e){
                console.log(e)}
            }
            )}
        }
        ,a.onShow=function(e){
          d.instance.releaseType==u.applet_ziJie&&tt.onShow((function(t){
            console.log("抖音回到前台"),e&&e(t)}
          ))}
        ,a.onHide=function(e){
          d.instance.releaseType==u.applet_ziJie&&tt.onHide((function(){
            console.log("抖音进入后台"),e&&e()}
          ))}
        ,a.setClipboardText=function(e){
          console.log("抖音设置剪切板文本",e),tt.setClipboardData({
            data:e,success:function(e){
              tt.showToast({
                title:"复制成功"}
              )}
            ,fail:function(e){
            }
          }
          )}
        ,o(e,null,[{
          key:"_ins",get:function(){
            return this._instance}
        }
        ]),e}
      ());
      g=m,m._instance=new g,e("TT_EVENT_KEYS",{
        FINISH_CASE:"FinishCase"}
      ),a._RF.pop()}
  }
}
))
