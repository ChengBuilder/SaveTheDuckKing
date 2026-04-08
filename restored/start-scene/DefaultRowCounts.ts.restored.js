/**
 * Restored module: chunks:///_virtual/DefaultRowCounts.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - i => maxFruitsPerRowWithSlotGap
 * - n => maxFruitsPerRowFullScreenMessy
 * - t => cclegacy
 */
System.register("chunks:///_virtual/DefaultRowCounts.ts",["cc","./BoardLayout.ts"],(function(e){
  var t,n,i;
  return{
    setters:[function(e){
      t=e.cclegacy}
    ,function(e){
      n=e.maxFruitsPerRowFullScreenMessy,i=e.maxFruitsPerRowWithSlotGap}
    ],execute:function(){
      function o(e){
        return e<20?[1,2,3,4,5]:e<=50?[3,4,5,6,7]:[5,6,7,8,9]}
      e({
        computeDefaultRowCounts:function(e){
          var t=[1,2,3],n=e-6;
          if(n<0){
            t.length=0;
            for(var i=0,r=0,a=[1,2,3];
            r<a.length;
            r++){
              var s=a[r];
              if(!(i+s<=e))break;
              t.push(s),i+=s}
            n=e-i}
          for(var l=t.length,c=function(){
            var e,i=o(t.reduce((function(e,t){
              return e+t}
            ),0)),r=l%2==0?9:8,a=Math.min(r,n,9),s=i.filter((function(e){
              return e<=a}
            ));
            if(s.length>0)e=s[Math.floor(Math.random()*s.length)];
            else if((e=Math.min(n,a))<=0)return 1;
            t.push(e),n-=e,l++}
          ;
          n>0&&!c();
          );
          return t.reduce((function(e,t){
            return e+t}
          ),0)%2!=0&&t.push(1),t}
        ,computeFullScreenMessyRowCounts:function(e){
          var t=n();
          if(t<1)return console.warn("[DefaultRowCounts] computeFullScreenMessyRowCounts cap 无效",t),[];
          for(var i=[],o=e;
          o>0;
          ){
            var r=Math.min(o,t);
            i.push(r),o-=r}
          return i.reduce((function(e,t){
            return e+t}
          ),0)%2!=0&&i.push(1),i}
        ,computeFullScreenNeatRowCounts:function(e,t){
          void 0===t&&(t=8);
          var n=Math.max(1,Math.min(8,Math.floor(t)));
          if(n<1)return console.warn("[DefaultRowCounts] computeFullScreenNeatRowCounts cap 无效",n),[];
          for(var i=[],o=e;
          o>0;
          ){
            var r=Math.min(o,n);
            i.push(r),o-=r}
          return i.reduce((function(e,t){
            return e+t}
          ),0)%2!=0&&i.push(1),i}
        ,computeScatteredGapRowCounts:function(e){
          var t=[1,2,3],n=e-6;
          if(n<0){
            t.length=0;
            for(var r=0,a=0,s=0,l=[1,2,3];
            s<l.length;
            s++){
              var c=l[s];
              if(r>=e)break;
              var u=i(a),d=Math.min(c,e-r,u);
              if(d<=0)break;
              t.push(d),r+=d,a++}
            for(n=e-r;
            n>0;
            ){
              var h=i(a),p=Math.min(n,h);
              if(p<=0)break;
              t.push(p),n-=p,a++}
            return t.reduce((function(e,t){
              return e+t}
            ),0)%2!=0&&t.push(1),t}
          for(var f=t.length,g=function(){
            var e,r=o(t.reduce((function(e,t){
              return e+t}
            ),0)),a=f%2==0?9:8,s=i(f),l=Math.min(a,n,9,s),c=r.filter((function(e){
              return e<=l}
            ));
            if(c.length>0)e=c[Math.floor(Math.random()*c.length)];
            else if((e=Math.min(n,l))<=0)return 1;
            t.push(e),n-=e,f++}
          ;
          n>0&&!g();
          );
          return t.reduce((function(e,t){
            return e+t}
          ),0)%2!=0&&t.push(1),t}
      }
      ),t._RF.push({
      }
      ,"b2c3dTl9qdIkLEjRWeJq83v","DefaultRowCounts",void 0),t._RF.pop()}
  }
}
))
