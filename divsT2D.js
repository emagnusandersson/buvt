"use strict"




gThis.divT2DTabCreator=function(el, charSide){
  var self=el
  el.clearVal=function(){
    //butDoAction.disable()
    divMat2.clearVal()
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

    var {Mat1, Mat2, ObjFeedback}=syncDb; //, arrTrMMult, arrDbMMult

    var {objSTMatch2, objTree, objDb, objUntouched, objCreate, objDelete, objM1T1}=ObjFeedback

    var arrTrMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrDbMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    var ArrTrMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrDbMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);

    var nCreate=objCreate.nFile, nDelete=objDelete.nFile,    nTree=objTree.nFile, nDb=objDb.nFile, nUntouched=objUntouched.nFile,    nM1T1=objM1T1.nFile, nTrMMult=arrTrMMult.length, nDbMMult=arrDbMMult.length

    divMat2.setVal(Mat2)

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

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><th>Un­touched</th> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th colspan=8>  <div class=dupEntry>SM-Combos: </div>  </th></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="" class=input>-</a></td><th>Re­named</th>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>

<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <th>Created / Deleted</th>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <th title="Relations where the pattern exists once or more on both side (Tr and Db) except for 1T1-relations. (1Tm+mTm+mT1)">Remainder</th>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>


<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <th></th>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>`
//<tr><td colspan=5></td><td colspan=3> <button title="As per the current state of the result-files">Do actions</button></td></tr>
// The pattern exists on both Tr and Db and more than once on at least one of them. <br/>(read fr files)
//<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
//<button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button>
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody).addClass('redWTitle');
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  var [trUntouched, trMat2, tr1T1, trCreatedNDeleted, trMult, trSum]=arrTR; //, trChanged
  trSum.css({'font-weight':'bold'});
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
  var [divMat2]=arrDup;//divMat1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divSMMatchCreator(divMat2);

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


  //el.clearUI=function(){ miniViewSMMatchS.clearUI(); miniViewSMMatchT.clearUI(); }
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

    MiniViewSMMatch[0].setUIBasedOnSetting(arg)
    MiniViewSMMatch[1].setUIBasedOnSetting(arg)
  }
  el.clearVal=function(charSide){
    var ISide; if(charSide=='S') ISide=[0]; else if(charSide=='T') ISide=[1]; else ISide=[0,1];

    for(var iSide of ISide){
      var boTarget=Boolean(iSide), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';
      DivIdMatch[iSide].clearVal();
      DivMat1[iSide].clearVal();
      DivTab[iSide].clearVal();
      MiniViewSMMatch[iSide].clearUI();

      EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide); funSetBothButtons();
      arrSyncDb[iSide]=undefined; ArrToChange[iSide]=undefined;
    }
    argGeneral=undefined;
  }
  el.setVal=function(objFeedback, iSide){
    var {Mat1}=objFeedback
    DivMat1[iSide].setVal(Mat1); DivTab[iSide].setVal(objFeedback);
  }
  el.setHLVal=function(objHL, iSide){
    DivIdMatch[iSide].setVal(objHL);
  }

  var funSetSingleButton=function(i){
    ButCalcHash[i].enable(EnumStat[i]==EnumStatT.compared)
    DivUniquify[i].querySelector(`button`).enable(EnumStat[i]==EnumStatT.hashed); 
    DivFinish[i].querySelector(`button`).enable(EnumStat[i]==EnumStatT.unique)

  }
  var funSetBothButtons=function(){
    var boComparedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.compared);  
    var boHashDoneBoth=EnumStat.every(enumT=>enumT>=EnumStatT.hashed);
    if(boHashDoneBoth) boComparedBoth=false;
    butCalcHash.enable(boComparedBoth);
    butUniquifySM.enable(boHashDoneBoth);
    //var boUniquifiedBoth=EnumStat.every(enumT=>enumT>=EnumStatT.unique);  butFinish.enable(boUniquifiedBoth);
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

      var arg={divT2DBoth:el, charSide, argGeneral}
      var [err, syncDb]=await fun1Prework(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;};
      arrSyncDb[iSide]=syncDb;
      fun1_5CreateNewDb(arrSyncDb[iSide]);
      var {boCreated}=arrSyncDb[iSide]; //BoCompared[iSide]=boCreated; BoHashDone[iSide]=!boCreated;
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
      var [err]=await fun2AddHash(charSide, argGeneral, arrSyncDb[iSide]); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
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
      var [err, result]=await fun3GetMultSM({divT2DBoth:el}, argGeneral, syncDb, iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      ArrToChange[iSide]=result;
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
      var [err]=await fun4WriteDb(ArrToChange[iSide], arrSyncDb[iSide], argGeneral, boTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); EnumStat[iSide]=EnumStatT.none; funSetSingleButton(iSide); return;}  //butFinish.disable();
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
      var arg={divT2DBoth:el, charSide, argGeneral}
      var [err, syncDb]=await fun1Prework(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;};
      arrSyncDb[iSide]=syncDb;
      fun1_5CreateNewDb(arrSyncDb[iSide]);
    }

    for(var iSide of ISide){
      var charSide=iSide?'T':'S';
      var [err]=await fun2AddHash(charSide, argGeneral, arrSyncDb[iSide]); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    }
    
    for(var iSide of ISide){
      var [err, result]=await fun3GetMultSM({divT2DBoth:el}, argGeneral, arrSyncDb[iSide], iSide); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      ArrToChange[iSide]=result
    }

    for(var iSide of ISide){
      var boChanged=arrSyncDb[iSide].boChanged || Boolean(ArrToChange[iSide].length);
      EnumStat[iSide]=EnumStatT.unique; if(!boChanged) EnumStat[iSide]=EnumStatT.none;
      funSetSingleButton(iSide);
    }
    funSetBothButtons();
    //butFinish.enable(boChanged);
    resetMess(); blanket.hide();
  }


  var argGeneral, arrSyncDb=Array(2), ArrToChange=Array(2);
  var EnumStatT={none:0, compared:1, hashed:2, unique:3}
  var EnumStat=[EnumStatT.none, EnumStatT.none];


  var CharSide=['S', 'T'], DivButton=[], LinkFilterFirstT2D=[], LinkTree=[], LinkDb=[], DivIdMatch=[], DivMat1=[], DivTab=[], DivTabW=[], ButCalcHash=[], DivCalcHash=[], DivUniquify=[], MiniViewSMMatch=[], DivFinish=[];  //, DivDbWrite=[]

  extend(el, {LinkTree, MiniViewSMMatch}); //
  for(var i=0;i<2;i++){
    var boTarget=Boolean(i), charSide=boTarget?'T':'S', strSide=boTarget?'target':'source';

    var headT2D=createElement('b').myText(`${ucfirst(strSide)}: sync own files to Db`).css({margin:'0 0.4em 0 0'}).prop({title:`"own" corresponds here to the green area in the image to the left.`})
    var imgTree=createElement('img').prop({src:`icons/buvtTree${charSide}WOSub.png`}).css({zoom:'1', 'vertical-align':'middle'});
    var linkTree=createElement('a').myAppend(imgTree).prop({href:'', title:''}).on('click', methGoToTitle);
    //var spanDb=createElement('span').myAppend(`${charDb}`).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'});
    var linkDb=createElement('a').myText(`${charDb}`).prop({href:""}).css({'font-size':'1.6em', display:'inline-block', 'vertical-align':'middle'}).on('click', methGoToTitle);
    var hT2D=createElement('span').myAppend(linkTree, ` ${charRightArrow} `, linkDb); //`${charSide} (Tree `, 
    var butCompareT2D=createElement('button').myAppend('Match SM').on('click', funCompare);
    var linkFilterFirstT2D=createElement('a').myText('filterFirst').prop({ href:""}).on('click', methGoToTitle);
    var divButton=createElement('div').myAppend(hT2D, ' ', butCompareT2D, ' ', linkFilterFirstT2D).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky'}); //, opacity:0.8 headT2D, 
    divButton.setAttribute('data-side', charSide);

    var butCalcHash=createElement('button').myAppend('Calc hash').css({margin:'auto'}).on('click', funCalcHash).disable()
    var divCalcHash=createElement('div').myAppend(butCalcHash);  divCalcHash.setAttribute('data-side', charSide);

    var miniViewSMMatch=miniViewSMMatchCreator(createElement('div'), charSide)

    var butUniquify=createElement('button').myAppend('Uniquify SM-hashcode relations 1').prop({title:`Note! As shown in the picture below, a hashcode can still have multiple SM.\nIn other words: "Copies" (files with the same hashcode) may (or may not) have the same SM.`}).css({margin:'auto'}).on('click', funUniquifySM).disable()

    var divUniquify=createElement('div').myAppend(butUniquify, miniViewSMMatch).css({background:"var(--bg-color)"});  divUniquify.setAttribute('data-side', charSide);
    
    var butFinish=createElement('button').myAppend('Write to db and update mtimes').css({margin:'auto'}).on('click', funWriteToDb).disable()
    var divFinish=createElement('div').myAppend(butFinish);  divFinish.setAttribute('data-side', charSide);

    var PathCur=gThis[`Path${charSide}`]
    var divIdMatch=createElement('div'); divIdMatchCreator(divIdMatch, makeOpenExtCB(PathCur.hl))

    var divMat1=createElement('div').myHtml(`SM-Combos: `);
    divSMMatchCreator(divMat1, makeOpenExtCB(PathCur.STMatch1_02), null, makeOpenExtCB(PathCur.STMatch1_12), makeOpenExtCB(PathCur.STMatch1_20), makeOpenExtCB(PathCur.STMatch1_21), makeOpenExtCB(PathCur.STMatch1_22));
    
    var divTab=divT2DTabCreator(createElement('div'), charSide)
    var divTabW=createElement('div').myAppend(divTab)


    DivButton[i]=divButton; LinkFilterFirstT2D[i]=linkFilterFirstT2D; LinkDb[i]=linkDb; DivIdMatch[i]=divIdMatch; DivMat1[i]=divMat1; DivTab[i]=divTab; DivTabW[i]=divTabW; ButCalcHash[i]=butCalcHash; DivCalcHash[i]=divCalcHash; DivUniquify[i]=divUniquify; MiniViewSMMatch[i]=miniViewSMMatch; DivFinish[i]=divFinish; LinkTree[i]=linkTree; //DivDbWrite[i]=divDbWrite; 
  }

  var butCompareBoth=createElement('button').myAppend('Both').on('click', funCompare).prop({title:'Compare own SM on both Source and Target.'});
  var divCompareBoth=createElement('div').myAppend(butCompareBoth).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', 'text-align':'center', 'grid-row':'span 4'}); //, 'grid-area':'1/1/span 1/span 2' , opacity:0.8

  var butGo=createElement('button').myAppend('Both').on('click', funCompareNHashNUniquify_both).prop({title:'Compare own SM on both Source and Target.'});
  var divGo=createElement('div').myAppend(butGo).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', 'text-align':'center', 'grid-row':'span 6'}); //, opacity:0.8


  var butCalcHash=createElement('button').myAppend('Both').on('click', funCalcHash).disable();
  var divCalcHash=createElement('div').myAppend(butCalcHash).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center'});

  var butUniquifySM=createElement('button').myAppend('Both').on('click', funUniquifySM).disable();
  var divUniquifySM=createElement('div').myAppend(butUniquifySM).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-row':'span 1'}); //, 'grid-column':'span 3', 'grid-area':'1/1/span 1/span 2'   title:'Uniquify SM', 

  // var butFinish=createElement('button').myAppend('Both').on('click', funWriteToDb).prop({title:'Write to db and update timestamps (on both Source and Target).'}).disable();
  // var divFinish=createElement('div').myAppend(butFinish).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", 'text-align':'center', 'grid-column':'span 2'}); //

  el.myAppend(...DivButton, divCompareBoth, divGo, ...DivIdMatch, ...DivMat1, ...DivTabW, ...DivCalcHash, divCalcHash, ...DivUniquify, divUniquifySM, ...DivFinish); // , ...MiniViewSMMatch, divFinish, ...DivDbWrite

  el.css({'text-align':'left', display:'grid', 'grid-template-columns':'1fr 1fr auto auto', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px'}); //, flex:'0 0 auto', 'overflow-y':'auto'

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}
