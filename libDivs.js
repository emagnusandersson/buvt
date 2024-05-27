
"use strict"


//
// Theme functions
//

  // themeOS ∈ ['dark','light']
  // themeChoise ∈ ['dark','light','system']
  // themeCalc ∈ ['dark','light']
globalThis.analysColorSchemeSettings=function(){
  var themeOS=globalThis.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"
  //var themeChoise=localStorage.getItem("themeChoise")??"system";
  var themeChoise=localStorage.getItem("themeChoise")||"system";  // Safari 12 can't handle Nullish coalescing operator (??)
  var arrThemeChoise=['dark','light','system'];
  var ind=arrThemeChoise.indexOf(themeChoise);  if(ind==-1) ind=2;
  var themeChoise=arrThemeChoise[ind]
  var themeCalc=themeChoise=="system"?themeOS:themeChoise
  console.log(`OS: ${themeOS}, choise: ${themeChoise}, calc: ${themeCalc}`)
  return {themeOS, themeChoise, themeCalc}
}

var setThemeClass=function(theme){
  if(typeof theme=='undefined'){ var {themeOS, themeChoise, themeCalc}=analysColorSchemeSettings(); theme=themeCalc; }
  if(theme=='dark') elHtml.setAttribute('data-theme', 'dark'); else elHtml.removeAttribute('data-theme');
  var strT=theme; if(theme!='dark' && theme!='light') strT='light dark'
  elHtml.css({'color-scheme':strT});
}

  // Listen to prefered-color changes on the OS
globalThis.colorSchemeQueryListener = globalThis.matchMedia('(prefers-color-scheme: dark)');
if(colorSchemeQueryListener.addEventListener){ // Safari 12 does not support addEventlistner
  colorSchemeQueryListener.addEventListener('change', function(e) {
    setThemeClass()
  });
}

globalThis.SelThemeCreate={
  setValue:function(){ 
    var {themeOS, themeChoise, themeCalc}=analysColorSchemeSettings();
    this.value=themeChoise
    //var [optSystem, optLight, optDark]=this.querySelectorAll('option');
    //var charLight=themeCalc=='light'?'◻':'◼', charDark=themeCalc=='light'?'◼':'◻'
    //optLight.myText(charLight+' '+SelThemeCreate.strLight)
    //optDark.myText(charDark+' '+SelThemeCreate.strDark)
  },
  strOS:'Same theme as OS', strLight:'Light theme', strDark:'Dark theme',
  factory:function(){
    var {strOS, strLight, strDark}=SelThemeCreate
    var optSystem=createElement('option').myHtml('◩&nbsp;&nbsp;&nbsp;'+strOS).prop({value:'system'})  //⛅
    var optLight=createElement('option').myHtml('☼&nbsp;&nbsp;&nbsp;'+strLight).prop({value:'light'})  //☼☀☀️◻◨
    var optDark=createElement('option').myHtml('☽&nbsp;&nbsp;&nbsp;'+strDark).prop({value:'dark'})  //☾☽◼☁️🌙🌒 🌒
    var Opt=SelThemeCreate.Opt=[optSystem, optLight, optDark]
    var el=createElement('select').myAppend(...Opt).on('change',function(e){
      localStorage.setItem('themeChoise', this.value);
      setThemeClass();
      this.setValue()
    })
    el.prop({title:"Change color theme"})

    var Key=Object.keys(SelThemeCreate); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, SelThemeCreate, Key);
    return el;
  }
}
  

// gThis.historyBack=function(){  history.back();}
// gThis.doHistPush=function(obj){
//   var stateT=history.state
//   var {strView, arg=null}=obj;
//   var scroll=(strView==stateT.strView)?stateT.scroll:0;

//   var indNew=stateT.ind+1;
//   stateMem={hash:stateT.hash, ind:indNew, strView, scroll, arg, f:(function(a){myConsole.log('hello: '+a);}).toString()};
//   history.pushState(stateMem, strHistTitle, uCanonical);
//   history.StateOpen=history.StateOpen.slice(0, indNew);
//   history.StateOpen[indNew]=obj;
// }
gThis.strViewFront='viewFront';
gThis.myHistory={History:[{strView:strViewFront}],cur:0}
gThis.doHistPush=function(obj){
  var {cur, History}=myHistory, curNew=cur+1
  History[curNew]=obj; History.length=curNew+1
  myHistory.cur=curNew
}
gThis.historyBack=function(){  
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
  var imgBusyLoc=imgBusy.cloneNode().css({'margin-left':'0.4em', zoom:'65%'}).hide(); //transform:'scale(0.65)',
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

var headExtend=function(elTr, tBody, nRowVisible){
  elTr.setArrow=function(strName,dir){
    boAsc=dir==1;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
    var fiTmp=boAsc?fiIncreasing:fiDecreasing;
    elTr.querySelector(`${strTH}[name=${strName}]`).querySelector('img[data-type=sort]').prop({src:fiTmp});
  }
  elTr.clearArrow=function(){
    thSorted=null, boAsc=false;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
  }
  var thClick=function() {
    var ele=this, boAscDefault=Boolean(ele.boAscDefault); //??0
    boAsc=(thSorted===this)?!boAsc:boAscDefault;  thSorted=this;
    arrImgSort.forEach(function(ele){ele.prop({src:fiUnsorted}) });
    var fiTmp=boAsc?fiIncreasing:fiDecreasing;  ele.querySelector('img[data-type=sort]').prop({src:fiTmp});
    //var tBody=tableDiv.tBody;
    //var arrT=[...tBody.querySelectorAll(strTR)];
    var arrT=[...tBody.children];
    //var arrToSort=arrT.slice(0, tableDiv.nRowVisible);
    var arrToSort=arrT.slice(0, nRowVisible);
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
    tBody.append(...arrToSortN);
  }

  //var tBody=objArg.tBody;
  //var strTH=strTD=='td'?'th':strTD;
  var boAsc=false, thSorted=null;

  //var Th=elTr.querySelectorAll(strTH)
  var Th=[...elTr.children]
  var len=Th.length;
  var arrImgSort=Array(len);
  for(var i=0;i<len;i++){
    var h=Th[i];
    var imgSort=createElement('img').attr('data-type', 'sort').prop({src:fiUnsorted, alt:"sort"}).addClass('invertOnDark').css({"vertical-align":"middle"});
    h.myAppend(imgSort).on('click',thClick).css({cursor:"default"});
    arrImgSort[i]=imgSort;
  }

  return elTr;
}



gThis.divTopCreator=function(el){
  // var settingButtonClick=function(){
  //   viewSettingEntry.setVis(); doHistPush({strView:'viewSettingEntry'});
  // }
  // var settingButton=createElement('button').myAppend('⚙').addClass('fixWidth').prop('title','Settings').on('click',settingButtonClick); 

  var argumentButton=createElement('button').myText('Option preset').addClass('fixWidth').on('click',function(){
    doHistPush({strView:'argumentTab'});
    argumentTab.setVis();
  });
  el.mySetLinkNLabel=async function(){
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') var label='(no-argument-selected)';
      else {debugger; myConsole.error(err); return;}
    }
    else { var {label, fiDirSource, leafDb=settings.leafDb, leafFilterFirst=settings.leafFilter, leafFilterFirstTree=settings.leafFilter}=result; }
    
    argumentButton.myText(`⚙ (${label})`) //+' ◂'

    //var [err, fsDb]=await myRealPath(fiDirSource+charF+leafDb); if(err) {debugger; myConsole.error(err); return;}
    var p=myRealPath(fiDirSource+charF+leafDb); //if(err) {debugger; myConsole.error(err); return;}
    var arr=await p;
    var [err, fsDb]=arr; if(err) {debugger; myConsole.error(err); return;}
    divT2D.linkDb.fsLink=fsDb
    divT2D.linkDb.prop({title:fsDb})
    divT2D.linkDb.myText(leafDb)

    var [err, fsFilterFirst]=await myRealPath(fiDirSource+charF+leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
    divT2D.linkFilterFirst.fsLink=fsFilterFirst
    divT2D.linkFilterFirst.prop({title:fsFilterFirst})
    //divT2D.linkFilterFirst.myText(leafFilterFirst)

    var [err, fsFilterFirstTree]=await myRealPath(fiDirSource+charF+leafFilterFirstTree); if(err) {debugger; myConsole.error(err); return;}
    divT2T.linkFilterFirstTree.fsLink=fsFilterFirstTree
    divT2T.linkFilterFirstTree.prop({title:fsFilterFirstTree})
    //divT2T.linkFilterFirstTree.myText(leafFilterFirstTree)
    var boEnable=leafFilterFirst!=leafFilterFirstTree
    //divT2T.linkFilterFirstTree.toggle(boEnable)
    if(boEnable) divT2T.linkFilterFirstTree.removeClass('disabled'); else divT2T.linkFilterFirstTree.addClass('disabled')

  }
  el.setButTab=function(strView){
    ButTab.forEach(b=>b.css({background:'var(--bg-color)'}))
    var Views=[viewFront, viewCheck, argumentTab];
    var StrView=Views.map(v=>v.toString())
    var iView; StrView.forEach((strV,i)=>{if(strV==strView) iView=i;})
    ButTab[iView].css({background:'var(--bg-colorEmp)'})

  }
  var butFront=createElement('button').myAppend('Main').on('click',  function(){
    doHistPush({strView:'viewFront'});
    viewFront.setVis();
  });
  var butCheck=createElement('button').myAppend('Check').on('click',  function(){
    doHistPush({strView:'viewCheck'});
    viewCheck.setVis();
  });


  var linkAppFolder=createElement('a').myAppend('App-data folder').prop({href:'', title:fsDataHome}).on('click',  async function(ev){
    ev.preventDefault();
    var arrCommand=[strExec, fsDataHome];
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    }
  }); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'

  var linkResultFolder=createElement('a').myAppend('Result folder').prop({href:'', title:fsResultFolder}).on('click',  async function(ev){
    ev.preventDefault();
    var arrCommand=[strExec, fsResultFolder];
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    }
  }); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'


  var uWiki='https://emagnusandersson.com/buvt'
  var linkWiki=createElement('a').prop({href:uWiki}).myText('Web info').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uWiki); }); //.css({'margin-left':'0.4em', 'text-align':'center'})

  var uNotation='https://emagnusandersson.com/Buvt_Notations'
  var linkNotation=createElement('a').prop({href:uNotation}).myText('Notations').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uNotation); });

  var selectorOfTheme=SelThemeCreate.factory();  setThemeClass(); selectorOfTheme.setValue();
  selectorOfTheme.css({ width:"2.5em", 'vertical-align':'bottom', padding:0})
  
  var ButTab=[butFront, butCheck, argumentButton]
  ButTab.forEach(b=>b.css({'border-bottom':'0px', 'border-top-left-radius':'10px', 'border-top-right-radius':'10px', 'border-bottom-left-radius':'0', 'border-bottom-right-radius':'0'}))


  el.myAppend(...ButTab, ' ', linkAppFolder, ' | ', linkWiki, ' | ', linkNotation, ' | ', selectorOfTheme);  //, imgBusy , butClear .addClass('footDiv') , settingButton, , divNotations, ' | ', linkDb
  //var ElT=[]; 
  if(fsResultFolder!=fsDataHome) {
    // var frag=createFragment(linkResultFolder,' | ')
    // linkAppFolder.myBefore(frag)
    var frag=createFragment(' | ', linkResultFolder)
    linkAppFolder.myAfter(frag)
    
    // linkAppFolder.insertAdjacentElement('afterend', linkResultFolder)
    // linkAppFolder.insertAdjacentHTML('afterend', ' | ')
  }
  el.css({'border-bottom':'solid var(--bg-colorEmp)'})
  return el
}


/***********************************************
 *   divTopOpenStuffCreator
 **********************************************/
var makeOpenExtCB=function(key){
  var cbFunI=async function(ev){
    ev.preventDefault()
    var arrCommand=[strExec, FsResultFile[key]]
    var strCommand=arrCommand.join(' ');
    // var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}  // Using spawn doesn't work on Windows !!!?!?!?
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
  }
  return cbFunI
}
gThis.divTopOpenStuffCreator=function(el){

  return el
}




/***********************************************
 * divSMTabCreator
 **********************************************/

gThis.divSMTabCreator=function(el, ...Fun){
  el.clearVal=function(){
    span01.myText(`-`); span02.myText(`-`); but02.myText(`-`); span0XSum.myText(`-`); 
    span10.myText(`-`); span11.myText(`-`); but11.myText(`-`); span12.myText(`-`); but12.myText(`-`); 
    span20.myText(`-`); but20.myText(`-`); span21.myText(`-`); but21.myText(`-`); span22.myText(`-`); but22.myText(`-`);
    span2XSum.myText(`-`); 
    spanX0Sum.myText(`-`); spanX2Sum.myText(`-`)
    spanSumS.myText(`-`); spanSumT.myText(`-`);
    spanSumPatS.myText(`-`); spanSumPatT.myText(`-`);
    spanTot.myText(`-`); spanBoth.myText(`-`);
  }
  el.setVal=function(Mat){
    var {NPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=Mat.getN()
    var {nPatY11,nPatY12,nPatY21,nPatY22, nPatA10,nPatA20,nPatB01,nPatB02,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}=objDetail

    var nA2XSum=nA20+nA21+nA22
    var nBX2Sum=nB02+nB12+nB22
    var nPatA2XSum=nPatA20+nPatY21+nPatY22;
    var nPatBX2Sum=nPatB02+nPatY12+nPatY22;

    var nPatBoth=nPatY11+nPatY12+nPatY21+nPatY22;


    span01.myText('\\ '+nB01)
    var strT=`\\ ${nB02}(${nPatB02})`; span02.myText(strT); but02.myText(strT)
    var nB0XSum=nB01+nB02,  nPatB0XSum=nB01+nPatB02
    span0XSum.myText(`\\ ${nB0XSum}(${nPatB0XSum})`)
    span10.myText(nA10+' \\')
    span11.myText(nA11); but11.myText(nA11)
    var strT=`\\ ${nB12}(${nPatY12})`; span12.myText(strT); but12.myText(strT)
    var strT=`${nA20}(${nPatA20}) \\`; span20.myText(strT); but20.myText(strT)
    var strT=`${nA21}(${nPatY21}) \\`; span21.myText(strT); but21.myText(strT)
    var strT=`${nA22} \\ ${nB22} (${nPatY22})`; span22.myText(strT); but22.myText(strT); 

    span2XSum.myText(`${nA2XSum}(${nPatA2XSum})`)
    var nAX0Sum=nA10+nA20, nPatAX0Sum=nA10+nPatA20
    spanX0Sum.myText(`${nAX0Sum}(${nPatAX0Sum}) \\`)
    spanX2Sum.myText(`${nBX2Sum}(${nPatBX2Sum})`)
    spanSumS.myText(nA) 
    spanSumT.myText(nB) 
    spanSumPatS.myText(nAPat); spanSumPatT.myText(nBPat);
    spanTot.myText(nPat); spanBoth.myText(nPatBoth);
  }
  var htmlHead=`<tr><th class=backcrossed>S <span>T</span></th> <th>0</th> <th>1</th> <th>Many</th> <td>∑</td></tr>`; //S⇣ \\ T⇾
  var htmlBody=
  `<tr><th>0</th><td>(∞)</td><td><span>-</span></td> <td><span>-</span><a>-</a></td> <th><span>-</span></th></tr>
  <tr><th>1</th><td><span>-</span></td><td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td></tr>
  <tr><th>Many</th><td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td><th><span>-</span> \\</th></tr>
  <tr><td rowspan=2>∑</td><th><span>-</span></th><td></td><th>\\ <span>-</span></th></tr>
  <tr><th colspan=3><span>-</span>(<span>-</span>) \\ <span>-</span>(<span>-</span>) (<span title="Total number of patterns">-</span>/<span title="Number of patterns that occur on both sides.">-</span>)</th></tr>`
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [trH]=tHead.children;
  var [tr0, tr1, tr2, trSum, trSumS]=tBody.children
  var [thST,,,,tdT]=trH.children; tdT.cssExc({'border-top':'hidden!important', 'border-right':'hidden!important', 'border-left':'solid', background:'transparent'}); // Sum-sign in upp-right corner
  thST.children[0].css({float:'right'})
  //var [,,,td22]=tr2.children; td22.cssExc({'border-top':'hidden!important', 'border-left':'hidden!important'})
  //var [tdTmp]=trSum.children; tdTmp.cssExc({'border-bottom':'hidden!important', 'border-left':'hidden!important', 'text-align':'end', background:'transparent'});  // Sum-sign in lower-left corner

  var arr0=tr0.querySelectorAll('span'), [span01,span02,span0XSum]=arr0
  var But0=tr0.querySelectorAll('a'), [but02]=But0
  var arr1=tr1.querySelectorAll('span'), [span10,span11,span12]=arr1
  var But1=tr1.querySelectorAll('a'), [but11,but12]=But1
  var arr2=tr2.querySelectorAll('span'), [span20,span21,span22, span2XSum]=arr2
  var But2=tr2.querySelectorAll('a'), [but20,but21,but22]=But2
  var [spanX0Sum, spanX2Sum]=trSum.querySelectorAll('span')
  var [spanSumS, spanSumPatS, spanSumT, spanSumPatT, spanTot, spanBoth]=trSumS.querySelectorAll('span')
  var Span=[...arr0, ...arr1, ...arr2];  Span.forEach(ele=>ele.addClass('num')); //, spanX0Sum, spanX2Sum, span0XSum, span2XSum, spanSumS
  //var Span=[spanSumS, spanSumT, spanX2Sum, span2XSum]; Span.forEach(ele=>ele.css({'text-decoration':'underline red 2px'}));
  var But=[...But0, ...But1, ...But2];  But.forEach(ele=>ele.addClass('smallBut').prop({href:""}))
  //tr2.css({'border-bottom':'solid'})
  var arrT=tr2.children; arrT=[...arrT].slice(0,-1); arrT.forEach(ele=>ele.css({'border-bottom':'solid'}));

  var arrT=tBody.querySelectorAll('td:nth-of-type(3)');  arrT.forEach(ele=>ele.css({'border-right':'solid'}))
  //but22.css({padding:'0em', 'vertical-align':'bottom', 'font-size':'0.85em'})

  var [fun02, fun11, fun12, fun20, fun21, fun22]=Fun
  var bo02=Boolean(fun02); but02.toggle(bo02); span02.toggle(!bo02);   if(bo02) but02.on('click',fun02)
  var bo11=Boolean(fun11); but11.toggle(bo11); span11.toggle(!bo11);   if(bo11) but11.on('click',fun11)
  var bo12=Boolean(fun12); but12.toggle(bo12); span12.toggle(!bo12);   if(bo12) but12.on('click',fun12)
  var bo20=Boolean(fun20); but20.toggle(bo20); span20.toggle(!bo20);   if(bo20) but20.on('click',fun20)
  var bo21=Boolean(fun21); but21.toggle(bo21); span21.toggle(!bo21);   if(bo21) but21.on('click',fun21)
  var bo22=Boolean(fun22); but22.toggle(bo22); span22.toggle(!bo22);   if(bo22) but22.on('click',fun22)

  el.myAppend(table);  
  return el
}

gThis.divSMMatchCreator=function(el, ...Fun){
  el.clearVal=function(){
    menuMat.clearVal()
    //hovDetail.myText(`- \\ -, M: -(-) \\ -(-) (-)`)
    hovDetail.myText(`Tot: - \\ -, Mult: - \\ - (-)`)
  }
  el.setVal=function(Mat){

    var {NPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=Mat.getN()
    var {nPatY11,nPatY12,nPatY21,nPatY22, nPatA10,nPatA20,nPatB01,nPatB02,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}=objDetail

    var nA2XSum=nA20+nA21+nA22
    var nBX2Sum=nB02+nB12+nB22

    var nPatA2XSum=nPatA20+nPatY21+nPatY22;
    var nPatBX2Sum=nPatB02+nPatY12+nPatY22;
    var nPatMultBoth=nPatY21+nPatY12+nPatY22;
    //hovDetail.myText(`${nA} \\ ${nB}, M: ${nA2XSum}(${nPatA2XSum}) \\ ${nBX2Sum}(${nPatBX2Sum}) (${nPatMultBoth})`)  // (${nPat})
    hovDetail.myText(`Tot: ${nA} \\ ${nB}, Mult: ${nA2XSum} \\ ${nBX2Sum} (${nPatMultBoth})`)  // (${nPat})

    menuMat.setVal(Mat)
  }

  
  var menuMat=createElement('div')
  divSMTabCreator(menuMat, ...Fun); //, undefined, fun
  menuMat.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); // 'font-size':'0.9rem', 
  //el.spanDetail=createElement('span'); //.myAppend(menuMat).hide(); 
  var butOpenList=createElement('a').myText(`List`).addClass('smallBut').on('click',fun).prop({href:"", title:`List of multiples (Opens in external editor.)`});
  var fun=Fun.length==1?Fun[0]:false
  butOpenList.toggle(fun);  //.css({'margin-left':'0.3em'})
  //var butOpenPop=createElement('button').myText(`Details`).addClass('smallBut').css({'margin-left':'0.3em'}).prop({title:`More Detailed`}).on('click',()=>divT2T.toggleDetail()); //el.spanDetail.toggle()
  var spanLab=createElement('span').myText(`Multiples`);

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  //popupHover(hovDetail, menuMat);
  var elWrap=createElement('span').myAppend(hovDetail, menuMat)
  var elPar=elBody
  myMenu(elWrap, elPar)

  el.myAppend(elWrap, ' ', butOpenList); //, ', ', spanLab, ': ', spanMultSum
  //el.css({display:'inline'})
  return el
}




gThis.divCategoryTabT2DCreator=function(el){
  var self=el
  el.clearVal=function(){
    butDoActionRam.prop({disabled:true});   butDoAction.prop({disabled:true})
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
    this.syncTreeToDb=syncTreeToDb

    var {Mat1, Mat2, nUntouched, nMetaMatch, nNSM, nChanged, nReusedName, nReusedId, nCreate, nDelete, n1T1NoName, nSourceMultNoName, nTargetMultNoName, nSource, nTarget, boChanged}=syncTreeToDb

    //if(!boChanged) {myConsole.log('Everything is up to date, aborting.'); return;}
    divMat2.setVal(Mat2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)
    butRenamed.myText(nMetaMatch);  spanRenamedAction.myText(nMetaMatch)
    butCopiedNRenamedToOrigin.myText(nNSM);  spanCopiedNRenamedToOriginAction.myText(nNSM)
    butChanged.myText(nChanged);  spanChangedAction.myText(nChanged)
    butReusedName.myText(nReusedName);  spanReusedNameAction.myText(nReusedName)
    butReusedId.myText(nReusedId);  spanReusedIdAction.myText(nReusedId)
    butCreated.myText(nCreate); spanCreatedAction.myText(nCreate);
    butDeleted.myText(nDelete); spanDeletedAction.myText(nDelete); 
    but1T1.myText(n1T1NoName); span1T1Action.myText(n1T1NoName);
    var strT=nSourceMultNoName+' \\ '+nTargetMultNoName; butMult.myText(strT); spanMultActionC.myText(nSourceMultNoName); spanMultActionD.myText(nTargetMultNoName);

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)

    var nShortCut=nUntouched+nMetaMatch+nNSM; spanSumSC.myText(nShortCut);
    var nMatchButNoSC=nChanged+nReusedName+nReusedId+n1T1NoName, nDeleteTmp=nMatchButNoSC+nTargetMultNoName+nDelete, nCreateTmp=nMatchButNoSC+nSourceMultNoName+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);
    var boAction=Boolean(nMetaMatch+nNSM+nDeleteTmp+nCreateTmp)
    butDoActionRam.prop({disabled:!boAction});   butDoAction.prop({disabled:!boAction})

      // Checking the sums
    var nSomeKindOfMatching=nShortCut+nMatchButNoSC
    var nSourceCheck=nSomeKindOfMatching+nSourceMultNoName+nCreate, nTargetCheck=nSomeKindOfMatching+nTargetMultNoName+nDelete
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
<tr><th colspan=3>Matching</th> <th title="Number of files in S (S=source)" rowspan=2>nS</th> <th title="Number of files in T (T=target)" rowspan=2>nT</th> <th rowspan=2>Cate­gorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Id</th> <th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short-cut</th> <th>Del­ete</th> <th>Cre­ate</th></tr>`

//<tr><td colspan=9>  <div class=dupEntry>SM-Match: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>-</th><th>OK</th> <td colspan=2><a href="">-</a></td><td>Renamed</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th>OK</th><th>OK</th> <td colspan=2><a href="">-</a></td><td title="On NTFS defragmentation changes the fileId.\n(On ext4 however, defragmentation does NOT change the inode.)\nOther example: File copied, origin deleted, then the copy is renamed to origin.">"Defragged"</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Reused name</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>OK</th><th>-</th><th>-</th> <td colspan=2><a href="">-</a></td><td title="Ex: Renamed and changed">Reused id</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><td colspan=9>  <div class=dupEntry>SM-Match: </div>  </td></tr>
<tr><th>-</th><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created / Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a></td> <td title="One-to-one relation (The SM combination exists exactly once each on S and T)\nEx: File copied, origin deleted.">1T1</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <td title="Relations where the pattern exists once or more on each side (S and T) except for 1T1-relations. (1Tm+mTm+mT1)">Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=3>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><td colspan=6></td><td colspan=3> <button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button> <button title="As per the current state of the result-files">Do actions</button></td></tr>`
// The pattern exists on both S and T and more than once on at least one of them. <br/>(read fr files)
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  //var [trMat1, trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trRemaining, trSum]=arrTR
  var [trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trMat2, trCreatedNDeleted, tr1T1, trMult, trSum, trSyncAccordingToFiles]=arrTR; //trMat1, 
  // var arrTRT=arrTR.slice(1,-5).concat(arrTR.slice(-4,-2)); arrTRT.forEach(ele=>ele.children[3]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  // var arrTRT=arrTR.slice(4,-5).concat(arrTR.slice(-4,-3)); arrTRT.forEach(ele=>ele.children[6]?.css({'text-align':'center'})); //Centering merged Delete/Create columns


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
  var [butDoActionRam, butDoAction]=trSyncAccordingToFiles.querySelectorAll('button'); 



  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat2]=arrDup;//divMat1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divSMMatchCreator(divMat2);

  butRenamed.on('click', makeOpenExtCB('T2D_renamed'))
  butCopiedNRenamedToOrigin.on('click', makeOpenExtCB('T2D_copiedThenRenamedToOrigin'))
  butChanged.on('click', makeOpenExtCB('T2D_changed'))
  butReusedName.on('click', makeOpenExtCB('T2D_reusedName'))
  butReusedId.on('click', makeOpenExtCB('T2D_reusedId'))
  butCreated.on('click', makeOpenExtCB('T2D_created'))
  butDeleted.on('click', makeOpenExtCB('T2D_deleted'))
  but1T1.on('click', makeOpenExtCB('T2D_1T1NoName'))
  butMult.on('click', makeOpenExtCB('T2D_STMatch2'))

  butDoActionRam.parentNode.css({'text-align':'center'})
  butDoActionRam.on('click', async function(){
    resetMess();

    var [err]=await self.syncTreeToDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    //var [err]=await T2DCreateSyncData.call(self.syncTreeToDb); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    
    if(boAskBeforeWrite){
      var boOK=confirm(`Overwrite ${self.syncTreeToDb.fsDb}`);  if(!boOK) {resetMess(); return}
    }

    //var [err]=await T2DMakeChanges.call(self.syncTreeToDb)
    var [err]=await self.syncTreeToDb.makeChanges()
    setMess('Do actionsRam: Done');
  })
  butDoAction.on('click', async function(){
    resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["charTRes", "leafFilterFirst", "flPrepend", "leafDb"])
    var [err, fsDirSource]=await myRealPath(result.fiDirSource); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    extend(args, {fsDirSource})
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    var syncTreeToDb=new SyncTreeToDb(args);
    var [err]=await syncTreeToDb.readAction(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var [boAbort, strMess]=syncTreeToDb.getMess()
    if(boAbort) {setMess('Nothing to do, aborting'); return;}
    var [err]=await syncTreeToDb.doSCChanges(); if(err) {myConsole.error(err); resetMess(); return;}
    var [err]=await syncTreeToDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    if(boAskBeforeWrite){
      var boOK=confirm(`Overwrite ${syncTreeToDb.fsDb}`);   if(!boOK) {resetMess(); return}
    }
    var [err]=await syncTreeToDb.makeChanges(); if(err) {debugger; myConsole.error(err); resetMess(); return;}

    setMess('Do actions: Done'); 
  });
  butDoActionRam.hide()
  
  el.myAppend(table);  
  return el
}



/***********************************************
 *   divT2DCreator
 **********************************************/
gThis.divT2DCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewT2D';}
  
  el.setUp=function(){
  }

  var butCompareTreeToDb=createElement('button').myAppend('Compare').on('click', async function(){
    myConsole.clear(); el.clearVal(); resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["charTRes", "leafFilterFirst", "flPrepend"])
    var [err, fsDirSource]=await myRealPath('/home/magnus/progPython/buvt-SourceFs/Source/link.txt'); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var [err, fsDirSource]=await myRealPath(result.fiDirSource); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    extend(args, {fsDirSource})
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    var syncTreeToDb=new SyncTreeToDb(args);
    var [err]=await syncTreeToDb.compare();   if(err) { debugger; myConsole.error(err); resetMess(); return; }
    divT2D.setVal(syncTreeToDb);
    setMess('Compare tree to Db: Done');
  });
  var butSyncTreeToDb=createElement('button').myAppend('Sync').prop({title:`Same as "Compare" plus doing the suggested actions from the compare-call.`}).on('click', async function(){
    //myConsole.clear(); 
    el.clearVal(); resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["charTRes", "flPrepend"])
    var [err, fsDirSource]=await myRealPath(result.fiDirSource); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    extend(args, {fsDirSource})
    args.leafFilterFirst=result.leafFilterFirst||settings.leafFilter
    var syncTreeToDb=new SyncTreeToDb(args);
    var [err]=await syncTreeToDb.compare();   if(err) { debugger; myConsole.error(err); resetMess(); return; }
    divT2D.setVal(syncTreeToDb)
    if(syncTreeToDb.objHL.boHL) {resetMess(); return}
    if(!syncTreeToDb.boChanged){ myConsole.log('Everything is up to date, aborting.'); resetMess(); return;  }

    var [err]=await syncTreeToDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    //var [err]=await T2DCreateSyncData.call(syncTreeToDb); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    if(boAskBeforeWrite){
      var boOK=confirm(`Overwrite ${syncTreeToDb.fsDb}`);
      if(!boOK) {resetMess(); return}
    }
    var [err]=await syncTreeToDb.makeChanges()
    //var [err]=await SyncTreeToDb.makeChanges.call(syncTreeToDb)
    //var [err]=await T2DMakeChanges.call(syncTreeToDb)
    setMess('Sync tree to Db: Done');
  });


  var butCompareTreeToDbSMOnly=createElement('button').myAppend('Compare source tree to db (SMOnly)').on('click', async function(){
    myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
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
    //butMore.myText('-')
    divIdMatch.clearVal()
    //divHashMatch.clearVal()
    divMat1.clearVal()
  }
  el.setVal=function(syncTreeToDb){
    var {Mat1, objHL}=syncTreeToDb;
    divIdMatch.setVal(syncTreeToDb)
    var {boHL}=objHL;  if(boHL) return 
    //divHashMatch.setVal(syncTreeToDb)
    divMat1.setVal(Mat1)
    divCategoryTab.setVal(syncTreeToDb)
  }

  el.linkFilterFirst=createElement('a').myText('filterFirst').prop({ href:""}).on('click',  async function(ev){
    ev.preventDefault();
    this.prop({title:`top filter file ${this.fsLink}`})
    var arrCommand=[strExec, this.fsLink]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    } 
  });


  el.linkDb=createElement('a').myText('db-file').prop({href:"",title:'Open the db-file in a text editor'}).on('click',  async function(ev){
    ev.preventDefault();
    this.prop({title:`db file ${this.fsLink}`})
    var arrCommand=[strExec, this.fsLink]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    } 
  });

  var hT2D=createElement('b').myText('Tree to Db')
  var divButton=createElement('div').myAppend(hT2D, ' ', butCompareTreeToDb, butSyncTreeToDb, ' ', el.linkFilterFirst, ' | ', el.linkDb).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px"}); //, position:'sticky'


  var strTitleDefault=`______nName(nId)\nFiles: -(-)\nFolders: -(-)\nDb: -(-})`

  //var {cbFun}=ObjOpenExtData["T2D_HL"]
  //var htmlHL=`Tot: <span>-</span> \\ <span>-</span>. Multiple id: <a href="" >-</a> <span>-</span>` 

  //var emData=elBody.querySelector('embed'); debugger
  


  var divIdMatch=createElement('div'); divIdMatchCreator(divIdMatch, makeOpenExtCB("T2D_HL"))
  //var divHashMatch=createElement('div'); divHashMatchCreator(divHashMatch, makeOpenExtCB("T2D_Hash"))

  var divMat1=createElement('div').myHtml(`SM-Match: `);
  divSMMatchCreator(divMat1, makeOpenExtCB("T2D_STMatch1_02"), null, makeOpenExtCB("T2D_STMatch1_12"), makeOpenExtCB("T2D_STMatch1_20"), makeOpenExtCB("T2D_STMatch1_21"), makeOpenExtCB("T2D_STMatch1_22"));
  
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
  divResult.myAppend(divIdMatch, divMat1, divCategoryTabW); //, divHashMatch


  el.myAppend(divButton, divResult); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}

gThis.menuIdCreator=function(el, fun){
  el.clearVal=function(){
    tdAllFile.myText(`-(-)`);
    tdAllFolder.myText(`-(-)`);
    tdAllDb.myText(`-(-)`);
    //tdMultFile.myText(`-(-)`);
    tdMultFolder.myText(`-(-)`);
    tdMultDb.myText(`-(-)`);

    butMult.myText(`-(-)`)
  }
  el.setVal=function(syncTreeToDb){
    var {objHL}=syncTreeToDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL}=objHL

    tdAllFile.myText(`${nTreef}(${nIdf})`);
    tdAllFolder.myText(`${nTreeF}(${nIdF})`);
    tdAllDb.myText(`${nDb}(${nIdDb})`);
    //tdMultFile.myText(`${nMultf}(${nMultIdf})`);
    tdMultFolder.myText(`${nMultF}(${nMultIdF})`);
    tdMultDb.myText(`${nMultDb}(${nMultIdDb})`);

    butMult.myText(`${nMultf}(${nMultIdf})`)
  }

  var htmlHeadAll=`<tr><th> </th><th>nName(nId)</th></tr>` 
  var htmlBodyAll=`<tr><th>Files</th><td>-</td></tr>
<tr><th>Folders</th><td>-</td></tr>
<tr><th>Db</th><td>-</td></tr>` 
  var htmlHeadMult=`<tr><th> </th><th>nName(nId)</th></tr>` 
  var htmlBodyMult=`<tr><th>Files</th><td></td></tr>
  <tr><th>Folders</th><td>-</td></tr>
  <tr><th>Db</th><td>-</td></tr>` 

  var captionAll=createElement('caption').myText('Total:')
  var tHeadAll=createElement('thead').myHtml(htmlHeadAll);
  var tBodyAll=createElement('tbody').myHtml(htmlBodyAll);
  var tableAll=createElement('table').myAppend(captionAll, tHeadAll, tBodyAll);

  var captionMult=createElement('caption').myText('Multiples:')
  var tHeadMult=createElement('thead').myHtml(htmlHeadMult);
  var tBodyMult=createElement('tbody').myHtml(htmlBodyMult);
  var tableMult=createElement('table').myAppend(captionMult, tHeadMult, tBodyMult);

  var arrAllTR=[...tBodyAll.children],  [trAllFile, trAllFolder, trAllDb]=arrAllTR;
  var arrMultTR=[...tBodyMult.children],  [trMultFile, trMultFolder, trMultDb]=arrMultTR;

  var [tdAllFile]=trAllFile.querySelectorAll('td')
  var [tdAllFolder]=trAllFolder.querySelectorAll('td')
  var [tdAllDb]=trAllDb.querySelectorAll('td')
  var [tdMultFile]=trMultFile.querySelectorAll('td')
  var [tdMultFolder]=trMultFolder.querySelectorAll('td')
  var [tdMultDb]=trMultDb.querySelectorAll('td')
  
  var butMult=createElement('a').prop({href:""}).myHtml('-').on('click',fun);
  tdMultFile.myAppend(butMult)
  
  el.myAppend(tableAll, tableMult);
  return el
}


gThis.divIdMatchCreator=function(el, fun){
  el.clearVal=function(){
    spanHLCheckResult.myText('-').css({color:'var(--text-color)'})
    //hovDetail.myText(`-(-)`)
    hovDetail.myText(`Tot: -(-) Mult: -(-)`)
    elMenu.clearVal()
    //butMult.myText('-(-)')
  }
  el.setVal=function(syncTreeToDb){
    var {objHL}=syncTreeToDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL}=objHL
    spanHLCheckResult.css({color:boHL?'var(--text-red)':'var(--text-green)'}).myText(boHL?'FAIL, ABORTING':'OK'); //Hard link check 
    hovDetail.myText(`Tot: ${nTreef}(${nIdf}) Mult: ${nMultf}(${nMultIdf})`)
    elMenu.setVal(syncTreeToDb)
    //butMult.myText(`${nMultf}(${nMultIdf})`)
  }
  
  var spanHLCheckResult=createElement('span').css({'font-weight':'bold'}).myText('-');

  var elMenu=createElement('div')
  menuIdCreator(elMenu,fun)
  elMenu.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); 

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  var elWrap=createElement('span').myAppend(hovDetail, elMenu)
  var elPar=elBody;  myMenu(elWrap, elPar)

  var butMult=createElement('a').prop({href:''}).myText('Mult.-list').on('click',fun);; 

  el.myAppend('Id-Match (Hard-link check: ', spanHLCheckResult, '): ', elWrap, ', ', butMult); //, ', ', spanLab, ': ', spanMultSum
  //el.css({display:'inline'})
  return el
}





gThis.divHashMatchCreator=function(el, fun){
  el.clearVal=function(){
    spanTotal.myText('-(-)')
    butMult.myText('-(-)')
  }
  el.setVal=function(syncTreeToDb){
    var {objHash}=syncTreeToDb;
    var {n, nPatHash, nPatHashMult, nHashMult}=objHash
    spanTotal.myText(`${n}(${nPatHash})`)
    butMult.myText(`${nHashMult}(${nPatHashMult})`)
  }
  
  var spanLab=createElement('span').prop({title:'Finding multiples of the hashcodes (among the db entries).'}).myText('Hash-Match (Db)')
  var spanTotal=createElement('b').myText('-(-)')
  var butMult=createElement('a').prop({href:''}).myText('-').on('click',fun);

  el.myAppend(spanLab, ': Total: ', spanTotal, ', Mult: ', butMult); // elWrap
  //el.css({display:'inline'})
  return el
}



gThis.divCategoryTabT2TCreator=function(el){
  var self=el
  el.clearVal=function(){
    butDeleteNCreateRam.prop({disabled:true});   butDeleteNCreate.prop({disabled:true})
    but1T1Rename.prop({disabled:true});   butViaARename.prop({disabled:true})
    //divMat1.clearVal();
    divMat2.clearVal(); divMat3.clearVal()

    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    but1T1List.myText('-');  span1T1Action.myText('-')
    spanNAncestorOnlyRenamed.myText('-'); butAncestorFList.myText('-')
    butViaAList.myText('-');  spanViaAAction.myText('-')
    butChanged.myText('-');  spanChangedAction.myText('-')
    
    butMultList.myText('-');  spanMultActionD.myText('-');  spanMultActionC.myText('-')
    
    butCreated.myText('-'); butDeleted.myText('-');
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(syncTreeToTree){
    this.syncTreeToTree=syncTreeToTree

    var {arrSource, arrTarget, arrSourceUntouched, arrSourceReusedName, arrCreate, arrDelete, arrSourceIddByFolder, arrAncestorOnlyRenamed, Mat1, Mat2, Mat3, nAncestorOnlyRenamed}=syncTreeToTree

    var nSource=arrSource.length, nTarget=arrTarget.length
    var nUntouched=arrSourceUntouched.length
    var nReusedName=arrSourceReusedName.length
    var nCreate=arrCreate.length,  nDelete=arrDelete.length
    var nIddByFolder=arrSourceIddByFolder.length
    var nAncestorOnlyRenamedFolder=arrAncestorOnlyRenamed.length

    //divMat1.setVal(Mat1);
    divMat2.setVal(Mat2); divMat3.setVal(Mat3)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)
    var {NA, NB}=Mat2.getN(), n11=NA[1][1]
    but1T1List.myText(n11); span1T1Action.myText(n11); but1T1Rename.prop({disabled:!n11});
    spanNAncestorOnlyRenamed.myText(nAncestorOnlyRenamed)
    butAncestorFList.myText(nAncestorOnlyRenamedFolder)
    butViaAList.myText(nIddByFolder); spanViaAAction.myText(nIddByFolder); butViaARename.prop({disabled:!nIddByFolder})


    butChanged.myText(nReusedName); spanChangedAction.myText(nReusedName);
    var {NA, NB}=Mat3.getN()
    var nAMult = NA[1][2] + NA[2][1] + NA[2][2]
    var nBMult = NB[1][2] + NB[2][1] + NB[2][2]
    var strT=nAMult+" \\ "+nBMult
    spanMultActionD.myText(nBMult); spanMultActionC.myText(nAMult)
    butMultList.myText(strT);
    butCreated.myText(nCreate); spanCreatedAction.myText(nCreate)
    butDeleted.myText(nDelete); spanDeletedAction.myText(nDelete)

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)
    var nShortCut=nUntouched+n11+nIddByFolder; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nReusedName+nBMult+nDelete, nCreateTmp=nReusedName+nAMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);
    var boDCAction=Boolean(nDeleteTmp+nCreateTmp)
    butDeleteNCreateRam.prop({disabled:!boDCAction});   butDeleteNCreate.prop({disabled:!boDCAction})

  }
  var htmlHead=`
<tr><th colspan=2>Matching</th> <th rowspan=2>nS</th> <th rowspan=2>nT</th> <th rowspan=2>Cate­gorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Na&shy;me</th> <th>SM</th> <th>Short-cut</th> <th>Del­ete</th> <th>Cre­ate</th></tr>`

//<tr><td colspan=8>  <div class=dupEntry>SM-Match: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>SM-Match: </div>  </td></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a> <a href="">Compare</a></td><td>Renamed (1T1)</td>  <td><span>-</span> <button>Rename</button></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>1T1-files not renamed in the <font title="The leaf: the actual file name (the part furthest to the right (furthest from the root))\nSo the file is in an folder (an ancestor) that has been renamed.">leaf:</font> <span class=entry>-</span>. <font title="Number of involved ancestors">Ancestors:</font> <a href="">-</a>  </td></tr>
<tr><th>-</th><th>ViaA</th> <td colspan=2><a href="">-</a></td><td><font title="Identified via 1T1-files only renamed in ancestor">Renamed (ViaA)</font></td>  <td><span>-</span> <button>Rename</button></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>SM-Match: </div>  </td></tr>
<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created / Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td><td>Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span> </td> <td><span>-</span> </td></tr>
<tr><td colspan=6></td><td colspan=2> <button title='Do delete &amp; create actions, as per the result of running "Compare"'>Do D&C actions <br/>(direct)</button> <button title="Do delete &amp; create actions, as per the current state of the result-files">Do D&C actions</button></td></tr>`
//<button>Delete</button> <button>Create</button>   <br/>(read fr files)
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  var arrTR=[...tBody.children]
  var [trUntouched, trMat2, tr1T1, trViaAExtra, trViaA, trMat3, trChanged, trCreatedNDeleted, trMult, trSum, trDeleteNCreate]=arrTR; //trMat1, 

  var arrTRT=[trUntouched, tr1T1, trViaA, trChanged, trMult]
  arrTRT.forEach(ele=>ele.children[2]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  var arrTRT=[trChanged]
  arrTRT.forEach(ele=>ele.children[5]?.css({'text-align':'center'})); //Centering merged Delete/Create columns

  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  var [but1T1List, but1T1Compare, span1T1Action, but1T1Rename]=tr1T1.querySelectorAll('a,button,span')
  var [spanNAncestorOnlyRenamed, butAncestorFList]=trViaAExtra.querySelectorAll('a,span')
  var [butViaAList, spanViaAAction, butViaARename]=trViaA.querySelectorAll('a,button,span')
  var [butChanged,spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [butCreated, butDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [butMultList, spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span'); //,butDelete,butCreate
  var [butDeleteNCreateRam, butDeleteNCreate]=trDeleteNCreate.querySelectorAll('button'); 


  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat2, divMat3]=arrDup; //divMat1, 
  //divSMMatchCreator(divMat1, makeOpenExtCB("T2T_STMatch1_02"), null, makeOpenExtCB("T2T_STMatch1_12"), makeOpenExtCB("T2T_STMatch1_20"), makeOpenExtCB("T2T_STMatch1_21"), makeOpenExtCB("T2T_STMatch1_22"));
  //divSMMatchCreator(divMat2, makeOpenExtCB("T2T_STMatch2"));
  divSMMatchCreator(divMat2, makeOpenExtCB("T2T_STMatch2_02"), null, makeOpenExtCB("T2T_STMatch2_12"), makeOpenExtCB("T2T_STMatch2_20"), makeOpenExtCB("T2T_STMatch2_21"), makeOpenExtCB("T2T_STMatch2_22"));
  divSMMatchCreator(divMat3); // , makeOpenExtCB("T2T_STMatch3")

  var arrButt=tBody.querySelectorAll('button'); 
  //var [but1T1, but1T1Rename, butViaA, butViaARename, butAncestorFList, butChanged, butCreated, butDeleted]=arrButt; 
  //arrButt.forEach(ele=>ele.addClass('smallBut'))
  
  but1T1List.on('click', makeOpenExtCB("T2T_renamed"))
  but1T1Rename.on('click', funRenameFinishToTree);
  but1T1Compare.prop('title',`Compare ${LeafResultFile.T2D_renamed} and  ${LeafResultFile.T2T_renamed} (Opens in Meld.)`).css({'font-size':"0.85em"}).on('click',  async function(ev){
    ev.preventDefault()
    var strExec='meld'
    var strA=FsResultFile["T2D_renamed"], strB=FsResultFile["T2T_renamed"]
    var arrCommand=[strExec, strA, strB]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    } 
  })

  butViaAList.on('click', makeOpenExtCB("T2T_renamedAdditional"))
  butViaARename.on('click', funRenameFinishToTreeAdditional);
  butAncestorFList.on('click', makeOpenExtCB("T2T_ancestor"))
  butChanged.on('click', makeOpenExtCB("T2T_changed"))
  butMultList.on('click', makeOpenExtCB("T2T_STMatch3"))
  butCreated.on('click', makeOpenExtCB("T2T_created"))
  butDeleted.on('click', makeOpenExtCB("T2T_deleted"))
  // butCreate.on('click', funCreate)
  // butDelete.on('click', funDelete)
  butDeleteNCreateRam.css({'text-wrap':'pretty'}).on('click', async function(){
    resetMess();
    var [err]=await self.syncTreeToTree.makeDeleteNCreateChanges();  if(err) {debugger; resetMess(); return;}
    setMess('DeleteNCreateRam: Done');
  })
  butDeleteNCreate.css({'text-wrap':'pretty'}).on('click', async function(){
    //var [err]=await self.syncTreeToTree.makeDeleteNCreateChanges();  if(err) {debugger; resetMess(); return;}
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var arg=copySome({}, result, ["fiDirSource", "fiDirTarget", "strHostTarget"])
    var doDCActionsToTree=new DoDCActionsToTree(arg);
    var [err, {nDelete, nCreate}]=await doDCActionsToTree.read(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    if(nDelete==0 && nCreate==0) {setMess('Nothing to do, aborting'); return;}
    var strMess=doDCActionsToTree.getMess();
    var boOK=confirm(strMess)
    if(!boOK) { resetMess(); return; }
    resetMess();
    var [err]=await doDCActionsToTree.makeChanges(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    setMess('DeleteNCreate: Done');
  });
  butDeleteNCreateRam.hide()

  //var butSetLastSync=createElement('button').myText("Set tLastSync").prop({title:'Storing the (sync-) timepoint (instead of writing on the usb-drive when it was last synced)'}).on('click', argumentTab.setTLastSyncW);

  el.myAppend(table);  //, butSetLastSync
  return el
}


/***********************************************
 *   divT2TCreator
 **********************************************/
gThis.divT2TCreator=function(el){

  el.setUp=function(){
  }

  var funTreeToTree=async function(){
    myConsole.clear(); el.clearVal(); resetMess()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["fiDirSource", "fiDirTarget", "charTRes", "flPrepend", "strHostTarget"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    //var [err]=await compareTreeToTree(args); if(err){  myConsole.error(err); resetMess(); return;}
    var syncTreeToTree=new SyncTreeToTree(args);
    var [err]=await syncTreeToTree.constructorPart2();   if(err) { myConsole.error(err); resetMess(); return; }
    var [err]=await syncTreeToTree.compare();   if(err) { myConsole.error(err); resetMess(); return; }

    var leafDb=result.leafDb||settings.leafDb;
    syncTreeToTree.format(leafDb)
    syncTreeToTree.writeToFile()

    divT2T.setVal(syncTreeToTree)
    var boSync=this===butSyncTreeToTree

    if(boSync){
      if(!syncTreeToTree.boChanged){ setMess('Everything is up to date, aborting.'); return;  }
      if(boAskBeforeWrite){
        var strMess=syncTreeToTree.makeConfirmMess()
        var boOK=confirm(strMess);
        if(!boOK) {resetMess(); return}
      }
      var [err]=await syncTreeToTree.makeChanges();   if(err) { debugger; myConsole.error(err); resetMess(); return; }

    }
    var strMessA=boSync?'Sync':'Compare', strMess=`${strMessA} tree to tree: Done`
    setMess(strMess);
  }

  var butCompareTreeToTree=createElement('button').myAppend('Compare').on('click', funTreeToTree);
  var butSyncTreeToTree=createElement('button').myAppend('Sync').on('click', funTreeToTree);
  gThis.funRenameFinishToTree=async function(){
    //myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirTarget:fiDir}=result;
    var args={fiDir}
    extend(args, result, ["strHostTarget"])
    args.fsRenameFile=FsResultFile["T2T_renamed"]
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
    setMess('Renaming: Done')
  }
  gThis.funRenameFinishToTreeAdditional=async function(){
    //myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var {fiDirTarget:fiDir}=result;
    var args={fiDir}
    extend(args, result, ["strHostTarget"])
    args.fsRenameFile=FsResultFile["T2T_renamedAdditional"]
    var renameFinishToTree=new RenameFinishToTree(args)
    await renameFinishToTree.read()
    var nRename=renameFinishToTree.arrRename.length
    if(nRename==0) {setMess('Everything is up to date, aborting.'); return}
    if(boAskBeforeWrite){
      var strPlur=pluralS(nRename, "entry", "entries")
      var boOK=confirm(`Renaming ${nRename} ${strPlur}.`)
      if(!boOK) return
    }
    await renameFinishToTree.makeChanges();
    setMess('Renaming additional: Done')
  }
  // var butRenameFinishToTree=createElement('button').myAppend('Rename finish to tree').prop({title:`Rename according to \n${LeafResultFile.T2T_renamed} \nto target tree.`}).on('click', funRenameFinishToTree);
  // var butRenameFinishToTreeAdditional=createElement('button').myAppend('Rename finish to tree (additional)').prop({title:`Rename according to \n${LeafResultFile.T2T_renamedAdditional} \nto target tree.`}).on('click', funRenameFinishToTreeAdditional);


  el.linkFilterFirstTree=createElement('a').myText('filterFirstTree').prop({href:""}).on('click',  async function(ev){
    ev.preventDefault();
    // var strCommand=`${strExec} "${this.fsLink}"`;
    var arrCommand=[strExec, this.fsLink]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    } 
  });


  var butSyncTreeToTreeBrutal=createElement('button').myAppend('Sync brutal (like rsync)').attr({'title':'Sync brutal (like rsync)\nFiles with the same name, size \nand mod-time are left untouched.\nOthers are overwritten\n(Renamed files are overwritten.)'}).on('click', async function(){
    resetMess(); //myConsole.clear(); el.clearVal(); 
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["fiDirSource", "fiDirTarget", "charTRes", "strHostTarget"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    var syncTreeToTreeBrutal=new SyncTreeToTreeBrutal(args);
    await syncTreeToTreeBrutal.constructorPart2()
    var [err, boChanged]=await syncTreeToTreeBrutal.compare(); if(err) { myConsole.error(err); resetMess(); return;}
    if(!boChanged){ setMess('Everything is up to date, aborting.');  return;  }
    if(boAskBeforeWrite){
      //return
      var strMess=syncTreeToTreeBrutal.makeConfirmMess()
      var boOK=confirm(strMess)
      if(!boOK) {resetMess(); return}
    }
    await syncTreeToTreeBrutal.makeChanges()
    setMess('Sync brutal done');
  }); //.css({position:'absolute', right:'0px'})


  var hT2T=createElement('b').myText('Tree to tree');
  var divSpace=createElement('div').css({flex:'1'});
  var divButton=createElement('div').myAppend(hT2T, butCompareTreeToTree, butSyncTreeToTree, el.linkFilterFirstTree, butSyncTreeToTreeBrutal).css({display:'flex', 'align-items':'center', 'column-gap':'3px', background:'var(--bg-color)', flex:"0 1", border:"solid 1px", 'flex-wrap':'wrap'}); //, butWriteMTimeOnSource , position:'sticky'

  el.clearVal=function(){
    divCategoryTab.clearVal()
    divMat1.clearVal();
  }
  el.setVal=function(syncTreeToTree){
    var {Mat1}=syncTreeToTree;
    divCategoryTab.setVal(syncTreeToTree)
    divMat1.setVal(Mat1)
  }


  var divMat1=createElement('div').myHtml(`SM-Match: `);
  divSMMatchCreator(divMat1, makeOpenExtCB("T2T_STMatch1_02"), null, makeOpenExtCB("T2T_STMatch1_12"), makeOpenExtCB("T2T_STMatch1_20"), makeOpenExtCB("T2T_STMatch1_21"), makeOpenExtCB("T2T_STMatch1_22"));
  
  var divCategoryTab=el.divCategoryTab=divCategoryTabT2TCreator(createElement('div'))
  el.myAppend(divButton, divMat1, divCategoryTab); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%"}); //, height:"100%"
  return el
}



/***********************************************
 *   viewFrontCreator
 **********************************************/
gThis.viewFrontCreator=function(el){
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
  // divTopOpenStuff.css({background:"var(--bg-color)", 'margin-bottom':'3px'});

  var divTopContainer=createElement('div').css({'text-align':'center'});
  var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  gThis.divT2D=divT2DCreator(createElement('div'))
  gThis.divT2T=divT2TCreator(createElement('div'))



  var divMid=createElement('div').myAppend(divT2D, divT2T).css({display:'grid', 'grid-template-columns':'1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'1 1 auto', overflow:'scroll'}); //.addClass('unselectable')
  //.css({display:'flex', 'column-gap':'3px','margin-top':'3px', flex:'1 1 auto', overflow:'scroll'}).addClass('unselectable')
  el.clearColumnDivsResult()
  
  
  el.myAppend(divTopContainer, divMid, divConsoleContainer); //, divTopOpenStuff divFoot , divConsoleT2D, divConsoleT2T, divConsole

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%", 'justify-content':'space-between'});
  return el
}



/***********************************************
 *   viewCheckCreator
 **********************************************/
gThis.viewCheckCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewCheck';}

  el.setUp=function(){
    divTopContainer.myAppend(divTop)
    divConsoleContainer.myAppend(dragHR, butClear, divConsole)
  }
  el.setBottomMargin=function(hNew){
    divResult.css({'margin-bottom':hNew+'px'})
  }


  var butHardLinkCheck=createElement('button').myAppend('Check for hard links').attr({'title':`Check source tree for hard links. (Note: all functions relying on the absence of hard links also checks for hard links) \nFound hard links are written to ${basename(FsResultFile["T2D_HL"])} in the settings directory.`}).on('click',  async function(){
    myConsole.clear(); resetMess()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var {fiDirSource}=result;
    var args=copySome({}, result, ["fiDirSource", "charTRes"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    var [err]=await hardLinkCheck(args); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    setMess('Hard link check: Done');
  });
  var butHashMultipleCheck=createElement('button').myAppend('Check for multiple hashcodes').attr({'title':`Go through the db-file and look for recurring hashcodes. \nFound multiples are written to ${basename(FsResultFile["T2D_Hash"])} in the settings directory.`}).on('click',  async function(){
    myConsole.clear(); resetMess()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var {fiDirSource}=result;
    var args=copySome({}, result, ["fiDirSource", "charTRes"])
    args.leafFilterFirst=result.leafFilterFirstTree||result.leafFilterFirst||settings.leafFilter
    var [err, objHash]=await hashMultipleCheck(args); if(err) {debugger; myConsole.error(err); resetMess(); return;}

    var fun=makeOpenExtCB("T2D_Hash")

    var {n, nPatHash, nPatHashMult, nHashMult}=objHash
    var spanLab=createElement('span').myText('Hash-Match')
    var spanTotal=createElement('b').myText(`${n}(${nPatHash})`)
    var butMult=createElement('a').prop({href:''}).myText(`${nHashMult}(${nPatHashMult})`).on('click',fun);
    var divHashMatchResult=createElement('div').myAppend(spanLab, ': Total: ', spanTotal, ', Mult: ', butMult)

    divResult.myHtml('').myAppend(divHashMatchResult)
    setMess('Multiple hash check: Done');
  });
  

  //
  // Checking
  //
  var butCheckSummarizeMissingS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirSource, myConsole})
    var [err]=await checkSummarizeMissing(args); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    setMess('CheckSummarizeMissingS: Done');
  });
  var butCheckSummarizeMissingT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirTarget, myConsole})
    var [err]=await checkSummarizeMissing(args); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    setMess('CheckSummarizeMissingT: Done');
  });
  var inpIStart=createElement('input').prop({type:'number'}).attr('value',0).prop({title:'iStart, (Start checking from this row (Skipping those above this line)).'});
  var butCheckS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); resetMess(); viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirSource, iStart:Number(inpIStart.value), myConsole})
    var [err, mess=""]=await check(args); if(err) {debugger; myConsole.error(err); }
    setMess(mess); viewCheck.butCheckCancel.hide();
  });
  var butCheckT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); resetMess(); viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    var args=copySome({}, result, ["leafDb", "charTRes"])
    extend(args, {fiDir:result.fiDirTarget, iStart:Number(inpIStart.value), myConsole})
    var [err, mess=""]=await check(args); if(err) {debugger; myConsole.error(err); }
    setMess(mess); viewCheck.butCheckCancel.hide();
  });



  var divTopContainer=createElement('div').css({'text-align':'center'});
  var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  // gThis.divConsole=createElement('pre').css({'font-family':'monospace', background:'var(--bg-color)', 'white-space':'pre-wrap', margin:'3px', width:"initial", "flex":'33%'}); //.addClass('contDiv')
  // gThis.myConsoleCheck=new MyConsole(divConsole)

  //"flex":'1 1 auto'
  var divHashMultipleCheck=createElement('div').myAppend(butHashMultipleCheck).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})

  var hCheckFileExistance=createElement('b').myText('Check file existance').prop({title:`Going through all the files in db-file and check that they exist.`})
  var divCheckFileExistance=createElement('div').myAppend(hCheckFileExistance, butCheckSummarizeMissingS, butCheckSummarizeMissingT).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})

  var hCheckHash=createElement('b').myText('Check hash codes').prop({title:`Going through all the files in db-file and check the hashcode.
REMEMBER to run main>T2D>sync berfore "checking". Otherwise changed/missing files will be reported an errors.`})
  var spanIStart=createElement('span').myText('iStart:').attr({'title':'Start on this row of the db-file'}).css({'margin-left':'0.6em'})
  inpIStart.css({'margin-left':'0.6em'})
  var divHeadCheckHash=createElement('div').myAppend(hCheckHash, spanIStart, inpIStart).css({display:'flex', 'align-items':'center'})

  el.boCheckCancel=false
  el.butCheckCancel=createElement('button').myText('Cancel').on('click', function(ev){el.boCheckCancel=true}).hide()
  var divCheckHash=createElement('div').myAppend(divHeadCheckHash, butCheckS, butCheckT, el.butCheckCancel).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})
  

  // var butSetLastCheck=createElement('button').myText("Set tLastCheck").prop({title:'Storing the (check-) timepoint (instead of writing on the usb-drive when it was last checked)'}).on('click',async function(){
  //   var boOK=confirm(`Setting tLastCheck?\nIt can be undone (set directly) in the file:\n ${fsMyStorage}`);
  //   if(!boOK) { return}
  //   var [err]=await argumentTab.setTLastCheck(); if(err) {debugger; myConsole.error(err); return;}
  // });

  var divMid=createElement('div').myAppend(divHashMultipleCheck, divCheckHash).css({display:'flex', 'column-gap':'3px', 'justify-content':'space-between', margin:'3px 0', 'align-items':'stretch'}); //, butHardLinkCheck, butSetLastCheck  , divCheckFileExistance
  var divResult=createElement('div').css({'text-align':'left'})
  
    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});

  
  el.myAppend(divTopContainer, divMid, divResult, divConsoleContainer); // divFoot , divConsoleT2D, divConsoleT2T, divConsole

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%"});
  return el
}


//////////////////////////////////////////////////////////
// ArgumentTab
//////////////////////////////////////////////////////////

var boTouch=false
if(boTouch){  var strStartEv='touchstart', strMoveEv='touchmove', strEndEv='touchend'; }
else{   var strStartEv='mousedown', strMoveEv='mousemove', strEndEv='mouseup';    }


gThis.ArgumentTabTdInd={  
  mySetVal:function(ind){   },
  factory:function(){
    var spanDrag=createElement('span').attr('name', 'spanDrag').myText('⣿').css({ 'font-size':'1.8em', 'color':'var(--text-grey)', 'cursor':'pointer', 'text-align':'center', 'width':'1.3em', display:'inline-block'});
    spanDrag.on(strStartEv, argumentTab.myMousedown);
    var td=createElement('td').myAppend(spanDrag); copySome(td, ArgumentTabTdInd, ['mySetVal']); 
    return td;
  }
}
gThis.ArgumentTabTdBoSelected={  
  mySetVal:function(boOn){  var td=this, b=td.firstChild, strCol=boOn?'var(--bg-green)':''; b.css('background',strCol);  },
  setSelectedClick:async function(){ // "this" will be refering to the clicked button (see below)
    var td=this.parentNode, elR=td.parentNode;
    //var elR=this;
    argumentTab.clearAllSelectButton()
    elR.dataset.boSelected=true
    //argumentTab.setSelected(elR)
    td.mySetVal(true)
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};

    myConsole.clear();
    viewFront.clearColumnDivsResult()
  },
  factory:function(){
    var b=createElement('button').myHtml('&nbsp;').css('width','1.2em').on('click',ArgumentTabTdBoSelected.setSelectedClick);
    var td=createElement('td').css('text-align','center').myAppend(b);  copySome(td, ArgumentTabTdBoSelected, ['mySetVal']);  return td;
  }
}
gThis.ArgumentTabTdTLastSync={  
  mySetVal:function(t){
    var tD=unixNow()-t, strT=getSuitableTimeUnit(tD).join(' ');
    this.firstChild.myText(strT).prop({title:`${new Date(t*1000)}`}).css({'white-space':'nowrap'})
  },
  setTLastSync:async function(){ // this will refer to the button
    var td=this.parentNode, elR=td.parentNode;
    var boOK=confirm(`Setting tLastSync?\nIt can be undone (set directly) in the file:\n ${fsMyStorage}`);
    if(!boOK) { return}
    var  [err]=await elR.setTLastSync(); if(err) {myConsole.error(err); debugger; return [err]};
    this.myText('0 s')
  },
  factory:function(){ 
    var b=createElement('button').myHtml('&nbsp;').on('click', ArgumentTabTdTLastSync.setTLastSync);
    var td=createElement('td').myAppend(b);  copySome(td, ArgumentTabTdTLastSync, ['mySetVal']);  return td;
  }
}
gThis.ArgumentTabTdTLastCheck={
  mySetVal:function(t){
    var tD=unixNow()-t, strT=getSuitableTimeUnit(tD).join(' ');
    this.firstChild.myText(strT).prop({title:`${new Date(t*1000)}`}).css({'white-space':'nowrap'})
  },
  setTLastCheck:async function(){ // this will refer to the button
    var td=this.parentNode, elR=td.parentNode;
    var boOK=confirm(`Setting tLastCheck?\nIt can be undone (set directly) in the file:\n ${fsMyStorage}`);
    if(!boOK) { return}
    var  [err]=await elR.setTLastCheck(); if(err) {myConsole.error(err); debugger; return [err]};
    this.myText('0 s')
  },
  factory:function(){ 
    var b=createElement('button').myHtml('&nbsp;').on('click', ArgumentTabTdTLastCheck.setTLastCheck);
    var td=createElement('td').myAppend(b);  copySome(td, ArgumentTabTdTLastCheck, ['mySetVal']);  return td;
  }

}
//var td=this.parentNode, elR=td.parentNode;

gThis.ArgumentTabRow={
  extendClass:function(){
    if(gThis.boAllowRemoteTarget) {extend(this.rDefault,{strHostTarget:""});}
    else delete this.rDefault.strHostTarget
    this.StrColOrder=Object.keys(this.rDefault)
    this.nCol=this.StrColOrder.length
    this.StrColType=Array(this.nCol)
    for(var i=0;i<this.nCol;i++){
       this.StrColType[i]=typeof this.rDefault[this.StrColOrder[i]]
    }
  },
  connectStuff:function(){
    var {StrColOrder}=this
    var elR=this
    var TDConstructors={
      ind:ArgumentTabTdInd.factory,
      boSelected:ArgumentTabTdBoSelected.factory,
      tLastSync:ArgumentTabTdTLastSync.factory,
      tLastCheck:ArgumentTabTdTLastCheck.factory
    }
    for(var i=0;i<StrColOrder.length;i++) { 
      var name=StrColOrder[i], td;
      if(name in TDConstructors) { td=TDConstructors[name]();  } 
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
  mySetDomRow:function(rowData){
    var {StrColOrder}=this
    var {boSelected, label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes, strHostTarget}=rowData;
    var elR=this;
    extend(elR.dataset, rowData)
    //elR.prop('rowData',rowData) //.attr({label})
    for(var i=0;i<StrColOrder.length;i++) { 
      var name=StrColOrder[i], val=rowData[name]; //, td=this.children.item(i)
      var td=this.querySelector(`td[name=${name}]`);
      if('mySetVal' in td) { td.mySetVal(val);}   else td.myText(val);
      if('mySetSortVal' in td) { td.mySetSortVal(val);}   else td.valSort=val;
    }
  },
  setTLastSync:async function(){
    this.dataset.tLastSync=unixNow();
    var [err]=await argumentTab.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  },
  setTLastCheck:async function(){
    this.dataset.tLastCheck=unixNow();
    var [err]=await argumentTab.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  },
  getTypedData:function(){
    var {nCol,StrColOrder,StrColType}=this
    var objO=extend({},this.dataset)
    for(var i=0;i<nCol;i++){
      var strName=StrColOrder[i], val=objO[strName]
      if(StrColType[i]=='string') continue;
      else if(StrColType[i]=='number') val=Number(val);
      else if(StrColType[i]=='boolean') val=val=="true"
      objO[strName]=val
    }
    return objO
  },
  rDefault:{ind:0, boSelected:false, label:'', fiDirSource:'', fiDirTarget:'', leafFilterFirst:'', leafFilterFirstTree:'', leafDb:'', flPrepend:'', charTRes:'9', tLastSync:0, tLastCheck:0}, //, strHostTarget:''
  factory:function(){
    var el=createElement('tr')
    var Key=Object.keys(ArgumentTabRow); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, ArgumentTabRow, Key)
    el.connectStuff()
    return el;
  }
}
ArgumentTabRow.extendClass();


gThis.argumentSetPopExtend=function(el){
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
    var strHostTarget=inpHostTarget.value
    var rT={label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes, strHostTarget}
    extend(rowDataLoc,rT)
    if(boUpd) { 
      //argumentTab.myEdit(elR, rowDataLoc);
    } else {
      rowDataLoc.boSelected=argumentTab.nRows()==0;
      rowDataLoc.ind=argumentTab.indNext; argumentTab.indNext++
      [elR]=argumentTab.reserveRows();
    }
    //ArgumentTabRow.mySetDomRow.call(elR, rowDataLoc);
    elR.mySetDomRow(rowDataLoc);
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};
    historyBack();
  }
  el.setUp=function(){
    inpLabel.value=rowDataLoc.label
    inpDirSource.value=rowDataLoc.fiDirSource
    inpDirTarget.value=rowDataLoc.fiDirTarget
    inpFilterFirst.value=rowDataLoc.leafFilterFirst
    inpFilterFirstTree.value=rowDataLoc.leafFilterFirstTree
    inpDb.value=rowDataLoc.leafDb
    inpPrepend.value=rowDataLoc.flPrepend
    selCharTRes.value=rowDataLoc.charTRes
    inpHostTarget.value=rowDataLoc.strHostTarget
    inpLabel.focus();
    myConsole.clear();
    divConsoleContainer.myAppend(divConsole)
    return true;
  }
  el.openFunc=function(boUpdT){
    boUpd=boUpdT;
    if(this==null){rowDataLoc=extend({},ArgumentTabRow.rDefault);}
    else{
      elR=this.parentNode.parentNode;
      //rowDataLoc=elR.rowData;
      //rowDataLoc=extend({},elR.rowData);
      rowDataLoc=extend({},elR.dataset);
    }
    doHistPush({strView:'argumentSetPop'});
    el.setVis();
    el.setUp();
  }
  el.setVis=function(){ el.show(); return 1; }
  
  var boUpd, elR, rowDataLoc; 


  var imgHLabel=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHLabel, divHelpProt.cloneNode(1).myHtml("Label (Name)"));
  var imgHSource=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHSource, divHelpProt.cloneNode(1).myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHTarget=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHTarget, divHelpProt.cloneNode(1).myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHFilterFirst=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHFilterFirst, divHelpProt.cloneNode(1).myHtml("leaf-prefix: only part furthest away from the root, (the actual file), (no \"/\", \".\" or \"~\")"));
  var imgHFilterFirstTree=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHFilterFirstTree, divHelpProt.cloneNode(1).myHtml("leaf-prefix: only part furthest away from the root, (the actual file), (no \"/\", \".\" or \"~\")"));
  var imgHDb=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHDb, divHelpProt.cloneNode(1).myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHPrepend=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHPrepend, divHelpProt.cloneNode(1).myHtml("fl-prefix: filesystem (l=locally based) furthest away from the root, (no \"/\", \".\" or \"~\")"));
  var imgHCharTRes=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHCharTRes, divHelpProt.cloneNode(1).myHtml(`Timestamp resolution:
<p>0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
<p>d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`));
 var imgHHostTarget=hovHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHHostTarget, divHelpProt.cloneNode(1).myHtml(`Target host (leave empty if running locally)`));
  var labLabel=createElement('b').myAppend('Name', imgHLabel);
  var labDirSource=createElement('b').myAppend('fiDirSource', imgHSource);
  var labDirTarget=createElement('b').myAppend('fiDirTarget', imgHTarget);
  var labFilterFirst=createElement('b').myAppend('leafFilterFirst', imgHFilterFirst);
  var labFilterFirstTree=createElement('b').myAppend('leafFilterFirstTree', imgHFilterFirstTree);
  var labDb=createElement('b').myAppend('leafDb', imgHDb);
  var labPrepend=createElement('b').myAppend('flPrepend', imgHPrepend);
  var labCharTRes=createElement('b').myAppend('tRes', imgHCharTRes);
  var labHostTarget=createElement('b').myAppend('Target host', imgHHostTarget);
  var inpLabel=createElement('input').prop('type', 'text');
  var inpDirSource=createElement('input').prop('type', 'text');
  var inpDirTarget=createElement('input').prop('type', 'text');
  var inpFilterFirst=createElement('input').prop('type', 'text');
  var inpFilterFirstTree=createElement('input').prop('type', 'text');
  var inpDb=createElement('input').prop('type', 'text');
  var inpPrepend=createElement('input').prop('type', 'text');
  var selCharTRes=createElement('select');
  var inpHostTarget=createElement('input').prop('type', 'text');

  var Opt=[]
  for(var k of KeyTRes){
    var optT=createElement('option').myText(k).prop('value',k); Opt.push(optT);
  }
  selCharTRes.empty().myAppend(...Opt);
  
  [labLabel, labDirSource, labDirTarget, labFilterFirst, labFilterFirstTree, labDb, labPrepend, labCharTRes, inpLabel].forEach(ele=>ele.css({'margin-right':'0.5em'})); //, labFilterFirst_Db
  [inpLabel, inpDirSource, inpDirTarget, inpFilterFirst, inpFilterFirstTree, inpDb, inpPrepend, selCharTRes, inpHostTarget].forEach(ele=>ele.css({display:'block',width:'100%'})); //, inpFilterFirst_Db
  var inpNLab=[labLabel, inpLabel, labDirSource, inpDirSource, labDirTarget, inpDirTarget, labFilterFirst, inpFilterFirst, labFilterFirstTree, inpFilterFirstTree, labDb, inpDb, labPrepend, inpPrepend, labCharTRes, selCharTRes, labHostTarget, inpHostTarget];
  if(!gThis.boAllowRemoteTarget) {labHostTarget.hide(); inpHostTarget.hide();}

  //var buttonCancel=createElement('button').myText('Cancel').on('click',historyBack).css({'margin-top':'1em'});
  var buttonBack=createElement('button').myText('Cancel').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack); // charBackSymbol
  var buttonSave=createElement('button').myText('Save').on('click',save); //
  var divBottom=createElement('div').myAppend(buttonBack, buttonSave).css({'margin-top':'1em'});;  //buttonCancel,

  var blanket=createElement('div').addClass("blanket");
  var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});

  //var divConsole=createElement('div').addClass("popupErrorConsole")
  var centerDiv=createElement('div').addClass("Center").myAppend(...inpNLab, divBottom, divConsoleContainer).css({'min-width':'17em','max-width':'30em', padding: '1.2em 0.5em 1.2em 1.2em'}); //height:'24em', 
  el.addClass("Center-Container").myAppend(blanket, centerDiv); 
    
  return el;
}


gThis.argumentDeletePopExtend=function(el){
  el.toString=function(){return 'argumentDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',async function(){   
    argumentTab.myRemove(elR);  
    var [err]=await argumentTab.saveToDisk(); if(err){myConsole.error(err); return};
    historyBack();
  });
  el.openFunc=function(){
    elR=this.parentNode.parentNode; spanId.myText(elR.dataset.label);
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
  el.addClass("Center-Container").myAppend(blanket, centerDiv); 
  
  return el;
}


  //label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirstTree, leafDb, flPrepend, charTRes, strHostTarget
gThis.argumentTabExtend=function(el){
  el.toString=function(){return 'argumentTab';}

  var movedRow, iStart, iEnd;
  el.myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    movedRow=this.parentNode.parentNode;
    iStart=getNodeIndex(movedRow);
    movedRow.css({position:'relative', opacity:0.55, 'z-index':'auto'});  
    document.on(strMoveEv,el.myMousemove, {passive: false}); document.on(strEndEv,el.myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
    //setMess('Down');
  } 
  el.myMouseup= function(e){ 
    //movedRow.css({position:'relative', opacity:1, 'z-index':'auto', top:'0px'});
    movedRow.css({'transform':'translateY(0px)',opacity:1,'z-index':'auto'});
    document.off(strMoveEv,el.myMousemove); document.off(strEndEv,el.myMouseup);
    //setMess(print_r(el.myGet(), 1));
    iEnd=movedRow.myIndex();
    //Row=el.Row=[...tBody.children];
    //setItems();
    el.checkIfSortOrderHasChangedW();
  }
  
  el.myMousemove= function(e){
    var x,y;
    if(boTouch) {e.preventDefault(); e.stopPropagation(); x=e.changedTouches[0].pageX; y=e.changedTouches[0].pageY;}
    else {y=e.clientY;}

    var iCur=movedRow.myIndex();
    var hCur=movedRow.offsetHeight, yMouseOff=y-hCur/2;

    var Row=[...tBody.children], len=Row.length;
    var boMoved=false

    if(iCur>0) {  //Check if previous is better
      var rowT=movedRow.previousElementSibling;
      var yPrevOff=rowT.getBoundingClientRect().top;
      var hPrev=rowT.offsetHeight;
      if(y<yPrevOff+hPrev/2) { rowT.insertAdjacentElement('beforebegin', movedRow); boMoved=true }
    }
    if(!boMoved && iCur<len-1) { //Check if next is better
      var rowT=movedRow.nextElementSibling;
      var yNextOff=rowT.getBoundingClientRect().top;
      var hNext=rowT.offsetHeight;
      if(y>yNextOff+hNext/2) { rowT.insertAdjacentElement('afterend', movedRow); }
    }
    var yCurOff=movedRow.getBoundingClientRect().top
    var strYTrans=movedRow.style.transform; strYTrans=strYTrans.slice(11,-3); var yTrans=Number(strYTrans)
    var yCurOrgOff=yCurOff-yTrans
    movedRow.css({'transform':'translateY('+(yMouseOff-yCurOrgOff)+'px)'});
  };

  el.setBottomMargin=function(hNew){
    var hTmp=hNew+50
    divCont.css({'margin-bottom':hTmp+'px'})
  }
  // var setCurrentOrder=function(){
  //   var Row=[...tBody.children]
  //   Row.forEach((elR,i)=>elR.dataset.ind=i)
  // }
  el.saveToDisk=async function(boSetCurrentOrder=false){
    var Row=[...tBody.children], len=Row.length;
    var ObjOpt=Array(len)
    for(var i=0;i<len;i++) {
      var elR=Row[i];
      //var objOpt=extend({},elR.dataset);
      var objOpt=elR.getTypedData();
      if(boSetCurrentOrder) {objOpt.ind=i; elR.mySetDomRow(objOpt); }
      ObjOpt[i]=objOpt
    } 
    ObjOpt.sort((a,b)=>{return a.ind-b.ind;})
    ObjOpt.forEach(o=>{delete o.ind;})
    var [err]=await myStorage.setItem('ObjOpt',ObjOpt); if(err) {debugger; return [err];}
    argumentTab.dispatchEvent(eventMyUpdate);
    return [null]
  }
  el.myRemove=function(elR){
    elR.remove();
    RowCache.push(elR);
    if(elR.dataset.boSelected=="true" && tBody.childElementCount) tBody.children[0].dataset.boSelected=true;
    return el; 
  }
  //el.myEdit=function(elR, objRow){ return el; }
  el.reserveRows=function(nAdd=1){
    var RowAdd=Array(nAdd)
    for(var i=0; i<nAdd;i++){
      var elR
      if(RowCache.length) {elR=RowCache.pop();}
      else { 
        //var elR=createElement('tr'); 
        //ArgumentTabRow.connectStuff.call(elR)
        //var elR=argumentTabRowCreate()
        var elR=ArgumentTabRow.factory()
      } 
      tBody.append(elR); RowAdd[i]=elR;
    }
    return RowAdd
  }
  el.getDataFrFile=async function(){
    var [err, ObjOpt]=await myStorage.getItem('ObjOpt');  if(err) {debugger; return [err];}
    if(!Array.isArray(ObjOpt))  ObjOpt=[];
    var iSelected=NaN;
    for(var i in ObjOpt){
      var objOpt=ObjOpt[i]; objOpt.ind=i;
      if(objOpt.boSelected && !isNaN(iSelected)) return [Error('multiple-rows-selected')]
      if(objOpt.boSelected) {iSelected=i; }
      if(!gThis.boAllowRemoteTarget) objOpt.strHostTarget=""

      for(var k in objOpt) {  // Delete empty strings
        var v=objOpt[k]
        if(typeof v=='string' && v.length==0) delete objOpt[k];
      }
    }
    el.indNext=ObjOpt.length; // indNext: counter to prevent colliding ind when new rows are added.
    if(isNaN(iSelected)) return [Error('no-argument-selected')]
    return [null, ObjOpt, iSelected]
  }
  el.setUpDom=async function(){
    var [err, ObjOpt, iSelected]=await el.getDataFrFile();
    if(err) {
      if(err!='no-argument-selected') debugger;
      return [err];
    }

    var nOld=tBody.childElementCount, nNew=ObjOpt.length;
    if(nOld<nNew) el.reserveRows(nNew-nOld);
    else if(nOld>nNew){
      var Row=[...tBody.children];
      for(var i=nNew; i<nOld;i++){
        var elR=Row[i]; elR.remove(); RowCache.push(elR)
      }
    }
    var Row=[...tBody.children];
    for(var i=0;i<nNew;i++) {
      var objOptT=extend({}, ArgumentTabRow.rDefault)
      extend(objOptT, ObjOpt[i]);
      var elR=Row[i];
      //ArgumentTabRow.mySetDomRow.call(elR, objOptT);
      elR.mySetDomRow(objOptT);
    }

    divTopContainer.myAppend(divTop)
    myConsole.clear();
    divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    return [null]

  }
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.dataset.boSelected=="true") return [null, row];}
  //   return [Error('No row selected!?!?')]
  // }
  el.getSelectedFrFile=async function(){
    var [err, ObjOpt, iSelected]=await el.getDataFrFile();  if(err) {debugger; return [err];}
    return [null, ObjOpt[iSelected]];
  }
  el.getSelectedFrDom=function(){
    var Row=[...tBody.children], rowSelected=undefined, iSelected=NaN;
    for(var i=0;i<Row.length;i++){
      var rowA=Row[i], boSelected=rowA.dataset.boSelected=="true"
      if(boSelected && !isNaN(iSelected)) return [Error('multiple-rows-selected')]
      if(boSelected) {rowSelected=rowA; iSelected=i;}
    }
    if(isNaN(iSelected)) return [Error('no-argument-selected')]
    return [null, rowSelected, iSelected];
  }
  el.clearAllSelectButton=function(){
    var Row=[...tBody.children]
    Row.forEach(function(rowA){
      var td=rowA.querySelector('[name=boSelected]'); td.mySetVal(false); rowA.dataset.boSelected=false
    })
  }
  el.nRows=function(){return tBody.childElementCount}
  // el.setTLastSync=async function(){
  //   var [err, rowSelected, iSelected]=await el.getSelectedFrDom();  if(err) {debugger; return [err];}
  //   rowSelected.dataset.tLastSync=unixNow();
  //   var [err]=await el.saveToDisk(); if(err) {debugger; return [err];}
  //   return [null]
  // }
  el.setTLastCheck=async function(){
    var [err, rowSelected, iSelected]=await el.getSelectedFrDom();  if(err) {debugger; return [err];}
    rowSelected.dataset.tLastSync=unixNow();
    var [err]=await el.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  }
  el.checkIfSortOrderHasChanged=function(){
    var iLast=0, boChanged=false, Row=[...tBody.children];
    Row.forEach(function(rowA){
      var ind=Number(rowA.dataset.ind)
      if(ind<iLast) boChanged=true;
      iLast=ind
    })
    return boChanged
  }
  el.checkIfSortOrderHasChangedW=function(){
    var boChanged=el.checkIfSortOrderHasChanged();
    //buttonSaveSortOrder.prop({disabled:!boChanged})
    buttonSaveSortOrder.toggle(boChanged)
  }
  el.getLeafDb=function(){

  }
  var RowCache=[];


  const eventMyUpdate = new Event("myupdate");


    // Table
  var tBody=createElement('tbody');
  el.table=createElement('table').myAppend(tBody).addClass('tableSticky', 'tableInset').css({'word-break':'break-all'});

  var trHead=createElement('tr');
  var tHead=createElement('thead').myAppend(trHead);
  tHead.css({background:'var(--bg-color)', width:'inherit', opacity:0.8});  
  el.table.prepend(tHead);
  trHead.on('click', el.checkIfSortOrderHasChangedW)

  var BoAscDefault={}, Label={boSelected:'Selected', charTRes:'tRes'}, Th=[];
  for(var strName of ArgumentTabRow.StrColOrder){ 
    var boAscDefault=(strName in BoAscDefault)?BoAscDefault[strName]:true;
    var label=(strName in Label)?Label[strName]:strName; //ucfirst
    var h=createElement('th').addClass('unselectable').prop('boAscDefault',boAscDefault).prop('title',label).attr('name',strName).myText(label); 
    Th.push(h);
    //if(strName=='strHostTarget') h.hide()
  }
  trHead.myAppend(...Th).addClass('listHead');
  headExtend(trHead, tBody);
  trHead.myAppend(createElement('th'), createElement('th'), createElement('th'))


      // menuA
  var buttonBack=createElement('button').myText(charBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack);
  var buttonAdd=createElement('button').myText('Add').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',function(){
    argumentSetPop.openFunc.call(null,0);
  });
  var buttonSaveSortOrder=createElement('button').myText('Save sort order').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',async function(){
    var [err]=await argumentTab.saveToDisk(true); if(err){myConsole.error(err); return};
    this.hide()
  }).hide();
  //var spanSpace=createElement('span').css({flex:'0 1 auto'})
  var spanLabel=createElement('span').myText('ArgumentTab'); //.css({'float':'right',margin:'0.2em 0 0 0'});  
  //var menuA=createElement('div').myAppend(buttonAdd,spanLabel).css({padding:'0 0.3em 0 0',overflow:'hidden','max-width':menuMaxWidth,'text-align':'left',margin:'.3em auto .4em'}); //buttonBack,

  //var divTopContainer=createElement('div').myText(fsDataHome).css({'margin-left':'0.4em'});
  var divTopContainer=createElement('div').css({'text-align':'center'});
  el.addClass('argumentTab');

  el.css({'text-align':'center'});

  var divCont=createElement('div').myAppend(el.table).css({margin:'0em auto','text-align':'left',display:'inline-block'});
  var divContW=createElement('div').myAppend(divCont).addClass('contDiv');

  var footDiv=createElement('div').myAppend(buttonAdd, buttonSaveSortOrder, spanLabel).addClass('footDiv').css({width:'100%',background:"var(--bg-colorEmp)"}); //, spanSpace buttonBack, 
  var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8, 'text-align':'left'});
  var footDivW=createElement('div').myAppend(divConsoleContainer, footDiv).addClass('footDivW').css({position:'fixed', bottom:'0px', opacity:0.8, 'flex-direction':'column', background:'var(--bg-color)'});
  el.append(divTopContainer, divContW, footDivW);
  return el;
}





class MyConsole{
  constructor(div){ this.div=div; this.indMark=0; this.indCur=0;}
  clear(){this.div.textContent="";}
  save(){ this.indMark=this.indCur; return this; }
  restore(){ this.indCur=this.indMark; return this; }
  clearBelow(){this.div.innerHTML=this.div.innerHTML.slice(0, this.indCur); return this;}
  cursorUp(){
    var indLastEnd=this.div.innerHTML.lastIndexOf('\n', this.indCur-1); if(indLastEnd==-1) return Error('on top line');
    var x=this.indCur-indLastEnd-1;
    if(indLastEnd==0) var indLastStart=0;
    else{
      var indLastLastEnd=this.div.innerHTML.lastIndexOf('\n', indLastEnd-1);
      var indLastStart=indLastLastEnd==-1?0:indLastLastEnd+1
    } 
    this.indCur=indLastStart+x;
    return null;
  }
  makeSpaceNSave(){this.print('\n\n'); this.cursorUp(); this.cursorUp(); this.save(); return this;}
  myReset(){this.restore(); this.clearBelow(); return this;}
  setCur(){this.indCur=this.div.innerHTML.length; return this;}
  print(str) {
    var {div:el}=this
    var boBottom=Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1
    el.innerHTML=el.innerHTML.slice(0,this.indCur)+str; this.setCur(); 
    if(boBottom) el.scrollTop=el.scrollHeight
    return this;
  }
  printNL(str) { this.print(str+'\n'); return this;}
  log(str){this.print(str+'\n'); return this;}
  error(str) { 
    if(str instanceof Error) {console.error(str); str=str.message;} 
    else if(typeof str=='object' && 'message' in str) {console.error(str.message); str=str.message;} 
    this.print(`<font style="color:var(--text-red)">Error: ${str}</font>\n`);
    return this;
  }
}




