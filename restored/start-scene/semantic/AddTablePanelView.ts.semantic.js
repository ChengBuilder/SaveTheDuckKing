/**
 * Semantic view: chunks:///_virtual/AddTablePanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => find
 * - a => asyncToGenerator
 * - A => UIConfigTable
 * - b => Component
 * - B => ReceivePanelView
 * - c => Node
 * - C => AudioManager
 * - d => SpriteFrame
 * - g => assetManager
 * - h => tween
 * - k => GameCtrl
 * - l => _decorator
 * - m => Prefab
 * - n => inheritsLoose
 * - N => ResManager
 * - o => initializerDefineProperty
 * - p => UIOpacity
 * - P => TooYueManager
 * - r => assertThisInitialized
 * - s => cclegacy
 * - S => director
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => Button
 * - v => Sprite
 * - w => GameModel
 * - y => instantiate
 */
/**
 * Restored module: chunks:///_virtual/AddTablePanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => find
 * - a => asyncToGenerator
 * - A => UIConfigTable
 * - b => Component
 * - B => ReceivePanelView
 * - c => Node
 * - C => AudioManager
 * - d => SpriteFrame
 * - g => assetManager
 * - h => tween
 * - k => GameCtrl
 * - l => _decorator
 * - m => Prefab
 * - n => inheritsLoose
 * - N => ResManager
 * - o => initializerDefineProperty
 * - p => UIOpacity
 * - P => TooYueManager
 * - r => assertThisInitialized
 * - s => cclegacy
 * - S => director
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => Button
 * - v => Sprite
 * - w => GameModel
 * - y => instantiate
 */
System.register("chunks:///_virtual/AddTablePanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./Enum.ts","./ReceivePanelView.ts","./ConfigTable.ts","./TooYueManager.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, o /* initializerDefineProperty */, r /* assertThisInitialized */, a /* asyncToGenerator */, s /* cclegacy */, l /* _decorator */, c /* Node */, u /* Button */, d /* SpriteFrame */, h /* tween */, p /* UIOpacity */, f, g /* assetManager */, m /* Prefab */, v /* Sprite */, y /* instantiate */, _ /* find */, b /* Component */, S /* director */, C /* AudioManager */, w /* GameModel */, N /* ResManager */, k /* GameCtrl */, T /* releaseType */, B /* ReceivePanelView */, A /* UIConfigTable */, P /* TooYueManager */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,o=e.initializerDefineProperty /* initializerDefineProperty */,r=e.assertThisInitialized /* assertThisInitialized */,a=e.asyncToGenerator /* asyncToGenerator */}
    ,function(e){
      s=e.cclegacy /* cclegacy */,l=e._decorator /* _decorator */,c=e.Node /* Node */,u=e.Button /* Button */,d=e.SpriteFrame /* SpriteFrame */,h=e.tween /* tween */,p=e.UIOpacity /* UIOpacity */,f=e.v3,g=e.assetManager /* assetManager */,m=e.Prefab /* Prefab */,v=e.Sprite /* Sprite */,y=e.instantiate /* instantiate */,_=e.find /* find */,b=e.Component /* Component */,S=e.director /* director */}
    ,function(e){
      C=e.AudioManager /* AudioManager */}
    ,function(e){
      w=e.GameModel /* GameModel */}
    ,function(e){
      N=e.ResManager /* ResManager */}
    ,function(e){
      k=e.GameCtrl /* GameCtrl */}
    ,function(e){
      T=e.releaseType /* releaseType */}
    ,function(e){
      B=e.ReceivePanelView /* ReceivePanelView */}
    ,function(e){
      A=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      P=e.TooYueManager /* TooYueManager */}
    ],execute:function(){
      var M,I,F,R,L,x,D,G,E,O,H,V,U,z,W;
      s._RF.push({
      }
      ,"f5da7Hat3tNNqc4oR0bMFUw","AddTablePanelView",void 0);
      var j=l.ccclass,J=l.property;
      e("AddTablePanelView",(M=j("AddTablePanelView"),I=J(c),F=J(c),R=J(u),L=J(u),x=J([d]),D=J([d]),M((O=t((E=function(e){
        function t(){
          for(var t,n=arguments.length,i=new Array(n),a=0;
          a<n;
          a++)i[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(i))||this,o(t,"black",O,r(t)),o(t,"panel",H,r(t)),o(t,"closeBtn",V,r(t)),o(t,"receiveBtn",U,r(t)),o(t,"btnSpriteFrame",z,r(t)),o(t,"btnWordSpriteFrame",W,r(t)),t.model=null,t}
        n(t,e);
        var s=t.prototype;
        return s.onLoad=function(){
          this.initPanel()}
        ,s.start=function(){
          h(this.black.getComponent(p)).to(.1,{
            opacity:220}
          ).start(),h(this.panel).delay(.1).to(.3,{
            position:f(0,0,0)}
          ,{
            easing:"backOut"}
          ).call((function(){
            k.instance.btnCanTouch=!0}
          )).start()}
        ,s.onEnable=function(){
          this.registerEvents()}
        ,s.onDisable=function(){
          this.unregisterEvents(),g.getBundle("uiBundle").release(A.AddTableUI.path,m)}
        ,s.initPanel=function(){
          this.black.getComponent(p).opacity=0,this.panel.setPosition(0,w.instance.screenHeight),this.panel.setScale(1,1,1)}
        ,s.setPanel=function(e){
          this.model=e,this.receiveBtn.node.getComponent(v).spriteFrame=this.btnSpriteFrame[e],this.receiveBtn.node.getChildByName("word").getComponent(v).spriteFrame=this.btnWordSpriteFrame[e]}
        ,s.registerEvents=function(){
          this.receiveBtn.node.on("click",this.onReceive,this),this.closeBtn.node.on("click",this.onClose,this)}
        ,s.unregisterEvents=function(){
          this.receiveBtn.node.off("click",this.onReceive,this),this.closeBtn.node.off("click",this.onClose,this)}
        ,s.onClose=function(){
          var e=this;
          k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,C.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
            position:f(0,w.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy(),k.instance.btnCanTouch=!0}
          )).start())}
        ,s.onReceive=function(){
          var e=this;
          k.instance.btnCanTouch&&(this.receiveBtn.interactable=!1,k.instance.btnCanTouch=!1,C.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
            position:f(0,w.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy()}
          )).start(),w.instance.releaseType==T.applet_ziJie?0==this.model?P._ins.addDesktop(this.addFinishBack,this.addFailBack):k.instance.btnCanTouch=!0:w.instance.releaseType==T.test_TEST&&(0==w.instance.addTableBtnClickNum?(w.instance.addTableBtnClickNum=1,N.instance.bundleLoad("uiBundle",A.ReceiveUI.path,null,(function(e,t){
            if(e)return console.log(e),void(k.instance.btnCanTouch=!0);
            var n=y(t);
            n.parent=_("Canvas"),n.getComponent(B).setPanel(1)}
          ))):k.instance.btnCanTouch=!0))}
        ,s.addFinishBack=function(){
          var e=a(i().mark((function e(){
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(w.instance.addTableBtnClickNum=1,!(w.instance.addTableBtnClickNum<=1)){
                  e.next=10;
                  break}
                return w.instance.addTableBtnClickNum=1,"HomeScene"==S.getScene().name&&(_("Canvas/addTableBtn/奖").active=!1),N.instance.bundleLoad("uiBundle",A.ReceiveUI.path,null,(function(e,t){
                  if(e)return console.log(e),void(k.instance.btnCanTouch=!0);
                  var n=y(t);
                  n.parent=_("Canvas"),n.getComponent(B).setPanel(1)}
                )),e.next=7,P._ins.checkAddDesktopState();
                case 7:w.AddDesktopState=e.sent,e.next=11;
                break;
                case 10:k.instance.btnCanTouch=!0;
                case 11:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),s.addFailBack=function(){
          k.instance.btnCanTouch=!0}
        ,t}
      (b)).prototype,"black",[I],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),H=t(E.prototype,"panel",[F],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),V=t(E.prototype,"closeBtn",[R],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),U=t(E.prototype,"receiveBtn",[L],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),z=t(E.prototype,"btnSpriteFrame",[x],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),W=t(E.prototype,"btnWordSpriteFrame",[D],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),G=E))||G)),s._RF.pop()}
  }
}
))

