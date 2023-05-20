
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
app.myHistory={History:[{strView:'viewFront'}],cur:0}
app.doHistPush=function(obj){
  var {cur, History}=myHistory, curNew=cur+1
  History[curNew]=obj; History.length=curNew+1
  myHistory.cur=curNew
}
app.historyBack=function(){  
  var {cur, History}=myHistory, curNew=cur-1;
  if(curNew<0) {throw new Error('curNew<0');}
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




var headExtend=function(el, objArg, strTR='tr', strTD='td'){  // headExtend is used inside headExtendDyn
  el.setArrow=function(strName,dir){
    boAsc=dir==1;
    arrImgSort.forEach(function(ele){ele.prop({src:uUnsorted}) });
    var tmp=boAsc?uIncreasing:uDecreasing;
    el.querySelector(strTH+'[name='+strName+']').querySelector('img[data-type=sort]').prop({src:tmp});
  }
  el.clearArrow=function(){
    thSorted=null, boAsc=false;
    arrImgSort.forEach(function(ele){ele.prop({src:uUnsorted}) });
  }
  var thClick=function() {
    var ele=this, boAscDefault=Boolean(ele.boAscDefault); //??0
    boAsc=(thSorted===this)?!boAsc:boAscDefault;  thSorted=this;
    arrImgSort.forEach(function(ele){ele.prop({src:uUnsorted}) });
    var tmp=boAsc?uIncreasing:uDecreasing;  ele.querySelector('img[data-type=sort]').prop({src:tmp});
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
    var imgSort=createElement('img').attr('data-type', 'sort').prop({src:uUnsorted, alt:"sort"}).css({"vertical-align":"middle"});
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




/***********************************************
 *
 *   viewFrontCreator
 *
 **********************************************/
 
app.viewFrontCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewFront';}
  



  // var fiDirSource=await getItemN('fiDirSource');  if(fiDirSource===null)  fiDirSource="";
  // var fiDirTarget=await getItemN('fiDirTarget');  if(fiDirTarget===null)  fiDirTarget="";
  // var fiMeta=await getItemN('fiMeta');  if(fiMeta===null)  fiMeta="";
  // var flPrepend=await getItemN('flPrepend');  if(flPrepend===null)  flPrepend="";

  // // var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {myConsole.log(err.message); debugger; return;}
  // // var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {myConsole.log(err.message); debugger; return;}
  // //var prom = Neutralino.filesystem.readFile(flFile); 
  // // var fsFile=fsDirSource+'/'+flFile;
  // // var [err, DirEnt]=await Neutralino.filesystem.readDirectory('.').toNBP();
  // //var [err, stats] = await Neutralino.filesystem.getStats(flFile).toNBP(); debugger
  

  
  // var labSource=createElement('b').myText('Source');
  // var labTarget=createElement('b').myText('Target');
  // var labMeta=createElement('b').myText('Meta');
  // var labFlPrepend=createElement('b').myText('flPrepend');
  // // var inpSource=createElement('input').prop({type:'text'}); inpSource.value=fiDirSource
  // // var inpTarget=createElement('input').prop({type:'text'}); inpTarget.value=fiDirTarget
  // app.inpSource=createElement('input').prop({type:'text'}).attr('value',fiDirSource).on('change',  function(e){ 
  //   setItemN('fiDirSource',this.value);return false;
  // } );
  // app.inpTarget=createElement('input').prop({type:'text'}).attr('value',fiDirTarget).on('change',  function(e){ 
  //   setItemN('fiDirTarget',this.value);return false;
  // } );
  // app.inpMeta=createElement('input').prop({type:'text'}).attr('value',fiMeta).on('change',  function(e){ 
  //   setItemN('fiMeta',this.value);return false;
  // } );
  // app.inpFlPrepend=createElement('input').prop({type:'text'}).attr('value',flPrepend).on('change',  function(e){ 
  //   setItemN('flPrepend',this.value);return false;
  // } );
  // var Tmp=[inpSource, inpTarget, inpMeta, inpFlPrepend]; Tmp.forEach(ele=>ele.css({width:"20em"})); // span[name=cb]
  // var divSource=createElement('div').myAppend(labSource, inpSource);
  // var divTarget=createElement('div').myAppend(labTarget, inpTarget);
  // var divMeta=createElement('div').myAppend(labMeta, inpMeta);
  // var divFlPrepend=createElement('div').myAppend(labFlPrepend, inpFlPrepend);
  // var divA=createElement('div').myAppend(divSource, divTarget, divMeta, divFlPrepend);

  el.setUp=function(){

  }

  var butClear=createElement('button').myAppend('C').on('click',  function(){myConsole.clear() });
  var butHardLinkCheck=createElement('button').myAppend('Check source for hard links').on('click',  async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource, leafFilterFirst}=result;  hardLinkCheck(fiDirSource, leafFilterFirst)
  });
  
  var butCompareTreeToMeta=createElement('button').myAppend('Compare source tree to meta').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir, fiMeta, flPrepend, leafFilterFirst_DB='.buvt-filterDB'}=result
    syncTreeToMeta(fiDir, fiMeta, flPrepend, 'compareTreeToMeta', leafFilterFirst_DB);
  });
  var butRenameFinishToMeta=createElement('button').myAppend('Rename finish to meta').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiMeta}=result;  renameFinishToMeta(fiMeta);
  });
  var butRenameFinishToTree=createElement('button').myAppend('Rename finish to tree').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirTarget}=result;  renameFinishToTree(fiDirTarget);
  });
  var butRenameFinishToTreeAdditional=createElement('button').myAppend('Rename finish to tree (additional)').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirTarget}=result;  renameFinishToTree(fiDirTarget, leafRenameSuggestionsAdditional);
  });
  var butSyncTreeToMeta=createElement('button').myAppend('Sync source tree to meta').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir, fiMeta, flPrepend, leafFilterFirst_DB='.buvt-filterDB'}=result
    syncTreeToMeta(fiDir, fiMeta, flPrepend, 'syncTreeToMeta', leafFilterFirst_DB);
  });
  

  var butCompareTreeToTree=createElement('button').myAppend('Compare tree to tree').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource, fiDirTarget, leafFilterFirst}=result
    compareTreeToTree(fiDirSource, fiDirTarget, leafFilterFirst)
  });
  var butSyncTreeToTreeBrutal=createElement('button').myAppend('Sync tree to tree brutal').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource, fiDirTarget, leafFilterFirst}=result
    syncTreeToTreeBrutal(fiDirSource, fiDirTarget, leafFilterFirst);
  });


  var butCompareTreeToMetaSTOnly=createElement('button').myAppend('Compare source tree to meta (STOnly)').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir, fiMeta, flPrepend, leafFilterFirst_DB='.buvt-filterDB'}=result
    compareTreeToMetaSTOnly(fiDir, fiMeta, flPrepend, leafFilterFirst_DB);
  });
  app.divDev=createElement('div').myAppend('Developer', butCompareTreeToMetaSTOnly);


  var butCheckSummarizeMissing=createElement('button').myAppend('...Summarize missing').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir, fiMeta}=result
    checkSummarizeMissing(fiDir, fiMeta);
  });
  var inpIStart=createElement('input').prop({type:'number'}).attr('value',0).prop({title:'iStart, (Start checking from this row (Skipping those above this line)).'});
  var butCheck=createElement('button').myAppend('...Check').on('click', async function(){
    myConsole.clear()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDirSource:fiDir, fiMeta}=result
    var iStart=inpIStart.value
    check(fiDir, fiMeta, iStart);
  });
  app.divChecking=createElement('div').myAppend('Checking files in the meta-file...', butCheckSummarizeMissing, butCheck, inpIStart);
  

  app.divOut=createElement('pre').css({'font-family':'monospace', background:'lightgray'}).addClass('contDiv');
  app.myConsole=new MyConsole(divOut)
  var divTop=createElement('div').myAppend(butClear, butHardLinkCheck, butCompareTreeToMeta, butRenameFinishToMeta, butRenameFinishToTree, butRenameFinishToTreeAdditional, butSyncTreeToMeta, butCompareTreeToTree, butSyncTreeToTreeBrutal, divDev, divChecking).addClass('footDiv').css({display:'block'});
  
    // divFoot
  var settingButtonClick=function(){
    viewSettingEntry.setVis(); doHistPush({strView:'viewSettingEntry'});
    //ga('send', 'event', 'button', 'click', 'setting');
  }
  //var tmpImg=createElement('img').prop({src:wsSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var settingButton=createElement('button').myAppend('⚙').addClass('fixWidth').css({'margin':'0 0 0 0.8em','line-height':'1em', padding:'0'}).prop('title','Settings').on('click',settingButtonClick);

  var uWiki='abc'
  var infoLink=createElement('a').prop({href:uWiki}).myText('documentation').css({'margin':'0.4em', 'text-align':'center'});


  var argumentButton=createElement('button').myText('Option preset').addClass('fixWidth').on('click',function(){
    doHistPush({strView:'argumentTab'});
    argumentTab.setVis();
  });


  var divFoot=createElement('div').myAppend(settingButton, infoLink, argumentButton).addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});


  
  el.myAppend(divTop, divOut, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%"});
  return el
}



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
    var {boSelected, label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirst_DB, fiMeta, flPrepend}=rowData;
    var elR=this;
    elR.prop('rowData',rowData) //.attr({label})
    for(var i=0;i<StrColOrder.length;i++) { 
      var name=StrColOrder[i], val=rowData[name]; //, td=this.children.item(i)
      var td=this.querySelector('td[name='+name+']');
      if('mySetVal' in td) { td.mySetVal(val);}   else td.myText(val);
      if('mySetSortVal' in td) { td.mySetSortVal(val);}   else td.valSort=val;
    }
  },
  setSelectedClick:function(){ // "this" will be refering to the clicked button (see below)
    var td=this.parentNode, elR=td.parentNode;
    //var elR=this;
    argumentTab.clearSelected()
    elR.rowData.boSelected=true
    //argumentTab.setSelected(elR)
    td.mySetVal(true)
    argumentTab.saveToDisk()
  },
  TDProt:{
    boSelected:{
      mySetVal:function(boOn){  var td=this, b=td.firstChild, strCol=boOn?'green':''; b.css('background',strCol);  }
    }
  },
  TDConstructors:{
    boSelected:function(){ 
      var b=createElement('button').css('width','1.2em').on('click',ArgumentTabRow.setSelectedClick);
      var el=createElement('td').css('text-align','center').myAppend(b);  extend(el,ArgumentTabRow.TDProt.boSelected);  return el;
    }
  },
  rDefault:{boSelected:false, label:'', fiDirSource:'', fiDirTarget:'', leafFilterFirst:'', leafFilterFirst_DB:'', fiMeta:'', flPrepend:''},
}
ArgumentTabRow.connectStuffClass()



app.argumentSetPopExtend=function(el){
  el.toString=function(){return 'argumentSetPop';}
  var save=function(){ 
    var label=inpLabel.value;
    var fiDirSource=inpDirSource.value; if(fiDirSource.length==0){ setMess('empty fiDirSource',2);  return;}
    var fiDirTarget=inpDirTarget.value; if(fiDirTarget.length==0){ setMess('empty fiDirTarget',2);  return;}
    var leafFilterFirst=inpFilterFirst.value; 
    var leafFilterFirst_DB=inpFilterFirst_DB.value; 
    var fiMeta=inpMeta.value; 
    var flPrepend=inpPrepend.value;
    var rT={label, fiDirSource, fiDirTarget, leafFilterFirst, leafFilterFirst_DB, fiMeta, flPrepend}
    extend(objRow,rT)
    if(boUpd) { 
      //argumentTab.myEdit(elR, objRow);
    } else {
      objRow.boSelected=argumentTab.nRows()==0;
      [elR]=argumentTab.reserveRows();
    }
    ArgumentTabRow.mySet.call(elR, objRow);
    argumentTab.saveToDisk()
    historyBack();
  }
  el.setUp=function(){
    inpLabel.value=objRow.label
    inpDirSource.value=objRow.fiDirSource
    inpDirTarget.value=objRow.fiDirTarget
    inpFilterFirst.value=objRow.leafFilterFirst
    inpFilterFirst_DB.value=objRow.leafFilterFirst_DB
    inpMeta.value=objRow.fiMeta
    inpPrepend.value=objRow.flPrepend
    inpLabel.focus();  return true;
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
  var imgHFilterFirst_DB=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHFilterFirst_DB, createElement('div').myHtml("leaf-prefix: only part furthest away from the root, (the actual file), (no \"/\", \".\" or \"~\")"));
  var imgHMeta=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHMeta, createElement('div').myHtml("fi-prefix: filesystem path interpreted by bash (so \"'\" and \"~\" is OK)"));
  var imgHPrepend=imgHelp.cloneNode(1).css({margin:'0em 1em'}); popupHover(imgHPrepend, createElement('div').myHtml("fl-prefix: filesystem (l=locally based) furthest away from the root, (no \"/\", \".\" or \"~\")"));
  var labLabel=createElement('b').myAppend('Name', imgHLabel);
  var labDirSource=createElement('b').myAppend('fiDirSource', imgHSource);
  var labDirTarget=createElement('b').myAppend('fiDirTarget', imgHTarget);
  var labFilterFirst=createElement('b').myAppend('leafFilterFirst', imgHFilterFirst);
  var labFilterFirst_DB=createElement('b').myAppend('leafFilterFirst_DB', imgHFilterFirst_DB);
  var labMeta=createElement('b').myAppend('fiMeta', imgHMeta);
  var labPrepend=createElement('b').myAppend('flPrepend', imgHPrepend);
  var inpLabel=createElement('input').prop('type', 'text');
  var inpDirSource=createElement('input').prop('type', 'text');
  var inpDirTarget=createElement('input').prop('type', 'text');
  var inpFilterFirst=createElement('input').prop('type', 'text');
  var inpFilterFirst_DB=createElement('input').prop('type', 'text');
  var inpMeta=createElement('input').prop('type', 'text');
  var inpPrepend=createElement('input').prop('type', 'text');
  
  [labLabel, labDirSource, labDirTarget, labFilterFirst, labFilterFirst_DB, labMeta, labPrepend].forEach(ele=>ele.css({'margin-right':'0.5em'}));
  [inpLabel, inpDirSource, inpDirTarget, inpFilterFirst, inpFilterFirst_DB, inpMeta, inpPrepend].forEach(ele=>ele.css({display:'block',width:'100%'}));
  var inpNLab=[labLabel, inpLabel, labDirSource, inpDirSource, labDirTarget, inpDirTarget, labFilterFirst, inpFilterFirst, labFilterFirst_DB, inpFilterFirst_DB, labMeta, inpMeta, labPrepend, inpPrepend];

  //var buttonCancel=createElement('button').myText('Cancel').on('click',historyBack).css({'margin-top':'1em'});
  var buttonBack=createElement('button').myText(charBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack);
  var buttonSave=createElement('button').myText('Save').on('click',save).css({'margin-top':'1em'});
  var divBottom=createElement('div').myAppend(buttonBack, buttonSave);  //buttonCancel,

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').addClass("Center").myAppend(...inpNLab, divBottom).css({'min-width':'17em','max-width':'30em', padding: '1.2em 0.5em 1.2em 1.2em'}); //height:'24em', 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); 
    
  return el;
}


app.argumentDeletePopExtend=function(el){
  el.toString=function(){return 'argumentDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',function(){   
    argumentTab.myRemove(elR);  
    argumentTab.saveToDisk();
    historyBack();
  });
  el.openFunc=function(){
    elR=this.parentNode.parentNode; spanId.myText(elR.rowData.label);
    doHistPush({strView:'argumentDeletePop'});
    el.setVis();
    butOK.focus();
  }
  el.setVis=function(){ el.show(); return 1; }
  
  var elR;
  var head=createElement('h4').myText('Delete');
  var spanId=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanId);
  var buttonBack=createElement('button').myText("Cancel").on('click',historyBack).css({'margin-top':'1em'});

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').addClass("Center").myAppend(head,p, buttonBack, butOK).css({'min-width':'17em','max-width':'25em', padding:'0.5em'});  //,cancel height:'10em', 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); 
  
  return el;
}


  //label,fiDirSource,fiDirTarget,leafFilterFirst,leafFilterFirst_DB,fiMeta,flPrepend
app.argumentTabExtend=function(el){
  el.toString=function(){return 'argumentTab';}
  el.saveToDisk=function(){
    var Row=[...tBody.children], len=Row.length;
    var ObjOpt=Array(len)
    for(var i=0;i<len;i++) {  
      var elR=Row[i], objOpt=elR.rowData; ObjOpt[i]=objOpt
    }
    setItemN('ObjOpt',ObjOpt);
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
    var ObjOpt=await getItemN('ObjOpt');  if(ObjOpt===null)  ObjOpt=[];

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
      var objOptT=ObjOpt[i], elR=Row[i]
      ArgumentTabRow.mySet.call(elR, objOptT);
      //el.indexArgumentTabById[objOptT.label]=objOptT;
    }
  }
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.rowData.boSelected) return [null, row];}
  //   return [new Error('No row selected!?!?')]
  // }
  el.getSelected=async function(){
    var ObjOpt=await getItemN('ObjOpt');  if(ObjOpt===null)  ObjOpt=[];
    for(var objOpt of ObjOpt){
      if(objOpt.boSelected) {
        for(var k in objOpt) {
          var v=objOpt[k]
          if(typeof v=='string' && v.length==0) objOpt[k]=undefined;
        }
        return [null, objOpt];
      }
    }
    return [new Error('No row selected!?!?')]
  }
  el.clearSelected=function(){
    var Row=[...tBody.children];
    Row.forEach(function(rowA){
      var td=rowA.querySelector('[name=boSelected]'); td.mySetVal(false); rowA.rowData.boSelected=false
    })
  }
  el.nRows=function(){return tBody.childElementCount}
  var RowCache=[];
  var tBody=el.tBody=createElement('tbody');
  el.table=createElement('table').myAppend(tBody).addClass('tableSticky'); //.css({width:'100%',position:'relative'});

  //el.StrColOrder=['boSelected', 'label', 'fiDirSource','fiDirTarget', 'leafFilterFirst', 'leafFilterFirst_DB', 'fiMeta', 'flPrepend'];
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

  el.addClass('argumentTab');

  el.css({'text-align':'center'});

  var divCont=createElement('div').myAppend(el.table).css({margin:'1em auto','text-align':'left',display:'inline-block'});
  var divContW=createElement('div').myAppend(divCont).addClass('contDiv');

  var footDiv=createElement('div').myAppend(buttonBack, buttonAdd,spanLabel).addClass('footDiv'); 
  var footDivW=createElement('div').myAppend(footDiv).addClass('footDivW');
  el.append(divContW, footDivW);
  return el;
}


// Neutralino.os.open("https://neutralino.js.org/docs");

