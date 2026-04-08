/**
 * Restored module: chunks:///_virtual/GameModel2.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => view
 * - i => cclegacy
 * - n => createClass
 * - o => _decorator
 * - r => sys
 * - s => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/GameModel2.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts"],(function(e){
var t,n,i,o,r,a,s;
return{
setters:[function(e){
t=e.inheritsLoose,n=e.createClass}
,function(e){
i=e.cclegacy,o=e._decorator,r=e.sys,a=e.view}
,function(e){
s=e.default}
],execute:function(){
var l,c;
i._RF.push({
}
,"5c818682bdIJbq/mSEJ6sxJ","GameModel",void 0);
var u=o.ccclass;
o.property,e("GameModel",u("GameModel")(((c=function(e){
function i(){
var t;
return(t=e.call(this)||this).GameName="JiuJiuWoYa_Pro",t.HomeSceneName="HomeScene",t.DuckSceneName="DuckScene",t.PigeonSceneName="PigeonScene",t.Game2SceneName="Game2Scene",t.CowSceneName="CowScene",t.MathSceneName="MathScene",t.FruitSceneName="FruitScene",t.isFromLoad=!1,t.releaseType=void 0,t.MaxDuckTypeNum=100,t.shareNeedArr=[1,3,5,7,8,9],t.shareRewardPropCountArr=[3,3,3,4,5,6],t.shareRepeatNeedNum=10,t.shareRepeatRewardCount=10,t.propScale=1.15,t._level=null,t._level2=null,t._level3=null,t._playNum=null,t._lastLoginTime=null,t._musicFlag=null,t._soundFlag=null,t._vibrateFlag=null,t._freeProp1Num=null,t._freeProp2Num=null,t._freeProp3Num=null,t._receiveAddTableGiftNum=0,t._receiveSideBarGriftNum=0,t._showSideBarNum=0,t._currentLevelPlayNum=0,t._addTableBtnClickNum=0,t._addProgramBtnClickNum=0,t._shareSuccessNum=0,t._btnChangeShareNum=0,t._isShowSubscribeUI=0,t._pigeonName=null,t._duckName=null,t._shareLevel=0,t._collectArr=[],t._pigeonNumArr=[],t._failNum=0,t._failNum_Game2=0,t._failNum_Game3=0,t._isAlreadyFeed=0,t._isAlreadyFollow=0,t._isShowGyroscope=0,t._isShowGyroscope_Game2=0,t._duckLevelInformation=null,t._pigeonLevel=0,t._userPowerCanAddMaxNum=5e4,t._userPowerAddTime=18e5,t._userPowerNum=5e4,t._lastAddPowerTime=0,t._watchAdGetPowerNum=5e4,t.promoteLevelArr=[],t._pigeonGameTouched=0,t._cowGameTouched=0,t._mathGameTouched=0,console.log("constructor gameModel"),t}
t(i,e);
var o=i.prototype;
return o.addPowerNum=function(){
i.instance.userPowerNum+=i.instance.watchAdGetPowerNum,i.instance.userPowerNum>i.instance.userPowerCanAddMaxNum&&(i.instance.userPowerNum=i.instance.userPowerCanAddMaxNum)}
,o.subPowerNum=function(){
var e=Math.max(0,i.instance.userPowerNum-1);
i.instance.userPowerNum=e,49999==i.instance.userPowerNum&&(i.instance.lastAddPowerTime=Date.now())}
,o.getShareNeedByStage=function(e){
return e<=0?0:e<=this.shareNeedArr.length?this.shareNeedArr[e-1]:this.shareRepeatNeedNum}
,o.getShareTotalNeedByLevel=function(e){
for(var t=Math.max(0,Math.floor(e)),n=0,i=Math.min(t,this.shareNeedArr.length),o=0;
o<i;
o++)n+=this.shareNeedArr[o];
return t>this.shareNeedArr.length&&(n+=(t-this.shareNeedArr.length)*this.shareRepeatNeedNum),n}
,o.getShareLevelByInviteCount=function(e){
for(var t=Math.max(0,Math.floor(Number(e)||0)),n=0,i=0;
i<this.shareNeedArr.length;
i++){
if(t<this.shareNeedArr[i])return n;
t-=this.shareNeedArr[i],n=i+1}
return t>=this.shareRepeatNeedNum&&(n+=Math.floor(t/this.shareRepeatNeedNum)),n}
,o.getShareRewardConfig=function(e){
var t=Math.max(1,Math.floor(e)),n=t<=this.shareSkinRewardStageCount?i.SanGuoNameArr[t-1]:null,o=t<=this.shareRewardPropCountArr.length?this.shareRewardPropCountArr[t-1]:this.shareRepeatRewardCount;
return{
stage:t,inviteNeed:this.getShareNeedByStage(t),duckName:n,propRewardCount:o}
}
,o.getShareStageProgress=function(e,t){
void 0===t&&(t=i.instance.shareLevel);
var n=Math.max(0,Math.floor(Number(e)||0)),o=Math.max(0,Math.floor(Number(t)||0)),r=this.getShareLevelByInviteCount(n),a=o+1,s=this.getShareRewardConfig(a),l=this.getShareTotalNeedByLevel(o),c=Math.min(Math.max(0,n-l),s.inviteNeed);
return{
reachedLevel:r,claimedLevel:o,currentStage:a,currentInviteNum:c,remainingInviteNum:Math.max(0,s.inviteNeed-c),canClaimReward:r>o,rewardConfig:s}
}
,o.getSprIndex=function(e){
var t=i.instance.promoteLevelArr;
if(e<=0)return 1;
for(var n=0;
n<t.length;
n++)if(e<=t[n])return n+1;
return t.length+1}
,o.getAniIndex=function(){
var e=i.instance,t=e.level,n=e.promoteLevelArr;
if(t<0)return 1;
for(var o=0;
o<n.length;
o++)if(t<n[o])return o+1;
return n.length+1}
,o.initGameModel=function(e){
console.log("init gameModel"),this.releaseType=e,this._level=this.loadFromLocal("gameLevel",1),this._level2=this.loadFromLocal("gameLevel2",1),this._level3=this.loadFromLocal("gameLevel3",1),this._lastLoginTime=this.loadFromLocal("lastLoginTime",0),this._playNum=this.loadFromLocal("playNum",0),this._musicFlag=this.loadFromLocal("musicFlag",1),this._soundFlag=this.loadFromLocal("soundFlag",1),this._vibrateFlag=this.loadFromLocal("vibrateFlag",1),this._freeProp1Num=this.loadFromLocal("freeProp1Num",0),this._freeProp2Num=this.loadFromLocal("freeProp2Num",0),this._freeProp3Num=this.loadFromLocal("freeProp3Num",0),this._receiveAddTableGiftNum=this.loadFromLocal("receiveAddTableGiftNum",0),this._receiveSideBarGriftNum=this.loadFromLocal("receiveSideBarGriftNum",0),this._showSideBarNum=this.loadFromLocal("showSideBarNum",0),this._currentLevelPlayNum=this.loadFromLocal("currentLevelPlayNum",0),this._addTableBtnClickNum=this.loadFromLocal("addTableBtnClickNum",0),this._addProgramBtnClickNum=this.loadFromLocal("addProgramBtnClickNum",0),this._shareSuccessNum=this.loadFromLocal("shareSuccessNum",0),this._btnChangeShareNum=this.loadFromLocal("btnChangeShareNum",1),this._userPowerNum=this.loadFromLocal("userPowerNum",this.userPowerCanAddMaxNum),this._lastAddPowerTime=this.loadFromLocal("lastAddPowerTime",0),this._duckLevelInformation=this.loadFromLocal("duckLevelInformation",null),this._collectArr=this.loadFromLocal("collectArr",[]),this._pigeonNumArr=this.loadFromLocal("pigeonNumArr",[2]),this.failNum=this.loadFromLocal("failNum",0),this.failNum_Game2=this.loadFromLocal("failNum_Game2",0),this._isShowSubscribeUI=this.loadFromLocal("isShowSubscribeUI",0),this._isAlreadyFeed=this.loadFromLocal("isAlreadyFeed",0),this._isAlreadyFollow=this.loadFromLocal("isAlreadyFollow",0),this._isShowGyroscope=this.loadFromLocal("isShowGyroscopeTip",0),this._isShowGyroscope_Game2=this.loadFromLocal("isShowGyroscopeTip_Game2",0),this._pigeonLevel=this.loadFromLocal("pigeonLevel",1),this._pigeonName=this.loadFromLocal("pigeonName","鸽子"),this._duckName=this.loadFromLocal("duckName",null),this._pigeonGameTouched=this.loadFromLocal("pigeonGameTouched",0),this._cowGameTouched=this.loadFromLocal("cowGameTouched",0),this._mathGameTouched=this.loadFromLocal("mathGameTouched",0),this._shareLevel=this.loadFromLocal("shareLevel",0);
for(var t=1;
t<101;
t++)this.promoteLevelArr.push(t);
var n=i.instance.pigeonNumArr;
if(0==n.length&&n.push(2),n.length<i.PigeonTotalNum)for(var o=i.PigeonTotalNum-n.length,r=0;
r<o;
r++)console.log(i.instance.pigeonNumArr),n.push(0);
i.instance.pigeonNumArr=n}
,o.loadFromLocal=function(e,t){
void 0===t&&(t=null);
var n=this.getStorageKey(e),i=r.localStorage.getItem(n);
if(null===i||""===i)return r.localStorage.setItem(n,JSON.stringify(t)),null===t&&console.log("没有存储默认值,默认值现在为null: "+e),t;
try{
return JSON.parse(i)}
catch(i){
return console.error("解析存储数据失败: "+e,i),r.localStorage.setItem(n,JSON.stringify(t)),t}
}
,o.saveToLocal=function(e,t){
var n=this.getStorageKey(e);
r.localStorage.setItem(n,JSON.stringify(t))}
,o.getStorageKey=function(e){
return this.GameName+"_"+e}
,n(i,[{
key:"level",get:function(){
return this._level}
,set:function(e){
this._level=e,this.saveToLocal("gameLevel",this._level)}
}
,{
key:"level2",get:function(){
return this._level2}
,set:function(e){
this._level2=e,this.saveToLocal("gameLevel2",this._level2)}
}
,{
key:"level3",get:function(){
return this._level3}
,set:function(e){
this._level3=e,this.saveToLocal("gameLevel3",this._level3)}
}
,{
key:"playNum",get:function(){
return this._playNum}
,set:function(e){
this._playNum=e,this.saveToLocal("playNum",this._playNum)}
}
,{
key:"lastLoginTime",get:function(){
return this._lastLoginTime}
,set:function(e){
this._lastLoginTime=e,this.saveToLocal("lastLoginTime",this._lastLoginTime)}
}
,{
key:"musicFlag",get:function(){
return this._musicFlag}
,set:function(e){
this._musicFlag=e,this.saveToLocal("musicFlag",this._musicFlag)}
}
,{
key:"soundFlag",get:function(){
return this._soundFlag}
,set:function(e){
this._soundFlag=e,this.saveToLocal("soundFlag",this._soundFlag)}
}
,{
key:"vibrateFlag",get:function(){
return this._vibrateFlag}
,set:function(e){
this._vibrateFlag=e,this.saveToLocal("vibrateFlag",this._vibrateFlag)}
}
,{
key:"screenWidth",get:function(){
return a.getVisibleSize().width}
}
,{
key:"screenHeight",get:function(){
return a.getVisibleSize().height}
}
,{
key:"gameScaleH",get:function(){
var e=this.screenHeight/1280;
return e>=1?1:e}
}
,{
key:"freeProp1Num",get:function(){
return this._freeProp1Num}
,set:function(e){
this._freeProp1Num=e,this.saveToLocal("freeProp1Num",e)}
}
,{
key:"freeProp2Num",get:function(){
return this._freeProp2Num}
,set:function(e){
this._freeProp2Num=e,this.saveToLocal("freeProp2Num",e)}
}
,{
key:"freeProp3Num",get:function(){
return this._freeProp3Num}
,set:function(e){
this._freeProp3Num=e,this.saveToLocal("freeProp3Num",e)}
}
,{
key:"receiveAddTableGiftNum",get:function(){
return this._receiveAddTableGiftNum}
,set:function(e){
this._receiveAddTableGiftNum=e,this.saveToLocal("receiveAddTableGiftNum",e)}
}
,{
key:"receiveSideBarGriftNum",get:function(){
return this._receiveSideBarGriftNum}
,set:function(e){
this._receiveSideBarGriftNum=e,this.saveToLocal("receiveSideBarGriftNum",e)}
}
,{
key:"showSideBarNum",get:function(){
return this._showSideBarNum}
,set:function(e){
this._showSideBarNum=e,this.saveToLocal("showSideBarNum",e)}
}
,{
key:"currentLevelPlayNum",get:function(){
return this._currentLevelPlayNum}
,set:function(e){
this._currentLevelPlayNum=e,this.saveToLocal("currentLevelPlayNum",e)}
}
,{
key:"addTableBtnClickNum",get:function(){
return this._addTableBtnClickNum}
,set:function(e){
this._addTableBtnClickNum=e,this.saveToLocal("addTableBtnClickNum",e)}
}
,{
key:"addProgramBtnClickNum",get:function(){
return this._addProgramBtnClickNum}
,set:function(e){
this._addProgramBtnClickNum=e,this.saveToLocal("addProgramBtnClickNum",e)}
}
,{
key:"shareSuccessNum",get:function(){
return this._shareSuccessNum}
,set:function(e){
this._shareSuccessNum=e,this.saveToLocal("shareSuccessNum",e)}
}
,{
key:"btnChangeShareNum",get:function(){
return this._btnChangeShareNum}
,set:function(e){
this._btnChangeShareNum=e,this.saveToLocal("btnChangeShareNum",e)}
}
,{
key:"userPowerNum",get:function(){
return this._userPowerNum}
,set:function(e){
this._userPowerNum=e,this.saveToLocal("userPowerNum",e)}
}
,{
key:"lastAddPowerTime",get:function(){
return this._lastAddPowerTime}
,set:function(e){
this._lastAddPowerTime=e,this.saveToLocal("lastAddPowerTime",e)}
}
,{
key:"isShowSubscribeUI",get:function(){
return this._isShowSubscribeUI}
,set:function(e){
this._isShowSubscribeUI=e,this.saveToLocal("isShowSubscribeUI",e)}
}
,{
key:"collectArr",get:function(){
return this._collectArr}
,set:function(e){
this._collectArr=e,this.saveToLocal("collectArr",e)}
}
,{
key:"pigeonNumArr",get:function(){
return this._pigeonNumArr}
,set:function(e){
this._pigeonNumArr=e,this.saveToLocal("pigeonNumArr",e)}
}
,{
key:"failNum",get:function(){
return this._failNum}
,set:function(e){
this._failNum=e,this.saveToLocal("failNum",e)}
}
,{
key:"failNum_Game2",get:function(){
return this._failNum_Game2}
,set:function(e){
this._failNum_Game2=e,this.saveToLocal("failNum_Game2",e)}
}
,{
key:"failNum_Game3",get:function(){
return this._failNum_Game3}
,set:function(e){
this._failNum_Game3=e,this.saveToLocal("failNum_Game3",e)}
}
,{
key:"userPowerCanAddMaxNum",get:function(){
return this._userPowerCanAddMaxNum}
}
,{
key:"userPowerAddTime",get:function(){
return this._userPowerAddTime}
}
,{
key:"watchAdGetPowerNum",get:function(){
return this._watchAdGetPowerNum}
}
,{
key:"isAlreadyFeed",get:function(){
return this._isAlreadyFeed}
,set:function(e){
this._isAlreadyFeed=e,this.saveToLocal("isAlreadyFeed",e)}
}
,{
key:"isAlreadyFollow",get:function(){
return this._isAlreadyFollow}
,set:function(e){
this._isAlreadyFollow=e,this.saveToLocal("isAlreadyFollow",e)}
}
,{
key:"isShowGyroscopeTip",get:function(){
return this._isShowGyroscope}
,set:function(e){
this._isShowGyroscope=e,this.saveToLocal("isShowGyroscopeTip",e)}
}
,{
key:"isShowGyroscopeTip_Game2",get:function(){
return this._isShowGyroscope_Game2}
,set:function(e){
this._isShowGyroscope_Game2=e,this.saveToLocal("isShowGyroscopeTip_Game2",e)}
}
,{
key:"pigeonLevel",get:function(){
return this._pigeonLevel}
,set:function(e){
this._pigeonLevel=e,this.saveToLocal("pigeonLevel",e)}
}
,{
key:"duckName",get:function(){
return this._duckName}
,set:function(e){
this._duckName=e,this.saveToLocal("duckName",e)}
}
,{
key:"pigeonName",get:function(){
return this._pigeonName}
,set:function(e){
this._pigeonName=e,this.saveToLocal("pigeonName",e)}
}
,{
key:"pigeonGameTouched",get:function(){
return this._pigeonGameTouched}
,set:function(e){
this._pigeonGameTouched=e,this.saveToLocal("pigeonGameTouched",e)}
}
,{
key:"shareLevel",get:function(){
return this._shareLevel}
,set:function(e){
this._shareLevel=e,this.saveToLocal("shareLevel",e)}
}
,{
key:"cowGameTouched",get:function(){
return this._cowGameTouched}
,set:function(e){
this._cowGameTouched=e,this.saveToLocal("cowGameTouched",e)}
}
,{
key:"mathGameTouched",get:function(){
return this._mathGameTouched}
,set:function(e){
this._mathGameTouched=e,this.saveToLocal("mathGameTouched",e)}
}
,{
key:"duckLevelInformation",get:function(){
return this._duckLevelInformation}
,set:function(e){
this._duckLevelInformation=e,this.saveToLocal("duckLevelInformation",e)}
}
,{
key:"shareSkinRewardStageCount",get:function(){
return Math.min(this.shareNeedArr.length,this.shareRewardPropCountArr.length,i.SanGuoNameArr.length)}
}
],[{
key:"SanGuoBookNum",get:function(){
return i.SanGuoNameArr.length}
}
,{
key:"instance",get:function(){
return e.getInstance.call(this)}
}
]),i}
(s)).GameId="",c.isAuto=!1,c.isReplay=!1,c.runSceneName="",c.userDeviceType=null,c.SideState=null,c.AddDesktopState=null,c.isZJ_PC=!1,c.PigeonTotalNum=10,c.SpecialBookNum=6,c.FruitDuckBookNum=6,c.DaWeiWangBookNum=1,c.bgNum=null,c.LockAllDuck=!1,c.woodHoleConfig={
1:[1,3,7,10,21],2:[2,4,5,6,8,9,12,13,14,15,16,7,18,19,20,22,27],3:[11,23,24,25,26,28,29,30,31,32,33],4:[34,35,36,37,38,39,40],5:[41,42],6:[43]}
,c.nameArr=["bai","cheng","cl","hong","huang","hui","ml","qing","sf","sl","zi","zong"],c.nameArr1=["1","4","3","7","2","5","6","8","9","10","11","12","13","14"],c.nameArr2=["1","2","3","4","5","6","7","8","9","10","11","12","13","14"],c.colorArr=["#fc0000","#9dfd49","#fecb00","#9e00f8","#fb8500","#00f8c6","#0080f8","#ff61c2","#578a15","#d8fef6","#505367","#89461c","#b800a9","#ffe787ff"],c.colorArr2=["#fc0000","#fb8500","#fecb00","#9dfd49","#00f8c6","#0080f8","#9e00f8","#ff61c2","#578a15","#d8fef6","#505367","#89461c","#b800a9","#ffe787ff"],c.woodColorArr=["grayWood","lightWood","redWood","brownWood","goldWood"],c.singleColorArr=["grayWood","lightWood","yellowWood","redWood"],c.duckTalkLabelArr=["你倒是快点啊","催不动了","别墨迹！","加速！加速！","太慢了！","急死个鸭","慢出天际了","我等的花儿都谢了","搞快点！","救救我鸭！","磨啥呢？","等的我脚都麻了","等麻了！","手机摇起来！"],c.pigeonSkinName=["pigeon","chicken","color","easter","frutti","peacock","pink_pigeon"],c.colorBg=["#ff0000","#ff6600","#ffde00","#36ff00","#00ffc6","#0042ff","#cc00ff"],c.cockNameArr=["鹅鸭","北京烤鸭","菜鸭","蛋鸭","鸽鸭","肘黑鸭","鸭你太美","非主流鸭","牛马鸭","唐僧鸭","悟空鸭","八戒鸭","沙僧鸭","木乃伊鸭","彩虹鸭","西瓜鸭","金鸭","打工鸭","企鹅鸭","掉毛鸭","香蕉鸭","牛鸭","樱木鸭","东北鸭","纸片鸭","爱你鸭","麻将鸭","兔子鸭","警察鸭","长颈鹿鸭","鸳鸯鸭","武侠鸭","香菜鸭","鸡腿鸭","大厨鸭","困鸭","土豪鸭","鸡鸭","涂鸭","祝福鸭","野人鸭","没戏鸭","学生鸭","贼鸭","盐水鸭","旅游鸭","恐龙鸭","嗨鸭","冲鸭","星空鸭","圣诞鸭","蓝精灵鸭","奶茶鸭","木头鸭","僵尸鸭","跆拳道鸭","环卫鸭","蜜蜂鸭","老虎鸭","大葱鸭","仙人掌鸭","奶牛鸭","黑白鸭","愤怒鸭","海绵鸭","派大鸭","玉石鸭","翡翠鸭","灰太鸭","懒鸭鸭","光头鸭","火龙果鸭","茄子鸭","幽灵鸭","水晶鸭","可乐鸭","赛亚鸭","魔人布鸭","比克鸭","青春鸭","猪猪鸭","线条鸭","印度鸭","老鹰鸭","李小鸭","运动鸭","游泳鸭","超人鸭","一拳超鸭","蜡笔小鸭","魔法鸭","痞老鸭","皮卡鸭","水手鸭","时尚鸭","小丑鸭","魔鬼鸭","黑手鸭","红色风暴鸭","蓝色妖姬鸭","鹅鹅","北京烤鹅","菜鹅","蛋鹅","鸽鹅","肘黑鹅","鹅你太美","非主流鹅","牛马鹅","唐僧鹅","悟空鹅","八戒鹅","沙僧鹅","木乃伊鹅","彩虹鹅","西瓜鹅","金鹅","打工鹅","企鹅鹅","掉毛鹅","香蕉鹅","牛鹅","樱木鹅","东北鹅","纸片鹅","爱你鹅","麻将鹅","兔子鹅","警察鹅","长颈鹿鹅","鸳鸯鹅","武侠鹅","香菜鹅","鸡腿鹅","大厨鹅","困鹅","土豪鹅","鸡鹅","涂鹅","祝福鹅","野人鹅","没戏鹅","学生鹅","贼鹅","盐水鹅","旅游鹅","恐龙鹅","嗨鹅","冲鹅","星空鹅","圣诞鹅","蓝精灵鹅","奶茶鹅","木头鹅","僵尸鹅","跆拳道鹅","环卫鹅","蜜蜂鹅","老虎鹅","大葱鹅","仙人掌鹅","奶牛鹅","黑白鹅","愤怒鹅","海绵鹅","派大鹅","玉石鹅","翡翠鹅","灰太鹅","懒鹅","光头鹅","火龙果鹅","茄子鹅","幽灵鹅","水晶鹅","可乐鹅","赛亚鹅","魔人布鹅","比克鹅","青春鹅","猪猪鹅","线条鹅","印度鹅","老鹰鹅","李小鹅","运动鹅","游泳鹅","超人鹅","一拳超鹅","蜡笔小鸭","魔法鹅","痞老鸭","皮卡鹅","水手鹅","时尚鹅","小丑鹅","魔鬼鹅","黑手鹅","红色风暴鹅","蓝色妖姬鹅"],c.PigeonNameArr=["鸽子","红火鸡","五彩鸡","小黄鸡","黑土鸡","绿孔雀","粉白鸽","我的刀盾","比比拉布","屠夫"],c.SpecialNameArr=["百鹅朝凤","百鸭朝龙","百鹅朝麟","百鸭朝雀","百鹅朝鹏","百鸭朝鲲"],c.FruitNameArr=["西瓜鸭","火龙果鸭","葡萄鸭","蓝莓鸭","苹果鸭","哈密瓜鸭"],c.DaWeiWangNameArr=["大胃袋鸭"],c.SanGuoNameArr=["甄嬛鸭","华妃鸭","安陵容鸭","刘备鸭","关羽鸭","张飞鸭"],l=c))||l),i._RF.pop()}
}
}
))
