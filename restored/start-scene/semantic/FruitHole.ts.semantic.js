/**
 * Semantic view: chunks:///_virtual/FruitHole.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => tween
 * - c => Fruit
 * - i => _decorator
 * - l => Component
 * - n => cclegacy
 * - o => Label
 * - r => Vec3
 * - t => inheritsLoose
 */
/**
 * Restored module: chunks:///_virtual/FruitHole.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => tween
 * - c => Fruit
 * - i => _decorator
 * - l => Component
 * - n => cclegacy
 * - o => Label
 * - r => Vec3
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/FruitHole.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Fruit.ts"],(function(e){
  var t /* inheritsLoose */, n /* cclegacy */, i /* _decorator */, o /* Label */, r /* Vec3 */, a /* tween */, s, l /* Component */, c /* Fruit */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */}
    ,function(e){
      n=e.cclegacy /* cclegacy */,i=e._decorator /* _decorator */,o=e.Label /* Label */,r=e.Vec3 /* Vec3 */,a=e.tween /* tween */,s=e.v3,l=e.Component /* Component */}
    ,function(e){
      c=e.Fruit /* Fruit */}
    ],execute:function(){
      var u;
      n._RF.push({
      }
      ,"d9a5ayX/7VLzpiAubTgH/Al","FruitHole",void 0);
      var d=i.ccclass;
      i.property,e("FruitHole",d("FruitHole")(u=function(e){
        function n(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this).countLabel=null,t.fruitNodeArr=[],t}
        t(n,e);
        var i=n.prototype;
        return i.start=function(){
          this.initNode()}
        ,i.initNode=function(){
          this.countLabel=this.node.getChildByName("HoleNum").getChildByName("Num").getComponent(o)}
        ,i.initFruitHole=function(e){
          var t=this;
          this.fruitNodeArr=e;
          for(var n=0;
          n<e.length;
          n++)e[n].getComponent(c).initHoleFlag(this.node);
          this.node.setScale(r.ZERO),a(this.node).to(.2,{
            scale:r.ONE}
          ).call((function(){
            t.sendFruit()}
          )).start()}
        ,i.sendFruit=function(){
          if(0!=this.fruitNodeArr.length){
            var e=this.fruitNodeArr[0];
            this.fruitNodeArr.shift(),e.setScale(r.ZERO);
            var t=e.getComponent(c).scale;
            e.setPosition(this.node.position),a(e).delay(.5).to(.2,{
              scale:s(t,t,t)}
            ).start(),this.updateCountLabel()}
          else this.hideFruitHole()}
        ,i.updateCountLabel=function(){
          this.countLabel.string=this.fruitNodeArr.length.toString(),0==this.fruitNodeArr.length&&(this.countLabel.node.parent.active=!1)}
        ,i.deleteFruitByProp=function(e){
          var t=this.fruitNodeArr.indexOf(e);
          -1!=t?(this.fruitNodeArr.splice(t,1),this.updateCountLabel()):this.sendFruit()}
        ,i.hideFruitHole=function(){
          var e=this;
          a(this.node).to(.2,{
            scale:r.ZERO}
          ).call((function(){
            e.node.destroy()}
          )).start()}
        ,n}
      (l))||u),n._RF.pop()}
  }
}
))

