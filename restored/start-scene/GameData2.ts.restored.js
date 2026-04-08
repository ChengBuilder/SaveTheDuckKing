/**
 * Restored module: chunks:///_virtual/GameData2.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => GameModel
 * - i => cclegacy
 * - n => createClass
 * - o => _decorator
 * - r => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/GameData2.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts","./GameModel2.ts"],(function(e){
  var t,n,i,o,r,a;
  return{
    setters:[function(e){
      t=e.inheritsLoose,n=e.createClass}
    ,function(e){
      i=e.cclegacy,o=e._decorator}
    ,function(e){
      r=e.default}
    ,function(e){
      a=e.GameModel}
    ],execute:function(){
      i._RF.push({
      }
      ,"691aaRf0d1OsaS7ACOdzVKh","GameData2",void 0),o.ccclass,o.property;
      var s="lockMode",l="tidyMode",c="snagMode",u="holeMode";
      e("GameData2",function(e){
        function i(){
          for(var t,n,i=arguments.length,o=new Array(i),r=0;
          r<i;
          r++)o[r]=arguments[r];
          return(n=e.call.apply(e,[this].concat(o))||this).levelModeData2=((t={
          }
          )[s]=!1,t[c]=!1,t[l]=!1,t[u]=!1,t),n}
        t(i,e);
        var o=i.prototype;
        return o.setLevelModeData=function(e,t){
          this.levelModeData2[e]=t}
        ,o.getLevelModeData=function(e){
          return this.levelModeData2[e]}
        ,o.onload=function(){
          this.setLevelModeData(s,this.isShowLockMode()),this.setLevelModeData(c,this.isShowSnagMode()),this.setLevelModeData(l,this.isShowTidyMode()),this.setLevelModeData(u,this.isShowHoleMode()),console.log(this.levelModeData2)}
        ,o.isShowLockMode=function(){
          var e=!1;
          return a.instance.level2%10==4&&(e=!0),e}
        ,o.isShowSnagMode=function(){
          var e=!1,t=a.instance.level2;
          return t%10!=5&&t%10!=0||(e=!0),e}
        ,o.isShowTidyMode=function(){
          var e=!1,t=a.instance.level2;
          return(t%10==1&&1!=t||t%10==6||t%10==3)&&(e=!0),e}
        ,o.isShowHoleMode=function(){
          var e=!1;
          return a.instance.level2%10==8&&(e=!0),e}
        ,n(i,[{
          key:"lockFruitFlag",get:function(){
            return this.getLevelModeData(s)}
        }
        ,{
          key:"snagFlag",get:function(){
            return this.getLevelModeData(c)}
        }
        ,{
          key:"snagType",get:function(){
            var e=a.instance.level2,t=0;
            return e%10==5?t=0:e%10==0&&(t=1),t}
        }
        ,{
          key:"tidyFlag",get:function(){
            return this.getLevelModeData(l)}
        }
        ,{
          key:"tidyType",get:function(){
            var e=a.instance.level2,t=0;
            return e%10==1||e%10==6?t=0:e%10==3&&(t=1),t}
        }
        ,{
          key:"holeFlag",get:function(){
            return this.getLevelModeData(u)}
        }
        ],[{
          key:"_ins",get:function(){
            return e.getInstance.call(this)}
        }
        ]),i}
      (r)),i._RF.pop()}
  }
}
))
