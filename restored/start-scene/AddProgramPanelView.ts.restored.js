/**
 * Restored module: chunks:///_virtual/AddProgramPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => AudioManager
 * - a => _decorator
 * - b => GameModel
 * - c => SpriteFrame
 * - C => UIConfigTable
 * - d => UIOpacity
 * - f => Prefab
 * - g => Sprite
 * - i => initializerDefineProperty
 * - l => Button
 * - m => instantiate
 * - n => inheritsLoose
 * - N => ReceivePanelView
 * - o => assertThisInitialized
 * - p => assetManager
 * - r => cclegacy
 * - s => Node
 * - S => ResManager
 * - t => applyDecoratedDescriptor
 * - u => tween
 * - v => find
 * - w => GameCtrl
 * - y => Component
 */
System.register("chunks:///_virtual/AddProgramPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./ConfigTable.ts","./GameCtrl.ts","./ReceivePanelView.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.Button,c=e.SpriteFrame,u=e.tween,d=e.UIOpacity,h=e.v3,p=e.assetManager,f=e.Prefab,g=e.Sprite,m=e.instantiate,v=e.find,y=e.Component}
,function(e){
_=e.AudioManager}
,function(e){
b=e.GameModel}
,function(e){
S=e.ResManager}
,function(e){
C=e.UIConfigTable}
,function(e){
w=e.GameCtrl}
,function(e){
N=e.ReceivePanelView}
],execute:function(){
var k,T,B,A,P,M,I,F,R,L,x,D,G,E,O;
r._RF.push({
}
,"edc83vYJeRLkb6N8bglnPYj","AddProgramPanelView",void 0);
var H=a.ccclass,V=a.property;
e("AddProgramPanelView",(k=H("AddProgramPanelView"),T=V(s),B=V(s),A=V(l),P=V(l),M=V([c]),I=V([c]),k((L=t((R=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",L,o(t)),i(t,"panel",x,o(t)),i(t,"closeBtn",D,o(t)),i(t,"receiveBtn",G,o(t)),i(t,"btnSpriteFrame",E,o(t)),i(t,"btnWordSpriteFrame",O,o(t)),t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.initPanel()}
,r.start=function(){
u(this.black.getComponent(d)).to(.1,{
opacity:220}
).start(),u(this.panel).delay(.1).to(.3,{
position:h(0,0,0)}
,{
easing:"backOut"}
).call((function(){
w.instance.btnCanTouch=!0}
)).start()}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents(),p.getBundle("uiBundle").release(C.AddTableUI.path,f)}
,r.initPanel=function(){
this.black.getComponent(d).opacity=0,this.panel.setPosition(0,b.instance.screenHeight),this.panel.setScale(1,1,1),b.instance.addProgramBtnClickNum<=0?(this.receiveBtn.node.getComponent(g).spriteFrame=this.btnSpriteFrame[0],this.receiveBtn.node.getChildByName("word").getComponent(g).spriteFrame=this.btnWordSpriteFrame[0]):(this.receiveBtn.node.getComponent(g).spriteFrame=this.btnSpriteFrame[1],this.receiveBtn.node.getChildByName("word").getComponent(g).spriteFrame=this.btnWordSpriteFrame[1],this.receiveBtn.interactable=!1)}
,r.registerEvents=function(){
this.receiveBtn.node.on("click",this.onReceive,this),this.closeBtn.node.on("click",this.onClose,this)}
,r.unregisterEvents=function(){
this.receiveBtn.node.off("click",this.onReceive,this),this.closeBtn.node.off("click",this.onClose,this)}
,r.onClose=function(){
var e=this;
w.instance.btnCanTouch&&(w.instance.btnCanTouch=!1,_.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
position:h(0,b.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),w.instance.btnCanTouch=!0}
)).start())}
,r.onReceive=function(){
var e=this;
w.instance.btnCanTouch&&(this.receiveBtn.interactable=!1,w.instance.btnCanTouch=!1,_.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
position:h(0,b.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy()}
)).start(),0==b.instance.addProgramBtnClickNum?S.instance.bundleLoad("uiBundle",C.ReceiveUI.path,null,(function(e,t){
if(e)return console.log(e),void(w.instance.btnCanTouch=!0);
var n=m(t);
n.parent=v("Canvas"),n.getComponent(N).setPanel(3),b.instance.addProgramBtnClickNum=1,v("Canvas/addProgramBtn/th").active=!1}
)):w.instance.btnCanTouch=!0)}
,t}
(y)).prototype,"black",[T],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),x=t(R.prototype,"panel",[B],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),D=t(R.prototype,"closeBtn",[A],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),G=t(R.prototype,"receiveBtn",[P],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),E=t(R.prototype,"btnSpriteFrame",[M],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),O=t(R.prototype,"btnWordSpriteFrame",[I],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),F=R))||F)),r._RF.pop()}
}
}
))
