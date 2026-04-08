/**
 * Semantic view: chunks:///_virtual/AudioManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => _decorator
 * - c => AudioSource
 * - d => ResManager
 * - h => default
 * - l => director
 * - n => createClass
 * - o => asyncToGenerator
 * - p => AdManager
 * - r => cclegacy
 * - s => Node
 * - t => inheritsLoose
 * - u => GameModel
 */
/**
 * Restored module: chunks:///_virtual/AudioManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => AudioSource
 * - d => ResManager
 * - h => default
 * - l => director
 * - n => createClass
 * - o => asyncToGenerator
 * - p => AdManager
 * - r => cclegacy
 * - s => Node
 * - t => inheritsLoose
 * - u => GameModel
 */
System.register("chunks:///_virtual/AudioManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts","./Singleton.ts","./AdManager.ts"],(function(e){
var t /* inheritsLoose */, n /* createClass */, o /* asyncToGenerator */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* director */, c /* AudioSource */, u /* GameModel */, d /* ResManager */, h /* default */, p /* AdManager */;
return{
setters:[function(e){
t=e.inheritsLoose /* inheritsLoose */,n=e.createClass /* createClass */,o=e.asyncToGenerator /* asyncToGenerator */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.director /* director */,c=e.AudioSource /* AudioSource */}
,function(e){
u=e.GameModel /* GameModel */}
,function(e){
d=e.ResManager /* ResManager */}
,function(e){
h=e.default /* default */}
,function(e){
p=e.AdManager /* AdManager */}
],execute:function(){
var f;
r._RF.push({
}
,"50236OefcJJk7B9lNSzLybs","AudioManager",void 0);
var g=a.ccclass;
a.property,e("AudioManager",g("AudioManager")(f=function(e){
function r(){
var t;
return(t=e.call(this)||this)._bgmAudioSource=void 0,t._soundAudioSource=void 0,t._cachedAudioClipMap={
}
,t}
t(r,e);
var a=r.prototype;
return a.init=function(){
console.log("Init AudioManager !"),d.instance.loadBundle("audioBundle");
var e=new s;
e.name="bgmAudio",l.getScene().addChild(e),l.addPersistRootNode(e),this._bgmAudioSource=e.addComponent(c);
var t=new s;
t.name="soundAudio",l.getScene().addChild(t),l.addPersistRootNode(t),this._soundAudioSource=t.addComponent(c)}
,a.addAudio=function(e,t){
this._cachedAudioClipMap[e]?console.log("audio already exists: "+e):this._cachedAudioClipMap[e]=t}
,a.playMusic=function(){
var e=o(i().mark((function e(t,n){
var o,r,a;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:if(o=this,void 0===n&&(n=.5),console.log(u.instance.musicFlag),!u.instance.musicFlag){
e.next=14;
break}
if((r=this._bgmAudioSource).stop(),r.clip=null,r.loop=!0,!(a=this._cachedAudioClipMap[t])){
e.next=11;
break}
return r.clip=a,e.next=9,r.play();
case 9:e.next=13;
break;
case 11:return e.next=13,d.instance.loadAudio(t,(function(e,n){
e?console.warn(e):(o._cachedAudioClipMap[t]=n,r.clip=n,r.play())}
));
case 13:r.volume=n;
case 14:case"end":return e.stop()}
}
),e,this)}
)));
return function(t,n){
return e.apply(this,arguments)}
}
(),a.pauseMusic=function(){
this._bgmAudioSource.pause()}
,a.resumeMusic=function(){
this._bgmAudioSource.play()}
,a.stopMusic=function(){
var e=this._bgmAudioSource;
e.stop(),e.clip=null}
,a.playLongSound=function(e,t){
var n=this;
if(u.instance.soundFlag){
var i=this._soundAudioSource,o=this._cachedAudioClipMap[e];
o?(i.clip=o,i.play()):d.instance.loadAudio(e,(function(t,o){
t?console.warn(t):(n._cachedAudioClipMap[e]=o,i.clip=o,i.play())}
)),i.volume=t}
}
,a.pauseLongSound=function(){
this._soundAudioSource.pause()}
,a.resumeLongSound=function(){
this._soundAudioSource.play()}
,a.stopLongSound=function(){
var e=this._soundAudioSource;
e.stop(),e.clip=null}
,a.playSound=function(e,t){
var n=this;
if(void 0===t&&(t=.5),u.instance.soundFlag){
var i=this._soundAudioSource,o=this._cachedAudioClipMap[e];
o?(i.playOneShot(o,t),"click"==e&&this.vibrateShort()):d.instance.loadAudio(e,(function(o,r){
o?console.warn(o):(n._cachedAudioClipMap[e]=r,i.playOneShot(r,t),"click"==e&&n.vibrateShort())}
))}
}
,a.vibrateShort=function(){
u.instance.vibrateFlag&&p.vibrate()}
,n(r,[{
key:"canPlaySound",get:function(){
return 1==u.instance.loadFromLocal("soundFlag")}
}
,{
key:"canVibrate",get:function(){
return 1==u.instance.loadFromLocal("vibrateFlag")}
}
],[{
key:"instance",get:function(){
return e.getInstance.call(this)}
}
]),r}
(h))||f),r._RF.pop()}
}
}
))

