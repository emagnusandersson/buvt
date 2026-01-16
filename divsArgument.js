

"use strict"

//////////////////////////////////////////////////////////
// 
//////////////////////////////////////////////////////////

var boTouch=false
if(boTouch){  var strStartEv='touchstart', strMoveEv='touchmove', strEndEv='touchend'; }
else{   var strStartEv='mousedown', strMoveEv='mousemove', strEndEv='mouseup';    }


gThis.draggableTabExtend=function(el, divScrollableContainer, mouseUpCB){
  var movedRow, iStart, scrollTimer=null, yMouse=null
  var funRearranger=function(){
    var y=yMouse
    var iCur=movedRow.myIndex();
    var hCur=movedRow.offsetHeight, yMouseOff=y-hCur/2;
    var tBody=el.children[1]
    var len=tBody.childElementCount, boMoved=false

    if(iCur>0) {  //Check if previous is better
      var rowT=movedRow.previousElementSibling;
      var yPrevOff=rowT.getBoundingClientRect().top;
      var hPrev=rowT.offsetHeight;
      if(y<yPrevOff+hPrev/2) { rowT.insertAdjacentElement('beforebegin', movedRow); boMoved=true }
    }
    if(!boMoved && iCur<len-1) { //Check if next is better
      var rowT=movedRow.nextElementSibling;
      var yNextOff=rowT.getBoundingClientRect().top;
      var hNext=rowT.offsetHeight;
      if(y>yNextOff+hNext/2) { rowT.insertAdjacentElement('afterend', movedRow); }
    }
    var yCurOff=movedRow.getBoundingClientRect().top
    var strYTrans=movedRow.style.transform; strYTrans=strYTrans.slice(11,-3); var yTrans=Number(strYTrans)
    var yCurOrgOff=yCurOff-yTrans
    movedRow.css({'transform':'translateY('+(yMouseOff-yCurOrgOff)+'px)'});
  }
  el.myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
      // Set yMouse
    if(boTouch) {e.preventDefault(); e.stopPropagation(); yMouse=e.changedTouches[0].pageY;}
    else {yMouse=e.clientY;}

    movedRow=this.parentNode.parentNode;
    iStart=getNodeIndex(movedRow);
    movedRow.css({position:'relative', opacity:0.55, 'z-index':'1'});  
    document.on(strMoveEv, myMousemove, {passive: false}); document.on(strEndEv, myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
    //setMess('Down');
    scrollTimer=setInterval(scrollTimerCb,50)
  } 
  var myMouseup= function(e){ 
    movedRow.css({'transform':'translateY(0px)',opacity:1,'z-index':'auto'});
    document.off(strMoveEv, myMousemove); document.off(strEndEv, myMouseup);
    mouseUpCB()
    clearInterval(scrollTimer)
  }
  var myMousemove= function(e){
    if(boTouch) {e.preventDefault(); e.stopPropagation(); yMouse=e.changedTouches[0].pageY;}
    else {yMouse=e.clientY;}
    funRearranger()
  }
  var scrollTimerCb=function(){
    var y=yMouse, yZone=10, yStep=10
    if(y<yZone) {divScrollableContainer.scrollTop-=yStep;}
    else if(y>divScrollableContainer.offsetHeight-yZone) {divScrollableContainer.scrollTop+=yStep;}
    funRearranger()
  }
  return el
}

const eventObjOptNonStatisticDataChanged = new Event("eventObjOptNonStatisticDataChanged");

gThis.getSelectedFrFile=async function(){
  var [err, ObjOptRelation, iSelected]=await relationTab.getDataFrFile();  if(err) {debugger; return [err];}
  var objOptRelation=ObjOptRelation[iSelected], {idSource, idTarget}=objOptRelation;
  //if(keySource.length==0 || keyTarget.length==0) {debugger; return [Error("keySource.length==0 || keyTarget.length==0")];}
  if(idSource==idTarget) {debugger; return [Error("idSource==idTarget")];}

  var [err, ObjOptLocation]=await locationTab.getDataFrFile();  if(err) {debugger; return [err];}
  var objOptSource, objOptTarget;
  for(var i=0;i<ObjOptLocation.length;i++){
    var objOptLocation=ObjOptLocation[i], {id}=objOptLocation;
    if(id==idSource) objOptSource=extend({}, objOptLocation); // Must create a new one since objOptLocation points into cache
    if(id==idTarget) objOptTarget=extend({}, objOptLocation); // -"-
  }
  if(typeof objOptSource=='undefined') {debugger; return [Error("typeof objOptSource=='undefined'")];}
  if(typeof objOptTarget=='undefined') {debugger; return [Error("typeof objOptTarget=='undefined'")];}


    // FleSSub, FleTSub
  var FleSSub=[], FleTSub=[]
  for(var i=0;i<ObjOptRelation.length;i++){
    var objOptRelationTmp=ObjOptRelation[i], {idTarget:idTargetTmp, flTargetDataDir}=objOptRelationTmp;
    var flTargetDataDir=trim(flTargetDataDir, charF)+charF
    if(idTargetTmp==idSource) FleSSub.push(flTargetDataDir)
    if(idTargetTmp==idTarget) FleTSub.push(flTargetDataDir)
  }

    // fiTargetDataDir
  var {flTargetDataDir}=objOptRelation, {fiDir:fiTargetDbDir}=objOptTarget;
  var fiTargetDataDir=flTargetDataDir.length?fiTargetDbDir+charF+flTargetDataDir:fiTargetDbDir

  var {label:labelSource}=objOptSource;
  var {label:labelTarget}=objOptTarget;
  

    // Relation
  //propDefault:{boSelected:false, idSource:0, idTarget:0, labelSource:"", labelTarget:"", flTargetDataDir:'', suffixFilterFirstT2T:'', tLastSync:0}, 
    // Location
  //propDefault:{id:0, label:'', fiDir:'', strHost:'', charTRes:'9', tLastSync:0, tLastCheck:0, charFilterMethod:"b", boAllowsLinks:true, boAllowsCaseCollision:true, strCharSet:'ext4'}, 


  var {charFilterMethod}=objOptSource;
  var leafFilter=LeafFilter[charFilterMethod]; extend(objOptSource, {leafFilter});
  var {charFilterMethod}=objOptTarget;
  var leafFilter=LeafFilter[charFilterMethod]; extend(objOptTarget, {leafFilter});

  var objOptExtended=copySome({}, objOptRelation, ["idSource", "idTarget", "labelSource", "labelTarget", "flTargetDataDir", "suffixFilterFirstT2T"])
  //copySomeRename(objOptExtended, objOptRelation, ["tLastSyncCopy"], ["tLastSync"])
  copySomeRename(objOptExtended, objOptSource, ["fiSourceDir"], ["fiDir"])
  copySomeRename(objOptExtended, objOptTarget, ["fiTargetDbDir", "strHostTarget"], ["fiDir", "strHost"])
    // Note!!  fiTargetDbDir should probably be renamed to fiTargetDir (or fiSourceDir to fiSourceDbDir) to be consistent.
  extend(objOptExtended, {objOptSource, objOptTarget, FleSSub, FleTSub, fiTargetDataDir, labelSource, labelTarget})

  var {strHostTarget}=objOptExtended
  if(!strHostTarget) strHostTarget="localhost";   var boRemoteTarget=strHostTarget!="localhost"
  extend(objOptExtended, {boRemoteTarget, strHostTarget})
  return [null, objOptExtended];
}
gThis.calcExtraData=async function(arg){ // Extra calculations, caclulating fs from fi
    // , charSide
  var {objOptSource, objOptTarget, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir}=arg;

  var {fiDir, strHost, charFilterMethod}=objOptSource
  var [err, fsDir]=await myRealPath(fiDir, strHost); if(err) {debugger; return [err];}
  extend(objOptSource, {fsDir, fsDbDir:fsDir})
  var fsSourceDir=fsDir

  var {fiDir, strHost, charFilterMethod}=objOptTarget
  var [err, fsDir]=await myRealPath(fiDir, strHost); if(err) {debugger; return [err];}
  extend(objOptTarget, {fsDir, fsDbDir:fsDir})
  var fsTargetDbDir=fsDir

  if(flTargetDataDir) {var fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir, fleTargetDataDir=flTargetDataDir+charF;}
  else {var fsTargetDataDir=fsTargetDbDir, fleTargetDataDir=""; }
  var fsSourceDb=fsSourceDir+charF+settings.leafDb,  fsTargetDb=fsTargetDbDir+charF+settings.leafDb


  extend(objOptSource, {fsDataDir:fsSourceDir, fsDb:fsSourceDb, charSide:'S', boTarget:false})
  extend(objOptTarget, {fsDataDir:fsTargetDataDir, fsDb:fsTargetDb, charSide:'T', boTarget:true})


  var argExtra={fsSourceDir, fsTargetDbDir, fsTargetDataDir, fsSourceDb, fsTargetDb, fleTargetDataDir}

  return [null, argExtra];
}
gThis.getSelectedFrFileWExtra=async function(){
  var [err, argGeneral]=await getSelectedFrFile(); if(err) {debugger; return [err];}

  //var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charTResS, charTResT}=argGeneral
  var [err, argGeneralExtra]=await calcExtraData(argGeneral); if(err) {debugger; return [err];}
  extend(argGeneral, argGeneralExtra)
  return [null, argGeneral]
}