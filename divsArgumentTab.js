

"use strict"

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
    spanDrag.on(strStartEv, argumentTab.table.myMousedown);
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
    var [err]=await argumentTab.saveToDisk(true); if(err){myConsole.error(err); return};

    myConsole.clear();
    //viewFront.clearUI()
  },
  factory:function(){
    var b=createElement('button').myHtml('&nbsp;').css('width','1.2em').on('click',ArgumentTabTdBoSelected.setSelectedClick);
    var td=createElement('td').css('text-align','center').myAppend(b);  copySome(td, ArgumentTabTdBoSelected, ['mySetVal']);  return td;
  }
}
  // methSetTButton: Method for time-diff buttons
var methSetTButton=function(t){
  var tD=unixNow()-t;
  //var arrT=getSuitableTimeUnit(tD, {d:3600*24,y:365*24*3600}, {d:730,y:Number.MAX_VALUE}), strLab=arrT.join(' ');
  var arrDay=getSuitableTimeUnit(tD, {d:3600*24}, {d:Number.MAX_VALUE}), strDay=arrDay[0], strLabWUnit=arrDay.join(' ');
  //var strFontWeight=arrDay[1]=='y'?'bold':''
  var arrHuman=getSuitableTimeUnit(tD), strHuman=arrHuman.join(' ');
  var Str=[`${strLabWUnit} ago`, `${new Date(t*1000)}`]
  if(arrHuman[1]!=arrDay[1]) Str.splice(1, 0, `(${strHuman} ago)`)
  this.firstChild.myText(strDay).prop({title:Str.join('\n')}); //.css({'white-space':'nowrap', 'font-weight':strFontWeight})
}
gThis.ArgumentTabTdTLastSync={    // Class object
  mySetVal:methSetTButton,
  setTLastSync:async function(){ // this will refer to the button
    var td=this.parentNode, elR=td.parentNode;
    var strMess=`Setting tLastSync?\nWritten to:\n ${fsMyStorage}`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) { return}
    var  [err]=await elR.setTLastSync(); if(err) {myConsole.error(err); debugger; return;};
    this.myText('0 d').prop({title:'0 s ago'})
  },
  factory:function(){ 
    //var b=createElement('button').myHtml('&nbsp;').on('click', ArgumentTabTdTLastSync.setTLastSync);
    var b=createElement('span').myHtml('&nbsp;'); //.on('click', ArgumentTabTdTLastSync.setTLastSync);
    var td=createElement('td').myAppend(b);  copySome(td, ArgumentTabTdTLastSync, ['mySetVal']);  return td;
  }
}
gThis.ArgumentTabTdTLastCheck={    // Class object
  mySetVal:methSetTButton,
  setTLastCheck:async function(){ // this will refer to the button
    var td=this.parentNode, elR=td.parentNode, {charSide}=td;
    var strMess=`Setting tLastCheck${charSide} (to current time)?`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) { return}
    var  [err]=await elR.setTLastCheck(charSide); if(err) {myConsole.error(err); debugger; return;};
    this.myText('0').prop({title:'0 s ago'})
  },
  factory:function(){ 
    var b=createElement('button').myHtml('&nbsp;').on('click', ArgumentTabTdTLastCheck.setTLastCheck);
    //var b=createElement('span').myHtml('&nbsp;');
    var td=createElement('td').myAppend(b);  copySome(td, ArgumentTabTdTLastCheck, ['mySetVal']);  return td;
  },
  factoryS:function(){  var td=ArgumentTabTdTLastCheck.factory(); td.charSide='S'; return td;},
  factoryT:function(){  var td=ArgumentTabTdTLastCheck.factory(); td.charSide='T'; return td;}

}
//var td=this.parentNode, elR=td.parentNode;

gThis.ArgumentTabRow={
  extendClass:function(){
    
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
      //tLastCheck:ArgumentTabTdTLastCheck.factory,
      tLastCheckS:ArgumentTabTdTLastCheck.factoryS,
      tLastCheckT:ArgumentTabTdTLastCheck.factoryT
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
    elR.on('mouseover', function(ev){this.css({background:'var(--bg-colorEmp)'})})
    elR.on('mouseout', function(ev){this.css({background:''})})

    elR.append(tEdit, tCopy, tDelete);
    return elR;
  },
  mySetDomRow:function(rowData){
    var {StrColOrder}=this
    var {boSelected, label, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, suffixFilterFirstT2T, charTResS, charTResT, charTResCollision, charFilterMethod, boAllowLinks, boAllowCaseCollision, strTargetCharSet}=rowData; //, leafFilterFirst, leafDb
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
  setTLastCheck:async function(charSide){
    this.dataset[`tLastCheck${charSide}`]=unixNow();
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
  rDefault:{ind:0, boSelected:false, label:'', fiSourceDir:'', strHostTarget:'', fiTargetDbDir:'', flTargetDataDir:'', suffixFilterFirstT2T:'', charTResS:'9', charTResT:'9', charTResCollision:'d', tLastSync:0, tLastCheckS:0, tLastCheckT:0, charFilterMethod:"b", boAllowLinks:true, boAllowCaseCollision:true, strTargetCharSet:'ext4'}, // , leafFilterFirst:'', leafDb:''
  factory:function(){
    var el=createElement('tr')
    var Key=Object.keys(ArgumentTabRow); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, ArgumentTabRow, Key)
    el.connectStuff()
    return el;
  }
}
ArgumentTabRow.extendClass();


var strTResEnding=`0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`

var StrHeaderTitle={ind:'Current sortorder', boSelected:'', label:'', 
  fiSourceDir:`The location of the source tree`,
  strHostTarget:'Host of the target (empty means localhost)',
  fiTargetDbDir:`The location of the target tree Db`,
  flTargetDataDir:`The location (in the fiTargetDbDir) of the target tree containing the actual files`,
  suffixFilterFirstT2T:`Suffix for top-level-filter-file used when comparing source-tree to target-tree.
Explanation:
The default filter-file-names are either ".buvt-filter" or ".rsync-filter", depending on the charFilterMethod-setting. This filter-file will be used when syncing T2D.
The filter-file-name with this suffix added, will be used when filtering for the T2T-syncing.
The typical usecase is when you want to do multiple backups to drives of different sizes. You may then want filter-files depending on the target.`, //(I know rsync has a more elaborate system, but it is good enough for me.)
  charTResS:`Timestamp resolution on the source side:\n`+strTResEnding, 
  charTResT:`Timestamp resolution on the target side:\n`+strTResEnding,
  charTResCollision:`Timestamp resolution when finding timestamp collisions:\n`+strTResEnding,
   tLastSync:`Time of last sync: is set when T2T>doActions completes.`,
  tLastCheckS:`Time of last check on source side.`,
  tLastCheckT:`Time of last check on target side.`,
  charFilterMethod:`Filter method, how will filtering be done:
    b: ".buvt-filter" (syntax see buvt-documentation)
    r: ".rsync-filter" (interpreted by buvt)
      Only include/exclude-patterns are supported.
    R: ".rsync-filter" (interpreted by rsync)
Note 1: You can compare the filtering methods in Extra>"Compare filtering methods".
Note 2: in T2T-top-level the "suffixFilterFirstT2T"-setting is added to the filter-file-name (so .buvt-filterWHATEVER or .rsync-filterWHATEVER)`,
  boAllowLinks:`boAllowLinks: If the target can handle (soft) links.`,
  boAllowCaseCollision:`boAllowCaseCollision: If target can handle multiple files that only differs in case, such as "A.txt" and "a.txt"`,
  strTargetCharSet:`Target character set: What character-set the target can handle:
  ext4: reserved characters: "/"
  ms: reserved characters: ""*/:<>?\\|" (Microsoft (NTFS, exFAT, FAT32 (VFAT)))
Entries containing reserved characters are skipped.`
}
//There you can also compare the output with rsync dry-ryn itself.

gThis.argumentSetPopExtend=function(el){
  el.toString=function(){return 'argumentSetPop';}
  var save=async function(){ 
    var label=inpLabel.value;
    var fiSourceDir=inpSourceDir.value; //if(fiSourceDir.length==0){ myConsole.log('empty fiSourceDir',2);  return;}
    var strHostTarget=inpHostTarget.value
    var fiTargetDbDir=inpTargetDbDir.value; if(fiTargetDbDir.length==0){ myConsole.log('empty fiTargetDbDir',2);  return;}
    var flTargetDataDir=inpTargetDataDir.value;
    fiSourceDir=rtrim(fiSourceDir, charF)
    fiTargetDbDir=rtrim(fiTargetDbDir, charF)
    flTargetDataDir=rtrim(flTargetDataDir, charF)

    //var leafFilterFirst=inpFilterFirst.value; 
    var suffixFilterFirstT2T=inpFilterFirstT2T.value;
    //var leafDb=inpDb.value; 
    var charTResS=selTResS.value
    var charTResT=selTResT.value
    var charTResCollision=selTResCollision.value
    var charFilterMethod=selFilterMethod.value;
    var boAllowLinks=inpAllowLinks.checked;
    var boAllowCaseCollision=inpAllowCaseCollision.checked;
    var strTargetCharSet=selFsTarget.value
    var rT={label, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, suffixFilterFirstT2T, charTResS, charTResT, charTResCollision, charFilterMethod, boAllowLinks, boAllowCaseCollision, strTargetCharSet}; //, leafFilterFirst, leafDb
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
    //viewFront.clearUI();
    var [err]=await argumentTab.saveToDisk(true); if(err){myConsole.error(err); return};
    historyBack();
  }
  el.setUp=function(){
    inpLabel.value=rowDataLoc.label
    inpSourceDir.value=rowDataLoc.fiSourceDir
    inpHostTarget.value=rowDataLoc.strHostTarget
    inpTargetDbDir.value=rowDataLoc.fiTargetDbDir
    inpTargetDataDir.value=rowDataLoc.flTargetDataDir
    //inpFilterFirst.value=rowDataLoc.leafFilterFirst
    inpFilterFirstT2T.value=rowDataLoc.suffixFilterFirstT2T
    //inpDb.value=rowDataLoc.leafDb
    selTResS.value=rowDataLoc.charTResS
    selTResT.value=rowDataLoc.charTResT
    selTResCollision.value=rowDataLoc.charTResCollision
    selFilterMethod.value=rowDataLoc.charFilterMethod
    inpAllowLinks.checked=rowDataLoc.boAllowLinks=="true"
    inpAllowCaseCollision.checked=rowDataLoc.boAllowCaseCollision=="true"
    selFsTarget.value=rowDataLoc.strTargetCharSet
    inpLabel.focus();
    myConsole.clear();
    //divConsoleContainer.myAppend(divConsole)
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

  var labLabel=createElement('div').myAppend('Label').prop({title:'Label (Name) Displayed on the tab.'});
  var labSourceDir=createElement('div').myAppend('fiSourceDir').prop({title:StrHeaderTitle.fiSourceDir});
  var labHostTarget=createElement('div').myAppend('Target host').prop({title:StrHeaderTitle.strHostTarget});
  var labTargetDbDir=createElement('div').myAppend('fiTargetDbDir').prop({title:StrHeaderTitle.fiTargetDbDir});
  var labTargetDataDir=createElement('div').myAppend('flTargetDataDir').prop({title:StrHeaderTitle.flTargetDataDir});
  //var labFilterFirst=createElement('div').myAppend('leafFilterFirst', imgHFilterFirst);
  var labFilterFirstT2T=createElement('div').myAppend('suffixFilterFirstT2T').prop({title:StrHeaderTitle.suffixFilterFirstT2T});
  //var labDb=createElement('div').myAppend('leafDb', imgHDb);
  var labTResS=createElement('div').myAppend('tResS').prop({title:StrHeaderTitle.charTResS});
  var labTResT=createElement('div').myAppend('tResT').prop({title:StrHeaderTitle.charTResT});
  var labTResCollision=createElement('div').myAppend('tResCollision').prop({title:StrHeaderTitle.charTResCollision});
  var labFilterMethod=createElement('div').myAppend('Filter method').prop({title:StrHeaderTitle.charFilterMethod});
  var labAllowLinks=createElement('div').myAppend('Allow links').prop({title:StrHeaderTitle.boAllowLinks});
  var labAllowCaseCollision=createElement('div').myAppend('Allow case-collisions').prop({title:StrHeaderTitle.boAllowCaseCollision});
  var labFsTarget=createElement('div').myAppend('Target character set').prop({title:StrHeaderTitle.strTargetCharSet});

  var inpLabel=createElement('input').prop('type', 'text');
  var inpSourceDir=createElement('input').prop('type', 'text');
  var inpHostTarget=createElement('input').prop('type', 'text');
  var inpTargetDbDir=createElement('input').prop('type', 'text');
  var inpTargetDataDir=createElement('input').prop('type', 'text');
  //var inpFilterFirst=createElement('input').prop('type', 'text');
  var inpFilterFirstT2T=createElement('input').prop('type', 'text');
  //var inpDb=createElement('input').prop('type', 'text');
  var selTResS=createElement('select');
  var selTResT=createElement('select');
  var selTResCollision=createElement('select');
  var selFilterMethod=createElement('select');
  //var inpIncIdS=createElement('input').prop('type', 'checkbox');
  //var inpIncIdT=createElement('input').prop('type', 'checkbox');
  var inpAllowLinks=createElement('input').prop('type', 'checkbox');
  var inpAllowCaseCollision=createElement('input').prop('type', 'checkbox');
  var selFsTarget=createElement('select');

    // Add options to selTResS and selTResT
  var OptS=[], OptT=[], OptCollision=[]
  for(var k of KeyTRes){
    var optTmp=createElement('option').myText(k).prop('value',k);
    OptS.push(optTmp.cloneNode(true));  OptT.push(optTmp.cloneNode(true));  OptCollision.push(optTmp.cloneNode(true));
  }
  //selTResS.empty().myAppend(...OptS);  selTResT.empty().myAppend(...OptT);  selTResCollision.empty().myAppend(...OptCollision);
  selTResS.myAppend(...OptS);  selTResT.myAppend(...OptT);  selTResCollision.myAppend(...OptCollision);

    // Add options to selFilterMethod
  var Opt=[];
  var Key=["b", "r", "R"];
  for(var k of Key){
    var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt);
  }
  selFilterMethod.empty().myAppend(...Opt);

    // Add options to selFsTarget
  var Opt=[];
  var Key=["ext4", "ms"];
  for(var k of Key){
    var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt);
  }
  selFsTarget.empty().myAppend(...Opt);

  var Lab=[labLabel, labSourceDir, labHostTarget, labTargetDbDir, labTargetDataDir, labFilterFirstT2T, labTResS, labTResT, labTResCollision, labFilterMethod, labAllowLinks, labAllowCaseCollision, labFsTarget]; //, labIncIdS, labIncIdT
  var Inp=[inpLabel, inpSourceDir, inpHostTarget, inpTargetDbDir, inpTargetDataDir, inpFilterFirstT2T, selTResS, selTResT, selTResCollision, selFilterMethod, inpAllowLinks, inpAllowCaseCollision, selFsTarget]; //, inpIncIdS, inpIncIdT
  Lab.forEach((ele,i)=>ele.myAppend(Inp[i]))

  //var buttonCancel=createElement('button').myText('Cancel').on('click',historyBack).css({'margin-top':'1em'});
  var buttonBack=createElement('button').myText('Cancel').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack); // charBackSymbol
  var buttonSave=createElement('button').myText('Save').on('click',save); //
  var divBottom=createElement('div').myAppend(buttonBack, buttonSave).css({'margin-top':'1em'});;  //buttonCancel,

  var blanket=createElement('div').addClass("blanket");
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});

  //var divConsole=createElement('div').addClass("popupErrorConsole")
  var centerDiv=createElement('div').addClass("Center").myAppend(...Lab, divBottom).css({'min-width':'30em','max-width':'30em', padding: '1.2em 0.5em 1.2em 1.2em'}); //.addClass('Settings'); //divConsoleContainer
  Lab.forEach(ele=>ele.css({display:'block', 'margin-top':'0.5em'}))
  Inp.forEach(ele=>ele.css({'margin-left':'0.5em'}));
  [inpSourceDir, inpTargetDbDir, inpTargetDataDir].forEach(ele=>ele.css({'margin-left':'0em', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, 'input[type=text]').forEach(ele=>ele.css({display:'block', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, ':not(input[type=text])').forEach(ele=>ele.css({'margin-left':'0.5em'}))
  el.addClass("Center-Container").myAppend(blanket, centerDiv).css({'z-index':2}); 
    
  return el;
}


gThis.argumentDeletePopExtend=function(el){
  el.toString=function(){return 'argumentDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',async function(){   
    argumentTab.myRemove(elR);
    //viewFront.clearUI();
    var [err]=await argumentTab.saveToDisk(true); if(err){myConsole.error(err); return};
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
    //divConsoleContainer.myAppend(divConsole)
  }
  
  var elR;
  var head=createElement('h3').myText('Delete');
  var spanId=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanId);
  var buttonBack=createElement('button').myText("Cancel").on('click',historyBack).css({'margin-top':'1em'});

  var blanket=createElement('div').addClass("blanket");
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});
  var centerDiv=createElement('div').addClass("Center").myAppend(head,p, buttonBack, butOK).css({'min-width':'17em','max-width':'25em', padding:'0.5em'});  //divConsoleContainer 
  el.addClass("Center-Container").myAppend(blanket, centerDiv); 
  
  return el;
}

gThis.draggableTabExtend=function(el, divScrollableContainer, mouseUpCB){
  var movedRow, iStart, scrollTimer=null, yMouse=null
  var funRearranger=function(){
    var y=yMouse
    var iCur=movedRow.myIndex();
    var hCur=movedRow.offsetHeight, yMouseOff=y-hCur/2;
    var tBody=el.children[1]
    var len=tBody.childElementCount, boMoved=false

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
  }
  el.myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    movedRow=this.parentNode.parentNode;
    iStart=getNodeIndex(movedRow);
    movedRow.css({position:'relative', opacity:0.55, 'z-index':'auto'});  
    document.on(strMoveEv, myMousemove, {passive: false}); document.on(strEndEv, myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
    //setMess('Down');
    scrollTimer=setInterval(scrollTimerCb,50)
  } 
  var myMouseup= function(e){ 
    movedRow.css({'transform':'translateY(0px)',opacity:1,'z-index':'auto'});
    document.off(strMoveEv, myMousemove); document.off(strEndEv, myMouseup);
    //argumentTab.checkIfSortOrderHasChangedW()
    mouseUpCB()
    clearInterval(scrollTimer)
  }
  var myMousemove= function(e){
    if(boTouch) {e.preventDefault(); e.stopPropagation(); yMouse=e.changedTouches[0].pageY;}
    else {yMouse=e.clientY;}
    funRearranger()
  }
  var scrollTimerCb=function(){
    var y=yMouse, yZone=10, yStep=10
    if(y<yZone) {divScrollableContainer.scrollTop-=yStep;}
    else if(y>divScrollableContainer.offsetHeight-yZone) {divScrollableContainer.scrollTop+=yStep;}
    funRearranger()
  }
  return el
}

  //label, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, leafFilterFirst, suffixFilterFirstT2T, leafDb, charTResS, charTResT, charTResCollision, charFilterMethod, boAllowLinks, boAllowCaseCollision, strTargetCharSet
gThis.argumentTabExtend=function(el){
  el.toString=function(){return 'argumentTab';}
  el.constructorPart2=async function(){ // For stuff that needs await
    var [err]=await this.setUpDom(); if(err) return [err]
    return [null];
  }

  el.setUp=async function(){
    divTopContainer.myAppend(divTop)
    elConsoleContainerTop.clear().myAppend(divFoot)
    var [err]=await this.setUpDom(); if(err) return [err]
    return [null]
  }

  el.setBottomMargin=function(hNew){
    var hTmp=hNew+50
    divCont.css({'margin-bottom':hTmp+'px'})
  }
  el.saveToDisk=async function(boRefreshUI=false){ // Could be called boNonStatisticsChanged
    var len=tBody.childElementCount
    var ObjOpt=Array(len)
    for(var i=0;i<len;i++) {
      var elR=tBody.children[i];
      //var objOpt=extend({},elR.dataset);
      var objOpt=elR.getTypedData();
      //if(boSetCurrentOrder) {objOpt.ind=i; elR.mySetDomRow(objOpt); }
      ObjOpt[i]=objOpt
    } 
    ObjOpt.sort((a,b)=>{return a.ind-b.ind;})
    ObjOpt.forEach(o=>{delete o.ind;})
    var [err]=await myStorage.setItem('ObjOpt',ObjOpt); if(err) {debugger; return [err];}
    //viewFront.clearUI();
    if(boRefreshUI) argumentTab.dispatchEvent(eventObjOptNonStatisticsChanged);
    return [null]
  }
  el.setCurrentOrder=function(){
    for(var i=0;i<tBody.childElementCount;i++) {
      var elR=tBody.children[i];
      var objOpt=elR.getTypedData();
      objOpt.ind=i; elR.mySetDomRow(objOpt);
    } 
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
      if(RowCache.length) {elR=RowCache.pop();} else {  elR=ArgumentTabRow.factory(); } 
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

      objOpt.fiSourceDir=rtrim(objOpt.fiSourceDir, charF)
      objOpt.fiTargetDbDir=rtrim(objOpt.fiTargetDbDir, charF)
      objOpt.flTargetDataDir=rtrim(objOpt.flTargetDataDir, charF)

      for(var k in objOpt) {  // Delete empty strings
        var v=objOpt[k]
        if(ArgumentTabRow.StrColOrder.indexOf(k)==-1) delete objOpt[k];
        //if(typeof v=='string' && v.length==0) delete objOpt[k];
      }
      for(var k in ArgumentTabRow.rDefault){
        if(typeof objOpt[k]==='undefined') objOpt[k]=ArgumentTabRow.rDefault[k]
      }
    }
    el.indNext=ObjOpt.length; // indNext: counter to prevent colliding ind when new rows are added.
    if(isNaN(iSelected)) return [Error('no-argument-selected')]
    return [null, ObjOpt, iSelected]
  }
  el.setUpDom=async function(){
    var [err, ObjOpt, iSelected]=await el.getDataFrFile();
    if(err) {
      if(err.message!='no-argument-selected') debugger;
      return [err];
    }

    var nOld=tBody.childElementCount, nNew=ObjOpt.length;
    if(nOld<nNew) el.reserveRows(nNew-nOld);
    else if(nOld>nNew){
      for(var i=nNew; i<nOld;i++){
        var elR=tBody.children[i]; elR.remove(); RowCache.push(elR)
      }
    }
    for(var i=0;i<nNew;i++) {
      var objOptT=extend({}, ArgumentTabRow.rDefault)
      extend(objOptT, ObjOpt[i]);
      var elR=tBody.children[i];
      elR.mySetDomRow(objOptT);
    }

    divTopContainer.myAppend(divTop)
    myConsole.clear();
    return [null]
  }
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.dataset.boSelected=="true") return [null, row];}
  //   return [Error('No row selected!?!?')]
  // }
  el.getSelectedFrFile=async function(){
    var [err, ObjOpt, iSelected]=await el.getDataFrFile();  if(err) {debugger; return [err];}
    var objOpt=ObjOpt[iSelected], objOptExtended=extend({}, objOpt)
    var {strHostTarget, fiTargetDbDir, flTargetDataDir}=objOptExtended
    if(!strHostTarget) strHostTarget="localhost";   var boRemoteTarget=strHostTarget!="localhost"
    //fiTargetDbDir||=fiTargetDataDir
    //fiTargetDataDir||=fiTargetDbDir
    extend(objOptExtended, {boRemoteTarget, strHostTarget, fiTargetDbDir, flTargetDataDir})
    return [null, objOptExtended];
  }
  el.calcExtraData=async function(objOpt){ // Extra calculations based on side and also caclulating fs from fi
      // , charSide
    var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charTResS, charTResT, charFilterMethod}=objOpt

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    //for(var k of ['S', 'T'])
    if(flTargetDataDir) {var fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir, fleTargetDataDir=flTargetDataDir+charF;}
    else {var fsTargetDataDir=fsTargetDbDir, fleTargetDataDir=""; }
    var fsSourceDb=fsSourceDir+charF+settings.leafDb,  fsTargetDb=fsTargetDbDir+charF+settings.leafDb

    var argS={strHost:"localhost", fsDbDir:fsSourceDir, fsDataDir:fsSourceDir, charTRes:charTResS, fsDb:fsSourceDb, charSide:'S', boTarget:false}
    var argT={strHost:strHostTarget, fsDbDir:fsTargetDbDir, fsDataDir:fsTargetDataDir, charTRes:charTResT, fsDb:fsTargetDb, charSide:'T', boTarget:true}
    var ArgSide=[argS, argT]

    var leafFilter=LeafFilter[charFilterMethod];

    //var boTarget=charSide=='T',  argSide=ArgSide[Number(boTarget)], {fsDbDir, fsDataDir, charTRes, strHost}=argSide;
    //if(!charTRes) charTRes=settings.charTRes;
    //var fsDb=fsDbDir+charF+settings.leafDb

    var argExtra={fsSourceDir, fsTargetDbDir, fsTargetDataDir, fsSourceDb, fsTargetDb, fleTargetDataDir, leafFilter, ArgSide}
    //var argSideExtra={boTarget, fsDbDir, fsDataDir, charTRes, strHost, fsDb}, argSideExtra

    return [null, argExtra];
  }
  //var [err, objOpt]=await argumentTab.calcExtraData(objOpt)
  el.getSelectedFrFileWExtra=async function(){
    var [err, argGeneral]=await argumentTab.getSelectedFrFile(); if(err) {debugger; return [err];}

    //var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charTResS, charTResT, charFilterMethod, charTResCollision}=argGeneral
    var [err, argGeneralExtra]=await argumentTab.calcExtraData(argGeneral); if(err) {debugger; return [err];}
    extend(argGeneral, argGeneralExtra)
    return [null, argGeneral]
  }
  
  el.getSelectedFrDom=function(){
    var rowSelected=undefined, iSelected=NaN;
    for(var i=0;i<tBody.childElementCount;i++){
      var rowA=tBody.children[i], boSelected=rowA.dataset.boSelected=="true"
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
  el.setTLastSync=async function(){
    var [err, rowSelected, iSelected]=await el.getSelectedFrDom();  if(err) {debugger; return [err];}
    rowSelected.dataset.tLastSync=unixNow();
    var [err]=await el.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  }
  el.setTLastCheck=async function(charSide){
    var [err, rowSelected, iSelected]=await el.getSelectedFrDom();  if(err) {debugger; return [err];}
    rowSelected.dataset[`tLastCheck${charSide}`]=unixNow();
    var [err]=await el.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  }
  el.setTResCollision=async function(charTResCollision){
    var [err, rowSelected, iSelected]=await el.getSelectedFrDom();  if(err) {debugger; return [err];}
    rowSelected.dataset[`charTResCollision`]=charTResCollision;
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
    //buttonSaveSortOrder.enable(boChanged)
    buttonSaveSortOrder.toggle(boChanged)
  }
  el.getLeafDb=function(){

  }
  var RowCache=[];


  const eventObjOptNonStatisticsChanged = new Event("eventObjOptNonStatisticsChanged");

    // Table
  var tBody=createElement('tbody');
  el.table=createElement('table').myAppend(tBody).addClass('tableSticky', 'tableInset').css({'word-break':'break-all'});
  

  var trHead=createElement('tr');
  var tHead=createElement('thead').myAppend(trHead);
  tHead.css({background:'var(--bg-color)', width:'inherit', opacity:0.8});  
  el.table.prepend(tHead);
  trHead.on('click', el.checkIfSortOrderHasChangedW)

  var BoAscDefault={}, Label={boSelected:'Selected', charTResS:'tResS', charTResT:'tResT', charTResCollision:'tResCollision', strTargetCharSet:'Target chacracter set'}, Th=[];
  var Title=extend({}, StrHeaderTitle)
  for(var strName of ArgumentTabRow.StrColOrder){ 
    var boAscDefault=BoAscDefault[strName]??true;
    var label=Label[strName]??strName; //ucfirst
    var title=Title[strName]??strName;
    var h=createElement('th').addClass('unselectable').prop('boAscDefault',boAscDefault).attr('name',strName).myText(label); 
    if(title) h.attr('title',title)
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
  var buttonSaveSortOrder=createElement('button').myText('Save sort order').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em', background:'var(--bg-red)'}).on('click',async function(){
    argumentTab.setCurrentOrder()
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

  var divFoot=createElement('div').myAppend(buttonAdd, buttonSaveSortOrder).addClass('footDiv').css({width:'100%',background:"var(--bg-colorEmp)", margin:'0px', padding:'0.4em', 'border-top':'solid 1px'}); //, spanSpace buttonBack, , spanLabel
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8, 'text-align':'left'});
  //var divFootW=createElement('div').myAppend(divFoot).addClass('footDivW').css({position:'fixed', bottom:'0px', opacity:0.8, 'flex-direction':'column', background:'var(--bg-color)'}); //divConsoleContainer
  draggableTabExtend(el.table, divContW, el.checkIfSortOrderHasChangedW)

  el.append(divTopContainer, divContW);
  return el;
}

