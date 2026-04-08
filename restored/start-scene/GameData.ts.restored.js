/**
 * Restored module: chunks:///_virtual/GameData.ts
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
System.register("chunks:///_virtual/GameData.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts","./GameModel2.ts"],(function(e){
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
      ,"082beLhB5xFOZRPH5vmXNY4","GameData",void 0),o.ccclass,o.property;
      e("GameData",function(e){
        function i(){
          for(var t,n,i=arguments.length,o=new Array(i),r=0;
          r<i;
          r++)o[r]=arguments[r];
          return(n=e.call.apply(e,[this].concat(o))||this).levelModeData=((t={
          }
          )[0]=!1,t[1]=!1,t[2]=!1,t[3]=!1,t[4]=!1,t[5]=!1,t[6]=!1,t[7]=!1,t),n}
        t(i,e);
        var o=i.prototype;
        return o.setLevelModeData=function(e,t){
          this.levelModeData[e]=t}
        ,o.getLevelModeData=function(e){
          return this.levelModeData[e]}
        ,o.onload=function(){
          this.setLevelModeData(0,this.isShowLockMode()),this.setLevelModeData(1,this.isShowFreezeMode()),this.setLevelModeData(3,this.isShowSingleWoodColorMode()),this.setLevelModeData(2,this.isShowSingleWoodTypeMode()),this.setLevelModeData(4,this.isShowSnagMode()),this.setLevelModeData(5,this.isShowCombinationMode()),this.setLevelModeData(6,this.isShowTidyMode()),this.setLevelModeData(7,this.isShowRotateMode())}
        ,o.isShowLockMode=function(){
          var e=!1,t=a.instance.level;
          return(4==t||8==t||14==t||18==t||t>21&&((t-21)%10==3||(t-21)%10==7))&&(e=!0),e}
        ,o.isShowFreezeMode=function(){
          var e=!1,t=a.instance.level;
          return(7==t||17==t||t>21&&(t-21)%10==6)&&(e=!0),e}
        ,o.isShowSingleWoodTypeMode=function(){
          var e=!1,t=a.instance.level;
          return(8==t||18==t||t>21&&(t-21)%10==7)&&(e=!0),e}
        ,o.isShowSingleWoodColorMode=function(){
          var e=!1;
          return a.instance.level%5!=0&&(e=!0),e}
        ,o.isShowSnagMode=function(){
          var e=!1,t=a.instance.level;
          return(5==t||10==t||15==t||20==t||t>21&&((t-21)%10==4||(t-21)%10==9))&&(e=!0),e}
        ,o.isShowCombinationMode=function(){
          var e=!1,t=a.instance.level;
          return(6==t||11==t||16==t||21==t||t>21&&((t-21)%10==5||(t-21)%10==10))&&(e=!0),e}
        ,o.isShowTidyMode=function(){
          var e=!1,t=a.instance.level;
          return(9==t||13==t||19==t||t>21&&((t-21)%10==2||(t-21)%10==8))&&(e=!0),e}
        ,o.isShowRotateMode=function(){
          var e=!1,t=a.instance.level;
          return(2==t||12==t||t>21&&(t-21)%10==1)&&(e=!0),e}
        ,n(i,[{
          key:"lockNailFlag",get:function(){
            return this.getLevelModeData(0)}
        }
        ,{
          key:"iceNailFlag",get:function(){
            return this.getLevelModeData(1)}
        }
        ,{
          key:"singleWoodTypeFlag",get:function(){
            return this.getLevelModeData(2)}
        }
        ,{
          key:"singleWoodColorFlag",get:function(){
            return this.getLevelModeData(3)}
        }
        ,{
          key:"snagFlag",get:function(){
            return this.getLevelModeData(4)}
        }
        ,{
          key:"combinationFlag",get:function(){
            return this.getLevelModeData(5)}
        }
        ,{
          key:"tidyFlag",get:function(){
            return this.getLevelModeData(6)}
        }
        ,{
          key:"rotateFlag",get:function(){
            return this.getLevelModeData(7)}
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
