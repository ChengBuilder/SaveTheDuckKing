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
  var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_;
  return{
    setters:[function(e){
      t=e.inheritsLoose}
    ,function(e){
      n=e.cclegacy,i=e._decorator,o=e.view,r=e.find,a=e.Label,s=e.instantiate,l=e.UIOpacity,c=e.tween,u=e.v3,d=e.ResolutionPolicy,h=e.sys,p=e.Component}
    ,function(e){
      f=e.TooYueManager}
    ,function(e){
      g=e.releaseType}
    ,function(e){
      m=e.UIConfigTable}
    ,function(e){
      v=e.ResManager}
    ,function(e){
      y=e.GameModel}
    ,function(e){
      _=e.GameCtrl}
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
