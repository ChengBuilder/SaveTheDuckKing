/**
 * Restored module: chunks:///_virtual/TooYueManager.ts
 * Source: game.js -> assets/start-scene/index.start-scene.js
 * NOTE: this file is for readability/deobfuscation tracking only.
 * Alias hints: (none detected)
 */
System.register("chunks:///_virtual/TooYueManager.ts",[],(function(e){
  return{
    execute:function(){
      var t=function(){
        function e(){
          this.templateId=[],this.templateId_2=[],this.isNeedReportStage=!1,this.shareTimesDay=0,this.shareGift=0}
        var t=e.prototype;
        return t.initTooYue=function(){
        }
        ,t.loginTooYue=function(){
          return Promise.resolve({
            userTags:[],shortId:"",shareUserCount:50}
          )}
        ,t.showVideoAd=function(e,t,n){
          return t&&t({
            isEnded:!0}
          ),Promise.resolve({
            isEnded:!0}
          )}
        ,t.showInterstitialAd=function(){
        }
        ,t.shareApp=function(e,t,n,i){
          return n&&n(),Promise.resolve(null)}
        ,t.onShareAppMessage=function(){
        }
        ,t.onShareTimeline=function(){
        }
        ,t.getRecordState=function(){
          return null}
        ,t.startRecordVideo=function(){
        }
        ,t.stopRecordVideo=function(){
          return Promise.resolve(null)}
        ,t.stopAndShareRecord=function(){
          return Promise.resolve(null)}
        ,t.TrackEvent=function(){
        }
        ,t.reportStage=function(){
        }
        ,t.checkFeedBack=function(){
          this.isNeedReportStage=!1}
        ,t.feedBackMessage=function(){
          return Promise.resolve(null)}
        ,t.getUserStorage=function(){
          return Promise.resolve({
            exists:!1,data:{
            }
          }
          )}
        ,t.setUserStorageDefault=function(){
          return Promise.resolve(!0)}
        ,t.setUserStorage=function(){
          return Promise.resolve(null)}
        ,t.checkSidebarStatus=function(){
          return Promise.resolve({
            isShowEntry:!1,isShowGiftBagBtn:!1,isShowNavigateBtn:!1,isFromSideBar:!1}
          )}
        ,t.navigateToSideBar=function(){
          return Promise.resolve(null)}
        ,t.onSideBarStateChange=function(){
        }
        ,t.receiveSideBarReward=function(){
          return Promise.resolve(null)}
        ,t.checkAddDesktopState=function(){
          return Promise.resolve({
            exist:!1,needUpdate:!1}
          )}
        ,t.addDesktop=function(e,t){
          return e&&e(),Promise.resolve(null)}
        ,t.SubscribeMessage=function(){
          return Promise.resolve(null)}
        ,t.checkSubscribeMessage=function(){
          return Promise.resolve(!1)}
        ,t.judgeIsFromFeed=function(){
          return!1}
        ,t.judgeIsFromWhichFeedOrSubscribe=function(){
          return 0}
        ,t.judgeIsFromSubscribe=function(){
          return!1}
        ,t.getDynamicConfig=function(){
          return Promise.resolve(null)}
        ,e}
      ();
      t._instance=new t,t.shortId="",t.userMsg={
        userTags:[],shortId:"",shareUserCount:50}
      ,t.subscribeMessage=!1,t.feedSubscribeStatus=!1,t.startGameScene=null,t.shareUserCount=50,t.isFromFeed=!1,t.isFollowAweme=!1,t.isFromSubscribe=!1,t.sub_Content_id="",t.sub_Content_id_ZGBJD="",t.sub_Next_Content_id_1="",t.sub_Next_Content_id_2="",t.sub_Next_Content_id_3="",t.sub_Next_Content_id_4="",t.sub_Next_Content_id_5="",t.sub_Next_Content_id_6="",t.sub_Next_Content_id_ZGBJD="",Object.defineProperty(t,"_ins",{
        get:function(){
          return this._instance}
      }
      ),e("TooYueManager",t)}
  }
}
))
