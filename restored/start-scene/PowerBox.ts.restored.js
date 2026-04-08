/**
 * Restored module: chunks:///_virtual/PowerBox.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => Prefab
 * - c => instantiate
 * - d => Component
 * - f => GameCtrl
 * - g => AudioManager
 * - h => UIConfigTable
 * - i => _decorator
 * - l => Button
 * - m => ResManager
 * - n => cclegacy
 * - o => Node
 * - p => GameModel
 * - r => assetManager
 * - s => Label
 * - t => inheritsLoose
 * - u => find
 */
System.register("chunks:///_virtual/PowerBox.ts",["./rollupPluginModLoBabelHelpers.js","cc","./ConfigTable.ts","./GameModel2.ts","./GameCtrl.ts","./AudioManager.ts","./ResManager.ts"],(function(e){
  var t,n,i,o,r,a,s,l,c,u,d,h,p,f,g,m;
  return{
    setters:[function(e){
      t=e.inheritsLoose}
    ,function(e){
      n=e.cclegacy,i=e._decorator,o=e.Node,r=e.assetManager,a=e.Prefab,s=e.Label,l=e.Button,c=e.instantiate,u=e.find,d=e.Component}
    ,function(e){
      h=e.UIConfigTable}
    ,function(e){
      p=e.GameModel}
    ,function(e){
      f=e.GameCtrl}
    ,function(e){
      g=e.AudioManager}
    ,function(e){
      m=e.ResManager}
    ],execute:function(){
      var v;
      n._RF.push({
      }
      ,"f899fCuqYZOA7pgwIAdM0Nc","PowerBox",void 0);
      var y=i.ccclass;
      i.property,e("PowerBox",y("PowerBox")(v=function(e){
        function n(){
          for(var t,n=arguments.length,i=new Array(n),o=0;
          o<n;
          o++)i[o]=arguments[o];
          return(t=e.call.apply(e,[this].concat(i))||this).spr=null,t.powerLabel=null,t.time=null,t.timeLabel=null,t.addPowerBtn=null,t}
        t(n,e);
        var i=n.prototype;
        return i.onLoad=function(){
          this.initNode(),this.initPowerBox()}
        ,i.start=function(){
        }
        ,i.update=function(e){
          if(this.powerLabel.string=p.instance.userPowerNum.toString(),p.instance.userPowerNum>=p.instance.userPowerCanAddMaxNum)this.time.active=!1;
          else{
            this.time.active=!0;
            var t=Date.now(),n=p.instance.lastAddPowerTime,i=p.instance.userPowerAddTime-(t-n);
            if(i>0){
              var o=Math.floor(i/6e4),r=Math.floor(i%6e4/1e3);
              this.timeLabel.string=o.toString().padStart(2,"0")+":"+r.toString().padStart(2,"0")}
            else this.timeLabel.string="00:00",p.instance.userPowerNum+=1,p.instance.lastAddPowerTime=t,p.instance.userPowerNum>=p.instance.userPowerCanAddMaxNum&&(this.time.active=!1)}
        }
        ,i.onEnable=function(){
          this.addPowerBtn.node.on("click",this.addPower,this),this.spr.on(o.EventType.TOUCH_START,this.subPower,this)}
        ,i.onDisable=function(){
          r.getBundle("uiBundle").release(h.powerBox.path,a),this.addPowerBtn.node.off("click",this.addPower,this),this.spr.off(o.EventType.TOUCH_START,this.subPower,this)}
        ,i.initNode=function(){
          this.spr=this.node.getChildByName("spr"),this.powerLabel=this.node.getChildByName("powerLabel").getComponent(s),this.time=this.node.getChildByName("time"),this.timeLabel=this.time.getChildByName("timeLabel").getComponent(s),this.addPowerBtn=this.node.getChildByName("addPowerBtn").getComponent(l)}
        ,i.initPowerBox=function(){
          if(this.powerLabel.string=p.instance.userPowerNum.toString(),this.checkAddPower(),p.instance.userPowerNum>=p.instance.userPowerCanAddMaxNum)this.time.active=!1;
          else{
            this.time.active=!0;
            var e=Date.now(),t=p.instance.lastAddPowerTime,n=p.instance.userPowerAddTime-(e-t);
            if(n>0){
              var i=Math.floor(n/6e4),o=Math.floor(n%6e4/1e3);
              this.timeLabel.string=i.toString().padStart(2,"0")+":"+o.toString().padStart(2,"0")}
          }
        }
        ,i.checkAddPower=function(){
          if(!(p.instance.userPowerNum>=p.instance.userPowerCanAddMaxNum)){
            var e=Date.now(),t=p.instance.lastAddPowerTime;
            if(0!=t){
              var n=p.instance.userPowerAddTime,i=e-t,o=Math.floor(i/n);
              if(o>0){
                var r=Math.min(p.instance.userPowerNum+o,p.instance.userPowerCanAddMaxNum);
                p.instance.userPowerNum=r,this.powerLabel.string=p.instance.userPowerNum.toString(),p.instance.lastAddPowerTime=t+o*n}
            }
            else p.instance.lastAddPowerTime=e}
        }
        ,i.addPower=function(){
          console.log("添加体力"),!1!==f.instance.btnCanTouch&&(f.instance.btnCanTouch=!1,g.instance.playSound("ui/buttonClick"),m.instance.bundleLoad("uiBundle",h.AddPowerPanel.path,null,(function(e,t){
            if(e)return console.log(e),void(f.instance.btnCanTouch=!0);
            c(t).parent=u("Canvas")}
          )))}
        ,i.subPower=function(){
          console.log("减体力"),p.instance.subPowerNum()}
        ,n}
      (d))||v),n._RF.pop()}
  }
}
))
