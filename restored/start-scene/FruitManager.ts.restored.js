/**
 * Restored module: chunks:///_virtual/FruitManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => GameCtrl
 * - a => view
 * - b => Game2Controller
 * - c => Sprite
 * - C => GAME2_EVENT_KEYS
 * - d => Vec3
 * - g => Util
 * - k => GridManager
 * - m => GameModel
 * - n => asyncToGenerator
 * - N => GameData2
 * - o => cclegacy
 * - p => Component
 * - r => _decorator
 * - s => find
 * - S => default
 * - t => inheritsLoose
 * - T => FruitHole
 * - u => UIOpacity
 * - v => Fruit
 * - w => PoolManager
 * - y => ResManager
 */
System.register("chunks:///_virtual/FruitManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Util.ts","./GameModel2.ts","./Fruit.ts","./ResManager.ts","./GameCtrl.ts","./Game2Controller.ts","./EventManager.ts","./Enum.ts","./PoolManager.ts","./GameData2.ts","./GridManager.ts","./FruitHole.ts"],(function(e){
var t,n,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T;
return{
setters:[function(e){
t=e.inheritsLoose,n=e.asyncToGenerator}
,function(e){
o=e.cclegacy,r=e._decorator,a=e.view,s=e.find,l=e.v3,c=e.Sprite,u=e.UIOpacity,d=e.Vec3,h=e.v2,p=e.Component,f=e.sp}
,function(e){
g=e.Util}
,function(e){
m=e.GameModel}
,function(e){
v=e.Fruit}
,function(e){
y=e.ResManager}
,function(e){
_=e.GameCtrl}
,function(e){
b=e.Game2Controller}
,function(e){
S=e.default}
,function(e){
C=e.GAME2_EVENT_KEYS}
,function(e){
w=e.PoolManager}
,function(e){
N=e.GameData2}
,function(e){
k=e.GridManager}
,function(e){
T=e.FruitHole}
],execute:function(){
var B;
o._RF.push({
}
,"4420aSr+15DyIrlP/G1+pma","FruitManager",void 0);
var A=r.ccclass,P=(r.property,e("FruitManager",A("FruitManager")(B=function(e){
function o(){
for(var t,n=arguments.length,i=new Array(n),o=0;
o<n;
o++)i[o]=arguments[o];
return(t=e.call.apply(e,[this].concat(i))||this)._stopFruitDownY=0,t._eliminateListMaxLength=0,t._fruitsMoveTimer=0,t._isFruitsMove=!1,t._canDrawRope=!1,t._curLvMinY=0,t._curLvMaxY=0,t._curLvMinX=0,t._curLvMaxX=0,t._fruitTotalCount=0,t._fruitRemoveCombo=0,t.allFruitTs=[],t.allFruitNode=[],t.grids=[],t.gridFruitPos=[],t.fruitHoleArr=[],t.fruitInHoleArr=[],t.fruitInHoleNum=20,t.fruitCreateNum=0,t}
t(o,e);
var r=o.prototype;
return r.start=function(){
}
,r.initData=function(e){
var t=this;
this._stopFruitDownY=-a.getVisibleSize().height/2+1020,N._ins.holeFlag&&(this._stopFruitDownY+=50),this._eliminateListMaxLength=3,this._fruitsMoveTimer=0,this._isFruitsMove=!1,this._canDrawRope=!1,this._curLvMinY=0,this._curLvMaxY=0,this._curLvMinX=0,this._curLvMaxX=0,this._fruitTotalCount=0,this._fruitRemoveCombo=0,this.allFruitTs=[],this.allFruitNode=[],this.fruitInHoleArr=[],this.fruitHoleArr=[],N._ins.holeFlag&&this.createFruitHole();
var n=this.initLevelConfig(e);
console.log("DataConfig",n);
for(var i=0;
i<n.countNumArr.length;
i++)for(var o=0;
o<n.countNumArr[i].length;
o++)s("Canvas").getComponent(b).NoTouchFruitNum+=n.countNumArr[i][o],s("Canvas").getComponent(b).fruitNum+=n.countNumArr[i][o];
var r=n.fruitTypeArr,d=n.countNumArr;
if(n.intensity=1,this.initGrid(n.intensity),N._ins.tidyFlag){
console.log(N._ins.tidyType),0==N._ins.tidyType?k._ins.InitGrid(6,60,23,120,120,this._stopFruitDownY):1==N._ins.tidyType&&k._ins.InitGrid1(7,84,14,120,120,this._stopFruitDownY);
for(var h=k._ins.GetGrids(),p=0;
p<h.length;
p++)for(var f=0;
f<h[p].length;
f++)this.gridFruitPos.push(h[p][f].position)}
if(1==e)for(var g=[l(-240,this._stopFruitDownY+120-80),l(-80,this._stopFruitDownY+100-80),l(80,this._stopFruitDownY+100-80),l(240,this._stopFruitDownY+120-80),l(-160,this._stopFruitDownY+270-80),l(0,this._stopFruitDownY+250-80),l(160,this._stopFruitDownY+270-80),l(-80,this._stopFruitDownY+400-80),l(80,this._stopFruitDownY+400-80),l(0,this._stopFruitDownY+520-80)],m=0;
m<10;
m++){
var T=m<4?1:2,B=P[T],A=w.Spawn("fruit"+T,this.node);
A.setPosition(g[m]);
var M=A.getComponent(v),I={
type:T,radius:B.radius,scale:B.scale,isStatic:!1}
;
M.init(I),this.allFruitTs.push(M),this.allFruitNode.push(A),10==this.allFruitNode.length&&(_.instance.canTouch=!0,s("Canvas").getComponent(b).HideBottomWall(),s("Canvas").getComponent(b).fruitNum=10,S.instance.emit(C.INIT_FRUIT)),M.spr.getComponent(c).spriteFrame=y.instance.getSpriteFrame("fruit"+T),M.sprShadow.getComponent(c).spriteFrame=y.instance.getSpriteFrame("fruitShadow"+T),M.sprShadow.setScale(1.01,1.01,1.01),M.sprShadow.setPosition(0,-4),M.sprShadow.addComponent(u).opacity=180}
else for(var F=function(e){
t.scheduleOnce((function(){
var i=r[e],o=d[e],s=0;
o.forEach((function(e){
s+=e}
));
var l=s*Math.PI*90*90*n.intensity;
t._curLvMinY=0==t._curLvMaxY?-a.getVisibleSize().height/2+1080:t._curLvMaxY,t._curLvMaxY=t._curLvMinY+l/a.getVisibleSize().width,t.initFruit({
fruitTypeArr:i,countNumArr:o,intensity:n.intensity,curMinFruitY:t._curLvMinY,curMaxFruitY:t._curLvMaxY,createNum:e}
)}
),.1*e)}
,R=0;
R<r.length;
R++)F(R)}
,r.createFruitHole=function(){
var e=w.Spawn("fruitHole",s("Canvas/gameNode/FruitHoleManager")),t=w.Spawn("fruitHole",s("Canvas/gameNode/FruitHoleManager")),n=s("Canvas/gameNode/block").position;
e.setPosition(l(-200,n.y+50)),t.setPosition(l(200,n.y+50)),e.setScale(d.ZERO),t.setScale(d.ZERO),this.fruitHoleArr.push(e,t)}
,r.initLevelConfig=function(e){
var t={
fruitTypeArr:[],countNumArr:[],intensity:1,stakes:0}
;
if(3==e||e%10==3||e%10==1||e%10==2||5==e||e%10==5){
var n=238,i=268;
e%10==2&&(t.intensity=.9,t.stakes=6,Math.floor(e/10)%2==0&&(t.stakes=2),n=228,i=248),t.intensity=.9;
var o=this.initLayerTypeCount(e),r=90;
e<10?r+=10*(e-3):e>10&&e<30?r=172+2*(e-11):e>30&&e<100?r=Math.min(n,210+2*Math.floor((e-30)/5)):e>=100&&(r=Math.min(i,238+2*Math.floor((e-100)/10))),r=2==e?78:3==e?128:5==e?188:248;
for(var a=Math.floor(.1*r),s=Math.floor(.5*r),l=0,c=0;
c<3;
c++){
for(var u=[],d=[],h=o[c],p=1;
p<=h&&!(l>=r);
p++){
u.push(p);
var f=2;
c>1&&(f*=g.getRandomNum(1,2,!0)),l+=f,d.push(f)}
if(0==c)for(;
l<a;
)u.push(g.getRandomNum(1,h,!0)),l+=2,d.push(2);
if(1==c)for(;
l<s;
)u.push(g.getRandomNum(1,h,!0)),l+=2,d.push(2);
if(2==c)for(;
l<r;
)u.push(g.getRandomNum(1,h,!0)),l+=2,d.push(2);
t.fruitTypeArr.push(u),t.countNumArr.push(d)}
}
else if(4==e||e%10==4){
var m=this.initLayerTypeCount(e),v=100;
e>10&&e<30?v=178+20*Math.floor((e-10)/10):e>30&&e<100?v=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(v=Math.min(248,238+2*Math.floor((e-100)/10))),v=4==e?158:248;
for(var y=Math.floor(.2*v),_=Math.floor(.6*v),b=0,S=0;
S<3;
S++){
for(var C=[],w=[],N=m[S],k=1;
k<=N&&!(b>=v);
k++){
C.push(k);
var T=2;
S>0&&(T*=g.getRandomNum(1,2,!0)),b+=T,w.push(T)}
if(0==S)for(;
b<y;
)C.push(g.getRandomNum(1,N,!0)),b+=2,w.push(2);
if(1==S)for(;
b<_;
)C.push(g.getRandomNum(1,N,!0)),b+=2,w.push(2);
if(2==S)for(;
b<v;
)C.push(g.getRandomNum(1,N,!0)),b+=2,w.push(2);
t.fruitTypeArr.push(C),t.countNumArr.push(w)}
}
else if(6==e||e%10==6){
var B=this.initLayerTypeCount(e),A=150;
e>10&&e<30?A=184+20*Math.floor((e-10)/10):e>30&&e<100?A=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(A=Math.min(268,238+2*Math.floor((e-100)/10))),A=6==e?218:248;
for(var P=0,M=Math.floor(.1*A),I=Math.floor(.5*A),F=0;
F<3;
F++){
for(var R=[],L=[],x=B[F],D=1;
D<=x&&!(P>=A);
D++){
R.push(D);
var G=2;
F>0&&(G*=g.getRandomNum(1,2,!0)),P+=G,L.push(G)}
if(0==F)for(;
P<M;
)R.push(g.getRandomNum(1,x,!0)),P+=2,L.push(2);
if(1==F)for(;
P<I;
)R.push(g.getRandomNum(1,x,!0)),P+=2,L.push(2);
if(2==F)for(;
P<A;
)R.push(g.getRandomNum(1,x,!0)),P+=2,L.push(2);
t.fruitTypeArr.push(R),t.countNumArr.push(L)}
}
else if(7==e||e%10==7){
var E=this.initLayerTypeCount(e),O=150;
e>10&&e<30?O=184+20*Math.floor((e-10)/10):e>30&&e<100?O=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(O=Math.min(268,238+2*Math.floor((e-100)/10))),O=248;
for(var H=0,V=Math.floor(.1*O),U=Math.floor(.5*O),z=0;
z<3;
z++){
for(var W=[],j=[],J=E[z],Y=1;
Y<=J&&!(H>=O);
Y++){
W.push(Y);
var q=2;
z>0&&(q*=g.getRandomNum(1,2,!0)),H+=q,j.push(q)}
if(0==z)for(;
H<V;
)W.push(g.getRandomNum(1,J,!0)),H+=2,j.push(2);
if(1==z)for(;
H<U;
)W.push(g.getRandomNum(1,J,!0)),H+=2,j.push(2);
if(2==z)for(;
H<O;
)W.push(g.getRandomNum(1,J,!0)),H+=2,j.push(2);
t.fruitTypeArr.push(W),t.countNumArr.push(j)}
}
else if(8==e||e%10==8){
var K=this.initLayerTypeCount(e),X=160;
e>10&&e<30?X=186+20*Math.floor((e-10)/10):e>30&&e<100?X=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(X=Math.min(248,238+2*Math.floor((e-100)/10))),X=248;
for(var Q=Math.floor(.1*X),Z=Math.floor(.5*X),$=0,ee=0;
ee<3;
ee++){
for(var te=[],ne=[],ie=K[ee],oe=1;
oe<=ie&&!($>=X);
oe++){
te.push(oe);
var re=2;
ee>0&&(re*=g.getRandomNum(1,2,!0)),$+=re,ne.push(re)}
if(0==ee)for(;
$<Q;
)te.push(g.getRandomNum(1,ie,!0)),$+=2,ne.push(2);
if(1==ee)for(;
$<Z;
)te.push(g.getRandomNum(1,ie,!0)),$+=2,ne.push(2);
if(2==ee)for(;
$<X;
)te.push(g.getRandomNum(1,ie,!0)),$+=2,ne.push(2);
t.fruitTypeArr.push(te),t.countNumArr.push(ne)}
}
else if(9==e||e%10==9){
var ae=this.initLayerTypeCount(e);
console.log("进入9 9 9");
var se=170;
e>10&&e<30?se=188+20*Math.floor((e-10)/10):e>30&&e<100?se=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(se=Math.min(248,238+2*Math.floor((e-100)/10))),se=248;
for(var le=Math.floor(.2*se),ce=Math.floor(.6*se),ue=0,de=0;
de<3;
de++){
for(var he=[],pe=[],fe=ae[de],ge=1;
ge<=fe&&!(ue>=se);
ge++){
he.push(ge);
var me=2;
de>0&&(me*=g.getRandomNum(1,2,!0)),ue+=me,pe.push(me)}
if(0==de)for(;
ue<le;
)he.push(g.getRandomNum(1,fe,!0)),ue+=2,pe.push(2);
if(1==de)for(;
ue<ce;
)he.push(g.getRandomNum(1,fe,!0)),ue+=2,pe.push(2);
if(2==de)for(;
ue<se;
)he.push(g.getRandomNum(1,fe,!0)),ue+=2,pe.push(2);
t.fruitTypeArr.push(he),t.countNumArr.push(pe)}
}
else if(10==e||e%10==0){
console.log("进入101010");
var ve=this.initLayerTypeCount(e),ye=150;
e>10&&e<30?ye=184+20*Math.floor((e-10)/10):e>30&&e<100?ye=Math.min(238,210+2*Math.floor((e-30)/5)):e>=100&&(ye=Math.min(268,238+2*Math.floor((e-100)/10))),ye=248;
for(var _e=0,be=Math.floor(.1*ye),Se=Math.floor(.5*ye),Ce=0;
Ce<3;
Ce++){
for(var we=[],Ne=[],ke=ve[Ce],Te=1;
Te<=ke&&!(_e>=ye);
Te++){
we.push(Te);
var Be=2;
Ce>0&&(Be*=g.getRandomNum(1,2,!0)),_e+=Be,Ne.push(Be)}
if(0==Ce)for(;
_e<be;
)we.push(g.getRandomNum(1,ke,!0)),_e+=2,Ne.push(2);
if(1==Ce)for(;
_e<Se;
)we.push(g.getRandomNum(1,ke,!0)),_e+=2,Ne.push(2);
if(2==Ce)for(;
_e<ye;
)we.push(g.getRandomNum(1,ke,!0)),_e+=2,Ne.push(2);
t.fruitTypeArr.push(we),t.countNumArr.push(Ne)}
}
return t}
,r.initLayerTypeCount=function(e){
var t=[];
return 1==e?t=[5,14,30]:2==e?t=[4,11,22]:3==e?t=[5,10,22]:4==e?t=[5,16,33]:e%10==1?t=[5,16,30]:e%10==2?t=[5,16,33]:e%10==3?t=[5,12,25]:e%10==4||5==e||e%10==5?t=[5,16,33]:6==e||e%10==6?t=[5,16,30]:7==e||e%10==7?t=[5,16,33]:8==e||e%10==8?t=[6,15,30]:9==e||e%10==9?t=[6,16,33]:10!=e&&e%10!=0||(t=[6,16,33]),t}
,r.initGrid=function(e){
this.grids=[];
var t=a.getVisibleSize().width/4,n=(a.getVisibleSize().height-290-this._stopFruitDownY+50)/4,i=[],o=[];
i=[-a.getVisibleSize().width/2+t/2,-a.getVisibleSize().width/2+3*t/2,a.getVisibleSize().width/2-3*t/2,a.getVisibleSize().width/2-t/2],o=[this._stopFruitDownY+150,this._stopFruitDownY-50,this._stopFruitDownY-50,this._stopFruitDownY+150];
for(var r=Math.ceil(Math.ceil(t*t/(80*Math.PI*80))/e),s=0;
s<20;
s++){
for(var l=[],c=0;
c<i.length;
c++){
var u=i[c],d=o[c]+t*s,p={
pos:h(u,d),width:t,height:t,count:0,maxCount:r}
;
l.push(p)}
this.grids.push(l)}
i=[-a.getVisibleSize().width/2+t/2,-a.getVisibleSize().width/2+3*t/2,a.getVisibleSize().width/2-3*t/2,a.getVisibleSize().width/2-t/2],o=[this._stopFruitDownY+n/2,this._stopFruitDownY,this._stopFruitDownY,this._stopFruitDownY+n/2];
for(var f=0;
f<4;
f++){
for(var m=o[f]+n*f,v=[],y=0;
y<i.length;
y++){
var _=i[y],b={
pos:h(_,m),width:t,height:n,count:0,maxCount:g.getRandomNum(3,4,!0)/e}
;
v.push(b)}
this.grids.push(v)}
}
,r.initFruit=function(){
var e=n(i().mark((function e(t){
var n,o,r,a,l,d,h,p,m,k,T,B,A;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:for(n=this,o=t.fruitTypeArr,r=t.countNumArr,a=t.intensity,l=t.curMinFruitY,d=t.curMaxFruitY,t.createNum,h=[],p=0;
p<o.length;
p++)for(m=o[p],k=r[p],T=0;
T<k;
T++)h.push(m);
g.aginSortArr(h),B=i().mark((function e(t){
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:n.scheduleOnce((function(){
n.fruitCreateNum++;
var e=h[t],i=P[e],o=null,r=null;
r=n.getLegalPos(i.radius*i.scale,0,a,l,d),N._ins.tidyFlag&&(r=n.gridFruitPos[n.allFruitNode.length]),(o=w.Spawn("fruit"+e,n.node)).parent=n.node,o.setPosition(r);
var p=o.getComponent(v);
p.FruitCreateNum=n.fruitCreateNum;
var g={
type:e,radius:i.radius,scale:i.scale,isStatic:!1}
;
p.init(g),n.allFruitTs.push(p),n.allFruitNode.push(o),n.allFruitNode.length==s("Canvas").getComponent(b).fruitNum&&(N._ins.holeFlag&&n.getFruitInHole(),_.instance.canTouch=!0,S.instance.emit(C.HIDE_BOTTOM_WALL),S.instance.emit(C.INIT_FRUIT),n.scheduleOnce((function(){
N._ins.snagFlag&&(0==N._ins.snagType||1==N._ins.snagType)&&(s("Canvas/wallNode/snagMiddle").active=!1,s("Canvas/wallNode/snagLeft").active=!1,s("Canvas/wallNode/snagRight").active=!1),s("Canvas").getComponent(b).duckAni.getComponent(f.Skeleton).setAnimation(0,"stay",!0),s("Canvas").getComponent(b).initWarning()}
),1)),p.spr.getComponent(c).spriteFrame=y.instance.getSpriteFrame("fruit"+e),p.sprShadow.getComponent(c).spriteFrame=y.instance.getSpriteFrame("fruitShadow"+e),p.sprShadow.setScale(1.01,1.01,1.01),p.sprShadow.setPosition(0,-4),p.sprShadow.addComponent(u).opacity=180}
),.01*t/10);
case 1:case"end":return e.stop()}
}
),e)}
)),A=0;
case 3:if(!(A<h.length)){
e.next=8;
break}
return e.delegateYield(B(A),"t0",5);
case 5:A++,e.next=3;
break;
case 8:case"end":return e.stop()}
}
),e,this)}
)));
return function(t){
return e.apply(this,arguments)}
}
(),r.getFruitInHole=function(){
var e,t=this.allFruitNode.length-1;
e=g.getDiffNumRandom(0,t,this.fruitInHoleNum),this.fruitInHoleArr=[];
for(var n=0;
n<this.fruitInHoleNum;
n++)this.fruitInHoleArr.push(this.allFruitNode[e[n]]);
var i=Math.floor(this.fruitInHoleNum/2),o=this.fruitInHoleArr.slice(0,i),r=this.fruitInHoleArr.slice(i);
this.fruitHoleArr[0].getComponent(T).initFruitHole(o),this.fruitHoleArr[1].getComponent(T).initFruitHole(r)}
,r.getLegalPos=function(e,t,n,i,o){
for(var r=l(0,0),s=0;
!this.isLegalPos(r,e);
){
if(r.x=g.getRandomNum(-a.getVisibleSize().width/2+e+20,a.getVisibleSize().width/2-e-20),t>0){
var c=Math.max(t-a.getVisibleSize().height/2,i),u=t+a.getVisibleSize().height/2;
r.y=g.getRandomNum(c,u>o?o:u)}
else r.y=g.getRandomNum(i,o);
if(++s>=5e3){
r.y=g.getRandomNum(i,o);
break}
}
return r}
,r.isLegalPos=function(e,t,n){
if(void 0===n&&(n=1),0==e.x&&0==e.y)return!1;
if(e.x-t<=-a.getVisibleSize().width/2||e.x+t>=a.getVisibleSize().width/2)return!1;
if(e.y<this._curLvMinY)return!1;
if(e.y>this._curLvMaxY)return!1;
for(var i=0;
i<this.node.children.length-1;
i++){
var o=this.node.children[i],r=o.getComponent(v),s=r.radius*r.scale;
if(d.distance(e,o.getPosition())<(t+s)*n)return!1}
return!0}
,r.update=function(e){
this.updateMove()}
,r.updateMove=function(){
if(this._isFruitsMove){
if(_.instance.gameIsOver)return this._isFruitsMove=!1,void S.instance.emit(C.ALL_FRUIT_MOVE_COMPLETE);
var e=this.getTopFruit();
if(e&&(e.getPosition().y<a.getVisibleSize().height/2-380&&1!=m.instance.level2||e.getPosition().y<this._stopFruitDownY+250&&1==m.instance.level2))return this._isFruitsMove=!1,_.instance.canTouch=!0,void S.instance.emit(C.ALL_FRUIT_MOVE_COMPLETE);
var t=this.getBottomFruit();
if(t){
var n=t.getPosition().y;
if(n<this._stopFruitDownY)t.getComponent(v).moveTipAnim(),this._isFruitsMove=!1,_.instance.canTouch=!0,S.instance.emit(C.ALL_FRUIT_MOVE_COMPLETE);
else{
var i=n-this._stopFruitDownY>15?15:5;
1==m.instance.level2&&15==i&&(i=25),S.instance.emit(C.FRUIT_SET_SPEED,i)}
}
}
}
,r.getTopFruit=function(){
for(var e=0,t=null,n=0;
n<this.allFruitNode.length;
n++)this.allFruitNode[n].getComponent(v).canPop&&this.allFruitNode[n].getPosition().y>e&&(e=this.allFruitNode[n].getPosition().y,t=this.allFruitNode[n]);
return t}
,r.getBottomFruit=function(e){
void 0===e&&(e=!1);
for(var t=99999,n=null,i=0;
i<this.allFruitNode.length;
i++)e&&"fruit66"==this.allFruitNode[i].name||this.allFruitNode[i].getComponent(v).belongToHole||this.allFruitNode[i].getComponent(v).canPop&&this.allFruitNode[i].getPosition().y<t&&(t=this.allFruitNode[i].getPosition().y,n=this.allFruitNode[i]);
return n}
,r.sortFruitByY=function(){
this.allFruitNode.sort((function(e,t){
return e.getPosition().y-t.getPosition().y}
))}
,r.onEnable=function(){
S.instance.on(C.ALL_FRUIT_MOVE,this.fruitStartMove,this)}
,r.onDisable=function(){
S.instance.off(C.ALL_FRUIT_MOVE,this.fruitStartMove,this)}
,r.fruitStartMove=function(){
var e=s("Canvas").getComponent(b);
if((0!=this.allFruitNode.length||0!=e.DeleteGridArr.length)&&!_.instance.gameIsOver){
for(var t=0;
t<this.allFruitNode.length;
t++)this.allFruitNode[t].getComponent(v).wakeUpRb();
this._isFruitsMove=!0,_.instance.canTouch=!1,this._fruitsMoveTimer=0}
}
,o}
(p))||B),{
0:{
radius:64,scale:.855,particleType:1}
,1:{
radius:75,scale:.92*.9,particleType:5}
,2:{
radius:78,scale:.774,particleType:2}
,3:{
radius:82,scale:.81,particleType:1}
,4:{
radius:75,scale:.81,particleType:3}
,5:{
radius:79,scale:.81,particleType:2}
,6:{
radius:75,scale:.81,particleType:6}
,7:{
radius:78,scale:.81,particleType:2}
,8:{
radius:80,scale:.81,particleType:2}
,9:{
radius:78,scale:.855,particleType:2}
,10:{
radius:76,scale:.81,particleType:6}
,11:{
radius:77,scale:.846,particleType:1}
,12:{
radius:77,scale:.855,particleType:4}
,13:{
radius:79,scale:.92*.9,particleType:6}
,14:{
radius:77,scale:.81,particleType:1}
,15:{
radius:81,scale:.81,particleType:2}
,16:{
radius:76,scale:.855,particleType:6}
,17:{
radius:79,scale:.93*.9,particleType:1}
,18:{
radius:76,scale:.81,particleType:2}
,19:{
radius:73,scale:.93*.9,particleType:5}
,20:{
radius:77,scale:.81,particleType:6}
,21:{
radius:81,scale:.81,particleType:6}
,22:{
radius:75,scale:.92*.9,particleType:2}
,23:{
radius:77,scale:.774,particleType:5}
,24:{
radius:75,scale:.783,particleType:2}
,25:{
radius:78,scale:.92*.9,particleType:6}
,26:{
radius:74,scale:.92*.9,particleType:2}
,27:{
radius:82,scale:.92*.9,particleType:5}
,28:{
radius:74,scale:.92*.9,particleType:2}
,29:{
radius:75,scale:.783,particleType:6}
,30:{
radius:75,scale:.783,particleType:3}
,31:{
radius:75,scale:.81,particleType:2}
,32:{
radius:76,scale:.783,particleType:5}
,33:{
radius:75,scale:.792,particleType:2}
,34:{
radius:75,scale:.792,particleType:2}
,66:{
radius:236,scale:.25,particleType:1}
}
);
o._RF.pop()}
}
}
))
