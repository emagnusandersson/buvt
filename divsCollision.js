
"use strict"



gThis.miniViewSMMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    aRevert.myText(`-`).prop({title:undefined})
    if(boTarget){ divTDataList.clearUI(); }
    [buttFindNewMTime, butWrite, butRevert].forEach(ele=>ele.prop({disabled:true}))
  }
  var butSearch=createElement('button').myAppend('Search').attr({'title':undefined}).on('click', async function(){
    var strLab='Find SM collisions'
    //var charTRes=selTRes.value 
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();  el.clearUI()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDbDir, flTargetDataDir, strHostTarget, charTResCollision:charTRes }=result;

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
    //var flTargetF=fsTargetDataDir.slice(fsTargetDbDir.length).trim(); flTargetF=trim(flTargetF, charF)+charF
    
    if(boTarget && flTargetDataDir){
      var [err, {FlF, BoExist, indCur}]=await TDataReadNSync({flTargetDataDir, fsTargetDbDir, strHostTarget});
      divTDataList.setUI({FlF, BoExist, indCur});
    } else var FlF=[];

    var arg=extend({}, {fsSourceDir, fsTargetDbDir, fsTargetDataDir, charTRes, strHostTarget, charSide, FlF});
    smMultWork=new SMMultWork()
    var [err, result]=await smMultWork.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent}=result; //, nSMSkipList, StrSMSkipList

    
    aConsistent.myText(`${nPatConsistent} (${nTotConsistent})`).prop({title:StrConsistentShort?.join(`\n`)})
    aNonConsistent.myText(`${nPatNonConsistent} (${nTotNonConsistent})`).prop({title:StrNonConsistentShort?.join(`\n`)})
    if(nPatNonConsistent){ buttFindNewMTime.prop({disabled:false});  }
    setMess(strLab+': Done'); blanket.hide();
  });
  
  var boTarget=charSide=='T'
  var smMultWork
  //var strHeadA=`SM-collisions`, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB
  var head=createElement('h3').css({'text-align':'left'}).myAppend(charSide).css({margin:'0'}); //.prop({title:'Where SM (and hashes) are read from the db-file (not from the actual files) (so make sure the db-file is updated)'})

  var divTDataList=createElement('div').css({'grid-area':'1/2', background:'var(--bg-colorEmp)'})
  if(boTarget){ divTDataListCreator(divTDataList);  } else divTDataList.hide()

  
    // FindCollision
  //var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find sm collisions")
  //var headFindCollision=createElement('div').css({'text-align':'left'}).myAppend(butSearch);
  var spanLab=createElement('span').myText('Consistent hash: ').prop({title:`Where within each "SM-colliding"-group, all files have the same hash code. (Nothing will be done to these files)`})
  var funConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashConsistent);
  var aConsistent=createElement('a').prop({href:''}).on('click',funConsistent);
  var divSMMultHashConsistent=createElement('div').myAppend(spanLab, aConsistent)

  var spanLab=createElement('span').myText('Non-consistent hash: ').prop({title:`Where within each "SM-colliding"-group there at least one file that has a hash code different from the others.`})
  var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashNonConsistent);
  var aNonConsistent=createElement('a').prop({href:''}).addClass('input').on('click',fun);
  var divSMMultHashNonConsistent=createElement('div').myAppend(spanLab, aNonConsistent)
  var ddFindCollision=createElement('dd').myAppend(divSMMultHashConsistent, divSMMultHashNonConsistent)
  

    // FindNewMTime
  var buttFindNewMTime=createElement('button').myAppend(`Find`).css({'margin-right':'.4em'}).on('click', async function(){
    var strLab=`Find new mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await smMultWork.findNewMTime(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=result
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
    aRevert.myText(`${nRevert}`).prop({title:StrRevertShort?.join(`\n`)})
    butWrite.prop({disabled:false}); butRevert.prop({disabled:false});
    setMess(strLab+': Done'); blanket.hide();
  });
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find new mtimes").prop({title:`Find new mtimes so that the "Non-consistent-hash"-files (mentioned above) becomes "consistent-hash"-files`})
  var headFindNewMTime=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', buttFindNewMTime)

    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var butWrite=createElement('button').myText('Write').on('click', async function(){
    var strLab=`Changing mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err]=await smMultWork.mySetMTime(gThis[`PathSingle${charSide}`].smToChange); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(strLab+': Done'); blanket.hide();
  });
  var aToChange=createElement('a').prop({href:''}).addClass('input').on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smToChange));
  var headB2=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange, ' ', butWrite)

    // Revert
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Revert")
  var aRevert=createElement('a').prop({href:''}).addClass('input').on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smRevert));
  var butRevert=createElement('button').myText('Write').on('click', async function(){
    var strLab=`Changing mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err]=await smMultWork.mySetMTime(gThis[`PathSingle${charSide}`].smRevert); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(strLab+': Done'); blanket.hide();
  });
  var headB3=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aRevert, ' ', butRevert)
  
  el.myAppend(butSearch, divTDataList, ddFindCollision, headFindNewMTime, headB2, headB3).css({'text-align':'left'}); //head,  ,ddFindNewMTime, divSide, headReadOnly, ddReadOnly, divTRes, 

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
    [butWrite, butRevert].forEach(ele=>ele.prop({disabled:true}))
  }
  //var PathCur=gThis[`Path${charSide}`];
  var butSearch=createElement('button').myAppend('Search').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDbDir, flTargetDataDir, strHostTarget}=result;

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
    //var flTargetF=fsTargetDataDir.slice(fsTargetDbDir.length).trim(); flTargetF=trim(flTargetF, charF)+charF
    
    if(boTarget && flTargetDataDir){
      var [err, {FlF, BoExist, indCur}]=await TDataReadNSync({flTargetDataDir, fsTargetDbDir, strHostTarget});
      divTDataList.setUI({FlF, BoExist, indCur});
    } else var FlF=[];

    var arg=extend({}, {fsSourceDir, fsTargetDbDir, fsTargetDataDir, charTRes, strHostTarget, charSide, FlF});
    hashMultWork=new HashMultWork()
    var [err, result]=await hashMultWork.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent, nToChange, nRevert, StrToChangeShort, StrRevertShort}=result

    //var {n, nPatSM, nPatSMMult, nSMMult}=objSM
    aConsistent.myText(`${nPatConsistent} (${nTotConsistent})`).prop({title:StrConsistentShort?.join(`\n`)})
    aNonConsistent.myText(`${nPatNonConsistent} (${nTotNonConsistent})`).prop({title:StrNonConsistentShort?.join(`\n`)})
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
    aRevert.myText(`${nRevert}`).prop({title:StrRevertShort?.join(`\n`)})
    if(nToChange){ butWrite.prop({disabled:false}); butRevert.prop({disabled:false});}
    setMess(strLab+': Done'); blanket.hide();
  });
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
  var divHashMultSMConsistent=createElement('div').myAppend(spanLab, aConsistent)

  var spanLab=createElement('span').myText('Non-consistent SM: ')
  var funNonConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].hashMultSMNonConsistent);
  var aNonConsistent=createElement('a').prop({href:''}).addClass('input').on('click',funNonConsistent);
  var divHashMultSMNonConsistent=createElement('div').myAppend(spanLab, aNonConsistent)
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
  var headB2=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', aRevert, ' ', butRevert)

  el.myAppend(head, butSearch, divTDataList, dd0, headB1, headB2).css({'text-align':'left'}); //  

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}


gThis.divCollisionSMWCreator=function(el){
  el.clearUI=function(){ miniViewSMMatchS.clearUI(); miniViewSMMatchT.clearUI(); }
  el.setUp=function(arg){
    //spanTResB.myText(arg.charTResCollision);
    selTResCollision.value=arg.charTResCollision;
  }
  var head=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('Fix SM collisions').prop({title:'SM (and hashes) are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'}).css({margin:'0 0.4em 0'});
  var spanTRes=createElement('span').myAppend('tResCollision: ')
  //var spanTResB=createElement('span')

  var Opt=[];   for(var k of KeyTRes){ var optTmp=createElement('option').myText(k).prop('value',k);  Opt.push(optTmp); }
  var selTResCollision=createElement('select').myAppend(...Opt).on('change',async function(e){
    var [err]=await argumentTab.setTResCollision(this.value); if(err) {debugger; myConsole.error(err); return;}
  })

  //   
  var divH=createElement('div').myAppend(head, spanTRes, selTResCollision).css({'grid-area':'1/1/span 1/span 2'})
  var miniViewSMMatchS=miniViewSMMatchCreator(createElement('div'), 'S')
  var miniViewSMMatchT=miniViewSMMatchCreator(createElement('div'), 'T')
  el.myAppend(divH, miniViewSMMatchS, miniViewSMMatchT).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'}); //, 'grid-template-rows':'auto auto'
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
  return el
}