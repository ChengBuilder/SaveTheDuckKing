/**
 * Restored module: chunks:///_virtual/Wood.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => GameModel
 * - a => find
 * - b => PHY_GROUP
 * - c => Sprite
 * - C => ResManager
 * - d => instantiate
 * - f => HingeJoint2D
 * - h => UIOpacity
 * - i => _decorator
 * - k => GameData
 * - l => tween
 * - m => Node
 * - n => cclegacy
 * - N => AudioManager
 * - o => PolygonCollider2D
 * - p => ERigidBody2DType
 * - r => RigidBody2D
 * - s => UITransform
 * - S => Nail
 * - t => inheritsLoose
 * - u => Color
 * - v => Component
 * - w => DuckController
 * - y => Util
 */
System.register("chunks:///_virtual/Wood.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Util.ts","./GameModel2.ts","./Enum.ts","./Nail.ts","./ResManager.ts","./DuckController.ts","./AudioManager.ts","./GameData.ts"],(function(e){
  var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k;
  return{
    setters:[function(e){
      t=e.inheritsLoose}
    ,function(e){
      n=e.cclegacy,i=e._decorator,o=e.PolygonCollider2D,r=e.RigidBody2D,a=e.find,s=e.UITransform,l=e.tween,c=e.Sprite,u=e.Color,d=e.instantiate,h=e.UIOpacity,p=e.ERigidBody2DType,f=e.HingeJoint2D,g=e.v2,m=e.Node,v=e.Component}
    ,function(e){
      y=e.Util}
    ,function(e){
      _=e.GameModel}
    ,function(e){
      b=e.PHY_GROUP}
    ,function(e){
      S=e.Nail}
    ,function(e){
      C=e.ResManager}
    ,function(e){
      w=e.DuckController}
    ,function(e){
      N=e.AudioManager}
    ,function(e){
      k=e.GameData}
    ],execute:function(){
      var T;
      n._RF.push({
      }
      ,"c5bddviA9BJ1JfMl/dHCFi8","Wood",void 0);
      var B=i.ccclass;
      i.property,e("Wood",B("Wood")(T=function(e){
        function n(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this).woodSpr=null,t.shadowSpr=null,t.nailArr=[],t.groupIndex=0,t.woodRigidBody=null,t.polygonCollider=null,t.siblingIndex=null,t.woodColor=0,t.colideArr=[],t.isRigidOn=!0,t}
        t(n,e);
        var i=n.prototype;
        return i.onLoad=function(){
        }
        ,i.start=function(){
          this.getComponent(o).tag=1}
        ,i.CloseRigid=function(){
          if(this.isRigidOn){
            this.isRigidOn=!1;
            var e=this.node.getComponent(r);
            this.node.getComponent(o).enabled=!1,e.enabled=!1;
            for(var t=0;
            t<this.nailArr.length;
            t++)this.nailArr[t].getComponent(S).closeRigid()}
        }
        ,i.OpenRigid=function(){
          if(!this.isRigidOn){
            this.isRigidOn=!0;
            var e=this.node.getComponent(r);
            this.node.getComponent(o).enabled=!0,e.enabled=!0;
            for(var t=0;
            t<this.nailArr.length;
            t++)this.nailArr[t].getComponent(S).openRigid()}
        }
        ,i.onDisable=function(){
          this.CloseRigid(),this.removeTouchEvents()}
        ,i.update=function(e){
          var t=a("Canvas/realWall/wallR").getComponent(s).width/2;
          if(this.node.worldPosition.y<=200){
            var n=y.getRandomNum(1,3,!0);
            N.instance.playSound("woodDrop/woodDrop_"+n.toString(),1),N.instance.playSound("woodDrop/woodDrop_"+n.toString(),1);
            var i=a("Canvas").getComponent(w);
            i.woodArr.splice(i.woodArr.indexOf(this.node),1),this.node.destroy()}
          else this.node.worldPosition.y<a("Canvas/realWall/wallR").position.y+t+80&&l(this.woodSpr.getComponent(c)).to(.2,{
            color:new u(50,50,50,255)}
          ).start()}
        ,i.initWood=function(e,t,n,i,s){
          var l=this;
          this.woodSpr=this.node.getChildByName("woodSpr"),this.groupIndex=t,this.siblingIndex=s,this.woodColor=n;
          var u=_.woodColorArr[n-1];
          if(k._ins.singleWoodColorFlag){
            var p=_.instance.level%(_.singleColorArr.length+1);
            u=_.singleColorArr[p-1],3==_.instance.level&&(u=_.singleColorArr[0])}
          2==_.instance.level&&t<=6&&(u=_.singleColorArr[0]);
          var f=a("Canvas").getComponent(w);
          1!=f.isShowSpecialBg()&&2!=f.isShowSpecialBg()&&3!=f.isShowSpecialBg()||(u=_.singleColorArr[0]),C.instance.bundleLoad("DuckBundle","prefab/woodShadow",null,(function(t,n){
            if(t)console.log(t);
            else{
              var i=d(n);
              i.parent=l.node,l.shadowSpr=i,i.setScale(1.02,1.02,1.02),i.getComponent(h).opacity=100,i.setSiblingIndex(0);
              var o="tex/wood/"+u+"/"+u+e.toString()+"/spriteFrame";
              C.instance.bundleLoad("DuckBundle",o,null,(function(e,t){
                e?console.log(e):l.shadowSpr.getComponent(c).spriteFrame=t}
              ))}
          }
          ));
          var g="tex/wood/"+u+"/"+u+e.toString()+"/spriteFrame";
          C.instance.bundleLoad("DuckBundle",g,null,(function(e,t){
            e?console.log(e):l.woodSpr.getComponent(c).spriteFrame=t}
          )),this.woodRigidBody=this.node.getComponent(r),this.woodRigidBody.angularDamping=.5,this.polygonCollider=this.node.getComponent(o),this.polygonCollider.group=b["L"+t],this.polygonCollider.friction=0,this.polygonCollider.apply();
          for(var m=-1,v=0;
          v<this.node.children.length;
          v++){
            var N=this.node.children[v];
            if("nail"==N.name){
              m++;
              var T=a("Canvas").getComponent(w),B=i[m],A=N.getComponent(S);
              !T.iceLayerArr.includes(t)&&k._ins.iceNailFlag&&t>9&&(y.getRandomNum(0,1)<.6||T.NoTouchNailNum==T.nailNum)&&(T.iceLayerArr.push(t),A.initIceNail(t)),A.initNail(B),this.nailArr.push(N)}
          }
          this.node.addComponent(h)}
        ,i.addJoint=function(){
          for(var e=0;
          e<this.nailArr.length;
          e++){
            var t=this.nailArr[e];
            t.addComponent(r).type=p.Static;
            var n=t.addComponent(f);
            t.getComponent(S).HingeJointNail=n,n.connectedBody=this.node.getComponent(r),n.anchor=g(0,0),n.connectedAnchor=g(t.x*this.node.scale.x,t.y*this.node.scale.y),n.apply(),this.nailArr[e].getComponent(S).initNailCollider()}
        }
        ,i.CheckNailInWood=function(){
          0==this.nailArr.length&&l(this.woodSpr.getComponent(c)).to(.2,{
            color:new u(110,110,110,255)}
          ).start()}
        ,i.initNailAngle=function(){
          for(var e=0;
          e<this.nailArr.length;
          e++)this.nailArr[e].getComponent(S).initNailAngle()}
        ,i.ReviveInit=function(){
          for(var e=this,t=0;
          t<this.nailArr.length;
          t++)this.nailArr[t].addComponent(h),this.nailArr[t].getComponent(h).opacity=0,this.nailArr[t].getComponent(S).initNailAngle();
          this.scheduleOnce((function(){
            e.ReviveComplete()}
          ),.8)}
        ,i.ReviveComplete=function(){
          for(var e=0;
          e<this.nailArr.length;
          e++)this.nailArr[e].getComponent(h).opacity=255}
        ,i.pushForce=function(e,t){
          this.isRigidOn&&this.node.getComponent(r).applyForce(g(e,t),g(0,0),!0)}
        ,i.pushLinearVelocity=function(e,t){
          this.isRigidOn&&(this.node.getComponent(r).linearVelocity=g(e,t))}
        ,i.addTouchEvents=function(){
          this.node.on(m.EventType.TOUCH_START,this.touchStartCallBack,this)}
        ,i.removeTouchEvents=function(){
          this.node.off(m.EventType.TOUCH_START,this.touchStartCallBack,this)}
        ,i.touchStartCallBack=function(e){
        }
        ,n}
      (v))||T),n._RF.pop()}
  }
}
))
