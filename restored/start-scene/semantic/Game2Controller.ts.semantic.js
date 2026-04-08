/**
 * Semantic view: chunks:///_virtual/Game2Controller.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => instantiate
 * - a => asyncToGenerator
 * - A => UITransform
 * - b => UIOpacity
 * - B => view
 * - c => Node
 * - C => director
 * - d => find
 * - D => Util
 * - E => AudioManager
 * - f => BoxCollider2D
 * - F => GAME2_EVENT_KEYS
 * - g => Sprite
 * - G => Fruit
 * - h => Label
 * - H => ResManager
 * - I => COLLIDER_TAG
 * - j => PropPanelView
 * - J => PoolManager
 * - k => Vec3
 * - l => _decorator
 * - L => default
 * - M => releaseType
 * - n => inheritsLoose
 * - N => Tween
 * - o => initializerDefineProperty
 * - O => GameModel
 * - p => Button
 * - P => FruitManager
 * - r => assertThisInitialized
 * - R => PROP_TYPE
 * - s => cclegacy
 * - S => PhysicsSystem2D
 * - t => applyDecoratedDescriptor
 * - T => Component
 * - u => Material
 * - U => UIConfigTable
 * - v => tween
 * - V => TooYueManager
 * - w => Color
 * - W => AdManager
 * - x => GameCtrl
 * - Y => GameData2
 * - z => RevivePanelView
 */
/**
 * Restored module: chunks:///_virtual/Game2Controller.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => instantiate
 * - a => asyncToGenerator
 * - A => UITransform
 * - b => UIOpacity
 * - B => view
 * - c => Node
 * - C => director
 * - d => find
 * - D => Util
 * - E => AudioManager
 * - f => BoxCollider2D
 * - F => GAME2_EVENT_KEYS
 * - g => Sprite
 * - G => Fruit
 * - h => Label
 * - H => ResManager
 * - I => COLLIDER_TAG
 * - j => PropPanelView
 * - J => PoolManager
 * - k => Vec3
 * - l => _decorator
 * - L => default
 * - M => releaseType
 * - n => inheritsLoose
 * - N => Tween
 * - o => initializerDefineProperty
 * - O => GameModel
 * - p => Button
 * - P => FruitManager
 * - r => assertThisInitialized
 * - R => PROP_TYPE
 * - s => cclegacy
 * - S => PhysicsSystem2D
 * - t => applyDecoratedDescriptor
 * - T => Component
 * - u => Material
 * - U => UIConfigTable
 * - v => tween
 * - V => TooYueManager
 * - w => Color
 * - W => AdManager
 * - x => GameCtrl
 * - Y => GameData2
 * - z => RevivePanelView
 */
System.register("chunks:///_virtual/Game2Controller.ts",["./rollupPluginModLoBabelHelpers.js","cc","./FruitManager.ts","./Enum.ts","./EventManager.ts","./GameCtrl.ts","./Util.ts","./Fruit.ts","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./TooYueManager.ts","./ConfigTable.ts","./RevivePanelView.ts","./AdManager.ts","./PropPanelView.ts","./PoolManager.ts","./GameData2.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, o /* initializerDefineProperty */, r /* assertThisInitialized */, a /* asyncToGenerator */, s /* cclegacy */, l /* _decorator */, c /* Node */, u /* Material */, d /* find */, h /* Label */, p /* Button */, f /* BoxCollider2D */, g /* Sprite */, m, v /* tween */, y, _ /* instantiate */, b /* UIOpacity */, S /* PhysicsSystem2D */, C /* director */, w /* Color */, N /* Tween */, k /* Vec3 */, T /* Component */, B /* view */, A /* UITransform */, P /* FruitManager */, M /* releaseType */, I /* COLLIDER_TAG */, F /* GAME2_EVENT_KEYS */, R /* PROP_TYPE */, L /* default */, x /* GameCtrl */, D /* Util */, G /* Fruit */, E /* AudioManager */, O /* GameModel */, H /* ResManager */, V /* TooYueManager */, U /* UIConfigTable */, z /* RevivePanelView */, W /* AdManager */, j /* PropPanelView */, J /* PoolManager */, Y /* GameData2 */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,o=e.initializerDefineProperty /* initializerDefineProperty */,r=e.assertThisInitialized /* assertThisInitialized */,a=e.asyncToGenerator /* asyncToGenerator */}
    ,function(e){
      s=e.cclegacy /* cclegacy */,l=e._decorator /* _decorator */,c=e.Node /* Node */,u=e.Material /* Material */,d=e.find /* find */,h=e.Label /* Label */,p=e.Button /* Button */,f=e.BoxCollider2D /* BoxCollider2D */,g=e.Sprite /* Sprite */,m=e.sp,v=e.tween /* tween */,y=e.v3,_=e.instantiate /* instantiate */,b=e.UIOpacity /* UIOpacity */,S=e.PhysicsSystem2D /* PhysicsSystem2D */,C=e.director /* director */,w=e.Color /* Color */,N=e.Tween /* Tween */,k=e.Vec3 /* Vec3 */,T=e.Component /* Component */,B=e.view /* view */,A=e.UITransform /* UITransform */}
    ,function(e){
      P=e.FruitManager /* FruitManager */}
    ,function(e){
      M=e.releaseType /* releaseType */,I=e.COLLIDER_TAG /* COLLIDER_TAG */,F=e.GAME2_EVENT_KEYS /* GAME2_EVENT_KEYS */,R=e.PROP_TYPE /* PROP_TYPE */}
    ,function(e){
      L=e.default /* default */}
    ,function(e){
      x=e.GameCtrl /* GameCtrl */}
    ,function(e){
      D=e.Util /* Util */}
    ,function(e){
      G=e.Fruit /* Fruit */}
    ,function(e){
      E=e.AudioManager /* AudioManager */}
    ,function(e){
      O=e.GameModel /* GameModel */}
    ,function(e){
      H=e.ResManager /* ResManager */}
    ,function(e){
      V=e.TooYueManager /* TooYueManager */}
    ,function(e){
      U=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      z=e.RevivePanelView /* RevivePanelView */}
    ,function(e){
      W=e.AdManager /* AdManager */}
    ,function(e){
      j=e.PropPanelView /* PropPanelView */}
    ,function(e){
      J=e.PoolManager /* PoolManager */}
    ,function(e){
      Y=e.GameData2 /* GameData2 */}
    ],execute:function(){
      var q,K,X,Q,Z,$,ee;
      s._RF.push({
      }
      ,"d958fIp4stAxrgwMGj4v/rO","Game2Controller",void 0);
      var te=l.ccclass,ne=l.property;
      e("Game2Controller",(q=te("Game2Controller"),K=ne(c),X=ne(u),q(($=t((Z=function(e){
        function t(){
          for(var t,n=arguments.length,i=new Array(n),a=0;
          a<n;
          a++)i[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(i))||this,o(t,"FruitManager",$,r(t)),o(t,"highlightMaterial",ee,r(t)),t.reportBtn=null,t.duckAni=null,t.pigeonAni=null,t.levelLabel=null,t.uiNode=null,t.fruitNode=null,t.propBg=null,t.fruitNumLabel=null,t.snagNode=null,t.maxLenGridNum=3,t.popNum=0,t.fruitNum=0,t.reviveNum=1,t.NoTouchFruitNum=0,t.isSetBtnShow=!1,t.DeleteGridArr=[],t.adGridNodeArr=[],t.adShakeLock=!1,t.prop1Num=3,t.prop2Num=3,t.tscd=0,t.GyroscopeTimer=0,t.GyroscopeCd=10,t.showAdGridITime=0,t.shoAdGridCd=2,t.isShowADGridUI=!1,t.AdShakeMoveFlag=!1,t.PopSuccessTime=0,t.PopRecord=0,t}
        n(t,e);
        var s=t.prototype;
        return s.onLoad=function(){
          E.instance.playMusic("bgm/defaultGameplay",.5),this.initNode(),this.initGame(),this.initUI()}
        ,s.start=function(){
          this.WaterMove(),this.gmLabelUpdate()}
        ,s.gmLabelUpdate=function(){
          var e=d("Canvas/uiNode/GameGuide");
          (O.instance.releaseType==M.test_TEST||V.userMsg&&V.userMsg.userTags.includes("gm"))&&(e.active=!0,e.getComponent(h).string="首页-救救水果鸭")}
        ,s.initNode=function(){
          this.uiNode=d("Canvas/uiNode"),this.fruitNode=d("Canvas/gameNode/fruitNode"),this.levelLabel=d("Canvas/uiNode/levelLabel"),this.propBg=d("Canvas/uiNode/propBg");
          var e=d("Canvas/realWall/adNode");
          this.duckAni=d("Canvas/gameNode/circle/DuckAni"),this.pigeonAni=d("Canvas/gameNode/circle/pigeon"),this.fruitNumLabel=d("Canvas/uiNode/FruitLabel/fruitNumLabel"),this.snagNode=d("Canvas/gameNode/snagNode"),this.reportBtn=this.uiNode.getChildByName("reportBtn").getComponent(p),O.instance.releaseType==M.applet_ziJie&&V._ins.isNeedReportStage||(this.reportBtn.node.active=!1);
          for(var t=0;
          t<2;
          t++)this.adGridNodeArr.push(e.children[t]),e.children[t].getComponent(f).tag=I.REAL_WALL,0==t||1==O.instance.level2?this.adGridNodeArr[t].children[0].active=!1:this.updateAdGridTip()}
        ,s.initUI=function(){
          this.updateLevelLabel(),this.initBg(),this.createSetBtn(),this.initProp(),this.initAni(),this.updataFruitNum()}
        ,s.initBg=function(){
          var e=O.instance.level2%5+1;
          d("Canvas/bg").getComponent(g).spriteFrame=H.instance.getSpriteFrame("game2_bg"+e)}
        ,s.initAni=function(){
          if(1==O.instance.level2)return this.duckAni.active=!1,void(this.pigeonAni.active=!0);
          console.log("GameModel.instance.level2",O.instance.level2),this.duckAni.active=!0,this.pigeonAni.active=!1,this.initDuckSkin()}
        ,s.initDuckSkin=function(){
          var e=O.instance.level2-1;
          e>O.instance.MaxDuckTypeNum&&0==(e%=O.instance.MaxDuckTypeNum)&&(e=O.instance.MaxDuckTypeNum);
          var t="y"+e.toString(),n=this.duckAni.getComponent(m.Skeleton);
          n.setSkin(t),4==e?n.node.setPosition(0,n.node.position.y):n.node.setPosition(-45,n.node.position.y)}
        ,s.initWarning=function(){
          var e=a(i().mark((function e(){
            var t,n;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(t=this,2!=O.instance.level2&&O.instance.level2%5!=0){
                  e.next=7;
                  break}
                return n=null,e.next=5,H.instance.bundleLoad("DuckBundle","prefab/WarningUI",null,(function(e,i){
                  if(e)console.log(e);
                  else{
                    (n=_(i)).parent=t.uiNode;
                    var o=n.getChildByName("panel"),r=o.getChildByName("loading"),a=o.getChildByName("通关率"),s=o.getChildByName("spr");
                    s.children[1].active=!0,s.children[0].active=!1;
                    var l=Math.floor(O.instance.level2/5),c=2-.13*l>0?2-.13*l:.05;
                    c=Math.floor(100*c)/100,a.getComponent(h).string="通关率不足"+c+"%",n.getComponent(b).opacity=0,v(n.getComponent(b)).to(.3,{
                      opacity:255}
                    ).delay(2).to(.4,{
                      opacity:0}
                    ).call((function(){
                      O.instance.failNum_Game2>0&&t.lockAdGirdProp(),n.destroy()}
                    )).start(),v(r).delay(.3).call((function(){
                      E.instance.playSound("ui/warningPrompt")}
                    )).by(10,{
                      position:y(3e3,0,0)}
                    ).start(),v(s).delay(.3).to(.3,{
                      scale:y(1.1,1.1,1.1)}
                    ).to(.3,{
                      scale:y(1,1,1)}
                    ).to(.3,{
                      scale:y(1.1,1.1,1.1)}
                    ).to(.3,{
                      scale:y(1,1,1)}
                    ).to(.3,{
                      scale:y(1.1,1.1,1.1)}
                    ).to(.3,{
                      scale:y(1,1,1)}
                    ).start()}
                }
                ));
                case 5:e.next=8;
                break;
                case 7:O.instance.failNum_Game2>0&&this.lockAdGirdProp();
                case 8:case"end":return e.stop()}
            }
            ),e,this)}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),s.updataFruitNum=function(){
          var e=this;
          v(this.fruitNumLabel).to(.1,{
            scale:y(0,0,0)}
          ).call((function(){
            e.fruitNumLabel.getComponent(h).string=""+(e.fruitNum-e.popNum)}
          )).to(.1,{
            scale:y(1,1,1)}
          ,{
            easing:"backOut"}
          ).start()}
        ,s.initProp=function(){
          var e=this.propBg.getChildByName("prop1Btn"),t=this.propBg.getChildByName("prop2Btn"),n=this.propBg.getChildByName("prop3Btn");
          if(O.instance.freeProp1Num>0){
            var i=e.children[0].getChildByName("redSpr");
            i.active=!0,i.children[0].getComponent(h).string=O.instance.freeProp1Num.toString()}
          if(O.instance.freeProp2Num>0){
            var o=t.children[0].getChildByName("redSpr");
            o.active=!0,o.children[0].getComponent(h).string=O.instance.freeProp2Num.toString()}
          if(O.instance.freeProp3Num>0){
            var r=n.children[0].getChildByName("redSpr");
            r.active=!0,r.children[0].getComponent(h).string=O.instance.freeProp3Num.toString()}
        }
        ,s.updateLevelLabel=function(){
          this.levelLabel.getComponent(h).string=O.instance.level2.toString()}
        ,s.createSetBtn=function(){
          var e=this;
          1!=O.instance.level&&(this.isSetBtnShow||(this.isSetBtnShow=!0,H.instance.bundleLoad("uiBundle",U.setBtn.path,null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=_(n);
              i.parent=e.node;
              var o=i.getComponent(b),r=i.scale.x;
              o.opacity=0,v(i).delay(0).call((function(){
                o.opacity=255,i.setScale(0,0,0)}
              )).to(.1,{
                scale:y(r,r,r)}
              ).start()}
          }
          ))))}
        ,s.initGame=function(){
          V._ins.reportStage(2e6+O.instance.level2,"start","",0),Y._ins.onload(),d("Canvas/wallNode/wallDown").active=!0,this.SnagShow();
          var e=S.instance;
          e.enable=!0,e.fixedTimeStep=1/60,e.velocityIterations=10,e.positionIterations=10,this.scheduleOnce((function(){
            W.startGyroscope()}
          ),1),V._ins.startRecordVideo(),x.instance.gameIsOver=!1,x.instance.btnCanTouch=!0,this.fruitNum=0,this.popNum=0,this.NoTouchFruitNum=0,this.reviveNum=1,this.maxLenGridNum=3,this.DeleteGridArr=[],this.FruitManager.getComponent(P).initData(O.instance.level2),O.instance.level2>2&&(this.adShakeLock=!0,d("Canvas/uiNode/propBg/prop3Btn/adSpr").active=!0)}
        ,s.SnagShow=function(){
          Y._ins.snagFlag?0==Y._ins.snagType?(this.snagNode.active=!0,this.snagNode.children[0].active=!0,this.snagNode.children[1].active=!1,d("Canvas/wallNode/snagMiddle").active=!0,d("Canvas/wallNode/snagLeft").active=!1,d("Canvas/wallNode/snagRight").active=!1):1==Y._ins.snagType&&(this.snagNode.active=!0,this.snagNode.children[0].active=!1,this.snagNode.children[1].active=!0,d("Canvas/wallNode/snagMiddle").active=!1,d("Canvas/wallNode/snagLeft").active=!0,d("Canvas/wallNode/snagRight").active=!0):(d("Canvas/wallNode/snagMiddle").active=!1,d("Canvas/wallNode/snagLeft").active=!1,d("Canvas/wallNode/snagRight").active=!1,this.snagNode.active=!1)}
        ,s.moveFruitByGyroscope=function(e,t){
          for(var n=10*Math.abs(e)*(e/Math.abs(e)),i=this,o=0;
          o<i.fruitNode.children.length;
          o++){
            var r=i.fruitNode.children[o];
            i.DeleteGridArr.includes(r)||r.getComponent(G).pushLinearVelocity(n,0)}
        }
        ,s.initAdGrid=function(){
          this.maxLenGridNum=3;
          for(var e=0;
          e<this.adGridNodeArr.length;
          e++)this.adGridNodeArr[e].active=!0,this.adGridNodeArr[e].children[0].active=0!=e;
          this.updateAdGridTip()}
        ,s.update=function(e){
          if(!x.instance.gameIsOver&&(this.gyroscopeTimer(e),this.showADGridTips(e),this.tscd>0&&(this.tscd-=e,this.tscd<=0))){
            var t=this.propBg.getChildByName("prop1Btn"),n=this.propBg.getChildByName("prop2Btn");
            if(this.shakeShakeBtn(),1.15==t.scale.x||1.15==n.scale.x){
              var i=[];
              if(this.prop1Num>0&&i.push(0),this.prop2Num>0&&i.push(1),i.length>0){
                var o=i[D.getRandomNum(0,i.length-1,!0)],r=[t,n],a=y(r[o].scale),s=.1;
                v(r[o]).to(s,{
                  angle:-15}
                ).to(s,{
                  angle:0}
                ).to(s,{
                  angle:15}
                ).to(s,{
                  angle:0}
                ).to(s,{
                  angle:-15}
                ).to(s,{
                  angle:0}
                ).to(s,{
                  angle:15}
                ).to(s,{
                  angle:0}
                ).to(.2,{
                  scale:y(a.x+.1,a.y+.1,a.y+.1)}
                ).to(s,{
                  scale:a}
                ).start()}
            }
          }
        }
        ,s.showADGridTips=function(e){
          this.maxLenGridNum>=5||this.isShowADGridUI||this.DeleteGridArr.length!=this.maxLenGridNum||!x.instance.canTouch||!x.instance.btnCanTouch||this.popNum/this.fruitNum<.5||(this.showAdGridITime+=e,this.showAdGridITime>=this.shoAdGridCd&&(this.showAdGridITime=0,this.isShowADGridUI=!0,this.lockAdGirdProp(1)))}
        ,s.gyroscopeTimer=function(e){
          var t=this;
          x.instance.canTouch&&!x.instance.gameIsOver&&x.instance.btnCanTouch&&1!=O.instance.isShowGyroscopeTip_Game2&&1!=O.instance.level&&(this.GyroscopeTimer+=e,this.GyroscopeTimer>this.GyroscopeCd&&(O.instance.isShowGyroscopeTip_Game2=1,this.GyroscopeTimer=0,H.instance.bundleLoad("DuckBundle","prefab/GyroscopeTip",null,(function(e,n){
            if(e)console.error(e);
            else{
              var i=_(n),o=i.getChildByName("black");
              i.parent=t.node,i.setPosition(y(0,0,0)),i.getComponent(b).opacity=0,i.getChildByName("gyroscope").getComponent(m.Skeleton).setSkin("w2"),i.getChildByName("gyroscope").getComponent(m.Skeleton).setAnimation(0,"animation",!0),v(i.getComponent(b)).to(.3,{
                opacity:255}
              ).delay(2).call((function(){
                o.on(c.EventType.TOUCH_END,(function(){
                  o.off(c.EventType.TOUCH_END),i.destroy()}
                ))}
              )).start()}
          }
          ))))}
        ,s.popDeleteFruit=function(e){
          var t=this;
          this.popNum+=2,this.popNum>=this.fruitNum&&(x.instance.gameIsOver=!0,x.instance.canTouch=!1),this.updataFruitNum(),D.getRandomNum(-180,-100),D.getRandomNum(100,180),0==this.NoTouchFruitNum&&!this.isFruitNodeHasDropChildren()&&this.isGridDeleteHasChildren()&&(console.log("极端失败1"),this.OverEffect(!0)),W.vibrate();
          for(var n=function(n){
            var i=e[n],o=i.getComponent(G),r=D.convetOtherNodeSpace(i,t.uiNode);
            o.spr.getComponent(g).material=t.highlightMaterial;
            var a=i.scale.x,s=t.FruitManager.getComponent(P).allFruitNode;
            s.splice(s.indexOf(i),1),B.getVisibleSize().height,v(i).to(.06,{
              scale:y(1.15*a,1.15*a,1.15*a)}
            ).to(.15,{
              scale:y(0,0,0)}
            ).call((function(){
              t.createPoint(r,o.type),t.node.worldPosition,1==n&&(t.PopComboRecord(!0),t.PopMusicSelect(),t.popNum>=t.fruitNum&&t.scheduleOnce((function(){
                t.successEffect()}
              ),.2))}
            )).removeSelf().start()}
          ,i=0;
          i<e.length;
          i++)n(i)}
        ,s.NextLevel=function(){
          if(console.log("NextLevel"),O.isReplay=!1,C.loadScene(O.instance.Game2SceneName),this.fruitNode.children.length>0)for(var e=0;
          e<this.fruitNode.children.length;
          e++)this.fruitNode.children[e].destroy();
          if(this.FruitManager.children.length>0)for(var t=0;
          t<this.FruitManager.children.length;
          t++)this.FruitManager.children[t].destroy();
          this.initAdGrid(),this.initUI(),this.initGame(),this.prop1Num=3,this.prop2Num=3,this.showPropBtn("prop1"),this.showPropBtn("prop2")}
        ,s.successEffect=function(){
          O.instance.duckLevelInformation=null,x.instance.gameIsOver=!0,x.instance.canTouch=!1,C.preloadScene(O.instance.Game2SceneName),V._ins.reportStage(2e6+O.instance.level2,"end","win",0),E.instance.playSound("ui/victoryStinger"),this.gameSuccess(),D.getRandomNum(0,1,!0)}
        ,s.gameSuccess=function(){
          var e=this;
          W.stopGyroscope(),O.instance.failNum_Game2=0,H.instance.bundleLoad("uiBundle",U.SuccessUI.path,null,(function(t,n){
            t?console.log(t):_(n).parent=e.uiNode}
          ))}
        ,s.judgeNullLose=function(){
          0!=this.NoTouchFruitNum||this.isFruitNodeHasDropChildren()||(console.log("lose4"),this.OverEffect(!0))}
        ,s.OverEffect=function(e){
          var t=this;
          if(void 0===e&&(e=!1),!x.instance.gameIsOver){
            x.instance.gameIsOver=!0,x.instance.canTouch=!1,V._ins.reportStage(2e6+O.instance.level2,"end","lose",0);
            for(var n=function(){
              var e=t.fruitNode.children[i];
              if(!e.isValid)return 1;
              var n=e.getComponent(G);
              t.scheduleOnce((function(){
                D.flashRed(n.spr),E.instance.playSound("ui/failurePrompt",.6)}
              ),.1)}
            ,i=0;
            i<this.fruitNode.children.length;
            i++)n();
            var o=null;
            H.instance.bundleLoad("DuckBundle","prefab/FullNode",null,(function(n,i){
              n?console.log(n):((o=_(i)).parent=t.node,o.getComponent(b).opacity=0,o.setPosition(d("Canvas/realWall/line").position),e?(o.getChildByName("无法消除").active=!0,o.getChildByName("槽位已满").active=!1):(o.getChildByName("槽位已满").active=!0,o.getChildByName("无法消除").active=!1),v(o.getComponent(b)).delay(.5).call((function(){
                E.instance.playSound("fruitGame/slotFull")}
              )).to(.3,{
                opacity:255}
              ).delay(1.5).to(.3,{
                opacity:0}
              ).call((function(){
                o.destroy()}
              )).start(),v(o).delay(.5).by(.3,{
                position:y(0,600,0)}
              ).start())}
            )),this.reviveNum>0?H.instance.bundleLoad("uiBundle",U.ReviveUI.path,null,(function(e,n){
              e?console.log(e):t.scheduleOnce((function(){
                var e=_(n);
                e.parent=t.uiNode,e.getComponent(z).setRevivePanel(t.reviveNum)}
              ),2)}
            )):this.scheduleOnce((function(){
              t.gameEnd()}
            ),2)}
        }
        ,s.gameEnd=function(){
          var e=this;
          W.stopGyroscope(),E.instance.stopMusic(),O.instance.failNum_Game2++,O.instance.level2>=1&&V._ins.showInterstitialAd("失败"),H.instance.bundleLoad("uiBundle",U.OverUI.path,null,(function(t,n){
            t?console.log(t):_(n).parent=e.uiNode}
          ))}
        ,s.replay=function(){
          O.isReplay=!0,C.loadScene(O.instance.Game2SceneName)}
        ,s.pop=function(e,t){
          var n=this;
          void 0===t&&(t=!0),this.popNum+=2,W.vibrate(),this.popNum>=this.fruitNum&&(x.instance.gameIsOver=!0,x.instance.canTouch=!1);
          for(var i=function(i){
            var o=e[i],r=o.getComponent(G);
            if(r.dropFlag||r.inGridFlag||n.NoTouchFruitNum--,r.inGridFlag){
              n.DeleteGridArr.splice(n.DeleteGridArr.indexOf(o),1);
              for(var a=[],s=0;
              s<n.DeleteGridArr.length;
              s++)a.push(n.DeleteGridArr[s].name)}
            r.lockFlag&&r.closeLockNode(),r.belongToHole&&r.removeFromHole();
            var l=D.convetOtherNodeSpace(o,n.uiNode);
            r.spr.getComponent(g).material=n.highlightMaterial,D.setParent(o,d("Canvas/propDelete"));
            var c=o.getChildByName("spr").worldScale.x,u=n.FruitManager.getComponent(P).allFruitNode;
            u.splice(u.indexOf(o),1),v(o.getChildByName("spr")).to(.1,{
              worldScale:y(1.1*c,1.1*c,1.1*c)}
            ).to(.1,{
              worldScale:y(c,c,c)}
            ).to(.1,{
              worldScale:y(1.1*c,1.1*c,1.1*c)}
            ).call((function(){
              r.closeCollider(),n.createPoint(l,r.type),1==i&&t&&(n.tryFruitMove(),n.updataFruitNum(),n.PopComboRecord(!0),n.PopMusicSelect(),n.popNum>=n.fruitNum&&n.scheduleOnce((function(){
                n.successEffect()}
              ),.2)),o.destroy()}
            )).start()}
          ,o=0;
          o<e.length;
          o++)i(o)}
        ,s.createPoint=function(e,t){
          var n=this,i=1;
          1==t?i=9:2==t||9==t||13==t||15==t||25==t||28==t?i=1:4==t||10==t||19==t||21==t?i=2:12==t||14==t||16==t||18==t||24==t||26==t||27==t?i=3:5==t||17==t||29==t||32==t||34==t?i=4:6==t?i=6:3==t?i=8:22==t||30==t?i=9:20==t||31==t?i=12:7==t||8==t||11==t||23==t?i=13:33==t&&(i=15);
          var o=_(H.instance.getPrefab("deletePulseCircle"));
          o.parent=this.uiNode,o.getComponent(g).color=D.getColorFromHex(O.colorArr2[i-1]),o.setPosition(e),o.setScale(0,0,0),v(o).to(.2,{
            scale:y(1.2,1.2,1.2)}
          ).delay(.05).removeSelf().start(),v(o.getComponent(b)).delay(.2).to(.05,{
            opacity:0}
          ).start();
          for(var r=function(){
            var t=_(H.instance.getPrefab("colorMarkerParticle"));
            t.parent=n.uiNode,O.nameArr2[i-1],t.getComponent(g).spriteFrame=H.instance.getSpriteFrame("colorMarker"+O.nameArr2[i-1]);
            var o=D.getRandomNum(0,360,!0),r=D.degreesToVectors(o),a=D.getRandomNum(0,75,!0);
            t.setPosition(e.x+r.x*a,e.y+r.y*a);
            var s=D.getRandomNum(75,120,!0),l=y(t.x+s*r.x,t.y+s*r.y),c=s/100;
            v(t).call((function(){
              var e=D.getRandomNum(1.2,1.8);
              t.setScale(e,e,e),t.getComponent(b).opacity=255}
            )).parallel(v(t).to(c,{
              position:l}
            ),v(t).to(c,{
              scale:y(0,0,0)}
            ),v(t.getComponent(b)).to(c,{
              opacity:0}
            )).removeSelf().start(),v(t).by(1,{
              angle:360*D.GetPositiveNegative()}
            ).start()}
          ,a=0;
          a<7;
          a++)r()}
        ,s.fruitPop=function(e,t){
          void 0===t&&(t=!0);
          for(var n=e.getComponent(G),i=this.FruitManager.getComponent(P).allFruitNode,o=i.length,r=[e],a=0;
          a<o;
          a++){
            var s=i[a],l=s.getComponent(G);
            if(s!==e){
              if(n.type===l.type){
                r.push(s);
                break}
              if(r.length>=2)break}
          }
          if(r.length>=2){
            x.instance.canTouch=!0,x.instance.btnCanTouch=!0,x.instance.canTouchNail=!1;
            for(var c=0;
            c<r.length;
            c++)r[c].getComponent(G);
            this.pop(r,t)}
        }
        ,s.isFruitNodeHasDropChildren=function(){
          for(var e=0;
          e<this.fruitNode.children.length;
          e++)if(this.fruitNode.children[e].getComponent(G).dropFlag)return!0;
          return!1}
        ,s.isGridDeleteHasChildren=function(){
          return this.DeleteGridArr.length>0}
        ,s.sortGridSibling=function(){
          this.DeleteGridArr.forEach((function(e,t){
            e.setSiblingIndex(t)}
          ))}
        ,s.tryFruitMove=function(){
          console.log("tryFruitMove");
          var e=this.getBottomFruit(),t=this.FruitManager.getComponent(P)._stopFruitDownY;
          e&&e.getPosition().y>t-50&&L.instance.emit(F.ALL_FRUIT_MOVE)}
        ,s.getBottomFruit=function(e){
          void 0===e&&(e=!1);
          for(var t=99999,n=null,i=this.FruitManager.getComponent(P).allFruitNode,o=0;
          o<i.length;
          o++)e&&"fruit66"==i[o].name||i[o].getComponent(G).belongToHole||i[o].getComponent(G).canPop&&i[o].getPosition().y<t&&(t=i[o].getPosition().y,n=i[o]);
          return n}
        ,s.getTopFruit=function(){
          for(var e=0,t=this.FruitManager.getComponent(P).allFruitNode,n=0;
          n<t.length;
          n++)t[n].getComponent(G).canPop&&t[n].getPosition().y>e&&(e=t[n].getPosition().y,t[n])}
        ,s.adGridShakeMove=function(){
          var e=this;
          if(!this.AdShakeMoveFlag&&(this.AdShakeMoveFlag=!0,this.DeleteGridArr.length>=this.maxLenGridNum-1))for(var t=0;
          t<this.adGridNodeArr.length;
          t++){
            var n=this.adGridNodeArr[t].getChildByName("tip");
            v(n).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:0}
            ).delay(.2).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:0}
            ).delay(.2).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:0}
            ).delay(.2).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:10}
            ).to(.2,{
              angle:-10}
            ).to(.1,{
              angle:0}
            ).call((function(){
              e.AdShakeMoveFlag=!1}
            )).start()}
        }
        ,s.adGridBack=function(){
          var e=this;
          x.instance.canTouch&&!x.instance.gameIsOver&&1!=O.instance.level2&&(W.vibrate(),x.instance.canTouch=!1,x.instance.btnCanTouch=!1,O.instance.btnChangeShareNum<V._ins.shareTimesDay?V._ins.shareApp(!1,null,(function(){

            O.instance.btnChangeShareNum+=1,e.finishVideoToAdGrid()}
          ),(function(){
            x.instance.canTouch=!0,x.instance.btnCanTouch=!0}
          )):V._ins.showVideoAd("解锁单个格子道具模式2",(function(t){
            e.finishVideoToAdGrid()}
          ),(function(){
            x.instance.btnCanTouch=!0,x.instance.canTouch=!0}
          )))}
        ,s.finishVideoToAdGrid=function(){
          3==this.maxLenGridNum?(this.adGridNodeArr[1].active=!1,this.maxLenGridNum++,this.adGridNodeArr[0].children[0].active=!0):4==this.maxLenGridNum&&(this.adGridNodeArr[0].active=!1,this.maxLenGridNum++),this.updateAdGridTip(),x.instance.btnCanTouch=!0,x.instance.canTouch=!0}
        ,s.updateAdGridTip=function(){
          O.instance.btnChangeShareNum<V._ins.shareTimesDay?this.adGridNodeArr.forEach((function(e){
            e.children[0].children[0].active=!1,e.children[0].children[1].active=!0}
          )):this.adGridNodeArr.forEach((function(e){
            e.children[0].children[0].active=!0,e.children[0].children[1].active=!1}
          ))}
        ,s.getTopDeleteGridArr=function(){
          for(var e=this.DeleteGridArr[0],t=1;
          t<this.DeleteGridArr.length;
          t++)this.DeleteGridArr[t].getPosition().y>e.getPosition().y&&(e=this.DeleteGridArr[t]);
          return e}
        ,s.findSameTypeFruit=function(e){
          for(var t=null,n=0;
          n<this.DeleteGridArr.length;
          n++)this.DeleteGridArr[n].getComponent(G).type==e.getComponent(G).type&&this.DeleteGridArr[n]!=e&&(t=this.DeleteGridArr[n]);
          return t}
        ,s.PopComboRecord=function(e){
          e?(this.PopSuccessTime+=1,this.PopRecord=0):!e&&this.PopRecord>=1?(this.PopSuccessTime=0,this.PopRecord=0):!e&&this.PopRecord<1&&(this.PopRecord+=1)}
        ,s.PopMusicSelect=function(){
          var e=this.PopSuccessTime;
          e>7&&(e=7);
          var t="comboMusic/combo_"+e.toString();
          E.instance.playSound(t,1)}
        ,s.WaterMove=function(){
          for(var e=d("Canvas/waterNode"),t=e.getChildByName("water0"),n=e.getChildByName("water1"),i=function(){
            var e=t.children[o],n=e.getComponent(A).width;
            0==o?v(e).to(20,{
              position:y(n,0)}
            ).call((function(){
              e.setPosition(y(-n,0))}
            )).to(20,{
              position:y(0,0)}
            ).union().repeatForever().start():v(e).to(20,{
              position:y(0,0)}
            ).to(20,{
              position:y(n,0)}
            ).call((function(){
              e.setPosition(y(-n,0))}
            )).union().repeatForever().start()}
          ,o=0;
          o<t.children.length;
          o++)i();
          for(var r=function(){
            var e=n.children[a],t=e.getComponent(A).width;
            0==a?v(e).to(13,{
              position:y(t,0)}
            ).call((function(){
              e.setPosition(y(-t,0))}
            )).to(13,{
              position:y(0,0)}
            ).union().repeatForever().start():v(e).to(13,{
              position:y(0,0)}
            ).to(13,{
              position:y(t,0)}
            ).call((function(){
              e.setPosition(y(-t,0))}
            )).union().repeatForever().start()}
          ,a=0;
          a<n.children.length;
          a++)r()}
        ,s.shakeShakeBtn=function(){
          var e=d("Canvas/uiNode/propBg/prop3Btn/propSpr");
          v(e).to(.1,{
            angle:-10}
          ).to(.2,{
            angle:10}
          ).to(.1,{
            angle:0}
          ).delay(.1).to(.1,{
            angle:-10}
          ).to(.2,{
            angle:10}
          ).to(.1,{
            angle:0}
          ).delay(.1).to(.1,{
            angle:-10}
          ).to(.2,{
            angle:10}
          ).to(.1,{
            angle:0}
          ).delay(.1).to(.1,{
            angle:-10}
          ).to(.2,{
            angle:10}
          ).to(.1,{
            angle:0}
          ).start()}
        ,s.lockAdGirdProp=function(e){
          var t=this;
          if(void 0===e&&(e=2),x.instance.btnCanTouch){
            x.instance.btnCanTouch=!1,this.hideTsUI();
            var n=3;
            1==e&&(n=4),H.instance.bundleLoad("uiBundle",U.PropUI.path,null,(function(e,i){
              if(e)return console.log(e),void(x.instance.btnCanTouch=!0);
              var o=_(i);
              o.parent=t.uiNode,o.getComponent(j).setPanel(Number(n))}
            ))}
        }
        ,s.onPropClick=function(e,t){
          var n=this;
          if(x.instance.btnCanTouch&&!x.instance.gameIsOver){
            x.instance.btnCanTouch=!1,E.instance.playSound("ui/buttonClick"),this.hideTsUI();
            var i=!1;
            switch(Number(t)){
              case R.PROP1:if(O.instance.freeProp1Num>0){
                i=!0,O.instance.freeProp1Num--;
                var o=this.propBg.getChildByName("prop1Btn").children[0].getChildByName("redSpr");
                o.children[0].getComponent(h).string=O.instance.freeProp1Num.toString(),O.instance.freeProp1Num<=0&&(o.active=!1)}
              break;
              case R.PROP2:if(O.instance.freeProp2Num>0){
                i=!0,O.instance.freeProp2Num--;
                var r=this.propBg.getChildByName("prop2Btn").children[0].getChildByName("redSpr");
                r.children[0].getComponent(h).string=O.instance.freeProp2Num.toString(),O.instance.freeProp2Num<=0&&(r.active=!1)}
              break;
              case R.PROP3:if(O.instance.freeProp3Num>0){
                i=!0,O.instance.freeProp3Num--;
                var a=this.propBg.getChildByName("prop3Btn").children[0].getChildByName("redSpr");
                a.children[0].getComponent(h).string=O.instance.freeProp3Num.toString(),O.instance.freeProp3Num<=0&&(a.active=!1)}
              break;
              case R.PROP4:i=!1}
            if(console.log("isFree",i),i)switch(x.instance.btnCanTouch=!0,Number(t)){
              case R.PROP1:this.prop1(i);
              break;
              case R.PROP2:this.prop2(i)}
            else H.instance.bundleLoad("uiBundle",U.PropUI.path,null,(function(e,i){
              if(e)return console.log(e),void(x.instance.btnCanTouch=!0);
              var o=_(i);
              o.parent=n.uiNode,o.getComponent(j).setPanel(Number(t))}
            ))}
        }
        ,s.prop1=function(e){
          void 0===e&&(e=!1),x.instance.btnCanTouch=!1,x.instance.canTouch=!1,e||this.prop1Num--,this.prop1Num<1&&this.hidePropBtn("prop1");
          var t=!1;
          this.fruitNum-this.popNum==2&&(t=!0),this.propDeleteBack(t),this.propDeleteBack()}
        ,s.propDeleteBack=function(e){
          if(void 0===e&&(e=!0),!(this.popNum>=this.fruitNum))if(this.DeleteGridArr.length>0){
            var t=this.getTopDeleteGridArr(),n=this.findSameTypeFruit(t);
            if(null==n)this.fruitPop(t,e);
            else{
              var i=[t,n];
              this.pop(i,e),x.instance.btnCanTouch=!0,x.instance.canTouch=!0}
          }
          else{
            console.log("没有可消除的格子");
            for(var o=this.FruitManager.getComponent(P).allFruitNode,r=o[0],a=0;
            a<o.length;
            a++)if(o[a].isValid){
              r=o[a];
              break}
            this.fruitPop(r,e)}
        }
        ,s.prop2=function(e){
          void 0===e&&(e=!1),x.instance.btnCanTouch=!1,x.instance.canTouch=!1,e||this.prop2Num--,this.prop2Num<1&&this.hidePropBtn("prop2"),this.allFruitShuffle()}
        ,s.ShakeBtnBack=function(){
          var e=this;
          !x.instance.gameIsOver&&x.instance.canTouch&&x.instance.btnCanTouch&&(E.instance.playSound("ui/buttonClick"),this.adShakeLock?V._ins.showVideoAd("解锁点击摇摇",(function(){
            return e.prop3()}
          )):this.prop3())}
        ,s.prop3=function(e){
          d("Canvas/uiNode/propBg/prop3Btn/adSpr").active=!1,this.adShakeLock=!1;
          var t=0==D.getRandomNum(0,1,!0)?1:-1,n=D.getRandomNum(5,7);
          this.moveFruitByGyroscope(t*n,0)}
        ,s.prop4=function(e){
          console.log("解锁全部木板"),this.finishVideoToAdGrid(),this.finishVideoToAdGrid(),x.instance.canTouch=!0,x.instance.btnCanTouch=!0}
        ,s.prop5=function(e){
          console.log("解锁单个木板"),this.finishVideoToAdGrid(),x.instance.canTouch=!0,x.instance.btnCanTouch=!0}
        ,s.revive=function(){
          this.reviveNum--;
          for(var e=[],t=(this.FruitManager.getComponent(P).allFruitNode,0);
          t<this.DeleteGridArr.length;
          t++)this.DeleteGridArr[t].getComponent(G).setSprColor(w.WHITE);
          for(var n=0;
          n<this.fruitNode.children.length;
          n++)if(!this.DeleteGridArr.includes(this.fruitNode.children[n])&&this.fruitNode.children[n].isValid){
            var i=this.fruitNode.children[n];
            e.push(i)}
          else if(this.fruitNode.children[n].getComponent(G).lastJudgeFlag){
            var o=this.fruitNode.children[n];
            e.push(o)}
          for(var r=0,a=this.DeleteGridArr.length-1;
          a>=0&&(this.DeleteGridArr[a].getComponent(G).lastJudgeFlag||(e.push(this.DeleteGridArr[a]),r++),2!=r);
          a--);
          for(var s=0;
          s<e.length;
          s++){
            var l=e[s];
            this.DeleteGridArr.includes(l)&&this.DeleteGridArr.splice(this.DeleteGridArr.indexOf(l),1)}
          var c=this.getBottomFruit(),u=0;
          null==c?u=d("Canvas/gameNode/block").getPosition().y+100:c.getPosition().y;
          for(var h=u,p=0;
          p<e.length;
          p++)e[p].getComponent(G).reset(this.getSafePos(h));
          this.scheduleOnce((function(){
          }
          ),.7)}
        ,s.getSafePos=function(e){
          for(var t=y(D.getRandomNum(-300,300,!0),D.getRandomNum(e,600,!0)),n=this.FruitManager.getComponent(P).allFruitNode,i=function(e){
            for(var t=0;
            t<n.length;
            t++)if(k.distance(e,n[t].getPosition())<n[t].getComponent(G).radius)return!1;
            return!0}
          ,o=0;
          !(i(t)||(o++,t=y(D.getRandomNum(-350,350,!0),D.getRandomNum(e,600,!0)),o>=200));
          );
          return t}
        ,s.allFruitShuffle=function(){
          var e=this;
          x.instance.canTouch=!1;
          for(var t=[],n=this.FruitManager.getComponent(P).allFruitNode,i=0;
          i<n.length;
          i++)n[i].getComponent(G).inGridFlag||null!=n[i].getComponent(G).belongToHole||t.push(n[i]);
          for(var o=0;
          o<t.length;
          o++)t[o].getComponent(G).inGridFlag||null!=t[o].getComponent(G).belongToHole||t[o].getComponent(G).reset();
          for(var r=[],a=0;
          a<t.length;
          a++)-1==this.DeleteGridArr.indexOf(t[a])&&null==t[a].getComponent(G).belongToHole&&r.push(t[a].getPosition());
          if(2==r.length)r.reverse();
          else{
            D.aginSortArr(r);
            var s=this.getSameFruitInDeleteGridArr(t);
            r=this.getArrBottomPos(r,s)}
          for(var l=0,c=(this.FruitManager.children,0);
          c<t.length;
          c++)null==t[c].getComponent(G).belongToHole&&(t[c].getComponent(G).moveTo(r[l]),l++);
          this.scheduleOnce((function(){
            x.instance.btnCanTouch=!0,x.instance.canTouch=!0,e.FruitManager.getComponent(P).sortFruitByY()}
          ),.8)}
        ,s.getTopFruitInDeleteGridArr=function(){
          for(var e=null,t=0;
          t<this.DeleteGridArr.length;
          t++){
            var n=this.DeleteGridArr[t];
            (null==e||e.position.y<n.position.y)&&(e=n)}
          return e}
        ,s.getSameFruitInDeleteGridArr=function(e){
          var t=this.getTopFruitInDeleteGridArr();
          if(null==t)return 0;
          this.FruitManager.children;
          for(var n=0,i=0;
          i<e.length;
          i++)e[i].getComponent(G).type==t.getComponent(G).type&&1==e[i].getComponent(G).canPop&&null==e[i].getComponent(G).belongToHole&&(n=i);
          return n}
        ,s.getArrBottomPos=function(e,t){
          for(var n=0,i=0;
          i<e.length;
          i++)e[i].y<e[n].y&&(n=i);
          var o=e[t];
          return e[t]=e[n],e[n]=o,e}
        ,s.hidePropBtn=function(e){
          var t=this.propBg.getChildByName(e+"Btn");
          t.getComponent(p).interactable=!1,t.getComponent(g).grayscale=!0}
        ,s.showPropBtn=function(e){
          var t=this.propBg.getChildByName(e+"Btn");
          t.getComponent(p).interactable=!0,t.getComponent(g).grayscale=!1}
        ,s.hideTsUI=function(){
          this.tscd=10;
          for(var e=[this.propBg.getChildByName("prop1Btn"),this.propBg.getChildByName("prop2Btn")],t=0;
          t<e.length;
          t++)N.stopAllByTarget(e[t]),e[t].scale=y(O.instance.propScale,O.instance.propScale,O.instance.propScale),e[t].angle=0}
        ,s.reportBtnClick=function(){
          var e=this;
          E.instance.playSound("ui/buttonClick"),H.instance.bundleLoad("uiBundle",U.ReportPanel.path,null,(function(t,n){
            t?console.log(t):_(n).parent=e.node}
          ))}
        ,s.showShareLose=function(){
          H.instance.bundleLoad("uiBundle","prefab/share_lose",null,(function(e,t){
            if(e)console.log(e);
            else{
              var n=_(t);
              n.parent=d("Canvas"),n.setPosition(0,0),n.setScale(k.ZERO),v(n).to(.2,{
                scale:k.ONE}
              ).start(),v(n).to(.6,{
                position:y(0,100,0)}
              ).removeSelf().start()}
          }
          ))}
        ,s.onEnable=function(){
          L.instance.on(F.HIDE_BOTTOM_WALL,this.HideBottomWall,this),L.instance.on(F.NEXT_LEVEL,this.NextLevel,this),L.instance.on(F.REPLAY,this.replay,this),L.instance.on(F.PROP1,this.prop1,this),L.instance.on(F.PROP2,this.prop2,this),L.instance.on(F.PROP4,this.prop4,this),L.instance.on(F.PROP5,this.prop5,this),L.instance.on(F.REVIVE,this.revive,this),L.instance.on(F.GAME_END,this.gameEnd,this),L.instance.on(F.SHOW_SHARE_LOSE,this.showShareLose,this),this.reportBtn.node.on(p.EventType.CLICK,this.reportBtnClick,this)}
        ,s.onDisable=function(){
          L.instance.off(F.HIDE_BOTTOM_WALL,this.HideBottomWall,this),L.instance.off(F.NEXT_LEVEL,this.NextLevel,this),L.instance.off(F.REPLAY,this.replay,this),L.instance.off(F.PROP1,this.prop1,this),L.instance.off(F.PROP2,this.prop2,this),L.instance.off(F.PROP4,this.prop4,this),L.instance.off(F.PROP5,this.prop5,this),L.instance.off(F.REVIVE,this.revive,this),L.instance.off(F.GAME_END,this.gameEnd,this),this.reportBtn.node.off(p.EventType.CLICK,this.reportBtnClick,this);
          for(var e=0;
          e<34;
          e++)J.Delete("fruit"+e)}
        ,s.HideBottomWall=function(){
          d("Canvas/wallNode/wallDown").active=!1}
        ,t}
      (T)).prototype,"FruitManager",[K],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),ee=t(Z.prototype,"highlightMaterial",[X],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),Q=Z))||Q)),s._RF.pop()}
  }
}
))

