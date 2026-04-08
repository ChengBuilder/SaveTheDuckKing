/**
 * Restored module: chunks:///_virtual/EventManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => cclegacy
 * - n => createClass
 * - o => default
 * - t => inheritsLoose
 */
System.register("chunks:///_virtual/EventManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts"],(function(e){
  var t,n,i,o;
  return{
    setters:[function(e){
      t=e.inheritsLoose,n=e.createClass}
    ,function(e){
      i=e.cclegacy}
    ,function(e){
      o=e.default}
    ],execute:function(){
      i._RF.push({
      }
      ,"7014et5PPlImpnOizAq6e99","EventManager",void 0),e("default",function(e){
        function i(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this).eventMap=new Map,t}
        t(i,e);
        var o=i.prototype;
        return o.on=function(e,t,n){
          var i=this.eventMap.get(e);
          i||(i=[],this.eventMap.set(e,i)),i.push({
            callback:t,target:n}
          )}
        ,o.emit=function(e){
          for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;
          i<t;
          i++)n[i-1]=arguments[i];
          var o=this.eventMap.get(e);
          o&&o.forEach((function(e){
            e.target?e.callback.apply(e.target,n):e.callback.apply(e,n)}
          ))}
        ,o.off=function(e,t,n){
          var i=this.eventMap.get(e);
          if(i){
            var o=i.findIndex((function(e){
              return e.callback===t&&e.target===n}
            ));
            -1!==o&&i.splice(o,1)}
        }
        ,n(i,null,[{
          key:"instance",get:function(){
            return e.getInstance.call(this)}
        }
        ]),i}
      (o)),i._RF.pop()}
  }
}
))
