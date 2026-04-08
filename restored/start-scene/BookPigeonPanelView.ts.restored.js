/**
 * Restored module: chunks:///_virtual/BookPigeonPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => Tween
 * - a => asyncToGenerator
 * - A => GameCtrl
 * - b => director
 * - B => ResManager
 * - c => Node
 * - C => Component
 * - d => ScrollView
 * - f => UIOpacity
 * - F => TooYueManager
 * - g => instantiate
 * - h => assetManager
 * - I => itemPigeonNode
 * - k => AudioManager
 * - l => _decorator
 * - M => HomeScene
 * - n => inheritsLoose
 * - N => UITransform
 * - o => initializerDefineProperty
 * - p => Prefab
 * - P => UIConfigTable
 * - r => assertThisInitialized
 * - R => default
 * - s => cclegacy
 * - S => find
 * - t => applyDecoratedDescriptor
 * - T => GameModel
 * - u => Button
 * - v => Vec3
 * - w => NodePool
 * - y => tween
 */
System.register("chunks:///_virtual/BookPigeonPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./ConfigTable.ts","./HomeScene.ts","./itemPigeonNode.ts","./TooYueManager.ts","./ServiceManager.ts"],(function(e){
var t,n,o,r,a,s,l,c,u,d,h,p,f,g,m,v,y,_,b,S,C,w,N,k,T,B,A,P,M,I,F,R;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor,n=e.inheritsLoose,o=e.initializerDefineProperty,r=e.assertThisInitialized,a=e.asyncToGenerator}
,function(e){
s=e.cclegacy,l=e._decorator,c=e.Node,u=e.Button,d=e.ScrollView,h=e.assetManager,p=e.Prefab,f=e.UIOpacity,g=e.instantiate,m=e.v3,v=e.Vec3,y=e.tween,_=e.Tween,b=e.director,S=e.find,C=e.Component,w=e.NodePool,N=e.UITransform}
,function(e){
k=e.AudioManager}
,function(e){
T=e.GameModel}
,function(e){
B=e.ResManager}
,function(e){
A=e.GameCtrl}
,function(e){
P=e.UIConfigTable}
,function(e){
M=e.HomeScene}
,function(e){
I=e.itemPigeonNode}
,function(e){
F=e.TooYueManager}
,function(e){
R=e.default}
],execute:function(){
var L,x,D,G,E,O,H,V,U,z,W,j,J;
s._RF.push({
}
,"71686309ABLYrlbWjmfq0Oh","BookPigeonPanelView",void 0);
var Y=l.ccclass,q=l.property;
e("BookPigeonPanelView",(L=Y("BookPigeonPanelView"),x=q(c),D=q(c),G=q(u),E=q(d),O=q(c),L((U=t((V=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"black",U,r(t)),o(t,"panel",z,r(t)),o(t,"closeBtn",W,r(t)),o(t,"scrollView",j,r(t)),o(t,"content",J,r(t)),t.itemPool=null,t.itemPrefab=null,t.itemWidth=0,t.itemHeight=0,t.contentWidth=0,t.contentHeight=0,t.itemXSpace=25,t.itemYSpace=30,t.listTotalRow=0,t.curStartIndex=1,t.curEndIndex=5,t._isActive=!1,t}
n(t,e);
var s=t.prototype;
return s.onLoad=function(){
}
,s.start=function(){
var e=a(i().mark((function e(){
var t;
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:t=this,y(this.black.getComponent(f)).to(.1,{
opacity:220}
).start(),y(this.panel).delay(.1).to(.3,{
position:m(0,0,0)}
,{
easing:"backOut"}
).call((function(){
A.instance.btnCanTouch=!0}
)).start(),this.content.setPosition(v.ZERO),this.itemPool=new w,B.instance.bundleLoad("uiBundle","prefab/itemPigeon",null,(function(e,n){
if(e)console.error("加载BookUI失败",e);
else{
if(n){
t.itemPrefab=n;
for(var i=0;
i<12;
i++){
var o=g(t.itemPrefab);
o.active=!1,t.itemPool.put(o),t.itemWidth=o.getComponent(N).width,t.itemHeight=o.getComponent(N).height}
}
t.listTotalRow=Math.ceil(T.PigeonTotalNum/3),t.contentHeight=t.listTotalRow*(t.itemHeight+t.itemYSpace)+t.itemYSpace,t.content.getComponent(N).height=t.contentHeight,t._isActive=!0,t.initView()}
}
));
case 2:case"end":return e.stop()}
}
),e,this)}
)));
return function(){
return e.apply(this,arguments)}
}
(),s.onEnable=function(){
this.registerEvents()}
,s.onDisable=function(){
this.unregisterEvents(),h.getBundle("uiBundle").release(P.BookUI.path,p)}
,s.initView=function(){
this.black.getComponent(f).opacity=0,this.panel.setPosition(0,T.instance.screenHeight),this.panel.setScale(1,1,1);
for(var e=0;
e<15;
e++)this.insItem(e,.1*e)}
,s.insItem=function(e,t){
var n=this;
void 0===t&&(t=0);
var i=null;
this.itemPool.size()>0?(i=this.itemPool.get()).active=!0:this.itemPrefab&&(i=g(this.itemPrefab)),i?(i.parent=this.content,this.initItem(i,e+1,t)):B.instance.bundleLoad("uiBundle","prefab/itemPigeon",null,(function(i,o){
if(i)console.error("加载BookUI失败",i);
else if(o){
n.itemPrefab=o;
var r=g(o);
r.setParent(n.content),n.initItem(r,e+1,t)}
}
))}
,s.insertItem=function(e,t,n){
var i=this;
void 0===n&&(n=0);
var o=null;
this.itemPool.size()>0?(o=this.itemPool.get()).active=!0:this.itemPrefab&&(o=g(this.itemPrefab)),o?(o.setParent(this.content),o.setSiblingIndex(t),this.initItem(o,e,n)):B.instance.bundleLoad("uiBundle","prefab/itemPigeon",null,(function(o,r){
if(o)console.error("加载BookUI失败",o);
else if(r){
i.itemPrefab=r;
var a=g(r);
a.setParent(i.content),a.setSiblingIndex(t),i.initItem(a,e,n)}
}
))}
,s.getPigeonIdByDisplayOrder=function(e){
return T.PigeonTotalNum-e+1}
,s.getItemPositionByDisplayOrder=function(e){
var t=m(0,0,0);
t.x=e%3==1?-this.itemWidth-this.itemXSpace:e%3==0?this.itemWidth+this.itemXSpace:0;
var n=Math.ceil(e/3)-1;
return t.y=-170-n*(this.itemHeight+this.itemYSpace),t}
,s.initItem=function(e,t,n){
e.active=!0;
var i=this.getPigeonIdByDisplayOrder(t);
e.setPosition(this.getItemPositionByDisplayOrder(t)),n>=0?e.setScale(v.ZERO):e.setScale(v.ONE),t>T.PigeonTotalNum||i<1?e.active=!1:this.initItemNode(e,i,n)}
,s.initItemNode=function(e,t,n){
e.getComponent(I).id=t,y(e).delay(n).to(.2,{
scale:v.ONE}
).to(.1,{
scale:m(1.1,.9,1)}
).to(.1,{
scale:v.ONE}
).start(),e.getComponent(I).initPigeonItem(),e.on(c.EventType.TOUCH_END,this.onClickItem,this)}
,s.hideItemNode=function(e){
e.getComponent(I).hide(),_.stopAllByTarget(e),e.setScale(v.ZERO),e.active=!1,e.off(c.EventType.TOUCH_END,this.onClickItem,this)}
,s.update=function(e){
this.updateItemNode()}
,s.updateItemNode=function(){
if(this._isActive){
var e=this.content.position;
if(e.y>0&&e.y<this.contentHeight-850){
var t=Math.floor(e.y/(this.itemHeight+this.itemYSpace))+1,n=Math.min(this.listTotalRow,t+4);
if(this.curStartIndex<t){
for(var i=t-this.curStartIndex,o=0;
o<i;
o++)for(var r=0;
r<3;
r++)this.content.children.length>0&&(this.hideItemNode(this.content.children[0]),this.itemPool.put(this.content.children[0]));
this.curStartIndex=t}
else if(this.curStartIndex>t){
for(var a=this.curStartIndex-t,s=0;
s<a;
s++){
this.curStartIndex--;
for(var l=0;
l<3;
l++)this.insertItem(3*this.curStartIndex-l,0,.1*l)}
this.curStartIndex=t}
if(n>this.curEndIndex){
for(var c=n-this.curEndIndex,u=0;
u<c;
u++){
for(var d=0;
d<3;
d++)this.insItem(3*this.curEndIndex+d,.1*d);
this.curEndIndex++}
this.curEndIndex=n}
else if(this.curEndIndex>n){
for(var h=this.curEndIndex-n,p=0;
p<h;
p++){
this.curEndIndex--;
for(var f=0;
f<3;
f++)this.content.children.length>0&&(this.hideItemNode(this.content.children[this.content.children.length-1]),this.itemPool.put(this.content.children[this.content.children.length-1]))}
this.curEndIndex=n}
}
}
}
,s.onClickItem=function(e){
var t=this,n=this.scrollView.content,i=n.children.indexOf(e.target);
i=e.target.getComponent(I).id-1,k.instance.playSound("ui/buttonClick"),T.instance.pigeonNumArr[i]<2?F._ins.showVideoAd("鸽子皮肤",(function(){
t.finishVideoAD(i,e.target)}
)):this.showUseTip(i,n,e.target)}
,s.showUseTip=function(e,t,n){
T.instance.pigeonName=T.PigeonNameArr[e];
for(var i=0;
i<t.children.length;
i++){
var o=t.children[i],r=o.getChildByName("useTip"),a=o.getChildByName("useLight");
o.getComponent(I).id==n.getComponent(I).id?(r.active=!0,a.active=!0):(r.active=!1,a.active=!1)}
"HomeScene"==b.getScene().name&&S("Canvas").getComponent(M).initPigeonSkin()}
,s.finishVideoAD=function(e,t){
var n=T.instance.pigeonNumArr;
n[e]++,T.instance.pigeonNumArr=n,R.instance.setStorageToServer(),t.getComponent(I).updateAdTime()}
,s.registerEvents=function(){
this.closeBtn.node.on("click",this.onClose,this)}
,s.unregisterEvents=function(){
this.closeBtn.node.off("click",this.onClose,this)}
,s.onClose=function(){
var e=this;
A.instance.btnCanTouch&&(A.instance.btnCanTouch=!1,k.instance.playSound("ui/buttonClick"),y(this.panel).to(.3,{
position:m(0,T.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),y(this.black.getComponent(f)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),A.instance.btnCanTouch=!0}
)).start())}
,t}
(C)).prototype,"black",[x],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),z=t(V.prototype,"panel",[D],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),W=t(V.prototype,"closeBtn",[G],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),j=t(V.prototype,"scrollView",[E],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),J=t(V.prototype,"content",[O],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),H=V))||H)),s._RF.pop()}
}
}
))
