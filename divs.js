
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
  var [err, fsTmp]=await myRealPath(this.title); if(err) {debugger; return [err];}
  var arrCommand=[strExec, fsTmp]
  if(strOS=="win32"){
    var strCommand=arrCommand.join(' ');
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
  }else{
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
  el.mySetLinkNLabel=async function(){
    var boIncIdS=true, boIncIdT=true
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') { var label='(no-argument-selected)'; }
      else {debugger; myConsole.error(err); return;}
    }
    else { var {label, fiSourceDir, fiTargetDir, fiTargetDbDir, charFilterMethod, suffixFilterFirstT2T, strHostTarget, boRemote, boIncIdS, boIncIdT}=result; }
    argumentButton.myText(`⚙ (${label})`) //+' ◂'
    divT2DS.divTabI.toggle(boIncIdS);  divT2DS.divTab.toggle(!boIncIdS)
    divT2DT.divTabI.toggle(boIncIdT);  divT2DT.divTab.toggle(!boIncIdT)
    if(err) return
    

    var {leafDb}=settings

    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    // if(!boRemote){
    //   var [err, fsTargetDir]=await myRealPath(fiTargetDir); if(err) {debugger; return [err];}
    //   var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir); if(err) {debugger; return [err];}
    //   var fsTargetDb=fsTargetDbDir+charF+leafDb
    // }
    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirstT2T=leafFilter+suffixFilterFirstT2T
    
    var strTargetDir=boRemote?`${strHostTarget}:${fiTargetDir}`:fiTargetDir
    var strTargetDbDir=boRemote?`${strHostTarget}:${fiTargetDbDir}`:fiTargetDbDir
      // Set Source-folder links
    linkS.prop({title:fiSourceDir})
      // Set Target-folder links
    linkT.prop({title:strTargetDir}).toggleClass('disabled', boRemote); 
    linkTDb.prop({title:strTargetDbDir}).toggleClass('disabled', boRemote); //.toggle(!boWNonSeparateTargetDb)


      // Set S_- Db link
    var title=fiSourceDir+charF+leafDb;   divT2DS.linkDb.prop({title}).myText(leafDb)
      // Set S_- filter link
    var title=fiSourceDir+charF+leafFilter;   divT2DS.linkFilterFirstT2D.prop({title}).myText(leafFilter)

      // Set T_- Db link
    var title=strTargetDbDir+charF+leafDb;   divT2DT.linkDb.prop({title}).myText(leafDb).toggleClass('disabled', boRemote)
      // Set T_- filter link
    var title=strTargetDbDir+charF+leafFilter;   divT2DT.linkFilterFirstT2D.prop({title}).myText(leafFilter).toggleClass('disabled', boRemote)

      // Set T2T-filter links
    var title=fiSourceDir+charF+leafFilterFirstT2T; divT2TUsingHash.linkFilterFirstT2T.prop({title}).myText(leafFilterFirstT2T).toggleClass('disabled', suffixFilterFirstT2T=='');
  }
  el.setButTab=function(strView){
    ButTab.forEach(b=>b.css({background:'var(--bg-color)'}))
    var Views=[viewFront, viewCheck, viewExperiment, argumentTab];
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
  var butOther=createElement('button').myAppend('Other').on('click',  function(){
    doHistPush({strView:'viewExperiment'});
    viewExperiment.setVis();
  });
  //butOther.toggle(gThis.boExperiment)

  var linkS=createElement('a').myAppend('S').prop({href:''}).on('click', methGoToTitle);
  var linkT=createElement('a').myAppend('T').prop({href:''}).on('click', methGoToTitle);
  var linkTDb=createElement('a').myAppend('TDb').prop({href:''}).on('click', methGoToTitle);


  var linkAppFolder=createElement('a').myAppend('App-data folder').prop({href:'', title:fsDataHome}).on('click',  methGoToTitle); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'

  var linkResultFolder=createElement('a').myAppend('Result folder').prop({href:'', title:fsResultFolder}).on('click', methGoToTitle); //.css({'margin-left':'0.4em'}), title:'Open the folder containing the file lists.'


  var uWiki='https://emagnusandersson.com/buvt'
  var linkWiki=createElement('a').prop({href:uWiki}).myText('Web info').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uWiki); }); //.css({'margin-left':'0.4em', 'text-align':'center'})

  var uNotation='https://emagnusandersson.com/Buvt_Notations'
  var linkNotation=createElement('a').prop({href:uNotation}).myText('Notations').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uNotation); });

  var selectorOfTheme=SelThemeCreate.factory();  setThemeClass(); selectorOfTheme.setValue();
  selectorOfTheme.css({ width:"2.5em", 'vertical-align':'bottom', padding:0})
  
  var ButTab=[butFront, butCheck, butOther, argumentButton]
  ButTab.forEach(b=>b.css({'border-bottom':'0px', 'border-top-left-radius':'10px', 'border-top-right-radius':'10px', 'border-bottom-left-radius':'0', 'border-bottom-right-radius':'0'}))


  el.myAppend(...ButTab, ' ', linkAppFolder, ' | ', linkS, ' | ', linkT, ' | ', linkTDb, ' | ', linkWiki, ' | ', linkNotation, ' | ', selectorOfTheme, ' | ', butClear);  //, imgBusy  .addClass('footDiv') , settingButton, , divNotations, ' | ', linkDb
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
  

  el.setUp=function(){
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    //divFoot.myAppend(myConfirmer)
    elConsoleContainerTop.clear().myAppend(divFoot);
  }
  el.setBottomMargin=function(hNew){
    var hTmp=hNew+3
    divT2DS.css({'margin-bottom':hTmp+'px'})
    divT2DT.css({'margin-bottom':hTmp+'px'})
    //divT2T.css({'margin-bottom':hTmp+'px'});
    divT2TUsingHash.css({'margin-bottom':hTmp+'px'});
    //divMid.css({'margin-bottom':hNew+'px'})
  }
  el.clearColumnDivsResult=function(){ 
    //divT2DS.toggleResult(false); divT2T.toggleResult(false);
    divT2DS.clearVal(); divT2DT.clearVal();  divT2TUsingHash.clearVal(); //divT2T.clearVal();
  }



  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  gThis.divT2DS=divT2DCreator(createElement('div'), 'S')
  gThis.divT2DT=divT2DCreator(createElement('div'), 'T')
  //gThis.divT2T=divT2TCreator(createElement('div'))
  gThis.divT2TUsingHash=divT2TUsingHashCreator(createElement('div'))



  var divMid=createElement('div').myAppend(divT2DS, divT2DT, divT2TUsingHash).css({display:'grid', 'grid-template-columns':'1fr 1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'1 1 auto', 'overflow-y':'auto'}); //.addClass('unselectable')
  //.css({display:'flex', 'column-gap':'3px','margin-top':'3px', flex:'1 1 auto', overflow:'scroll'}).addClass('unselectable')
  //, divT2T   1fr
  el.clearColumnDivsResult()
  // if(boWNonSeparateTargetDb){
  //   divT2DT.hide()
  //   divMid.css({display:'grid', 'grid-template-columns':'1fr 1fr'})
  //   divT2TUsingHash.hide()
  // }
  
  
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
    
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {boRemote}=result;
    //butCheckT.prop({disabled:boRemote})
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
    var arg=extend({}, {fiDir:fiSourceDir, iStart:Number(inpIStart.value), myConsole, charTRes:charTResS})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    await argumentTab.setTLastCheck('S')
  });
  var butCheckViaPythonT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); setMess('CheckT ...'); blanket.show();
    //viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiTargetDir, fiTargetDbDir, charTResT, strHostTarget:strHost, boRemote}=result
    var arg=extend({}, {fiDir:fiTargetDbDir, iStart:Number(inpIStart.value), myConsole, charTRes:charTResT, strHost, boRemote})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    await argumentTab.setTLastCheck('T')
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
 *   viewExperimentCreator
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
<tr><td colspan=2><a href="">list</a></td><td colspan=2><a href="">list</a></td><td colspan=2><a href="">list</a></td></tr>
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


  var funParseTmp=async function(charFilterMethodLoc){
    var boAddSuffix=checkBox.checked
    myConsole.clear(); setMess(`${charFilterMethodLoc} Parseing ...`); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS, suffixFilterFirstT2T}=result, leafFilter=LeafFilter[charFilterMethodLoc], leafFilterFirst=leafFilter
    if(boAddSuffix) leafFilterFirst+=suffixFilterFirstT2T
    var arg=extend({}, {leafFilter, leafFilterFirst, fiSourceDir, charTRes:charTResS, charFilterMethod:charFilterMethodLoc})
    var [err]=await parseNDump(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(`${charFilterMethodLoc} Parseing: Done`); blanket.hide();
  }
  var title=`The result is written to the file below.`
  butParse_b.attr({title}).on('click',  async function(){funParseTmp('b');});
  butParse_r.attr({title}).on('click',  async function(){funParseTmp('r');});
  butParse_R.attr({title}).on('click',  async function(){funParseTmp('R');});
  var pathTmp=PathParseNDump.b; aParse_b.prop({href:'', title:pathTmp.fsName}).on('click', makeOpenExtCB(pathTmp))
  var pathTmp=PathParseNDump.r; aParse_r.prop({href:'', title:pathTmp.fsName}).on('click', makeOpenExtCB(pathTmp))
  var pathTmp=PathParseNDump.R; aParse_R.prop({href:'', title:pathTmp.fsName}).on('click', makeOpenExtCB(pathTmp))


  var funCompareTmp=async function(strMA, strMB){  // M=Method
    var strExec='meld'
    var strA=PathParseNDump[strMA].fsName, strB=PathParseNDump[strMB].fsName
    var arrCommand=[strExec, strA, strB]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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


gThis.miniViewHashMatchCreator=function(el, charSide='S'){
  //var leafTmp=LeafResultFile.T2D_Hash
  var leafTmp=gThis[`Path${charSide}`].hash.leaf
  var butHashMultipleCheck=createElement('button').myAppend('Check for multiple hashcodes').attr({'title':`Go through the db-file and look for recurring hashcodes. \nFound multiples are written to ${leafTmp} in the result folder.`}).on('click',  async function(){
    myConsole.clear(); setMess('Multiple hash check ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, charTResS }=result;
    var arg=extend({}, {fiSourceDir, charTRes:charTResS})
    var [err, objHash]=await hashMultipleCheck(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}

    var PathCur=gThis[`Path${charSide}`]
    var fun=makeOpenExtCB(PathCur.hash)

    var {n, nPatHash, nPatHashMult, nHashMult}=objHash
    var spanLab=createElement('span').myText('Multples: ')
    var spanTotalN=createElement('span').myText(`${n}`).prop({title:'Total number of files '})
    var spanTotalNPat=createElement('span').myText(`${nPatHash}`).prop({title:'Total number of hashcodes'})
    var bTotal=createElement('b').myAppend('Total: ', spanTotalN, '(', spanTotalNPat ,')')
    var spanMultN=createElement('span').myText(`${nHashMult}`).prop({title:'Number non-unique files'})
    var spanMultNPat=createElement('span').myText(`${nPatHashMult}`).prop({title:'Number non-unique hashcodes'})
    //var aMult=createElement('a').prop({href:''}).myAppend(spanMultN,` ( `, spanMultNPat, ` ) `).on('click',fun);
    //var aMult=createElement('a').prop({href:''}).myAppend('patterns: ', spanMultNPat, ', files: ', spanMultN).on('click',fun);
    var fsHash=PathCur.hash.fsName
    var aMult=createElement('a').prop({href:''}).myAppend(`${nHashMult} (${nPatHashMult})`).prop({title:`files (patterns)\n${fsHash}`}).on('click',fun);
    
    var divHashMatchResult=createElement('div').myAppend(spanLab, aMult) //, bTotal, ', Mult: '

    divResult.myHtml('').myAppend(divHashMatchResult)
    setMess('Multiple hash check: Done'); blanket.hide();
  });
  var head=createElement('h3').css({'text-align':'left'}).myAppend('Check for multiple hashcodes')
  var divResult=createElement('div').css({'text-align':'left'})

  //"flex":'1 1 auto'
  //var divHashMultipleCheck=createElement('div').myAppend(butHashMultipleCheck).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})

  
  el.myAppend(head, butHashMultipleCheck, divResult).css({'text-align':'left'}); // divConsoleT2D, divConsoleT2T, divConsole

  el.css({background:"var(--bg-color)"});
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
    var [err, nEmpty]=await listEmptyFolders(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var fun=makeOpenExtCB(PathLoose.emptyFolders)

    var spanLab=createElement('span').myText('Empty folders: ')
    var fsTmp=PathLoose.emptyFolders.fsName
    var aLink=createElement('a').prop({href:''}).myAppend(`${nEmpty}`).prop({title:fsTmp}).on('click',fun);
    
    var divHashMatchResult=createElement('div').myAppend(spanLab, aLink) //, bTotal, ', Mult: '

    divResult.myHtml('').myAppend(divHashMatchResult)

    setMess(`EmptyFolderCheck: Done`); blanket.hide();
  }

  var head=createElement('h3').css({'text-align':'left'}).myAppend('Check for empty folders ...');
  //var lab=createElement('label').myAppend('... Using the top level filter-file: ');
  //var leafTmp=LeafResultFile.emptyFolders
  var leafTmp=PathLoose.emptyFolders.leaf
  var strTitle=`Parse the source tree (filtered by the filterfiles) and find empty folders. \nFound multiples are written to ${leafTmp} in the result folder.`
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
    // var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    // var {fiSourceDir, charTResS, charTResT, fiSourceDir, fiTargetDir, fiTargetDbDir}=result
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



gThis.viewExperimentCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewExperiment';}

  el.setUp=async function(){
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    elConsoleContainerTop.clear().myAppend(divFoot)

    miniViewFilterMethodTester.setUp()
    miniViewEmptyFolder.setUp()
  }
  el.setBottomMargin=function(hNew){
    divMid.css({'margin-bottom':hNew+'px'})
  }

  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});

  var miniViewFilterMethodTester=miniViewFilterMethodTesterCreator(createElement('div'))
  var miniViewHashMatch=miniViewHashMatchCreator(createElement('div'))
  var miniViewEmptyFolder=miniViewEmptyFolderCreator(createElement('div'))
  var miniViewReplacePrefix=miniViewReplacePrefixCreator(createElement('div'))


  var divMid=createElement('div').myAppend(miniViewFilterMethodTester, miniViewHashMatch, miniViewEmptyFolder, miniViewReplacePrefix).css({display:'flex', 'row-gap':'5px', 'justify-content':'space-between', margin:'3px 0', 'align-items':'stretch', flexDirection:'column'}); 
  //var divResult=createElement('div').css({'text-align':'left'})
  var divMidW=createElement('div').myAppend(divMid).css({'overflow-y':'auto'})


  
    // divFoot
  var divFoot=createElement('div').myAppend().addClass('footDiv').css({padding:'0em 0 0em'}); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-around'});

  
  el.myAppend(divTopContainer, divMidW); // divConsoleContainer

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
    var  [err]=await elR.setTLastSync(); if(err) {myConsole.error(err); debugger; return [err]};
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
    var  [err]=await elR.setTLastCheck(charSide); if(err) {myConsole.error(err); debugger; return [err]};
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
    //if(gThis.boAllowRemoteTarget) {extend(this.rDefault,{strHostTarget:""});}
    //else delete this.rDefault.strHostTarget

    //if(gThis.boWNonSeparateTargetDb){delete this.rDefault.fiTargetDbDir}
    //else{extend(this.rDefault,{fiTargetDbDir:""});}
    
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
    var {boSelected, label, fiSourceDir, fiTargetDir, fiTargetDbDir, suffixFilterFirstT2T, charTResS, charTResT, strHostTarget, charFilterMethod, boIncIdS, boIncIdT}=rowData; //, leafFilterFirst, leafDb
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
  rDefault:{ind:0, boSelected:false, label:'', fiSourceDir:'', fiTargetDir:'', fiTargetDbDir:'', suffixFilterFirstT2T:'', charTResS:'9', charTResT:'9', tLastSync:0, tLastCheckS:0, tLastCheckT:0, strHostTarget:'', charFilterMethod:"b", boIncIdS:true, boIncIdT:true}, // , leafFilterFirst:'', leafDb:''
  factory:function(){
    var el=createElement('tr')
    var Key=Object.keys(ArgumentTabRow); Key=AMinusB(Key, ['extendClass', 'factory']); copySome(el, ArgumentTabRow, Key)
    el.connectStuff()
    return el;
  }
}
ArgumentTabRow.extendClass();



var StrHeaderTitle={ind:'Current sortorder', boSelected:'', label:'', 
  fiSourceDir:`The location of the source tree`,
  fiTargetDir:`The location of the target tree`,
  fiTargetDbDir:`The location of the target tree Db`,
  suffixFilterFirstT2T:`Suffix for top-level-filter-file used when comparing source-tree to target-tree.
Explanation:
The default filter-file-names are either ".buvt-filter" or ".rsync-filter", depending on the charFilterMethod-setting.
This setting adds a suffix in the above mentioned case.
The typical usecase is when you want to do multiple backups to drives of different sizes. You may then want filter-files depending on the target. (I know rsync has a more elaborate system, but it is good enough for me.)`,
  charTResS:`Timestamp resolution on the source side:
0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`, 
  charTResT:`Timestamp resolution on the target side:
0-9: number of decimals (on seconds) (The timestamp is rounded downwards)
d: dos time: 2 second resolution. (The timestamp is rounded downwards to closest even second.)`,
   tLastSync:`Time of last sync: is set when T2T>doActions completes.`,
//   tLastSync:`By clicking the button, the current timestamp is stored.
// It is offered for the users convinience.
// (To help you remember when you last synced (typically the target tree).)
// (This piece of data is NOT set automatically, only when you press the button.)`,
  tLastCheckS:`Time of last check on source side.`,
  tLastCheckT:`Time of last check on target side.`,
//   tLastCheck:`By clicking the button, the current timestamp is stored.
// It is offered for the users convinience.
// (To help you remember when you last checked (typically the target tree).)
// (This piece of data is NOT set automatically, only when you press the button.)`,
  strHostTarget:'Host of the target (empty means localhost)',
  charFilterMethod:`Filter method, how will filtering be done:
    b: ".buvt-filter" (syntax see buvt-documentation)
    r: ".rsync-filter" (interpreted by buvt)
      Only include/exclude-patterns are supported.
    R: ".rsync-filter" (interpreted by rsync)
Note 1: You can compare the filtering methods in Other>"Compare filtering methods".
Note 2: in T2T-top-level the "suffixFilterFirstT2T"-setting is added to the filter-file-name (so .buvt-filterWHATEVER or .rsync-filterWHATEVER)`,
  boIncIdS:`Use [id, name, sm] when matching tree to db on the source side. (If unselected [name, sm] are used)`,
  boIncIdT:`Use [id, name, sm] when matching tree to db on the target side. (If unselected [name, sm] are used)`
}
//There you can also compare the output with rsync dry-ryn itself.

gThis.argumentSetPopExtend=function(el){
  el.toString=function(){return 'argumentSetPop';}
  var save=async function(){ 
    var label=inpLabel.value;
    var fiSourceDir=inpSourceDir.value; //if(fiSourceDir.length==0){ myConsole.log('empty fiSourceDir',2);  return;}
    var fiTargetDir=inpTargetDir.value; if(fiTargetDir.length==0){ myConsole.log('empty fiTargetDir',2);  return;}
    var fiTargetDbDir=inpTargetDbDir.value;
    fiSourceDir=rtrim(fiSourceDir, charF)
    fiTargetDir=rtrim(fiTargetDir, charF)
    fiTargetDbDir=rtrim(fiTargetDbDir, charF)

    //var leafFilterFirst=inpFilterFirst.value; 
    var suffixFilterFirstT2T=inpFilterFirstT2T.value;
    //var leafDb=inpDb.value; 
    var charTResS=selTResS.value
    var charTResT=selTResT.value
    var strHostTarget=inpHostTarget.value
    var charFilterMethod=selFilterMethod.value;
    var boIncIdS=inpIncIdS.checked;
    var boIncIdT=inpIncIdT.checked;
    var rT={label, fiSourceDir, fiTargetDir, fiTargetDbDir, suffixFilterFirstT2T, charTResS, charTResT, strHostTarget, charFilterMethod, boIncIdS, boIncIdT}; //, leafFilterFirst, leafDb
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
    inpSourceDir.value=rowDataLoc.fiSourceDir
    inpTargetDir.value=rowDataLoc.fiTargetDir
    inpTargetDbDir.value=rowDataLoc.fiTargetDbDir
    //inpFilterFirst.value=rowDataLoc.leafFilterFirst
    inpFilterFirstT2T.value=rowDataLoc.suffixFilterFirstT2T
    //inpDb.value=rowDataLoc.leafDb
    selTResS.value=rowDataLoc.charTResS
    selTResT.value=rowDataLoc.charTResT
    inpHostTarget.value=rowDataLoc.strHostTarget
    selFilterMethod.value=rowDataLoc.charFilterMethod
    inpIncIdS.checked=rowDataLoc.boIncIdS=="true"
    inpIncIdT.checked=rowDataLoc.boIncIdT=="true"
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


  var labLabel=createElement('label').myAppend('Name').prop({title:'Label (Name) Displayed on the tab.'});
  var labSourceDir=createElement('label').myAppend('fiSourceDir').prop({title:StrHeaderTitle.fiSourceDir});
  var labTargetDir=createElement('label').myAppend('fiTargetDir').prop({title:StrHeaderTitle.fiTargetDir});
  var labTargetDbDir=createElement('label').myAppend('fiTargetDbDir').prop({title:StrHeaderTitle.fiTargetDbDir});
  //var labFilterFirst=createElement('label').myAppend('leafFilterFirst', imgHFilterFirst);
  var labFilterFirstT2T=createElement('label').myAppend('suffixFilterFirstT2T').prop({title:StrHeaderTitle.suffixFilterFirstT2T});
  //var labDb=createElement('label').myAppend('leafDb', imgHDb);
  var labTResS=createElement('label').myAppend('tResS').prop({title:StrHeaderTitle.charTResS});
  var labTResT=createElement('label').myAppend('tResT').prop({title:StrHeaderTitle.charTResT});
  var labHostTarget=createElement('label').myAppend('Target host').prop({title:StrHeaderTitle.strHostTarget});
  var labFilterMethod=createElement('label').myAppend('Filter method').prop({title:StrHeaderTitle.charFilterMethod});
  var labIncIdS=createElement('label').myAppend('Inc Id (S)').prop({title:StrHeaderTitle.boIncIdS});
  var labIncIdT=createElement('label').myAppend('Inc Id (T)').prop({title:StrHeaderTitle.boIncIdT});
  var inpLabel=createElement('input').prop('type', 'text');
  var inpSourceDir=createElement('input').prop('type', 'text');
  var inpTargetDir=createElement('input').prop('type', 'text');
  var inpTargetDbDir=createElement('input').prop('type', 'text');
  //var inpFilterFirst=createElement('input').prop('type', 'text');
  var inpFilterFirstT2T=createElement('input').prop('type', 'text');
  //var inpDb=createElement('input').prop('type', 'text');
  var selTResS=createElement('select');
  var selTResT=createElement('select');
  var inpHostTarget=createElement('input').prop('type', 'text');
  var selFilterMethod=createElement('select');
  var inpIncIdS=createElement('input').prop('type', 'checkbox');
  var inpIncIdT=createElement('input').prop('type', 'checkbox');

    // Add options to selTResS and selTResT
  var OptS=[], OptT=[]
  for(var k of KeyTRes){
    var optS=createElement('option').myText(k).prop('value',k); OptS.push(optS);
    var optT=createElement('option').myText(k).prop('value',k); OptT.push(optT);
  }
  selTResS.empty().myAppend(...OptS);
  selTResT.empty().myAppend(...OptT);

    // Add options to selFilterMethod
  var Opt=[];
  var Key=["b", "r", "R"];
  for(var k of Key){
    var opt=createElement('option').myText(k).prop('value',k); Opt.push(opt);
  }
  selFilterMethod.empty().myAppend(...Opt);
  
  [labLabel, labSourceDir, labTargetDir, labTargetDbDir, labFilterFirstT2T, labTResS, labTResT, labHostTarget, labFilterMethod, labIncIdS, labIncIdT].forEach(ele=>ele.css({'margin-right':'0.5em'})); //, labFilterFirst_Db, labFilterFirst, labDb
  [inpLabel, inpSourceDir, inpTargetDir, inpTargetDbDir, inpFilterFirstT2T, selTResS, selTResT, inpHostTarget, selFilterMethod, inpIncIdS, inpIncIdT].forEach(ele=>ele.css({display:'block',width:'100%'})); //, inpFilterFirst_Db, inpFilterFirst, inpDb
  var inpNLab=[labLabel, inpLabel, labSourceDir, inpSourceDir, labTargetDir, inpTargetDir, labTargetDbDir, inpTargetDbDir, labFilterFirstT2T, inpFilterFirstT2T, labTResS, selTResS, labTResT, selTResT, labHostTarget, inpHostTarget, labFilterMethod, selFilterMethod, labIncIdS, inpIncIdS, labIncIdT, inpIncIdT]; //, labFilterFirst, inpFilterFirst, labDb, inpDb
  //if(!gThis.boAllowRemoteTarget) {labHostTarget.hide(); inpHostTarget.hide();}
  //if(boWNonSeparateTargetDb) {labTargetDbDir.hide(); inpTargetDbDir.hide();}

  //var buttonCancel=createElement('button').myText('Cancel').on('click',historyBack).css({'margin-top':'1em'});
  var buttonBack=createElement('button').myText('Cancel').addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click',historyBack); // charBackSymbol
  var buttonSave=createElement('button').myText('Save').on('click',save); //
  var divBottom=createElement('div').myAppend(buttonBack, buttonSave).css({'margin-top':'1em'});;  //buttonCancel,

  var blanket=createElement('div').addClass("blanket");
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});

  //var divConsole=createElement('div').addClass("popupErrorConsole")
  var centerDiv=createElement('div').addClass("Center").myAppend(...inpNLab, divBottom).css({'min-width':'17em','max-width':'30em', padding: '1.2em 0.5em 1.2em 1.2em'}); //divConsoleContainer
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
    //divConsoleContainer.myAppend(divConsole)
  }
  
  var elR;
  var head=createElement('h5').myText('Delete');
  var spanId=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanId);
  var buttonBack=createElement('button').myText("Cancel").on('click',historyBack).css({'margin-top':'1em'});

  var blanket=createElement('div').addClass("blanket");
  //var divConsoleContainer=createElement('div').css({width:'100%', opacity:0.8});
  var centerDiv=createElement('div').addClass("Center").myAppend(head,p, buttonBack, butOK).css({'min-width':'17em','max-width':'25em', padding:'0.5em'});  //divConsoleContainer 
  el.addClass("Center-Container").myAppend(blanket, centerDiv); 
  
  return el;
}


  //label, fiSourceDir, fiTargetDir, fiTargetDbDir, leafFilterFirst, suffixFilterFirstT2T, leafDb, charTResS, charTResT, strHostTarget, charFilterMethod, boIncIdS, boIncIdT
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
  var funRearranger=function(){
    var y=yMouse
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
  }
  var scrollTimer=null, yMouse=null
  var scrollTimerCb=function(){
    var y=yMouse, yZone=10, yStep=10
    if(y<yZone) {divContW.scrollTop-=yStep;}
    else if(y>divContW.offsetHeight-yZone) {divContW.scrollTop+=yStep;}
    funRearranger()
  }
  var movedRow, iStart, iEnd;
  el.myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    movedRow=this.parentNode.parentNode;
    iStart=getNodeIndex(movedRow);
    movedRow.css({position:'relative', opacity:0.55, 'z-index':'auto'});  
    document.on(strMoveEv,el.myMousemove, {passive: false}); document.on(strEndEv,el.myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
    //setMess('Down');
    scrollTimer=setInterval(scrollTimerCb,50)
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
    clearInterval(scrollTimer)
  }
  
  el.myMousemove= function(e){
    var x,y;
    if(boTouch) {e.preventDefault(); e.stopPropagation(); x=e.changedTouches[0].pageX; y=e.changedTouches[0].pageY;}
    else {y=e.clientY;}
    yMouse=y
    funRearranger()
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
      //if(!gThis.boAllowRemoteTarget) objOpt.strHostTarget=""
      //if(boWNonSeparateTargetDb) objOpt.fiTargetDbDir=""

      objOpt.fiSourceDir=rtrim(objOpt.fiSourceDir, charF)
      objOpt.fiTargetDir=rtrim(objOpt.fiTargetDir, charF)
      objOpt.fiTargetDbDir=rtrim(objOpt.fiTargetDbDir, charF)

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
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    return [null]

  }
  // el.getSelectedRow=function(){
  //   var Row=[...tBody.children], len=Row.length;
  //   for(var row of Row){if(row.dataset.boSelected=="true") return [null, row];}
  //   return [Error('No row selected!?!?')]
  // }
  el.getSelectedFrFile=async function(){
    var [err, ObjOpt, iSelected]=await el.getDataFrFile();  if(err) {debugger; return [err];}
    var objOptExtended=extend({}, ObjOpt[iSelected])
    var {strHostTarget, fiTargetDbDir, fiTargetDir}=objOptExtended
    if(!strHostTarget) strHostTarget="localhost";   var boRemote=strHostTarget!="localhost"
    fiTargetDbDir||=fiTargetDir
    extend(objOptExtended, {strHostTarget, boRemote, fiTargetDbDir, fiTargetDir})
    return [null, objOptExtended];
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

  var BoAscDefault={}, Label={boSelected:'Selected', charTResS:'tResS', charTResT:'tResT'}, Th=[];
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
  el.append(divTopContainer, divContW);
  return el;
}

