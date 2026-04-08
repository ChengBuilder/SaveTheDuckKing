/**
 * Semantic view: chunks:///_virtual/Util.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => Node
 * - a => Color
 * - b => ResManager
 * - C => GameModel
 * - d => ERigidBody2DType
 * - f => Component
 * - g => UITransform
 * - h => UIOpacity
 * - i => _decorator
 * - m => misc
 * - n => cclegacy
 * - o => Sprite
 * - p => warn
 * - r => tween
 * - s => instantiate
 * - S => AudioManager
 * - u => RigidBody2D
 * - v => Vec3
 * - w => PoolManager
 * - y => Tween
 */
/**
 * Restored module: chunks:///_virtual/Util.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Node
 * - a => Color
 * - b => ResManager
 * - C => GameModel
 * - d => ERigidBody2DType
 * - f => Component
 * - g => UITransform
 * - h => UIOpacity
 * - i => _decorator
 * - m => misc
 * - n => cclegacy
 * - o => Sprite
 * - p => warn
 * - r => tween
 * - s => instantiate
 * - S => AudioManager
 * - u => RigidBody2D
 * - v => Vec3
 * - w => PoolManager
 * - y => Tween
 */
System.register("chunks:///_virtual/Util.ts",["cc","./ResManager.ts","./AudioManager.ts","./GameModel2.ts","./PoolManager.ts"],(function(t){
  var n /* cclegacy */, i /* _decorator */, o /* Sprite */, r /* tween */, a /* Color */, s /* instantiate */, l, c, u /* RigidBody2D */, d /* ERigidBody2DType */, h /* UIOpacity */, p /* warn */, f /* Component */, g /* UITransform */, m /* misc */, v /* Vec3 */, y /* Tween */, _ /* Node */, b /* ResManager */, S /* AudioManager */, C /* GameModel */, w /* PoolManager */;
  return{
    setters:[function(e){
      n=e.cclegacy /* cclegacy */,i=e._decorator /* _decorator */,o=e.Sprite /* Sprite */,r=e.tween /* tween */,a=e.Color /* Color */,s=e.instantiate /* instantiate */,l=e.v3,c=e.v2,u=e.RigidBody2D /* RigidBody2D */,d=e.ERigidBody2DType /* ERigidBody2DType */,h=e.UIOpacity /* UIOpacity */,p=e.warn /* warn */,f=e.Component /* Component */,g=e.UITransform /* UITransform */,m=e.misc /* misc */,v=e.Vec3 /* Vec3 */,y=e.Tween /* Tween */,_=e.Node /* Node */}
    ,function(e){
      b=e.ResManager /* ResManager */}
    ,function(e){
      S=e.AudioManager /* AudioManager */}
    ,function(e){
      C=e.GameModel /* GameModel */}
    ,function(e){
      w=e.PoolManager /* PoolManager */}
    ],execute:function(){
      var N;
      n._RF.push({
      }
      ,"4c20fhuDSNBQJ67jrbqXj5Y","Util",void 0);
      var k=i.ccclass;
      i.property,t("Util",k("Util")(N=function(){
        function t(){
        }
        return t.getRandomNum=function(e,t,n){
          return void 0===n&&(n=!1),n?Math.floor(Math.random()*(t-e+1)+e):Math.random()*(t-e)+e}
        ,t.getDiffNumRandom=function(e,n,i){
          for(var o=[],r=e;
          r<=n;
          r++)o.push(r);
          for(var a=o.length-i,s=0;
          s<a;
          s++){
            var l=t.getRandomNum(0,o.length-1);
            o.splice(l,1)}
          return o}
        ,t.vectorsToDegress=function(e,t){
          void 0===t&&(t=c(1,0));
          var n=t,i=c(e.x,e.y).signAngle(n);
          return m.radiansToDegrees(-i)}
        ,t.degreesToVectors=function(e,t){
          void 0===t&&(t=c(1,0));
          var n=m.degreesToRadians(e);
          return t.rotate(n)}
        ,t.getDistance=function(e,t){
          return t.subtract(e).length()}
        ,t.getVector=function(e,t){
          var n=t.subtract(e);
          return n.normalize(),n}
        ,t.rotateVector=function(e,t,n){
          void 0===n&&(n=l(0,0,1));
          var i=m.degreesToRadians(t),o=new v(n);
          o.normalize();
          var r=Math.cos(i),a=Math.sin(i),s=v.dot(o,e),c=v.cross(new v,o,e),u=e.x*r+c.x*a+o.x*s*(1-r),d=e.y*r+c.y*a+o.y*s*(1-r),h=e.z*r+c.z*a+o.z*s*(1-r);
          return new v(u,d,h)}
        ,t.GetPositiveNegative=function(){
          return[-1,1][this.getRandomNum(0,1,!0)]}
        ,t.pointInCircle=function(e,t,n){
          var i=e.x-t.x,o=e.y-t.y;
          return i*i+o*o<=n*n}
        ,t.shuffle=function(e){
          for(var t=e.length;
          t;
          ){
            var n=Math.floor(Math.random()*t--),i=[e[t],e[n]];
            e[n]=i[0],e[t]=i[1]}
          return e}
        ,t.shuffleArrayStartToEnd=function(e,t,n){
          if(t<0||n>=e.length)p("数组越界");
          else for(var i=n;
          i>t;
          i--){
            var o=Math.floor(Math.random()*(i-t+1))+t,r=[e[o],e[i]];
            e[i]=r[0],e[o]=r[1]}
        }
        ,t.aginSortArr=function(e){
          for(var n=0;
          n<e.length;
          n++){
            var i=t.getRandomNum(0,e.length-1,!0);
            if(i!=n){
              var o=e[n];
              e[n]=e[i],e[i]=o}
          }
        }
        ,t.checkNodeInArr=function(t,n){
          return!!Array.isArray(n)&&function n(i,o){
            for(var r=0;
            r<i.length;
            r++){
              var a=i[r];
              if(a===t)return!0;
              if(Array.isArray(a)){
                if("object"==e(a)&&null!==a){
                  if(o.has(a))continue;
                  o.add(a)}
                if(n(a,new Set(o)))return!0}
            }
            return!1}
          (n,new Set)}
        ,t.sortArray=function(e){
          !e||e.length<=1||e.sort((function(e,t){
            return e<t?-1:e>t?1:0}
          ))}
        ,t.convetOtherNodeSpace=function(e,t,n){
          void 0===n&&(n=l(0,0));
          var i=e.getComponent(g).convertToWorldSpaceAR(n);
          return t.getComponent(g).convertToNodeSpaceAR(i)}
        ,t.playParticle2=function(e,n,i,a){
          for(var s=function(){
            var e=new _("lz");
            e.addComponent(g);
            var s=e.addComponent(h);
            e.addComponent(o).spriteFrame=b.instance.getSpriteFrame(n),e.parent=i,e.layer=1<<30,e.setPosition(a.x,a.y);
            var c=l(a.x+t.getRandomNum(-50,50,!0),a.y+t.getRandomNum(-75,75,!0),0);
            e.angle=t.getRandomNum(0,360,!0),e.setScale(0,0,0);
            var u=t.getRandomNum(.2,.8),d=t.getRandomNum(0,.2);
            s.opacity=255,r(e).delay(d).to(.2,{
              scale:l(u,u,u),position:c}
            ,{
              easing:"sineInOut"}
            ).start(),r(s).delay(d+.2).to(.2,{
              opacity:0}
            ,{
              easing:"sineInOut"}
            ).call((function(){
              e.destroy()}
            )).start()}
          ,c=0;
          c<e;
          c++)s()}
        ,t.playRibbonAni=function(e,n,i){
          var a=this;
          S.instance.playSound("ui/ribbonBurst");
          for(var s=function(){
            var s=new _("Ribbon");
            s.addComponent(o).spriteFrame=b.instance.getSpriteFrame("ribbon"+a.getRandomNum(1,7,!0).toString()),s.parent=n,s.layer=1<<25,s.setPosition(l(i.x,i.y,0)),s.angle=a.getRandomNum(0,360,!0);
            var d=t.getRandomNum(1,1.5);
            s.getComponent(g).width*=d,s.getComponent(g).height*=d,s.addComponent(h).opacity=0;
            var p=u*(360/e),f=t.degreesToVectors(p,c(0,1));
            s.setPosition(s.position.x+f.x*t.getRandomNum(0,100,!0),s.position.y+f.y*t.getRandomNum(0,100,!0));
            var m=a.getRandomNum(100,.5*C.instance.screenWidth,!0),v=l(i.x+f.x*m,i.y+f.y*m,0);
            r(s).by(2,{
              angle:360*a.GetPositiveNegative()}
            ).repeatForever().start(),r(s).to(.5,{
              scale:l(.5,1,1)}
            ).to(.5,{
              scale:l(1,1,1)}
            ).to(.5,{
              scale:l(1,.5,1)}
            ).to(.5,{
              scale:l(1,1,1)}
            ).union().repeatForever().start();
            var y=t.getRandomNum(0,1)/100;
            r(s).delay(y).call((function(){
              s.getComponent(h).opacity=255}
            )).to(.2,{
              position:l(v.x,v.y,0)}
            ,{
              easing:"sineInOut"}
            ).start(),r(s).delay(y+.2+.1).by(1,{
              position:l(t.getRandomNum(-100,100,!0),-200,0)}
            ).by(1,{
              position:l(t.getRandomNum(-100,100,!0),-200,0)}
            ).by(1,{
              position:l(t.getRandomNum(-100,100,!0),-200,0)}
            ).by(1,{
              position:l(t.getRandomNum(-100,100,!0),-200,0)}
            ).by(1,{
              position:l(t.getRandomNum(-100,100,!0),-200,0)}
            ).start(),r(s.getComponent(h)).delay(y+.2+2+t.getRandomNum(0,.5)).to(.2,{
              opacity:0}
            ).call((function(){
              s.destroy()}
            )).start()}
          ,u=0;
          u<e;
          u++)s()}
        ,t.btnShake=function(e){
          var t=l(e.scale),n=.1;
          r(e).to(n,{
            angle:-5}
          ).to(n,{
            angle:0}
          ).to(n,{
            angle:5}
          ).to(n,{
            angle:0}
          ).to(.2,{
            scale:l(t.x+.1,t.y+.1,t.z+.1)}
          ).to(1.5*n,{
            scale:t}
          ).delay(.5).union().repeatForever().start()}
        ,t.sprShake=function(e){
          if(!(y.getRunningCount(e)>0)){
            var t=.03,n=e.x,i=e.y;
            r(e).by(t,{
              position:l(n-2,i,0)}
            ).by(t,{
              position:l(n+2,i,0)}
            ).by(t,{
              position:l(n,i+2,0)}
            ).by(t,{
              position:l(n,i-2,0)}
            ).union().repeat(2).call((function(){
              e.setPosition(n,i)}
            )).start()}
        }
        ,t.btnBreath=function(e){
          var t=l(e.scale);
          r(e).to(.5,{
            scale:l(t.x+.1,t.y+.1,t.z+.1)}
          ).to(.5,{
            scale:t}
          ).union().repeatForever().start()}
        ,t.scratchEffect=function(e,t,n,i){
          e.x+=.5*t,e.y+=.5*t;
          for(var o=1+Math.floor(2*Math.random()),a=function(){
            var t=Math.random()>.5?"sk1":"sk2",o=w.Spawn(t,n);
            if(!o)return 1;
            var a=l(10*(Math.random()-.5),10*(Math.random()-.5),0);
            o.setPosition(l(e.x+a.x,e.y+a.y,0)),o.angle=360*Math.random();
            var c=.4+.6*Math.random();
            o.setScale(l(c,c,c));
            var u=o.getComponent(h);
            u.opacity=255;
            var d=200*(Math.random()-.5),p=100+100*Math.random(),f=500,g=1+.5*Math.random(),m=0,v=!0;
            0==s&&Math.random()>.75&&(m=255,f=250,c*=.55,v=!1);
            var y=l(e.x+d*g,e.y+p*g-.5*f*g*g,0),_=720*(Math.random()-.5),b=o.getPosition(),S=o.angle;
            r(u).to(g,{
              opacity:m}
            ,{
              easing:"quadOut"}
            ).start(),r(o).to(g,{
              position:y,scale:l(c,c,c),angle:o.angle+_}
            ,{
              easing:"quadOut",onUpdate:function(e,t){
                var n=b.x+(y.x-b.x)*t,i=b.y+p*g*t-.5*f*g*g*t*t;
                e.setPosition(l(n,i,0)),e.angle=S+_*t}
            }
            ).call((function(){
              v?w.Despawn(o):i.push(o)}
            )).start()}
          ,s=0;
          s<o;
          s++)a()}
        ,t.prototype.progressBarEffect=function(e,n){
          for(var i=t.getRandomNum(1,2,!0),o=function(){
            var i=w.Spawn("lz1",n);
            if(i){
              i.setPosition(e.x,e.y,e.z);
              var o=new v(50*(Math.random()-.5),5*(Math.random()-.5),0);
              i.translate(o);
              var a=t.getRandomNum(.8,1.2);
              i.setScale(l(a,a,a));
              var s=t.getRandomNum(128,255),c=i.getComponent(h);
              c.opacity=s;
              var u=t.getRandomNum(50,100),d=u/t.getRandomNum(120,150);
              r(c).to(d,{
                opacity:0}
              ,{
                easing:"smooth"}
              ).start(),r(i).by(d,{
                position:l(0,-u,0)}
              ,{
                easing:"quadOut"}
              ).call((function(){
                w.Despawn(i)}
              )).start()}
          }
          ,a=0;
          a<i;
          a++)o()}
        ,t.flashRed=function(e){
          if(e&&e.getComponent(o)){
            var t=e.getComponent(o).color.clone();
            r(e.getComponent(o)).to(.1,{
              color:new a(255,0,0)}
            ).to(.1,{
              color:t}
            ).delay(.1).to(.1,{
              color:new a(255,0,0)}
            ).to(.1,{
              color:t}
            ).union().start()}
        }
        ,t.fragmentEffect=function(e,n,i){
          for(var a="tex/fragment/"+i+"/",p=e.worldPosition,f=e.worldRotation,g=0;
          g<10;
          g++){
            var m=a+t.getRandomNum(1,6,!0).toString()+"/spriteFrame";
            b.instance.bundleLoad("DuckBundle",m,null,(function(e,i){
              if(e)console.log(e);
              else{
                var a=s(b.instance.getPrefab("fragmentShard"));
                a.parent=n,a.getComponent(o).spriteFrame=i,a.worldPosition=p,a.worldRotation=f;
                var g=t.getRandomNum(1,1.7);
                a.setScale(l(g,g,1));
                var m=t.getRandomNum(0,180),v=t.getRandomNum(24,56),y=c(Math.cos(m*Math.PI/180),Math.sin(m*Math.PI/180)).multiplyScalar(v),_=a.getComponent(u);
                _||(_=a.addComponent(u)),_.type=d.Dynamic,_.gravityScale=10,_.linearVelocity=y;
                var S=t.getRandomNum(-20,20);
                _.angularVelocity=S,r(a.addComponent(h)).delay(2).call((function(){
                  a.destroy()}
                )).start()}
            }
            ))}
        }
        ,t.addClickEvent=function(e,t,n,i,o){
          if(void 0===o&&(o=""),e&&t){
            var r=new f.EventHandler;
            r.target=t,r.component=n,r.handler=i,o&&(r.customEventData=o),e.clickEvents||(e.clickEvents=[]),e.clickEvents.some((function(e){
              return e&&e.handler===i}
            ))||e.clickEvents.push(r)}
          else p("按钮或目标节点为空")}
        ,t.setParent=function(e,t){
          var n=e.parent.getComponent(g).convertToWorldSpaceAR(e.position),i=t.getComponent(g).convertToNodeSpaceAR(n);
          e.parent=t,e.setPosition(i)}
        ,t.getColorFromHex=function(e){
          var t=new a(255,255,255);
          return a.fromHEX(t,e),t}
        ,t.parabolaTween=function(e,t,n,i,o,a,s){
          return void 0===a&&(a=!1),void 0===s&&(s="linear"),r({
            t:0}
          ).to(t,{
            t:1}
          ,{
            onUpdate:function(t){
              if(e.isValid){
                var r=1-t.t,a=r*r,s=t.t*t.t,l=a*n.x+2*r*t.t*i.x+s*o.x,c=a*n.y+2*r*t.t*i.y+s*o.y,u=a*n.z+2*r*t.t*i.z+s*o.z;
                e.setPosition(l,c,u)}
            }
            ,easing:s}
          ).call((function(){
            a&&e.isValid&&e.destroy()}
          )).start()}
        ,t.getAngleForPos=function(e,t,n){
          void 0===n&&(n=!1);
          var i;
          return i=n?-Math.atan2(t.x-e.x,t.y-e.y):Math.atan2(t.y-e.y,t.x-e.x),m.radiansToDegrees(i)}
        ,t.getPosForAngleLen=function(e,t,n){
          void 0===n&&(n=l(0,0));
          var i=m.degreesToRadians(e);
          return l(n.x+Math.cos(i)*t,n.y+Math.sin(i)*t)}
        ,t.FlyLzMove=function(e){
          var n=s(b.instance.getPrefab("colorMarkerParticle"));
          n.getComponent(o).spriteFrame=b.instance.getSpriteFrame("colorMarker2");
          var i=n.getComponent(h);
          n.getComponent(g),i.opacity=255;
          var a=l(t.getRandomNum(-40,40),0);
          n.setPosition(a),n.setParent(e),n.scale=l(0,0),n.layer=e.layer;
          var c=t.getRandomNum(70,110),u=t.getRandomNum(150,200),d=t.getPosForAngleLen(c,u),p=t.getRandomNum(1,2);
          r(n).to(p,{
            scale:l(1.2,1.2),position:l(d)}
          ).removeSelf().start(),r(i).to(p,{
            opacity:0}
          ).start()}
        ,t.fakeProgressSmooth=function(e,t){
          if(t<=0)return 0;
          if(e<=0)return 0;
          if(e>=t)return 1;
          var n=e/t;
          if(n<=.4)return n*n*(.6/(.4*.4));
          var i=(n-.4)/.6;
          return.6+.4*Math.sqrt(i)}
        ,t.copyString=function(e){
          var t=document.createElement("input");
          t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}
        ,t}
      ())||N),n._RF.pop()}
  }
}
))

