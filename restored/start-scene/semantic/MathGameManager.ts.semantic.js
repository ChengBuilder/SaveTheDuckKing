/**
 * Semantic view: chunks:///_virtual/MathGameManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => MathGridItem
 * - a => cclegacy
 * - b => TooYueManager
 * - c => Node
 * - d => instantiate
 * - f => Color
 * - g => Vec3
 * - h => UITransform
 * - i => initializerDefineProperty
 * - l => Prefab
 * - m => Component
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => Sprite
 * - r => createForOfIteratorHelperLoose
 * - s => _decorator
 * - t => applyDecoratedDescriptor
 * - u => Label
 * - v => Operator
 * - y => MathLevelGenerator
 */
/**
 * Restored module: chunks:///_virtual/MathGameManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => MathGridItem
 * - a => cclegacy
 * - b => TooYueManager
 * - c => Node
 * - d => instantiate
 * - f => Color
 * - g => Vec3
 * - h => UITransform
 * - i => initializerDefineProperty
 * - l => Prefab
 * - m => Component
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => Sprite
 * - r => createForOfIteratorHelperLoose
 * - s => _decorator
 * - t => applyDecoratedDescriptor
 * - u => Label
 * - v => Operator
 * - y => MathLevelGenerator
 */
System.register("chunks:///_virtual/MathGameManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./MathLevelGenerator.ts","./MathGridItem.ts","./TooYueManager.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* createForOfIteratorHelperLoose */, a /* cclegacy */, s /* _decorator */, l /* Prefab */, c /* Node */, u /* Label */, d /* instantiate */, h /* UITransform */, p /* Sprite */, f /* Color */, g /* Vec3 */, m /* Component */, v /* Operator */, y /* MathLevelGenerator */, _ /* MathGridItem */, b /* TooYueManager */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */,r=e.createForOfIteratorHelperLoose /* createForOfIteratorHelperLoose */}
,function(e){
a=e.cclegacy /* cclegacy */,s=e._decorator /* _decorator */,l=e.Prefab /* Prefab */,c=e.Node /* Node */,u=e.Label /* Label */,d=e.instantiate /* instantiate */,h=e.UITransform /* UITransform */,p=e.Sprite /* Sprite */,f=e.Color /* Color */,g=e.Vec3 /* Vec3 */,m=e.Component /* Component */}
,function(e){
v=e.Operator /* Operator */,y=e.MathLevelGenerator /* MathLevelGenerator */}
,function(e){
_=e.MathGridItem /* MathGridItem */}
,function(e){
b=e.TooYueManager /* TooYueManager */}
],execute:function(){
var S,C,w,N,k,T,B,A,P,M,I,F,R,L,x;
a._RF.push({
}
,"cab4151btpK6KkTj738V0wq","MathGameManager",void 0);
var D=s.ccclass,G=s.property,E=e("GridType",function(e){
return e[e.EMPTY=0]="EMPTY",e[e.NUMBER=1]="NUMBER",e[e.OPERATOR=2]="OPERATOR",e[e.EQUAL=3]="EQUAL",e[e.RESULT=4]="RESULT",e}
({
}
));
e("MathGameManager",(S=D("MathMathGameManager"),C=G(l),w=G(c),N=G(c),k=G(c),T=G(c),B=G(c),S((M=t((P=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"gridItemPrefab",M,o(t)),i(t,"boardNode",I,o(t)),i(t,"boardBackgroundNode",F,o(t)),i(t,"numberPoolNode",R,o(t)),i(t,"gameWinNode",L,o(t)),t.currentPuzzle=null,i(t,"LevelLabel",x,o(t)),t.levelNum=1,t}
n(t,e);
var a=t.prototype;
return a.start=function(){
this.gameWinNode&&(this.gameWinNode.active=!1),this.gameWinNode&&this.gameWinNode.on(c.EventType.TOUCH_END,this.onNextLevelClick,this),this.generateNewLevel()}
,a.updateLabel=function(){
this.LevelLabel.getComponent(u).string="第 "+this.levelNum+" 关"}
,a.generateNewLevel=function(){
console.log("Starting level generation..."),this.gameWinNode&&(this.gameWinNode.active=!1);
var e={
gridRows:11,gridCols:11,minNum:1,maxNum:24,operators:[v.ADD,v.SUB,v.MUL],difficulty:.4}
,t=y.generate(e);
if(t){
this.currentPuzzle=t;
for(var n=0,i=t.gridRows,o=t.gridCols,r=t.grid,a=0;
a<i;
a++)for(var s=0;
s<o;
s++)s+4<o&&"number"===r[a][s].type&&"operator"===r[a][s+1].type&&"equal"===r[a][s+3].type&&n++,a+4<i&&"number"===r[a][s].type&&"operator"===r[a+1][s].type&&"equal"===r[a+3][s].type&&n++;
console.log("Level generated, Total Equations: "+n+", rendering..."),this.renderPuzzle(t)}
else console.error("Failed to generate puzzle, retrying..."),this.generateNewLevel()}
,a.renderPuzzle=function(e){
this.boardNode.removeAllChildren();
var t=e.gridRows,n=e.gridCols,i=e.grid,o=d(this.gridItemPrefab),r=o.getComponent(h),a=r?r.width:90,s=r?r.height:90,l=a,c=s;
o.destroy();
var u=(n-1)*l,g=(t-1)*c,m=-u/2,v=g/2;
if(this.boardBackgroundNode){
this.boardBackgroundNode.active=!0;
var y=this.boardBackgroundNode.getComponent(h);
if(y){
y.setContentSize(u+l+5,g+c+5);
var _=this.boardBackgroundNode.getComponent(p);
_&&(_.color=new f(139,69,19))}
this.boardBackgroundNode.setSiblingIndex(0)}
for(var b=0;
b<t;
b++)for(var S=0;
S<n;
S++){
var C=i[b][S],w=E.EMPTY,N="";
switch(C.type){
case"number":w=E.NUMBER,N=null!==C.value?C.value.toString():"";
break;
case"operator":w=E.OPERATOR,N=C.value;
break;
case"equal":w=E.EQUAL,N="=";
break;
case"result":w=E.RESULT,N=null!==C.value?C.value.toString():""}
this.createGridItem(b,S,w,N,C.isFixed,m,v,l,c)}
this.renderNumberPool(e.pool,a,s)}
,a.createGridItem=function(e,t,n,i,o,r,a,s,l){
var c=d(this.gridItemPrefab);
c.parent=this.boardNode,c.setPosition(r+t*s,a-e*l),c.setScale(1,1,1);
var u=c.getComponent(_);
u&&u.init({
type:n,value:i,isFixed:o,r:e,c:t}
)}
,a.renderNumberPool=function(e,t,n){
var i=this;
this.numberPoolNode.removeAllChildren();
var o=t;
e.forEach((function(t,n){
var r=d(i.gridItemPrefab);
r.parent=i.numberPoolNode;
var a=Math.ceil(e.length/8),s=Math.floor(n/8),l=n%8,c=-((s===a-1&&e.length%8||8)-1)*o/2;
r.setPosition(c+l*o,-s*o);
var u=r.getComponent(_);
u&&u.init({
type:E.NUMBER,value:t.toString(),isFixed:!1}
,!0)}
))}
,a.tryPlaceNumber=function(e,t){
for(var n,i=this.boardNode.children,o=null,a=80,s=r(i);
!(n=s()).done;
){
var l=n.value,c=l.getComponent(_);
if(c&&(c.data.type===E.NUMBER||c.data.type===E.RESULT)&&!c.data.isFixed){
if(l===e)continue;
var u=g.distance(l.position,t);
u<a&&(a=u,o=l)}
}
if(o){
var d=e.getComponent(_),h=o.getComponent(_),p=h.label.string,f=d.label.string;
if(h.label.string=f,h.data.value=f,h.updateStyle(),p&&""!==p.trim())if(void 0!==e._placeholder){
var m=e._placeholder;
if(m&&m.isValid){
var v=m.getComponent(_);
v&&(v.label.string=p,v.data.value=p,v.updateStyle())}
}
else{
var y=e._originalPoolPos||e.position.clone();
this.addNumberToPoolAtPos(parseInt(p),y)}
return e.destroy(),this.checkWin(),!0}
return!1}
,a.addNumberToPoolAtPos=function(e,t){
var n=d(this.gridItemPrefab);
n.parent=this.numberPoolNode,n.setPosition(t);
var i=n.getComponent(_);
i&&i.init({
type:E.NUMBER,value:e.toString(),isFixed:!1}
,!0)}
,a.addNumberToPool=function(e){
var t=d(this.gridItemPrefab);
t.parent=this.numberPoolNode;
var n=t.getComponent(_);
n&&n.init({
type:E.NUMBER,value:e.toString(),isFixed:!1}
,!0);
var i=this.numberPoolNode.children.length-1,o=Math.floor(i/8),r=i%8;
t.setPosition(90*r-315,90*-o)}
,a.sortNumberPool=function(){
var e=this.numberPoolNode.children,t=90;
if(e.length>0){
var n=e[0].getComponent(h);
n&&(t=n.width)}
e.forEach((function(n,i){
var o=Math.floor(i/8),r=i%8,a=8;
o===Math.ceil(e.length/8)-1&&(a=e.length%8||8);
var s=-(a-1)*t/2;
n.setPosition(s+r*t,-o*t)}
))}
,a.checkWin=function(){
var e=this.boardNode.children,t=this.currentPuzzle;
if(t){
for(var n,i=t.gridRows,o=t.gridCols,a=Array.from({
length:i}
,(function(){
return Array(o).fill(null)}
)),s=Array.from({
length:i}
,(function(){
return Array(o).fill(null)}
)),l=r(e);
!(n=l()).done;
){
var c=n.value.getComponent(_);
if(c){
var u=c.data.r,d=c.data.c;
void 0!==u&&void 0!==d&&(a[u][d]={
type:c.data.type,value:c.label.string,isFixed:c.data.isFixed}
,s[u][d]=c)}
}
for(var h,p=!0,f=Math.floor((i-1)/2),g=Math.floor((o-1)/2),m=r(e);
!(h=m()).done;
){
var v=h.value.getComponent(_);
v&&v.setStatus("normal")}
for(var y=0;
y<=f;
y++)for(var b=2*y,S=0;
S<=g-2;
S++){
var C=2*S,w=a[b][C+1];
if(w&&w.type===E.OPERATOR&&w.value){
var N=a[b][C].value,k=a[b][C+2].value,T=a[b][C+4];
if(""!==N&&""!==k&&T&&""!==T.value){
var B=parseInt(N),A=parseInt(k),P=w.value,M=parseInt(T.value),I=this.calculate(B,A,P)===M,F=I?"correct":"wrong";
I||(p=!1);
for(var R=0;
R<5;
R++){
var L=s[b][C+R];
L&&"wrong"!==L.status&&L.setStatus(F)}
}
else p=!1}
}
for(var x=0;
x<=g;
x++)for(var D=2*x,G=0;
G<=f-2;
G++){
var O=2*G,H=a[O+1][D];
if(H&&H.type===E.OPERATOR&&H.value){
var V=a[O][D].value,U=a[O+2][D].value,z=a[O+4][D];
if(""!==V&&""!==U&&z&&""!==z.value){
var W=parseInt(V),j=parseInt(U),J=H.value,Y=parseInt(z.value),q=this.calculate(W,j,J)===Y,K=q?"correct":"wrong";
q||(p=!1);
for(var X=0;
X<5;
X++){
var Q=s[O+X][D];
Q&&"wrong"!==Q.status&&Q.setStatus(K)}
}
else p=!1}
}
p&&(console.log("Game Win!"),this.gameWinNode&&(this.gameWinNode.active=!0))}
}
,a.validateGrid=function(e,t){
for(var n=t.gridRows,i=t.gridCols,o=Math.floor((n-1)/2),r=Math.floor((i-1)/2),a=0;
a<=o;
a++)for(var s=0;
s<=r;
s++){
var l=2*a,c=2*s;
if(c+2<i){
var u=e[l][c+1];
if(u&&u.type===E.OPERATOR&&u.value){
var d=parseInt(e[l][c].value),h=u.value,p=parseInt(e[l][c+2].value),f=e[l][i-1];
if(f&&f.type===E.RESULT&&f.value){
var g=parseInt(f.value);
if(this.calculate(d,p,h)!==g)return!1}
}
}
if(l+2<n){
var m=e[l+1][c];
if(m&&m.type===E.OPERATOR&&m.value){
var v=parseInt(e[l][c].value),y=m.value,_=parseInt(e[l+2][c].value),b=e[n-1][c];
if(b&&b.type===E.RESULT&&b.value){
var S=parseInt(b.value);
if(this.calculate(v,_,y)!==S)return!1}
}
}
}
return!0}
,a.calculate=function(e,t,n){
switch(n){
case v.ADD:return e+t;
case v.SUB:return e-t;
case v.MUL:return e*t;
case v.DIV:return 0!==t?e/t:NaN;
default:return NaN}
}
,a.onNextLevelClick=function(){
var e=this;
console.log("Next Level Clicked!"),b._ins.showVideoAd("数字运算下一关",(function(){
console.log("看完视频"),e.levelNum++,e.updateLabel(),e.generateNewLevel()}
))}
,t}
(m)).prototype,"gridItemPrefab",[C],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),I=t(P.prototype,"boardNode",[w],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),F=t(P.prototype,"boardBackgroundNode",[N],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),R=t(P.prototype,"numberPoolNode",[k],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),L=t(P.prototype,"gameWinNode",[T],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),x=t(P.prototype,"LevelLabel",[B],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),A=P))||A)),a._RF.pop()}
}
}
))

