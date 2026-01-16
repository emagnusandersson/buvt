
"use strict"


gThis.miniViewSMMatchCreator=function(el, charSide='S'){
  el.clearUI=function(){
    [...Alink].forEach(ele=>ele.myText(`-`).prop({title:undefined}))
    span1T1_single.myText(`-`)
    aToChange.myText(`-`).prop({title:undefined});
  }
  el.setUI_SMMultiples=function(arg){
    var { nTot1TM, nPat1TM, nTotMTM, nPatMTM, n1T1_single, nTot1T1_mult, nPat1T1_mult, nTotMT1, nPatMT1, Str1TMShort, StrMTMShort, StrXTMShort, Str1T1_mult_Short, StrMT1Short}=arg;

    a1TM.myText(`${nPat1TM} (${nTot1TM})`).prop({title:Str1TMShort?.join(`\n`)})
    aMTM.myText(`${nPatMTM} (${nTotMTM})`).prop({title:StrMTMShort?.join(`\n`)})
    span1T1_single.myText(`${n1T1_single}`)
    a1T1_mult.myText(`${nPat1T1_mult} (${nTot1T1_mult})`).prop({title:Str1T1_mult_Short?.join(`\n`)})
    aMT1.myText(`${nPatMT1} (${nTotMT1})`).prop({title:StrMT1Short?.join(`\n`)})

    var nPatXTM=nPat1TM+nPatMTM, nTotXTM=nTotMTM+nTotMTM
    aXTM.myText(`${nPatXTM} (${nTotXTM})`).prop({title:StrXTMShort?.join(`\n`)})
  }
  el.setUI_NewMTime=function(arg){
    var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=arg
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
  }
  el.setUIBasedOnSetting=function(arg){ }

  var headCollision=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('SM collisions among hash-codes').css({margin:'0 0.4em 0 0', display:'inline'}).prop({title:'That is: files with the same hash-code may have the same SM.'})


  var htmlBody=
  `<tr><td colspan=2><img/><a/></td> <td><img/><a/></td> <td><span>To be fixed</span><br/><span>∑: </span><a/></td></tr>
  <tr><td><img/><span/></td> <td><img/><a/></td> <td><img/><a/></td></tr>`; // <td><span>OK (Ignored)</span></td>
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tBody).css({'border-collapse':'separate', borderSpacing: '0px 0px'});

  var Tr=tBody.children, [tr0, tr1]=Tr,  Td0=tr0.children, [td1TM, tdMTM]=Td0, Td1=tr1.children, [td1T1_single, td1T1_mult, tdMT1]=Td1

  var Img=tBody.querySelectorAll('img'), [img1TM, imgMTM, img1T1, img1T1mult, imgMT1]=Img;
  var Span=tBody.querySelectorAll('span'), [spanToBeFixed, spanSum, span1T1_single, spanIgnored]=Span
  var Alink=tBody.querySelectorAll('a'), [a1TM, aMTM, aXTM, a1T1_mult, aMT1]=Alink;

  var fleImgT="icons/SM2Hash/";
  var LeafImg=['buvtSMToHash_1TM.png', 'buvtSMToHash_MTM.png', 'buvtSMToHash_1T1_singleC.png', 'buvtSMToHash_1T1_multC.png', 'buvtSMToHash_MT1.png'];
  [...Img].forEach(   (ele, i)=>ele.attr({src:`${fleImgT}${LeafImg[i]}`}).css({zoom:0.4, display:'block'})   );
  img1TM.css({margin:'auto'});

  [...Td0, ...Td1, table].forEach(   (ele, i)=>ele.css({'border':'0px'})   );
  [td1TM, tdMTM, td1T1_single, td1T1_mult, tdMT1].forEach(   (ele, i)=>ele.css({'border':'1px solid'})   );
  td1T1_single.css({'border-right':'0'}); td1T1_mult.css({'border-left':'0'});


    // Coloring top/bottom borders
  [td1TM, tdMTM].forEach(   (ele, i)=>ele.css({'border-top':'var(--text-red) solid', 'border-bottom':'var(--text-red) solid'})   );
  //[td1T1_single, td1T1_mult, tdMT1].forEach(   (ele, i)=>ele.css({'border-top':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'})   );

    // Coloring right/left borders
  td1TM.css({'border-left':'var(--text-red) solid'});
  tdMTM.css({'border-right':'var(--text-red) solid'});
  // td1T1_single.css({'border-left':'var(--text-green) solid'});
  // tdMT1.css({'border-right':'var(--text-green) solid'});

   
  [tdMTM, tdMT1].forEach(ele=>ele.css({'border-left':'0'}));  // Border between between 1TX and MTX

  spanToBeFixed.css({color:'var(--text-red)', 'font-weight': 'bolder'});
  //spanIgnored.css({color:'var(--text-green)', 'font-weight': 'bolder'});

  var StrTmp=["collision1TM", "collisionMTM", "collisionXTM", "collision1T1_mult", "collisionMT1"];
  [...Alink].forEach((ele,i)=>{
    var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`][StrTmp[i]]);  ele.prop({href:""}).on('click', fun);
  });

    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var aToChange=createElement('a').prop({href:''}).on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smToChange)); //.addClass('input')
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  
  el.myAppend(table, divNew).css({'text-align':'left'}); //headCollision

  el.clearUI()
  return el
}



gThis.miniViewSMUnifyCreator=function(el){
  el.setUp=function(){
  }
  el.clearUI=function(){
    [...Alink].forEach(ele=>ele.myText(`-`).prop({title:undefined}))
    span1T1_single.myText(`-`)
    aToChange.myText(`-`).prop({title:undefined});
    butWrite.disable()
  }
  el.setUI_SMMultiples=function(arg){
    var { nTot1TM, nPat1TM, nTotMTM, nPatMTM, n1T1_single, nTot1T1_mult, nPat1T1_mult, nTotMT1, nPatMT1, Str1TMShort, StrMTMShort, StrXTMShort, Str1T1_mult_Short, StrMT1Short}=arg;

    a1TM.myText(`${nPat1TM} (${nTot1TM})`).prop({title:Str1TMShort?.join(`\n`)})
    aMTM.myText(`${nPatMTM} (${nTotMTM})`).prop({title:StrMTMShort?.join(`\n`)})
    span1T1_single.myText(`${n1T1_single}`)
    a1T1_mult.myText(`${nPat1T1_mult} (${nTot1T1_mult})`).prop({title:Str1T1_mult_Short?.join(`\n`)})
    aMT1.myText(`${nPatMT1} (${nTotMT1})`).prop({title:StrMT1Short?.join(`\n`)})
  }
  // el.setUI_NewMTime=function(arg){
  //   var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=arg
  //   aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
  // }

  var openExtCBLoc=function(ev){
    boTarget=vippTarget.getStat();
    var charSide=boTarget?'T':'S';
    var key=this.attr('data-key')
    var pathTmp=gThis[`PathSingle${charSide}`][key]
    var fun=makeOpenExtCB(pathTmp);  fun.call(this, ev)
  }
  var funRadioClick=function(){
    el.clearUI()
    boTarget=vippTarget.getStat();
  };
  var funGo=async function(){
    boTarget=vippTarget.getStat();
    var charSide=boTarget?'T':'S';
    var strLab=`Find hash collisions`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    argGeneral=argGeneralT
    var {objOptSource, objOptTarget, fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir}=argGeneral;
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes}=objOptSide;

    var [err, result]=await MultWorkB.readData({argGeneral, charSide}); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    //var {arrDb_Others, arrDb_Own}=result; arrDbSelection=arrDb_Own;
    //arrDb_Others=result.arrDb_Others; arrDb_Own=result.arrDb_Own
    ({arrDb_Others, arrDb_Own}=result);
    //var arg=extend({}, {fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir, charTRes, charSide}); //FleF
    var [err, result]=await MultWork.getMult({arrDbSelection:arrDb_Own, charSide}); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {BundMT1, StrConsistentShort, StrNonConsistentShort, nTotXT1, nPatXT1, nTotXTM, nPatXTM, nToChange, nRevert, StrToChangeShort, StrRevertShort}=result;

    el.setUI_SMMultiples(result);

    //a1TX.myText(`${nPatXT1} (${nTotXT1})`).prop({title:StrConsistentShort?.join(`\n`)})
    //aMTX.myText(`${nPatXTM} (${nTotXTM})`).prop({title:StrNonConsistentShort?.join(`\n`)})

    var [err, result]=await MultWorkB.findNewMTime({BundMT1, arrDbSelection:arrDb_Own, charTRes, charSide}); if(err) {debugger; return [err];}
    var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=result;
    ({arrToChange}=result)

    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
    if(nToChange){ butWrite.enable();}
    setMess(strLab+': Done'); blanket.hide();
  }
  var funWrite=async function(){
    var strLab=`Changing mtimes`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();

    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes}=objOptSide
    
    MultWork.copyTDiff(arrDb_Own, arrToChange, charTRes)

    var arrDbNew=[].concat(arrDb_Others, arrDb_Own);

    var argTmp=copySome({}, objOptSide, ["fsDbDir", "fsDb", "strHost"]);
    var [err]=await MultWork.mySetMTime(arrToChange, arrDbNew, argTmp); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    butWrite.disable();
    setMess(strLab+': Done'); blanket.hide();
  }
  var arrDb_Others, arrDb_Own, boTarget=0, argGeneral, arrToChange

  var htmlTmp=`<label>Source</label><input/><input/><label>Target</label>`
  var vippTarget=createElement('div').myHtml(htmlTmp).css({margin:'0 0 1em'});
  vippButtonExtend(vippTarget, 'strSourceOrTarget3', funRadioClick);

  var butGo=createElement('button').myAppend('Go').attr({'title':undefined}).on('click', funGo);

  var head=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('Unify SM for individual hashcodes').prop({title:'Hash and SM are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'}).css({margin:'0 0.4em 0'})
  //var headA=createElement('h3').css({'text-align':'left'}).myAppend(charSide).css({margin:'0'});


  var htmlBody=
  `<tr><td colspan=2><img/><a/></td> <td><img/><a/></td></tr>
  <tr><td><img/><span/></td> <td><img/><a/></td> <td><img/><a/></td></tr>
  <tr><td colspan=2><span></span></td> <td><span>To be fixed</span></td> </tr>`; //<br/><span>∑: </span><a/> (Ignored)
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tBody).css({'border-collapse':'separate', borderSpacing: '0px 0px'});

  var Tr=tBody.children, [tr0, tr1, tr2]=Tr,  Td0=tr0.children, [td1TM, tdMTM]=Td0, Td1=tr1.children, [td1T1_single, td1T1_mult, tdMT1]=Td1, Td2=tr2.children, []=Td2

  var Img=tBody.querySelectorAll('img'), [img1TM, imgMTM, img1T1, img1T1mult, imgMT1]=Img;
  var Span=tBody.querySelectorAll('span'), [span1T1_single, spanIgnored, spanToBeFixed, spanSum]=Span
  var Alink=tBody.querySelectorAll('a'), [a1TM, aMTM, a1T1_mult, aMT1]=Alink; //aMTX

  var fleImgT="icons/SM2Hash/";
  var LeafImg=['buvtSMToHash_1TM.png', 'buvtSMToHash_MTM.png', 'buvtSMToHash_1T1_singleC.png', 'buvtSMToHash_1T1_multC.png', 'buvtSMToHash_MT1.png'];
  [...Img].forEach(   (ele, i)=>ele.attr({src:`${fleImgT}${LeafImg[i]}`}).css({zoom:0.4, display:'block'})   );
  img1TM.css({margin:'auto'});

  [...Td0, ...Td1, table].forEach(   (ele, i)=>ele.css({'border':'0px'})   );
  [td1TM, tdMTM, td1T1_single, td1T1_mult, tdMT1].forEach(   (ele, i)=>ele.css({'border':'1px solid'})   );
  td1T1_single.css({'border-right':'0'}); td1T1_mult.css({'border-left':'0'});

  [td1T1_single, td1T1_mult].forEach(   (ele, i)=>ele.css({'border-top':'0'})   );
  tdMTM.css({'border-left':'0'});

    // Coloring borders 
  //td1TM.css({'border-left':'var(--text-green) solid', 'border-top':'var(--text-green) solid', 'border-right':'1px solid', 'border-bottom':'1px solid'});
  //tdMTM.css({'border-top':'var(--text-green) solid', 'border-right':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'});
  //td1T1_single.css({'border-left':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'});
  //td1T1_mult.css({'border-bottom':'var(--text-green) solid', 'border-right':'var(--text-green) solid'});
  tdMT1.css({'border':'var(--text-red) solid', 'translate':'2px 2px'});


  spanToBeFixed.css({color:'var(--text-red)', 'font-weight': 'bolder'});
  //spanIgnored.css({color:'var(--text-green)', 'font-weight': 'bolder'});

  var StrTmp=["collision1TM", "collisionMTM", "collision1T1_mult", "collisionMT1"];
  [...Alink].forEach((ele,i)=>{
    ele.prop({href:""}).attr({'data-key':StrTmp[i]}).on('click', openExtCBLoc);
  });


  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var fun=makeOpenExtCB(PathLoose.hashCollisionUnifyToChange);
  var aToChange=createElement('a').prop({href:''}).on('click', fun); //.addClass('input')
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  var butWrite=createElement('button').myAppend('Write to db and update mtimes').css({margin:'auto'}).on('click', funWrite).disable(); //.on('click', funWriteToDb)
  var divWrite=createElement('div').myAppend(butWrite);

  el.myAppend(head, vippTarget, butGo, table, divNew, divWrite).css({'text-align':'left'}); //, divRevert

  el.css({background:"var(--bg-color)"});
  el.clearUI()
  return el
}




gThis.miniViewHashMatchDeleteCreator=function(el){
  //var PathCur=gThis[`Path${charSide}`];

  var funRadioClick=function(){
    el.clearUI()
    boTarget=vippTarget.getStat();
  }
  var funFind=async function(){
    boTarget=vippTarget.getStat();
    var charSide=boTarget?'T':'S';
    var strLab=`Find hash collisions`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    
    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    argGeneral=argGeneralT

    hashMultWorkDelete=new HashMultWorkDelete();
    var arg={charSide, argGeneral}
    var [err, result]=await hashMultWorkDelete.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrKeepShort, nPat, nTot}=result

    //var {n, nPatSM, nPatSMMult, nSMMult}=objSM
    aToKeep.myText(`${nPat} (${nTot})`).prop({title:StrKeepShort?.join(`\n`)})
    setMess(strLab+': Done'); blanket.hide();
  }
  var funDelete=async function(){
    var strLab=`Deleting`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var charSide=boTarget?'T':'S';
    var [err]=await hashMultWorkDelete.delete({charSide, argGeneral}); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(strLab+': Done'); blanket.hide();
  }
  var argGeneral, hashMultWorkDelete, boTarget=0;


  var htmlTmp=`<label>Source</label><input/><input/><label>Target</label>`
  var vippTarget=createElement('div').myHtml(htmlTmp).css({margin:'0 0 1em'});
  vippButtonExtend(vippTarget, 'strSourceOrTarget4', funRadioClick);

  var butFind=createElement('button').myAppend('Find').attr({'title':undefined}).on('click', funFind);


  var strHeadA=`Find / Delete duplicates (hash colliders)`;
  var head=createElement('h3').css({'text-align':'left'}).myAppend(strHeadA).prop({title:'... as read from the (source side) db-file'}); //.css({margin:'0'});

  var html=`<input type="checkbox"><span class="slider round"></span>`;
  var labSwitch=createElement('label').addClass('switch').myHtml(html).css({'vertical-align':'middle'})
  var divSide=createElement('div').myAppend(`Source `, labSwitch, ` Target`)
  var [cbSide]=labSwitch.querySelectorAll('input')

    // FindCollision
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Find hash collisions")
  var headB0=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", butFind);

  var spanLab=createElement('span').myText('Hash collisions (To Keep): ').prop({title:'Entries in this file are kept (delete those entries that you want deleted)'})
  var funToKeep=makeOpenExtCB(PathLoose.hashCollisionKeep);
  var aToKeep=createElement('a').prop({href:''}).myAppend(`-`).prop({title:undefined}).on('click',funToKeep);
  var divToKeep=createElement('div').myAppend(spanLab, aToKeep)
  var dd0=createElement('dd').myAppend(divToKeep)


    // Delete
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Delete according to file").prop({title:'Delete according to the file above'})
  var butDelete=createElement('button').myText('Delete').on('click', funDelete);
  var headB1=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', butDelete)


  el.myAppend(head, vippTarget, headB0, dd0, headB1).css({'text-align':'left'}); // , divSide

  el.css({background:"var(--bg-color)"});
  return el
}

