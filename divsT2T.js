"use strict"


// Create ObjByHash
  // Marking
// nUnchanged
// boCopyToTarget
// nDelete

// nCopyOnTarget
// nMoveOnTarget

// Copy of ObjByHash

  // Create result files
// copyToTarget
// copyOnTarget
// moveOnTarget




gThis.divTabT2TUsingHashCreator=function(el){
  var self=el
  el.clearVal=function(){
    //butDeleteNWriteRam.disable();
    butDeleteNWrite.disable()
    var title=undefined;
    aCategoryDelete.myText('-').prop({title});  aCopyOnTarget1.myText('-').prop({title})
    aMoveOnTarget.myText('-').prop({title});  aMoveOnTarget.myText('-').prop({title});  aMoveOnTargetNSetMTime.myText('-').prop({title}); aCategorySetMTime.myText('-').prop({title});
    aCopyToTarget.myText('-').prop({title});  aCopyOnTarget2.myText('-').prop({title});
    spanUnchanged.myText('-');
    
  }
  // nCopyToTarget, nCopyOnTarget2, nCopyOnTarget1, nMoveOnTarget, nDelete, nUnchanged
  el.setVal=function(syncT2T){
    this.syncT2T=syncT2T;

    //var {StrHov, objN, nExactTot}=syncT2T
    var {ObjFeedback, nExactTot, boChanged}=syncT2T
    var Key=['categoryDelete', 'copyOnTarget1', 'moveOnTarget', 'moveOnTargetNSetMTime', 'categorySetMTime', 'copyToTarget', 'copyOnTarget2']

    var But= {categoryDelete:aCategoryDelete, copyOnTarget1:aCopyOnTarget1, moveOnTarget:aMoveOnTarget, moveOnTargetNSetMTime:aMoveOnTargetNSetMTime, categorySetMTime:aCategorySetMTime, copyToTarget:aCopyToTarget, copyOnTarget2:aCopyOnTarget2}

    for(var key of Key){
      var objFeedback=ObjFeedback['obj'+ucfirst(key)];
      var {strHov, nFile, nS, nT}=objFeedback
      var but=But[key];
      var n=nFile??nT
      but.myText(n).prop({title:strHov});
    }

    butDeleteNWrite.enable(boChanged)
    spanUnchanged.myText(nExactTot);
  }

  // nCopyToTarget, nCopyOnTarget2, nCopyOnTarget1, nMoveOnTarget, nDelete, nUnchanged
  var htmlHead=`
<tr><th></th> <th>n</th></tr>`

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>Deleted</th><td><a href="">-</a></td></tr>
<tr><th title="Copy files that already exists on the target">CopyOnTarget1</th><td><a href="">-</a></td></tr>
<tr><th title="Rename files">MoveOnTarget</th><td><a href="">-</a></td></tr>
<tr><th title="Rename files + set new mod-time">MoveOnTargetNSetMTime</th><td><a href="">-</a></td></tr>
<tr><th title="Set new mod-time">SetMTime</th><td><a href="">-</a></td></tr>
<tr><th>CopyToTarget</th><td><a href="">-</a></td></tr>
<tr><th title="Copy files from CopyToTarget">CopyOnTarget2</th><td><a href="">-</a></td></tr>
<tr><th>Unchanged</th><td><span>-</span></td></tr>
<tr><td></td><td> <button>Do actions</button></td></tr>`
//<button>Delete</button> <button>Create</button>   <br/>(read fr files)
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA]=tHead.children
  var [,thN]=tHeadRA.children; thN.css({'text-align':'right'})
  var arrTR=[...tBody.children]
  var [trCategoryDelete, trCopyOnTarget1, trMoveOnTarget, trMoveOnTargetNSetMTime, trCategorySetMTime, trCopyToTarget, trCopyOnTarget2, trUnchanged, trDeleteNWrite]=arrTR; //trMat1, 

  arrTR.forEach(ele=>ele.children[1]?.css({'text-align':'right'})); 
  
  var [aCategoryDelete]=trCategoryDelete.querySelectorAll('a')
  var [aCopyOnTarget1]=trCopyOnTarget1.querySelectorAll('a')
  var [aMoveOnTarget]=trMoveOnTarget.querySelectorAll('a')
  var [aMoveOnTargetNSetMTime]=trMoveOnTargetNSetMTime.querySelectorAll('a')
  var [aCategorySetMTime]=trCategorySetMTime.querySelectorAll('a')
  var [aCopyToTarget]=trCopyToTarget.querySelectorAll('a')
  var [aCopyOnTarget2]=trCopyOnTarget2.querySelectorAll('a')
  var [spanUnchanged]=trUnchanged.querySelectorAll('a,span')
  var [butDeleteNWrite]=trDeleteNWrite.querySelectorAll('button'); 

  aCategoryDelete.on('click', makeOpenExtCB(PathT2T.categoryDelete))
  aCopyOnTarget1.on('click', makeOpenExtCB(PathT2T.copyOnTarget1))
  aMoveOnTarget.on('click', makeOpenExtCB(PathT2T.moveOnTarget))
  aMoveOnTargetNSetMTime.on('click', makeOpenExtCB(PathT2T.moveOnTargetNSetMTime))
  aCategorySetMTime.on('click', makeOpenExtCB(PathT2T.categorySetMTime))
  aCopyToTarget.on('click', makeOpenExtCB(PathT2T.copyToTarget))
  aCopyOnTarget2.on('click', makeOpenExtCB(PathT2T.copyOnTarget2))


  butDeleteNWrite.css({'text-wrap':'pretty'}).on('click', async function(){
    this.disable()
    setMess('DeleteNWrite: Making changes...'); blanket.show();
    var [err]=await self.syncT2T.makeChanges();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var strMess='DeleteNWrite: Done'; setMess(strMess); myConsole.printNL(strMess)
    var [err]=await argumentTab.setTLastSync();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    blanket.hide();
  })

  el.myAppend(table);  //, butSetLastSync
  return el
}

/***********************************************
 *   divT2TUsingHashCreator
 **********************************************/
gThis.divT2TUsingHashCreator=function(el){

  el.setUp=function(){
  }

  el.clearVal=function(){
    divFolderInfo.clearVal()
    divConflict.clearVal()
    divMat1.clearVal();
    divTab.clearVal()
  }
  el.setVal=function(syncT2T){
    var {Mat1}=syncT2T;
    divFolderInfo.setVal(syncT2T)
    divConflict.setVal(syncT2T)
    divMat1.setVal(Mat1)
    divTab.setVal(syncT2T)
  }

  var funT2T=async function(){
    //try{
    //var boSync=this===butSyncT2T
    var boSync=false
    var strMess=`Compare T2T ...`
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show();
    var [err, argGeneral]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {charTResS, charTResT, charFilterMethod, suffixFilterFirstT2T}=argGeneral
    //var [err, argGeneralExtra]=await argumentTab.calcExtraData(argGeneral); if(err) {debugger; return [err];}
    //var {ArgSide}=argGeneralExtra
    //extend(argGeneral, argGeneralExtra)


    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirst=leafFilter+suffixFilterFirstT2T

    var [err]=await funFilterFirstCheckExistance(argGeneral); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var charTRes=IntTDiv[charTResS]>IntTDiv[charTResT]?charTResS:charTResT
    
    var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir}=argGeneral
    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }

    var arg={fsSourceDir, fsTargetDbDir, flTargetDataDir, leafFilter, leafFilterFirst, charTRes, charFilterMethod};
    copySome(arg, argGeneral, ["strHostTarget", "boAllowLinks", "boAllowCaseCollision", "strTargetCharSet"])
    var syncT2T=new SyncT2TUsingHash(arg);
    var [err]=await syncT2T.compare();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }

    //syncT2T.format(settings.leafDb)
    var [err]=await syncT2T.writeToFile();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }

    el.setVal(syncT2T)
    if(!syncT2T.boChanged){
      var [err]=await argumentTab.setTLastSync();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    }

    var strMess=`Compare tree to tree: Done`
    setMess(strMess); blanket.hide();
    //}catch(e){debugger }
  }

  var butCompareT2T=createElement('button').myAppend('Compare').on('click', funT2T);

  el.linkFilterFirstT2T=createElement('a').myText('filterFirst').prop({href:""}).on('click', methGoToTitle);

  var hT2T=createElement('b').myText('S to T');
  var divSpace=createElement('div').css({flex:'1'});
  var divButton=createElement('div').myAppend(hT2T, butCompareT2T, el.linkFilterFirstT2T).css({display:'flex', 'align-items':'center', 'column-gap':'3px', background:'var(--bg-color)', flex:"0 1", border:"solid 1px", 'flex-wrap':'wrap', position:'sticky', top:0}); //, butWriteMTimeOnSource , butSyncT2T, butSyncT2TBrutal , opacity:0.8

  var divFolderInfo=divFolderInfoCreator(createElement('div'), makeOpenExtCB(PathT2T.createdF), makeOpenExtCB(PathT2T.deletedF))
  var divConflict=divConflictCreator(createElement('div'), makeOpenExtCB(PathT2T.link), makeOpenExtCB(PathT2T.caseCollision), makeOpenExtCB(PathT2T.reservedChar), makeOpenExtCB(PathT2T.reservedCharF))
  

  var divMat1=createElement('div').myHtml(`SM-Combos: `).hide();
  divSMMatchCreator(divMat1, makeOpenExtCB(PathT2T.STMatch1_02), null, makeOpenExtCB(PathT2T.STMatch1_12), makeOpenExtCB(PathT2T.STMatch1_20), makeOpenExtCB(PathT2T.STMatch1_21), makeOpenExtCB(PathT2T.STMatch1_22));
  
  var divTab=divTabT2TUsingHashCreator(createElement('div'))
  el.myAppend(divButton, divFolderInfo, divConflict, divTab); // divConsoleT2D, divConsoleT2T, divConsole, divMat1

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%"}); //, height:"100%"
  return el
}

