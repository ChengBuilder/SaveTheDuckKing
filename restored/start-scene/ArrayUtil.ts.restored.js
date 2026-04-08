/**
 * Restored module: chunks:///_virtual/ArrayUtil.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - t => cclegacy
 */
System.register("chunks:///_virtual/ArrayUtil.ts",["cc"],(function(e){
  var t;
  return{
    setters:[function(e){
      t=e.cclegacy}
    ],execute:function(){
      e("shuffleInPlace",(function(e){
        for(var t=e.length-1;
        t>0;
        t--){
          var n=Math.floor(Math.random()*(t+1)),i=[e[n],e[t]];
          e[t]=i[0],e[n]=i[1]}
      }
      )),t._RF.push({
      }
      ,"e3b8cDRfypOm7xWGis8TV5v","ArrayUtil",void 0),t._RF.pop()}
  }
}
))
