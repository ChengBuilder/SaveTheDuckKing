/**
 * Restored module: chunks:///_virtual/Nail.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Label
 * - a => _decorator
 * - A => DuckController
 * - b => Contact2DType
 * - B => Util
 * - c => UITransform
 * - C => ResManager
 * - d => UIOpacity
 * - f => quat
 * - g => tween
 * - i => initializerDefineProperty
 * - k => COLLIDER_TAG
 * - l => Sprite
 * - m => RigidBody2D
 * - M => GameData
 * - n => inheritsLoose
 * - N => GameCtrl
 * - o => assertThisInitialized
 * - p => find
 * - P => AudioManager
 * - r => cclegacy
 * - s => Node
 * - S => Component
 * - t => applyDecoratedDescriptor
 * - T => PHY_GROUP
 * - u => instantiate
 * - v => CircleCollider2D
 * - w => GameModel
 * - y => ERigidBody2DType
 */
System.register("chunks:///_virtual/Nail.ts",["./rollupPluginModLoBabelHelpers.js","cc","./ResManager.ts","./GameModel2.ts","./GameCtrl.ts","./Enum.ts","./Util.ts","./DuckController.ts","./AudioManager.ts","./GameData.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.Sprite,c=e.UITransform,u=e.instantiate,d=e.UIOpacity,h=e.v3,p=e.find,f=e.quat,g=e.tween,m=e.RigidBody2D,v=e.CircleCollider2D,y=e.ERigidBody2DType,_=e.Label,b=e.Contact2DType,S=e.Component}
,function(e){
C=e.ResManager}
,function(e){
w=e.GameModel}
,function(e){
N=e.GameCtrl}
,function(e){
k=e.COLLIDER_TAG,T=e.PHY_GROUP}
,function(e){
B=e.Util}
,function(e){
A=e.DuckController}
,function(e){
P=e.AudioManager}
,function(e){
M=e.GameData}
],execute:function(){
var I,F,R,L,x,D,G,E,O,H,V;
r._RF.push({
}
,"d0200uE3KRET45wSILOwYe6","Nail",void 0);
var U=a.ccclass,z=a.property;
e("Nail",(I=U("Nail"),F=z(s),R=z(s),L=z(s),x=z(s),I((E=t((G=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return(t=e.call.apply(e,[this].concat(r))||this).type=0,i(t,"rod",E,o(t)),i(t,"spr",O,o(t)),i(t,"lc",H,o(t)),i(t,"grove",V,o(t)),t.highLight=null,t.shadow=null,t.lockSprite=null,t.iceNode=null,t.iceNodeLabel=null,t.canPop=!0,t.dropFlag=!1,t.inGridFlag=!1,t.RigidNail=null,t.ColliderNail=null,t.HingeJointNail=null,t.JudgeDeleteFlag=!1,t.lastJudgeFlag=!1,t.isNailLock=!1,t.isIceLock=!1,t.iceNum=0,t.isPlayColliderMusic=!1,t.isJudgeComboFlag=!1,t}
n(t,e);
var r=t.prototype;
return r.start=function(){
}
,r.onEnable=function(){
}
,r.onDisable=function(){
this.closeColliderListener()}
,r.initNail=function(e,t){
var n=this;
void 0===t&&(t=!1),this.initLockNail(),this.type=e;
var i=this;
C.instance.bundleLoad("DuckBundle","tex/nail/dingZi/spriteFrame",null,(function(e,t){
e?console.log(e):i.rod.getComponent(l).spriteFrame=t}
));
var o="tex/newNail/ls"+w.nameArr1[e-1]+"/spriteFrame";
C.instance.bundleLoad("DuckBundle",o,null,(function(e,t){
e?console.log(e):i.spr.getComponent(l).spriteFrame=t}
));
var r="tex/newNail/lw"+w.nameArr1[e-1]+"/spriteFrame";
C.instance.bundleLoad("DuckBundle",r,null,(function(e,t){
e?console.log(e):(i.grove.getComponent(l).spriteFrame=t,i.grove.getComponent(c).width=25,i.grove.getComponent(c).height=25)}
)),C.instance.bundleLoad("DuckBundle","prefab/nailShadow",null,(function(e,i){
if(!t)if(e)console.log(e);
else{
var o=u(i);
o.parent=n.node,o.getComponent(c).width=55,o.getComponent(c).height=55,o.setPosition(0,0),o.setSiblingIndex(0),o.layer=n.node.layer,n.shadow=o}
}
)),C.instance.bundleLoad("DuckBundle","prefab/lockSprite",null,(function(e,i){
if(!t)if(e)console.log(e);
else{
var o=u(i);
o.parent=n.spr,o.layer=n.node.layer,o.setPosition(0,0),o.getComponent(d).opacity=0,n.lockSprite=o,n.isNailLock||(o.active=!1)}
}
)),C.instance.bundleLoad("DuckBundle","prefab/highLight",null,(function(e,i){
if(!t)if(e)console.log(e);
else{
var o=u(i);
o.parent=n.node,o.scale=h(.4,.4),o.angle=0,o.setPosition(0,0),o.layer=n.node.layer,n.highLight=o}
}
)),C.instance.bundleLoad("DuckBundle","prefab/iceNode",null,(function(e,i){
if(!t)if(e)console.log(e);
else{
var o=u(i);
o.parent=n.node,o.setPosition(0,0),o.layer=n.node.layer,o.getComponent(d).opacity=0,n.iceNode=o,n.iceNodeLabel=o.getChildByName("iceNum"),n.updateIceNum(),n.isIceLock?p("Canvas").getComponent(A).iceNailArr.push(n.node):o.active=!1}
}
))}
,r.initNailAngle=function(){
if(this.lockSprite.worldRotation=f(0,0,0),this.iceNodeLabel.worldRotation=f(0,0,0),this.highLight.worldRotation=f(0,0,0),M._ins.lockNailFlag){
var e=this.lockSprite.getChildByName("wenHao");
g(e).to(.2,{
scale:h(1,1,1)}
,{
easing:"quadOut"}
).start(),g(this.lockSprite.getComponent(d)).to(.2,{
opacity:255}
,{
easing:"quadOut"}
).start()}
M._ins.iceNailFlag&&(g(this.iceNodeLabel).to(.2,{
scale:h(1,1,1)}
,{
easing:"quadOut"}
).start(),g(this.iceNode.getComponent(d)).to(.2,{
opacity:255}
,{
easing:"quadOut"}
).start()),g(this.highLight.getComponent(d)).to(.15,{
opacity:255}
,{
easing:"quadOut"}
).start()}
,r.initNailCollider=function(){
var e=this,t=this.node.getComponent(m);
t.angularDamping=.5,t.gravityScale=18,t.enabledContactListener=!1;
var n=this.node.addComponent(v);
this.ColliderNail=this.node.getComponent(v),this.ColliderNail.radius=this.node.getComponent(c).width/2,this.ColliderNail.friction=0,n.restitution=.1,this.ColliderNail.enabled=!1,this.ColliderNail.tag=k.NAIL,this.scheduleOnce((function(){
e.ColliderNail.group=T.Nail,e.ColliderNail.apply()}
)),this.RigidNail=t}
,r.openCollider=function(){
this.RigidNail.type=y.Dynamic,this.ColliderNail.enabled=!0,this.ColliderNail.apply()}
,r.closeRigid=function(){
this.ColliderNail.enabled=!1,this.HingeJointNail.enabled=!1,this.RigidNail.enabled=!1}
,r.openRigid=function(){
this.HingeJointNail.enabled=!0,this.RigidNail.enabled=!0}
,r.initLockNail=function(){
if(M._ins.lockNailFlag){
var e=B.getRandomNum(0,1,!1),t=.08;
w.instance.level>10&&(t=.12),w.instance.level<5&&(t=.05),e<t&&(this.isNailLock=!0)}
}
,r.initIceNail=function(e){
if(!(p("Canvas").getComponent(A).popNum>0)&&M._ins.iceNailFlag){
this.isIceLock=!0;
var t=B.getRandomNum(6,7,!0)+1;
this.iceNum=t,e<9?t=B.getRandomNum(3,5,!0)+1:e<12?t=B.getRandomNum(4,5,!0)+1:e<16&&B.getRandomNum(4,6,!0)}
}
,r.updateIceNum=function(){
var e=this;
if(this.isIceLock&&(this.iceNum--,this.iceNodeLabel.getComponent(_).string=this.iceNum.toString(),0==this.iceNum)){
this.isIceLock=!1;
var t=p("Canvas").getComponent(A);
t.iceNailArr.splice(t.iceNailArr.indexOf(this.node),1),g(this.iceNode.getComponent(d)).to(.2,{
opacity:0}
).call((function(){
e.iceNode.active=!1}
)).start()}
}
,r.breakLock=function(){
var e=this;
this.isNailLock&&(this.isNailLock=!1,g(this.lockSprite.getComponent(d)).to(.2,{
opacity:0}
).call((function(){
e.lockSprite.active=!1}
)).start())}
,r.changeLayer=function(){
this.node.layer=1<<25,this.rod.layer=1<<25,this.spr.layer=1<<25,this.lc.layer=1<<25,this.grove.layer=1<<25,this.highLight.layer=1<<25,this.shadow.layer=1<<25,this.lockSprite.layer=1<<25}
,r.recoveryLayer=function(){
this.node.layer=1<<30,this.rod.layer=1<<30,this.spr.layer=1<<30,this.lc.layer=1<<30,this.grove.layer=1<<30,this.highLight.layer=1<<30,this.shadow.layer=1<<30,this.lockSprite.layer=1<<30}
,r.openColliderListener=function(){
this.ColliderNail&&this.ColliderNail.on(b.BEGIN_CONTACT,this.onBeginContact,this)}
,r.closeColliderListener=function(){
this.ColliderNail&&this.ColliderNail.off(b.BEGIN_CONTACT,this.onBeginContact,this)}
,r.update=function(e){
if(!N.instance.gameIsOver&&this.dropFlag){
var t=p("Canvas/realWall/line").getPosition(),n=B.convetOtherNodeSpace(this.node,p("Canvas/realWall")),i=p("Canvas").getComponent(A);
n.y<t.y&&i.DeleteGridArr.length<i.maxLenGridNum?(this.dropFlag=!1,this.inGridFlag=!0,i.DeleteGridArr.push(this.node),i.sortGridSibling(),this.JudgeDeleteFlag=!0,i.DeleteGridArr.length==i.maxLenGridNum&&(i.adGridShakeMove(),console.log("刚好满了"),i.showAdGridCal())):n.y<t.y+this.node.getComponent(c).height/2*this.node.worldScale.y&&i.DeleteGridArr.length==i.maxLenGridNum?(this.dropFlag=!1,this.inGridFlag=!0,i.DeleteGridArr.push(this.node),i.sortGridSibling(),this.lastJudgeFlag=!0,this.JudgeDeleteFlag=!0):n.y<t.y+this.node.getComponent(c).height/2*this.node.worldScale.y&&i.DeleteGridArr.length>i.maxLenGridNum&&(this.dropFlag=!1,this.inGridFlag=!0)}
}
,r.onBeginContact=function(e,n,i){
if(N.instance.gameIsOver)this.rod.active=!1;
else{
var o=p("Canvas").getComponent(A);
if(n.tag!=k.REAL_WALL||"adGrid0"!=n.node.name&&"adGrid1"!=n.node.name&&"wallD"!=n.node.name||(this.JudgeCombo(n.node,!1),this.closeRestitution()),n.tag===k.NAIL&&this.JudgeDeleteFlag){
if(this.rod.active=!1,n.node.getComponent(t).inGridFlag&&this.inGridFlag){
this.closeRestitution();
var r=n.node;
if(this.type===r.getComponent(t).type){
this.closeCollider(),r.getComponent(t).closeCollider(),o.DeleteGridArr.splice(o.DeleteGridArr.indexOf(this.node),1),o.DeleteGridArr.splice(o.DeleteGridArr.indexOf(r),1);
var a=[this.node,r];
o.popDeleteNail(a),(0==o.NoTouchNailNum&&!o.isNailNodeHasDropChildren()&&o.isGridDeleteHasChildren()||this.lastJudgeFlag&&this.isNailNodeHasChildren())&&o.OverEffect()}
else this.type!==r.getComponent(t).type&&this.lastJudgeFlag?this.JudgeDeleteGridCanDelete()||o.OverEffect():this.type!==r.getComponent(t).type&&(this.JudgeCombo(r,!1),o.judgeNullLose())}
}
else n.tag!=k.REAL_WALL||this.isPlayColliderMusic||(this.rod.active=!1,this.isPlayColliderMusic=!0,P.instance.playSound("duckGame/stoneCollision"))}
}
,r.closeRestitution=function(){
if(0!=this.ColliderNail.restitution){
var e=this.node.getComponent(v);
e.enabled=!1,e.restitution=0,e.enabled=!0}
}
,r.JudgeCombo=function(e,t){
e.worldPosition.y>this.node.worldPosition.y||this.isJudgeComboFlag||(this.isJudgeComboFlag=!0,p("Canvas").getComponent(A).PopComboRecord(t))}
,r.isNailNodeHasChildren=function(){
var e=!0;
return this.node.parent.children.length>0&&(e=!1),e}
,r.isGridDeleteHasChildren=function(){
return p("Canvas").getComponent(A).DeleteGridArr.length>0}
,r.JudgeDeleteGridCanDelete=function(){
var e=p("Canvas").getComponent(A),n=e.DeleteGridArr;
n.sort((function(e,t){
return e.position.y-t.position.y}
));
for(var i=0;
i<n.length-1;
i++)if(n[i].getComponent(t).type==n[i+1].getComponent(t).type)return!0;
return e.DeleteGridArr.length<=e.maxLenGridNum&&(this.lastJudgeFlag=!1,!0)}
,r.closeCollider=function(){
var e=this;
this.ColliderNail.off(b.BEGIN_CONTACT,this.onBeginContact,this),this.inGridFlag=!1,this.dropFlag=!1,this.scheduleOnce((function(){
e.ColliderNail.enabled=!1,e.RigidNail.enabled=!1,e.node.getComponent(v).destroy(),e.node.getComponent(m).destroy()}
))}
,t}
(S)).prototype,"rod",[F],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),O=t(G.prototype,"spr",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(G.prototype,"lc",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=t(G.prototype,"grove",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),D=G))||D)),r._RF.pop()}
}
}
))
