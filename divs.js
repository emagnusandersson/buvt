
"use strict"

gThis.funFilterFirstCheckExistance=async function(result){
  var {fiSourceDir, charFilterMethod, suffixFilterFirstT2T}=result
  if(suffixFilterFirstT2T){
    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirstT2T=leafFilter+suffixFilterFirstT2T
    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var fsFilterFirstT2T=fsSourceDir+charF+leafFilterFirstT2T
    var [err, boExist]=await fileExist(fsFilterFirstT2T); if(err) {debugger; return [err]; }
    if(!boExist) {debugger; return [Error(`${leafFilterFirstT2T} does not exist`)]; }
  }
  return [null]
}

var methGoToTitle=async function(ev){
  ev.preventDefault();
  var [err, fsTmp]=await myRealPath(this.title); if(err) {debugger; myConsole.error(err); return;}
  var arrCommand=[strExec, fsTmp]
  if(strOS=="win32"){
    var strCommand=arrCommand.join(' ');
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; myConsole.error(err); return;}
  }else{
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; myConsole.error(stdErr); return;}
  }
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
  el.setUIBasedOnSetting=async function(){
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') { var label='(no-argument-selected)'; }
      else {debugger; myConsole.error(err); return;}
    }
    else { var {label, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charFilterMethod, suffixFilterFirstT2T, boRemoteTarget, boAllowLinks, boAllowCaseCollision, strTargetCharSet}=result; }
    argumentButton.myText(`⚙ (${label})`) //+' ◂'
    if(err) return
    
    
      // Set Source-folder links
    linkS.prop({title:fiSourceDir})
      // Set Target-folder links
    var strTargetDbDir=boRemoteTarget?`${strHostTarget}:${fiTargetDbDir}`:fiTargetDbDir
    var strTargetDataDir=boRemoteTarget?`${strHostTarget}:${flTargetDataDir}`:flTargetDataDir
    linkTDb.prop({title:strTargetDbDir}).toggleClass('disabled', boRemoteTarget); 
    linkT.prop({title:strTargetDataDir}).toggleClass('disabled', boRemoteTarget);
    linkT.toggle(flTargetDataDir)

    
  }
  el.setButTab=function(strView){
    ButTab.forEach(b=>b.css({background:'var(--bg-color)'}))
    var Views=[viewFront, viewCheck, viewExtra, argumentTab]; //, viewCollision
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
  var butCollision=createElement('button').myAppend('Collisions').on('click',  function(){
    doHistPush({strView:'viewCollision'});
    viewCollision.setVis();
  });
  var butExtra=createElement('button').myAppend('Extra').on('click',  function(){
    doHistPush({strView:'viewExtra'});
    viewExtra.setVis();
  });

  var linkS=createElement('a').myAppend('S').prop({href:''}).on('click', methGoToTitle);
  var linkTDb=createElement('a').myAppend('TDb').prop({href:''}).on('click', methGoToTitle);
  var linkT=createElement('a').myAppend('TData').prop({href:''}).on('click', methGoToTitle);


  var linkAppFolder=createElement('a').myAppend('App-data folder').prop({href:'', title:fsDataHome}).on('click',  methGoToTitle); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'

  var linkResultFolder=createElement('a').myAppend('Result folder').prop({href:'', title:fsResultFolder}).on('click', methGoToTitle); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'


  var uWiki='https://emagnusandersson.com/buvt'
  var linkWiki=createElement('a').prop({href:uWiki}).myText('Web info').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uWiki); }); //.css({'margin-left':'0.4em', 'text-align':'center'})

  var uNotation='https://emagnusandersson.com/Buvt_Notations'
  var linkNotation=createElement('a').prop({href:uNotation}).myText('Notations').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uNotation); });

  var selectorOfTheme=SelThemeCreate.factory();  setThemeClass(); selectorOfTheme.setValue();
  selectorOfTheme.css({ width:"2.5em", 'vertical-align':'bottom', padding:0})
  
  var ButTab=[butFront, butCheck, butExtra, argumentButton]; //, butCollision
  ButTab.forEach(b=>b.css({'border-bottom':'0px', 'border-top-left-radius':'10px', 'border-top-right-radius':'10px', 'border-bottom-left-radius':'0', 'border-bottom-right-radius':'0'}))


  el.myAppend(...ButTab, ' ', linkAppFolder, ' | ', linkS, ' | ', linkTDb, ' | ', linkT, ' | ', linkWiki, ' | ', linkNotation, ' | ', selectorOfTheme, ' | ', butClear);  //, imgBusy  .addClass('footDiv') , settingButton, , divNotations, ' | ', linkDb
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
 *   viewFrontCreator
 **********************************************/
gThis.viewFrontCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewFront';}
  

  el.setUp=async function(){
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    //divFoot.myAppend(myConfirmer)
    elConsoleContainerTop.clear().myAppend(divFoot);
    await el.setUIBasedOnSetting()
  }
  el.setBottomMargin=function(hNew){
    var hTmp=hNew+3
    // divCollisionS.css({'margin-bottom':hTmp+'px'})
    // divCollisionT.css({'margin-bottom':hTmp+'px'})

    //divDbWrite.css({'margin-bottom':hTmp+'px'})
    divMid.css({'padding-bottom':hTmp+'px'})
  }
  el.clearUI=function(){ 
    divT2DBoth.clearVal();  el.divT2TUsingHash.clearVal();
    //divT2DS.clearVal(); divT2DT.clearVal();  el.divT2TUsingHash.clearVal();
    //miniViewSMMatchS.clearUI(); miniViewHashMatchS.clearUI(); miniViewSMMatchT.clearUI(); miniViewHashMatchT.clearUI()
    //el.divExtraTargetF.myText('')
    //divCollisionSMW.clearUI();  //divCollisionSMW.divExtraTargetF.myText('');
    //divCollisionHashW.clearUI(); //divCollisionHashW.divExtraTargetF.myText('')
  }
  el.setUIBasedOnSetting=async function(){
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') { var label='(no-argument-selected)'; }
      else {debugger; myConsole.error(err); return;}
      return
    }
    else { var {label, fiSourceDir, strHostTarget, fiTargetDbDir, charFilterMethod, suffixFilterFirstT2T, boRemoteTarget, boAllowLinks, boAllowCaseCollision, strTargetCharSet}=result; }
    //divCollisionSMW.setUp(result)
    divT2DBoth.setUIBasedOnSetting(result)
    //divT2DS.setUIBasedOnSetting(result);  divT2DT.setUIBasedOnSetting(result)
    


      // Set T2T-filter links
    var leafFilter=LeafFilter[charFilterMethod];
    var leafFilterFirstT2T=leafFilter+suffixFilterFirstT2T
    var title=fiSourceDir+charF+leafFilterFirstT2T; el.divT2TUsingHash.linkFilterFirstT2T.prop({title}).myText(leafFilterFirstT2T).toggleClass('disabled', suffixFilterFirstT2T=='');

  }



  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  var divT2DBoth=divT2DBothCreator(createElement('div'))
  //var divT2DS=divT2DCreator(createElement('div'), 'S');   divT2DT=divT2DCreator(createElement('div'), 'T')
  //gThis.divT2T=divT2TCreator(createElement('div'))
  el.divT2TUsingHash=divT2TUsingHashCreator(createElement('div'))
  el.divT2TUsingHash.css({width:'min-content'}).css({'grid-area':'1/3/span 4/span 1'})



  //gThis.divMid=
  var divMid=createElement('div').myAppend(divT2DBoth, el.divT2TUsingHash).css({display:'grid', 'grid-template-columns':'1fr auto', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'0 0 auto', 'overflow-y':'auto'}); // , divCollisionSMW, 'grid-template-rows':'auto auto'
  //.css({display:'flex', 'column-gap':'3px','margin-top':'3px', flex:'1 1 auto', overflow:'scroll'}).addClass('unselectable')
  //, divExtra, divCollisionS, divCollisionT
  el.clearUI()
  
  
  el.myAppend(divTopContainer, divMid); //, divConsoleContainer

    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'});

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%", 'justify-content':'space-between'});
  return el
}




/***********************************************
 *   viewCheckCreator
 **********************************************/
gThis.viewCheckCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewCheck';}

  el.setUp=async function(){
    resetMess()
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    //divFoot.myAppend(myConfirmer)
    elConsoleContainerTop.clear().myAppend(divFoot)
    
  }
  el.setBottomMargin=function(hNew){
    divMid.css({'margin-bottom':hNew+'px'})
  }

  var leafTmp=PathS.hl.leaf;
  var butHardLinkCheck=createElement('button').myAppend('Check for hard links').attr({'title':`Check source tree for hard links. (Note: all functions relying on the absence of hard links also checks for hard links) \nFound hard links are written to ${leafTmp} in the result folder.`}).on('click',  async function(){
    myConsole.clear(); setMess('Hard link check ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS, charFilterMethod}=result,  leafFilter=LeafFilter[charFilterMethod];
    var arg=extend({}, {leafFilter, fiSourceDir, charTRes:charTResS, charFilterMethod})
    var [err]=await hardLinkCheck(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess('Hard link check: Done'); blanket.hide();
  });
  

  //
  // Checking
  //
  var inpIStart=createElement('input').prop({type:'number', min:0}).attr('value',0).css({width:'11ch'}).prop({title:'iStart, (Start checking from this row (Skipping those above this line)).'});
  var butCheckViaPythonS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); setMess('CheckS ...'); blanket.show();
    //viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS}=result
    var arg=extend({}, {fiDbDir:fiSourceDir, iStart:Number(inpIStart.value), myConsole, charTRes:charTResS})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    var [err]=await argumentTab.setTLastCheck('S'); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
  });
  var butCheckViaPythonT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); setMess('CheckT ...'); blanket.show();
    //viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {strHostTarget:strHost, fiTargetDbDir, charTResT}=result
    var arg=extend({}, {fiDbDir:fiTargetDbDir, iStart:Number(inpIStart.value), myConsole, charTRes:charTResT, strHost})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    var [err]=await argumentTab.setTLastCheck('T'); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
  });


  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  


  var hCheckFileExistance=createElement('b').myText('Check file existance').prop({title:`Going through all the files in db-file and check that they exist.`})
  //var divCheckFileExistance=createElement('div').myAppend(hCheckFileExistance, butCheckSummarizeMissingS, butCheckSummarizeMissingT).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})

  var hCheckHash=createElement('b').myText('Check hash codes').prop({title:`Going through all the files in db-file and check the hashcode.
REMEMBER to "sync" the db first. Otherwise changed/missing files will be reported an errors.`}); //(such as running main>T2D>sync)
  var spanIStart=createElement('span').myText('iStart:').attr({'title':'Start on this row of the db-file'}).css({'margin-left':'0.6em'})
  inpIStart.css({'margin-left':'0.6em'})
  var divHeadCheckHash=createElement('div').myAppend(hCheckHash, spanIStart, inpIStart).css({display:'flex', 'align-items':'center'})

  el.boCheckCancel=false
  el.butCheckCancel=createElement('button').myText('Cancel').on('click', function(ev){el.boCheckCancel=true}).hide()
  var divCheckHash=createElement('div').myAppend(divHeadCheckHash, butCheckViaPythonS, butCheckViaPythonT, el.butCheckCancel).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'}) //, butCheckS, butCheckT
  

  // var butSetLastCheck=createElement('button').myText("Set tLastCheck").prop({title:'Storing the (check-) timepoint (instead of writing on the usb-drive when it was last checked)'}).on('click',async function(){
  //   var strMess=`Setting tLastCheck?\nWritten to:\n ${fsMyStorage}`;
  //   var boOK=await myConfirmer.confirm(strMess);
  //   if(!boOK) { return}
  //   var [err]=await argumentTab.setTLastCheck(); if(err) {debugger; myConsole.error(err); return;}
  // });

  var divMid=createElement('div').myAppend(divCheckHash).css({display:'flex', 'column-gap':'3px', 'justify-content':'space-between', margin:'3px 0', 'align-items':'stretch'}); //, butHardLinkCheck, butSetLastCheck  , divCheckFileExistance
  var divMidW=createElement('div').myAppend(divMid).css({'overflow-y':'auto'})
  
    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});

  
  el.myAppend(divTopContainer, divMidW); // divConsoleContainer


  //el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%"});
  return el
}




/***********************************************
 *   viewExtraCreator
 **********************************************/


gThis.miniViewFilterMethodTesterCreator=function(el){
  el.setUp=async function(){
    resetMess()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {suffixFilterFirstT2T}=result; 
    spanCheckBox.myText(` Use ".buvt-filter${suffixFilterFirstT2T}" / ".rsync-filter${suffixFilterFirstT2T}" as the top-level filter file.`)
    labCheckBox.toggle(suffixFilterFirstT2T)
  }

  var checkBox=createElement('input').prop({type:'checkbox'}); //.attr({'title':`Use the top-level filter-file with suffixFilterFirstT2T added`});
  var spanCheckBox=createElement('span');
  var labCheckBox=createElement('label').myAppend(checkBox, spanCheckBox)

  var htmlHead=`
<tr><th colspan=2>.buvt-filter</th> <th colspan=2>.rsync-filter</th> <th colspan=2>.rsync-filter (using rsync dry-run)</th></tr>`

  var htmlBody=`
<tr><td colspan=2><button>Parse</button></td><td colspan=2><button>Parse</button></td><td colspan=2><button>Parse</button></td></tr>
<tr><td colspan=2><a href="">List</a></td><td colspan=2><a href="">List</a></td><td colspan=2><a href="">List</a></td></tr>
<tr><td colspan=3><button>Compare</button></td><td colspan=3><button>Compare</button></td></tr>
<tr><td colspan=3><span></span></td><td colspan=3><span></span></td></tr>`
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('other').css({'text-align':'center'});


  var [tHeadR]=tHead.children
  var [th_b, th_r, th_R]=tHeadR.children;
  // th_b.attr({'title':`Parse using .buvt-filter`});
  // th_r.attr({'title':`Parse (with buvt) using .rsync-filter`});
  // th_R.attr({'title':`Parse (with rsync) using .rsync-filter`});

  var arrTR=[...tBody.children]
  var [trParse, trList, trMeld, trDiff]=arrTR; //trMat1, 

  
  var [butParse_b, butParse_r, butParse_R]=trParse.querySelectorAll('button')
  var [aParse_b, aParse_r, aParse_R]=trList.querySelectorAll('a')
  var [butCompare0, butCompare1]=trMeld.querySelectorAll('button')
  var [spanCompare0, spanCompare1]=trDiff.querySelectorAll('span')

  var ButParse={b:butParse_b, r:butParse_r, R:butParse_R}
  var AParse={b:aParse_b, r:aParse_r, R:aParse_R}


  var funParseTmp=async function(charFilterMethodLoc){
    var boAddSuffix=checkBox.checked
    myConsole.clear(); setMess(`${charFilterMethodLoc} Parseing ...`); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS, suffixFilterFirstT2T}=result, leafFilter=LeafFilter[charFilterMethodLoc], leafFilterFirst=leafFilter
    if(boAddSuffix) leafFilterFirst+=suffixFilterFirstT2T
    var arg=extend({}, {leafFilter, leafFilterFirst, fiSourceDir, charTRes:charTResS, charFilterMethod:charFilterMethodLoc})
    var [err, result]=await parseNDump(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {nFile, StrShortList}=result
    AParse[charFilterMethodLoc].prop({title:StrShortList?.join(`\n`)}).myText(`List (${nFile})`)
    setMess(`${charFilterMethodLoc} Parseing: Done`); blanket.hide();
  }
  var title=`The result is written to the file below.`; //.attr({title})
  butParse_b.on('click',  async function(){funParseTmp('b');});
  butParse_r.on('click',  async function(){funParseTmp('r');});
  butParse_R.on('click',  async function(){funParseTmp('R');});
  var pathTmp=PathParseNDump.b; aParse_b.prop({href:''}).on('click', makeOpenExtCB(pathTmp))
  var pathTmp=PathParseNDump.r; aParse_r.prop({href:''}).on('click', makeOpenExtCB(pathTmp))
  var pathTmp=PathParseNDump.R; aParse_R.prop({href:''}).on('click', makeOpenExtCB(pathTmp))


  var funCompareTmp=async function(strMA, strMB){  // M=Method
    var strExec='meld'
    var strA=PathParseNDump[strMA].fsName, strB=PathParseNDump[strMB].fsName
    var arrCommand=[strExec, strA, strB]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; myConsole.error(err); return;}
    }else{
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; myConsole.error(stdErr); return;}
    } 
  }

  //var leafb=LeafResultFile.ParseNDump_b, leafr=LeafResultFile.ParseNDump_r, leafR=LeafResultFile.ParseNDump_R
  var leafb=PathParseNDump.b.leaf, leafr=PathParseNDump.r.leaf, leafR=PathParseNDump.R.leaf
  butCompare0.prop('title',`Open in Meld: ${leafb} and  ${leafr}`).on('click',  async function(ev){ ev.preventDefault(); funCompareTmp('b','r'); })
  butCompare1.prop('title',`Open in Meld: ${leafr} and  ${leafR}`).on('click',  async function(ev){ ev.preventDefault(); funCompareTmp('r','R') })
  spanCompare0.myAppend(`diff ${leafb} ${leafr}`).css({border:'1px solid'}) // .on('click', cbClick)
  spanCompare1.myAppend(`diff ${leafr} ${leafR}`).css({border:'1px solid'}); //.on('click', cbClick)


  // var divParse=createElement('div').myAppend(butParse_b, butParse_r, butParse_R).css({display:'flex', 'align-items':'center', 'justify-content':'space-evenly', background:"var(--bg-color)", flex:'1 1'})
  // var divLink=createElement('div').myAppend(aParse_b, aParse_r, aParse_R).css({display:'flex', 'align-items':'center', 'justify-content':'space-evenly', background:"var(--bg-color)", flex:'1 1'})
  // var divCompare=createElement('div').myAppend(butCompare0, butCompare1).css({display:'flex', 'align-items':'center', 'justify-content':'space-evenly', background:"var(--bg-color)", flex:'1 1'})
  // var divCompareB=createElement('div').myAppend(spanCompare0, spanCompare1).css({display:'flex', 'align-items':'center', 'justify-content':'space-evenly', background:"var(--bg-color)", flex:'1 1'})

  var headA=createElement('h3').myAppend('Compare filtering methods').css({'text-align':'left'})
  var headB=createElement('h4').myAppend('Parse and dump using...').css({'text-align':'left'})


  //el.myAppend(headA, labCheckBox, headB, divParse, divLink, divCompare, divCompareB).css({display:'flex', 'column-gap':'3px', 'justify-content':'space-between', margin:'3px 0', 'align-items':'stretch', flexDirection:'column', background:"var(--bg-color)"});

  el.myAppend(headA, labCheckBox, headB, table).css({'text-align':'left', background:"var(--bg-color)"}); //
  return el
}



gThis.miniViewEmptyFolderCreator=function(el){
  el.setUp=async function(){
    resetMess();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {suffixFilterFirstT2T, charFilterMethod}=result, leafFilter=LeafFilter[charFilterMethod];

    spanA.myText(`... ${leafFilter} `)
    spanB.myText(`... ${leafFilter+suffixFilterFirstT2T} `)
    ddB.toggle(suffixFilterFirstT2T)
    divResult.myText('')
  }

  var checkBox=createElement('input').prop({type:'checkbox'}); //.attr({'title':`Use the top-level filter-file with suffixFilterFirstT2T added`});
  var spanCheckBox=createElement('span');
  var labCheckBox=createElement('label').myAppend(checkBox, spanCheckBox)

  var funTmp=async function(boAddSuffix){
    //var boAddSuffix=checkBox.checked
    myConsole.clear(); setMess('EmptyFolderCheck ...'); blanket.hide();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS, suffixFilterFirstT2T, charFilterMethod}=result, leafFilter=LeafFilter[charFilterMethod], leafFilterFirst=leafFilter
    if(boAddSuffix) leafFilterFirst+=suffixFilterFirstT2T
    var arg=extend({}, {leafFilter, leafFilterFirst, fiSourceDir, charTRes:charTResS, charFilterMethod})
    var [err, nEmpty, StrShortList]=await listEmptyFolders(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var fun=makeOpenExtCB(PathLoose.emptyFolders)

    var spanLab=createElement('span').myText('Empty folders: ')
    var fsTmp=PathLoose.emptyFolders.fsName
    var aLink=createElement('a').prop({href:''}).myAppend(`${nEmpty}`).prop({title:StrShortList?.join(`\n`)}).on('click',fun);
    
    var divHashMatchResult=createElement('div').myAppend(spanLab, aLink) //, bTotal, ', Mult: '

    divResult.myHtml('').myAppend(divHashMatchResult)

    setMess(`EmptyFolderCheck: Done`); blanket.hide();
  }

  var head=createElement('h3').css({'text-align':'left'}).myAppend('Check for empty folders ...');
  //var lab=createElement('label').myAppend('... Using the top level filter-file: ');
  //var leafTmp=LeafResultFile.emptyFolders
  var leafTmp=PathLoose.emptyFolders.leaf
  var strTitle=`Parse the source tree (filtered by the filterfiles) and find empty folders.`
  var butEmptyFolderCheck=createElement('button').myAppend('Go').attr({title:strTitle}).on('click', function(){ funTmp(0); });
  var butEmptyFolderCheckAddSuffix=createElement('button').myAppend('Go').attr({title:strTitle}).on('click', function(){ funTmp(1); });
  var dt=createElement('dt').myAppend('... Using the top level filter-file: ');
  var spanA=createElement('span'), ddA=createElement('dd').myAppend(spanA, butEmptyFolderCheck);
  var spanB=createElement('span'), ddB=createElement('dd').myAppend(spanB, butEmptyFolderCheckAddSuffix);
  var dl=createElement('dl').myAppend(dt,ddA,ddB); //
  var divResult=createElement('div').css({'text-align':'left'})

  el.myAppend(head, dl, divResult).css({'text-align':'left'}); // divConsoleT2D, divConsoleT2T, divConsole

  el.css({background:"var(--bg-color)"});
  return el
}


gThis.miniViewHashMatchDeleteCreator=function(el, charSide='S', boTab=false){
  //var PathCur=gThis[`Path${charSide}`];
  var butFind=createElement('button').myAppend('Find').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, boRemoteTarget }=result;
    // var boTarget=charSide=='T'
    // var fiDir=boTarget?fiTargetDbDir:fiSourceDir
    // var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    // var arg=extend({}, {fiDir, fiDbDir, charTRes, strHostTarget, boRemoteTarget, charSide})
    var arg=extend({}, {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charTRes, boRemoteTarget, charSide})
    hashMultWorkDelete=new HashMultWorkDelete()
    var [err, result]=await hashMultWorkDelete.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrKeepShort, nPat, nTot}=result

    //var {n, nPatSM, nPatSMMult, nSMMult}=objSM
    aToKeep.myText(`${nPat} (${nTot})`).prop({title:StrKeepShort?.join(`\n`)})
    setMess(strLab+': Done'); blanket.hide();
  });
  var hashMultWorkDelete


  var strHeadA=`Find / Delete duplicates (hash colliders)`;  //, strHeadB=boTab?` (${charSide})`:'', strHead=strHeadA+strHeadB
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
  var butDelete=createElement('button').myText('Delete').on('click', async function(){
    var strLab=`Deleting`
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err]=await hashMultWorkDelete.delete(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(strLab+': Done'); blanket.hide();
  });
  var headB1=createElement('div').css({'text-align':'left'}).myAppend(spanLab, ' ', butDelete)


  el.myAppend(head, headB0, dd0, headB1).css({'text-align':'left'}); // , divSide

  el.css({background:"var(--bg-color)"});
  return el
}




gThis.miniViewReplacePrefixCreator=function(el){
  el.setUp=async function(){
    resetMess();
    inpOldPrefix.value=''
    inpNewPrefix.value=''
  }

  var head=createElement('h3').css({'text-align':'left'}).myAppend('Replace prefix of db-entries');

  var checkBoxUseTarget=createElement('input').prop({type:'checkbox'});
  var labUseTarget=createElement('label').myAppend('Use target-db (using source-db if unchecked)'); //.attr({'title':``});
  var divUseTarget=createElement('div').myAppend(checkBoxUseTarget, labUseTarget)

  var inpDb=createElement('input');
  var labDb=createElement('label').myAppend('Db: '); //.attr({'title':``});
  var divDb=createElement('div').myAppend(labDb, inpDb)
  
  var inpOldPrefix=createElement('input');
  var labOldPrefix=createElement('label').myAppend('Prefix to replace: ').attr({'title':`db-entries that start with this prefix will have it deleted and replaced with the new prefix.`});
  var divOldPrefix=createElement('div').myAppend(labOldPrefix, inpOldPrefix)
  var inpNewPrefix=createElement('input'); //.attr({'title':`Use the top-level filter-file with 
  var labNewPrefix=createElement('label').myAppend('New prefix: ', inpNewPrefix).attr({'title':`New prefix`});
  var divNewPrefix=createElement('div').myAppend(labNewPrefix, inpNewPrefix)

  var butGo=createElement('button').myText('Go').on('click', async function() {
    var boUseTarget=checkBoxUseTarget.checked
    myConsole.clear(); setMess('Replacing prefix ...'); blanket.show()
    var {leafDb, charTRes}=settings
    var strOldPrefix=inpOldPrefix.value, strNewPrefix=inpNewPrefix.value
    //var charTRes=boUseTarget?charTResT:charTResS
    //var fiDir=boUseTarget?fiTargetDbDir:fiSourceDir, fiDb=fiDir+charF+leafDb
    var fiDb=inpDb.value
    var arg={charTRes, fiDb, strOldPrefix, strNewPrefix} //'sync/'
    //var [err]=await utilityAddToDbStrName(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err]=await replacePrefix(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess('Replacing prefix: Done'); blanket.hide();
  })
  
  el.myAppend(head, divDb,    divOldPrefix, divNewPrefix, butGo).css({'text-align':'left'});

  el.css({background:"var(--bg-color)"});
  return el
}


gThis.viewExtraCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewExtra';}

  el.setUp=async function(){
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    elConsoleContainerTop.clear().myAppend(divFoot)

    miniViewFilterMethodTester.setUp()
    miniViewEmptyFolder.setUp()
    await divCollisionHashW.setUp();
  }
  el.setBottomMargin=function(hNew){
    divMid.css({'margin-bottom':hNew+'px'})
  }

  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});

  var miniViewFilterMethodTester=miniViewFilterMethodTesterCreator(createElement('div'))
  var miniViewEmptyFolder=miniViewEmptyFolderCreator(createElement('div'))
  var miniViewHashMatchDelete=miniViewHashMatchDeleteCreator(createElement('div'))
  var miniViewReplacePrefix=miniViewReplacePrefixCreator(createElement('div'))

  var divCollisionHashW=divCollisionHashWCreator(createElement('div'))

  var divMid=createElement('div').myAppend(miniViewFilterMethodTester, miniViewEmptyFolder, miniViewHashMatchDelete, divCollisionHashW)
  .css({display:"flex", gap: "10px", margin:"3px 0px", "flex-direction":"row", "flex-wrap":"wrap"})
  //.css({display:'flex', 'row-gap':'5px', 'justify-content':'space-between', margin:'3px 0', 'align-items':'stretch', flexDirection:'column'}); //, miniViewReplacePrefix
  //var divResult=createElement('div').css({'text-align':'left'})
  var divMidW=createElement('div').myAppend(divMid).css({'overflow-y':'auto'})


  
    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});

  
  el.myAppend(divTopContainer, divMidW); // divConsoleContainer

  //el.css({'text-align':'left', display:"flex","flex-direction":"column", height:"100%", width:"100%"});
  return el
}
