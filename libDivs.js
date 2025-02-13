
"use strict"


var formatTitleOld=function(arrIn, n=nShortListMax, fun=row=>row.strName){
  var l=arrIn.length, nOut=Math.min(n,l), StrOut=Array(nOut)
  if(nOut==0) return undefined
  for(var i=0;i<nOut;i++) { var row=arrIn[i]; StrOut[i]=fun(row);}
  if(l>n) StrOut.push('⋮')
  return StrOut.join('\n')
}

var formatTitle=function(arrIn, fun){ // If fun is not supplied the input is assumed to be StrIn (array of strings)
  var lIn=arrIn.length;
  if(lIn==0) return undefined
  var arrT=arrIn.slice(0,nShortListMax);
  if(fun) arrT=arrT.map(fun)
  if(arrT.length==nShortListMax) arrT.push('⋮');
  return arrT
  //return arrT.join('\n')
}
var formatTitleStr=function(){ // Like formatTitle but returns a string (instead of String)
  return formatTitle(...arguments)?.join('\n')
}
var formatTitleStrName=function(arrIn){ // Assumes and array of {strName:"blah"}
  return formatTitle(arrIn, row=>row.strName)?.join('\n')
}



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

var myConfirmerCreate=function(el){
  el.confirm=function(str){
    el.show()
    divMessage.clear().myAppend(str)
    var p=new Promise((resolve,reject)=>{
      resolveF=resolve
      butCancel.on('click', cbCancel)
      butContinue.on('click', cbContinue)
    });
    return p
  }
  var resolveF
  var cbCancel=function(){
    butCancel.off('click', cbCancel); butContinue.off('click', cbContinue); el.hide(); resolveF(false)
  }
  var cbContinue=function(){
    butCancel.off('click', cbCancel); butContinue.off('click', cbContinue); el.hide(); resolveF(true)
  }
  var divMessage=createElement('div').css({'padding-bottom':'0.6em', 'white-space':'pre-wrap'})
  var butCancel=createElement('button').myText('Cancel')
  var butContinue=createElement('button').myText('Continue')
  var elInner=createElement('div')
  elInner.myAppend(divMessage, butCancel, butContinue).css({padding:'1em', background:'var(--bg-color)', border:"2px solid var(--border-color)"})
  el.myAppend(elInner).css({display: 'flex', 'align-items':'center', 'justify-content':'center', position:'absolute', top:0, width:'100%', height:'100%'}).hide()
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


class MyConsoleTerm{
  constructor(){ }
  clear(){term.reset();}
  save(){term.write(ANSI_CURSOR_SAVE); return this;  }
  restore(){term.write(ANSI_CURSOR_RESTORE); return this;  }
  clearBelow(){term.write(ANSI_CLEAR_BELOW); return this;  }
  cursorUpN(n){term.write("\0o33["+str(n)+"A");  return this;  }
  cursorUp(){this.cursorUpN(1);  return this; }
  makeSpaceNSave(){term.write("\n\n"+ANSI_CURSOR_UP(2)+ANSI_CURSOR_SAVE);  return this;  }
  myReset(){term.write(ANSI_CURSOR_RESTORE+ANSI_CLEAR_BELOW); return this;}
  //setCur(){ return this;   #place_info() text.see(END)  }
  print(str){term.write(str); return this;}
  //printNL(str){this.print(str+'\n'); return this;  }
  printNL(str){term.writeln(str); return this;  }
  log(str){term.write(str); return this;  }
  error(str){
    if(str instanceof Error) {console.error(str); str=str.message;} 
    else if(typeof str=='object' && 'message' in str) {console.error(str.message); str=str.message;} 
    //this.print("ERROR: "+str)
    var strRed=`\x1B[1;3;31m${str}\x1B[0m`
    term.writeln("ERROR: "+strRed)
    return this;
  }
}


//var makeOpenExtCB=function(key){
var makeOpenExtCB=function(PathFile){
  var cbFunI=async function(ev){
    ev.preventDefault()
    var arrCommand=[strExec, PathFile.fsName]
    var strCommand=arrCommand.join(' ');
    // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}  // Using spawn doesn't work on Windows !!!?!?!?
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; myConsole.error(err); return;}
  }
  return cbFunI
}






