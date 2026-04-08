/**
 * Restored module: chunks:///_virtual/OverPigeonPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => GameModel
 * - a => _decorator
 * - A => ResManager
 * - b => AudioManager
 * - B => UIConfigTable
 * - c => UIOpacity
 * - C => releaseType
 * - d => UITransform
 * - f => Prefab
 * - g => instantiate
 * - i => initializerDefineProperty
 * - I => AutoManager
 * - k => GameCtrl
 * - l => Button
 * - m => find
 * - M => TooYueManager
 * - n => inheritsLoose
 * - N => default
 * - o => assertThisInitialized
 * - p => assetManager
 * - P => AddPowerPanelView
 * - r => cclegacy
 * - s => Node
 * - S => AdManager
 * - t => applyDecoratedDescriptor
 * - T => Util
 * - u => tween
 * - v => director
 * - w => EVENT_KEYS
 * - y => Component
 */
System.register("chunks:///_virtual/OverPigeonPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./AudioManager.ts","./AdManager.ts","./Enum.ts","./EventManager.ts","./GameCtrl.ts","./Util.ts","./ConfigTable.ts","./ResManager.ts","./AddPowerPanelView.ts","./TooYueManager.ts","./AutoManager.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.Button,c=e.UIOpacity,u=e.tween,d=e.UITransform,h=e.v3,p=e.assetManager,f=e.Prefab,g=e.instantiate,m=e.find,v=e.director,y=e.Component}
,function(e){
_=e.GameModel}
,function(e){
b=e.AudioManager}
,function(e){
S=e.AdManager}
,function(e){
C=e.releaseType,w=e.EVENT_KEYS}
,function(e){
N=e.default}
,function(e){
k=e.GameCtrl}
,function(e){
T=e.Util}
,function(e){
B=e.UIConfigTable}
,function(e){
A=e.ResManager}
,function(e){
P=e.AddPowerPanelView}
,function(e){
M=e.TooYueManager}
,function(e){
I=e.AutoManager}
],execute:function(){
var F,R,L,x,D,G,E,O,H,V,U,z,W,j,J,Y,q,K,X;
r._RF.push({
}
,"6ed6fy55VpMAL5BE2ZwjfRW","OverPigeonPanelView",void 0);
var Q=a.ccclass,Z=a.property;
e("OverPigeonPanelView",(F=Q("OverPigeonPanelView"),R=Z(s),L=Z(s),x=Z(l),D=Z(l),G=Z(l),E=Z(l),O=Z(l),H=Z(s),F((z=t((U=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",z,o(t)),i(t,"panel",W,o(t)),i(t,"replayBtn",j,o(t)),i(t,"goHomeBtn",J,o(t)),i(t,"shareVideoBtn",Y,o(t)),i(t,"shareBtn",q,o(t)),i(t,"goSideBarBtn",K,o(t)),i(t,"aniNode",X,o(t)),t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
_.instance.pigeonLevel=1,M._ins.showInterstitialAd("失败"),b.instance.playSound("ui/failureStinger",.8),this.initUi(),this.uiAnimation()}
,r.start=function(){
var e=this;
S.stopScreenVideo(),I._ins.isAuto&&this.scheduleOnce((function(){
e.onReplay()}
),2+T.getRandomNum(2,4))}
,r.initUi=function(){
if(_.instance.releaseType==C.applet_wechat&&(this.shareVideoBtn.node.active=!1,this.goSideBarBtn.node.active=!1),0==_.instance.receiveSideBarGriftNum){
var e=this.goSideBarBtn.node.getChildByName("奖");
e.active=!0,T.btnShake(e)}
}
,r.uiAnimation=function(){
var e=this;
this.black.getComponent(c).opacity=0,u(this.black.getComponent(c)).to(.1,{
opacity:220}
).call((function(){
k.instance.btnCanTouch=!0}
)).start();
var t=_.instance.screenWidth,n=_.instance.screenHeight,i=this.panel.getChildByName("banner"),o=i.position.y;
i.y=n/2+i.getComponent(d).height/2,h(this.aniNode.scale);
var r=this.shareBtn.node.x;
this.shareBtn.node.x=t/2+this.shareBtn.getComponent(d).width/2;
var a=this.shareVideoBtn.node.x;
this.shareVideoBtn.node.x=-t/2-this.shareVideoBtn.getComponent(d).width/2;
var s=this.goSideBarBtn.node.x;
this.goSideBarBtn.node.x=-t/2-this.goSideBarBtn.getComponent(d).width/2;
var l=h(this.replayBtn.node.scale);
this.replayBtn.node.setScale(0,0,0);
var p=h(this.goHomeBtn.node.scale);
if(this.goHomeBtn.node.setScale(0,0,0),u(i).to(.5,{
y:o}
,{
easing:"backOut"}
).start(),u(this.shareBtn.node).delay(1).to(.35,{
x:r}
,{
easing:"backOut"}
).start(),_.instance.shareSuccessNum<M._ins.shareGift){
var f=this.shareBtn.node.getChildByName("shareTips");
u(f).delay(1.35).to(.2,{
scale:h(1.1,.9)}
).to(.1,{
scale:h(.9,1.1)}
).to(.1,{
scale:h(1,1)}
).start()}
u(this.shareVideoBtn.node).delay(1).to(.35,{
x:a}
,{
easing:"backOut"}
).start(),u(this.goSideBarBtn.node).delay(1).to(.35,{
x:s}
,{
easing:"backOut"}
).start(),u(this.replayBtn.node).delay(1.35).to(.5,{
scale:l}
,{
easing:"backOut"}
).call((function(){
T.btnShake(e.replayBtn.node)}
)).start(),u(this.goHomeBtn.node).delay(1.7).to(.5,{
scale:p}
,{
easing:"backOut"}
).start()}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents(),p.getBundle("uiBundle").release(B.OverUI.path,f)}
,r.closeShareTips=function(){
this.shareBtn.node.getChildByName("shareTips").active=!1}
,r.registerEvents=function(){
this.replayBtn.node.on("click",this.onReplay,this),this.goHomeBtn.node.on("click",this.onGoHome,this),this.shareBtn.node.on("click",this.share,this),this.shareVideoBtn.node.on("click",this.shareVideo,this),N.instance.on(w.CLOSE_SHARETIPS,this.closeShareTips,this),this.goSideBarBtn.node.on("click",this.goSideBarBack,this),N.instance.on(w.SIDE_REWARD,this.closeTips,this)}
,r.unregisterEvents=function(){
var e,t,n,i,o;
null!=(e=this.replayBtn)&&e.node&&this.replayBtn.node.off("click",this.onReplay,this),null!=(t=this.goHomeBtn)&&t.node&&this.goHomeBtn.node.off("click",this.onGoHome,this),null!=(n=this.shareBtn)&&n.node&&this.shareBtn.node.off("click",this.share,this),null!=(i=this.shareVideoBtn)&&i.node&&this.shareVideoBtn.node.off("click",this.shareVideo,this),null!=(o=this.goSideBarBtn)&&o.node&&this.goSideBarBtn.node.off("click",this.goSideBarBack,this),N.instance.off(w.CLOSE_SHARETIPS,this.closeShareTips,this),N.instance.off(w.SIDE_REWARD,this.closeTips,this)}
,r.onReplay=function(){
var e=this;
k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick"),b.instance.playMusic("bgm/defaultGameplay",.5),_.instance.userPowerNum>0?(_.instance.subPowerNum(),b.instance.playSound("ui/powerConsume"),u(this.panel).to(.3,{
position:h(0,_.instance.screenHeight)}
,{
easing:"backIn"}
).start(),u(this.black.getComponent(c)).delay(.3).to(.1,{
opacity:0}
).call((function(){
N.instance.emit(w.REPLAY),e.node.destroy()}
)).start()):(console.log("体力不足"),A.instance.bundleLoad("uiBundle",B.AddPowerPanel.path,null,(function(t,n){
if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
var i=g(n);
i.parent=m("Canvas");
var o=i.getComponent(P);
o.purpose="ReplayGuessScene",o.showAdCallFunc=e.onReplay.bind(e)}
))))}
,r.onGoHome=function(){
this.goHomeBtn.interactable=!1,b.instance.playSound("ui/buttonClick"),v.loadScene(_.instance.HomeSceneName)}
,r.share=function(){
var e=this;
b.instance.playSound("ui/buttonClick"),_.instance.shareSuccessNum<M._ins.shareGift?A.instance.bundleLoad("uiBundle",B.ShareUI.path,null,(function(t,n){
if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
g(n).parent=e.node}
)):(M._ins.shareApp(),k.instance.btnCanTouch=!0)}
,r.shareVideo=function(){
b.instance.playSound("ui/buttonClick"),M._ins.stopAndShareRecord()}
,r.goSideBarBack=function(){
var e=this;
!1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("侧边栏"),b.instance.playSound("ui/buttonClick"),A.instance.bundleLoad("uiBundle",B.SideBarUI.path,null,(function(t,n){
t?console.log(t):g(n).parent=e.node}
)))}
,r.closeTips=function(){
this.goSideBarBtn.node.getChildByName("奖").active=!1}
,t}
(y)).prototype,"black",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),W=t(U.prototype,"panel",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),j=t(U.prototype,"replayBtn",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),J=t(U.prototype,"goHomeBtn",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),Y=t(U.prototype,"shareVideoBtn",[G],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),q=t(U.prototype,"shareBtn",[E],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),K=t(U.prototype,"goSideBarBtn",[O],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),X=t(U.prototype,"aniNode",[H],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=U))||V)),r._RF.pop()}
}
}
))
