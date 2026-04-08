/**
 * Semantic view: chunks:///_virtual/HomeScene.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Label
 * - a => instantiate
 * - A => releaseType
 * - b => Color
 * - B => ResManager
 * - C => director
 * - d => UITransform
 * - D => default
 * - E => TooYueManager
 * - f => view
 * - F => AdManager
 * - g => Vec3
 * - G => AdManager_ZJ
 * - h => Sprite
 * - I => AddTablePanelView
 * - k => GameCtrl
 * - l => tween
 * - L => Util
 * - m => find
 * - M => UIConfigTable
 * - n => asyncToGenerator
 * - N => GameModel
 * - o => cclegacy
 * - p => Tween
 * - P => EVENT_KEYS
 * - r => _decorator
 * - R => ReceivePanelView
 * - s => UIOpacity
 * - S => easing
 * - t => inheritsLoose
 * - T => AudioManager
 * - v => Button
 * - w => Component
 * - x => AddPowerPanelView
 * - y => EditBox
 */
/**
 * Restored module: chunks:///_virtual/HomeScene.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Label
 * - a => instantiate
 * - A => releaseType
 * - b => Color
 * - B => ResManager
 * - C => director
 * - d => UITransform
 * - D => default
 * - E => TooYueManager
 * - f => view
 * - F => AdManager
 * - g => Vec3
 * - G => AdManager_ZJ
 * - h => Sprite
 * - I => AddTablePanelView
 * - k => GameCtrl
 * - l => tween
 * - L => Util
 * - m => find
 * - M => UIConfigTable
 * - n => asyncToGenerator
 * - N => GameModel
 * - o => cclegacy
 * - p => Tween
 * - P => EVENT_KEYS
 * - r => _decorator
 * - R => ReceivePanelView
 * - s => UIOpacity
 * - S => easing
 * - t => inheritsLoose
 * - T => AudioManager
 * - v => Button
 * - w => Component
 * - x => AddPowerPanelView
 * - y => EditBox
 */
System.register("chunks:///_virtual/HomeScene.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./GameCtrl.ts","./AudioManager.ts","./ResManager.ts","./Enum.ts","./ConfigTable.ts","./AddTablePanelView.ts","./AdManager.ts","./ReceivePanelView.ts","./Util.ts","./AddPowerPanelView.ts","./EventManager.ts","./AdManager_ZJ.ts","./TooYueManager.ts"],(function(e){
  var t /* inheritsLoose */, n /* asyncToGenerator */, o /* cclegacy */, r /* _decorator */, a /* instantiate */, s /* UIOpacity */, l /* tween */, c, u, d /* UITransform */, h /* Sprite */, p /* Tween */, f /* view */, g /* Vec3 */, m /* find */, v /* Button */, y /* EditBox */, _ /* Label */, b /* Color */, S /* easing */, C /* director */, w /* Component */, N /* GameModel */, k /* GameCtrl */, T /* AudioManager */, B /* ResManager */, A /* releaseType */, P /* EVENT_KEYS */, M /* UIConfigTable */, I /* AddTablePanelView */, F /* AdManager */, R /* ReceivePanelView */, L /* Util */, x /* AddPowerPanelView */, D /* default */, G /* AdManager_ZJ */, E /* TooYueManager */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */,n=e.asyncToGenerator /* asyncToGenerator */}
    ,function(e){
      o=e.cclegacy /* cclegacy */,r=e._decorator /* _decorator */,a=e.instantiate /* instantiate */,s=e.UIOpacity /* UIOpacity */,l=e.tween /* tween */,c=e.v3,u=e.sp,d=e.UITransform /* UITransform */,h=e.Sprite /* Sprite */,p=e.Tween /* Tween */,f=e.view /* view */,g=e.Vec3 /* Vec3 */,m=e.find /* find */,v=e.Button /* Button */,y=e.EditBox /* EditBox */,_=e.Label /* Label */,b=e.Color /* Color */,S=e.easing /* easing */,C=e.director /* director */,w=e.Component /* Component */}
    ,function(e){
      N=e.GameModel /* GameModel */}
    ,function(e){
      k=e.GameCtrl /* GameCtrl */}
    ,function(e){
      T=e.AudioManager /* AudioManager */}
    ,function(e){
      B=e.ResManager /* ResManager */}
    ,function(e){
      A=e.releaseType /* releaseType */,P=e.EVENT_KEYS /* EVENT_KEYS */}
    ,function(e){
      M=e.UIConfigTable /* UIConfigTable */}
    ,function(e){
      I=e.AddTablePanelView /* AddTablePanelView */}
    ,function(e){
      F=e.AdManager /* AdManager */}
    ,function(e){
      R=e.ReceivePanelView /* ReceivePanelView */}
    ,function(e){
      L=e.Util /* Util */}
    ,function(e){
      x=e.AddPowerPanelView /* AddPowerPanelView */}
    ,function(e){
      D=e.default /* default */}
    ,function(e){
      G=e.AdManager_ZJ /* AdManager_ZJ */}
    ,function(e){
      E=e.TooYueManager /* TooYueManager */}
    ],execute:function(){
      var O;
      o._RF.push({
      }
      ,"41600+LvwJGXYtsP0TDLJW6","HomeScene",void 0);
      var H=r.ccclass;
      r.property,e("HomeScene",H("HomeScene")(O=function(e){
        function o(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this).cloudNode=null,t.title=null,t.circle=null,t.ani=null,t.pigeonAni=null,t.cockStartBtn=null,t.goSideBarBtn=null,t.shareBtn=null,t.rankBtn=null,t.addTableBtn=null,t.addProgramBtn=null,t.bookBtn=null,t.bookPigeonBtn=null,t.AwemeBtn=null,t.subscribeBtn=null,t.gooseBtn=null,t.joinGroupBtn=null,t.pigeonStartBtn=null,t.game2Btn=null,t.game3Btn=null,t.colorBg=null,t.powerBox=null,t.hole=null,t.light=null,t.exitBox=null,t.autoPlayBtn1=null,t.isFromSidebar=!1,t.bgType=0,t.speed=200,t.ITime1=0,t.ITime2=0,t.ITime3=0,t.ITime4=0,t.ITime5=0,t.pTime1=4,t.pTime2=5,t.pTime3=6,t.pTime4=7,t.pTime5=8,t.particleTime=0,t.particleCd=1,t.gmBtnType=!0,t}
        t(o,e);
        var r=o.prototype;
        return r.onLoad=function(){
          N.isReplay=!1,N.bgNum?this.bgType=N.bgNum:this.bgType=this.isShowSpecialBg()+1,console.log(this.bgType),this.initNode(),this.initUI(),this.uiAnimation(),7==this.bgType?(console.log("纯色背景"),T.instance.playMusic("bgm/pureColor")):(console.log("普通背景"),T.instance.playMusic("bgm/defaultGameplay")),N.instance.failNum=0,N.instance.failNum_Game2=0,N.instance.failNum_Game3=0,E.userMsg?(E.userMsg.userTags.includes("gm")||N.instance.releaseType==A.test_TEST)&&(N.LockAllDuck=!0,N.instance.btnChangeShareNum=0,E._ins.shareTimesDay=0,console.log("gm权限")):N.instance.releaseType==A.test_TEST&&(N.instance.btnChangeShareNum=0,E._ins.shareTimesDay=0,N.LockAllDuck=!0)}
        ,r.start=function(){
          this.createSetBtn(),this.showSideBar(),this.floorMove(),this.InitThing(),this.frogMove(),this.flashMove(),this.initDuckSkin(),this.initPigeonSkin()}
        ,r.createSetBtn=function(){
          var e=this;
          B.instance.bundleLoad("uiBundle",M.setBtn.path,null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=a(n);
              i.parent=e.node;
              var o=i.getComponent(s);
              o.opacity=0;
              var r=i.scale.x;
              l(i).delay(0).call((function(){
                o.opacity=255,i.setScale(0,0,0)}
              )).to(.1,{
                scale:c(r,r,r)}
              ).start()}
          }
          ))}
        ,r.initDuckSkin=function(){
          var e=this.getDuckSkinName(),t=(this.circle.getChildByName("ani").getComponent(u.Skeleton).setSkin(e),this.GetTypeNumber());
          1==t?this.ani.getComponent(u.Skeleton).animation="walk4":0==t&&(this.ani.getComponent(u.Skeleton).animation="walk3")}
        ,r.initPigeonSkin=function(){
          var e=N.PigeonNameArr.indexOf(N.instance.pigeonName);
          e<7?(this.pigeonAni.getChildByName("Ghost").active=!0,this.pigeonAni.getChildByName("Ghost2").active=!1,this.pigeonAni.getChildByName("Ghost3").active=!1,this.pigeonAni.getChildByName("Ghost4").active=!1,this.pigeonAni.getChildByName("Ghost").getComponent(u.Skeleton).setSkin(N.pigeonSkinName[e])):7==e?(this.pigeonAni.getChildByName("Ghost").active=!1,this.pigeonAni.getChildByName("Ghost2").active=!0,this.pigeonAni.getChildByName("Ghost3").active=!1,this.pigeonAni.getChildByName("Ghost4").active=!1):8==e?(this.pigeonAni.getChildByName("Ghost").active=!1,this.pigeonAni.getChildByName("Ghost2").active=!1,this.pigeonAni.getChildByName("Ghost3").active=!0,this.pigeonAni.getChildByName("Ghost4").active=!1):9==e&&(this.pigeonAni.getChildByName("Ghost").active=!1,this.pigeonAni.getChildByName("Ghost2").active=!1,this.pigeonAni.getChildByName("Ghost3").active=!1,this.pigeonAni.getChildByName("Ghost4").active=!0)}
        ,r.update=function(e){
          for(var t=N.instance.screenWidth,n=N.instance.screenHeight,i=0;
          i<this.cloudNode.children.length;
          i++){
            var o=this.cloudNode.children[i];
            o.position=c(o.position.x-this.speed*e*.3,o.position.y,o.position.z),o.position.x<=.5*-t-.5*o.getComponent(d).width&&(o.position=c(L.getRandomNum(700,900,!0),L.getRandomNum(.5*n-.5*o.getComponent(d).height-500,.5*n-.5*o.getComponent(d).height),o.position.z))}
          this.ITime1+=e,this.ITime2+=e,this.ITime3+=e,this.ITime4+=e,this.ITime5+=e,this.ITime1>=this.pTime1&&(this.pTime1=L.getRandomNum(3,6,!1),this.ITime1=0,this.thingsInBgMove("first")),this.ITime2>=this.pTime2&&(this.pTime2=L.getRandomNum(3,6,!1),this.ITime2=0,this.thingsInBgMove("second")),this.ITime3>=this.pTime3&&(this.pTime3=L.getRandomNum(5,7,!1),this.ITime3=0,this.thingsInBgMove("third")),this.ITime4>=this.pTime4&&(this.pTime4=L.getRandomNum(7,9,!1),this.ITime4=0,this.thingsInBgMove("fourth")),this.ITime5>=this.pTime5&&(this.pTime5=L.getRandomNum(11,15,!1),this.ITime5=0,this.thingsInBgMove("fifth")),this.HomeParticleCal(e)}
        ,r.HomeParticleCal=function(e){
          0!=this.bgType&&5!=this.bgType&&6!=this.bgType&&7!=this.bgType&&(this.particleTime+=e,this.particleTime>=this.particleCd&&(this.particleTime=0,this.HomeParticleCreate(),this.particleCd=L.getRandomNum(.3,.7,!1)))}
        ,r.HomeParticleCreate=function(){
          var e=this;
          B.instance.bundleLoad("HomeBundle","prefab/home_particle",null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=a(n);
              i.parent=e.node.getChildByName("particleManager"),B.instance.bundleLoad("HomeBundle","tex/BgParticle/p"+e.bgType+"/spriteFrame",null,(function(e,t){
                e?console.log(e):i.parent&&(i.getComponent(h).spriteFrame=t)}
              ));
              var o=N.instance.screenHeight,r=N.instance.screenWidth,s=c(r/2+100,L.getRandomNum(-100,o/2+100,!0)),u=c(-r/2-100,L.getRandomNum(-100,-o/2-100,!0));
              i.setPosition(s);
              var d=L.getRandomNum(.8,1,!1),p=L.getRandomNum(2.5,3.5,!1),f=L.getRandomNum(0,-270,!0);
              i.setScale(d,d),l(i).to(p,{
                position:u,angle:f}
              ).call((function(){
                i.destroy()}
              )).start()}
          }
          ))}
        ,r.thingsInBgMove=function(){
          var e=n(i().mark((function e(t,n){
            var o,r,s,u,p,f,m,v,y,_,b,S,C,w,k,T,A,P;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(this.bgType>5){
                  e.next=15;
                  break}
                o=this.node.getChildByName("homeBg").getChildByName("firstFloor"),r=this.node.getChildByName("homeBg").getChildByName("secondFloor"),s=this.node.getChildByName("homeBg").getChildByName("thirdFloor"),u=this.node.getChildByName("homeBg").getChildByName("fourthFloor"),p=this.node.getChildByName("homeBg").getChildByName("fifthFloor"),f=this.node.getChildByName("homeBg").getChildByName("Floor"),m=f.children[0].position.y+.5*f.children[0].getComponent(d).height,v=1.5*N.instance.screenWidth,y=m,_="tex/BgThings"+this.bgType+"/front/",b="tex/BgThings"+this.bgType+"/front/",S="tex/BgThings"+this.bgType+"/middle/",C="tex/BgThings"+this.bgType+"/back/",w="tex/BgThings"+this.bgType+"/last/",k=null,T="",A=null,P=0,e.t0=t,e.next="first"===e.t0?5:"second"===e.t0?7:"third"===e.t0?9:"fourth"===e.t0?11:"fifth"===e.t0?13:14;
                break;
                case 5:return T="f"+L.getRandomNum(4,5,!0),A=o,k=_,y=-N.instance.screenHeight/2+L.getRandomNum(50,100),P=10,e.abrupt("break",14);
                case 7:return T="f"+L.getRandomNum(1,3,!0),A=r,k=b,y=m-40,P=10,e.abrupt("break",14);
                case 9:return T="m"+L.getRandomNum(1,2,!0),A=s,k=S,y=m-L.getRandomNum(100,200),P=25,e.abrupt("break",14);
                case 11:return T="b"+L.getRandomNum(1,2,!0),A=u,k=C,y=m-L.getRandomNum(100,200),P=30,e.abrupt("break",14);
                case 13:T="l"+L.getRandomNum(1,1,!0),A=p,k=w,y=m-L.getRandomNum(100,200),P=60;
                case 14:B.instance.bundleLoad("HomeBundle","prefab/bgThing",null,(function(e,t){
                  if(e)console.log(e);
                  else{
                    var i=a(t);
                    i.parent=A;
                    var o;
                    o=n||v,i.position=new g(o,y,0),i.scale=new g(1,1,1),B.instance.bundleLoad("HomeBundle",k+T+"/spriteFrame",null,(function(e,t){
                      e?console.log(e):i.parent&&(i.getComponent(h).spriteFrame=t,l(i).to(P,{
                        position:c(-v,y,0)}
                      ).removeSelf().start())}
                    ))}
                }
                ));
                case 15:case"end":return e.stop()}
            }
            ),e,this)}
          )));
          return function(t,n){
            return e.apply(this,arguments)}
        }
        (),r.stopThingMove=function(){
          for(var e=this.node.getChildByName("homeBg"),t=0;
          t<e.children.length;
          t++)for(var n=0;
          n<e.children[t].children.length;
          n++){
            var i=e.children[t].children[n];
            p.stopAllByTarget(i)}
        }
        ,r.InitThing=function(){
          for(var e=f.getVisibleSize().width,t=0;
          t<2;
          t++){
            var n=L.getRandomNum(-e/2,e/2+500,!0),i=L.getRandomNum(-e/2,e/2+500,!0),o=L.getRandomNum(-e/2,e/2+500,!0),r=L.getRandomNum(-e/2,e/2+500,!0),a=L.getRandomNum(-e/2,e/2+500,!0);
            this.thingsInBgMove("first",n),this.thingsInBgMove("third",o),this.thingsInBgMove("fourth",r),this.thingsInBgMove("fifth",a),1!=t&&this.thingsInBgMove("second",i)}
        }
        ,r.floorMove=function(){
          var e=this.node.getChildByName("homeBg").getChildByName("Floor"),t=f.getVisibleSize().width;
          l(e.children[0]).to(5,{
            position:c(-t,e.children[0].position.y,0)}
          ).call((function(){
            e.children[0].setPosition(t,e.children[0].position.y,0)}
          )).to(5,{
            position:c(0,e.children[0].position.y,0)}
          ).union().repeatForever().start(),l(e.children[1]).to(5,{
            position:c(0,e.children[1].position.y,0)}
          ).to(5,{
            position:c(-t,e.children[1].position.y,0)}
          ).call((function(){
            e.children[1].setPosition(t,e.children[1].position.y,0)}
          )).union().repeatForever().start()}
        ,r.frogMove=function(){
          var e=this.node.getChildByName("homeBg").getChildByName("frog"),t=this.node.getChildByName("homeBg").getChildByName("Floor"),n=f.getVisibleSize().width,i=t.children[0].position.y+.5*t.children[0].getComponent(d).height-50;
          e.children[0].position=new g(e.children[0].position.x,i,0),e.children[1].position=new g(e.children[1].position.x,i,0),l(e.children[0]).to(10,{
            position:c(-n,i,0)}
          ).call((function(){
            e.children[0].setPosition(n,i,0)}
          )).to(10,{
            position:c(0,i,0)}
          ).union().repeatForever().start(),l(e.children[1]).to(20,{
            position:c(-n,i,0)}
          ).call((function(){
            e.children[1].setPosition(n,i,0)}
          )).union().repeatForever().start()}
        ,r.flashMove=function(){
          var e=this,t=this.circle.getChildByName("duckShadow");
          l(this.light.getComponent(s)).delay(1).call((function(){
            e.light.getComponent(s).opacity=180}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=180}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.5).call((function(){
            e.light.getComponent(s).opacity=180}
          )).delay(.3).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.3).to(.5,{
            opacity:255}
          ).start(),l(t.getComponent(s)).delay(1).call((function(){
            e.light.getComponent(s).opacity=90}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=90}
          )).delay(.1).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.5).call((function(){
            e.light.getComponent(s).opacity=90}
          )).delay(.3).call((function(){
            e.light.getComponent(s).opacity=0}
          )).delay(.3).to(.5,{
            opacity:140}
          ).start()}
        ,r.initNode=function(){
          this.cloudNode=this.node.getChildByName("cloudNode"),this.title=this.node.getChildByName("title"),this.circle=this.node.getChildByName("homeBg").getChildByName("duck").getChildByName("circle"),this.ani=this.circle.getChildByName("ani"),this.pigeonAni=m("Canvas/homeBg/duck/ghost"),this.cockStartBtn=this.node.getChildByName("cockStartBtn").getComponent(v),this.goSideBarBtn=this.node.getChildByName("goSideBarBtn").getComponent(v),this.shareBtn=this.node.getChildByName("shareBtn").getComponent(v),this.rankBtn=this.node.getChildByName("rankBtn").getComponent(v),this.addTableBtn=this.node.getChildByName("addTableBtn").getComponent(v),this.addProgramBtn=this.node.getChildByName("addProgramBtn").getComponent(v),this.bookBtn=this.node.getChildByName("bookBtn").getComponent(v),this.bookPigeonBtn=this.node.getChildByName("bookPigeonBtn").getComponent(v),this.exitBox=this.node.getChildByName("editBox").getComponent(y),this.autoPlayBtn1=this.node.getChildByName("autoPlayBtn1").getComponent(v),this.hole=this.node.getChildByName("homeBg").getChildByName("Hole"),this.light=this.node.getChildByName("homeBg").getChildByName("duck").getChildByName("light"),this.AwemeBtn=this.node.getChildByName("AwemeBtn").getComponent(v),this.subscribeBtn=this.node.getChildByName("subscribeBtn").getComponent(v),this.gooseBtn=this.node.getChildByName("gooseBtn").getComponent(v),this.joinGroupBtn=this.node.getChildByName("joinGroupBtn").getComponent(v),this.pigeonStartBtn=this.node.getChildByName("pigeonStartBtn").getComponent(v),this.game2Btn=this.node.getChildByName("game2Btn").getComponent(v),this.game3Btn=this.node.getChildByName("game3Btn").getComponent(v),this.colorBg=m("Canvas/homeBg/colorBg"),this.createPowerBox()}
        ,r.createPowerBox=function(){
          var e=this;
          B.instance.bundleLoad("uiBundle",M.powerBox.path,null,(function(t,n){
            t?console.log(t):(e.powerBox=a(n),e.powerBox.parent=e.node)}
          ))}
        ,r.initUI=function(){
          var e=this;
          if(this.scheduleOnce((function(){
            e.initLight()}
          )),0==N.instance.receiveSideBarGriftNum){
            var t=this.goSideBarBtn.node.getChildByName("奖");
            t.active=!0,L.btnShake(t),this.goSideBarBtn.node.getComponent(u.Skeleton).setAnimation(0,"animation",!0)}
          if(0==N.instance.addTableBtnClickNum){
            var n=this.addTableBtn.node.getChildByName("奖");
            n.active=!0,L.btnShake(n)}
          if(!E.feedSubscribeStatus){
            var i=this.subscribeBtn.node.getChildByName("奖");
            i.active=!0,L.btnShake(i)}
          1==N.instance.cowGameTouched&&1==N.instance.pigeonGameTouched&&1==N.instance.mathGameTouched?this.pigeonStartBtn.node.getChildByName("叹号更多玩法").active=!1:this.pigeonStartBtn.node.getChildByName("叹号更多玩法").active=!0,this.cockStartBtn.node.getChildByName("spr").getChildByName("levelLabel").getComponent(_).string="第"+N.instance.level.toString()+"关";
          for(var o=0;
          o<N.instance.level-1-1;
          o++){
            var r=N.cockNameArr[o];
            N.instance.collectArr.includes(r)||(this.bookBtn.node.getChildByName("new").active=!0)}
          var a=G._ins.getSystemInfoSync();
          (1==N.instance.isAlreadyFollow||E.isFollowAweme||N.instance.releaseType!=A.applet_ziJie)&&(this.AwemeBtn.node.active=!1),(1==N.instance.isAlreadyFeed||E.feedSubscribeStatus||N.instance.releaseType!=A.applet_ziJie||"Toutiao"==a)&&(this.subscribeBtn.node.active=!1),N.instance.releaseType!=A.applet_ziJie&&(this.addTableBtn.node.active=!1,this.goSideBarBtn.node.active=!1,this.rankBtn.node.active=!1,this.joinGroupBtn.node.active=!1,this.pigeonStartBtn.node.active=!1),N.instance.level<102?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!0,this.gooseBtn.node.getChildByName("百鹅朝凤").active=!1):N.instance.level<202?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鹅朝凤").active=!0):N.instance.level<302?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鸭朝龙").active=!0):N.instance.level<402?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鹅朝麟").active=!0):N.instance.level<502?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鸭朝雀").active=!0):N.instance.level<602?(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鹅朝鹏").active=!0):N.instance.level<702&&(this.gooseBtn.node.getChildByName("百鸭朝鹅").active=!1,this.gooseBtn.node.getChildByName("百鸭朝鲲").active=!0),N.instance.level>=702&&(this.gooseBtn.node.active=!1),this.initBg(),this.initColorBg()}
        ,r.initColorBg=function(){
          if(this.bgType<6)return this.colorBg.active=!1,void(this.light.parent.active=!0);
          this.colorBg.active=!0,this.light.parent.active=!1,6==this.bgType?(this.light.parent.active=!0,this.light.active=!1,this.colorBg.getChildByName("danceDuck").active=!1):this.colorBg.getChildByName("danceDuck").active=!0;
          var e=this.colorBg.getChildByName("colorSpr");
          l(e.getComponent(h)).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[0]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[1]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[2]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[3]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[4]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[5]))}
          ,{
            easing:"expoOut"}
          ).to(3,{
            color:new b(L.getColorFromHex(N.colorBg[6]))}
          ,{
            easing:"expoOut"}
          ).union().repeatForever().start();
          for(var t=this.colorBg.getChildByName("danceDuck"),n=0;
          n<t.children.length;
          n++){
            var i=this.getDuckSkinName();
            t.children[n].getComponent(u.Skeleton).setSkin(i)}
          var o=t.position.y;
          l(t).to(.75,{
            position:c(100,o,0)}
          ).to(.01,{
            scale:c(-1,1,1)}
          ).to(1.5,{
            position:c(-100,o,0)}
          ).to(.02,{
            scale:c(1,1,1)}
          ).to(.75,{
            position:c(0,o,0)}
          ).union().repeatForever().start()}
        ,r.getDuckSkinName=function(){
          var e=N.instance.level-1;
          e>N.instance.MaxDuckTypeNum&&0==(e%=N.instance.MaxDuckTypeNum)&&(e=N.instance.MaxDuckTypeNum);
          var t="y"+e.toString();
          return console.log("duck name",N.instance.duckName),N.instance.duckName&&(-1!=N.cockNameArr.indexOf(N.instance.duckName)?t="y"+(N.cockNameArr.indexOf(N.instance.duckName)+1):-1!=N.FruitNameArr.indexOf(N.instance.duckName)?t="f"+(N.FruitNameArr.indexOf(N.instance.duckName)+1):-1!=N.SanGuoNameArr.indexOf(N.instance.duckName)?t="p"+(N.SanGuoNameArr.indexOf(N.instance.duckName)+1):-1!=N.DaWeiWangNameArr.indexOf(N.instance.duckName)&&(t="w"+(N.DaWeiWangNameArr.indexOf(N.instance.duckName)+1))),t}
        ,r.initBg=function(){
          if(!(this.bgType>5)){
            var e=m("Canvas/homeBg/Floor"),t="tex/BgThings"+this.bgType.toString()+"/bottom"+this.bgType.toString()+"/spriteFrame";
            B.instance.bundleLoad("HomeBundle",t,null,(function(t,n){
              if(t)console.log(t);
              else if(e.children)for(var i=0;
              i<e.children.length;
              i++)e.children[i].getComponent(h).spriteFrame=n}
            ));
            var n="tex/BgThings"+this.bgType.toString()+"/homeBg"+this.bgType.toString()+"/spriteFrame",i=m("Canvas/homeBg");
            B.instance.bundleLoad("HomeBundle",n,null,(function(e,t){
              e?console.log(e):i.parent&&(i.getComponent(h).spriteFrame=t)}
            ))}
        }
        ,r.initLight=function(){
          var e=this.circle.getChildByName("ani"),t=L.convetOtherNodeSpace(e,this.circle.parent);
          e.getComponent(d).height,e.getComponent(d).anchorY,this.light.setPosition(0,t.y+30,t.z);
          var n=f.getVisibleSize().height/2-this.light.y;
          this.light.getComponent(d).height=n/(1-this.light.getComponent(d).anchorY)}
        ,r.uiAnimation=function(){
          var e=this;
          this.title.getComponent(s).opacity=0;
          var t=this.title.y;
          this.scheduleOnce((function(){
            e.title.y=N.instance.screenHeight/2+e.title.getComponent(d).height/2,e.title.getComponent(s).opacity=255,l(e.title).to(.5,{
              y:t}
            ,{
              easing:S.backOut}
            ).start()}
          ),0);
          var n=c(this.cockStartBtn.node.scale);
          this.cockStartBtn.node.scale=c(0,0,0),l(this.cockStartBtn.node).to(.5,{
            scale:n}
          ,{
            easing:S.backOut}
          ).call((function(){
          }
          )).start();
          for(var i=[this.addTableBtn,this.rankBtn,this.shareBtn,this.goSideBarBtn,this.addProgramBtn,this.bookBtn,this.AwemeBtn,this.subscribeBtn,this.gooseBtn,this.joinGroupBtn,this.pigeonStartBtn,this.bookPigeonBtn,this.game2Btn,this.game3Btn],o=function(){
            var t=i[r];
            if(!1===t.node.active)return 1;
            var n=t.node.getComponent(s);
            n.opacity=0;
            var o=t.node.position.x,a=o>0?1:-1;
            e.scheduleOnce((function(){
              t.node.x=o+200*a,n.opacity=255,l(t.node).delay(.4).to(.3,{
                x:o}
              ,{
                easing:S.backOut}
              ).start()}
            ),0)}
          ,r=0;
          r<i.length;
          r++)o()}
        ,r.onEnable=function(){
          this.register()}
        ,r.onDisable=function(){
          this.unregister()}
        ,r.register=function(){
          this.cockStartBtn.node.on(v.EventType.CLICK,this.cockStartBtnClick,this),this.addTableBtn.node.on(v.EventType.CLICK,this.addTableBtnClick,this),this.rankBtn.node.on(v.EventType.CLICK,this.rankBtnClick,this),this.shareBtn.node.on(v.EventType.CLICK,this.shareBtnClick,this),this.goSideBarBtn.node.on(v.EventType.CLICK,this.goSideBarBtnClick,this),this.addProgramBtn.node.on(v.EventType.CLICK,this.addProgramBtnClick,this),this.bookBtn.node.on(v.EventType.CLICK,this.bookBtnClick,this),this.bookPigeonBtn.node.on(v.EventType.CLICK,this.bookPigeonBtnClick,this),this.autoPlayBtn1.node.on(v.EventType.CLICK,this.autoPlayBtn1Click,this),this.gooseBtn.node.on(v.EventType.CLICK,this.gooseBtnClick,this),this.joinGroupBtn.node.on(v.EventType.CLICK,this.joinGroupBtnClick,this),this.pigeonStartBtn.node.on(v.EventType.CLICK,this.pigeonStartBtnClick,this),this.game2Btn.node.on(v.EventType.CLICK,this.game2BtnClick,this),this.game3Btn.node.on(v.EventType.CLICK,this.game3BtnClick,this),D.instance.on(P.SIDE_REWARD,this.showSideBar,this),D.instance.on(P.CLOSE_HOME_BTN,this.GmChangeBtn,this),D.instance.on(P.SHOW_SHARE_LOSE,this.showShareLose,this)}
        ,r.unregister=function(){
          this.cockStartBtn.node.off(v.EventType.CLICK,this.cockStartBtnClick,this),this.addTableBtn.node.off(v.EventType.CLICK,this.addTableBtnClick,this),this.rankBtn.node.off(v.EventType.CLICK,this.rankBtnClick,this),this.shareBtn.node.off(v.EventType.CLICK,this.shareBtnClick,this),this.goSideBarBtn.node.off(v.EventType.CLICK,this.goSideBarBtnClick,this),this.bookBtn.node.off(v.EventType.CLICK,this.bookBtnClick,this),this.bookPigeonBtn.node.off(v.EventType.CLICK,this.bookPigeonBtnClick,this),this.addProgramBtn.node.off(v.EventType.CLICK,this.addProgramBtnClick,this),this.gooseBtn.node.off(v.EventType.CLICK,this.gooseBtnClick,this),this.joinGroupBtn.node.off(v.EventType.CLICK,this.joinGroupBtnClick,this),this.pigeonStartBtn.node.off(v.EventType.CLICK,this.pigeonStartBtnClick,this),this.game2Btn.node.off(v.EventType.CLICK,this.game2BtnClick,this),this.game3Btn.node.off(v.EventType.CLICK,this.game3BtnClick,this),D.instance.off(P.SIDE_REWARD,this.showSideBar,this),D.instance.off(P.CLOSE_HOME_BTN,this.GmChangeBtn,this),D.instance.off(P.SHOW_SHARE_LOSE,this.showShareLose,this)}
        ,r.showShareLose=function(){
          B.instance.bundleLoad("uiBundle","prefab/share_lose",null,(function(e,t){
            if(e)console.log(e);
            else{
              var n=a(t);
              n.parent=m("Canvas"),n.setPosition(0,0),l(n).to(.6,{
                position:c(0,100,0)}
              ).removeSelf().start()}
          }
          ))}
        ,r.cockStartBtnClick=function(){
          var e=this;
          if(!1!==k.instance.btnCanTouch){
            if(k.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),N.instance.duckLevelInformation=null,console.log("开始游戏"),this.stopThingMove(),G._ins.reportAnalyticsEvent("Model1"),this.cockStartBtn.getComponent(u.Skeleton).paused=!0,m("Canvas/homeBg/duck/ghost/Ghost").getComponent(u.Skeleton).paused=!0,""!=this.exitBox.string){
              var t=this.exitBox.string.split(" ").map(Number);
              t[0]&&(N.instance.level=t[0]),t[1]&&(N.instance.freeProp1Num=t[1],N.instance.freeProp2Num=t[1],N.instance.freeProp3Num=t[1]),N.instance.duckLevelInformation=null}
            N.instance.userPowerNum>0?(N.instance.subPowerNum(),console.log("体力",this.bgType),6==this.bgType||7==this.bgType?C.loadScene(N.instance.DuckSceneName):this.dropInHole()):(console.log("体力不足"),B.instance.bundleLoad("uiBundle",M.AddPowerPanel.path,null,(function(t,n){
              if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
              var i=a(n);
              i.parent=m("Canvas");
              var o=i.getComponent(x);
              o.purpose="EnterGuessScene",o.showAdCallFunc=e.cockStartBtnClick.bind(e)}
            )))}
        }
        ,r.game2BtnClick=function(){
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),G._ins.reportAnalyticsEvent("Model2"),C.loadScene(N.instance.Game2SceneName))}
        ,r.game3BtnClick=function(){
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),G._ins.reportAnalyticsEvent("Model3"),C.loadScene(N.instance.FruitSceneName))}
        ,r.pigeonStartBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.MoreGamePanelUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            a(n).parent=e.node}
          )))}
        ,r.dropInHole=function(){
          this.hole.active=!0,this.circle.getChildByName("duckShadow").active=!1;
          var e=this.circle.getChildByName("ani");
          1==this.GetTypeNumber()?e.getComponent(u.Skeleton).setAnimation(0,"fall2",!1):e.getComponent(u.Skeleton).setAnimation(0,"fall",!1),l(e).delay(.1).call((function(){
            T.instance.playSound("sceneTransition/duckDrop")}
          )).delay(.6).call((function(){
            T.instance.stopLongSound(),C.loadScene(N.instance.DuckSceneName)}
          )).start()}
        ,r.addTableBtnClick=function(){
          var e=this;
          N.instance.releaseType==A.applet_ziJie&&!1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("添加桌面"),T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.AddTableUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            var i=a(n);
            i.parent=e.node;
            var o=i.getComponent(I);
            0==N.instance.addTableBtnClickNum?o.setPanel(0):o.setPanel(1)}
          )))}
        ,r.rankBtnClick=function(){
          var e=this;
          N.instance.releaseType==A.applet_ziJie&&!1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("排行榜"),T.instance.playSound("ui/buttonClick"),N.instance.releaseType==A.applet_ziJie?(F.showRank(),k.instance.btnCanTouch=!0):(N.instance.releaseType,A.applet_wechat,B.instance.bundleLoad("uiBundle",M.RankUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            a(n).parent=e.node}
          ))))}
        ,r.shareBtnClick=function(){
          console.log("分享"),!1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.ShareFriendUI.path,null,(function(e,t){
            if(e)return console.log(e),void(k.instance.btnCanTouch=!0);
            a(t).setParent(m("Canvas"))}
          )))}
        ,r.goSideBarBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("侧边栏"),T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.SideBarUI.path,null,(function(t,n){
            t?console.log(t):a(n).parent=e.node}
          )))}
        ,r.addProgramBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("添加程序"),T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.AddProgramPanel.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            a(n).parent=e.node}
          )))}
        ,r.gooseBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("HomeBundle","prefab/gooseTip",null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            var i=a(n);
            0==e.GetTypeNumber()?(i.children[0].active=!0,i.children[1].active=!1):(i.children[0].active=!1,i.children[1].active=!0),i.parent=e.node,l(i).to(.7,{
              position:c(0,150,0)}
            ,{
              easing:"backOut"}
            ).start(),l(i.getComponent(s)).delay(.2).to(.5,{
              opacity:0}
            ).call((function(){
              i.destroy()}
            )).start()}
          )))}
        ,r.GetTypeNumber=function(){
          var e=0;
          return N.instance.level<102?e=0:N.instance.level<202?e=1:N.instance.level<302?e=0:N.instance.level<402?e=1:N.instance.level<502?e=0:N.instance.level<602?e=1:N.instance.level<702&&(e=0),e}
        ,r.autoPlayBtn1Click=function(){
          !1!==k.instance.btnCanTouch&&(console.log("自动播放"),T.instance.playSound("ui/buttonClick"),N.isAuto=!0,this.cockStartBtnClick())}
        ,r.showReceivePanel=function(){
          console.log("showReceivePanel"),N.instance.receiveSideBarGriftNum+=1,m("Canvas/goSideBarBtn/th").active=!1,m("Canvas/goSideBarBtn/奖").active=!1,B.instance.bundleLoad("uiBundle",M.ReceiveUI.path,null,(function(e,t){
            if(e)console.log(e);
            else{
              var n=a(t);
              n.parent=m("Canvas"),n.getComponent(R).setPanel(0)}
          }
          ))}
        ,r.showSideBar=function(){
          var e=this;
          if(N.instance.releaseType==A.applet_ziJie&&N.instance.receiveSideBarGriftNum<=0&&N.instance.receiveSideBarGriftNum<=0&&N.SideState.isFromSideBar&&this.showReceivePanel(),N.instance.isFromLoad)return console.log("从加载页进主页"),void(N.instance.isFromLoad=!1);
          console.log("从游戏场景回到主页"),N.instance.releaseType==A.applet_ziJie?N.instance.receiveSideBarGriftNum<=0&&B.instance.bundleLoad("uiBundle",M.SideBarUI.path,null,(function(t,n){
            t?console.log(t):a(n).parent=e.node}
          )):N.instance.releaseType==A.test_TEST&&N.instance.receiveSideBarGriftNum}
        ,r.bookBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("打开手册"),T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.BookUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            p.stopAllByTarget(e.bookBtn.node.getChildByName("new")),e.bookBtn.node.getChildByName("new").setScale(1,1,1),e.bookBtn.node.getChildByName("new").active=!1,a(n).parent=e.node}
          )))}
        ,r.bookPigeonBtnClick=function(){
          var e=this;
          !1!==k.instance.btnCanTouch&&(k.instance.btnCanTouch=!1,console.log("打开鸽子手册"),T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.BookPigeonUI.path,null,(function(t,n){
            if(t)return console.log(t),void(k.instance.btnCanTouch=!0);
            p.stopAllByTarget(e.bookBtn.node.getChildByName("new")),e.bookBtn.node.getChildByName("new").setScale(1,1,1),e.bookBtn.node.getChildByName("new").active=!1,a(n).parent=e.node}
          )))}
        ,r.AwemeBtnClick=function(){
          var e=this;
          T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.AwemeUI.path,null,(function(t,n){
            t?console.log(t):a(n).parent=e.node}
          ))}
        ,r.SubscribeBtnClick=function(){
          var e=this;
          T.instance.playSound("ui/buttonClick"),B.instance.bundleLoad("uiBundle",M.SubscribeUI.path,null,(function(t,n){
            t?console.log(t):a(n).parent=e.node}
          ))}
        ,r.joinGroupBtnClick=function(){
          var e=n(i().mark((function e(){
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:T.instance.playSound("ui/buttonClick"),G._ins.joinGroup();
                case 1:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(){
            return e.apply(this,arguments)}
        }
        (),r.GmChangeBtn=function(){
          this.gmBtnType=!this.gmBtnType,this.joinGroupBtn.node.active=this.gmBtnType,this.goSideBarBtn.node.active=this.gmBtnType,this.pigeonStartBtn.node.active=this.gmBtnType,this.rankBtn.node.active=this.gmBtnType,this.addTableBtn.node.active=this.gmBtnType,this.subscribeBtn.node.active=this.gmBtnType,this.AwemeBtn.node.active=this.gmBtnType,this.gooseBtn.node.active=this.gmBtnType,this.bookBtn.node.active=this.gmBtnType,this.bookPigeonBtn.node.active=this.gmBtnType,this.shareBtn.node.active=this.gmBtnType}
        ,r.isShowSpecialBg=function(){
          var e=N.instance.level,t=-1;
          return e>2&&(e-2)%10==1?t=1:e>2&&(e-2)%10==3?t=2:e>2&&(e-2)%10==5?t=0:e>2&&(e-2)%10==7?t=3:e>2&&(e-2)%10==9&&(t=4),t}
        ,o}
      (w))||O),o._RF.pop()}
  }
}
))

