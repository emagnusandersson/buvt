
"use strict"




gThis.miniViewProgramFoldersCreator=function(el){
  el.setUp=async function(){
  }

  var head=createElement('h3').css({'text-align':'left'}).myAppend('Program folders');
  var br=createElement('br')
  var linkAppFolder=createElement('a').myAppend('Settings-folder').prop({href:'', title:fsDataHome}).on('click',  methGoToTitle); 
  var linkResultFolder=createElement('a').myAppend('Tmp-folder').prop({href:'', title:fsResultFolder}).on('click', methGoToTitle);
  // var linkS=createElement('a').myAppend('S').prop({href:''}).on('click', methGoToTitle);
  // var linkT=createElement('a').myAppend('TDb').prop({href:''}).on('click', methGoToTitle);
  // var linkTData=createElement('a').myAppend('TData').prop({href:''}).on('click', methGoToTitle);
  // var spanTData=createElement('span').myAppend(' (', linkTData, ')');


  el.myAppend(head, linkAppFolder, br.cloneNode(), linkResultFolder).css({'text-align':'left'}); //linkS, ` ${charRightArrow} `, linkT, spanTData, br.cloneNode(), 

  el.css({background:"var(--bg-color)"});
  return el
}




gThis.miniViewFilterMethodTesterCreator=function(el){
  el.setUp=async function(){
    resetMess()
    var [err, result]=await getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {suffixFilterFirstT2T}=result;
    suffixFilterFirstT2T_Local=suffixFilterFirstT2T;
    setLabel()
  }
  var setLabel=function(){
    var boTarget=vippTarget.getStat();
    var boAddSuffix=checkBoxAddSuffix.checked;
    if(boTarget) boAddSuffix=false
    var strB=`.buvt-filter`, strr=`.rsync-filter`;
    if(boAddSuffix) { strB+=suffixFilterFirstT2T_Local; strr+=suffixFilterFirstT2T_Local;}
    th_b.myText(strB); th_r.myText(strr); th_R.myText(strr+" (using rsync dry-run)");

    if(suffixFilterFirstT2T_Local.length && !boTarget){
      divSuffix.show()
      //checkBoxAddSuffix.disabled=false
    }else{
      divSuffix.hide()
      //checkBoxAddSuffix.disabled=true
      checkBoxAddSuffix.checked=false;
    }
    //divSuffix.toggle(suffixFilterFirstT2T_Local.length && !boTarget);

    for(var i=0;i<AParse.length;i++){
      var aTmp=AParse[i], tdTmp=aTmp.parentNode;  aTmp.prop({title:undefined}).myText(`List`);  tdTmp.css({background:''})
    }
  }
  var funRadioClick=function(){ setLabel(); };
  var CharFilterMethod=['b', 'r', 'R']
  var suffixFilterFirstT2T_Local
  var inpS=createElement('input'),   inpT=createElement('input');
  var labS=createElement('label').myText(`Source`),   labT=createElement('label').myText(`Target`);
  var vippTarget=createElement('div').myAppend(labS, inpS, inpT, labT)
  var vippTarget=vippButtonExtend(vippTarget, 'strSourceOrTarget', funRadioClick)

  var checkBoxAddSuffix=createElement('input').prop({type:'checkbox'}).on('change', setLabel);
  var spanAddSuffix=createElement('span').myText(`Use leafFilterFirst with suffix`);
  var labAddSuffix=createElement('label').myAppend(checkBoxAddSuffix, spanAddSuffix)
  var divSuffix=createElement('div').myAppend(labAddSuffix);

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

  var [tHeadR]=tHead.children, [th_b, th_r, th_R]=tHeadR.children;

  var arrTR=[...tBody.children], [trParse, trList, trMeld, trDiff]=arrTR; //trMat1, 

  var ButParse=trParse.querySelectorAll('button');
  var AParse=trList.querySelectorAll('a');
  var [butCompare0, butCompare1]=trMeld.querySelectorAll('button')
  var [spanCompare0, spanCompare1]=trDiff.querySelectorAll('span')


  var funParse=async function(){
    var charFilterMethodLoc=this.attr('data-filterMethod'),  ind=CharFilterMethod.indexOf(charFilterMethodLoc)
    var boTarget=vippTarget.getStat();
    //var boAddSuffix=vippSuffix.getStat();
    var boAddSuffix=checkBoxAddSuffix.checked;
    if(boTarget) boAddSuffix=false
    myConsole.clear(); setMess(`${charFilterMethodLoc} Parsing ...`); blanket.show();
    var [err, result]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {objOptSource, objOptTarget, suffixFilterFirstT2T}=result;
    var objOpt=boTarget?objOptTarget:objOptSource;
    var {fsDir, charTRes}=objOpt
     
    var leafFilter=LeafFilter[charFilterMethodLoc], leafFilterFirst=leafFilter
    if(boAddSuffix) leafFilterFirst+=suffixFilterFirstT2T
    var arg=extend({}, {leafFilter, leafFilterFirst, fsDir, charTRes, charFilterMethod:charFilterMethodLoc})
    var [err, result]=await parseNDump(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {nFile, StrShortList}=result
    var aTmp=AParse[ind], tdTmp=aTmp.parentNode
    aTmp.prop({title:StrShortList?.join(`\n`)}).myText(`List (${nFile})`)
    tdTmp.css({background:'var(--bg-red)'})

    setMess(`${charFilterMethodLoc} Parsing: Done`); blanket.hide();
  }

  for(var i=0;i<CharFilterMethod.length;i++){
    var charT=CharFilterMethod[i]
    ButParse[i].attr({'data-filterMethod':charT}).on('click', funParse);
    var pathTmp=PathParseNDump[charT]; AParse[i].prop({href:''}).on('click', makeOpenExtCB(pathTmp))
  }


  var funCompare=async function(strMA, strMB){  // M=Method
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

  var leafb=PathParseNDump.b.leaf, leafr=PathParseNDump.r.leaf, leafR=PathParseNDump.R.leaf
  butCompare0.prop('title',`Open in Meld: ${leafb} and  ${leafr}`).on('click',  async function(ev){ ev.preventDefault(); funCompare('b','r'); })
  butCompare1.prop('title',`Open in Meld: ${leafr} and  ${leafR}`).on('click',  async function(ev){ ev.preventDefault(); funCompare('r','R') })
  spanCompare0.myAppend(`diff ${leafb} ${leafr}`).css({border:'1px solid'}) // .on('click', cbClick)
  spanCompare1.myAppend(`diff ${leafr} ${leafR}`).css({border:'1px solid'}); //.on('click', cbClick)

  var headA=createElement('h3').myAppend('Compare filtering methods').css({'text-align':'left'})
  var headB=createElement('h4').myAppend('Parse and dump using...').css({'text-align':'left'})

  el.myAppend(headA, vippTarget, divSuffix, headB, table).css({'text-align':'left', background:"var(--bg-color)"}); //
  return el
}



gThis.miniViewEmptyFolderCreator=function(el){
  el.setUp=async function(){
    resetMess();
    var [err, result]=await getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
    var {objOptSource, suffixFilterFirstT2T}=result;
    var {leafFilter}=objOptSource;
    suffixFilterFirstT2T_Local=suffixFilterFirstT2T;

    divResult.myText('')
  }

  var setLabel=function(){
    var boTarget=vippTarget.getStat();
    var boDisplaySuffix=suffixFilterFirstT2T_Local.length;
    if(boTarget) boDisplaySuffix=false
  }
  var funRadioClick=function(){ setLabel(); };
  var suffixFilterFirstT2T_Local
  var inpS=createElement('input'),   inpT=createElement('input');
  var labS=createElement('label').myText(`Source`),   labT=createElement('label').myText(`Target`);
  var vippTarget=createElement('div').myAppend(labS, inpS, inpT, labT).css({margin:'0 0 1em'});
  var vippTarget=vippButtonExtend(vippTarget, 'strSourceOrTarget2', funRadioClick)


  var checkBoxAddSuffix=createElement('input').prop({type:'checkbox'});
  var spanAddSuffix=createElement('span').myText(`Use leafFilterFirst with suffix`);
  var labAddSuffix=createElement('label').myAppend(checkBoxAddSuffix, spanAddSuffix)

  var funGo=async function(strMode){

    var boTarget=vippTarget.getStat();
    //var boAddSuffix=checkBoxAddSuffix.checked;
    myConsole.clear(); setMess('EmptyFolderCheck ...'); blanket.show();
    var [err, result]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {objOptSource, objOptTarget, suffixFilterFirstT2T}=result;
    var objOpt=boTarget?objOptTarget:objOptSource;
    var {fsDir, charTRes, leafFilter, charFilterMethod}=objOpt


    var leafFilterFirst=leafFilter
    //if(boAddSuffix) leafFilterFirst+=suffixFilterFirstT2T
    if(strMode=='nofilter') {leafFilter=''; leafFilterFirst='';}
    var arg=extend({}, {leafFilter, leafFilterFirst, fsDir, charTRes, charFilterMethod})
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
  var leafTmp=PathLoose.emptyFolders.leaf
  var butGo=createElement('button').myAppend('Go (no filtering)').attr({title:`Parse the source/target tree and find empty folders. (Ignoring all filter files.)`}).on('click', function(){ funGo('nofilter'); });
  var butGoFilter=createElement('button').myAppend('Go (.buvt-filter)').attr({title:`Same as previous but looks for .buvt-filter as filter-files.`}).on('click', function(){ funGo('filter'); });
  var butGoSuffixFilter=createElement('button').myAppend('Go (filtering (suffixed))').attr({title:`Same as previous but use .buvt-filterSUFFIX as top-level-filter-file.`}).on('click', function(){ funGo('suffixFilter'); });


  var divResult=createElement('div').css({'text-align':'left'}).css({margin:'1em 0 0'})

  el.myAppend(head, vippTarget, butGo, butGoFilter, divResult).css({'text-align':'left'}); // labAddSuffix, divConsoleT2D, divConsoleT2T, divConsole, , labTarget, createElement('br')

  el.css({background:"var(--bg-color)"});
  return el
}


gThis.miniViewHashMatchDeleteCreator=function(el){
  //var PathCur=gThis[`Path${charSide}`];
  var butFind=createElement('button').myAppend('Find').attr({'title':undefined}).on('click',  async function(){
    var strLab=`Find hash collisions`
    var charTRes='9'; //selTRes.value
    myConsole.clear(); setMess(strLab+' ...'); blanket.show();
    var [err, result]=await getSelectedFrFileWExtra(); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {fsSourceDir, strHostTarget, fsTargetDbDir, boRemoteTarget}=result;
    var arg=extend({}, {fsSourceDir, strHostTarget, fsTargetDbDir, charTRes, boRemoteTarget, charSide})
    hashMultWorkDelete=new HashMultWorkDelete()
    var [err, result]=await hashMultWorkDelete.getMult(arg); if(err) {debugger; myConsole.error(err); resetMess(); blanket.hide(); return;}
    var {StrKeepShort, nPat, nTot}=result

    //var {n, nPatSM, nPatSMMult, nSMMult}=objSM
    aToKeep.myText(`${nPat} (${nTot})`).prop({title:StrKeepShort?.join(`\n`)})
    setMess(strLab+': Done'); blanket.hide();
  });
  var hashMultWorkDelete

  var charSide='S';


  var strHeadA=`Find / Delete duplicates (hash colliders)`;
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
