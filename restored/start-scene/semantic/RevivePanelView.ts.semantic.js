/**
 * Semantic view: chunks:///_virtual/RevivePanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Prefab
 * - a => _decorator
 * - A => Util
 * - b => Component
 * - B => GameCtrl
 * - c => Label
 * - C => AudioManager
 * - d => UIOpacity
 * - F => AutoManager
 * - g => director
 * - h => Sprite
 * - i => initializerDefineProperty
 * - I => TooYueManager
 * - k => EVENT_KEYS
 * - l => Button
 * - L => ResManager
 * - m => find
 * - M => UIConfigTable
 * - n => inheritsLoose
 * - N => releaseType
 * - o => assertThisInitialized
 * - p => tween
 * - P => DuckController
 * - r => cclegacy
 * - R => Game2Controller
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => GAME2_EVENT_KEYS
 * - u => SpriteFrame
 * - v => ProgressBar
 * - w => default
 * - x => Game
 * - y => assetManager
 */
/**
 * Restored module: chunks:///_virtual/RevivePanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Prefab
 * - a => _decorator
 * - A => Util
 * - b => Component
 * - B => GameCtrl
 * - c => Label
 * - C => AudioManager
 * - d => UIOpacity
 * - F => AutoManager
 * - g => director
 * - h => Sprite
 * - i => initializerDefineProperty
 * - I => TooYueManager
 * - k => EVENT_KEYS
 * - l => Button
 * - L => ResManager
 * - m => find
 * - M => UIConfigTable
 * - n => inheritsLoose
 * - N => releaseType
 * - o => assertThisInitialized
 * - p => tween
 * - P => DuckController
 * - r => cclegacy
 * - R => Game2Controller
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => GAME2_EVENT_KEYS
 * - u => SpriteFrame
 * - v => ProgressBar
 * - w => default
 * - x => Game
 * - y => assetManager
 */
System.register("chunks:///_virtual/RevivePanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./AudioManager.ts","./EventManager.ts","./Enum.ts","./GameCtrl.ts","./Util.ts","./DuckController.ts","./ConfigTable.ts","./TooYueManager.ts","./AutoManager.ts","./Game2Controller.ts","./ResManager.ts","./Game.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* Label */, u /* SpriteFrame */, d /* UIOpacity */, h /* Sprite */, p /* tween */, f, g /* director */, m /* find */, v /* ProgressBar */, y /* assetManager */, _ /* Prefab */, b /* Component */, S /* GameModel */, C /* AudioManager */, w /* default */, N /* releaseType */, k /* EVENT_KEYS */, T /* GAME2_EVENT_KEYS */, B /* GameCtrl */, A /* Util */, P /* DuckController */, M /* UIConfigTable */, I /* TooYueManager */, F /* AutoManager */, R /* Game2Controller */, L /* ResManager */, x /* Game */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.Label /* Label */,u=e.SpriteFrame /* SpriteFrame */,d=e.UIOpacity /* UIOpacity */,h=e.Sprite /* Sprite */,p=e.tween /* tween */,f=e.v3,g=e.director /* director */,m=e.find /* find */,v=e.ProgressBar /* ProgressBar */,y=e.assetManager /* assetManager */,_=e.Prefab /* Prefab */,b=e.Component /* Component */}
,function(e){
S=e.GameModel /* GameModel */}
,function(e){
C=e.AudioManager /* AudioManager */}
,function(e){
w=e.default /* default */}
,function(e){
N=e.releaseType /* releaseType */,k=e.EVENT_KEYS /* EVENT_KEYS */,T=e.GAME2_EVENT_KEYS /* GAME2_EVENT_KEYS */}
,function(e){
B=e.GameCtrl /* GameCtrl */}
,function(e){
A=e.Util /* Util */}
,function(e){
P=e.DuckController /* DuckController */}
,function(e){
M=e.UIConfigTable /* UIConfigTable */}
,function(e){
I=e.TooYueManager /* TooYueManager */}
,function(e){
F=e.AutoManager /* AutoManager */}
,function(e){
R=e.Game2Controller /* Game2Controller */}
,function(e){
L=e.ResManager /* ResManager */}
,function(e){
x=e.Game /* Game */}
],execute:function(){
var D,G,E,O,H,V,U,z,W,j,J,Y,q,K,X,Q,Z,$,ee;
r._RF.push({
}
,"f1d6bA1qgNPcI6g7YQci2t6","RevivePanelView",void 0);
var te=a.ccclass,ne=a.property;
e("RevivePanelView",(D=te("RevivePanelView"),G=ne(s),E=ne(s),O=ne(l),H=ne(l),V=ne(c),U=ne(u),z=ne(s),W=ne(s),D((Y=t((J=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",Y,o(t)),i(t,"panel",q,o(t)),i(t,"noBtn",K,o(t)),i(t,"yesBtn",X,o(t)),i(t,"syNum",Q,o(t)),i(t,"shareReviveSpr",Z,o(t)),i(t,"progressBar",$,o(t)),i(t,"progressLabel",ee,o(t)),t.reviveNum=0,t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.panel.setPosition(0,S.instance.screenHeight),this.black.getComponent(d).opacity=0,S.instance.btnChangeShareNum<I._ins.shareTimesDay&&S.instance.releaseType!=N.test_TEST&&(this.yesBtn.node.getComponent(h).spriteFrame=this.shareReviveSpr)}
,r.start=function(){
var e=this;
p(this.black.getComponent(d)).to(.1,{
opacity:220}
).start(),p(this.panel).delay(.1).to(.3,{
position:f(0,0,0)}
,{
easing:"backOut"}
).start(),this.initProgressBar(),F._ins.isAuto&&this.scheduleOnce((function(){
e.onNoClick()}
),A.getRandomNum(1,2)),(g.getScene().name==S.instance.Game2SceneName||g.getScene().name==S.instance.FruitSceneName)&&(this.node.getChildByName("panel").getChildByName("baseMap").getChildByName("reviveLabel").getComponent(h).spriteFrame=L.instance.getSpriteFrame("移除槽位中的水果"))}
,r.initProgressBar=function(){
var e=0;
if(g.getScene().name==S.instance.DuckSceneName){
var t=m("Canvas").getComponent(P);
e=t.popNum/t.nailNum,e=A.fakeProgressSmooth(t.popNum,t.nailNum)}
else if(g.getScene().name==S.instance.Game2SceneName){
var n=m("Canvas").getComponent(R);
e=n.popNum/n.fruitNum,e=A.fakeProgressSmooth(n.popNum,n.fruitNum)}
else if(g.getScene().name==S.instance.FruitSceneName){
var i=m("Canvas").getComponent(x);
e=i.remainNum/i.fruitNum,e=A.fakeProgressSmooth(i.fruitNum-i.remainNum,i.fruitNum)}
p(this.progressBar.parent).delay(.3).to(.2,{
scale:f(1,1,1)}
).start(),p(this.progressBar.getComponent(v)).delay(.5).to(.4,{
progress:e}
,{
easing:"sineOut"}
).start(),p(this.progressLabel.getComponent(c)).delay(.5).to(.4,{
string:""+Math.floor(100*e)}
).start()}
,r.setRevivePanel=function(e){
this.reviveNum=e,this.syNum.string="x"+e}
,r.onYesClick=function(){
if(B.instance.btnCanTouch){
B.instance.btnCanTouch=!1,C.instance.playSound("ui/buttonClick");
var e=this;
this.yesBtn.node.getComponent(h).spriteFrame!=this.shareReviveSpr?I._ins.showVideoAd("复活道具",(function(t){
g.getScene().name==S.instance.DuckSceneName||g.getScene().name==S.instance.FruitSceneName?w.instance.emit(k.REVIVE):g.getScene().name==S.instance.Game2SceneName&&w.instance.emit(T.REVIVE),e.node.destroy(),B.instance.btnCanTouch=!0}
),(function(){
B.instance.btnCanTouch=!0}
)):I._ins.shareApp(!1,null,(function(){
S.instance.btnChangeShareNum+=1,w.instance.emit(k.REVIVE),e.node.destroy(),B.instance.btnCanTouch=!0}
),(function(){
B.instance.btnCanTouch=!0}
))}
}
,r.onNoClick=function(){
var e=this;
B.instance.btnCanTouch&&(B.instance.btnCanTouch=!1,C.instance.playSound("ui/buttonClick"),p(this.panel).to(.3,{
position:f(0,S.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),p(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
g.getScene().name==S.instance.DuckSceneName||g.getScene().name==S.instance.FruitSceneName?w.instance.emit(k.GAME_END):g.getScene().name==S.instance.Game2SceneName&&w.instance.emit(T.GAME_END),B.instance.btnCanTouch=!0,e.node.destroy()}
)).start())}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents(),y.getBundle("uiBundle").release(M.AddTableUI.path,_)}
,r.registerEvents=function(){
this.yesBtn.node.on(s.EventType.TOUCH_END,this.onYesClick,this),this.noBtn.node.on(s.EventType.TOUCH_END,this.onNoClick,this)}
,r.unregisterEvents=function(){
this.yesBtn.node.off(s.EventType.TOUCH_END,this.onYesClick,this),this.noBtn.node.off(s.EventType.TOUCH_END,this.onNoClick,this)}
,t}
(b)).prototype,"black",[G],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),q=t(J.prototype,"panel",[E],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),K=t(J.prototype,"noBtn",[O],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),X=t(J.prototype,"yesBtn",[H],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),Q=t(J.prototype,"syNum",[V],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),Z=t(J.prototype,"shareReviveSpr",[U],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),$=t(J.prototype,"progressBar",[z],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),ee=t(J.prototype,"progressLabel",[W],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),j=J))||j)),r._RF.pop()}
}
}
))

