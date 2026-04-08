/**
 * Semantic view: chunks:///_virtual/GyroscopeManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - n => cclegacy
 * - t => createClass
 */
/**
 * Restored module: chunks:///_virtual/GyroscopeManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - n => cclegacy
 * - t => createClass
 */
System.register("chunks:///_virtual/GyroscopeManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){
  var t /* createClass */, n /* cclegacy */;
  return{
    setters:[function(e){
      t=e.createClass /* createClass */}
    ,function(e){
      n=e.cclegacy /* cclegacy */}
    ],execute:function(){
      n._RF.push({
      }
      ,"a7f3eLBm41Of6bFTT4vGguc","GyroscopeManager",void 0),e("GyroscopeManager",function(){
        function e(){
          this.platform="tt",this.deadZone=2,this.clampAbs=5,this.intervalMs=20,this.intervalWx="game",this._running=!1,this._effect=null,this._boundListener=null}
        var n=e.prototype;
        return n.start=function(e){
          var t=this;
          this.stop(),this._effect=e,this._boundListener=function(e){
            return t._dispatch(e)}
          ;
          var n=this.platform;
          return"wx"===n?(wx.startGyroscope({
            interval:this.intervalWx,fail:function(e){
              return console.warn("[GyroscopeManager] wx.startGyroscope fail",e)}
          }
          ),wx.onGyroscopeChange(this._boundListener),this._running=!0,!0):"tt"===n?(tt.startGyroscope({
            interval:this.intervalMs,fail:function(e){
              return console.warn("[GyroscopeManager] tt.startGyroscope fail",e)}
          }
          ),tt.onGyroscopeChange(this._boundListener),this._running=!0,!0):(this._effect=null,console.warn("[GyroscopeManager] platform 应为 wx 或 tt"),!1)}
        ,n._dispatch=function(e){
          var t,n=e.x,i=this.deadZone;
          if(!(n<=i&&n>=-i)){
            var o=n,r=this.clampAbs;
            o>r?o=r:o<-r&&(o=-r),null==(t=this._effect)||t.call(this,o,0)}
        }
        ,n.stop=function(){
          if(this._running&&this._boundListener){
            var e=this._boundListener;
            "wx"===this.platform?(null==wx.offGyroscopeChange||wx.offGyroscopeChange(e),null==wx.stopGyroscope||wx.stopGyroscope({
            }
            )):"tt"===this.platform&&(null==tt.offGyroscopeChange||tt.offGyroscopeChange(e),null==tt.stopGyroscope||tt.stopGyroscope({
            }
            )),this._clear()}
          else this._clear()}
        ,n._clear=function(){
          this._running=!1,this._boundListener=null,this._effect=null}
        ,t(e,[{
          key:"isRunning",get:function(){
            return this._running}
        }
        ],[{
          key:"instance",get:function(){
            return e._inst||(e._inst=new e),e._inst}
        }
        ]),e}
      ())._inst=null,n._RF.pop()}
  }
}
))

