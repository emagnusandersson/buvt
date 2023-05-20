
"use strict"

// app.historyBack=function(){  history.back();}
// app.doHistPush=function(obj){
//   var stateT=history.state
//   var {strView, arg=null}=obj;
//   var scroll=(strView==stateT.strView)?stateT.scroll:0;

//   var indNew=stateT.ind+1;
//   stateMem={hash:stateT.hash, ind:indNew, strView, scroll, arg, f:(function(a){myConsole.log('hello: '+a);}).toString()};
//   history.pushState(stateMem, strHistTitle, uCanonical);
//   history.StateOpen=history.StateOpen.slice(0, indNew);
//   history.StateOpen[indNew]=obj;
// }
app.strViewFront='viewFront';
app.myHistory={History:[{strView:strViewFront}],cur:0}
app.doHistPush=function(obj){
  var {cur, History}=myHistory, curNew=cur+1
  History[curNew]=obj; History.length=curNew+1
  myHistory.cur=curNew
}
app.historyBack=function(){  
  var {cur, History}=myHistory, curNew=cur-1;
  if(curNew<0) { debugger; throw Error('curNew<0');}
  var obj=History[curNew]; myHistory.cur=curNew;
  setMyState(obj)
}

var setMyState=function(state){
  var view=MainDiv[StrMainDivFlip[state.strView]];
  view.setVis();
  if(history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
  else{ view.funPopped?.(state); }
}


var divMessageTextCreate=function(){
  var spanInner=createElement('span');
  var imgBusyLoc=imgBusy.cloneNode().css({transform:'scale(0.65)','margin-left':'0.4em'}).hide();
  var el=createElement('div').myAppend(spanInner, imgBusyLoc);
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(time) { messTimer=setTimeout(resetMess, time*1000); return; }
    spanInner.myText(' ');
    imgBusyLoc.hide();
  }
  el.setMess=function(str='',time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  el.setHtml=function(str='',time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');
  return el;
}


var dragHRExtend=function(el, funStartWHeight, funSet, funEnd){
  var myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    el.css({position:'relative',opacity:0.55,'z-index':'auto',cursor:'move'}); 
    //hStart=elTarget.height();
    //var rect=elTarget.getBoundingClientRect(); hStart=rect.height;
    //hStart=elTarget.offsetHeight;
    hStart=funStartWHeight();
    if(boTouch) {e.preventDefault(); mouseXStart=e.changedTouches[0].pageX; mouseYStart=e.changedTouches[0].pageY;}
    else {mouseXStart=e.pageX; mouseYStart=e.pageY;}

    //if(boTouch){      document.on('touchmove',myMousemove).on('touchend',el.myMouseup);  } else{   document.on('mousemove',myMousemove).on('mouseup',el.myMouseup);    }
    document.on(strMouseMoveEvent,myMousemove).on(strMouseUpEvent,el.myMouseup);
    //setMess('Down',5);
  } 
  el.myMouseup= function(e){ 
    el.css({position:'relative',opacity:1,'z-index':'auto',top:'0px',cursor:'row-resize'});
    //if(boTouch) document.off('touchmove',myMousemove).off('touchend',el.myMouseup); else document.off('mousemove').off('mouseup'); 
    document.off(strMouseMoveEvent,myMousemove).off(strMouseUpEvent,el.myMouseup);
    funEnd()
  }
  
  var myMousemove= function(e){
    var mouseX,mouseY;
    if(boTouch) {e.preventDefault(); mouseX=e.changedTouches[0].pageX; mouseY=e.changedTouches[0].pageY;}
    else {mouseX=e.pageX; mouseY=e.pageY;}

    var hNew=hStart-(mouseY-mouseYStart); 
    //elTarget.height(hNew);
    funSet(hNew)
    //elTarget.css('height', hNew+'px');
  };
  var strMouseDownEvent='mousedown', strMouseMoveEvent='mousemove', strMouseUpEvent='mouseup';  if(boTouch){  strMouseDownEvent='touchstart'; strMouseMoveEvent='touchmove'; strMouseUpEvent='touchend';  }
  var hStart,mouseXStart,mouseYStart;
  //if(boTouch) el.on('touchstart',myMousedown); else el.on('mousedown',myMousedown);
  el.on(strMouseDownEvent,myMousedown);
  el.addClass('unselectable');
  el.css({cursor:'row-resize'});
  return el;
}


var headExtend=function(el, objArg, strTR='tr', strTD='td'){  // headExtend is used inside headExtendDyn
  el.setArrow=function(strName,dir){
    boAsc=dir==1;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
    var tmp=boAsc?fiIncreasing:fiDecreasing;
    el.querySelector(`${strTH}[name=${strName}]`).querySelector('img[data-type=sort]').prop({src:tmp});
  }
  el.clearArrow=function(){
    thSorted=null, boAsc=false;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
  }
  var thClick=function() {
    var ele=this, boAscDefault=Boolean(ele.boAscDefault); //??0
    boAsc=(thSorted===this)?!boAsc:boAscDefault;  thSorted=this;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
    var tmp=boAsc?fiIncreasing:fiDecreasing;  ele.querySelector('img[data-type=sort]').prop({src:tmp});
    //var tBody=tableDiv.tBody;
    var arrT=[...tBody.querySelectorAll(strTR)];
    //var arrToSort=arrT.slice(0, tableDiv.nRowVisible);
    var arrToSort=arrT.slice(0, objArg.nRowVisible);
    var iChild=ele.myIndex();
    var comparator=function(aT, bT){
      var dire=boAsc?1:-1
      var elA = aT.children[iChild],  elB = bT.children[iChild]; 
      var a = elA?.valSort??elA?.textContent,  b = elB?.valSort??elB?.textContent; 
      //var boAStr=0,boBStr=0;
      if(typeof a=='string' && a.length) { 
        var aN=Number(a); if(!isNaN(aN)) a=aN; else a=a.toLowerCase();
      } else if(typeof a=='undefined') a=null;
      if(typeof b=='string' && b.length) { 
        var bN=Number(b); if(!isNaN(bN)) b=bN; else b=b.toLowerCase();
      } else if(typeof b=='undefined') b=null;
      //var aN=Number(a); if(!isNaN(aN) && a!=='') {a=aN;} else {a=a?.toLowerCase(); boAStr=1;}
      //var bN=Number(b); if(!isNaN(bN) && b!=='') {b=bN;} else {b=b?.toLowerCase(); boBStr=1;}
      //if(boAStr!=boBStr) return ((boAStr<boBStr)?-1:1)*dire;
      if(a==b) {return 0;} else return ((a<b)?-1:1)*dire;
    }
    var arrToSortN=msort.call(arrToSort,comparator);
    tBody.prepend.apply(tBody,arrToSortN);
  }

  var tBody=objArg.tBody;
  var strTH=strTD=='td'?'th':strTD;
  var boAsc=false, thSorted=null;

  var Th=el.querySelectorAll(strTH)
  var len=Th.length;
  var arrImgSort=Array(len);
  for(var i=0;i<len;i++){
    var h=Th[i];
    var imgSort=createElement('img').attr('data-type', 'sort').prop({src:fiUnsorted, alt:"sort"}).css({"vertical-align":"middle"});
    h.myAppend(imgSort).on('click',thClick).css({cursor:"default"});
    arrImgSort[i]=imgSort;
  }

  return el;
}
var headExtendDyn=function(el, objArg, StrName, BoAscDefault, Label, strTR='tr', strTD='td'){  // objArg must have a property tBody and nRowVisible (int)
  var len=StrName.length;
  var Th=Array(len);
  var strTH=strTD=='td'?'th':strTD;
  for(var i=0;i<len;i++){
    var strName=StrName[i];  
    var boAscDefault=(strName in BoAscDefault)?BoAscDefault[strName]:true;
    var label=(strName in Label)?Label[strName]:ucfirst(strName);
    var h=createElement(strTH).addClass('unselectable').prop('boAscDefault',boAscDefault).prop('title',label).attr('name',strName); //.prop({UNSELECTABLE:"on"}) //The unselectable property seems to be for ie only
    Th[i]=h;
  }
  el.addClass('listHead');
  el.append(...Th);

  //var tbody=tableDiv.querySelector('tbody');
  //var tr=el.querySelector(strTR);
  headExtend(el, objArg, strTR, strTD);
  return el;
}


app.divTopCreator=function(el){
  // var settingButtonClick=function(){
  //   viewSettingEntry.setVis(); doHistPush({strView:'viewSettingEntry'});
  // }
  // var settingButton=createElement('button').myAppend('⚙').addClass('fixWidth').prop('title','Settings').on('click',settingButtonClick); 

  var argumentButton=createElement('button').myText('Option preset').addClass('fixWidth').on('click',function(){
    doHistPush({strView:'argumentTab'});
    argumentTab.setVis();
  });
  el.mySetLinkNLabel=async function(){
    var [err, result]=await argumentTab.getSelected(); 
    if(err) {
      if(err.message=='no-argument-selected') var label='(no-argument-selected)';
      else {debugger; myConsole.error(err); return;}
    }
    else { var {label, fiDirSource, leafDb=settings.leafDb}=result; }
    
    argumentButton.myText(`⚙ (${label})`) //+' ◂'
    var [err, fsDb]=await myRealPath(fiDirSource+'/'+leafDb); if(err) {debugger; myConsole.error(err); return;}
    linkDb.fsDb=fsDb
  }

  var butFront=createElement('button').myAppend('Main').on('click',  function(){
    doHistPush({strView:'viewFront'});
    viewFront.setVis();
  });
  var butCheck=createElement('button').myAppend('Check').on('click',  function(){
    doHistPush({strView:'viewCheck'});
    viewCheck.setVis();
  });


  var linkFolder=createElement('a').myAppend('App data folder').prop({href:'', title:'Open the folder containing the file lists.'}).on('click',  async function(){
    var strCommand=`${strExec} ${fsDataHome}`;
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  }); //.css({'margin-left':'0.4em'})

  var linkDb=createElement('a').myText('db-file').prop({href:"",title:'Open the db-file in a text editor'}).on('click',  async function(ev){
    ev.preventDefault();
    var strCommand=`${strExec} "${linkDb.fsDb}"`;
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  }); //.css({'margin-left':'0.4em'})

  var uWiki='https://emagnusandersson.com/buvt'
  var linkWiki=createElement('a').prop({href:uWiki}).myText('Web info').addClass('external').on('click',(ev)=>{ ev.preventDefault(); Neutralino.os.open(uWiki); }); //.css({'margin-left':'0.4em', 'text-align':'center'})

  var uNotation='https://emagnusandersson.com/Buvt_Notations'
  var linkNotation=createElement('a').prop({href:uNotation}).myText('Notations').addClass('external').on('click',(ev)=>{ ev.preventDefault(); Neutralino.os.open(uNotation); });
  


  el.myAppend(butFront, butCheck, argumentButton, ' ', linkFolder, ' | ', linkDb, ' | ', linkWiki, ' | ', linkNotation);  //, imgBusy , butClear .addClass('footDiv') , settingButton, , divNotations
  return el
}


/***********************************************
 *   divTopOpenStuffCreator
 **********************************************/
var makeOpenExtCB=function(key){
  var cbFunI=function(ev){
    ev.preventDefault()
    var strCommand=`${strExec} ${FsFile[key]}`;
    Neutralino.os.execCommand(strCommand);
  }
  return cbFunI
}
app.divTopOpenStuffCreator=function(el){

  return el
}




/***********************************************
 * divSMTabCreator
 **********************************************/

app.divSMTabCreator=function(el, fun11, funMult){
  el.clearVal=function(){
    span01.myText(`-`); span0M.myText(`-`); span0Sum.myText(`-`)
    span10.myText(`-`); span11.myText(`-`); span1M.myText(`-`)
    but11.myText(`-`)
    spanM0.myText(`-`); spanM1.myText(`-`); spanMM.myText(`-`);
    spanSum0.myText(`-`)
  }
  el.setVal=function(Mat){
    var {NPat, NAPat, NBPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=Mat.getN()
    var {nPatA10,nPatA11,nPatA12,nPatA20,nPatA21,nPatA22, nPatB01,nPatB02,nPatB11,nPatB12,nPatB21,nPatB22,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}=objDetail

    span01.myText(nB01)
    span0M.myText(`\\${nB02}(${nPatB02})`)
    var nFileChangedNDeleted=nB01+nB02,  nPatChangedNDeleted=nB01+nPatB02
    span0Sum.myText(`${nFileChangedNDeleted}(${nPatChangedNDeleted})`)
    span10.myText(nA10)
    span11.myText(nA11); but11.myText(nA11)
    span1M.myText(`\\${nB12}(${nPatB12})`)  //${nA12}\\
    spanM0.myText(`${nA20}(${nPatA20})\\`)
    spanM1.myText(`${nA21}(${nPatA21})\\`)  //\\${nB21}
    spanMM.myText(`${nA22}(${nPatA22})\\${nB22}(${nPatB22})(${NPat[2][2]})`);
    var nFileChangedNCreated=nA10+nA20, nPatChangedNCreated=nA10+nPatA20
    spanSum0.myText(`${nFileChangedNCreated}(${nPatChangedNCreated})`)
  }
  var htmlHead=`<tr><th>S⇣ \\ T⇾</th> <th>0</th> <th>1</th> <th>Many</th> <td>∑=</td></tr>`
  var htmlBody=
  `<tr><th>0</th><td>(∞)</td><td><span>-</span></td> <td><span>-</span></td> <th><span>-</span></th></tr>
  <tr><th>1</th><td><span>-</span></td><td><span>-</span><button>-</button></td>  <td><span>-</span></td></tr>
  <tr><th>Many</th><td><span>-</span></td>  <td><span>-</span></td>  <td><span>-</span> <button>List</button></td></tr>
  <tr><td>∑=</td><th><span>-</span></th></tr>`
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [trH]=tHead.children;
  var [tr0, tr1, trMany, trSum]=tBody.children
  var [,,,,tdT]=trH.children;
  tdT.cssExc({'border-top':'hidden!important', 'border-right':'hidden!important', background:'transparent'})
  var [,,,tdMM]=trMany.children;
  tdMM.cssExc({'border-top':'hidden!important', 'border-left':'hidden!important'})
  var [tdTmp]=trSum.children;
  tdTmp.cssExc({'border-bottom':'hidden!important', 'border-left':'hidden!important', 'text-align':'end', background:'transparent'})

  var arr0=tr0.querySelectorAll('span')
  var arr1=tr1.querySelectorAll('span')
  var but11=tr1.querySelector('button').addClass('smallBut')
  var arr2=trMany.querySelectorAll('span')
  var [spanSum0]=trSum.querySelectorAll('span')
  var [span01,span0M,span0Sum]=arr0
  var [span10,span11,span1M]=arr1
  var [spanM0,spanM1,spanMM]=arr2;
  var Span=[...arr0, ...arr1, ...arr2, spanSum0]
  Span.forEach(ele=>ele.addClass('num'))
  var butMult=trMany.querySelector('button').addClass('smallBut')
  //butMult.css({padding:'0em', 'vertical-align':'bottom', 'font-size':'0.85em'})

  var bo11=Boolean(fun11); but11.toggle(bo11); span11.toggle(!bo11)
  if(bo11) but11.on('click',fun11)
  var boMult=Boolean(funMult); butMult.toggle(boMult);
  if(butMult) butMult.on('click',funMult)

  el.myAppend(table);  
  return el
}

app.divMatWrapCreator=function(el, fun){
  el.clearVal=function(){
    //spanSum.myText(`-`);
    spanNA.myText(`-`); spanNB.myText(`-`); spanNPat.myText(`-`); // spanNAPat.myText(`-`); spanNBPat.myText(`-`);
    spanNAM.myText(`-`); spanNBM.myText(`-`); spanNPatM.myText(`-`); // spanNAPatM.myText(`-`); spanNBPatM.myText(`-`);
    divTab.clearVal()
  }
  el.setVal=function(Mat){

    var {NPat, NAPat, NBPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=Mat.getN()
    var {nPatA10,nPatA11,nPatA12,nPatA20,nPatA21,nPatA22, nPatB01,nPatB02,nPatB11,nPatB12,nPatB21,nPatB22,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}=objDetail

    var nAPatMult=nPatA22+nPatA21
    var nBPatMult=nPatB12+nPatB22
    var nAMult=nA22+nA21
    var nBMult=nB12+nB22
    //spanNA.myText(nA); spanNAPat.myText(nAPat); spanNB.myText(nB); spanNBPat.myText(nBPat);
    spanNPat.myText(nPat);
    var nPatMult=NPat[2][1]+NPat[1][2]+NPat[2][2]
    //spanNAM.myText(nAMult); spanNAPatM.myText(nAPatMult); spanNBM.myText(nBMult); spanNBPatM.myText(nBPatMult);
    spanNPatM.myText(nPatMult);


    var strTitle=`nSource(nPatSource): ${nA}(${nAPat})`;    spanNA.myText(nA).prop({title:strTitle})
    var strTitle=`nTarget(nSMTarget): ${nB}(${nBPat})`;    spanNB.myText(nB).prop({title:strTitle})

    var strTitle=`nSource(nPatSource): ${nAMult}(${nAPatMult})`;    spanNAM.myText(nAMult).prop({title:strTitle})
    var strTitle=`nTarget(nPatTarget): ${nBMult}(${nBPatMult})`;    spanNBM.myText(nBMult).prop({title:strTitle})

    divTab.setVal(Mat)
  }

  var spanNA=createElement('span').myText(`-`).prop({title:"Number of files in source"});
  var spanNB=createElement('span').myText(`-`).prop({title:"Number of files in target"});
  var spanNPat=createElement('span').myText(`-`).prop({title:"Number of SM-patterns occuring in BOTH source and target"});
  //var spanNAPat=createElement('span').myText(`-`).prop({title:"Number of SM-patterns in source"});
  //var spanNBPat=createElement('span').myText(`-`).prop({title:"Number of SM-patterns in target"});

  //var spanSum=createElement('span').myAppend(spanNA,'(',spanNAPat,') \\ ',spanNB,'(',spanNBPat,') (',spanNPat,')');
  var spanSum=createElement('span').myAppend(spanNA, '\\', spanNB, ' (',spanNPat,')');
  var br=createElement('br')

  var spanNAM=spanNA.cloneNode(), spanNBM=spanNB.cloneNode(), spanNPatM=spanNPat.cloneNode(); //, spanNAPatM=spanNAPat.cloneNode(), spanNBPatM=spanNBPat.cloneNode()
  //var spanMultSum=createElement('span').myAppend(spanNAM,'(',spanNAPatM,') \\ ',spanNBM,'(',spanNBPatM,') (',spanNPatM,')');
  var spanMultSum=createElement('span').myAppend(spanNAM, '\\', spanNBM, ' (',spanNPatM,')');
  var divTab=createElement('div')
  divSMTabCreator(divTab); //, undefined, fun
  divTab.css({'font-size':'0.9rem', background:'darkgrey', width:'fit-content'})
  //el.spanDetail=createElement('span'); //.myAppend(divTab).hide(); 
  var Span=[spanSum, spanMultSum]; Span.forEach(ele=>ele.addClass('num')) //.css({margin:'0.3em'}) 
  var butOpenList=createElement('a').myText(`List`).addClass('smallBut').on('click',fun).css({'margin-left':'0.3em'}).prop({href:"", title:`Open list in external editor.`});
  butOpenList.toggle(fun)
  //var butOpenPop=createElement('button').myText(`Details`).addClass('smallBut').css({'margin-left':'0.3em'}).prop({title:`More Detailed`}).on('click',()=>divT2T.toggleDetail()); //el.spanDetail.toggle()
  var spanLab=createElement('span').myText(`Multiple SM`);

  var imgDetail=imgHelp.cloneNode(1).css({'margin-left':'0.6em', 'padding':'0 0.3em'}).myText('Details'); popupHover(imgDetail, divTab);

  el.myAppend(spanSum, imgDetail, ', ', spanLab, ': ', spanMultSum, butOpenList); //, el.spanDetail, butOpenPop
  el.css({display:'inline'})
  return el
}




app.divCategoryTabT2DCreator=function(el){
  el.clearVal=function(){
    divMat1.clearVal()
    divMat2.clearVal()

    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    butRenamed.myText('-');  spanRenamedAction.myText('-')
    butCopiedNRenamedToOrigin.myText('-');  spanCopiedNRenamedToOriginAction.myText('-')
    butChanged.myText('-');  spanChangedAction.myText('-')
    butReusedName.myText('-');  spanReusedNameAction.myText('-')
    butReusedId.myText('-');  spanReusedIdAction.myText('-')
    butCreated.myText('-'); butDeleted.myText('-');
    but1T1.myText('-'); butMult.myText('-');
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(syncTreeToDb){
    //var {nSource, nTarget, nUnTouched, nChanged, nMetaMatch, nNSM, nMatchingStrName, nMatchingId, nCreate, nDelete, nSourceRem, nTargetRem}=objArg

    var {Mat1, Mat2, arrSourceUnTouched, arrSourceMetaMatch, arrSourceNSM, arrSourceChanged, arrSourceMatchingStrName, arrSourceMatchingId, arrCreate, arrDelete, arrA1T1NoName, arrAMultNoName, arrBMultNoName, arrSource, arrTarget, boChanged}=syncTreeToDb

    divMat1.setVal(Mat1)
    //if(!boChanged) {myConsole.log('Everything is up to date, aborting.'); return;}
    divMat2.setVal(Mat2)

    var nUnTouched=arrSourceUnTouched.length; spanUntouched.myText(nUnTouched);  spanUntouchedAction.myText(nUnTouched)
    var nMetaMatch=arrSourceMetaMatch.length; butRenamed.myText(nMetaMatch);  spanRenamedAction.myText(nMetaMatch)
    var nNSM=arrSourceNSM.length; butCopiedNRenamedToOrigin.myText(nNSM);  spanCopiedNRenamedToOriginAction.myText(nNSM)
    var nChanged=arrSourceChanged.length; butChanged.myText(nChanged);  spanChangedAction.myText(nChanged)
    var nMatchingStrName=arrSourceMatchingStrName.length; butReusedName.myText(nMatchingStrName);  spanReusedNameAction.myText(nMatchingStrName)
    var nMatchingId=arrSourceMatchingId.length; butReusedId.myText(nMatchingId);  spanReusedIdAction.myText(nMatchingId)
    //var nCreate=Mat2.arrA[1][0].length+Mat2.arrA[2][0], nDelete=Mat2.arrB[0][1]+Mat2.arrB[0][2]
    var nCreate=arrCreate.length; butCreated.myText(nCreate); spanCreatedAction.myText(nCreate);
    var nDelete=arrDelete.length; butDeleted.myText(nDelete); spanDeletedAction.myText(nDelete); 
    var n1T1NoName=arrA1T1NoName.length; but1T1.myText(n1T1NoName); span1T1Action.myText(n1T1NoName);
    var nAMultNoName=arrAMultNoName.length, nBMultNoName=arrBMultNoName.length, strT=nAMultNoName+'\\'+nBMultNoName; butMult.myText(strT); spanMultActionC.myText(nAMultNoName); spanMultActionD.myText(nBMultNoName);

    var nSource=arrSource.length; spanSumS.myText(nSource);
    var nTarget=arrTarget.length; spanSumT.myText(nTarget)
    var nShortCut=nUnTouched+nMetaMatch+nNSM; spanSumSC.myText(nShortCut);
    var nMatchButNoSC=nChanged+nMatchingStrName+nMatchingId+n1T1NoName, nDeleteTmp=nMatchButNoSC+nBMultNoName+nDelete, nCreateTmp=nMatchButNoSC+nAMultNoName+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);

      // Checking the sums
    var nSomeKindOfMatching=nShortCut+nMatchButNoSC
    var nSourceCheck=nSomeKindOfMatching+nAMultNoName+nCreate, nTargetCheck=nSomeKindOfMatching+nBMultNoName+nDelete
    var boSourceOK=nSource==nSourceCheck, boTargetOK=nTarget==nTargetCheck
    //var boBoth=boSourceOK && boTargetOK
    var strOK="OK", strNOK="NOK" // strOK="OK"; strNOK="✗"
    var strNSourceMatch=boSourceOK?strOK:strNOK;
    var strNTargetMatch=boTargetOK?strOK:strNOK
    if(!boSourceOK || !boTargetOK){ 
      var strTmp=`!!ERROR the sums does not match with the number of files:
Checking the sums of the categories: Source: ${nSourceCheck} (${strNSourceMatch}), Target: ${nTargetCheck} (${strNTargetMatch})`;
      debugger; alert(strTmp)
    }

  }
  var htmlHead=`
<tr><th colspan=3>Matching</th> <th title="Number of files in S (S=source)" rowspan=2>nS</th> <th title="Number of files in T (T=target)" rowspan=2>nT</th> <th rowspan=2>Categorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Id</th> <th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short-cut</th> <th>Del­ete</th> <th>Cre­ate</th></tr>`

  var htmlBody=`
  <tr><td colspan=9>  <div class=dupEntry>Uncategorized: </div>  </td></tr>
<tr><th>OK</th><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Untouched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>-</th><th>OK</th> <td colspan=2><a href="">-</a></td><td>Renamed</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th>OK</th><th>OK</th> <td colspan=2><a href="">-</a></td><td>File copied, then renamed to origin</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Reused name</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>OK</th><th>-</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Reused id (or renamed and changed)</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><td colspan=9>  <div class=dupEntry>Uncategorized: </div>  </td></tr>
<tr><th>-</th><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created/Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th title="One-to-one relation (The SM combination exists exactly once each on S and T)">1T1</th> <td colspan=2><a href="">-</a></td> <td></td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th title="Relations where at least one of the sides (S/T) has multiple entries. (1Tm+mTm+mT1)">mult</th> <td colspan=2><a href="">-</a></td> <td></td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=3>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>`
// The pattern exists on both S and T and more than once on at least one of them.
  //<tr><th>-</th><th>-</th><th>-/OK</th> <td><span>-</span></td> <td><span>-</span></td> <td>Remaining (Created/Deleted ...)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  //var [trMat1, trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trRemaining, trSum]=arrTR
  var [trMat1, trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trMat2, trCreatedNDeleted, tr1T1, trMult, trSum]=arrTR
  var arrTRT=arrTR.slice(1,-5).concat(arrTR.slice(-3,-1)); arrTRT.forEach(ele=>ele.children[3]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  var arrTRT=arrTR.slice(4,-5).concat(arrTR.slice(-3,-2)); arrTRT.forEach(ele=>ele.children[6]?.css({'text-align':'center'})); //Centering merged Delete/Create columns

  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  var [butRenamed,spanRenamedAction]=trRenamed.querySelectorAll('a,span')
  var [butCopiedNRenamedToOrigin,spanCopiedNRenamedToOriginAction]=trCopiedNRenamedToOrigin.querySelectorAll('a,span')
  var [butChanged,spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [butReusedName,spanReusedNameAction]=trReusedName.querySelectorAll('a,span')
  var [butReusedId,spanReusedIdAction]=trReusedId.querySelectorAll('a,span')
  var [butCreated, butDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [but1T1,span1T1Action]=tr1T1.querySelectorAll('a,span')
  var [butMult,spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span')



  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat1, divMat2]=arrDup;

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divMatWrapCreator(divMat1, makeOpenExtCB("T2D_mult1"));
  divMatWrapCreator(divMat2);

  butRenamed.on('click', makeOpenExtCB('T2D_renamed'))
  butCopiedNRenamedToOrigin.on('click', makeOpenExtCB('T2D_copiedThenRenamedToOrigin'))
  butChanged.on('click', makeOpenExtCB('T2D_changed'))
  butReusedName.on('click', makeOpenExtCB('T2D_reusedName'))
  butReusedId.on('click', makeOpenExtCB('T2D_reusedId'))
  butCreated.on('click', makeOpenExtCB('T2D_created'))
  butDeleted.on('click', makeOpenExtCB('T2D_deleted'))
  but1T1.on('click', makeOpenExtCB('T2D_1T1NoName'))
  butMult.on('click', makeOpenExtCB('T2D_mult2'))

  
  el.myAppend(table);  
  return el
}



/***********************************************
 *   divT2DCreator
 **********************************************/
app.divT2DCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewT2D';}
  
  el.setUp=function(){
  }

  var butCompareTreeToDb=createElement('button').myAppend('Compare').on('click', async function(){
    myConsole.clear(); el.clearVal(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["charTRes", "leafFilterFirst", "flPrepend"])
    args.fiDir=result.fiDirSource
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    var syncTreeToDb=new SyncTreeToDb('compareTreeToDb', args);
    await syncTreeToDb.constructorPart2()
    var [err]=await syncTreeToDb.compare();   if(err) { debugger; myConsole.error(err); busyLarge.hide(); return; }
    divT2D.setVal(syncTreeToDb);
    busyLarge.hide()
  });
  var butRenameFinishToDb=createElement('button').myAppend('Rename finish to db-file').on('click', async function(){
    myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir}=result, fiDb=fiDir+charF+settings.leafDb
    var args={fiDb}
    var renameFinishToDb=new RenameFinishToDb(args)
    await renameFinishToDb.read()
    if(boAskBeforeWrite){
      var boOK=confirm(`Writing ${renameFinishToDb.arrDBNew.length} entries to db-file.`)
      if(!boOK) return
    }
    await renameFinishToDb.makeChanges();
    myConsole.log('Done')
  });
  var butSyncTreeToDb=createElement('button').myAppend('Sync').prop({title:`Same as "Compare" plus doing the suggested actions from the compare-call.`}).on('click', async function(){
    //myConsole.clear(); 
    el.clearVal(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["charTRes", "flPrepend"])
    args.fiDir=result.fiDirSource
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    var syncTreeToDb=new SyncTreeToDb('syncTreeToDb', args);
    await syncTreeToDb.constructorPart2()
    var [err]=await syncTreeToDb.compare();   if(err) { debugger; myConsole.error(err); busyLarge.hide(); return; }
    divT2D.setVal(syncTreeToDb)
    if(syncTreeToDb.objHL.boHL) {busyLarge.hide(); return}
    if(!syncTreeToDb.boChanged){ myConsole.log('Everything is up to date, aborting.'); busyLarge.hide(); return;  }

    var [err]=await syncTreeToDb.createSyncData(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    if(boAskBeforeWrite){
      var boOK=confirm(`Overwrite ${syncTreeToDb.fsDb}`);
      if(!boOK) {busyLarge.hide(); return}
    }
    var [err]=await syncTreeToDb.makeChanges()
    myConsole.log('Done'); busyLarge.hide();
  });


  var butCompareTreeToDbSMOnly=createElement('button').myAppend('Compare source tree to db (SMOnly)').on('click', async function(){
    myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var args=copySome({}, result, ["leafDb", "charTRes", "flPrepend"])
    args.fiDir=result.fiDirSource
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    //compareTreeToDbSMOnly(fiDir, fiDb, flPrepend, leafFilterFirst);
    compareTreeToDbSMOnly(args);
  });
  //var divDev=createElement('div').myAppend( butCompareTreeToDbSMOnly);
  
  //el.toggleResult=function(boOn){ divResult.toggle(boOn); }
  el.clearVal=function(){
    divCategoryTab.clearVal()
    spanHLCheckResult.myText('-').css({color:'black'})
    butHL.removeAttribute('title');
    butHL.myText('-')
    //butMore.myText('-')
  }
  el.setVal=function(syncTreeToDb){
      // HL info
    var {objHL}=syncTreeToDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDB, nMultIdDB, nIdDB, nDB,  boHL}=objHL
    var strTitle=`nFile(nIdFile): ${nTreef}(${nIdf})\nnFolder(nIdFolder): ${nTreeF}(${nIdF})`
    spanNTree.myText(`${nTreef}`).prop({title:strTitle})

    var strTitle=`nDB(nIdDB): ${nDB}(${nIdDB})`
    spanNDb.myText(`${nDB}`).prop({title:strTitle})

    var strTitle=`Files: ${nMultf}(${nMultIdf}) 
Folders: ${nMultF}(${nMultIdF})
Db: ${nMultDB}(${nMultIdDB})`
    butHL.myText(`${nMultf}(${nMultIdf})`).prop({title:strTitle})
    spanHLCheckResult.css({color:boHL?'red':'green'}).myText(boHL?'Hard link check FAIL, ABORTING':'Hard link check: OK');
    if(boHL) return 

    divCategoryTab.setVal(syncTreeToDb)
  }

  var hT2D=createElement('b').myText('Tree to db-file')
  var divButton=createElement('div').myAppend(hT2D, butCompareTreeToDb, butSyncTreeToDb).css({background:'lightgrey', flex:"0 1", position:'sticky', top:0, border:"solid 1px"}); 



  //var {cbFun}=ObjOpenExtData["T2D_HL"]
  var htmlHL=`Tot: <span>-</span> \\ <span>-</span>. Multiple id: <a href="" >-</a> <span>-</span>` 

  //var emData=elBody.querySelector('embed'); debugger
  

  var divHL=createElement('div').myHtml(htmlHL);//.hide();
  var butHL=divHL.querySelector('a'); 
  var Span=divHL.querySelectorAll('span');
  var [spanNTree, spanNDb, spanHLCheckResult]=Span
  spanHLCheckResult.css({'font-weight':'bold'})
  butHL.on('click',makeOpenExtCB("T2D_HL"))
  var divCategoryTab=el.divCategoryTab=divCategoryTabT2DCreator(createElement('div'))

//   var htmlMoreInfo=`Renamed: <button class=smallBut>-</button>, 
// Without shortcut: <button class=smallBut>-</button>` 
//   var divMoreInfo=createElement('div').myHtml(htmlMoreInfo);
//   var But=divMoreInfo.querySelectorAll('button');
//   var [but1T1, butMore]=But

  //var {cbFun}=ObjOpenExtData.T2D_renamed;  but1T1.myText('-').on('click',cbFun)
  //var {cbFun}=ObjOpenExtData.T2D_resultMore;  butMore.myText('-').on('click',cbFun)
  var divCategoryTabW=createElement('div').myAppend(divCategoryTab)  //, divMoreInfo

  var divResult=createElement('div')
  divResult.myAppend(divHL, divCategoryTabW)


  el.myAppend(divButton, divResult); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}


app.divCategoryTabT2TCreator=function(el){
  el.clearVal=function(){
    divMat1.clearVal(); divMat2.clearVal(); divMat3.clearVal()

    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    but1T1List.myText('-');  span1T1Action.myText('-')
    butViaAList.myText('-');  spanViaAAction.myText('-')
    butChanged.myText('-');  spanChangedAction.myText('-')
    
    butMultList.myText('-');  spanMultActionD.myText('-');  spanMultActionC.myText('-')
    
    butCreated.myText('-'); butDeleted.myText('-');
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(objArg){

    var {nSource, nTarget, nUnTouched, nMatchingStrName, nSourceRem:nCreate, nTargetRem:nDelete, nIddByFolder, Mat1, Mat2, Mat3, nAncestorOnlyRenamed, nAncestorOnlyRenamedFolder}=objArg; //, nPatWDupRem, nAWDupRem, nBWDupRem
    divMat1.setVal(Mat1); divMat2.setVal(Mat2); divMat3.setVal(Mat3)

    spanUntouched.myText(nUnTouched);  spanUntouchedAction.myText(nUnTouched)
    spanNAncestorOnlyRenamed.myText(nAncestorOnlyRenamed)
    var {NA, NB}=Mat2.getN(), n11=NA[1][1]
    but1T1List.myText(n11); span1T1Action.myText(n11);
    butAncestorFList.myText(nAncestorOnlyRenamedFolder)
    butViaAList.myText(nIddByFolder); spanViaAAction.myText(nIddByFolder)


    butChanged.myText(nMatchingStrName); spanChangedAction.myText(nMatchingStrName);
    var {NA, NB}=Mat3.getN()
    var nAMult = NA[1][2] + NA[2][1] + NA[2][2]
    var nBMult = NB[1][2] + NB[2][1] + NB[2][2]
    var strT=nAMult+"\\"+nBMult
    spanMultActionD.myText(nBMult); spanMultActionC.myText(nAMult)
    butMultList.myText(strT);
    butCreated.myText(nCreate); spanCreatedAction.myText(nCreate)
    butDeleted.myText(nDelete); spanDeletedAction.myText(nDelete)

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)
    var nShortCut=nUnTouched+n11+nIddByFolder; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nMatchingStrName+nBMult+nDelete, nCreateTmp=nMatchingStrName+nAMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);

  }
  var htmlHead=`
<tr><th colspan=2>Matching</th> <th rowspan=2>nS</th> <th rowspan=2>nT</th> <th rowspan=2>Categorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Na&shy;me</th> <th>SM</th> <th>Short-cut</th> <th>Del­ete</th> <th>Cre­ate</th></tr>`

  var htmlBody=`
<tr><td colspan=8>  <div class=dupEntry>Uncategorized: </div>  </td></tr>
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Untouched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>Uncategorized: </div>  </td></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a></td><td>1T1<button>Rename</button><a href="">Compare</a></td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th title="Identified via 1T1-files only renamed in ancestor">ViaA</th> <td colspan=2><a href="">-</a></td><td><font>ViaA</font><button>Rename</button></td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>1T1-files only renamed in ancestor folder: <span class=entry>-</span>. Ancestors: <a href="">-</a>  </td></tr>
<tr><td colspan=8>  <div class=dupEntry>Uncategorized: </div>  </td></tr>
<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created/Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>mult</th> <td colspan=2><a href="">-</a></td><td></td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>`
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  var arrTR=[...tBody.children]
  var [trMat1, trUntouched, trMat2, tr1T1, trViaA, trViaAExtra, trMat3, trChanged, trCreatedNDeleted, trMult, trSum]=arrTR

  var arrTRT=[trUntouched, tr1T1, trViaA, trChanged, trMult]
  arrTRT.forEach(ele=>ele.children[2]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  var arrTRT=[trChanged]
  arrTRT.forEach(ele=>ele.children[5]?.css({'text-align':'center'})); //Centering merged Delete/Create columns

  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  var [but1T1List, but1T1Rename, but1T1Compare, span1T1Action]=tr1T1.querySelectorAll('a,button,span')
  var [butViaAList, butViaARename, spanViaAAction]=trViaA.querySelectorAll('a,button,span')
  var [spanNAncestorOnlyRenamed, butAncestorFList]=trViaAExtra.querySelectorAll('a,span')
  var [butChanged,spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [butCreated, butDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [butMultList, spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span')


  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat1, divMat2, divMat3]=arrDup;
  divMatWrapCreator(divMat1, makeOpenExtCB("T2T_mult1")); //
  divMatWrapCreator(divMat2, makeOpenExtCB("T2T_mult2")); //
  divMatWrapCreator(divMat3); // , makeOpenExtCB("T2T_mult3")

  var arrButt=tBody.querySelectorAll('button'); 
  //var [but1T1, but1T1Rename, butViaA, butViaARename, butAncestorFList, butChanged, butCreated, butDeleted]=arrButt; 
  arrButt.forEach(ele=>ele.addClass('smallBut'))
  
  but1T1List.on('click', makeOpenExtCB("T2T_renamed"))
  but1T1Rename.on('click', funRenameFinishToTree);
  but1T1Compare.prop('title',`Open ${LeafFile.T2D_renamed} and  ${LeafFile.T2T_renamed} in Meld`).on('click',  async function(ev){
    ev.preventDefault()
    var strExec='meld'
    var strA=FsFile["T2D_renamed"], strB=FsFile["T2T_renamed"]
    var strCommand=`${strExec} ${strA} ${strB}`;
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  })

  butViaAList.on('click', makeOpenExtCB("T2T_renamedAdditional"))
  butViaARename.on('click', funRenameFinishToTreeAdditional);
  butAncestorFList.on('click', makeOpenExtCB("T2T_ancestor"))
  butChanged.on('click', makeOpenExtCB("T2T_changed"))
  butMultList.on('click', makeOpenExtCB("T2T_mult3"))
  butCreated.on('click', makeOpenExtCB("T2T_created"))
  butDeleted.on('click', makeOpenExtCB("T2T_deleted"))


  el.myAppend(table);  
  return el
}


/***********************************************
 *   divT2TCreator
 **********************************************/
app.divT2TCreator=function(el){

  el.setUp=function(){
  }

  var butCompareTreeToTree=createElement('button').myAppend('Compare').on('click', async function(){
    myConsole.clear(); el.clearVal(); busyLarge.show()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["fiDirSource", "fiDirTarget", "charTRes", "flPrepend"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    var [err]=await compareTreeToTree(args); if(err){  myConsole.error(err); busyLarge.hide(); return;}
    busyLarge.hide();
  });
  app.funRenameFinishToTree=async function(){
    //myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirTarget:fiDir}=result;
    var args={fiDir}
    args.fsRenameFile=FsFile["T2T_renamed"]
    var renameFinishToTree=new RenameFinishToTree(args)
    await renameFinishToTree.read()
    var nRename=renameFinishToTree.arrRename.length
    if(nRename==0) {myConsole.log('Everything is up to date, aborting.'); return}
    if(boAskBeforeWrite){
      var strPlur=pluralS(nRename, "entry", "entries")
      var boOK=confirm(`Renaming ${nRename} ${strPlur}.`)
      if(!boOK) return
    }
    await renameFinishToTree.makeChanges();
    myConsole.log('Renaming done')
  }
  app.funRenameFinishToTreeAdditional=async function(){
    //myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirTarget:fiDir}=result;
    var args={fiDir}
    args.fsRenameFile=FsFile["T2T_renamedAdditional"]
    var renameFinishToTree=new RenameFinishToTree(args)
    await renameFinishToTree.read()
    var nRename=renameFinishToTree.arrRename.length
    if(nRename==0) {myConsole.log('Everything is up to date, aborting.'); return}
    if(boAskBeforeWrite){
      var strPlur=pluralS(nRename, "entry", "entries")
      var boOK=confirm(`Renaming ${nRename} ${strPlur}.`)
      if(!boOK) return
    }
    await renameFinishToTree.makeChanges();
    myConsole.log('Renaming additional, done')
  }
  // var butRenameFinishToTree=createElement('button').myAppend('Rename finish to tree').prop({title:`Rename according to \n${LeafFile.T2T_renamed} \nto target tree.`}).on('click', funRenameFinishToTree);
  // var butRenameFinishToTreeAdditional=createElement('button').myAppend('Rename finish to tree (additional)').prop({title:`Rename according to \n${LeafFile.T2T_renamedAdditional} \nto target tree.`}).on('click', funRenameFinishToTreeAdditional);
  var butSyncTreeToTreeBrutal=createElement('button').myAppend('Sync (like rsync)').attr({'title':'Files with the same name, size \nand mod-time are left untouched.\nOthers are overwritten\n(Renamed files are overwritten.)'}).on('click', async function(){
    myConsole.clear(); el.clearVal(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["fiDirSource", "fiDirTarget", "charTRes"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    var syncTreeToTreeBrutal=new SyncTreeToTreeBrutal(args);
    await syncTreeToTreeBrutal.constructorPart2()
    var [err, boChanged]=await syncTreeToTreeBrutal.compare(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    if(!boChanged){ myConsole.log('Everything is up to date, aborting.'); busyLarge.hide(); return;  }
    if(boAskBeforeWrite){
      //return
      var strMess=syncTreeToTreeBrutal.makeConfirmMess()
      var boOK=confirm(strMess)
      if(!boOK) {busyLarge.hide(); return}
    }
    await syncTreeToTreeBrutal.makeChanges()
    myConsole.log('Done'); busyLarge.hide();
  });


  var hT2T=createElement('b').myText('Tree to tree');
  var divButton=createElement('div').myAppend(hT2T, butCompareTreeToTree, butSyncTreeToTreeBrutal).css({background:'lightgrey', flex:"0 1", position:'sticky', top:0, border:"solid 1px"});

  el.clearVal=function(){
    divCategoryTab.clearVal()
  }
  el.setVal=function(objArg){
    divCategoryTab.setVal(objArg)
  }
  
  var divCategoryTab=el.divCategoryTab=divCategoryTabT2TCreator(createElement('div'))
  el.myAppend(divButton, divCategoryTab); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%"}); //, height:"100%"
  return el
}



/***********************************************
 *   viewFrontCreator
 **********************************************/
app.viewFrontCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewFront';}
  

  el.setUp=function(){
    divTopContainer.myAppend(divTop)
    divConsoleContainer.myAppend(dragHR, butClear, divConsole)
  }
  el.setBottomMargin=function(hNew){
    var hTmp=hNew+3
    divT2D.css({'margin-bottom':hTmp+'px'})
    divT2T.css({'margin-bottom':hTmp+'px'})
    //divMid.css({'margin-bottom':hNew+'px'})
  }
  el.clearColumnDivsResult=function(){ 
    //divT2D.toggleResult(false); divT2T.toggleResult(false);
    divT2D.clearVal(); divT2T.clearVal();
  }

  // var divTopOpenStuff=divTopOpenStuffCreator(createElement('div')).css({'text-align':'center'})
  // divTopOpenStuff.css({background:"lightgray", 'margin-bottom':'3px'});

  var divTopContainer=createElement('div').css({'text-align':'center'});
  var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  app.divT2D=divT2DCreator(createElement('div'))
  app.divT2T=divT2TCreator(createElement('div'))



  var divMid=createElement('div').myAppend(divT2D, divT2T).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'1 1 auto', overflow:'scroll'}); //.addClass('unselectable')
  //.css({display:'flex', 'column-gap':'3px','margin-top':'3px', flex:'1 1 auto', overflow:'scroll'}).addClass('unselectable')
  el.clearColumnDivsResult()
  
  
  el.myAppend(divTopContainer, divMid, divConsoleContainer); //, divTopOpenStuff divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%", 'justify-content':'space-between'});
  return el
}



/***********************************************
 *   viewCheckCreator
 **********************************************/
app.viewCheckCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewCheck';}

  el.setUp=function(){
    divTopContainer.myAppend(divTop)
    divConsoleContainer.myAppend(dragHR, butClear, divConsole)
  }
  el.setBottomMargin=function(hNew){
    divMid.css({'margin-bottom':hNew+'px'})
  }


  var butHardLinkCheck=createElement('button').myAppend('Check for hard links').attr({'title':`Check source tree for hard links. (Note: all functions relying on the absence of hard links also checks for hard links) \nFound hard links are written to ${basename(FsFile["T2D_HL"])} in the settings directory.`}).on('click',  async function(){
    myConsole.clear(); busyLarge.show()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var {fiDirSource}=result;
    var args=copySome({}, result, ["fiDirSource", "charTRes"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    hardLinkCheck(args);
    busyLarge.hide();
  });
  

  //
  // Checking
  //
  var butCheckSummarizeMissingS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirSource, myConsole})
    checkSummarizeMissing(args);
    busyLarge.hide();
  });
  var butCheckSummarizeMissingT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirTarget, myConsole})
    checkSummarizeMissing(args);
    busyLarge.hide();
  });
  var inpIStart=createElement('input').prop({type:'number'}).attr('value',0).prop({title:'iStart, (Start checking from this row (Skipping those above this line)).'});
  var butCheckS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirSource, iStart:inpIStart.value, myConsole})
    check(args);
    busyLarge.hide();
  });
  var butCheckT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); busyLarge.show();
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); busyLarge.hide(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirTarget, iStart:inpIStart.value, myConsole})
    check(args);
    busyLarge.hide();
  });



  var divTopContainer=createElement('div').css({'text-align':'center'});
  var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  // app.divConsole=createElement('pre').css({'font-family':'monospace', background:'lightgray', 'white-space':'pre-wrap', margin:'3px', width:"initial", "flex":'33%'}); //.addClass('contDiv')
  // app.myConsoleCheck=new MyConsole(divConsole)

  //"flex":'1 1 auto'

  var hCheckFileExistance=createElement('b').myText('Check file existance').prop({title:'Going through all the files in db-file and check that they exist.'})
  var hCheckHash=createElement('b').myText('Check hash codes').prop({title:'Going through all the files in db-file and check the hashcode.'})
  var spanIStart=createElement('span').myText('iStart:').attr({'title':'Start on this row of the db-file'}).css({'margin-left':'0.6em'})
  inpIStart.css({'margin-left':'0.6em'})
  var divHeadCheckHash=createElement('div').myAppend(hCheckHash, spanIStart, inpIStart).css({display:'flex', 'align-items':'center'})
  
  var divMid=createElement('div').myAppend(hCheckFileExistance, butCheckSummarizeMissingS, butCheckSummarizeMissingT, divHeadCheckHash, butCheckS, butCheckT).css({display:'flex', 'column-gap':'3px', margin:'3px 0', background:"lightgray"}); //, butHardLinkCheck
  
    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});

  
  el.myAppend(divTopContainer, divMid, divConsoleContainer); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%"});
  return el
}


//////////////////////////////////////////////////////////
// ArgumentTab
//////////////////////////////////////////////////////////

app.ArgumentTabRow={
  connectStuffClass:function(){
    this.StrColOrder=Object.keys(ArgumentTabRow.rDefault)
  },
  connectStuff:function(){
    var {StrColOrder}=ArgumentTabRow
    var elR=this
    for(var i=0;i<StrColOrder.length;i++) { 
      var name=StrColOrder[i], td;
      if(name in ArgumentTabRow.TDConstructors) { td=ArgumentTabRow.TDConstructors[name]();  } 
      else td=createElement('td');
      elR.append(td.attr('name',name));
    }
    var buttEdit=createElement('button').attr('name','buttonEdit').myText('Edit').on('click',function(){
      argumentSetPop.openFunc.call(this,1);
    });
    var buttCopy=createElement('button').attr('name','buttonCopy').myText('Copy').on('click',function(){
      argumentSetPop.openFunc.call(this,0);
    });
    var buttDelete=createElement('button').attr('name','buttonDelete').css({'margin-right':'0.2em'}).myAppend(charDelete).on('click',argumentDeletePop.openFunc);
    var tEdit=createElement('td').myAppend(buttEdit), tCopy=createElement('td').myAppend(buttCopy), tDelete=createElement('td').myAppend(buttDelete); 
    elR.append(tEdit, tCopy, tDelete);
    return elR;
  },
  mySet:function(rowData){
    var {StrColOrder}=ArgumentTabRow
    var {boSelected, label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes}=rowData;
    var elR=this;
    elR.prop('rowData',rowData) //.attr({label})
    for(var i=0;i<StrColOrder.length;i++) { 
      var name=StrColOrder[i], val=rowData[name]; //, td=this.children.item(i)
      var td=this.querySelector(`td[name=${name}]`);
      if('mySetVal' in td) { td.mySetVal(val);}   else td.myText(val);
      if('mySetSortVal' in td) { td.mySetSortVal(val);}   else td.valSort=val;
    }
  },
  setSelectedClick:async function(){ // "this" will be refering to the clicked button (see below)
    var td=this.parentNode, elR=td.parentNode;
    //var elR=this;
    argumentTab.clearSelected()
    elR.rowData.boSelected=true
    //argumentTab.setSelected(elR)
    td.mySetVal(true)
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};
  },
  TDProt:{
    boSelected:{
      mySetVal:function(boOn){  var td=this, b=td.firstChild, strCol=boOn?'green':''; b.css('background',strCol);  }
    }
  },
  TDConstructors:{
    boSelected:function(){ 
      var b=createElement('button').myHtml('&nbsp;').css('width','1.2em').on('click',ArgumentTabRow.setSelectedClick);
      var el=createElement('td').css('text-align','center').myAppend(b);  extend(el,ArgumentTabRow.TDProt.boSelected);  return el;
    }
  },
  rDefault:{boSelected:false, label:'', fiDirSource:'', fiDirTarget:'', leafFilterFirst:'', leafFilterFirstTree:'', leafDb:'', flPrepend:'', charTRes:'n'},
}
ArgumentTabRow.connectStuffClass()



app.argumentSetPopExtend=function(el){
  el.toString=function(){return 'argumentSetPop';}
  var save=async function(){ 
    var label=inpLabel.value;
    var fiDirSource=inpDirSource.value; if(fiDirSource.length==0){ myConsole.log('empty fiDirSource',2);  return;}
    var fiDirTarget=inpDirTarget.value; if(fiDirTarget.length==0){ myConsole.log('empty fiDirTarget',2);  return;}
    var leafFilterFirst=inpFilterFirst.value; 
    var leafFilterFirstTree=inpFilterFirstTree.value;
    var leafDb=inpDb.value; 
    var flPrepend=inpPrepend.value;
    var charTRes=selCharTRes.value
    var rT={label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes}
    extend(objRow,rT)
    if(boUpd) { 
      //argumentTab.myEdit(elR, objRow);
    } else {
      objRow.boSelected=argumentTab.nRows()==0;
      [elR]=argumentTab.reserveRows();
    }
    ArgumentTabRow.mySet.call(elR, objRow);
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};
    historyBack();
  }
  el.setUp=function(){
    inpLabel.value=objRow.label
    inpDirSource.value=objRow.fiDirSource
    inpDirTarget.value=objRow.fiDirTarget
    inpFilterFirst.value=objRow.leafFilterFirst
    inpFilterFirstTree.value=objRow.leafFilterFirstTree
    inpDb.value=objRow.leafDb
    inpPrepend.value=objRow.flPrepend
    selCharTRes.value=objRow.charTRes
    inpLabel.focus();
    myConsole.clear();
    divConsoleContainer.myAppend(divConsole)
    return true;
  }
  el.openFunc=function(boUpdT){
    boUpd=boUpdT;
    if(this==null){objRow=extend({},ArgumentTabRow.rDefault);}
    else{
      elR=this.parentNode.parentNode;
      //objRow=elR.rowData;
      objRow=extend({},elR.rowData);
    }
    doHistPush({strView:'argumentSetPop'});
    el.setVis();
    el.setUp();
  }
  el.setVis=function(){ el.show(); return 1; }
  
  var boUpd, elR, objRow; 

  var imgHLabel=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHLabel, createElement('div').myHtml("Name (label) of this combination of arguments"));
  var imgHSource=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHSource, createElement('div').myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHTarget=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHTarget, createElement('div').myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHFilterFirst=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHFilterFirst, createElement('div').myHtml("leaf-prefix: only part furthest away from the root, (the actual file), (no \"/\", \".\" or \"~\")"));
  var imgHFilterFirstTree=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHFilterFirstTree, createElement('div').myHtml("leaf-prefix: only part furthest away from the root, (the actual file), (no \"/\", \".\" or \"~\")"));
  var imgHDb=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHDb, createElement('div').myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHPrepend=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHPrepend, createElement('div').myHtml("fl-prefix: filesystem (l=locally based) furthest away from the root, (no \"/\", \".\" or \"~\")"));
  var imgHCharTRes=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHCharTRes, createElement('div').myHtml(`Timestamp resolution: 'n', 'u', 'm', '1' or '2'
<p>n: nanosecond resolution (Decimals beyond the 9th are set to zero)
<p>u: microsecond resolution (Decimals beyond the 6th are set to zero)
<p>u: millisecond resolution (Decimals beyond the 3rd are set to zero)
<p>1: 1 second resolution (All decimals are set to zero)
<p>2: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`));
  var labLabel=createElement('b').myAppend('Name', imgHLabel);
  var labDirSource=createElement('b').myAppend('fiDirSource', imgHSource);
  var labDirTarget=createElement('b').myAppend('fiDirTarget', imgHTarget);
  var labFilterFirst=createElement('b').myAppend('leafFilterFirst', imgHFilterFirst);
  var labFilterFirstTree=createElement('b').myAppend('leafFilterFirstTree', imgHFilterFirstTree);
  var labDb=createElement('b').myAppend('leafDb', imgHDb);
  var labPrepend=createElement('b').myAppend('flPrepend', imgHPrepend);
  var labCharTRes=createElement('b').myAppend('charTRes', imgHCharTRes);
  var inpLabel=createElement('input').prop('type', 'text');
  var inpDirSource=createElement('input').prop('type', 'text');
  var inpDirTarget=createElement('input').prop('type', 'text');
  var inpFilterFirst=createElement('input').prop('type', 'text');
  var inpFilterFirstTree=createElement('input').prop('type', 'text');
  var inpDb=createElement('input').prop('type', 'text');
  var inpPrepend=createElement('input').prop('type', 'text');
  var selCharTRes=createElement('select');

  var Opt=[]
  for(var k of KeyTRes){
    var optT=createElement('option').myText(k).prop('value',k); Opt.push(optT);
  }
  selCharTRes.empty().myAppend(...Opt);
  
  [labLabel, labDirSource, labDirTarget, labFilterFirst, labFilterFirstTree, labDb, labPrepend, labCharTRes].forEach(ele=>ele.css({'margin-right':'0.5em'})); //, labFilterFirst_DB
  [inpLabel, inpDirSource, inpDirTarget, inpFilterFirst, inpFilterFirstTree, inpDb, inpPrepend, selCharTRes].forEach(ele=>ele.css({display:'block',width:'100%'})); //, inpFilterFirst_DB
  var inpNLab=[labLabel, inpLabel, labDirSource, inpDirSource, labDirTarget, inpDirTarget, labFilterFirst, inpFilterFirst, labFilterFirstTree, inpFilterFirstTree, labDb, inpDb, labPrepend, inpPrepend, labCharTRes, selCharTRes];

  //var buttonCancel=createElement('button').myText('Cancel').on('click',historyBack).css({'margin-top':'1em'});
  var buttonBack=createElement('button').myText(charBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack);
  var buttonSave=createElement('button').myText('Save').on('click',save).css({'margin-top':'1em'});
  var divBottom=createElement('div').myAppend(buttonBack, buttonSave);  //buttonCancel,

  var blanket=createElement('div').addClass("blanket");
  var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});

  //var divConsole=createElement('div').addClass("popupErrorConsole")
  var centerDiv=createElement('div').addClass("Center").myAppend(...inpNLab, divBottom, divConsoleContainer).css({'min-width':'17em','max-width':'30em', padding: '1.2em 0.5em 1.2em 1.2em'}); //height:'24em', 
  el.addClass("Center-Container").myAppend(centerDiv, blanket); 
    
  return el;
}


app.argumentDeletePopExtend=function(el){
  el.toString=function(){return 'argumentDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',async function(){   
    argumentTab.myRemove(elR);  
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};
    historyBack();
  });
  el.openFunc=function(){
    elR=this.parentNode.parentNode; spanId.myText(elR.rowData.label);
    doHistPush({strView:'argumentDeletePop'});
    el.setVis();
    butOK.focus();
  }
  el.setVis=function(){ el.show(); return 1; }
  el.setUp=function(){
    myConsole.clear();
    divConsoleContainer.myAppend(divConsole)
  }
  
  var elR;
  var head=createElement('h5').myText('Delete');
  var spanId=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanId);
  var buttonBack=createElement('button').myText("Cancel").on('click',historyBack).css({'margin-top':'1em'});

  var blanket=createElement('div').addClass("blanket");
  var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});
  var centerDiv=createElement('div').addClass("Center").myAppend(head,p, buttonBack, butOK, divConsoleContainer).css({'min-width':'17em','max-width':'25em', padding:'0.5em'});  //,cancel height:'10em', 
  el.addClass("Center-Container").myAppend(centerDiv, blanket); 
  
  return el;
}


  //label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes
app.argumentTabExtend=function(el){
  el.toString=function(){return 'argumentTab';}
  el.setBottomMargin=function(hNew){
    var hTmp=hNew+50
    divCont.css({'margin-bottom':hTmp+'px'})
  }
  el.saveToDisk=async function(){
    var Row=[...tBody.children], len=Row.length;
    var ObjOpt=Array(len)
    for(var i=0;i<len;i++) {  
      var elR=Row[i], objOpt=elR.rowData; ObjOpt[i]=objOpt
    }
    var [err]=await myStorage.setItem('ObjOpt',ObjOpt); if(err) return [err]
    argumentTab.dispatchEvent(eventMyUpdate);
    return [null]
  }
  el.myRemove=function(elR){
    elR.remove();
    RowCache.push(elR)
    if(elR.rowData.boSelected && tBody.childElementCount) tBody.children[0].rowData.boSelected=true;
    //el.nRowVisible=tBody.children.length;
    return el; 
  }
  //el.myEdit=function(elR, objRow){ return el; }
  el.reserveRows=function(n=1){
    var Rows=Array(n)
    for(var i=0; i<n;i++){
      var elR
      if(RowCache.length) {elR=RowCache.pop();}
      else { 
        var elR=document.createElement('tr'); 
        ArgumentTabRow.connectStuff.call(elR)
      } 
      tBody.append(elR); Rows[i]=elR;
    }
    return Rows
  }

  el.setUp=async function(){
    var [err, ObjOpt]=await myStorage.getItem('ObjOpt');  if(err) return [err];
    if(!Array.isArray(ObjOpt))  ObjOpt=[];

    var nOld=tBody.childElementCount, nNew=ObjOpt.length;
    if(nOld<nNew) el.reserveRows(nNew-nOld);
    else if(nOld>nNew){
      var Row=[...tBody.children];
      for(var i=nNew; i<nOld;i++){
        var elR=Row[i]; elR.remove(); RowCache.push(elR)
      }
    }
    var Row=[...tBody.children];
    //el.indexArgumentTabById={};
    for(var i=0;i<nNew;i++) {
      var objOptT=extend({}, ArgumentTabRow.rDefault)
      extend(objOptT, ObjOpt[i])
      //var objOptT=ObjOpt[i]
      var elR=Row[i]
      ArgumentTabRow.mySet.call(elR, objOptT);
      //el.indexArgumentTabById[objOptT.label]=objOptT;
    }

    divTopContainer.myAppend(divTop)
    myConsole.clear();
    divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    return [null]

  }
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.rowData.boSelected) return [null, row];}
  //   return [Error('No row selected!?!?')]
  // }
  el.getSelected=async function(){
    var [err, ObjOpt]=await myStorage.getItem('ObjOpt');  if(err) return [err];
    if(!Array.isArray(ObjOpt))  ObjOpt=[];
    var iSelected=NaN
    for(var i in ObjOpt){
      var objOpt=ObjOpt[i];
      if(objOpt.boSelected) {iSelected=i; break;}
    }
    if(isNaN(iSelected)) return [Error('no-argument-selected')]
    var objSelected=extend({}, ObjOpt[iSelected])
    for(var k in objSelected) {
      var v=objSelected[k]
      //if(typeof v=='string' && v.length==0) objSelected[k]=undefined;
      if(typeof v=='string' && v.length==0) delete objSelected[k];
    }
    return [null, objSelected];
  }
  el.clearSelected=function(){
    var Row=[...tBody.children];
    Row.forEach(function(rowA){
      var td=rowA.querySelector('[name=boSelected]'); td.mySetVal(false); rowA.rowData.boSelected=false
    })
  }
  el.nRows=function(){return tBody.childElementCount}
  var RowCache=[];

  var fsMyStorage=fsDataHome+charF+leafMyStorage, myStorage=new MyStorage(fsMyStorage)

  const eventMyUpdate = new Event("myupdate");

  var tBody=el.tBody=createElement('tbody');
  el.table=createElement('table').myAppend(tBody).addClass('tableSticky'); //.css({width:'100%',position:'relative'});

  //el.StrColOrder=['boSelected', 'label', 'fiDirSource','fiDirTarget', 'leafFilterFirst', 'leafFilterFirstTree', 'leafDb', 'flPrepend', 'charTRes'];
  var BoAscDefault={};
  var Label={boSelected:'Selected'};
  //el.nRowVisible=0;
  //var tHead=headExtend(createElement('thead'), el, StrColHead, BoAscDefault, Label);
  var trTmp=headExtendDyn(createElement('tr'), el, ArgumentTabRow.StrColOrder, BoAscDefault, Label);
  var tHead=createElement('thead').myAppend(trTmp);
  tHead.css({background:'white', width:'inherit'});  //,height:'calc(12px + 1.2em)'
  el.table.prepend(tHead);


      // menuA
  var buttonBack=createElement('button').myText(charBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack);
  var buttonAdd=createElement('button').myText('Add').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',function(){
    argumentSetPop.openFunc.call(null,0);
  });
  var spanLabel=createElement('span').myText('ArgumentTab'); //.css({'float':'right',margin:'0.2em 0 0 0'});  
  //var menuA=createElement('div').myAppend(buttonAdd,spanLabel).css({padding:'0 0.3em 0 0',overflow:'hidden','max-width':menuMaxWidth,'text-align':'left',margin:'.3em auto .4em'}); //buttonBack,

  //var divTopContainer=createElement('div').myText(fsDataHome).css({'margin-left':'0.4em'});
  var divTopContainer=createElement('div').css({'text-align':'center'});
  el.addClass('argumentTab');

  el.css({'text-align':'center'});

  var divCont=createElement('div').myAppend(el.table).css({margin:'0.2em auto','text-align':'left',display:'inline-block'});
  var divContW=createElement('div').myAppend(divCont).addClass('contDiv');

  var footDiv=createElement('div').myAppend(buttonBack, buttonAdd, spanLabel).addClass('footDiv'); 
  var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8, 'text-align':'left'});
  var footDivW=createElement('div').myAppend(divConsoleContainer, footDiv).addClass('footDivW').css({position:'fixed', bottom:'0px', opacity:0.8, 'flex-direction':'column', background:'white'});
  el.append(divTopContainer, divContW, footDivW);
  return el;
}


// Neutralino.os.open("https://neutralino.js.org/docs");

