"use strict"




gThis.divT2DTabCreator=function(el, charSide){
  var self=el
  el.clearVal=function(){
    //butDoAction.disable()
    divAreaCatPrim2.clearVal()
    var title=undefined
    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    //aRenamed.myText('-').prop({title});  spanRenamedAction.myText('-')
    a1T1.myText('-').prop({title});  span1T1Action.myText('-')
    aMult.myText('-').prop({title});
    spanMultActionC.myText('-'); spanMultActionD.myText('-');
    aCreatedProt.myText('-').prop({title}); aDeletedProt.myText('-').prop({title});
    aCreated.myText('-').prop({title}); aDeleted.myText('-').prop({title});
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumTree.myText('-');  spanSumDb.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
    aChanged.myText('-').prop({title});  spanChangedAction.myText('-')
  }
  el.setVal=function(syncDb){

    var {catPrim2, ObjFeedback}=syncDb; //, arrTrPrim2Mult, arrDbPrim2Mult catPrim1, 

    var {objSTMatch2, objTree, objDb, objUntouched, objCreateProt, objDeleteProt, objCreate, objDelete, objChange, obj1T1}=ObjFeedback

    var arrTrPrim2Mult=[].concat(catPrim2.arrA[1][2], catPrim2.arrA[2][1], catPrim2.arrA[2][2]);
    var arrDbPrim2Mult=[].concat(catPrim2.arrB[1][2], catPrim2.arrB[2][1], catPrim2.arrB[2][2]);
    //var ArrTrPrim2Mult=[].concat(catPrim2.ArrA[1][2], catPrim2.ArrA[2][1], catPrim2.ArrA[2][2]);
    //var ArrDbPrim2Mult=[].concat(catPrim2.ArrB[1][2], catPrim2.ArrB[2][1], catPrim2.ArrB[2][2]);

    var nCreateProt=objCreateProt.nFile, nDeleteProt=objDeleteProt.nFile, nCreate=objCreate.nFile, nDelete=objDelete.nFile, nChange=objChange.nFile,   nTree=objTree.nFile, nDb=objDb.nFile, nUntouched=objUntouched.nFile,    n1T1=obj1T1.nFile, nTrPrim2Mult=arrTrPrim2Mult.length, nDbPrim2Mult=arrDbPrim2Mult.length

    divAreaCatPrim2.setVal(catPrim2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)

    a1T1.myText(n1T1).prop({title:obj1T1.strHov});
    span1T1Action.myText(n1T1)
    var strT=nTrPrim2Mult+' \\ '+nDbPrim2Mult;
    //aMult.myText(strT).prop({title:formatTitleMult(ArrTrPrim2Mult, ArrDbPrim2Mult)}); 
    aMult.myText(strT).prop({title:objSTMatch2.strHov}); 
    spanMultActionC.myText(nTrPrim2Mult); spanMultActionD.myText(nDbPrim2Mult);


    aCreatedProt.myText(nCreateProt).prop({title:objCreateProt.strHov}); spanCreatedActionProt.myText(nCreateProt);
    aDeletedProt.myText(nDeleteProt).prop({title:objDeleteProt.strHov}); spanDeletedActionProt.myText(nDeleteProt);
    aCreated.myText(nCreate).prop({title:objCreate.strHov}); spanCreatedAction.myText(nCreate);
    aDeleted.myText(nDelete).prop({title:objDelete.strHov}); spanDeletedAction.myText(nDelete);
    aChanged.myText(nChange).prop({title:objChange.strHov}); spanChangedAction.myText(nChange);

    spanSumTree.myText(nTree);  spanSumDb.myText(nDb);

    var nShortCut=nUntouched+n1T1; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nDbPrim2Mult+nDeleteProt, nCreateTmp=nTrPrim2Mult+nCreateProt
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);


    var boAction=Boolean(n1T1+nDeleteTmp+nCreateTmp)
    //butDoAction.enable(boAction)

      // Checking the sums
    var nTrCheck=nShortCut+nTrPrim2Mult+nCreateProt, nDbCheck=nShortCut+nDbPrim2Mult+nDeleteProt
    var boSourceOK=nTree==nTrCheck, boTargetOK=nDb==nDbCheck
    //var boBoth=boSourceOK && boTargetOK
    var strOK="OK", strNOK="NOK" // strOK="OK"; strNOK="✗"
    var strNSourceMatch=boSourceOK?strOK:strNOK,    strNTargetMatch=boTargetOK?strOK:strNOK
    if(!boSourceOK || !boTargetOK){ 
      var strTmp=`!!ERROR the sums does not match with the number of files:\nChecking the sums of the categories: Source: ${nTrCheck} (${strNSourceMatch}), Target: ${nDbCheck} (${strNTargetMatch})`;
      debugger; alert(strTmp)
    }

  }

  var htmlHead=`
<tr><th colspan=2>Matching</th> <th title="Number of files in Tree" rowspan=2>nTree</th> <th title="Number of files in Db" rowspan=2>nDb</th> <th rowspan=2>Cate­gorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short­cut</th> <th>Del­ete</th> <th title="(Re-) Calculate the hashcode for the file ">Calc</th></tr>` // Un­touch­ed / 

  var htmlBody=`
<tr><th>${charOK}</th><th>${charOK}</th> <td colspan=2><span>-</span></td><th>Un­touched</th> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th colspan=8>  <div class=dupEntry>Remaining SM-Combos: </div>  </th></tr>
<tr><th>${charNOK}</th><th>1T1</th> <td colspan=2><a href="">-</a></td><th>Re­named</th>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>${charNOK}</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <th title="Mult: 1Tm + mTm + mT1">Mult</th>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th>-</th><th>${charNOK}</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <th>CreatedProt / DeletedProt</th>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>${charNOK}</th><th>${charNOK}</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <th>Created / Deleted</th>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>${charOK}</th><th>${charNOK}</th> <td colspan=2><a href="">-</a></td> <th>Changed</th>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>


<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <th></th>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>`
//<tr><td colspan=5></td><td colspan=3> <button title="As per the current state of the result-files">Do actions</button></td></tr>
// The pattern exists on both Tr and Db and more than once on at least one of them. <br/>(read fr files)
//<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
//<button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button>
// class=input

//
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody).addClass('redWTitle');
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  var [trUntouched, trCatPrim2, tr1T1, trMult, trCreatedNDeletedProt, trCreatedNDeleted, trChanged, trSum]=arrTR; //, trChanged
  trSum.css({'font-weight':'bold'});
  //trCatPrim2.hide();
  //var arrT=[...trSum.children]; arrT.slice(1,3).forEach(ele=>ele.css({position:"relative"}));
  [...trSum.children].slice(1,3).forEach(ele=>ele.css({position:"relative"}))

  

  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  //var [aRenamed,spanRenamedAction]=trRenamed.querySelectorAll('a,span')
  var [a1T1,span1T1Action]=tr1T1.querySelectorAll('a,span')
  var [aMult,spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [aCreatedProt, aDeletedProt, spanDeletedActionProt, spanCreatedActionProt]=trCreatedNDeletedProt.querySelectorAll('a,span')
  var [aCreated, aDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [aChanged, spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [tdSumTree,tdSumDb,tdSumSC,tdSumDelete,tdSumCreate]=trSum.querySelectorAll('td');
  var [spanSumTree,spanSumDb,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span');
  //var [aChanged,spanChangedAction]=trChanged.querySelectorAll('a,span'); trChanged.hide()
  //var [butDoAction]=trSyncAccordingToFiles.querySelectorAll('button'); 
  //trSyncAccordingToFiles.hide();

  trCreatedNDeletedProt.hide()

  var arrThUntouched=[...trUntouched.querySelectorAll('th')];
  var arrTh1T1=tr1T1.querySelectorAll('th')
  var arrThMult=trMult.querySelectorAll('th');
  var arrThCreatedNDeletedProt=trCreatedNDeletedProt.querySelectorAll('th');
  var arrThCreatedNDeleted=[...trCreatedNDeleted.querySelectorAll('th')];
  var arrThChanged=trChanged.querySelectorAll('th');
  [...arrThUntouched.slice(0,2), arrTh1T1[1], arrThMult[1], arrThChanged[0]].forEach(ele=>ele.css({color:'var(--text-green)'}));
  [arrTh1T1[0], arrThMult[0], arrThCreatedNDeletedProt[1], ...arrThCreatedNDeleted.slice(0,2), arrThChanged[1]].forEach(ele=>ele.css({color:'var(--text-red)'}));


  [tdSumSC, tdSumDelete, tdSumCreate].forEach(ele=>ele.css({backgroundColor:'var(--bg-color)'}));
  [spanSumTree,spanSumDb].forEach(ele=>ele.css({position:'absolute', top:'1px', height:'-webkit-fill-available', backgroundColor:'var(--bg-color)', minWidth:'-webkit-fill-available'}))
  spanSumTree.css({right:'0'}); spanSumDb.css({left:'0'})

  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divAreaCatPrim2]=arrDup;//divAreaCatPrim1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }


  var PathCur=gThis[`Path${charSide}`];

  divAreaCatPrimCreator(divAreaCatPrim2, makeOpenExtCB(PathCur.STMatch2_02), null, makeOpenExtCB(PathCur.STMatch2_12), makeOpenExtCB(PathCur.STMatch2_20), makeOpenExtCB(PathCur.STMatch2_21), makeOpenExtCB(PathCur.STMatch2_22));
  
  //aRenamed.on('click', makeOpenExtCB(PathCur.renamed))
  a1T1.on('click', makeOpenExtCB(PathCur['1T1']))
  aMult.on('click', makeOpenExtCB(PathCur.STMatch2))
  aCreatedProt.on('click', makeOpenExtCB(PathCur.createdProt))
  aDeletedProt.on('click', makeOpenExtCB(PathCur.deletedProt))
  aCreated.on('click', makeOpenExtCB(PathCur.created))
  aDeleted.on('click', makeOpenExtCB(PathCur.deleted))
  aChanged.on('click', makeOpenExtCB(PathCur.changed))
  //aChanged.on('click', makeOpenExtCB(PathCur.changed))

  //butDoAction.parentNode.css({'text-align':'center'})



  el.myAppend(table);   //divCollision
  return el
}




/***********************************************
 *   divT2DBothCreator
 **********************************************/
gThis.divT2DBothCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewT2D';}
  
  el.setUp=function(){
  }


  //el.clearUI=function(){ miniViewRelationFixingS.clearUI(); miniViewRelationFixingT.clearUI(); }
  el.setUIBasedOnSetting=function(arg){
    var ISide=[0,1];
    for(var iSide of ISide){
      ObjT2D[iSide].setUIBasedOnSetting(arg);
    }
  }
  el.clearVal=function(){
    for(var iSide of [0,1]){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      ObjT2D[iSide].clearVal();

      EnumStat[iSide]=EnumStatT.none;
      ObjT2D[iSide].funSetSingleButton(); el.funSetBothButtons();
      arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    }
    argGeneral=undefined;
  }
  // el.setVal=function(objFeedback, iSide){
  //   //var {catPrim1}=objFeedback
  //   //DivCatPrim1[iSide].setVal(catPrim1);
  //   DivTab[iSide].setVal(objFeedback);
  // }
  // el.setValHL=function(objHL, iSide){
  //   DivIdMatch[iSide].setVal(objHL);
  // }
  // el.setValOwnCounter=function(objOwnCounter, iSide){
  //   DivOwnCounter[iSide].setVal(objOwnCounter);
  // }
  // el.setValDbRelationTest=function(obj, iSide){
  //   DivDbRelationTest[iSide].setVal(obj);
  // }

  el.funSetBothButtons=function(){
    var boComparedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.compared);  
    var boHashDoneBoth=EnumStat.every(enumT=>enumT>=EnumStatT.hashed);
    if(boHashDoneBoth) boComparedBoth=false;
    butCalcHash.enable(boComparedBoth);
    butUniquifySM.enable(boHashDoneBoth);
    var boUniquifiedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.unique);
    butWrite.enable(boUniquifiedBoth);
  }
  var funCompareOld=async function(){
    myConsole.clear();  blanket.show(); viewFront.divT2TUsingHash.clearVal(); //el.clearVal();

    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
    argGeneral=argGeneralT
    for(var iSide of [0,1]){
      ObjT2D[iSide].clearVal()
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      var strMess=`Compare tree-2-db on ${strSide}...`; setMess(strMess);

      var arg={charSide, argGeneral}
      var [err, syncDb]=await SyncT2D.fun1Prework(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;};
      var {boCreated, objHL, objOwnCounter, objDb_1MToM_SMHash}=syncDb;
      ObjT2D[iSide].setValHL(objHL); ObjT2D[iSide].setValOwnCounter(objOwnCounter); ObjT2D[iSide].setValDbRelationTest(objDb_1MToM_SMHash);
      
      if(objHL.boHL || !objDb_1MToM_SMHash.boOK) { resetMess(); blanket.hide(); return;};
      ObjT2D[iSide].setVal(syncDb.objCategory); 
      arrSyncDb[iSide]=syncDb;
      SyncT2D.fun1_5CreateNewDb(syncDb);
      //var {boCreated}=syncDb; //BoCompared[iSide]=boCreated; BoHashDone[iSide]=!boCreated;
      EnumStat[iSide]=EnumStatT.compared; if(!boCreated) EnumStat[iSide]=EnumStatT.hashed;
      ObjT2D[iSide].funSetSingleButton(); el.funSetBothButtons()
    }
    resetMess(); blanket.hide();
  }

  var funCompare=async function(){
    myConsole.clear();  blanket.show();
    for(var iSide of [0,1]){
      var [err]=await ObjT2D[iSide].funCompareInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    }
    resetMess(); blanket.hide();
  }

  var funCalcHash=async function(){
    blanket.show();
    for(var iSide of [0,1]){
      var [err]=await ObjT2D[iSide].funCalcHashInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    }
    blanket.hide();
  }

  var funUniquifySM=async function(){
    blanket.show();
    for(var iSide of [0,1]){
      var [err]=await ObjT2D[iSide].funUniquifySMInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    }
    blanket.hide();
  }

  var funWriteToDb=async function(){
    blanket.show();
    for(var iSide of [0,1]){
      var [err]=await ObjT2D[iSide].funWriteToDbInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    }
    blanket.hide();
  }


  var funCompareNHashNUniquify_both_inner=async function(){
    var strMess=`Compare both`;
    myConsole.clear(); el.clearVal(); setMess(strMess); viewFront.divT2TUsingHash.clearVal();

    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
    argGeneral=argGeneralT
    var ISide=[0,1];
    for(var iSide of ISide){
      var [err]=await ObjT2D[iSide].funCompareInner(); if(err) {debugger; return [err]; };
    }

    for(var iSide of ISide){
      var [err]=await ObjT2D[iSide].funCalcHashInner(); if(err) {debugger; return [err]; };
    }
    
    for(var iSide of ISide){
      var [err]=await ObjT2D[iSide].funUniquifySMInner(); if(err) {debugger; return [err]; };
    }

    for(var iSide of ISide){
      var boChanged=arrSyncDb[iSide].boChanged || Boolean(ArrToChange[iSide].length);
      EnumStat[iSide]=EnumStatT.unique; if(!boChanged) EnumStat[iSide]=EnumStatT.none;
      ObjT2D[iSide].funSetSingleButton();
    }
    el.funSetBothButtons();
    //butWrite.enable(boChanged);
    return [null]
  }
  var funCompareNHashNUniquify_both=async function(){
    blanket.show();
    var [err]=await funCompareNHashNUniquify_both_inner(); if(err) {debugger; myConsole.error(err);};
    resetMess(); blanket.hide();
  }


  var argGeneral, arrSyncDb=Array(2), ArrToChange=Array(2);
  var EnumStatT={none:0, compared:1, hashed:2, unique:3}
  var EnumStat=[EnumStatT.none, EnumStatT.none];

  extend(el, {arrSyncDb, ArrToChange, EnumStat, EnumStatT})

  var ObjT2D=[], ArrEl=[]
  for(var i=0;i<2;i++){
    var [objT2D, arrEl]=objT2DCreator({}, i, el)
    ObjT2D[i]=objT2D;
    ArrEl[i]=arrEl;
  }

  var divEmpty=createElement('div').css({position:'sticky', 'grid-column':'span 2'})
  var butCompareBoth=createElement('button').myAppend('Both').on('click', funCompare).prop({title:'Compare own SM on both Source and Target.'});
  var divCompareBoth=createElement('div').myAppend(butCompareBoth).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-row':'span 5'}); //, 'grid-area':'1/1/span 1/span 2' , opacity:0.8

  var butCompareBothB=createElement('button').myAppend('Both').on('click', funCompareNHashNUniquify_both).prop({title:'Compare own SM on both Source and Target.'});
  var divCompareBothB=createElement('div').myAppend(butCompareBothB).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-row':'span 7'}); //, opacity:0.8


  var butCalcHash=createElement('button').myAppend('Both').on('click', funCalcHash).disable();
  var divCalcHash=createElement('div').myAppend(butCalcHash).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center'});

  var butUniquifySM=createElement('button').myAppend('Both').on('click', funUniquifySM).disable();
  var divUniquifySM=createElement('div').myAppend(butUniquifySM).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-row':'span 1'}); //, 'grid-column':'span 3', 'grid-area':'1/1/span 1/span 2'   title:'Uniquify SM', 

  var butWrite=createElement('button').myAppend('Write…').on('click', funWriteToDb).prop({title:'Write to db and update timestamps (on both Source and Target).'}).disable();
  var divWrite=createElement('div').myAppend(butWrite).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-column':'span 2'}).hide(); //

  var ArrElT=Mat.transpose(ArrEl);
  ArrElT[0].push(divEmpty)
  ArrElT[1].push(divCompareBoth, divCompareBothB)
  ArrElT[6].push(divCalcHash)
  ArrElT[7].push(divUniquifySM)
  ArrElT[8].push(divWrite)
  el.myAppend(...ArrElT.flat())

  el.css({'text-align':'left', display:'grid', 'grid-template-columns':'1fr 1fr auto auto', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px'}); //, flex:'0 0 auto', 'overflow-y':'auto'

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}


/***********************************************
 *   objT2DCreator
 **********************************************/
gThis.objT2DCreator=function(el, iSide, elPar){
  
  el.setUp=function(){
  }

  //el.clearUI=function(){ miniViewRelationFixingS.clearUI(); miniViewRelationFixingT.clearUI(); }
  el.setUIBasedOnSetting=function(arg){
    var {objOptSource, objOptTarget, fiSourceDir, strHostTarget, fiTargetDbDir, suffixFilterFirstT2T, boRemoteTarget}=arg;
    var {leafFilter}=objOptSource;

    var strTargetDbDir=boRemoteTarget?`${strHostTarget}:${fiTargetDbDir}`:fiTargetDbDir
    var {leafDb}=settings

    if(boTarget){ var strTree=strTargetDbDir; }
    else{
      var strTree=fiSourceDir;
      linkTree.toggleClass('disabled', boRemoteTarget);
      linkDb.toggleClass('disabled', boRemoteTarget);
      linkFilterFirstT2D.toggleClass('disabled', boRemoteTarget)
    }
    linkTree.prop({title:strTree}).toggleClass('disabled', boRemoteTarget); // Image with a green triangle

    var titleDb=strTree+charF+leafDb; linkDb.prop({title:titleDb});// Db-emoji
    var titleFilter=strTree+charF+leafFilter; linkFilterFirstT2D.prop({title:titleFilter}).myText(leafFilter);
    // miniViewRelationFixing.setUIBasedOnSetting(arg)
  }
  el.clearVal=function(){
    divIdMatch.clearVal();
    divOwnCounter.clearVal();
    divDbRelationTest.clearVal();
    //divCatPrim1.clearVal();
    divTab.clearVal();
    miniViewRelationFixing.clearUI();

    EnumStat[iSide]=EnumStatT.none;
    el.funSetSingleButton(); divT2DBoth.funSetBothButtons();
    arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    
    argGeneral=undefined;
  }
  el.setVal=function(objFeedback){
    divTab.setVal(objFeedback);
  }
  el.setValHL=function(objHL){
    divIdMatch.setVal(objHL);
  }
  el.setValOwnCounter=function(objOwnCounter){
    divOwnCounter.setVal(objOwnCounter);
  }
  el.setValDbRelationTest=function(obj){
    divDbRelationTest.setVal(obj);
  }

  el.funSetSingleButton=function(){
    var i=iSide;
    butCalcHash.enable(EnumStat[i]==EnumStatT.compared)
    divUniquify.querySelector(`button`).enable(EnumStat[i]==EnumStatT.hashed); 
    var boWriteNeeded=EnumStat[i]==EnumStatT.unique, butWrite=divWrite.querySelector(`button`)
    butWrite.enable(boWriteNeeded);
    butWrite.css({background:boWriteNeeded?'var(--bg-red)':''})

  }
  
  el.funCompareInner=async function(){
    viewFront.divT2TUsingHash.clearVal(); //el.clearVal();
    el.clearVal();

    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
    argGeneral=argGeneralT
    var strMess=`Compare tree-2-db on ${strSide}...`; setMess(strMess);

    var arg={charSide, argGeneral}
    var [err, syncDb]=await SyncT2D.fun1Prework(arg); if(err) {debugger; return [err];};
    var {boCreated, objHL, objOwnCounter, objDb_1MToM_SMHash}=syncDb;
    el.setValHL(objHL); el.setValOwnCounter(objOwnCounter); el.setValDbRelationTest(objDb_1MToM_SMHash);
    
    if(objHL.boHL || !objDb_1MToM_SMHash.boOK) {  return [null];};
    el.setVal(syncDb.objCategory);
    arrSyncDb[iSide]=syncDb;
    SyncT2D.fun1_5CreateNewDb(syncDb);
    EnumStat[iSide]=EnumStatT.compared; if(!boCreated) EnumStat[iSide]=EnumStatT.hashed;
    el.funSetSingleButton(); divT2DBoth.funSetBothButtons()
    return [null]
  }
  var funCompare=async function(){
    myConsole.clear();  blanket.show();
    var [err]=await el.funCompareInner(); if(err) {debugger; myConsole.error(err); };
    resetMess(); blanket.hide();
  }

  el.funCalcHashInner=async function(){
    setMess(`Calculate hash for new files (on ${strSide})...`);
    var [err]=await SyncT2D.fun2AddHash(charSide, argGeneral, arrSyncDb[iSide]); if(err) {debugger; return [err];}
    EnumStat[iSide]=EnumStatT.hashed;
    el.funSetSingleButton(); divT2DBoth.funSetBothButtons()
    setMess('CalcHash: Done');
    return [null]
  }
  var funCalcHash=async function(){
    blanket.show();
    var [err]=await el.funCalcHashInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    blanket.hide();
  }

  el.funUniquifySMInner=async function(){
    setMess(`Uniquify SM (on ${strSide})...`);
    var syncDb=arrSyncDb[iSide]
    var [err, result]=await SyncT2D.fun3GetMultSM(argGeneral, syncDb, iSide); if(err) {debugger; return [err];}
    var {Bund1MToM, objFeedback}=result
    miniViewRelationFixing.setUI_SMMultiples(objFeedback);
    var [err, result]=await SyncT2D.fun35FindNewMTime({Bund1MToM}, argGeneral, syncDb, iSide); if(err) {debugger; return [err];}
    var {arrToChange}=result
    miniViewRelationFixing.setUI_NewMTime(result)

    ArrToChange[iSide]=arrToChange;
    var boChanged=syncDb.boChanged || Boolean(ArrToChange[iSide].length)
    //BoUniquified[iSide]=boChanged; BoHashDone[iSide]=false
    EnumStat[iSide]=EnumStatT.unique; if(!boChanged) EnumStat[iSide]=EnumStatT.none;
    el.funSetSingleButton(); divT2DBoth.funSetBothButtons()
    return [null]
  }
  var funUniquifySM=async function(){
    blanket.show();
    var [err]=await el.funUniquifySMInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    blanket.hide();
  }
  
  el.funWriteToDbInner=async function(){
    setMess(`WriteToDbs (on ${strSide})...`);
    var [err]=await SyncT2D.fun4WriteDb(ArrToChange[iSide], arrSyncDb[iSide], argGeneral, boTarget); if(err) {debugger; EnumStat[iSide]=EnumStatT.none; el.funSetSingleButton(); return [err];}
    EnumStat[iSide]=EnumStatT.none;
    el.funSetSingleButton(); divT2DBoth.funSetBothButtons();
    arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    setMess('WriteToDbs: Done');
    return [null]
  }
  var funWriteToDb=async function(){
    blanket.show();
    var [err]=await el.funWriteToDbInner(); if(err) {debugger; myConsole.error(err); resetMess(); };
    blanket.hide();
  }


  var divT2DBoth=elPar
  var {arrSyncDb, ArrToChange, EnumStat, EnumStatT}=divT2DBoth
  var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source', strSideB=ucfirst(strSide);

  var argGeneral;

  var headT2D=createElement('b').myText(`${strSideB}: Tree to Db`).css({margin:'0 0.4em 0 0'}).prop({title:`Sync "own" files (green area) to db.
Upstream files (white area) are left untouched.`})
  var imgTree=createElement('img').prop({src:`icons/buvtTree${charSide}WOSub.png`}).css({zoom:'1', 'vertical-align':'middle'});
  var linkTree=createElement('a').myAppend(imgTree).prop({href:'', title:''}).on('click', methGoToTitle);
  //var spanDb=createElement('span').myAppend(`${charDb}`).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'});
  var linkDb=createElement('a').myText(`${charDb}`).prop({href:""}).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'}).on('click', methGoToTitle);
  var hT2D=createElement('span').myAppend(linkTree, ` ${charRightArrow} `, linkDb); //`${charSide} (Tree `, 
  var linkFilterFirstT2D=createElement('a').myText('filterFirst').prop({ href:""}).on('click', methGoToTitle);
  var divHead=createElement('div').myAppend(headT2D, ' ', hT2D, ' ', linkFilterFirstT2D).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky'}); //, opacity:0.8 
  var butCompareT2D=createElement('button').myAppend('Compare').on('click', funCompare);
  var divMatchBut=createElement('div').myAppend(butCompareT2D);


  var PathCur=gThis[`Path${charSide}`]
  var divIdMatch=divIdMatchCreator(createElement('div'), makeOpenExtCB(PathCur.hlF), makeOpenExtCB(PathCur.hl)).css({background:'var(--bg-color)'});

  var divOwnCounter=divOwnCounterCreator(createElement('span'));

  var divDbRelationTest=createElement('div'); divDbRelationTestCreator(divDbRelationTest, makeOpenExtCB(PathCur.dbHashUniquenessPerSM)).css({background:'var(--bg-color)'})

  // var divAreaCatPrim1=createElement('div').myHtml(`SM-Combos: `);
  // divAreaCatPrimCreator(divAreaCatPrim1, makeOpenExtCB(PathCur.STMatch1_02), null, makeOpenExtCB(PathCur.STMatch1_12), makeOpenExtCB(PathCur.STMatch1_20), makeOpenExtCB(PathCur.STMatch1_21), makeOpenExtCB(PathCur.STMatch1_22));
  
  var divTab=divT2DTabCreator(createElement('div'), charSide)
  var divTabW=createElement('div').myAppend(divTab)


  var butCalcHash=createElement('button').myAppend('Calc hash').css({margin:'auto'}).on('click', funCalcHash).disable()
  var divCalcHash=createElement('div').myAppend(butCalcHash).css({background:"var(--bg-color)"});;

  var miniViewRelationFixing=miniViewRelationFixingCreator(createElement('div'), charSide)

  //var headSMHashFixing=createElement('div').myAppend('Uniquify SM for individual hashcodes'); // Fix SM-hash-relations
  //Note! As shown in the picture below, a hashcode can still have multiple SM.\nIn other words: "Copies" (files with the same hashcode) may (or may not) have the same SM.
  // Search for 1M-To-M in new files
  var butUniquify=createElement('button').myAppend(`Fixing own entries' SM-keys`).prop({title:`Makeing own files SM-hash relations 1M-To-1 (new files have priority when determening which files to change)`}).css({margin:'auto'}).on('click', funUniquifySM).disable()
  // Searching for 1M-To-M SM-hash relations in new files.

  var divUniquify=createElement('div').myAppend(butUniquify, miniViewRelationFixing); //headSMHashFixing, 
  
  var butWrite=createElement('button').myAppend('Write to db and update mtimes').css({margin:'auto'}).on('click', funWriteToDb).disable()
  var divWrite=createElement('div').myAppend(butWrite).css({background:"var(--bg-color)"});


  //el.myAppend(...DivHead, divEmpty, ...DivMatchBut, divCompareBoth, divCompareBothB, ...DivIdMatch, ...DivOwnCounter, ...DivDbRelationTest, ...DivTabW, ...DivCalcHash, divCalcHash, ...DivUniquify, divUniquifySM, ...DivWrite, divWrite); // 

  var ElOut=[divHead, divMatchBut, divIdMatch, divOwnCounter, divDbRelationTest, divTabW, divCalcHash, divUniquify, divWrite];
  //, ...MiniViewRelationFixing, divWrite, ...DivDbWrite, ...DivCatPrim1

  //el.css({'text-align':'left', display:'grid', 'grid-template-columns':'1fr 1fr auto auto', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px'}); //, flex:'0 0 auto', 'overflow-y':'auto'

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return [el, ElOut]
}
