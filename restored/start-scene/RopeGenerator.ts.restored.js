/**
 * Restored module: chunks:///_virtual/RopeGenerator.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => Vec2
 * - n => cclegacy
 * - o => CollisionUtil
 * - t => createForOfIteratorHelperLoose
 */
System.register("chunks:///_virtual/RopeGenerator.ts",["./rollupPluginModLoBabelHelpers.js","cc","./CollisionUtil.ts"],(function(e){
  var t,n,i,o;
  return{
    setters:[function(e){
      t=e.createForOfIteratorHelperLoose}
    ,function(e){
      n=e.cclegacy,i=e.Vec2}
    ,function(e){
      o=e.CollisionUtil}
    ],execute:function(){
      e({
        buildRopePathCandidatesWorld:c,tryPickFirstValidRopePath:function(e,n,o,a,s,l,d,h){
          if(Math.sqrt((o-e)*(o-e)+(a-n)*(a-n))>r+.001)return null;
          for(var p,f=c(e,n,o,a,s),g=t(f);
          !(p=g()).done;
          ){
            var m=p.value;
            if(u(m,l,d,h))return m.map((function(e){
              return new i(e.x,e.y)}
            ))}
          return null}
        ,validateRopePathWorld:u}
      ),n._RF.push({
      }
      ,"e8a524b24VPQJAx6Rg+BuBF","RopeGenerator",void 0);
      var r=e("ROPE_MAX_LINK_DIST",200),a=(e("ROPE_POINT_RADIUS",20),e("ROPE_STRAIGHT_STEP_PX",5));
      function s(e,t,n){
        var o=t.x-e.x,r=t.y-e.y,a=Math.sqrt(o*o+r*r);
        if(a<1e-6)return[new i(e.x,e.y)];
        for(var s=Math.max(1,Math.ceil(a/n)),l=[],c=0;
        c<=s;
        c++){
          var u=c/s;
          l.push(new i(e.x+o*u,e.y+r*u))}
        return l}
      function l(e,n,i,r,a){
        for(var s,l=t(r);
        !(s=l()).done;
        ){
          var c=s.value;
          if(o.circleVsCircle(e,n,i,c.x,c.y,c.r))return!1}
        for(var u,d=t(a);
        !(u=d()).done;
        ){
          var h=u.value;
          if(h.length>=3&&o.circleVsPolygon(e,n,i,h))return!1}
        return!0}
      function c(e,t,n,o,r){
        var s=n-e,l=o-t,c=Math.sqrt(s*s+l*l);
        if(c<1e-4)return[];
        for(var u=s/c,d=l/c,h=e+u*r,p=t+d*r,f=n-u*r-h,g=o-d*r-p,m=Math.sqrt(f*f+g*g),v=Math.max(1,Math.ceil(m/a)),y=[],_=0;
        _<=v;
        _++){
          var b=_/v;
          y.push(new i(h+f*b,p+g*b))}
        return[y]}
      function u(e,n,i,o,r){
        if(void 0===r&&(r=8),e.length<2)return!1;
        for(var a,c=t(e);
        !(a=c()).done;
        ){
          var u=a.value;
          if(!l(u.x,u.y,n,i,o))return!1}
        for(var d=0;
        d<e.length-1;
        d++)for(var h,p=s(e[d],e[d+1],r),f=t(p);
        !(h=f()).done;
        ){
          var g=h.value;
          if(!l(g.x,g.y,n,i,o))return!1}
        return!0}
      e("ROPE_CANDIDATE_PATH_COUNT",1),e("DEFAULT_ROPE_MAX_COUNT",2),n._RF.pop()}
  }
}
))
