
"use strict"


gThis.miniViewSMMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    //aRevert.myText(`-`).prop({title:undefined})
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
  el.setUIBasedOnSetting=function(arg){ }
  var headCollision=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('SM collisions among hash-codes').css({margin:'0 0.4em 0 0', display:'inline'}).prop({title:'That is: files with the same hash-code may have the same SM.'})
 
  var img4=createElement('img').prop({src:'icons/buvtFix1TM_4.png'}).css({zoom:'0.4', 'grid-area':'1/1/span 2/span 1'});

    // FindCollision
  var spanLab=createElement('span').myText('1TM and MTM: ');//.prop({title:``}) // "SM-colliding" group: files with the same "SM" (size and modification time)     SM collisions among hashcodes
  var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashNonConsistent);
  var aNonConsistent=createElement('a').prop({href:''}).addClass('input').on('click',fun);
  var imgOTM=createElement('img').prop({src:'icons/buvtSMToHash_OTM.png'}).css({zoom:'0.3', 'vertical-align':'middle'});
  var divSMMultHashNonConsistent=createElement('div').myAppend(spanLab, aNonConsistent).css({'align-content':'center'}); //, ' ', imgOTM
  
  var spanLab=createElement('span').myText('1T1 and MT1 (involving multiple files): ').prop({title:`So all relations only involving a single file are not included in this number.`}) // "SM-colliding" group: files with the same "SM" (size and modification time)   SM collisions NOT among hashcodes (among files)
  var funConsistent=makeOpenExtCB(gThis[`PathSingle${charSide}`].smMultHashConsistent);
  var aConsistent=createElement('a').prop({href:''}).on('click',funConsistent);
  var imgOTO=createElement('img').prop({src:'icons/buvtSMToHash_OTO.png'}).css({zoom:'0.3', 'vertical-align':'middle'});
  var divSMMultHashConsistent=createElement('div').myAppend(spanLab, aConsistent).css({'align-content':'center'}); //, ' ', imgOTO
  
  var divGrid=createElement('div').myAppend(img4, divSMMultHashNonConsistent).css({display:'grid', 'grid-template-columns':'auto 1fr', 'grid-template-rows':'1fr 1fr', 'column-gap':'8px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'}); //, divSMMultHashConsistent

    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var aToChange=createElement('a').prop({href:''}).addClass('input').on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smToChange));
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  
  el.myAppend(divGrid, divNew).css({'text-align':'left'}); //headCollision, ddFindCollision, ddFindNewMTime, divSide, headReadOnly, ddReadOnly, , butSearch, divRevert, divFindNewMTime

  //el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}



gThis.miniViewHashMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    aRevert.myText(`-`).prop({title:undefined});
    [butWrite, butRevert].forEach(ele=>ele.disable())
  }
  //var PathCur=gThis[`Path${charSide}`];
  var butSearch=createElement('button').myAppend('Search').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir}=result;

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

  el.myAppend(head, butSearch, dd0, headB1, divRevert).css({'text-align':'left'}); //

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}


gThis.divCollisionHashWCreator=function(el){
  el.clearUI=function(){ miniViewHashMatchS.clearUI(); miniViewHashMatchT.clearUI(); }
  el.setUp=async function(){
  }
  var head=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('Fix hash collisions').prop({title:'Hash and SM are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'}).css({margin:'0 0.4em 0'})
  
  var divH=createElement('div').myAppend(head).css({'grid-area':'1/1/span 1/span 2'})

  var miniViewHashMatchS=miniViewHashMatchCreator(createElement('div'), 'S', true)
  var miniViewHashMatchT=miniViewHashMatchCreator(createElement('div'), 'T', true)
  el.myAppend(divH, miniViewHashMatchS, miniViewHashMatchT).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'})
  //el.hide()
  return el
}
