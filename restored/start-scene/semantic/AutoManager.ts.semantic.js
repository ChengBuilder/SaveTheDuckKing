/**
 * Semantic view: chunks:///_virtual/AutoManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => Component
 * - c => Wood
 * - d => Util
 * - i => cclegacy
 * - l => Nail
 * - n => createClass
 * - o => _decorator
 * - r => find
 * - s => DuckController
 * - t => inheritsLoose
 * - u => GameCtrl
 */
/**
 * Restored module: chunks:///_virtual/AutoManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => Component
 * - c => Wood
 * - d => Util
 * - i => cclegacy
 * - l => Nail
 * - n => createClass
 * - o => _decorator
 * - r => find
 * - s => DuckController
 * - t => inheritsLoose
 * - u => GameCtrl
 */
System.register("chunks:///_virtual/AutoManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./DuckController.ts","./Nail.ts","./Wood.ts","./GameCtrl.ts","./Util.ts"],(function(e){
  var t /* inheritsLoose */, n /* createClass */, i /* cclegacy */, o /* _decorator */, r /* find */, a /* Component */, s /* DuckController */, l /* Nail */, c /* Wood */, u /* GameCtrl */, d /* Util */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */,n=e.createClass /* createClass */}
    ,function(e){
      i=e.cclegacy /* cclegacy */,o=e._decorator /* _decorator */,r=e.find /* find */,a=e.Component /* Component */}
    ,function(e){
      s=e.DuckController /* DuckController */}
    ,function(e){
      l=e.Nail /* Nail */}
    ,function(e){
      c=e.Wood /* Wood */}
    ,function(e){
      u=e.GameCtrl /* GameCtrl */}
    ,function(e){
      d=e.Util /* Util */}
    ],execute:function(){
      var h,p;
      i._RF.push({
      }
      ,"79d7bkRGTRGU4jbM+ZzgZaj","AutoManager",void 0);
      var f=o.ccclass;
      o.property,e("AutoManager",f("AutoManager")(((p=function(e){
        function i(){
          var t;
          return(t=e.call(this)||this).MainGameTS=null,t.isAuto=!1,t.propTime=0,t}
        t(i,e);
        var o=i.prototype;
        return o.start=function(){
          this.propTime=0,this.MainGameTS=r("Canvas").getComponent(s)}
        ,o.AutoGetNail=function(){
          var e=this;
          if(!u.instance.gameIsOver&&this.isAuto)if(u.instance.canTouch){
            var t=null;
            if(0==this.MainGameTS.DeleteGridArr.length){
              var n=this.GetOneCanTouchNail();
              n&&(t=n)}
            else if(this.MainGameTS.DeleteGridArr.length<=this.MainGameTS.maxLenGridNum){
              var i=this.GetSameColorNail();
              if(i)t=i;
              else if(this.propTime>5){
                var o=this.GetOneCanTouchNail();
                o&&(t=o)}
              else if(this.MainGameTS.DeleteGridArr.length<this.MainGameTS.maxLenGridNum){
                var r=this.GetOneCanTouchNail();
                r&&(t=r)}
            }
            if(t)this.propTime=0,this.MainGameTS.touchNail(t);
            else{
              this.propTime++;
              var a=d.getRandomNum(0,1,!0);
              a=1,this.CheckSameColorNail()||(a=0),this.MainGameTS.onPropClick(null,a.toString())}
            this.scheduleOnce((function(){
              e.AutoGetNail()}
            ),2)}
          else this.scheduleOnce((function(){
            e.AutoGetNail()}
          ),2)}
        ,o.CheckSameColorNail=function(){
          for(var e=this.MainGameTS.DeleteGridArr[this.MainGameTS.DeleteGridArr.length-1].getComponent(l).type,t=this.GetAllNail(),n=t.length-1;
          n>=0;
          n--){
            var i=t[n];
            if(i.getComponent(l).type==e&&!i.getComponent(l).isIceLock)return!0}
          return!1}
        ,o.GetAllNail=function(){
          for(var e=this.MainGameTS.woodArr,t=[],n=0;
          n<e.length;
          n++)if(e[n])for(var i=0;
          i<e[n].getComponent(c).nailArr.length;
          i++)e[n].getComponent(c).nailArr[i]&&t.push(e[n].getComponent(c).nailArr[i]);
          return t}
        ,o.GetOneCanTouchNail=function(){
          this.MainGameTS.woodArr;
          for(var e,t=null,n=(e=this.GetAllNail()).length-1;
          n>=0;
          n--){
            var i=e[n];
            if(this.MainGameTS.checkCanTouch(i)&&!i.getComponent(l).isIceLock){
              t=i;
              break}
          }
          return t}
        ,o.GetSameColorNail=function(){
          for(var e=null,t=this.MainGameTS.DeleteGridArr[this.MainGameTS.DeleteGridArr.length-1].getComponent(l).type,n=this.GetAllNail(),i=n.length-1;
          i>=0;
          i--){
            var o=n[i];
            if(o.getComponent(l).type==t&&this.MainGameTS.checkCanTouch(o)&&!o.getComponent(l).isIceLock){
              e=o;
              break}
          }
          return e}
        ,o.update=function(e){
        }
        ,n(i,null,[{
          key:"_ins",get:function(){
            return this._instance}
        }
        ]),i}
      (a))._instance=new p,h=p))||h),i._RF.pop()}
  }
}
))

