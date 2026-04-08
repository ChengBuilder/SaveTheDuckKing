/**
 * Restored module: chunks:///_virtual/Grid.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - t => cclegacy
 */
System.register("chunks:///_virtual/Grid.ts",["cc"],(function(e){
var t;
return{
setters:[function(e){
t=e.cclegacy}
],execute:function(){
t._RF.push({
}
,"f4e6bnFQiNBRpDQKedO4lwx","Grid",void 0);
var n=e("Stack",function(){
function e(){
this.items={
}
,this.count=0}
var t=e.prototype;
return t.push=function(e){
this.items[this.count++]=e}
,t.peek=function(){
return this.items[this.count-1]}
,t.pop=function(){
if(!this.isEmpty()){
var e=this.items[--this.count];
return delete this.items[this.count],e}
}
,t.isEmpty=function(){
return 0==this.count}
,t.size=function(){
return this.count}
,t.remove=function(t){
if(this.peek()!==t){
for(var n=new e;
!this.isEmpty()&&this.peek()!=t;
)n.push(this.pop());
for(this.pop();
!n.isEmpty();
)this.push(n.pop())}
else this.pop()}
,t.clear=function(){
this.items={
}
,this.count=0}
,t.toString=function(){
if(!this.isEmpty()){
for(var e=""+this.items[0],t=0;
t<this.count;
t++)e+=""+this.items[t];
return e}
}
,e}
());
e("default",(function(e,t,i,o){
void 0===o&&(o=[]),this.col=void 0,this.row=void 0,this.type=void 0,this.have=void 0,this.bg=void 0,this.position=void 0,this.stack=void 0,this.col=e,this.row=t,this.position=i,this.have=!1,this.type=o,this.stack=new n}
)),t._RF.pop()}
}
}
))
