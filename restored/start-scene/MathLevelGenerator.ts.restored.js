/**
 * Restored module: chunks:///_virtual/MathLevelGenerator.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - n => cclegacy
 * - t => createForOfIteratorHelperLoose
 */
System.register("chunks:///_virtual/MathLevelGenerator.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){
var t,n;
return{
setters:[function(e){
t=e.createForOfIteratorHelperLoose}
,function(e){
n=e.cclegacy}
],execute:function(){
n._RF.push({
}
,"4403b18e0BHcZv6MkM+GLrO","MathLevelGenerator",void 0);
var i=e("Operator",function(e){
return e.ADD="+",e.SUB="-",e.MUL="x",e.DIV="/",e}
({
}
));
e("MathLevelGenerator",function(){
function e(){
}
return e.generate=function(e){
for(var t=e.gridRows,n=e.gridCols,i=Math.floor((t-1)/2),o=Math.floor((n-1)/2),r=0;
r<100;
){
var a=Array.from({
length:t}
,(function(){
return Array.from({
length:n}
,(function(){
return{
value:null,isFixed:!0,type:"empty"}
}
))}
));
if(this.fillSparseGrid(a,i,o,e)>=10&&this.getAllEquations(a).length>=10){
var s=this.createPuzzle(a,e);
return{
gridRows:t,gridCols:n,grid:a,pool:s}
}
r++}
return null}
,e.fillSparseGrid=function(e,n,i,o){
o.minNum,o.maxNum,o.operators,o.gridRows,o.gridCols;
for(var r=(n+1)*(i+1),a=Math.floor(.7*r),s=0,l=!1,c=0;
c<100&&!l;
c++){
var u=Math.random()>.5,d=Math.floor(Math.random()*(n+1)),h=Math.floor(Math.random()*(i+1));
this.tryPlaceEquation(e,d,h,u,n,i,o)&&(s++,l=!0)}
if(!l)return 0;
for(var p=0;
p<2e3;
p++){
for(var f=[],g=0;
g<=n;
g++)for(var m=0;
m<=i;
m++)"empty"!==e[2*g][2*m].type&&f.push({
r:g,c:m}
);
if(f.length>=a)break;
var v=f[Math.floor(Math.random()*f.length)],y=[!0,!1],_=[0,1,2];
y.sort((function(){
return Math.random()-.5}
)),_.sort((function(){
return Math.random()-.5}
));
for(var b=!1,S=0,C=y;
S<C.length;
S++){
for(var w,N=C[S],k=t(_);
!(w=k()).done;
){
var T=w.value,B=v.r,A=v.c;
if(1===T?N?A-=1:B-=1:2===T&&(N?A-=2:B-=2),B>=0&&A>=0&&this.tryPlaceEquation(e,B,A,N,n,i,o)){
s++,b=!0;
break}
}
if(b)break}
}
return s}
,e.isCellPartOfHorizontal=function(e,t,n){
return n+1<e[0].length&&("operator"===e[t][n+1].type||"equal"===e[t][n+1].type)||n-1>=0&&("operator"===e[t][n-1].type||"equal"===e[t][n-1].type)}
,e.isCellPartOfVertical=function(e,t,n){
return t+1<e.length&&("operator"===e[t+1][n].type||"equal"===e[t+1][n].type)||t-1>=0&&("operator"===e[t-1][n].type||"equal"===e[t-1][n].type)}
,e.isRowOccupied=function(e,t,n){
for(var i=0;
i<e[t].length;
i++)if(i!==n&&("operator"===e[t][i].type||"equal"===e[t][i].type))return!0;
return!1}
,e.isColOccupied=function(e,t,n){
for(var i=0;
i<e.length;
i++)if(i!==t&&("operator"===e[i][n].type||"equal"===e[i][n].type))return!0;
return!1}
,e.tryPlaceEquation=function(e,t,n,i,o,r,a){
var s=a.minNum,l=a.maxNum,c=a.operators,u=a.gridRows,d=a.gridCols,h=2*t,p=2*n;
if(i){
if(p+4>=d)return!1}
else if(h+4>=u)return!1;
var f=e[h][p].value;
null===f&&(f=Math.floor(Math.random()*(l-s+1))+s);
for(var g,m,v=c[Math.floor(Math.random()*c.length)],y=!1,_=0;
!y&&_<10;
){
if(g=Math.floor(Math.random()*(l-s+1))+s,m=this.calculate(f,g,v),!isNaN(m)&&Number.isInteger(m)&&m>=s&&m<=l)if(y=!0,i){
var b=p+1,S=p+2,C=p+3,w=p+4;
this.canPlaceAt(e[h][p],f,"number")&&this.canPlaceAt(e[h][b],v,"operator")&&this.canPlaceAt(e[h][S],g,"number")&&this.canPlaceAt(e[h][C],"=","equal")&&this.canPlaceAt(e[h][w],m,"result")||(y=!1)}
else{
var N=h+1,k=h+2,T=h+3,B=h+4;
this.canPlaceAt(e[h][p],f,"number")&&this.canPlaceAt(e[N][p],v,"operator")&&this.canPlaceAt(e[k][p],g,"number")&&this.canPlaceAt(e[T][p],"=","equal")&&this.canPlaceAt(e[B][p],m,"result")||(y=!1)}
_++}
return!!y&&(i?(e[h][p]={
value:f,isFixed:!0,type:"number"}
,e[h][p+1]={
value:v,isFixed:!0,type:"operator"}
,e[h][p+2]={
value:g,isFixed:!0,type:"number"}
,e[h][p+3]={
value:"=",isFixed:!0,type:"equal"}
,e[h][p+4]={
value:m,isFixed:!0,type:"result"}
):(e[h][p]={
value:f,isFixed:!0,type:"number"}
,e[h+1][p]={
value:v,isFixed:!0,type:"operator"}
,e[h+2][p]={
value:g,isFixed:!0,type:"number"}
,e[h+3][p]={
value:"=",isFixed:!0,type:"equal"}
,e[h+4][p]={
value:m,isFixed:!0,type:"result"}
),!0)}
,e.canPlaceAt=function(e,t,n){
return"empty"===e.type||e.type===n&&e.value===t}
,e.calculate=function(e,t,n){
switch(n){
case i.ADD:return e+t;
case i.SUB:return e-t;
case i.MUL:return e*t;
case i.DIV:return 0!==t?e/t:NaN;
default:return NaN}
}
,e.createPuzzle=function(e,n){
for(var i=[],o=0;
o<e.length;
o++)for(var r=0;
r<e[o].length;
r++)"number"===e[o][r].type||e[o][r].type;
for(var a,s=this.getAllEquations(e),l=new Set,c=t(s);
!(a=c()).done;
){
var u=a.value,d=[{
r:u.r1,c:u.c1}
,{
r:u.r2,c:u.c2}
,{
r:u.resR,c:u.resC}
],h=d[Math.floor(Math.random()*d.length)];
l.add(h.r+","+h.c)}
for(var p=0;
p<e.length;
p++)for(var f=0;
f<e[p].length;
f++)(l.has(p+","+f)||"number"===e[p][f].type&&Math.random()<n.difficulty)&&null!==e[p][f].value&&(i.push(e[p][f].value),e[p][f].value=null,e[p][f].isFixed=!1);
return i.sort((function(e,t){
return e-t}
))}
,e.getAllEquations=function(e){
for(var t=[],n=e.length,i=e[0].length,o=0;
o<n;
o++)for(var r=0;
r<i;
r++)r+4<i&&"operator"===e[o][r+1].type&&"equal"===e[o][r+3].type&&t.push({
r1:o,c1:r,r2:o,c2:r+2,resR:o,resC:r+4}
),o+4<n&&"operator"===e[o+1][r].type&&"equal"===e[o+3][r].type&&t.push({
r1:o,c1:r,r2:o+2,c2:r,resR:o+4,resC:r}
);
return t}
,e}
()),n._RF.pop()}
}
}
))
