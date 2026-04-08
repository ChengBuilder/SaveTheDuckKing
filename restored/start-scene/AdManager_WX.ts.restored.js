/**
 * Restored module: chunks:///_virtual/AdManager_WX.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => find
 * - c => Util
 * - d => DuckController
 * - h => Game2Controller
 * - i => resources
 * - l => releaseType
 * - n => cclegacy
 * - o => Asset
 * - r => director
 * - s => GameModel
 * - t => createClass
 * - u => AudioManager
 */
System.register("chunks:///_virtual/AdManager_WX.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./Enum.ts","./Util.ts","./AudioManager.ts","./DuckController.ts","./Game2Controller.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h;
return{
setters:[function(e){
t=e.createClass}
,function(e){
n=e.cclegacy,i=e.resources,o=e.Asset,r=e.director,a=e.find}
,function(e){
s=e.GameModel}
,function(e){
l=e.releaseType}
,function(e){
c=e.Util}
,function(e){
u=e.AudioManager}
,function(e){
d=e.DuckController}
,function(e){
h=e.Game2Controller}
],execute:function(){
var p;
n._RF.push({
}
,"40cc7Qm/YlF+Zx9cAaPeilJ","AdManager_WX",void 0);
var f=e("AdManager_WX",function(){
function e(){
this.app_id="wx244b1cb66c8ac4b4",this.ad_video_id="",this.ad_banner=null,this.ad_video=null,this.gameName="",this.videoBack=void 0,this.errorBack=void 0,this.imgUrlArr=[],this.titleArr=["救救我鸭"]}
var n=e.prototype;
return n.loadAllAd=function(){
s.instance.releaseType==l.applet_wechat&&(this.initVideoAd(),this.addShareMenu())}
,n.initVideoAd=function(){
var e=this;
this.ad_video=wx.createRewardedVideoAd({
adUnitId:this.ad_video_id}
),this.ad_video.load().then((function(){
console.log("视频广告加载完成!")}
)).catch((function(e){
console.log("视频加载失败:"+e.errMsg)}
)),this.ad_video.onError((function(t){
e.errorVideo(),console.log("视频出错:"+t)}
)),this.ad_video.onClose((function(t){
t&&t.isEnded||void 0===t?(console.log("正常播放结束，可以下发游戏奖励"),e.finishVideo()):(e.errorVideo(!0),console.log("播放中途退出，不下发游戏奖励"))}
))}
,n.initBanner=function(){
}
,n.showBanner=function(){
s.instance.releaseType==l.applet_wechat&&(this.ad_banner||this.initBanner(),this.ad_banner.show())}
,n.hideBanner=function(){
s.instance.releaseType==l.applet_wechat&&this.ad_banner&&this.ad_banner.hide()}
,n.showIntersAd=function(){
}
,n.showVideoAd=function(e,t){
var n=this;
s.instance.releaseType==l.applet_wechat&&(this.videoBack=null,this.errorBack=null,e&&(this.videoBack=e),t&&(this.errorBack=t),this.ad_video||this.initVideoAd(),this.ad_video.show().then((function(){
console.log("广告显示成功")}
)).catch((function(e){
n.errorVideo(),console.log("广告组件出现问题",e),n.ad_video.load().then((function(){
console.log("手动加载成功"),n.ad_video.show()}
))}
)))}
,n.finishVideo=function(){
this.videoBack&&(this.videoBack(),1===s.instance.musicFlag&&(u.instance.stopMusic(),u.instance.playMusic("bgm/defaultGameplay",.5))),this.videoBack=null,this.errorBack=null}
,n.errorVideo=function(e){
void 0===e&&(e=!1),this.errorBack&&this.errorBack(e),this.videoBack=null,this.errorBack=null}
,n.shareFriends=function(e,t){
void 0===t&&(t="share"),s.instance.releaseType==l.applet_wechat&&(e=e||"快来大战25个回合~~",i.load(t,o,(function(t,n){
wx.shareAppMessage({
title:e,imageUrl:n.nativeUrl,success:function(e){
console.log("分享成功:",e)}
,fail:function(e){
wx.showToast({
title:"分享失败",icon:"none",duration:1500}
)}
}
)}
)))}
,n.addShareMenu=function(e,t){
s.instance.releaseType==l.applet_wechat&&(wx.showShareMenu({
withShareTicket:!0,menus:["shareAppMessage","shareTimeline"]}
),wx.onShareAppMessage((function(){
return{
}
}
)))}
,n.toMoreGame=function(){
s.instance.releaseType==l.applet_wechat&&wx.navigateToMiniProgram({
appId:"",path:"page/index/index?id=123",extraData:{
foo:"bar"}
,envVersion:"develop",success:function(e){
}
}
)}
,n.vibrate=function(e){
void 0===e&&(e="medium"),wx.vibrateShort({
type:e}
)}
,n.vibrateLong=function(){
wx.vibrateLong()}
,n.addTable=function(){
}
,n.isAddTable=function(){
}
,n.shareGame=function(e,t){
if(s.instance.releaseType==l.applet_wechat){
wx.showShareMenu();
var n=this.titleArr[c.getRandomNum(0,this.titleArr.length-1,!0)];
wx.shareAppMessage({
title:n,imageUrl:this.imgUrlArr[c.getRandomNum(0,this.imgUrlArr.length-1,!0)]}
)}
}
,n.login=function(){
}
,n.reStart=function(){
wx.restartMiniProgram()}
,n.StartGyroscope=function(e){
if(s.instance.releaseType==l.applet_wechat){
var t=this;
t._gyroListener&&wx.offGyroscopeChange&&wx.offGyroscopeChange(t._gyroListener),t._gyroListener=function(e){
if(e.x>2||e.x<-2){
var t=e.x;
e.x>5?t=5:e.x<-5&&(t=-5),r.getScene().name==s.instance.DuckSceneName?a("Canvas").getComponent(d).woodAddLinerVelocity(-t,0):r.getScene().name==s.instance.Game2SceneName&&a("Canvas").getComponent(h).moveFruitByGyroscope(t,0)}
}
;
var n=function(){
wx.onGyroscopeChange(t._gyroListener)}
;
wx.startGyroscope({
interval:"game",success:function(e){
console.log("调用成功:",e),n()}
,fail:function(e){
console.warn("调用失败:",e),wx.startGyroscope({
success:function(e){
console.log("降级调用成功:",e),n()}
,fail:function(e){
console.warn("降级调用失败:",e)}
}
)}
}
)}
}
,n.StopGyroscope=function(){
if(s.instance.releaseType==l.applet_wechat){
var e=this;
e._gyroListener&&wx.offGyroscopeChange&&wx.offGyroscopeChange(e._gyroListener),e._gyroListener=null,wx.stopGyroscope&&wx.stopGyroscope({
}
)}
}
,n.onShow=function(e){
wx.onShow((function(t){
console.log("小程序进入前台",t),e&&e(t)}
))}
,n.onHide=function(e){
wx.onHide((function(t){
console.log("小程序进入后台",t),e&&e(t)}
))}
,t(e,null,[{
key:"_ins",get:function(){
return this._instance}
}
]),e}
());
p=f,f._instance=new p,n._RF.pop()}
}
}
))
