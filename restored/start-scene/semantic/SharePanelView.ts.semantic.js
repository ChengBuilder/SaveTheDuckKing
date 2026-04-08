/**
 * Semantic view: chunks:///_virtual/SharePanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Component
 * - a => _decorator
 * - b => AudioManager
 * - c => SpriteFrame
 * - C => ResManager
 * - d => UIOpacity
 * - f => Prefab
 * - g => Label
 * - i => initializerDefineProperty
 * - k => UIConfigTable
 * - l => Button
 * - m => instantiate
 * - n => inheritsLoose
 * - N => ReceivePanelView
 * - o => assertThisInitialized
 * - p => assetManager
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => TooYueManager
 * - u => tween
 * - v => find
 * - w => GameCtrl
 * - y => director
 */
/**
 * Restored module: chunks:///_virtual/SharePanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Component
 * - a => _decorator
 * - b => AudioManager
 * - c => SpriteFrame
 * - C => ResManager
 * - d => UIOpacity
 * - f => Prefab
 * - g => Label
 * - i => initializerDefineProperty
 * - k => UIConfigTable
 * - l => Button
 * - m => instantiate
 * - n => inheritsLoose
 * - N => ReceivePanelView
 * - o => assertThisInitialized
 * - p => assetManager
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => TooYueManager
 * - u => tween
 * - v => find
 * - w => GameCtrl
 * - y => director
 */
System.register("chunks:///_virtual/SharePanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./ReceivePanelView.ts","./ConfigTable.ts","./TooYueManager.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* SpriteFrame */, u /* tween */, d /* UIOpacity */, h, p /* assetManager */, f /* Prefab */, g /* Label */, m /* instantiate */, v /* find */, y /* director */, _ /* Component */, b /* AudioManager */, S /* GameModel */, C /* ResManager */, w /* GameCtrl */, N /* ReceivePanelView */, k /* UIConfigTable */, T /* TooYueManager */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.SpriteFrame /* SpriteFrame */,u=e.tween /* tween */,d=e.UIOpacity /* UIOpacity */,h=e.v3,p=e.assetManager /* assetManager */,f=e.Prefab /* Prefab */,g=e.Label /* Label */,m=e.instantiate /* instantiate */,v=e.find /* find */,y=e.director /* director */,_=e.Component /* Component */}
,function(e){
b=e.AudioManager /* AudioManager */}
,function(e){
S=e.GameModel /* GameModel */}
,function(e){
C=e.ResManager /* ResManager */}
,function(e){
w=e.GameCtrl /* GameCtrl */}
,function(e){
N=e.ReceivePanelView /* ReceivePanelView */}
,function(e){
k=e.UIConfigTable /* UIConfigTable */}
,function(e){
T=e.TooYueManager /* TooYueManager */}
],execute:function(){
var B,A,P,M,I,F,R,L,x,D,G,E,O,H,V,U,z;
r._RF.push({
}
,"85037TXT4xPbYTPd529+wy0","SharePanelView",void 0);
var W=a.ccclass,j=a.property;
e("SharePanelView",(B=W("SharePanelView"),A=j(s),P=j(s),M=j(l),I=j(l),F=j(s),R=j(s),L=j([c]),B((G=t((D=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",G,o(t)),i(t,"panel",E,o(t)),i(t,"closeBtn",O,o(t)),i(t,"shareBtn",H,o(t)),i(t,"wordSpr",V,o(t)),i(t,"wordLabel",U,o(t)),i(t,"wordSpriteFrame",z,o(t)),t.model=null,t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.initPanel(),this.setPanel()}
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
this.unregisterEvents(),p.getBundle("uiBundle").release(k.ShareUI.path,f)}
,r.initPanel=function(){
this.black.getComponent(d).opacity=0,this.panel.setPosition(0,S.instance.screenHeight),this.panel.setScale(1,1,1)}
,r.setPanel=function(){
this.wordLabel.getComponent(g).string="今日剩余次数("+S.instance.shareSuccessNum+"/"+T._ins.shareGift+")"}
,r.registerEvents=function(){
this.shareBtn.node.on("click",this.onShare,this),this.closeBtn.node.on("click",this.onClose,this)}
,r.unregisterEvents=function(){
this.shareBtn.node.off("click",this.onShare,this),this.closeBtn.node.off("click",this.onClose,this)}
,r.onClose=function(){
var e=this;
w.instance.btnCanTouch&&(w.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
position:h(0,S.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),w.instance.btnCanTouch=!0}
)).start())}
,r.onShare=function(){
var e=this;
w.instance.btnCanTouch&&(this.shareBtn.interactable=!1,w.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
position:h(0,S.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy()}
)).start(),T._ins.shareApp(!1,null,this.shareFinishBack,this.shareErrBack))}
,r.shareFinishBack=function(){
S.instance.shareSuccessNum<T._ins.shareGift?C.instance.bundleLoad("uiBundle",k.ReceiveUI.path,null,(function(e,t){
if(e)return console.log(e),void(w.instance.btnCanTouch=!0);
var n=m(t);
n.parent=v("Canvas"),n.getComponent(N).setPanel(2),S.instance.shareSuccessNum+=1,"HomeScene"==y.getScene().name?S.instance.shareSuccessNum==T._ins.shareGift&&(v("Canvas/shareBtn/shareTips").active=!1):y.getScene().name}
)):w.instance.btnCanTouch=!0}
,r.shareErrBack=function(){
w.instance.btnCanTouch=!0}
,t}
(_)).prototype,"black",[A],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),E=t(D.prototype,"panel",[P],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),O=t(D.prototype,"closeBtn",[M],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(D.prototype,"shareBtn",[I],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=t(D.prototype,"wordSpr",[F],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),U=t(D.prototype,"wordLabel",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),z=t(D.prototype,"wordSpriteFrame",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),x=D))||x)),r._RF.pop()}
}
}
))

