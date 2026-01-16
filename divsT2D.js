"use strict"




gThis.divT2DTabCreator=function(el, charSide){
  var self=el
  el.clearVal=function(){
    //butDoAction.disable()
    divCatPrim2.clearVal()
    var title=undefined
    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    //aRenamed.myText('-').prop({title});  spanRenamedAction.myText('-')
    aM1T1.myText('-').prop({title});  span1T1Action.myText('-')
    aMult.myText('-').prop({title});
    spanMultActionC.myText('-'); spanMultActionD.myText('-');
    aCreated.myText('-').prop({title}); aDeleted.myText('-').prop({title});
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumTree.myText('-');  spanSumDb.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
    //aChanged.myText('-').prop({title});  spanChangedAction.myText('-')
  }
  el.setVal=function(syncDb){

    var {catPrim1, catPrim2, ObjFeedback}=syncDb; //, arrTrMMult, arrDbMMult

    var {objSTMatch2, objTree, objDb, objUntouched, objCreate, objDelete, objM1T1}=ObjFeedback

    var arrTrMMult=[].concat(catPrim2.arrA[1][2], catPrim2.arrA[2][1], catPrim2.arrA[2][2]);
    var arrDbMMult=[].concat(catPrim2.arrB[1][2], catPrim2.arrB[2][1], catPrim2.arrB[2][2]);
    //var ArrTrMMult=[].concat(catPrim2.ArrA[1][2], catPrim2.ArrA[2][1], catPrim2.ArrA[2][2]);
    //var ArrDbMMult=[].concat(catPrim2.ArrB[1][2], catPrim2.ArrB[2][1], catPrim2.ArrB[2][2]);

    var nCreate=objCreate.nFile, nDelete=objDelete.nFile,    nTree=objTree.nFile, nDb=objDb.nFile, nUntouched=objUntouched.nFile,    nM1T1=objM1T1.nFile, nTrMMult=arrTrMMult.length, nDbMMult=arrDbMMult.length

    divCatPrim2.setVal(catPrim2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)

    aM1T1.myText(nM1T1).prop({title:objM1T1.strHov});
    span1T1Action.myText(nM1T1)
    var strT=nTrMMult+' \\ '+nDbMMult;
    //aMult.myText(strT).prop({title:formatTitleMult(ArrTrMMult, ArrDbMMult)}); 
    aMult.myText(strT).prop({title:objSTMatch2.strHov}); 
    spanMultActionC.myText(nTrMMult); spanMultActionD.myText(nDbMMult);

    aCreated.myText(nCreate).prop({title:objCreate.strHov}); spanCreatedAction.myText(nCreate);
    aDeleted.myText(nDelete).prop({title:objDelete.strHov}); spanDeletedAction.myText(nDelete);

    spanSumTree.myText(nTree);  spanSumDb.myText(nDb);

    var nShortCut=nUntouched+nM1T1; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nDbMMult+nDelete, nCreateTmp=nTrMMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);


    var boAction=Boolean(nM1T1+nDeleteTmp+nCreateTmp)
    //butDoAction.enable(boAction)

      // Checking the sums
    var nTrCheck=nShortCut+nTrMMult+nCreate, nDbCheck=nShortCut+nDbMMult+nDelete
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
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><th>Un­touched</th> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th colspan=8>  <div class=dupEntry>SM-Combos: </div>  </th></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a></td><th>Re­named</th>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>

<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <th>Created / Deleted</th>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <th title="Relations where the pattern exists once or more on both side (Tr and Db) except for 1T1-relations. (1Tm+mTm+mT1)">Remainder</th>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>


<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <th></th>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>`
//<tr><td colspan=5></td><td colspan=3> <button title="As per the current state of the result-files">Do actions</button></td></tr>
// The pattern exists on both Tr and Db and more than once on at least one of them. <br/>(read fr files)
//<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
//<button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button>
// class=input
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody).addClass('redWTitle');
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  var [trUntouched, trCatPrim2, tr1T1, trCreatedNDeleted, trMult, trSum]=arrTR; //, trChanged
  trSum.css({'font-weight':'bold'});
  //trCatPrim2.hide();
  //var arrT=[...trSum.children]; arrT.slice(1,3).forEach(ele=>ele.css({position:"relative"}));
  [...trSum.children].slice(1,3).forEach(ele=>ele.css({position:"relative"}))

  

  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  //var [aRenamed,spanRenamedAction]=trRenamed.querySelectorAll('a,span')
  var [aM1T1,span1T1Action]=tr1T1.querySelectorAll('a,span')
  var [aCreated, aDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [aMult,spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [tdSumTree,tdSumDb,tdSumSC,tdSumDelete,tdSumCreate]=trSum.querySelectorAll('td');
  var [spanSumTree,spanSumDb,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span');
  //var [aChanged,spanChangedAction]=trChanged.querySelectorAll('a,span'); trChanged.hide()
  //var [butDoAction]=trSyncAccordingToFiles.querySelectorAll('button'); 
  //trSyncAccordingToFiles.hide();


  [tdSumSC, tdSumDelete, tdSumCreate].forEach(ele=>ele.css({backgroundColor:'var(--bg-color)'}));
  [spanSumTree,spanSumDb].forEach(ele=>ele.css({position:'absolute', top:'1px', height:'-webkit-fill-available', backgroundColor:'var(--bg-color)', minWidth:'-webkit-fill-available'}))
  spanSumTree.css({right:'0'}); spanSumDb.css({left:'0'})

  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divCatPrim2]=arrDup;//divCatPrim1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divCatPrimCreator(divCatPrim2);

  var PathCur=gThis[`Path${charSide}`]
  //aRenamed.on('click', makeOpenExtCB(PathCur.renamed))
  aM1T1.on('click', makeOpenExtCB(PathCur.M1T1))
  aCreated.on('click', makeOpenExtCB(PathCur.created))
  aDeleted.on('click', makeOpenExtCB(PathCur.deleted))
  aMult.on('click', makeOpenExtCB(PathCur.STMatch2))
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
    var {objOptSource, objOptTarget, fiSourceDir, strHostTarget, fiTargetDbDir, suffixFilterFirstT2T, boRemoteTarget}=arg;
    var {leafFilter}=objOptSource;

    var strTargetDbDir=boRemoteTarget?`${strHostTarget}:${fiTargetDbDir}`:fiTargetDbDir
    var {leafDb}=settings

    LinkTree[0].prop({title:fiSourceDir})
    LinkTree[1].prop({title:strTargetDbDir}).toggleClass('disabled', boRemoteTarget);

    var title=fiSourceDir+charF+leafDb;   LinkDb[0].prop({title});//.myText(leafDb)
    var title=fiSourceDir+charF+leafFilter;   LinkFilterFirstT2D[0].prop({title}).myText(leafFilter)

    var title=strTargetDbDir+charF+leafDb;   LinkDb[1].prop({title}).toggleClass('disabled', boRemoteTarget); //.myText(leafDb)
    var title=strTargetDbDir+charF+leafFilter;   LinkFilterFirstT2D[1].prop({title}).myText(leafFilter).toggleClass('disabled', boRemoteTarget)

    MiniViewRelationFixing[0].setUIBasedOnSetting(arg)
    MiniViewRelationFixing[1].setUIBasedOnSetting(arg)
  }
  el.clearVal=function(charSide){
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];

    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      DivIdMatch[iSide].clearVal();
      DivOwnCounter[iSide].clearVal();
      DivDbRelationTest[iSide].clearVal();
      DivCatPrim1[iSide].clearVal();
      DivTab[iSide].clearVal();
      MiniViewRelationFixing[iSide].clearUI();

      EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide); funSetBothButtons();
      arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    }
    argGeneral=undefined;
  }
  el.setVal=function(objFeedback, iSide){
    var {catPrim1}=objFeedback
    DivCatPrim1[iSide].setVal(catPrim1); DivTab[iSide].setVal(objFeedback);
  }
  el.setValHL=function(objHL, iSide){
    DivIdMatch[iSide].setVal(objHL);
  }
  el.setValOwnCounter=function(objOwnCounter, iSide){
    DivOwnCounter[iSide].setVal(objOwnCounter);
  }
  el.setValDbHashUniquenessPerSM=function(obj, iSide){
    DivDbRelationTest[iSide].setVal(obj);
  }

  var funSetSingleButton=function(i){
    ButCalcHash[i].enable(EnumStat[i]==EnumStatT.compared)
    DivUniquify[i].querySelector(`button`).enable(EnumStat[i]==EnumStatT.hashed); 
    var boWriteNeeded=EnumStat[i]==EnumStatT.unique, divWrite=DivWrite[i], butWrite=divWrite.querySelector(`button`)
    butWrite.enable(boWriteNeeded);
    butWrite.css({background:boWriteNeeded?'var(--bg-red)':''})

  }
  var funSetBothButtons=function(){
    var boComparedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.compared);  
    var boHashDoneBoth=EnumStat.every(enumT=>enumT>=EnumStatT.hashed);
    if(boHashDoneBoth) boComparedBoth=false;
    butCalcHash.enable(boComparedBoth);
    butUniquifySM.enable(boHashDoneBoth);
    var boUniquifiedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.unique);
    butWrite.enable(boUniquifiedBoth);
  }
  var funCompare=async function(){
    var charSide=this.parentNode.getAttribute('data-side')
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];
    myConsole.clear();  blanket.show(); viewFront.divT2TUsingHash.clearVal(); //el.clearVal();
    for(var iSide of ISide){ DivTab[iSide].clearVal(); el.clearVal(iSide?'T':'S'); }

    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
    argGeneral=argGeneralT
    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      var strMess=`Compare tree-2-db on ${strSide}...`; setMess(strMess);

      var arg={charSide, argGeneral}
      var [err, syncDb]=await SyncT2D.fun1Prework(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;};
      var {boCreated, objHL, objOwnCounter, objDb_XTM_SMHash}=syncDb;
      el.setValHL(objHL, iSide); el.setValOwnCounter(objOwnCounter, iSide); el.setValDbHashUniquenessPerSM(objDb_XTM_SMHash, iSide);
      
      if(objHL.boHL || !objDb_XTM_SMHash.boOK) { resetMess(); blanket.hide(); return;};
      el.setVal(syncDb.objCategory, iSide); // That is divT2DBoth.setVal
      arrSyncDb[iSide]=syncDb;
      SyncT2D.fun1_5CreateNewDb(syncDb);
      //var {boCreated}=syncDb; //BoCompared[iSide]=boCreated; BoHashDone[iSide]=!boCreated;
      EnumStat[iSide]=EnumStatT.compared; if(!boCreated) EnumStat[iSide]=EnumStatT.hashed;
      funSetSingleButton(iSide); funSetBothButtons()
    }
    resetMess(); blanket.hide();
  }

  var funCalcHash=async function(){
    var charSide=this.parentNode.getAttribute('data-side')
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];
    blanket.show();

    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      setMess(`Calculate hash for new files (on ${strSide})...`);
      var [err]=await SyncT2D.fun2AddHash(charSide, argGeneral, arrSyncDb[iSide]); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      //BoCompared[iSide]=false; BoHashDone[iSide]=true;
      EnumStat[iSide]=EnumStatT.hashed;
      funSetSingleButton(iSide); funSetBothButtons()
    }
    setMess('CalcHash: Done'); blanket.hide();
  }

  var funUniquifySM=async function(){
    var charSide=this.parentNode.getAttribute('data-side')
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];
    blanket.show();

    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      setMess(`Uniquify SM (on ${strSide})...`);
      var syncDb=arrSyncDb[iSide]
      var [err, result]=await SyncT2D.fun3GetMultSM(argGeneral, syncDb, iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      var {BundXTM}=result
      el.MiniViewRelationFixing[iSide].setUI_SMMultiples(result);
      var [err, result]=await SyncT2D.fun35FindNewMTime({BundXTM}, argGeneral, syncDb, iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      var {arrToChange}=result
      el.MiniViewRelationFixing[iSide].setUI_NewMTime(result)

      ArrToChange[iSide]=arrToChange;
      var boChanged=syncDb.boChanged || Boolean(ArrToChange[iSide].length)
      //BoUniquified[iSide]=boChanged; BoHashDone[iSide]=false
      EnumStat[iSide]=EnumStatT.unique; if(!boChanged) EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide); funSetBothButtons()
    }
    blanket.hide();
  }
  var funWriteToDb=async function(){
    var charSide=this.parentNode.getAttribute('data-side')
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];
    blanket.show();

    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      setMess(`WriteToDbs (on ${strSide})...`);
      var [err]=await SyncT2D.fun4WriteDb(ArrToChange[iSide], arrSyncDb[iSide], argGeneral, boTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); EnumStat[iSide]=EnumStatT.none; funSetSingleButton(iSide); return;}  //butWrite.disable();
      EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide); funSetBothButtons();
      arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    }
    //argGeneral=undefined;
    setMess('WriteToDbs: Done'); blanket.hide();
  }


  var funCompareNHashNUniquify_both=async function(){
    var strMess=`Compare both`;
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show(); viewFront.divT2TUsingHash.clearVal();

    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
    argGeneral=argGeneralT
    var ISide=[0,1];
    for(var iSide of ISide){
      var charSide=iSide?'T':'S'
      var arg={charSide, argGeneral}
      var [err, syncDb]=await SyncT2D.fun1Prework(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;};
      var {objHL, objOwnCounter, objDb_XTM_SMHash}=syncDb;
      el.setValHL(objHL, iSide); el.setValOwnCounter(objOwnCounter, iSide); el.setValDbHashUniquenessPerSM(objDb_XTM_SMHash, iSide);
      if(objHL.boHL || !objDb_XTM_SMHash.boOK) { resetMess(); blanket.hide(); return;};
      el.setVal(syncDb.objCategory, iSide); // That is divT2DBoth.setVal
      arrSyncDb[iSide]=syncDb;
      SyncT2D.fun1_5CreateNewDb(syncDb);
    }

    for(var iSide of ISide){
      var charSide=iSide?'T':'S';
      var [err]=await SyncT2D.fun2AddHash(charSide, argGeneral, arrSyncDb[iSide]); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    }
    
    for(var iSide of ISide){
      var [err, result]=await SyncT2D.fun3GetMultSM(argGeneral, arrSyncDb[iSide], iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      var {BundXTM}=result
      el.MiniViewRelationFixing[iSide].setUI_SMMultiples(result);
      var [err, result]=await SyncT2D.fun35FindNewMTime({BundXTM}, argGeneral, arrSyncDb[iSide], iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}

      var {arrToChange}=result
      el.MiniViewRelationFixing[iSide].setUI_NewMTime(result)
      ArrToChange[iSide]=arrToChange
    }

    for(var iSide of ISide){
      var boChanged=arrSyncDb[iSide].boChanged || Boolean(ArrToChange[iSide].length);
      EnumStat[iSide]=EnumStatT.unique; if(!boChanged) EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide);
    }
    funSetBothButtons();
    //butWrite.enable(boChanged);
    resetMess(); blanket.hide();
  }


  var argGeneral, arrSyncDb=Array(2), ArrToChange=Array(2);
  var EnumStatT={none:0, compared:1, hashed:2, unique:3}
  var EnumStat=[EnumStatT.none, EnumStatT.none];


  var CharSide=['S', 'T'], DivButton=[], LinkFilterFirstT2D=[], LinkTree=[], LinkDb=[], DivIdMatch=[], DivOwnCounter=[], DivDbRelationTest=[], DivCatPrim1=[], DivTab=[], DivTabW=[], ButCalcHash=[], DivCalcHash=[], DivUniquify=[], MiniViewRelationFixing=[], DivWrite=[];  //, DivDbWrite=[]

  extend(el, {LinkTree, MiniViewRelationFixing}); //
  for(var i=0;i<2;i++){
    var boTarget=Boolean(i), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source', strSideB=ucfirst(strSide);

    var headT2D=createElement('b').myText(`${charSide}`).css({margin:'0 0.4em 0 0'}).prop({title:`Sync ${strSide} sides "own" files to ${strSide} db.
"own" corresponds here to the green area in the image to the right.`})
    var imgTree=createElement('img').prop({src:`icons/buvtTree${charSide}WOSub.png`}).css({zoom:'1', 'vertical-align':'middle'});
    var linkTree=createElement('a').myAppend(imgTree).prop({href:'', title:''}).on('click', methGoToTitle);
    //var spanDb=createElement('span').myAppend(`${charDb}`).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'});
    var linkDb=createElement('a').myText(`${charDb}`).prop({href:""}).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'}).on('click', methGoToTitle);
    var hT2D=createElement('span').myAppend(linkTree, ` ${charRightArrow} `, linkDb); //`${charSide} (Tree `, 
    var butCompareT2D=createElement('button').myAppend('Match SM').on('click', funCompare);
    var linkFilterFirstT2D=createElement('a').myText('filterFirst').prop({ href:""}).on('click', methGoToTitle);
    var divButton=createElement('div').myAppend(headT2D, ' ', hT2D, ' ', linkFilterFirstT2D, ' ', butCompareT2D).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky'}); //, opacity:0.8 
    divButton.attr('data-side', charSide);

    var butCalcHash=createElement('button').myAppend('Calc hash').css({margin:'auto'}).on('click', funCalcHash).disable()
    var divCalcHash=createElement('div').myAppend(butCalcHash).attr('data-side', charSide).css({background:"var(--bg-color)"});;

    var miniViewRelationFixing=miniViewRelationFixingCreator(createElement('div'), charSide)

    var headSMHashFixing=createElement('div').myAppend('Uniquify SM for individual hashcodes').prop({title:`Get rid of any XTM (1TM and MTM) relations (see table below).`}); // Fix SM-hash-relations
    //Note! As shown in the picture below, a hashcode can still have multiple SM.\nIn other words: "Copies" (files with the same hashcode) may (or may not) have the same SM.
    var butUniquify=createElement('button').myAppend(`Go`).css({margin:'auto'}).on('click', funUniquifySM).disable()
    var divUniquify=createElement('div').myAppend(headSMHashFixing, butUniquify, miniViewRelationFixing).attr('data-side', charSide);
    
    var butWrite=createElement('button').myAppend('Write to db and update mtimes').css({margin:'auto'}).on('click', funWriteToDb).disable()
    var divWrite=createElement('div').myAppend(butWrite).attr('data-side', charSide).css({background:"var(--bg-color)"});

    var PathCur=gThis[`Path${charSide}`]
    var divIdMatch=divIdMatchCreator(createElement('div'), makeOpenExtCB(PathCur.hlF), makeOpenExtCB(PathCur.hl)).css({background:'var(--bg-color)'})

    var divOwnCounter=divOwnCounterCreator(createElement('div'))

    var divDbRelationTest=createElement('div'); divDbRelationTestCreator(divDbRelationTest, makeOpenExtCB(PathCur.dbHashUniquenessPerSM)).css({background:'var(--bg-color)'})

    var divCatPrim1=createElement('div').myHtml(`SM-Combos: `);
    divCatPrimCreator(divCatPrim1, makeOpenExtCB(PathCur.STMatch1_02), null, makeOpenExtCB(PathCur.STMatch1_12), makeOpenExtCB(PathCur.STMatch1_20), makeOpenExtCB(PathCur.STMatch1_21), makeOpenExtCB(PathCur.STMatch1_22));
    
    var divTab=divT2DTabCreator(createElement('div'), charSide)
    var divTabW=createElement('div').myAppend(divTab)


    DivButton[i]=divButton; LinkFilterFirstT2D[i]=linkFilterFirstT2D; LinkDb[i]=linkDb; DivIdMatch[i]=divIdMatch; DivOwnCounter[i]=divOwnCounter; DivDbRelationTest[i]=divDbRelationTest; DivCatPrim1[i]=divCatPrim1; DivTab[i]=divTab; DivTabW[i]=divTabW; ButCalcHash[i]=butCalcHash; DivCalcHash[i]=divCalcHash; DivUniquify[i]=divUniquify; MiniViewRelationFixing[i]=miniViewRelationFixing; DivWrite[i]=divWrite; LinkTree[i]=linkTree; //DivDbWrite[i]=divDbWrite; 
  }

  var butCompareBoth=createElement('button').myAppend('Both').on('click', funCompare).prop({title:'Compare own SM on both Source and Target.'});
  var divCompareBoth=createElement('div').myAppend(butCompareBoth).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', 'text-align':'center', 'grid-row':'span 6'}); //, 'grid-area':'1/1/span 1/span 2' , opacity:0.8

  var butGo=createElement('button').myAppend('Both').on('click', funCompareNHashNUniquify_both).prop({title:'Compare own SM on both Source and Target.'});
  var divGo=createElement('div').myAppend(butGo).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', 'text-align':'center', 'grid-row':'span 8'}); //, opacity:0.8


  var butCalcHash=createElement('button').myAppend('Both').on('click', funCalcHash).disable();
  var divCalcHash=createElement('div').myAppend(butCalcHash).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center'});

  var butUniquifySM=createElement('button').myAppend('Both').on('click', funUniquifySM).disable();
  var divUniquifySM=createElement('div').myAppend(butUniquifySM).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-row':'span 1'}); //, 'grid-column':'span 3', 'grid-area':'1/1/span 1/span 2'   title:'Uniquify SM', 

  var butWrite=createElement('button').myAppend('Write…').on('click', funWriteToDb).prop({title:'Write to db and update timestamps (on both Source and Target).'}).disable();
  var divWrite=createElement('div').myAppend(butWrite).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-column':'span 2'}).hide(); //

  el.myAppend(...DivButton, divCompareBoth, divGo, ...DivIdMatch, ...DivOwnCounter, ...DivDbRelationTest, ...DivCatPrim1, ...DivTabW, ...DivCalcHash, divCalcHash, ...DivUniquify, divUniquifySM, ...DivWrite, divWrite); // , ...MiniViewRelationFixing, divWrite, ...DivDbWrite

  el.css({'text-align':'left', display:'grid', 'grid-template-columns':'1fr 1fr auto auto', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px'}); //, flex:'0 0 auto', 'overflow-y':'auto'

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}
