/**
 * Semantic view: chunks:///_virtual/Game.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Vec3
 * - a => createClass
 * - A => Sprite
 * - b => find
 * - B => easing
 * - c => AudioClip
 * - C => macro
 * - d => Button
 * - D => Quat
 * - E => Component
 * - ee => TooYueManager
 * - f => Label
 * - F => DistanceJoint2D
 * - g => Graphics
 * - G => Vec2
 * - h => Material
 * - H => jumpTo
 * - i => inheritsLoose
 * - I => UITransform
 * - j => GameModel
 * - J => UIConfigTable
 * - k => tween
 * - K => default
 * - l => _decorator
 * - L => resources
 * - m => EditBox
 * - M => Color
 * - n => initializerDefineProperty
 * - N => UIOpacity
 * - o => assertThisInitialized
 * - O => GameCtl
 * - p => PolygonCollider2D
 * - P => Tween
 * - q => PropPanelView
 * - Q => EVENT_KEYS
 * - r => createForOfIteratorHelperLoose
 * - R => ERigidBody2DType
 * - s => cclegacy
 * - S => sys
 * - t => applyDecoratedDescriptor
 * - u => Node
 * - U => GyroscopeManager
 * - v => RigidBody2D
 * - V => FruitNodePool
 * - w => instantiate
 * - W => AudioManager
 * - x => SpriteFrame
 * - X => releaseType
 * - Y => GameCtrl
 * - z => ResManager
 * - Z => RevivePanelView
 */
/**
 * Restored module: chunks:///_virtual/Game.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Vec3
 * - a => createClass
 * - A => Sprite
 * - b => find
 * - B => easing
 * - c => AudioClip
 * - C => macro
 * - d => Button
 * - D => Quat
 * - E => Component
 * - ee => TooYueManager
 * - f => Label
 * - F => DistanceJoint2D
 * - g => Graphics
 * - G => Vec2
 * - h => Material
 * - H => jumpTo
 * - i => inheritsLoose
 * - I => UITransform
 * - j => GameModel
 * - J => UIConfigTable
 * - k => tween
 * - K => default
 * - l => _decorator
 * - L => resources
 * - m => EditBox
 * - M => Color
 * - n => initializerDefineProperty
 * - N => UIOpacity
 * - o => assertThisInitialized
 * - O => GameCtl
 * - p => PolygonCollider2D
 * - P => Tween
 * - q => PropPanelView
 * - Q => EVENT_KEYS
 * - r => createForOfIteratorHelperLoose
 * - R => ERigidBody2DType
 * - s => cclegacy
 * - S => sys
 * - t => applyDecoratedDescriptor
 * - u => Node
 * - U => GyroscopeManager
 * - v => RigidBody2D
 * - V => FruitNodePool
 * - w => instantiate
 * - W => AudioManager
 * - x => SpriteFrame
 * - X => releaseType
 * - Y => GameCtrl
 * - z => ResManager
 * - Z => RevivePanelView
 */
System.register("chunks:///_virtual/Game.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameCtl.ts","./JumpTween.ts","./FruitNodePool.ts","./GyroscopeManager.ts","./ResManager.ts","./AudioManager.ts","./GameModel2.ts","./ConfigTable.ts","./GameCtrl.ts","./PropPanelView.ts","./EventManager.ts","./Enum.ts","./RevivePanelView.ts","./Util.ts","./TooYueManager.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* initializerDefineProperty */, i /* inheritsLoose */, o /* assertThisInitialized */, r /* createForOfIteratorHelperLoose */, a /* createClass */, s /* cclegacy */, l /* _decorator */, c /* AudioClip */, u /* Node */, d /* Button */, h /* Material */, p /* PolygonCollider2D */, f /* Label */, g /* Graphics */, m /* EditBox */, v /* RigidBody2D */, y, _ /* Vec3 */, b /* find */, S /* sys */, C /* macro */, w /* instantiate */, N /* UIOpacity */, k /* tween */, T, B /* easing */, A /* Sprite */, P /* Tween */, M /* Color */, I /* UITransform */, F /* DistanceJoint2D */, R /* ERigidBody2DType */, L /* resources */, x /* SpriteFrame */, D /* Quat */, G /* Vec2 */, E /* Component */, O /* GameCtl */, H /* jumpTo */, V /* FruitNodePool */, U /* GyroscopeManager */, z /* ResManager */, W /* AudioManager */, j /* GameModel */, J /* UIConfigTable */, Y /* GameCtrl */, q /* PropPanelView */, K /* default */, X /* releaseType */, Q /* EVENT_KEYS */, Z /* RevivePanelView */, $, ee /* TooYueManager */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.initializerDefineProperty /* initializerDefineProperty */,i=e.inheritsLoose /* inheritsLoose */,o=e.assertThisInitialized /* assertThisInitialized */,r=e.createForOfIteratorHelperLoose /* createForOfIteratorHelperLoose */,a=e.createClass /* createClass */}
    ,function(e){
      s=e.cclegacy /* cclegacy */,l=e._decorator /* _decorator */,c=e.AudioClip /* AudioClip */,u=e.Node /* Node */,d=e.Button /* Button */,h=e.Material /* Material */,p=e.PolygonCollider2D /* PolygonCollider2D */,f=e.Label /* Label */,g=e.Graphics /* Graphics */,m=e.EditBox /* EditBox */,v=e.RigidBody2D /* RigidBody2D */,y=e.sp,_=e.Vec3 /* Vec3 */,b=e.find /* find */,S=e.sys /* sys */,C=e.macro /* macro */,w=e.instantiate /* instantiate */,N=e.UIOpacity /* UIOpacity */,k=e.tween /* tween */,T=e.v3,B=e.easing /* easing */,A=e.Sprite /* Sprite */,P=e.Tween /* Tween */,M=e.Color /* Color */,I=e.UITransform /* UITransform */,F=e.DistanceJoint2D /* DistanceJoint2D */,R=e.ERigidBody2DType /* ERigidBody2DType */,L=e.resources /* resources */,x=e.SpriteFrame /* SpriteFrame */,D=e.Quat /* Quat */,G=e.Vec2 /* Vec2 */,E=e.Component /* Component */}
    ,function(e){
      O=e.GameCtl /* GameCtl */}
    ,function(e){
      H=e.jumpTo /* jumpTo */}
    ,function(e){
      V=e.FruitNodePool /* FruitNodePool */}
    ,function(e){
      U=e.GyroscopeManager /* GyroscopeManager */}
    ,function(e){
      z=e.ResManager /* ResManager */}
    ,function(e){
      W=e.AudioManager /* AudioManager */}
    ,function(e){
      j=e.GameModel /* GameModel */}
    ,function(e){
      J=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      Y=e.GameCtrl /* GameCtrl */}
    ,function(e){
      q=e.PropPanelView /* PropPanelView */}
    ,function(e){
      K=e.default /* default */}
    ,function(e){
      X=e.releaseType /* releaseType */,Q=e.EVENT_KEYS /* EVENT_KEYS */}
    ,function(e){
      Z=e.RevivePanelView /* RevivePanelView */}
    ,function(e){
      $=e.Util}
    ,function(e){
      ee=e.TooYueManager /* TooYueManager */}
    ],execute:function(){
      var te,ne,ie,oe,re,ae,se,le,ce,ue,de,he,pe,fe,ge,me,ve,ye,_e,be,Se,Ce,we,Ne,ke,Te,Be,Ae,Pe,Me,Ie,Fe,Re,Le,xe,De,Ge,Ee,Oe,He,Ve,Ue,ze,We,je,Je,Ye,qe,Ke,Xe,Qe,Ze,$e,et,tt,nt,it,ot,rt,at,st,lt,ct,ut,dt,ht,pt,ft,gt,mt,vt,yt,_t,bt,St,Ct,wt,Nt,kt,Tt,Bt,At,Pt,Mt,It,Ft,Rt,Lt,xt,Dt,Gt,Et,Ot,Ht,Vt,Ut,zt,Wt,jt,Jt,Yt,qt,Kt,Xt,Qt,Zt;
      s._RF.push({
      }
      ,"d8904/rVBtIqbKWtNCKX1ux","Game",void 0);
      var $t=l.ccclass,en=l.property,tn=e("NamedAudioClip",(te=$t("NamedAudioClip"),ne=en({
        tooltip:"逻辑 id，如 eliminate1、eliminate2、btn_click"}
      ),ie=en(c),te((ae=t((re=function(){
        n(this,"id",ae,this),n(this,"clip",se,this)}
      ).prototype,"id",[ne],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return""}
      }
      ),se=t(re.prototype,"clip",[ie],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),oe=re))||oe));
      e("Game",(le=$t("Game"),ce=en(u),ue=en(u),de=en(u),he=en(u),pe=en(u),fe=en(d),ge=en(d),me=en(u),ve=en(h),ye=en(u),_e=en(d),be=en(d),Se=en(d),Ce=en(d),we=en(u),Ne=en(u),ke=en(p),Te=en(p),Be=en(p),Ae=en(u),Pe=en(u),Me=en(u),Ie=en(u),Fe=en(u),Re=en(f),Le=en(f),xe=en(u),De=en(u),Ge=en(g),Ee=en(m),Oe=en(d),He=en(d),Ve=en(d),Ue=en(f),ze=en(f),We=en(u),je=en(f),Je=en(u),Ye=en(u),qe=en(u),Ke=en(u),Xe=en(u),Qe=en(u),Ze=en([u]),$e=en({
        type:[tn],tooltip:"按 id 匹配；连击需配置 eliminate1~eliminate8，可混其它 id"}
      ),et=en({
        type:v,displayName:"槽位锚刚体",tooltip:"槽内水果稳定后与此刚体建距离关节，防止被挤出槽外"}
      ),tt=en(u),nt=en(y.Skeleton),le((rt=t((ot=function(e){
        function t(){
          for(var t,i=arguments.length,r=new Array(i),a=0;
          a<i;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,n(t,"layContent",rt,o(t)),n(t,"layDrop",at,o(t)),n(t,"nodeFruit",st,o(t)),n(t,"nodeCheck",lt,o(t)),n(t,"nodeFruitUI",ct,o(t)),n(t,"btnRestart",ut,o(t)),n(t,"btnNext",dt,o(t)),n(t,"nodeCheckDropLast",ht,o(t)),n(t,"highlightMaterial",pt,o(t)),n(t,"nodeMouth",ft,o(t)),n(t,"btnRefresh",gt,o(t)),n(t,"btnClean",mt,o(t)),n(t,"btnRevive",vt,o(t)),n(t,"btnPrint",yt,o(t)),n(t,"nodeNoTouch",_t,o(t)),n(t,"nodeAni",bt,o(t)),n(t,"nodeGround1",St,o(t)),n(t,"nodeGround2",Ct,o(t)),n(t,"nodeSlots",wt,o(t)),n(t,"nodeHoleLBack",Nt,o(t)),n(t,"nodeHoleRBack",kt,o(t)),n(t,"nodeHoleLFront",Tt,o(t)),n(t,"nodeHoleRFront",Bt,o(t)),n(t,"layHole",At,o(t)),n(t,"labelHoleL",Pt,o(t)),n(t,"labelHoleR",Mt,o(t)),n(t,"nodePoint",It,o(t)),n(t,"layPoint",Ft,o(t)),n(t,"graphics",Rt,o(t)),n(t,"editLevel",Lt,o(t)),n(t,"btnSetLevel",xt,o(t)),n(t,"btnGyroL",Dt,o(t)),n(t,"btnGyroR",Gt,o(t)),n(t,"lblLevel",Et,o(t)),n(t,"lblRemaining",Ot,o(t)),n(t,"nodeTip",Ht,o(t)),n(t,"lblReason",Vt,o(t)),n(t,"layCloud",Ut,o(t)),n(t,"nodeCloud",zt,o(t)),n(t,"layBackHole",Wt,o(t)),n(t,"nodeBackHole",jt,o(t)),n(t,"layFrontHole",Jt,o(t)),n(t,"nodeFrontHole",Yt,o(t)),n(t,"nodeLevelMap",qt,o(t)),n(t,"namedAudioClips",Kt,o(t)),n(t,"slotJoint",Xt,o(t)),n(t,"uiNode",Qt,o(t)),t._ctl=void 0,t._slotAnchorJoints=new Map,t._fruitPool=null,t._cleanBtnCooldownSec=1,t._spriteFrameCache=new Map,t._polyVertsPool={
          }
          ,t._ropeTmpA=new _,t._ropeTmpB=new _,t._ropeFruitJointMaxLength=30,t._lastRopeFruitNodes=new Set,t._layPointFollowOffset=new _,t._ropeJointApplyGen=0,t._ropePostSyncDrawGen=0,t._ropeDrawSuspended=!1,t._lastHudRemaining=-1,t._lastHudRemainingDisplay="",t._failTransitionStarted=!1,t._failSpriteColorBackup=new Map,t._cloudSpawnIntervalSec=8,t._rowHoleBackDecor=new Map,t._rowHoleFrontDecor=new Map,t._lastRowHoleLblCount=new Map,t._lastHoleQueueLabelL=void 0,t._lastHoleQueueLabelR=void 0,t._rowHoleBackSlotLocal=new _,t._rowHoleBackWorld=new _,t._isShowWarning=!1,t._isOpenGyroscope=!1,t._reviveCount=1,t._prop1Count=3,t._prop2Count=3,t._maxRevivePerLevel=1,t._maxProp1PerLevel=3,t._maxProp2PerLevel=3,n(t,"spMouth",Zt,o(t)),t._onGyroStartDelayed=function(){
            t.isValid&&t._resolveGyroscopePlatformFromSys()&&U.instance.start((function(e,n){
              t.isValid&&"playing"===t._ctl.getGameState()&&t._ctl.moveFruitsByGyroscope(e,n)}
            ))}
          ,t._onCleanBtnCooldownEnd=function(){
            var e;
            t.isValid&&null!=(e=t.btnClean)&&e.isValid&&(t.btnClean.interactable=!0)}
          ,t._blindBoxShadowId=1,t._blindRevealSpcDuration=.2,t._startLayContentWorldY=840,t}
        i(t,e);
        var s=t.prototype;
        return s.onLoad=function(){
          var e=this;
          W.instance.playMusic("fruitGame/fruitBgm",.5),this._ctl=new O(this,j.instance.level3),this.nodeTip&&(this.nodeTip.active=!1),this.btnNext&&this.btnNext.node.on(d.EventType.CLICK,this._onBtnNext,this),this.btnRestart&&this.btnRestart.node.on(d.EventType.CLICK,this._onBtnRestart,this),this.btnRefresh&&this.btnRefresh.node.on(d.EventType.CLICK,this._onBtnRefresh,this),this.btnClean&&this.btnClean.node.on(d.EventType.CLICK,this._onBtnClean,this),this.btnPrint&&this.btnPrint.node.on(d.EventType.CLICK,this._onBtnPrint,this),this.btnRevive&&this.btnRevive.node.on(d.EventType.CLICK,this._onBtnRevive,this),this.btnSetLevel&&this.btnSetLevel.node.on(d.EventType.CLICK,this._onBtnSetLevel,this),this.btnGyroL&&this.btnGyroL.node.on(d.EventType.CLICK,this._onBtnGyroL,this),this.btnGyroR&&this.btnGyroR.node.on(d.EventType.CLICK,this._onBtnGyroR,this),this.nodeNoTouch&&(this.nodeNoTouch.active=!1),this.nodePoint&&(this.nodePoint.active=!1),this.nodeCloud&&(this.nodeCloud.active=!1),this.nodeBackHole&&(this.nodeBackHole.active=!1),this.nodeFrontHole&&(this.nodeFrontHole.active=!1),this.nodeFruit&&(this._fruitPool=new V(this.nodeFruit)),this.updateFreePropNum(),this._captureLayPointFollowOffset(),this.spMouth.setCompleteListener((function(){
            e._setMouthAnim(1)}
          )),this.registerEvent(),this.gmLabelUpdate()}
        ,s.updateFreePropNum=function(){
          if(j.instance.freeProp2Num>0){
            var e=this.btnRefresh.node.children[0];
            e.active=!0,e.children[0].getComponent(f).string=j.instance.freeProp2Num.toString()}
          if(j.instance.freeProp1Num>0){
            var t=this.btnClean.node.children[0];
            t.active=!0,t.children[0].getComponent(f).string=j.instance.freeProp1Num.toString()}
        }
        ,s.gmLabelUpdate=function(){
          var e=b("Canvas/GameGuide");
          (j.instance.releaseType==X.test_TEST||ee.userMsg&&ee.userMsg.userTags.includes("gm"))&&(e.active=!0,e.getComponent(f).string="首页-水果大胃王")}
        ,s.registerEvent=function(){
          K.instance.on(Q.PROP1,this.doClean,this),K.instance.on(Q.PROP2,this.doRefresh,this),K.instance.on(Q.REVIVE,this.doRevive,this),K.instance.on(Q.GAME_END,this.doGameEnd,this),K.instance.on(Q.REPLAY,this.doReplay,this),K.instance.on(Q.NEXT_LEVEL,this.doNextLevel,this)}
        ,s._setMouthAnim=function(e){
          var t;
          if(null!=(t=this.spMouth)&&t.isValid)switch(e){
            case 1:this.spMouth.timeScale=1,this.spMouth.setAnimation(0,"standby",!1);
            break;
            case 2:this.spMouth.timeScale=1,this.spMouth.setAnimation(0,"eat",!1)}
        }
        ,s._setNoTouch=function(e){
          this.nodeNoTouch&&(this.nodeNoTouch.active=e)}
        ,s._resolveGyroscopePlatformFromSys=function(){
          var e=S.platform;
          return e===S.Platform.WECHAT_GAME||e===S.Platform.WECHAT_MINI_PROGRAM?"wx":e===S.Platform.BYTEDANCE_MINI_GAME?"tt":null}
        ,s.start=function(){
          var e;
          Y.instance.canTouch=!0,Y.instance.btnCanTouch=!0,Y.instance.gameIsOver=!1,this.createSetBtn(),this._lastHudRemaining=-1,this._ctl.startGame(),this._refreshHudLabels(),null!=(e=this.editLevel)&&e.isValid&&(this.editLevel.string=String(this._ctl.getCurrentLevel()));
          var t=this._resolveGyroscopePlatformFromSys();
          t&&this._isOpenGyroscope&&(U.instance.platform=t,this.scheduleOnce(this._onGyroStartDelayed,1)),this.schedule(this._spawnCloud,this._cloudSpawnIntervalSec,C.REPEAT_FOREVER,0),this._spawnCloud()}
        ,s.createSetBtn=function(){
          var e=this;
          z.instance.bundleLoad("uiBundle",J.setBtn.path,null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=w(n);
              i.parent=e.node;
              var o=i.getComponent(N);
              o.opacity=0;
              var r=i.scale.x;
              k(i).delay(0).call((function(){
                o.opacity=255,i.setScale(0,0,0)}
              )).to(.1,{
                scale:T(r,r,r)}
              ).start()}
          }
          ))}
        ,s._spawnCloud=function(){
          var e,t;
          if(null!=(e=this.layCloud)&&e.isValid&&null!=(t=this.nodeCloud)&&t.isValid){
            var n=w(this.nodeCloud);
            n.parent=this.layCloud,n.active=!0;
            var i=Math.random()<.5,o=.3+.5*Math.random();
            n.setScale(o,o,1);
            var r=500*Math.random()-100,a=i?-800:800,s=i?800:-800;
            n.setPosition(a,r,0);
            var l=50+40*Math.random(),c=Math.max(10,1600/l);
            k(n).to(c,{
              position:new _(s,r,0)}
            ,{
              easing:B.linear}
            ).call((function(){
              n.isValid&&n.destroy()}
            )).start()}
        }
        ,s._onBtnNext=function(){
          this._resetCleanButtonCooldown(),this._lastHudRemaining=-1,console.log("aaaa"),j.instance.level3++,this._ctl.onBtnNext()}
        ,s._onBtnRestart=function(){
          W.instance.playSound("ui/buttonClick"),this._resetCleanButtonCooldown(),this._lastHudRemaining=-1,this._ctl.onBtnRestart()}
        ,s._onBtnRefresh=function(){
          var e=this,t=!1;
          if(j.instance.freeProp2Num>0){
            t=!0,j.instance.freeProp2Num--;
            var n=this.btnRefresh.node.children[0];
            n.children[0].getComponent(f).string=j.instance.freeProp2Num.toString(),j.instance.freeProp2Num<=0&&(n.active=!1)}
          if(W.instance.playSound("ui/buttonClick"),t)this.doRefresh(t);
          else{
            if(this._prop2Count<=0)return;
            z.instance.bundleLoad("uiBundle",J.PropUI.path,null,(function(t,n){
              if(t)console.log(t);
              else{
                var i=w(n);
                i.parent=e.uiNode,i.getComponent(q).setPanel(1)}
            }
            ))}
        }
        ,s.doRefresh=function(e){
          if(!e){
            if(this._prop2Count<=0)return;
            this._prop2Count--,this._applyPerLevelPropReviveUi()}
          this._ctl.onBtnShuffle()}
        ,s._onBtnClean=function(){
          var e,t=this;
          if(null!=(e=this.btnClean)&&e.interactable){
            W.instance.playSound("ui/buttonClick");
            var n=!1;
            if(j.instance.freeProp1Num>0){
              n=!0,j.instance.freeProp1Num--;
              var i=this.btnClean.node.children[0];
              i.children[0].getComponent(f).string=j.instance.freeProp1Num.toString(),j.instance.freeProp1Num<=0&&(i.active=!1)}
            if(n)this.doClean(n);
            else{
              if(this._prop1Count<=0)return;
              z.instance.bundleLoad("uiBundle",J.PropUI.path,null,(function(e,n){
                if(e)console.log(e);
                else{
                  var i=w(n);
                  i.parent=t.uiNode,i.getComponent(q).setPanel(0)}
              }
              ))}
          }
        }
        ,s.doClean=function(e){
          if(!e){
            if(this._prop1Count<=0)return;
            return this._prop1Count--,this._applyPerLevelPropReviveUi(),void this._ctl.onBtnClean()}
          this.btnClean.interactable=!1,this.unschedule(this._onCleanBtnCooldownEnd),this.scheduleOnce(this._onCleanBtnCooldownEnd,this._cleanBtnCooldownSec),this._ctl.onBtnClean()}
        ,s.doRevive=function(){
          this._reviveCount--,this._ctl.onBtnRevive()}
        ,s._resetCleanButtonCooldown=function(){
          var e;
          this.unschedule(this._onCleanBtnCooldownEnd),null!=(e=this.btnClean)&&e.isValid&&(this.btnClean.interactable=!0)}
        ,s._applyPerLevelPropReviveUi=function(){
          var e,t;
          if(null!=(e=this.btnClean)&&e.isValid){
            var n=this._prop1Count>0;
            this.btnClean.interactable=n;
            var i=this.btnClean.getComponent(A);
            i&&(i.grayscale=!n)}
          if(null!=(t=this.btnRefresh)&&t.isValid){
            var o=this._prop2Count>0;
            this.btnRefresh.interactable=o;
            var r=this.btnRefresh.getComponent(A);
            r&&(r.grayscale=!o)}
        }
        ,s.resetLevelPropAndReviveLimits=function(){
          this._reviveCount=this._maxRevivePerLevel,this._prop1Count=this._maxProp1PerLevel,this._prop2Count=this._maxProp2PerLevel,this._resetCleanButtonCooldown(),this._applyPerLevelPropReviveUi()}
        ,s._onBtnPrint=function(){
          this._ctl.printDebugInfo()}
        ,s._onBtnRevive=function(){
          this._reviveCount<=0||(W.instance.playSound("ui/buttonClick"),this._ctl.onBtnRevive())}
        ,s._onBtnGyroL=function(){
          this._ctl.moveFruitsByGyroscope(-5,0)}
        ,s._onBtnGyroR=function(){
          this._ctl.moveFruitsByGyroscope(5,0)}
        ,s._onBtnSetLevel=function(){
          var e,t,n;
          this._resetCleanButtonCooldown();
          var i=null!=(e=null==(t=this.editLevel)||null==(t=t.string)?void 0:t.trim())?e:"",o=parseInt(i,10);
          Number.isFinite(o)?(this._lastHudRemaining=-1,this._ctl.setLevelAndStart(o),null!=(n=this.editLevel)&&n.isValid&&(this.editLevel.string=String(this._ctl.getCurrentLevel()))):console.warn("[Game] 请输入有效关卡数字")}
        ,s._resetFailTransitionState=function(){
          var e;
          null!=(e=this.nodeTip)&&e.isValid&&(P.stopAllByTarget(this.nodeTip),this.nodeTip.angle=0,this.nodeTip.active=!1),this._restoreFailSpriteColors(),this._failTransitionStarted=!1}
        ,s._restoreFailSpriteColors=function(){
          for(var e,t=r(this._failSpriteColorBackup);
          !(e=t()).done;
          ){
            var n=e.value,i=n[0];
            n[1],null!=i&&i.isValid&&(P.stopAllByTarget(i),i.color=new M(255,255,255,255))}
          this._failSpriteColorBackup.clear()}
        ,s._playFailSlotFruitColorTween=function(e){
          this._restoreFailSpriteColors();
          for(var t,n=[],i=r(this._ctl.getSlottedFruitNodesSnapshot());
          !(t=i()).done;
          ){
            var o,a=null==(o=t.value.getChildByName("sprIcon"))?void 0:o.getComponent(A);
            null!=a&&a.isValid&&(this._failSpriteColorBackup.set(a,a.color.clone()),P.stopAllByTarget(a),a.color=new M(255,255,255,255),n.push(a))}
          if(0!==n.length)for(var s=n.length,l=function(){
            --s<=0&&(null==e||e())}
          ,c=0,u=n;
          c<u.length;
          c++){
            var d=u[c];
            k(d).to(.5,{
              color:new M(255,90,90,255)}
            ,{
              easing:B.quadOut}
            ).to(.5,{
              color:new M(158,158,158,255)}
            ,{
              easing:B.sineIn}
            ).call(l).start()}
          else null==e||e()}
        ,s._startFailTransition=function(){
          var e=this;
          this.setNoTouchActive(!0);
          var t=this._ctl.getLoseKind(),n=null;
          z.instance.bundleLoad("DuckBundle","prefab/FullNode",null,(function(i,o){
            i?console.log(i):((n=w(o)).parent=e.node,n.getComponent(N).opacity=0,n.setPosition(0,-600,0),"dead_end"===t?(n.getChildByName("无法消除").active=!0,n.getChildByName("槽位已满").active=!1):(n.getChildByName("槽位已满").active=!0,n.getChildByName("无法消除").active=!1),k(n.getComponent(N)).delay(.5).call((function(){
              W.instance.playSound("fruitGame/slotFull")}
            )).to(.3,{
              opacity:255}
            ).delay(1.5).to(.3,{
              opacity:0}
            ).call((function(){
              n.destroy(),e._dealEnd()}
            )).start(),k(n).delay(.5).by(.3,{
              position:T(0,600,0)}
            ).start())}
          ))}
        ,s.doGameEnd=function(e,t){
          void 0!==e?e?this.gameWin():this._failTransitionStarted||(this._failTransitionStarted=!0,this._startFailTransition()):this.gameEnd()}
        ,s._dealEnd=function(){
          var e=this;
          this._resetFailTransitionState(),this._reviveCount>0?z.instance.bundleLoad("uiBundle",J.ReviveUI.path,null,(function(t,n){
            if(t)console.log(t);
            else{
              e.setNoTouchActive(!1);
              var i=w(n);
              i.parent=e.uiNode,i.getComponent(Z).setRevivePanel(e._reviveCount)}
          }
          )):(this.setNoTouchActive(!1),this.gameEnd())}
        ,s.gameEnd=function(){
          var e=this;
          ee._ins.reportStage(3e6+j.instance.level3,"end","lose",0),j.instance.failNum_Game3++,W.instance.stopMusic(),z.instance.bundleLoad("uiBundle",J.OverUI.path,null,(function(t,n){
            t?console.log(t):w(n).parent=e.uiNode}
          ))}
        ,s.gameWin=function(){
          var e=this;
          ee._ins.reportStage(3e6+j.instance.level3,"end","win",0),z.instance.bundleLoad("uiBundle",J.SuccessUI.path,null,(function(t,n){
            t?console.log(t):w(n).parent=e.uiNode}
          ))}
        ,s.doReplay=function(){
          this.updateFreePropNum(),this._ctl.onBtnRestart()}
        ,s.doNextLevel=function(){
          this.updateFreePropNum(),this._ctl.onBtnNext()}
        ,s._refreshHudLabels=function(){
          var e,t;
          if(null!=(e=this.lblLevel)&&e.isValid&&(this.lblLevel.string=""+this._ctl.getCurrentLevel()),null!=(t=this.lblRemaining)&&t.isValid){
            var n=this._ctl.getRemainingFruitCountForHud(),i=(this._ctl.getLevelTotalFruits(),""+n);
            i!==this._lastHudRemainingDisplay&&(this.lblRemaining.string=i,this._lastHudRemaining>=0&&n!==this._lastHudRemaining&&this._playRemainingLabelPop(),this._lastHudRemaining=n,this._lastHudRemainingDisplay=i)}
        }
        ,s._playRemainingLabelPop=function(){
          var e;
          this._playLabelNodePop(null==(e=this.lblRemaining)?void 0:e.node)}
        ,s._playLabelNodePop=function(e){
          null!=e&&e.isValid&&(P.stopAllByTarget(e),e.setScale(1,1,1),k(e).to(.09,{
            scale:new _(1.18,1.18,1)}
          ,{
            easing:B.quadOut}
          ).to(.12,{
            scale:new _(1,1,1)}
          ,{
            easing:B.sineOut}
          ).start())}
        ,s.update=function(e){
          this._ctl.update(e),this._syncRowHoleLayerDecorationsWorld(this.layBackHole,this._rowHoleBackDecor),this._syncRowHoleLayerDecorationsWorld(this.layFrontHole,this._rowHoleFrontDecor)}
        ,s.lateUpdate=function(e){
          this._ctl.lateUpdate(e),this._refreshHudLabels(),0===this._ropePostSyncDrawGen&&this._drawRope()}
        ,s._setRowHoleDecorWorldFromLayContent=function(e,t,n){
          var i=this.layContent,o=null==i?void 0:i.getComponent(I);
          null!=i&&i.isValid&&null!=e&&e.isValid&&o&&(this._rowHoleBackSlotLocal.set(t,n,0),o.convertToWorldSpaceAR(this._rowHoleBackSlotLocal,this._rowHoleBackWorld),e.setWorldPosition(this._rowHoleBackWorld))}
        ,s._syncRowHoleLayerDecorationsWorld=function(e,t){
          if(null!=e&&e.isValid&&0!==t.size)for(var n,i=r(t.values());
          !(n=i()).done;
          ){
            var o,a=n.value;
            null!=(o=a.node)&&o.isValid&&this._setRowHoleDecorWorldFromLayContent(a.node,a.localX,a.localY)}
        }
        ,s._drawRope=function(){
          var e=this.graphics,t=null==e?void 0:e.node,n=this.layPoint;
          if(null!=e&&e.isValid&&null!=t&&t.isValid&&null!=n&&n.isValid&&(e.clear(),!this._ropeDrawSuspended)){
            var i=this._ctl.getRopeBindingsSnapshot();
            if(0!==i.length){
              t.getWorldPosition(this._ropeTmpA);
              var o=t.getComponent(I);
              if(o){
                for(var r=n.children,a=0,s=!1,l=0;
                l<i.length;
                l++){
                  var c,u,d=i[l],h=[d.nodeA,d.nodeB],p=d.worldPoints.length;
                  if(a+p>r.length)break;
                  if(null!=(c=h[0])&&c.isValid&&null!=(u=h[1])&&u.isValid){
                    h[0].getWorldPosition(this._ropeTmpA),o.convertToNodeSpaceAR(this._ropeTmpA,this._ropeTmpB),e.moveTo(this._ropeTmpB.x,this._ropeTmpB.y),s=!0;
                    for(var f=0;
                    f<p;
                    f++){
                      var g=r[a+f];
                      null!=g&&g.isValid&&(g.getWorldPosition(this._ropeTmpA),o.convertToNodeSpaceAR(this._ropeTmpA,this._ropeTmpB),e.lineTo(this._ropeTmpB.x,this._ropeTmpB.y))}
                    a+=p,h[1].getWorldPosition(this._ropeTmpA),o.convertToNodeSpaceAR(this._ropeTmpA,this._ropeTmpB),e.lineTo(this._ropeTmpB.x,this._ropeTmpB.y)}
                  else a+=p}
                s&&e.stroke()}
            }
          }
        }
        ,s.onDestroy=function(){
          var e;
          if(null==(e=this._fruitPool)||e.clear(),this.unschedule(this._onGyroStartDelayed),this.unschedule(this._spawnCloud),this._resolveGyroscopePlatformFromSys()){
            var t=U.instance;
            t.isRunning&&t.stop()}
          K.instance.off(Q.PROP1,this.doClean,this),K.instance.off(Q.PROP2,this.doRefresh,this),K.instance.off(Q.REVIVE,this.doRevive,this),K.instance.off(Q.GAME_END,this.doGameEnd,this),K.instance.off(Q.REPLAY,this.doReplay,this),K.instance.off(Q.NEXT_LEVEL,this.doNextLevel,this)}
        ,s.getLayContent=function(){
          return this.layContent}
        ,s.getNodeLevelMap=function(){
          var e;
          return null!=(e=this.nodeLevelMap)?e:[]}
        ,s.getLayHole=function(){
          var e;
          return null!=(e=this.layHole)&&e.isValid?this.layHole:null}
        ,s.getNodeCheck=function(){
          return this.nodeCheck}
        ,s.getLayDrop=function(){
          return this.layDrop}
        ,s.getNode=function(){
          return this.node}
        ,s.setNoTouchActive=function(e){
          this.nodeNoTouch&&(this.nodeNoTouch.active=e)}
        ,s.scheduleNextFrame=function(e){
          this.scheduleOnce(e,0)}
        ,s.getHoleFruitLocalPosition=function(e){
          var t,n="L"===e?this.nodeHoleLBack:this.nodeHoleRBack,i=null!=(t=this.getLayHole())?t:this.layContent;
          if(null==n||!n.isValid||null==i||!i.isValid)return null;
          var o=i.getComponent(I);
          if(!o)return null;
          var r=new _;
          n.getWorldPosition(r);
          var a=new _;
          return o.convertToNodeSpaceAR(r,a)}
        ,s.scheduleOnceDelayed=function(e,t){
          this.scheduleOnce(e,t)}
        ,s.setHolePlaceholdersVisible=function(e){
          this.nodeHoleLBack&&(this.nodeHoleLBack.active=e),this.nodeHoleRBack&&(this.nodeHoleRBack.active=e),this.nodeHoleLFront&&(this.nodeHoleLFront.active=e),this.nodeHoleRFront&&(this.nodeHoleRFront.active=e)}
        ,s.setHoleQueueLabels=function(e,t){
          var n,i,o,r,a=Math.max(0,Math.floor(e)),s=Math.max(0,Math.floor(t));
          if(0===a&&0===s)return null!=(o=this.labelHoleL)&&o.isValid&&(this.labelHoleL.string=String(a)),null!=(r=this.labelHoleR)&&r.isValid&&(this.labelHoleR.string=String(s)),this._lastHoleQueueLabelL=void 0,void(this._lastHoleQueueLabelR=void 0);
          if(null!=(n=this.labelHoleL)&&n.isValid){
            var l=this._lastHoleQueueLabelL;
            l!==a&&(this.labelHoleL.string=String(a),void 0!==l&&this._playLabelNodePop(this.labelHoleL.node),this._lastHoleQueueLabelL=a)}
          if(null!=(i=this.labelHoleR)&&i.isValid){
            var c=this._lastHoleQueueLabelR;
            c!==s&&(this.labelHoleR.string=String(s),void 0!==c&&this._playLabelNodePop(this.labelHoleR.node),this._lastHoleQueueLabelR=s)}
        }
        ,s.ensureRowHoleBackDecoration=function(e,t,n,i){
          this._ensureOneRowHoleLayerDecor(e,t,n,this.layBackHole,this.nodeBackHole,this._rowHoleBackDecor),this._ensureOneRowHoleLayerDecor(e,t,n,this.layFrontHole,this.nodeFrontHole,this._rowHoleFrontDecor),this._setRowHoleFrontHoleLblCount(e,i)}
        ,s._setRowHoleFrontHoleLblCount=function(e,t){
          var n,i=this._rowHoleFrontDecor.get(e),o=null==i?void 0:i.node;
          if(null!=o&&o.isValid){
            var r=null==(n=o.getChildByName("lblCount"))?void 0:n.getComponent(f);
            if(null!=r&&r.isValid){
              var a=Math.max(0,t),s=this._lastRowHoleLblCount.get(e);
              s!==a&&(r.string=String(a),void 0!==s&&this._playLabelNodePop(r.node),this._lastRowHoleLblCount.set(e,a))}
          }
        }
        ,s._ensureOneRowHoleLayerDecor=function(e,t,n,i,o,r){
          var a;
          if(null!=(a=this.layContent)&&a.isValid&&null!=i&&i.isValid&&null!=o&&o.isValid){
            var s=r.get(e);
            if(s)s.localX=t,s.localY=n,this._setRowHoleDecorWorldFromLayContent(s.node,t,n);
            else{
              var l=w(o);
              l.parent=i,l.active=!0,s={
                node:l,localX:t,localY:n}
              ,r.set(e,s),this._setRowHoleDecorWorldFromLayContent(l,t,n)}
          }
        }
        ,s.removeRowHoleBackDecoration=function(e){
          this._removeOneRowHoleLayerDecor(e,this._rowHoleBackDecor),this._removeOneRowHoleLayerDecor(e,this._rowHoleFrontDecor),this._lastRowHoleLblCount.delete(e)}
        ,s._removeOneRowHoleLayerDecor=function(e,t){
          var n,i=t.get(e);
          i&&(null!=(n=i.node)&&n.isValid&&i.node.destroy(),t.delete(e))}
        ,s.clearRowHoleBackDecorations=function(){
          for(var e,t=r(this._rowHoleBackDecor.values());
          !(e=t()).done;
          ){
            var n,i=e.value;
            null!=(n=i.node)&&n.isValid&&i.node.destroy()}
          this._rowHoleBackDecor.clear();
          for(var o,a=r(this._rowHoleFrontDecor.values());
          !(o=a()).done;
          ){
            var s,l=o.value;
            null!=(s=l.node)&&s.isValid&&l.node.destroy()}
          this._rowHoleFrontDecor.clear(),this._lastRowHoleLblCount.clear()}
        ,s.clearRopeVisuals=function(){
          for(var e,t,n,i=r(this._lastRopeFruitNodes);
          !(n=i()).done;
          ){
            var o=n.value;
            if(null!=o&&o.isValid){
              var a=o.getComponent(F);
              a&&a.destroy()}
          }
          if(this._lastRopeFruitNodes.clear(),null!=(e=this.layPoint)&&e.isValid){
            for(var s=0,l=[].concat(this.layPoint.children);
            s<l.length;
            s++){
              var c=l[s];
              null!=c&&c.isValid&&c.destroy()}
            null==(t=this.graphics)||t.clear()}
        }
        ,s.beginRopeDrawPauseForShuffle=function(){
          var e;
          this._ropeDrawSuspended=!0,null==(e=this.graphics)||e.clear()}
        ,s.endRopeDrawPauseForShuffle=function(){
          this._ropeDrawSuspended=!1}
        ,s.getRopeLayPointChainNodeCount=function(){
          var e,t;
          return null!=(e=null==(t=this.layPoint)||null==(t=t.children)?void 0:t.length)?e:0}
        ,s.ensureSlottedFruitSlotAnchor=function(e){
          var t;
          if(null!=(t=this.slotJoint)&&t.isValid&&null!=e&&e.isValid&&!this._slotAnchorJoints.has(e)){
            var n=e.getComponent(v);
            if(null!=n&&n.isValid&&n.enabled){
              var i=this.slotJoint.node;
              try{
                var o=i.addComponent(F);
                o.connectedBody=n,o.collideConnected=!1,o.autoCalcDistance=!1,i.getWorldPosition(this._ropeTmpA),e.getWorldPosition(this._ropeTmpB),o.maxLength=560,this._applyDistanceJoint(o),this._slotAnchorJoints.set(e,o)}
              catch(e){
              }
            }
          }
        }
        ,s.removeSlottedFruitSlotAnchor=function(e){
          var t=this._slotAnchorJoints.get(e);
          null!=t&&t.isValid&&t.destroy(),this._slotAnchorJoints.delete(e)}
        ,s._clearAllSlotAnchors=function(){
          for(var e,t=r(this._slotAnchorJoints.values());
          !(e=t()).done;
          ){
            var n=e.value;
            null!=n&&n.isValid&&n.destroy()}
          this._slotAnchorJoints.clear()}
        ,s.syncRopeVisuals=function(e){
          var t,n,i=this,o=++this._ropeJointApplyGen;
          if(this.clearRopeVisuals(),null==(t=this.layPoint)||!t.isValid||null==(n=this.nodePoint)||!n.isValid||0===e.length)return this._ropePostSyncDrawGen=0,void this._drawRope();
          for(var a,s=r(e);
          !(a=s()).done;
          ){
            var l=a.value;
            this._buildRopeChain(l),this._lastRopeFruitNodes.add(l.nodeA),this._lastRopeFruitNodes.add(l.nodeB)}
          this._ropePostSyncDrawGen=o,this.scheduleOnce((function(){
            if(o===i._ropeJointApplyGen){
              for(var t,n=r(i.layPoint.children);
              !(t=n()).done;
              )for(var a,s=t.value,l=r(s.getComponents(F));
              !(a=l()).done;
              ){
                var c=a.value;
                i._applyDistanceJoint(c)}
              for(var u,d=r(e);
              !(u=d()).done;
              ){
                var h,p,f=u.value;
                null!=(h=f.nodeA)&&h.isValid&&null!=(p=f.nodeB)&&p.isValid&&(i._applyDistanceJointOnFruit(f.nodeA),i._applyDistanceJointOnFruit(f.nodeB))}
              i._drawRope(),i._ropePostSyncDrawGen===o&&(i._ropePostSyncDrawGen=0)}
          }
          ),0)}
        ,s._nodeWorldDist=function(e,t){
          return e.getWorldPosition(this._ropeTmpA),t.getWorldPosition(this._ropeTmpB),_.distance(this._ropeTmpA,this._ropeTmpB)}
        ,s._applyDistanceJoint=function(e){
          var t=e.apply;
          "function"==typeof t&&t.call(e)}
        ,s._applyDistanceJointOnFruit=function(e){
          var t=e.getComponent(F);
          t&&this._applyDistanceJoint(t)}
        ,s._initFruitDistanceJoint=function(e,t){
          var n=e.getComponent(F);
          n||(n=e.addComponent(F)),n.connectedBody=t,n.maxLength=this._ropeFruitJointMaxLength,this._applyDistanceJoint(n)}
        ,s._getOrAddFirstDistanceJoint=function(e){
          var t=e.getComponent(F);
          return t||(t=e.addComponent(F)),t}
        ,s._buildRopeChain=function(e){
          var t,n,i=e.worldPoints;
          if(null!=(t=this.layPoint)&&t.isValid&&null!=(n=this.nodePoint)&&n.isValid&&!(i.length<1)){
            var o=e.nodeA.getComponent(v),r=e.nodeB.getComponent(v);
            if(o&&r){
              for(var a=i.length,s=[],l=0;
              l<a;
              l++){
                var c=w(this.nodePoint);
                this.layPoint.addChild(c),c.active=!0,c.setWorldPosition(i[l].x,i[l].y,0);
                var u=c.getComponent(v);
                u&&(u.type=R.Dynamic,u.gravityScale=0),s.push(c)}
              var d=s[0].getComponent(v);
              if(d){
                this._initFruitDistanceJoint(e.nodeA,d);
                for(var h=1;
                h<a;
                h++){
                  var p=s[h-1],f=s[h],g=f.getComponent(v);
                  if(g){
                    var m=this._getOrAddFirstDistanceJoint(p);
                    m.connectedBody=g;
                    var y=this._nodeWorldDist(p,f);
                    m.maxLength=y,this._applyDistanceJoint(m)}
                }
                var _=s[a-1],b=_.getComponent(v);
                if(b){
                  this._initFruitDistanceJoint(e.nodeB,b);
                  var S=_.getComponent(F);
                  S&&S.destroy()}
              }
            }
          }
        }
        ,s.setFruitSprite=function(e,t,n,i){
          e.spriteFrame=z.instance.getSpriteFrame("fruit"+t),e.color=null!=i?i:new M(255,255,255,255)}
        ,s.applyFruitSprIconTint=function(e,t){
          var n,i=null==(n=e.getChildByName("sprIcon"))?void 0:n.getComponent(A);
          null!=i&&i.isValid&&(i.color=t.clone())}
        ,s.applyFruitBlindBoxVisual=function(e,t,n,i){
          var o=this;
          if(null!=e&&e.isValid){
            var r=e.getChildByName("sprIcon"),a=e.getChildByName("sprSpc"),s=e.getChildByName("sprShadow"),l=r.getComponent(A);
            if(t)this.setFruitSprite(l,n,!0),r.active=!1,a.active=!0,s.active=!0,this.setFruitShadowSprite(s.getComponent(A),this._blindBoxShadowId);
            else if(i){
              var c=null==a?void 0:a.getComponent(A);
              c&&(P.stopAllByTarget(c),c.color=new M(255,255,255,255)),a&&(a.active=!1),r.active=!0,s.active=!0,this.setFruitSprite(l,n,!1),this.setFruitShadowSprite(s.getComponent(A),n)}
            else s.active=!1,k(a.getComponent(A)).to(.1,{
              color:new M(255,255,255,125)}
            ,{
              easing:"sineOut"}
            ).call((function(){
              o.setFruitSprite(l,n,!1),o.setFruitShadowSprite(s.getComponent(A),n),a.active=!1,r.active=!0,s.active=!0}
            )).start()}
        }
        ,s.preloadShuffleSpriteFrames=function(e,t){
          for(var n,i=this,o=new Set,a=r(e);
          !(n=a()).done;
          ){
            var s=n.value;
            s<=0||(o.add("Image/Fruit/fruit"+s+"/spriteFrame"),o.add("Image/FruitShadow/fruitShadow"+s+"/spriteFrame"))}
          o.add("Image/FruitShadow/fruitShadow"+this._blindBoxShadowId+"/spriteFrame");
          for(var l,c=[],u=r(o);
          !(l=u()).done;
          ){
            var d=l.value;
            this._spriteFrameCache.has(d)||c.push(d)}
          if(0!==c.length)for(var h=c.length,p=function(){
            var e=g[f];
            L.load(e,x,(function(n,o){
              !n&&o&&i._spriteFrameCache.set(e,o),0==--h&&t()}
            ))}
          ,f=0,g=c;
          f<g.length;
          f++)p();
          else this.scheduleOnce((function(){
            return t()}
          ),0)}
        ,s.revealBlindBoxFruit=function(e,t){
          this.applyFruitBlindBoxVisual(e,!1,t)}
        ,s.setFruitShadowSprite=function(e,t){
          e.spriteFrame=z.instance.getSpriteFrame("fruitShadow"+t)}
        ,s._loadSpriteFrameCached=function(e,t,n){
          var i=this,o=this._spriteFrameCache.get(e);
          o?t(o):L.load(e,x,(function(o,r){
            if(o)n?console.error(o):console.warn("[Game] SpriteFrame 加载失败",e,o);
            else{
              var a=r;
              i._spriteFrameCache.set(e,a),t(a)}
          }
          ))}
        ,s.playSoundById=function(e,t){
          W.instance.playSound("fruitGame/"+e)}
        ,s.playEliminateComboSound=function(e){
          var t=Math.max(1,Math.min(8,Math.floor(e)));
          this.playSoundById("eliminate"+t)}
        ,s._findNamedAudioClip=function(e){
          var t;
          if(null==(t=this.namedAudioClips)||!t.length)return null;
          for(var n,i=r(this.namedAudioClips);
          !(n=i()).done;
          ){
            var o=n.value;
            if((null==o?void 0:o.id)===e&&null!=o&&o.clip)return o.clip}
          return null}
        ,s.playEliminateAnimation=function(e,t,n,i){
          var o,r,a=this;
          if(e.isValid){
            var s=e.getChildByName("sprIcon");
            if(s)if(null!=(o=this.nodeAni)&&o.isValid){
              var l=null==(r=this.uiNode)?void 0:r.getComponent(I);
              l&&(s.getWorldPosition(this._ropeTmpA),l.convertToNodeSpaceAR(this._ropeTmpA,this._ropeTmpB),this.createPoint(T(this._ropeTmpB.x,this._ropeTmpB.y,this._ropeTmpB.z),null!=i?i:1));
              var c=w(s);
              c.setParent(e),c.name="hightLightIcon",this.highlightMaterial&&(c.getComponent(A).material=this.highlightMaterial),s.active=!1,c.active=!0;
              var u=50*Math.random()*1.44+144;
              k(e).to(.12,{
                scale:new _(1.2,1.2,1)}
              ).to(.12,{
                scale:new _(1,1,1)}
              ).call((function(){
                var i,o=w(s);
                o.active=!0;
                var r=new _,l=new _,c=new D;
                s.getWorldPosition(r),s.getWorldScale(l),s.getWorldRotation(c),o.setParent(a.nodeAni),o.setWorldPosition(r),o.setWorldScale(l),o.setWorldRotation(c),e.isValid&&(e.active=!1);
                var d=new _;
                if(null!=(i=a.nodeMouth)&&i.isValid&&a.nodeAni.isValid){
                  var h=new _;
                  a.nodeMouth.getWorldPosition(h);
                  var p=a.nodeAni.getComponent(I);
                  p?p.convertToNodeSpaceAR(h,d):d.set(t)}
                else d.set(t);
                a._setMouthAnim(2),k(o).by(.3,{
                  scale:new _(.2,.2,0)}
                ,{
                  easing:"sineOut"}
                ).start(),H(o,d,u,1,.3).call((function(){
                  k(o).to(.1,{
                    scale:new _(0,0,1)}
                  ,{
                    easing:"sineOut"}
                  ).call((function(){
                    o.isValid&&o.destroy(),a.playSoundById("eat"),n()}
                  )).start()}
                )).start()}
              )).start()}
            else n();
            else n()}
        }
        ,s.clearFruitNodes=function(){
          var e=this;
          this.clearRowHoleBackDecorations(),this._clearAllSlotAnchors();
          var t=function(t){
            if(null!=t&&t.isValid)for(var n,i=[].concat(t.children),o=r(i);
            !(n=o()).done;
            ){
              var a=n.value;
              e._fruitPool?e._fruitPool.put(a):null!=a&&a.isValid&&a.destroy()}
          }
          ;
          if(this.layContent){
            t(this.layContent);
            var n=new _;
            this.layContent.getWorldPosition(n),this.layContent.setWorldPosition(n.x,this._startLayContentWorldY,n.z),this._syncLayPointToLayContent()}
          this.layHole&&t(this.layHole),this.layDrop&&t(this.layDrop),this.nodeFruit&&(this.nodeFruit.active=!0)}
        ,s.recycleFruitNode=function(e){
          null!=e&&e.isValid&&(this.removeSlottedFruitSlotAnchor(e),this._fruitPool?this._fruitPool.put(e):e.destroy())}
        ,s.setLayContentPosition=function(e,t,n){
          this.layContent&&(this.layContent.setPosition(e,t,n),this._syncLayPointToLayContent())}
        ,s._captureLayPointFollowOffset=function(){
          var e=this.layContent,t=this.layPoint;
          if(null!=e&&e.isValid&&null!=t&&t.isValid&&e.parent===t.parent){
            var n=e.position,i=t.position;
            this._layPointFollowOffset.set(i.x-n.x,i.y-n.y,i.z-n.z)}
        }
        ,s._syncLayPointToLayContent=function(){
          var e=this.layContent,t=this.layPoint;
          if(null!=e&&e.isValid&&null!=t&&t.isValid&&e.parent===t.parent){
            var n=this._layPointFollowOffset,i=e.position;
            t.setPosition(i.x+n.x,i.y+n.y,i.z+n.z)}
        }
        ,s.resetFruitRigidBodyToStatic=function(e){
          var t=e.getComponent(v);
          t&&(t.type===R.Dynamic&&(t.linearVelocity=new G(0,0),t.angularVelocity=0),t.type=R.Static,t.enabled=!0)}
        ,s._initFruitRigidBodyForSpawn=function(e){
          this.resetFruitRigidBodyToStatic(e)}
        ,s.addFruit=function(e,t,n,i,o,r,a,s){
          var l,c,d,h;
          if(!this.nodeFruit||!e)return null;
          var p=null!=(l=null==(c=this._fruitPool)?void 0:c.get())?l:w(this.nodeFruit);
          if(!p)return null;
          var f=t,g=n;
          null!=s&&s>0&&(f+=2*(Math.random()-.5)*s,g+=2*(Math.random()-.5)*s*.55),p.setPosition(f,g,0),e.addChild(p),this._initFruitRigidBodyForSpawn(p);
          var m=null==(d=p.getChildByName("sprIcon"))?void 0:d.getComponent(A),v=null==(h=p.getChildByName("sprShadow"))?void 0:h.getComponent(A);
          return a?this.applyFruitBlindBoxVisual(p,!0,i):(m&&this.setFruitSprite(m,i,!1),v&&this.setFruitShadowSprite(v,i)),p.targetOff(u.EventType.TOUCH_START),p.on(u.EventType.TOUCH_START,o,this),p}
        ,s.moveFruitToDropLayer=function(e){
          this.layDrop&&e&&e.setParent(this.layDrop,!0)}
        ,s.getNodeCheckWorldY=function(){
          if(!this.nodeCheck)return 0;
          var e=new _;
          return this.nodeCheck.getWorldPosition(e),e.y}
        ,s.getNodeCheckDropLastWorldY=function(){
          if(!this.nodeCheckDropLast)return-1/0;
          var e=new _;
          return this.nodeCheckDropLast.getWorldPosition(e),e.y}
        ,s.getNodeWorldY=function(e){
          if(null==e||!e.isValid)return-1/0;
          var t=new _;
          return e.getWorldPosition(t),t.y}
        ,s.getNodeWorldPosition=function(e){
          var t=new _;
          return null!=e&&e.isValid&&e.getWorldPosition(t),t}
        ,s.getGameViewCenterWorldX=function(){
          var e=this.node.getComponent(I),t=new _;
          return e?(e.convertToWorldSpaceAR(new _(0,0,0),t),t.x):(this.node.getWorldPosition(t),t.x)}
        ,s.createShuffleClone=function(e,t,n,i){
          var o,r;
          if(null==(o=this.nodeFruitUI)||!o.isValid||null==e||!e.isValid||null==t||!t.isValid)return null;
          var a=null!=(r=this.nodeAni)&&r.isValid?this.nodeAni:this.node;
          if(!a)return null;
          var s=w(this.nodeFruitUI);
          this.applyFruitBlindBoxVisual(s,i,n,!0);
          var l=new _;
          return t.getWorldPosition(l),s.setParent(a),s.setWorldPosition(l),s}
        ,s.tweenNodeToWorldPosition=function(e,t,n,i){
          var o;
          if(null!=e&&e.isValid){
            var r=null==(o=e.parent)?void 0:o.getComponent(I),a=new _;
            r?r.convertToNodeSpaceAR(t,a):a.set(t),k(e).to(n,{
              position:a}
            ,{
              easing:"sineOut"}
            ).call(i).start()}
          else null==i||i()}
        ,s.getPolygonWorldVertices=function(e){
          var t="ground1"===e?this.nodeGround1:"ground2"===e?this.nodeGround2:this.nodeSlots;
          if(null==t||!t.isValid)return[];
          var n=t.worldPoints;
          if(null==n||!n.length)return[];
          var i=this._polyVertsPool[e];
          for(i||(i=this._polyVertsPool[e]=[]);
          i.length<n.length;
          )i.push(new G);
          i.length=n.length;
          for(var o=0;
          o<n.length;
          o++)i[o].x=n[o].x,i[o].y=n[o].y;
          return i}
        ,s.getMouthPosInDropSpace=function(){
          var e,t;
          if(null==(e=this.nodeMouth)||!e.isValid||null==(t=this.layDrop)||!t.isValid)return new _(0,-200,0);
          var n=this.layDrop.getComponent(I);
          if(!n)return new _(0,-200,0);
          var i=new _;
          this.nodeMouth.getWorldPosition(i);
          var o=new _;
          return n.convertToNodeSpaceAR(i,o),o}
        ,s.showWarning=function(){
          if(!this._isShowWarning){
            this._isShowWarning=!0;
            for(var e,t=k().delay(2).to(.5,{
              color:new M(255,90,90,255)}
            ,{
              easing:B.quadOut}
            ).to(.5,{
              color:new M(255,255,255,255)}
            ,{
              easing:B.sineIn}
            ),n=r(this._ctl.getSlottedFruitNodesSnapshot());
            !(e=n()).done;
            ){
              var i=e.value.getChildByName("sprIcon").getComponent(A);
              t.clone(i).repeatForever().start()}
          }
        }
        ,s.hideWarning=function(){
          if(this._isShowWarning){
            this._isShowWarning=!1;
            for(var e,t=r(this._ctl.getSlottedFruitNodesSnapshot());
            !(e=t()).done;
            ){
              var n=e.value.getChildByName("sprIcon").getComponent(A);
              P.stopAllByTarget(n),n.color=new M(255,255,255,255)}
          }
        }
        ,s.createPoint=function(e,t){
          var n=this,i=1;
          1==t?i=9:2==t||9==t||13==t||15==t||25==t||28==t?i=1:4==t||10==t||19==t||21==t?i=2:12==t||14==t||16==t||18==t||24==t||26==t||27==t?i=3:5==t||17==t||29==t||32==t||34==t?i=4:6==t?i=6:3==t?i=8:22==t||30==t?i=9:20==t||31==t?i=12:7==t||8==t||11==t||23==t?i=13:33==t&&(i=15);
          var o=w(z.instance.getPrefab("deletePulseCircle"));
          o.parent=this.uiNode,o.getComponent(A).color=$.getColorFromHex(j.colorArr2[i-1]),o.setPosition(e),o.setScale(0,0,0),k(o).to(.2,{
            scale:T(1.2,1.2,1.2)}
          ).delay(.05).removeSelf().start(),k(o.getComponent(N)).delay(.2).to(.05,{
            opacity:0}
          ).start();
          for(var r=function(){
            var t=w(z.instance.getPrefab("colorMarkerParticle"));
            t.parent=n.uiNode,j.nameArr2[i-1],t.getComponent(A).spriteFrame=z.instance.getSpriteFrame("colorMarker"+j.nameArr2[i-1]);
            var o=$.getRandomNum(0,360,!0),r=$.degreesToVectors(o),a=$.getRandomNum(0,75,!0);
            t.setPosition(e.x+r.x*a,e.y+r.y*a);
            var s=$.getRandomNum(75,120,!0),l=T(t.x+s*r.x,t.y+s*r.y),c=s/100;
            k(t).call((function(){
              var e=$.getRandomNum(1.2,1.8);
              t.setScale(e,e,e),t.getComponent(N).opacity=255}
            )).parallel(k(t).to(c,{
              position:l}
            ),k(t).to(c,{
              scale:T(0,0,0)}
            ),k(t.getComponent(N)).to(c,{
              opacity:0}
            )).removeSelf().start(),k(t).by(1,{
              angle:360*$.GetPositiveNegative()}
            ).start()}
          ,a=0;
          a<7;
          a++)r()}
        ,a(t,[{
          key:"remainNum",get:function(){
            return this._ctl.getRemainingFruitCountForHud()}
        }
        ,{
          key:"fruitNum",get:function(){
            return this._ctl.getLevelTotalFruits()}
        }
        ,{
          key:"currentLevel",get:function(){
            return this._ctl.getCurrentLevel()}
        }
        ]),t}
      (E)).prototype,"layContent",[ce],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),at=t(ot.prototype,"layDrop",[ue],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),st=t(ot.prototype,"nodeFruit",[de],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),lt=t(ot.prototype,"nodeCheck",[he],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ct=t(ot.prototype,"nodeFruitUI",[pe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ut=t(ot.prototype,"btnRestart",[fe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),dt=t(ot.prototype,"btnNext",[ge],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ht=t(ot.prototype,"nodeCheckDropLast",[me],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),pt=t(ot.prototype,"highlightMaterial",[ve],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ft=t(ot.prototype,"nodeMouth",[ye],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),gt=t(ot.prototype,"btnRefresh",[_e],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),mt=t(ot.prototype,"btnClean",[be],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),vt=t(ot.prototype,"btnRevive",[Se],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),yt=t(ot.prototype,"btnPrint",[Ce],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),_t=t(ot.prototype,"nodeNoTouch",[we],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),bt=t(ot.prototype,"nodeAni",[Ne],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),St=t(ot.prototype,"nodeGround1",[ke],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Ct=t(ot.prototype,"nodeGround2",[Te],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),wt=t(ot.prototype,"nodeSlots",[Be],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Nt=t(ot.prototype,"nodeHoleLBack",[Ae],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),kt=t(ot.prototype,"nodeHoleRBack",[Pe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Tt=t(ot.prototype,"nodeHoleLFront",[Me],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Bt=t(ot.prototype,"nodeHoleRFront",[Ie],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),At=t(ot.prototype,"layHole",[Fe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Pt=t(ot.prototype,"labelHoleL",[Re],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Mt=t(ot.prototype,"labelHoleR",[Le],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),It=t(ot.prototype,"nodePoint",[xe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Ft=t(ot.prototype,"layPoint",[De],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Rt=t(ot.prototype,"graphics",[Ge],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Lt=t(ot.prototype,"editLevel",[Ee],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),xt=t(ot.prototype,"btnSetLevel",[Oe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Dt=t(ot.prototype,"btnGyroL",[He],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Gt=t(ot.prototype,"btnGyroR",[Ve],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Et=t(ot.prototype,"lblLevel",[Ue],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Ot=t(ot.prototype,"lblRemaining",[ze],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Ht=t(ot.prototype,"nodeTip",[We],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Vt=t(ot.prototype,"lblReason",[je],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Ut=t(ot.prototype,"layCloud",[Je],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),zt=t(ot.prototype,"nodeCloud",[Ye],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Wt=t(ot.prototype,"layBackHole",[qe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),jt=t(ot.prototype,"nodeBackHole",[Ke],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Jt=t(ot.prototype,"layFrontHole",[Xe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Yt=t(ot.prototype,"nodeFrontHole",[Qe],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),qt=t(ot.prototype,"nodeLevelMap",[Ze],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),Kt=t(ot.prototype,"namedAudioClips",[$e],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return[]}
      }
      ),Xt=t(ot.prototype,"slotJoint",[et],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Qt=t(ot.prototype,"uiNode",[tt],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Zt=t(ot.prototype,"spMouth",[nt],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),it=ot))||it)),s._RF.pop()}
  }
}
))

