/**
 * Semantic view: chunks:///_virtual/AwemePanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => find
 * - a => asyncToGenerator
 * - A => TooYueManager
 * - b => instantiate
 * - B => UIConfigTable
 * - c => Node
 * - C => GameModel
 * - d => SpriteFrame
 * - g => assetManager
 * - h => tween
 * - k => releaseType
 * - l => _decorator
 * - m => Prefab
 * - n => inheritsLoose
 * - N => GameCtrl
 * - o => initializerDefineProperty
 * - p => UIOpacity
 * - P => AdManager_ZJ
 * - r => assertThisInitialized
 * - s => cclegacy
 * - S => AudioManager
 * - t => applyDecoratedDescriptor
 * - T => ReceivePanelView
 * - u => Button
 * - v => Sprite
 * - w => ResManager
 * - y => Component
 */
/**
 * Restored module: chunks:///_virtual/AwemePanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => find
 * - a => asyncToGenerator
 * - A => TooYueManager
 * - b => instantiate
 * - B => UIConfigTable
 * - c => Node
 * - C => GameModel
 * - d => SpriteFrame
 * - g => assetManager
 * - h => tween
 * - k => releaseType
 * - l => _decorator
 * - m => Prefab
 * - n => inheritsLoose
 * - N => GameCtrl
 * - o => initializerDefineProperty
 * - p => UIOpacity
 * - P => AdManager_ZJ
 * - r => assertThisInitialized
 * - s => cclegacy
 * - S => AudioManager
 * - t => applyDecoratedDescriptor
 * - T => ReceivePanelView
 * - u => Button
 * - v => Sprite
 * - w => ResManager
 * - y => Component
 */
System.register("chunks:///_virtual/AwemePanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./Enum.ts","./ReceivePanelView.ts","./ConfigTable.ts","./TooYueManager.ts","./AdManager_ZJ.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, o /* initializerDefineProperty */, r /* assertThisInitialized */, a /* asyncToGenerator */, s /* cclegacy */, l /* _decorator */, c /* Node */, u /* Button */, d /* SpriteFrame */, h /* tween */, p /* UIOpacity */, f, g /* assetManager */, m /* Prefab */, v /* Sprite */, y /* Component */, _ /* find */, b /* instantiate */, S /* AudioManager */, C /* GameModel */, w /* ResManager */, N /* GameCtrl */, k /* releaseType */, T /* ReceivePanelView */, B /* UIConfigTable */, A /* TooYueManager */, P /* AdManager_ZJ */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,o=e.initializerDefineProperty /* initializerDefineProperty */,r=e.assertThisInitialized /* assertThisInitialized */,a=e.asyncToGenerator /* asyncToGenerator */}
,function(e){
s=e.cclegacy /* cclegacy */,l=e._decorator /* _decorator */,c=e.Node /* Node */,u=e.Button /* Button */,d=e.SpriteFrame /* SpriteFrame */,h=e.tween /* tween */,p=e.UIOpacity /* UIOpacity */,f=e.v3,g=e.assetManager /* assetManager */,m=e.Prefab /* Prefab */,v=e.Sprite /* Sprite */,y=e.Component /* Component */,_=e.find /* find */,b=e.instantiate /* instantiate */}
,function(e){
S=e.AudioManager /* AudioManager */}
,function(e){
C=e.GameModel /* GameModel */}
,function(e){
w=e.ResManager /* ResManager */}
,function(e){
N=e.GameCtrl /* GameCtrl */}
,function(e){
k=e.releaseType /* releaseType */}
,function(e){
T=e.ReceivePanelView /* ReceivePanelView */}
,function(e){
B=e.UIConfigTable /* UIConfigTable */}
,function(e){
A=e.TooYueManager /* TooYueManager */}
,function(e){
P=e.AdManager_ZJ /* AdManager_ZJ */}
],execute:function(){
var M,I,F,R,L,x,D,G,E,O,H,V,U,z,W;
s._RF.push({
}
,"fef71Ozi4pHs7IcONEPyOWu","AwemePanelView",void 0);
var j=l.ccclass,J=l.property;
e("AwemePanelView",(M=j("AwemePanelView"),I=J(c),F=J(c),R=J(u),L=J(u),x=J([d]),D=J([d]),M((O=t((E=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"black",O,r(t)),o(t,"panel",H,r(t)),o(t,"closeBtn",V,r(t)),o(t,"receiveBtn",U,r(t)),o(t,"btnSpriteFrame",z,r(t)),o(t,"btnWordSpriteFrame",W,r(t)),t.model=null,t}
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
N.instance.btnCanTouch=!0}
)).start()}
,s.onEnable=function(){
this.registerEvents()}
,s.onDisable=function(){
this.unregisterEvents(),g.getBundle("uiBundle").release(B.AddTableUI.path,m)}
,s.initPanel=function(){
this.black.getComponent(p).opacity=0,this.panel.setPosition(0,C.instance.screenHeight),this.panel.setScale(1,1,1)}
,s.setPanel=function(e){
this.model=e,this.receiveBtn.node.getComponent(v).spriteFrame=this.btnSpriteFrame[e]}
,s.registerEvents=function(){
this.receiveBtn.node.on("click",this.onReceive,this),this.closeBtn.node.on("click",this.onClose,this)}
,s.unregisterEvents=function(){
this.receiveBtn.node.off("click",this.onReceive,this),this.closeBtn.node.off("click",this.onClose,this)}
,s.onClose=function(){
var e=this;
N.instance.btnCanTouch&&(N.instance.btnCanTouch=!1,S.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
position:f(0,C.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),N.instance.btnCanTouch=!0}
)).start())}
,s.onReceive=function(){
var e=this;
N.instance.btnCanTouch&&(this.receiveBtn.interactable=!1,N.instance.btnCanTouch=!1,S.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
position:f(0,C.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy()}
)).start(),C.instance.releaseType==k.applet_ziJie&&P._ins.openAwemeUserProfile(this.addFinishBack,this.addFailBack))}
,s.addFinishBack=function(){
var e=a(i().mark((function e(){
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:A.feedSubscribeStatus?N.instance.btnCanTouch=!0:(_("Canvas/AwemeBtn").active=!1,C.instance.isAlreadyFollow=1,w.instance.bundleLoad("uiBundle",B.ReceiveUI.path,null,(function(e,t){
if(e)return console.log(e),void(N.instance.btnCanTouch=!0);
var n=b(t);
n.parent=_("Canvas"),n.getComponent(T).setPanel(1)}
)));
case 1:case"end":return e.stop()}
}
),e)}
)));
return function(){
return e.apply(this,arguments)}
}
(),s.addFailBack=function(){
N.instance.btnCanTouch=!0}
,t}
(y)).prototype,"black",[I],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(E.prototype,"panel",[F],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=t(E.prototype,"closeBtn",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),U=t(E.prototype,"receiveBtn",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),z=t(E.prototype,"btnSpriteFrame",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),W=t(E.prototype,"btnWordSpriteFrame",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),G=E))||G)),s._RF.pop()}
}
}
))

