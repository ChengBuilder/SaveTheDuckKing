/**
 * Semantic view: chunks:///_virtual/ResManager.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => _decorator
 * - c => Prefab
 * - d => JsonAsset
 * - h => default
 * - n => createClass
 * - o => asyncToGenerator
 * - r => cclegacy
 * - s => assetManager
 * - t => inheritsLoose
 * - u => SpriteFrame
 */
/**
 * Restored module: chunks:///_virtual/ResManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => Prefab
 * - d => JsonAsset
 * - h => default
 * - n => createClass
 * - o => asyncToGenerator
 * - r => cclegacy
 * - s => assetManager
 * - t => inheritsLoose
 * - u => SpriteFrame
 */
System.register("chunks:///_virtual/ResManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Singleton.ts"],(function(e){
  var t /* inheritsLoose */, n /* createClass */, o /* asyncToGenerator */, r /* cclegacy */, a /* _decorator */, s /* assetManager */, l, c /* Prefab */, u /* SpriteFrame */, d /* JsonAsset */, h /* default */;
  return{
    setters:[function(e){
      t=e.inheritsLoose /* inheritsLoose */,n=e.createClass /* createClass */,o=e.asyncToGenerator /* asyncToGenerator */}
    ,function(e){
      r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.assetManager /* assetManager */,l=e.js,c=e.Prefab /* Prefab */,u=e.SpriteFrame /* SpriteFrame */,d=e.JsonAsset /* JsonAsset */}
    ,function(e){
      h=e.default /* default */}
    ],execute:function(){
      var p;
      r._RF.push({
      }
      ,"2619dP/MBtAxoTKFD6hfHG6","ResManager",void 0);
      var f=a.ccclass;
      a.property,e("ResManager",f("ResManager")(p=function(e){
        function r(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this)._assetsCache=new Map,t}
        t(r,e);
        var a=r.prototype;
        return a.loadBundle=function(){
          var e=o(i().mark((function e(t,n){
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:return e.abrupt("return",new Promise((function(e,i){
                  s.loadBundle(t,n,(function(t,n){
                    if(t)return console.error("[LoadScene] 加载+bundleName+失败:",t),void i(t);
                    e(n)}
                  ))}
                )));
                case 1:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(t,n){
            return e.apply(this,arguments)}
        }
        (),a.bundleLoadDir=function(){
          var e=o(i().mark((function e(t,n,o,r){
            var a;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:(a=s.getBundle(t))?a.loadDir(n,o,r):console.warn("未能找到bundle: "+t);
                case 2:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(t,n,i,o){
            return e.apply(this,arguments)}
        }
        (),a.bundleLoad=function(){
          var e=o(i().mark((function e(t,n,o,r){
            var a,l;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:if(!(a=s.getBundle(t))){
                  e.next=7;
                  break}
                return l=a.get(n),e.next=5,new Promise((function(e,t){
                  if(l)return r(null,l),void e(l);
                  a.load(n,o,(function(n,i){
                    if(n)return console.error(n),void t(n);
                    r(null,i),e(i)}
                  ))}
                ));
                case 5:e.next=8;
                break;
                case 7:console.warn("未能找到bundle: "+t);
                case 8:case"end":return e.stop()}
            }
            ),e)}
          )));
          return function(t,n,i,o){
            return e.apply(this,arguments)}
        }
        (),a.bundleLoadScene=function(e,t,n,i){
          s.getBundle(e)?i(null,t):console.warn("未能找到bundle: "+e)}
        ,a.preloadBundleScene=function(e,t){
          var n=s.getBundle(e);
          n?n.preloadScene(t):console.warn("未能找到bundle: "+e)}
        ,a.loadAudio=function(e,t){
          this.bundleLoad("audioBundle",e,null,(function(n,i){
            n?console.log("audioBundle not exist: "+e):t(n,i)}
          ))}
        ,a.removeBundleAssets=function(e,t){
          var n=s.getBundle(e);
          n?n.release(t):console.warn("Bundle "+e+" not found.")}
        ,a.clearBundleAssets=function(e){
          var t=s.getBundle(e);
          t?t.releaseAll():console.warn("Bundle "+e+" not found.")}
        ,a.setAsset=function(){
          var e=o(i().mark((function e(t,n){
            var o;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:o=t+":"+l.getClassName(n),this._assetsCache.set(o,n);
                case 2:case"end":return e.stop()}
            }
            ),e,this)}
          )));
          return function(t,n){
            return e.apply(this,arguments)}
        }
        (),a.saveToAssetsCache=function(){
          var e=o(i().mark((function e(t){
            var n;
            return i().wrap((function(e){
              for(;
              ;
              )switch(e.prev=e.next){
                case 0:n=this,(null==t?void 0:t.length)>0&&t.map(o(i().mark((function e(t){
                  return i().wrap((function(e){
                    for(;
                    ;
                    )switch(e.prev=e.next){
                      case 0:if(e.t0=null!=t&&t.name,!e.t0){
                        e.next=4;
                        break}
                      return e.next=4,n.setAsset(t.name,t);
                      case 4:case"end":return e.stop()}
                  }
                  ),e)}
                ))));
                case 2:case"end":return e.stop()}
            }
            ),e,this)}
          )));
          return function(t){
            return e.apply(this,arguments)}
        }
        (),a.removeAssetFromAssetsCache=function(e,t){
          var n=e+":"+l.getClassName(t);
          this._assetsCache.delete(n)}
        ,a.clearAssetsCache=function(){
          this._assetsCache.clear()}
        ,a.getAsset=function(e,t){
          var n=e+":"+l.getClassName(t),i=this._assetsCache.get(n);
          return i&&i instanceof t?i:(console.warn("未能找到资源: "+n),null)}
        ,a.getPrefab=function(e){
          return this.getAsset(e,c)||null}
        ,a.getSpriteFrame=function(e){
          return this.getAsset(e,u)||(console.warn("未能找到图片资源: "+e),null)}
        ,a.getJsonAsset=function(e){
          return this.getAsset(e,d)||(console.warn("未能找到json资源: "+e),null)}
        ,n(r,[{
          key:"assetsCache",get:function(){
            return this._assetsCache}
        }
        ],[{
          key:"instance",get:function(){
            return e.getInstance.call(this)}
        }
        ]),r}
      (h))||p),r._RF.pop()}
  }
}
))

