/**
 * Restored module: chunks:///_virtual/LevelMechanismManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => buildFullScreenNeatRowLocalXs
 * - c => buildRowSlotColsCenterPlusRandom
 * - d => maxSlotsForRow
 * - f => computeDefaultRowCounts
 * - h => computeFullScreenNeatRowCounts
 * - i => UITransform
 * - l => validateRowCountsWithinSlots
 * - n => cclegacy
 * - o => Vec3
 * - p => computeFullScreenMessyRowCounts
 * - r => validateRowCountsFullScreenMessy
 * - s => buildFullScreenMessyRowLocalXs
 * - t => createForOfIteratorHelperLoose
 * - u => buildRowSlotColsFromRowCounts
 */
System.register("chunks:///_virtual/LevelMechanismManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./BoardLayout.ts","./DefaultRowCounts.ts"],(function(e){
  var t,n,i,o,r,a,s,l,c,u,d,h,p,f;
  return{
    setters:[function(e){
      t=e.createForOfIteratorHelperLoose}
    ,function(e){
      n=e.cclegacy,i=e.UITransform,o=e.Vec3}
    ,function(e){
      r=e.validateRowCountsFullScreenMessy,a=e.buildFullScreenNeatRowLocalXs,s=e.buildFullScreenMessyRowLocalXs,l=e.validateRowCountsWithinSlots,c=e.buildRowSlotColsCenterPlusRandom,u=e.buildRowSlotColsFromRowCounts,d=e.maxSlotsForRow}
    ,function(e){
      h=e.computeFullScreenNeatRowCounts,p=e.computeFullScreenMessyRowCounts,f=e.computeDefaultRowCounts}
    ],execute:function(){
      function g(e){
        return e.reduce((function(e,t){
          return e+t}
        ),0)%2==0}
      e({
        isShapeMechanism:function(e){
          return"standard"===e.kind||"blind_box"===e.kind||"fruit_hole"===e.kind||"row_fruit_hole"===e.kind}
        ,resolveFixedShapeFromNodeMarkers:function(e,n,r,a){
          if(null==e||!e.isValid||null==n||!n.isValid)return console.warn("[LevelMechanism] fixed_shape 需要有效的 layContent 与 nodeLevelMap 容器节点"),null;
          var s=e.getComponent(i);
          if(!s)return console.warn("[LevelMechanism] fixed_shape layContent 缺少 UITransform"),null;
          for(var l,c=new o,u=new o,d=[],h=t(n.children);
          !(l=h()).done;
          ){
            var p=l.value;
            if(p.activeInHierarchy){
              var f=p.name.trim(),g=parseInt(f,10);
              if(!Number.isFinite(g)||g<1||!Number.isInteger(g))return console.warn("[LevelMechanism] fixed_shape 子节点名须为正整数水果 id，当前:",p.name),null;
              if(void 0!==a&&g>a)return console.warn("[LevelMechanism] fixed_shape 水果 id",g,"超过 maxFruit",a),null;
              p.getWorldPosition(c),s.convertToNodeSpaceAR(c,u),d.push({
                id:g,lx:u.x,ly:u.y}
              )}
          }
          if(0===d.length)return console.warn("[LevelMechanism] fixed_shape 容器下无有效子节点"),null;
          if(d.length!==r)return console.warn("[LevelMechanism] fixed_shape 子节点数",d.length,"与 totalFruits",r,"不一致"),null;
          d.sort((function(e,t){
            return e.lx-t.lx||e.ly-t.ly}
          ));
          for(var m=d.length,v=[],y=[],_=[],b=0;
          b<m;
          b++){
            v.push(b);
            var S=d[b];
            _.push(S.id),y.push({
              x:S.lx,y:S.ly}
            )}
          return{
            rowCounts:[m],rowSlotCols:[v],explicitIds:_,fruitSlotLocalPos:[y]}
        }
        ,validateRowCountsParity:g}
      ),n._RF.push({
      }
      ,"f10d8VpZz5IJLCANbajj29t","LevelMechanismManager",void 0),e("DEFAULT_FRUIT_HOLE_RESERVE",8);
      var m=e("LEVEL_MECHANISM_PRESET",{
        1:{
          kind:"fixed_shape",nodeMapIndex:0}
        ,2:{
          kind:"standard",shape:"triangle"}
        ,3:{
          kind:"standard",shape:"center_random_fill",centerFillBase:"default"}
        ,4:{
          kind:"blind_box",shape:"default",blindBoxRatio:.05}
        ,5:{
          kind:"standard",shape:"default"}
        ,6:{
          kind:"standard",shape:"default"}
        ,7:{
          kind:"standard",shape:"seven_six"}
        ,8:{
          kind:"standard",shape:"default"}
        ,9:{
          kind:"standard",shape:"default",ropeMaxCount:2}
        ,10:{
          kind:"row_fruit_hole",shape:"default",rowHoleFruitRatio:.03,rowHoleInnerCount:5}
        ,11:{
          kind:"standard",shape:"default"}
      }
      ),v=[1,2,3,4,5,6,7,6,5,4,3,2],y=v.length;
      function _(e){
        if(e<1||e%2!=0)return console.warn("[LevelMechanism] triangle_pattern totalFruits 须为正偶数",e),null;
        for(var t=[],n=e,i=0,o=0;
        n>0&&o++<2e4;
        ){
          var r=v[i%y],a=d(i),s=Math.min(r,n,a);
          if(s<=0)return console.warn("[LevelMechanism] triangle_pattern 无法继续分配 remaining=",n,"row=",i),null;
          t.push(s),n-=s,i++}
        return 0!==n?(console.warn("[LevelMechanism] triangle_pattern 分配未闭合",n),null):l(t)?t:(console.warn("[LevelMechanism] triangle_pattern 行数异常",t),null)}
      e("LevelMechanismManager",function(){
        function e(){
        }
        return e.getForLevel=function(e){
          var t,n,i={
            kind:"standard",shape:"default"}
          ;
          return e<1?i:1===e?null!=(t=m[1])?t:i:e>=22?i:null!=(n=m[(e-2)%10+2])?n:i}
        ,e._resolveShapeBoard=function(e,t){
          var n=e.shape,i=e.kind,o=e.centerFillBase;
          switch(n){
            case"default":if("blind_box"===i){
              var m=f(t);
              return g(m)?l(m)?{
                rowCounts:m.slice(),rowSlotCols:u(m)}
              :(console.warn("[LevelMechanism] blind_box + default 形状 某行超出该行槽位上限",m),null):(console.warn("[LevelMechanism] blind_box + default 形状 总格子数须为偶数（成对）",m),null)}
            return null;
            case"seven_six":var v=function(e){
              if(e<1||e%2!=0)return console.warn("[LevelMechanism] seven_six_repeat totalFruits 须为正偶数",e),null;
              for(var t=[],n=e,i=0,o=0;
              n>0&&o++<2e4;
              ){
                var r=i%2==0?7:6,a=d(i),s=Math.min(r,n,a);
                if(s<=0)return console.warn("[LevelMechanism] seven_six_repeat 无法继续分配 remaining=",n,"row=",i),null;
                t.push(s),n-=s,i++}
              return 0!==n?(console.warn("[LevelMechanism] seven_six_repeat 分配未闭合",n),null):l(t)?t:(console.warn("[LevelMechanism] seven_six_repeat 行数异常",t),null)}
            (t);
            return null!=v&&v.length?g(v)?{
              rowCounts:v.slice(),rowSlotCols:u(v)}
            :(console.warn("[LevelMechanism] seven_six 总和校验失败",v),null):null;
            case"triangle":var y=_(t);
            return null!=y&&y.length?g(y)?{
              rowCounts:y.slice(),rowSlotCols:u(y)}
            :(console.warn("[LevelMechanism] triangle 总和校验失败",y),null):null;
            case"center_random_fill":var b,S=null;
            if("triangle"===(null!=o?o:"triangle"))S=_(t);
            else{
              var C=(S=f(t)).reduce((function(e,t){
                return e+t}
              ),0);
              if(C!==t)return console.warn("[LevelMechanism] center_random_fill + default 行和与 totalFruits 不一致",C,t),null}
            if(null==(b=S)||!b.length)return null;
            if(!g(S))return console.warn("[LevelMechanism] center_random_fill 总和须为偶数",S),null;
            if(!l(S))return console.warn("[LevelMechanism] center_random_fill 槽位上限",S),null;
            var w=c(S);
            return null===w?(console.warn("[LevelMechanism] center_random_fill 槽位生成失败（中间/下行约束）",S),null):{
              rowCounts:S.slice(),rowSlotCols:w}
            ;
            case"full_screen_messy":var N=p(t);
            if(!N.length)return null;
            var k=N.reduce((function(e,t){
              return e+t}
            ),0);
            if(k!==t)return console.warn("[LevelMechanism] full_screen_messy 行和与 totalFruits 不一致",k,t),null;
            if(!g(N))return console.warn("[LevelMechanism] full_screen_messy 总和须为偶数",N),null;
            if(!r(N))return console.warn("[LevelMechanism] full_screen_messy 单行超出设计宽度可放上限",N),null;
            var T=s(N),B=N.map((function(e){
              return Array.from({
                length:e}
              ,(function(e,t){
                return t}
              ))}
            ));
            return{
              rowCounts:N.slice(),rowSlotCols:B,rowSlotLocalXs:T,fullScreenLayoutMode:"messy"}
            ;
            case"full_screen_neat":var A,P=h(t,8);
            if(!P.length)return null;
            var M=P.reduce((function(e,t){
              return e+t}
            ),0);
            if(M!==t)return console.warn("[LevelMechanism] full_screen_neat 行和与 totalFruits 不一致",M,t),null;
            if(!g(P))return console.warn("[LevelMechanism] full_screen_neat 总和须为偶数",P),null;
            if(!r(P))return console.warn("[LevelMechanism] full_screen_neat 单行超出设计宽度可放上限",P),null;
            var I=null!=(A=e.gridHorizontalSpacing)?A:20,F=a(P,I),R=P.map((function(e){
              return Array.from({
                length:e}
              ,(function(e,t){
                return t}
              ))}
            ));
            return{
              rowCounts:P.slice(),rowSlotCols:R,rowSlotLocalXs:F,fullScreenLayoutMode:"neat"}
            ;
            default:return null}
        }
        ,e.resolveBoardShape=function(e,n,i){
          switch(e.kind){
            case"fruit_hole":case"row_fruit_hole":return this._resolveShapeBoard({
              kind:"standard",shape:e.shape,centerFillBase:e.centerFillBase}
            ,n);
            case"standard":case"blind_box":return this._resolveShapeBoard(e,n);
            case"fixed_points":var o=function(e){
              if(null==e||!e.length)return null;
              for(var n,i=new Map,o=t(e);
              !(n=o()).done;
              ){
                var r,a=n.value;
                if(!Number.isInteger(a.row)||a.row<0)return null;
                var s=d(a.row);
                if(!Number.isInteger(a.col)||a.col<0||a.col>=s)return null;
                var l=null!=(r=i.get(a.row))?r:[];
                if(l.indexOf(a.col)>=0)return null;
                l.push(a.col),i.set(a.row,l)}
              for(var c=Math.max.apply(Math,i.keys()),u=[],h=[],p=0;
              p<=c;
              p++){
                var f=i.get(p);
                if(null==f||!f.length)return console.warn("[LevelMechanism] fixed_points 行",p,"缺失或为空，须从 0 起连续"),null;
                var g=[].concat(f).sort((function(e,t){
                  return e-t}
                ));
                u.push(g.length),h.push(g)}
              return{
                rowCounts:u,rowSlotCols:h}
            }
            (e.points);
            if(!o)return console.warn("[LevelMechanism] fixed_points 解析失败"),null;
            var r=o.rowCounts,a=o.rowSlotCols,s=r.reduce((function(e,t){
              return e+t}
            ),0);
            return s!==n?(console.warn("[LevelMechanism] fixed_points 格数",s,"与 totalFruits",n,"不一致"),null):g(r)?l(r)?{
              rowCounts:r.slice(),rowSlotCols:a.map((function(e){
                return e.slice()}
              ))}
            :(console.warn("[LevelMechanism] fixed_points 某行超出该行槽位上限",r),null):(console.warn("[LevelMechanism] fixed_points 总格子数须为偶数（成对）",r),null);
            case"fixed_shape":return null;
            case"random_shape_pool":var c,h=null==(c=e.candidates)?void 0:c.filter((function(e){
              return!(null==e||!e.length)&&e.reduce((function(e,t){
                return e+t}
              ),0)===n&&g(e)&&l(e)}
            ));
            if(null==h||!h.length)return console.warn("[LevelMechanism] random_shape_pool 无合法候选 totalFruits=",n),null;
            var p=h[Math.floor(Math.random()*h.length)];
            return{
              rowCounts:p.slice(),rowSlotCols:u(p)}
            ;
            default:return null}
        }
        ,e.computeRowCounts=function(e,t,n){
          var i=this.resolveBoardShape(e,t,n);
          return i?i.rowCounts:null}
        ,e}
      ()),n._RF.pop()}
  }
}
))
