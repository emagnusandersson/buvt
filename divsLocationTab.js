

"use strict"


gThis.LocationTdInd={  
  mySetVal:function(ind){   },
  factory:function(){
    var spanDrag=createElement('span').attr('name', 'spanDrag').myText('⣿').css({ 'font-size':'1.8em', 'color':'var(--text-grey)', 'cursor':'pointer', 'text-align':'center', 'width':'1.3em', display:'inline-block'});
    spanDrag.on(strStartEv, locationTab.table.myMousedown);
    var td=createElement('td').myAppend(spanDrag); copySome(td, LocationTdInd, ['mySetVal']); 
    return td;
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
gThis.LocationTdTLastSync={    // Class object
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
    //var b=createElement('button').myHtml('&nbsp;').on('click', LocationTdTLastSync.setTLastSync);
    var b=createElement('span').myHtml('&nbsp;'); //.on('click', LocationTdTLastSync.setTLastSync);
    var td=createElement('td').myAppend(b);  copySome(td, LocationTdTLastSync, ['mySetVal']);  return td;
  }
}
gThis.LocationTdTLastCheck={    // Class object
  mySetVal:methSetTButton,
  setTLastCheck:async function(){ // this will refer to the button
    var td=this.parentNode, elR=td.parentNode;
    var strMess=`Setting tLastCheck (to current time)?`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) { return}
    var  [err]=await elR.setTLastCheck(); if(err) {myConsole.error(err); debugger; return;};
    this.myText('0').prop({title:'0 s ago'})
  },
  factory:function(){ 
    //var b=createElement('button').myHtml('&nbsp;').on('click', LocationTdTLastCheck.setTLastCheck);
    var b=createElement('span').myHtml('&nbsp;');
    var td=createElement('td').myAppend(b);  copySome(td, LocationTdTLastCheck, ['mySetVal']);  return td;
  },
  //factoryS:function(){  var td=LocationTdTLastCheck.factory(); td.charSide='S'; return td;},

}

gThis.LocationRow={
  extendClass:function(){
    this.propDefaultWInd=extend({}, this.propDefaultWIdInd);   delete this.propDefaultWInd.id
    
    this.KeyPropWIdInd=Object.keys(this.propDefaultWIdInd)
    this.KeyPropWInd=Object.keys(this.propDefaultWInd)
    this.StrPropType={}
    for(var i=0;i<this.KeyPropWIdInd.length;i++){
      var keyProp=this.KeyPropWIdInd[i]
      this.StrPropType[keyProp]=typeof this.propDefaultWIdInd[keyProp]
    }
  },
  connectStuff:function(){
    var {KeyPropWInd}=this
    var elR=this
    var TDConstructors={
      ind:LocationTdInd.factory,
      //id:LocationTdId.factory,
      tLastSync:LocationTdTLastSync.factory,
      tLastCheck:LocationTdTLastCheck.factory,
    }
    for(var i=0;i<KeyPropWInd.length;i++) { 
      var name=KeyPropWInd[i], td;
      if(name in TDConstructors) { td=TDConstructors[name]();  } 
      else td=createElement('td');
      elR.append(td.attr('name',name));
    }
    var buttEdit=createElement('button').attr('name','buttonEdit').myText('Edit').on('click',function(){
      locationSetPop.openFunc.call(this,1);
    });
    var buttCopy=createElement('button').attr('name','buttonCopy').myText('Copy').on('click',function(){
      locationSetPop.openFunc.call(this,0);
    });
    var buttDelete=createElement('button').attr('name','buttonDelete').css({'margin-right':'0.2em'}).myAppend(charDelete).on('click',locationDeletePop.openFunc);
    var tEdit=createElement('td').myAppend(buttEdit), tCopy=createElement('td').myAppend(buttCopy), tDelete=createElement('td').myAppend(buttDelete);
    elR.on('mouseover', function(ev){this.css({background:'var(--bg-colorEmp)'})})
    elR.on('mouseout', function(ev){this.css({background:''})})

    elR.append(tEdit, tCopy, tDelete);
    return elR;
  },
  mySetDomRow:function(rowData){
    var {KeyPropWInd}=this
    var {id, label, fiDir, strHost, charTRes, charFilterMethod, boAllowsLinks, boAllowsCaseCollision, strCharSet}=rowData; 
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
    var [err]=await locationTab.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  },
  setTLastCheck:async function(){
    this.dataset.tLastCheck=unixNow();
    var [err]=await locationTab.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  },
  getTypedData:function(){
    var {KeyPropWIdInd, StrPropType}=this
    var objO=extend({},this.dataset)
    for(var i=0;i<KeyPropWIdInd.length;i++){
      var strName=KeyPropWIdInd[i], val=objO[strName]
      if(StrPropType[strName]=='string') continue;
      else if(StrPropType[strName]=='number') val=Number(val);
      else if(StrPropType[strName]=='boolean') val=val=="true"
      objO[strName]=val
    }
    return objO
  },
  propDefaultWIdInd:{ind:0, id:0, label:'', fiDir:'', strHost:'', charTRes:'9', tLastSync:0, tLastCheck:0, charFilterMethod:"b", boAllowsLinks:true, boAllowsCaseCollision:true, strCharSet:'ext4'}, 
  factory:function(){
    var el=createElement('tr')
    var Key=Object.keys(LocationRow); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, LocationRow, Key)
    el.connectStuff()
    return el;
  }
}
LocationRow.extendClass();


var strTResEnding=`0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`

var StrHeaderTitle={ind:'Current sortorder', label:'', 
  fiDir:`The location (where the database-files are).\n"fi" means "interpreted" file path (so "~", ".." etc can be used)`,
  strHost:'Host (empty means localhost)\nNote! if the Location is used as source then this must be empty.',
  charTRes:`Timestamp resolution:\n`+strTResEnding, 
  tLastSync:`Time of last sync of db-file`,
  tLastCheck:`Time of last check.`,
  charFilterMethod:`Filter method, how will filtering be done:
    b: ".buvt-filter" (syntax see buvt-documentation)
    r: ".rsync-filter" (interpreted by buvt)
      Only include/exclude-patterns are supported.
    R: ".rsync-filter" (interpreted by rsync)
Note 1: You can compare the filtering methods in Extra>"Compare filtering methods".
Note 2: in T2T-top-level the "suffixFilterFirstT2T"-setting is added to the filter-file-name (so .buvt-filterWHATEVER or .rsync-filterWHATEVER)`,
  boAllowsLinks:`boAllowsLinks: If file system can handle (soft) links.`,
  boAllowsCaseCollision:`boAllowsCaseCollision: If the file system can handle multiple files that only differs in case, such as "A.txt" and "a.txt"`,
  strCharSet:`Character set: What character-set the filesystem can handle:
  ext4: reserved characters: "/"
  ms: reserved characters: ""*/:<>?\\|" (Microsoft (NTFS, exFAT, FAT32 (VFAT)))
Entries containing reserved characters are skipped.`
}
//There you can also compare the output with rsync dry-ryn itself.

gThis.locationSetPopExtend=function(el){
  el.toString=function(){return 'locationSetPop';}
  var save=async function(){ 
    var label=inpLabel.value;
    var fiDir=inpDir.value; //if(fiDir.length==0){ myConsole.log('empty fiDir',2);  return;}
    var strHost=inpHost.value
    fiDir=rtrim(fiDir, charF)

    var charTRes=selTRes.value
    var charFilterMethod=selFilterMethod.value;
    var boAllowsLinks=inpAllowsLinks.checked;
    var boAllowsCaseCollision=inpAllowsCaseCollision.checked;
    var strCharSet=selCharSet.value
    var rT={label, fiDir, strHost, charTRes, charFilterMethod, boAllowsLinks, boAllowsCaseCollision, strCharSet};
    extend(rowDataLoc,rT)
    if(boUpd) { 
      //locationTab.myEdit(elR, rowDataLoc);
    } else {
      rowDataLoc.ind=locationTab.getHighestProp('ind')+1;
      rowDataLoc.id=locationTab.getHighestProp('id')+1;
      [elR]=locationTab.reserveRows();
    }
    //LocationRow.mySetDomRow.call(elR, rowDataLoc);
    elR.mySetDomRow(rowDataLoc);
    //viewFront.clearUI();
    var [err]=await locationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    historyBack();
  }
  el.setUp=function(){
    inpLabel.value=rowDataLoc.label
    inpDir.value=rowDataLoc.fiDir
    inpHost.value=rowDataLoc.strHost
    selTRes.value=rowDataLoc.charTRes
    selFilterMethod.value=rowDataLoc.charFilterMethod
    inpAllowsLinks.checked=rowDataLoc.boAllowsLinks;  //=="true"
    inpAllowsCaseCollision.checked=rowDataLoc.boAllowsCaseCollision; //=="true"
    selCharSet.value=rowDataLoc.strCharSet
    inpLabel.focus();
    myConsole.clear();
    //divConsoleContainer.myAppend(divConsole)
    return true;
  }
  el.openFunc=function(boUpdT){
    boUpd=boUpdT;
    if(this==null){rowDataLoc=extend({},LocationRow.propDefaultWIdInd);}
    else{
      elR=this.parentNode.parentNode;
      //rowDataLoc=elR.rowData;
      //rowDataLoc=extend({},elR.rowData);
      rowDataLoc=extend({},elR.dataset);
    }
    doHistPush({strView:'locationSetPop'});
    el.setVis();
    el.setUp();
  }
  el.setVis=function(){ el.show(); return 1; }
  
  var boUpd, elR, rowDataLoc; 

  //var labId=createElement('div').myAppend('Id').prop({title:``});
  var labLabel=createElement('div').myAppend('Label').prop({title:`Must be unique for each location.`});
  var labDir=createElement('div').myAppend('fiDir').prop({title:StrHeaderTitle.fiDir});
  var labHost=createElement('div').myAppend('Host').prop({title:StrHeaderTitle.strHost});
  var labTRes=createElement('div').myAppend('Time stamp resolution').prop({title:StrHeaderTitle.charTRes});
  var labFilterMethod=createElement('div').myAppend('Filter method').prop({title:StrHeaderTitle.charFilterMethod});
  var labAllowsLinks=createElement('div').myAppend('Allows links').prop({title:StrHeaderTitle.boAllowsLinks});
  var labAllowsCaseCollision=createElement('div').myAppend('Allows case-collisions').prop({title:StrHeaderTitle.boAllowsCaseCollision});
  var labCharSet=createElement('div').myAppend('Character set').prop({title:StrHeaderTitle.strCharSet});

  var inpLabel=createElement('input').prop('type', 'text');
  var inpDir=createElement('input').prop('type', 'text');
  var inpHost=createElement('input').prop('type', 'text');
  var selTRes=createElement('select');
  var selFilterMethod=createElement('select');
  //var inpIncIdS=createElement('input').prop('type', 'checkbox');
  //var inpIncIdT=createElement('input').prop('type', 'checkbox');
  var inpAllowsLinks=createElement('input').prop('type', 'checkbox');
  var inpAllowsCaseCollision=createElement('input').prop('type', 'checkbox');
  var selCharSet=createElement('select');

    // Add options to selTRes
  var Opt=[];
  for(var k of KeyTRes){
    var optTmp=createElement('option').myText(k).prop('value',k);
    Opt.push(optTmp);
  }
  selTRes.myAppend(...Opt);

    // Add options to selFilterMethod
  var Opt=[];
  var Key=["b", "r", "R"];
  for(var k of Key){
    var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt);
  }
  selFilterMethod.empty().myAppend(...Opt);

    // Add options to selCharSet
  var Opt=[];
  var Key=["ext4", "ms"];
  for(var k of Key){
    var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt);
  }
  selCharSet.empty().myAppend(...Opt);

  var Lab=[labLabel, labDir, labHost, labTRes, labFilterMethod, labAllowsLinks, labAllowsCaseCollision, labCharSet]; //, labIncIdS, labIncIdT
  var Inp=[inpLabel, inpDir, inpHost, selTRes, selFilterMethod, inpAllowsLinks, inpAllowsCaseCollision, selCharSet]; //, inpIncIdS, inpIncIdT
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
  [inpDir].forEach(ele=>ele.css({'margin-left':'0em', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, 'input[type=text]').forEach(ele=>ele.css({display:'block', width:'-webkit-fill-available'}))
  //myArrMatches(Inp, ':not(input[type=text])').forEach(ele=>ele.css({'margin-left':'0.5em'}))
  el.addClass("Center-Container").myAppend(blanket, centerDiv).css({'z-index':2}); 
    
  return el;
}


gThis.locationDeletePopExtend=function(el){
  el.toString=function(){return 'locationDeletePop';}
  var butOK=createElement('button').myText('OK').css({'margin-top':'1em'}).on('click',async function(){   
    locationTab.myRemove(elR);
    //viewFront.clearUI();
    var [err]=await locationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    historyBack();
  });
  el.openFunc=function(){
    elR=this.parentNode.parentNode; spanLabel.myText(elR.dataset.label);
    doHistPush({strView:'locationDeletePop'});
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


  //id, label, fiDir, strHost, charTRes, charFilterMethod, boAllowsLinks, boAllowsCaseCollision, strCharSet
gThis.locationTabExtend=function(el){
  el.toString=function(){return 'locationTab';}
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
    var [err]=await myStorage.setItem('ObjOptLocation',ObjOpt); if(err) {debugger; return [err];}
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
    return el; 
  }
  //el.myEdit=function(elR, objRow){ return el; }
  el.reserveRows=function(nAdd=1){
    var RowAdd=Array(nAdd)
    for(var i=0; i<nAdd;i++){
      var elR
      if(RowCache.length) {elR=RowCache.pop();} else {  elR=LocationRow.factory(); } 
      tBody.append(elR); RowAdd[i]=elR;
    }
    return RowAdd
  }
  el.getDataFrFile=async function(){
    var [err, ObjOpt]=await myStorage.getItem('ObjOptLocation');  if(err) {debugger; return [err];}
    if(!Array.isArray(ObjOpt))  ObjOpt=[];
    var [boUnique]=checkPropIsUniqueAmongArrayEntries(ObjOpt, 'ind'); if(!boUnique) return [Error('ind is not unique')]
    ObjOpt.sort((a,b)=>{return a.ind-b.ind;})

    for(var i=0;i<ObjOpt.length;i++){ // Note! objOpt points into cache, so write with care
      var objOpt=ObjOpt[i];
      objOpt.fiDir=rtrim(objOpt.fiDir, charF)

      for(var k in objOpt) {  // Delete properties not in KeyPropWIdInd
        if(LocationRow.KeyPropWIdInd.indexOf(k)==-1) delete objOpt[k];
      }
      for(var k in LocationRow.propDefaultWIdInd){
        if(typeof objOpt[k]==='undefined') objOpt[k]=LocationRow.propDefaultWIdInd[k]
      }
    } 
    var [boUnique]=checkPropIsUniqueAmongArrayEntries(ObjOpt, 'id'); if(!boUnique) return [Error('id is not unique')]
    var [boUnique]=checkPropIsUniqueAmongArrayEntries(ObjOpt, 'label'); if(!boUnique) return [Error('label is not unique')]
    return [null, ObjOpt]
  }
  el.setUpDom=async function(){
    var [err, ObjOpt]=await el.getDataFrFile(); if(err) { return [err]; }

    var nOld=tBody.childElementCount, nNew=ObjOpt.length;
    if(nOld<nNew) el.reserveRows(nNew-nOld);
    else if(nOld>nNew){
      for(var i=nNew; i<nOld;i++){
        var elR=tBody.children[i]; elR.remove(); RowCache.push(elR)
      }
    }
    for(var i=0;i<nNew;i++) {
      //var objOptT=extend({}, LocationRow.propDefaultWIdInd)
      //extend(objOptT, ObjOpt[i]);
      //var objOptT=extend({}, ObjOpt[i]);
      var elR=tBody.children[i];
      elR.mySetDomRow(ObjOpt[i]);
    }

    divTopContainer.myAppend(divTop)
    myConsole.clear();
    return [null]
  }
  el.nRows=function(){return tBody.childElementCount}
  el.getRowFrDomById=function(id){
    var row=undefined, iId=NaN;
    for(var i=0;i<tBody.childElementCount;i++){
      var rowA=tBody.children[i], boMatch=rowA.dataset.id==id
      if(boMatch && !isNaN(iId)) return [Error('id-exists-multiple-times')]
      if(boMatch) {row=rowA; iId=i;}
    }
    if(isNaN(iId)) return [Error('row-not-found')]
    return [null, row, iId];
  }
  el.setTLastSync=async function(id){
    var [err, row, iId]=el.getRowFrDomById(id);  if(err) {debugger; return [err];}
    row.dataset.tLastSync=unixNow();
    var [err]=await el.saveToDisk(); if(err) {debugger; return [err];}
    return [null]
  }
  el.setTLastCheck=async function(id){
    var [err, row, iId]=el.getRowFrDomById(id);  if(err) {debugger; return [err];}
    row.dataset.tLastCheck=unixNow();
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

  var BoAscDefault={}, Label={charTRes:'tRes', strCharSet:'Chacracter set'}, Th=[];
  var Title=extend({}, StrHeaderTitle)
  for(var strName of LocationRow.KeyPropWInd){ 
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
    locationSetPop.openFunc.call(null,0);
  });
  var buttonSaveSortOrder=createElement('button').myText('Save sort order').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em', background:'var(--bg-red)'}).on('click',async function(){
    locationTab.setIndToCurrentOrder()
    var [err]=await locationTab.saveToDisk(true); if(err){myConsole.error(err); return};
    this.hide()
  }).hide();
  //var spanSpace=createElement('span').css({flex:'0 1 auto'})
  var spanLabel=createElement('span').myText('LocationTab'); //.css({'float':'right',margin:'0.2em 0 0 0'});  
  //var menuA=createElement('div').myAppend(buttonAdd,spanLabel).css({padding:'0 0.3em 0 0',overflow:'hidden','max-width':menuMaxWidth,'text-align':'left',margin:'.3em auto .4em'}); //buttonBack,

  //var divTopContainer=createElement('div').myText(fsDataHome).css({'margin-left':'0.4em'});
  var divTopContainer=createElement('div').css({'text-align':'center'});
  el.addClass('locationTab');

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

