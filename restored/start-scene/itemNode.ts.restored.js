/**
 * Restored module: chunks:///_virtual/itemNode.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => Label
 * - d => Color
 * - f => GameModel
 * - g => ResManager
 * - h => Vec3
 * - i => initializerDefineProperty
 * - l => SpriteFrame
 * - m => Util
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => Component
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => Sprite
 */
System.register("chunks:///_virtual/itemNode.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts","./Util.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.SpriteFrame,c=e.Label,u=e.Sprite,d=e.Color,h=e.Vec3,p=e.Component}
,function(e){
f=e.GameModel}
,function(e){
g=e.ResManager}
,function(e){
m=e.Util}
],execute:function(){
var v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R,L,x,D,G;
r._RF.push({
}
,"3e63alhslpP/4Lv3PTg3jNg","itemNode",void 0);
var E=a.ccclass,O=a.property;
e("itemNode",(v=E("itemNode"),y=O(s),_=O(s),b=O(s),S=O(s),C=O(s),w=O(s),N=O(s),k=O(l),T=O(l),v((P=t((A=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"noNode",P,o(t)),i(t,"duckSprite",M,o(t)),i(t,"duckShadow",I,o(t)),i(t,"duckName",F,o(t)),i(t,"newTag",R,o(t)),i(t,"useTag",L,o(t)),i(t,"useLight",x,o(t)),i(t,"itemBg",D,o(t)),i(t,"itemGrayBg",G,o(t)),t.id=0,t}
n(t,e);
var r=t.prototype;
return r.start=function(){
}
,r.initItem=function(){
var e=this,t=f.instance.collectArr;
if(this.noNode.getComponent(c).string=this.id.toString(),this.id+1<f.instance.level||this.id+1<f.instance.level2||f.LockAllDuck){
this.node.getComponent(u).spriteFrame=this.itemBg;
var n=f.cockNameArr[this.id-1];
this.duckName.active=!0,this.duckShadow.active=!0,this.duckName.getComponent(c).string=n;
var i=this.id-1;
i>99&&(i-=100);
var o="tex/book/duck/y"+(i+1).toString()+"/spriteFrame";
g.instance.bundleLoad("uiBundle",o,null,(function(t,n){
t?console.error(t):e.node&&(e.duckSprite.getComponent(u).spriteFrame=n)}
)),t.includes(n)||(t.push(n),this.newTag.active=!0,m.btnBreath(this.newTag))}
else{
this.node.getComponent(u).color=d.GRAY,this.duckSprite.getComponent(u).color=d.BLACK,this.node.getComponent(u).spriteFrame=this.itemBg,this.duckName.active=!0,this.duckShadow.active=!1;
var r=f.cockNameArr[this.id-1];
this.duckName.getComponent(c).string=r;
var a=this.id-1;
a>99&&(a-=100);
var s="tex/book/duck/y"+(a+1).toString()+"/spriteFrame";
g.instance.bundleLoad("uiBundle",s,null,(function(t,n){
t?console.error(t):e.node&&(e.duckSprite.getComponent(u).spriteFrame=n)}
))}
f.instance.duckName==f.cockNameArr[this.id-1]&&(this.useTag.active=!0,this.useLight.active=!0),f.instance.collectArr=t}
,r.hide=function(){
this.node.active=!1,this.useTag.active=!1,this.useLight.active=!1,this.newTag.active=!1,this.duckShadow.active=!1,this.duckName.active=!1,this.node.getComponent(u).color=d.WHITE,this.duckSprite.getComponent(u).color=d.WHITE,this.node.setScale(h.ZERO),this.duckSprite.getComponent(u).spriteFrame=null,this.node.getComponent(u).spriteFrame=this.itemGrayBg}
,t}
(p)).prototype,"noNode",[y],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),M=t(A.prototype,"duckSprite",[_],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),I=t(A.prototype,"duckShadow",[b],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),F=t(A.prototype,"duckName",[S],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),R=t(A.prototype,"newTag",[C],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),L=t(A.prototype,"useTag",[w],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),x=t(A.prototype,"useLight",[N],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),D=t(A.prototype,"itemBg",[k],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),G=t(A.prototype,"itemGrayBg",[T],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),B=A))||B)),r._RF.pop()}
}
}
))
