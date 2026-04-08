/**
 * Restored module: chunks:///_virtual/Fruit.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Contact2DType
 * - a => _decorator
 * - A => Util
 * - b => Sprite
 * - B => COLLIDER_TAG
 * - C => Component
 * - d => PolygonCollider2D
 * - f => CircleCollider2D
 * - F => GameModel
 * - g => UITransform
 * - h => Tween
 * - i => initializerDefineProperty
 * - I => GameData2
 * - k => default
 * - m => ERigidBody2DType
 * - M => AdManager
 * - n => inheritsLoose
 * - N => AudioManager
 * - o => assertThisInitialized
 * - p => Vec3
 * - P => Game2Controller
 * - r => cclegacy
 * - R => FruitHole
 * - s => Node
 * - S => Color
 * - t => applyDecoratedDescriptor
 * - T => GAME2_EVENT_KEYS
 * - u => RigidBody2D
 * - v => tween
 * - w => GameCtrl
 * - y => find
 */
System.register("chunks:///_virtual/Fruit.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameCtrl.ts","./AudioManager.ts","./EventManager.ts","./Enum.ts","./Util.ts","./Game2Controller.ts","./AdManager.ts","./GameData2.ts","./GameModel2.ts","./FruitHole.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
,function(e){
r=e.cclegacy,a=e._decorator,s=e.Node,l=e.v3,c=e.v2,u=e.RigidBody2D,d=e.PolygonCollider2D,h=e.Tween,p=e.Vec3,f=e.CircleCollider2D,g=e.UITransform,m=e.ERigidBody2DType,v=e.tween,y=e.find,_=e.Contact2DType,b=e.Sprite,S=e.Color,C=e.Component}
,function(e){
w=e.GameCtrl}
,function(e){
N=e.AudioManager}
,function(e){
k=e.default}
,function(e){
T=e.GAME2_EVENT_KEYS,B=e.COLLIDER_TAG}
,function(e){
A=e.Util}
,function(e){
P=e.Game2Controller}
,function(e){
M=e.AdManager}
,function(e){
I=e.GameData2}
,function(e){
F=e.GameModel}
,function(e){
R=e.FruitHole}
],execute:function(){
var L,x,D,G,E,O,H;
r._RF.push({
}
,"bf6c10fc7lIiqjgyUCFDIFM","Fruit",void 0);
var V=a.ccclass,U=a.property;
e("Fruit",(L=V("Fruit"),x=U(s),D=U(s),L((O=t((E=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"spr",O,o(t)),i(t,"sprShadow",H,o(t)),t.lockNode=null,t.radius=0,t.scale=0,t.type=0,t.rb=null,t.polygonCollider=null,t.originalPos=l(),t.dropFlag=!1,t.canPop=!0,t.inGridFlag=!1,t.JudgeDeleteFlag=!1,t.lastJudgeFlag=!1,t.isJudgeComboFlag=!1,t._isMoveTipAnim=!1,t.linearVelocity=c(0,0),t.isMoveAnim=!1,t.canMove=!0,t.canGyroscope=!0,t.FruitCreateNum=0,t.lockFlag=!1,t.belongToHole=null,t.isPlayColliderMusic=!1,t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
this.spr=this.node.getChildByName("spr"),this.sprShadow=this.node.getChildByName("sprShadow"),this.lockNode=this.node.getChildByName("lock"),this.rb=this.node.getComponent(u),this.polygonCollider=this.node.getComponent(d)}
,r.start=function(){
}
,r.onEnable=function(){
k.instance.on(T.ALL_FRUIT_MOVE,this.fruitMove,this),k.instance.on(T.ALL_FRUIT_MOVE_COMPLETE,this.moveComplete,this),k.instance.on(T.FRUIT_SET_SPEED,this.setMoveSpeed,this),k.instance.on(T.INIT_FRUIT,this.initAnimation,this)}
,r.onDisable=function(){
k.instance.off(T.ALL_FRUIT_MOVE,this.fruitMove,this),k.instance.off(T.ALL_FRUIT_MOVE_COMPLETE,this.moveComplete,this),k.instance.off(T.FRUIT_SET_SPEED,this.setMoveSpeed,this),k.instance.off(T.INIT_FRUIT,this.initAnimation,this),this.closeColliderListener()}
,r.init=function(e){
var t=e.type,n=e.radius,i=e.scale;
e.isStatic,this.type=t,this.radius=n,this.scale=i,this.initLockFlag(),h.stopAllByTarget(this.node),this.node.setScale(l(p.ZERO)),this.lockFlag?(this.lockNode.active=!0,this.spr.active=!1,this.sprShadow.active=!1,this.initLockNode(),this.rb.fixedRotation=!0):(this.spr.active=!0,this.sprShadow.active=!0,this.lockNode.active=!1)}
,r.initLockFlag=function(){
if(I._ins.lockFruitFlag){
var e=A.getRandomNum(0,100),t=10;
F.instance.level2>10&&(t=12),this.lockFlag=e<t}
}
,r.initHoleFlag=function(e){
this.node.position=e.position,this.node.setScale(l(p.ZERO)),this.isMoveAnim=!1,this.canMove=!1,this.belongToHole=e}
,r.initLockNode=function(){
var e=this.node.getComponent(f);
e.enabled=!0;
var t=1/this.scale;
this.lockNode.scale=l(t,t,t),this.lockNode.getComponent(g).width=130,this.lockNode.getComponent(g).height=130,e.radius=65/this.scale}
,r.closeLockNode=function(){
this.spr.active=!0,this.sprShadow.active=!0,this.lockNode.active=!1,this.node.getComponent(f).enabled=!1,this.lockFlag=!1}
,r.initAnimation=function(){
var e=this;
if(this.belongToHole)return this.originalPos=this.node.position,this.rb.type=m.Static,this.polygonCollider.restitution=.1,this.rb.fixedRotation=!1,void this.node.on(s.EventType.TOUCH_START,this.onTouchBack,this);
v(this.node).delay(.5+.01*this.FruitCreateNum/10).to(.5,{
scale:l(this.scale,this.scale,this.scale)}
,{
easing:"backOut"}
).delay(.3).call((function(){
e.originalPos=e.node.position,e.rb.type=m.Static,e.polygonCollider.restitution=.1,e.rb.fixedRotation=!1,e.node.on(s.EventType.TOUCH_START,e.onTouchBack,e)}
)).start()}
,r.onTouchBack=function(e){
y("Canvas").getComponent(P).tscd=10,w.instance.canTouch&&this.canPop&&(y("Canvas").getComponent(P).GyroscopeTimer=0,y("Canvas").getComponent(P).showAdGridITime=0,this.popFruit())}
,r.popFruit=function(){
N.instance.playSound("fruitGame/fruitClick"),M.vibrate(),this.rb.type=m.Dynamic,this.rb.gravityScale=18,this.dropFlag=!0,this.canPop=!1,A.setParent(this.node,y("Canvas/gameNode/fruitNode"));
var e=y("Canvas").getComponent(P);
this.polygonCollider.tag=B.NAIL,e.NoTouchFruitNum--,this.belongToHole&&(this.belongToHole.getComponent(R).sendFruit(),this.belongToHole=null),this.openColliderListener(),k.instance.off(T.ALL_FRUIT_MOVE,this.fruitMove,this),k.instance.off(T.ALL_FRUIT_MOVE_COMPLETE,this.moveComplete,this),k.instance.off(T.FRUIT_SET_SPEED,this.setMoveSpeed,this)}
,r.openColliderListener=function(){
this.polygonCollider&&this.polygonCollider.on(_.BEGIN_CONTACT,this.onBeginContact,this)}
,r.closeColliderListener=function(){
this.polygonCollider&&this.polygonCollider.off(_.BEGIN_CONTACT,this.onBeginContact,this)}
,r.removeFromHole=function(){
this.belongToHole.getComponent(R).deleteFruitByProp(this.node),this.belongToHole=null}
,r.update=function(e){
if(!w.instance.gameIsOver){
var t;
if(t=this.node.getComponent(g).width>this.node.getComponent(g).height?this.node.getComponent(g).width/2*this.node.worldScale.x:this.node.getComponent(g).height/2*this.node.worldScale.y,this.dropFlag){
var n=y("Canvas/realWall/line").getPosition(),i=A.convetOtherNodeSpace(this.node,y("Canvas/realWall")),o=y("Canvas").getComponent(P);
i.y<n.y&&o.DeleteGridArr.length<o.maxLenGridNum?(this.dropFlag=!1,this.inGridFlag=!0,o.DeleteGridArr.push(this.node),o.sortGridSibling(),this.JudgeDeleteFlag=!0,this.lockFlag&&this.closeLockNode(),o.DeleteGridArr.length==o.maxLenGridNum&&o.adGridShakeMove(),o.tryFruitMove()):i.y<n.y+t&&o.DeleteGridArr.length==o.maxLenGridNum?(this.dropFlag=!1,this.inGridFlag=!0,o.DeleteGridArr.push(this.node),o.sortGridSibling(),this.lockFlag&&this.closeLockNode(),this.lastJudgeFlag=!0,this.JudgeDeleteFlag=!0,o.tryFruitMove()):i.y<n.y+t&&o.DeleteGridArr.length>o.maxLenGridNum&&(this.dropFlag=!1,this.inGridFlag=!0)}
}
}
,r.onBeginContact=function(e,n,i){
if(!w.instance.gameIsOver){
var o=y("Canvas").getComponent(P);
if(n.tag!=B.REAL_WALL||"adGrid0"!=n.node.name&&"adGrid1"!=n.node.name&&"wallD"!=n.node.name||(this.JudgeCombo(n.node,!1),this.closeRestitution()),n.tag===B.NAIL&&this.JudgeDeleteFlag){
if(n.node.getComponent(t).inGridFlag&&this.inGridFlag){
this.closeRestitution();
var r=n.node;
if(this.type===r.getComponent(t).type){
this.closeCollider(),r.getComponent(t).closeCollider(),o.DeleteGridArr.splice(o.DeleteGridArr.indexOf(this.node),1),o.DeleteGridArr.splice(o.DeleteGridArr.indexOf(r),1);
var a=[this.node,r];
o.popDeleteFruit(a),0==o.NoTouchFruitNum&&!o.isFruitNodeHasDropChildren()&&o.isGridDeleteHasChildren()?(console.log("lose1"),o.OverEffect()):this.lastJudgeFlag&&this.isFruitNodeHasChildren()&&(console.log("lose2"),o.OverEffect())}
else this.type!==r.getComponent(t).type&&this.lastJudgeFlag?this.JudgeDeleteGridCanDelete()||(console.log("lose3"),o.OverEffect()):this.type!==r.getComponent(t).type&&(this.JudgeCombo(r,!1),o.judgeNullLose())}
}
else n.tag!=B.REAL_WALL||this.isPlayColliderMusic||(this.isPlayColliderMusic=!0,N.instance.playSound("duckGame/stoneCollision"))}
}
,r.JudgeDeleteGridCanDelete=function(){
var e=y("Canvas").getComponent(P),n=e.DeleteGridArr;
n.sort((function(e,t){
return e.position.y-t.position.y}
));
for(var i=0;
i<n.length-1;
i++)if(n[i].getComponent(t).type==n[i+1].getComponent(t).type)return!0;
return e.DeleteGridArr.length<=e.maxLenGridNum&&(this.lastJudgeFlag=!1,!0)}
,r.isFruitNodeHasChildren=function(){
var e=!0;
return this.node.parent.children.length>0&&(e=!1),e}
,r.fruitMove=function(e){
!this.canMove||this.inGridFlag||this.dropFlag||w.instance.gameIsOver||(this.isMoveAnim=!0,this.setMoveSpeed(0))}
,r.setMoveSpeed=function(e,t){
if(this.isMoveAnim&&!this.inGridFlag&&!this.dropFlag&&this.canPop){
var n=this.node.getPosition();
this.node.setPosition(n.add(l(0,-e)))}
}
,r.moveComplete=function(e){
this.setLinearVelocity(0,0),this.isMoveAnim=!1,this.originalPos=this.node.getPosition(),this.canPop&&(this.rb.unscheduleAllCallbacks(),this.rb.type=m.Static)}
,r.moveTipAnim=function(){
var e=this;
this._isMoveTipAnim||(this._isMoveTipAnim=!0,"fruit66"==this.node.name?(h.stopAllByTarget(this.node.getComponent(b)),v(this.node.getComponent(b)).to(.7,{
color:S.GRAY}
).to(.7,{
color:S.WHITE}
).start(),h.stopAllByTarget(this.node.children[0].getComponent(b)),v(this.node.children[0].getComponent(b)).to(.7,{
color:S.GRAY}
).to(.7,{
color:S.WHITE}
).delay(3).call((function(){
e._isMoveTipAnim=!1}
)).start()):(h.stopAllByTarget(this.spr.getComponent(b)),v(this.spr.getComponent(b)).to(.7,{
color:S.GRAY}
).to(.7,{
color:S.WHITE}
).delay(3).call((function(){
e._isMoveTipAnim=!1}
)).start()))}
,r.setLinearVelocity=function(e,t){
void 0===e&&(e=0),void 0===t&&(t=0),this.linearVelocity.set(e,t),this.rb.linearVelocity=this.linearVelocity}
,r.moveTo=function(e){
var t=this;
this.canPop||(this.JudgeDeleteFlag=!1,this.canGyroscope=!0,this.canMove=!0,this.canPop=!0,this.dropFlag=!1,this.inGridFlag=!1,this.isPlayColliderMusic=!1,this.lastJudgeFlag=!1,y("Canvas").getComponent(P).NoTouchFruitNum++,this.rb.type=m.Static,this.rb.gravityScale=0,this.setLinearVelocity(0,0),A.setParent(this.node,y("Canvas").getComponent(P).FruitManager),k.instance.on(T.ALL_FRUIT_MOVE,this.fruitMove,this),k.instance.on(T.ALL_FRUIT_MOVE_COMPLETE,this.moveComplete,this),k.instance.on(T.FRUIT_SET_SPEED,this.setMoveSpeed,this)),v(this.node).to(.5,{
position:e}
,{
easing:"sineInOut"}
).call((function(){
t.node.setScale(p.ZERO);
var e=t.scale;
v(t.node).to(.2,{
scale:l(1,1,1).multiplyScalar(e)}
,{
easing:"backOut"}
).start()}
)).start()}
,r.reset=function(e){
var t=this;
this.canPop?(this.scheduleOnce((function(){
t.rb.type=m.Dynamic}
),0),v(this.node).delay(.7).call((function(){
t.rb.type=m.Static}
)).start()):(this.JudgeDeleteFlag=!1,this.canGyroscope=!0,this.canMove=!0,this.canPop=!0,this.dropFlag=!1,this.inGridFlag=!1,this.isPlayColliderMusic=!1,this.lastJudgeFlag=!1,y("Canvas").getComponent(P).NoTouchFruitNum++,this.polygonCollider.enabled=!1,A.setParent(this.node,y("Canvas").getComponent(P).FruitManager),k.instance.on(T.ALL_FRUIT_MOVE,this.fruitMove,this),k.instance.on(T.ALL_FRUIT_MOVE_COMPLETE,this.moveComplete,this),k.instance.on(T.FRUIT_SET_SPEED,this.setMoveSpeed,this),h.stopAllByTarget(this.spr),this.setSprColor(S.WHITE),e&&(this.originalPos=e),v(this.node).to(.5,{
position:this.originalPos}
,{
easing:"sineInOut"}
).call((function(){
t.node.setScale(p.ZERO),t.rb.type=m.Dynamic,t.rb.gravityScale=0,t.setLinearVelocity(0,0),t.rb.angularVelocity=0,t.polygonCollider.enabled=!0}
)).to(.2,{
scale:l(this.scale,this.scale,this.scale)}
,{
easing:"backOut"}
).call((function(){
t.rb.type=m.Static,w.instance.canTouch=!0,w.instance.btnCanTouch=!0,w.instance.gameIsOver=!1}
)).start())}
,r.pushLinearVelocity=function(e,t){
this.inGridFlag||this.canGyroscope&&(this.node.getComponent(u).linearVelocity=c(e,t))}
,r.setSprColor=function(e){
this.spr.getComponent(b).color=e}
,r.wakeUpRb=function(){
this.rb.wakeUp()}
,r.closeRestitution=function(){
if(0!=this.polygonCollider.restitution){
var e=this.node.getComponent(d);
e.enabled=!1,e.restitution=0,e.enabled=!0}
}
,r.JudgeCombo=function(e,t){
e.worldPosition.y>this.node.worldPosition.y||this.isJudgeComboFlag||(this.isJudgeComboFlag=!0,y("Canvas").getComponent(P).PopComboRecord(t))}
,r.closeCollider=function(){
var e=this;
this.polygonCollider.off(_.BEGIN_CONTACT,this.onBeginContact,this),this.inGridFlag=!1,this.dropFlag=!1,this.scheduleOnce((function(){
e.polygonCollider.enabled=!1,e.rb.enabled=!1,e.node.getComponent(d).destroy(),e.node.getComponent(u).destroy()}
))}
,t}
(C)).prototype,"spr",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(E.prototype,"sprShadow",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),G=E))||G)),r._RF.pop()}
}
}
))
