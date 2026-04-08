/**
 * Semantic view: chunks:///_virtual/SuccessPigeonPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Component
 * - a => _decorator
 * - A => ResManager
 * - b => GameModel
 * - B => Util
 * - c => find
 * - C => releaseType
 * - f => UIOpacity
 * - F => AutoManager
 * - g => UITransform
 * - h => tween
 * - i => initializerDefineProperty
 * - I => AddTablePanelView
 * - k => GameCtrl
 * - l => Button
 * - m => Tween
 * - M => AdManager_ZJ
 * - n => inheritsLoose
 * - N => default
 * - o => assertThisInitialized
 * - p => instantiate
 * - P => TooYueManager
 * - r => cclegacy
 * - s => Node
 * - S => AudioManager
 * - t => applyDecoratedDescriptor
 * - T => UIConfigTable
 * - v => assetManager
 * - w => EVENT_KEYS
 * - y => Prefab
 */
/**
 * Restored module: chunks:///_virtual/SuccessPigeonPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Component
 * - a => _decorator
 * - A => ResManager
 * - b => GameModel
 * - B => Util
 * - c => find
 * - C => releaseType
 * - f => UIOpacity
 * - F => AutoManager
 * - g => UITransform
 * - h => tween
 * - i => initializerDefineProperty
 * - I => AddTablePanelView
 * - k => GameCtrl
 * - l => Button
 * - m => Tween
 * - M => AdManager_ZJ
 * - n => inheritsLoose
 * - N => default
 * - o => assertThisInitialized
 * - p => instantiate
 * - P => TooYueManager
 * - r => cclegacy
 * - s => Node
 * - S => AudioManager
 * - t => applyDecoratedDescriptor
 * - T => UIConfigTable
 * - v => assetManager
 * - w => EVENT_KEYS
 * - y => Prefab
 */
System.register("chunks:///_virtual/SuccessPigeonPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./AudioManager.ts","./Enum.ts","./EventManager.ts","./GameCtrl.ts","./ConfigTable.ts","./Util.ts","./ResManager.ts","./TooYueManager.ts","./AdManager_ZJ.ts","./AddTablePanelView.ts","./AutoManager.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* find */, u, d, h /* tween */, p /* instantiate */, f /* UIOpacity */, g /* UITransform */, m /* Tween */, v /* assetManager */, y /* Prefab */, _ /* Component */, b /* GameModel */, S /* AudioManager */, C /* releaseType */, w /* EVENT_KEYS */, N /* default */, k /* GameCtrl */, T /* UIConfigTable */, B /* Util */, A /* ResManager */, P /* TooYueManager */, M /* AdManager_ZJ */, I /* AddTablePanelView */, F /* AutoManager */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.find /* find */,u=e.v2,d=e.v3,h=e.tween /* tween */,p=e.instantiate /* instantiate */,f=e.UIOpacity /* UIOpacity */,g=e.UITransform /* UITransform */,m=e.Tween /* Tween */,v=e.assetManager /* assetManager */,y=e.Prefab /* Prefab */,_=e.Component /* Component */}
    ,function(e){
      b=e.GameModel /* GameModel */}
    ,function(e){
      S=e.AudioManager /* AudioManager */}
    ,function(e){
      C=e.releaseType /* releaseType */,w=e.EVENT_KEYS /* EVENT_KEYS */}
    ,function(e){
      N=e.default /* default */}
    ,function(e){
      k=e.GameCtrl /* GameCtrl */}
    ,function(e){
      T=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      B=e.Util /* Util */}
    ,function(e){
      A=e.ResManager /* ResManager */}
    ,function(e){
      P=e.TooYueManager /* TooYueManager */}
    ,function(e){
      M=e.AdManager_ZJ /* AdManager_ZJ */}
    ,function(e){
      I=e.AddTablePanelView /* AddTablePanelView */}
    ,function(e){
      F=e.AutoManager /* AutoManager */}
    ],execute:function(){
      var R,L,x,D,G,E,O,H,V,U,z,W,j,J,Y,q,K;
      r._RF.push({
      }
      ,"812b0r4ROdA34PHs364YY3O","SuccessPigeonPanelView",void 0);
      var X=a.ccclass,Q=a.property;
      e("SuccessPigeonPanelView",(R=X("SuccessPigeonPanelView"),L=Q(s),x=Q(s),D=Q(s),G=Q(l),E=Q(l),O=Q(l),H=Q(l),R((z=t((U=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",z,o(t)),i(t,"panel",W,o(t)),i(t,"aniNode",j,o(t)),i(t,"nextLevelBtn",J,o(t)),i(t,"shareVideoBtn",Y,o(t)),i(t,"shareBtn",q,o(t)),i(t,"goSideBarBtn",K,o(t)),t.startProgress=0,t.endProgress=1,t.ITime=0,t.createStarTime=.5,t.duckLzTime=0,t.DuckLzCd=.3,t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          this.initUi(),P._ins.showInterstitialAd("成功"),S.instance.playSound("ui/levelComplete");
          var e=this.panel.getChildByName("banner");
          B.playRibbonAni(60,c("Canvas"),u(0,e.y-100)),this.uiAnimation()}
        ,r.start=function(){
          var e=this;
          b.isAuto&&this.scheduleOnce((function(){
            var t=d(e.nextLevelBtn.node.scale);
            h(e.nextLevelBtn.node).to(.1,{
              scale:d(t.x+.1,t.y+.1,t.z+.1)}
            ).to(.1,{
              scale:t}
            ).call((function(){
              e.onNextLevel()}
            )).start()}
          ),2+B.getRandomNum(2,4))}
        ,r.update=function(e){
          this.ITime+=e,this.ITime>this.createStarTime&&(this.createStar(),this.createStarTime=this.ITime+B.getRandomNum(.2,.4,!1)),this.duckLzCreate(e)}
        ,r.duckLzCreate=function(e){
          this.duckLzTime+=e,this.duckLzTime>this.DuckLzCd&&(this.duckLzTime=0,this.DuckLzCd=B.getRandomNum(.1,.3))}
        ,r.initUi=function(){
          if(b.instance.releaseType==C.applet_wechat&&(this.shareVideoBtn.node.active=!1,this.goSideBarBtn.node.active=!1),0==b.instance.receiveSideBarGriftNum){
            var e=this.goSideBarBtn.node.getChildByName("奖");
            e.active=!0,B.btnShake(e)}
        }
        ,r.createStar=function(){
          var e=this;
          A.instance.bundleLoad("DuckBundle","prefab/successStar",null,(function(t,n){
            if(t)console.error(t);
            else{
              var i=p(n);
              e.aniNode.getChildByName("starNode").addChild(i);
              var o=d(B.getRandomNum(-50,50),B.getRandomNum(-50,50));
              i.layer=1<<25,i.setPosition(o);
              var r=B.getAngleForPos(u(0,0),u(o.x,o.y)),a=B.getRandomNum(250,300),s=B.getPosForAngleLen(r,a,o),l=B.getRandomNum(1.5,2.5);
              h(i).to(l,{
                position:s,scale:d(.5,.5)}
              ).call((function(){
                i.destroy()}
              )).start(),h(i.getComponent(f)).to(l,{
                opacity:100}
              ).start()}
          }
          ))}
        ,r.uiAnimation=function(){
          var e=this;
          this.black.getComponent(f).opacity=0,h(this.black.getComponent(f)).to(.1,{
            opacity:220}
          ).call((function(){
            k.instance.btnCanTouch=!0}
          )).start();
          var t=b.instance.screenWidth,n=b.instance.screenHeight,i=this.panel.getChildByName("banner"),o=i.position.y;
          i.y=n/2+i.getComponent(g).height/2;
          var r=d(this.aniNode.scale);
          this.aniNode.setScale(0,0,0);
          var a=this.shareBtn.node.x;
          this.shareBtn.node.x=t/2+this.shareBtn.getComponent(g).width/2;
          var s=this.shareVideoBtn.node.x;
          this.shareVideoBtn.node.x=-t/2-this.shareVideoBtn.getComponent(g).width/2;
          var l=this.goSideBarBtn.node.x;
          this.goSideBarBtn.node.x=-t/2-this.goSideBarBtn.getComponent(g).width/2;
          var c=d(this.nextLevelBtn.node.scale);
          if(this.nextLevelBtn.node.setScale(0,0,0),h(i).to(.5,{
            y:o}
          ,{
            easing:"backOut"}
          ).start(),h(this.aniNode).delay(.5).call((function(){
          }
          )).to(.5,{
            scale:r}
          ,{
            easing:"backOut"}
          ).start(),h(this.shareBtn.node).delay(1).to(.35,{
            x:a}
          ,{
            easing:"backOut"}
          ).start(),b.instance.shareSuccessNum<P._ins.shareGift){
            var u=this.shareBtn.node.getChildByName("shareTips");
            h(u).delay(1.35).to(.2,{
              scale:d(1.1,.9)}
            ).to(.1,{
              scale:d(.9,1.1)}
            ).to(.1,{
              scale:d(1,1)}
            ).start()}
          h(this.goSideBarBtn.node).delay(1).to(.35,{
            x:l}
          ,{
            easing:"backOut"}
          ).start(),h(this.shareVideoBtn.node).delay(1).to(.35,{
            x:s}
          ,{
            easing:"backOut"}
          ).call((function(){
          }
          )).start(),h(this.nextLevelBtn.node).delay(1.35).to(.5,{
            scale:c}
          ,{
            easing:"backOut"}
          ).call((function(){
            B.btnShake(e.nextLevelBtn.node)}
          )).start(),F._ins.isAuto&&this.scheduleOnce((function(){
            e.onNextLevel()}
          ),4);
          var p=this.aniNode.getChildByName("name");
          h(p).to(.2,{
            scale:d(1.1,1.1)}
          ).to(.2,{
            scale:d(1,1)}
          ).union().repeatForever().start()}
        ,r.getPromoteIndex=function(){
          var e;
          return-1!=(e=b.instance.promoteLevelArr.indexOf(b.instance.level))?e:null}
        ,r.setLevelNum=function(){
        }
        ,r.onEnable=function(){
          this.registerEvents()}
        ,r.onDisable=function(){
          this.unregisterEvents(),m.stopAllByTarget(this.node),v.getBundle("uiBundle").release(T.SuccessUI.path,y)}
        ,r.closeShareTips=function(){
          this.shareBtn.node.getChildByName("shareTips").active=!1}
        ,r.registerEvents=function(){
          this.nextLevelBtn.node.on("click",this.onNextLevel,this),this.shareBtn.node.on("click",this.share,this),this.shareVideoBtn.node.on("click",this.shareVideo,this),N.instance.on(w.CLOSE_SHARETIPS,this.closeShareTips,this),N.instance.on(w.SIDE_REWARD,this.closeTips,this)}
        ,r.unregisterEvents=function(){
          var e,t,n;
          S.instance.stopLongSound(),null!=(e=this.nextLevelBtn)&&e.node&&this.nextLevelBtn.node.off("click",this.onNextLevel,this),null!=(t=this.shareBtn)&&t.node&&this.shareBtn.node.off("click",this.share,this),null!=(n=this.shareVideoBtn)&&n.node&&this.shareVideoBtn.node.off("click",this.shareVideo,this),N.instance.on(w.CLOSE_SHARETIPS,this.closeShareTips,this),N.instance.off(w.SIDE_REWARD,this.closeTips,this)}
        ,r.onNextLevel=function(){
          var e=this;
          k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,S.instance.playSound("ui/buttonClick"),P._ins.stopRecordVideo(),h(this.panel.getComponent(f)).delay(0).to(.3,{
            opacity:0}
          ,{
            easing:"smooth"}
          ).call((function(){
            N.instance.emit(w.NEXT_LEVEL),k.instance.btnCanTouch=!0,e.node.destroy()}
          )).start())}
        ,r.share=function(){
          var e=this;
          S.instance.playSound("ui/buttonClick"),b.instance.shareSuccessNum<P._ins.shareGift?A.instance.bundleLoad("uiBundle",T.ShareUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            p(n).parent=e.node}
          )):(P._ins.shareApp(),k.instance.btnCanTouch=!0)}
        ,r.shareVideo=function(){
          S.instance.playSound("ui/buttonClick"),P._ins.stopAndShareRecord()}
        ,r.subscribeBack=function(){
          var e=this;
          console.log("subscribeBack",P.feedSubscribeStatus),console.log("桌面信息",b.instance.addTableBtnClickNum),P.feedSubscribeStatus?0==b.instance.addTableBtnClickNum&&A.instance.bundleLoad("uiBundle",T.AddTableUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            var i=p(n);
            i.parent=e.node,i.getComponent(I).setPanel(0)}
          )):M._ins.feedSubscribe()}
        ,r.goSideBarBack=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("侧边栏"),S.instance.playSound("ui/buttonClick"),A.instance.bundleLoad("uiBundle",T.SideBarUI.path,null,(function(t,n){
            t?console.log(t):p(n).parent=e.node}
          )))}
        ,r.closeTips=function(){
          this.goSideBarBtn.node.getChildByName("奖").active=!1}
        ,t}
      (_)).prototype,"black",[L],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),W=t(U.prototype,"panel",[x],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),j=t(U.prototype,"aniNode",[D],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),J=t(U.prototype,"nextLevelBtn",[G],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Y=t(U.prototype,"shareVideoBtn",[E],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),q=t(U.prototype,"shareBtn",[O],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),K=t(U.prototype,"goSideBarBtn",[H],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),V=U))||V)),r._RF.pop()}
  }
}
))

