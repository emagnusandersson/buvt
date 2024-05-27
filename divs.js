
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
    var [err, result]=await argumentTab.getSelectedFrFile(); 
    if(err) {
      if(err.message=='no-argument-selected') {
        var label='(no-argument-selected)';
      }
      else {debugger; myConsole.error(err); return;}
    }
    else { var {label, fiSourceDir, fiTargetDir, fiTargetDbDir, charFilterMethod, suffixFilterFirstT2T, strHostTarget, boRemote}=result; }
    argumentButton.myText(`⚙ (${label})`) //+' ◂'
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
    var title=fiSourceDir+charF+leafDb;   divT2D.linkDb.prop({title}).myText(leafDb)
      // Set S_- filter link
    var title=fiSourceDir+charF+leafFilter;   divT2D.linkFilterFirstT2D.prop({title}).myText(leafFilter)

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
 *   divTopOpenStuffCreator
 **********************************************/
gThis.divTopOpenStuffCreator=function(el){

  return el
}


/***********************************************************
 * divIdMatchCreator, divHashMatchCreator, divSMMatchCreator
 ***********************************************************/

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
  el.setVal=function(syncDb){
    var {objHL}=syncDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL,  strTmpShortList}=objHL

    tdAllFile.myText(`${nIdf}(${nTreef})`);
    tdAllFolder.myText(`${nIdF}(${nTreeF})`);
    tdAllDb.myText(`${nIdDb}(${nDb})`);
    //tdMultFile.myText(`${nMultIdf}(${nMultf})`);
    tdMultFolder.myText(`${nMultIdF}(${nMultF})`);
    tdMultDb.myText(`${nMultIdDb}(${nMultDb})`);

    butMult.myText(`${nMultIdf}(${nMultf})`).prop({title:strTmpShortList})
  }

  var htmlHeadAll=`<tr><th> </th><th>nId(nName)</th></tr>` 
  var htmlBodyAll=`<tr><th>Files</th><td>-</td></tr>
<tr><th>Folders</th><td>-</td></tr>
<tr><th>Db</th><td>-</td></tr>` 
  var htmlHeadMult=`<tr><th> </th><th>nId(nName)</th></tr>` 
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
    butMult.prop({title:undefined})
    //butMult.myText('-(-)')
  }
  el.setVal=function(syncDb){
    var {objHL}=syncDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL, strTmpShortList}=objHL
    spanHLCheckResult.css({color:boHL?'var(--text-red)':'var(--text-green)'}).myText(boHL?'FAIL, ABORTING':'OK'); //Hard link check 
    hovDetail.myText(`Tot: ${nIdf}(${nTreef}) Mult: ${nMultIdf}(${nMultf})`)
    elMenu.setVal(syncDb)
    
    butMult.prop({title:strTmpShortList})
    //butMult.myText(`${nMultf}(${nMultIdf})`)
  }
  
  var spanHLCheckResult=createElement('span').css({'font-weight':'bold'}).myText('-');

  var elMenu=createElement('div')
  menuIdCreator(elMenu,fun)
  elMenu.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); 

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  var elWrap=createElement('span').myAppend(hovDetail, elMenu)
  var elPar=elBody;  myMenu(elWrap, elPar)

  var butMult=createElement('a').prop({href:''}).myText('Multiples').on('click',fun);; 

  el.myAppend('Ids (Hard-link check: ', spanHLCheckResult, '): ', elWrap, ', ', butMult); //, ', ', spanLab, ': ', spanMultSum
  //el.css({display:'inline'})
  return el
}



gThis.divHashMatchCreator=function(el, fun){
  el.clearVal=function(){
    spanTotal.myText('-(-)')
    butMult.myText('-(-)')
  }
  el.setVal=function(syncDb){
    var {objHash}=syncDb;
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


gThis.divNOutsideCreator=function(el){
  el.clearVal=function(){
    spanNOutside.myText('-')
  }
  el.setVal=function(syncDb){
    var {arrDbNonRelevant}=syncDb;
    spanNOutside.myText(arrDbNonRelevant.length)
  }
  
  var spanLab=createElement('span').prop({title:'Number of files outside the synced folder.'}).myText('nOutside:')
  var spanNOutside=createElement('b').myText('-')
  el.myAppend(spanLab, spanNOutside); 
  return el
}


gThis.menuSMTabCreator=function(el, ...Fun){
  el.clearVal=function(){
    span01.myText(`-`); span02.myText(`-`); but02.myText(`-`);
    span10.myText(`-`); span11.myText(`-`); but11.myText(`-`); span12.myText(`-`); but12.myText(`-`); 
    span20.myText(`-`); but20.myText(`-`); span21.myText(`-`); but21.myText(`-`); span22.myText(`-`); but22.myText(`-`);
    span0XSum.myText(`-`); span1XSum.myText(`-`); span2XSum.myText(`-`); 
    spanX0Sum.myText(`-`); spanX1Sum.myText(`-`); spanX2Sum.myText(`-`)
    spanSumS.myText(`-`); spanSumT.myText(`-`);
    spanSumPatS.myText(`-`); spanSumPatT.myText(`-`);
    spanTot.myText(`-`); spanBoth.myText(`-`);
  }
  el.setVal=function(MatLoc){
    var {ShortList:SL=[]}=MatLoc
    var {NPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=MatLoc.getN()
    var {nPatY11,nPatY12,nPatY21,nPatY22, nPatY10,nPatY20,nPatY01,nPatY02,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB11,nB12,nB21,nB22}=objDetail


    span01.myText(nPatY01)
    var strT=`${nPatY02}(${nB02})`; span02.myText(strT); but02.myText(strT).prop({title:SL["02"]})
    var nPatY0XSum=nPatY01+nPatY02, nB0XSum=nB01+nB02;    span0XSum.myText(`${nPatY0XSum}(${nB0XSum})`)
    var nPatY1XSum=nPatY10+nPatY11+nPatY12, nB1XSum=nB11+nB12;    span1XSum.myText(`${nPatY1XSum}(${nB1XSum})`)
    var nPatY2XSum=nPatY20+nPatY21+nPatY22, nA2XSum=nA20+nA21+nA22, nB2XSum=nB21+nB22;    span2XSum.myText(`${nPatY2XSum} (${nA2XSum} \\ ${nB2XSum})`)
    span10.myText(nPatY10)
    span11.myText(nPatY11); but11.myText(nPatY11)
    var strT=`${nPatY12}(${nB12})`; span12.myText(strT); but12.myText(strT).prop({title:SL["12"]})
    var strT=`${nPatY20}(${nA20})`; span20.myText(strT); but20.myText(strT).prop({title:SL["20"]})
    var strT=`${nPatY21}(${nA21})`; span21.myText(strT); but21.myText(strT).prop({title:SL["21"]})
    var strT=`${nPatY22} (${nA22} \\ ${nB22})`; span22.myText(strT); but22.myText(strT).prop({title:SL["22"]}); 

    var nPatYX0Sum=nPatY10+nPatY20, nAX0Sum=nA10+nA20;    spanX0Sum.myText(`${nPatYX0Sum}(${nAX0Sum})`)
    var nPatYX1Sum=nPatY01+nPatY11+nPatY21, nAX1Sum=nA11+nA21;    spanX1Sum.myText(`${nPatYX1Sum}(${nAX1Sum})`)
    var nPatYX2Sum=nPatY02+nPatY12+nPatY22, nAX2Sum=nA12+nA22, nBX2Sum=nB02+nB12+nB22;    spanX2Sum.myText(`${nPatYX2Sum} (${nAX2Sum} \\ ${nBX2Sum})`)
    spanSumPatS.myText(nAPat); spanSumPatT.myText(nBPat);
    spanSumS.myText(nA); spanSumT.myText(nB) 
    spanTot.myText(nPat);
    var nPatBoth=nPatY11+nPatY12+nPatY21+nPatY22;  spanBoth.myText(nPatBoth);
  }
  var htmlHead=`<tr><th class=backcrossed><span title=Source>S</span> <span title=Target>T</span></th> <th>0</th> <th>1</th> <th>Many</th> <td>∑</td></tr>`; //S⇣ \\ T⇾
  var htmlBody=
  `<tr><th>0</th><td>(∞)</td><td><span>-</span></td> <td><span>-</span><a>-</a></td> <th><span>-</span></th> <th rowspan=3>T: <span>-</span>(<span>-</span>)</th></tr>
  <tr><th>1</th><td><span>-</span></td><td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td> <th><span>-</span></th></tr>
  <tr><th>Many</th><td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td>  <td><span>-</span><a>-</a></td>  <th><span>-</span></th></tr>
  <tr><td>∑</td><th><span>-</span></th><th><span>-</span></th><th><span>-</span></th> <th rowspan=2 colspan=2>S⋂T: <span title="Number of patterns that occur on both sides.">-</span><br/>S⋃T: <span title="Total number of patterns">-</span></th></tr>
  <tr><td></td><th colspan=3>S: <span>-</span>(<span>-</span>)</th></tr>` //∪∩⋂⋃
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [trH]=tHead.children;
  var [tr0, tr1, tr2, trSum, trSumS]=tBody.children
  var [thST,,,,tdT]=trH.children; //tdT.cssExc({'border-top':'hidden!important', 'border-right':'hidden!important', 'border-left':'solid', background:'transparent'}); // Sum-sign in upp-right corner
  thST.children[1].css({float:'right'})
  //var [,,,td22]=tr2.children; td22.cssExc({'border-top':'hidden!important', 'border-left':'hidden!important'})
  //var [tdTmp]=trSum.children; tdTmp.cssExc({'border-bottom':'hidden!important', 'border-left':'hidden!important', 'text-align':'end', background:'transparent'});  // Sum-sign in lower-left corner

  var arr0=tr0.querySelectorAll('span'), [span01,span02,span0XSum, spanSumPatT, spanSumT]=arr0
  var But0=tr0.querySelectorAll('a'), [but02]=But0
  var arr1=tr1.querySelectorAll('span'), [span10,span11,span12, span1XSum]=arr1
  var But1=tr1.querySelectorAll('a'), [but11,but12]=But1
  var arr2=tr2.querySelectorAll('span'), [span20,span21,span22, span2XSum]=arr2
  var But2=tr2.querySelectorAll('a'), [but20,but21,but22]=But2
  var [spanX0Sum, spanX1Sum, spanX2Sum, spanTot, spanBoth]=trSum.querySelectorAll('span')
  var [spanSumPatS, spanSumS]=trSumS.querySelectorAll('span')
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
    //hovDetail.myText(`Tot: - \\ -, Mult: - \\ - (-)`)
    //hovDetail.myText(`- \\ - (- \\ -)`)
    hovDetail.myText(`- (-) \\ - (-)`)
  }
  el.setVal=function(MatLoc){

    var {NPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail}=MatLoc.getN()
    var {nPatY11,nPatY12,nPatY21,nPatY22, nPatY10,nPatY20,nPatY01,nPatY02,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}=objDetail

    var nA2XSum=nA20+nA21+nA22
    var nBX2Sum=nB02+nB12+nB22

    var nPatY2XSum=nPatY20+nPatY21+nPatY22;
    var nPatYX2Sum=nPatY02+nPatY12+nPatY22;
    var nPatMultBoth=nPatY21+nPatY12+nPatY22;
    //hovDetail.myText(`${nA} \\ ${nB}, M: ${nA2XSum}(${nPatY2XSum}) \\ ${nBX2Sum}(${nPatYX2Sum}) (${nPatMultBoth})`)  // (${nPat})
    //hovDetail.myText(`Tot: ${nA} \\ ${nB}, Mult: ${nA2XSum} \\ ${nBX2Sum} (${nPatMultBoth})`)  // (${nPat})
    //hovDetail.myText(`${nAPat} \\ ${nBPat} (${nA} \\ ${nB})`)
    hovDetail.myText(`${nAPat} (${nA}) \\ ${nBPat} (${nB})`)

    menuMat.setVal(MatLoc)
  }

  
  var menuMat=createElement('div')
  menuSMTabCreator(menuMat, ...Fun); //, undefined, fun
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




gThis.divT2DTabCreator=function(el, charSide){
  var self=el
  el.clearVal=function(){
    butDoActionRam.prop({disabled:true});   butDoAction.prop({disabled:true})
    divMat2.clearVal()
    var title=undefined
    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    butRenamed.myText('-').prop({title});  spanRenamedAction.myText('-')
    butCopiedNRenamedToOrigin.myText('-').prop({title});  spanCopiedNRenamedToOriginAction.myText('-')
    butChanged.myText('-').prop({title});  spanChangedAction.myText('-')
    butReusedName.myText('-').prop({title});  spanReusedNameAction.myText('-')
    butReusedId.myText('-').prop({title});  spanReusedIdAction.myText('-')
    butCreated.myText('-').prop({title}); butDeleted.myText('-').prop({title});
    but1T1.myText('-').prop({title}); butMult.myText('-').prop({title});
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(syncDb){
    this.syncDb=syncDb

    var {Mat1, Mat2, boChanged, arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName}=syncDb; //, arrSourceMultNoName, arrTargetMultNoName

    var arrSourceMultNoName=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrTargetMultNoName=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    var ArrSourceMultNoName=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMultNoName=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);

    var nChanged=arrSourceChanged.length, nIM=arrSourceIM.length, nNM=arrSourceNM.length, nReusedName=arrSourceReusedName.length, nReusedId=arrSourceReusedId.length, nCreate=arrCreate.length, nDelete=arrDelete.length,    nSource=arrSource.length, nTarget=arrTarget.length, nUntouched=arrSourceUntouched.length,    n1T1NoName=arrSource1T1NoName.length, nSourceMultNoName=arrSourceMultNoName.length, nTargetMultNoName=arrTargetMultNoName.length


    //if(!boChanged) {myConsole.log('Everything is up to date, aborting.'); return;}
    divMat2.setVal(Mat2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)

    var fun1T1=r=>`S: ${r[0].strName}\n  T: ${r[1].strName}`
    var arrTmp=[arrSourceIM.slice(0,nShortListMax), arrTargetIM.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    butRenamed.myText(nIM).prop({title:formatTitle(arrTmp, undefined, fun1T1)});
    //butRenamed.myText(nIM).prop({title:formatTitle(arrSourceIM)});
    spanRenamedAction.myText(nIM)
    butCopiedNRenamedToOrigin.myText(nNM).prop({title:formatTitle(arrSourceNM)});  spanCopiedNRenamedToOriginAction.myText(nNM)
    butChanged.myText(nChanged).prop({title:formatTitle(arrSourceChanged)});  spanChangedAction.myText(nChanged)
    butReusedName.myText(nReusedName).prop({title:formatTitle(arrSourceReusedName)});  spanReusedNameAction.myText(nReusedName)
    butReusedId.myText(nReusedId).prop({title:formatTitle(arrSourceReusedId)});  spanReusedIdAction.myText(nReusedId)
    butCreated.myText(nCreate).prop({title:formatTitle(arrCreate)}); spanCreatedAction.myText(nCreate);
    butDeleted.myText(nDelete).prop({title:formatTitle(arrDelete)}); spanDeletedAction.myText(nDelete);

    var arrTmp=[arrSource1T1NoName.slice(0,nShortListMax), arrTarget1T1NoName.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    but1T1.myText(n1T1NoName).prop({title:formatTitle(arrTmp, undefined, fun1T1)});
    //but1T1.myText(n1T1NoName).prop({title:formatTitle(arrSource1T1NoName)});
    span1T1Action.myText(n1T1NoName);
    var strT=nSourceMultNoName+' \\ '+nTargetMultNoName;

    butMult.myText(strT).prop({title:formatTitleMult(ArrSourceMultNoName, ArrTargetMultNoName)}); 
    spanMultActionC.myText(nSourceMultNoName); spanMultActionD.myText(nTargetMultNoName);

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)

    var nShortCut=nUntouched+nIM+nNM; spanSumSC.myText(nShortCut);
    var nMatchButNoSC=nChanged+nReusedName+nReusedId+n1T1NoName, nDeleteTmp=nMatchButNoSC+nTargetMultNoName+nDelete, nCreateTmp=nMatchButNoSC+nSourceMultNoName+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);
    var boAction=Boolean(nIM+nNM+nDeleteTmp+nCreateTmp)
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
<tr><th>Id</th> <th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short-cut</th> <th>Del­ete</th> <th title="(Re-) Calculate the hashcode for the file ">Calc</th></tr>`

//<tr><td colspan=9>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>-</th><th>OK</th> <td colspan=2><a href="">-</a></td><td>Re­named</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th>OK</th><th>OK</th> <td colspan=2><a href="">-</a></td><td title="Could also be called for example 'copiesThatHaveBeenRenamedToOrigin'\nThat is: File copied, original file name made available (such as if the origin is deleted), then the copy is renamed to origin.\nOne could note that:\n   On NTFS defragmentation changes the fileId. (Which led me to label it 'Defragmented')\n   (On ext4 however, defragmentation does NOT change the inode. (So the label 'Defragmented' is questionable.))">"Defrag­ment­ed"</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Reused name</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>OK</th><th>-</th><th>-</th> <td colspan=2><a href="">-</a></td><td title="Ex: Renamed and changed">Reused id</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><td colspan=9>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
<tr><th>-</th><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created / Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a></td> <td title="One-to-one relation (The SM combination exists exactly once each on S and T)\nEx: File copied, origin deleted.">1T1</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <td title="Relations where the pattern exists once or more on each side (S and T) except for 1T1-relations. (1Tm+mTm+mT1)">Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=3>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><td colspan=6></td><td colspan=3> <button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button> <button title="As per the current state of the result-files">Do actions</button></td></tr>`
// The pattern exists on both S and T and more than once on at least one of them. <br/>(read fr files)
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  //var [trMat1, trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trRemaining, trSum]=arrTR
  var [trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trMat2, trCreatedNDeleted, tr1T1, trMult, trSum, trSyncAccordingToFiles]=arrTR; //trMat1, 
  // var arrTRT=arrTR.slice(1,-5).concat(arrTR.slice(-4,-2)); arrTRT.forEach(ele=>ele.children[3]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  // var arrTRT=arrTR.slice(4,-5).concat(arrTR.slice(-4,-3)); arrTRT.forEach(ele=>ele.children[6]?.css({'text-align':'center'})); //Centering merged Delete/Create columns
  trSum.css({'font-weight':'bold'})


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

  var PathCur=gThis[`Path${charSide}`]
  butRenamed.on('click', makeOpenExtCB(PathCur.renamed))
  butCopiedNRenamedToOrigin.on('click', makeOpenExtCB(PathCur.defragmented))
  butChanged.on('click', makeOpenExtCB(PathCur.changed))
  butReusedName.on('click', makeOpenExtCB(PathCur.reusedName))
  butReusedId.on('click', makeOpenExtCB(PathCur.reusedId))
  butCreated.on('click', makeOpenExtCB(PathCur.created))
  butDeleted.on('click', makeOpenExtCB(PathCur.deleted))
  but1T1.on('click', makeOpenExtCB(PathCur['1T1NoName']))
  butMult.on('click', makeOpenExtCB(PathCur.STMatch2))

  butDoActionRam.parentNode.css({'text-align':'center'})
  butDoActionRam.on('click', async function(){
    setMess('Do actionsRam ...'); blanket.show()

    var [err]=await self.syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    //var [err]=await T2DCreateSyncData.call(self.syncDb); if(err) {debugger; myConsole.error(err); resetMess(); return;}
    
    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${self.syncDb.fsDb}`;
      //var boOK=confirm(strMess);
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {setMess('SyncDb: DoAction: aborting.'); blanket.hide(); return}
    }

    var [err]=await self.syncDb.makeChanges()
    setMess('Do actionsRam: Done'); blanket.hide();
  })
  butDoAction.on('click', async function(){
    this.prop({disabled:true})
    setMess('Do actions ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, charTResS, charTResT, charFilterMethod, strHostTarget:strHost, boRemote}=result
    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir
    var boTarget=charSide=='T'
    var fiDir=boTarget?fiTargetDbDir:fiSourceDir
    var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    var charTRes=boTarget?charTResT:charTResS;
    if(!boTarget) {strHost="localhost"; boRemote=false; }
    var leafFilter=LeafFilter[charFilterMethod];
    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsDbDir]=await myRealPath(fiDbDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg={leafFilter, fsDir, fsDbDir, charTRes, charFilterMethod, strHost, boRemote, charSide}
    var syncDb=new SyncDb(arg);
    var [err]=await syncDb.readAction(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [boAbort, strMess]=syncDb.getMess()
    if(boAbort) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}
    var [err]=await syncDb.doSCChanges(); if(err) {myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${syncDb.fsDb}`;
      //var boOK=confirm(strMess);
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {
        setMess('SyncDb: DoAction: aborting.');
        this.prop({disabled:false});
        blanket.hide(); return
      }
    }
    var [err]=await syncDb.makeChanges(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}


    setMess('Do actions: Done'); blanket.hide();
  });
  butDoActionRam.hide()
  
  el.myAppend(table);  
  return el
}


/***********************************************
 *   divT2DCreator
 **********************************************/
gThis.divT2DCreator=function(el, charSide){
  //var el=createElement('div');
  el.toString=function(){return 'viewT2D';}
  
  el.setUp=function(){
  }

  var funT2D=async function(){
    var boSync=this===butSyncDb
    var strAction=(boSync?'Sync':'Compare');
    var strSide=charSide=='T'?'target':'source'
    var strMess=`${strAction} tree-2-db on ${strSide}...`;
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, charTResS, charTResT, charFilterMethod, strHostTarget:strHost, boRemote}=result
    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir
    var boTarget=charSide=='T'
    var fiDir=boTarget?fiTargetDbDir:fiSourceDir
    var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    var charTRes=boTarget?charTResT:charTResS;
    if(!boTarget) {strHost="localhost"; boRemote=false;}
    var leafFilter=LeafFilter[charFilterMethod];
    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsDbDir]=await myRealPath(fiDbDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg={leafFilter, fsDir, fsDbDir, charTRes, charFilterMethod, strHost, boRemote, charSide}
    var syncDb=new SyncDb(arg);
    var [err]=await syncDb.compare();   if(err) { debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    el.setVal(syncDb);
    if(boSync){ 
      
      if(syncDb.objHL.boHL) {setMess('Hard links found, aborting.'); blanket.hide(); return}
      if(!syncDb.boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide(); return;  }

      var [err]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      //var [err]=await T2DCreateSyncData.call(syncDb); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      if(boAskBeforeWrite){
        setMess('Overwrite ?')
        var strMess=`Overwrite ${syncDb.fsDb}`;
        //var boOK=confirm(strMess);
        var boOK=await myConfirmer.confirm(strMess);
        if(!boOK) {setMess('SyncDb: aborting.'); blanket.hide(); return}
      }
      var [err]=await syncDb.makeChanges()
    }

    var strMess=`${strAction} tree-2-db on ${strSide}: Done`;
    setMess(strMess); blanket.hide();
  }
  
  var butCompareT2D=createElement('button').myAppend('Compare').on('click', funT2D);
  var butSyncDb=createElement('button').myAppend('Sync').prop({title:`Same as "Compare" plus doing the suggested actions from the compare-call.`}).on('click', funT2D);

  var butCompareT2DSMOnly=createElement('button').myAppend('Compare source tree to db (SMOnly)').on('click', async function(){
    myConsole.clear(); el.clearVal()
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); blanket.hide(); return;}
    var {fiSourceDir, charTResS, charFilterMethod}=result, leafFilter=LeafFilter[charFilterMethod];
    var arg={leafFilter, fiDir:fiSourceDir, charTRes:charTResS, charFilterMethod}
    compareT2DSMOnly(arg);
  });
  //var divDev=createElement('div').myAppend( butCompareT2DSMOnly);
  
  //el.toggleResult=function(boOn){ divResult.toggle(boOn); }
  el.clearVal=function(){
    divCategoryTab.clearVal()
    //butMore.myText('-')
    divIdMatch.clearVal()
    divNOutside.clearVal()
    //divHashMatch.clearVal()
    divMat1.clearVal()
  }
  el.setVal=function(syncDb){
    var {Mat1, objHL}=syncDb;
    divIdMatch.setVal(syncDb)
    divNOutside.setVal(syncDb)
    var {boHL}=objHL;  if(boHL) return 
    //divHashMatch.setVal(syncDb)
    divMat1.setVal(Mat1)
    divCategoryTab.setVal(syncDb)
  }

  el.linkFilterFirstT2D=createElement('a').myText('filterFirst').prop({ href:""}).on('click', methGoToTitle);

  el.linkDb=createElement('a').myText('db-file').prop({href:""}).on('click', methGoToTitle);

  var hT2D=createElement('b').myText('Tree to Db')
  var divButton=createElement('div').myAppend(hT2D, ' ', butCompareT2D, ' ', el.linkFilterFirstT2D, ' | ' , el.linkDb).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', opacity:0.8}); //, butSyncDb


  var strTitleDefault=`______nName(nId)\nFiles: -(-)\nFolders: -(-)\nDb: -(-})`


  

  var PathCur=gThis[`Path${charSide}`]
  var divIdMatch=createElement('div'); divIdMatchCreator(divIdMatch, makeOpenExtCB(PathCur.hl))
  //var divHashMatch=createElement('div'); divHashMatchCreator(divHashMatch, makeOpenExtCB(PathCur.hash))
  var divNOutside=divNOutsideCreator(createElement('div'));

  var divMat1=createElement('div').myHtml(`SM-Combos: `);
  divSMMatchCreator(divMat1, makeOpenExtCB(PathCur.STMatch1_02), null, makeOpenExtCB(PathCur.STMatch1_12), makeOpenExtCB(PathCur.STMatch1_20), makeOpenExtCB(PathCur.STMatch1_21), makeOpenExtCB(PathCur.STMatch1_22));
  
  var divCategoryTab=el.divCategoryTab=divT2DTabCreator(createElement('div'), charSide)

//   var htmlMoreInfo=`Renamed: <button class=smallBut>-</button>, 
// Without shortcut: <button class=smallBut>-</button>` 
//   var divMoreInfo=createElement('div').myHtml(htmlMoreInfo);
//   var But=divMoreInfo.querySelectorAll('button');
//   var [but1T1, butMore]=But

  //var {cbFun}=ObjOpenExtData.T2D_renamed;  but1T1.myText('-').on('click',cbFun)
  //var {cbFun}=ObjOpenExtData.T2D_resultMore;  butMore.myText('-').on('click',cbFun)
  var divCategoryTabW=createElement('div').myAppend(divCategoryTab)  //, divMoreInfo

  var divResult=createElement('div')
  divResult.myAppend(divIdMatch, divMat1, divCategoryTabW); //, divHashMatch, divNOutside


  el.myAppend(divButton, divResult); // divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
  return el
}




gThis.divFolderInfoCreator=function(el, ...Fun){
  el.clearVal=function(){
    butCreatedF.myText(`-`).prop({title:undefined})
    butDeletedF.myText(`-`).prop({title:undefined})
  }
  el.setVal=function(syncT2T){
    var {arrDeleteF,arrCreateF}=syncT2T
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    butCreatedF.myText(`${nCreateF}`).prop({title:formatTitle(arrCreateF)})
    butDeletedF.myText(`${nDeleteF}`).prop({title:formatTitle(arrDeleteF)})
  }

  var [funC, funD]=Fun
  var title=PathT2T.createdF.leaf
  var butCreatedF=createElement('a').myText(`-`).addClass('smallBut').on('click',funC).prop({href:"", title});
  var title=PathT2T.deletedF.leaf
  var butDeletedF=createElement('a').myText(`-`).addClass('smallBut').on('click',funD).prop({href:"", title});

  el.myAppend(`Folders: created: `, butCreatedF, `, deleted: `, butDeletedF); 
  return el
}



gThis.divT2TTabCreator=function(el){
  var self=el
  el.clearVal=function(){
    butDeleteNWriteRam.prop({disabled:true});   butDeleteNWrite.prop({disabled:true})
    but1T1Rename.prop({disabled:true});   butViaARename.prop({disabled:true})
    //divMat1.clearVal();
    divMat2.clearVal(); divMat3.clearVal()

    var title=undefined;
    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    but1T1List.myText('-').prop({title});  span1T1Action.myText('-')
    spanNAncestorOnlyRenamed.myText('-'); butAncestorFList.myText('-').prop({title})
    butViaAList.myText('-').prop({title});  spanViaAAction.myText('-')
    butChanged.myText('-').prop({title});  spanChangedAction.myText('-')
    
    butMultList.myText('-').prop({title});  spanMultActionD.myText('-');  spanMultActionC.myText('-')
    
    butCreated.myText('-').prop({title}); butDeleted.myText('-').prop({title});
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(syncT2T){
    this.syncT2T=syncT2T

    var {arrSource, arrTarget, arrSourceUntouched, arrSourceReusedName, arrCreate, arrDelete, arrSourceIddByFolder, arrAncestorOnlyRenamed, Mat1, Mat2, Mat3, nAncestorOnlyRenamed, arrCreateF, arrDeleteF}=syncT2T

    var nSource=arrSource.length, nTarget=arrTarget.length
    var nUntouched=arrSourceUntouched.length
    var nReusedName=arrSourceReusedName.length
    var nCreate=arrCreate.length,  nDelete=arrDelete.length
    var nIddByFolder=arrSourceIddByFolder.length
    var nAncestorOnlyRenamedFolder=arrAncestorOnlyRenamed.length
    var nCreateF=arrCreateF.length, nDeleteF=arrDeleteF.length

    //divMat1.setVal(Mat1);
    divMat2.setVal(Mat2); divMat3.setVal(Mat3)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)
    //var {NA, NB}=Mat2.getN(), n11=NA[1][1]
    var arrSourceTmp=[].concat(Mat2.arrA[1][1]);
    var arrTargetTmp=[].concat(Mat2.arrB[1][1]);
    var arrTmp=[arrSourceTmp.slice(0,nShortListMax), arrTargetTmp.slice(0,nShortListMax)]; 
    var arrTmp=Mat.transpose(arrTmp)
    var n11=arrTmp.length
    var funTmp=r=>`S: ${r[0].strName}\n  T: ${r[1].strName}`
    but1T1List.myText(n11).prop({title:formatTitle(arrTmp, undefined, funTmp)}); span1T1Action.myText(n11); but1T1Rename.prop({disabled:!n11});
    spanNAncestorOnlyRenamed.myText(nAncestorOnlyRenamed)
    var funTmp=r=>`S: ${r.Key[0]}\n  T: ${r.Key[1]}`
    butAncestorFList.myText(nAncestorOnlyRenamedFolder).prop({title:formatTitle(arrAncestorOnlyRenamed, undefined, funTmp)})
    butViaAList.myText(nIddByFolder).prop({title:formatTitle(arrSourceIddByFolder)}); spanViaAAction.myText(nIddByFolder); butViaARename.prop({disabled:!nIddByFolder})


    butChanged.myText(nReusedName).prop({title:formatTitle(arrSourceReusedName)}); spanChangedAction.myText(nReusedName);
    // var {NA, NB}=Mat3.getN()
    // var nAMult = NA[1][2] + NA[2][1] + NA[2][2]
    // var nBMult = NB[1][2] + NB[2][1] + NB[2][2]
    var arrSourceTmp=[].concat(Mat3.arrA[1][2], Mat3.arrA[2][1], Mat3.arrA[2][2]);
    var arrTargetTmp=[].concat(Mat3.arrB[1][2], Mat3.arrB[2][1], Mat3.arrB[2][2]);
    var ArrSourceTmp=[].concat(Mat3.ArrA[1][2], Mat3.ArrA[2][1], Mat3.ArrA[2][2]);
    var ArrTargetTmp=[].concat(Mat3.ArrB[1][2], Mat3.ArrB[2][1], Mat3.ArrB[2][2]);
    var nAMult = arrSourceTmp.length,  nBMult = arrTargetTmp.length
    var strT=nAMult+" \\ "+nBMult
    spanMultActionD.myText(nBMult); spanMultActionC.myText(nAMult)
    butMultList.myText(strT).prop({title:formatTitleMult(ArrSourceTmp, ArrTargetTmp)});
    butCreated.myText(nCreate).prop({title:formatTitle(arrCreate)}); spanCreatedAction.myText(nCreate)
    butDeleted.myText(nDelete).prop({title:formatTitle(arrDelete)}); spanDeletedAction.myText(nDelete)

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)
    var nShortCut=nUntouched+n11+nIddByFolder; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nReusedName+nBMult+nDelete, nCreateTmp=nReusedName+nAMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);
    var boDCAction=Boolean(nDeleteTmp+nCreateTmp+ nCreateF+nDeleteF)
    butDeleteNWriteRam.prop({disabled:!boDCAction});   butDeleteNWrite.prop({disabled:!boDCAction})

  }
  var htmlHead=`
<tr><th colspan=2>Matching</th> <th rowspan=2>nS</th> <th rowspan=2>nT</th> <th rowspan=2>Cate­gorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Na&shy;me</th> <th>SM</th> <th>Short-cut</th> <th>Del­ete</th> <th title="(Re-) Write the file to the target.">Wri­te</th></tr>`

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a> <a href="">Compare</a></td><td>Renamed (1T1)</td>  <td><span>-</span> <button>Rename</button></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>1T1-files not renamed in the <font title="The leaf: the actual file name (the part furthest to the right (furthest from the root))\nSo the file is in an folder (an ancestor) that has been renamed.">leaf:</font> <span class=entry>-</span>. <font title="Number of involved ancestors">Ancestors:</font> <a href="">-</a>  </td></tr>
<tr><th>-</th><th>ViaA</th> <td colspan=2><a href="">-</a></td><td><font title="Identified via 1T1-files only renamed in ancestor">Renamed (ViaA)</font></td>  <td><span>-</span> <button>Rename</button></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>(Created / Deleted)</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td><td>Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span> </td> <td><span>-</span> </td></tr>
<tr><td colspan=6></td><td colspan=2> <button title='Do delete &amp; write actions, as per the result of running "Compare"'>Do D&W actions <br/>(direct)</button> <button title="Do delete &amp; write actions, as per the current state of the result-files">Do D&W actions</button></td></tr>`
//<button>Delete</button> <button>Create</button>   <br/>(read fr files)
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  var arrTR=[...tBody.children]
  var [trUntouched, trMat2, tr1T1, trViaAExtra, trViaA, trMat3, trChanged, trCreatedNDeleted, trMult, trSum, trDeleteNWrite]=arrTR; //trMat1, 

  var arrTRT=[trUntouched, tr1T1, trViaA, trChanged, trMult]
  arrTRT.forEach(ele=>ele.children[2]?.css({'text-align':'center'})); //Centering merged nS/nT columns
  var arrTRT=[trChanged]
  arrTRT.forEach(ele=>ele.children[5]?.css({'text-align':'center'})); //Centering merged Delete/Create columns

  trSum.css({'font-weight':'bold'})
  
  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  var [but1T1List, but1T1Compare, span1T1Action, but1T1Rename]=tr1T1.querySelectorAll('a,button,span')
  var [spanNAncestorOnlyRenamed, butAncestorFList]=trViaAExtra.querySelectorAll('a,span')
  var [butViaAList, spanViaAAction, butViaARename]=trViaA.querySelectorAll('a,button,span')
  var [butChanged,spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [butCreated, butDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [butMultList, spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span'); //,butDelete,butCreate
  var [butDeleteNWriteRam, butDeleteNWrite]=trDeleteNWrite.querySelectorAll('button'); 


  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat2, divMat3]=arrDup; //divMat1, 
  divSMMatchCreator(divMat2, makeOpenExtCB(PathT2T.STMatch2_02), null, makeOpenExtCB(PathT2T.STMatch2_12), makeOpenExtCB(PathT2T.STMatch2_20), makeOpenExtCB(PathT2T.STMatch2_21), makeOpenExtCB(PathT2T.STMatch2_22));
  divSMMatchCreator(divMat3); // , makeOpenExtCB(PathT2T.STMatch3)

  var arrButt=tBody.querySelectorAll('button'); 
  //var [but1T1, but1T1Rename, butViaA, butViaARename, butAncestorFList, butChanged, butCreated, butDeleted]=arrButt; 
  //arrButt.forEach(ele=>ele.addClass('smallBut'))
  
  but1T1List.on('click', makeOpenExtCB(PathT2T.renamed))
  but1T1Rename.on('click', funRenameFinishToTree);
  //var leafA=LeafResultFile.T2D_renamed
  //var leafB=LeafResultFile.T2T_renamed
  var leafA=PathS.renamed.leaf
  var leafB=PathT2T.renamed.leaf
  but1T1Compare.prop('title',`Compare ${leafA} and  ${leafB} (Opens in Meld.)`).css({'font-size':"0.85em"}).on('click',  async function(ev){
    ev.preventDefault()
    var strExec='meld'
    var strA=PathS.renamed.fsName, strB=PathT2T.renamed.fsName;
    var arrCommand=[strExec, strA, strB]
    if(strOS=="win32"){
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    }else{
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    } 
  })

  butViaAList.on('click', makeOpenExtCB(PathT2T.renamedAdditional))
  butViaARename.on('click', funRenameFinishToTreeAdditional);
  butAncestorFList.on('click', makeOpenExtCB(PathT2T.ancestor))
  butChanged.on('click', makeOpenExtCB(PathT2T.changed))
  butMultList.on('click', makeOpenExtCB(PathT2T.STMatch3))
  butCreated.on('click', makeOpenExtCB(PathT2T.created))
  butDeleted.on('click', makeOpenExtCB(PathT2T.deleted))
  // butCreate.on('click', funCreate)
  // butDelete.on('click', funDelete)
  butDeleteNWriteRam.css({'text-wrap':'pretty'}).on('click', async function(){
    setMess('DeleteNWriteRam: Making changes...'); blanket.show();
    var [err]=await self.syncT2T.makeDeleteNWriteChanges();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err]=await self.syncT2T.deleteFolders(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess('DeleteNWriteRam: Done'); blanket.hide();
  })
  butDeleteNWrite.css({'text-wrap':'pretty'}).on('click', async function(){
    setMess('DeleteNWrite',null,1); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}=result
    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir
    var arg={fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}
    var doDCActionsToTree=new DoDCActionsToTree(arg);
    var [err, result]=await doDCActionsToTree.read(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {nDelete, nCreate, nCreateF, nDeleteF}=result
    if(nDelete==0 && nCreate==0 && nCreateF==0 && nDeleteF==0) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}
    var strMess=doDCActionsToTree.getMess();
    //var boOK=confirm(strMess)
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) { setMess('DeleteNWrite: aborting.'); blanket.hide(); return; }
    setMess('DeleteNWrite: Making changes...');
    var [err]=await doDCActionsToTree.makeChanges(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess('DeleteNWrite: Done'); blanket.hide();
  });
  butDeleteNWriteRam.hide()

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

  el.clearVal=function(){
    divFolderInfo.clearVal()
    divMat1.clearVal();
    divCategoryTab.clearVal()
  }
  el.setVal=function(syncT2T){
    var {Mat1}=syncT2T;
    divFolderInfo.setVal(syncT2T)
    divMat1.setVal(Mat1)
    divCategoryTab.setVal(syncT2T)
  }

  var funT2T=async function(){
    var boSync=this===butSyncT2T
    var strMess=(boSync?'Sync':'Compare')+' T2T ...'
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote, charTResS, charTResT, charFilterMethod, suffixFilterFirstT2T}=result
    //fiTargetDbDir||=fiTargetDir

    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirst=leafFilter+suffixFilterFirstT2T

    var [err]=await funFilterFirstCheckExistance(result); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var charTRes=IntTDiv[charTResS]>IntTDiv[charTResT]?charTResS:charTResT
      
    var arg={fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote, leafFilter, leafFilterFirst, charTRes, charFilterMethod};
    var syncT2T=new SyncT2T(arg);
    var [err]=await syncT2T.constructorPart2();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }
    var [err]=await syncT2T.compare();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }

    syncT2T.format(settings.leafDb)
    await syncT2T.writeToFile()

    el.setVal(syncT2T)

    if(boSync){
      if(!syncT2T.boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide(); return;  }
      if(boAskBeforeWrite){
        var strMess=syncT2T.makeConfirmMess();
        //var boOK=confirm(strMess);
        var boOK=await myConfirmer.confirm(strMess);
        if(!boOK) {setMess('Tree2Tree syncing: aborting.'); blanket.hide(); return}
      }
      var [err]=await syncT2T.makeChanges();   if(err) { debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }

    }
    var strMessA=boSync?'Sync':'Compare', strMess=`${strMessA} tree to tree: Done`
    setMess(strMess); blanket.hide();
  }

  var butCompareT2T=createElement('button').myAppend('Compare').on('click', funT2T);
  var butSyncT2T=createElement('button').myAppend('Sync').on('click', funT2T);
  gThis.funRenameFinishToTree=async function(){
    //myConsole.clear(); el.clearVal()
    setMess('Renaming', null, 1); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); blanket.hide(); return;}
    var {fiTargetDir:fiDir, fiTargetDbDir, strHostTarget, boRemote}=result;
    var fsRenameFile=PathT2T.renamed.fsName;
    //fiTargetDbDir||=fiTargetDir
    var arg={fiDir, fiTargetDbDir, strHostTarget, boRemote, fsRenameFile}
    var renameFinishToTree=new RenameFinishToTree(arg)
    await renameFinishToTree.read()
    var nRename=renameFinishToTree.arrRename.length
    if(nRename==0) {myConsole.log('Everything is up to date, aborting.'); blanket.hide(); return}
    if(boAskBeforeWrite){
      var strPlur=pluralS(nRename, "entry", "entries");
      var strMess=`Renaming ${nRename} ${strPlur}.`;
      //var boOK=confirm(strMess)
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {setMess('Renaming: Canceled'); blanket.hide(); return;}
    }
    await renameFinishToTree.makeChanges();
    setMess('Renaming: Done'); blanket.hide();
  }
  gThis.funRenameFinishToTreeAdditional=async function(){
    //myConsole.clear(); el.clearVal()
    setMess('Renaming additional', null, 1); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiTargetDir:fiDir, fiTargetDbDir, strHostTarget, boRemote}=result;
    var fsRenameFile=PathT2T.renamedAdditional.fsName;
    var arg={fiDir, fiTargetDbDir, strHostTarget, boRemote, fsRenameFile}
    var renameFinishToTree=new RenameFinishToTree(arg)
    await renameFinishToTree.read()
    var nRename=renameFinishToTree.arrRename.length
    if(nRename==0) {setMess('Everything is up to date, aborting.'); blanket.hide(); return}
    if(boAskBeforeWrite){
      var strPlur=pluralS(nRename, "entry", "entries");
      var strMess=`Renaming ${nRename} ${strPlur}.`;
      //var boOK=confirm(strMess)
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {setMess('Renaming: Canceled'); blanket.hide(); return;}
    }
    await renameFinishToTree.makeChanges();
    setMess('Renaming additional: Done'); blanket.hide();
  }
  // var butRenameFinishToTree=createElement('button').myAppend('Rename finish to tree').prop({title:`Rename according to \n${LeafResultFile.T2T_renamed} \nto target tree.`}).on('click', funRenameFinishToTree);
  // var butRenameFinishToTreeAdditional=createElement('button').myAppend('Rename finish to tree (additional)').prop({title:`Rename according to \n${LeafResultFile.T2T_renamedAdditional} \nto target tree.`}).on('click', funRenameFinishToTreeAdditional);


  el.linkFilterFirstT2T=createElement('a').myText('filterFirstT2T').prop({href:""}).on('click', methGoToTitle);

  var butSyncT2TBrutal=createElement('button').myAppend('Sync (no SC for renamed)').attr({'title':'Sync wo renaming\nFiles with the same name, size \nand mod-time are left untouched.\nOthers are overwritten'}).on('click', async function(){
    setMess('Sync brutal ...'); blanket.show(); //myConsole.clear(); el.clearVal(); 
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg=copySome({}, result, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "charTResS", "charTResT", "strHostTarget", "boRemote"])
    var {charTResS, charTResT, charFilterMethod, suffixFilterFirstT2T}=result,  leafFilter=LeafFilter[charFilterMethod]
    var leafFilterFirst=leafFilter+suffixFilterFirstT2T

    var [err]=await funFilterFirstCheckExistance(result); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}

    var charTRes=IntTDiv[charTResS]>IntTDiv[charTResT]?charTResS:charTResT
    extend(arg,{leafFilter, leafFilterFirst, charTRes, charFilterMethod})
    var syncT2TBrutal=new SyncT2TBrutal(arg);
    await syncT2TBrutal.constructorPart2()
    var [err, boChanged]=await syncT2TBrutal.compare(); if(err) { myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(!boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide();  return;  }
    if(boAskBeforeWrite){
      //setMess('(click approve)');
      var strMess=syncT2TBrutal.makeConfirmMess();
      //var boOK=confirm(strMess)
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {setMess('Sync brutal: aborting.'); blanket.hide(); return}
    }
    setMess('Making changes', null, true)
    await syncT2TBrutal.makeChanges()
    setMess('Sync brutal: Done'); blanket.hide();
  }); //.css({position:'absolute', right:'0px'})


  var hT2T=createElement('b').myText('Tree to tree');
  var divSpace=createElement('div').css({flex:'1'});
  var divButton=createElement('div').myAppend(hT2T, butCompareT2T, el.linkFilterFirstT2T, butSyncT2TBrutal).css({display:'flex', 'align-items':'center', 'column-gap':'3px', background:'var(--bg-color)', flex:"0 1", border:"solid 1px", 'flex-wrap':'wrap', position:'sticky', opacity:0.8, top:0}); //, butWriteMTimeOnSource , butSyncT2T


  var divFolderInfo=divFolderInfoCreator(createElement('div'), makeOpenExtCB(PathT2T.createdF), makeOpenExtCB(PathT2T.deletedF))

  var divMat1=createElement('div').myHtml(`SM-Combos: `);
  divSMMatchCreator(divMat1, makeOpenExtCB(PathT2T.STMatch1_02), null, makeOpenExtCB(PathT2T.STMatch1_12), makeOpenExtCB(PathT2T.STMatch1_20), makeOpenExtCB(PathT2T.STMatch1_21), makeOpenExtCB(PathT2T.STMatch1_22));
  
  var divCategoryTab=el.divCategoryTab=divT2TTabCreator(createElement('div'))
  el.myAppend(divButton, divFolderInfo, divMat1, divCategoryTab); // divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%"}); //, height:"100%"
  return el
}


// Create ObjByHash
  // Marking
// nUnchanged
// boCopyToTarget
// nDelete

// nCopyOnTarget
// nMoveOnTarget

// Copy of ObjByHash

  // Create result files
// copyToTarget
// copyOnTarget
// moveOnTarget




gThis.divT2TTabUsingHashCreator=function(el){
  var self=el
  el.clearVal=function(){
    //butDeleteNWriteRam.prop({disabled:true});
    butDeleteNWrite.prop({disabled:true})
    var title=undefined;
    aCopyToTarget.myText('-').prop({title});  aCopyOnTarget1.myText('-').prop({title});  aCopyOnTarget2.myText('-').prop({title})
    aMoveOnTarget.myText('-').prop({title});  aMoveOnTarget.myText('-').prop({title});  aMoveOnTargetNSetMTime.myText('-').prop({title}); aCategoryDelete.myText('-').prop({title}); aCategorySetMTime.myText('-').prop({title});
    spanUnchanged.myText('-');
    
  }
  // nCopyToTarget, nCopyOnTarget1, nCopyOnTarget2, nMoveOnTarget, nDelete, nUnchanged
  el.setVal=function(syncT2T){
    this.syncT2T=syncT2T;

    //var {StrHov, objN, nExactTot}=syncT2T
    var {ObjFeedback, nExactTot, boChanged}=syncT2T
    var Key=['copyToTarget', 'categoryDelete', 'copyOnTarget1', 'copyOnTarget2', 'moveOnTarget', 'moveOnTargetNSetMTime', 'categorySetMTime']

    var But= {copyToTarget:aCopyToTarget, categoryDelete:aCategoryDelete, copyOnTarget1:aCopyOnTarget1, copyOnTarget2:aCopyOnTarget2, moveOnTarget:aMoveOnTarget, moveOnTargetNSetMTime:aMoveOnTargetNSetMTime, categorySetMTime:aCategorySetMTime}

    //var boAny=false
    for(var key of Key){
      var objFeedback=ObjFeedback['obj'+ucfirst(key)];
      var {strHov, nFile, nS, nT}=objFeedback
      var but=But[key];
      var n=nFile??nT
      //boAny||=Boolean(n)
      but.myText(n).prop({title:strHov});
    }

    //butDeleteNWrite.prop({disabled:!boAny})
    butDeleteNWrite.prop({disabled:!boChanged})
    spanUnchanged.myText(nExactTot);

  }

  // nCopyToTarget, nCopyOnTarget1, nCopyOnTarget2, nMoveOnTarget, nDelete, nUnchanged
  var htmlHead=`
<tr><th></th> <th>n</th></tr>`

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>CopyToTarget</th><td><a href="">-</a></td></tr>
<tr><th>CopyOnTarget1</th><td><a href="">-</a></td></tr>
<tr><th>CopyOnTarget2</th><td><a href="">-</a></td></tr>
<tr><th title="Renaming operations">MoveOnTarget</th><td><a href="">-</a></td></tr>
<tr><th title="Renaming operations">MoveOnTargetNSetMTime</th><td><a href="">-</a></td></tr>
<tr><th>Deleted</th><td><a href="">-</a></td></tr>
<tr><th>CategorySetMTime</th><td><a href="">-</a></td></tr>
<tr><th>Unchanged</th><td><span>-</span></td></tr>
<tr><td></td><td> <button>Do actions</button></td></tr>`
//<button>Delete</button> <button>Create</button>   <br/>(read fr files)
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA]=tHead.children
  var [,thN]=tHeadRA.children; thN.css({'text-align':'right'})
  var arrTR=[...tBody.children]
  var [trCopyToTarget, trCopyOnTarget1, trCopyOnTarget2, trMoveOnTarget, trMoveOnTargetNSetMTime, trCategoryDelete, trCategorySetMTime, trUnchanged, trDeleteNWrite]=arrTR; //trMat1, 

  arrTR.forEach(ele=>ele.children[1]?.css({'text-align':'right'})); 
  
  var [aCopyToTarget]=trCopyToTarget.querySelectorAll('a')
  var [aCopyOnTarget1]=trCopyOnTarget1.querySelectorAll('a')
  var [aCopyOnTarget2]=trCopyOnTarget2.querySelectorAll('a')
  var [aMoveOnTarget]=trMoveOnTarget.querySelectorAll('a')
  var [aMoveOnTargetNSetMTime]=trMoveOnTargetNSetMTime.querySelectorAll('a')
  var [aCategoryDelete]=trCategoryDelete.querySelectorAll('a')
  var [aCategorySetMTime]=trCategorySetMTime.querySelectorAll('a')
  var [spanUnchanged]=trUnchanged.querySelectorAll('a,span')
  var [butDeleteNWrite]=trDeleteNWrite.querySelectorAll('button'); 

  aCopyToTarget.on('click', makeOpenExtCB(PathT2T.copyToTarget))
  aCopyOnTarget1.on('click', makeOpenExtCB(PathT2T.copyOnTarget1))
  aCopyOnTarget2.on('click', makeOpenExtCB(PathT2T.copyOnTarget2))
  aMoveOnTarget.on('click', makeOpenExtCB(PathT2T.moveOnTarget))
  aMoveOnTargetNSetMTime.on('click', makeOpenExtCB(PathT2T.moveOnTargetNSetMTime))
  aCategoryDelete.on('click', makeOpenExtCB(PathT2T.categoryDelete))
  aCategorySetMTime.on('click', makeOpenExtCB(PathT2T.categorySetMTime))


  butDeleteNWrite.css({'text-wrap':'pretty'}).on('click', async function(){
    this.prop({disabled:true})
    setMess('DeleteNWrite: Making changes...'); blanket.show();
    var [err]=await self.syncT2T.makeChanges();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    setMess('DeleteNWrite: Done');
    await argumentTab.setTLastSync()
    blanket.hide();
  })
  // butDeleteNWrite.css({'text-wrap':'pretty'}).on('click', async function(){
  //   setMess('DeleteNWrite',null,1); blanket.show();
  //   var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
  //   var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}=result
  //   //if(!fiTargetDbDir) fiTargetDbDir=fiTargetDir
  //   var arg={fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}
  //   var doDCActionsToTree=new DoDCActionsToTree(arg);
  //   var [err, result]=await doDCActionsToTree.read(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
  //   var {nDelete, nCreate, nCreateF, nDeleteF}=result
  //   if(nDelete==0 && nCreate==0 && nCreateF==0 && nDeleteF==0) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}
  //   var strMess=doDCActionsToTree.getMess();
  //   //var boOK=confirm(strMess)
  //   var boOK=await myConfirmer.confirm(strMess);
  //   if(!boOK) { setMess('DeleteNWrite: aborting.'); blanket.hide(); return; }
  //   setMess('DeleteNWrite: Making changes...');
  //   var [err]=await doDCActionsToTree.makeChanges(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
  //   setMess('DeleteNWrite: Done'); blanket.hide();
  // });
  // butDeleteNWriteRam.hide()

  el.myAppend(table);  //, butSetLastSync
  return el
}

/***********************************************
 *   divT2TUsingHashCreator
 **********************************************/
gThis.divT2TUsingHashCreator=function(el){

  el.setUp=function(){
  }

  el.clearVal=function(){
    divFolderInfo.clearVal()
    divMat1.clearVal();
    divCategoryTab.clearVal()
  }
  el.setVal=function(syncT2T){
    var {Mat1}=syncT2T;
    divFolderInfo.setVal(syncT2T)
    divMat1.setVal(Mat1)
    divCategoryTab.setVal(syncT2T)
  }

  var funT2T=async function(){
    var boSync=this===butSyncT2T
    var strMess=(boSync?'Sync':'Compare')+' T2T ...'
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote, charTResS, charTResT, charFilterMethod, suffixFilterFirstT2T}=result
    //if(!fiTargetDbDir) fiTargetDbDir=fiTargetDir

    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirst=leafFilter+suffixFilterFirstT2T

    var [err]=await funFilterFirstCheckExistance(result); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var charTRes=IntTDiv[charTResS]>IntTDiv[charTResT]?charTResS:charTResT
      
    var arg={fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote, leafFilter, leafFilterFirst, charTRes, charFilterMethod};
    var syncT2T=new SyncT2TUsingHash(arg);
    var [err]=await syncT2T.constructorPart2();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }
    var [err]=await syncT2T.compare();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }

    syncT2T.format(settings.leafDb)
    await syncT2T.writeToFile()

    el.setVal(syncT2T)
    if(!syncT2T.boChanged){
      await argumentTab.setTLastSync()
    }

    if(boSync){
      if(!syncT2T.boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide(); return;  }
      if(boAskBeforeWrite){
        var strMess=syncT2T.makeConfirmMess();
        //var boOK=confirm(strMess);
        var boOK=await myConfirmer.confirm(strMess);
        if(!boOK) {setMess('Tree2Tree syncing: aborting.'); blanket.hide(); return}
      }
      var [err]=await syncT2T.makeChanges();   if(err) { debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }

    }
    var strMessA=boSync?'Sync':'Compare', strMess=`${strMessA} tree to tree: Done`
    setMess(strMess); blanket.hide();
  }

  var butCompareT2T=createElement('button').myAppend('Compare').on('click', funT2T);
  var butSyncT2T=createElement('button').myAppend('Sync').on('click', funT2T);

  el.linkFilterFirstT2T=createElement('a').myText('filterFirst').prop({href:""}).on('click', methGoToTitle);

  var hT2T=createElement('b').myText('Tree to tree');
  var divSpace=createElement('div').css({flex:'1'});
  var divButton=createElement('div').myAppend(hT2T, butCompareT2T, el.linkFilterFirstT2T).css({display:'flex', 'align-items':'center', 'column-gap':'3px', background:'var(--bg-color)', flex:"0 1", border:"solid 1px", 'flex-wrap':'wrap', position:'sticky', opacity:0.8, top:0}); //, butWriteMTimeOnSource , butSyncT2T, butSyncT2TBrutal

  var divFolderInfo=divFolderInfoCreator(createElement('div'), makeOpenExtCB(PathT2T.createdF), makeOpenExtCB(PathT2T.deletedF))

  var divMat1=createElement('div').myHtml(`SM-Combos: `).hide();
  divSMMatchCreator(divMat1, makeOpenExtCB(PathT2T.STMatch1_02), null, makeOpenExtCB(PathT2T.STMatch1_12), makeOpenExtCB(PathT2T.STMatch1_20), makeOpenExtCB(PathT2T.STMatch1_21), makeOpenExtCB(PathT2T.STMatch1_22));
  
  var divCategoryTab=el.divCategoryTab=divT2TTabUsingHashCreator(createElement('div'))
  el.myAppend(divButton, divFolderInfo, divMat1, divCategoryTab); // divConsoleT2D, divConsoleT2T, divConsole

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
    //divConsoleContainer.myAppend(dragHR, butClear, divConsole)
    //divFoot.myAppend(myConfirmer)
    elConsoleContainerTop.clear().myAppend(divFoot);
  }
  el.setBottomMargin=function(hNew){
    var hTmp=hNew+3
    divT2D.css({'margin-bottom':hTmp+'px'})
    divT2DT.css({'margin-bottom':hTmp+'px'})
    //divT2T.css({'margin-bottom':hTmp+'px'});
    divT2TUsingHash.css({'margin-bottom':hTmp+'px'});
    //divMid.css({'margin-bottom':hNew+'px'})
  }
  el.clearColumnDivsResult=function(){ 
    //divT2D.toggleResult(false); divT2T.toggleResult(false);
    divT2D.clearVal(); divT2DT.clearVal();  divT2TUsingHash.clearVal(); //divT2T.clearVal();
  }

  // var divTopOpenStuff=divTopOpenStuffCreator(createElement('div')).css({'text-align':'center'})
  // divTopOpenStuff.css({background:"var(--bg-color)", 'margin-bottom':'3px'});

  var divTopContainer=createElement('div').css({'text-align':'center'});
  //var divConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:0.8});
  gThis.divT2D=divT2DCreator(createElement('div'), 'S')
  gThis.divT2DT=divT2DCreator(createElement('div'), 'T')
  //gThis.divT2T=divT2TCreator(createElement('div'))
  gThis.divT2TUsingHash=divT2TUsingHashCreator(createElement('div'))



  var divMid=createElement('div').myAppend(divT2D, divT2DT, divT2TUsingHash).css({display:'grid', 'grid-template-columns':'1fr 1fr 1fr', 'column-gap':'3px','margin-top':'0px', 'margin-bottom':'0px', flex:'1 1 auto', 'overflow-y':'auto'}); //.addClass('unselectable')
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
  //   //var boOK=confirm(strMess);
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
    //var boOK=confirm(strMess);
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
    var strMess=`Setting tLastCheck${charSide} (to current time)?`; //
    //var boOK=confirm(strMess);
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
    var {boSelected, label, fiSourceDir, fiTargetDir, fiTargetDbDir, suffixFilterFirstT2T, charTResS, charTResT, strHostTarget, charFilterMethod}=rowData; //, leafFilterFirst, leafDb
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
  rDefault:{ind:0, boSelected:false, label:'', fiSourceDir:'', fiTargetDir:'', fiTargetDbDir:'', suffixFilterFirstT2T:'', charTResS:'9', charTResT:'9', tLastSync:0, tLastCheckS:0, tLastCheckT:0, strHostTarget:'', charFilterMethod:"b"}, // , leafFilterFirst:'', leafDb:''
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
Note 2: in T2T-top-level the "suffixFilterFirstT2T"-setting is added to the filter-file-name (so .buvt-filterWHATEVER or .rsync-filterWHATEVER)`
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
    var rT={label, fiSourceDir, fiTargetDir, fiTargetDbDir, suffixFilterFirstT2T, charTResS, charTResT, strHostTarget, charFilterMethod}; //, leafFilterFirst, leafDb
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
  
  [labLabel, labSourceDir, labTargetDir, labTargetDbDir, labFilterFirstT2T, labTResS, labTResT, labHostTarget, labFilterMethod].forEach(ele=>ele.css({'margin-right':'0.5em'})); //, labFilterFirst_Db, labFilterFirst, labDb
  [inpLabel, inpSourceDir, inpTargetDir, inpTargetDbDir, inpFilterFirstT2T, selTResS, selTResT, inpHostTarget, selFilterMethod].forEach(ele=>ele.css({display:'block',width:'100%'})); //, inpFilterFirst_Db, inpFilterFirst, inpDb
  var inpNLab=[labLabel, inpLabel, labSourceDir, inpSourceDir, labTargetDir, inpTargetDir, labTargetDbDir, inpTargetDbDir, labFilterFirstT2T, inpFilterFirstT2T, labTResS, selTResS, labTResT, selTResT, labHostTarget, inpHostTarget, labFilterMethod, selFilterMethod]; //, labFilterFirst, inpFilterFirst, labDb, inpDb
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


  //label, fiSourceDir, fiTargetDir, fiTargetDbDir, leafFilterFirst, suffixFilterFirstT2T, leafDb, charTResS, charTResT, strHostTarget, charFilterMethod
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

