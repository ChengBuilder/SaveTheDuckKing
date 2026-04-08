/**
 * Restored module: chunks:///_virtual/SideBarPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => director
 * - a => asyncToGenerator
 * - b => find
 * - B => TooYueManager
 * - c => Node
 * - C => GameModel
 * - d => SpriteFrame
 * - g => assetManager
 * - h => tween
 * - k => UIConfigTable
 * - l => _decorator
 * - m => Prefab
 * - n => inheritsLoose
 * - N => releaseType
 * - o => initializerDefineProperty
 * - p => UIOpacity
 * - r => assertThisInitialized
 * - s => cclegacy
 * - S => AudioManager
 * - t => applyDecoratedDescriptor
 * - T => HomeScene
 * - u => Button
 * - v => Sprite
 * - w => GameCtrl
 * - y => Component
 */
System.register("chunks:///_virtual/SideBarPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./GameCtrl.ts","./Enum.ts","./ConfigTable.ts","./HomeScene.ts","./TooYueManager.ts"],(function(e){
var t,n,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,o=e.initializerDefineProperty,r=e.assertThisInitialized,a=e.asyncToGenerator}
,function(e){
s=e.cclegacy,l=e._decorator,c=e.Node,u=e.Button,d=e.SpriteFrame,h=e.tween,p=e.UIOpacity,f=e.v3,g=e.assetManager,m=e.Prefab,v=e.Sprite,y=e.Component,_=e.director,b=e.find}
,function(e){
S=e.AudioManager}
,function(e){
C=e.GameModel}
,function(e){
w=e.GameCtrl}
,function(e){
N=e.releaseType}
,function(e){
k=e.UIConfigTable}
,function(e){
T=e.HomeScene}
,function(e){
B=e.TooYueManager}
],execute:function(){
var A,P,M,I,F,R,L,x,D,G,E,O,H,V,U;
s._RF.push({
}
,"a7eb893MoVBCrpMpO9HHwR2","SideBarPanelView",void 0);
var z=l.ccclass,W=l.property;
e("SideBarPanelView",(A=z("SideBarPanelView"),P=W(c),M=W(c),I=W(u),F=W(u),R=W([d]),L=W([d]),A((G=t((D=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"black",G,r(t)),o(t,"panel",E,r(t)),o(t,"closeBtn",O,r(t)),o(t,"goSideBarBtn",H,r(t)),o(t,"btnSpres",V,r(t)),o(t,"btnWordSpres",U,r(t)),t}
n(t,e);
var s=t.prototype;
return s.onLoad=function(){
this.initPanel()}
,s.start=function(){
h(this.black.getComponent(p)).to(.1,{
opacity:220}
).start(),h(this.panel).delay(.1).to(.3,{
position:f(0,0,0)}
,{
easing:"backOut"}
).call((function(){
w.instance.btnCanTouch=!0}
)).start()}
,s.onEnable=function(){
this.registerEvents()}
,s.onDisable=function(){
this.unregisterEvents(),g.getBundle("uiBundle").release(k.SideBarUI.path,m)}
,s.initPanel=function(){
this.black.getComponent(p).opacity=0,this.panel.setPosition(0,C.instance.screenHeight),this.panel.setScale(1,1,1),0===C.instance.receiveSideBarGriftNum?(this.goSideBarBtn.node.getComponent(v).spriteFrame=this.btnSpres[0],this.goSideBarBtn.node.getChildByName("word").getComponent(v).spriteFrame=this.btnWordSpres[0]):(this.goSideBarBtn.node.getComponent(v).spriteFrame=this.btnSpres[1],this.goSideBarBtn.node.getChildByName("word").getComponent(v).spriteFrame=this.btnWordSpres[1],this.goSideBarBtn.interactable=!1)}
,s.registerEvents=function(){
this.goSideBarBtn.node.on("click",this.onGoSideBar,this),this.closeBtn.node.on("click",this.onClose,this)}
,s.unregisterEvents=function(){
this.goSideBarBtn.node.off("click",this.onGoSideBar,this),this.closeBtn.node.off("click",this.onClose,this)}
,s.onClose=function(){
var e=this;
w.instance.btnCanTouch&&(w.instance.btnCanTouch=!1,S.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
position:f(0,C.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),w.instance.btnCanTouch=!0}
)).start())}
,s.onGoSideBar=function(){
var e=a(i().mark((function e(){
var t;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:t=this,w.instance.btnCanTouch&&(this.goSideBarBtn.interactable=!1,w.instance.btnCanTouch=!1,S.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
position:f(0,C.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
opacity:0}
).call(a(i().mark((function e(){
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:return C.instance.releaseType===N.test_TEST&&C.instance.receiveSideBarGriftNum<=0&&"HomeScene"===_.getScene().name&&b("Canvas").getComponent(T).showReceivePanel(),e.next=3,B._ins.navigateToSideBar();
case 3:w.instance.btnCanTouch=!0,t.node.destroy();
case 5:case"end":return e.stop()}
}
),e)}
)))).start());
case 2:case"end":return e.stop()}
}
),e,this)}
)));
return function(){
return e.apply(this,arguments)}
}
(),t}
(y)).prototype,"black",[P],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),E=t(D.prototype,"panel",[M],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),O=t(D.prototype,"closeBtn",[I],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(D.prototype,"goSideBarBtn",[F],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=t(D.prototype,"btnSpres",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),U=t(D.prototype,"btnWordSpres",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),x=D))||x)),s._RF.pop()}
}
}
))
