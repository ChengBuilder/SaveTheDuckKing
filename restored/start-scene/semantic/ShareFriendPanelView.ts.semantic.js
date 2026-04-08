/**
 * Semantic view: chunks:///_virtual/ShareFriendPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Component
 * - a => _decorator
 * - b => AudioManager
 * - B => ReceivePanelView
 * - C => ResManager
 * - d => UIOpacity
 * - f => Sprite
 * - g => Label
 * - h => assetManager
 * - i => initializerDefineProperty
 * - k => TooYueManager
 * - l => Button
 * - m => ProgressBar
 * - n => inheritsLoose
 * - N => UIConfigTable
 * - o => assertThisInitialized
 * - p => Prefab
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => default
 * - u => tween
 * - v => instantiate
 * - w => GameCtrl
 * - y => find
 */
/**
 * Restored module: chunks:///_virtual/ShareFriendPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Component
 * - a => _decorator
 * - b => AudioManager
 * - B => ReceivePanelView
 * - C => ResManager
 * - d => UIOpacity
 * - f => Sprite
 * - g => Label
 * - h => assetManager
 * - i => initializerDefineProperty
 * - k => TooYueManager
 * - l => Button
 * - m => ProgressBar
 * - n => inheritsLoose
 * - N => UIConfigTable
 * - o => assertThisInitialized
 * - p => Prefab
 * - r => cclegacy
 * - s => Node
 * - S => GameModel
 * - t => applyDecoratedDescriptor
 * - T => default
 * - u => tween
 * - v => instantiate
 * - w => GameCtrl
 * - y => find
 */
System.register("chunks:///_virtual/ShareFriendPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./ConfigTable.ts","./TooYueManager.ts","./ServiceManager.ts","./ReceivePanelView.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Button */, c, u /* tween */, d /* UIOpacity */, h /* assetManager */, p /* Prefab */, f /* Sprite */, g /* Label */, m /* ProgressBar */, v /* instantiate */, y /* find */, _ /* Component */, b /* AudioManager */, S /* GameModel */, C /* ResManager */, w /* GameCtrl */, N /* UIConfigTable */, k /* TooYueManager */, T /* default */, B /* ReceivePanelView */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Button /* Button */,c=e.v3,u=e.tween /* tween */,d=e.UIOpacity /* UIOpacity */,h=e.assetManager /* assetManager */,p=e.Prefab /* Prefab */,f=e.Sprite /* Sprite */,g=e.Label /* Label */,m=e.ProgressBar /* ProgressBar */,v=e.instantiate /* instantiate */,y=e.find /* find */,_=e.Component /* Component */}
    ,function(e){
      b=e.AudioManager /* AudioManager */}
    ,function(e){
      S=e.GameModel /* GameModel */}
    ,function(e){
      C=e.ResManager /* ResManager */}
    ,function(e){
      w=e.GameCtrl /* GameCtrl */}
    ,function(e){
      N=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      k=e.TooYueManager /* TooYueManager */}
    ,function(e){
      T=e.default /* default */}
    ,function(e){
      B=e.ReceivePanelView /* ReceivePanelView */}
    ],execute:function(){
      var A,P,M,I,F,R,L,x,D,G,E,O,H,V,U,z,W,j,J,Y,q,K,X;
      r._RF.push({
      }
      ,"460393ZcutH/4YImrTSvUHa","ShareFriendPanelView",void 0);
      var Q=a.ccclass,Z=a.property;
      e("ShareFriendPanelView",(A=Q("ShareFriendPanelView"),P=Z(s),M=Z(s),I=Z(l),F=Z(l),R=Z(s),L=Z(s),x=Z(s),D=Z(s),G=Z(s),E=Z(s),A((V=t((H=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"black",V,o(t)),i(t,"panel",U,o(t)),i(t,"closeBtn",z,o(t)),i(t,"shareBtn",W,o(t)),i(t,"progressBarLabel",j,o(t)),i(t,"shareLabel",J,o(t)),i(t,"giftName",Y,o(t)),i(t,"duckNode",q,o(t)),i(t,"progressBar",K,o(t)),i(t,"propLabelNode",X,o(t)),t.shareStageProgress=null,t.currentNum=0,t.canClaimCurrentStage=!1,t.inviteBtnSpriteFrame=null,t.claimBtnSpriteFrame=null,t.propRewardNode=null,t.propRewardDefaultPosition=c(),t}
        n(t,e);
        var r=t.prototype;
        return r.onLoad=function(){
          this.initPanel()}
        ,r.start=function(){
          u(this.black.getComponent(d)).to(.1,{
            opacity:220}
          ).start(),u(this.panel).delay(.1).to(.3,{
            position:c(0,0,0)}
          ,{
            easing:"backOut"}
          ).call((function(){
            w.instance.btnCanTouch=!0}
          )).start()}
        ,r.onEnable=function(){
          this.registerEvents()}
        ,r.onDisable=function(){
          this.unregisterEvents(),h.getBundle("uiBundle").release(N.ShareFriendUI.path,p)}
        ,r.initPanel=function(){
          this.black.getComponent(d).opacity=0,this.panel.setPosition(0,S.instance.screenHeight),this.panel.setScale(1,1,1),this.cacheShareButtonState(),this.cacheRewardLayoutState(),this.refreshPanelState()}
        ,r.cacheShareButtonState=function(){
          var e;
          this.inviteBtnSpriteFrame=(null==(e=this.shareBtn.node.getComponent(f))?void 0:e.spriteFrame)||null}
        ,r.cacheRewardLayoutState=function(){
          !this.propRewardNode&&this.propLabelNode&&(this.propRewardNode=this.propLabelNode.parent),this.propRewardNode&&(this.propRewardDefaultPosition=this.propRewardNode.position.clone())}
        ,r.refreshPanelState=function(){
          this.shareStageProgress=S.instance.getShareStageProgress(k.shareUserCount),this.currentNum=this.shareStageProgress.currentInviteNum,this.canClaimCurrentStage=this.shareStageProgress.canClaimReward,this.initDuckNode(),this.initProgressBar(),this.initShareLabel(),this.updateShareButtonState()}
        ,r.initDuckNode=function(){
          var e,t=this,n=this.duckNode.getChildByName("duckSpr"),i=this.duckNode.getChildByName("duckName"),o=this.propLabelNode,r=this.propRewardNode,a=null==(e=this.shareStageProgress)?void 0:e.rewardConfig;
          if(n&&i&&o&&r&&a){
            if(o.getComponent(g).string="随机道具x"+a.propRewardCount,this.giftName.getComponent(g).string=a.stage+"阶奖励",!a.duckName)return this.duckNode.active=!1,void r.setPosition(c(0,this.propRewardDefaultPosition.y,this.propRewardDefaultPosition.z));
            this.duckNode.active=!0,r.setPosition(this.propRewardDefaultPosition),n.active=!0,i.getComponent(g).string=a.duckName;
            var s="tex/book/分享鸭/"+a.duckName+"/spriteFrame";
            C.instance.bundleLoad("uiBundle",s,null,(function(e,i){
              e?console.error(e):t.node&&t.node.isValid&&(i&&i.uv?n.getComponent(f).spriteFrame=i:console.warn("ShareFriendPanelView duck spriteFrame invalid:",s,i))}
            ))}
        }
        ,r.initProgressBar=function(){
          var e,t=(null==(e=this.shareStageProgress)?void 0:e.rewardConfig.inviteNeed)||1,n=Math.min(this.currentNum,t);
          this.progressBar.getComponent(m).progress=t>0?n/t:0,this.progressBarLabel.getComponent(g).string=n+"/"+t}
        ,r.initShareLabel=function(){
          var e;
          if(this.canClaimCurrentStage)this.shareLabel.getComponent(g).string="当前阶段奖励可领取";
          else{
            var t=(null==(e=this.shareStageProgress)?void 0:e.remainingInviteNum)||0;
            this.shareLabel.getComponent(g).string="再邀请"+t+"个新人可获得奖励"}
        }
        ,r.updateShareButtonState=function(){
          var e=this,t=this.shareBtn.node.getComponent(f);
          if(t&&this.inviteBtnSpriteFrame)return this.canClaimCurrentStage?void this.loadClaimButtonAssets((function(){
            e.node&&e.node.isValid&&e.canClaimCurrentStage&&(e.claimBtnSpriteFrame&&(t.spriteFrame=e.claimBtnSpriteFrame),e.shareBtn.interactable=!0)}
          )):(t.spriteFrame=this.inviteBtnSpriteFrame,void(this.shareBtn.interactable=!0))}
        ,r.loadClaimButtonAssets=function(e){
          var t=this;
          this.claimBtnSpriteFrame?null==e||e():C.instance.bundleLoad("uiBundle","tex/领取按钮/spriteFrame",null,(function(n,i){
            if(n)return console.error(n),void(null==e||e());
            t.claimBtnSpriteFrame=i,null==e||e()}
          ))}
        ,r.registerEvents=function(){
          this.shareBtn.node.on("click",this.onShare,this),this.closeBtn.node.on("click",this.onClose,this)}
        ,r.unregisterEvents=function(){
          this.shareBtn.node.off("click",this.onShare,this),this.closeBtn.node.off("click",this.onClose,this)}
        ,r.onClose=function(){
          var e=this;
          w.instance.btnCanTouch&&(w.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
            position:c(0,S.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy(),w.instance.btnCanTouch=!0}
          )).start())}
        ,r.onShare=function(){
          w.instance.btnCanTouch&&(this.canClaimCurrentStage?this.onClaimReward():this.onInviteShare())}
        ,r.onInviteShare=function(){
          var e=this;
          this.shareBtn.interactable=!1,w.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick"),u(this.panel).to(.3,{
            position:c(0,S.instance.screenHeight,0)}
          ,{
            easing:"backIn"}
          ).start(),u(this.black.getComponent(d)).delay(.3).to(.1,{
            opacity:0}
          ).call((function(){
            e.node.destroy()}
          )).start(),k._ins.shareApp(!1,null,this.shareFinishBack,this.shareErrBack)}
        ,r.onClaimReward=function(){
          if(this.shareStageProgress&&this.canClaimCurrentStage){
            this.shareBtn.interactable=!1,w.instance.btnCanTouch=!1,b.instance.playSound("ui/buttonClick");
            var e=this.shareStageProgress.rewardConfig,t=this.duckNode.getChildByName("duckSpr"),n=t?t.getComponent(f).spriteFrame:null;
            this.grantShareStageReward(this.shareStageProgress.currentStage),S.instance.shareLevel=this.shareStageProgress.claimedLevel+1,T.instance.setStorageToServer(),this.showShareFriendRewardPanel(e,n),this.refreshPanelState()}
        }
        ,r.grantShareStageReward=function(e){
          for(var t=S.instance.getShareRewardConfig(e),n=0;
          n<t.propRewardCount;
          n++)Math.random()<.5?S.instance.freeProp1Num=S.instance.freeProp1Num+1:S.instance.freeProp2Num=S.instance.freeProp2Num+1}
        ,r.showShareFriendRewardPanel=function(e,t){
          C.instance.bundleLoad("uiBundle",N.ReceiveUI.path,null,(function(n,i){
            if(n)return console.error(n),void(w.instance.btnCanTouch=!0);
            var o=v(i);
            o.setParent(y("Canvas")),o.getComponent(B).setShareFriendRewardPanel(e,t)}
          ))}
        ,r.shareFinishBack=function(){
          w.instance.btnCanTouch=!0}
        ,r.shareErrBack=function(){
          w.instance.btnCanTouch=!0}
        ,t}
      (_)).prototype,"black",[P],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),U=t(H.prototype,"panel",[M],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),z=t(H.prototype,"closeBtn",[I],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),W=t(H.prototype,"shareBtn",[F],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),j=t(H.prototype,"progressBarLabel",[R],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),J=t(H.prototype,"shareLabel",[L],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Y=t(H.prototype,"giftName",[x],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),q=t(H.prototype,"duckNode",[D],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),K=t(H.prototype,"progressBar",[G],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),X=t(H.prototype,"propLabelNode",[E],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),O=H))||O)),r._RF.pop()}
  }
}
))

