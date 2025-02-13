
"use strict"



gThis.strTitleExtraTargetF=`Other target folders from other back-ups (from other computers perhaps).
All target folders (including the current) are read-only. (Only entries outside of these folders have their mtime changed.)`;

gThis.miniViewSMMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    aRevert.myText(`-`).prop({title:undefined})
    //dlExtraTargetF.myText('')
    dlExtraTargetF.empty();
    [buttFindNewMTime, butWrite, butRevert].forEach(ele=>ele.prop({disabled:true}))
  }
  var butFind=createElement('button').myAppend('Find').attr({'title':undefined}).on('click', async function(){
    var strLab='Find SM collisions'
    var charTRes=selTRes.value 
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();  el.clearUI()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote }=result;
    // var boTarget=charSide=='T'
    // var fiDir=boTarget?fiTargetDbDir:fiSourceDir
    // var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    //var arg=extend({}, {fiDir, fiDbDir, charTRes, strHostTarget, boRemote, fiTargetDir, fiTargetDbDir, charSide})

    var [err, [fsSourceDir, fsTargetDir, fsTargetDbDir]]=await myRealPathArr([fiSourceDir, fiTargetDir, fiTargetDbDir], strHostTarget); if(err) {debugger; return [err]; }
    var flTargetF=fsTargetDir.slice(fsTargetDbDir.length).trim(); flTargetF=trim(flTargetF, charF)
    //var extraTargetFReaderWriter=new ExtraTargetFReaderWriter({fsTargetDir, fsTargetDbDir, strHostTarget});
    //var [err, {FlF, FlExtraF}]=await extraTargetFReaderWriter.read(flTargetF); if(err) {debugger; return [err]; }
    
    var FlExtraF=[]
    if(boTarget){
      var strExtraTargetF=""
      if(flTargetF){
        var flTargetF=flTargetF+charF
        var extraTargetFReaderWriter=new ExtraTargetFReaderWriter({fsTargetDir, fsTargetDbDir, strHostTarget});
        var [err, {FlF, FlExtraF}]=await extraTargetFReaderWriter.read(flTargetF); if(err) {debugger; return [err]; }
        extraTargetFReaderWriter.mergeIn(flTargetF);
        var [err]=await extraTargetFReaderWriter.write(); if(err) {debugger; return [err]; }
        strExtraTargetF=FlExtraF.join('\n')

        var FsExtraF=FlExtraF.map(flTmp=>fsTargetDbDir+charF+flTmp)
        var [err, BoExist]=await fileExistArr(FsExtraF); if(err) {debugger; return [err];}
        var Dd=[]
        for(var i=0;i<FlExtraF.length;i++){
          var flExtraF=FlExtraF[i]
          var dd=createElement('dd').myText(flExtraF);
          if(!BoExist[i]) dd.css({background:'var(--bg-red'}).attr({title:'Path does not exist'})
          Dd[i]=dd
        }
      }
      dlExtraTargetF.empty().myAppend(...Dd)
      //dlExtraTargetF.myText(strExtraTargetF)
      divExtraTargetF.toggle(Dd.length);
    }


    var arg=extend({}, {fiSourceDir, fiTargetDir, fiTargetDbDir, charTRes, strHostTarget, boRemote, charSide, FlExtraF});
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
  var strHeadA=`SM-collisions`, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB
  var head=createElement('h3').css({'text-align':'left'}).myAppend(strHead).prop({title:'Where SM (and hashes) are read from the db-file (not from the actual files) (so make sure the db-file is updated)'}).css({margin:'0'});

  var labExtraTargetF=createElement('span').myAppend('Extra Target folders: ').attr({title:strTitleExtraTargetF})
  var dlExtraTargetF=createElement('div').css({'vertical-align':'middle'}) //.attr({disabled:true})
  var divExtraTargetF=createElement('div').myAppend(labExtraTargetF, dlExtraTargetF).css({'grid-area':'1/2', background:'var(--bg-colorEmp)'})
  //divExtraTargetF.toggle(boTarget)
  divExtraTargetF.hide()

    // tRes
  var Opt=[];
  for(var k of KeyTRes){ var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt); }
  var selTRes=createElement('select').myAppend(...Opt); selTRes.value=9
  var labTRes=createElement('label').myText(`TRes: `).prop({title:'mod-time-resolution'})
  var divTRes=createElement('div').myAppend(labTRes, selTRes)

  
    // FindCollision
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find sm collisions")
  var headFindCollision=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", butFind);
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
  
  el.myAppend(head, divTRes, headFindCollision, divExtraTargetF, ddFindCollision, headFindNewMTime, headB2, headB3).css({'text-align':'left'}); //,ddFindNewMTime, divSide, headReadOnly, ddReadOnly

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}


gThis.divCollisionSMWCreator=function(el){
  el.clearUI=function(){ miniViewSMMatchS.clearUI(); miniViewSMMatchT.clearUI(); }
  var miniViewSMMatchS=miniViewSMMatchCreator(createElement('div'), 'S', true)
  var miniViewSMMatchT=miniViewSMMatchCreator(createElement('div'), 'T', true)
  el.myAppend(miniViewSMMatchS, miniViewSMMatchT).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'})
  return el
}

gThis.divCollisionHashWCreator=function(el){
  el.clearUI=function(){ miniViewHashMatchS.clearUI(); miniViewHashMatchT.clearUI(); }
  var miniViewHashMatchS=miniViewHashMatchCreator(createElement('div'), 'S', true)
  var miniViewHashMatchT=miniViewHashMatchCreator(createElement('div'), 'T', true)
  el.myAppend(miniViewHashMatchS, miniViewHashMatchT).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'})
  return el
}

gThis.miniViewHashMatchCreator=function(el, charSide='S', boTab=false){
  el.clearUI=function(){
    aConsistent.myText(`-`).prop({title:undefined})
    aNonConsistent.myText(`-`).prop({title:undefined})
    aToChange.myText(`-`).prop({title:undefined})
    aRevert.myText(`-`).prop({title:undefined})
    //dlExtraTargetF.myText('')
    dlExtraTargetF.empty();
    [butWrite, butRevert].forEach(ele=>ele.prop({disabled:true}))
  }
  //var PathCur=gThis[`Path${charSide}`];
  var butFind=createElement('button').myAppend('Find').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}=result;
    // var boTarget=charSide=='T'
    // var fiDir=boTarget?fiTargetDbDir:fiSourceDir
    // var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    // var arg=extend({}, {fiDir, fiDbDir, charTRes, strHostTarget, boRemote, charSide})

    var [err, [fsSourceDir, fsTargetDir, fsTargetDbDir]]=await myRealPathArr([fiSourceDir, fiTargetDir, fiTargetDbDir], strHostTarget); if(err) {debugger; return [err]; }
    var flTargetF=fsTargetDir.slice(fsTargetDbDir.length).trim(); flTargetF=trim(flTargetF, charF)
    //var extraTargetFReaderWriter=new ExtraTargetFReaderWriter({fsTargetDir, fsTargetDbDir, strHostTarget});
    //var [err, {FlF,FlExtraF}]=await extraTargetFReaderWriter.read(flTargetF); if(err) {debugger; return [err]; }
   
    var FlExtraF=[]
    if(boTarget){
      var strExtraTargetF=""
      if(flTargetF){
        var flTargetF=flTargetF+charF
        var extraTargetFReaderWriter=new ExtraTargetFReaderWriter({fsTargetDir, fsTargetDbDir, strHostTarget});
        var [err, {FlF, FlExtraF}]=await extraTargetFReaderWriter.read(flTargetF); if(err) {debugger; return [err]; }
        extraTargetFReaderWriter.mergeIn(flTargetF);
        var [err]=await extraTargetFReaderWriter.write(); if(err) {debugger; return [err]; }
        strExtraTargetF=FlExtraF.join('\n')

        var FsExtraF=FlExtraF.map(flTmp=>fsTargetDbDir+charF+flTmp)
        var [err, BoExist]=await fileExistArr(FsExtraF); if(err) {debugger; return [err];}
        var Dd=[]
        for(var i=0;i<FlExtraF.length;i++){
          var flExtraF=FlExtraF[i]
          var dd=createElement('dd').myText(flExtraF);
          if(!BoExist[i]) dd.css({background:'var(--bg-red'}).attr({title:'Path does not exist'})
          Dd[i]=dd
        }
      }
      dlExtraTargetF.empty().myAppend(...Dd)
      //dlExtraTargetF.myText(strExtraTargetF)
      divExtraTargetF.toggle(Dd.length)
    }

    var arg=extend({}, {fiSourceDir, fiTargetDir, fiTargetDbDir, charTRes, strHostTarget, boRemote, charSide, FlExtraF});
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
  var strHeadA=`Hash-collisions`, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB
  var head=createElement('h3').css({'text-align':'left'}).myAppend(strHead).prop({title:'... as read from the (source side) db-file'}).css({margin:'0'});

  var labExtraTargetF=createElement('span').myAppend('Extra Target folders: ').attr({title:strTitleExtraTargetF})
  var dlExtraTargetF=createElement('div').css({'vertical-align':'middle'})
  var divExtraTargetF=createElement('div').myAppend(labExtraTargetF, dlExtraTargetF).css({'grid-area':'1/2', background:'var(--bg-colorEmp)'}).attr({title:strTitleExtraTargetF})
  //divExtraTargetF.toggle(boTarget)
  divExtraTargetF.hide()

  var html=`<input type="checkbox"><span class="slider round"></span>`;
  var labSwitch=createElement('label').addClass('switch').myHtml(html).css({'vertical-align':'middle'})
  var divSide=createElement('div').myAppend(`Source `, labSwitch, ` Target`)
  var [cbSide]=labSwitch.querySelectorAll('input')

    // FindCollision
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find hash collisions")
  var headB0=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", butFind);

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

  el.myAppend(head, headB0, divExtraTargetF, dd0, headB1, headB2).css({'text-align':'left'}); // , divSide

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}
