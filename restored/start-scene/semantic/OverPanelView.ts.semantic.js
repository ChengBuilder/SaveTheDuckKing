/**
 * Semantic view: chunks:///_virtual/OverPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => find
 * - a => _decorator
 * - A => default
 * - b => ProgressBar
 * - B => EVENT_KEYS
 * - c => Label
 * - C => Prefab
 * - d => director
 * - D => AutoManager
 * - E => Game
 * - F => ResManager
 * - g => UIOpacity
 * - G => Game2Controller
 * - h => Sprite
 * - i => initializerDefineProperty
 * - I => UIConfigTable
 * - k => AudioManager
 * - l => Button
 * - L => DuckController
 * - m => tween
 * - M => Util
 * - n => inheritsLoose
 * - N => GameModel
 * - o => assertThisInitialized
 * - p => UITransform
 * - P => GameCtrl
 * - r => cclegacy
 * - R => AddPowerPanelView
 * - s => Node
 * - S => assetManager
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => SpriteFrame
 * - w => Component
 * - x => TooYueManager
 * - y => instantiate
 */
/**
 * Restored module: chunks:///_virtual/OverPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => find
 * - a => _decorator
 * - A => default
 * - b => ProgressBar
 * - B => EVENT_KEYS
 * - c => Label
 * - C => Prefab
 * - d => director
 * - D => AutoManager
 * - E => Game
 * - F => ResManager
 * - g => UIOpacity
 * - G => Game2Controller
 * - h => Sprite
 * - i => initializerDefineProperty
 * - I => UIConfigTable
 * - k => AudioManager
 * - l => Button
 * - L => DuckController
 * - m => tween
 * - M => Util
 * - n => inheritsLoose
 * - N => GameModel
 * - o => assertThisInitialized
 * - p => UITransform
 * - P => GameCtrl
 * - r => cclegacy
 * - R => AddPowerPanelView
 * - s => Node
 * - S => assetManager
 * - t => applyDecoratedDescriptor
 * - T => releaseType
 * - u => SpriteFrame
 * - w => Component
 * - x => TooYueManager
 * - y => instantiate
 */
System.register("chunks:///_virtual/OverPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./AudioManager.ts","./Enum.ts","./EventManager.ts","./GameCtrl.ts","./Util.ts","./ConfigTable.ts","./ResManager.ts","./AddPowerPanelView.ts","./DuckController.ts","./TooYueManager.ts","./AutoManager.ts","./Game2Controller.ts","./Game.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* Label */, u /* SpriteFrame */, d /* director */, h /* Sprite */, p /* UITransform */, f, g /* UIOpacity */, m /* tween */, v, y /* instantiate */, _ /* find */, b /* ProgressBar */, S /* assetManager */, C /* Prefab */, w /* Component */, N /* GameModel */, k /* AudioManager */, T /* releaseType */, B /* EVENT_KEYS */, A /* default */, P /* GameCtrl */, M /* Util */, I /* UIConfigTable */, F /* ResManager */, R /* AddPowerPanelView */, L /* DuckController */, x /* TooYueManager */, D /* AutoManager */, G /* Game2Controller */, E /* Game */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.Label /* Label */,u=e.SpriteFrame /* SpriteFrame */,d=e.director /* director */,h=e.Sprite /* Sprite */,p=e.UITransform /* UITransform */,f=e.sp,g=e.UIOpacity /* UIOpacity */,m=e.tween /* tween */,v=e.v3,y=e.instantiate /* instantiate */,_=e.find /* find */,b=e.ProgressBar /* ProgressBar */,S=e.assetManager /* assetManager */,C=e.Prefab /* Prefab */,w=e.Component /* Component */}
    ,function(e){
      N=e.GameModel /* GameModel */}
    ,function(e){
      k=e.AudioManager /* AudioManager */}
    ,function(e){
      T=e.releaseType /* releaseType */,B=e.EVENT_KEYS /* EVENT_KEYS */}
    ,function(e){
      A=e.default /* default */}
    ,function(e){
      P=e.GameCtrl /* GameCtrl */}
    ,function(e){
      M=e.Util /* Util */}
    ,function(e){
      I=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      F=e.ResManager /* ResManager */}
    ,function(e){
      R=e.AddPowerPanelView /* AddPowerPanelView */}
    ,function(e){
      L=e.DuckController /* DuckController */}
    ,function(e){
      x=e.TooYueManager /* TooYueManager */}
    ,function(e){
      D=e.AutoManager /* AutoManager */}
    ,function(e){
      G=e.Game2Controller /* Game2Controller */}
    ,function(e){
      E=e.Game /* Game */}
    ],execute:function(){
      var O,H,V,U,z,W,j,J,Y,q,K,X,Q,Z,$,ee,te,ne,ie,oe,re,ae,se,le,ce,ue,de,he,pe,fe,ge,me,ve,ye,_e;
      r._RF.push({
      }
      ,"5a060yLUblEbpeAXdEOCWKb","OverPanelView",void 0);
      var be=a.ccclass,Se=a.property;
      e("OverPanelView",(O=be("OverPanelView"),H=Se(s),V=Se(s),U=Se(l),z=Se(l),W=Se(l),j=Se(l),J=Se(l),Y=Se(s),q=Se(s),K=Se(s),X=Se(c),Q=Se(s),Z=Se(s),$=Se(s),ee=Se([u]),te=Se([u]),O((oe=t((ie=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",oe,o(t)),i(t,"panel",re,o(t)),i(t,"replayBtn",ae,o(t)),i(t,"goHomeBtn",se,o(t)),i(t,"shareVideoBtn",le,o(t)),i(t,"shareBtn",ce,o(t)),i(t,"goSideBarBtn",ue,o(t)),i(t,"aniNode",de,o(t)),i(t,"loseSprite",he,o(t)),i(t,"progressBar",pe,o(t)),t.powerBox=null,i(t,"progressLabel",fe,o(t)),i(t,"sprite",ge,o(t)),i(t,"overLabel",me,o(t)),i(t,"failNumLabel",ve,o(t)),i(t,"duckSpriteFrames",ye,o(t)),i(t,"duckLabelFrames",_e,o(t)),t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          N.instance.level=N.instance.level+1,k.instance.playSound("ui/failureStinger",.8),this.initUi(),N.instance.level=N.instance.level-1,this.uiAnimation()}
        ,r.start=function(){
          var e=this;
          x._ins.stopRecordVideo();
          var t=M.getRandomNum(0,this.duckSpriteFrames.length-1,!0);
          d.getScene().name==N.instance.FruitSceneName&&(t=3),this.sprite.getComponent(h).spriteFrame=this.duckSpriteFrames[t],this.overLabel.getComponent(h).spriteFrame=this.duckLabelFrames[t],0!=t&&1!=t||(this.sprite.getComponent(p).width=531,this.sprite.getComponent(p).height=531);
          var n=0;
          d.getScene().name==N.instance.DuckSceneName?n=N.instance.failNum:d.getScene().name==N.instance.Game2SceneName?n=N.instance.failNum_Game2:d.getScene().name==N.instance.FruitSceneName&&(n=N.instance.failNum_Game3),this.failNumLabel.getComponent(c).string="本关已挑战"+n+"次",D._ins.isAuto&&this.scheduleOnce((function(){
            e.onReplay()}
          ),2+M.getRandomNum(2,4))}
        ,r.initUi=function(){
          if(N.instance.releaseType==T.applet_wechat&&(this.shareVideoBtn.node.active=!1,this.goSideBarBtn.node.active=!1),this.createPowerBox(),0==N.instance.receiveSideBarGriftNum){
            var e=this.goSideBarBtn.node.getChildByName("奖");
            e.active=!0,M.btnShake(e),this.goSideBarBtn.node.getComponent(f.Skeleton).setAnimation(0,"animation",!0)}
        }
        ,r.uiAnimation=function(){
          var e=this;
          this.black.getComponent(g).opacity=0,m(this.black.getComponent(g)).to(.1,{
            opacity:220}
          ).call((function(){
            P.instance.btnCanTouch=!0}
          )).start();
          var t=N.instance.screenWidth,n=N.instance.screenHeight,i=this.panel.getChildByName("banner"),o=i.position.y;
          i.y=n/2+i.getComponent(p).height/2,this.loseSprite.setScale(0,0,0),this.failNumLabel.setScale(0,0,0),v(this.aniNode.scale),this.aniNode.setScale(0,0,0);
          var r=this.shareBtn.node.x;
          this.shareBtn.node.x=t/2+this.shareBtn.getComponent(p).width/2;
          var a=this.shareVideoBtn.node.x;
          this.shareVideoBtn.node.x=-t/2-this.shareVideoBtn.getComponent(p).width/2;
          var s=this.goSideBarBtn.node.x;
          this.goSideBarBtn.node.x=-t/2-this.goSideBarBtn.getComponent(p).width/2;
          var l=v(this.replayBtn.node.scale);
          this.replayBtn.node.setScale(0,0,0);
          var c=v(this.goHomeBtn.node.scale);
          if(this.goHomeBtn.node.setScale(0,0,0),m(i).to(.5,{
            y:o}
          ,{
            easing:"backOut"}
          ).start(),m(this.failNumLabel).delay(.25).to(.5,{
            scale:v(1,1,1)}
          ,{
            easing:"backOut"}
          ).start(),m(this.loseSprite).delay(.5).to(.5,{
            scale:v(1,1,1)}
          ,{
            easing:"backOut"}
          ).call((function(){
            e.initProgressBar()}
          )).start(),m(this.shareBtn.node).delay(1).to(.35,{
            x:r}
          ,{
            easing:"backOut"}
          ).start(),N.instance.shareSuccessNum<x._ins.shareGift){
            var u=this.shareBtn.node.getChildByName("shareTips");
            m(u).delay(1.35).to(.2,{
              scale:v(1.1,.9)}
            ).to(.1,{
              scale:v(.9,1.1)}
            ).to(.1,{
              scale:v(1,1)}
            ).start()}
          m(this.shareVideoBtn.node).delay(1).to(.35,{
            x:a}
          ,{
            easing:"backOut"}
          ).start(),m(this.goSideBarBtn.node).delay(1).to(.35,{
            x:s}
          ,{
            easing:"backOut"}
          ).start(),m(this.replayBtn.node).delay(1.35).to(.5,{
            scale:l}
          ,{
            easing:"backOut"}
          ).call((function(){
            M.btnShake(e.replayBtn.node)}
          )).start(),m(this.goHomeBtn.node).delay(1.7).to(.5,{
            scale:c}
          ,{
            easing:"backOut"}
          ).start()}
        ,r.createPowerBox=function(){
          var e=this;
          F.instance.bundleLoad("uiBundle",I.powerBox.path,null,(function(t,n){
            t?console.log(t):(e.powerBox=y(n),e.powerBox.parent=e.node)}
          ))}
        ,r.initProgressBar=function(){
          var e=null,t=0;
          d.getScene().name==N.instance.Game2SceneName?(t=(e=_("Canvas").getComponent(G)).popNum/e.fruitNum,t=M.fakeProgressSmooth(e.popNum,e.fruitNum)):d.getScene().name==N.instance.FruitSceneName?(t=((e=_("Canvas").getComponent(E)).fruitNum-e.remainNum)/e.fruitNum,t=M.fakeProgressSmooth(e.fruitNum-e.remainNum,e.fruitNum)):(t=(e=_("Canvas").getComponent(L)).popNum/e.nailNum,t=M.fakeProgressSmooth(e.popNum,e.nailNum)),m(this.progressBar.getComponent(b)).delay(.5).to(.4,{
            progress:t}
          ,{
            easing:"sineOut"}
          ).start(),m(this.progressLabel.getComponent(c)).delay(.5).to(.4,{
            string:""+Math.floor(100*t)}
          ).start()}
        ,r.onEnable=function(){
          this.registerEvents()}
        ,r.onDisable=function(){
          this.unregisterEvents(),S.getBundle("uiBundle").release(I.OverUI.path,C)}
        ,r.closeShareTips=function(){
          this.shareBtn.node.getChildByName("shareTips").active=!1}
        ,r.registerEvents=function(){
          this.replayBtn.node.on("click",this.onReplay,this),this.goHomeBtn.node.on("click",this.onGoHome,this),this.shareBtn.node.on("click",this.share,this),this.shareVideoBtn.node.on("click",this.shareVideo,this),A.instance.on(B.CLOSE_SHARETIPS,this.closeShareTips,this),this.goSideBarBtn.node.on("click",this.goSideBarBack,this),A.instance.on(B.SIDE_REWARD,this.closeTips,this)}
        ,r.unregisterEvents=function(){
          var e,t,n,i,o;
          null!=(e=this.replayBtn)&&e.node&&this.replayBtn.node.off("click",this.onReplay,this),null!=(t=this.goHomeBtn)&&t.node&&this.goHomeBtn.node.off("click",this.onGoHome,this),null!=(n=this.shareBtn)&&n.node&&this.shareBtn.node.off("click",this.share,this),null!=(i=this.shareVideoBtn)&&i.node&&this.shareVideoBtn.node.off("click",this.shareVideo,this),null!=(o=this.goSideBarBtn)&&o.node&&this.goSideBarBtn.node.off("click",this.goSideBarBack,this),A.instance.off(B.CLOSE_SHARETIPS,this.closeShareTips,this),A.instance.off(B.SIDE_REWARD,this.closeTips,this)}
        ,r.onReplay=function(){
          var e=this;
          P.instance.btnCanTouch&&(P.instance.btnCanTouch=!1,k.instance.playSound("ui/buttonClick"),d.getScene().name==N.instance.FruitSceneName?k.instance.playMusic("fruitGame/fruitBgm",.5):k.instance.playMusic("bgm/defaultGameplay",.5),N.instance.userPowerNum>0?(N.instance.subPowerNum(),k.instance.playSound("ui/powerConsume"),m(this.panel).to(.3,{
            position:v(0,N.instance.screenHeight)}
          ,{
            easing:"backIn"}
          ).start(),m(this.black.getComponent(g)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            A.instance.emit(B.REPLAY),e.node.destroy()}
          )).start()):(console.log("体力不足"),F.instance.bundleLoad("uiBundle",I.AddPowerPanel.path,null,(function(t,n){
            if(t)return console.log(t),void(P.instance.btnCanTouch=!0);
            var i=y(n);
            i.parent=_("Canvas");
            var o=i.getComponent(R);
            o.purpose="ReplayGuessScene",o.showAdCallFunc=e.onReplay.bind(e)}
          ))))}
        ,r.onGoHome=function(){
          this.goHomeBtn.interactable=!1,k.instance.playSound("ui/buttonClick"),d.loadScene(N.instance.HomeSceneName)}
        ,r.share=function(){
          var e=this;
          k.instance.playSound("ui/buttonClick"),N.instance.shareSuccessNum<x._ins.shareGift?F.instance.bundleLoad("uiBundle",I.ShareUI.path,null,(function(t,n){
            if(t)return console.log(t),void(P.instance.btnCanTouch=!0);
            y(n).parent=e.node}
          )):(x._ins.shareApp(),P.instance.btnCanTouch=!0)}
        ,r.shareVideo=function(){
          k.instance.playSound("ui/buttonClick"),x._ins.stopAndShareRecord()}
        ,r.goSideBarBack=function(){
          var e=this;
          !1!==P.instance.btnCanTouch&&(P.instance.btnCanTouch=!1,console.log("侧边栏"),k.instance.playSound("ui/buttonClick"),F.instance.bundleLoad("uiBundle",I.SideBarUI.path,null,(function(t,n){
            t?console.log(t):y(n).parent=e.node}
          )))}
        ,r.closeTips=function(){
          this.goSideBarBtn.node.getChildByName("奖").active=!1}
        ,t}
      (w)).prototype,"black",[H],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),re=t(ie.prototype,"panel",[V],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ae=t(ie.prototype,"replayBtn",[U],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),se=t(ie.prototype,"goHomeBtn",[z],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),le=t(ie.prototype,"shareVideoBtn",[W],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ce=t(ie.prototype,"shareBtn",[j],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ue=t(ie.prototype,"goSideBarBtn",[J],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),de=t(ie.prototype,"aniNode",[Y],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),he=t(ie.prototype,"loseSprite",[q],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),pe=t(ie.prototype,"progressBar",[K],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),fe=t(ie.prototype,"progressLabel",[X],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ge=t(ie.prototype,"sprite",[Q],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),me=t(ie.prototype,"overLabel",[Z],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ve=t(ie.prototype,"failNumLabel",[$],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ye=t(ie.prototype,"duckSpriteFrames",[ee],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),_e=t(ie.prototype,"duckLabelFrames",[te],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),ne=ie))||ne)),r._RF.pop()}
  }
}
))

