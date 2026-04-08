/**
 * Restored module: chunks:///_virtual/SetBtnView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => find
 * - c => AudioManager
 * - d => GameCtrl
 * - h => UIConfigTable
 * - i => _decorator
 * - l => Component
 * - n => cclegacy
 * - o => director
 * - p => GameModel
 * - r => instantiate
 * - s => Node
 * - t => inheritsLoose
 * - u => ResManager
 */
System.register("chunks:///_virtual/SetBtnView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./ResManager.ts","./GameCtrl.ts","./ConfigTable.ts","./GameModel2.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p;
return{
setters:[function(e){
t=e.inheritsLoose}
,function(e){
n=e.cclegacy,i=e._decorator,o=e.director,r=e.instantiate,a=e.find,s=e.Node,l=e.Component}
,function(e){
c=e.AudioManager}
,function(e){
u=e.ResManager}
,function(e){
d=e.GameCtrl}
,function(e){
h=e.UIConfigTable}
,function(e){
p=e.GameModel}
],execute:function(){
var f;
n._RF.push({
}
,"25983h4kp1FfqIc/EBJ2U7j","SetBtnView",void 0);
var g=i.ccclass;
i.property,e("SetBtnView",g("SetBtnView")(f=function(e){
function n(){
return e.apply(this,arguments)||this}
t(n,e);
var i=n.prototype;
return i.onLoad=function(){
}
,i.onSettingClick=function(){
if("HomeScene"==o.getScene().name)console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
));
else{
if(o.getScene().name==p.instance.PigeonSceneName)return console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),void u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
));
if(o.getScene().name==p.instance.CowSceneName)return console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),void u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
));
if(o.getScene().name==p.instance.MathSceneName)return console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),void u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
));
if(o.getScene().name==p.instance.Game2SceneName)return console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),void u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
));
if(o.getScene().name==p.instance.FruitSceneName)return console.log("点击设置按钮"),d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),void u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas")}
))}
console.log("点击设置按钮",d.instance.btnCanTouch,d.instance.gameIsOver),d.instance.btnCanTouch&&(d.instance.gameIsOver||(d.instance.btnCanTouch=!1,c.instance.playSound("ui/buttonClick"),u.instance.bundleLoad("uiBundle",h.SetUI.path,null,(function(e,t){
if(e)return console.log(e),void(d.instance.btnCanTouch=!0);
r(t).parent=a("Canvas/uiNode")}
))))}
,i.onEnable=function(){
this.node.on(s.EventType.TOUCH_END,this.onSettingClick,this)}
,i.onDisable=function(){
this.node.off(s.EventType.TOUCH_END,this.onSettingClick,this)}
,n}
(l))||f),n._RF.pop()}
}
}
))
