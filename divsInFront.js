
"use strict"


// viewFront (viewFrontCreator)
//   divTopContainer
//   divMid
//     divT2DS (divT2DCreator)
//       divButton
//       divResult
//         divIdMatch (divIdMatchCreator)
//           menuId (menuIdCreator)
//         divCatPrim1 (divCatPrimCreator)
//         divTabW
//           divTab (divT2DTabCreator)
//             divCatPrim2 (divCatPrimCreator)
//     divT2DT (divT2DCreator)
//       ... (same as divT2DS (above))
//     divT2TUsingHash (divT2TUsingHashCreator)
//       divButton
//       divFolderInfo
//       divConflict
//       divTab (divTabT2TUsingHashCreator)



/***********************************************************
 * divIdMatchCreator, divCatPrimCreator
 ***********************************************************/

gThis.menuIdCreator=function(el, fun){
  el.clearVal=function(){
    tdAllFile.myText(`-(-)`);
    tdAllFolder.myText(`-(-)`);
    tdAllDb.myText(`-(-)`);
    //tdMultFile.myText(`-(-)`);
    tdMultFolder.myText(`-(-)`);
    tdMultDb.myText(`-(-)`);

    aMult.myText(`-(-)`)
  }
  el.setVal=function(objHL){
    var {nMultf, nIdMultf, nIdf, nTreef,   nMultF, nIdMultF, nIdF, nTreeF,  nMultDb, nIdMultDb, nIdDb, nDb,  boHL,  strShortList}=objHL

    tdAllFile.myText(`${nIdf}(${nTreef})`);
    tdAllFolder.myText(`${nIdF}(${nTreeF})`);
    tdAllDb.myText(`${nIdDb}(${nDb})`);
    //tdMultFile.myText(`${nIdMultf}(${nMultf})`);
    tdMultFolder.myText(`${nIdMultF}(${nMultF})`);
    tdMultDb.myText(`${nIdMultDb}(${nMultDb})`);

    aMult.myText(`${nIdMultf}(${nMultf})`).prop({title:strShortList})
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
  
  var aMult=createElement('a').prop({href:""}).myHtml('-').on('click',fun);
  tdMultFile.myAppend(aMult)
  
  el.myAppend(tableAll, tableMult);
  return el
}


gThis.divIdMatchCreator=function(el, ...Fun){
  el.clearVal=function(){
    //hovDetail.myText(`-(-)`)
    // hovDetail.myText(`Tot: -(-) Mult: -(-)`)
    // menuId.clearVal()
    aMultF.prop({title:undefined}).myText('-')
    aMult.prop({title:undefined}).myText('-')
    spanHLCheckResult.myText('').css({color:'var(--text-color)'})
  }
  el.setVal=function(objHL){
    var {nMultf, nIdMultf, nIdf, nTreef,   nMultF, nIdMultF, nIdF, nTreeF,  boHL, strShortListF, strShortList}=objHL; //,  nMultDb, nIdMultDb, nIdDb, nDb
    // hovDetail.myText(`Tot: ${nIdf}(${nTreef}) Mult: ${nIdMultf}(${nMultf})`)
    // menuId.setVal(objHL)
    aMultF.prop({title:strShortListF}).myText(`${nIdMultF}(${nMultF})`)
    aMult.prop({title:strShortList}).myText(`${nIdMultf}(${nMultf})`)
    spanHLCheckResult.css({color:boHL?'var(--text-red)':'var(--text-green)'}).myText(boHL?'FAIL, ABORTING':'OK'); //Hard link check 
  }
  
  var title=`Hard-links are forbidden. This since the developer haven't figured out how to deal with them.
If you still have hard-links among your files, I suggest you use the filter function to skip them.`
  var bHLCheck=createElement('b').myText('Hard-link test').prop({title})

  // var menuId=createElement('div')
  // menuIdCreator(menuId,fun)
  // menuId.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); 

  // var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  // var elWrap=createElement('span').myAppend(hovDetail, menuId)
  // var elPar=elBody;  myMenu(elWrap, elPar)

  var aMultF=createElement('a').prop({href:''}).myText('-').on('click',Fun[0]);
  var aMult=createElement('a').prop({href:''}).myText('-').on('click',Fun[1]);

  var spanHLCheckResult=createElement('span').css({'font-weight':'bold'});

  el.myAppend(bHLCheck, ', failures: folders: ', aMultF, ', files: ', aMult, ' ', spanHLCheckResult); //, ', ', spanLab, ': ', spanMultSum, elWrap
  //el.css({display:'inline'})
  return el
}


gThis.divOwnCounterCreator=function(el, ...Fun){
  el.clearVal=function(){
    spanOwn.myText('-'); spanOthers.myText('-');
    spanOwnDiff.myText('-'); spanOthersDiff.myText('-');
    spanOthersLab.prop({title:undefined})
  }
  el.setVal=function(objOwnCounter){
    var {nTrOwn, nTrOthers, nDbOwn, nDbOthers, FleSub, boDataInTop}=objOwnCounter;

    var strT=boDataInTop?'-':nTrOwn; spanOwn.myText(strT);
    var nDiff=nTrOwn-nDbOwn, strDiff=nDiff.toString(); if(nDiff>0) strDiff='+'+strDiff; else if(nDiff==0) strDiff='±'+strDiff;
    if(boDataInTop) strDiff='-';   spanOwnDiff.myText(strDiff);

    spanOthers.myText(nTrOthers);
    var nDiff=nTrOthers-nDbOthers, strDiff=nDiff.toString(); if(nDiff>0) strDiff='+'+strDiff; else if(nDiff==0) strDiff='±'+strDiff;
    spanOthersDiff.myText(strDiff);

    // var nMax=20, text=FleSub.join(', ');
    // if(text.length>nMax) text=text.slice(0,nMax)+='…';
    // if(text.length) text=', '+text
    var title=FleSub.length?FleSub.join('\n'):undefined;   spanOthersLab.prop({title})
  }

  var spanOwn=createElement('span').myText('-'), spanOthers=createElement('span').myText('-');
  var spanOthersLab=createElement('span').myText('Others');
  var spanOwnDiff=createElement('span').myText('-'), spanOthersDiff=createElement('span').myText('-');
  var div=createElement('div').myAppend('Own files: ', spanOwn, '(', spanOwnDiff, '), ', spanOthersLab, ': ', spanOthers, '(', spanOthersDiff, ') ');

  el.myAppend(div);
  return el
}


gThis.divDbRelationTestCreator=function(el, fun){ // find_XTM_SMHash
  el.clearVal=function(){
    aMult.myText(`-`).prop({title:undefined})
    spanCheckResult.myText('').css({color:'var(--text-color)'})
  }
  el.setVal=function(arg){
    var {nMult, nKeyMult, boOK, strShortList}=arg
    aMult.myText(`${nKeyMult}(${nMult})`).prop({title:strShortList})
    spanCheckResult.css({color:boOK?'var(--text-green)':'var(--text-red)'}).myText(boOK?'OK':'FAIL, ABORTING'); //Hard link check 
  }
  
  var spanCheckResult=createElement('span').css({'font-weight':'bold'}).myText('');

  var aMult=createElement('a').prop({href:''}).on('click',fun);
  
  var title=`Db relation test
Checking (own) files of db so that all sm-to-hash relations are X-to-1.
In ohther words, checking that if two (or more) files have the same sm, then they must also have the same hash.
Listed to the right is the relations (files) that fails the test: Files with the same sm but at least one of them has a different hash.`
  var bDbOwnCheck=createElement('b').myText('Db relation test').prop({title})

  el.myAppend(bDbOwnCheck, ', failures: ', aMult, ', ', spanCheckResult); //, ', ', spanLab, ': ', spanMultSum
  return el
}





gThis.menuCatPrimCreator=function(el, ...Fun){
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
  var htmlHead=`<tr><th class=backcrossed><span title=Tree>Tr</span> <span>Db</span></th> <th>0</th> <th>1</th> <th>Many</th> <td>∑</td></tr>`; //S⇣ \\ T⇾
  var htmlBody=
  `<tr><th>0</th><td><img/>(∞)</td><td><img/><span>-</span></td> <td><img/><span>-</span><a>-</a></td> <th><span>-</span></th> <th rowspan=3>Db: <span>-</span>(<span>-</span>)</th></tr>
  <tr><th>1</th><td><img/><span>-</span></td><td><img/><span>-</span><a>-</a></td>  <td><img/><span>-</span><a>-</a></td> <th><span>-</span></th></tr>
  <tr><th>Many</th><td><img/><span>-</span><a>-</a></td>  <td><img/><span>-</span><a>-</a></td>  <td><img/><span>-</span><a>-</a></td>  <th><span>-</span></th></tr>
  <tr><td>∑</td><th><span>-</span></th><th><span>-</span></th><th><span>-</span></th> <th rowspan=2 colspan=2>Tr⋂Db: <span title="Number of patterns that occur on both sides.">-</span><br/>Tr⋃Db: <span title="Total number of patterns">-</span></th></tr>
  <tr><td></td><th colspan=3>Tr: <span>-</span>(<span>-</span>)</th></tr>` //∪∩⋂⋃
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody);

  var [trH]=tHead.children;
  var [tr0, tr1, tr2, trSum, trSumS]=tBody.children
  var [thST,,,,tdT]=trH.children; //tdT.cssExc({'border-top':'hidden!important', 'border-right':'hidden!important', 'border-left':'solid', background:'transparent'}); // Sum-sign in upp-right corner
  thST.children[1].css({float:'right'})
  //var [,,,td22]=tr2.children; td22.cssExc({'border-top':'hidden!important', 'border-left':'hidden!important'})
  //var [tdTmp]=trSum.children; tdTmp.cssExc({'border-bottom':'hidden!important', 'border-left':'hidden!important', 'text-align':'end', background:'transparent'});  // Sum-sign in lower-left corner

  var Img0=tr0.querySelectorAll('img');
  var arr0=tr0.querySelectorAll('span'), [span01,span02,span0XSum, spanSumPatT, spanSumT]=arr0
  var But0=tr0.querySelectorAll('a'), [but02]=But0;
  var Img1=tr1.querySelectorAll('img');
  var arr1=tr1.querySelectorAll('span'), [span10,span11,span12, span1XSum]=arr1
  var But1=tr1.querySelectorAll('a'), [but11,but12]=But1
  var Img2=tr2.querySelectorAll('img');
  var arr2=tr2.querySelectorAll('span'), [span20,span21,span22, span2XSum]=arr2
  var But2=tr2.querySelectorAll('a'), [but20,but21,but22]=But2
  var [spanX0Sum, spanX1Sum, spanX2Sum, spanTot, spanBoth]=trSum.querySelectorAll('span')
  var [spanSumPatS, spanSumS]=trSumS.querySelectorAll('span');

  var fleImgT="icons/CatPrimE/";
  [...Img0].forEach((ele, i)=>ele.attr({src:`${fleImgT}0T${i}.png`}));
  [...Img1].forEach((ele, i)=>ele.attr({src:`${fleImgT}1T${i}.png`}));
  [...Img2].forEach((ele, i)=>ele.attr({src:`${fleImgT}2T${i}.png`}));
  [...Img0, ...Img1, ...Img2].forEach(ele=>ele.css({zoom:0.4, display:'block'}));

  [...arr0, ...arr1, ...arr2].forEach(ele=>ele.addClass('num'));
  [...But0, ...But1, ...But2].forEach(ele=>ele.addClass('smallBut').prop({href:""}));
  //tr2.css({'border-bottom':'solid'})
  //var arrT=tr2.children; arrT=[...arrT].slice(0,-1); arrT.forEach(ele=>ele.css({'border-bottom':'solid'}));
  [...tr2.children].slice(0,-1).forEach(ele=>ele.css({'border-bottom':'solid'}));

  //var arrT=tBody.querySelectorAll('td:nth-of-type(3)');  arrT.forEach(ele=>ele.css({'border-right':'solid'}))
  tBody.querySelectorAll('td:nth-of-type(3)').forEach(ele=>ele.css({'border-right':'solid'}))

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

gThis.divCatPrimCreator=function(el, ...Fun){
  el.clearVal=function(){
    menuCatPrim.clearVal()
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

    menuCatPrim.setVal(MatLoc)
  }

  
  var menuCatPrim=createElement('div')
  menuCatPrimCreator(menuCatPrim, ...Fun); //, undefined, fun
  menuCatPrim.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); // 'font-size':'0.9rem', 
  //el.spanDetail=createElement('span'); //.myAppend(menuCatPrim).hide(); 
  var aOpenList=createElement('a').myText(`List`).addClass('smallBut').on('click',fun).prop({href:"", title:`List of multiples (Opens in external editor.)`});
  var fun=Fun.length==1?Fun[0]:false
  aOpenList.toggle(fun);  //.css({'margin-left':'0.3em'})
  //var butOpenPop=createElement('button').myText(`Details`).addClass('smallBut').css({'margin-left':'0.3em'}).prop({title:`More Detailed`}).on('click',()=>divT2T.toggleDetail()); //el.spanDetail.toggle()
  var spanLab=createElement('span').myText(`Multiples`);

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  //popupHover(hovDetail, menuCatPrim);
  var elWrap=createElement('span').myAppend(hovDetail, menuCatPrim)
  var elPar=elBody
  myMenu(elWrap, elPar)

  el.myAppend(elWrap, ' ', aOpenList); //, ', ', spanLab, ': ', spanMultSum
  //el.css({display:'inline'})
  return el
}




gThis.divDbCoverageTestCreator=function(el, ...Fun){
  el.clearVal=function(){
    aListS.myText(`-`).prop({title:undefined})
    aListT.myText(`-`).prop({title:undefined})
    spanCheckResult.myText('').css({color:'var(--text-color)'})
  }
  el.setVal=function(objCoverage){
    var {boOK, arrSourcefRem, arrTargetfRem, strShortListS, strShortListT}=objCoverage
    aListS.myText(arrSourcefRem.length).prop({title:strShortListS})
    aListT.myText(arrTargetfRem.length).prop({title:strShortListT})
    spanCheckResult.css({color:boOK?'var(--text-green)':'var(--text-red)'}).myText(boOK?'OK':'FAIL, ABORTING'); 
  }

  var bLab=createElement('b').myText(`Db coverage test`).prop({title:`Making sure all (parsed) files are actually in the db.
On the source side, the files are filtered (with leafFilterFirst as top filter)
On the target side, the files are NOT filtered at all. So if you have the files in the top level of the fs (like you might have on an external drive), then watch out for file added by the OS.`})
  var divLab=createElement('div').myAppend(bLab, ', failures:')
  var html=`<div>S: <a></a></div><div>T: <a></a></div>`;
  var divFlex=createElement('div').myHtml(html).css({display:"flex"});
  var Div=divFlex.querySelectorAll('div');  Div.forEach(s=>s.css({'flex-basis':'50%'}))
  var A=divFlex.querySelectorAll('a'), [aListS, aListT]=A;
  [aListS, aListT].forEach((ele,i)=>{ele.myText(`-`).addClass('smallBut').on('click',Fun[i]).prop({href:""});}); 

  var spanCheckResult=createElement('span').css({'font-weight':'bold'}).myText('');
  el.myAppend(divLab, divFlex, spanCheckResult).css({background:'var(--bg-color)', border:'1px solid'})

  return el
}

gThis.divFolderInfoCreator=function(el, ...Fun){
  el.clearVal=function(){
    aCreatedF.myText(`-`).prop({title:undefined})
    aDeletedF.myText(`-`).prop({title:undefined})
  }
  el.setVal=function(syncT2T){
    var {arrDeleteF,arrCreateF}=syncT2T
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    aCreatedF.myText(`${nCreateF}`).prop({title:formatTitleStrName(arrCreateF)})
    aDeletedF.myText(`${nDeleteF}`).prop({title:formatTitleStrName(arrDeleteF)})
  }

  var html=`<b>Folders:</b> created: <a></a>, deleted: <a></a>`;
 
   el.myHtml(html);
   var A=el.querySelectorAll('a'), [aCreatedF, aDeletedF]=A;
   A.forEach((ele,i)=>{ele.myText(`-`).addClass('smallBut').on('click',Fun[i]).prop({href:""});}); 

  // var [funC, funD]=Fun
  // var title=PathT2T.createdF.leaf
  // var aCreatedF=createElement('a').myText(`-`).addClass('smallBut').on('click',funC).prop({href:"", title});
  // var title=PathT2T.deletedF.leaf
  // var aDeletedF=createElement('a').myText(`-`).addClass('smallBut').on('click',funD).prop({href:"", title});
  // el.myAppend(`Folders: created: `, aCreatedF, `, deleted: `, aDeletedF); 
  return el
}
gThis.divConflictCreator=function(el, ...Fun){
  el.clearVal=function(){
    aLink.myText(`-`).prop({title:undefined})
    aCaseCollision.myText(`-`).prop({title:undefined})
    aReservedChar.myText(`-`).prop({title:undefined})
    //aReservedCharF.myText(`-`).prop({title:undefined})
  }
  el.setVal=function(syncT2T){
    var {ObjFeedback}=syncT2T, {objLink, objCaseCollision, objReservedChar, objReservedCharF}=ObjFeedback
    //var nLink=arrLink.length, nCaseCollision=arrCaseCollision.length, nReservedChar=arrReservedChar.length, nReservedCharF=arrReservedCharF.length
    var {nFile, strHov}=objLink; aLink.myText(`${nFile}`).prop({title:strHov})
    var {nFile, strHov}=objCaseCollision; aCaseCollision.myText(`${nFile}`).prop({title:strHov})
    var {nFile, strHov}=objReservedChar; aReservedChar.myText(`${nFile}`).prop({title:strHov})
    //var {nFile, strHov}=objReservedCharF; aReservedCharF.myText(`${nFile}`).prop({title:strHov})
  }

  var html=`<b>Skipped:</b>
 links: <a></a>, case-collisions: <a></a>, reserved-chars: <a></a>`; //, reserved-chars (Folders): <a></a>

  el.myHtml(html);
  var A=el.querySelectorAll('a'), [aLink, aCaseCollision, aReservedChar]=A; //aReservedCharF
  A.forEach((ele,i)=>{ele.myText(`-`).addClass('smallBut').on('click',Fun[i]).prop({href:""});}); 
  
  // var [funA, funB, funC, funD]=Fun
  // var aLink=createElement('a').myText(`-`).addClass('smallBut').on('click',funA).prop({href:""});
  // var aCaseCollision=createElement('a').myText(`-`).addClass('smallBut').on('click',funC).prop({href:""});
  // var aReservedChar=createElement('a').myText(`-`).addClass('smallBut').on('click',funD).prop({href:""});
  // var aReservedCharF=createElement('a').myText(`-`).addClass('smallBut').on('click',funB).prop({href:""});
  // el.myAppend(`Conflicts: links: `, aLink, `, case-collisions: `, aCaseCollision+`, reserved-chars: `, aReservedChar, `, reserved-chars (Folders): `, aReservedCharF); 
  return el
}


