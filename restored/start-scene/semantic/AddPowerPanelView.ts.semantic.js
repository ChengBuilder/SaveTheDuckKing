/**
 * Semantic view: chunks:///_virtual/AddPowerPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => UIConfigTable
 * - a => _decorator
 * - b => GameCtrl
 * - c => SpriteFrame
 * - C => releaseType
 * - d => tween
 * - f => assetManager
 * - g => Prefab
 * - h => UIOpacity
 * - i => initializerDefineProperty
 * - l => Button
 * - m => Component
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - r => cclegacy
 * - s => Node
 * - S => AdManager
 * - t => applyDecoratedDescriptor
 * - u => Sprite
 * - v => AudioManager
 * - y => GameModel
 */
/**
 * Restored module: chunks:///_virtual/AddPowerPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => UIConfigTable
 * - a => _decorator
 * - b => GameCtrl
 * - c => SpriteFrame
 * - C => releaseType
 * - d => tween
 * - f => assetManager
 * - g => Prefab
 * - h => UIOpacity
 * - i => initializerDefineProperty
 * - l => Button
 * - m => Component
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - r => cclegacy
 * - s => Node
 * - S => AdManager
 * - t => applyDecoratedDescriptor
 * - u => Sprite
 * - v => AudioManager
 * - y => GameModel
 */
System.register("chunks:///_virtual/AddPowerPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ConfigTable.ts","./GameCtrl.ts","./AdManager.ts","./Enum.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* SpriteFrame */, u /* Sprite */, d /* tween */, h /* UIOpacity */, p, f /* assetManager */, g /* Prefab */, m /* Component */, v /* AudioManager */, y /* GameModel */, _ /* UIConfigTable */, b /* GameCtrl */, S /* AdManager */, C /* releaseType */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.SpriteFrame /* SpriteFrame */,u=e.Sprite /* Sprite */,d=e.tween /* tween */,h=e.UIOpacity /* UIOpacity */,p=e.v3,f=e.assetManager /* assetManager */,g=e.Prefab /* Prefab */,m=e.Component /* Component */}
,function(e){
v=e.AudioManager /* AudioManager */}
,function(e){
y=e.GameModel /* GameModel */}
,function(e){
_=e.UIConfigTable /* UIConfigTable */}
,function(e){
b=e.GameCtrl /* GameCtrl */}
,function(e){
S=e.AdManager /* AdManager */}
,function(e){
C=e.releaseType /* releaseType */}
],execute:function(){
var w,N,k,T,B,A,P,M,I,F,R,L,x;
r._RF.push({
}
,"46b798wdOFNl6mD2tJVTU7k","AddPowerPanelView",void 0);
var D=a.ccclass,G=a.property;
e("AddPowerPanelView",(w=D("AddPowerPanelView"),N=G(s),k=G(s),T=G(l),B=G(l),A=G(c),w((I=t((M=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",I,o(t)),i(t,"panel",F,o(t)),i(t,"closeBtn",R,o(t)),i(t,"getPowerBtn",L,o(t)),i(t,"shareReviveSpr",x,o(t)),t.purpose="",t.showAdCallFunc=null,t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.initPanel(),y.instance.btnChangeShareNum>0&&(this.getPowerBtn.node.getChildByName("spr").getComponent(u).spriteFrame=this.shareReviveSpr)}
,r.start=function(){
d(this.black.getComponent(h)).to(.1,{
opacity:220}
).start(),d(this.panel).delay(.1).to(.3,{
position:p(0,0,0)}
,{
easing:"backOut"}
).call((function(){
b.instance.btnCanTouch=!0}
)).start()}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents(),f.getBundle("uiBundle").release(_.AddPowerPanel.path,g)}
,r.initPanel=function(){
this.black.getComponent(h).opacity=0,this.panel.setPosition(0,y.instance.screenHeight)}
,r.registerEvents=function(){
this.getPowerBtn.node.on("click",this.onGetPower,this),this.closeBtn.node.on("click",this.onClose,this)}
,r.unregisterEvents=function(){
this.getPowerBtn.node.off("click",this.onGetPower,this),this.closeBtn.node.off("click",this.onClose,this)}
,r.onClose=function(){
var e=this;
b.instance.btnCanTouch&&(b.instance.btnCanTouch=!1,v.instance.playSound("ui/buttonClick"),d(this.panel).to(.3,{
position:p(0,y.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),d(this.black.getComponent(h)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),b.instance.btnCanTouch=!0}
)).start())}
,r.onGetPower=function(){
var e=this;
if(b.instance.btnCanTouch){
b.instance.btnCanTouch=!1,v.instance.playSound("ui/buttonClick");
var t=this;
this.getPowerBtn.node.getChildByName("spr").getComponent(u).spriteFrame!=this.shareReviveSpr?S.showVideoAd((function(){
t.onSuccessShowAd()}
),(function(){
b.instance.btnCanTouch=!0}
)):(y.instance.btnChangeShareNum-=1,S.share((function(){
t.onSuccessShowAd()}
),(function(){
b.instance.btnCanTouch=!0}
)),y.instance.releaseType==C.applet_wechat&&d(this.node).delay(2).call((function(){
e.onSuccessShowAd()}
)).start())}
}
,r.onSuccessShowAd=function(){
y.instance.addPowerNum(),b.instance.btnCanTouch=!0,"EnterGuessScene"==this.purpose?this.showAdCallFunc&&this.showAdCallFunc():"ReplayGuessScene"==this.purpose&&this.showAdCallFunc&&this.showAdCallFunc(),this.node.destroy()}
,t}
(m)).prototype,"black",[N],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),F=t(M.prototype,"panel",[k],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),R=t(M.prototype,"closeBtn",[T],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),L=t(M.prototype,"getPowerBtn",[B],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),x=t(M.prototype,"shareReviveSpr",[A],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),P=M))||P)),r._RF.pop()}
}
}
))

