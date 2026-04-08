/**
 * Semantic view: chunks:///_virtual/GameCtrl.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - i => cclegacy
 * - n => createClass
 * - o => _decorator
 * - r => default
 * - t => inheritsLoose
 */
/**
 * Restored module: chunks:///_virtual/GameCtrl.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => cclegacy
 * - n => createClass
 * - o => _decorator
 * - r => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/GameCtrl.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts"],(function(e){
var t /* inheritsLoose */, n /* createClass */, i /* cclegacy */, o /* _decorator */, r /* default */;
return{
setters:[function(e){
t=e.inheritsLoose /* inheritsLoose */,n=e.createClass /* createClass */}
,function(e){
i=e.cclegacy /* cclegacy */,o=e._decorator /* _decorator */}
,function(e){
r=e.default /* default */}
],execute:function(){
var a;
i._RF.push({
}
,"968e5KPwMJN35BEx5wT9AVb","GameCtrl",void 0);
var s=o.ccclass;
o.property,e("GameCtrl",s("GameCtrl")(a=function(e){
function i(){
for(var t,n=arguments.length,i=new Array(n),o=0;
o<n;
o++)i[o]=arguments[o];
return(t=e.call.apply(e,[this].concat(i))||this).canTouch=!1,t.gameIsOver=!0,t.btnCanTouch=!0,t.canTouchNail=!1,t}
return t(i,e),n(i,null,[{
key:"instance",get:function(){
return e.getInstance.call(this)}
}
]),i}
(r))||a),i._RF.pop()}
}
}
))

