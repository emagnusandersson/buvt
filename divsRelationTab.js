

"use strict"


gThis.RelationTdInd={  
  mySetVal:function(ind){   },
  factory:function(){
    var spanDrag=createElement('span').attr('name', 'spanDrag').myText('⣿').css({ 'font-size':'1.8em', 'color':'var(--text-grey)', 'cursor':'pointer', 'text-align':'center', 'width':'1.3em', display:'inline-block'});
    spanDrag.on(strStartEv, relationTab.table.myMousedown);
    var td=createElement('td').myAppend(spanDrag); copySome(td, RelationTdInd, ['mySetVal']); 
    return td;
  }
}
gThis.RelationTdBoSelected={  
  mySetVal:function(boOn){  var td=this, b=td.firstChild, strCol=boOn?'var(--bg-green)':''; b.css('background',strCol);  },
  setSelectedClick:async function(){ // "this" will be refering to the clicked button (see below)
    var td=this.parentNode, elR=td.parentNode;
    //var elR=this;
    relationTab.clearAllSelectButton()
    elR.dataset.boSelected=true
    //relationTab.setSelected(elR)
    td.mySetVal(true)
    var [err]=await relationTab.saveToDisk(true); if(err){myConsole.error(err); return};

    myConsole.clear();
    //viewFront.clearUI()
  },
  factory:function(){
    var b=createElement('button').myHtml('&nbsp;').css('width','1.2em').on('click',RelationTdBoSelected.setSelectedClick);
    var td=createElement('td').css('text-align','center').myAppend(b);  copySome(td, RelationTdBoSelected, ['mySetVal']);  return td;
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
gThis.RelationTdTLastSync={    // Class object
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
    //var b=createElement('button').myHtml('&nbsp;').on('click', RelationTdTLastSync.setTLastSync);
    var b=createElement('span').myHtml('&nbsp;'); //.on('click', RelationTdTLastSync.setTLastSync);
    var td=createElement('td').myAppend(b);  copySome(td, RelationTdTLastSync, ['mySetVal']);  return td;
  }
}
//var td=this.parentNode, elR=td.parentNode;

gThis.RelationTdId={  
  mySetVal:function(intId){
    var label=relationTab.objLabelById[intId], boExist=typeof label!='undefined';
    if(boExist) {var strCol="";} else {var strCol='var(--text-red)'; label='Location does not exist';} 
    this.firstChild.myText(label).css({color:strCol}); //.prop({title})
  },
  factory:function(charSide){ 
    var span=createElement('span').myHtml('(label)');
    var td=createElement('td').myAppend(span);
    td.charSide=charSide;  copySome(td, RelationTdId, ['mySetVal']);  return td;
  },
  factoryS:function(){  var td=RelationTdId.factory('S'); return td;},
  factoryT:function(){  var td=RelationTdId.factory('T'); return td;}
}



gThis.RelationRow={
  extendClass:function(){

    this.KeyPropWInd=Object.keys(this.propDefaultWInd)
    this.StrPropType={}
    for(var i=0;i<this.KeyPropWInd.length;i++){
      var keyProp=this.KeyPropWInd[i]
      this.StrPropType[keyProp]=typeof this.propDefaultWInd[keyProp]
    }
  },
  connectStuff:function(){
    var {KeyPropWInd}=this
    var elR=this
    var TDConstructors={
      ind:RelationTdInd.factory,
      boSelected:RelationTdBoSelected.factory,
      tLastSync:RelationTdTLastSync.factory,
      idSource:RelationTdId.factoryS,
      idTarget:RelationTdId.factoryT
    }
    for(var i=0;i<KeyPropWInd.length;i++) { 
      var name=KeyPropWInd[i], td;
      if(name in TDConstructors) { td=TDConstructors[name]();  } 
      else td=createElement('td');
      elR.append(td.attr('name',name));
    }
    var buttEdit=createElement('button').attr('name','buttonEdit').myText('Edit').on('click',function(){
      relationSetPop.openFunc.call(this,1);
    });
    var buttCopy=createElement('button').attr('name','buttonCopy').myText('Copy').on('click',function(){
      relationSetPop.openFunc.call(this,0);
    });
    var buttDelete=createElement('button').attr('name','buttonDelete').css({'margin-right':'0.2em'}).myAppend(charDelete).on('click',relationDeletePop.openFunc);
    var tEdit=createElement('td').myAppend(buttEdit), tCopy=createElement('td').myAppend(buttCopy), tDelete=createElement('td').myAppend(buttDelete);
    elR.on('mouseover', function(ev){this.css({background:'var(--bg-colorEmp)'})})
    elR.on('mouseout', function(ev){this.css({background:''})})

    elR.append(tEdit, tCopy, tDelete);
    return elR;
  },
  mySetDomRow:function(rowData){
    var {KeyPropWInd}=this
    var {boSelected, idSource, idTarget, flTargetDataDir, suffixFilterFirstT2T}=rowData;
    var elR=this;
    extend(elR.dataset, rowData); // dataset stringifies things (I think), so it won't matter that rowData points back into cache.
    //elR.prop('rowData',rowData)
    for(var i=0;i<KeyPropWInd.length;i++) { 
      var name=KeyPropWInd[i], val=rowData[name]; //, td=this.children.item(i)
      var td=this.querySelector(`td[name=${name}]`);
      if('mySetVal' in td) { td.mySetVal(val);}   else td.myText(val);
      if('mySetSortVal' in td) { td.mySetSortVal(val);}   else td.valSort=val;
    }
  },
  setTLastSync:async function(){
    this.dataset.tLastSync=unixNow();
    var [err]=await relationTab.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  },
  getTypedData:function(){
    var {KeyPropWInd,StrPropType}=this
    var objO=extend({},this.dataset)
    for(var i=0;i<KeyPropWInd.length;i++){
      var strName=KeyPropWInd[i], val=objO[strName]
      if(StrPropType[strName]=='string') continue;
      else if(StrPropType[strName]=='number') val=Number(val);
      else if(StrPropType[strName]=='boolean') val=val=="true"
      objO[strName]=val
    }
    return objO
  },
  propDefaultWInd:{ind:0, boSelected:false, idSource:0, idTarget:0, flTargetDataDir:'', suffixFilterFirstT2T:'', tLastSync:0}, 
  factory:function(){
    var el=createElement('tr')
    var Key=Object.keys(RelationRow); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, RelationRow, Key)
    el.connectStuff()
    return el;
  }
}
RelationRow.extendClass();


var strTResEnding=`0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`

var StrHeaderTitle={ind:'Current sortorder', boSelected:'', idSource:'', idTarget:'', 
  flTargetDataDir:`The location within the target side fiDir where the actual files are stored.`,
  suffixFilterFirstT2T:`Suffix for top-level-filter-file used when comparing source-tree to target-tree.
Explanation:
The default filter-file-names are either ".buvt-filter" or ".rsync-filter", depending on the charFilterMethod-setting on the source side. This filter-file will be used when syncing T2D.
The filter-file-name with this suffix added, will be used when filtering for the T2T-syncing.
The typical usecase is when you want to do multiple backups to drives of different sizes. You may then want filter-files depending on the target.`, //(I know rsync has a more elaborate system, but it is good enough for me.)
  tLastSync:`Time of last sync: is set when T2T>doActions completes.`
}
//There you can also compare the output with rsync dry-ryn itself.

gThis.relationSetPopExtend=function(el){
  el.toString=function(){return 'relationSetPop';}
  var save=async function(){ 
    var idSource=Number(selIdSource.value);
    var idTarget=Number(selIdTarget.value);
    var {objLabelById}=relationTab
    if(!(idSource in objLabelById)){ myConsole.error('idSource does not exist',2);  return;}
    if(!(idTarget in objLabelById)){ myConsole.error('idTarget does not exist',2);  return;}
    if(idSource==idTarget) { myConsole.error('idSource==idTarget',2);  return;}

    var flTargetDataDir=inpTargetDataDir.value;
    flTargetDataDir=rtrim(flTargetDataDir, charF)

    var suffixFilterFirstT2T=inpFilterFirstT2T.value;
    var rT={idSource, idTarget, flTargetDataDir, suffixFilterFirstT2T};
    extend(rowDataLoc,rT)
    if(boUpd) { 
      //relationTab.myEdit(elR, rowDataLoc);
    } else {
      rowDataLoc.boSelected=relationTab.nRows()==0;
      rowDataLoc.ind=relationTab.getHighestProp('ind')+1;
      [elR]=relationTab.reserveRows();
    }
    //RelationRow.mySetDomRow.call(elR, rowDataLoc);
    elR.mySetDomRow(rowDataLoc);
    //viewFront.clearUI();
    var [err]=await relationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    historyBack();
  }
  el.setUp=function(){
    var OptS=[], OptT=[],  {objLabelById}=relationTab, {idSource, idTarget}=rowDataLoc;
      // Add entries representing non-existing keys
    if(!(idSource in objLabelById)){ var optTmp=createElement('option').myText('---').prop('value', idSource);   OptS.push(optTmp); }
    if(!(idTarget in objLabelById)){ var optTmp=createElement('option').myText('---').prop('value', idTarget);   OptT.push(optTmp); }
      // Add entries for existing keys
    for(var k in objLabelById){
      var label=objLabelById[k]
      var optTmp=createElement('option').myText(label).prop('value',k);
      OptS.push(optTmp.cloneNode(true));   OptT.push(optTmp.cloneNode(true));
    }
    selIdSource.myAppend(...OptS);  selIdTarget.myAppend(...OptT);

    selIdSource.value=rowDataLoc.idSource;
    selIdTarget.value=rowDataLoc.idTarget;
    inpTargetDataDir.value=rowDataLoc.flTargetDataDir
    inpFilterFirstT2T.value=rowDataLoc.suffixFilterFirstT2T
    selIdSource.focus();
    myConsole.clear();
    //divConsoleContainer.myAppend(divConsole)
    return true;
  }
  el.openFunc=function(boUpdT){
    boUpd=boUpdT;
    if(this==null){rowDataLoc=extend({},RelationRow.propDefaultWInd);}
    else{
      elR=this.parentNode.parentNode;
      //rowDataLoc=elR.rowData;
      //rowDataLoc=extend({},elR.rowData);
      rowDataLoc=extend({},elR.dataset);
    }
    doHistPush({strView:'relationSetPop'});
    el.setVis();
    el.setUp();
  }
  el.setVis=function(){ el.show(); return 1; }
  
  var boUpd, elR, rowDataLoc; 

  var labIdSource=createElement('div').myAppend('Source'); //.prop({title:'IdSource.'});
  var labIdTarget=createElement('div').myAppend('Target'); //.prop({title:'IdTarget.'});
  var labTargetDataDir=createElement('div').myAppend('flTargetDataDir').prop({title:StrHeaderTitle.flTargetDataDir});
  var labFilterFirstT2T=createElement('div').myAppend('suffixFilterFirstT2T').prop({title:StrHeaderTitle.suffixFilterFirstT2T});

  //var inpKeySource=createElement('input').prop('type', 'text');
  //var inpKeyTarget=createElement('input').prop('type', 'text');
  var selIdSource=createElement('select');
  var selIdTarget=createElement('select');
  var inpTargetDataDir=createElement('input').prop('type', 'text');
  var inpFilterFirstT2T=createElement('input').prop('type', 'text');
  //var inpIncIdS=createElement('input').prop('type', 'checkbox');
  //var inpIncIdT=createElement('input').prop('type', 'checkbox');


  var Lab=[labIdSource, labIdTarget, labTargetDataDir, labFilterFirstT2T]; //, labIncIdS, labIncIdT
  var Inp=[selIdSource, selIdTarget, inpTargetDataDir, inpFilterFirstT2T]; //, inpIncIdS, inpIncIdT
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
  [inpTargetDataDir].forEach(ele=>ele.css({'margin-left':'0em', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, 'input[type=text]').forEach(ele=>ele.css({display:'block', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, ':not(input[type=text])').forEach(ele=>ele.css({'margin-left':'0.5em'}))
  el.addClass("Center-Container").myAppend(blanket, centerDiv).css({'z-index':2}); 
    
  return el;
}


gThis.relationDeletePopExtend=function(el){
  el.toString=function(){return 'relationDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',async function(){   
    relationTab.myRemove(elR);
    //viewFront.clearUI();
    var [err]=await relationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    historyBack();
  });
  el.openFunc=function(){
    elR=this.parentNode.parentNode;
    var {idSource, idTarget}=elR.dataset;
    spanLabel.myText(relationTab.objLabelById[idSource]+' - '+relationTab.objLabelById[idTarget]);
    doHistPush({strView:'relationDeletePop'});
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
  var spanLabel=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanLabel);
  var buttonBack=createElement('button').myText("Cancel").on('click',historyBack).css({'margin-top':'1em'});

  var blanket=createElement('div').addClass("blanket");
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});
  var centerDiv=createElement('div').addClass("Center").myAppend(head,p, buttonBack, butOK).css({'min-width':'17em','max-width':'25em', padding:'0.5em'});  //divConsoleContainer 
  el.addClass("Center-Container").myAppend(blanket, centerDiv); 
  
  return el;
}



  //idSource, idTarget, labelSource, labelTarget, flTargetDataDir, suffixFilterFirstT2T
gThis.relationTabExtend=function(el){
  el.toString=function(){return 'relationTab';}
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
      var objOpt=elR.getTypedData();
      ObjOpt[i]=objOpt
    } 
    ObjOpt.sort((a,b)=>{return a.ind-b.ind;})
    var [err]=await myStorage.setItem('ObjOptRelation',ObjOpt); if(err) {debugger; return [err];}
    //viewFront.clearUI();
    if(boRefreshUI) document.dispatchEvent(eventObjOptNonStatisticDataChanged);
    return [null]
  }
  el.setIndToCurrentOrder=function(){
    for(var i=0;i<tBody.childElementCount;i++) {
      var elR=tBody.children[i];
      elR.dataset.ind=i
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
      if(RowCache.length) {elR=RowCache.pop();} else {  elR=RelationRow.factory(); } 
      tBody.append(elR); RowAdd[i]=elR;
    }
    return RowAdd
  }
  el.getDataFrFile=async function(){
    var [err, ObjOptRelation]=await myStorage.getItem('ObjOptRelation');  if(err) {debugger; return [err];}
    if(!Array.isArray(ObjOptRelation))  ObjOptRelation=[];
    var [boUnique]=checkPropIsUniqueAmongArrayEntries(ObjOptRelation, 'ind'); if(!boUnique) return [Error('ind is not unique')]
    ObjOptRelation.sort((a,b)=>{return a.ind-b.ind;})

    var iSelected=NaN;
    for(var i=0;i<ObjOptRelation.length;i++){ // Note! objOpt points into cache, so write with care
      var objOpt=ObjOptRelation[i];
      if(objOpt.boSelected && !isNaN(iSelected)) return [Error('multiple-rows-selected')]
      if(objOpt.boSelected) {iSelected=i; }

      objOpt.flTargetDataDir=rtrim(objOpt.flTargetDataDir, charF)

      for(var k in objOpt) {  // Delete properties not in KeyPropWInd
        if(RelationRow.KeyPropWInd.indexOf(k)==-1) delete objOpt[k];
      }
      for(var k in RelationRow.propDefaultWInd){
        if(typeof objOpt[k]==='undefined') objOpt[k]=RelationRow.propDefaultWInd[k]
      }
    }
    if(isNaN(iSelected)) return [Error('no-argument-selected')]

    var [err, ObjOptLocation]=await myStorage.getItem('ObjOptLocation');  if(err) {debugger; return [err];}
    if(!Array.isArray(ObjOptLocation))  ObjOptLocation=[];

    el.objLabelById={};
    for(var i=0;i<ObjOptLocation.length;i++){
      var o=ObjOptLocation[i]; el.objLabelById[o.id]=o.label; //el.Id=[];  el.Id.push(o.id);
    }  
    return [null, ObjOptRelation, iSelected]
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
      //var objOptT=extend({}, RelationRow.propDefaultWInd)
      //extend(objOptT, ObjOpt[i]);
      var elR=tBody.children[i];
      elR.mySetDomRow(ObjOpt[i]);
    }

    divTopContainer.myAppend(divTop)
    myConsole.clear();
    return [null]
  }
  el.nRows=function(){return tBody.childElementCount}
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.dataset.boSelected=="true") return [null, row];}
  //   return [Error('No row selected!?!?')]
  // }
  
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
  el.setTLastSync=async function(){
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
  el.getHighestProp=function(key){
    var vHighest=-1, Row=[...tBody.children];
    Row.forEach(function(rowA){
      var v=Number(rowA.dataset[key])
      if(v>vHighest) vHighest=v;
    })
    return vHighest
  }
  el.checkIfSortOrderHasChangedW=function(){
    var boChanged=el.checkIfSortOrderHasChanged();
    //buttonSaveSortOrder.enable(boChanged)
    buttonSaveSortOrder.toggle(boChanged)
  }
  el.getLeafDb=function(){

  }
  var RowCache=[];


    // Table
  var tBody=createElement('tbody');
  el.table=createElement('table').myAppend(tBody).addClass('tableSticky', 'tableInset').css({'word-break':'break-all'});
  

  var trHead=createElement('tr');
  var tHead=createElement('thead').myAppend(trHead);
  tHead.css({background:'var(--bg-color)', width:'inherit', opacity:0.8});  
  el.table.prepend(tHead);
  trHead.on('click', el.checkIfSortOrderHasChangedW)

  var BoAscDefault={}, Label={boSelected:'Selected'}, Th=[];
  var Title=extend({}, StrHeaderTitle)
  for(var strName of RelationRow.KeyPropWInd){ 
    var boAscDefault=BoAscDefault[strName]??true;
    var label=Label[strName]??strName; //ucfirst
    var title=Title[strName]??strName;
    var h=createElement('th').addClass('unselectable').prop('boAscDefault',boAscDefault).attr('name',strName).myText(label); 
    if(title) h.attr('title',title)
    Th.push(h);
  }
  trHead.myAppend(...Th).addClass('listHead');
  headExtend(trHead, tBody);
  trHead.myAppend(createElement('th'), createElement('th'), createElement('th'))


      // menuA
  var buttonBack=createElement('button').myText(charBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack);
  var buttonAdd=createElement('button').myText('Add').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',function(){
    relationSetPop.openFunc.call(null,0);
  });
  var buttonSaveSortOrder=createElement('button').myText('Save sort order').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em', background:'var(--bg-red)'}).on('click',async function(){
    relationTab.setIndToCurrentOrder()
    var [err]=await relationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    this.hide()
  }).hide();
  //var spanSpace=createElement('span').css({flex:'0 1 auto'})
  var spanLabel=createElement('span').myText('RelationTab'); //.css({'float':'right',margin:'0.2em 0 0 0'});  
  //var menuA=createElement('div').myAppend(buttonAdd,spanLabel).css({padding:'0 0.3em 0 0',overflow:'hidden','max-width':menuMaxWidth,'text-align':'left',margin:'.3em auto .4em'}); //buttonBack,

  //var divTopContainer=createElement('div').myText(fsDataHome).css({'margin-left':'0.4em'});
  var divTopContainer=createElement('div').css({'text-align':'center'});
  el.addClass('relationTab');

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

