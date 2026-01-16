
"use strict"




var treeParserW=async function(arg){
  var argTmp=copySome({}, arg, ['charTRes', 'strHost', 'charFilterMethod', 'leafFilter', 'fsDir'])
  argTmp.leafFilterFirst=argTmp.leafFilter
    // Parse tree
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(argTmp); if(err) {debugger; return [err];}
  removeFileFromArrTreef(arrTreef, settings.leafDb)
  removeFileFromArrTreef(arrTreef, RegExp('buvtDb\\.bak[0-9]*\\.txt'))

  return [null, arrTreef, arrTreeF]
}

// OK OK   Un­touched
//           SM-Combos:
// -  1T1  Renamed (1T1)
//           1T1-files not renamed in the leaf: - . Ancestors: - 
// -  ViaA Renamed (ViaA)
//           SM-Combos:
// OK  -   Changed
// -   -   Created / Deleted
// -  Mult Mult
//           Sum



var checkingForMultipleIds=async function(arrTreef, arrTreeF, arrDb, charSide){
  var PathCur=gThis[`Path${charSide}`],   myResultWriter=new MyWriter(PathCur)

      // Id match (Checking for hard links)
  var BundTreef=bundleOnProperty(arrTreef, 'id'),  nIdf=Object.keys(BundTreef).length
  var [BundTreefMult, nMultf]=extractBundlesWMultiples(BundTreef),  nIdMultf=Object.keys(BundTreefMult).length;
  var BundTreeF=bundleOnProperty(arrTreeF, 'id'),  nIdF=Object.keys(BundTreeF).length
  var [BundTreeFMult, nMultF]=extractBundlesWMultiples(BundTreeF),  nIdMultF=Object.keys(BundTreeFMult).length;

    // Count duplicate ids in db
  // arrDb.sort(funIncId)
  // var BundId=bundleOnProperty(arrDb, 'id'),  nIdDb=Object.keys(BundId).length
  // var [BundDbMult, nMultDb]=extractBundlesWMultiples(BundId),  nIdMultDb=Object.keys(BundDbMult).length;
  // var nIdDb=0, nMultDb=0, nIdMultDb=0

  //var boHL=Boolean(nMultf || nMultF || nMultDb)
  var boHL=Boolean(nMultf || nMultF)
  var objHL={nMultf, nIdMultf, nIdf, nTreef:arrTreef.length,   nMultF, nIdMultF, nIdF, nTreeF:arrTreeF.length,  boHL,  strShortList:undefined}; //, nMultDb, nIdMultDb, nIdDb, nDb:arrDb.length

  if(boHL) { //nIdMultf || nIdMultF || nIdMultDb
    var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
    var StrTmpf=format1x2D(BundTreefMult, funMatch, funUnique)
    var StrTmpF=format1x2D(BundTreeFMult, funMatch, funUnique)
    myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpf)
    myResultWriter.Str.hlF=myResultWriter.Str.hlF.concat(StrTmpF)
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    
    objHL.strShortList=formatTitleStr(StrTmpf)
    objHL.strShortListF=formatTitleStr(StrTmpF)
    //return [null, objHL];
  }
  return [null, objHL]
}

var find_1MToM_SMHash=async function(arrIn, charSide){ // divDbRelationTestCreator
  var PathCur=gThis[`Path${charSide}`],   myResultWriter=new MyWriter(PathCur)

  var Bund_1MToM_SMHash={}, nMult=0, boOK=true;
  arrIn.sort(funIncHash)
  var BundSM=bundleOnProperty(arrIn, 'sm');
  var [BundSMMult, nMult_trash, arrSingle]=extractBundlesWMultiples(BundSM);
  for(var k in BundSMMult){
    var bundSMMult=BundSMMult[k], n=bundSMMult.length;
    var row0=bundSMMult[0], rowEnd=bundSMMult[n-1];
    if(row0.strHash!=rowEnd.strHash){ Bund_1MToM_SMHash[k]=bundSMMult; nMult+=n; boOK=false; } // Since they are sorted it is enough to check the first and the last
  }
  var nKeyMult=Object.keys(Bund_1MToM_SMHash).length;

  var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUnique=s=>`  ${s.strHash} ${s.strName}`;
  var Str=format1x2D(Bund_1MToM_SMHash, funMatch, funUnique)
  myResultWriter.Str.dbHashUniquenessPerSM=myResultWriter.Str.dbHashUniquenessPerSM.concat(Str)
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

  var strShortList=formatTitleStr(Str);

  return [null, {boOK, strShortList, nMult, nKeyMult}]
}


var categorizeSMRelations=async function(arrTreef, arrDb, charSide){
  var PathCur=gThis[`Path${charSide}`],   myResultWriter=new MyWriter(PathCur)

      // Mult 1 (Multiple SM in all files)
  //arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
  // var RelationSM=bundleOnProperty2(arrTreef, arrDb, 'sm'); // row=>row.sm
  // var catPrim1=new CatPrim(); catPrim1.assignFromRel(RelationSM);
  // catPrim1.setMTMLabel()
  // formatMultiPots(myResultWriter, catPrim1, 1)


      // Categorize files
  var arrTree=arrTreef
  //arrTree.forEach(row=>row.strSide='S'); arrDb.forEach(row=>row.strSide='T');
  arrTree.forEach(row=>row.strSide='Tr'); arrDb.forEach(row=>row.strSide='Db');
    // Extract untouched, nm
  arrTree.sort(funIncStrName);   arrDb.sort(funIncStrName)
  var [err, arrTrUntouched, arrDbUntouched, arrTrTouched, arrDbTouched]=extractMatching(arrTree, arrDb, ['strName', 'sm']); if(err) {debugger; return [err];} 
  var boChanged=Boolean(arrTrTouched.length)||Boolean(arrDbTouched.length)


    // Extract 1T1 and ViaA (renamed) (M)
  //arrTrTouched.sort(funIncSM);   arrDbTouched.sort(funIncSM);
  var RelM2=bundleOnProperty2(arrTrTouched, arrDbTouched, 'sm'); // row=>row.sm
  var catPrim2=new CatPrim();  catPrim2.assignFromRel(RelM2);
  var arrCreateProt=[].concat(catPrim2.arrA[1][0], catPrim2.arrA[2][0]);
  var arrDeleteProt=[].concat(catPrim2.arrB[0][1], catPrim2.arrB[0][2]);
  var arrTr1T1=[].concat(catPrim2.arrA[1][1]);
  var arrDb1T1=[].concat(catPrim2.arrB[1][1]);
  var ArrTrPrim2Mult=[].concat(catPrim2.ArrA[1][2], catPrim2.ArrA[2][1], catPrim2.ArrA[2][2]);
  var ArrDbPrim2Mult=[].concat(catPrim2.ArrB[1][2], catPrim2.ArrB[2][1], catPrim2.ArrB[2][2]);
  var arrTrPrim2Mult=[].concat(catPrim2.arrA[1][2], catPrim2.arrA[2][1], catPrim2.arrA[2][2]); // Only for arrDbOwnNew (also recalculated in divT2DTab.setVal)
  var arrDbPrim2Mult=[].concat(catPrim2.arrB[1][2], catPrim2.arrB[2][1], catPrim2.arrB[2][2]); // Not used (recalculated in divT2DTab.setVal)
     // Old Categorizations
  //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
  // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
  //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭

     // New Categorizations from 20260609
  //    ⎧0      0    0  ⎫     ⎧0 delete delete⎫
  // A: |create 1T1 1TM |  B: |0 1T1    1TM   |
  //    ⎩create MT1 Mult⎭     ⎩0 MT1    Mult  ⎭


    // Copy strHash for 1T1
  for(var i=0;i<arrDb1T1.length;i++){ arrTr1T1[i].strHash=arrDb1T1[i].strHash; }

    // Copy strHash for Prim2Mult (and also check that hashes are uniform for each SM).
  for(var i=0;i<ArrDbPrim2Mult.length;i++){
    var arrDbWCertainSM=ArrDbPrim2Mult[i], arrTrWCertainSM=ArrTrPrim2Mult[i]
    var row0=arrDbWCertainSM[0], strHash0=row0.strHash, boHashMatchAll=true; // The array has always a length greater than 0 (as seen in table above)
      // Check that all hashes (for the current SM) in db are the same
    for(var j=1;j<arrDbWCertainSM.length;j++){
      var row=arrDbWCertainSM[j], {strHash}=row;
      if(strHash0!==strHash) {boHashMatchAll=false; debugger; return [Error("strHash0!==strHash")];}
    }
      // Copy strHash for Prim2Mult
    for(var j=0;j<arrTrWCertainSM.length;j++){ var row=arrTrWCertainSM[j];   row.strHash=strHash0;  }
  }

  myResultWriter.Str.allTr=format1x1D(arrTree, ...ObjKeyList['allTr']);
  myResultWriter.Str.allDb=format1x1D(arrDb, ...ObjKeyList['allDb']);
  
    // Copy strHash for Untouched
  for(var i=0;i<arrTrUntouched.length;i++){ arrTrUntouched[i].strHash=arrDbUntouched[i].strHash; }
  myResultWriter.Str.untouched=format1x1D(arrTrUntouched, ...ObjKeyList['untouched']);
  var arrUntouched=arrTrUntouched

  // arrCreateProt.sort(funIncStrName) // Commented out, already sorted
  // arrDeleteProt.sort(funIncStrName) // Commented out, already sorted

  var [err, arrTrChange, arrDbChange, arrCreate, arrDelete]=extractMatching(arrCreateProt, arrDeleteProt, ['strName']); if(err) {debugger; return [err];} 



  var ObjFeedback={}
  ObjFeedback.objTree={strHov:undefined, nFile:arrTree.length}
  ObjFeedback.objDb={strHov:undefined, nFile:arrDb.length}
  ObjFeedback.objUntouched={strHov:undefined, nFile:arrUntouched.length}
  ObjFeedback.objCreateProt={strHov:formatTitleStrName(arrCreateProt), nFile:arrCreateProt.length}
  ObjFeedback.objDeleteProt={strHov:formatTitleStrName(arrDeleteProt), nFile:arrDeleteProt.length}
  ObjFeedback.objCreate={strHov:formatTitleStrName(arrCreate), nFile:arrCreate.length}
  ObjFeedback.objDelete={strHov:formatTitleStrName(arrDelete), nFile:arrDelete.length}

  var funChange=r=>`${r[0].strName}
  Tr ${r[0].size.myPadStart(10)} ${r[0].strMTimeFloored.padStart(19)}
  Db ${r[1].size.myPadStart(10)} ${r[1].strMTimeFloored.padStart(19)}`
  var arrTmp=[arrTrChange.slice(0,nShortListMax), arrDbChange.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
  var strHov=formatTitleStr(arrTmp, funChange)
  ObjFeedback.objChange={strHov, nFile:arrTrChange.length}

  var fun1T1=r=>`${r[0].strName}\n  => ${r[1].strName}`
  var arrTmp=[arrTr1T1.slice(0,nShortListMax), arrDb1T1.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
  var strHov=formatTitleStr(arrTmp, fun1T1)
  ObjFeedback.obj1T1={strHov, nFile:arrTr1T1.length}

    // Writing to category files
  myResultWriter.Str.createdProt=format1x1D(arrCreateProt, ...ObjKeyList['createdProt']);
  myResultWriter.Str.deletedProt=format1x1D(arrDeleteProt, ...ObjKeyList['deletedProt']);
  myResultWriter.Str.created=format1x1D(arrCreate, ...ObjKeyList['created']);
  myResultWriter.Str.deleted=format1x1D(arrDelete, ...ObjKeyList['deleted']);
  myResultWriter.Str.changed=format2x1D(arrTrChange, arrDbChange, funChange)
  myResultWriter.Str['1T1']=format2x1D_1T1(arrTr1T1, arrDb1T1, false)


  formatMultiPots(myResultWriter, catPrim2, 2)
  
  //myResultWriter.Str.1T1Relation=format2x2D(catPrim2.ArrA[1][1], catPrim2.ArrB[1][1], ...ObjKey['1T1'])
  //myResultWriter.Str.1T1RelationCustom=format2x2D_Mult(catPrim2.ArrA[1][1], catPrim2.ArrB[1][1])
  //debugger

  setBestNameMatchFirst(ArrTrPrim2Mult, ArrDbPrim2Mult)

  //   // Sort by size
  // ArrTrPrim2Mult.forEach((el, i)=>el.ind=i); // Set ind
  // var funInc=(a,b)=>a[0].size-b[0].size;
  // var ArrAtmp=[...ArrTrPrim2Mult].sort(funInc)
  //   // Create Ind
  // var Ind=ArrAtmp.map(entry=>entry.ind)
  // ArrTrPrim2Mult.forEach((el)=>delete el.ind); // Delete ind
  // var ArrBtmp=eInd(ArrDbPrim2Mult, Ind)
  //var StrTmp=myResultWriter.Str.STMatch2=format2x2D_Mult(ArrTrPrim2Mult, ArrDbPrim2Mult); 

  var [StrTmp, strHov]=format2x2D_Mult(ArrTrPrim2Mult, ArrDbPrim2Mult);
  myResultWriter.Str.STMatch2=StrTmp
  //var strHov=formatTitleStr(StrTmp.slice(4))
  ObjFeedback.objSTMatch2={strHov, nFile:undefined}

  myResultWriter.Str.hl=[]

  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

  var objCategory={boChanged, catPrim2, ObjFeedback, arrTrUntouched, arrTr1T1, arrTrPrim2Mult, arrDbUntouched, arrDb1T1, arrDbPrim2Mult, arrCreateProt}; // catPrim1, 
  return [null, objCategory];
}



var addHashToCreated=async function(arrCreateProt, objOptSide){  // Read "created" and add hashcodes to it.
  //var {charSide, fsDbDir, strHost}=argSide
  var {charSide, fsDbDir, strHost}=objOptSide

  var PathCur=gThis[`Path${charSide}`]

  // var fsTmp=PathCur.created.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
  // var [err, arrCreateProt]=parseSSVWType(strData); if(err) return [err]


    // Brute force work
  var [err, StrHash]=await calcHashes(arrCreateProt, fsDbDir, strHost); if(err) { return [err];}
  if(StrHash.length!=arrCreateProt.length) { return [Error('StrHash.length!=arrCreateProt.length')];}
  for(var i=0;i<arrCreateProt.length;i++){
    var row=arrCreateProt[i], strHash=StrHash[i]
    if(strHash.length!=32) { return [Error('strHash.length!=32')];}
    row.strHash=strHash
  }

  var StrTmp=format1x1D(arrCreateProt, ['strType', 'strHash', 'size', 'mtime_ns64', 'strName']);
  //var [err]=await writeFile(fsName, StrTmp.join('\n')); if(err) {debugger; return [err];}
  var myResultWriter=new MyWriterSingle(gThis[`Path${charSide}`].created, StrTmp);
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  
  return [null]
}



var writeTmpDb=async function(arrDb, argSide){  // Read "created" and add hashcodes to it.
  var {charSide, fsDbDir, strHost}=argSide

  var StrTmp=format1x1D(arrDb, ['strType', 'boNew', 'strHash', 'size', 'mtime_ns64', 'strName']);
  var myResultWriter=new MyWriterSingle(gThis[`Path${charSide}`].dbTmp, StrTmp);
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  
  return [null]
}

class SyncT2D{
  static async fun1Prework(arg){
    var {charSide, argGeneral}=arg
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {objOptSource, objOptTarget, FleSSub, FleTSub, strHostTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var FleSub=boTarget?FleTSub:FleSSub
    var {boDataInTop}=objOptSide
    //var boDataInTop=false

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading database
    var argTmp=copySome({}, objOptSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, objOptSide.charTRes);

      // getRelevantForCategorizations (db)
    if(boDataInTop){ var arrDb_Upstream=arrDb, arrDb_Own=[];}
    else{
      var [arrDb_Upstream, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);
    }


      // Parsing tree
    var strMess=`Parsing ${strSide} tree`;   setMess(strMess, null, true)
    var argTmp=copySome({}, objOptSide, ['charTRes', 'strHost', 'charFilterMethod', 'leafFilter', 'fsDir']);
    var [err, arrTreef, arrTreeF] =await treeParserW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrTreef, objOptSide.charTRes);
    var objOut={arrDb, arrTreef};

      // Set boNew=false
    //arrTreef.forEach(r=>r.boNew=false);


    var [err, objHL]=await checkingForMultipleIds(arrTreef, arrTreeF, arrDb, charSide); if(err) {debugger; return [err];}
    extend(objOut, {objHL})
    if(objHL.boHL) { return [null, objOut];}

      // ownCounter
    if(boDataInTop){ var arrTr_Upstream=arrTreef, arrTr_Own=[];}
    else{
      var [arrTr_Upstream, arrTr_Own]=ArrDb.selectWPrefixArr(arrTreef, FleSub);
    }
    var objOwnCounter={nTrOwn:arrTr_Own.length, nTrUpstream:arrTr_Upstream.length, nDbOwn:arrDb_Own.length, nDbUpstream:arrDb_Upstream.length, FleSub, boDataInTop}
    extend(objOut, {arrDb_Upstream, arrDb_Own, arrTr_Own, objOwnCounter})
    if(arrDb_Upstream.length!=arrTr_Upstream.length) {debugger; return [Error('arrDb_Upstream.length!=arrTr_Upstream.length')];}

    //var objOwn={nOwnDb:arrDb_Own.length, nUpstreamDb:arrDb_Upstream.length, nOwnTr:arrTr_Own.length, nUpstreamTr:arrTr_Upstream.length, }

    //arrDb_Upstream.sort(funIncStrName);   arrTr_Upstream.sort(funIncStrName)
    //var [err, arrTrUntouched, arrDbUntouched, arrTrTouched, arrDbTouched]=extractMatching(arrTr_Upstream, arrDb_Upstream, ['strName']); if(err) {debugger; return [err];} 

      // Db check
    var [err, objDb_1MToM_SMHash]=await find_1MToM_SMHash(arrDb_Own, charSide); if(err) {debugger; return [err];}
    extend(objOut, {objDb_1MToM_SMHash})
    if(!objDb_1MToM_SMHash.boOK) { return [null, objOut];}
    
    var ArgTmp=[arrTr_Own, arrDb_Own]
    var [err, objCategory]=await categorizeSMRelations(...ArgTmp, charSide); if(err) {debugger; return [err];}
    extend(objOut, {objCategory});
    //divT2DBoth.setVal(objCategory, iSide);

      // boChanged
    var {arrCreateProt, boChanged}=objCategory, boCreated=Boolean(arrCreateProt.length)
    extend(objOut, {boCreated, boChanged, objHL, objDb_1MToM_SMHash})

    return [null, objOut]
  }

  static fun1_5CreateNewDb(syncDb){
    var {objCategory}=syncDb
    var {arrTrUntouched, arrTr1T1, arrTrPrim2Mult, arrCreateProt}=objCategory;
    var arrDbOwnNew=[].concat(arrTrUntouched, arrTr1T1, arrTrPrim2Mult, arrCreateProt); //, syncDb.arrDb_Upstream
    extend(syncDb, {arrDbOwnNew})
  }

  static async fun2AddHash(charSide, argGeneral, syncDb){
    var boTarget=charSide=='T';
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {objCategory}=syncDb, {arrCreateProt}=objCategory;
    var [err]=await addHashToCreated(arrCreateProt, objOptSide); if(err) {debugger; return [err];}
      // Write temporary db
    //var [err]=await writeTmpDb(arrDbOwnNew, argSide); if(err) {debugger; return [err];}
    return [null]
  }

  static async fun3GetMultSM(argGeneral, syncDb, boTarget){
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes, charSide}=objOptSide;

    var {objCategory, arrDbOwnNew, arrDb, arrTreef}=syncDb;
    var {arrCreateProt}=objCategory;

    funSetMTimeArr(arrDb, charTRes)
    funSetMTimeArr(arrTreef, charTRes)
    funSetMTimeArr(arrCreateProt, charTRes)
    funSetMTimeArr(arrDbOwnNew, charTRes)

      // SM collision check for new SM
      // Get Relevant For SM Collision Check
    arrTreef.forEach(r=>r.boNew=false);
    arrDb.forEach(r=>r.boNew=false);

    arrCreateProt.forEach(r=>r.boNew=true); //arrCreate_T.forEach(r=>r.boNew=false);
    var [err, result]=await RelationWork.getMult({arrDbSelection:arrDbOwnNew, charSide}); if(err) {debugger; return [err];}
    //var {Bund1MToM, objFeedback}=result
    return [null, result]
  }
  static async fun35FindNewMTime(arg, argGeneral, syncDb, boTarget){
    var {Bund1MToM}=arg
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes, charSide}=objOptSide;
    var {objCategory, arrDbOwnNew, arrDb, arrTreef}=syncDb;

    var [err, result]=await RelationWork.findNewMTime({Bund1MToM, arrDbSelection:arrDbOwnNew, charTRes, charSide}); if(err) {debugger; return [err];}
    //var {nToChange, StrToChangeShort, nRevert, StrRevertShort, arrToChange}=result

    return [null, result]
  }

  static async fun4WriteDb(arrToChange, syncDb, argGeneral, boTarget){
    var {arrDbOwnNew}=syncDb
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes}=objOptSide
    
    RelationWork.copyTDiff(arrDbOwnNew, arrToChange, charTRes)

    var arrDbNew=[].concat(arrDbOwnNew, syncDb.arrDb_Upstream);

    var argTmp=copySome({}, objOptSide, ["fsDbDir", "fsDb", "strHost"]);
    var [err]=await RelationWork.mySetMTime(arrToChange, arrDbNew, argTmp); if(err) {debugger; return [err];}

    return [null]
  }
}

/**********************************************************************
createBundWExtraDim
var [Bund3D]=createBundWExtraDim({1:[{a:1,b:5},{a:1,b:5}], 2:[{a:2,b:6},{a:2,b:7}]}, 'b')
Bund3D={
  1:{5:[{a:1,b:5}, {a:1,b:5}]},
  2:{
    6:[{a:2,b:6}]},
    7:[{a:2,b:7}]}
  }
}
**********************************************************************/
var createBundWExtraDim=function(BundIn, strB='strHash'){
  var Bund3D={}
  //var Bund1MToM={}, Bund1MTo1={}, nTot1MToM=0, nTot1MTo1=0
  for(var keyA in BundIn){
    var bundA=BundIn[keyA], objTmp={}
    for(var i=0;i<bundA.length;i++){
      var r=bundA[i], keyB=r[strB];
      if(!(keyB in objTmp)) objTmp[keyB]=[];
      objTmp[keyB].push(r);
    }
    //var ArrTmp=Object.values(objTmp); Bund3D[keyA]=ArrTmp;
    Bund3D[keyA]=objTmp;
    //var Key=Object.keys(objTmp); 
    //if(Key.length>1) { Bund1MToM[keyA]=bundA; nTot1MToM+=bundA.length;}
    //else {Bund1MTo1[keyA]=bundA; nTot1MTo1+=bundA.length;}
  }
  return [Bund3D]; //, Bund1MToM, Bund1MTo1, nTot1MToM, nTot1MTo1
}
// var [Bund3D, Bund1MToM, Bund1MTo1, nTot1MToM, nTot1MTo1]=createBundWExtraDim(BundSMMult, 'strHash');


//arrCreateProt, arrChanged, arrDb
class RelationWork{
  static async getMult(arg){ // get SM-hash-relation bundled as Bund1MToM etc
    var {arrDbSelection, charSide}=arg;
    
    arrDbSelection.sort(funDecSM);

    var {arr1T1, arrMT1, arr1TM, arrMTM, nAPatMult, nBPatMult}=categorizePropertyRelation(arrDbSelection, 'sm', 'strHash')
    var Bund1T1=bundleOnProperty(arr1T1, 'sm');
    var BundMT1_sm=bundleOnProperty(arrMT1, 'sm'), nPatMT1_sm=Object.keys(BundMT1_sm).length;
    var BundMT1_hash=bundleOnProperty(arrMT1, 'strHash'), nPatMT1_hash=Object.keys(BundMT1_hash).length;
    var Bund1TM_sm=bundleOnProperty(arr1TM, 'sm'), nPat1TM_sm=Object.keys(Bund1TM_sm).length;
    var Bund1TM_hash=bundleOnProperty(arr1TM, 'strHash'), nPat1TM_hash=Object.keys(Bund1TM_hash).length;
    var BundMTM_sm=bundleOnProperty(arrMTM, 'sm'), nPatMTM_sm=Object.keys(BundMTM_sm).length;
    var BundMTM_hash=bundleOnProperty(arrMTM, 'sm'), nPatMTM_hash=Object.keys(BundMTM_hash).length;

    var [Bund1T1_mult, nTot1T1_mult, arrSingle]=extractBundlesWMultiples(Bund1T1)
    var n1T1_single=arrSingle.length;
    var nPat1T1_mult=Object.keys(Bund1T1_mult).length;

    var Bund1MToM=extend({}, BundMTM_sm); extend(Bund1MToM, Bund1TM_sm);
    var nTot1T1=arr1T1.length, nTotMT1=arrMT1.length, nTot1TM=arr1TM.length, nTotMTM=arrMTM.length

    var objFeedback={n1T1_single, nTot1T1_mult, nPat1T1_mult, 
      nTotMT1, nPatMT1_sm, nPatMT1_hash, 
      nTot1TM, nPat1TM_sm, nPat1TM_hash, 
      nTotMTM, nPatMTM_sm, nPatMTM_hash};

      // Writing data for 1MToM-check-table


    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored} ${s.strHash}`,  funUnique=s=>`  ${s.strName}`;
    var StrLongList=format1x2D(Bund1T1_mult, funMatch, funUnique), len=StrLongList.length;
    var StrHead=[`int int64 string`, `size mtime_ns64Floored strHash`, `string`, `strName`]
    var strHead=StrHead.join('\n'), strHeadShort=StrHead[1]+'\n'+StrHead[3];
    var Str1T1_mult_Short=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead); Str1T1_mult_Short.unshift(strHeadShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collision1T1_mult, StrLongList);
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.strHash}`,  funUnique=s=>`  ${s.mtime_ns64Floored} ${s.strName}`;
    var StrHead=[`int string`, `size strHash`, `int64 string`, `mtime_ns64Floored strName`]
    var strHead=StrHead.join('\n'), strHeadShort=StrHead[1]+'\n'+StrHead[3];
    var StrLongList=format1x2D(BundMT1_hash, funMatch, funUnique), len=StrLongList.length;
    var StrMT1Short=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead); StrMT1Short.unshift(strHeadShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collisionMT1, StrLongList);
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}


    var funMatch1MToM=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUnique1MToM=s=>`  ${s.strHash} ${s.strName}`;
    var StrHead=[`int int64`, `size mtime_ns64Floored`, `string string`, `strHash strName`];
    var strHead1MToM=StrHead.join('\n'), strHead1MToMShort=StrHead[1]+'\n'+StrHead[3];

    var StrLongList=format1x2D(Bund1TM_sm, funMatch1MToM, funUnique1MToM), len=StrLongList.length; 
    var Str1TMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead1MToM); Str1TMShort.unshift(strHead1MToMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collision1TM, StrLongList);
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var StrLongList=format1x2D(BundMTM_sm, funMatch1MToM, funUnique1MToM), len=StrLongList.length;
    var StrMTMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead1MToM); StrMTMShort.unshift(strHead1MToMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collisionMTM, StrLongList);
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var StrLongList=format1x2D(Bund1MToM, funMatch1MToM, funUnique1MToM), len=StrLongList.length;
    var Str1MToMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead1MToM); Str1MToMShort.unshift(strHead1MToMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collision1MToM, StrLongList);
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}


    extend(objFeedback, {Str1T1_mult_Short, StrMT1Short, Str1TMShort, StrMTMShort, Str1MToMShort})
    var objOut={Bund1MToM, BundMT1_hash, objFeedback}
    return [null, objOut]
  }
  static async findNewMTime(arg){ //1MToM_2_1MTo1_EntriesToChangeToTurn //separateSM (ForEachHash) //keyifySM_uniquify
    var {Bund1MToM, arrDbSelection, charTRes, charSide}=arg

    var [Bund3D]=createBundWExtraDim(Bund1MToM, 'strHash'); // Bund1MToM is already bundled on sm

    var fsTmp=gThis[`PathSingle${charSide}`].collision1MToM.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true, undefined, arr=>arr[1]); if(err) return [err]
      // Note!
      // Number of dimensions:
      //   Arr: 2D
      //   obj: 3D
      //   Bund1MToM: 2D.
      //   Bund3D: 3D
      // keySM (top key) in obj, Bund1MToM and Bund3D has the "size"-part 0-padded differently:
      //   obj: no padding
      //   Bund1MToM: 0-padded.
      //   Bund3D: 0-padded
      // Ex:
      //   Arr={9f6e6800cfae7749eb6c486619254b9c:[]}
      //   obj={3_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}
      //   Bund1MToM={000000000003_1716905274000000000:[]}
      //   Bund3D={000000000003_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}

      // Create BoSizeMTime
    var BoSizeMTime={}
    arrDbSelection.sort(funDecSM);
    var BundSize=bundleOnProperty(arrDbSelection, 'size')
    for(var s in BundSize){
      var bundSize=BundSize[s];   BoSizeMTime[s]={}
      for(var i=0;i<bundSize.length;i++){ var row=bundSize[i], {mtime_ns64Floored}=row;  BoSizeMTime[s][mtime_ns64Floored]=true; }
    }
  
    var tDiffMax_ns=1e11

      // Add nNew
    var obj=Bund3D;
    for(var keySM in obj){ 
      var BundHash=Object.values(obj[keySM]);
      BundHash.forEach(bundHash=>{
          // Add nNew as properties to each array
        var nNew=0; bundHash.forEach(r=>{  if(r.boNew) nNew++; });
        extend(bundHash, {nNew});
      }); 
    }

    var StrToChange=[], nToChange=0, arrToChange=[]; //, StrRevert=[], Bund3ToChange={}
    for(var keySM in obj){
      var BundHash=Object.values(obj[keySM]);
        // One can skip one bundHash (the first).
        // Sort so that the bundHash you want to skip comes first
      BundHash.sort((A,B)=>{ return -diffMy(A.nNew, B.nNew);}); // ◢ Sort so that the least nNew is first
        // BundHash=[{nNew:0}, {nNew:0}, {nNew:1}]
      
      var tDiff_ns=BigInt(0)
      var bundHash0=BundHash[0], r00=bundHash0[0], {size, mtime_ns64Floored, strName}=r00;
      StrToChange.push(`MatchingData ${size} ${mtime_ns64Floored}`);  //StrRevert.push(`MatchingData ${size} ${mtime_ns64Floored}`)
      for(var i=1;i<BundHash.length;i++){  // One can leave one (the first) bundHash unchanged
        var bundHash=BundHash[i], row0=bundHash[0], {size, mtime_ns64Floored, strName}=row0;

        while(1){
          tDiff_ns+=IntTDiv[charTRes];    if(tDiff_ns>tDiffMax_ns) {debugger; return [Error(`New time could not be calculated: tDiff_ns: ${tDiff_ns} ${strName}`)]; }
          var mtime_ns64FlooredNew=mtime_ns64Floored+tDiff_ns
          if(mtime_ns64FlooredNew in BoSizeMTime[size]) {continue;} else { BoSizeMTime[size][mtime_ns64FlooredNew]=true;  break;}
        }
          // Create arrToChange
        for(var j=0;j<bundHash.length;j++){
          var row=bundHash[j], {strHash, strName}=row;
          var rowNew=extend({}, row)
          funSetMTime(rowNew, charTRes, mtime_ns64FlooredNew)
          StrToChange.push(`  ${tDiff_ns} ${strHash} ${strName}`);  nToChange++; //,  StrRevert.push(`  0 ${strHash} ${strName}`)
          arrToChange.push(rowNew)
        } 
      }
    }
    var nRevert=nToChange, len=StrToChange.length;

    //var strHead=`int int64\nsize mtime_ns64Floored\nint64 string string\ntDiff_ns strHash strName`;
    var StrHead=[`int int64`, `size mtime_ns64Floored`, `int64 string string`, `tDiff_ns strHash strName`];
    var strHead=StrHead.join('\n'), strHeadShort=StrHead[1]+'\n'+StrHead[3];
  
    var StrToChangeShort=formatTitle(StrToChange); if(len) { StrToChange.unshift(strHead); StrToChangeShort.unshift(strHeadShort);}
    var [err]=await writeFile(gThis[`PathSingle${charSide}`].smToChange.fsName, StrToChange.join('\n')); if(err) {debugger; return [err];}
  
    // var StrRevertShort=formatTitle(StrRevert)
    // if(StrRevert.length) StrRevert.unshift(...StrHead);
    // var [err]=await writeFile(gThis[`PathSingle${charSide}`].smRevert.fsName, StrRevert.join('\n')); if(err) {debugger; return [err];}
  
    return [null, {nToChange, StrToChangeShort, arrToChange}]; //, nRevert, StrRevertShort
  }

  static copyTDiff(arrDb, arrToChange, charTRes){ // Copy modtime from arrToChange to arrDb (matched by strName)
    arrDb.sort(funIncStrName);   arrToChange.sort(funIncStrName)
    var [err, arrDbMatch, arrToChangeMatch, arrDbRem, arrToChangeRem]=extractMatching(arrDb, arrToChange, ['strName']); if(err) {debugger; return [err];}
    if(arrToChangeRem.length) {debugger; return [Error("arrToChangeRem.length>0")];}

    for(var i=0;i<arrDbMatch.length;i++){
      var rowDb=arrDbMatch[i], rowToChange=arrToChangeMatch[i], {mtime_ns64Floored:mtime_ns64}=rowToChange;
      funSetMTime(rowDb, charTRes, mtime_ns64)
    }
    return [null]
  }
  static async mySetMTime(arrToChange, arrDb, arg){
    var {fsDbDir, fsDb, strHost}=arg; 
    var [err]=await setMTime(arrToChange, fsDbDir, strHost);  if(err) {debugger; return [err];}
    var [err]=await writeDbWrapper(arrDb, fsDb, strHost); if(err) { return [err];}
    return [null]
  }
}
/*
cd ~/progPython/buvt-TargetFs/OtherStuff
cd ~/progPython/buvt-SourceFs/SourceA
ls -lAigoQUv --time-style=+"%s.%N"
touch -m -d '@1716905269.022141964' a0a.txt a1a.txt a1b.txt a2a.txt a2b.txt a2c.txt ../../buvt-TargetFs/OtherStuff/stuffa.txt
touch -m -d '@1716905369.022141964' b0a.txt b1a.txt b1b.txt b2a.txt b2b.txt b2c.txt ../../buvt-TargetFs/OtherStuff/stuffb.txt
touch -m -d '@1746873142.792115391' c0.txt c1.txt
touch -m -d '@1746873242.792115391' c2.txt

touch -m -d '@1716905269.022141964' a0a.txt a1a.txt a1b.txt a2a.txt a2b.txt a2c.txt
*/


class RelationWorkB{
  static async readData(arg){
    var {charSide, argGeneral}=arg
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {objOptSource, objOptTarget, FleSSub, FleTSub, strHostTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var FleSub=boTarget?FleTSub:FleSSub
    var {boDataInTop}=objOptSide
    //var boDataInTop=false

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading database
    var argTmp=copySome({}, objOptSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, objOptSide.charTRes);

      // getRelevantForCategorizations (db)
    if(boDataInTop){ var arrDb_Upstream=arrDb, arrDb_Own=[];}
    else{
      var [arrDb_Upstream, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);
    }

    return [null, {arrDb_Upstream, arrDb_Own}]
  }

  static async findNewMTime(arg){ //MT1_2_1T1_EntriesToChangeToTurn //unifySM (WithinEachHash), unifySMForEachDistinctHash
    var {BundMT1_hash, charTRes, charSide}=arg; //, arrDbSelection

    var [Bund3D]=createBundWExtraDim(BundMT1_hash, 'sm'); // BundMT1_hash should be already bundled on strHash

    //var fsTmp=gThis[`PathSingle${charSide}`].hashMultSMNonConsistent.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    //var fsTmp=PathLoose.hashCollisionUnify.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    //var [err, obj, Arr]=parseRelations(strData, true, undefined, arr=>arr[1]); if(err) return [err]
      // Note!
      // Number of dimensions:
      //   Arr: 2D
      //   obj: 3D
      //   BundMT1: 2D.
      //   Bund3D: 3D
      // strHash (top key) in obj, BundMT1 and Bund3D has the "size"-part 0-padded differently:
      //   obj: no padding
      //   BundMT1: 0-padded.
      //   Bund3D: 0-padded
      // Ex:
      //   Arr={9f6e6800cfae7749eb6c486619254b9c:[]}
      //   obj={3_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}
      //   BundMT1={000000000003_1716905274000000000:[]}
      //   Bund3D={000000000003_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}

  
    var obj=Bund3D;

    var StrToChange=[], nToChange=0, arrToChange=[]; //, StrRevert=[], Bund3ToChange={}
    for(var strHash in obj){
      var BundSM=Object.values(obj[strHash]);
        // One can skip one bundSM (the first).
        // Sort so that the bundSM you want to skip comes first
      //BundSM.sort((A,B)=>{ return -diffMy(A.nNew, B.nNew);}); // ◢ Sort so that the least nNew is first
        // BundSM=[{nNew:0}, {nNew:0}, {nNew:1}]
      
      BundSM.sort((A,B)=>{ return diffMy(A.length, B.length);}); // ◣ Sort so that the longest is first

      var bundSM0=BundSM[0], r00=bundSM0[0], {size, strHash, mtime_ns64Floored}=r00;
      var mtime_ns64FlooredNew=mtime_ns64Floored;
      if(BundSM.length>1){
        StrToChange.push(`MatchingData ${strHash} ${size} ${mtime_ns64Floored}`);  //StrRevert.push(`MatchingData ${strHash} ${size}`)
      }
      for(var i=1;i<BundSM.length;i++){  // One can leave one (the first) bundSM unchanged
        var bundSM=BundSM[i], row0=bundSM[0], {strName, strHash}=row0;

          // Create arrToChange
        for(var j=0;j<bundSM.length;j++){
          var row=bundSM[j], {strHash, strName, mtime_ns64Floored}=row;
          var tDiff_ns=mtime_ns64Floored-mtime_ns64FlooredNew
          var rowNew=extend({}, row)
          funSetMTime(rowNew, charTRes, mtime_ns64FlooredNew)
          StrToChange.push(`  ${tDiff_ns} ${mtime_ns64Floored} ${strHash} ${strName}`);  nToChange++; //,  StrRevert.push(`  ${tDiff_ns} ${strHash} ${strName}`)
          arrToChange.push(rowNew)
        } 
      }
    }
    //var nRevert=nToChange

    //var strHead=`string int int64\nstrHash size mtime_ns64Floored\nint64 int64 string string\ntDiff_ns mtime_ns64FlooredOld strHash strName`;
    var StrHead=[`string int int64`, `strHash size mtime_ns64FlooredNew`, `int64 int64 string string`, `diff_ns mtime_ns64FlooredOld strHash strName`];
    var StrToChangeShort=formatTitle(StrToChange)
    if(StrToChange.length) {StrToChange.unshift(...StrHead); StrToChangeShort.unshift(StrHead[1], StrHead[3]); }
    var [err]=await writeFile(PathLoose.hashCollisionUnifyToChange.fsName, StrToChange.join('\n')); if(err) {debugger; return [err];}
  
    // var strHead=`string int int64\nstrHash size mtime_ns64Floored\nint64 string string\ntDiff_ns strHash strName`;
    // var StrRevertShort=formatTitle(StrRevert)
    // if(StrRevert.length) StrRevert.unshift(strHead);
    // var [err]=await writeFile(gThis[`PathSingle${charSide}`].smRevert.fsName, StrRevert.join('\n')); if(err) {debugger; return [err];}
  
    return [null, {nToChange, StrToChangeShort, arrToChange}]; //, nRevert, StrRevertShort
  }

}



class HashMultWorkDelete{
  constructor(){ }
  async getMult(arg){
    // var {fsSourceDir, strHostTarget, fsTargetDbDir, charTRes, charSide}=arg
    // var boTarget=charSide=='T'

    // var fsSourceDb=fsSourceDir+charF+settings.leafDb, fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    // var [strHost, fsDbDir, fsDb]=boTarget?[strHostTarget, fsTargetDbDir, fsTargetDb]:[null, fsSourceDir, fsSourceDb]
    // extend(this, {fsDbDir, fsDb, strHost})


    var {charSide, argGeneral}=arg
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {objOptSource, objOptTarget, FleSSub, FleTSub, strHostTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var FleSub=boTarget?FleTSub:FleSSub
    var {fsDb}=objOptSide

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading database
    var argTmp=copySome({}, objOptSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, objOptSide.charTRes);

      // getRelevantForCategorizations (db)
    var [arrDb_Upstream, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);
    //return [null, {arrDb_Upstream, arrDb_Own}]


    //var arrDb=arrDb_Own


    arrDb_Own.sort(funDecSM);
    var BundHash=bundleOnProperty(arrDb_Own, 'strHash'),  nPatHash=Object.keys(BundHash).length
    var [BundHashMult, nHashMult, arrSingle]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(BundHashMult).length;


    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=format1x2D(BundHashMult, funMatch, funUnique)
    var StrKeepShort=formatTitle(StrLongList)
    var StrHead=[`string`, `strHash`, `int int64 string`, `size mtime_ns64 strName`];
    if(StrLongList.length) {StrLongList.unshift(...StrHead); StrKeepShort.unshift(StrHead[1], StrHead[3]);}
    var myWriter=new MyWriterSingle(PathLoose.hashCollisionKeep, StrLongList);
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

  
    extend(this, {arrDb, BundHashMult})
    return [null, {StrKeepShort, nPat:nPatHashMult, nTot:nHashMult}]
  }

  async delete(arg){

    var {charSide, argGeneral}=arg
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {objOptSource, objOptTarget, FleSSub, FleTSub, strHostTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {fsDb, fsDbDir, strHost}=objOptSide

    var {arrDb, BundHashMult}=this;

    var [err, strData]=await readStrFile(PathLoose.hashCollisionKeep.fsName);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, obj, ArrKeep]=parseRelations(strData, true); if(err) return [err]
    
    var arrRef=[];  for(var k in BundHashMult){ var arr=BundHashMult[k]; arrRef=arrRef.concat(arr); }
    var arrKeep=[];  for(var k in ArrKeep){ var arr=ArrKeep[k]; arrKeep=arrKeep.concat(arr); }
    arrDb.sort(funIncStrName);  arrRef.sort(funIncStrName);  arrKeep.sort(funIncStrName) 
    var [err, arrRefMatch, arrKeepMatch, arrRefRem, arrKeepRem]=extractMatching(arrRef, arrKeep, ['strName']); if(err) {debugger; return [err];}
    if(arrKeepRem.length) {debugger; return [Error("arrKeepRem.length>0")];}

    var arrDelete=arrRefRem
    var boConfirm=confirm(`Deleting ${arrDelete.length} entries.`);
    if(!boConfirm) return [Error('aborted')]
    var StrTmp=arrDelete.map(row=>fsDbDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHost);  if(err) {debugger; return [err];}

    var [err, arrDbMatch, arrDeleteMatch, arrDbRem, arrDeleteRem]=extractMatching(arrDb, arrDelete, ['strName']); if(err) {debugger; return [err];}
    if(arrKeepRem.length) {debugger; return [Error("arrKeepRem.length>0")];}
    var arrDbNew=arrDbRem

    var [err]=await writeDbWrapper(arrDbNew, fsDb, strHost); if(err) { return [err];}
    return [null]
  }
}





/****************************************************************************************
 * 
 ****************************************************************************************/

var parseNDump=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}=arg
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  var Str=arrTreef.map(row=>row.strName)
  var nFile=Str.length, StrShortList=formatTitle(Str)


  var fsTmp=PathParseNDump[charFilterMethod].fsName;
  if(Str.length) Str.push('') // End the last line with a newline
  var strOut=Str.join('\n')
  var [err]=await writeFile(fsTmp, strOut); if(err) {debugger; return [err];}
  return [null, {nFile, StrShortList}]
}


var listEmptyFolders=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}=arg
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  //var arrTree=arrTreeF+arrTreef, arrTree.sort(funIncStrName);
  var Strf=arrTreef.map(row=>row.strName), StrF=arrTreeF.map(row=>row.strName+charF), Str=[].concat(StrF,Strf)
  Str.sort();

  var StrEmpty=[];
  for(var i=0;i<Str.length-1;i++){
    var str=Str[i], l=str.length, lm1=l-1, boF=str[lm1]==charF
    if(boF){
      var strNext=Str[i+1];
      var boDirMatch=str.slice(0, lm1)==strNext.slice(0, lm1); // boDirMatch: Next file is in the (current) directory
      if(!boDirMatch) StrEmpty.push(str);
    }
  }
  var str=Str[Str.length-1], l=str.length, lm1=l-1, boF=str[lm1]==charF
  if(boF) StrEmpty.push(str);

  var nEmpty=StrEmpty.length
  var StrShortList=formatTitle(StrEmpty)

  var fsTmp=PathLoose.emptyFolders.fsName;
  if(StrEmpty.length) StrEmpty.push('') // End the last line with a newline
  var strOut=StrEmpty.join('\n')
  var [err]=await writeFile(fsTmp, strOut); if(err) {debugger; return [err];}
  return [null, nEmpty, StrShortList]
}


var checkViaPython=async function(arg){
  var {fiDbDir='.', fiDb, charTRes, iStart=0, myConsole, strHost}=arg
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';


  var arrCommand=[];
  if(boRemote) {
    if(strOS=='win32') {debugger; return [Error('On windows only local access is allowed')];}
    var arrCommand=['ssh', strHost, 'python', interfacePython.fsScriptRemote]
  }else{
    var arrCommand=['python', interfacePython.fsScriptLocal]
  }
  arrCommand.push('check', '--fiDbDir', fiDbDir, '--charTRes', charTRes);
  
  if(fiDb) arrCommand.push('--fiDb', fiDb);
  if(iStart) arrCommand.push('--iStart', iStart);
  
  var nReceivedTot=0; //, nCounter=0;
  var cbData=function(data){
    //data=data.toString(); 
    //var n=data.split('\n').length-1;  nReceivedTot+=n
    term.write(data);
    //setMess(nCounter++)
    // var n=0; data.forEach(v => {if(v==10) n++});
    // nReceivedTot+=n
    // term.writeln(nReceivedTot);
  }

  var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData);   if(stdErr) { debugger; return [stdErr];}

  if(stdErr || exitCode) {
    //myConsole.error(stdErr);
    //myConsole.makeSpaceNSave()
  } 

  return [null]
}



/*********************************************************************
 * moveMeta
 *********************************************************************/
var moveMeta=async function(arg){ //Not used
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fleData, fiDbS, fiDirT, fiDbOther, charFilterMethod}=arg

  debugger

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(fiDbS); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbS); if(err) return [err]
  var [err, arrDbS]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDbS, charTRes);

    // Parse fiDbOther
  var [err, fsDbOther]=await myRealPath(fiDbOther); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbOther);
  if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
  var [err, arrDbOther]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDbOther, charTRes);

    // Parse tree
  var [err, fsDir]=await myRealPath(fiDirT); if(err) {debugger; return [err];}
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  var [arrDbOtherRelevant, arrDbOtherNonRelevant] =ArrDb.selectFrArrDbOld(arrDbOther, fleData)
  var arrDbOtherOrg=arrDbOther,   arrDbOther=arrDbOtherRelevant

  // var [arrTreefRelevant, arrTreefNonRelevant] =ArrDb.selectFrArrDbOld(arrTreef, fleData)
  // arrTreefOrg=arrTreef;   arrTreef=arrTreefRelevant


  arrTreef.sort(funIncStrName);   arrDbS.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbSMatch, arrTreeRem, arrDbSRem]=extractMatching(arrTreef, arrDbS, ['strName'], ['strName']);
  if(err) {debugger; return [err];}

  //if(arrTreeRem.length || arrDbRem.length) return [Error("arrTreeRem.length OR arrDbRem.length")];
  //if(arrTreeRem.length) return [Errir("arrTreeRem.length")]

  for(var i in arrDbSMatch){
    var rowDbS=arrDbSMatch[i]
    var rowTree=arrTreeMatch[i]
    rowDbS.id=rowTree.id
  }

  var arrDbOtherNew=arrDbSMatch
  if(rtrim(fleData).length>0){
    for(var row of arrDbOtherNew) row.strName=fleData+row.strName
  }

  arrDbOtherNew=arrDbOtherNonRelevant+arrDbOtherNew
  arrDbOtherNew.sort(funIncStrName)
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbOtherNew.length} entries to db-file.`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbOtherNew)
  var [err]=await writeDbFile(strData, fsDbOther); if(err) {debugger; return [err];}

  return [null];
}


/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(arg){ //Not used
  var {leafFilter, leafFilterFirst, charFilterMethod}=arg
  var [err, result]=await getSelectedFrFileWExtra(); if(err) {debugger; return [err];}
  var {fsSourceDir}=result
  var arg={fsDir:fsSourceDir, charTRes, leafFilter, leafFilterFirst}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(arg); if(err) {debugger; return [err];}

  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrTrf, arrTrF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  arrTrf.sort(funIncStrName)
  arrTrF.sort(funIncStrName)
  arrRsf.sort(funIncStrName)
  arrRsF.sort(funIncStrName)
  var nRsf=arrRsf.length, nRsF=arrRsF.length
  var nf=arrTrf.length, nF=arrTrF.length
  var leafResult='resultFrTestFilter.txt'
  var StrOut=[]
  for(var row of arrTrf) StrOut.push(row.strName)
  for(var row of arrTrF) StrOut.push(row.strName)
  var strOut=StrOut.join('\n')
  var [err]=await writeFile(leafResult, strTmp); if(err) {debugger; return [err];}

  var leafResultRs='resultFrTestFilterRs.txt'
  var StrOut=[]
  for(var row of arrRsf) StrOut.push(row.strName)
  for(var row of arrRsF) StrOut.push(row.strName)
  StrOut.push('  arrRsOther:\n')
  for(var row of arrRsOther) StrOut.push(row)
  var strOut=StrOut.join('\n')
  var [err]=await writeFile(leafResultRs, strTmp); if(err) {debugger; return [err];}


  myConsole.log(`${leafResult} and ${leafResultRs} written`)
  return [null]
}



var changeIno=async function(arg){ //Not used
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiDir, fleData, charFilterMethod}=arg
  debugger
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var leafDb=settings.fiDb
  var fsDb=fsDir+charF+settings.leafDb

    // Parse tree
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  removeFileFromArrTreef(arrTreef, settings.leafDb)
  removeFileFromArrTreef(arrTreef, RegExp('buvtDb\\.bak[0-9]*\\.txt'))
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDb, charTRes);

  var [arrDbRelevant] =ArrDb.selectFrArrDbOld(arrDb, fleData)
  var arrDbOrg=arrDb,   arrDb=arrDbRelevant

  arrTreef.sort(funIncStrName);  arrDb.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbMatch, arrTreeRem, arrDbRem]=extractMatching(arrTreef, arrDb, ['strName'], ['strName'])
  if(err) {debugger; return [err];}


  for(var i in arrDbMatch){
    var rowDb=arrDbMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDb)) rowDb.uuid=myUUID()
    rowDb.id=rowTree.id
  }

  var arrDbNew=arrDbMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return [null];}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to db-file.`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbNew)
  var [err]=await writeDbFile(strData, fsDb); if(err) {debugger; return [err];}

  setMess('changeIno: Done');
  return [null];
}

var utilityMatchTreeAndDbFile=async function(arg){
    // For running different experiments
    // Not used
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fleData, fiDir, charFilterMethod}=arg
  debugger
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var leafDb=settings.fiDb
  var fsDb=fsDir+charF+settings.leafDb

    // Parse tree
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  removeFileFromArrTreef(arrTreef, settings.leafDb)
  removeFileFromArrTreef(arrTreef, RegExp('buvtDb\\.bak[0-9]*\\.txt'))
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDb, charTRes);

  var [arrDbRelevant] =ArrDb.selectFrArrDbOld(arrDb, fleData)
  var arrDbOrg=arrDb,   arrDb=arrDbRelevant

  arrTreef.sort(funIncStrName);  arrDb.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbMatch, arrTreeRem, arrDbRem]=extractMatching(arrTreef, arrDb, ['strName'], ['strName'])


  for(var i in arrDbMatch){
    var rowDb=arrDbMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDb)) rowDb.uuid=myUUID()
    rowDb.id=rowTree.id
  }

  var arrDbNew=arrDb
  
  //if(boDryRun) {print("(Dry run) exiting"); return [null];}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to db-file.`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbNew)
  var [err]=await writeDbFile(strData, fsDb); if(err) {debugger; return [err];}

  setMess('utilityMatchTreeAndDbFile: Done');
  return [null];
}


var utilityMatchDbFileAndDbFile=async function(){
    // For running different experiments
    // Not used
  var {charTRes=settings.charTRes, leafFilterFirst, fiDbS, fiDbT, fleData}=arg
  debugger

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(fiDbS); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbS); if(err) return [err]
  var [err, arrDbS]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDbS, charTRes);

    // Parse fiDbT
  var [err, fsDbT]=await myRealPath(fiDbT); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbT); if(err) return [err]
  var [err, arrDbT]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDbT, charTRes);

  var [arrDbTRelevant, arrDbTNonRelevant] =ArrDb.selectFrArrDbOld(arrDbT, fleData)
  var arrDbTOrg=arrDbT,   arrDbT=arrDbTRelevant


  arrDbS.sort(funIncStrName);   arrDbT.sort(funIncStrName)
  var [err, arrDbSMatch, arrDbTMatch, arrDbSRem, arrDbTRem]=extractMatching(arrDbS, arrDbT, ['strName'])

    // Move uuid to arrDbMatch
  // for(var i in arrDbSMatch){
  //   var row=arrDbSMatch[i]
  //   rowT=arrDbTMatch[i]
  //   rowT.uuid=row.uuid
  // }

  if(rtrim(fleData).length>0){
    for(var row of arrDbT) row.strName=fleData+row.strName
  }

  var arrDbNew=arrDbTNonRelevant.concat(arrDbTMatch, arrDbTRem)
  
  //if(boDryRun) {print("(Dry run) exiting"); return [null];}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to db-file.`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbNew)
  var [err]=await writeDbFile(strData, fsDbT); if(err) {debugger; return [err];}

  setMess('utilityMatchDbFileAndDbFile: Done')
  return [null];
}

var replacePrefix=async function(arg){  // For running different experiments 
  var {charTRes=settings.charTRes, fiDb, strOldPrefix, strNewPrefix}=arg
  if(strOldPrefix==strNewPrefix) {setMess('replacePrefix: strOldPrefix==strNewPrefix, Nothing to do.'); return [null]}

    // Parse fiDbS
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
  funSetMTimeArr(arrDb, charTRes);
  arrDb.sort(funIncStrName)

  var lOld=strOldPrefix.length, nChange=0
  for(var row of arrDb){
    var {strName}=row, strCandidate=strName.slice(0,lOld);
    if(strCandidate==strOldPrefix){
      row.strName=strNewPrefix+strName.slice(lOld)
      nChange++
    }
  }
  
  if(boAskBeforeWrite){
    var strMess=`Changed: ${nChange}\nWriting ${arrDb.length} entries to db-file.`;
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null]
  }
  var strData=formatDb(arrDb)
  var [err]=await writeDbFile(strData, fsDb); if(err) {debugger; return [err];}

  setMess('replacePrefix: Done');
  return [null]
}


var utilityT2T=async function(arg){
    // For running different experiments
    // Not used
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fsSourceDir, fsTargetDbDir, fsTargetDataDir, charFilterMethod}=arg

  var treeParser=new TreeParser()
  setMess(`Parsing source tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  setMess(`Parsing target tree`, null, true)
  var arg={charTRes, fsDir:fsTargetDataDir}
  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

    // Extract untouched files  // nm
  arrSourcef.sort(funIncStrName);   arrTargetf.sort(funIncStrName)
  var [err, arrSourceUntouched, arrTargetUntouched, arrSourceTouched, arrTargetTouched]=extractMatching(arrSourcef, arrTargetf, ['strName', 'sm']); if(err) return [err];   

  var arrS=arrSourceUntouched, arrT=arrTargetUntouched
  var nPos=0, nNeg=0, nZero=0
  //var arrS=arrSourceTouched, arrT=arrTargetTouched

  for(var i=0; i<arrS.length; i++ ){
    var rS=arrS[i], rT=arrT[i]
    var d=rT.mtime_ns64-rS.mtime_ns64
    if(d>0){ nPos++; } else if(d<0){  nNeg++;} else { nZero++ }
  }
  for(var i=0; i<arrS.length; i++ ){
    var rS=arrS[i], rT=arrT[i]
    var tS=rS.mtime_ns64, tT=rT.mtime_ns64
    var d=tT-tS
    if(d>0){
      var arrCommand=['touch', '-mr', fsTargetDataDir+charF+rT.strName, fsSourceDir+charF+rS.strName];
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; } 
    } 
  }
  for(var i=0; i<arrS.length; i++ ){
    var rS=arrS[i], rT=arrT[i]
    var tS=rS.mtime_ns64, tT=rT.mtime_ns64
    var d=tT-tS
    if(d<0){ 
      var arrCommand=['touch', '-mr', fsSourceDir+charF+rS.strName, fsTargetDataDir+charF+rT.strName];
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; }
    }
  }
  return [null]
    
}


// var deleteResultFilesasync=async function(){ 
//   for(const strTmp of StrStemReport){
//     let fsFile=FsResultFile[strTmp]

//     var [err, result]=await removeFile(fsFile);
//     if(err) {
//       if(err.code==STR_ENOENT) myConsole.log("Couldn't delete: "+fsFile)  //STR_NE_FS_FILRMER
//       else {debugger; return [err];}
//     }
//     myConsole.log("Deleted: "+basename(fsFile))
//   }
//   return [null];
// }
