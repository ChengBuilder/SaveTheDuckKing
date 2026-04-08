/**
 * Restored module: chunks:///_virtual/DuckController.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => BoxCollider2D
 * - a => asyncToGenerator
 * - A => Intersection2D
 * - ae => AutoManager
 * - b => instantiate
 * - c => SpriteFrame
 * - C => UITransform
 * - D => easing
 * - E => GameModel
 * - ee => Nail
 * - f => tween
 * - F => Camera
 * - g => Sprite
 * - G => PolygonCollider2D
 * - h => find
 * - H => Util
 * - I => Node
 * - ie => AdManager_ZJ
 * - j => COLLIDER_TAG
 * - J => PHY_GROUP
 * - k => view
 * - K => AdManager
 * - l => _decorator
 * - L => Component
 * - m => Color
 * - M => director
 * - n => inheritsLoose
 * - N => ProgressBar
 * - ne => TooYueManager
 * - o => initializerDefineProperty
 * - O => ResManager
 * - oe => TT_EVENT_KEYS
 * - p => Label
 * - P => HingeJoint2D
 * - q => default
 * - Q => PropPanelView
 * - r => assertThisInitialized
 * - R => Vec3
 * - re => ReceivePanelView
 * - s => cclegacy
 * - S => UIOpacity
 * - t => applyDecoratedDescriptor
 * - T => Tween
 * - te => GameData
 * - u => Material
 * - U => AudioManager
 * - v => PhysicsSystem2D
 * - V => GameCtrl
 * - W => releaseType
 * - x => RigidBody2D
 * - X => UIConfigTable
 * - y => Button
 * - Y => PROP_TYPE
 * - z => EVENT_KEYS
 * - Z => RevivePanelView
 */
System.register("chunks:///_virtual/DuckController.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts","./Util.ts","./GameCtrl.ts","./AudioManager.ts","./Enum.ts","./EventManager.ts","./AdManager.ts","./ConfigTable.ts","./PropPanelView.ts","./RevivePanelView.ts","./Wood.ts","./Nail.ts","./GameData.ts","./TooYueManager.ts","./AdManager_ZJ.ts","./ReceivePanelView.ts","./AutoManager.ts"],(function(e){
var t,n,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R,L,x,D,G,E,O,H,V,U,z,W,j,J,Y,q,K,X,Q,Z,$,ee,te,ne,ie,oe,re,ae;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,o=e.initializerDefineProperty,r=e.assertThisInitialized,a=e.asyncToGenerator}
,function(e){
s=e.cclegacy,l=e._decorator,c=e.SpriteFrame,u=e.Material,d=e.v3,h=e.find,p=e.Label,f=e.tween,g=e.Sprite,m=e.Color,v=e.PhysicsSystem2D,y=e.Button,_=e.BoxCollider2D,b=e.instantiate,S=e.UIOpacity,C=e.UITransform,w=e.sp,N=e.ProgressBar,k=e.view,T=e.Tween,B=e.v2,A=e.Intersection2D,P=e.HingeJoint2D,M=e.director,I=e.Node,F=e.Camera,R=e.Vec3,L=e.Component,x=e.RigidBody2D,D=e.easing,G=e.PolygonCollider2D}
,function(e){
E=e.GameModel}
,function(e){
O=e.ResManager}
,function(e){
H=e.Util}
,function(e){
V=e.GameCtrl}
,function(e){
U=e.AudioManager}
,function(e){
z=e.EVENT_KEYS,W=e.releaseType,j=e.COLLIDER_TAG,J=e.PHY_GROUP,Y=e.PROP_TYPE}
,function(e){
q=e.default}
,function(e){
K=e.AdManager}
,function(e){
X=e.UIConfigTable}
,function(e){
Q=e.PropPanelView}
,function(e){
Z=e.RevivePanelView}
,function(e){
$=e.Wood}
,function(e){
ee=e.Nail}
,function(e){
te=e.GameData}
,function(e){
ne=e.TooYueManager}
,function(e){
ie=e.AdManager_ZJ,oe=e.TT_EVENT_KEYS}
,function(e){
re=e.ReceivePanelView}
,function(e){
ae=e.AutoManager}
],execute:function(){
var se,le,ce,ue,de,he,pe,fe,ge,me,ve,ye,_e,be,Se;
s._RF.push({
}
,"8d9175WDapMNqcRTBy9r5G7","DuckController",void 0);
var Ce=l.ccclass,we=l.property;
e("DuckController",(se=Ce("DuckController"),le=we([c]),ce=we([c]),ue=we([c]),de=we([c]),he=we([c]),pe=we(u),se((me=t((ge=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"bgSpr",me,r(t)),o(t,"wallRSpr",ve,r(t)),o(t,"wallLSpr",ye,r(t)),o(t,"aniBgSpr",_e,r(t)),o(t,"waterSpr",be,r(t)),o(t,"highlightMaterial",Se,r(t)),t.reportBtn=null,t.gameNode=null,t.uiNode=null,t.wallNode=null,t.woodNode=null,t.woodNodeTemp=null,t.propBlack=null,t.DuckAni=null,t.DuckShadow=null,t.CageAni=null,t.NailNode=null,t.ReviveNode=null,t.SetAniBg=null,t.GuideMask=null,t.snagNode=null,t.levelLabel=null,t.propBg=null,t.hand=null,t.hammer=null,t.reviveNum=1,t.prop1Num=3,t.prop2Num=3,t.prop3Num=3,t.prop4Num=3,t.woodScale=1.65,t.nailScale=1.25,t.popNum=0,t.woodArr=[],t.popArr=[],t.ydIndex=0,t.duckPos=d(0,0),t.maxLenGridNum=3,t.DeleteGridArr=[],t.adGridNodeArr=[],t.NoTouchNailNum=0,t.woodUpDiff=200,t.OpenRigidGroupArr=[],t.iceLayerArr=[],t.iceNailArr=[],t.firstTouch=!1,t.adShakeLock=!1,t.tscd=0,t.autoFindCd=4,t.autoTimer=0,t.rotationSpeed=10,t.checkOverNum=0,t.checkOverTimer=0,t.checkOverCd=.5,t.checkCanTouCd=.1,t.checkCanTouTimer=0,t.NoTouchITime=0,t.isTalking=!1,t.TalkFlag=!1,t.duckLzTime=0,t.DuckLzCd=.3,t.GyroscopeTimer=0,t.GyroscopeCd=10,t.isSetBtnShow=!1,t.maxWoodType=1,t.maxNailType=1,t.nailNum=1,t.oneLayerNum=1,t.maxWoodTypeArr=[23,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],t.maxNailTypeArr=[2],t.nailNumArr=[6],t.oneLayerNumArr=[3,4,4,4,4,4],t.PopSuccessTime=0,t.PopRecord=0,t.isShowADGridUI=!1,t.showAdGridFlag=!1,t.showAdGridITime=0,t.shoAdGridCd=2,t.woodForceFlag=!1,t.AdShakeMoveFlag=!1,t.TurnFlag1=!1,t.TurnFlag2=!1,t.TurnFlag3=!1,t}
n(t,e);
var s=t.prototype;
return s.onLoad=function(){
U.instance.playMusic("bgm/defaultGameplay",.5),this.initGame(),this.initNode(),this.setLevel(),this.setUI(),this.initDuckAndCageAni();
var e=this.getLevelInformation();
this.SubListener(),E.instance.duckLevelInformation=e,this.createWood(e)}
,s.SubListener=function(){
ne.isFromFeed&&(ie._ins.reportScene(),ie._ins.storeFeedData(),ie._ins.onFeedStatusChange(this.closeSubEmit)),ne._ins.judgeIsFromSubscribe(),this.openSubBack()}
,s.closeSubEmit=function(){
q.instance.emit(z.CLOSE_SUB_BACK)}
,s.start=function(){
this.WaterMove(),this.gmLabelUpdate()}
,s.gmLabelUpdate=function(){
var e=h("Canvas/uiNode/GameGuide");
(E.instance.releaseType==W.test_TEST||ne.userMsg&&ne.userMsg.userTags.includes("gm"))&&(e.active=!0,e.getComponent(p).string="首页-开始游戏")}
,s.update=function(e){
if(!V.instance.gameIsOver&&this.firstTouch){
if(this.duckLzCreate(e),this.LongTimeNoTouchEffect(e),this.gyroscopeTimer(e),this.showADGridTips(e),this.DuckConversationStart(e),this.tscd>0&&(this.tscd-=e,this.tscd<=0)){
var t=this.propBg.getChildByName("prop1Btn"),n=this.propBg.getChildByName("prop2Btn");
if(this.shakeShakeBtn(),1.15==t.scale.x||1.15==n.scale.x){
var i=[];
if(this.prop1Num>0&&i.push(0),this.prop2Num>0&&i.push(1),i.length>0){
var o=i[H.getRandomNum(0,i.length-1,!0)],r=[t,n],a=d(r[o].scale),s=.1;
f(r[o]).to(s,{
angle:-15}
).to(s,{
angle:0}
).to(s,{
angle:15}
).to(s,{
angle:0}
).to(s,{
angle:-15}
).to(s,{
angle:0}
).to(s,{
angle:15}
).to(s,{
angle:0}
).to(.2,{
scale:d(a.x+.1,a.y+.1,a.y+.1)}
).to(s,{
scale:a}
).start()}
}
}
E.isAuto&&(this.autoTimer+=e,this.autoTimer>=this.autoFindCd&&(this.autoTimer=0,this.autoFindCd=H.getRandomNum(1,3))),this.checkCanTouTimer<this.checkCanTouCd&&(this.checkCanTouTimer+=e,this.checkCanTouTimer>=this.checkCanTouCd&&(this.checkCanTouTimer=0,this.setNailColor()))}
}
,s.setNailColor=function(){
for(var e=0;
e<this.woodArr.length;
e++){
var t=this.woodArr[e];
if(t.isValid)for(var n=t.getComponent($).nailArr,i=0;
i<n.length;
i++){
var o=n[i];
if(o.isValid){
var r=o.getComponent(ee);
(this.checkCanTouch(o)||r.lc.active)&&(r.spr.getComponent(g).color=new m(255,255,255,255),r.grove.getComponent(g).color=new m(255,255,255,255))}
}
}
}
,s.initGame=function(){
var e=v.instance;
e.enable=!0,e.fixedTimeStep=.02,e.velocityIterations=4,e.positionIterations=4,E.runSceneName=E.instance.DuckSceneName,V.instance.canTouch=!1,V.instance.gameIsOver=!0,V.instance.btnCanTouch=!1}
,s.startGame=function(){
var e=this;
this.wallNode.active=!1,V.instance.gameIsOver=!1,V.instance.canTouch=!0,V.instance.btnCanTouch=!0,1!=E.instance.level&&U.instance.playSound("duckGame/duckQuack",.7),K.startGyroscope();
for(var t=0;
t<this.woodArr.length;
t++)this.woodArr[t].getComponent($).initNailAngle();
E.instance.failNum>0&&this.lockAdGirdProp(),1==E.instance.level?(this.GuideMask.active=!0,this.GuideMaskMove(),this.scheduleOnce((function(){
e.AutoTouch()}
),.95),this.GuideMask.setWorldPosition(this.woodArr[2].getComponent($).nailArr[0].getWorldPosition()),this.hand.active=!0,this.hand.setWorldPosition(this.woodArr[2].getComponent($).nailArr[0].getWorldPosition())):ae._ins.isAuto&&(ae._ins.start(),ae._ins.AutoGetNail())}
,s.initNode=function(){
this.gameNode=this.node.getChildByName("gameNode"),this.uiNode=this.node.getChildByName("uiNode"),this.wallNode=this.node.getChildByName("wallNode"),this.woodNode=this.gameNode.getChildByName("woodNode"),this.woodNodeTemp=this.gameNode.getChildByName("woodNodeTemp"),this.DuckAni=this.gameNode.getChildByName("DuckAni"),this.DuckShadow=this.gameNode.getChildByName("DuckShadow"),this.CageAni=this.gameNode.getChildByName("CageAni"),this.propBlack=this.node.getChildByName("propBlack"),this.NailNode=this.gameNode.getChildByName("nailNode"),this.levelLabel=this.uiNode.getChildByName("levelLabel").getComponent(p),this.propBg=this.uiNode.getChildByName("propBg"),this.hand=this.uiNode.getChildByName("hand"),this.hammer=this.uiNode.getChildByName("hammer"),this.SetAniBg=this.gameNode.getChildByName("SetAniBg"),this.ReviveNode=this.node.getChildByName("reviveNode");
var e=h("Canvas/realWall/adNode");
this.GuideMask=this.uiNode.getChildByName("GuideMask"),this.snagNode=this.gameNode.getChildByName("snagNode"),this.reportBtn=this.uiNode.getChildByName("reportBtn").getComponent(y),E.instance.releaseType==W.applet_ziJie&&ne._ins.isNeedReportStage||(this.reportBtn.node.active=!1);
for(var t=0;
t<2;
t++)this.adGridNodeArr.push(e.children[t]),e.children[t].getComponent(_).tag=j.REAL_WALL,0==t||1==E.instance.level?this.adGridNodeArr[t].children[0].active=!1:this.updateAdGridTip()}
,s.createSetBtn=function(){
var e=this;
1!=E.instance.level&&(this.isSetBtnShow||(this.isSetBtnShow=!0,O.instance.bundleLoad("uiBundle",X.setBtn.path,null,(function(t,n){
if(t)console.log(t);
else{
var i=b(n);
i.parent=e.node;
var o=i.getComponent(S),r=i.scale.x;
o.opacity=0,f(i).delay(0).call((function(){
o.opacity=255,i.setScale(0,0,0)}
)).to(.1,{
scale:d(r,r,r)}
).start()}
}
))))}
,s.initAdGrid=function(){
this.maxLenGridNum=3;
for(var e=0;
e<this.adGridNodeArr.length;
e++)this.adGridNodeArr[e].active=!0,this.adGridNodeArr[e].children[0].active=0!=e;
this.updateAdGridTip()}
,s.initAutoGrid=function(){
this.maxLenGridNum=5;
for(var e=0;
e<this.adGridNodeArr.length;
e++)this.adGridNodeArr[e].active=!1}
,s.setUI=function(){
this.createSetBtn(),this.initFirstLevel(),this.initDuckSkin(),this.initProgressBar(),this.DuckAni.y=0-.5*this.DuckAni.getComponent(C).height*this.DuckAni.scale.y+110+this.woodUpDiff,h("Canvas/gameNode/pigeon").setPosition(this.DuckAni.position.x,this.DuckAni.position.y+200),this.woodNode.setPosition(this.DuckAni.position.x,this.DuckAni.position.y+this.woodUpDiff),this.woodNodeTemp.setPosition(this.DuckAni.position.x,this.DuckAni.position.y+this.woodUpDiff);
var e=this.GetTypeNumber();
1==e?this.DuckAni.getComponent(w.Skeleton).animation="stay2":0==e&&(this.DuckAni.getComponent(w.Skeleton).animation="stay"),this.CageAni.layer=this.node.layer,this.CageAni.y=this.DuckAni.y+175,this.CageAni.setScale(1,1,1),this.CageAni.angle=0,this.CageAni.getComponent(S).opacity=255,this.duckPos=d(this.DuckAni.position.x,this.DuckAni.position.y,this.DuckAni.position.z),this.initAniBg(),this.DuckShadow.y=this.SetAniBg.y,1==E.instance.level?(h("Canvas/gameNode/pigeonNode").active=!1,this.CageAni.getComponent(S).opacity=0):(h("Canvas/gameNode/pigeonNode").active=!0,this.CageAni.getComponent(S).opacity=255),this.levelLabel.string=E.instance.level.toString();
var t=this.propBg.getChildByName("prop1Btn"),n=this.propBg.getChildByName("prop2Btn"),i=this.propBg.getChildByName("prop3Btn");
if(E.instance.freeProp1Num>0){
var o=t.children[0].getChildByName("redSpr");
o.active=!0,o.children[0].getComponent(p).string=E.instance.freeProp1Num.toString()}
if(E.instance.freeProp2Num>0){
var r=n.children[0].getChildByName("redSpr");
r.active=!0,r.children[0].getComponent(p).string=E.instance.freeProp2Num.toString()}
if(E.instance.freeProp3Num>0){
var a=i.children[0].getChildByName("redSpr");
a.active=!0,a.children[0].getComponent(p).string=E.instance.freeProp3Num.toString()}
}
,s.initProgressBar=function(){
var e=this.gameNode.getChildByName("ProgressBar");
e.getComponent(N).progress=0;
var t=e.getChildByName("LabelLayout").getChildByName("Label"),n=(e.getChildByName("DuckSpr"),e.getComponent(N).totalLength);
t.getComponent(p).string="0",t.parent.setPosition(-n/2,0)}
,s.initFirstLevel=function(){
if(1==E.instance.level){
var e=this.gameNode.getChildByName("ProgressBar");
this.propBg.active=!1,e.active=!1}
else{
var t=this.gameNode.getChildByName("ProgressBar");
this.propBg.active=!0,t.active=!0}
}
,s.initDuckSkin=function(){
var e=E.instance.level-1;
e>E.instance.MaxDuckTypeNum&&0==(e%=E.instance.MaxDuckTypeNum)&&(e=E.instance.MaxDuckTypeNum);
var t="y"+e.toString();
this.DuckAni.getComponent(w.Skeleton).setSkin(t)}
,s.initAniBg=function(){
this.SetAniBg.y=this.duckPos.y;
var e=k.getVisibleSize().height/2-this.SetAniBg.y;
this.SetAniBg.getComponent(C).height=e/(1-this.SetAniBg.getComponent(C).anchorY)}
,s.setLevel=function(){
ne._ins.startRecordVideo(),ne._ins.reportStage(E.instance.level,"start","",0),this.changeBgStyle(),this.tscd=0,this.autoTimer=0,this.checkOverNum=0,this.checkOverTimer=0,this.checkOverCd=.5,this.popNum=0,this.woodArr.length=0,this.popArr.length=0,this.NoTouchNailNum=0,this.OpenRigidGroupArr=[],this.NoTouchITime=0,this.TalkFlag=!1,this.PopRecord=0,this.PopSuccessTime=0,this.iceLayerArr=[],this.iceNailArr=[],this.woodNode.angle=0,this.TurnFlag1=!1,this.TurnFlag2=!1,this.TurnFlag3=!1,this.firstTouch=!1,this.isShowADGridUI=!1,E.instance.level>2&&(this.adShakeLock=!0,h("Canvas/uiNode/propBg/prop3Btn/adSpr").active=!0),te._ins.onload(),this.snagNodeShow(),this.maxNailTypeArr[E.instance.level-1]?this.maxNailType=this.maxNailTypeArr[E.instance.level-1]:te._ins.combinationFlag&&E.instance.level>5?this.maxNailType=12:te._ins.snagFlag&&E.instance.level>5?this.maxNailType=14:this.maxNailType=13,this.maxWoodTypeArr[E.instance.level-1]?this.maxWoodType=this.maxWoodTypeArr[E.instance.level-1]:this.maxWoodType=43,this.nailNumArr[E.instance.level-1]?this.nailNum=this.nailNumArr[E.instance.level-1]:(this.nailNum=182+10*(E.instance.level-this.nailNumArr.length),this.nailNum=234,this.nailNum>244&&(this.nailNum=244)),te._ins.snagFlag?this.nailNum+=20:te._ins.combinationFlag&&(this.nailNum-=20),this.oneLayerNumArr[E.instance.level-1]?this.oneLayerNum=this.oneLayerNumArr[E.instance.level-1]:this.oneLayerNum=4,console.log(this.maxNailType,this.nailNum,this.maxWoodType,this.maxNailType)}
,s.initDuckAndCageAni=function(){
this.CageAni.getComponent(w.Skeleton).setAnimation(0,"animation",!0),this.CageAni.getComponent(w.Skeleton).paused=!0,this.DuckAni.getComponent(w.Skeleton).paused=!0,this.CageAni.getChildByName("key").setPosition(200,-15),this.CageAni.getChildByName("key").getComponent(S).opacity=0}
,s.getLevelInformation=function(){
var e=E.instance.level,t=[];
if(null!=E.instance.duckLevelInformation)t=JSON.parse(JSON.stringify(E.instance.duckLevelInformation));
else{
var n=this.duckPos.y+.5*this.DuckAni.getComponent(C).height*this.DuckAni.scale.y,i=(O.instance.getJsonAsset("duckLevelTemplates").json,[]),o=.5*(this.nailNum-4);
1==e&&(o=.5*(this.nailNum-6)),i=this.initNailTypeArr(o),1==e?(i.unshift(1),i.unshift(1),i.unshift(1),i.unshift(1),i.push(3),i.push(3)):(i.unshift(1),i.unshift(1),i.unshift(2),i.unshift(2));
var r=1,a=0,s=0,l={
}
,c=0;
te._ins.snagFlag&&(c=50),t.push({
woodType:27,woodColor:1,woodX:0,woodY:n-100-50-20-c,woodAngle:40,woodGroupIndex:1,nailTypeArr:[i[0],i[1]]}
),t.push({
woodType:27,woodColor:2,woodX:0,woodY:n-100-50-20-c,woodAngle:-40,woodGroupIndex:2,nailTypeArr:[i[2],i[3]]}
),r=3,s=4,l[0]=1,l[1]=2,1==e&&(t.push({
woodType:27,woodColor:2,woodX:0,woodY:n-100-50-20,woodAngle:0,woodGroupIndex:3,nailTypeArr:[i[4],i[5]]}
),s=6);
var u=0;
for(te._ins.singleWoodTypeFlag&&(u=this.getRandWoodType()),te._ins.tidyFlag&&(u=this.getRandTidyType());
s<this.nailNum;
){
var d=H.getRandomNum(1,this.maxWoodType,!0);
if(24==d&&(d=26),14==d&&(d=15),19==d&&(d=18),25==d&&(d=26),te._ins.singleWoodTypeFlag||te._ins.tidyFlag?d=u:this.nailNum-s<7&&(d=H.getRandomNum(0,1,!0)?4:2),2==E.instance.level){
var h=[27,8];
d=h[H.getRandomNum(0,h.length,!0)]}
var p=this.getWoodHoleNum(d),f=this.nailNum-s;
if(f>=p){
if(!l[r]){
var g=l[r-1];
g||(g=0);
var m=g+1;
m>5&&(m=1),l[r]=m}
var v=l[r],y=H.getRandomNum(-150,150,!0),_=H.getRandomNum(-150,150,!0),b=H.getRandomNum(1,360,!0);
if(te._ins.tidyFlag){
var S=this.setTidyMode(r);
y=S.woodX,_=S.woodY,b=S.woodAngle}
t.push({
woodType:d,woodColor:v,woodX:y,woodY:_,woodAngle:b,woodGroupIndex:r,nailTypeArr:i.slice(s,s+p)}
)}
else{
for(var w=[],N=1;
N<=this.maxWoodType;
N++)this.getWoodHoleNum(N)<=f&&w.push(N);
if(w.length<=0&&w.push(E.woodHoleConfig[f][0]),H.shuffle(w),w.indexOf(4)>-1){
var k=w.indexOf(4),T=w[k];
w[k]=w[0],w[0]=T}
if(w.indexOf(2)>-1){
var B=w.indexOf(2),A=w[B];
w[B]=w[1],w[1]=A}
if(d=w[0],p=this.getWoodHoleNum(d),!l[r]){
var P=l[r-1];
P||(P=0);
var M=P+1;
M>5&&(M=1),l[r]=M}
var I=l[r];
t.push({
woodType:d,woodColor:I,woodX:H.getRandomNum(-150,150,!0),woodY:H.getRandomNum(-150,150,!0),woodAngle:H.getRandomNum(1,360,!0),woodGroupIndex:r,nailTypeArr:i.slice(s,s+p)}
)}
s+=p,++a>=this.oneLayerNum+this.diffForGroupIndex(r)&&(a=0,r++)}
}
for(var F=0;
F<t.length;
F++)this.NoTouchNailNum+=t[F].nailTypeArr.length;
return t}
,s.setTidyMode=function(e){
var t;
return this.getTidyLevelCount(E.instance.level)%2==0?(t={
woodX:0,woodY:0,woodAngle:0}
,e%2==0&&(t.woodAngle=90)):(t={
woodX:0,woodY:0,woodAngle:45}
,e%2==0&&(t.woodAngle=-45)),t}
,s.initNailTypeArr=function(e){
var t=.2,n=.3,i=.5;
return te._ins.snagFlag?(t=.2,n=.1,i=.7):2==E.instance.level?(t=.3,n=.4,i=.3):3==E.instance.level||4==E.instance.level?(t=.3,n=.3,i=.4):E.instance.level>2&&(t=.2,n=.2,i=.6),te._ins.snagFlag?this.createNailArr(e,i,n,t,14,9,6):te._ins.combinationFlag?this.createNailArr(e,i,n,t,12,9,6):2==E.instance.level?this.createNailArr(e,i,n,t,10,7,5):3==E.instance.level?this.createNailArr(e,i,n,t,11,8,6):4==E.instance.level?this.createNailArr(e,i,n,t,13,9,7):E.instance.level>2?this.createNailArr(e,i,n,t,14,10,7):this.createNailArr(e,i,n,t,13,9,6)}
,s.createNailArr=function(e,t,n,i,o,r,a){
for(var s=[],l=[],c=[],u=0;
u<e;
u++)if(u<e*t){
var d=this.maxNailType>o?o:this.maxNailType,h=(u+1)%d;
0==h&&(h=d),c.push(h),c.push(h)}
else if(u<e*(t+n)){
var p=this.maxNailType>r?r:this.maxNailType,f=(u+1)%p;
0==f&&(f=p),l.push(f),l.push(f)}
else if(u<e*(t+n+i)){
var g=this.maxNailType>a?a:this.maxNailType,m=(u+1)%g;
0==m&&(m=g),s.push(m),s.push(m)}
return H.shuffle(c),H.shuffle(l),H.shuffle(s),c.concat(l).concat(s)}
,s.diffForGroupIndex=function(e){
var t=0;
return e>18?t=5:e>15?t=4:e>13?t=3:e>11&&(t=1),2!=E.instance.level&&4!=E.instance.level||(e>18?t=5:e>15||e>13?t=4:e>6&&(t=1)),t}
,s.getWoodHoleNum=function(e){
for(var t=1;
t<7;
t++)if(E.woodHoleConfig[t].includes(e))return t}
,s.createWood=function(){
var e=a(i().mark((function e(t){
var n,o,r,a,s,l,c;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:if(n=this,this.wallNode.active=!0,o=0,r=d(this.DuckAni.scale),a=d(this.DuckShadow.scale),this.DuckAni.setScale(0,0,0),this.DuckShadow.setScale(0,0,0),this.DuckAni.setPosition(0,k.getVisibleSize().height/2+700),this.DuckAni.setScale(r.x,r.y,r.z),1==E.instance.level?(this.DuckAni.active=!1,h("Canvas/gameNode/pigeon").active=!0):(this.DuckAni.active=!0,h("Canvas/gameNode/pigeon").active=!1),this.DuckShadow.active=!0,f(this.DuckAni).delay(.65).by(.15,{
scale:d(.5*r.x,-.5*r.y)}
).by(.15,{
scale:d(-.6*r.x,.6*r.y)}
).by(.05,{
scale:d(.1*r.x,-.1*r.y)}
).start(),f(this.DuckAni).delay(.5).call((function(){
U.instance.playSound("sceneTransition/fruitGameReveal")}
)).to(.35,{
position:d(this.duckPos)}
,{
easing:D.quadOut}
).call((function(){
n.DuckAni.getComponent(w.Skeleton).paused=!1,n.DuckAni.getComponent(w.Skeleton).loop=!0,1==n.GetTypeNumber()?n.DuckAni.getComponent(w.Skeleton).animation="stay2":n.DuckAni.getComponent(w.Skeleton).animation="stay"}
)).start(),f(this.DuckShadow).delay(.5).to(.5,{
scale:a}
,{
easing:D.quadOut}
).start(),this.shakeCamera(),2!=E.instance.level&&E.instance.level%5!=0){
e.next=7;
break}
return s=null,e.next=7,O.instance.bundleLoad("DuckBundle","prefab/WarningUI",null,(function(e,t){
if(e)console.log(e);
else{
(s=b(t)).parent=n.uiNode;
var i=s.getChildByName("panel"),o=i.getChildByName("loading"),r=i.getChildByName("通关率"),a=i.getChildByName("spr");
a.children[0].active=!0,a.children[1].active=!1;
var l=Math.floor(E.instance.level/5),c=2-.13*l>0?2-.13*l:.05;
c=Math.floor(100*c)/100,r.getComponent(p).string="通关率不足"+c+"%",s.getComponent(S).opacity=0,f(s.getComponent(S)).to(.3,{
opacity:255}
).delay(2).to(.4,{
opacity:0}
).call((function(){
return[s.destroy()]}
)).start(),f(o).delay(.3).call((function(){
U.instance.playSound("ui/warningPrompt")}
)).by(10,{
position:d(3e3,0,0)}
).start(),f(a).delay(.3).to(.3,{
scale:d(1.1,1.1,1.1)}
).to(.3,{
scale:d(1,1,1)}
).to(.3,{
scale:d(1.1,1.1,1.1)}
).to(.3,{
scale:d(1,1,1)}
).to(.3,{
scale:d(1.1,1.1,1.1)}
).to(.3,{
scale:d(1,1,1)}
).start()}
}
));
case 7:l=i().mark((function(e){
var r,a,s,l;
return i().wrap((function(i){
for(;
;
)switch(i.prev=i.next){
case 0:r=t[e],a=r.woodType,s="prefab/wood/wood"+a.toString(),l=e,o+=r.nailTypeArr.length,n.scheduleOnce((function(){
O.instance.bundleLoad("DuckBundle",s,null,(function(i,o){
if(i)console.log(i);
else{
var s=b(o);
s.parent=n.woodNodeTemp;
var c=s.getComponent($);
c.initWood(a,r.woodGroupIndex,r.woodColor,r.nailTypeArr,l),s.setPosition(r.woodX,r.woodY),s.angle=r.woodAngle;
var u=s.getComponent(S);
u.opacity=0,s.setScale(n.woodScale,n.woodScale,n.woodScale);
var h=s.getComponent(x),p=.1,g=.5,m=.5,v=.5;
0==e?(g=1.3,p=0,m=.2,v=.1):1==e?(g=1.6,p=0,m=.2,v=.1):(g=2+.01*(e-2),p=0,m=.2,v=.1),2==E.instance.level&&(g+=.5),f(s).delay(g).call((function(){
if(u.opacity=255,s.setScale(0,0,0),0!=e&&1!=e||(s.getComponent(G).sensor=!0,s.setScale(3,3,3)),e===t.length-1){
n.woodNodeTemp.children.sort((function(e,t){
return e.getComponent($).siblingIndex-t.getComponent($).siblingIndex}
));
for(var i=n.woodNodeTemp.children.length,o=0;
o<i;
o++){
var r=n.woodNodeTemp.children[o];
n.woodArr.push(r)}
for(var a=0;
a<i;
a++){
var l=n.woodArr[a];
n.woodNode.addChild(l)}
}
}
)).to(m,{
scale:d(n.woodScale+p,n.woodScale+p,n.woodScale+p)}
).call((function(){
0==e?U.instance.playSound("duckGame/woodAssembleLead",1):1==e?U.instance.playSound("duckGame/woodAssembleFollow",1):e%4==0&&U.instance.playSound("duckGame/woodCollision",1)}
)).to(v,{
scale:d(n.woodScale,n.woodScale,n.woodScale)}
).call((function(){
0!=e&&1!=e||(s.getComponent(G).sensor=!1),c.addJoint(),h.gravityScale=20,c.CloseRigid(),e===t.length-1&&n.startGame()}
)).start()}
}
))}
),.1*r.woodGroupIndex);
case 2:case"end":return i.stop()}
}
),s)}
)),c=0;
case 8:if(!(c<t.length)){
e.next=13;
break}
return e.delegateYield(l(c),"t0",10);
case 10:c++,e.next=8;
break;
case 13:this.nailNum=o;
case 14:case"end":return e.stop()}
}
),e,this)}
)));
return function(t){
return e.apply(this,arguments)}
}
(),s.onTouchStart=function(e){
var t=this;
this.tscd=10,this.firstTouch=!0;
var n=e.getUILocation();
if(V.instance.canTouch&&!V.instance.gameIsOver){
var i=this.getTouchNail(n);
if(i){
if(this.GyroscopeTimer=0,this.wallNode.active&&(this.wallNode.active=!1),this.hand.active&&0==this.ydIndex){
if(0==this.ydIndex)return;
if(i!=this.woodArr[2].getComponent($).nailArr[0])return}
else if(this.hand.active&&1==this.ydIndex&&i!=this.woodArr[2].getComponent($).nailArr[0])return;
K.vibrate(),this.touchNail(i),this.NoTouchITime=0}
}
else if(V.instance.canTouchNail){
var o=this.getTouchNail(n);
if(o){
if(this.wallNode.active&&(this.wallNode.active=!1),!this.checkCanTouch(o))return U.instance.playSound("duckGame/errorPrompt",1),void H.sprShake(o.getComponent(ee).spr);
for(var r=0;
r<this.woodArr.length;
r++){
var a=this.woodArr[r];
a.isValid&&a.getComponent($).nailArr.forEach((function(e){
e.isValid&&(T.stopAllByTarget(e),e.setScale(t.nailScale,t.nailScale,t.nailScale),e.getComponent(ee).lc.active=!1)}
))}
this.nailPop(o)}
}
}
,s.AutoTouch=function(){
var e=this.woodArr[2].getComponent($).nailArr[0];
if(this.wallNode.active&&(this.wallNode.active=!1),this.hand.active&&0==this.ydIndex){
if(e!=this.woodArr[2].getComponent($).nailArr[0])return}
else if(this.hand.active&&1==this.ydIndex&&e!=this.woodArr[2].getComponent($).nailArr[0])return;
this.openRigid(e.parent),K.vibrate(),this.touchNail(e),this.NoTouchITime=0}
,s.onTouchMove=function(e){
V.instance.canTouch&&V.instance.gameIsOver}
,s.onTouchEnd=function(e){
V.instance.canTouch&&V.instance.gameIsOver}
,s.openRigid=function(e){
var t=e.getComponent($).groupIndex;
if(!this.OpenRigidGroupArr.includes(t)){
for(var n=0;
n<this.woodArr.length;
n++)this.woodArr[n].getComponent($).groupIndex==t&&this.woodArr[n].getComponent($).OpenRigid();
this.OpenRigidGroupArr.push(t)}
}
,s.getTouchNail=function(e){
for(var t=null,n=this.woodArr.slice().sort((function(e,t){
var n=e.getSiblingIndex();
return t.getSiblingIndex()-n}
)),i=0;
i<n.length;
i++){
for(var o=n[i].getComponent($).nailArr,r=0;
r<o.length;
r++){
var a=o[r],s=a.getComponent(ee);
if(s.canPop&&H.pointInCircle(e,B(s.spr.worldPosition.x,s.spr.worldPosition.y),Number((.5*a.getComponent(C).width*a.getWorldScale().x).toFixed(1)))){
t=a;
break}
}
if(null!=t)break}
return t}
,s.touchNail=function(e){
var t=e.getComponent(ee);
t.RigidNail.enabledContactListener=!0,V.instance.canTouch=!1;
var n=this.checkCanTouch(e);
return 0!=t.iceNum?(U.instance.playSound("duckGame/errorPrompt",1),H.sprShake(t.spr),void(V.instance.canTouch=!0)):n?(this.openRigid(e.parent),this.initShowADGridCd(),this.hand.active&&0==this.ydIndex?e===this.woodArr[2].getComponent($).nailArr[0]&&(this.ydIndex=1,this.hand.setWorldPosition(this.woodArr[2].getComponent($).nailArr[1].worldPosition),this.GuideMask.setWorldPosition(this.woodArr[2].getComponent($).nailArr[1].worldPosition)):this.hand.active&&1==this.ydIndex&&e===this.woodArr[2].getComponent($).nailArr[0]&&(this.ydIndex=2,this.hand.active=!1,this.GuideMask.active=!1,T.stopAllByTarget(this.GuideMask.getChildByName("spr"))),U.instance.playSound("duckGame/nailPop",.75),this.popArr.push(e),t.lc.active=!0,t.changeLayer(),this.popOneNail(e),H.setParent(e,h("Canvas/gameNode/nailNode")),t.dropFlag=!0,f(e).to(.1,{
worldPosition:d(t.spr.worldPosition.x,t.spr.worldPosition.y+30,0),scale:d(e.scale.x+.1,e.scale.y+.1)}
).call((function(){
V.instance.canTouch=!0}
)).to(.05,{
worldPosition:d(t.spr.worldPosition.x,t.spr.worldPosition.y+30+1,0)}
).call((function(){
t.openCollider(),t.lc.active=!1}
)).start(),e.angle=0,e.getComponent(ee).highLight.angle=0,t.breakLock(),f(t.spr).to(.1,{
angle:t.spr.angle+360}
).start(),void f(t.rod).by(.1,{
position:d(0,-10,0)}
).delay(.1).start()):(U.instance.playSound("duckGame/errorPrompt",1),H.sprShake(t.spr),V.instance.canTouch=!0,void f(t.spr.getComponent(g)).to(.1,{
color:m.RED}
).to(.1,{
color:m.WHITE}
).start())}
,s.checkCanTouch=function(e){
var t=!0;
if(!e.isValid)return!1;
if("w"!=e.parent.name[0])return!1;
for(var n=e.parent.getComponent($).groupIndex,i=B(e.getWorldPosition().x,e.getWorldPosition().y),o=Number((.5*e.getComponent(C).width*e.getWorldScale().x).toFixed(1)),r=0;
r<this.woodArr.length;
r++){
var a=this.woodArr[r];
if(a!==e.parent){
var s=a.getComponent($);
if(s.groupIndex>n){
for(var l=[],c=0;
c<s.polygonCollider.points.length;
c++){
var u=d(s.polygonCollider.points[c].x,s.polygonCollider.points[c].y,0),h=a.getComponent(C).convertToWorldSpaceAR(u);
l.push(B(h.x,h.y))}
if(A.polygonCircle(l,i,o)){
t=!1;
break}
}
}
}
return t}
,s.popOneNail=function(e){
var t=e.getComponent(ee),n=e.parent.getComponent($);
n.nailArr.splice(n.nailArr.indexOf(e),1),n.CheckNailInWood(),e.getComponent(P).enabled=!1,t.openColliderListener(),this.NoTouchNailNum--,16==this.NoTouchNailNum&&(this.TalkFlag||(this.TalkFlag=!0))}
,s.popDeleteNail=function(e){
var t=this;
this.popNum+=2,this.popNum>=this.nailNum&&(V.instance.gameIsOver=!0,V.instance.canTouch=!1),H.getRandomNum(-180,-100),H.getRandomNum(100,180),0==this.NoTouchNailNum&&!this.isNailNodeHasDropChildren()&&this.isGridDeleteHasChildren()&&this.OverEffect(!0),this.reduceIceCount();
for(var n=function(n){
var i=e[n],o=i.getComponent(ee),r=H.convetOtherNodeSpace(i,t.uiNode);
o.spr.getComponent(g).material=t.highlightMaterial;
var a=i.scale.x;
k.getVisibleSize().height,f(i).to(.06,{
scale:d(1.15*a,1.15*a,1.15*a)}
).to(.15,{
scale:d(0,0,0)}
).call((function(){
t.createPoint(r,o.type),t.node.worldPosition,1==n&&(t.progressMove(),t.PopComboRecord(!0),t.PopMusicSelect(),t.popNum>=t.nailNum&&t.scheduleOnce((function(){
t.successEffect()}
),.2))}
)).removeSelf().start()}
,i=0;
i<e.length;
i++)n(i)}
,s.PopComboRecord=function(e){
e?(this.PopSuccessTime+=1,this.PopRecord=0):!e&&this.PopRecord>=1?(this.PopSuccessTime=0,this.PopRecord=0):!e&&this.PopRecord<1&&(this.PopRecord+=1)}
,s.PopMusicSelect=function(){
var e=this.PopSuccessTime;
e>7&&(e=7);
var t="comboMusic/combo_"+e.toString();
U.instance.playSound(t,1)}
,s.pop=function(e,t){
var n=this;
void 0===t&&(t=!0),this.popNum+=2,this.popNum>=this.nailNum&&(V.instance.gameIsOver=!0,V.instance.canTouch=!1);
for(var i=function(i){
console.log("popNail",i,t);
var o=e[i],r=o.getComponent(ee);
if(r.isIceLock&&(r.iceNode.active=!1,n.iceNailArr.splice(n.iceNailArr.indexOf(o),1)),r.dropFlag||r.inGridFlag||n.NoTouchNailNum--,r.inGridFlag){
n.DeleteGridArr.splice(n.DeleteGridArr.indexOf(o),1);
for(var a=[],s=0;
s<n.DeleteGridArr.length;
s++)a.push(n.DeleteGridArr[s].name)}
else{
var l=o.parent,c=l.getComponent($);
c.nailArr.splice(c.nailArr.indexOf(o),1),n.openRigid(l)}
var u=H.convetOtherNodeSpace(o,n.uiNode);
r.spr.getComponent(g).material=n.highlightMaterial,H.setParent(o,h("Canvas/propDelete"));
var p=o.getChildByName("spr").scale.x;
r.breakLock(),f(o.getChildByName("spr")).to(.1,{
scale:d(1.1*p,1.1*p,1.1*p)}
).to(.1,{
scale:d(p,p,p)}
).to(.1,{
scale:d(1.1*p,1.1*p,1.1*p)}
).call((function(){
r.closeCollider(),n.createPoint(u,r.type),1==i&&t&&(console.log("play delete music"),n.progressMove(),n.PopComboRecord(!0),n.PopMusicSelect(),n.popNum>=n.nailNum&&n.scheduleOnce((function(){
n.successEffect()}
),.2)),o.destroy()}
)).start()}
,o=0;
o<e.length;
o++)i(o);
this.reduceIceCount()}
,s.createPoint=function(e,t){
var n=this,i=b(O.instance.getPrefab("deletePulseCircle"));
i.parent=this.uiNode,i.getComponent(g).color=H.getColorFromHex(E.colorArr[t-1]),i.setPosition(e),i.setScale(0,0,0),f(i).to(.2,{
scale:d(1.2,1.2,1.2)}
).delay(.05).removeSelf().start(),f(i.getComponent(S)).delay(.2).to(.05,{
opacity:0}
).start();
for(var o=function(){
var i=b(O.instance.getPrefab("colorMarkerParticle"));
i.parent=n.uiNode,E.nameArr1[t-1],i.getComponent(g).spriteFrame=O.instance.getSpriteFrame("colorMarker"+E.nameArr1[t-1]);
var o=H.getRandomNum(0,360,!0),r=H.degreesToVectors(o),a=H.getRandomNum(0,75,!0);
i.setPosition(e.x+r.x*a,e.y+r.y*a);
var s=H.getRandomNum(75,120,!0),l=d(i.x+s*r.x,i.y+s*r.y),c=s/100;
f(i).call((function(){
var e=H.getRandomNum(1.2,1.8);
i.setScale(e,e,e),i.getComponent(S).opacity=255}
)).parallel(f(i).to(c,{
position:l}
),f(i).to(c,{
scale:d(0,0,0)}
),f(i.getComponent(S)).to(c,{
opacity:0}
)).removeSelf().start(),f(i).by(1,{
angle:360*H.GetPositiveNegative()}
).start()}
,r=0;
r<7;
r++)o()}
,s.nailPop=function(e,t){
void 0===t&&(t=!0);
for(var n=e.getComponent(ee),i=[e],o=this.woodArr.length-1;
o>=0;
o--){
for(var r=this.woodArr[o].getComponent($).nailArr,a=0;
a<r.length;
a++){
var s=r[a];
if(s!==e){
var l=s.getComponent(ee);
if(n.type===l.type){
i.push(s);
break}
}
}
if(i.length>=2)break}
if(i.length>=2){
V.instance.canTouch=!0,V.instance.btnCanTouch=!0,V.instance.canTouchNail=!1,this.propBlack.getComponent(S).opacity=0;
for(var c=0;
c<i.length;
c++)i[c].getComponent(ee).lc.active=!0;
this.pop(i,t)}
}
,s.showAdGridCal=function(){
this.maxLenGridNum>=5||this.nailNum/2>this.popNum||this.isShowADGridUI||this.isNailNodeHasDropChildren()?this.initShowADGridCd():this.showAdGridFlag=!0}
,s.initShowADGridCd=function(){
this.showAdGridFlag=!1,this.showAdGridITime=0}
,s.showADGridTips=function(e){
5==this.maxLenGridNum||this.isShowADGridUI||this.DeleteGridArr.length!=this.maxLenGridNum||!V.instance.canTouch||!V.instance.btnCanTouch||this.popNum/this.nailNum>.5||(this.showAdGridITime+=e,this.showAdGridITime>=this.shoAdGridCd&&(this.showAdGridITime=0,this.isShowADGridUI=!0,this.lockAdGirdProp(1)))}
,s.successEffect=function(){
var e=this;
if(E.instance.duckLevelInformation=null,V.instance.gameIsOver=!0,V.instance.canTouch=!1,ie._ins.reportAnalyticsEvent(oe.FINISH_CASE,{
level:E.instance.level.toString()}
),ne._ins.reportStage(E.instance.level,"end","win",0),0==H.getRandomNum(0,1,!0))f(this.CageAni).delay(.1).call((function(){
U.instance.playSound("duckGame/cageBreak"),e.CageAni.getComponent(w.Skeleton).setAnimation(0,"animation",!1),e.CageAni.getComponent(w.Skeleton).paused=!1}
)).delay(1).call((function(){
e.gameSuccess()}
)).start();
else{
var t=H.getRandomNum(45,90);
this.CageAni.layer=this.uiNode.layer,f(this.CageAni).delay(.1).call((function(){
U.instance.playSound("duckGame/cageBreak")}
)).to(.2,{
scale:d(3,3),angle:t}
).delay(.2).call((function(){
U.instance.playSound("ui/victoryStinger")}
)).delay(.65).call((function(){
e.gameSuccess()}
)).start(),f(this.CageAni.getComponent(S)).delay(.1).to(.2,{
opacity:120}
).to(.02,{
opacity:0}
).start()}
}
,s.gameSuccess=function(){
var e=this;
K.stopGyroscope(),E.instance.failNum=0,O.instance.bundleLoad("uiBundle",X.SuccessUI.path,null,(function(t,n){
t?console.log(t):(b(n).parent=e.uiNode,e.DuckAni.active=!1,e.DuckShadow.active=!1)}
))}
,s.nextLevel=function(){
if(console.log("nextLevel1111"),this.woodNode.children.length>0)for(var e=0;
e<this.woodNode.children.length;
e++)this.woodNode.children[e].destroy();
this.initAdGrid(),E.isReplay=!1,this.prop1Num=3,this.prop2Num=3,this.prop3Num=3,this.prop4Num=3,this.reviveNum=1,this.showPropBtn("prop1"),this.showPropBtn("prop2"),this.showPropBtn("prop3"),this.setLevel(),this.setUI(),this.initDuckAndCageAni();
var t=this.getLevelInformation();
E.instance.duckLevelInformation=t,this.createWood(t)}
,s.checkOver=function(){
var e=!1;
if(this.prop1Num>0||this.prop2Num>0||this.prop3Num>0||V.instance.canTouchNail)return!1;
for(var t=[],n=0;
n<this.woodArr.length;
n++){
var i=this.woodArr[n];
if(i.isValid)for(var o=i.getComponent($).nailArr,r=0;
r<o.length;
r++){
var a=o[r];
a.isValid&&this.checkCanTouch(a)&&t.push(a)}
}
if(t.length<=1)e=!0;
else{
for(var s=!1,l=0;
l<t.length;
l++){
for(var c=t[l].getComponent(ee),u=l+1;
u<t.length;
u++){
var d=t[u].getComponent(ee);
if(c.type==d.type){
s=!0;
break}
}
if(s)break}
s||(e=!0)}
return e}
,s.OverEffect=function(e){
var t=this;
if(void 0===e&&(e=!1),!V.instance.gameIsOver){
V.instance.gameIsOver=!0,V.instance.canTouch=!1,ne._ins.reportStage(E.instance.level,"end","lose",0);
for(var n=function(){
var e=t.NailNode.children[i];
if(!e.isValid)return 1;
var n=e.getComponent(ee);
t.scheduleOnce((function(){
H.flashRed(n.spr),U.instance.playSound("ui/failurePrompt",.6)}
),.1)}
,i=0;
i<this.NailNode.children.length;
i++)n();
var o=null;
O.instance.bundleLoad("DuckBundle","prefab/FullNode",null,(function(n,i){
n?console.log(n):((o=b(i)).parent=t.node,o.getComponent(S).opacity=0,o.setPosition(h("Canvas/realWall/line").position),e?(o.getChildByName("无法消除").active=!0,o.getChildByName("槽位已满").active=!1):(o.getChildByName("槽位已满").active=!0,o.getChildByName("无法消除").active=!1),f(o.getComponent(S)).delay(.5).call((function(){
U.instance.playSound("fruitGame/slotFull")}
)).to(.3,{
opacity:255}
).delay(1.5).to(.3,{
opacity:0}
).call((function(){
o.destroy()}
)).start(),f(o).delay(.5).by(.3,{
position:d(0,600,0)}
).start())}
)),this.reviveNum>0?O.instance.bundleLoad("uiBundle",X.ReviveUI.path,null,(function(e,n){
e?console.log(e):t.scheduleOnce((function(){
var e=b(n);
e.parent=t.uiNode,e.getComponent(Z).setRevivePanel(t.reviveNum)}
),2)}
)):this.scheduleOnce((function(){
t.gameEnd()}
),2)}
}
,s.gameEnd=function(){
var e=this;
U.instance.stopMusic(),E.instance.failNum++,(E.instance.level>=1||E.instance.level2>=1||E.instance.level3>1)&&ne._ins.showInterstitialAd("失败"),K.stopGyroscope(),O.instance.bundleLoad("uiBundle",X.OverUI.path,null,(function(t,n){
t?console.log(t):b(n).parent=e.uiNode}
))}
,s.revive=function(){
this.reviveNum--;
for(var e=[],t=0;
t<this.NailNode.children.length;
t++)if(!this.DeleteGridArr.includes(this.NailNode.children[t])&&this.NailNode.children[t].isValid){
var n=this.NailNode.children[t];
e.push(n)}
else if(this.NailNode.children[t].getComponent(ee).lastJudgeFlag){
var i=this.NailNode.children[t];
e.push(i)}
this.DeleteGridArr.sort((function(e,t){
return e.position.y-t.position.y}
));
for(var o=0,r=this.DeleteGridArr.length-1;
r>=0&&(this.DeleteGridArr[r].getComponent(ee).lastJudgeFlag||(e.push(this.DeleteGridArr[r]),o++),2!=o);
r--);
for(var a=0;
a<e.length;
a++){
var s=e[a];
this.DeleteGridArr.includes(s)&&this.DeleteGridArr.splice(this.DeleteGridArr.indexOf(s),1)}
this.initReviveNail(e)}
,s.initReviveNail=function(e){
this.NoTouchNailNum+=e.length,this.CreateWoodInformation(e);
for(var t=0;
t<e.length;
t++){
var n=e[t].getComponent(ee);
n.lastJudgeFlag=!1,n.inGridFlag=!1,n.dropFlag=!1,n.closeRigid(),n.closeColliderListener(),H.setParent(e[t],this.ReviveNode)}
}
,s.CreateWoodInformation=function(e){
var t=[],n=[];
switch(e.length){
case 2:n=[2];
break;
case 3:n=[11];
break;
case 4:n=[2,2];
break;
case 5:n=[2,11];
break;
case 6:n=[11,11];
break;
case 7:n=[37,11];
break;
case 8:n=[37,37];
case 9:n=[42,37];
break;
case 10:n=[42,42]}
for(var i=[],o=0;
o<e.length;
o++){
var r=e[o].getComponent(ee);
i.push(r.type)}
for(var a=0,s=0;
s<n.length;
s++){
var l=[];
2==n[s]?(l.push(i[a]),l.push(i[a+1]),a+=2):11==n[s]?(l.push(i[a]),l.push(i[a+1]),l.push(i[a+2]),a+=3):(n[s]=37)?(l.push(i[a]),l.push(i[a+1]),l.push(i[a+2]),l.push(i[a+3]),a+=4):(n[s]=42)&&(l.push(i[a]),l.push(i[a+1]),l.push(i[a+2]),l.push(i[a+3]),l.push(i[a+4]),a+=5);
var c=d();
c=d(0==s?H.getRandomNum(-300,-200):H.getRandomNum(200,300),H.getRandomNum(0,100),0);
var u=H.getRandomNum(0,360),h={
woodType:n[s],woodColor:1,woodPos:c,woodAngle:u,woodGroupIndex:J.L29,nailTypeArr:l}
;
t.push(h)}
this.createReviveWood(t)}
,s.createReviveWood=function(e){
for(var t=this,n=[],i=[],o=function(o){
var r="prefab/wood/wood"+e[o].woodType.toString();
O.instance.bundleLoad("DuckBundle",r,null,(function(r,a){
if(r)console.log(r);
else{
var s=b(a),l=s.getComponent(x);
s.setParent(t.woodNode);
var c=s.getComponent($),u=s.getSiblingIndex();
c.initWood(e[o].woodType,e[o].woodGroupIndex,e[o].woodColor,e[o].nailTypeArr,u),s.setPosition(e[o].woodPos),s.angle=e[o].woodAngle;
for(var h=e[o].nailTypeArr.length,p=0;
p<h;
p++)i.push(s.angle);
s.setScale(t.woodScale,t.woodScale,t.woodScale),s.getComponent(S).opacity=0,c.addJoint(),l.gravityScale=20,t.woodArr.push(s),f(s).delay(.05).call((function(){
s.getComponent(S).opacity=255,s.setScale(3,3,3),c.ReviveInit(),o==e.length-1&&U.instance.playSound("duckGame/woodAssembleLead")}
)).to(.3,{
scale:d(t.woodScale,t.woodScale,t.woodScale)}
,{
easing:"backOut"}
).call((function(){
for(var r=c.nailArr,a=0;
a<r.length;
a++){
var s=H.convetOtherNodeSpace(r[a],t.ReviveNode);
n.push(s)}
o==e.length-1&&t.ReviveNailMove(n,i)}
)).start()}
}
))}
,r=0;
r<e.length;
r++)o(r)}
,s.ReviveNailMove=function(e,t){
for(var n=0;
n<this.ReviveNode.children.length;
n++){
var i=this.ReviveNode.children[n],o=e[n],r=i.scale.x;
f(i).delay(.1+.1*n).to(.2,{
position:o}
,{
easing:"sineIn"}
).to(.2,{
scale:d(r+.2,r+.2,r+.2)}
,{
easing:"sineIn"}
).call((function(){
U.instance.playSound("duckGame/woodAssembleFollow")}
)).to(.2,{
scale:d(r-.1,r-.1,r-.1)}
,{
easing:"backIn"}
).delay(.05).by(.5,{
angle:t[n]+720}
).call((function(){
V.instance.canTouch=!0,V.instance.gameIsOver=!1,V.instance.btnCanTouch=!0}
)).removeSelf().start()}
}
,s.replay=function(){
E.isReplay=!0,M.loadScene(E.instance.DuckSceneName)}
,s.lockAdGirdProp=function(e){
var t=this;
if(void 0===e&&(e=2),V.instance.btnCanTouch){
V.instance.btnCanTouch=!1,this.hideTsUI();
var n=3;
1==e&&(n=4),O.instance.bundleLoad("uiBundle",X.PropUI.path,null,(function(e,i){
if(e)return console.log(e),void(V.instance.btnCanTouch=!0);
var o=b(i);
o.parent=t.uiNode,o.getComponent(Q).setPanel(Number(n))}
))}
}
,s.onPropClick=function(e,t){
var n=this;
if(V.instance.btnCanTouch&&!V.instance.gameIsOver){
V.instance.btnCanTouch=!1,U.instance.playSound("ui/buttonClick"),this.hideTsUI();
var i=!1;
switch(Number(t)){
case Y.PROP1:if(E.instance.freeProp1Num>0){
i=!0,E.instance.freeProp1Num--;
var o=this.propBg.getChildByName("prop1Btn").children[0].getChildByName("redSpr");
o.children[0].getComponent(p).string=E.instance.freeProp1Num.toString(),E.instance.freeProp1Num<=0&&(o.active=!1)}
break;
case Y.PROP2:if(E.instance.freeProp2Num>0){
i=!0,E.instance.freeProp2Num--;
var r=this.propBg.getChildByName("prop2Btn").children[0].getChildByName("redSpr");
r.children[0].getComponent(p).string=E.instance.freeProp2Num.toString(),E.instance.freeProp2Num<=0&&(r.active=!1)}
break;
case Y.PROP3:if(E.instance.freeProp3Num>0){
i=!0,E.instance.freeProp3Num--;
var a=this.propBg.getChildByName("prop3Btn").children[0].getChildByName("redSpr");
a.children[0].getComponent(p).string=E.instance.freeProp3Num.toString(),E.instance.freeProp3Num<=0&&(a.active=!1)}
break;
case Y.PROP4:i=!1}
if(i)switch(V.instance.btnCanTouch=!0,Number(t)){
case Y.PROP1:this.prop1(i);
break;
case Y.PROP2:this.prop2(i);
break;
case Y.PROP3:this.prop3(i)}
else O.instance.bundleLoad("uiBundle",X.PropUI.path,null,(function(e,i){
if(e)return console.log(e),void(V.instance.btnCanTouch=!0);
var o=b(i);
o.parent=n.uiNode,o.getComponent(Q).setPanel(Number(t))}
))}
}
,s.hidePropBtn=function(e){
var t=this.propBg.getChildByName(e+"Btn");
t.getComponent(y).interactable=!1,t.getComponent(g).grayscale=!0}
,s.showPropBtn=function(e){
var t=this.propBg.getChildByName(e+"Btn");
t.getComponent(y).interactable=!0,t.getComponent(g).grayscale=!1}
,s.prop1=function(e){
void 0===e&&(e=!1),V.instance.btnCanTouch=!1,V.instance.canTouch=!1,e||this.prop1Num--,this.prop1Num<1&&this.hidePropBtn("prop1");
var t=!1;
this.nailNum-this.popNum==2&&(t=!0),this.propDeleteBack(t),this.propDeleteBack()}
,s.propDeleteBack=function(e){
if(void 0===e&&(e=!0),!(this.popNum>=this.nailNum))if(this.DeleteGridArr.length>0){
var t=this.getTopDeleteGridArr(),n=this.findSameTypeNail(t);
if(null==n)this.nailPop(t,e);
else{
var i=[t,n];
this.pop(i,e),V.instance.btnCanTouch=!0,V.instance.canTouch=!0}
}
else{
console.log("没有可消除的格子");
for(var o=this.woodArr[this.woodArr.length-1].getComponent($).nailArr[0],r=this.woodArr.length-1;
r>=0;
r--)if(this.woodArr[r].isValid&&this.woodArr[r].getComponent($).nailArr.length>0){
o=this.woodArr[r].getComponent($).nailArr[0];
break}
this.nailPop(o,e)}
}
,s.prop2=function(e){
var t=this;
void 0===e&&(e=!1),V.instance.btnCanTouch=!1,V.instance.canTouch=!1,e||this.prop2Num--,this.prop2Num<1&&this.hidePropBtn("prop2");
for(var n=[],i=[],o=0;
o<this.woodArr.length;
o++){
var r=this.woodArr[o];
r.isValid&&r.getComponent($).nailArr.forEach((function(e){
if(e.isValid){
var o=e.getComponent(ee);
i.push(o.type),t.checkCanTouch(e)?n.unshift(e):n.push(e)}
}
))}
if(H.sortArray(i),i.length>4){
for(var a=[],s=this.getGridNodeType(),l=4,c=s.length-1;
c>=0&&2!=l;
c--){
var u=s[c];
i.includes(u)&&(a.push(u),i.splice(i.indexOf(u),1),l--)}
for(var h=0;
h<l-1;
h++)a.push(i.shift());
H.shuffle(i),a.forEach((function(e){
i.unshift(e)}
))}
for(var p=function(e){
var o=n[e];
if(!o.isValid)return 1;
o.getComponent(ee).initNailAngle(),f(o).to(.2,{
scale:d(.4,.4,.4)}
).call((function(){
o.getComponent(ee).initNail(i[e],!0)}
)).to(.2,{
scale:d(t.nailScale,t.nailScale,t.nailScale)}
,{
easing:"backOut"}
).call((function(){
0===e&&(V.instance.canTouch=!0,V.instance.btnCanTouch=!0)}
)).start()}
,g=0;
g<n.length;
g++)p(g)}
,s.ShakeBtnBack=function(){
var e=this;
!V.instance.gameIsOver&&V.instance.canTouch&&V.instance.btnCanTouch&&(U.instance.playSound("ui/buttonClick"),this.adShakeLock?(ie._ins.reportAnalyticsEvent("Shake"),ne._ins.showVideoAd("解锁点击摇摇",(function(){
return e.prop3()}
))):this.prop3())}
,s.prop3=function(e){
void 0===e&&(e=!1),h("Canvas/uiNode/propBg/prop3Btn/adSpr").active=!1,this.adShakeLock=!1,e||this.prop3Num--;
var t=0==H.getRandomNum(0,1,!0)?1:-1,n=H.getRandomNum(5,7);
this.woodAddLinerVelocity(t*n,0)}
,s.prop4=function(e){
console.log("解锁全部木板"),this.finishVideoToAdGrid(),this.finishVideoToAdGrid(),V.instance.canTouch=!0,V.instance.btnCanTouch=!0}
,s.prop5=function(e){
console.log("解锁单个木板"),this.finishVideoToAdGrid(),V.instance.canTouch=!0,V.instance.btnCanTouch=!0}
,s.adGridBack=function(){
var e=this;
V.instance.canTouch&&!V.instance.gameIsOver&&1!=E.instance.level&&(K.vibrate(),V.instance.canTouch=!1,V.instance.btnCanTouch=!1,E.instance.btnChangeShareNum<ne._ins.shareTimesDay?ne._ins.shareApp(!1,null,(function(){

E.instance.btnChangeShareNum+=1,e.finishVideoToAdGrid()}
),(function(){
V.instance.canTouch=!0,V.instance.btnCanTouch=!0}
)):ne._ins.showVideoAd("解锁单个格子道具",(function(t){
e.finishVideoToAdGrid()}
),(function(){
V.instance.btnCanTouch=!0,V.instance.canTouch=!0}
)))}
,s.finishVideoToAdGrid=function(){
3==this.maxLenGridNum?(this.adGridNodeArr[1].active=!1,this.maxLenGridNum++,this.adGridNodeArr[0].children[0].active=!0):4==this.maxLenGridNum&&(this.adGridNodeArr[0].active=!1,this.maxLenGridNum++),this.updateAdGridTip(),V.instance.btnCanTouch=!0,V.instance.canTouch=!0}
,s.updateAdGridTip=function(){
E.instance.btnChangeShareNum<ne._ins.shareTimesDay?this.adGridNodeArr.forEach((function(e){
e.children[0].children[0].active=!1,e.children[0].children[1].active=!0}
)):this.adGridNodeArr.forEach((function(e){
e.children[0].children[0].active=!0,e.children[0].children[1].active=!1}
))}
,s.getTopDeleteGridArr=function(){
for(var e=this.DeleteGridArr[0],t=1;
t<this.DeleteGridArr.length;
t++)this.DeleteGridArr[t].getPosition().y>e.getPosition().y&&(e=this.DeleteGridArr[t]);
return e}
,s.findSameTypeNail=function(e){
for(var t=null,n=0;
n<this.DeleteGridArr.length;
n++)this.DeleteGridArr[n].getComponent(ee).type==e.getComponent(ee).type&&this.DeleteGridArr[n]!=e&&(t=this.DeleteGridArr[n]);
return t}
,s.showIceNumShow=function(){
}
,s.reduceIceCount=function(){
if(te._ins.iceNailFlag)for(var e=0;
e<this.iceNailArr.length;
e++){
var t=this.iceNailArr[e];
t.getComponent(ee).isIceLock&&this.checkCanTouch(t)&&t.getComponent(ee).updateIceNum()}
}
,s.getGridNodeType=function(){
for(var e=[],t=0;
t<this.DeleteGridArr.length;
t++){
var n=this.DeleteGridArr[t].getComponent(ee).type;
e.push(n)}
return e}
,s.judgeNullLose=function(){
0!=this.NoTouchNailNum||this.isNailNodeHasDropChildren()||this.OverEffect(!0)}
,s.isNailNodeHasDropChildren=function(){
for(var e=0;
e<this.NailNode.children.length;
e++)if(this.NailNode.children[e].getComponent(ee).dropFlag)return!0;
return!1}
,s.isGridDeleteHasChildren=function(){
return this.DeleteGridArr.length>0}
,s.sortGridSibling=function(){
this.DeleteGridArr.forEach((function(e,t){
e.setSiblingIndex(t)}
))}
,s.hideTsUI=function(){
this.tscd=10;
for(var e=[this.propBg.getChildByName("prop1Btn"),this.propBg.getChildByName("prop2Btn")],t=0;
t<e.length;
t++)T.stopAllByTarget(e[t]),e[t].scale=d(E.instance.propScale,E.instance.propScale,E.instance.propScale),e[t].angle=0}
,s.GuideMaskMove=function(){
var e=this.GuideMask.getChildByName("spr"),t=d(e.scale.x,e.scale.y,e.scale.z);
e.setScale(5,5,5);
var n=e.getChildByName("sprBlack");
n.getComponent(S).opacity=0,T.stopAllByTarget(e),f(e).to(.3,{
scale:t}
).call((function(){
f(e).to(.5,{
scale:d(t.x+.4,t.y+.4,t.z)}
).to(.5,{
scale:d(t.x,t.y,t.z)}
).union().repeatForever().start()}
)).start(),f(n.getComponent(S)).to(.3,{
opacity:100}
).start()}
,s.woodAddLinerVelocity=function(e,t){
this.woodForceFlag=!0;
var n=10*Math.abs(e)*(e/Math.abs(e));
this.woodArr.forEach((function(e){
e.getComponent($).pushLinearVelocity(n,0)}
))}
,s.woodAddForce=function(e,t){
this.woodForceFlag||this.woodArr.forEach((function(t){
t.getComponent($).pushForce(300*e,0)}
))}
,s.WaterMove=function(){
for(var e=h("Canvas/waterNode"),t=e.getChildByName("water0"),n=e.getChildByName("water1"),i=function(){
var e=t.children[o],n=e.getComponent(C).width;
0==o?f(e).to(20,{
position:d(n,0)}
).call((function(){
e.setPosition(d(-n,0))}
)).to(20,{
position:d(0,0)}
).union().repeatForever().start():f(e).to(20,{
position:d(0,0)}
).to(20,{
position:d(n,0)}
).call((function(){
e.setPosition(d(-n,0))}
)).union().repeatForever().start()}
,o=0;
o<t.children.length;
o++)i();
for(var r=function(){
var e=n.children[a],t=e.getComponent(C).width;
0==a?f(e).to(13,{
position:d(t,0)}
).call((function(){
e.setPosition(d(-t,0))}
)).to(13,{
position:d(0,0)}
).union().repeatForever().start():f(e).to(13,{
position:d(0,0)}
).to(13,{
position:d(t,0)}
).call((function(){
e.setPosition(d(-t,0))}
)).union().repeatForever().start()}
,a=0;
a<n.children.length;
a++)r()}
,s.LongTimeNoTouchEffect=function(e){
this.isTalking||this.TalkFlag||!V.instance.canTouch||V.instance.gameIsOver||!V.instance.btnCanTouch||1!=E.instance.level&&(this.NoTouchITime+=e,this.NoTouchITime>=8&&(this.NoTouchITime=0,this.TalkFlag=!0,this.DuckConversationStart(e)))}
,s.progressMove=function(){
var e=(this.popNum,this.nailNum),t=this.gameNode.getChildByName("ProgressBar"),n=t.getChildByName("LabelLayout").getChildByName("Label"),i=(t.getChildByName("DuckSpr"),t.getComponent(N).totalLength),o=-i/2+i*(e=H.fakeProgressSmooth(this.popNum,this.nailNum));
f(t.getComponent(N)).to(.1,{
progress:e}
).start(),f(n.getComponent(p)).to(.1,{
string:Math.floor(100*e)}
).start(),f(n.parent).to(.1,{
position:d(o,0)}
).start()}
,s.DuckConversationStart=function(e){
if(1!=E.instance.level&&this.TalkFlag){
var t=this.DuckAni.getComponent(w.Skeleton).getState().getCurrent(0).trackTime%this.DuckAni.getComponent(w.Skeleton).getState().getCurrent(0).animation.duration;
t>=.5&&t<=.55&&(this.isTalking=!0,this.TalkFlag=!1,this.BubbleShow())}
}
,s.BubbleShow=function(){
var e=this,t=this.DuckAni.getChildByName("Bubble"),n=t.getChildByName("Label");
t.setScale(0,0),t.active=!0;
var i=H.getRandomNum(0,E.duckTalkLabelArr.length-1,!0);
n.getComponent(p).string=E.duckTalkLabelArr[i],f(t).to(.5,{
scale:d(.9,.9)}
,{
easing:"backOut"}
).call((function(){
U.instance.playSound("duckGame/duckQuack",.7)}
)).to(.25,{
scale:d(1,1)}
).to(.25,{
scale:d(.8,.8)}
).to(.25,{
scale:d(1,1)}
).to(.25,{
scale:d(.8,.8)}
).to(.25,{
scale:d(1,1)}
).to(.25,{
scale:d(.8,.8)}
).to(.25,{
scale:d(1,1)}
).to(.25,{
scale:d(.8,.8)}
).to(.5,{
scale:d(0,0)}
,{
easing:"backIn"}
).call((function(){
t.active=!1,e.isTalking=!1}
)).start()}
,s.duckLzCreate=function(e){
this.duckLzTime+=e,this.duckLzTime>this.DuckLzCd&&(this.duckLzTime=0,this.DuckLzCd=H.getRandomNum(.1,.3),H.FlyLzMove(h("Canvas/gameNode/ProgressBar/DuckSpr/光圈")))}
,s.gyroscopeTimer=function(e){
var t=this;
V.instance.canTouch&&!V.instance.gameIsOver&&V.instance.btnCanTouch&&1!=E.instance.isShowGyroscopeTip&&1!=E.instance.level&&(this.GyroscopeTimer+=e,this.GyroscopeTimer>this.GyroscopeCd&&(E.instance.isShowGyroscopeTip=1,this.GyroscopeTimer=0,O.instance.bundleLoad("DuckBundle","prefab/GyroscopeTip",null,(function(e,n){
if(e)console.error(e);
else{
var i=b(n);
console.log(i.getChildByName("gyroscope").getComponent(w.Skeleton));
var o=i.getChildByName("black");
i.parent=t.node,i.setPosition(d(0,0,0)),i.getComponent(S).opacity=0,i.getChildByName("gyroscope").getComponent(w.Skeleton).setSkin("w1"),i.getChildByName("gyroscope").getComponent(w.Skeleton).setAnimation(0,"animation",!0),f(i.getComponent(S)).to(.3,{
opacity:255}
).delay(2).call((function(){
o.on(I.EventType.TOUCH_END,(function(){
o.off(I.EventType.TOUCH_END),i.destroy()}
))}
)).start()}
}
))))}
,s.shakeCamera=function(){
if(1!=E.instance.level){
var e=h("Canvas/mainCamera").getComponent(F);
f(e.node).delay(.8).to(.05,{
position:new R(-10,-10,e.node.z)}
).to(.05,{
position:new R(10,10,e.node.z)}
).to(.05,{
position:new R(-10,-10,e.node.z)}
).to(.05,{
position:new R(10,10,e.node.z)}
).to(.05,{
position:new R(0,0,e.node.z)}
).start()}
}
,s.adGridShakeMove=function(){
var e=this;
if(!this.AdShakeMoveFlag&&(this.AdShakeMoveFlag=!0,this.DeleteGridArr.length>=this.maxLenGridNum-1))for(var t=0;
t<this.adGridNodeArr.length;
t++){
var n=this.adGridNodeArr[t].getChildByName("tip");
f(n).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:0}
).delay(.2).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:0}
).delay(.2).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:0}
).delay(.2).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:10}
).to(.2,{
angle:-10}
).to(.1,{
angle:0}
).call((function(){
e.AdShakeMoveFlag=!1}
)).start()}
}
,s.openSubBack=function(){
var e=this;
ne.isFromFeed&&!ie._ins.isShowSubGuide&&(console.log("openSubBack进入获客sub"),O.instance.bundleLoad("aniBundle","prefab/SubBg",null,(function(t,n){
if(t)console.error(t);
else{
var i=b(n);
i.parent=e.uiNode,i.setPosition(0,0),i.getChildByName("black").on(I.EventType.TOUCH_END,e.closeSubBack,e),1==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(console.log("openSubBack进入获客普通"),i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1,i.active=!1):2==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(console.log("openSubBack进入获客女小三"),i.getChildByName("Sub1").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1,i.getChildByName("Sub6").active=!1,i.getChildByName("Sub2").getComponent(w.Skeleton).setSkin("s1")):3==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(console.log("openSubBack进入获客男小三"),i.getChildByName("Sub1").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1,i.getChildByName("Sub2").getComponent(w.Skeleton).setSkin("s2")):4==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(console.log("openSubBack进入获客套鹅"),i.getChildByName("Sub1").active=!1,i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!0,i.getChildByName("Sub5").active=!1,i.getChildByName("Sub6").active=!1):5==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(i.getChildByName("Sub1").active=!1,i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!0,i.getChildByName("Sub6").active=!1):6==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(i.getChildByName("Sub1").active=!1,i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1,i.getChildByName("Sub6").active=!0,e.sub6Move(i.getChildByName("Sub6").getChildByName("colorBg")),U.instance.playMusic("bgm/pureColor",.5)):ne.isFromSubscribe?(i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1,i.getChildByName("Sub6").active=!1,e.hand.setPosition(0,0),e.hand.active=!0):(i.getChildByName("Sub2").active=!1,i.getChildByName("Sub4").active=!1,i.getChildByName("Sub5").active=!1)}
}
)))}
,s.sub6Move=function(e){
var t=e.getChildByName("colorSpr");
f(t.getComponent(g)).to(2,{
color:new m(H.getColorFromHex(E.colorBg[0]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[1]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[2]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[3]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[4]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[5]))}
,{
easing:"expoOut"}
).to(2,{
color:new m(H.getColorFromHex(E.colorBg[6]))}
,{
easing:"expoOut"}
).union().repeatForever().start();
var n=e.getChildByName("danceDuck"),i=n.position.y;
f(n).to(.75,{
position:d(100,i,0)}
).to(.01,{
scale:d(-1,1,1)}
).to(1.5,{
position:d(-100,i,0)}
).to(.02,{
scale:d(1,1,1)}
).to(.75,{
position:d(0,i,0)}
).union().repeatForever().start()}
,s.closeSubBack=function(){
if(this.uiNode.getChildByName("SubBg").getChildByName("black").off(I.EventType.TOUCH_END,this.closeSubBack,this),console.log("close"),!ie._ins.isShowSubGuide){
if(2==ne._ins.judgeIsFromWhichFeedOrSubscribe()||3==ne._ins.judgeIsFromWhichFeedOrSubscribe()){
var e=this.uiNode.getChildByName("SubBg").getChildByName("Sub2");
e.getComponent(w.Skeleton).loop=!1,e.getComponent(w.Skeleton).setAnimation(0,"hit2",!1),e.getComponent(w.Skeleton).setEventListener((function(e,t){
"mu"==t.data.name&&U.instance.playSound("ui/applause")}
)),e.getComponent(w.Skeleton).setCompleteListener((function(){
e.parent.destroy()}
))}
else 6==ne._ins.judgeIsFromWhichFeedOrSubscribe()?(U.instance.playMusic("bgm/defaultGameplay",.5),this.uiNode.getChildByName("SubBg").destroy()):ne.isFromSubscribe?(this.hand.active=!1,this.uiNode.getChildByName("SubBg").destroy()):this.uiNode.getChildByName("SubBg").destroy();
ie._ins.isShowSubGuide=!0}
}
,s.showShareLose=function(){
O.instance.bundleLoad("uiBundle","prefab/share_lose",null,(function(e,t){
if(e)console.log(e);
else{
var n=b(t);
n.parent=h("Canvas"),n.setPosition(0,0),n.setScale(R.ZERO),f(n).to(.2,{
scale:R.ONE}
).start(),f(n).to(.6,{
position:d(0,100,0)}
).removeSelf().start()}
}
))}
,s.shakeShakeBtn=function(){
var e=h("Canvas/uiNode/propBg/prop3Btn/propSpr");
f(e).to(.1,{
angle:-10}
).to(.2,{
angle:10}
).to(.1,{
angle:0}
).delay(.1).to(.1,{
angle:-10}
).to(.2,{
angle:10}
).to(.1,{
angle:0}
).delay(.1).to(.1,{
angle:-10}
).to(.2,{
angle:10}
).to(.1,{
angle:0}
).delay(.1).start()}
,s.isSingleWoodTypeLevel=function(e){
return 8==e||18==e||e>21&&(e-21)%10==7}
,s.getSingleWoodTypeCount=function(e){
for(var t=0,n=1;
n<=e;
n++)this.isSingleWoodTypeLevel(n)&&t++;
return t}
,s.getRandWoodType=function(){
var e=E.instance.level,t=this.getSingleWoodTypeCount(e),n=this.maxWoodType,i=[];
if([2,8,4,5,6,9,12,13,15,16,17,18,27].forEach((function(e){
e<=n&&i.push(e)}
)),i.length>0){
var o=(t-1)%i.length;
return i[o]}
return 2}
,s.isTidyLevel=function(e){
var t=!1;
return(9==e||13==e||18==e||e>21&&((e-21)%10==2||(e-21)%10==8))&&(t=!0),t}
,s.getTidyLevelCount=function(e){
for(var t=0,n=1;
n<=e;
n++)this.isTidyLevel(n)&&t++;
return t}
,s.getRandTidyType=function(){
var e=[2,2,4,4,9,9,27,27],t=E.instance.level;
return e[(this.getTidyLevelCount(t)-1)%e.length]}
,s.snagNodeShow=function(){
if(this.snagNode.getChildByName("snagType2").setPosition(0,this.duckPos.y),!te._ins.snagFlag)return this.woodUpDiff=100,void(this.snagNode.active=!1);
this.woodUpDiff=150,this.snagNode.active=!0;
var e=E.instance.level,t=0;
5==e||15==e||e>21&&(e-21)%10==4?t=1:(10==e||20==e||e>21&&(e-21)%10==9)&&(t=2),this.snagNode.children[t-1].active=!0;
for(var n=0;
n<this.snagNode.children.length;
n++)n!=t-1&&(this.snagNode.children[n].active=!1)}
,s.changeWoodNodeAngle=function(){
te._ins.rotateFlag&&(this.popNum/this.nailNum>.75&&!this.TurnFlag3?(console.log("cccccc"),this.TurnFlag3=!0,V.instance.canTouch=!1,f(this.woodNode).to(1,{
angle:360}
).call((function(){
V.instance.canTouch=!0}
)).start()):this.popNum/this.nailNum>.5&&!this.TurnFlag2?(console.log("bbbbb"),this.TurnFlag2=!0,V.instance.canTouch=!1,f(this.woodNode).to(1,{
angle:240}
).call((function(){
V.instance.canTouch=!0}
)).start()):this.popNum/this.nailNum>.25&&!this.TurnFlag1&&(this.TurnFlag1=!0,V.instance.canTouch=!1,f(this.woodNode).to(1,{
angle:120}
).call((function(){
V.instance.canTouch=!0}
)).start()),console.log("this.popNum",this.popNum/this.nailNum))}
,s.changeBgStyle=function(){
var e=this,t=this.node.getChildByName("realWall").getChildByName("wallL"),n=this.node.getChildByName("realWall").getChildByName("wallR"),i=this.node.getChildByName("bg"),o=this.gameNode.getChildByName("SetAniBg"),r=this.isShowSpecialBg();
console.log("randNum",r),-1==r&&(r=5),i.getComponent(g).spriteFrame=this.bgSpr[r],t.getComponent(g).spriteFrame=this.wallLSpr[r],n.getComponent(g).spriteFrame=this.wallRSpr[r],o.getComponent(g).spriteFrame=this.aniBgSpr[r];
var a=h("Canvas/waterNode"),s=a.getChildByName("water0"),l=a.getChildByName("water1");
1==r?(s.children.forEach((function(t){
t.getComponent(g).spriteFrame=e.waterSpr[2]}
)),l.children.forEach((function(t){
t.getComponent(g).spriteFrame=e.waterSpr[3]}
))):(s.children.forEach((function(t){
t.getComponent(g).spriteFrame=e.waterSpr[0]}
)),l.children.forEach((function(t){
t.getComponent(g).spriteFrame=e.waterSpr[1]}
)))}
,s.isShowSpecialBg=function(){
var e=E.instance.level,t=-1;
return e>2&&(e-2)%10==1?t=1:e>2&&(e-2)%10==3?t=2:e>2&&(e-2)%10==5?t=0:e>2&&(e-2)%10==7?t=3:e>2&&(e-2)%10==9&&(t=4),t}
,s.onEnable=function(){
this.registerEvents()}
,s.onDisable=function(){
this.unregisterEvents()}
,s.onDestroy=function(){
}
,s.registerEvents=function(){
this.node.on(I.EventType.TOUCH_START,this.onTouchStart,this),q.instance.on(z.REVIVE,this.revive,this),q.instance.on(z.GAME_END,this.gameEnd,this),q.instance.on(z.REPLAY,this.replay,this),q.instance.on(z.NEXT_LEVEL,this.nextLevel,this),q.instance.on(z.PROP1,this.prop1,this),q.instance.on(z.PROP2,this.prop2,this),q.instance.on(z.PROP3,this.prop3,this),q.instance.on(z.PROP4,this.prop4,this),q.instance.on(z.PROP5,this.prop5,this),q.instance.on(z.HIDETSUI,this.hideTsUI,this),q.instance.on(z.TOUCH_NAIL,this.touchNail,this),q.instance.on(z.CLOSE_SUB_BACK,this.closeSubBack,this),q.instance.on(z.SIDE_REWARD,this.showSideBar,this),q.instance.on(z.SHOW_SHARE_LOSE,this.showShareLose,this),this.reportBtn.node.on(y.EventType.CLICK,this.reportBtnClick,this)}
,s.unregisterEvents=function(){
this.node.off(I.EventType.TOUCH_START,this.onTouchStart,this),q.instance.off(z.REVIVE,this.revive,this),q.instance.off(z.GAME_END,this.gameEnd,this),q.instance.off(z.REPLAY,this.replay,this),q.instance.off(z.NEXT_LEVEL,this.nextLevel,this),q.instance.off(z.PROP1,this.prop1,this),q.instance.off(z.PROP2,this.prop2,this),q.instance.off(z.PROP3,this.prop3,this),q.instance.off(z.PROP4,this.prop4,this),q.instance.off(z.PROP5,this.prop5,this),q.instance.off(z.HIDETSUI,this.hideTsUI,this),q.instance.off(z.TOUCH_NAIL,this.touchNail,this),q.instance.off(z.CLOSE_SUB_BACK,this.closeSubBack,this),q.instance.off(z.SIDE_REWARD,this.showSideBar,this),q.instance.off(z.SHOW_SHARE_LOSE,this.showShareLose,this),this.reportBtn.node.off(y.EventType.CLICK,this.reportBtnClick,this)}
,s.reportBtnClick=function(){
var e=this;
U.instance.playSound("ui/buttonClick"),O.instance.bundleLoad("uiBundle",X.ReportPanel.path,null,(function(t,n){
t?console.log(t):b(n).parent=e.node}
))}
,s.showSideBar=function(){
E.instance.releaseType==W.applet_ziJie&&E.instance.receiveSideBarGriftNum<=0&&E.instance.receiveSideBarGriftNum<=0&&E.SideState.isFromSideBar&&this.showReceivePanel()}
,s.showReceivePanel=function(){
console.log("showReceivePanel11111"),E.instance.receiveSideBarGriftNum+=1,O.instance.bundleLoad("uiBundle",X.ReceiveUI.path,null,(function(e,t){
if(e)console.log(e);
else{
var n=b(t);
n.parent=h("Canvas"),n.getComponent(re).setPanel(0)}
}
))}
,s.GetTypeNumber=function(){
var e=0;
return E.instance.level<102?e=0:E.instance.level<202?e=1:E.instance.level<302?e=0:E.instance.level<402?e=1:E.instance.level<502?e=0:E.instance.level<602?e=1:E.instance.level<702&&(e=0),e}
,t}
(L)).prototype,"bgSpr",[le],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),ve=t(ge.prototype,"wallRSpr",[ce],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),ye=t(ge.prototype,"wallLSpr",[ue],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),_e=t(ge.prototype,"aniBgSpr",[de],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),be=t(ge.prototype,"waterSpr",[he],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),Se=t(ge.prototype,"highlightMaterial",[pe],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),fe=ge))||fe)),s._RF.pop()}
}
}
))
