/**
 * Semantic view: chunks:///_virtual/Singleton.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - t => cclegacy
 */
/**
 * Restored module: chunks:///_virtual/Singleton.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - t => cclegacy
 */
System.register("chunks:///_virtual/Singleton.ts",["cc"],(function(e){
  var t /* cclegacy */;
  return{
    setters:[function(e){
      t=e.cclegacy /* cclegacy */}
    ],execute:function(){
      t._RF.push({
      }
      ,"db49fGb+xREEaIys56PtfDZ","Singleton",void 0),e("default",function(){
        function e(){
        }
        return e.getInstance=function(){
          return null===this._instance&&(this._instance=new this),this._instance}
        ,e}
      ())._instance=null,t._RF.pop()}
  }
}
))

