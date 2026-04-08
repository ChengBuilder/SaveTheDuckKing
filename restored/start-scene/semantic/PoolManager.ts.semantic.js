/**
 * Semantic view: chunks:///_virtual/PoolManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => ResManager
 * - i => NodePool
 * - n => _decorator
 * - o => instantiate
 * - r => Tween
 * - t => cclegacy
 */
/**
 * Restored module: chunks:///_virtual/PoolManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => ResManager
 * - i => NodePool
 * - n => _decorator
 * - o => instantiate
 * - r => Tween
 * - t => cclegacy
 */
System.register("chunks:///_virtual/PoolManager.ts",["cc","./ResManager.ts"],(function(e){
  var t /* cclegacy */, n /* _decorator */, i /* NodePool */, o /* instantiate */, r /* Tween */, a /* ResManager */;
  return{
    setters:[function(e){
      t=e.cclegacy /* cclegacy */,n=e._decorator /* _decorator */,i=e.NodePool /* NodePool */,o=e.instantiate /* instantiate */,r=e.Tween /* Tween */}
    ,function(e){
      a=e.ResManager /* ResManager */}
    ],execute:function(){
      var s,l;
      t._RF.push({
      }
      ,"cc57f0s5wpKy6RmBgj1LX6D","PoolManager",void 0);
      var c=n.ccclass;
      n.property,e("PoolManager",c("PoolManager")(((l=function(){
        function e(){
        }
        return e.Spawn=function(e,t,n,r){
          if(!this.poolHandle.has(e)){
            var s=a.instance.getPrefab(e);
            if(!s)return void console.error("没有该预制体："+e);
            var l=new i;
            this.poolHandle.set(s.data.name,l)}
          var c=this.poolHandle.get(e),u=null;
          return c.size()>0?(u=c.get()).active=!0:u=o(a.instance.getPrefab(e)),t&&(r?t.insertChild(u,r):t.addChild(u)),n&&u.setPosition(n),u}
        ,e.Despawn=function(e){
          var t=e.name;
          this.poolHandle.has(t)?(r.stopAllByTarget(e),e.active=!1,this.poolHandle.get(t).put(e)):console.error("没有该预制体："+t)}
        ,e.Delete=function(e){
          this.poolHandle.has(e)&&(this.poolHandle.get(e).clear(),this.poolHandle.delete(e))}
        ,e}
      ()).poolHandle=new Map,s=l))||s),t._RF.pop()}
  }
}
))

