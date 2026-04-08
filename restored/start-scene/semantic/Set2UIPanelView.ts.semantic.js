/**
 * Semantic view: chunks:///_virtual/Set2UIPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => DuckController
 * - a => _decorator
 * - c => UIOpacity
 * - d => find
 * - f => Component
 * - g => GameModel
 * - h => Label
 * - i => initializerDefineProperty
 * - l => tween
 * - m => GameCtrl
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => director
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - v => AdManager
 * - y => AudioManager
 */
/**
 * Restored module: chunks:///_virtual/Set2UIPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => DuckController
 * - a => _decorator
 * - c => UIOpacity
 * - d => find
 * - f => Component
 * - g => GameModel
 * - h => Label
 * - i => initializerDefineProperty
 * - l => tween
 * - m => GameCtrl
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => director
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - v => AdManager
 * - y => AudioManager
 */
System.register("chunks:///_virtual/Set2UIPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./GameCtrl.ts","./AdManager.ts","./AudioManager.ts","./DuckController.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* tween */, c /* UIOpacity */, u, d /* find */, h /* Label */, p /* director */, f /* Component */, g /* GameModel */, m /* GameCtrl */, v /* AdManager */, y /* AudioManager */, _ /* DuckController */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.tween /* tween */,c=e.UIOpacity /* UIOpacity */,u=e.v3,d=e.find /* find */,h=e.Label /* Label */,p=e.director /* director */,f=e.Component /* Component */}
    ,function(e){
      g=e.GameModel /* GameModel */}
    ,function(e){
      m=e.GameCtrl /* GameCtrl */}
    ,function(e){
      v=e.AdManager /* AdManager */}
    ,function(e){
      y=e.AudioManager /* AudioManager */}
    ,function(e){
      _=e.DuckController /* DuckController */}
    ],execute:function(){
      var b,S,C,w,N,k,T,B,A,P,M,I,F;
      r._RF.push({
      }
      ,"20e2cAqXPpOcIepzmZGluya","Set2UIPanelView",void 0);
      var R=a.ccclass,L=a.property;
      e("Set2UIPanelView",(b=R("Set2UIPanelView"),S=L(s),C=L(s),w=L(s),N=L(s),k=L(s),b((A=t((B=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"closeBtn",A,o(t)),i(t,"tryBtn",P,o(t)),i(t,"labelNode",M,o(t)),i(t,"black",I,o(t)),i(t,"panel",F,o(t)),t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          this.initPanel(),this.black.on(s.EventType.TOUCH_END,this.tryBack,this)}
        ,r.start=function(){
          m.instance.canTouch=!1,l(this.black.getComponent(c)).to(.1,{
            opacity:220}
          ).start(),l(this.panel).delay(.1).to(.3,{
            position:u(0,0,0)}
          ,{
            easing:"backOut"}
          ).call((function(){
            m.instance.btnCanTouch=!0}
          )).start()}
        ,r.initPanel=function(){
          this.black.getComponent(c).opacity=0,this.panel.setPosition(0,g.instance.screenHeight),this.panel.setScale(1,1,1);
          var e=d("Canvas").getComponent(_),t=Math.floor(e.popNum/e.nailNum*100);
          this.labelNode.getComponent(h).string=""+t}
        ,r.tryBack=function(){
          y.instance.playSound("ui/buttonClick"),m.instance.canTouch=!0,m.instance.btnCanTouch=!0,this.black.off(s.EventType.TOUCH_END,this.tryBack,this),this.node.destroy()}
        ,r.HomeBack=function(){
          y.instance.playSound("ui/buttonClick"),v.stopGyroscope(),p.loadScene(g.instance.HomeSceneName)}
        ,r.onDestroy=function(){
        }
        ,t}
      (f)).prototype,"closeBtn",[S],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),P=t(B.prototype,"tryBtn",[C],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),M=t(B.prototype,"labelNode",[w],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),I=t(B.prototype,"black",[N],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),F=t(B.prototype,"panel",[k],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),T=B))||T)),r._RF.pop()}
  }
}
))

