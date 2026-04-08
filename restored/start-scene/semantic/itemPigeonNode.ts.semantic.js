/**
 * Semantic view: chunks:///_virtual/itemPigeonNode.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => _decorator
 * - c => Color
 * - d => Component
 * - h => GameModel
 * - i => initializerDefineProperty
 * - l => Sprite
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => ResManager
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => Label
 */
/**
 * Restored module: chunks:///_virtual/itemPigeonNode.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => Color
 * - d => Component
 * - h => GameModel
 * - i => initializerDefineProperty
 * - l => Sprite
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - p => ResManager
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => Label
 */
System.register("chunks:///_virtual/itemPigeonNode.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameModel2.ts","./ResManager.ts"],(function(e){
  var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* Sprite */, c /* Color */, u /* Label */, d /* Component */, h /* GameModel */, p /* ResManager */;
  return{
    setters:[function(e){
      t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.Sprite /* Sprite */,c=e.Color /* Color */,u=e.Label /* Label */,d=e.Component /* Component */}
    ,function(e){
      h=e.GameModel /* GameModel */}
    ,function(e){
      p=e.ResManager /* ResManager */}
    ],execute:function(){
      var f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F;
      r._RF.push({
      }
      ,"92eb795x+pMi6QNKwK+74OB","itemPigeonNode",void 0);
      var R=a.ccclass,L=a.property;
      e("itemPigeonNode",(f=R("itemPigeonNode"),g=L(s),m=L(s),v=L(s),y=L(s),_=L(s),b=L(s),S=L(s),C=L(s),f((k=t((N=function(e){
        function t(){
          for(var t,n=arguments.length,r=new Array(n),a=0;
          a<n;
          a++)r[a]=arguments[a];
          return t=e.call.apply(e,[this].concat(r))||this,i(t,"noNode",k,o(t)),i(t,"pigeonSprite",T,o(t)),i(t,"pigeonShadow",B,o(t)),i(t,"pigeonName",A,o(t)),i(t,"newTag",P,o(t)),i(t,"useTag",M,o(t)),i(t,"useLight",I,o(t)),i(t,"AdTag",F,o(t)),t.id=0,t}
        n(t,e);
        var r=t.prototype;
        return r.start=function(){
        }
        ,r.initPigeonItem=function(){
          var e=this;
          if(2==h.instance.pigeonNumArr[this.id-1]){
            this.node.getComponent(l).color=c.WHITE,this.pigeonSprite.getComponent(l).color=c.WHITE;
            var t=h.PigeonNameArr[this.id-1];
            this.pigeonName.active=!0,this.pigeonShadow.active=!0,this.pigeonName.getComponent(u).string=t;
            var n="tex/book/鸽鸽图鉴/皮肤图鉴/p"+this.id.toString()+"/spriteFrame";
            p.instance.bundleLoad("uiBundle",n,null,(function(t,n){
              t?console.error(t):e.node&&(e.pigeonSprite.getComponent(l).spriteFrame=n)}
            )),this.updateAdTime(),h.instance.pigeonName==h.PigeonNameArr[this.id-1]&&(this.useTag.active=!0,this.useLight.active=!0)}
          else{
            this.node.getComponent(l).color=c.GRAY,this.pigeonSprite.getComponent(l).color=c.GRAY;
            var i=h.PigeonNameArr[this.id-1];
            this.pigeonName.active=!0,this.pigeonShadow.active=!0,this.pigeonName.getComponent(u).string=i;
            var o="tex/book/鸽鸽图鉴/皮肤图鉴/p"+this.id.toString()+"/spriteFrame";
            p.instance.bundleLoad("uiBundle",o,null,(function(t,n){
              t?console.error(t):e.node&&(e.pigeonSprite.getComponent(l).spriteFrame=n)}
            )),this.updateAdTime()}
        }
        ,r.showUnlock=function(){
          this.node.getComponent(l).color=c.WHITE,this.pigeonSprite.getComponent(l).color=c.WHITE}
        ,r.updateAdTime=function(){
          this.AdTag.getChildByName("ADNum").getComponent(u).string="（"+h.instance.pigeonNumArr[this.id-1]+"/2）",h.instance.pigeonNumArr[this.id-1]>=2&&(this.AdTag.active=!1,this.showUnlock())}
        ,r.hide=function(){
          this.node.active=!1,this.useTag.active=!1,this.useLight.active=!1,this.newTag.active=!1,this.pigeonShadow.active=!1,this.pigeonName.active=!1,this.pigeonSprite.getComponent(l).spriteFrame=null,this.AdTag.active=!0,this.AdTag.getChildByName("ADNum").getComponent(u).string="（0/2）",this.node.getComponent(l).color=c.WHITE}
        ,t}
      (d)).prototype,"noNode",[g],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),T=t(N.prototype,"pigeonSprite",[m],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),B=t(N.prototype,"pigeonShadow",[v],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),A=t(N.prototype,"pigeonName",[y],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),P=t(N.prototype,"newTag",[_],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),M=t(N.prototype,"useTag",[b],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),I=t(N.prototype,"useLight",[S],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),F=t(N.prototype,"AdTag",[C],{
        configurable:!0,enumerable:!0,writable:!0,initializer:function(){
          return null}
      }
      ),w=N))||w)),r._RF.pop()}
  }
}
))

