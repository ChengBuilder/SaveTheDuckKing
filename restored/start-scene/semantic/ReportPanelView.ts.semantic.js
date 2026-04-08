/**
 * Semantic view: chunks:///_virtual/ReportPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - a => _decorator
 * - c => Component
 * - i => initializerDefineProperty
 * - l => EditBox
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => TooYueManager
 */
/**
 * Restored module: chunks:///_virtual/ReportPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - a => _decorator
 * - c => Component
 * - i => initializerDefineProperty
 * - l => EditBox
 * - n => inheritsLoose
 * - o => assertThisInitialized
 * - r => cclegacy
 * - s => Node
 * - t => applyDecoratedDescriptor
 * - u => TooYueManager
 */
System.register("chunks:///_virtual/ReportPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./TooYueManager.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, i /* initializerDefineProperty */, o /* assertThisInitialized */, r /* cclegacy */, a /* _decorator */, s /* Node */, l /* EditBox */, c /* Component */, u /* TooYueManager */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,i=e.initializerDefineProperty /* initializerDefineProperty */,o=e.assertThisInitialized /* assertThisInitialized */}
,function(e){
r=e.cclegacy /* cclegacy */,a=e._decorator /* _decorator */,s=e.Node /* Node */,l=e.EditBox /* EditBox */,c=e.Component /* Component */}
,function(e){
u=e.TooYueManager /* TooYueManager */}
],execute:function(){
var d,h,p,f,g,m,v;
r._RF.push({
}
,"c46e7XewTxH65CtP9ImmJt6","ReportPanelView",void 0);
var y=a.ccclass,_=a.property;
e("ReportPanelView",(d=y("ReportPanelView"),h=_(s),p=_(s),d((m=t((g=function(e){
function t(){
for(var t,n=arguments.length,r=new Array(n),a=0;
a<n;
a++)r[a]=arguments[a];
return t=e.call.apply(e,[this].concat(r))||this,i(t,"selectNode",m,o(t)),i(t,"detailNode",v,o(t)),t.selectType=0,t.detailStr=null,t}
n(t,e);
var r=t.prototype;
return r.start=function(){
}
,r.chooseReportType=function(e,t){
var n=Number(t);
this.selectType=n;
for(var i=0;
i<this.selectNode.children.length;
i++){
var o=this.selectNode.children[i];
i==n?(o.getChildByName("Circle").getChildByName("圆1").active=!0,o.getChildByName("Circle").getChildByName("圆2").active=!1):(o.getChildByName("Circle").getChildByName("圆1").active=!1,o.getChildByName("Circle").getChildByName("圆2").active=!0)}
}
,r.WriteDetail=function(){
this.detailStr=this.detailNode.getComponent(l).string}
,r.CloseBack=function(){
this.node.destroy()}
,r.SubmitBack=function(){
var e=this;
if(null!=this.selectType){
u._ins.feedBackMessage(this.selectType,this.detailStr),this.node.getChildByName("reportTip").active=!0;
for(var t=0;
t<this.node.children.length;
t++){
var n=this.node.children[t];
"reportTip"!=n.name&&(n.active=!1)}
this.scheduleOnce((function(){
e.node.destroy()}
),1)}
}
,r.update=function(e){
}
,t}
(c)).prototype,"selectNode",[h],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),v=t(g.prototype,"detailNode",[p],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),f=g))||f)),r._RF.pop()}
}
}
))

