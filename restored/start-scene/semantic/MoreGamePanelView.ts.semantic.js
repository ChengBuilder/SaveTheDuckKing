/**
 * Semantic view: chunks:///_virtual/MoreGamePanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => UIConfigTable
 * - a => _decorator
 * - c => tween
 * - f => director
 * - g => Component
 * - h => assetManager
 * - i => initializerDefineProperty
 * - l => Button
 * - m => AudioManager
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => Prefab
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => UIOpacity
 * - v => GameModel
 * - y => GameCtrl
 */
/**
 * Restored module: chunks:///_virtual/MoreGamePanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => UIConfigTable
 * - a => _decorator
 * - c => tween
 * - f => director
 * - g => Component
 * - h => assetManager
 * - i => initializerDefineProperty
 * - l => Button
 * - m => AudioManager
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => Prefab
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => UIOpacity
 * - v => GameModel
 * - y => GameCtrl
 */
System.register("chunks:///_virtual/MoreGamePanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./GameCtrl.ts","./ConfigTable.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* tween */, u /* UIOpacity */, d, h /* assetManager */, p /* Prefab */, f /* director */, g /* Component */, m /* AudioManager */, v /* GameModel */, y /* GameCtrl */, _ /* UIConfigTable */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.tween /* tween */,u=e.UIOpacity /* UIOpacity */,d=e.v3,h=e.assetManager /* assetManager */,p=e.Prefab /* Prefab */,f=e.director /* director */,g=e.Component /* Component */}
    ,function(e){
      m=e.AudioManager /* AudioManager */}
    ,function(e){
      v=e.GameModel /* GameModel */}
    ,function(e){
      y=e.GameCtrl /* GameCtrl */}
    ,function(e){
      _=e.UIConfigTable /* UIConfigTable */}
    ],execute:function(){
      var b,S,C,w,N,k,T,B,A,P,M,I,F,R,L;
      r._RF.push({
      }
      ,"ca237WsrkdLw6XD3c0mXDW8","MoreGamePanelView",void 0);
      var x=a.ccclass,D=a.property;
      e("MoreGamePanelView",(b=x("MoreGamePanelView"),S=D(s),C=D(s),w=D(l),N=D(s),k=D(s),T=D(s),b((P=t((A=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",P,o(t)),i(t,"panel",M,o(t)),i(t,"closeBtn",I,o(t)),i(t,"pigeonBtn",F,o(t)),i(t,"cowBtn",R,o(t)),i(t,"mathBtn",L,o(t)),t.levelArr=[5,9,14],t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          this.initPanel()}
        ,r.start=function(){
          c(this.black.getComponent(u)).to(.1,{
            opacity:220}
          ).start(),c(this.panel).delay(.1).to(.3,{
            position:d(0,0,0)}
          ,{
            easing:"backOut"}
          ).call((function(){
            y.instance.btnCanTouch=!0}
          )).start()}
        ,r.onEnable=function(){
          this.registerEvents()}
        ,r.onDisable=function(){
          this.unregisterEvents(),h.getBundle("uiBundle").release(_.MoreGamePanelUI.path,p)}
        ,r.initPanel=function(){
          this.black.getComponent(u).opacity=0,this.panel.setPosition(0,v.instance.screenHeight),this.panel.setScale(1,1,1),this.lockBtn()}
        ,r.lockBtn=function(){
          v.instance.level>=this.levelArr[0]&&(this.pigeonBtn.getChildByName("按钮").active=!1,this.pigeonBtn.getChildByName("black").active=!1,console.log(v.instance.pigeonGameTouched),0==v.instance.pigeonGameTouched&&(this.pigeonBtn.getChildByName("叹号更多玩法").active=!0)),v.instance.level>=this.levelArr[1]&&(this.cowBtn.getChildByName("按钮").active=!1,this.cowBtn.getChildByName("black").active=!1,0==v.instance.cowGameTouched&&(this.cowBtn.getChildByName("叹号更多玩法").active=!0)),v.instance.level>=this.levelArr[2]&&(this.mathBtn.getChildByName("按钮").active=!1,this.mathBtn.getChildByName("black").active=!1,0==v.instance.mathGameTouched&&(this.mathBtn.getChildByName("叹号更多玩法").active=!0))}
        ,r.pigeonBtnClick=function(){
          v.instance.level<this.levelArr[0]||(0==v.instance.pigeonGameTouched&&(v.instance.pigeonGameTouched=1),m.instance.playSound("ui/buttonClick"),f.loadScene(v.instance.PigeonSceneName))}
        ,r.cowBtnClick=function(){
          v.instance.level<this.levelArr[1]||(0==v.instance.cowGameTouched&&(v.instance.cowGameTouched=1),m.instance.playSound("ui/buttonClick"),f.loadScene(v.instance.CowSceneName))}
        ,r.mathBtnClick=function(){
          v.instance.level<this.levelArr[2]||(0==v.instance.mathGameTouched&&(v.instance.mathGameTouched=1),m.instance.playSound("ui/buttonClick"),f.loadScene(v.instance.MathSceneName))}
        ,r.registerEvents=function(){
          this.pigeonBtn.on("click",this.pigeonBtnClick,this),this.cowBtn.on("click",this.cowBtnClick,this),this.mathBtn.on("click",this.mathBtnClick,this),this.closeBtn.node.on("click",this.onClose,this)}
        ,r.unregisterEvents=function(){
          this.pigeonBtn.off("click",this.pigeonBtnClick,this),this.cowBtn.off("click",this.cowBtnClick,this),this.mathBtn.off("click",this.mathBtnClick,this),this.closeBtn.node.off("click",this.onClose,this)}
        ,r.onClose=function(){
          var e=this;
          y.instance.btnCanTouch&&(y.instance.btnCanTouch=!1,m.instance.playSound("ui/buttonClick"),c(this.panel).to(.3,{
            position:d(0,v.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),c(this.black.getComponent(u)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy(),y.instance.btnCanTouch=!0}
          )).start())}
        ,t}
      (g)).prototype,"black",[S],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),M=t(A.prototype,"panel",[C],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),I=t(A.prototype,"closeBtn",[w],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),F=t(A.prototype,"pigeonBtn",[N],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),R=t(A.prototype,"cowBtn",[k],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),L=t(A.prototype,"mathBtn",[T],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),B=A))||B)),r._RF.pop()}
  }
}
))

