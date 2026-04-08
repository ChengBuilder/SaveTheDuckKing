/**
 * Semantic view: chunks:///_virtual/MathScreenAdapter.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => GameCtrl
 * - a => Label
 * - c => tween
 * - d => ResolutionPolicy
 * - f => TooYueManager
 * - g => releaseType
 * - h => sys
 * - i => _decorator
 * - l => UIOpacity
 * - m => UIConfigTable
 * - n => cclegacy
 * - o => view
 * - p => Component
 * - r => find
 * - s => instantiate
 * - t => inheritsLoose
 * - v => ResManager
 * - y => GameModel
 */
/**
 * Restored module: chunks:///_virtual/MathScreenAdapter.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => GameCtrl
 * - a => Label
 * - c => tween
 * - d => ResolutionPolicy
 * - f => TooYueManager
 * - g => releaseType
 * - h => sys
 * - i => _decorator
 * - l => UIOpacity
 * - m => UIConfigTable
 * - n => cclegacy
 * - o => view
 * - p => Component
 * - r => find
 * - s => instantiate
 * - t => inheritsLoose
 * - v => ResManager
 * - y => GameModel
 */
System.register("chunks:///_virtual/MathScreenAdapter.ts",["./rollupPluginModLoBabelHelpers.js","cc","./TooYueManager.ts","./Enum.ts","./ConfigTable.ts","./ResManager.ts","./GameModel2.ts","./GameCtrl.ts"],(function(e){
  var t /* inheritsLoose */, n /* cclegacy */, i /* _decorator */, o /* view */, r /* find */, a /* Label */, s /* instantiate */, l /* UIOpacity */, c /* tween */, u, d /* ResolutionPolicy */, h /* sys */, p /* Component */, f /* TooYueManager */, g /* releaseType */, m /* UIConfigTable */, v /* ResManager */, y /* GameModel */, _ /* GameCtrl */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */}
    ,function(e){
      n=e.cclegacy /* cclegacy */,i=e._decorator /* _decorator */,o=e.view /* view */,r=e.find /* find */,a=e.Label /* Label */,s=e.instantiate /* instantiate */,l=e.UIOpacity /* UIOpacity */,c=e.tween /* tween */,u=e.v3,d=e.ResolutionPolicy /* ResolutionPolicy */,h=e.sys /* sys */,p=e.Component /* Component */}
    ,function(e){
      f=e.TooYueManager /* TooYueManager */}
    ,function(e){
      g=e.releaseType /* releaseType */}
    ,function(e){
      m=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      v=e.ResManager /* ResManager */}
    ,function(e){
      y=e.GameModel /* GameModel */}
    ,function(e){
      _=e.GameCtrl /* GameCtrl */}
    ],execute:function(){
      var b;
      n._RF.push({
      }
      ,"76d2e6H4XdHkpbLuEl9/7Vz","MathScreenAdapter",void 0);
      var S=i.ccclass;
      i.property,e("MathScreenAdapter",S("MathScreenAdapter")(b=function(e){
        function n(){
          return e.apply(this,arguments)||this}
        t(n,e);
        var i=n.prototype;
        return i.onLoad=function(){
          var e=this;
          this.adjustResolutionPolicy(),o.setResizeCallback((function(){
            e.adjustResolutionPolicy()}
          )),this.createSetBtn(),this.gmLabelUpdate(),_.instance.canTouch=!0,_.instance.btnCanTouch=!0,_.instance.gameIsOver=!1}
        ,i.gmLabelUpdate=function(){
          var e=r("Canvas/GameGuide");
          (y.instance.releaseType==g.test_TEST||f.userMsg&&f.userMsg.userTags.includes("gm"))&&(e.active=!0,e.getComponent(a).string="首页-更多玩法-数字运算")}
        ,i.createSetBtn=function(){
          var e=this;
          v.instance.bundleLoad("uiBundle",m.setBtn.path,null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=s(n);
              i.parent=e.node;
              var o=i.getComponent(l);
              o.opacity=0,c(i).delay(0).call((function(){
                o.opacity=255,i.setScale(0,0,0)}
              )).to(.1,{
                scale:u(1,1,1)}
              ).start()}
          }
          ))}
        ,i.adjustResolutionPolicy=function(){
          var e=o.getDesignResolutionSize(),t=o.getFrameSize(),n=e.width/e.height,i=t.width/t.height;
          i>n?o.setResolutionPolicy(d.FIXED_HEIGHT):o.setResolutionPolicy(d.FIXED_WIDTH),console.log("[ScreenAdapter] Frame: "+t.width+"x"+t.height+", Ratio: "+i.toFixed(2)+". Policy: "+(i>n?"FIXED_HEIGHT":"FIXED_WIDTH"))}
        ,i.checkPlatform=function(){
          h.isMobile?console.log("当前是移动端环境"):console.log("当前是PC/桌面端环境")}
        ,n}
      (p))||b),n._RF.pop()}
  }
}
))

