/**
 * Restored module: chunks:///_virtual/MathGridItem.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => SpriteFrame
 * - d => Node
 * - f => UITransform
 * - g => Component
 * - h => Color
 * - i => initializerDefineProperty
 * - l => Sprite
 * - m => MathGameManager
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => instantiate
 * - r => cclegacy
 * - s => Label
 * - t => applyDecoratedDescriptor
 * - u => Vec3
 */
System.register("chunks:///_virtual/MathGridItem.ts",["./rollupPluginModLoBabelHelpers.js","cc","./MathGameManager.ts"],(function(e){
  var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized}
    ,function(e){
      r=e.cclegacy,a=e._decorator,s=e.Label,l=e.Sprite,c=e.SpriteFrame,u=e.Vec3,d=e.Node,h=e.Color,p=e.instantiate,f=e.UITransform,g=e.Component}
    ,function(e){
      m=e.MathGameManager}
    ],execute:function(){
      var v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R,L,x;
      r._RF.push({
      }
      ,"d666dYhdRhPooDZuUJpOPco","MathGridItem",void 0);
      var D=a.ccclass,G=a.property;
      e("MathGridItem",(v=D("MathGridItem"),y=G(s),_=G(l),b=G(c),S=G(c),C=G(c),w=G(c),N=G(c),k=G(c),v((A=t((B=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"label",A,o(t)),i(t,"background",P,o(t)),i(t,"dise",M,o(t)),i(t,"kongbeijing",I,o(t)),i(t,"lvsea",F,o(t)),i(t,"huangse",R,o(t)),i(t,"honsge",L,o(t)),i(t,"beijinghuang",x,o(t)),t.data=null,t.isDragging=!1,t.startPos=new u,t.isInPool=!1,t.placeholder=null,t.status="normal",t}
        n(t,e);
        var r=t.prototype;
        return r.init=function(e,t){
          void 0===t&&(t=!1),this.data=e,this.isInPool=t,this.label.string=e.value||"",this.updateStyle(),1!==e.type&&4!==e.type||e.isFixed||(this.node.on(d.EventType.TOUCH_START,this.onTouchStart,this),this.node.on(d.EventType.TOUCH_MOVE,this.onTouchMove,this),this.node.on(d.EventType.TOUCH_END,this.onTouchEnd,this),this.node.on(d.EventType.TOUCH_CANCEL,this.onTouchEnd,this))}
        ,r.updateStyle=function(){
          if(0===this.data.type)return this.background.node.active=!0,this.background.spriteFrame=this.beijinghuang,this.background.color=new h(255,255,255),void(this.label.string="");
          this.background.node.active=!0;
          var e=(1===this.data.type||4===this.data.type)&&!this.data.isFixed,t=e&&""!==this.label.string&&!this.isInPool,n=this.dise;
          n=e?t?this.lvsea:this.isInPool?this.dise:this.kongbeijing:this.dise,"correct"===this.status?n=e?this.lvsea:this.huangse:"wrong"===this.status&&(e&&t?n=this.honsge:e||(n=this.dise)),n&&(this.background.spriteFrame=n),this.background.color=new h(255,255,255)}
        ,r.setStatus=function(e){
          this.status=e,this.updateStyle()}
        ,r.onTouchStart=function(e){
          if(""!==this.label.string){
            if(this.isInPool){
              var n=this.node.scene.getChildByPath("Canvas/GameManager");
              n&&n.getComponent(m)&&(this.node._originalPoolPos=this.node.position.clone(),this.node._fromPool=!0)}
            else{
              var i=this.node.scene.getChildByPath("Canvas/GameManager");
              if(i&&i.getComponent(m)){
                var o=this.data.r,r=this.data.c;
                this.placeholder=p(this.node),this.node._placeholder=this.placeholder,this.placeholder.parent=this.node.parent,this.placeholder.setPosition(this.node.position);
                var a=this.placeholder.getComponent(t);
                a&&a.init({
                  type:this.data.type,value:"",isFixed:!1,r:o,c:r}
                ,!1),this.isInPool=!0,this.data.r=void 0,this.data.c=void 0}
            }
            this.isDragging=!0,this.startPos.set(this.node.position),this.node.setSiblingIndex(999)}
          else this.isDragging=!1}
        ,r.onTouchMove=function(e){
          if(this.isDragging){
            var t=e.getUILocation(),n=t.y+100,i=new u(t.x,n,0),o=this.node.parent.getComponent(f);
            if(o){
              var r=o.convertToNodeSpaceAR(i);
              this.node.setPosition(r)}
          }
        }
        ,r.onTouchEnd=function(e){
          if(this.isDragging){
            this.isDragging=!1;
            var n=this.node.scene.getChildByPath("Canvas/GameManager"),i=n?n.getComponent(m):null,o=!1;
            if(i){
              var r=this.node.getComponent(f).convertToWorldSpaceAR(new u(0,0,0)),a=i.boardNode.getComponent(f).convertToNodeSpaceAR(r);
              o=i.tryPlaceNumber(this.node,a)}
            if(o)this.placeholder=null;
            else if(this.placeholder){
              var s=this.placeholder.getComponent(t);
              s&&(s.label.string=this.label.string,s.data.value=this.label.string,s.updateStyle()),this.node.destroy(),this.placeholder=null}
            else this.node.setPosition(this.startPos)}
        }
        ,t}
      (g)).prototype,"label",[y],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),P=t(B.prototype,"background",[_],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),M=t(B.prototype,"dise",[b],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),I=t(B.prototype,"kongbeijing",[S],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),F=t(B.prototype,"lvsea",[C],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),R=t(B.prototype,"huangse",[w],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),L=t(B.prototype,"honsge",[N],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),x=t(B.prototype,"beijinghuang",[k],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),T=B))||T)),r._RF.pop()}
  }
}
))
