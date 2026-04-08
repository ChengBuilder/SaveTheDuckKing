/**
 * Restored module: chunks:///_virtual/GridManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => cclegacy
 * - l => default
 * - n => createClass
 * - o => _decorator
 * - s => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/GridManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts","./Grid.ts"],(function(e){
var t,n,i,o,r,a,s,l;
return{
setters:[function(e){
t=e.inheritsLoose,n=e.createClass}
,function(e){
i=e.cclegacy,o=e._decorator,r=e.v2,a=e.v3}
,function(e){
s=e.default}
,function(e){
l=e.default}
],execute:function(){
var c;
i._RF.push({
}
,"819afZMpiFKWJCkXf0Kq44c","GridManager",void 0);
var u=o.ccclass;
o.property,e("GridManager",u("GridManager")(c=function(e){
function i(){
for(var t,n=arguments.length,i=new Array(n),o=0;
o<n;
o++)i[o]=arguments[o];
return(t=e.call.apply(e,[this].concat(i))||this)._gridCol=void 0,t._gridRow=void 0,t._gridSpacing=void 0,t._gridWidth=void 0,t._gridHeight=void 0,t.grid=[],t}
t(i,e);
var o=i.prototype;
return o.start=function(){
}
,o.InitGrid=function(e,t,n,i,o,s){
void 0===s&&(s=0),this._gridCol=e,this._gridRow=t,this._gridSpacing=n,this._gridWidth=i,this._gridHeight=o,0!=this.grid.length&&(this.grid=[]);
for(var l=0;
l<t;
l++){
var c=[],u=e;
l%2==0&&(u=e-1);
for(var d=r(-(u-1)/2*(i+n),s+l*(o+n)),h=0;
h<u;
h++){
var p=a(d.x+h*(i+n),d.y),f=this.NewOneGrid(l,h,p);
c.push(f)}
this.grid.push(c)}
}
,o.InitGrid1=function(e,t,n,i,o,s){
void 0===s&&(s=0),this._gridCol=e,this._gridRow=t,this._gridSpacing=n,this._gridWidth=i,this._gridHeight=o,0!=this.grid.length&&(this.grid=[]);
for(var l=0,c=e,u=0,d=0;
d<t;
d++){
var h=[];
0==u?(l<c&&(l+=1),l==c&&(u=1)):1==u&&(l>1&&(l-=1),1==l&&(u=0));
for(var p=l,f=r(-(p-1)/2*(i+n),s+d*(o+n)),g=0;
g<p;
g++){
var m=a(f.x+g*(i+n),f.y),v=this.NewOneGrid(d,g,m);
h.push(v)}
this.grid.push(h)}
}
,o.GetGrids=function(){
return this.grid}
,o.NewOneGrid=function(e,t,n){
return new l(e,t,n)}
,o.update=function(e){
}
,n(i,null,[{
key:"_ins",get:function(){
return e.getInstance.call(this)}
}
]),i}
(s))||c),i._RF.pop()}
}
}
))
