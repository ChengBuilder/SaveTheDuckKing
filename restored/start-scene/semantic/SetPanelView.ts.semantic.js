/**
 * Semantic view: chunks:///_virtual/SetPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => instantiate
 * - a => _decorator
 * - A => TooYueManager
 * - b => Color
 * - B => UIConfigTable
 * - c => SpriteFrame
 * - C => Component
 * - d => Label
 * - D => Game2Controller
 * - E => Game
 * - F => AutoManager
 * - g => assetManager
 * - G => default
 * - h => tween
 * - i => initializerDefineProperty
 * - I => EVENT_KEYS
 * - k => ResManager
 * - l => Button
 * - L => AdManager_ZJ
 * - m => Prefab
 * - M => releaseType
 * - n => inheritsLoose
 * - N => GameModel
 * - o => assertThisInitialized
 * - p => UIOpacity
 * - P => DuckController
 * - r => cclegacy
 * - R => HomeScene
 * - s => Node
 * - S => EditBox
 * - t => applyDecoratedDescriptor
 * - T => GameCtrl
 * - u => director
 * - v => Sprite
 * - w => AudioManager
 * - x => default
 * - y => find
 */
/**
 * Restored module: chunks:///_virtual/SetPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => instantiate
 * - a => _decorator
 * - A => TooYueManager
 * - b => Color
 * - B => UIConfigTable
 * - c => SpriteFrame
 * - C => Component
 * - d => Label
 * - D => Game2Controller
 * - E => Game
 * - F => AutoManager
 * - g => assetManager
 * - G => default
 * - h => tween
 * - i => initializerDefineProperty
 * - I => EVENT_KEYS
 * - k => ResManager
 * - l => Button
 * - L => AdManager_ZJ
 * - m => Prefab
 * - M => releaseType
 * - n => inheritsLoose
 * - N => GameModel
 * - o => assertThisInitialized
 * - p => UIOpacity
 * - P => DuckController
 * - r => cclegacy
 * - R => HomeScene
 * - s => Node
 * - S => EditBox
 * - t => applyDecoratedDescriptor
 * - T => GameCtrl
 * - u => director
 * - v => Sprite
 * - w => AudioManager
 * - x => default
 * - y => find
 */
System.register("chunks:///_virtual/SetPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./ConfigTable.ts","./TooYueManager.ts","./DuckController.ts","./Enum.ts","./AutoManager.ts","./HomeScene.ts","./AdManager_ZJ.ts","./ServiceManager.ts","./Game2Controller.ts","./EventManager.ts","./Game.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c /* SpriteFrame */, u /* director */, d /* Label */, h /* tween */, p /* UIOpacity */, f, g /* assetManager */, m /* Prefab */, v /* Sprite */, y /* find */, _ /* instantiate */, b /* Color */, S /* EditBox */, C /* Component */, w /* AudioManager */, N /* GameModel */, k /* ResManager */, T /* GameCtrl */, B /* UIConfigTable */, A /* TooYueManager */, P /* DuckController */, M /* releaseType */, I /* EVENT_KEYS */, F /* AutoManager */, R /* HomeScene */, L /* AdManager_ZJ */, x /* default */, D /* Game2Controller */, G /* default */, E /* Game */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.SpriteFrame /* SpriteFrame */,u=e.director /* director */,d=e.Label /* Label */,h=e.tween /* tween */,p=e.UIOpacity /* UIOpacity */,f=e.v3,g=e.assetManager /* assetManager */,m=e.Prefab /* Prefab */,v=e.Sprite /* Sprite */,y=e.find /* find */,_=e.instantiate /* instantiate */,b=e.Color /* Color */,S=e.EditBox /* EditBox */,C=e.Component /* Component */}
    ,function(e){
      w=e.AudioManager /* AudioManager */}
    ,function(e){
      N=e.GameModel /* GameModel */}
    ,function(e){
      k=e.ResManager /* ResManager */}
    ,function(e){
      T=e.GameCtrl /* GameCtrl */}
    ,function(e){
      B=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      A=e.TooYueManager /* TooYueManager */}
    ,function(e){
      P=e.DuckController /* DuckController */}
    ,function(e){
      M=e.releaseType /* releaseType */,I=e.EVENT_KEYS /* EVENT_KEYS */}
    ,function(e){
      F=e.AutoManager /* AutoManager */}
    ,function(e){
      R=e.HomeScene /* HomeScene */}
    ,function(e){
      L=e.AdManager_ZJ /* AdManager_ZJ */}
    ,function(e){
      x=e.default /* default */}
    ,function(e){
      D=e.Game2Controller /* Game2Controller */}
    ,function(e){
      G=e.default /* default */}
    ,function(e){
      E=e.Game /* Game */}
    ],execute:function(){
      var O,H,V,U,z,W,j,J,Y,q,K,X,Q,Z,$,ee,te,ne,ie,oe,re,ae,se,le,ce,ue,de,he,pe,fe,ge;
      r._RF.push({
      }
      ,"322a4nFP89ETLQtAVN/Y8eJ","SetPanelView",void 0);
      var me=a.ccclass,ve=a.property;
      e("SetPanelView",(O=me("SetPanelView"),H=ve(s),V=ve(s),U=ve(l),z=ve(l),W=ve(l),j=ve(l),J=ve(l),Y=ve(s),q=ve([c]),K=ve(s),X=ve(s),Q=ve(s),Z=ve(s),$=ve(s),O((ne=t((te=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",ne,o(t)),i(t,"panel",ie,o(t)),i(t,"closeBtn",oe,o(t)),i(t,"musicBtn",re,o(t)),i(t,"soundBtn",ae,o(t)),i(t,"vibrateBtn",se,o(t)),i(t,"goHomeBtn",le,o(t)),i(t,"ShortIdLabel",ce,o(t)),i(t,"changeSpriteFrame",ue,o(t)),i(t,"editNode",de,o(t)),i(t,"editNameNode",he,o(t)),i(t,"autoBtn",pe,o(t)),i(t,"closeBtnNode",fe,o(t)),i(t,"GMNode",ge,o(t)),t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          this.initPanel()}
        ,r.start=function(){
          "HomeScene"==u.getScene().name&&(this.goHomeBtn.node.active=!1),T.instance.canTouch=!1,this.ShortIdLabel.getComponent(d).string="ID:"+A.shortId,h(this.black.getComponent(p)).to(.1,{
            opacity:220}
          ).start(),h(this.panel).delay(.1).to(.3,{
            position:f(0,0,0)}
          ,{
            easing:"backOut"}
          ).call((function(){
            T.instance.btnCanTouch=!0}
          )).start()}
        ,r.onEnable=function(){
          this.registerEvents()}
        ,r.onDisable=function(){
          this.unregisterEvents(),g.getBundle("uiBundle").release(B.SetUI.path,m)}
        ,r.initPanel=function(){
          var e=this;
          N.instance.releaseType!=M.applet_ziJie&&(this.panel.getChildByName("baseMap").getChildByName("复制").active=!1),this.black.getComponent(p).opacity=0,this.panel.setPosition(0,N.instance.screenHeight),this.panel.setScale(1,1,1),[{
            btn:this.musicBtn,flag:"musicFlag",value:N.instance.musicFlag}
          ,{
            btn:this.soundBtn,flag:"soundFlag",value:N.instance.soundFlag}
          ,{
            btn:this.vibrateBtn,flag:"vibrateFlag",value:N.instance.vibrateFlag}
          ].forEach((function(t){
            var n=t.btn,i=t.value,o=n.node.getChildByName("point"),r=1===i?1:0,a=1===i?55:-55;
            o.getComponent(v).spriteFrame=e.changeSpriteFrame[r],o.setPosition(a,0)}
          ))}
        ,r.registerEvents=function(){
          this.closeBtn.node.on("click",this.onClose,this),this.musicBtn.node.on("click",this.onMusic,this),this.soundBtn.node.on("click",this.onSound,this),this.vibrateBtn.node.on("click",this.onVibrate,this),this.goHomeBtn.node.on("click",this.onGoHomeBtn,this)}
        ,r.unregisterEvents=function(){
          this.closeBtn.node.off("click",this.onClose,this),this.musicBtn.node.off("click",this.onMusic,this),this.soundBtn.node.off("click",this.onSound,this),this.vibrateBtn.node.off("click",this.onVibrate,this),this.goHomeBtn.node.off("click",this.onGoHomeBtn,this)}
        ,r.onClose=function(){
          var e=this;
          T.instance.btnCanTouch&&(T.instance.canTouch=!0,T.instance.btnCanTouch=!1,w.instance.playSound("ui/buttonClick"),h(this.panel).to(.3,{
            position:f(0,N.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),h(this.black.getComponent(p)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy(),T.instance.btnCanTouch=!0}
          )).start())}
        ,r.buttonSetting=function(e,t){
          var n=1==={
            musicFlag:N.instance.musicFlag,soundFlag:N.instance.soundFlag,vibrateFlag:N.instance.vibrateFlag}
          [e]?0:1;
          N.instance[e]=n,w.instance.playSound("ui/buttonClick");
          var i=t.node.getChildByName("point"),o=1===n?1:0,r=1===n?55:-55;
          i.getComponent(v).spriteFrame=this.changeSpriteFrame[o],i.setPosition(r,0)}
        ,r.onMusic=function(){
          this.buttonSetting("musicFlag",this.musicBtn),0==N.instance.musicFlag?w.instance.stopMusic():u.getScene().name!=N.instance.HomeSceneName?w.instance.playMusic("bgm/defaultGameplay",.5):7==y("Canvas").getComponent(R).bgType?w.instance.playMusic("bgm/pureColor",.5):u.getScene().name==N.instance.FruitSceneName?w.instance.playMusic("fruitGame/fruitBgm",.5):w.instance.playMusic("bgm/defaultGameplay",.5)}
        ,r.onSound=function(){
          this.buttonSetting("soundFlag",this.soundBtn)}
        ,r.onVibrate=function(){
          this.buttonSetting("vibrateFlag",this.vibrateBtn)}
        ,r.onGoHomeBtn=function(){
          var e=this;
          w.instance.playSound("ui/buttonClick"),A._ins.stopRecordVideo(),u.getScene().name==N.instance.DuckSceneName?A._ins.reportStage(N.instance.level,"end","giveup",0):u.getScene().name==N.instance.Game2SceneName?A._ins.reportStage(2e6+N.instance.level2,"end","giveup",0):u.getScene().name==N.instance.FruitSceneName&&A._ins.reportStage(3e6+N.instance.level,"end","giveup",0),u.getScene().name!=N.instance.PigeonSceneName&&u.getScene().name!=N.instance.CowSceneName&&u.getScene().name!=N.instance.Game2SceneName&&u.getScene().name!=N.instance.MathSceneName&&u.getScene().name!=N.instance.FruitSceneName?k.instance.bundleLoad("uiBundle",B.Set2UI.path,null,(function(t,n){
            if(t)return console.log(t),void(T.instance.btnCanTouch=!0);
            _(n).parent=y("Canvas/uiNode"),e.node.destroy()}
          )):u.loadScene(N.instance.HomeSceneName)}
        ,r.showGM=function(){
          u.getScene().name!=N.instance.PigeonSceneName&&(A.userMsg&&"HomeScene"!=u.getScene().name?(A.userMsg.userTags.includes("gm")||N.instance.releaseType==M.test_TEST)&&this.openGM():A.userMsg&&"HomeScene"==u.getScene().name?A.userMsg.userTags.includes("gm")&&this.openHomeGM():N.instance.releaseType==M.test_TEST&&"HomeScene"!=u.getScene().name?this.openGM():this.openHomeGM())}
        ,r.openGM=function(){
          this.GMNode.active=!0,F._ins.isAuto?(this.autoBtn.getChildByName("point").setPosition(55,0),this.autoBtn.getChildByName("point").getComponent(v).spriteFrame=this.changeSpriteFrame[1]):(this.autoBtn.getChildByName("point").setPosition(-55,0),this.autoBtn.getChildByName("point").getComponent(v).spriteFrame=this.changeSpriteFrame[0]),u.getScene().name!=N.instance.Game2SceneName&&u.getScene().name!=N.instance.FruitSceneName||(this.autoBtn.active=!1)}
        ,r.openHomeGM=function(){
          this.GMNode.active=!0,this.autoBtn.parent.active=!1,this.GMNode.getChildByName("baseMap").getChildByName("selectBg").active=!0,this.GMNode.getChildByName("baseMap").getChildByName("changeBtn").active=!0,this.GMNode.getChildByName("baseMap").getChildByName("胜利").active=!1,this.GMNode.getChildByName("baseMap").getChildByName("失败").active=!1,y("Canvas").getComponent(R).gmBtnType?this.GMNode.getChildByName("baseMap").getChildByName("changeBtn").children[0].getComponent(d).string="关闭主页按钮":this.GMNode.getChildByName("baseMap").getChildByName("changeBtn").children[0].getComponent(d).string="打开主页按钮",this.changeBtnColor(y("Canvas").getComponent(R).bgType)}
        ,r.changeHomeBg=function(e,t){
          void 0===e&&(e=null),console.log(e,t),"HomeScene"==u.getScene().name&&(y("Canvas").getComponent(R).bgType=t,y("Canvas").getComponent(R).initBg(),this.changeBtnColor(t)),N.bgNum=t,u.loadScene(N.instance.HomeSceneName)}
        ,r.changeBtnColor=function(e){
          for(var t=this.GMNode.getChildByName("baseMap").getChildByName("selectBg"),n=0;
          n<t.children.length;
          n++){
            t.children[n].getComponent(v).color=n==e?b.RED:b.WHITE}
        }
        ,r.closeGM=function(){
          this.GMNode.active=!1}
        ,r.JumpLevel=function(){
          var e=this.editNode.getComponent(S).string;
          if(""!=e){
            var t=e.split(" ").map(Number);
            t[0]&&(u.getScene().name==N.instance.Game2SceneName?N.instance.level2=t[0]:u.getScene().name==N.instance.DuckSceneName?N.instance.level=t[0]:u.getScene().name==N.instance.FruitSceneName&&(N.instance.level3=t[0]),x.instance.setStorageToServer()),t[1]&&(N.instance.freeProp1Num=t[1],N.instance.freeProp2Num=t[1],N.instance.freeProp3Num=t[1]),N.instance.duckLevelInformation=null}
          u.getScene().name==N.instance.Game2SceneName?u.loadScene(N.instance.Game2SceneName):u.getScene().name==N.instance.DuckSceneName?u.loadScene(N.instance.DuckSceneName):u.getScene().name==N.instance.FruitSceneName&&u.loadScene(N.instance.FruitSceneName)}
        ,r.ChangeHomeDuckSkin=function(){
          var e=this.editNameNode.getComponent(S).string;
          if(""!=e){
            var t=e;
            -1!=N.cockNameArr.indexOf(t)&&(N.instance.duckName=t),console.log(N.cockNameArr.indexOf(t),N.instance.duckName)}
          u.loadScene(N.instance.HomeSceneName)}
        ,r.LockAllDuck=function(){
          N.LockAllDuck=!0}
        ,r.changeAutoType=function(){
          var e=this;
          F._ins.isAuto=!F._ins.isAuto;
          var t=this.autoBtn.getChildByName("point");
          F._ins.isAuto?h(t).to(.2,{
            position:f(55,0,0)}
          ).call((function(){
            t.getComponent(v).spriteFrame=e.changeSpriteFrame[1]}
          )).delay(.2).call((function(){
            F._ins.start(),F._ins.AutoGetNail()}
          )).start():h(t).to(.2,{
            position:f(-55,0,0)}
          ).call((function(){
            t.getComponent(v).spriteFrame=e.changeSpriteFrame[0]}
          )).delay(.2).call((function(){
          }
          )).start()}
        ,r.changeHomeBtn=function(){
          G.instance.emit(I.CLOSE_HOME_BTN),y("Canvas").getComponent(R).gmBtnType?this.GMNode.getChildByName("baseMap").getChildByName("changeBtn").children[0].getComponent(d).string="关闭主页按钮":this.GMNode.getChildByName("baseMap").getChildByName("changeBtn").children[0].getComponent(d).string="打开主页按钮"}
        ,r.copyShortId=function(){
          var e=A.shortId;
          L._ins.setClipboardText(e)}
        ,r.winEffect=function(){
          u.getScene().name==N.instance.Game2SceneName?y("Canvas").getComponent(D).successEffect():u.getScene().name==N.instance.DuckSceneName?y("Canvas").getComponent(P).successEffect():u.getScene().name==N.instance.FruitSceneName&&y("Canvas").getComponent(E).gameWin(),this.node.destroy()}
        ,r.loseEffect=function(){
          u.getScene().name==N.instance.Game2SceneName?y("Canvas").getComponent(D).OverEffect():u.getScene().name==N.instance.DuckSceneName?y("Canvas").getComponent(P).OverEffect():u.getScene().name==N.instance.FruitSceneName&&y("Canvas").getComponent(E).gameEnd(),this.node.destroy()}
        ,t}
      (C)).prototype,"black",[H],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ie=t(te.prototype,"panel",[V],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),oe=t(te.prototype,"closeBtn",[U],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),re=t(te.prototype,"musicBtn",[z],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ae=t(te.prototype,"soundBtn",[W],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),se=t(te.prototype,"vibrateBtn",[j],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),le=t(te.prototype,"goHomeBtn",[J],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ce=t(te.prototype,"ShortIdLabel",[Y],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ue=t(te.prototype,"changeSpriteFrame",[q],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),de=t(te.prototype,"editNode",[K],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),he=t(te.prototype,"editNameNode",[X],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),pe=t(te.prototype,"autoBtn",[Q],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),fe=t(te.prototype,"closeBtnNode",[Z],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ge=t(te.prototype,"GMNode",[$],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ee=te))||ee)),r._RF.pop()}
  }
}
))

