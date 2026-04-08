/**
 * Restored module: chunks:///_virtual/PropPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Component
 * - a => _decorator
 * - A => UIConfigTable
 * - b => PROP_TYPE
 * - B => GameCtrl
 * - c => Label
 * - C => EVENT_KEYS
 * - d => UIOpacity
 * - F => Game2Controller
 * - g => assetManager
 * - h => Sprite
 * - i => initializerDefineProperty
 * - I => AutoManager
 * - k => default
 * - l => Button
 * - m => Prefab
 * - M => TooYueManager
 * - n => inheritsLoose
 * - N => Util
 * - o => assertThisInitialized
 * - p => tween
 * - P => DuckController
 * - r => cclegacy
 * - R => ResManager
 * - s => Node
 * - S => releaseType
 * - t => applyDecoratedDescriptor
 * - T => AudioManager
 * - u => SpriteFrame
 * - v => director
 * - w => GameModel
 * - y => find
 */
System.register("chunks:///_virtual/PropPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Enum.ts","./GameModel2.ts","./Util.ts","./EventManager.ts","./AudioManager.ts","./GameCtrl.ts","./ConfigTable.ts","./DuckController.ts","./TooYueManager.ts","./AutoManager.ts","./Game2Controller.ts","./ResManager.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.Button,c=e.Label,u=e.SpriteFrame,d=e.UIOpacity,h=e.Sprite,p=e.tween,f=e.v3,g=e.assetManager,m=e.Prefab,v=e.director,y=e.find,_=e.Component}
,function(e){
b=e.PROP_TYPE,S=e.releaseType,C=e.EVENT_KEYS}
,function(e){
w=e.GameModel}
,function(e){
N=e.Util}
,function(e){
k=e.default}
,function(e){
T=e.AudioManager}
,function(e){
B=e.GameCtrl}
,function(e){
A=e.UIConfigTable}
,function(e){
P=e.DuckController}
,function(e){
M=e.TooYueManager}
,function(e){
I=e.AutoManager}
,function(e){
F=e.Game2Controller}
,function(e){
R=e.ResManager}
],execute:function(){
var L,x,D,G,E,O,H,V,U,z,W,j,J,Y,q,K,X,Q,Z,$,ee;
r._RF.push({
}
,"c6513jpCnRJSLnW77qAFOIb","PropPanelView",void 0);
var te=a.ccclass,ne=a.property;
e("PropPanelView",(L=te("PropPanelView"),x=ne(s),D=ne(s),G=ne(l),E=ne(l),O=ne(c),H=ne(u),V=ne(u),U=ne(u),z=ne(u),L((J=t((j=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",J,o(t)),i(t,"panel",Y,o(t)),i(t,"yesBtn",q,o(t)),i(t,"noBtn",K,o(t)),i(t,"syNum",X,o(t)),i(t,"nameSpr",Q,o(t)),i(t,"propSpr",Z,o(t)),i(t,"wordSpr",$,o(t)),i(t,"shareReviveSpr",ee,o(t)),t.propType=b.PROP1,t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.panel.setPosition(0,w.instance.screenHeight),this.black.getComponent(d).opacity=0,w.instance.btnChangeShareNum<M._ins.shareTimesDay&&w.instance.releaseType!=S.test_TEST&&(this.yesBtn.node.getComponent(h).spriteFrame=this.shareReviveSpr)}
,r.start=function(){
var e=this;
B.instance.canTouch=!1,p(this.black.getComponent(d)).to(.1,{
opacity:180}
).start(),p(this.panel).delay(.1).to(.3,{
position:f(0,0,0)}
,{
easing:"backOut"}
).call((function(){
B.instance.btnCanTouch=!0}
)).start(),I._ins.isAuto&&this.scheduleOnce((function(){
e.finishVideoBack(e.propType.toString())}
),2)}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents(),g.getBundle("uiBundle").release(A.PropUI.path,m)}
,r.setPanel=function(e){
this.propType=e;
var t=this.panel.getChildByName("baseMap"),n=t.getChildByName("propNameSpr"),i=t.getChildByName("propSpr"),o=t.getChildByName("wordSpr");
n.getComponent(h).spriteFrame=this.nameSpr[e],i.getComponent(h).spriteFrame=this.propSpr[e],o.getComponent(h).spriteFrame=this.wordSpr[e],e==b.PROP2&&v.getScene().name==w.instance.Game2SceneName||e==b.PROP2&&v.getScene().name==w.instance.FruitSceneName?o.getComponent(h).spriteFrame=R.instance.getSpriteFrame("打乱水果位置"):(e==b.PROP1&&v.getScene().name==w.instance.Game2SceneName||e==b.PROP1&&v.getScene().name==w.instance.FruitSceneName)&&(o.getComponent(h).spriteFrame=R.instance.getSpriteFrame("消除2组水果")),this.addClickEvent(),w.runSceneName==w.instance.DuckSceneName&&y("Canvas").getComponent(P)}
,r.addClickEvent=function(){
N.addClickEvent(this.yesBtn,this.node,"PropPanelView","onYesClick",this.propType.toString())}
,r.registerEvents=function(){
this.noBtn.node.on(s.EventType.TOUCH_END,this.onNoClick,this)}
,r.unregisterEvents=function(){
this.noBtn.node.off(s.EventType.TOUCH_END,this.onNoClick,this)}
,r.onYesClick=function(e,t){
var n=this;
if(B.instance.btnCanTouch)if(B.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),y("Canvas"),this.yesBtn.node.getComponent(h).spriteFrame!=this.shareReviveSpr){
var i="";
Number(t)==b.PROP1?i="消除道具":Number(t)==b.PROP2?i="打乱道具":Number(t)==b.PROP4?i="全部格子解锁道具":Number(t)==b.PROP5&&(i="解锁单个格子道具"),v.getScene().name==w.instance.Game2SceneName&&(i+="模式2"),M._ins.showVideoAd(i,(function(){
n.finishVideoBack(t)}
),(function(){
B.instance.btnCanTouch=!0}
))}
else M._ins.shareApp(!1,null,(function(){
w.instance.btnChangeShareNum+=1,n.finishVideoBack(t),v.getScene().name==w.instance.DuckSceneName?y("Canvas").getComponent(P).updateAdGridTip():v.getScene().name==w.instance.Game2SceneName&&y("Canvas").getComponent(F).updateAdGridTip()}
),(function(){
B.instance.btnCanTouch=!0}
))}
,r.finishVideoBack=function(e){
var t=y("Canvas");
switch(B.instance.canTouch=!0,this.node.destroy(),Number(e)){
case b.PROP1:p(t).delay(.5).call((function(){
B.instance.btnCanTouch=!0,console.log("aaaa"),k.instance.emit(C.PROP1)}
)).start();
break;
case b.PROP2:p(t).delay(.5).call((function(){
B.instance.btnCanTouch=!0,k.instance.emit(C.PROP2)}
)).start();
break;
case b.PROP3:p(t).delay(.5).call((function(){
B.instance.btnCanTouch=!0,k.instance.emit(C.PROP3)}
)).start();
break;
case b.PROP4:p(t).delay(.5).call((function(){
B.instance.btnCanTouch=!0,k.instance.emit(C.PROP4)}
)).start();
break;
case b.PROP5:p(t).delay(.5).call((function(){
B.instance.btnCanTouch=!0,k.instance.emit(C.PROP5)}
)).start()}
}
,r.onNoClick=function(){
var e=this;
B.instance.btnCanTouch&&(B.instance.canTouch=!0,B.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),p(this.panel).to(.3,{
position:f(0,w.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),p(this.black.getComponent(d)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),B.instance.btnCanTouch=!0}
)).start())}
,t}
(_)).prototype,"black",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),Y=t(j.prototype,"panel",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),q=t(j.prototype,"yesBtn",[G],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),K=t(j.prototype,"noBtn",[E],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),X=t(j.prototype,"syNum",[O],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),Q=t(j.prototype,"nameSpr",[H],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),Z=t(j.prototype,"propSpr",[V],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),$=t(j.prototype,"wordSpr",[U],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),ee=t(j.prototype,"shareReviveSpr",[z],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),W=j))||W)),r._RF.pop()}
}
}
))
