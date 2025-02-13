
"use strict"



gThis.miniViewSMMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    //aRevert.myText(`-`).prop({title:undefined})
    if(boTarget){ divTDataList.clearUI(); }
    //[buttFindNewMTime, butWrite, butRevert].forEach(ele=>ele.disable())
    //buttFindNewMTime.disable();  //butWrite.disable(); //butRevert.disable();
  }
  el.setUI_SMMultiples=function(arg){
    var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent}=arg;
    aConsistent.myText(`${nPatConsistent} (${nTotConsistent})`).prop({title:StrConsistentShort?.join(`\n`)})
    aNonConsistent.myText(`${nPatNonConsistent} (${nTotNonConsistent})`).prop({title:StrNonConsistentShort?.join(`\n`)})
    //if(nPatNonConsistent){ buttFindNewMTime.enable();  }
  }
  el.setUI_NewMTime=function(arg){
    var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=arg
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
    //aRevert.myText(`${nRevert}`).prop({title:StrRevertShort?.join(`\n`)})
    //butWrite.enable(); //butRevert.enable();
  }

  el.setUIBasedOnSetting=function(arg){
    selTResCollision.value=arg.charTResCollision;
  }
  var headCollision=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('SM collisions').css({margin:'0 0.4em 0 0', display:'inline'}); //.prop({title:'SM (and hashes) are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'})
  var spanTRes=createElement('span').myAppend('tResCollision: ')

  var Opt=[];   for(var k of KeyTRes){ var optTmp=createElement('option').myText(k).prop('value',k);  Opt.push(optTmp); }
  var selTResCollision=createElement('select').myAppend(...Opt).on('change',async function(e){
    var [err]=await argumentTab.setTResCollision(this.value); if(err) {debugger; myConsole.error(err); return;}
  })
  var divTRes=createElement('span').myAppend(spanTRes, selTResCollision)


  var boTarget=charSide=='T'
  var smMultWork
  //var strHeadA=`SM-collisions`, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB
  var head=createElement('h3').css({'text-align':'left'}).myAppend(charSide).css({margin:'0'}); //.prop({title:'Where SM (and hashes) are read from the db-file (not from the actual files) (so make sure the db-file is updated)'})

  var divTDataList=createElement('div').css({'grid-area':'1/2', background:'var(--bg-colorEmp)'})
  if(boTarget){ divTDataListCreator(divTDataList);  } else divTDataList.hide()

  
    // FindCollision
  //var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find sm collisions")
  //var headFindCollision=createElement('div').css({'text-align':'left'}).myAppend(butSearch);
  var spanLab=createElement('span').myText('Consistent hash: ').prop({title:`Where within each "SM-colliding" group, all files have the same hash code. (Nothing will be done to these files)`}) // "SM-colliding" group: files with the same "SM" (size and modification time)
  var funConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashConsistent);
  var aConsistent=createElement('a').prop({href:''}).on('click',funConsistent);
  var imgOTO=createElement('img').prop({src:'icons/buvtSMToHash_OTO.png'}).css({zoom:'0.3'});
  var divSMMultHashConsistent=createElement('div').myAppend(spanLab, aConsistent, imgOTO)

  var spanLab=createElement('span').myText('Non-consistent hash: ').prop({title:`Where within each "SM-colliding" group there at least one file that has a hash code different from the others.`}) // "SM-colliding" group: files with the same "SM" (size and modification time)
  var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashNonConsistent);
  var aNonConsistent=createElement('a').prop({href:''}).addClass('input').on('click',fun);
  var imgOTM=createElement('img').prop({src:'icons/buvtSMToHash_OTM.png'}).css({zoom:'0.3'});
  var divSMMultHashNonConsistent=createElement('div').myAppend(spanLab, aNonConsistent, imgOTM)
  var ddFindCollision=createElement('dd').myAppend(divSMMultHashConsistent, divSMMultHashNonConsistent)
  
    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var aToChange=createElement('a').prop({href:''}).addClass('input').on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smToChange));
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  
  el.myAppend(headCollision, divTDataList, ddFindCollision, divNew).css({'text-align':'left'}); //head,  ,ddFindNewMTime, divSide, headReadOnly, ddReadOnly, divTRes, , butSearch, divRevert, divFindNewMTime

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}

gThis.miniViewHashMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    aRevert.myText(`-`).prop({title:undefined})
    if(boTarget){ divTDataList.clearUI(); }
    [butWrite, butRevert].forEach(ele=>ele.disable())
  }
  //var PathCur=gThis[`Path${charSide}`];
  var butSearch=createElement('button').myAppend('Search').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir}=result;

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
    //var flTargetF=fsTargetDataDir.slice(fsTargetDbDir.length).trim(); flTargetF=trim(flTargetF, charF)+charF
    
    // var [err, result]=await getFleF({boTarget, flTargetDataDir, fsTargetDbDir, strHostTarget}); if(err) {debugger; return [err];}
    // var {FleF, BoExist, indCur}=result
    // if(boTarget && flTargetDataDir){ divTDataList.setUI({FleF, BoExist, indCur}); }

    var arg=extend({}, {fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir, charTRes, charSide}); //FleF
    hashMultWork=new HashMultWork()
    var [err, result]=await hashMultWork.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent, nToChange, nRevert, StrToChangeShort, StrRevertShort}=result

    //var {n, nPatSM, nPatSMMult, nSMMult}=objSM
    aConsistent.myText(`${nPatConsistent} (${nTotConsistent})`).prop({title:StrConsistentShort?.join(`\n`)})
    aNonConsistent.myText(`${nPatNonConsistent} (${nTotNonConsistent})`).prop({title:StrNonConsistentShort?.join(`\n`)})
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
    aRevert.myText(`${nRevert}`).prop({title:StrRevertShort?.join(`\n`)})
    if(nToChange){ butWrite.enable(); butRevert.enable();}
    setMess(strLab+': Done'); blanket.hide();
  }).disable();
  var hashMultWork


  var boTarget=charSide=='T'
  //var strHeadA=`Hash-collisions`, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB;
  var head=createElement('h3').css({'text-align':'left'}).myAppend(charSide).css({margin:'0'});

  var divTDataList=createElement('div').css({'grid-area':'1/2', background:'var(--bg-colorEmp)'})
  if(boTarget){ divTDataListCreator(divTDataList);  } else divTDataList.hide()

  var html=`<input type="checkbox"><span class="slider round"></span>`;
  var labSwitch=createElement('label').addClass('switch').myHtml(html).css({'vertical-align':'middle'})
  var divSide=createElement('div').myAppend(`Source `, labSwitch, ` Target`)
  var [cbSide]=labSwitch.querySelectorAll('input')

    // FindCollision
  //var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find hash collisions")
  //var headB0=createElement('div').css({'text-align':'left'}).myAppend(butSearch);

  var spanLab=createElement('span').myText('Consistent SM: ')
  var funConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].hashMultSMConsistent);
  var aConsistent=createElement('a').prop({href:''}).on('click',funConsistent);
  var imgOTO=createElement('img').prop({src:'icons/buvtHashToSM_OTO.png'}).css({zoom:'0.3'});
  var divHashMultSMConsistent=createElement('div').myAppend(spanLab, aConsistent, imgOTO)

  var spanLab=createElement('span').myText('Non-consistent SM: ')
  var funNonConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].hashMultSMNonConsistent);
  var imgOTM=createElement('img').prop({src:'icons/buvtHashToSM_OTM.png'}).css({zoom:'0.3'});
  var aNonConsistent=createElement('a').prop({href:''}).addClass('input').on('click',funNonConsistent);
  var divHashMultSMNonConsistent=createElement('div').myAppend(spanLab, aNonConsistent, imgOTM)
  var dd0=createElement('dd').myAppend(divHashMultSMConsistent, divHashMultSMNonConsistent)


    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`].hsmToChange);
  var aToChange=createElement('a').prop({href:''}).addClass('input').on('click',fun);
  var butWrite=createElement('button').myText('Write').on('click', async function(){
    var strLab=`Changing mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err]=await hashMultWork.mySetMTime(gThis[`PathSingle${charSide}`].hsmToChange); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(strLab+': Done'); blanket.hide();
  });
  var headB1=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange, ' ', butWrite)

    // Revert
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Revert")
  var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`].hsmRevert);
  var aRevert=createElement('a').prop({href:''}).addClass('input').on('click',fun);
  var butRevert=createElement('button').myText('Write').on('click', async function(){
    var strLab=`Changing mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await hashMultWork.mySetMTime(gThis[`PathSingle${charSide}`].hsmRevert); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    //var {nRewrite, StrRevert}=result
    setMess(strLab+': Done'); blanket.hide();
  });
  var divRevert=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', aRevert, ' ', butRevert)

  el.myAppend(head, butSearch, divTDataList, dd0, headB1, divRevert).css({'text-align':'left'}); //  

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}



gThis.divCollisionHashWCreator=function(el){
  el.clearUI=function(){ miniViewHashMatchS.clearUI(); miniViewHashMatchT.clearUI(); }
  el.setUp=async function(){
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') { var label='(no-argument-selected)'; }
      else {debugger; myConsole.error(err); return;}
    }
    else { var {charTResCollision}=result; }
    //spanTResB.myText(charTResCollision);
    selTResCollision.value=charTResCollision;
  }
  var head=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('Fix hash collisions').prop({title:'Hash and SM are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'}).css({margin:'0 0.4em 0'})
  var spanTRes=createElement('span').myAppend('tResCollision: ')
  //var spanTResB=createElement('span');

  var Opt=[];   for(var k of KeyTRes){ var optTmp=createElement('option').myText(k).prop('value',k);  Opt.push(optTmp); }
  var selTResCollision=createElement('select').myAppend(...Opt).on('change',async function(e){
    var [err]=await argumentTab.setTResCollision(this.value); if(err) {debugger; myConsole.error(err); return;}
  })

  var divH=createElement('div').myAppend(head, spanTRes, selTResCollision).css({'grid-area':'1/1/span 1/span 2'})

  var miniViewHashMatchS=miniViewHashMatchCreator(createElement('div'), 'S', true)
  var miniViewHashMatchT=miniViewHashMatchCreator(createElement('div'), 'T', true)
  el.myAppend(divH, miniViewHashMatchS, miniViewHashMatchT).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'})
  el.hide()
  return el
}