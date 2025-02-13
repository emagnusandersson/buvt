
"use strict"


// viewFront (viewFrontCreator)
//   divTopContainer
//   divMid
//     divT2DS (divT2DCreator)
//       divButton
//       divResult
//         divIdMatch (divIdMatchCreator)
//           menuId (menuIdCreator)
//         divMat1 (divSMMatchCreator)
//         divTabW
//           divTab (divT2DTabCreator)
//             divMat2 (divSMMatchCreator)
//           divTabI (divT2DITabCreator)
//             divMat2 (divSMMatchCreator)
//     divT2DT (divT2DCreator)
//       ... (same as divT2DS (above))
//     divT2TUsingHash (divT2TUsingHashCreator)
//       divButton
//       divFolderInfo
//       divConflict
//       divTab (divTabT2TUsingHashCreator)



/***********************************************************
 * divIdMatchCreator, divSMMatchCreator
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
  el.setVal=function(syncDb){
    var {objHL}=syncDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL,  strTmpShortList}=objHL

    tdAllFile.myText(`${nIdf}(${nTreef})`);
    tdAllFolder.myText(`${nIdF}(${nTreeF})`);
    tdAllDb.myText(`${nIdDb}(${nDb})`);
    //tdMultFile.myText(`${nMultIdf}(${nMultf})`);
    tdMultFolder.myText(`${nMultIdF}(${nMultF})`);
    tdMultDb.myText(`${nMultIdDb}(${nMultDb})`);

    aMult.myText(`${nMultIdf}(${nMultf})`).prop({title:strTmpShortList})
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


gThis.divIdMatchCreator=function(el, fun){
  el.clearVal=function(){
    spanHLCheckResult.myText('-').css({color:'var(--text-color)'})
    //hovDetail.myText(`-(-)`)
    hovDetail.myText(`Tot: -(-) Mult: -(-)`)
    menuId.clearVal()
    aMult.prop({title:undefined})
    //aMult.myText('-(-)')
  }
  el.setVal=function(syncDb){
    var {objHL}=syncDb;
    var {nMultf, nMultIdf, nIdf, nTreef,   nMultF, nMultIdF, nIdF, nTreeF,  nMultDb, nMultIdDb, nIdDb, nDb,  boHL, strTmpShortList}=objHL
    spanHLCheckResult.css({color:boHL?'var(--text-red)':'var(--text-green)'}).myText(boHL?'FAIL, ABORTING':'OK'); //Hard link check 
    hovDetail.myText(`Tot: ${nIdf}(${nTreef}) Mult: ${nMultIdf}(${nMultf})`)
    menuId.setVal(syncDb)
    
    aMult.prop({title:strTmpShortList})
    //aMult.myText(`${nMultf}(${nMultIdf})`)
  }
  
  var spanHLCheckResult=createElement('span').css({'font-weight':'bold'}).myText('-');

  var menuId=createElement('div')
  menuIdCreator(menuId,fun)
  menuId.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); 

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  var elWrap=createElement('span').myAppend(hovDetail, menuId)
  var elPar=elBody;  myMenu(elWrap, elPar)

  var aMult=createElement('a').prop({href:''}).myText('Multiples').on('click',fun);; 

  el.myAppend('Ids (Hard-link check: ', spanHLCheckResult, '): ', elWrap, ', ', aMult); //, ', ', spanLab, ': ', spanMultSum
  //el.css({display:'inline'})
  return el
}






gThis.menuSMCreator=function(el, ...Fun){
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
  var [spanSumPatS, spanSumS]=trSumS.querySelectorAll('span');
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

gThis.divSMMatchCreator=function(el, ...Fun){
  el.clearVal=function(){
    menuSM.clearVal()
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

    menuSM.setVal(MatLoc)
  }

  
  var menuSM=createElement('div')
  menuSMCreator(menuSM, ...Fun); //, undefined, fun
  menuSM.css({background:'var(--bg-color)', width:'fit-content', padding:'1px', border:"4px solid var(--border-color)"}); // 'font-size':'0.9rem', 
  //el.spanDetail=createElement('span'); //.myAppend(menuSM).hide(); 
  var aOpenList=createElement('a').myText(`List`).addClass('smallBut').on('click',fun).prop({href:"", title:`List of multiples (Opens in external editor.)`});
  var fun=Fun.length==1?Fun[0]:false
  aOpenList.toggle(fun);  //.css({'margin-left':'0.3em'})
  //var butOpenPop=createElement('button').myText(`Details`).addClass('smallBut').css({'margin-left':'0.3em'}).prop({title:`More Detailed`}).on('click',()=>divT2T.toggleDetail()); //el.spanDetail.toggle()
  var spanLab=createElement('span').myText(`Multiples`);

  var hovDetail=hovHelp.cloneNode(1).css({'padding':'0 0.3em'}).myText('-');
  //popupHover(hovDetail, menuSM);
  var elWrap=createElement('span').myAppend(hovDetail, menuSM)
  var elPar=elBody
  myMenu(elWrap, elPar)

  el.myAppend(elWrap, ' ', aOpenList); //, ', ', spanLab, ': ', spanMultSum
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
    //aRenamed.myText('-').prop({title});  spanRenamedAction.myText('-')
    aM1T1.myText('-').prop({title});  span1T1Action.myText('-')
    aMult.myText('-').prop({title});
    spanMultActionC.myText('-'); spanMultActionD.myText('-');
    aCreated.myText('-').prop({title}); aDeleted.myText('-').prop({title});
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
    aChanged.myText('-').prop({title});  spanChangedAction.myText('-')
  }
  el.setVal=function(syncDb){
    this.syncDb=syncDb

    var {Mat1, Mat2, boChanged, arrSource, arrTarget, arrUntouched, arrSourceUntouched, arrTargetUntouched, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, ObjFeedback}=syncDb; //, arrSourceMMult, arrTargetMMult


    var arrSourceMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrTargetMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    var ArrSourceMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);

    //var nChanged=arrSourceChanged.length
    //var nIM=arrSourceIM.length,
    var nCreate=arrCreate.length, nDelete=arrDelete.length,    nSource=arrSource.length, nTarget=arrTarget.length, nUntouched=arrUntouched.length,    nM1T1=arrSourceM1T1.length, nSourceMMult=arrSourceMMult.length, nTargetMMult=arrTargetMMult.length


    //if(!boChanged) {myConsole.log('Everything is up to date, aborting.'); return;}
    divMat2.setVal(Mat2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)

    var fun1T1=r=>`${r[0].strName}\n  => ${r[1].strName}`
    //var arrTmp=[arrSourceIM.slice(0,nShortListMax), arrTargetIM.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    //aRenamed.myText(nIM).prop({title:formatTitleStr(arrTmp, fun1T1)});
    //aRenamed.myText(nIM).prop({title:formatTitleStrName(arrSourceIM)});
    //spanRenamedAction.myText(nIM)

    var arrTmp=[arrSourceM1T1.slice(0,nShortListMax), arrTargetM1T1.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    aM1T1.myText(nM1T1).prop({title:formatTitleStr(arrTmp, fun1T1)});
    span1T1Action.myText(nM1T1)
    // aM1T1.myText(nM1T1).prop({title:formatTitleStr(arrTmp, fun1T1)});
    // span1T1Action.myText(nM1T1);
    var strT=nSourceMMult+' \\ '+nTargetMMult;
    //aMult.myText(strT).prop({title:formatTitleMult(ArrSourceMMult, ArrTargetMMult)}); 
    var {strHov}=ObjFeedback.objSTMatch2;
    aMult.myText(strT).prop({title:strHov}); 
    spanMultActionC.myText(nSourceMMult); spanMultActionD.myText(nTargetMMult);

    aCreated.myText(nCreate).prop({title:formatTitleStrName(arrCreate)}); spanCreatedAction.myText(nCreate);
    aDeleted.myText(nDelete).prop({title:formatTitleStrName(arrDelete)}); spanDeletedAction.myText(nDelete);

    spanSumS.myText(nSource);  spanSumT.myText(nTarget);

    var nShortCut=nUntouched+nM1T1; spanSumSC.myText(nShortCut);
    var nDeleteTmp=nTargetMMult+nDelete, nCreateTmp=nSourceMMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);

    //aChanged.myText(nChanged).prop({title:formatTitleStrName(arrSourceChanged)});  spanChangedAction.myText(nChanged)

    var boAction=Boolean(nM1T1+nDeleteTmp+nCreateTmp)
    butDoActionRam.prop({disabled:!boAction});   butDoAction.prop({disabled:!boAction})

      // Checking the sums
    var nSourceCheck=nShortCut+nSourceMMult+nCreate, nTargetCheck=nShortCut+nTargetMMult+nDelete
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
<tr><th colspan=2>Matching</th> <th title="Number of files in S (S=source)" rowspan=2>nS</th> <th title="Number of files in T (T=target)" rowspan=2>nT</th> <th rowspan=2>Cate­gorized as:</th> <th colspan=3>Action</th></tr>
<tr><th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short­cut</th> <th>Del­ete</th> <th title="(Re-) Calculate the hashcode for the file ">Calc</th></tr>` // Un­touch­ed / 

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
<tr><th>-</th><th>1T1</th> <td colspan=2><a href="" class=input>-</a></td><td>Re­named</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <td title="Relations where the pattern exists once or more on both side (S and T) except for 1T1-relations. (1Tm+mTm+mT1)">Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>
<tr><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>Created / Deleted</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>


<tr><th colspan=2>Sum</th> <td><span>-</span></td> <td><span>-</span></td> <td></td>  <td><span>-</span></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><td colspan=5></td><td colspan=3> <button title='As per the result of running "Compare"'>Do actions<br/>(direct)</button> <button title="As per the current state of the result-files">Do actions</button></td></tr>`
// The pattern exists on both S and T and more than once on at least one of them. <br/>(read fr files)
  
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA,tHeadRB]=tHead.children
  var [,,,,thAction]=tHeadRA.children; thAction.css({'text-align':'center'})
  //var [trINM, trIN_, trI_M, tr_NM, tr_N_, trI__, tr__X]=tBody.children
  var arrTR=[...tBody.children]
  var [trUntouched, trMat2, tr1T1, trMult, trCreatedNDeleted, trSum, trChanged, trSyncAccordingToFiles]=arrTR;
  trSum.css({'font-weight':'bold'});
  //var arrT=[...trSum.children]; arrT.slice(1,3).forEach(ele=>ele.css({position:"relative"}));
  [...trSum.children].slice(1,3).forEach(ele=>ele.css({position:"relative"}))


  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  //var [aRenamed,spanRenamedAction]=trRenamed.querySelectorAll('a,span')
  var [aM1T1,span1T1Action]=tr1T1.querySelectorAll('a,span')
  var [aMult,spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [aCreated, aDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span')
  var [aChanged,spanChangedAction]=trChanged.querySelectorAll('a,span'); trChanged.hide()
  var [butDoActionRam, butDoAction]=trSyncAccordingToFiles.querySelectorAll('button'); 


  [spanSumS,spanSumT].forEach(ele=>ele.css({position:'absolute', top:'1px', backgroundColor:'var(--bg-color)', height:'-webkit-fill-available', minWidth:'-webkit-fill-available'}))
  spanSumS.css({right:'0'}); spanSumT.css({left:'0'})

  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat2]=arrDup;//divMat1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divSMMatchCreator(divMat2);

  var PathCur=gThis[`Path${charSide}`]
  //aRenamed.on('click', makeOpenExtCB(PathCur.renamed))
  aM1T1.on('click', makeOpenExtCB(PathCur.M1T1))
  aMult.on('click', makeOpenExtCB(PathCur.STMatch2))
  aCreated.on('click', makeOpenExtCB(PathCur.created))
  aDeleted.on('click', makeOpenExtCB(PathCur.deleted))
  aChanged.on('click', makeOpenExtCB(PathCur.changed))

  butDoActionRam.parentNode.css({'text-align':'center'})
  butDoActionRam.on('click', async function(){
    var {syncDb}=self
    butDoActionRam.prop({disabled:true}); butDoAction.prop({disabled:true})
    setMess('Do actionsRam ...'); blanket.show()

    var [err, boAbort]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(boAbort) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}

    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${syncDb.fsDb}`;
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {
        setMess('SyncDb: DoAction: aborting.');
        butDoActionRam.prop({disabled:false}); butDoAction.prop({disabled:false})
        blanket.hide(); return
      }
    }

    var [err]=await syncDb.writeDb()
    setMess('Do actionsRam: Done'); blanket.hide();
  })
  butDoAction.on('click', async function(){
    butDoActionRam.prop({disabled:true}); butDoAction.prop({disabled:true})
    setMess('Do actions ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, charTResS, charTResT, charFilterMethod, strHostTarget:strHost, boRemote}=result
    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir
    var boTarget=charSide=='T'
    var fiDir=boTarget?fiTargetDir:fiSourceDir
    //var fiDir=boTarget?fiTargetDbDir:fiSourceDir; // Old way
    var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    var charTRes=boTarget?charTResT:charTResS;
    if(!boTarget) {strHost="localhost"; boRemote=false; }
    var leafFilter=LeafFilter[charFilterMethod];
    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsDbDir]=await myRealPath(fiDbDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg={leafFilter, fsDir, fsDbDir, charTRes, charFilterMethod, strHost, boRemote, charSide}
    var syncDb=new SyncDb(arg);
    var [err]=await syncDb.readAction(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, boAbort]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(boAbort) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}
    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${syncDb.fsDb}`;
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {
        setMess('SyncDb: DoAction: aborting.');
        butDoActionRam.prop({disabled:false}); butDoAction.prop({disabled:false})
        blanket.hide(); return
      }
    }
    var [err]=await syncDb.writeDb(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}


    setMess('Do actions: Done'); blanket.hide();
  });
  butDoActionRam.hide()



  el.myAppend(table);   //divCollision
  return el
}




gThis.divT2DITabCreator=function(el, charSide){
  var self=el
  el.clearVal=function(){
    butDoActionRam.prop({disabled:true});   butDoAction.prop({disabled:true})
    divMat2.clearVal()
    var title=undefined
    spanUntouched.myText('-');  spanUntouchedAction.myText('-')
    aRenamed.myText('-').prop({title});  spanRenamedAction.myText('-')
    aCopiedNRenamedToOrigin.myText('-').prop({title});  spanCopiedNRenamedToOriginAction.myText('-')
    aChanged.myText('-').prop({title});  spanChangedAction.myText('-')
    aReusedName.myText('-').prop({title});  spanReusedNameAction.myText('-')
    aReusedId.myText('-').prop({title});  spanReusedIdAction.myText('-')
    aCreated.myText('-').prop({title}); aDeleted.myText('-').prop({title});
    aM1T1.myText('-').prop({title}); span1T1Action.myText('-');
    aMult.myText('-').prop({title}); spanMultActionC.myText('-'); spanMultActionD.myText('-');
    spanDeletedAction.myText('-');spanCreatedAction.myText('-')
    spanSumS.myText('-');  spanSumT.myText('-')
    spanSumSC.myText('-');  spanSumDelete.myText('-');  spanSumCreate.myText('-');
  }
  el.setVal=function(syncDb){
    this.syncDb=syncDb

    var {Mat1, Mat2, boChanged, arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, ObjFeedback}=syncDb; //, arrSourceMMult, arrTargetMMult

    var arrSourceMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrTargetMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    var ArrSourceMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);

    var nChanged=arrSourceChanged.length, nIM=arrSourceIM.length, nNM=arrSourceNM.length, nReusedName=arrSourceReusedName.length, nReusedId=arrSourceReusedId.length, nCreate=arrCreate.length, nDelete=arrDelete.length,    nSource=arrSource.length, nTarget=arrTarget.length, nUntouched=arrSourceUntouched.length,    nM1T1=arrSourceM1T1.length, nSourceMMult=arrSourceMMult.length, nTargetMMult=arrTargetMMult.length


    //if(!boChanged) {myConsole.log('Everything is up to date, aborting.'); return;}
    divMat2.setVal(Mat2)

    spanUntouched.myText(nUntouched);  spanUntouchedAction.myText(nUntouched)

    var fun1T1=r=>`${r[0].strName}\n  => ${r[1].strName}`
    var arrTmp=[arrSourceIM.slice(0,nShortListMax), arrTargetIM.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    aRenamed.myText(nIM).prop({title:formatTitleStr(arrTmp, fun1T1)});
    //aRenamed.myText(nIM).prop({title:formatTitleStrName(arrSourceIM)});
    spanRenamedAction.myText(nIM)
    aCopiedNRenamedToOrigin.myText(nNM).prop({title:formatTitleStrName(arrSourceNM)});  spanCopiedNRenamedToOriginAction.myText(nNM)
    aChanged.myText(nChanged).prop({title:formatTitleStrName(arrSourceChanged)});  spanChangedAction.myText(nChanged)
    aReusedName.myText(nReusedName).prop({title:formatTitleStrName(arrSourceReusedName)});  spanReusedNameAction.myText(nReusedName)
    aReusedId.myText(nReusedId).prop({title:formatTitleStrName(arrSourceReusedId)});  spanReusedIdAction.myText(nReusedId)
    aCreated.myText(nCreate).prop({title:formatTitleStrName(arrCreate)}); spanCreatedAction.myText(nCreate);
    aDeleted.myText(nDelete).prop({title:formatTitleStrName(arrDelete)}); spanDeletedAction.myText(nDelete);

    var arrTmp=[arrSourceM1T1.slice(0,nShortListMax), arrTargetM1T1.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
    aM1T1.myText(nM1T1).prop({title:formatTitleStr(arrTmp, fun1T1)});
    //aM1T1.myText(nM1T1).prop({title:formatTitleStrName(arrSourceM1T1)});
    span1T1Action.myText(nM1T1);
    var strT=nSourceMMult+' \\ '+nTargetMMult;


    //aMult.myText(strT).prop({title:formatTitleMult(ArrSourceMMult, ArrTargetMMult)}); 
    var {strHov}=ObjFeedback.objSTMatch2;
    aMult.myText(strT).prop({title:strHov}); 
    spanMultActionC.myText(nSourceMMult); spanMultActionD.myText(nTargetMMult);

    spanSumS.myText(nSource);
    spanSumT.myText(nTarget)

    var nShortCut=nUntouched+nIM+nNM; spanSumSC.myText(nShortCut);
    var nMatchButNoSC=nChanged+nReusedName+nReusedId+nM1T1, nDeleteTmp=nMatchButNoSC+nTargetMMult+nDelete, nCreateTmp=nMatchButNoSC+nSourceMMult+nCreate
    spanSumDelete.myText(nDeleteTmp);  spanSumCreate.myText(nCreateTmp);
    var boAction=Boolean(nIM+nNM+nDeleteTmp+nCreateTmp)
    butDoActionRam.prop({disabled:!boAction});   butDoAction.prop({disabled:!boAction})

      // Checking the sums
    var nSomeKindOfMatching=nShortCut+nMatchButNoSC
    var nSourceCheck=nSomeKindOfMatching+nSourceMMult+nCreate, nTargetCheck=nSomeKindOfMatching+nTargetMMult+nDelete
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
<tr><th>Id</th> <th>Na&shy;me</th> <th title="Size and Modification time">SM</th> <th>Short­cut</th> <th>Del­ete</th> <th title="(Re-) Calculate the hashcode for the file ">Calc</th></tr>` // Un­touch­ed / 

//<tr><td colspan=9>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>OK</th><th>OK</th><th>OK</th> <td colspan=2><span>-</span></td><td>Un­touched</td> <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>-</th><th>OK</th> <td colspan=2><a href="" class=input>-</a></td><td>Re­named</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>-</th><th>OK</th><th>OK</th> <td colspan=2><a href="" class=input>-</a></td><td title="A better label might be 'copiesThatHaveBeenRenamedToOrigin' 
That is: File copied, original file name made available (such as if the origin is deleted), then the copy is renamed to origin.
The label 'Defragmented' is questionable.
One could note that:
   On NTFS defragmentation does NOT change the fileId (but other operations may change it).
   On ext4 defragmentation probably doesn't change the inode either. (A bit difficult to find information about it.)">"Defrag­ment­ed"</td>  <td><span>-</span></td> <td colspan=2 class=crossed></td></tr>
<tr><th>OK</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Changed</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>OK</th><th>-</th> <td colspan=2><a href="">-</a></td><td>Reused name</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>OK</th><th>-</th><th>-</th> <td colspan=2><a href="">-</a></td><td title="Ex: Renamed and changed">Reused id</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><td colspan=9>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
<tr><th>-</th><th>-</th><th>-</th> <td><a href="">-</a></td> <td><a href="">-</a></td> <td>Created / Deleted</td>  <td class=crossed></td> <td><span>-</span></td> <td><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>1T1</th> <td colspan=2><a href="">-</a></td> <td title="One-to-one relation (The SM combination exists exactly once on S and T)\nEx: File copied, origin deleted.">1T1</td>  <td class=crossed></td> <td colspan=2><span>-</span></td></tr>
<tr><th>-</th><th>-</th><th>Mult</th> <td colspan=2><a href="">-</a></td> <td title="Relations where the pattern exists once or more on both side (S and T) except for 1T1-relations. (1Tm+mTm+mT1)">Mult</td>  <td class=crossed></td> <td><span>-</span></td><td><span>-</span></td></tr>

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
  var [trUntouched, trRenamed, trCopiedNRenamedToOrigin, trChanged, trReusedName, trReusedId, trMat2, trCreatedNDeleted, tr1T1, trMult, trSum, trSyncAccordingToFiles]=arrTR; 
  trSum.css({'font-weight':'bold'});
  [...trSum.children].slice(1,3).forEach(ele=>ele.css({position:"relative"}))


  var [spanUntouched,spanUntouchedAction]=trUntouched.querySelectorAll('span')
  var [aRenamed,spanRenamedAction]=trRenamed.querySelectorAll('a,span')
  var [aCopiedNRenamedToOrigin,spanCopiedNRenamedToOriginAction]=trCopiedNRenamedToOrigin.querySelectorAll('a,span')
  var [aChanged,spanChangedAction]=trChanged.querySelectorAll('a,span')
  var [aReusedName,spanReusedNameAction]=trReusedName.querySelectorAll('a,span')
  var [aReusedId,spanReusedIdAction]=trReusedId.querySelectorAll('a,span')
  var [aCreated, aDeleted, spanDeletedAction, spanCreatedAction]=trCreatedNDeleted.querySelectorAll('a,span')
  var [aM1T1,span1T1Action]=tr1T1.querySelectorAll('a,span')
  var [aMult,spanMultActionD, spanMultActionC]=trMult.querySelectorAll('a,span')
  var [spanSumS,spanSumT,spanSumSC,spanSumDelete,spanSumCreate]=trSum.querySelectorAll('span')
  var [butDoActionRam, butDoAction]=trSyncAccordingToFiles.querySelectorAll('button'); 

  [spanSumS,spanSumT].forEach(ele=>ele.css({position:'absolute', top:'1px', backgroundColor:'var(--bg-color)', height:'-webkit-fill-available', minWidth:'-webkit-fill-available'}))
  spanSumS.css({right:'0'}); spanSumT.css({left:'0'})
    


  var arrDup=tBody.querySelectorAll('.dupEntry');
  var [divMat2]=arrDup;//divMat1, 

  // el.toggleDetail=function(){
  //   arrDup.forEach(ele=>ele.spanDetail.toggle())
  // }

  divSMMatchCreator(divMat2);

  var PathCur=gThis[`Path${charSide}`]
  aRenamed.on('click', makeOpenExtCB(PathCur.renamed))
  aCopiedNRenamedToOrigin.on('click', makeOpenExtCB(PathCur.defragmented))
  aChanged.on('click', makeOpenExtCB(PathCur.changed))
  aReusedName.on('click', makeOpenExtCB(PathCur.reusedName))
  aReusedId.on('click', makeOpenExtCB(PathCur.reusedId))
  aCreated.on('click', makeOpenExtCB(PathCur.created))
  aDeleted.on('click', makeOpenExtCB(PathCur.deleted))
  aM1T1.on('click', makeOpenExtCB(PathCur.M1T1))
  aMult.on('click', makeOpenExtCB(PathCur.STMatch2))

  butDoActionRam.parentNode.css({'text-align':'center'})
  butDoActionRam.on('click', async function(){
    var {syncDb}=self
    butDoActionRam.prop({disabled:true}); butDoAction.prop({disabled:true})
    setMess('Do actionsRam ...'); blanket.show()
    
    //var [boAbort, strMess]=syncDb.getMess()
    var [err, boAbort]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(boAbort) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}

    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${syncDb.fsDb}`;
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {
        setMess('SyncDbI: DoAction: aborting.');
        butDoActionRam.prop({disabled:false}); butDoAction.prop({disabled:false})
        blanket.hide(); return
      }
    }

    var [err]=await syncDb.writeDb()
    setMess('Do actionsRam: Done'); blanket.hide();
  })
  butDoAction.on('click', async function(){
    butDoActionRam.prop({disabled:true}); butDoAction.prop({disabled:true})
    setMess('Do actions ...'); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, charTResS, charTResT, charFilterMethod, strHostTarget:strHost, boRemote}=result
    //var fiTargetDbDir=fiTargetDbDir||fiTargetDir
    var boTarget=charSide=='T'
    var fiDir=boTarget?fiTargetDir:fiSourceDir
    //var fiDir=boTarget?fiTargetDbDir:fiSourceDir; // Old way
    var fiDbDir=boTarget?fiTargetDbDir:fiSourceDir
    var charTRes=boTarget?charTResT:charTResS;
    if(!boTarget) {strHost="localhost"; boRemote=false; }
    var leafFilter=LeafFilter[charFilterMethod];
    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsDbDir]=await myRealPath(fiDbDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg={leafFilter, fsDir, fsDbDir, charTRes, charFilterMethod, strHost, boRemote, charSide}
    var syncDb=new SyncDbI(arg);
    var [err]=await syncDb.readAction(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, boAbort]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    if(boAbort) {setMess('Nothing to do, aborting.'); blanket.hide(); return;}
    if(boAskBeforeWrite){
      setMess('Overwrite ?')
      var strMess=`Overwrite ${syncDb.fsDb}`;
      var boOK=await myConfirmer.confirm(strMess);
      if(!boOK) {
        setMess('SyncDbI: DoAction: aborting.');
        butDoActionRam.prop({disabled:false}); butDoAction.prop({disabled:false})
        blanket.hide(); return
      }
    }
    var [err]=await syncDb.writeDb(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}


    setMess('Do actions: Done'); blanket.hide();
  });
  butDoActionRam.hide();

  
  el.myAppend(table);  //divCollision
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
    var boTarget=charSide=='T'
    var boSync=this===butSyncDb
    var strAction=(boSync?'Sync':'Compare');
    var strSide=boTarget?'target':'source'
    var strMess=`${strAction} tree-2-db on ${strSide}...`;
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show(); viewFront.divT2TUsingHash.clearVal();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, charTResS, charTResT, charFilterMethod, strHostTarget, boRemote, boIncIdS, boIncIdT}=result

    if(boTarget){
      

      var fiDir=fiTargetDir, fiDbDir=fiTargetDbDir, charTRes=charTResT;
      //var fiDir=fiTargetDbDir;  // Old way
      var boIncId=el.boIncId=boIncIdT;
      var strHost=strHostTarget;
    }else{
      var fiDir=fiSourceDir, fiDbDir=fiSourceDir, charTRes=charTResS;
      var boIncId=el.boIncId=boIncIdS;
      var strHost="localhost"; boRemote=false;
    }

    var leafFilter=LeafFilter[charFilterMethod];
    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var [err, fsDbDir]=await myRealPath(fiDbDir); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var arg={leafFilter, fsDir, fsDbDir, charTRes, charFilterMethod, strHost, boRemote, charSide}
    if(boIncId){var syncDb=new SyncDbI(arg); }else {var syncDb=new SyncDb(arg);}
    var [err]=await syncDb.compare();   if(err) { debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }
    el.setVal(syncDb);
    if(boSync){ 
      
      if(syncDb.objHL.boHL) {setMess('Hard links found, aborting.'); blanket.hide(); return}
      if(!syncDb.boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide(); return;  }

      var [err]=await syncDb.createSyncData(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
      if(boAskBeforeWrite){
        setMess('Overwrite ?')
        var strMess=`Overwrite ${syncDb.fsDb}`;
        var boOK=await myConfirmer.confirm(strMess);
        if(!boOK) {var strI=boIncId?'I':'';  setMess(`SyncDb${strI}: aborting.`); blanket.hide(); return}
      }
      var [err]=await syncDb.writeDb()
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
    divTab.clearVal()
    divTabI.clearVal()
    //butMore.myText('-')
    divIdMatch.clearVal()
    //divNOutside.clearVal()
    //divHashMatch.clearVal()
    divMat1.clearVal()
  }
  el.setVal=function(syncDb){
    var {Mat1, objHL}=syncDb;
    divIdMatch.setVal(syncDb)
    //divNOutside.setVal(syncDb)
    var {boHL}=objHL;  if(boHL) return 
    //divHashMatch.setVal(syncDb)
    divMat1.setVal(Mat1)
    if(el.boIncId) {divTabI.setVal(syncDb)} else {divTab.setVal(syncDb)}
  }

  el.linkFilterFirstT2D=createElement('a').myText('filterFirst').prop({ href:""}).on('click', methGoToTitle);

  el.linkDb=createElement('a').myText('db-file').prop({href:""}).on('click', methGoToTitle);

  var hT2D=createElement('b').myText('Tree to Db')
  var divButton=createElement('div').myAppend(hT2D, ' ', butCompareT2D, ' ', el.linkFilterFirstT2D, ' | ' , el.linkDb).css({background:'var(--bg-color)', flex:"0 1", top:0, border:"solid 1px", position:'sticky', opacity:0.8}); //, butSyncDb


  var strTitleDefault=`______nName(nId)\nFiles: -(-)\nFolders: -(-)\nDb: -(-})`

  var PathCur=gThis[`Path${charSide}`]
  var divIdMatch=createElement('div'); divIdMatchCreator(divIdMatch, makeOpenExtCB(PathCur.hl))
  //var divNOutside=divNOutsideCreator(createElement('div'));

  var divMat1=createElement('div').myHtml(`SM-Combos: `);
  divSMMatchCreator(divMat1, makeOpenExtCB(PathCur.STMatch1_02), null, makeOpenExtCB(PathCur.STMatch1_12), makeOpenExtCB(PathCur.STMatch1_20), makeOpenExtCB(PathCur.STMatch1_21), makeOpenExtCB(PathCur.STMatch1_22));
  
  var divTab=el.divTab=divT2DTabCreator(createElement('div'), charSide)
  var divTabI=el.divTabI=divT2DITabCreator(createElement('div'), charSide)

//   var htmlMoreInfo=`Renamed: <button class=smallBut>-</button>, 
// Without shortcut: <button class=smallBut>-</button>` 
//   var divMoreInfo=createElement('div').myHtml(htmlMoreInfo);
//   var But=divMoreInfo.querySelectorAll('button');
//   var [aM1T1, butMore]=But

  //var {cbFun}=ObjOpenExtData.T2D_renamed;  aM1T1.myText('-').on('click',cbFun)
  //var {cbFun}=ObjOpenExtData.T2D_resultMore;  butMore.myText('-').on('click',cbFun)
  var divTabW=createElement('div').myAppend(divTab, divTabI)  //, divMoreInfo

  var divResult=createElement('div')
  divResult.myAppend(divIdMatch, divMat1, divTabW); //, divHashMatch, divNOutside


  el.myAppend(divButton, divResult); // divConsoleT2D, divConsoleT2T, divConsole

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%", gap:'2px'}); //, height:"100%"
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




gThis.divTabT2TUsingHashCreator=function(el){
  var self=el
  el.clearVal=function(){
    //butDeleteNWriteRam.prop({disabled:true});
    butDeleteNWrite.prop({disabled:true})
    var title=undefined;
    aCategoryDelete.myText('-').prop({title});  aCopyOnTarget1.myText('-').prop({title})
    aMoveOnTarget.myText('-').prop({title});  aMoveOnTarget.myText('-').prop({title});  aMoveOnTargetNSetMTime.myText('-').prop({title}); aCategorySetMTime.myText('-').prop({title});
    aCopyToTarget.myText('-').prop({title});  aCopyOnTarget2.myText('-').prop({title});
    spanUnchanged.myText('-');
    
  }
  // nCopyToTarget, nCopyOnTarget2, nCopyOnTarget1, nMoveOnTarget, nDelete, nUnchanged
  el.setVal=function(syncT2T){
    this.syncT2T=syncT2T;

    //var {StrHov, objN, nExactTot}=syncT2T
    var {ObjFeedback, nExactTot, boChanged}=syncT2T
    var Key=['categoryDelete', 'copyOnTarget1', 'moveOnTarget', 'moveOnTargetNSetMTime', 'categorySetMTime', 'copyToTarget', 'copyOnTarget2']

    var But= {categoryDelete:aCategoryDelete, copyOnTarget1:aCopyOnTarget1, moveOnTarget:aMoveOnTarget, moveOnTargetNSetMTime:aMoveOnTargetNSetMTime, categorySetMTime:aCategorySetMTime, copyToTarget:aCopyToTarget, copyOnTarget2:aCopyOnTarget2}

    for(var key of Key){
      var objFeedback=ObjFeedback['obj'+ucfirst(key)];
      var {strHov, nFile, nS, nT}=objFeedback
      var but=But[key];
      var n=nFile??nT
      but.myText(n).prop({title:strHov});
    }

    butDeleteNWrite.prop({disabled:!boChanged})
    spanUnchanged.myText(nExactTot);
  }

  // nCopyToTarget, nCopyOnTarget2, nCopyOnTarget1, nMoveOnTarget, nDelete, nUnchanged
  var htmlHead=`
<tr><th></th> <th>n</th></tr>`

//<tr><td colspan=8>  <div class=dupEntry>SM-Combos: </div>  </td></tr>
  var htmlBody=`
<tr><th>Deleted</th><td><a href="">-</a></td></tr>
<tr><th title="Copy files that already exists on the target">CopyOnTarget1</th><td><a href="">-</a></td></tr>
<tr><th title="Rename files">MoveOnTarget</th><td><a href="">-</a></td></tr>
<tr><th title="Rename files + set new mod-time">MoveOnTargetNSetMTime</th><td><a href="">-</a></td></tr>
<tr><th title="Set new mod-time">SetMTime</th><td><a href="">-</a></td></tr>
<tr><th>CopyToTarget</th><td><a href="">-</a></td></tr>
<tr><th title="Copy files from CopyToTarget">CopyOnTarget2</th><td><a href="">-</a></td></tr>
<tr><th>Unchanged</th><td><span>-</span></td></tr>
<tr><td></td><td> <button>Do actions</button></td></tr>`
//<button>Delete</button> <button>Create</button>   <br/>(read fr files)
  var tHead=createElement('thead').myHtml(htmlHead);
  var tBody=createElement('tbody').myHtml(htmlBody);
  var table=createElement('table').myAppend(tHead, tBody).addClass('main');

  var [tHeadRA]=tHead.children
  var [,thN]=tHeadRA.children; thN.css({'text-align':'right'})
  var arrTR=[...tBody.children]
  var [trCategoryDelete, trCopyOnTarget1, trMoveOnTarget, trMoveOnTargetNSetMTime, trCategorySetMTime, trCopyToTarget, trCopyOnTarget2, trUnchanged, trDeleteNWrite]=arrTR; //trMat1, 

  arrTR.forEach(ele=>ele.children[1]?.css({'text-align':'right'})); 
  
  var [aCategoryDelete]=trCategoryDelete.querySelectorAll('a')
  var [aCopyOnTarget1]=trCopyOnTarget1.querySelectorAll('a')
  var [aMoveOnTarget]=trMoveOnTarget.querySelectorAll('a')
  var [aMoveOnTargetNSetMTime]=trMoveOnTargetNSetMTime.querySelectorAll('a')
  var [aCategorySetMTime]=trCategorySetMTime.querySelectorAll('a')
  var [aCopyToTarget]=trCopyToTarget.querySelectorAll('a')
  var [aCopyOnTarget2]=trCopyOnTarget2.querySelectorAll('a')
  var [spanUnchanged]=trUnchanged.querySelectorAll('a,span')
  var [butDeleteNWrite]=trDeleteNWrite.querySelectorAll('button'); 

  aCategoryDelete.on('click', makeOpenExtCB(PathT2T.categoryDelete))
  aCopyOnTarget1.on('click', makeOpenExtCB(PathT2T.copyOnTarget1))
  aMoveOnTarget.on('click', makeOpenExtCB(PathT2T.moveOnTarget))
  aMoveOnTargetNSetMTime.on('click', makeOpenExtCB(PathT2T.moveOnTargetNSetMTime))
  aCategorySetMTime.on('click', makeOpenExtCB(PathT2T.categorySetMTime))
  aCopyToTarget.on('click', makeOpenExtCB(PathT2T.copyToTarget))
  aCopyOnTarget2.on('click', makeOpenExtCB(PathT2T.copyOnTarget2))


  butDeleteNWrite.css({'text-wrap':'pretty'}).on('click', async function(){
    this.prop({disabled:true})
    setMess('DeleteNWrite: Making changes...'); blanket.show();
    var [err]=await self.syncT2T.makeChanges();  if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var strMess='DeleteNWrite: Done'; setMess(strMess); myConsole.printNL(strMess)
    await argumentTab.setTLastSync()
    blanket.hide();
  })

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
    divConflict.clearVal()
    divMat1.clearVal();
    divTab.clearVal()
  }
  el.setVal=function(syncT2T){
    var {Mat1}=syncT2T;
    divFolderInfo.setVal(syncT2T)
    divConflict.setVal(syncT2T)
    divMat1.setVal(Mat1)
    divTab.setVal(syncT2T)
  }

  var funT2T=async function(){
    //try{
    var boSync=this===butSyncT2T
    var strMess=(boSync?'Sync':'Compare')+' T2T ...'
    myConsole.clear(); el.clearVal(); setMess(strMess); blanket.show();
    var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {charTResS, charTResT, charFilterMethod, suffixFilterFirstT2T}=result
    //if(!fiTargetDbDir) fiTargetDbDir=fiTargetDir

    var leafFilter=LeafFilter[charFilterMethod], leafFilterFirst=leafFilter+suffixFilterFirstT2T

    var [err]=await funFilterFirstCheckExistance(result); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    
    var charTRes=IntTDiv[charTResS]>IntTDiv[charTResT]?charTResS:charTResT
    
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget}=result
    var [err, [fsSourceDir, fsTargetDir, fsTargetDbDir]]=await myRealPathArr([fiSourceDir, fiTargetDir, fiTargetDbDir], strHostTarget); if(err) {debugger; return [err]; }


    //var arg={leafFilter, leafFilterFirst, charTRes, charFilterMethod};
    //copySome(arg, result, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "strHostTarget", "boRemote", "boAllowLinks", "boAllowCaseCollision", "strFsTarget"])
    var arg={fsSourceDir, fsTargetDir, fsTargetDbDir, leafFilter, leafFilterFirst, charTRes, charFilterMethod};
    copySome(arg, result, ["strHostTarget", "boRemote", "boAllowLinks", "boAllowCaseCollision", "strFsTarget"])
    var syncT2T=new SyncT2TUsingHash(arg);
    var [err]=await syncT2T.constructorPart2();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }
    var [err]=await syncT2T.compare();   if(err) { myConsole.error(err); resetMess(); blanket.hide(); return; }

    //syncT2T.format(settings.leafDb)
    await syncT2T.writeToFile()

    el.setVal(syncT2T)
    if(!syncT2T.boChanged){
      await argumentTab.setTLastSync()
    }

    if(boSync){
      if(!syncT2T.boChanged){ setMess('Everything is up to date, aborting.'); blanket.hide(); return;  }
      if(boAskBeforeWrite){
        var strMess=syncT2T.makeConfirmMess();
        var boOK=await myConfirmer.confirm(strMess);
        if(!boOK) {setMess('Tree2Tree syncing: aborting.'); blanket.hide(); return}
      }
      var [err]=await syncT2T.makeChanges();   if(err) { debugger; myConsole.error(err); resetMess(); blanket.hide(); return; }

    }
    var strMessA=boSync?'Sync':'Compare', strMess=`${strMessA} tree to tree: Done`
    setMess(strMess); blanket.hide();
    //}catch(e){debugger }
  }

  var butCompareT2T=createElement('button').myAppend('Compare').on('click', funT2T);
  var butSyncT2T=createElement('button').myAppend('Sync').on('click', funT2T);

  el.linkFilterFirstT2T=createElement('a').myText('filterFirst').prop({href:""}).on('click', methGoToTitle);

  var hT2T=createElement('b').myText('Tree to tree');
  var divSpace=createElement('div').css({flex:'1'});
  var divButton=createElement('div').myAppend(hT2T, butCompareT2T, el.linkFilterFirstT2T).css({display:'flex', 'align-items':'center', 'column-gap':'3px', background:'var(--bg-color)', flex:"0 1", border:"solid 1px", 'flex-wrap':'wrap', position:'sticky', opacity:0.8, top:0}); //, butWriteMTimeOnSource , butSyncT2T, butSyncT2TBrutal

  var divFolderInfo=divFolderInfoCreator(createElement('div'), makeOpenExtCB(PathT2T.createdF), makeOpenExtCB(PathT2T.deletedF))
  var divConflict=divConflictCreator(createElement('div'), makeOpenExtCB(PathT2T.link), makeOpenExtCB(PathT2T.caseCollision), makeOpenExtCB(PathT2T.reservedChar), makeOpenExtCB(PathT2T.reservedCharF))
  

  var divMat1=createElement('div').myHtml(`SM-Combos: `).hide();
  divSMMatchCreator(divMat1, makeOpenExtCB(PathT2T.STMatch1_02), null, makeOpenExtCB(PathT2T.STMatch1_12), makeOpenExtCB(PathT2T.STMatch1_20), makeOpenExtCB(PathT2T.STMatch1_21), makeOpenExtCB(PathT2T.STMatch1_22));
  
  var divTab=divTabT2TUsingHashCreator(createElement('div'))
  el.myAppend(divButton, divFolderInfo, divConflict, divTab); // divConsoleT2D, divConsoleT2T, divConsole, divMat1

  el.css({'text-align':'left', display:"flex","flex-direction":"column", width:"100%"}); //, height:"100%"
  return el
}

