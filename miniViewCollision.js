
"use strict"


gThis.miniViewRelationFixingCreator=function(el, charSide='S'){
  el.clearUI=function(){
    [...Alink].forEach(ele=>ele.myText(`-`).prop({title:undefined}))
    span1T1_single.myText(`-`)
    aToChange.myText(`-`).prop({title:undefined});
  }
  el.setUI_SMMultiples=function(arg){
    var {n1T1_single, nTot1T1_mult, nPat1T1_mult, 
      nTotMT1, nPatMT1_sm, nPatMT1_hash, 
      nTot1TM, nPat1TM_sm, nPat1TM_hash, 
      nTotMTM, nPatMTM_sm, nPatMTM_hash}=arg;
    var {Str1T1_mult_Short, StrMT1Short, Str1TMShort, StrMTMShort, Str1MToMShort}=arg;

    span1T1_single.myText(`${n1T1_single}`)
    a1T1_mult.myText(`${nPat1T1_mult} (${nTot1T1_mult})`).prop({title:Str1T1_mult_Short?.join(`\n`)})
    aMT1.myText(`${nPatMT1_sm} (${nTotMT1}) ${nPatMT1_hash}`).prop({title:StrMT1Short?.join(`\n`)})
    a1TM.myText(`${nPat1TM_sm} (${nTot1TM}) ${nPat1TM_hash}`).prop({title:Str1TMShort?.join(`\n`)})
    aMTM.myText(`${nPatMTM_sm} (${nTotMTM}) ${nPatMTM_hash}`).prop({title:StrMTMShort?.join(`\n`)})

    var nPat1MToM_sm=nPat1TM_sm+nPatMTM_sm, nTot1MToM=nTotMTM+nTotMTM, nPat1MToM_hash=nPat1TM_hash+nPatMTM_hash
    a1MToM.myText(`${nPat1MToM_sm} (${nTot1MToM}) ${nPat1MToM_hash}`).prop({title:Str1MToMShort?.join(`\n`)})
  }
  el.setUI_NewMTime=function(arg){
    var {nToChange, StrToChangeShort, nRevert, StrRevertShort}=arg
    aToChange.myText(`${nToChange}`).prop({title:StrToChangeShort?.join(`\n`)})
  }
  el.setUIBasedOnSetting=function(arg){ }

  var headCollision=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('SM collisions among hash-codes').css({margin:'0 0.4em 0 0', display:'inline'}).prop({title:'That is: files with the same hash-code may have the same SM.'})


  var htmlBody=
  `<tr><td><img/><span/></td> <td><img/><a/></td> <td><img/><a/></td><td></td></tr>
  <tr><td colspan=2><img/><a/></td> <td><img/><a/></td> <td><span>These relations (1M-To-M) needs to be fixed.</span><br/><span>∑: </span><a/></td></tr>`; // <td><span>OK (Ignored)</span></td>
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tBody).css({'border-collapse':'separate', borderSpacing: '0px 0px'});

  var Tr=tBody.children, [tr0, tr1]=Tr,  Td0=tr0.children, [td1T1_single, td1T1_mult, tdMT1, tdHelp]=Td0, Td1=tr1.children, [td1TM, tdMTM]=Td1

  var Img=tBody.querySelectorAll('img'), [img1T1, img1T1mult, imgMT1, img1TM, imgMTM]=Img;
  var Span=tBody.querySelectorAll('span'), [span1T1_single, spanToBeFixed, spanSum]=Span; //, spanIgnored
  var Alink=tBody.querySelectorAll('a'), [a1T1_mult, aMT1, a1TM, aMTM, a1MToM]=Alink;

  var fleImgT="icons/SM2Hash/";
  var LeafImg=['buvtSMToHash_1T1_singleC.png', 'buvtSMToHash_1T1_multC.png', 'buvtSMToHash_MT1.png', 'buvtSMToHash_1TM.png', 'buvtSMToHash_MTM.png'];
  [...Img].forEach(   (ele, i)=>ele.attr({src:`${fleImgT}${LeafImg[i]}`}).css({zoom:0.4, display:'block'})   );
  img1TM.css({margin:'auto'});

  [...Td0, ...Td1, table].forEach(   (ele, i)=>ele.css({'border':'0px'})   );
  [td1T1_single, td1T1_mult, tdMT1, td1TM, tdMTM].forEach(   (ele, i)=>ele.css({'border':'1px solid'})   );
  td1T1_single.css({'border-right':'0'}); td1T1_mult.css({'border-left':'0'});


    // Coloring top/bottom borders
  [td1TM, tdMTM].forEach(   (ele, i)=>ele.css({'border-top':'var(--text-red) solid', 'border-bottom':'var(--text-red) solid'})   );
  //[td1T1_single, td1T1_mult, tdMT1].forEach(   (ele, i)=>ele.css({'border-top':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'})   );

    // Coloring right/left borders
  td1TM.css({'border-left':'var(--text-red) solid'});
  tdMTM.css({'border-right':'var(--text-red) solid'});
  // td1T1_single.css({'border-left':'var(--text-green) solid'});
  // tdMT1.css({'border-right':'var(--text-green) solid'});

   
  [tdMTM, tdMT1].forEach(ele=>ele.css({'border-left':'0'}));  // Border between between 1To1M and MTo1M

  spanToBeFixed.css({color:'var(--text-red)', 'font-weight': 'bolder'}).attr({title:'1-To-Many and Many-To-Many'});
  //spanIgnored.css({color:'var(--text-green)', 'font-weight': 'bolder'});

  var StrTmp=["collision1T1_mult", "collisionMT1", "collision1TM", "collisionMTM", "collision1MToM"];
  [...Alink].forEach((ele,i)=>{
    var fun=makeOpenExtCB(gThis[`PathSingle${charSide}`][StrTmp[i]]);  ele.prop({href:""}).on('click', fun);
  });

  var divHelp=divHelpProt.cloneNode(1).myHtml(htmlHelpCellNumbers).css({'max-width':'24em'})
  var imgHelp=hovHelp.cloneNode(1).css({margin:'0em .4em'}); popupHover(imgHelp, divHelp);
  tdHelp.myAppend(imgHelp);

    // MakeUnifrom
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var aToChange=createElement('a').prop({href:''}).on('click',makeOpenExtCB(gThis[`PathSingle${charSide}`].smToChange)); //.addClass('input')
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  
  el.myAppend(table, divNew).css({'text-align':'left'}); //headCollision

  el.clearUI()
  return el
}

gThis.htmlHelpCellNumbers=`Explanation of numbers in the table:<br/>
<b>nSM</b> (<b>nEntry</b>) <b>nHash</b>
<dl>
<dt>nSM</dt><dd>number of SM patterns</dd>
<dt>nEntry</dt><dd>number of entries (files, soft links)</dd>
<dt>nHash</dt><dd>number of hash patterns</dd>
</dl>`


gThis.miniViewSMUnifyCreator=function(el){  // in viewExtra
  el.setUp=function(){
  }
  el.clearUI=function(){
    [...Alink].forEach(ele=>ele.myText(`-`).prop({title:undefined}))
    span1T1_single.myText(`-`)
    aToChange.myText(`-`).prop({title:undefined});
    butWrite.disable()
  }
  el.setUI_SMMultiples=function(arg){
    // var { n1T1_single, nTot1T1_mult, nPat1T1_mult, 
    //   nTotMT1, nPatMT1, 
    //   nTot1TM, nPat1TM, 
    //   nTotMTM, nPatMTM}=arg;

    var {n1T1_single, nTot1T1_mult, nPat1T1_mult, 
      nTotMT1, nPatMT1_sm, nPatMT1_hash, 
      nTot1TM, nPat1TM_sm, nPat1TM_hash, 
      nTotMTM, nPatMTM_sm, nPatMTM_hash}=arg;
    var {Str1T1_mult_Short, StrMT1Short, Str1TMShort, StrMTMShort, Str1MToMShort}=arg;

    // span1T1_single.myText(`${n1T1_single}`)
    // a1T1_mult.myText(`${nPat1T1_mult} (${nTot1T1_mult})`).prop({title:Str1T1_mult_Short?.join(`\n`)})
    // aMT1.myText(`${nPatMT1} (${nTotMT1})`).prop({title:StrMT1Short?.join(`\n`)})

    // a1TM.myText(`${nPat1TM} (${nTot1TM})`).prop({title:Str1TMShort?.join(`\n`)})
    // aMTM.myText(`${nPatMTM} (${nTotMTM})`).prop({title:StrMTMShort?.join(`\n`)})


    span1T1_single.myText(`${n1T1_single}`)
    a1T1_mult.myText(`${nPat1T1_mult} (${nTot1T1_mult})`).prop({title:Str1T1_mult_Short?.join(`\n`)})
    aMT1.myText(`${nPatMT1_sm} (${nTotMT1}) ${nPatMT1_hash}`).prop({title:StrMT1Short?.join(`\n`)})
    a1TM.myText(`${nPat1TM_sm} (${nTot1TM}) ${nPat1TM_hash}`).prop({title:Str1TMShort?.join(`\n`)})
    aMTM.myText(`${nPatMTM_sm} (${nTotMTM}) ${nPatMTM_hash}`).prop({title:StrMTMShort?.join(`\n`)})

    var nPat1MToM_sm=nPat1TM_sm+nPatMTM_sm, nTot1MToM=nTotMTM+nTotMTM, nPat1MToM_hash=nPat1TM_hash+nPatMTM_hash
    //a1MToM.myText(`${nPat1MToM_sm} (${nTot1MToM}) ${nPat1MToM_hash}`).prop({title:Str1MToMShort?.join(`\n`)})
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
    //myConsole.log('Not done yet'); debugger; return;
    boTarget=vippTarget.getStat();
    var charSide=boTarget?'T':'S';
    var strLab=`Find hash collisions`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, argGeneralT]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    argGeneral=argGeneralT
    var {objOptSource, objOptTarget, fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir}=argGeneral;
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes}=objOptSide;

    var [err, result]=await RelationWorkB.readData({argGeneral, charSide}); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    //var {arrDb_Upstream, arrDb_Own}=result; arrDbSelection=arrDb_Own;
    //arrDb_Upstream=result.arrDb_Upstream; arrDb_Own=result.arrDb_Own
    ({arrDb_Upstream, arrDb_Own}=result);
    //var arg=extend({}, {fsSourceDir, strHostTarget, fsTargetDbDir, fsTargetDataDir, charTRes, charSide}); //FleF
    var [err, result]=await RelationWork.getMult({arrDbSelection:arrDb_Own, charSide}); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {BundMT1_hash, objFeedback}=result;
    //var {BundMT1, StrConsistentShort, StrNonConsistentShort, nToChange, nRevert, StrToChangeShort, StrRevertShort}=result; //, nTot1MTo1, nPat1MTo1, nTot1MToM, nPat1MToM

    el.setUI_SMMultiples(objFeedback);

    //a1To1M.myText(`${nPat1MTo1} (${nTot1MTo1})`).prop({title:StrConsistentShort?.join(`\n`)})
    //aMTo1M.myText(`${nPat1MToM} (${nTot1MToM})`).prop({title:StrNonConsistentShort?.join(`\n`)})

    var [err, result]=await RelationWorkB.findNewMTime({BundMT1_hash, arrDbSelection:arrDb_Own, charTRes, charSide}); if(err) {debugger; return [err];}
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
    
    RelationWork.copyTDiff(arrDb_Own, arrToChange, charTRes)

    var arrDbNew=[].concat(arrDb_Upstream, arrDb_Own);

    var argTmp=copySome({}, objOptSide, ["fsDbDir", "fsDb", "strHost"]);
    var [err]=await RelationWork.mySetMTime(arrToChange, arrDbNew, argTmp); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    butWrite.disable();
    setMess(strLab+': Done'); blanket.hide();
  }
  var arrDb_Upstream, arrDb_Own, boTarget=0, argGeneral, arrToChange

  var head=createElement('h3').css({'text-align':'left', 'font-weight':'bold'}).myAppend('Unify SM for individual hashcodes').prop({title:'Hash and SM are read from the db-file (not from the actual files) (so make sure the db-file is updated first)'}).css({margin:'0 0.4em 0', width:'max-content'})
  var headA=createElement('h3').css({'text-align':'left'}).myAppend("(Tofix)").css({margin:'0', color:'red'}).prop({title:`This used to work, but now it is on the "toFix"-list 😀`});

  var htmlTmp=`<label>Source</label><input/><input/><label>Target</label>`
  var vippTarget=createElement('div').myHtml(htmlTmp).css({margin:'0 0 1em'});
  vippButtonExtend(vippTarget, 'strSourceOrTarget3', funRadioClick);

  var butGo=createElement('button').myAppend('Go').attr({'title':undefined}).on('click', funGo);
  //butGo.disable(); 

  

  var htmlBody=
  `<tr><td><img/><span/></td> <td><img/><a/></td> <td><img/><a/></td><td><span>To be fixed</span></td></tr>
  <tr><td colspan=2><img/><a/></td> <td><img/><a/></td><td/></tr>`; //<br/><span>∑: </span><a/> (Ignored)
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tBody).css({'border-collapse':'separate', borderSpacing: '0px 0px'});

  var Tr=tBody.children, [tr0, tr1]=Tr,  Td0=tr0.children, [td1T1_single, td1T1_mult, tdMT1, td0Last]=Td0, Td1=tr1.children, [td1TM, tdMTM, td1Last]=Td1;

  var Img=tBody.querySelectorAll('img'), [img1T1, img1T1mult, imgMT1, img1TM, imgMTM]=Img;
  var Span=tBody.querySelectorAll('span'), [span1T1_single, spanToBeFixed, spanSum, spanIgnored]=Span
  var Alink=tBody.querySelectorAll('a'), [a1T1_mult, aMT1, a1TM, aMTM]=Alink; //aMTo1M

  var fleImgT="icons/SM2Hash/";
  var LeafImg=['buvtSMToHash_1T1_singleC.png', 'buvtSMToHash_1T1_multC.png', 'buvtSMToHash_MT1.png', 'buvtSMToHash_1TM.png', 'buvtSMToHash_MTM.png'];
  [...Img].forEach(   (ele, i)=>ele.attr({src:`${fleImgT}${LeafImg[i]}`}).css({zoom:0.4, display:'block'})   );
  img1TM.css({margin:'auto'});

  [...Td0, ...Td1, table].forEach(   (ele, i)=>ele.css({'border':'0px'})   );
  [td1T1_single, td1T1_mult, tdMT1, td1TM, tdMTM].forEach(   (ele, i)=>ele.css({'border':'1px solid'})   );
  td1T1_single.css({'border-right':'0'}); td1T1_mult.css({'border-left':'0'});

  //[td1T1_single, td1T1_mult].forEach(   (ele, i)=>ele.css({'border-top':'0'})   );
  [td1T1_single, td1T1_mult].forEach(   (ele, i)=>ele.css({'border-bottom':'0'})   );
  tdMTM.css({'border-left':'0'});

    // Coloring borders 
  //td1TM.css({'border-left':'var(--text-green) solid', 'border-top':'var(--text-green) solid', 'border-right':'1px solid', 'border-bottom':'1px solid'});
  //tdMTM.css({'border-top':'var(--text-green) solid', 'border-right':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'});
  //td1T1_single.css({'border-left':'var(--text-green) solid', 'border-bottom':'var(--text-green) solid'});
  //td1T1_mult.css({'border-bottom':'var(--text-green) solid', 'border-right':'var(--text-green) solid'});
  tdMT1.css({'border':'var(--text-red) solid', 'translate':'2px -2px'});


  spanToBeFixed.css({color:'var(--text-red)', 'font-weight': 'bolder'});
  //spanIgnored.css({color:'var(--text-green)', 'font-weight': 'bolder'});

  var divHelp=divHelpProt.cloneNode(1).myHtml(htmlHelpCellNumbers).css({'max-width':'24em'})
  var imgHelp=hovHelp.cloneNode(1).css({margin:'0em 0 0 .4em'}); popupHover(imgHelp, divHelp);
  td1Last.myAppend(imgHelp);


  var StrTmp=["collision1T1_mult", "collisionMT1", "collision1TM", "collisionMTM"];
  [...Alink].forEach((ele,i)=>{
    ele.prop({href:""}).attr({'data-key':StrTmp[i]}).on('click', openExtCBLoc);
  });


  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("New mtimes").prop({title:'... to files as well as db.'})
  var fun=makeOpenExtCB(PathLoose.hashCollisionUnifyToChange);
  var aToChange=createElement('a').prop({href:''}).on('click', fun); //.addClass('input')
  var divNew=createElement('div').css({'text-align':'left'}).myAppend(spanLab, " ", aToChange); //, ' ', butWrite

  var butWrite=createElement('button').myAppend('Write to db and update mtimes').css({margin:'auto'}).on('click', funWrite).disable(); //.on('click', funWriteToDb)
  var divWrite=createElement('div').myAppend(butWrite);

  el.myAppend(head, vippTarget, butGo, table, divNew, divWrite).css({'text-align':'left'}); //, headA

  el.css({background:"var(--bg-color)", 'max-width':'min-content'});
  el.clearUI()
  return el
}




gThis.miniViewHashMatchDeleteCreator=function(el){
  //var PathCur=gThis[`Path${charSide}`];

  var funRadioClick=function(){
    el.clearUI()
    boTarget=vippTarget.getStat();
  }
  el.clearUI=function(){
    aToKeep.myText(`-`).prop({title:undefined})
    butDelete.disable()
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

    aToKeep.myText(`${PathLoose.hashCollisionKeep.leaf} ${nPat} (${nTot})`).prop({title:StrKeepShort?.join(`\n`)})
    butDelete.enable()
    setMess(strLab+': Done'); blanket.hide();
  }
  var funDelete=async function(){
    console.log()
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


  var strHelp=`Entries in this file are kept when you click delete below. (So delete those entries that you want deleted)`;
  var divHelp=divHelpProt.cloneNode(1).myHtml(strHelp);
  var imgHelp=hovHelp.cloneNode(1).css({margin:'0 0 0 .4em'}); popupHover(imgHelp, divHelp);

  //var spanLab=createElement('span').myText('?').prop({title:'Entries in this file are kept (delete those entries that you want deleted)'})
  var funToKeep=makeOpenExtCB(PathLoose.hashCollisionKeep);
  var aToKeep=createElement('a').prop({href:''}).myAppend(PathLoose.hashCollisionKeep.leaf).prop({title:undefined}).on('click',funToKeep).addClass('input');
  var divToKeep=createElement('div').myAppend(aToKeep, ' ', imgHelp); //
  var dd0=createElement('dd').myAppend(divToKeep)


    // Delete
  var spanLab=createElement('span').css({'text-align':'left', 'font-weight':'bold'}).myAppend("Delete colliders (but keep those in the file above.)");//.prop({title:'Delete according to the file above'})
  var butDelete=createElement('button').myText('Delete').on('click', funDelete).disable();
  var headB1=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', butDelete)


  el.myAppend(head, vippTarget, headB0, dd0, headB1).css({'text-align':'left'}); // , divSide

  el.css({background:"var(--bg-color)"});
  return el
}

