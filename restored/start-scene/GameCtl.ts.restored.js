/**
 * Restored module: chunks:///_virtual/GameCtl.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => resolveFixedShapeFromNodeMarkers
 * - a => Vec3
 * - b => CollisionUtil
 * - B => AudioManager
 * - c => UITransform
 * - C => tryPickFirstValidRopePath
 * - d => easing
 * - f => shuffleInPlace
 * - g => maxSlotsForRow
 * - h => math
 * - i => RigidBody2D
 * - k => GameCtrl
 * - l => Node
 * - m => ROW_HOLE_BOARD_ID_BASE
 * - n => cclegacy
 * - N => AdManager
 * - o => ERigidBody2DType
 * - p => Color
 * - r => Vec2
 * - s => tween
 * - S => ROPE_MAX_LINK_DIST
 * - t => createForOfIteratorHelperLoose
 * - T => TooYueManager
 * - u => Tween
 * - v => GameModel
 * - w => ROPE_POINT_RADIUS
 * - y => LevelMechanismManager
 */
System.register("chunks:///_virtual/GameCtl.ts",["./rollupPluginModLoBabelHelpers.js","cc","./ArrayUtil.ts","./BoardLayout.ts","./GameModel.ts","./LevelMechanismManager.ts","./CollisionUtil.ts","./RopeGenerator.ts","./AdManager.ts","./GameCtrl.ts","./TooYueManager.ts","./AudioManager.ts"],(function(e){
var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B;
return{
setters:[function(e){
t=e.createForOfIteratorHelperLoose}
,function(e){
n=e.cclegacy,i=e.RigidBody2D,o=e.ERigidBody2DType,r=e.Vec2,a=e.Vec3,s=e.tween,l=e.Node,c=e.UITransform,u=e.Tween,d=e.easing,h=e.math,p=e.Color}
,function(e){
f=e.shuffleInPlace}
,function(e){
g=e.maxSlotsForRow}
,function(e){
m=e.ROW_HOLE_BOARD_ID_BASE,v=e.GameModel}
,function(e){
y=e.LevelMechanismManager,_=e.resolveFixedShapeFromNodeMarkers}
,function(e){
b=e.CollisionUtil}
,function(e){
S=e.ROPE_MAX_LINK_DIST,C=e.tryPickFirstValidRopePath,w=e.ROPE_POINT_RADIUS}
,function(e){
N=e.AdManager}
,function(e){
k=e.GameCtrl}
,function(e){
T=e.TooYueManager}
,function(e){
B=e.AudioManager}
],execute:function(){
n._RF.push({
}
,"d873bX0POpJ3r3QiRGreNFS","GameCtl",void 0),e("GameCtl",function(){
function e(e,t){
var n=this;
this._model=void 0,this._view=void 0,this._fruitNodes=[],this._fruitIdMap=new Map,this._staticFruits=[],this._fallingFruits=[],this._fallingBoardRestoreInfo=new Map,this._groundedFruits=[],this._slottedFruits=[],this._eliminatingFruits=[],this._eliminatingFruitSet=new Set,this._toEliminate=new Set,this._toEliminatePairs=[],this._isEliminating=!1,this._elimWaveDisplayTotal=0,this._elimWaveFinishedCount=0,this._hudEliminatedFruitCount=0,this._slotElimCombo=0,this._rowFruitCount=[],this._lastSpawnedRowIndex=0,this._fruitRowMap=new Map,this._fruitBlindUnrevealedMap=new Map,this._bottomRowOffset=0,this._fruitRadius=55,this._clickDropHorizontalSpeed=.01,this._defaultFruitSpacing=3,this._firstLayerHeight=2*this._fruitRadius,this._fullScreenMessyLayerExtra=32,this._fullScreenMessyJitterYMin=-20,this._fullScreenMessyJitterYMax=20,this._layContentDropTarget=null,this._pendingDropNode=null,this._spawnIntroEndScale=new Map,this._isSpawnIntroPlaying=!1,this._spawnPopDurationSec=.22,this._spawnPopStaggerSec=.06,this._spawnIntroBornVolMin=.28,this._isShuffling=!1,this._isReviving=!1,this._layerSlots=new Map,this._revivePriorityReleasedSlotKeys=new Set,this._layContentDropSpeed=600,this._sortSlotPosA=new a,this._sortSlotPosB=new a,this._holeQueueL=[],this._holeQueueR=[],this._fruitHoleSideMap=new Map,this._pendingHoleSpawn=0,this._holeFruitPendingReplenish=new Map,this._rowHoleFruitByNode=new Map,this._rowHoleFruitPendingReplenish=new Map,this._pendingRowHoleSpawn=0,this._sprIconTintWhite=new p(255,255,255,255),this._onFruitClickBound=function(e){
return n._onFruitClick(e)}
,this._ropeBindings=[],this._nextRopeId=1,this._ropeInitialGenerated=!1,this._gyroVelocityScale=1,this._gyroSlotDownExtra=3,this._model=new v(t),this._view=e}
var n=e.prototype;
return n._getFruitHorizontalSpacing=function(){
var e;
return null!=(e=this._model.getGridHorizontalSpacing())?e:this._defaultFruitSpacing}
,n._getLayerHeight=function(){
var e,t=null!=(e=this._model.getGridVerticalSpacing())?e:this._defaultFruitSpacing;
return 2*this._fruitRadius+t+(this._model.isFullScreenMessyLayout()?this._fullScreenMessyLayerExtra:0)}
,n._getFirstLayerHeight=function(){
return this._firstLayerHeight+(this._model.isFullScreenMessyLayout()?this._fullScreenMessyLayerExtra:0)}
,n.getGameState=function(){
return this._model.gameState}
,n.getLoseKind=function(){
return this._model.lastLoseKind}
,n.getSlottedFruitNodesSnapshot=function(){
return this._pruneStaleFruitArrayRefs(this._slottedFruits),this._slottedFruits.filter((function(e){
return null==e?void 0:e.isValid}
))}
,n.moveFruitsByGyroscope=function(e,n){
if("playing"===this._model.gameState){
this._pruneStaleFruitArrayRefs(this._staticFruits),this._pruneStaleFallingFruitRefs(),this._pruneStaleFruitArrayRefs(this._groundedFruits),this._pruneStaleFruitArrayRefs(this._slottedFruits);
for(var a,s=this._gyroVelocityScale*e,l=(this._gyroVelocityScale,this._gyroSlotDownExtra,[].concat(this._staticFruits,this._fallingFruits,this._groundedFruits)),c=t(l);
!(a=c()).done;
){
var u=a.value;
if(null!=u&&u.isValid&&!this._toEliminate.has(u)&&!this._isFruitEliminating(u)){
var d=u.getComponent(i);
if(null!=d&&d.isValid&&d.enabled&&d.type!==o.Static)try{
var h=d.linearVelocity;
d.linearVelocity=new r(h.x+s,h.y)}
catch(e){
}
}
}
}
}
,n.getRopeBindingsSnapshot=function(){
return this._ropeBindings.slice()}
,n.printDebugInfo=function(){
for(var e,n=this,i=this._view.getLayContent(),o=i?this._view.getNodeWorldY(i):0,r=new a,s=this._view.getLayDrop(),l=[],c=function(e,t){
var i;
if(e.isValid){
var a=null!=(i=n._fruitIdMap.get(e))?i:-1;
e.getWorldPosition(r),(null!=s&&e.parent===s||r.y>=o)&&l.push({
state:t,id:a,x:r.x,y:r.y}
)}
}
,u=t(this._staticFruits);
!(e=u()).done;
)c(e.value,"静止");
for(var d,h=t(this._fallingFruits);
!(d=h()).done;
)c(d.value,"掉落");
for(var p,f=t(this._groundedFruits);
!(p=f()).done;
)c(p.value,"落地");
for(var g,m=t(this._slottedFruits);
!(g=m()).done;
)c(g.value,"槽位");
for(var v,y=t(this._eliminatingFruits);
!(v=y()).done;
)c(v.value,"消除");
console.log("=== 可见区域水果 ==="),console.log("数量:",l.length,"| layContentWorldY:",o),l.forEach((function(e,t){
console.log("  ["+t+"] 状态:"+e.state+" id:"+e.id+" pos:("+e.x.toFixed(0)+","+e.y.toFixed(0)+")")}
));
var _=function(e,i){
for(var o,a=[],s=t(e);
!(o=s()).done;
){
var l,c=o.value;
if(c.isValid){
var u=null!=(l=n._fruitIdMap.get(c))?l:-1;
c.getWorldPosition(r),a.push("id:"+u+"("+r.x.toFixed(0)+","+r.y.toFixed(0)+")")}
}
console.log("  "+i+": 数量="+a.length,a.length?a.join(" | "):"")}
;
console.log("=== 各槽位数组 ==="),_(this._staticFruits,"静止 staticFruits"),_(this._fallingFruits,"掉落 fallingFruits"),_(this._groundedFruits,"落地 groundedFruits"),_(this._slottedFruits,"槽位 slottedFruits"),_(this._eliminatingFruits,"消除 eliminatingFruits"),console.log("=== 其他 === toEliminate:",this._toEliminate.size,"isEliminating:",this._isEliminating,"| holeL:",this._holeQueueL.length,"holeR:",this._holeQueueR.length,"pendingHole:",this._pendingHoleSpawn,"holeOnBoard:",this._fruitHoleSideMap.size,"| ropeMax:",this._model.getRopeMaxCount(),"ropes:",this._ropeBindings.length),this._ropeBindings.length>0&&this._ropeBindings.forEach((function(e,t){
console.log("  [绳"+t+"] id:"+e.id+" A:"+n._fruitIdMap.get(e.nodeA)+" B:"+n._fruitIdMap.get(e.nodeB)+" 点数:"+e.worldPoints.length)}
))}
,n.onBtnNext=function(){
this._model.toNextLevel(),this.startGame()}
,n.onBtnRestart=function(){
this.startGame()}
,n.setLevelAndStart=function(e){
this._model.setLevel(e),this.startGame()}
,n.getCurrentLevel=function(){
return this._model.currentLevel}
,n.getLevelTotalFruits=function(){
return this._model.getLevelTotalFruits()}
,n.getRemainingFruitCount=function(){
return this._countValidFruitNodes()}
,n.getRemainingFruitCountForHud=function(){
var e=this._model.getLevelTotalFruits();
return e<=0?0:Math.max(0,e-this._hudEliminatedFruitCount)}
,n.startGame=function(){
T._ins.reportStage(3e6+this._model.currentLevel,"start","",0),k.instance.btnCanTouch=!0,T._ins.startRecordVideo();
var e=y.getForLevel(this._model.currentLevel);
this._model.setLevelMechanism(e);
var t=this._model.getLevelConfig(),n=null;
if("fixed_shape"===e.kind&&t){
var i=this._view.getNodeLevelMap()[e.nodeMapIndex];
(n=_(this._view.getLayContent(),null!=i?i:null,t.totalFruits,t.maxFruit))||console.warn("[GameCtl] fixed_shape 场景节点解析失败，请检查 nodeLevelMap[nodeMapIndex] 子节点数量与 totalFruits、节点名为水果 id")}
this._model.setPendingBoardShapeResolved(n),this._model.reset(),this._clearFruits(),this._initHoleQueuesFromModel(),this._spawnFruits(),this._spawnInitialHoleFruits(),this._view.setHolePlaceholdersVisible(this._model.getHoleReserveTotal()>0),this._refreshHoleQueueLabels(),this._view.resetLevelPropAndReviveLimits()}
,n._shufflePermFallback=function(e){
var t=Array.from({
length:e}
,(function(e,t){
return t}
));
return f(t),t}
,n._bottommostBoardPosOnSide=function(e,t,n){
for(var i=this,o=this._view.getGameViewCenterWorldX(),r=[],a=0;
a<e.length;
a++){
e[a].getWorldPosition(this._sortSlotPosA);
var s=this._sortSlotPosA.x<=o;
("left"!==n||s)&&("right"===n&&s||r.push(a))}
return 0===r.length?null:(r.sort((function(n,o){
var r=t[n],a=t[o];
return r!==a?r-a:(e[n].getWorldPosition(i._sortSlotPosA),e[o].getWorldPosition(i._sortSlotPosB),i._sortSlotPosA.x-i._sortSlotPosB.x)}
)),r[0])}
,n._assignPermForIdConstraints=function(e,n,i){
for(var o,r=new Set,a=new Array(n),s=t(i);
!(o=s()).done;
){
for(var l=o.value,c=[],u=0;
u<n;
u++)r.has(u)||e[u]===l.needId&&c.push(u);
if(0===c.length)return null;
f(c);
var d=c[0];
r.add(d),a[l.pos]=d}
for(var h=new Set(i.map((function(e){
return e.pos}
))),p=[],g=[],m=0;
m<n;
m++)h.has(m)||p.push(m);
for(var v=0;
v<n;
v++)r.has(v)||g.push(v);
if(p.length!==g.length)return null;
f(g);
for(var y=0;
y<p.length;
y++)a[p[y]]=g[y];
return a}
,n._buildShufflePermOneSlot=function(e,t,n,i){
var o,r=e.length,a=null!=(o=this._fruitIdMap.get(i))?o:0;
if(a<=0)return null;
var s=this._view.getGameViewCenterWorldX();
i.getWorldPosition(this._sortSlotPosA);
var l=this._sortSlotPosA.x<=s?"left":"right",c=this._bottommostBoardPosOnSide(e,n,l);
return null===c?null:this._assignPermForIdConstraints(t,r,[{
pos:c,needId:a}
])}
,n._buildShufflePermMultiSlots=function(e,t,n,i){
var o,r,a=e.length;
if(i.length<2)return null;
var s=null!=(o=this._fruitIdMap.get(i[0]))?o:0,l=null!=(r=this._fruitIdMap.get(i[i.length-1]))?r:0;
if(s<=0||l<=0)return null;
var c=this._bottommostBoardPosOnSide(e,n,"left"),u=this._bottommostBoardPosOnSide(e,n,"right");
if(null!==c&&null!==u&&c!==u){
var d=this._assignPermForIdConstraints(t,a,[{
pos:c,needId:s}
,{
pos:u,needId:l}
]);
if(d)return d}
if(null!==c){
var h=this._assignPermForIdConstraints(t,a,[{
pos:c,needId:s}
]);
if(h)return h}
if(null!==u){
var p=this._assignPermForIdConstraints(t,a,[{
pos:u,needId:l}
]);
if(p)return p}
return null}
,n._buildShufflePermConstrained=function(e,t,n){
var i=this,o=e.length;
this._pruneStaleFruitArrayRefs(this._slottedFruits);
var r=this._slottedFruits.filter((function(e){
return e.isValid&&!i._toEliminate.has(e)&&!i._isFruitEliminating(e)}
)).slice().sort((function(e,t){
return e.getWorldPosition(i._sortSlotPosA),t.getWorldPosition(i._sortSlotPosB),i._sortSlotPosA.x-i._sortSlotPosB.x}
)),a=r.length;
return 0===a?this._shufflePermFallback(o):1===a?this._buildShufflePermOneSlot(e,t,n,r[0])||(console.warn("[GameCtl] shuffle: 没有找到合适的位置放置，已随机打乱"),this._shufflePermFallback(o)):this._buildShufflePermMultiSlots(e,t,n,r)||(console.warn("[GameCtl] shuffle: 没有找到合适的位置放置，已随机打乱"),this._shufflePermFallback(o))}
,n.onBtnShuffle=function(){
var e=this;
if("playing"===this._model.gameState&&null===this._layContentDropTarget&&!this._isReviving){
var n=this._view.getLayContent();
if(n){
var i=this._view.getNodeWorldY(n);
this._recallFallingFruitsToBoardForShuffle();
for(var o,r=[],a=t(this._staticFruits);
!(o=a()).done;
){
var s=o.value;
s.isValid&&(this._fruitHoleSideMap.has(s)||this._rowHoleFruitByNode.has(s)||this._toEliminate.has(s)||this._isFruitEliminating(s)||this._view.getNodeWorldY(s)<i||r.push(s))}
r.length<2||(this._view.setNoTouchActive(!0),this._isShuffling=!0,this._slotElimCombo=0,this._view.scheduleNextFrame((function(){
var n=r.filter((function(e){
var t;
return e.isValid&&(null==(t=e.getChildByName("sprIcon"))?void 0:t.isValid)}
));
if(n.length<2)e._finishShuffleAndResumeDrop();
else{
e._view.beginRopeDrawPauseForShuffle();
for(var i,o=n.slice(),a=[],s=[],l=t(n);
!(i=l()).done;
){
var c,u,d=i.value;
a.push(null!=(c=e._fruitIdMap.get(d))?c:0),s.push(null!=(u=e._fruitRowMap.get(d))?u:Math.round(d.position.y/e._getLayerHeight()))}
e._view.preloadShuffleSpriteFrames(a,(function(){
e._view.scheduleNextFrame((function(){
for(var i=e._buildShufflePermConstrained(o,a,s),r=0;
r<o.length;
r++)n[r]=o[i[r]];
for(var l,c=new Map,u=t(n);
!(l=u()).done;
){
var d=l.value;
c.set(d,e._fruitBlindUnrevealedMap.has(d))}
for(var h=0;
h<o.length;
h++){
var p,f=o[h],g=n[h];
if(f.isValid&&g.isValid){
var m=o.indexOf(g),v=a[m],y=s[h];
e._fruitIdMap.set(f,v),e._fruitRowMap.set(f,y);
var _=null!=(p=c.get(g))&&p;
_?e._fruitBlindUnrevealedMap.set(f,!0):e._fruitBlindUnrevealedMap.delete(f),e._view.applyFruitBlindBoxVisual(f,_,v,!0),_||e._syncRowHoleFruitSprTint(f)}
}
e._runShuffleCloneFlight(o,n,c)}
))}
))}
}
)))}
}
}
,n._runShuffleCloneFlight=function(e,n,i){
for(var o,r=this,s=t(n);
!(o=s()).done;
){
var l=o.value.getChildByName("sprShadow");
null!=l&&l.isValid&&(l.active=!1)}
for(var c=function(e,t){
if(t){
var n=e.getChildByName("sprSpc");
if(null!=n&&n.isValid)return n}
return e.getChildByName("sprIcon")}
,u=[],d=new a,h=0;
h<e.length;
h++){
var p,f,g=e[h],m=n[h],v=this._fruitBlindUnrevealedMap.has(g),y=null!=(p=i.get(m))&&p,_=c(g,v),b=c(m,y);
if(null==_||!_.isValid||null==b||!b.isValid){
for(var S,C=t(u);
!(S=C()).done;
){
var w=S.value;
null!=w&&w.isValid&&w.destroy()}
for(var N,k=t(e);
!(N=k()).done;
){
var T,B=N.value,A=null!=(T=this._fruitIdMap.get(B))?T:0,P=this._fruitBlindUnrevealedMap.has(B);
A>0&&(this._view.applyFruitBlindBoxVisual(B,P,A,!0),P||this._syncRowHoleFruitSprTint(B))}
return void this._finishShuffleAndResumeDrop()}
var M=null!=(f=this._fruitIdMap.get(g))?f:0,I=this._view.createShuffleClone(_,b,M,v);
if(null==I||!I.isValid){
for(var F,R=t(u);
!(F=R()).done;
){
var L=F.value;
null!=L&&L.isValid&&L.destroy()}
for(var x,D=t(e);
!(x=D()).done;
){
var G,E=x.value,O=null!=(G=this._fruitIdMap.get(E))?G:0,H=this._fruitBlindUnrevealedMap.has(E);
O>0&&(this._view.applyFruitBlindBoxVisual(E,H,O,!0),H||this._syncRowHoleFruitSprTint(E))}
return void this._finishShuffleAndResumeDrop()}
b.getWorldPosition(d),I.setWorldPosition(d),u.push(I),_.active=!1}
if(u.length<2){
for(var V,U=t(e);
!(V=U()).done;
){
var z,W=V.value,j=null!=(z=this._fruitIdMap.get(W))?z:0,J=this._fruitBlindUnrevealedMap.has(W);
j>0&&(this._view.applyFruitBlindBoxVisual(W,J,j,!0),J||this._syncRowHoleFruitSprTint(W))}
for(var Y,q=t(u);
!(Y=q()).done;
){
var K=Y.value;
null!=K&&K.isValid&&K.destroy()}
this._finishShuffleAndResumeDrop()}
else for(var X=e.map((function(e){
return r._view.getNodeWorldPosition(e)}
)),Q=0,Z=u.length,$=function(){
++Q>=Z&&function(){
for(var t=0,n=function(){
++t<Z||r._finishShuffleAndResumeDrop()}
,i=0;
i<u.length;
i++)r._tweenCloneSprPopThenRemove(u[i],e[i],n)}
()}
,ee=0;
ee<u.length;
ee++){
var te=X[ee];
this._view.tweenNodeToWorldPosition(u[ee],te,.5,$)}
}
,n.onBtnRevive=function(){
var e=this;
if(("playing"===this._model.gameState||"lose"===this._model.gameState)&&!(this._isEliminating||this._eliminatingFruits.length>0||this._isShuffling||this._isReviving||null!==this._layContentDropTarget)){
var n=this._getSlottedFruitsForRevivePick();
if(0!==n.length){
var i=n.length>=this._model.failThreshold,o="lose"===this._model.gameState;
if(i||o){
var r=new a,s=new a,l=n.slice().sort((function(e,t){
return e.getWorldPosition(r),t.getWorldPosition(s),r.x-s.x}
)).slice(),c=this._view.getLayContent();
null!=c&&c.isValid&&(this._isReviving=!0,o&&this._model.setGameState("playing"),this._view.setNoTouchActive(!0),this._view.scheduleNextFrame((function(){
var n=l.filter((function(t){
var n;
return t.isValid&&e._slottedFruits.indexOf(t)>=0&&(null!=(n=e._fruitIdMap.get(t))?n:0)>0}
));
if(0!==n.length){
var i=e._bottomRowOffset,o=e._bottomRowOffset+e._model.visibleLayers-1;
e._model.ensureRowsUpTo(o);
var r=e._pickRandomReviveLandingsInVisibleLayers(n.length,i,o),a=r.length;
if(0!==a){
var s=n.slice(0,a),u=s.map((function(t){
var n;
return null!=(n=e._fruitIdMap.get(t))?n:0}
)).filter((function(e){
return e>0}
));
if(u.length===s.length){
for(var d,h=r.map((function(t){
return e._layContentLocalToWorld(t.localX,t.localY)}
)),p=function(e,t){
if(t){
var n=e.getChildByName("sprSpc");
if(null!=n&&n.isValid)return n}
return e.getChildByName("sprIcon")}
,f=[],g=t(s);
!(d=g()).done;
){
var m,v=d.value,y=e._fruitBlindUnrevealedMap.has(v),_=p(v,y),b=null!=(m=e._fruitIdMap.get(v))?m:0,S=e._view.createShuffleClone(_,_,b,y);
if(null==S||!S.isValid){
for(var C,w=t(f);
!(C=w()).done;
){
var N=C.value;
null!=N&&N.isValid&&N.destroy()}
for(var k,T=t(s);
!(k=T()).done;
){
var B,A=k.value,P=null!=(B=e._fruitIdMap.get(A))?B:0,M=e._fruitBlindUnrevealedMap.has(A);
P>0&&e._view.applyFruitBlindBoxVisual(A,M,P,!0)}
return void e._finishReviveAndResumeDrop()}
if(f.push(S),y){
var I=v.getChildByName("sprSpc");
null!=I&&I.isValid&&(I.active=!1)}
var F=v.getChildByName("sprIcon");
null!=F&&F.isValid&&(F.active=!1);
var R=v.getChildByName("sprShadow");
null!=R&&R.isValid&&(R.active=!1)}
for(var L,x=t(s);
!(L=x()).done;
){
var D=L.value;
D.isValid&&e._disableFruitRigidBody(D),e._reviveRemoveSlottedFruit(D)}
for(var G=0,E=f.length,O=function(){
++G>=E&&function(){
for(var n=0,a=function(){
if(!(++n<E)){
for(var a,s=new Set(r.map((function(e){
return e.row}
))),l=t(s);
!(a=l()).done;
){
var c=a.value;
e._ensureBoardRowMinLength(c)}
e._syncModelBoardWithStaticFruits();
for(var u=i;
u<=o;
u++){
for(var d,h=0,p=t(e._staticFruits);
!(d=p()).done;
){
var f=d.value;
!f.isValid||e._toEliminate.has(f)||e._isFruitEliminating(f)||e._fruitRowMap.get(f)===u&&h++}
e._rowFruitCount[u]=h}
e._finishReviveAndResumeDrop()}
}
,s=0;
s<u.length;
s++){
var l=u[s],d=r[s],h=e._view.addFruit(c,d.localX,d.localY,l,e._onFruitClickBound,e);
if(null!=h&&h.isValid){
e._fruitIdMap.set(h,l),e._fruitRowMap.set(h,d.row),e._fruitNodes.push(h),e._staticFruits.push(h),e._occupyLayerSlotAt(d.row,d.localX,d.localY);
var p=h.getChildByName("sprIcon");
null!=p&&p.isValid&&(p.active=!1),e._tweenCloneSprPopThenRemove(f[s],h,a)}
else{
var g;
null!=(g=f[s])&&g.isValid&&f[s].destroy(),a()}
}
}
()}
,H=0;
H<f.length;
H++)e._view.tweenNodeToWorldPosition(f[H],h[H],.28,O)}
else{
for(var V,U=t(s);
!(V=U()).done;
){
var z,W=V.value,j=null!=(z=e._fruitIdMap.get(W))?z:0,J=e._fruitBlindUnrevealedMap.has(W);
j>0&&e._view.applyFruitBlindBoxVisual(W,J,j,!0)}
e._finishReviveAndResumeDrop()}
}
else e._finishReviveAndResumeDrop()}
else e._finishReviveAndResumeDrop()}
)))}
}
}
}
,n._tweenCloneSprPopThenRemove=function(e,t,n){
var i=this,o=function(){
var o;
null!=e&&e.isValid&&e.destroy();
var r=null!=(o=i._fruitIdMap.get(t))?o:0,a=i._fruitBlindUnrevealedMap.has(t);
if(null!=t&&t.isValid&&r>0)i._view.applyFruitBlindBoxVisual(t,a,r,!0);
else{
var s=null==t?void 0:t.getChildByName("sprIcon");
null!=s&&s.isValid&&(s.active=!0)}
n()}
;
null!=e&&e.isValid?s(e).to(.1,{
scale:new a(1.1,1.1,1.1)}
,{
easing:"sineOut"}
).to(.1,{
scale:new a(1,1,1)}
,{
easing:"sineIn"}
).call(o).start():o()}
,n._reviveRemoveSlottedFruit=function(e){
this._pendingDropNode===e&&(this._pendingDropNode=null);
var t,n=this._fruitRowMap.get(e);
void 0!==n&&(this._rowFruitCount[n]=Math.max(0,(null!=(t=this._rowFruitCount[n])?t:0)-1),this._fruitRowMap.delete(e)),e.isValid&&e.off(l.EventType.TOUCH_START,this._onFruitClickBound,this),this._fruitIdMap.delete(e),this._removeFromFruitArray(this._staticFruits,e),this._removeFromFallingFruits(e),this._removeFromFruitArray(this._groundedFruits,e),this._removeFromFruitArray(this._slottedFruits,e);
var i=this._fruitNodes.indexOf(e);
i>=0&&this._fruitNodes.splice(i,1),e.isValid&&this._view.recycleFruitNode(e)}
,n._releaseBoardSlotForNode=function(e){
var t=this._fruitRowMap.get(e);
if(void 0!==t){
var n=this._layerSlots.get(t);
if(null!=n&&n.length){
for(var i=e.position.x,o=e.position.y,r=-1,a=1/0,s=0;
s<n.length;
s++){
var l=Math.abs(n[s].localX-i)+Math.abs(n[s].localY-o);
l<a&&(a=l,r=s)}
r>=0&&a<2.5*this._fruitRadius&&(n[r].empty=!0,this._revivePriorityReleasedSlotKeys.add(this._makeReviveSlotKey(t,n[r].localX,n[r].localY)))}
}
}
,n._makeReviveSlotKey=function(e,t,n){
return e+":"+t+":"+n}
,n._occupyLayerSlotAt=function(e,t,n){
var i=this._layerSlots.get(e);
if(!i)return i=[{
localX:t,localY:n,empty:!1}
],void this._layerSlots.set(e,i);
for(var o=-1,r=1/0,a=0;
a<i.length;
a++){
var s=Math.abs(i[a].localX-t)+Math.abs(i[a].localY-n);
s<r&&(r=s,o=a)}
o>=0&&r<4?(i[o].empty=!1,this._revivePriorityReleasedSlotKeys.delete(this._makeReviveSlotKey(e,i[o].localX,i[o].localY))):i.push({
localX:t,localY:n,empty:!1}
)}
,n._pickRandomReviveLandingsInVisibleLayers=function(e,n,i){
if(e<=0)return[];
for(var o=[],r=[],a=n;
a<=i;
a++){
var s=this._layerSlots.get(a);
if(s)for(var l,c=t(s);
!(l=c()).done;
){
var u=l.value;
if(u.empty){
var d={
row:a,localX:u.localX,localY:u.localY}
,h=this._makeReviveSlotKey(a,u.localX,u.localY);
this._revivePriorityReleasedSlotKeys.has(h)?o.push(d):r.push(d)}
}
}
f(o),f(r);
var p=[].concat(o,r);
return p.slice(0,Math.min(e,p.length))}
,n._layContentLocalToWorld=function(e,t){
var n=this._view.getLayContent(),i=new a,o=null==n?void 0:n.getComponent(c);
return o?o.convertToWorldSpaceAR(new a(e,t,0),i):null!=n&&n.isValid&&(n.getWorldPosition(i),i.x+=e,i.y+=t),i}
,n._ensureBoardRowMinLength=function(e){
var n=this._model.getFruitIdList();
if(!(e<0||e>=n.length)){
var i=n[e];
if(i){
for(var o,r=[],a=t(this._staticFruits);
!(o=a()).done;
){
var s=o.value;
!s.isValid||this._toEliminate.has(s)||this._isFruitEliminating(s)||this._fruitRowMap.get(s)===e&&r.push(s)}
r.sort((function(e,t){
return e.position.x-t.position.x}
));
for(var l=Math.max(i.length,r.length);
i.length<l;
)i.push(0)}
}
}
,n._finishReviveAndResumeDrop=function(){
this._pruneStaleFruitArrayRefs(this._slottedFruits),this._pruneStaleFallingFruitRefs(),this._isReviving=!1,this._view.setNoTouchActive(!1),"playing"===this._model.gameState&&(this._checkPendingDrop(),this._checkGameOver())}
,n.onBtnClean=function(){
var e=this;
if("playing"===this._model.gameState&&!(this._isEliminating||this._eliminatingFruits.length>0||this._isShuffling||this._isReviving||null!==this._layContentDropTarget)){
var n=this._getStableSlottedSortedByX().filter((function(t){
return!e._fruitBlindUnrevealedMap.has(t)}
)),i=[],o=[];
if(n.length>=2){
var r=[],a=this._cleanTryOnePairLeftFirst(n,r);
if(a){
for(var s,l,c=t(a.slot);
!(l=c()).done;
){
var u=l.value;
r.indexOf(u)<0&&r.push(u),i.push(u)}
for(var d,h=t(a.board);
!(d=h()).done;
){
var p=d.value;
r.indexOf(p)<0&&r.push(p)}
(s=o).push.apply(s,a.board)}
var f=this._cleanTryOnePairRightFirst(n,r);
if(f){
for(var g,m,v=t(f.slot);
!(m=v()).done;
){
var y=m.value;
r.indexOf(y)<0&&r.push(y),i.push(y)}
(g=o).push.apply(g,f.board)}
if(0===i.length&&0===o.length)return}
else if(1===n.length){
var _,b=n[0],S=null!=(_=this._fruitIdMap.get(b))?_:0;
if(S<=0)return;
var C=[b],w=this._findOneBoardByIdBottomToTop(S,C);
if(w){
i=[b],C.indexOf(w)<0&&C.push(w),o=[w];
var k=this._findOnePairPreferVisible(C);
k&&o.push(k[0],k[1])}
else{
var T=[],B=this._findOnePairBottomToTop(T);
if(!B)return;
o=[B[0],B[1]],T.indexOf(B[0])<0&&T.push(B[0]),T.indexOf(B[1])<0&&T.push(B[1]);
var A=this._findOnePairPreferVisible(T);
A&&o.push(A[0],A[1]),i=[]}
}
else{
var P=[],M=this._findOnePairBottomToTop(P);
if(!M)return;
o=[M[0],M[1]],P.indexOf(M[0])<0&&P.push(M[0]),P.indexOf(M[1])<0&&P.push(M[1]);
var I=this._findOnePairPreferVisible(P);
I&&o.push(I[0],I[1])}
if(o=this._dedupeNodesByRef(o),i=this._dedupeNodesByRef(i),0!==o.length||0!==i.length){
var F=Math.min(this._slotElimCombo+1,8);
this._view.playEliminateComboSound(F),this._slotElimCombo=Math.min(this._slotElimCombo+1,8);
for(var R,L=this._dedupeNodesByRef([].concat(o,i)),x=t(L);
!(R=x()).done;
){
var D=R.value;
null!=D&&D.isValid&&this._removeRopesInvolvingNode(D)}
for(var G,E=[],O=[],H=t(o);
!(G=H()).done;
){
var V=G.value;
this._isBoardCellInVisibleLayers(V)?O.push(V):E.push(V)}
for(var U=0,z=E;
U<z.length;
U++){
var W=z[U];
W.isValid&&(this._disableFruitRigidBody(W),this._finishEliminate(W))}
E.length>0&&this._syncModelBoardWithStaticFruits();
var j=this._view.getMouthPosInDropSpace();
(O.length>0||i.length>0)&&(this._isEliminating=!0,this._elimWaveFinishedCount=0,this._elimWaveDisplayTotal=O.length+i.length);
var J=function(t){
e._finishEliminate(t),e._syncModelBoardWithStaticFruits()}
;
N.vibrate();
for(var Y=function(){
var t=K[q];
if(!t.isValid)return 1;
e._disableFruitRigidBody(t),e._revealBlindBoxIfNeeded(t,(function(){
var n;
t.isValid&&(e._moveToEliminatingState(t),e._view.playEliminateAnimation(t,j,(function(){
return J(t)}
),null!=(n=e._fruitIdMap.get(t))?n:1))}
))}
,q=0,K=O;
q<K.length;
q++)Y();
for(var X,Q=function(){
var t=X.value;
if(!t.isValid)return 1;
e._disableFruitRigidBody(t),e._revealBlindBoxIfNeeded(t,(function(){
var n;
t.isValid&&(e._moveToEliminatingState(t),e._view.playEliminateAnimation(t,j,(function(){
return J(t)}
),null!=(n=e._fruitIdMap.get(t))?n:1))}
))}
,Z=t(i);
!(X=Z()).done;
)Q()}
}
}
,n._cleanTryOnePairLeftFirst=function(e,t){
for(var n=0;
n<e.length;
n++){
var i=e[n];
if(null!=i&&i.isValid&&!(t.indexOf(i)>=0)){
var o=this._fruitIdMap.get(i);
if(!(void 0===o||o<=0)){
var r=t.slice();
r.indexOf(i)<0&&r.push(i);
var a=this._findOneBoardByIdBottomToTop(o,r);
if(a)return{
slot:[i],board:[a]}
;
for(var s=n+1;
s<e.length;
s++){
var l=e[s];
if(null!=l&&l.isValid&&!(t.indexOf(l)>=0)&&this._fruitIdMap.get(l)===o)return{
slot:[i,l],board:[]}
}
}
}
}
return null}
,n._cleanTryOnePairRightFirst=function(e,t){
for(var n=e.length-1;
n>=0;
n--){
var i=e[n];
if(null!=i&&i.isValid&&!(t.indexOf(i)>=0)){
var o=this._fruitIdMap.get(i);
if(!(void 0===o||o<=0)){
var r=t.slice();
r.indexOf(i)<0&&r.push(i);
var a=this._findOneBoardByIdBottomToTop(o,r);
if(a)return{
slot:[i],board:[a]}
;
for(var s=n-1;
s>=0;
s--){
var l=e[s];
if(null!=l&&l.isValid&&!(t.indexOf(l)>=0)&&this._fruitIdMap.get(l)===o)return{
slot:[i,l],board:[]}
}
}
}
}
return null}
,n._iterBoardCandidatesOrdered=function(e){
for(var n,i=this,o=function(t){
return t.isValid&&e.indexOf(t)<0&&!i._toEliminate.has(t)&&!i._isFruitEliminating(t)&&!i._fruitBlindUnrevealedMap.has(t)}
,r=[],a=this._bottomRowOffset,s=t(this._staticFruits);
!(n=s()).done;
){
var l=n.value,c=this._fruitRowMap.get(l);
void 0!==c&&c>a&&(a=c)}
for(var u=function(e,t){
return e.position.x-t.position.x}
,d=function(e){
var t=i._staticFruits.filter((function(t){
return o(t)&&i._fruitRowMap.get(t)===e}
)),n=t.filter((function(e){
return!i._rowHoleFruitByNode.has(e)}
)),a=t.filter((function(e){
return i._rowHoleFruitByNode.has(e)}
));
n.sort(u),a.sort(u),r.push.apply(r,n.concat(a))}
,h=this._bottomRowOffset;
h<=a;
h++)d(h);
var p=[].concat(this._fallingFruits).filter(o).sort((function(e,t){
return i._view.getNodeWorldY(e)-i._view.getNodeWorldY(t)}
));
r.push.apply(r,p);
var f=[].concat(this._groundedFruits).filter(o).sort((function(e,t){
return i._view.getNodeWorldY(e)-i._view.getNodeWorldY(t)}
));
r.push.apply(r,f);
for(var g,m=t(["L","R"]);
!(g=m()).done;
)for(var v,y=g.value,_=t(this._staticFruits);
!(v=_()).done;
){
var b=v.value;
o(b)&&this._fruitHoleSideMap.get(b)===y&&r.push(b)}
return r}
,n._dedupeNodesByRef=function(e){
for(var n,i=[],o=t(e);
!(n=o()).done;
){
var r=n.value;
i.indexOf(r)<0&&i.push(r)}
return i}
,n._findFirstPairInOrder=function(e){
for(var n,i=new Map,o=t(e);
!(n=o()).done;
){
var r=n.value,a=this._fruitIdMap.get(r);
if(!(void 0===a||a<=0)){
var s=i.get(a);
if(void 0!==s)return[s,r];
i.set(a,r)}
}
return null}
,n._findOneBoardByIdBottomToTop=function(e,n){
for(var i,o=t(this._iterBoardCandidatesOrdered(n));
!(i=o()).done;
){
var r=i.value;
if(this._fruitIdMap.get(r)===e)return r}
return null}
,n._findOnePairBottomToTop=function(e){
return this._findFirstPairInOrder(this._iterBoardCandidatesOrdered(e))}
,n._findOnePairPreferVisible=function(e){
var t=this,n=this._iterBoardCandidatesOrdered(e),i=n.filter((function(e){
return t._isBoardCellInVisibleLayers(e)}
));
return this._findFirstPairInOrder(i)||this._findFirstPairInOrder(n)}
,n._isBoardCellInVisibleLayers=function(e){
var t=this._fruitRowMap.get(e);
if(void 0!==t){
var n=this._bottomRowOffset+this._model.visibleLayers-1;
return t>=this._bottomRowOffset&&t<=n}
var i=this._view.getLayContent();
return!(null==i||!i.isValid)&&this._view.getNodeWorldY(e)>=this._view.getNodeWorldY(i)}
,n._getStableSlottedSortedByX=function(){
for(var e,n=this._sortSlotPosA,i=this._sortSlotPosB,o=[],r=t(this._slottedFruits);
!(e=r()).done;
){
var a=e.value;
!a.isValid||this._toEliminate.has(a)||this._isFruitEliminating(a)||o.push(a)}
return o.sort((function(e,t){
return e.getWorldPosition(n),t.getWorldPosition(i),n.x-i.x}
)),o}
,n._syncModelBoardWithStaticFruits=function(){
for(var e,n=this,i=this._model.getFruitIdList(),o=new Map,r=t(this._staticFruits);
!(e=r()).done;
){
var a,s=e.value;
if(s.isValid&&!this._toEliminate.has(s)&&!this._isFruitEliminating(s)){
var l=this._fruitRowMap.get(s);
if(!(void 0===l||l<0||l>=i.length)){
var c=null!=(a=o.get(l))?a:[];
c.push(s),o.set(l,c)}
}
}
o.forEach((function(e,t){
e.sort((function(e,t){
return e.position.x-t.position.x}
));
var i=e.map((function(e){
var t,i=n._rowHoleFruitByNode.get(e);
return void 0!==i?m+i:null!=(t=n._fruitIdMap.get(e))?t:0}
));
n._model.syncBoardRow(t,i)}
))}
,n._finishShuffleAndResumeDrop=function(){
this._isShuffling=!1;
for(var e,n=t(this._staticFruits);
!(e=n()).done;
){
var i,o=e.value;
if(o.isValid){
this._view.resetFruitRigidBodyToStatic(o);
var r=null!=(i=this._fruitIdMap.get(o))?i:0,a=this._fruitBlindUnrevealedMap.has(o);
r>0&&(this._view.applyFruitBlindBoxVisual(o,a,r,!0),a||this._syncRowHoleFruitSprTint(o))}
}
this._refreshRopeBindingPaths();
var s=this._ropeBindings.reduce((function(e,t){
return e+t.worldPoints.length}
),0),l=this._view.getRopeLayPointChainNodeCount();
this._view.endRopeDrawPauseForShuffle(),0===this._ropeBindings.length?l>0&&this._view.syncRopeVisuals([]):s!==l&&this._view.syncRopeVisuals(this._ropeBindings),this._view.setNoTouchActive(!1),this._syncModelBoardWithStaticFruits(),"playing"===this._model.gameState&&this._checkPendingDrop()}
,n.update=function(e){
"playing"===this._model.gameState&&(this._updateFruitStates(),this._updateLayContentDrop(e),this._checkCollisions(),this._doEliminate(),this._tryResetSlotElimComboNoMatch())}
,n._tryResetSlotElimComboNoMatch=function(){
var e,t,n=this;
if(!(this._isEliminating||this._toEliminate.size>0||2!==this._slottedFruits.length)){
var i=this._slottedFruits.filter((function(e){
return e.isValid&&!n._toEliminate.has(e)&&!n._isFruitEliminating(e)}
));
if(2===i.length){
var o=this._sortSlotPosA,r=this._sortSlotPosB;
i.sort((function(e,t){
return e.getWorldPosition(o),t.getWorldPosition(r),o.x-r.x}
)),(null!=(e=this._fruitIdMap.get(i[0]))?e:0)!==(null!=(t=this._fruitIdMap.get(i[1]))?t:0)&&(this._slotElimCombo=0)}
}
}
,n._updateFruitStates=function(){
for(var e,n=this._fruitRadius,i=new a,o=this._view.getPolygonWorldVertices("slots"),r=[this._view.getPolygonWorldVertices("ground1"),this._view.getPolygonWorldVertices("ground2")],s=function(e,t){
return o.length>=3&&b.circleVsPolygon(e,t,n,o)}
,l=function(e,t){
for(var i=0,o=r;
i<o.length;
i++){
var a=o[i];
if(a.length>=3&&b.circleVsPolygon(e,t,n,a))return!0}
return!1}
,c=[],u=t(this._slottedFruits);
!(e=u()).done;
){
var d=e.value;
if(d.isValid&&!this._toEliminate.has(d)&&!this._isFruitEliminating(d)){
d.getWorldPosition(i);
var h=i.x,p=i.y;
!s(h,p)&&l(h,p)&&c.push(d)}
}
for(var f=0,g=c;
f<g.length;
f++){
var m=g[f];
this._removeFromFruitArray(this._slottedFruits,m)&&(this._view.removeSlottedFruitSlotAnchor(m),this._groundedFruits.push(m),this._view.moveFruitToDropLayer(m))}
for(var v,y=[],_=t(this._groundedFruits);
!(v=_()).done;
){
var S=v.value;
!S.isValid||this._toEliminate.has(S)||this._isFruitEliminating(S)||(S.getWorldPosition(i),s(i.x,i.y)&&y.push(S))}
for(var C=0,w=y;
C<w.length;
C++){
var k=w[C];
this._removeFromFruitArray(this._groundedFruits,k)&&(this._slottedFruits.push(k),this._view.moveFruitToDropLayer(k),this._revealBlindBoxIfNeeded(k),this._onHoleFruitEnteredGroundOrSlot(k),this._onRowHoleFruitEnteredSlot(k),this._onRopeFruitLandedBreak(k),this._scheduleSlotAnchorAfterEnterSlot(k))}
for(var T,B=[],A=[],P=t(this._fallingFruits);
!(T=P()).done;
){
var M=T.value;
if(M.isValid&&!this._toEliminate.has(M)&&!this._isFruitEliminating(M)){
M.getWorldPosition(i);
var I=i.x,F=i.y;
s(I,F)?A.push(M):l(I,F)&&B.push(M)}
}
for(var R=0,L=A;
R<L.length;
R++){
var x=L[R];
this._removeFromFallingFruits(x)&&(N.vibrate(),this._slottedFruits.push(x),this._view.moveFruitToDropLayer(x),this._revealBlindBoxIfNeeded(x),this._onHoleFruitEnteredGroundOrSlot(x),this._onRowHoleFruitEnteredSlot(x),this._onRopeFruitLandedBreak(x),this._scheduleSlotAnchorAfterEnterSlot(x))}
for(var D=0,G=B;
D<G.length;
D++){
var E=G[D];
this._removeFromFallingFruits(E)&&(N.vibrate(),this._groundedFruits.push(E),this._view.moveFruitToDropLayer(E),this._onHoleFruitEnteredGroundOrSlot(E))}
}
,n._scheduleSlotAnchorAfterEnterSlot=function(e){
var t=this;
this._view.scheduleNextFrame((function(){
"playing"===t._model.gameState&&null!=e&&e.isValid&&t._view.ensureSlottedFruitSlotAnchor(e)}
))}
,n._onHoleFruitEnteredGroundOrSlot=function(e){
var t=this._holeFruitPendingReplenish.get(e);
void 0!==t&&(this._holeFruitPendingReplenish.delete(e),this._scheduleHoleReplenish(t))}
,n._onRopeFruitLandedBreak=function(e){
0!==this._ropeBindings.length&&this._ropeBindings.some((function(t){
return t.nodeA===e||t.nodeB===e}
))&&this._removeRopesInvolvingNode(e)}
,n._scheduleHoleReplenish=function(e){
var t=this;
0!==("L"===e?this._holeQueueL:this._holeQueueR).length&&(this._pendingHoleSpawn++,this._view.scheduleNextFrame((function(){
t._pendingHoleSpawn--,t._spawnHoleFruit(e)}
)))}
,n._onRowHoleFruitEnteredSlot=function(e){
var t=this._rowHoleFruitPendingReplenish.get(e);
void 0!==t&&(this._rowHoleFruitPendingReplenish.delete(e),this._scheduleRowHoleReplenish(t))}
,n._scheduleRowHoleReplenish=function(e){
var t=this;
this._model.hasRowHoleQueue(e)&&(this._pendingRowHoleSpawn++,this._view.scheduleNextFrame((function(){
t._pendingRowHoleSpawn--,t._spawnRowHoleFruit(e)}
)))}
,n._spawnRowHoleFruit=function(e){
var t=this._model.takeRowHoleNextDisplayId(e);
if(null!=t){
var n=this._model.getRowHoleCell(e);
if(n)if(n.row<this._bottomRowOffset)this._model.restoreRowHoleFrontDisplayId(e,t);
else{
var i=this._view.getLayContent();
if(null!=i&&i.isValid){
var o=this._layerSlots.get(n.row),r=null==o?void 0:o[n.col];
if(r){
var a=this._view.addFruit(i,r.localX,r.localY,t,this._onFruitClickBound,this);
null!=a&&a.isValid?(this._fruitIdMap.set(a,t),this._fruitRowMap.set(a,n.row),this._rowHoleFruitByNode.set(a,e),this._fruitNodes.push(a),this._staticFruits.push(a),r.empty=!1,this._model.hasRowHoleQueue(e)?this._view.ensureRowHoleBackDecoration(e,r.localX,r.localY,this._model.getRowHoleQueueRemainingCount(e)):this._view.removeRowHoleBackDecoration(e),this._playSpawnPopScaleOnFruit(a,0),this._checkPendingDrop()):this._model.restoreRowHoleFrontDisplayId(e,t)}
else this._model.restoreRowHoleFrontDisplayId(e,t)}
else this._model.restoreRowHoleFrontDisplayId(e,t)}
else this._model.restoreRowHoleFrontDisplayId(e,t)}
}
,n._removeFromFruitArray=function(e,t){
var n=e.indexOf(t);
return n>=0&&(e.splice(n,1),!0)}
,n._removeFromFallingFruits=function(e){
var t=this._removeFromFruitArray(this._fallingFruits,e);
return t&&this._fallingBoardRestoreInfo.delete(e),t}
,n._pruneStaleFallingFruitRefs=function(){
this._pruneStaleFruitArrayRefs(this._fallingFruits);
for(var e=0,t=[].concat(this._fallingBoardRestoreInfo.keys());
e<t.length;
e++){
var n=t[e];
null!=n&&n.isValid||this._fallingBoardRestoreInfo.delete(n)}
}
,n._recallFallingFruitsToBoardForShuffle=function(){
var e=this._view.getLayContent();
if(null!=e&&e.isValid){
for(var n,i=this._view.getLayHole(),o=[].concat(this._fallingFruits),r=t(o);
!(n=r()).done;
){
var a=n.value;
if(null!=a&&a.isValid&&!this._toEliminate.has(a)&&!this._isFruitEliminating(a)){
var s=this._fallingBoardRestoreInfo.get(a);
if(s){
this._removeFromFallingFruits(a),this._holeFruitPendingReplenish.delete(a),this._rowHoleFruitPendingReplenish.delete(a),this._pendingDropNode===a&&(this._pendingDropNode=null),u.stopAllByTarget(a);
var l=void 0!==s.holeSide&&null!=i&&i.isValid?i:e;
a.setParent(l,!0),this._view.resetFruitRigidBodyToStatic(a),void 0!==s.holeSide&&this._fruitHoleSideMap.set(a,s.holeSide),void 0!==s.rowHoleIdx&&this._rowHoleFruitByNode.set(a,s.rowHoleIdx),void 0!==s.row&&this._occupyLayerSlotAt(s.row,s.localX,s.localY),this._staticFruits.indexOf(a)<0&&this._staticFruits.push(a)}
}
}
this._model.hasRowFruitHoleData()&&this._ensureAllRowHoleBackDecorationsFromSlots()}
}
,n._pruneStaleFruitArrayRefs=function(e){
for(var t=e.length-1;
t>=0;
t--){
var n;
null!=(n=e[t])&&n.isValid||e.splice(t,1)}
}
,n._revealBlindBoxIfNeeded=function(e,t){
var n;
if(this._fruitBlindUnrevealedMap.has(e)){
var i=null!=(n=this._fruitIdMap.get(e))?n:0;
this._fruitBlindUnrevealedMap.delete(e),this._view.revealBlindBoxFruit(e,i,t)}
else null==t||t()}
,n._syncRowHoleFruitSprTint=function(e){
null!=e&&e.isValid&&this._view.applyFruitSprIconTint(e,this._sprIconTintWhite)}
,n._isFruitEliminating=function(e){
return this._eliminatingFruitSet.has(e)}
,n._moveToEliminatingState=function(e){
this._view.removeSlottedFruitSlotAnchor(e),this._removeFromFruitArray(this._staticFruits,e),this._removeFromFallingFruits(e),this._removeFromFruitArray(this._groundedFruits,e),this._removeFromFruitArray(this._slottedFruits,e),this._eliminatingFruitSet.has(e)||(this._eliminatingFruits.push(e),this._eliminatingFruitSet.add(e))}
,n._countValidFruitNodes=function(){
for(var e,n=0,i=t(this._fruitNodes);
!(e=i()).done;
)e.value.isValid&&n++;
return n}
,n._isEliminationQuiescentForFailJudge=function(){
return!(this._toEliminate.size>0||this._isEliminating||this._eliminatingFruits.length>0)}
,n._countSlottedFruitsForFail=function(){
for(var e,n=0,i=t(this._slottedFruits);
!(e=i()).done;
){
var o=e.value;
!o.isValid||this._toEliminate.has(o)||this._isFruitEliminating(o)||n++}
return n}
,n._getSlottedFruitsForRevivePick=function(){
this._pruneStaleFruitArrayRefs(this._slottedFruits);
for(var e,n=[],i=t(this._slottedFruits);
!(e=i()).done;
){
var o=e.value;
!o.isValid||this._toEliminate.has(o)||this._isFruitEliminating(o)||n.push(o)}
return n}
,n.lateUpdate=function(e){
"playing"===this._model.gameState&&(this._checkPendingDrop(),this._checkGameOver())}
,n._checkGameOver=function(){
if(!this._isReviving&&(this._pruneStaleFruitArrayRefs(this._staticFruits),this._pruneStaleFruitArrayRefs(this._groundedFruits),this._pruneStaleFallingFruitRefs(),this._pruneStaleFruitArrayRefs(this._slottedFruits),null===this._layContentDropTarget&&this._isEliminationQuiescentForFailJudge())){
var e=this._countValidFruitNodes(),t=this._countSlottedFruitsForFail();
if(t>this._model.failThreshold){
if(this._slotShouldDelayOverflowFail())return;
this._model.setGameState("lose","槽位内水果数量超过失败阈值（阈值"+this._model.failThreshold+"，当前"+t+"）","slot_full")}
else if(t===this._model.failThreshold?this._view.showWarning():this._view.hideWarning(),!(e>0&&t!==e))if(0!==e)this._slotIsDeadEndNoEliminableByContact()&&this._model.setGameState("lose","剩余水果均在槽位，圆接触下无同 id 可消，无法继续","dead_end");
else{
if(0!==t)return;
var n=this._lastSpawnedRowIndex>=this._model.getTotalRowCount(),i=0===this._holeQueueL.length&&0===this._holeQueueR.length&&0===this._pendingHoleSpawn&&0===this._fruitHoleSideMap.size&&0===this._model.getRowHoleQueueRemainingTotal()&&0===this._pendingRowHoleSpawn&&0===this._rowHoleFruitPendingReplenish.size&&0===this._rowHoleFruitByNode.size;
n&&i&&this._model.setGameState("win")}
}
}
,n._getSlottedSlotContactMetricsForFailJudge=function(){
for(var e,n=this._fruitRadius,i=this._sortSlotPosA,o=[],r=t(this._slottedFruits);
!(e=r()).done;
){
var a,s=e.value;
!s.isValid||this._toEliminate.has(s)||this._isFruitEliminating(s)||(s.getWorldPosition(i),o.push({
x:i.x,y:i.y,id:null!=(a=this._fruitIdMap.get(s))?a:0}
))}
var l=o.length;
if(l<=1)return{
len:l,allHaveContact:!1,hasSameIdTouching:!1}
;
for(var c=new Array(l).fill(0),u=!1,d=0;
d<l;
d++)for(var h=o[d],p=d+1;
p<l;
p++){
var f=o[p];
b.circleVsCircle(h.x,h.y,n,f.x,f.y,n)&&(c[d]++,c[p]++,h.id>0&&h.id===f.id&&(u=!0))}
for(var g=!0,m=0;
m<l;
m++)if(0===c[m]){
g=!1;
break}
return{
len:l,allHaveContact:g,hasSameIdTouching:u}
}
,n._slotShouldDelayOverflowFail=function(){
var e=this._getSlottedSlotContactMetricsForFailJudge();
return!(e.len<2||e.allHaveContact&&!e.hasSameIdTouching)}
,n._slotIsDeadEndNoEliminableByContact=function(){
var e=this._getSlottedSlotContactMetricsForFailJudge();
return e.len<2?1===e.len:e.allHaveContact&&!e.hasSameIdTouching}
,n._checkCollisions=function(){
if(!(this._isEliminating||this._slottedFruits.length<2)){
for(var e,n=this._fruitRadius,i=new a,o=new Map,r=t(this._slottedFruits);
!(e=r()).done;
){
var s,l=e.value,c=this._fruitIdMap.get(l);
if(void 0!==c){
l.getWorldPosition(i);
var u=null!=(s=o.get(c))?s:[];
u.push({
node:l,x:i.x,y:i.y}
),o.set(c,u)}
}
for(var d,h=t(o.values());
!(d=h()).done;
){
var p=d.value;
if(!(p.length<2))for(var f=0;
f<p.length;
f++){
var g=p[f];
if(!this._toEliminate.has(g.node))for(var m=f+1;
m<p.length;
m++){
var v=p[m];
if(!this._toEliminate.has(v.node)&&b.circleVsCircle(g.x,g.y,n,v.x,v.y,n))return this._toEliminate.add(g.node),this._toEliminate.add(v.node),this._toEliminatePairs.push([g.node,v.node]),this._disableFruitRigidBody(g.node),void this._disableFruitRigidBody(v.node)}
}
}
}
}
,n._spawnFruits=function(){
var e=this,t=this._model.visibleLayers;
this._model.ensureRowsUpTo(t-1);
var n=this._model.getFruitIdList();
this._spawnRowsFromTo(0,n.length-1,!0),this._lastSpawnedRowIndex=n.length,this._playInitialSpawnIntro(n.length-1),this._isSpawnIntroPlaying||this._view.scheduleNextFrame((function(){
return e._tryGenerateRopesAfterBoardChange("initial")}
))}
,n._initHoleQueuesFromModel=function(){
this._holeQueueL=this._model.getHoleIdsLeft().slice(),this._holeQueueR=this._model.getHoleIdsRight().slice(),this._pendingHoleSpawn=0,this._fruitHoleSideMap.clear()}
,n._spawnInitialHoleFruits=function(){
this._spawnHoleFruit("L"),this._spawnHoleFruit("R")}
,n._spawnHoleFruit=function(e){
var t,n="L"===e?this._holeQueueL:this._holeQueueR;
if(0!==n.length){
var i=n.shift(),o=null!=(t=this._view.getLayHole())?t:this._view.getLayContent(),r=this._view.getHoleFruitLocalPosition(e);
if(o&&r){
var a=this._view.addFruit(o,r.x,r.y,i,this._onFruitClickBound,this);
null!=a&&a.isValid?(this._fruitIdMap.set(a,i),this._fruitNodes.push(a),this._staticFruits.push(a),this._fruitHoleSideMap.set(a,e),this._refreshHoleQueueLabels(),this._playSpawnPopScaleOnFruit(a,0)):n.unshift(i)}
else n.unshift(i)}
}
,n._refreshHoleQueueLabels=function(){
this._model.getHoleReserveTotal()<=0?this._view.setHoleQueueLabels(0,0):this._view.setHoleQueueLabels(this._holeQueueL.length,this._holeQueueR.length)}
,n._clearRopes=function(){
this._ropeBindings.length=0,this._nextRopeId=1,this._syncRopeVisualsFromBindings()}
,n._syncRopeVisualsFromBindings=function(){
this._refreshRopeBindingPaths(),this._view.syncRopeVisuals(this._ropeBindings)}
,n._refreshRopeBindingPaths=function(){
if(0!==this._ropeBindings.length){
for(var e,n=[],i=t(this._ropeBindings);
!(e=i()).done;
){
var o,r,a=e.value;
if(null!=(o=a.nodeA)&&o.isValid&&null!=(r=a.nodeB)&&r.isValid){
var s=this._findValidRopePathForPair(a.nodeA,a.nodeB);
null!=s&&0!==s.length&&(a.worldPoints=s,n.push(a))}
}
this._ropeBindings=n}
}
,n._removeRopesInvolvingNode=function(e){
if(0!==this._ropeBindings.length){
var t=this._ropeBindings.filter((function(t){
return t.nodeA!==e&&t.nodeB!==e}
));
t.length!==this._ropeBindings.length&&(this._ropeBindings=t,this._syncRopeVisualsFromBindings())}
}
,n._getRopeObstaclePolygonsWorld=function(){
for(var e,n=[],i=t(["ground1","ground2","slots"]);
!(e=i()).done;
){
var o=e.value;
try{
var r=this._view.getPolygonWorldVertices(o);
(null==r?void 0:r.length)>=3&&n.push(r)}
catch(e){
}
}
return n}
,n._collectStaticFruitsForRope=function(e,n){
for(var i,o=[],r=t(this._staticFruits);
!(i=r()).done;
){
var a=i.value;
if(a.isValid&&!this._toEliminate.has(a)&&!this._isFruitEliminating(a)&&!this._fruitHoleSideMap.has(a)){
var s=this._fruitRowMap.get(a);
void 0!==s&&this._isBoardCellInVisibleLayers(a)&&(void 0!==e&&void 0!==n&&(s<e||s>n)||o.push(a))}
}
return o}
,n._buildRopeFruitObstaclesWorld=function(e,n){
for(var i,o=[],r=this._fruitRadius,s=t(this._staticFruits);
!(i=s()).done;
){
var l=i.value;
if(l!==e&&l!==n&&l.isValid&&!this._toEliminate.has(l)&&!this._isFruitEliminating(l)&&this._isBoardCellInVisibleLayers(l)){
var c=new a;
l.getWorldPosition(c),o.push({
x:c.x,y:c.y,r:r}
)}
}
return o}
,n._findValidRopePathForPair=function(e,t){
var n,i,o=null!=(n=this._fruitIdMap.get(e))?n:0,r=null!=(i=this._fruitIdMap.get(t))?i:0;
if(o<=0||r<=0)return null;
var s=new a,l=new a;
e.getWorldPosition(s),t.getWorldPosition(l);
var c=l.x-s.x,u=l.y-s.y;
if(c*c+u*u>S*S)return null;
var d=this._buildRopeFruitObstaclesWorld(e,t),h=this._getRopeObstaclePolygonsWorld();
return C(s.x,s.y,l.x,l.y,this._fruitRadius,w,d,h)}
,n._logRopesBuilt=function(){
var e=this;
this._ropeBindings.length>0&&console.log("[Rope] 当前绳组",this._ropeBindings.length,"/",this._model.getRopeMaxCount(),this._ropeBindings.map((function(t){
return{
id:t.id,a:e._fruitIdMap.get(t.nodeA),b:e._fruitIdMap.get(t.nodeB),pts:t.worldPoints.length}
}
))),this._syncRopeVisualsFromBindings()}
,n._tryGenerateRopesInitial=function(){
if(!this._ropeInitialGenerated){
this._ropeInitialGenerated=!0;
var e=this._model.getRopeMaxCount();
if(!(e<=0)){
var n=this._collectStaticFruitsForRope();
f(n);
for(var i,o=new Set,r=t(n);
!(i=r()).done;
){
var a=i.value;
if(this._ropeBindings.length>=e)break;
if(!o.has(a))for(var s,l=t(n);
!(s=l()).done;
){
var c=s.value;
if(a!==c&&!o.has(c)){
var u=this._findValidRopePathForPair(a,c);
if(u){
this._ropeBindings.push({
id:this._nextRopeId++,nodeA:a,nodeB:c,worldPoints:u}
),o.add(a),o.add(c);
break}
}
}
}
this._logRopesBuilt()}
}
}
,n._tryGenerateRopesSupplement=function(e,n){
var i=this,o=this._model.getRopeMaxCount();
if(!(o<=0||this._ropeBindings.length>=o)){
var r=this._collectStaticFruitsForRope(e,n);
if(0!==r.length){
var a=this._collectStaticFruitsForRope();
f(r);
for(var s,l=new Set,c=t(this._ropeBindings);
!(s=c()).done;
){
var u=s.value;
l.add(u.nodeA),l.add(u.nodeB)}
for(var d,h=function(){
var e=d.value;
if(i._ropeBindings.length>=o)return 0;
if(l.has(e))return 1;
var n=a.filter((function(t){
return t!==e&&!l.has(t)}
));
f(n);
for(var r,s=t(n);
!(r=s()).done;
){
var c=r.value,u=i._findValidRopePathForPair(e,c);
if(u){
i._ropeBindings.push({
id:i._nextRopeId++,nodeA:e,nodeB:c,worldPoints:u}
),l.add(e),l.add(c);
break}
}
}
,p=t(r);
!(d=p()).done&&0!==h();
);
this._logRopesBuilt()}
}
}
,n._tryGenerateRopesAfterBoardChange=function(e,t,n){
this._model.getRopeMaxCount()<=0||"playing"===this._model.gameState&&("initial"===e?this._tryGenerateRopesInitial():void 0!==t&&void 0!==n&&this._tryGenerateRopesSupplement(t,n))}
,n._supplementRows=function(){
var e=this;
if(!this._model.isFixedShapeNoLayerDrop()&&!this._isSpawnIntroPlaying){
var t=this._model.visibleLayers,n=this._bottomRowOffset+t-1,i=this._model.ensureRowsUpTo(n);
if(i.length>0){
var o=this._lastSpawnedRowIndex,r=o+i.length-1;
this._spawnRowsFromTo(o,r),this._lastSpawnedRowIndex=o+i.length,this._view.scheduleNextFrame((function(){
return e._tryGenerateRopesAfterBoardChange("supplement",o,r)}
))}
}
}
,n._spawnRowsFromTo=function(e,t,n){
void 0===n&&(n=!1);
var i=this._model.getFruitIdList();
if(i.length&&!(e>t))for(var o=this._view.getLayContent(),r=2*this._fruitRadius,a=this._getFruitHorizontalSpacing(),s=e;
s<=t&&s<i.length;
s++){
var l=i[s];
if(null!=l&&l.length){
var c=l.length,u=s*this._getLayerHeight(),d=this._model.getFruitSlotLocalPosRow(s),h=null!==d&&d.length===c,p=this._model.getRowSlotLocalXs(s),f=!h&&null!==p&&p.length===c,v=!h&&this._model.isFullScreenMessyLayout(),y=g(s),_=-(y*r+(y-1)*a)/2+r/2,b=this._model.getRowSlotCols(s);
f||b.length===c||console.warn("[GameCtl] getRowSlotCols 与该行水果数不一致 row=",s,"cols=",b.length,"count=",c);
for(var S=[],C=0;
C<c;
C++){
var w,N=v?this._fullScreenMessyJitterYMin+Math.random()*(this._fullScreenMessyJitterYMax-this._fullScreenMessyJitterYMin):0,k=h?d[C].x:f?p[C]:_+(null!=(w=b[C])?w:C)*(r+a),T=h?d[C].y:u+N;
S.push({
localX:k,localY:T,empty:!1}
);
var B=l[C],A=B,P=void 0;
if(B>=m){
P=B-m;
var M=this._model.takeRowHoleNextDisplayId(P);
if(null==M){
console.warn("[GameCtl] 行内洞队列为空 holeIdx=",P);
continue}
A=M}
var I=this._model.getBlindBoxAt(s,C),F=this._view.addFruit(o,k,T,A,this._onFruitClickBound,this,I,void 0);
if(F)if(this._fruitIdMap.set(F,A),this._fruitRowMap.set(F,s),void 0!==P&&(this._rowHoleFruitByNode.set(F,P),n||(this._model.hasRowHoleQueue(P)?this._view.ensureRowHoleBackDecoration(P,k,T,this._model.getRowHoleQueueRemainingCount(P)):this._view.removeRowHoleBackDecoration(P))),I&&this._fruitBlindUnrevealedMap.set(F,!0),this._fruitNodes.push(F),this._staticFruits.push(F),n){
var R=F.scale.clone();
this._spawnIntroEndScale.set(F,R),F.setScale(0,0,R.z)}
else{
var L=(s-e)*this._spawnPopStaggerSec;
this._playSpawnPopScaleOnFruit(F,L)}
}
this._layerSlots.set(s,S),this._rowFruitCount[s]=c}
}
}
,n._playSpawnPopScaleOnFruit=function(e,t){
if(null!=e&&e.isValid){
var n=e.scale.clone();
e.setScale(0,0,n.z),s(e).delay(t).to(this._spawnPopDurationSec,{
scale:n}
,{
easing:d.backOut}
).call((function(){
e.isValid&&e.setScale(n)}
)).start()}
}
,n._ensureAllRowHoleBackDecorationsFromSlots=function(){
if(this._model.hasRowFruitHoleData())for(var e=this._model.getRowHoleCount(),t=0;
t<e;
t++)if(this._model.hasRowHoleQueue(t)){
var n=this._model.getRowHoleCell(t);
if(n){
var i=this._layerSlots.get(n.row),o=null==i?void 0:i[n.col];
o&&this._view.ensureRowHoleBackDecoration(t,o.localX,o.localY,this._model.getRowHoleQueueRemainingCount(t))}
}
else this._view.removeRowHoleBackDecoration(t)}
,n._playInitialSpawnIntro=function(e){
var n=this;
if(e<0||0===this._spawnIntroEndScale.size)this._ensureAllRowHoleBackDecorationsFromSlots();
else{
this._isSpawnIntroPlaying=!0,this._view.setNoTouchActive(!0);
for(var i=new Map,o=0;
o<=e;
o++)i.set(o,[]);
for(var r,a=t(this._staticFruits);
!(r=a()).done;
){
var l=r.value;
if(l.isValid){
var c=this._fruitRowMap.get(l);
void 0===c||c>e||i.get(c).push(l)}
}
for(var u=this._spawnPopDurationSec,h=this._spawnPopStaggerSec,p=function(){
n._spawnIntroEndScale.clear(),n._isSpawnIntroPlaying=!1,n._ensureAllRowHoleBackDecorationsFromSlots(),n._view.setNoTouchActive(!1),n._view.scheduleNextFrame((function(){
return n._tryGenerateRopesAfterBoardChange("initial")}
))}
,f=0,g=0,m=function(){
var o,r,a=null!=(o=null==(r=i.get(v))?void 0:r.filter((function(e){
return e.isValid}
)))?o:[];
if(0===a.length)return 1;
var l=v*h,c=e<=0?1:n._spawnIntroBornVolMin+(1-n._spawnIntroBornVolMin)*((e-v)/e);
0==v&&n._view.scheduleOnceDelayed((function(){
n._view.playSoundById("born1",c)}
),l);
for(var m,y=function(){
var e=m.value,t=n._spawnIntroEndScale.get(e);
if(!e.isValid||!t)return 1;
f++,s(e).delay(l).to(u,{
scale:t}
,{
easing:d.backOut}
).call((function(){
e.isValid&&e.setScale(t),++g>=f&&p()}
)).start()}
,_=t(a);
!(m=_()).done;
)y()}
,v=0;
v<=e;
v++)m();
0===f&&p()}
}
,n._onFruitClick=function(e){
if(null===this._layContentDropTarget){
B.instance.playSound("fruitGame/fruitClick");
for(var t=e.target;
t&&!this._fruitIdMap.has(t);
)t=t.parent;
if(t&&this._fruitIdMap.has(t)&&!(this._staticFruits.indexOf(t)<0)){
var n=this._fruitHoleSideMap.get(t),a=this._rowHoleFruitByNode.get(t),s=void 0===n&&this._isLastStaticInPlayZone(t);
this._releaseBoardSlotForNode(t),this._removeFromFruitArray(this._staticFruits,t),void 0!==n&&(this._fruitHoleSideMap.delete(t),("L"===n?this._holeQueueL:this._holeQueueR).length>0&&this._holeFruitPendingReplenish.set(t,n)),void 0!==a&&(this._rowHoleFruitByNode.delete(t),this._model.hasRowHoleQueue(a)&&this._rowHoleFruitPendingReplenish.set(t,a));
var l=this._fruitRowMap.get(t);
void 0===l&&void 0===n&&void 0===a||this._fallingBoardRestoreInfo.set(t,{
row:l,localX:t.position.x,localY:t.position.y,holeSide:void 0!==n?n:void 0,rowHoleIdx:void 0!==a?a:void 0}
),this._view.moveFruitToDropLayer(t);
var c=t.getComponent(i);
c&&(this._fallingFruits.push(t),c.type=o.Dynamic,c.linearVelocity=new r(Math.random()>.5?-this._clickDropHorizontalSpeed:this._clickDropHorizontalSpeed,0)),!s||this._isDropLimitReached()||this._model.isFixedShapeNoLayerDrop()||(this._pendingDropNode=t)}
}
}
,n._isDropLimitReached=function(){
var e=this._view.getNodeCheckDropLastWorldY();
if(e===-1/0)return!1;
for(var n,i=-1/0,o=t([this._staticFruits,this._fallingFruits]);
!(n=o()).done;
)for(var r,a=n.value,s=t(a);
!(r=s()).done;
){
var l=r.value;
if(l.isValid&&!this._toEliminate.has(l)&&!this._isFruitEliminating(l)){
var c=this._view.getNodeWorldY(l);
c>i&&(i=c)}
}
return i<e}
,n._isBottomRowEmpty=function(){
if(this._bottomRowOffset>=this._lastSpawnedRowIndex)return!0;
for(var e,n=this._bottomRowOffset,i=t(this._staticFruits);
!(e=i()).done;
){
var o=e.value;
if(o.isValid&&!this._toEliminate.has(o)&&!this._isFruitEliminating(o)&&this._fruitRowMap.get(o)===n)return!1}
return!0}
,n._isLastStaticInPlayZone=function(e){
if(this._staticFruits.indexOf(e)<0)return!1;
if(this._bottomRowOffset>=this._lastSpawnedRowIndex)return!1;
var n=this._fruitRowMap.get(e);
if(void 0===n||n!==this._bottomRowOffset)return!1;
for(var i,o=0,r=t(this._staticFruits);
!(i=r()).done;
){
var a=i.value;
a.isValid&&a!==e&&(this._toEliminate.has(a)||this._isFruitEliminating(a)||this._fruitRowMap.get(a)===this._bottomRowOffset&&o++)}
return 0===o}
,n._clearFruits=function(){
this._ropeInitialGenerated=!1,this._clearRopes();
for(var e,n=t(this._fruitNodes);
!(e=n()).done;
){
var i=e.value;
i.isValid&&(i.off(l.EventType.TOUCH_START,this._onFruitClickBound,this),this._view.recycleFruitNode(i))}
this._holeQueueL.length=0,this._holeQueueR.length=0,this._fruitHoleSideMap.clear(),this._holeFruitPendingReplenish.clear(),this._rowHoleFruitByNode.clear(),this._rowHoleFruitPendingReplenish.clear(),this._pendingRowHoleSpawn=0,this._pendingHoleSpawn=0,this._view.setHolePlaceholdersVisible(!1),this._view.setHoleQueueLabels(0,0),this._fruitNodes.length=0,this._fruitIdMap.clear(),this._fruitRowMap.clear(),this._staticFruits.length=0,this._fallingFruits.length=0,this._fallingBoardRestoreInfo.clear(),this._groundedFruits.length=0,this._slottedFruits.length=0,this._toEliminate.clear(),this._toEliminatePairs.length=0,this._eliminatingFruits.length=0,this._eliminatingFruitSet.clear(),this._isEliminating=!1,this._elimWaveDisplayTotal=0,this._elimWaveFinishedCount=0,this._hudEliminatedFruitCount=0,this._slotElimCombo=0,this._rowFruitCount.length=0,this._bottomRowOffset=0,this._lastSpawnedRowIndex=0,this._layContentDropTarget=null,this._pendingDropNode=null,this._isReviving=!1,this._spawnIntroEndScale.clear(),this._isSpawnIntroPlaying=!1,this._layerSlots.clear(),this._revivePriorityReleasedSlotKeys.clear(),this._fruitBlindUnrevealedMap.clear(),this._view.clearFruitNodes(),this._view.setNoTouchActive(!1)}
,n._doEliminate=function(){
var e=this,n=[].concat(this._toEliminatePairs);
if(this._toEliminate.clear(),this._toEliminatePairs.length=0,0!==n.length){
for(var i,o=this._view.getMouthPosInDropSpace(),r=new Set,a=t(n);
!(i=a()).done;
){
var s=i.value,l=s[0],c=s[1];
null!=l&&l.isValid&&null!=c&&c.isValid&&(r.add(l),r.add(c))}
if(0!==r.size){
var u=Math.min(this._slotElimCombo+1,8);
this._view.playEliminateComboSound(u),this._slotElimCombo=Math.min(this._slotElimCombo+1,8),this._isEliminating=!0,this._elimWaveFinishedCount=0,this._elimWaveDisplayTotal=r.size,N.vibrate();
for(var d,h=function(){
var t=d.value;
e._revealBlindBoxIfNeeded(t,(function(){
var n;
t.isValid&&(e._moveToEliminatingState(t),e._view.playEliminateAnimation(t,o,(function(){
return e._finishEliminate(t)}
),null!=(n=e._fruitIdMap.get(t))?n:1))}
))}
,p=t(r);
!(d=p()).done;
)h()}
}
}
,n._disableFruitRigidBody=function(e){
var t=e.getComponent(i);
t&&(t.enabled=!1)}
,n._finishEliminate=function(e){
this._pendingDropNode===e&&(this._pendingDropNode=null),this._removeRopesInvolvingNode(e);
var t=this._eliminatingFruitSet.has(e);
if(this._removeFromFruitArray(this._eliminatingFruits,e),this._eliminatingFruitSet.delete(e),t&&this._elimWaveDisplayTotal>0&&this._elimWaveFinishedCount++,0===this._eliminatingFruits.length&&(this._isEliminating=!1,this._elimWaveDisplayTotal=0,this._elimWaveFinishedCount=0),this._holeFruitPendingReplenish.has(e)){
var n=this._holeFruitPendingReplenish.get(e);
this._holeFruitPendingReplenish.delete(e),this._scheduleHoleReplenish(n)}
if(this._rowHoleFruitPendingReplenish.has(e)){
var i=this._rowHoleFruitPendingReplenish.get(e);
this._rowHoleFruitPendingReplenish.delete(e),this._scheduleRowHoleReplenish(i)}
var o=this._fruitHoleSideMap.get(e);
void 0!==o&&(this._fruitHoleSideMap.delete(e),("L"===o?this._holeQueueL:this._holeQueueR).length>0&&this._scheduleHoleReplenish(o));
var r=this._rowHoleFruitByNode.get(e);
void 0!==r&&(this._rowHoleFruitByNode.delete(e),this._model.hasRowHoleQueue(r)&&this._scheduleRowHoleReplenish(r)),this._releaseBoardSlotForNode(e);
var a,s=this._fruitRowMap.get(e);
void 0!==s&&(this._rowFruitCount[s]=Math.max(0,(null!=(a=this._rowFruitCount[s])?a:0)-1),this._fruitRowMap.delete(e)),e.isValid&&e.off(l.EventType.TOUCH_START,this._onFruitClickBound,this),this._fruitIdMap.delete(e),this._removeFromFruitArray(this._staticFruits,e),this._removeFromFallingFruits(e),this._removeFromFruitArray(this._groundedFruits,e),this._removeFromFruitArray(this._slottedFruits,e);
var c=this._fruitNodes.indexOf(e);
c>=0&&this._fruitNodes.splice(c,1),e.isValid&&this._view.recycleFruitNode(e),this._hudEliminatedFruitCount++}
,n._updateLayContentDrop=function(e){
if(!this._model.isFixedShapeNoLayerDrop()&&null!==this._layContentDropTarget){
var t=this._view.getLayContent(),n=t.position,i=this._layContentDropTarget;
n.y<=i&&(this._view.setLayContentPosition(n.x,i,n.z),this._bottomRowOffset+=1,this._layerSlots.delete(this._bottomRowOffset-1),this._supplementRows(),this._isShuffling||this._isReviving||this._isDropLimitReached()||!this._isBottomRowEmpty()||this._bottomRowRowHoleQueueStillSpawning()?(this._layContentDropTarget=null,this._releaseNoTouchIfNotBlockingByOtherFlow()):this._doDrop()),null!==this._layContentDropTarget&&(n=t.position).y>this._layContentDropTarget&&this._applyLayContentDropLerpY(n,e)}
}
,n._applyLayContentDropLerpY=function(e,t){
var n=this._layContentDropTarget,i=e.y-n;
if(!(i<=0)){
var o=this._layContentDropSpeed*t,r=Math.min(1,o/i),a=h.lerp(e.y,n,r);
this._view.setLayContentPosition(e.x,a,e.z)}
}
,n._bottomRowRowHoleQueueStillSpawning=function(){
if(!this._model.hasRowFruitHoleData())return!1;
for(var e=this._bottomRowOffset,n=0;
n<this._model.getRowHoleCount();
n++){
var i=this._model.getRowHoleCell(n);
if(i&&i.row===e&&this._model.hasRowHoleQueue(n)){
for(var o,r=!1,a=t(this._staticFruits);
!(o=a()).done;
){
var s=o.value;
if(s.isValid&&!this._toEliminate.has(s)&&!this._isFruitEliminating(s)&&this._fruitRowMap.get(s)===e&&this._rowHoleFruitByNode.get(s)===n){
r=!0;
break}
}
if(!r)return!0}
}
return!1}
,n._checkPendingDrop=function(){
var e;
if(!(this._model.isFixedShapeNoLayerDrop()||null!==this._layContentDropTarget||this._isShuffling||this._isReviving||this._isDropLimitReached())){
if(null!=(e=this._pendingDropNode)&&e.isValid){
var t=this._view.getNodeCheckWorldY();
return this._view.getNodeWorldY(this._pendingDropNode)<t?this._isBottomRowEmpty()?void(this._bottomRowRowHoleQueueStillSpawning()||(this._doDrop(),this._pendingDropNode=null)):void(this._pendingDropNode=null):void 0}
this._isBottomRowEmpty()&&!this._bottomRowRowHoleQueueStillSpawning()&&this._doDrop()}
}
,n._doDrop=function(){
var e=this._view.getLayContent().position,t=0===this._bottomRowOffset?this._getFirstLayerHeight():this._getLayerHeight();
this._layContentDropTarget=e.y-t,this._view.setNoTouchActive(!0)}
,n._releaseNoTouchIfNotBlockingByOtherFlow=function(){
this._isSpawnIntroPlaying||this._isShuffling||this._isReviving||this._view.setNoTouchActive(!1)}
,e}
()),n._RF.pop()}
}
}
))
