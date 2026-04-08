/**
 * Semantic view: chunks:///_virtual/ServiceManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => GameModel
 * - i => cclegacy
 * - n => createClass
 * - o => TooYueManager
 * - r => default
 * - t => inheritsLoose
 */
/**
 * Restored module: chunks:///_virtual/ServiceManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => GameModel
 * - i => cclegacy
 * - n => createClass
 * - o => TooYueManager
 * - r => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/ServiceManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./TooYueManager.ts","./Singleton.ts","./GameModel2.ts"],(function(e){
  var t /* inheritsLoose */, n /* createClass */, i /* cclegacy */, o /* TooYueManager */, r /* default */, a /* GameModel */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */,n=e.createClass /* createClass */}
    ,function(e){
      i=e.cclegacy /* cclegacy */}
    ,function(e){
      o=e.TooYueManager /* TooYueManager */}
    ,function(e){
      r=e.default /* default */}
    ,function(e){
      a=e.GameModel /* GameModel */}
    ],execute:function(){
      i._RF.push({
      }
      ,"65963jMEMpG4IbAHpjTWvmI","ServiceManager",void 0),e("default",function(e){
        function i(){
          return e.call(this)||this}
        return t(i,e),i.prototype.setStorageToServer=function(){
          var e={
            level:a.instance.level.toString(),level2:a.instance.level2.toString(),level3:a.instance.level3.toString(),subscribe:a.instance.isAlreadyFeed.toString(),pigeonNumArr:JSON.stringify(a.instance.pigeonNumArr),shareLevel:a.instance.shareLevel.toString()}
          ;
          o._ins.setUserStorage(e)}
        ,i.jsonToUrl=function(e){
          var t=[];
          return Object.entries(e).forEach((function(e){
            var n=e[0]+"="+e[1];
            t.push(n)}
          )),t.join("&")}
        ,n(i,null,[{
          key:"instance",get:function(){
            return e.getInstance.call(this)}
        }
        ]),i}
      (r)),i._RF.pop()}
  }
}
))

