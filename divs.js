
"use strict"

gThis.funFilterFirstCheckExistance=async function(arg){
  var {objOptSource, suffixFilterFirstT2T}=arg;
  var {leafFilter, fsDir}=objOptSource
  if(suffixFilterFirstT2T){
    var leafFilterFirstT2T=leafFilter+suffixFilterFirstT2T,  fsFilterFirstT2T=fsDir+charF+leafFilterFirstT2T
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


  var butRelation=createElement('button').myText(`S ${charRightArrow} T`).addClass('fixWidth').on('click',function(){
    doHistPush({strView:'relationTab'});
    relationTab.setVis();
  });
  var butLocation=createElement('button').myText('Locations').addClass('fixWidth').on('click',function(){
    doHistPush({strView:'locationTab'});
    locationTab.setVis();
  });
  el.setUIBasedOnSetting=function(arg){
    var {objOptSource, objOptTarget, labelSource, labelTarget, fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, suffixFilterFirstT2T, boRemoteTarget}=arg;
    var label=`${labelSource} ${charRightArrow} ${labelTarget}`; //⚙ ➜
    butRelation.myText(label) //+' ◂'
    //if(err) return
    

    // linkTData.myText(flTargetDataDir)
    // var strTargetDataDir=boRemoteTarget?`${strHostTarget}:${flTargetDataDir}`:flTargetDataDir
    // linkTData.prop({title:strTargetDataDir}).toggleClass('disabled', boRemoteTarget);
    // spanTData.toggle(flTargetDataDir)
  }
  el.setButTab=function(strView){
    ButTab.forEach(b=>b.css({background:'var(--bg-color)', color:''}))
    var Views=[viewFront, viewCheck, relationTab, locationTab, viewExtra]; //, viewCollision
    var StrView=Views.map(v=>v.toString())
    var iView; StrView.forEach((strV,i)=>{if(strV==strView) iView=i;})
    ButTab[iView].css({background:'var(--bg-colorEmp)', color:'var(--text-color-intense)'})
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
  var butExtra=createElement('button').myAppend('More…').on('click',  function(){
    doHistPush({strView:'viewExtra'});
    viewExtra.setVis();
  }); // ⋮ 


  var linkS=createElement('a').myAppend('S').prop({href:''}).on('click', methGoToTitle);
  var linkT=createElement('a').myAppend('TDb').prop({href:''}).on('click', methGoToTitle);
  var linkTData=createElement('a').myAppend('TData').prop({href:''}).on('click', methGoToTitle);
  var spanTData=createElement('span').myAppend(' (', linkTData, ')');


  
  var uWiki='https://emagnusandersson.com/buvt'
  var linkWiki=createElement('a').prop({href:uWiki}).myText('Web info').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uWiki); }); //.css({'margin-left':'0.4em', 'text-align':'center'})

  var uNotation='https://emagnusandersson.com/Buvt_Notations'
  var linkNotation=createElement('a').prop({href:uNotation}).myText('Notations').addClass('external').on('click',(ev)=>{ ev.preventDefault(); openInBrowserF(uNotation); });

  var selectorOfTheme=SelThemeCreate.factory();  setThemeClass(); selectorOfTheme.setValue();
  selectorOfTheme.css({ width:"2.5em", 'vertical-align':'bottom', padding:0})
  
  var ButTab=[butFront, butCheck, butRelation, butLocation, butExtra]; //, butCollision
  ButTab.forEach(b=>b.css({'border-bottom':'0px', 'border-top-left-radius':'10px', 'border-top-right-radius':'10px', 'border-bottom-left-radius':'0', 'border-bottom-right-radius':'0'}))


  el.myAppend(...ButTab, ' | ', linkWiki, ' | ', linkNotation, ' | ', selectorOfTheme, ' | ', butClear);  //, ' | ', linkS, ` ${charRightArrow} `, linkT, spanTData   , settingButton, , divNotations, ' | ', linkDb , ' ', linkAppFolder
  el.css({'border-bottom':'solid var(--bg-colorEmp) 5px'})
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
    //miniViewSMMatch.clearUI();
  }
  el.setUIBasedOnSetting=async function(){
    var [err, result]=await getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') { var label='(no-argument-selected)'; }
      else {debugger; myConsole.error(err); return;}
      return
    }
    else {
      var {objOptSource, objOptTarget, labelSource, labelTarget, fiSourceDir, strHostTarget, fiTargetDbDir, suffixFilterFirstT2T, boRemoteTarget}=result;
      var {leafFilter}=objOptSource;
    }
    //divCollisionSMW.setUp(result)
    divT2DBoth.setUIBasedOnSetting(result)
    //divT2DS.setUIBasedOnSetting(result);  divT2DT.setUIBasedOnSetting(result)
    

    el.divT2TUsingHash.setUIBasedOnSetting(result)

      // Set T2T-filter links
    // var leafFilterFirstT2T=leafFilter+suffixFilterFirstT2T
    // var title=fiSourceDir+charF+leafFilterFirstT2T; el.divT2TUsingHash.linkFilterFirstT2T.prop({title}).myText(leafFilterFirstT2T).toggleClass('disabled', suffixFilterFirstT2T=='');

  }



  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  var divT2DBoth=el.divT2DBoth=divT2DBothCreator(createElement('div'))
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

  //
  // Checking
  //
  var inpIStart=createElement('input').prop({type:'number', min:0}).attr('value',0).css({width:'11ch'}).prop({title:'iStart, (Start checking from this row (Skipping those above this line)).'});
  var butCheckViaPythonS=createElement('button').myAppend('Source').on('click', async function(){
    myConsole.clear(); setMess('CheckS ...'); blanket.show();
    //viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {objOptSource}=result, {id, charTRes, fiDir}=objOptSource
    var arg=extend({}, {fiDbDir:fiDir, iStart:Number(inpIStart.value), myConsole, charTRes})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    var [err]=await locationTab.setTLastCheck(id); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
  });
  var butCheckViaPythonT=createElement('button').myAppend('Target').on('click', async function(){
    myConsole.clear(); setMess('CheckT ...'); blanket.show();
    //viewCheck.butCheckCancel.show(); viewCheck.boCheckCancel=false
    var [err, result]=await getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {objOptTarget}=result, {id, charTRes, fiDir, strHost}=objOptTarget
    var arg=extend({}, {fiDbDir:fiDir, iStart:Number(inpIStart.value), myConsole, charTRes, strHost})
    var [err, mess=""]=await checkViaPython(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess(mess); blanket.hide(); viewCheck.butCheckCancel.hide();
    var [err]=await locationTab.setTLastCheck(id); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
  });


  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  


  var hCheckFileExistance=createElement('b').myText('Check file existance').prop({title:`Going through all the files in db-file and check that they exist.`})
  //var divCheckFileExistance=createElement('div').myAppend(hCheckFileExistance, butCheckSummarizeMissingS, butCheckSummarizeMissingT).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'})

  var hCheckHash=createElement('b').myText('Check hash codes').prop({title:`Going through all the files in db-file and check the hashcode.
REMEMBER to "sync" the db first. Otherwise changed/missing files will be reported an errors.`}); //(such as running main>T2D>sync)
  var imgTreeS=createElement('img').prop({src:`icons/buvtTreeSFull.png`}).css({zoom:'1', 'vertical-align':'middle', margin:'0 0.4em'});
  var imgTreeT=createElement('img').prop({src:`icons/buvtTreeTFull.png`}).css({zoom:'1', 'vertical-align':'middle', margin:'0 0.4em'});
  var spanIStart=createElement('span').myText('iStart:').attr({'title':'Start on this row of the db-file'}).css({'margin-left':'0.0em'})
  inpIStart.css({'margin-left':'0.6em'});
  var divHeadCheckHash=createElement('div').myAppend(hCheckHash, ' ', spanIStart, inpIStart).css({display:'flex', 'align-items':'center'})

  el.boCheckCancel=false
  el.butCheckCancel=createElement('button').myText('Cancel').on('click', function(ev){el.boCheckCancel=true}).hide()
  var divCheckHash=createElement('div').myAppend(divHeadCheckHash, ' ', imgTreeS, butCheckViaPythonS, ' ', imgTreeT, butCheckViaPythonT, el.butCheckCancel).css({display:'flex', 'align-items':'center', 'justify-content':'center', background:"var(--bg-color)", flex:'1 1'}) //, butCheckS, butCheckT
  

  // var butSetLastCheck=createElement('button').myText("Set tLastCheck").prop({title:'Storing the (check-) timepoint (instead of writing on the usb-drive when it was last checked)'}).on('click',async function(){
  //   var strMess=`Setting tLastCheck?\nWritten to:\n ${fsMyStorage}`;
  //   var boOK=await myConfirmer.confirm(strMess);
  //   if(!boOK) { return}
  //   var [err]=await locationTab.setTLastCheck(); if(err) {debugger; myConsole.error(err); return;}
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



gThis.viewExtraCreator=function(el){
  //var el=createElement('div');
  el.toString=function(){return 'viewExtra';}

  el.setUp=async function(){
    divTopContainer.myAppend(divTop)
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    elConsoleContainerTop.clear().myAppend(divFoot)

    miniViewFilterMethodTester.setUp()
    miniViewEmptyFolder.setUp()
    miniViewHashMatch.setUp();
  }
  el.setBottomMargin=function(hNew){
    divMid.css({'margin-bottom':hNew+'px'})
  }

  el.setUIBasedOnSetting=function(arg){
    //miniViewProgramFolders.setUIBasedOnSetting(arg);
  }
  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  

  var miniViewProgramFolders=miniViewProgramFoldersCreator(createElement('div'))
  var miniViewFilterMethodTester=miniViewFilterMethodTesterCreator(createElement('div'))
  var miniViewEmptyFolder=miniViewEmptyFolderCreator(createElement('div'))
  var miniViewHashMatchDelete=miniViewHashMatchDeleteCreator(createElement('div'))
  var miniViewReplacePrefix=miniViewReplacePrefixCreator(createElement('div'))

  var miniViewHashMatch=miniViewHashMatchCreator(createElement('div'))

  var divMid=createElement('div').myAppend(miniViewProgramFolders, miniViewFilterMethodTester, miniViewEmptyFolder, miniViewHashMatchDelete, miniViewHashMatch)
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
