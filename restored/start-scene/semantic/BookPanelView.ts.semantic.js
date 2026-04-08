/**
 * Semantic view: chunks:///_virtual/BookPanelView.ts
 * Source: restored/start-scene/*.restored.js
 * NOTE: safe readability annotations only (no identifier rewrite).
 * Alias annotations:
 * - _ => tween
 * - a => createForOfIteratorHelperLoose
 * - A => find
 * - b => instantiate
 * - B => director
 * - c => _decorator
 * - C => assetManager
 * - d => Button
 * - D => GameCtrl
 * - E => HomeScene
 * - f => ScrollView
 * - F => NodePool
 * - g => SpriteFrame
 * - G => UIConfigTable
 * - h => Label
 * - H => itemSpecialNode
 * - I => Component
 * - k => Vec3
 * - l => cclegacy
 * - L => GameModel
 * - M => UIOpacity
 * - n => inheritsLoose
 * - N => HorizontalTextAlignment
 * - o => initializerDefineProperty
 * - O => itemNode
 * - p => ProgressBar
 * - r => assertThisInitialized
 * - R => AudioManager
 * - s => asyncToGenerator
 * - S => UITransform
 * - t => applyDecoratedDescriptor
 * - T => Tween
 * - u => Node
 * - v => Color
 * - V => duckSpecialType
 * - w => Prefab
 * - x => ResManager
 * - y => Sprite
 */
/**
 * Restored module: chunks:///_virtual/BookPanelView.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints:
 * - _ => tween
 * - a => createForOfIteratorHelperLoose
 * - A => find
 * - b => instantiate
 * - B => director
 * - c => _decorator
 * - C => assetManager
 * - d => Button
 * - D => GameCtrl
 * - E => HomeScene
 * - f => ScrollView
 * - F => NodePool
 * - g => SpriteFrame
 * - G => UIConfigTable
 * - h => Label
 * - H => itemSpecialNode
 * - I => Component
 * - k => Vec3
 * - l => cclegacy
 * - L => GameModel
 * - M => UIOpacity
 * - n => inheritsLoose
 * - N => HorizontalTextAlignment
 * - o => initializerDefineProperty
 * - O => itemNode
 * - p => ProgressBar
 * - r => assertThisInitialized
 * - R => AudioManager
 * - s => asyncToGenerator
 * - S => UITransform
 * - t => applyDecoratedDescriptor
 * - T => Tween
 * - u => Node
 * - v => Color
 * - V => duckSpecialType
 * - w => Prefab
 * - x => ResManager
 * - y => Sprite
 */
System.register("chunks:///_virtual/BookPanelView.ts",["./rollupPluginModLoBabelHelpers.js","cc","./AudioManager.ts","./GameModel2.ts","./ResManager.ts","./GameCtrl.ts","./ConfigTable.ts","./HomeScene.ts","./itemNode.ts","./itemSpecialNode.ts"],(function(e){
var t /* applyDecoratedDescriptor */, n /* inheritsLoose */, o /* initializerDefineProperty */, r /* assertThisInitialized */, a /* createForOfIteratorHelperLoose */, s /* asyncToGenerator */, l /* cclegacy */, c /* _decorator */, u /* Node */, d /* Button */, h /* Label */, p /* ProgressBar */, f /* ScrollView */, g /* SpriteFrame */, m, v /* Color */, y /* Sprite */, _ /* tween */, b /* instantiate */, S /* UITransform */, C /* assetManager */, w /* Prefab */, N /* HorizontalTextAlignment */, k /* Vec3 */, T /* Tween */, B /* director */, A /* find */, P, M /* UIOpacity */, I /* Component */, F /* NodePool */, R /* AudioManager */, L /* GameModel */, x /* ResManager */, D /* GameCtrl */, G /* UIConfigTable */, E /* HomeScene */, O /* itemNode */, H /* itemSpecialNode */, V /* duckSpecialType */;
return{
setters:[function(e){
t=e.applyDecoratedDescriptor /* applyDecoratedDescriptor */,n=e.inheritsLoose /* inheritsLoose */,o=e.initializerDefineProperty /* initializerDefineProperty */,r=e.assertThisInitialized /* assertThisInitialized */,a=e.createForOfIteratorHelperLoose /* createForOfIteratorHelperLoose */,s=e.asyncToGenerator /* asyncToGenerator */}
,function(e){
l=e.cclegacy /* cclegacy */,c=e._decorator /* _decorator */,u=e.Node /* Node */,d=e.Button /* Button */,h=e.Label /* Label */,p=e.ProgressBar /* ProgressBar */,f=e.ScrollView /* ScrollView */,g=e.SpriteFrame /* SpriteFrame */,m=e.v3,v=e.Color /* Color */,y=e.Sprite /* Sprite */,_=e.tween /* tween */,b=e.instantiate /* instantiate */,S=e.UITransform /* UITransform */,C=e.assetManager /* assetManager */,w=e.Prefab /* Prefab */,N=e.HorizontalTextAlignment /* HorizontalTextAlignment */,k=e.Vec3 /* Vec3 */,T=e.Tween /* Tween */,B=e.director /* director */,A=e.find /* find */,P=e.sp,M=e.UIOpacity /* UIOpacity */,I=e.Component /* Component */,F=e.NodePool /* NodePool */}
,function(e){
R=e.AudioManager /* AudioManager */}
,function(e){
L=e.GameModel /* GameModel */}
,function(e){
x=e.ResManager /* ResManager */}
,function(e){
D=e.GameCtrl /* GameCtrl */}
,function(e){
G=e.UIConfigTable /* UIConfigTable */}
,function(e){
E=e.HomeScene /* HomeScene */}
,function(e){
O=e.itemNode /* itemNode */}
,function(e){
H=e.itemSpecialNode /* itemSpecialNode */,V=e.duckSpecialType /* duckSpecialType */}
],execute:function(){
var U,z,W,j,J,Y,q,K,X,Q,Z,$,ee,te,ne,ie,oe,re,ae,se,le,ce,ue,de,he;
l._RF.push({
}
,"c7d43jah7lHiZkrB+u2HFBv","BookPanelView",void 0);
var pe=c.ccclass,fe=c.property,ge=function(e){
return e[e.normalType=0]="normalType",e[e.specialType=1]="specialType",e[e.activityType=2]="activityType",e}
(ge||{
}
);
e("BookPanelView",(U=pe("BookPanelView"),z=fe(u),W=fe(u),j=fe(d),J=fe(h),Y=fe(p),q=fe(f),K=fe(g),X=fe(g),Q=fe(u),Z=fe(u),$=fe([u]),U((ne=t((te=function(e){
function t(){
for(var t,n=arguments.length,i=new Array(n),a=0;
a<n;
a++)i[a]=arguments[a];
return t=e.call.apply(e,[this].concat(i))||this,o(t,"black",ne,r(t)),o(t,"panel",ie,r(t)),o(t,"closeBtn",oe,r(t)),o(t,"collectLabel",re,r(t)),o(t,"collectProgress",ae,r(t)),o(t,"scrollView",se,r(t)),o(t,"itemBg",le,r(t)),o(t,"itemBgGray",ce,r(t)),o(t,"content",ue,r(t)),o(t,"view",de,r(t)),o(t,"typeBtn",he,r(t)),t.bookType=ge.normalType,t.itemPool=null,t.itemPrefab=null,t.headerRoot=null,t.itemRoot=null,t.bookItemLayouts=[],t.activeItemMap=new Map,t.itemWidth=0,t.itemHeight=0,t.contentWidth=0,t.contentHeight=0,t.itemXSpace=25,t.itemYSpace=30,t.listTotalRow=0,t.curStartIndex=1,t.curEndIndex=5,t.norViewPos=m(0,425),t._isActive=!1,t.sectionTitleTopOffset=60,t.sectionTitleToFirstRowOffset=180,t.sectionSpacing=180,t.contentBottomPadding=80,t.visibleItemTopBuffer=120,t.visibleItemBottomBuffer=180,t.sectionTitleWidth=520,t.sectionTitleHeight=42,t.sectionTitleFontSize=40,t.sectionTitleColor=new v(255,255,255,255),t}
n(t,e);
var l=t.prototype;
return l.onLoad=function(){
}
,l.start=function(){
var e=s(i().mark((function e(){
return i().wrap((function(e){
for(;
;
)switch(e.prev=e.next){
case 0:this.black.getComponent(M).opacity=0,this.panel.setScale(1,1,1),this.panel.setPosition(0,L.instance.screenHeight),_(this.black.getComponent(M)).to(.1,{
opacity:220}
).start(),_(this.panel).delay(.1).to(.3,{
position:m(0,0,0)}
,{
easing:"backOut"}
).call((function(){
D.instance.btnCanTouch=!0}
)).start(),this.initTypeBtn(),this.itemPool=new F,this.initNormalBook();
case 1:case"end":return e.stop()}
}
),e,this)}
)));
return function(){
return e.apply(this,arguments)}
}
(),l.initTypeBtn=function(){
for(var e=0;
e<this.typeBtn.length;
e++)this.typeBtn[e].on(u.EventType.TOUCH_START,this.onTouchEvent,this)}
,l.onTouchEvent=function(e){
var t=this.typeBtn.indexOf(e.target);
t!=this.bookType&&(R.instance.playSound("ui/buttonClick"),this.bookType=t,this.changeType())}
,l.changeType=function(){
for(var e=0;
e<this.typeBtn.length;
e++)e==this.bookType?(this.typeBtn[e].getComponent(y).grayscale=!1,_(this.typeBtn[e]).to(.1,{
position:m(this.typeBtn[e].position.x,-15,0)}
).start(),_(this.typeBtn[e].children[0]).to(.1,{
position:m(0,0),scale:m(1,1)}
).start()):(this.typeBtn[e].getComponent(y).grayscale=!0,_(this.typeBtn[e]).to(.1,{
position:m(this.typeBtn[e].position.x,0,0)}
).start(),_(this.typeBtn[e].children[0]).to(.1,{
position:m(0,-15),scale:m(.8,.8)}
).start());
this.initItemPool()}
,l.initItemPool=function(){
this.resetBookRenderState(),this.itemPool.clear(),this.bookType==ge.normalType?this.initNormalBook():this.bookType==ge.specialType?this.initSpecialBook():this.bookType==ge.activityType&&this.initActivityBook()}
,l.initNormalBook=function(){
var e=this;
x.instance.bundleLoad("uiBundle","prefab/item",null,(function(t,n){
if(t)console.error("加载BookUI失败",t);
else{
if(n){
e.itemPrefab=n;
for(var i=0;
i<12;
i++){
var o=b(e.itemPrefab);
o.active=!1,e.itemPool.put(o),e.itemWidth=o.getComponent(S).width,e.itemHeight=o.getComponent(S).height}
}
e.buildBookContentLayout(),e._isActive=!0,e.initView()}
}
))}
,l.initSpecialBook=function(){
var e=this;
x.instance.bundleLoad("uiBundle","prefab/itemSpecial",null,(function(t,n){
if(t)console.error("加载BookUI失败",t);
else{
if(n){
e.itemPrefab=n;
for(var i=0;
i<12;
i++){
var o=b(e.itemPrefab);
o.active=!1,e.itemPool.put(o),e.itemWidth=o.getComponent(S).width,e.itemHeight=o.getComponent(S).height}
}
e.buildBookContentLayout(),e._isActive=!0,e.initView()}
}
))}
,l.initActivityBook=function(){
var e=this;
x.instance.bundleLoad("uiBundle","prefab/itemSpecial",null,(function(t,n){
if(t)console.error("加载BookUI失败",t);
else{
if(n){
e.itemPrefab=n;
for(var i=0;
i<12;
i++){
var o=b(e.itemPrefab);
o.active=!1,e.itemPool.put(o),e.itemWidth=o.getComponent(S).width,e.itemHeight=o.getComponent(S).height}
}
e.buildBookContentLayout(),e._isActive=!0,e.initView()}
}
))}
,l.resetBookRenderState=function(){
this._isActive=!1,this.headerRoot=null,this.itemRoot=null,this.bookItemLayouts=[],this.activeItemMap.clear(),this.content.destroyAllChildren()}
,l.onEnable=function(){
this.registerEvents()}
,l.onDisable=function(){
this.unregisterEvents(),C.getBundle("uiBundle").release(G.BookUI.path,w)}
,l.initView=function(){
this.content.setPosition(m(0,0)),this.updateCollectProgress(),this.renderVisibleItems(!0)}
,l.updateCollectProgress=function(){
var e=this.getCollectTotal(),t=this.clampCollectNum(this.getCollectNum(),e);
this.collectLabel.string=t.toString()+"/"+e,this.collectProgress.progress=e>0?t/e:0}
,l.getCollectTotal=function(){
return this.getBookSections().reduce((function(e,t){
return e+t.itemCount}
),0)}
,l.getCollectNum=function(){
return this.bookType==ge.specialType?this.getSpecialCollectCount():this.bookType==ge.activityType?this.getActivityCollectCount():this.getNormalCollectCount()}
,l.getNormalCollectCount=function(){
var e=2*L.instance.MaxDuckTypeNum;
return L.LockAllDuck?e:(L.instance.level>L.instance.level2?L.instance.level:L.instance.level2)-2}
,l.getSpecialCollectCount=function(){
var e=L.SpecialBookNum+L.FruitDuckBookNum+L.DaWeiWangBookNum;
if(L.LockAllDuck)return e;
for(var t=0,n=1;
n<=L.FruitDuckBookNum;
n++)L.instance.level2>100*n+1&&t++;
for(var i=1;
i<=L.SpecialBookNum;
i++)L.instance.level>100*(i+1)+1&&t++;
return t}
,l.getActivityCollectCount=function(){
return L.instance.shareLevel}
,l.clampCollectNum=function(e,t){
return e<0?0:e>t?t:e}
,l.getBookSections=function(){
return this.bookType==ge.normalType?[{
title:"全部",kind:"normal",itemCount:2*L.instance.MaxDuckTypeNum,showTitle:!1}
]:this.bookType==ge.specialType?[{
title:"水果鸭",kind:"fruit",itemCount:L.FruitDuckBookNum,showTitle:!0}
,{
title:"大胃袋鸭",kind:"daWeiWang",itemCount:L.DaWeiWangBookNum,showTitle:!0}
,{
title:"主线",kind:"special",itemCount:L.SpecialBookNum,showTitle:!0}
]:[{
title:"分享鸭",kind:"share",itemCount:L.SanGuoBookNum,showTitle:!0}
]}
,l.buildBookContentLayout=function(){
this.createContentLayers();
for(var e,t=this.getBookSections(),n=this.getItemRowStep(),i=1,o=0,r=this.getViewHeight(),s=a(t);
!(e=s()).done;
){
var l=e.value,c=Math.ceil(l.itemCount/3),u=!1!==l.showTitle;
u&&this.createSectionTitleNode(l.title,-(o+this.sectionTitleTopOffset));
for(var d=u?o+this.sectionTitleTopOffset+this.sectionTitleToFirstRowOffset:o+this.sectionTitleToFirstRowOffset,h=1;
h<=l.itemCount;
h++){
var p=Math.floor((h-1)/3),f=(h-1)%3;
this.bookItemLayouts.push({
listIndex:i,localId:h,kind:l.kind,position:m(this.getItemColumnX(f),-(d+p*n),0)}
),i++}
var g=d+Math.max(0,c-1)*n;
r=Math.max(r,g+this.itemHeight/2+this.contentBottomPadding),o=g+this.sectionSpacing}
this.contentHeight=r,this.content.getComponent(S).height=this.contentHeight}
,l.createContentLayers=function(){
this.headerRoot=new u("headerRoot"),this.itemRoot=new u("itemRoot"),this.content.addChild(this.headerRoot),this.content.addChild(this.itemRoot)}
,l.createSectionTitleNode=function(e,t){
var n=new u(e+"SectionTitle");
n.addComponent(S).setContentSize(this.sectionTitleWidth,this.sectionTitleHeight),n.setPosition(m(0,t,0)),n.layer=1<<25;
var i=n.addComponent(h);
i.string=this.formatSectionTitle(e),i.fontSize=this.sectionTitleFontSize,i.lineHeight=this.sectionTitleHeight,i.horizontalAlign=N.CENTER,i.color=this.sectionTitleColor,i.isBold=!0,i.enableOutline=!0,i.outlineColor=new v(0,0,0,255),i.outlineWidth=5,this.headerRoot.addChild(n)}
,l.formatSectionTitle=function(e){
return"———— "+e+" ————"}
,l.getItemRowStep=function(){
return this.itemHeight+this.itemYSpace}
,l.getItemColumnX=function(e){
return 0==e?-this.itemWidth-this.itemXSpace:2==e?this.itemWidth+this.itemXSpace:0}
,l.getViewHeight=function(){
return this.view.getComponent(S).height}
,l.getBookItemLayout=function(e){
return this.bookItemLayouts[e-1]||null}
,l.getVisibleBookItemLayouts=function(){
var e=this.getViewHeight(),t=-this.content.position.y+this.visibleItemTopBuffer,n=-this.content.position.y-e-this.visibleItemBottomBuffer;
return this.bookItemLayouts.filter((function(e){
return e.position.y<=t&&e.position.y>=n}
))}
,l.renderVisibleItems=function(e){
for(var t,n=this,i=this.getVisibleBookItemLayouts(),o=new Set,r=0,s=a(i);
!(t=s()).done;
){
var l=t.value;
o.add(l.listIndex);
var c=this.activeItemMap.get(l.listIndex);
c||((c=this.createOrReuseItemNode()).setParent(this.itemRoot),this.initItem(c,l.listIndex,e?.08*r:-1),this.activeItemMap.set(l.listIndex,c)),c.setSiblingIndex(r),r++}
var u=[];
this.activeItemMap.forEach((function(e,t){
o.has(t)||(n.hideItemNode(e),n.itemPool.put(e),u.push(t))}
));
for(var d=0,h=u;
d<h.length;
d++){
var p=h[d];
this.activeItemMap.delete(p)}
}
,l.createOrReuseItemNode=function(){
if(this.itemPool.size()>0){
var e=this.itemPool.get();
return e.active=!0,e}
return b(this.itemPrefab)}
,l.initItem=function(e,t,n){
var i=this.getBookItemLayout(t);
i?(e.active=!0,e.setPosition(i.position),e.setScale(k.ZERO),this.initItemNode(e,i,n)):e.active=!1}
,l.initItemNode=function(e,t,n){
if(-1==n&&(n=0),_(e).delay(n).to(.2,{
scale:k.ONE}
).to(.1,{
scale:m(1.1,.9,1)}
).to(.1,{
scale:k.ONE}
).start(),"normal"==t.kind)e.getComponent(O).id=t.localId,e.getComponent(O).initItem(),(t.localId+1<L.instance.level||t.localId+1<L.instance.level2||L.LockAllDuck)&&e.on(u.EventType.TOUCH_END,this.onClickItem,this);
else if("fruit"==t.kind){
e.getComponent(H).id=t.localId,e.getComponent(H).initSpecialFruitItem();
var i=100*t.localId+1;
(L.instance.level2>i||L.LockAllDuck)&&e.on(u.EventType.TOUCH_END,this.onClickFruitItem,this)}
else if("daWeiWang"==t.kind){
e.getComponent(H).id=t.localId,e.getComponent(H).initDWWItem();
var o=100*t.localId+1;
(L.instance.level3>o||L.LockAllDuck)&&e.on(u.EventType.TOUCH_END,this.onClickDWWItem,this)}
else"special"==t.kind?(e.getComponent(H).id=t.localId,e.getComponent(H).initSpecialItem()):"share"==t.kind&&(e.getComponent(H).id=t.localId,e.getComponent(H).initShareItem(),(L.instance.shareLevel>=t.localId||L.LockAllDuck)&&e.on(u.EventType.TOUCH_END,this.onClickShareItem,this))}
,l.hideItemNode=function(e){
this.bookType==ge.normalType?e.getComponent(O).hide():e.getComponent(H).hide(),T.stopAllByTarget(e),e.setScale(k.ZERO),e.active=!1,e.off(u.EventType.TOUCH_END,this.onClickItem,this),e.off(u.EventType.TOUCH_END,this.onClickFruitItem,this),e.off(u.EventType.TOUCH_END,this.onClickShareItem,this)}
,l.update=function(e){
this.updateItemNode()}
,l.updateItemNode=function(){
this._isActive&&this.renderVisibleItems(!1)}
,l.onClickItem=function(e){
if(B.getScene().name==L.instance.HomeSceneName){
R.instance.playSound("ui/buttonClick");
var t=this.itemRoot,n=e.target.getComponent(O).id-1,i=n;
n>99?(n-=100,A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).animation="walk4"):A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).animation="walk3",L.instance.duckName=L.cockNameArr[i];
var o="y"+(n+1).toString();
this.changeDuckSkin(o);
for(var r=0;
r<t.children.length;
r++){
var a=t.children[r],s=a.getChildByName("useTip"),l=a.getChildByName("useLight");
a.getComponent(O).id==e.target.getComponent(O).id?(s.active=!0,l.active=!0):(s.active=!1,l.active=!1)}
}
}
,l.onClickFruitItem=function(e){
if(B.getScene().name==L.instance.HomeSceneName){
R.instance.playSound("ui/buttonClick");
var t=this.itemRoot,n=e.target.getComponent(H).id-1;
A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).animation="walk3",L.instance.duckName=L.FruitNameArr[n];
var i="f"+(n+1).toString();
this.changeDuckSkin(i);
for(var o=0;
o<t.children.length;
o++){
var r=t.children[o],a=r.getChildByName("useTip"),s=r.getChildByName("useLight");
r.getComponent(H).id==e.target.getComponent(H).id&&r.getComponent(H).duckClass==V.fruit?(a.active=!0,s.active=!0):(a.active=!1,s.active=!1)}
}
}
,l.onClickDWWItem=function(e){
if(B.getScene().name==L.instance.HomeSceneName){
R.instance.playSound("ui/buttonClick");
var t=this.itemRoot,n=e.target.getComponent(H).id-1;
A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).animation="walk3",L.instance.duckName=L.DaWeiWangNameArr[n];
var i="w"+(n+1).toString();
this.changeDuckSkin(i);
for(var o=0;
o<t.children.length;
o++){
var r=t.children[o],a=r.getChildByName("useTip"),s=r.getChildByName("useLight");
r.getComponent(H).id==e.target.getComponent(H).id&&r.getComponent(H).duckClass==V.DWW?(a.active=!0,s.active=!0):(a.active=!1,s.active=!1)}
}
}
,l.onClickShareItem=function(e){
if(B.getScene().name==L.instance.HomeSceneName){
R.instance.playSound("ui/buttonClick");
var t=this.itemRoot,n=e.target.getComponent(H).id-1;
A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).animation="walk3",L.instance.duckName=L.SanGuoNameArr[n];
var i="p"+(n+1).toString();
this.changeDuckSkin(i);
for(var o=0;
o<t.children.length;
o++){
var r=t.children[o],a=r.getChildByName("useTip"),s=r.getChildByName("useLight");
r.getComponent(H).id==e.target.getComponent(H).id&&r.getComponent(H).duckClass==V.share?(a.active=!0,s.active=!0):(a.active=!1,s.active=!1)}
}
}
,l.changeDuckSkin=function(e){
A("Canvas/homeBg/duck/circle/ani").getComponent(P.Skeleton).setSkin(e);
for(var t=A("Canvas").getComponent(E).colorBg.getChildByName("danceDuck"),n=0;
n<t.children.length;
n++){
var i=e;
t.children[n].getComponent(P.Skeleton).setSkin(i)}
}
,l.registerEvents=function(){
this.closeBtn.node.on("click",this.onClose,this)}
,l.unregisterEvents=function(){
this.closeBtn.node.off("click",this.onClose,this)}
,l.onClose=function(){
var e=this;
D.instance.btnCanTouch&&(D.instance.btnCanTouch=!1,R.instance.playSound("ui/buttonClick"),_(this.panel).to(.3,{
position:m(0,L.instance.screenHeight,0)}
,{
easing:"backIn"}
).start(),_(this.black.getComponent(M)).delay(.3).to(.1,{
opacity:0}
).call((function(){
e.node.destroy(),D.instance.btnCanTouch=!0}
)).start())}
,t}
(I)).prototype,"black",[z],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),ie=t(te.prototype,"panel",[W],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),oe=t(te.prototype,"closeBtn",[j],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),re=t(te.prototype,"collectLabel",[J],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),ae=t(te.prototype,"collectProgress",[Y],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),se=t(te.prototype,"scrollView",[q],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),le=t(te.prototype,"itemBg",[K],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),ce=t(te.prototype,"itemBgGray",[X],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),ue=t(te.prototype,"content",[Q],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),de=t(te.prototype,"view",[Z],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return null}
}
),he=t(te.prototype,"typeBtn",[$],{
configurable:!0,enumerable:!0,writable:!0,initializer:function(){
return[]}
}
),ee=te))||ee)),l._RF.pop()}
}
}
))

