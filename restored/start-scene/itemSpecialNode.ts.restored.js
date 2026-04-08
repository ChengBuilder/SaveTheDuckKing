/**
 * Restored module: chunks:///_virtual/itemSpecialNode.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => Color
 * - d => Component
 * - h => GameModel
 * - i => initializerDefineProperty
 * - l => Sprite
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => ResManager
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => Label
 */
System.register("chunks:///_virtual/itemSpecialNode.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.Sprite,c=e.Color,u=e.Label,d=e.Component}
,function(e){
h=e.GameModel}
,function(e){
p=e.ResManager}
],execute:function(){
var f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F;
r._RF.push({
}
,"6b43breo5VPD75wg/mAzLuc","itemSpecialNode",void 0);
var R=a.ccclass,L=a.property,x=e("duckSpecialType",function(e){
return e[e.special=0]="special",e[e.fruit=1]="fruit",e[e.share=2]="share",e[e.DWW=3]="DWW",e}
({
}
));
e("itemSpecialNode",(f=R("itemSpecialNode"),g=L(s),m=L(s),v=L(s),y=L(s),_=L(s),b=L(s),S=L(s),C=L(s),f((k=t((N=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"noNode",k,o(t)),i(t,"specialSprite",T,o(t)),i(t,"specialShadow",B,o(t)),i(t,"specialName",A,o(t)),i(t,"newTag",P,o(t)),i(t,"useTag",M,o(t)),i(t,"useLight",I,o(t)),i(t,"GetTag",F,o(t)),t.id=0,t.duckClass=x.special,t}
n(t,e);
var r=t.prototype;
return r.start=function(){
}
,r.initSpecialItem=function(){
var e=this;
if(this.duckClass=x.special,h.instance.level>100*(this.id+1)+1||h.LockAllDuck){
this.node.getComponent(l).color=c.WHITE,this.specialSprite.getComponent(l).color=c.WHITE;
var t=h.SpecialNameArr[this.id-1];
this.specialName.active=!0,this.specialShadow.active=!0,this.specialName.getComponent(u).string=t;
var n="tex/book/特殊图鉴/"+h.SpecialNameArr[this.id-1]+"/spriteFrame";
p.instance.bundleLoad("uiBundle",n,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),this.updateGetTips()}
else{
this.node.getComponent(l).color=c.GRAY,this.specialSprite.getComponent(l).color=c.BLACK;
var i=h.SpecialNameArr[this.id-1];
this.specialName.active=!0,this.specialShadow.active=!0,this.specialName.getComponent(u).string=i;
var o="tex/book/特殊图鉴/"+h.SpecialNameArr[this.id-1]+"/spriteFrame";
p.instance.bundleLoad("uiBundle",o,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),this.updateGetTips()}
}
,r.initSpecialFruitItem=function(){
var e=this,t=100*this.id+1;
if(this.duckClass=x.fruit,h.instance.level2>t||h.LockAllDuck){
this.node.getComponent(l).color=c.WHITE,this.specialSprite.getComponent(l).color=c.WHITE,this.specialName.active=!0,this.specialShadow.active=!0;
var n=h.FruitNameArr[this.id-1];
this.specialName.getComponent(u).string=n;
var i="tex/book/水果鸭/"+n+"/spriteFrame";
p.instance.bundleLoad("uiBundle",i,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),h.instance.duckName==h.FruitNameArr[this.id-1]&&(this.useTag.active=!0,this.useLight.active=!0),this.updateGetTipsFruit()}
else{
this.node.getComponent(l).color=c.GRAY,this.specialSprite.getComponent(l).color=c.BLACK,this.specialName.active=!0,this.specialShadow.active=!0;
var o=h.FruitNameArr[this.id-1];
this.specialName.getComponent(u).string=o;
var r="tex/book/水果鸭/"+o+"/spriteFrame";
p.instance.bundleLoad("uiBundle",r,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),this.updateGetTipsFruit()}
}
,r.initDWWItem=function(){
var e=this,t=100*this.id+1;
if(this.duckClass=x.DWW,h.instance.level3>t||h.LockAllDuck){
this.node.getComponent(l).color=c.WHITE,this.specialSprite.getComponent(l).color=c.WHITE,this.specialName.active=!0,this.specialShadow.active=!0;
var n=h.DaWeiWangNameArr[this.id-1];
this.specialName.getComponent(u).string=n;
var i="tex/book/大胃王鸭/"+n+"/spriteFrame";
p.instance.bundleLoad("uiBundle",i,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),h.instance.duckName==h.DaWeiWangNameArr[this.id-1]&&(this.useTag.active=!0,this.useLight.active=!0),this.updateGetTipsDWW()}
else{
this.node.getComponent(l).color=c.GRAY,this.specialSprite.getComponent(l).color=c.BLACK,this.specialName.active=!0,this.specialShadow.active=!0;
var o=h.DaWeiWangNameArr[this.id-1];
this.specialName.getComponent(u).string=o;
var r="tex/book/大胃王鸭/"+o+"/spriteFrame";
p.instance.bundleLoad("uiBundle",r,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),this.updateGetTipsDWW()}
}
,r.initShareItem=function(){
var e=this;
if(this.duckClass=x.share,h.instance.shareLevel>=this.id||h.LockAllDuck){
this.node.getComponent(l).color=c.WHITE,this.specialSprite.getComponent(l).color=c.WHITE,this.specialName.active=!0,this.specialShadow.active=!0;
var t=h.SanGuoNameArr[this.id-1];
this.specialName.getComponent(u).string=t;
var n="tex/book/分享鸭/"+t+"/spriteFrame";
p.instance.bundleLoad("uiBundle",n,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),h.instance.duckName==h.SanGuoNameArr[this.id-1]&&(this.useTag.active=!0,this.useLight.active=!0),this.updateGetTipsShare()}
else{
this.node.getComponent(l).color=c.GRAY,this.specialSprite.getComponent(l).color=c.BLACK,this.specialName.active=!0,this.specialShadow.active=!0;
var i=h.SanGuoNameArr[this.id-1];
this.specialName.getComponent(u).string=i;
var o="tex/book/分享鸭/"+i+"/spriteFrame";
p.instance.bundleLoad("uiBundle",o,null,(function(t,n){
t?console.error(t):e.node&&(e.specialSprite.getComponent(l).spriteFrame=n)}
)),this.updateGetTipsShare()}
}
,r.showUnlock=function(){
this.node.getComponent(l).color=c.WHITE,this.specialSprite.getComponent(l).color=c.WHITE}
,r.updateGetTips=function(){
this.GetTag.getChildByName("GetNum").getComponent(u).string="主线"+(100*(this.id+1)+1)+"关解锁",(h.instance.level>100*(this.id+1)+1||h.LockAllDuck)&&(this.GetTag.active=!1,this.showUnlock())}
,r.updateGetTipsFruit=function(){
this.GetTag.getChildByName("GetNum").getComponent(u).string="水果鸭"+(100*this.id+1)+"关解锁",(h.instance.level2>100*this.id+1||h.LockAllDuck)&&(this.GetTag.active=!1,this.showUnlock())}
,r.updateGetTipsDWW=function(){
this.GetTag.getChildByName("GetNum").getComponent(u).string="大胃王鸭"+(100*this.id+1)+"关解锁",(h.instance.level3>100*this.id+1||h.LockAllDuck)&&(this.GetTag.active=!1,this.showUnlock())}
,r.updateGetTipsShare=function(){
this.GetTag.getChildByName("GetNum").getComponent(u).string="喊人第"+this.id+"阶段解锁",(h.instance.shareLevel>=this.id||h.LockAllDuck)&&(this.GetTag.active=!1,this.showUnlock())}
,r.hide=function(){
this.node.active=!1,this.useTag.active=!1,this.useLight.active=!1,this.newTag.active=!1,this.specialShadow.active=!1,this.specialName.active=!1,this.specialSprite.getComponent(l).spriteFrame=null,this.GetTag.active=!0,this.GetTag.getChildByName("GetNum").getComponent(u).string="完成100关解锁",this.node.getComponent(l).color=c.WHITE}
,t}
(d)).prototype,"noNode",[g],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),T=t(N.prototype,"specialSprite",[m],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),B=t(N.prototype,"specialShadow",[v],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),A=t(N.prototype,"specialName",[y],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),P=t(N.prototype,"newTag",[_],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),M=t(N.prototype,"useTag",[b],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),I=t(N.prototype,"useLight",[S],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),F=t(N.prototype,"GetTag",[C],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),w=N))||w)),r._RF.pop()}
}
}
))
