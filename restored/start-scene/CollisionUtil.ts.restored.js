/**
 * Restored module: chunks:///_virtual/CollisionUtil.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - t => cclegacy
 */
System.register("chunks:///_virtual/CollisionUtil.ts",["cc"],(function(e){
var t;
return{
setters:[function(e){
t=e.cclegacy}
],execute:function(){
t._RF.push({
}
,"24544de6RZN+KjUaD+2vFou","CollisionUtil",void 0),e("CollisionUtil",function(){
function e(){
}
return e.circleVsCircle=function(e,t,n,i,o,r){
var a=i-e,s=o-t,l=n+r;
return a*a+s*s<l*l}
,e.circleVsPolygon=function(e,t,n,i){
if(!i||i.length<3)return!1;
for(var o=i.length,r=0;
r<o;
r++){
var a=i[r],s=i[(r+1)%o],l=Array.isArray(a)?a[0]:a.x,c=Array.isArray(a)?a[1]:a.y,u=Array.isArray(s)?s[0]:s.x,d=Array.isArray(s)?s[1]:s.y;
if(this._pointToSegmentDistSq(e,t,l,c,u,d)<=n*n)return!0}
return this._pointInPolygon(e,t,i)}
,e._pointToSegmentDistSq=function(e,t,n,i,o,r){
var a=o-n,s=r-i,l=a*a+s*s,c=0;
l>1e-10&&(c=Math.max(0,Math.min(1,((e-n)*a+(t-i)*s)/l)));
var u=n+c*a-e,d=i+c*s-t;
return u*u+d*d}
,e._pointInPolygon=function(e,t,n){
for(var i=n.length,o=!1,r=0,a=i-1;
r<i;
a=r++){
var s=n[r],l=n[a],c=Array.isArray(s)?s[0]:s.x,u=Array.isArray(s)?s[1]:s.y,d=Array.isArray(l)?l[0]:l.x,h=Array.isArray(l)?l[1]:l.y;
u>t!=h>t&&e<(d-c)*(t-u)/(h-u)+c&&(o=!o)}
return o}
,e}
()),t._RF.pop()}
}
}
))
