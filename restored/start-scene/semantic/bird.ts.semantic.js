/**
 * Semantic view: chunks:///_virtual/bird.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => UIConfigTable
 * - a => _decorator
 * - b => ResManager
 * - B => TooYueManager
 * - c => Label
 * - C => GameCtrl
 * - d => instantiate
 * - g => UITransform
 * - h => UIOpacity
 * - i => initializerDefineProperty
 * - k => EVENT_KEYS
 * - m => geometry
 * - n => inheritsLoose
 * - N => releaseType
 * - o => assertThisInitialized
 * - p => tween
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => AudioManager
 * - u => find
 * - v => director
 * - w => default
 * - y => Component
 */
/**
 * Restored module: chunks:///_virtual/bird.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => UIConfigTable
 * - a => _decorator
 * - b => ResManager
 * - B => TooYueManager
 * - c => Label
 * - C => GameCtrl
 * - d => instantiate
 * - g => UITransform
 * - h => UIOpacity
 * - i => initializerDefineProperty
 * - k => EVENT_KEYS
 * - m => geometry
 * - n => inheritsLoose
 * - N => releaseType
 * - o => assertThisInitialized
 * - p => tween
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => AudioManager
 * - u => find
 * - v => director
 * - w => default
 * - y => Component
 */
System.register("chunks:///_virtual/bird.ts",["./rollupPluginModLoBabelHelpers.js","cc","./ConfigTable.ts","./ResManager.ts","./GameModel2.ts","./GameCtrl.ts","./EventManager.ts","./Enum.ts","./AudioManager.ts","./TooYueManager.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l, c /* Label */, u /* find */, d /* instantiate */, h /* UIOpacity */, p /* tween */, f, g /* UITransform */, m /* geometry */, v /* director */, y /* Component */, _ /* UIConfigTable */, b /* ResManager */, S /* GameModel */, C /* GameCtrl */, w /* default */, N /* releaseType */, k /* EVENT_KEYS */, T /* AudioManager */, B /* TooYueManager */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.sp,c=e.Label /* Label */,u=e.find /* find */,d=e.instantiate /* instantiate */,h=e.UIOpacity /* UIOpacity */,p=e.tween /* tween */,f=e.v3,g=e.UITransform /* UITransform */,m=e.geometry /* geometry */,v=e.director /* director */,y=e.Component /* Component */}
,function(e){
_=e.UIConfigTable /* UIConfigTable */}
,function(e){
b=e.ResManager /* ResManager */}
,function(e){
S=e.GameModel /* GameModel */}
,function(e){
C=e.GameCtrl /* GameCtrl */}
,function(e){
w=e.default /* default */}
,function(e){
N=e.releaseType /* releaseType */,k=e.EVENT_KEYS /* EVENT_KEYS */}
,function(e){
T=e.AudioManager /* AudioManager */}
,function(e){
B=e.TooYueManager /* TooYueManager */}
],execute:function(){
var A,P,M,I,F,R,L,x,D,G,E,O,H,V,U,z,W,j,J;
r._RF.push({
}
,"bc5250istdKx44ZwItqxEAA","bird",void 0);
var Y=a.ccclass,q=a.property,K=[{
targetRSpd:15,launcherRSpd:20,obstacleCount:1,hp:1}
,{
targetRSpd:18,launcherRSpd:25,obstacleCount:1,hp:1}
,{
targetRSpd:20,launcherRSpd:30,obstacleCount:2,hp:1}
,{
targetRSpd:22,launcherRSpd:32,obstacleCount:2,hp:1}
,{
targetRSpd:25,launcherRSpd:35,obstacleCount:2,hp:1}
,{
targetRSpd:28,launcherRSpd:38,obstacleCount:3,hp:1}
,{
targetRSpd:30,launcherRSpd:40,obstacleCount:3,hp:1}
,{
targetRSpd:32,launcherRSpd:42,obstacleCount:4,hp:1}
,{
targetRSpd:35,launcherRSpd:45,obstacleCount:4,hp:1}
,{
targetRSpd:40,launcherRSpd:50,obstacleCount:5,hp:1}
];
e("bird",(A=Y("bird"),P=q(s),M=q(s),I=q(s),F=q(s),R=q(s),L=q(l.Skeleton),x=q(s),D=q(s),A((O=t((E=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return(t=e.call.apply(e,[this].concat(r))||this)._isDebug=!1,t._levelData=[],t._gameState=0,t._hp=3,t._curLevel=0,t._targetRSpd=20,t._launcherRSpd=30,i(t,"target",O,o(t)),i(t,"center",H,o(t)),i(t,"layItem",V,o(t)),i(t,"launcher",U,o(t)),i(t,"nodeTouch",z,o(t)),i(t,"bird",W,o(t)),i(t,"birdCollider",j,o(t)),i(t,"levelLabel",J,o(t)),t}
n(t,e);
var r=t.prototype;
return r.onLoad=function(){
B._ins.startRecordVideo(),T.instance.playMusic("bgm/defaultGameplay",.5),this._curLevel=S.instance.pigeonLevel,this.levelLabel.getComponent(c).string=this._curLevel.toString(),this._gameState=0,this.createSetBtn(),this.nodeTouch.on(s.EventType.TOUCH_START,this.onTouchStart,this),this.bird.setCompleteListener(this.onBirdEnd.bind(this)),this.initLevelData(),this.initLayItem(),this.gmLabelUpdate()}
,r.gmLabelUpdate=function(){
var e=u("Canvas/GameGuide");
(S.instance.releaseType==N.test_TEST||B.userMsg&&B.userMsg.userTags.includes("gm"))&&(e.active=!0,e.getComponent(c).string="首页-更多玩法-疯狂的鸽子")}
,r.createSetBtn=function(){
var e=this;
b.instance.bundleLoad("uiBundle",_.setBtn.path,null,(function(t,n){
if(t)console.log(t);
else{
var i=d(n);
i.parent=e.node;
var o=i.getComponent(h);
o.opacity=0,p(i).delay(0).call((function(){
o.opacity=255,i.setScale(0,0,0)}
)).to(.1,{
scale:f(1,1,1)}
).start()}
}
))}
,r.initLevelData=function(){
var e=K[this._curLevel]||K[K.length-1];
console.log("initLevelData",e),console.log(K[0]),this._targetRSpd=e.targetRSpd,this._launcherRSpd=e.launcherRSpd;
var t=Math.min(e.obstacleCount,this.layItem.children.length-1);
this._levelData.length=0;
for(var n=0;
n<this.layItem.children.length;
n++)this._levelData.push(1);
for(var i=0;
i<t;
i++){
var o=Math.floor(Math.random()*this._levelData.length);
1===this._levelData[o]?this._levelData[o]=2:i--}
this._hp=Math.min(e.hp,t),C.instance.canTouch=!0,C.instance.btnCanTouch=!0,C.instance.gameIsOver=!1}
,r.initLayItem=function(){
for(var e=this.layItem.children,t=0;
t<e.length;
t++){
var n=e[t],i=this._levelData[t];
n.getChildByName("good").active=1===i,n.getChildByName("bad").active=2===i,n.getChildByName("lblIndex").active=this._isDebug,n.getChildByName("lblIndex").getComponent(c).string=t.toString()}
}
,r.onTouchStart=function(){
C.instance.canTouch&&(T.instance.playSound("ui/buttonClick"),this.launch(),this.checkCollision())}
,r.launch=function(){
this.bird.setAnimation(0,"jump",!1)}
,r.onBirdEnd=function(){
this.bird.setAnimation(0,"run",!0)}
,r.startGame=function(){
this._gameState=1}
,r.pauseGame=function(){
this._gameState=2}
,r.resumeGame=function(){
this._gameState=1}
,r.endGame=function(e){
var t=this;
C.instance.canTouch=!1,this._gameState=3,e?(console.log("游戏胜利"),b.instance.bundleLoad("uiBundle",_.SuccessPigeonUI.path,null,(function(e,n){
e?console.log(e):d(n).parent=t.node}
))):b.instance.bundleLoad("uiBundle",_.OverPigeonUI.path,null,(function(e,n){
e?console.log(e):d(n).parent=t.node}
))}
,r.start=function(){
this.startGame()}
,r.checkCollision=function(){
if(this.birdCollider&&this.layItem){
var e=this.birdCollider.getComponent(g);
if(e){
var t=new m.AABB;
e.getComputeAABB(t);
for(var n=this.layItem.children,i=new m.AABB,o=0;
o<n.length;
o++){
var r=n[o];
if(0!==this._levelData[o]){
var a=r.getComponent(g);
if(a&&(a.getComputeAABB(i),m.intersect.aabbWithAABB(t,i)))return void this.dealCollision(o)}
}
}
}
}
,r.dealCollision=function(e){
var t=this.layItem.children[e],n=this._levelData[e];
this._levelData[e]=0,t.active=!1,2===n?this.subHp():this.checkComplete()}
,r.subHp=function(){
this._hp--,this._hp<=0&&this.endGame(!1)}
,r.checkComplete=function(){
this._levelData.every((function(e){
return 1!==e}
))&&this.endGame(!0)}
,r.update=function(e){
1===this._gameState&&(this.target.angle-=this._targetRSpd*e,Math.abs(this.target.angle)>=360&&(this.target.angle=this.target.angle%360),this.launcher.angle+=this._launcherRSpd*e,Math.abs(this.launcher.angle)>=360&&(this.launcher.angle=this.launcher.angle%360))}
,r.PigeonLevelUP=function(){
S.instance.pigeonLevel++,v.loadScene(v.getScene().name)}
,r.replayGame=function(){
v.loadScene(v.getScene().name)}
,r.onEnable=function(){
this.registerEvents()}
,r.onDisable=function(){
this.unregisterEvents()}
,r.registerEvents=function(){
w.instance.on(k.NEXT_LEVEL,this.PigeonLevelUP,this),w.instance.on(k.REPLAY,this.replayGame,this)}
,r.unregisterEvents=function(){
w.instance.off(k.NEXT_LEVEL,this.PigeonLevelUP,this),w.instance.off(k.REPLAY,this.replayGame,this)}
,t}
(y)).prototype,"target",[P],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=t(E.prototype,"center",[M],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),V=t(E.prototype,"layItem",[I],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),U=t(E.prototype,"launcher",[F],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),z=t(E.prototype,"nodeTouch",[R],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),W=t(E.prototype,"bird",[L],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),j=t(E.prototype,"birdCollider",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),J=t(E.prototype,"levelLabel",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),G=E))||G)),r._RF.pop()}
}
}
))

