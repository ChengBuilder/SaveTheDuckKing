/**
 * Semantic view: chunks:///_virtual/LoadScene.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Component
 * - a => asyncToGenerator
 * - A => AudioManager
 * - b => sys
 * - B => deviceType
 * - c => ProgressBar
 * - C => ResolutionPolicy
 * - d => Node
 * - f => error
 * - F => AdManager_ZJ
 * - g => director
 * - h => SpriteFrame
 * - I => TooYueManager
 * - k => ResManager
 * - l => _decorator
 * - m => tween
 * - M => AdManager
 * - n => inheritsLoose
 * - N => GameModel
 * - o => initializerDefineProperty
 * - p => assetManager
 * - P => default
 * - r => assertThisInitialized
 * - R => AdManager_WX
 * - s => cclegacy
 * - S => View
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => Enum
 * - v => log
 * - w => UIOpacity
 */
/**
 * Restored module: chunks:///_virtual/LoadScene.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Component
 * - a => asyncToGenerator
 * - A => AudioManager
 * - b => sys
 * - B => deviceType
 * - c => ProgressBar
 * - C => ResolutionPolicy
 * - d => Node
 * - f => error
 * - F => AdManager_ZJ
 * - g => director
 * - h => SpriteFrame
 * - I => TooYueManager
 * - k => ResManager
 * - l => _decorator
 * - m => tween
 * - M => AdManager
 * - n => inheritsLoose
 * - N => GameModel
 * - o => initializerDefineProperty
 * - p => assetManager
 * - P => default
 * - r => assertThisInitialized
 * - R => AdManager_WX
 * - s => cclegacy
 * - S => View
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => Enum
 * - v => log
 * - w => UIOpacity
 */
System.register("chunks:///_virtual/LoadScene.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts","./Enum.ts","./AudioManager.ts","./ServiceManager.ts","./AdManager.ts","./TooYueManager.ts","./AdManager_ZJ.ts","./AdManager_WX.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, o /* initializerDefineProperty */, r /* assertThisInitialized */, a /* asyncToGenerator */, s /* cclegacy */, l /* _decorator */, c /* ProgressBar */, u /* Enum */, d /* Node */, h /* SpriteFrame */, p /* assetManager */, f /* error */, g /* director */, m /* tween */, v /* log */, y, _ /* Component */, b /* sys */, S /* View */, C /* ResolutionPolicy */, w /* UIOpacity */, N /* GameModel */, k /* ResManager */, T /* releaseType */, B /* deviceType */, A /* AudioManager */, P /* default */, M /* AdManager */, I /* TooYueManager */, F /* AdManager_ZJ */, R /* AdManager_WX */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,o=e.initializerDefineProperty /* initializerDefineProperty */,r=e.assertThisInitialized /* assertThisInitialized */,a=e.asyncToGenerator /* asyncToGenerator */}
,function(e){
s=e.cclegacy /* cclegacy */,l=e._decorator /* _decorator */,c=e.ProgressBar /* ProgressBar */,u=e.Enum /* Enum */,d=e.Node /* Node */,h=e.SpriteFrame /* SpriteFrame */,p=e.assetManager /* assetManager */,f=e.error /* error */,g=e.director /* director */,m=e.tween /* tween */,v=e.log /* log */,y=e.v3,_=e.Component /* Component */,b=e.sys /* sys */,S=e.View /* View */,C=e.ResolutionPolicy /* ResolutionPolicy */,w=e.UIOpacity /* UIOpacity */}
,function(e){
N=e.GameModel /* GameModel */}
,function(e){
k=e.ResManager /* ResManager */}
,function(e){
T=e.releaseType /* releaseType */,B=e.deviceType /* deviceType */}
,function(e){
A=e.AudioManager /* AudioManager */}
,function(e){
P=e.default /* default */}
,function(e){
M=e.AdManager /* AdManager */}
,function(e){
I=e.TooYueManager /* TooYueManager */}
,function(e){
F=e.AdManager_ZJ /* AdManager_ZJ */}
,function(e){
R=e.AdManager_WX /* AdManager_WX */}
],execute:function(){
var L,x,D,G,E,O,H,V,U,z,W;
s._RF.push({
}
,"4f789tl/ERM84iTUN8qRwW0","LoadScene",void 0);
var j=l.ccclass,J=l.property;
e("LoadScene",(L=j("LoadScene"),x=J(c),D=J({
type:u(T),displayName:"发布类型"}
),G=J(d),E=J([h]),L((V=t((H=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"progressBar",V,r(t)),o(t,"releaseType",U,r(t)),o(t,"titleNode",z,r(t)),o(t,"titleSprites",W,r(t)),t}
n(t,e);
var s=t.prototype;
return s.onLoad=function(){
var e=a(i().mark((function e(){
var t,n,o,r,s,l;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:return t=this,R._ins.addShareMenu(),n=b.platform,console.log("sys_platform:",n),n===b.Platform.BYTEDANCE_MINI_GAME?this.releaseType=T.applet_ziJie:n===b.Platform.WECHAT_GAME?this.releaseType=T.applet_wechat:n===b.Platform.DESKTOP_BROWSER&&(this.releaseType=T.test_TEST),this.initGameId(),N.instance.initGameModel(this.releaseType),e.next=9,this.TooYueInit();
case 9:return A.instance.init(),this.judgeCurPlatform(),N.userDeviceType==B.phone?S.instance.setResolutionPolicy(C.FIXED_WIDTH):S.instance.setResolutionPolicy(C.SHOW_ALL),k.instance.loadBundle("resources").then((function(e){
return k.instance.bundleLoadDir("resources","",null,(function(e,t){
e?console.log(e):(console.log("resource加载完成"),k.instance.saveToAssetsCache(t))}
))}
)),this.isNewDay()&&(N.instance.showSideBarNum=0,N.instance.receiveSideBarGriftNum=0,N.instance.shareSuccessNum=0,N.instance.addProgramBtnClickNum=0,N.instance.btnChangeShareNum=0,N.instance.isShowSubscribeUI=0,N.instance.addTableBtnClickNum=0),N.instance.releaseType==T.test_TEST&&(N.instance.btnChangeShareNum=0),N.instance.failNum=0,N.instance.failNum_Game2=0,N.instance.failNum_Game3=0,this.getLevelNum(),N.instance.isFromLoad=!0,o=this.progressBar.node.getChildByName("loadNode"),r=this.progressBar.node.getChildByName("reStartNode"),m(o.getComponent(w)).delay(2).to(.2,{
opacity:0}
).start(),m(r.getComponent(w)).delay(2.2).to(.2,{
opacity:255}
).start(),s=.1,N.instance.releaseType!=T.test_TEST&&(s=.1),l=this.progressBar.node.getChildByName("duck"),m(l).to(.2,{
angle:-15}
).to(.4,{
angle:15}
).to(.2,{
angle:0}
).union().repeatForever().start(),m(l).to(.1,{
position:y(0,l.position.y)}
).start(),m(this.progressBar).to(.1,{
progress:.5}
).start(),e.next=30,k.instance.loadBundle("uiBundle");
case 30:return m(l).to(s,{
position:y(70,l.position.y)}
).start(),m(this.progressBar).to(s,{
progress:.6}
).start(),e.next=34,k.instance.loadBundle("Game2Bundle");
case 34:return e.next=36,new Promise((function(e,t){
k.instance.bundleLoadDir("Game2Bundle","",null,a(i().mark((function n(o,r){
return i().wrap((function(n){
for(;
;
)switch(n.prev=n.next){
case 0:if(!o){
n.next=2;
break}
return n.abrupt("return",(console.log(o),t(o)));
case 2:return console.log("resource加载完成"),n.prev=3,n.next=6,k.instance.saveToAssetsCache(r);
case 6:e(),n.next=12;
break;
case 9:n.prev=9,n.t0=n.catch(3),t(n.t0);
case 12:case"end":return n.stop()}
}
),n,null,[[3,9]])}
))))}
));
case 36:return e.next=38,k.instance.loadBundle("HomeBundle");
case 38:return m(l).to(s,{
position:y(140,l.position.y)}
).start(),m(this.progressBar).to(s,{
progress:.7}
).start(),e.next=42,k.instance.loadBundle("aniBundle");
case 42:return m(l).to(s,{
position:y(210,l.position.y)}
).start(),m(this.progressBar).to(s,{
progress:.8}
).start(),e.next=46,k.instance.loadBundle("DuckBundle");
case 46:return m(l).to(s,{
position:y(280,l.position.y)}
).start(),e.next=49,F._ins.checkFeedSubscribe();
case 49:return e.next=51,F._ins.getLaunchOptionsSync();
case 51:I.startGameScene=e.sent,I.isFromFeed=I._ins.judgeIsFromFeed(),console.log("是否从推荐流直玩启动:",I.isFromFeed),m(this.progressBar).to(s,{
progress:.9}
).call((function(){
null!==N.instance.level&&void 0!==N.instance.level||(N.instance.level=1),1===N.instance.level||I.isFromFeed?t.loadInScene(N.instance.DuckSceneName):t.loadInScene(N.instance.HomeSceneName)}
)).start();
case 55:case"end":return e.stop()}
}
),e,this)}
)));
return function(){
return e.apply(this,arguments)}
}
(),s.initGameId=function(){
N.GameId="JJWY","JJWY"==N.GameId?N.instance.GameName="JiuJiuWoYa_Pro":"ZGBJD"==N.GameId&&(N.instance.GameName="JiuJiuWoYa",I.sub_Content_id=I.sub_Content_id_ZGBJD,I.sub_Next_Content_id_2=I.sub_Next_Content_id_ZGBJD)}
,s.TooYueInit=function(){
var e=a(i().mark((function e(){
var t,n,o,r;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:if(console.log("TooYueInit"),r=!1,e.prev=2,"undefined"!=typeof wx&&wx.getSystemInfoSync)try{
r="devtools"===wx.getSystemInfoSync().platform}
catch(e){
console.warn("读取微信环境失败，继续使用默认启动流程",e)}
if(!r){
e.next=8;
break}
return console.warn("检测到微信开发者工具，跳过 TooYue 第三方初始化"),this.getServerData(),e.abrupt("return",null);
case 8:if("JJWY"!=N.GameId){
e.next=21;
break}
if(N.instance.releaseType!=T.applet_ziJie){
e.next=15;
break}
return e.next=13,I._ins.initTooYue("ttjjwy","ttdb46adfb445c4cf702");
case 13:e.next=19;
break;
case 15:if(e.t0=N.instance.releaseType==T.applet_wechat,!e.t0){
e.next=19;
break}
return e.next=19,I._ins.initTooYue("wxjjwy","wx244b1cb66c8ac4b4");
case 19:e.next=25;
break;
case 21:if(e.t1="ZGBJD"==N.GameId,!e.t1){
e.next=25;
break}
return e.next=25,I._ins.initTooYue("ttzgbjdty","ttf527839a6a11248902");
case 25:return console.log("TooYueLogin"),e.prev=26,e.next=29,I._ins.loginTooYue();
case 29:return(t=e.sent)&&(I.userMsg=t,I.shortId=t.shortId,I.shareUserCount=t.shareUserCount),console.log("checkFollowAwemeState"),e.next=34,F._ins.checkFollowAwemeState();
case 34:return this.getServerData(),e.next=37,I._ins.checkSidebarStatus();
case 37:return n=e.sent,N.SideState=n,e.next=41,I._ins.checkAddDesktopState();
case 41:return o=e.sent,N.AddDesktopState=o,e.next=45,I._ins.getDynamicConfig();
case 45:return I._ins.checkFeedBack(),F._ins.getSystemInfoSync(),F._ins.checkGroupInfo(),I._ins.onShareAppMessage(),I._ins.onShareTimeline(),e.abrupt("return",null);
case 49:return e.prev=49,e.t2=e.catch(26),console.warn("TooYueInit 失败，使用本地调试兜底继续",e.t2),this.getServerData(),e.abrupt("return",null);
case 53:case"end":return e.stop()}
}
),e,this,[[26,49]])}
)));
return function(){
return e.apply(this,arguments)}
}
(),s.judgeCurPlatform=function(){
var e,t,n,i,o,r,a,s=(e=navigator.userAgent,t=/(?:Windows Phone)/.test(e),n=/(?:SymbianOS)/.test(e)||t,i=/(?:Android)/.test(e),o=/(?:Firefox)/.test(e),/(?:Chrome|CriOS)/.test(e),{
isTablet:r=/(?:iPad|PlayBook)/.test(e)||i&&!/(?:Mobile)/.test(e)||o&&/(?:Tablet)/.test(e),isPhone:a=/(?:iPhone)/.test(e)&&!r,isAndroid:i,isPc:!a&&!i&&!n}
);
s.isAndroid||s.isPhone?(console.log("手机"),N.userDeviceType=B.phone):s.isTablet?(console.log("平板"),N.userDeviceType=B.pad):s.isPc&&(console.log("电脑"),N.userDeviceType=B.pc)}
,s.reStart=function(){
console.log("reStart"),p.cacheManager&&p.cacheManager.clearCache(),M.reStart()}
,s.isNewDay=function(){
var e=N.instance.lastLoginTime||0,t=Date.now(),n=new Date(e),i=new Date(t),o=n.getFullYear()===i.getFullYear()&&n.getMonth()===i.getMonth()&&n.getDate()===i.getDate();
return N.instance.lastLoginTime=t,!o}
,s.getLevelNum=function(){
}
,s.getServerData=function(){
var e=a(i().mark((function e(){
var t,n,o,r,a,s,l,c,u,d,h,p,f,g,m,v;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:if(N.instance.releaseType==T.test_TEST){
e.next=24;
break}
return t=N.instance.loadFromLocal("gameLevel",1),n=N.instance.loadFromLocal("gameLevel2",1),o=N.instance.loadFromLocal("gameLevel3",1),e.next=6,I._ins.getUserStorage();
case 6:if(r=e.sent,console.log("userData:",r),r.exists){
e.next=9;
break}
return e.abrupt("return",(console.log("不存在的存档,设置本地关卡数为本地关卡数"),void P.instance.setStorageToServer()));
case 9:if((a=Number(r.data.level)||1)>t?(console.log("服务器关卡数大于本地关卡数，更新本地关卡数"),N.instance.level=a):a<t?(console.log("服务器关卡数小于本地关卡数，更新本地关卡数"),N.instance.level=t):a==t&&(console.log("服务器关卡数等于本地关卡数，不更新本地关卡数"),N.instance.level=t),(s=Number(r.data.level2)||1)>n?(console.log("服务器关卡数大于本地关卡数，更新本地关卡数"),N.instance.level2=s):s<n?(console.log("服务器关卡数小于本地关卡数，更新本地关卡数"),N.instance.level2=n):s==n&&(console.log("服务器关卡数等于本地关卡数，不更新本地关卡数"),N.instance.level2=n),(l=Number(r.data.level3)||1)>o?(console.log("服务器关卡数大于本地关卡数，更新本地关卡数"),N.instance.level3=l):l<o?(console.log("服务器关卡数小于本地关卡数，更新本地关卡数"),N.instance.level3=o):l==o&&(console.log("服务器关卡数等于本地关卡数，不更新本地关卡数"),N.instance.level3=o),Number(N.instance.isAlreadyFeed),(c=Number(r.data.subscribe))&&(1==c?N.instance.isAlreadyFeed=1:0==c&&(N.instance.isAlreadyFeed=0)),u=N.instance.pigeonNumArr,(d=JSON.parse(r.data.pigeonNumArr)||[]).length<N.PigeonTotalNum)for(h=N.PigeonTotalNum-d.length,p=0;
p<h;
p++)d.push(0);
for(f=[],g=0;
g<N.PigeonTotalNum;
g++)d[g]>u[g]?f.push(d[g]):f.push(u[g]);
N.instance.pigeonNumArr=f,m=Number(N.instance.shareLevel)||0,v=Number(r.data.shareLevel),Number.isNaN(v)&&(v=0),N.instance.shareLevel=Math.max(m,v),null==N.instance.level&&(N.instance.level=t),null==N.instance.level2&&(N.instance.level2=n),P.instance.setStorageToServer();
case 24:case"end":return e.stop()}
}
),e)}
)));
return function(){
return e.apply(this,arguments)}
}
(),s.getLevelNumFromServer=function(){
}
,s.getLevelNumFromUnionid=function(){
}
,s.onProgress=function(e,t){
}
,s.onComplete=function(e,t){
if(e)f("[LoadScene] 加载bundle场景失败:",e);
else{
M.onShow((function(){
g.getScene().name!=N.instance.FruitSceneName?A.instance.playMusic("bgm/defaultGameplay"):A.instance.playMusic("fruitGame/fruitBgm")}
)),M.onHide((function(){
A.instance.stopMusic()}
)),m(this.progressBar).to(.1,{
progress:1}
).call((function(){
v("加载完成"),g.loadScene(t)}
)).start();
var n=this.progressBar.node.getChildByName("duck");
m(n).to(.1,{
position:y(350,n.position.y)}
).start()}
}
,s.loadInScene=function(e){
M.onShow((function(){
g.getScene().name!=N.instance.FruitSceneName?A.instance.playMusic("bgm/defaultGameplay"):A.instance.playMusic("fruitGame/fruitBgm")}
)),M.onHide((function(){
A.instance.stopMusic()}
)),m(this.progressBar).to(.1,{
progress:1}
).call((function(){
v("加载完成"),g.loadScene(e)}
)).start();
var t=this.progressBar.node.getChildByName("duck");
m(t).to(.1,{
position:y(350,t.position.y)}
).start()}
,t}
(_)).prototype,"progressBar",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),U=t(H.prototype,"releaseType",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return T.test_TEST}
}
),z=t(H.prototype,"titleNode",[G],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),W=t(H.prototype,"titleSprites",[E],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),O=H))||O)),s._RF.pop()}
}
}
))

