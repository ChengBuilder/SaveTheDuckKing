/**
 * Restored module: chunks:///_virtual/FruitNodePool.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => Tween
 * - c => Component
 * - i => Color
 * - l => NodePool
 * - n => cclegacy
 * - o => instantiate
 * - r => Sprite
 * - s => Joint2D
 * - t => createForOfIteratorHelperLoose
 */
System.register("chunks:///_virtual/FruitNodePool.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){
  var t,n,i,o,r,a,s,l,c;
  return{
    setters:[function(e){
      t=e.createForOfIteratorHelperLoose}
    ,function(e){
      n=e.cclegacy,i=e.Color,o=e.instantiate,r=e.Sprite,a=e.Tween,s=e.Joint2D,l=e.NodePool,c=e.Component}
    ],execute:function(){
      n._RF.push({
      }
      ,"f1c2dPkWmtHyJ0O7xI0Vnia","FruitNodePool",void 0);
      var u=new i(255,255,255,255);
      e("FruitNodePool",function(){
        function e(e){
          this._template=void 0,this._pool=void 0,this._defaultScale=void 0,this._defaultEuler=void 0,this._template=e,this._defaultScale=e.scale.clone(),this._defaultEuler=e.eulerAngles.clone(),this._pool=new l}
        var n=e.prototype;
        return n.get=function(){
          var e;
          if(null==(e=this._template)||!e.isValid)return null;
          var t=this._pool.get();
          return t||(t=o(this._template)),t&&(t.active=!0),t}
        ,n.put=function(e){
          null!=e&&e.isValid&&(this.resetBeforePut(e),this._pool.put(e))}
        ,n.size=function(){
          return this._pool.size()}
        ,n.clear=function(){
          this._pool.clear()}
        ,n.resetBeforePut=function(e){
          if(null!=e&&e.isValid){
            this._stopAllTweensRecursive(e),this._removeHighlightClone(e),e.active=!0,this._clearJointComponentsOnly(e),e.setScale(this._defaultScale),e.setRotationFromEuler(this._defaultEuler),this._resetAllSpriteColorsWhite(e);
            var t=e.getChildByName("sprIcon"),n=e.getChildByName("sprSpc"),i=e.getChildByName("sprShadow");
            t&&(t.active=!0);
            var o=null==t?void 0:t.getComponent(r);
            if(o&&(o.spriteFrame=null),n){
              n.active=!1;
              var s=n.getComponent(r);
              s&&a.stopAllByTarget(s)}
            if(i){
              i.active=!0;
              var l=i.getComponent(r);
              l&&(l.spriteFrame=null)}
          }
        }
        ,n._resetAllSpriteColorsWhite=function(e){
          !function e(n){
            if(null!=n&&n.isValid){
              for(var i,o=t(n.getComponents(r));
              !(i=o()).done;
              ){
                var a=i.value;
                null!=a&&a.isValid&&(a.color=u.clone())}
              for(var s,l=t(n.children);
              !(s=l()).done;
              )e(s.value)}
          }
          (e)}
        ,n._clearJointComponentsOnly=function(e){
          for(var t=e.getComponents(s),n=t.length-1;
          n>=0;
          n--){
            var i=t[n];
            null!=i&&i.isValid&&(i.connectedBody=null,i.destroy())}
        }
        ,n._removeHighlightClone=function(e){
          var t=e.getChildByName("hightLightIcon");
          null!=t&&t.isValid&&t.destroy()}
        ,n._stopAllTweensRecursive=function(e){
          !function e(n){
            if(null!=n&&n.isValid){
              a.stopAllByTarget(n);
              for(var i,o=t(n.getComponents(c));
              !(i=o()).done;
              ){
                var r=i.value;
                null!=r&&r.isValid&&a.stopAllByTarget(r)}
              for(var s,l=t(n.children);
              !(s=l()).done;
              )e(s.value)}
          }
          (e)}
        ,e}
      ()),n._RF.pop()}
  }
}
))
