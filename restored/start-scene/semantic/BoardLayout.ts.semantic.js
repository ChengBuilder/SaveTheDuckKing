/**
 * Semantic view: chunks:///_virtual/BoardLayout.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - i => shuffleInPlace
 * - n => cclegacy
 * - t => createForOfIteratorHelperLoose
 */
/**
 * Restored module: chunks:///_virtual/BoardLayout.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => shuffleInPlace
 * - n => cclegacy
 * - t => createForOfIteratorHelperLoose
 */
System.register("chunks:///_virtual/BoardLayout.ts",["./rollupPluginModLoBabelHelpers.js","cc","./ArrayUtil.ts"],(function(e){
var t /* createForOfIteratorHelperLoose */, n /* cclegacy */, i /* shuffleInPlace */;
return{
setters:[function(e){
t=e.createForOfIteratorHelperLoose /* createForOfIteratorHelperLoose */}
,function(e){
n=e.cclegacy /* cclegacy */}
,function(e){
i=e.shuffleInPlace /* shuffleInPlace */}
],execute:function(){
e({
buildFullScreenMessyRowLocalXs:function(e,t,n,i,a,s){
void 0===t&&(t=r),void 0===n&&(n=o),void 0===i&&(i=20),void 0===a&&(a=50),void 0===s&&(s=30);
var l=n/2,c=t;
return e.map((function(e){
if(e<=0)return[];
var t=Array.from({
length:e+1}
,(function(){
return i+Math.random()*(a-i)}
)),o=Math.max(0,n-e*c),r=t.reduce((function(e,t){
return e+t}
),0);
r>o&&r>1e-6&&(t=t.map((function(e){
return e*(o/r)}
)));
var u=Math.min(s,o-.001);
u>0&&function(e,t,n,i){
var o=e.length-1;
if(!(o<0||e[o]>=i)){
for(var r=i-e[o],a=0,s=0;
s<n;
s++)a+=e[s];
if(!(a<=r+1e-6)){
for(var l=(a-r)/a,c=0;
c<n;
c++)e[c]=e[c]*l;
for(var u=0,d=0;
d<n;
d++)u+=e[d];
e[o]=t-u}
}
}
(t,o,e,u);
var d=[],h=-l+t[0]+c/2;
d.push(h);
for(var p=1;
p<e;
p++){
var f;
h+=c+(null!=(f=t[p])?f:0),d.push(h)}
return d}
))}
,buildFullScreenNeatRowLocalXs:function(e,t,n){
void 0===n&&(n=r);
var i=n;
return e.map((function(e){
if(e<=0)return[];
for(var n=-(e*i+(e-1)*t)/2+i/2,o=[],r=0;
r<e;
r++)o.push(n+r*(i+t));
return o}
))}
,buildRowSlotColsCenterPlusRandom:function(e){
for(var t=[],n=0;
n<e.length;
n++){
var i=e[n],o=h(s(n),i,n>0?t[n-1]:null);
if(null===o)return null;
t.push(o)}
return t}
,buildRowSlotColsFromRowCounts:function(e){
return e.map((function(e,t){
return l(s(t),e)}
))}
,buildRowSlotColsScatteredGap:function(e){
return e.map((function(e,t){
return p(s(t),e)}
))}
,centerOutSlotIndices:l,maxFruitsPerRowFullScreenMessy:a,maxFruitsPerRowWithSlotGap:function(e){
return Math.ceil(s(e)/2)}
,maxSlotsForRow:s,pickCenterPlusRandomSlots:h,pickScatteredGapSlots:p,validateRowCountsFullScreenMessy:function(e){
for(var t=a(),n=0;
n<e.length;
n++){
var i=e[n];
if(i<0||i>t)return!1}
return!0}
,validateRowCountsWithinSlots:function(e){
for(var t=0;
t<e.length;
t++){
var n=e[t];
if(n<0||n>s(t))return!1}
return!0}
}
),n._RF.push({
}
,"a1b2cPU5fZHiaASNFZ4mrze","BoardLayout",void 0);
var o=e("BOARD_DESIGN_WIDTH",750),r=e("BOARD_FRUIT_DIAMETER_DEFAULT",70);
function a(e,t,n){
void 0===e&&(e=r),void 0===t&&(t=o),void 0===n&&(n=20);
var i=e+n;
return i<=0?0:Math.floor((t-n)/i)}
function s(e){
return e%2==0?9:8}
function l(e,t){
if(t<=0||t>e)return[];
var n=[];
if(e%2==1){
var i=(e-1)/2;
n.push(i);
for(var o=1;
o<e;
o++)i-o>=0&&n.push(i-o),i+o<e&&n.push(i+o)}
else{
var r=e/2-1,a=e/2;
n.push(r,a);
for(var s=1;
s<e;
s++)r-s>=0&&n.push(r-s),a+s<e&&n.push(a+s)}
for(var l=new Set,c=[],u=0,d=n;
u<d.length;
u++){
var h=d[u];
if(!l.has(h)&&(l.add(h),c.push(h),c.length>=t))break}
return c.sort((function(e,t){
return e-t}
))}
function c(e,n){
for(var i,o=1/0,r=t(n);
!(i=r()).done;
){
var a=i.value,s=Math.abs(e-a);
s<o&&(o=s)}
return o}
function u(e){
for(var n,i=0,o=t(e);
!(n=o()).done;
)i+=n.value;
if(i<=0)return Math.floor(Math.random()*e.length);
for(var r=Math.random()*i,a=0;
a<e.length;
a++)if((r-=e[a])<=0)return a;
return e.length-1}
function d(e,n,i,o){
for(var r,a=function(e,n){
for(var i,o=function(e){
return e%2==1?[(e-1)/2]:[e/2-1,e/2]}
(n).filter((function(t){
return e.has(t)}
)),r=new Set,a=[],s=t(o);
!(i=s()).done;
){
var l=i.value;
r.add(l),a.push(l)}
for(;
a.length;
)for(var c=a.shift(),u=0,d=[c-1,c+1];
u<d.length;
u++){
var h=d[u];
h>=0&&h<n&&e.has(h)&&!r.has(h)&&(r.add(h),a.push(h))}
return r}
(n,i),s=t(n);
!(r=s()).done;
){
var l=r.value;
if(1===Math.abs(l-e)&&a.has(l))return!0}
if(o)for(var c,u=t(o);
!(c=u()).done;
){
var d=c.value;
if(Math.abs(d-e)<=1)return!0}
return!1}
function h(e,t,n){
if(t<=0||t>e)return[];
var i=null!=n&&n.length&&n.length>0?new Set(n):null,o=new Set,r=e/2-1,a=e/2;
if(e%2==1?o.add((e-1)/2):1===t?o.add(Math.random()<.5?r:a):(o.add(r),o.add(a)),o.size>=t)return Array.from(o).sort((function(e,t){
return e-t}
));
for(var s=!0,l=!0,h=function(){
if(e%2==1){
for(var t=(e-1)/2-1;
t>=0;
t--)if(!o.has(t))return t}
else for(var n=r-1;
n>=0;
n--)if(!o.has(n))return n;
return null}
,p=function(){
if(e%2==1){
for(var t=(e-1)/2+1;
t<e;
t++)if(!o.has(t))return t}
else for(var n=a+1;
n<e;
n++)if(!o.has(n))return n;
return null}
;
o.size<t;
){
var f=[],g=[];
if(s){
var m=h();
null!==m&&(d(m,o,e,i)?(f.push(m),g.push(1/(1+c(m,o)))):s=!1)}
if(l){
var v=p();
null!==v&&(d(v,o,e,i)?(f.push(v),g.push(1/(1+c(v,o)))):l=!1)}
if(0===f.length)return console.warn("[BoardLayout] pickCenterPlusRandomSlots 无法继续拓展（中间/下行约束），n=",e,"k=",t,"picked=",o.size),null;
var y=u(g);
o.add(f[y])}
return Array.from(o).sort((function(e,t){
return e-t}
))}
function p(e,t){
var n=Math.ceil(e/2);
if(t<=0||t>n)return[];
for(var o,r=[],a=[],s=0;
s<e;
s++)s%2==0?r.push(s):a.push(s);
return o=r.length>=t&&a.length>=t?Math.random()<.5?r.slice():a.slice():r.length>=t?r.slice():a.slice(),i(o),o.slice(0,t).sort((function(e,t){
return e-t}
))}
n._RF.pop()}
}
}
))

