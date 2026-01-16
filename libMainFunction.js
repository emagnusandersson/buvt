
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
  arrDb.sort(funIncId)
  var BundId=bundleOnProperty(arrDb, 'id'),  nIdDb=Object.keys(BundId).length
  var [BundDbMult, nMultDb]=extractBundlesWMultiples(BundId),  nIdMultDb=Object.keys(BundDbMult).length;
  var nIdDb=0, nMultDb=0, nIdMultDb=0

  var boHL=Boolean(nMultf || nMultF || nMultDb)
  var objHL={nMultf, nIdMultf, nIdf, nTreef:arrTreef.length,   nMultF, nIdMultF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nIdMultDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

  if(nIdMultf || nIdMultF || nIdMultDb) {
    var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
    var StrTmpf=formatListBundled(BundTreefMult, funMatch, funUnique)
    var StrTmpF=formatListBundled(BundTreeFMult, funMatch, funUnique)
    myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    
    var Str=([].concat(StrTmpF, StrTmpf));
    var strHov=formatTitleStr(Str)
    objHL.strTmpShortList=strHov
    return [null, objHL];
  }
  return [null]

}
var categorizeSMRelations=async function(arrTreef, arrDb, charSide){
  var PathCur=gThis[`Path${charSide}`],   myResultWriter=new MyWriter(PathCur)

      // Mult 1 (Multiple SM in all files)
  //arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
  var RelationSM=bundleOnProperty2(arrTreef, arrDb, row=>row.sm)
  var Mat1=new MatNxN(); Mat1.assignFromObjManyToMany(RelationSM);
  Mat1.setMTMLabel()
  formatMultiPots(myResultWriter, Mat1, 1)


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
  var RelM2=bundleOnProperty2(arrTrTouched, arrDbTouched, row=>row.sm)
  var Mat2=new MatNxN();  Mat2.assignFromObjManyToMany(RelM2);
  var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
  var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
  var arrTrM1T1=[].concat(Mat2.arrA[1][1]);
  var arrDbM1T1=[].concat(Mat2.arrB[1][1]);
  var ArrTrMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
  var ArrDbMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
  var arrTrMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
  var arrDbMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
  //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
  // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
  //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭


    // Copy strHash for M1T1
  for(var i=0;i<arrDbM1T1.length;i++){ arrTrM1T1[i].strHash=arrDbM1T1[i].strHash; }

    // Copy strHash for MMult etc.
  for(var i=0;i<ArrDbMMult.length;i++){
    var arrDbWCertainSM=ArrDbMMult[i], arrTrWCertainSM=ArrTrMMult[i]
    var row0=arrDbWCertainSM[0], strHash0=row0.strHash, boHashMatchAll=true; // has allways a length greater than 0
      // Check that all hashes (for the current SM) in db are the same
    for(var j=1;j<arrDbWCertainSM.length;j++){
      var row=arrDbWCertainSM[j], {strHash}=row;
      if(strHash0!==strHash) {boHashMatchAll=false; debugger; return [Error("strHash0!==strHash")];}
    }
      // Copy strHash for MMult
    for(var j=0;j<arrTrWCertainSM.length;j++){ var row=arrTrWCertainSM[j];   row.strHash=strHash0;  }
  }

  myResultWriter.Str.allTr=formatList(arrTree, ...ObjKeyList['allTr']);
  myResultWriter.Str.allDb=formatList(arrDb, ...ObjKeyList['allDb']);
  
    // Copy strHash for Untouched
  for(var i=0;i<arrTrUntouched.length;i++){ arrTrUntouched[i].strHash=arrDbUntouched[i].strHash; }
  myResultWriter.Str.untouched=formatList(arrTrUntouched, ...ObjKeyList['untouched']);
  var arrUntouched=arrTrUntouched


  arrCreate.sort(funIncStrName)
  arrDelete.sort(funIncStrName)

  var ObjFeedback={}
  ObjFeedback.objTree={strHov:undefined, nFile:arrTree.length}
  ObjFeedback.objDb={strHov:undefined, nFile:arrDb.length}
  ObjFeedback.objUntouched={strHov:undefined, nFile:arrUntouched.length}
  ObjFeedback.objCreate={strHov:formatTitleStrName(arrCreate), nFile:arrCreate.length}
  ObjFeedback.objDelete={strHov:formatTitleStrName(arrDelete), nFile:arrDelete.length}

  var fun1T1=r=>`${r[0].strName}\n  => ${r[1].strName}`
  var arrTmp=[arrTrM1T1.slice(0,nShortListMax), arrDbM1T1.slice(0,nShortListMax)];  arrTmp=Mat.transpose(arrTmp)
  var strHov=formatTitleStr(arrTmp, fun1T1)
  ObjFeedback.objM1T1={strHov, nFile:arrTrM1T1.length}

    // Writing to category files
  myResultWriter.Str.created=formatList(arrCreate, ...ObjKeyList['created']);
  myResultWriter.Str.deleted=formatList(arrDelete, ...ObjKeyList['deleted']);
  myResultWriter.Str.M1T1=formatRelation1T1(arrTrM1T1, arrDbM1T1, false)
  //myResultWriter.Str.M1T1Relation=formatRelation(Mat2.ArrA[1][1], Mat2.ArrB[1][1], ...ObjKey['M1T1'])
  //myResultWriter.Str.M1T1RelationCustom=formatRelationCustom(Mat2.ArrA[1][1], Mat2.ArrB[1][1])
  //debugger

  setBestNameMatchFirst(ArrTrMMult, ArrDbMMult)

  //   // Sort by size
  // ArrTrMMult.forEach((el, i)=>el.ind=i); // Set index
  // var funInc=(a,b)=>a[0].size-b[0].size;
  // var ArrAtmp=[...ArrTrMMult].sort(funInc)
  //   // Create Ind
  // var Ind=ArrAtmp.map(entry=>entry.ind)
  // var ArrBtmp=eInd(ArrDbMMult, Ind)
  //var StrTmp=myResultWriter.Str.STMatch2=formatRelationCustom(ArrTrMMult, ArrDbMMult); 

  var [StrTmp, strHov]=formatRelationCustom(ArrTrMMult, ArrDbMMult);
  myResultWriter.Str.STMatch2=StrTmp
  //var strHov=formatTitleStr(StrTmp.slice(4))
  ObjFeedback.objSTMatch2={strHov, nFile:undefined}

  myResultWriter.Str.hl=[]

  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

  var objOut={Mat1, boChanged, Mat2, ObjFeedback}
  extend(objOut, {arrTrUntouched, arrTrM1T1, arrTrMMult, arrDbUntouched, arrDbM1T1, arrDbMMult, arrCreate})
  return [null, objOut];
}



//var addHashToCreated=async function(arrCreated, argSide){  // Read "created" and add hashcodes to it.
var addHashToCreated=async function(arrCreated, objOptSide){  // Read "created" and add hashcodes to it.
  //var {charSide, fsDbDir, strHost}=argSide
  var {charSide, fsDbDir, strHost}=objOptSide

  var PathCur=gThis[`Path${charSide}`]

  // var fsTmp=PathCur.created.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
  // var [err, arrCreated]=parseSSVWType(strData); if(err) return [err]


    // Brute force work
  var [err, StrHash]=await calcHashes(arrCreated, fsDbDir, strHost); if(err) { return [err];}
  if(StrHash.length!=arrCreated.length) { return [Error('StrHash.length!=arrCreated.length')];}
  for(var i=0;i<arrCreated.length;i++){
    var row=arrCreated[i], strHash=StrHash[i]
    if(strHash.length!=32) { return [Error('strHash.length!=32')];}
    row.strHash=strHash
  }

  var StrTmp=formatList(arrCreated, ['strType', 'strHash', 'size', 'mtime_ns64', 'strName']);
  //var [err]=await writeFile(fsName, StrTmp.join('\n')); if(err) {debugger; return [err];}
  var myResultWriter=new MyWriterSingle(gThis[`Path${charSide}`].created);
  myResultWriter.Str=StrTmp
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  
  return [null]
}



var writeTmpDb=async function(arrDb, argSide){  // Read "created" and add hashcodes to it.
  var {charSide, fsDbDir, strHost}=argSide

  var StrTmp=formatList(arrDb, ['strType', 'boNew', 'strHash', 'size', 'mtime_ns64', 'strName']);
  var myResultWriter=new MyWriterSingle(gThis[`Path${charSide}`].dbTmp);
  myResultWriter.Str=StrTmp
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

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading database
    var argTmp=copySome({}, objOptSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, objOptSide.charTRes);

      // getRelevantForCategorizations (db)
    var [arrDb_Others, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);


      // Parsing tree
    var strMess=`Parsing ${strSide} tree`;   setMess(strMess, null, true)
    var argTmp=copySome({}, objOptSide, ['charTRes', 'strHost', 'charFilterMethod', 'leafFilter', 'fsDir']);
    var [err, arrTreef, arrTreeF] =await treeParserW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrTreef, objOptSide.charTRes);
    var objOut={arrDb, arrTreef};

      // Set boNew=false
    //arrTreef.forEach(r=>r.boNew=false);

      // getRelevantForCategorizations (tree)
    var [arrTr_Others, arrTr_Own]=ArrDb.selectWPrefixArr(arrTreef, FleSub);
    extend(objOut, {arrDb_Others, arrDb_Own, arrTr_Own})
    if(arrDb_Others.length!=arrTr_Others.length) {debugger; return [Error('arrDb_Others.length!=arrTr_Others.length')];}


    var [err, objHL]=await checkingForMultipleIds(arrTreef, arrTreeF, arrDb, charSide); if(err) {debugger; return [err];}
    //if(objHL) {divT2DBoth.setHLVal(objHL, iSide); debugger; return [null, {objHL}];}

    var ArgTmp=[arrTr_Own, arrDb_Own]
    var [err, objCategory]=await categorizeSMRelations(...ArgTmp, charSide); if(err) {debugger; return [err];}
    extend(objOut, {objCategory});
    //divT2DBoth.setVal(objCategory, iSide);

      // boChanged
    var {arrCreate, boChanged}=objCategory, boCreated=Boolean(arrCreate.length)
    extend(objOut, {boCreated, boChanged})

    return [null, objOut]
  }

  static fun1_5CreateNewDb(syncDb){
    var {objCategory}=syncDb
    var {arrTrUntouched, arrTrM1T1, arrTrMMult, arrCreate}=objCategory;
    var arrDbOwnNew=[].concat(arrTrUntouched, arrTrM1T1, arrTrMMult, arrCreate); //, syncDb.arrDb_Others
    extend(syncDb, {arrDbOwnNew})
  }

  static async fun2AddHash(charSide, argGeneral, syncDb){
    var boTarget=charSide=='T';
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {objCategory}=syncDb, {arrCreate}=objCategory;
    var [err]=await addHashToCreated(arrCreate, objOptSide); if(err) {debugger; return [err];}
      // Write temporary db
    //var [err]=await writeTmpDb(arrDbOwnNew, argSide); if(err) {debugger; return [err];}
    return [null]
  }

  static async fun3GetMultSM(argGeneral, syncDb, boTarget){
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes, charSide}=objOptSide;

    var {objCategory, arrDbOwnNew, arrDb, arrTreef}=syncDb;
    var {arrCreate}=objCategory;

    funSetMTimeArr(arrDb, charTRes)
    funSetMTimeArr(arrTreef, charTRes)
    funSetMTimeArr(arrCreate, charTRes)
    funSetMTimeArr(arrDbOwnNew, charTRes)

      // SM collision check for new SM
      // Get Relevant For SM Collision Check
    arrTreef.forEach(r=>r.boNew=false);
    arrDb.forEach(r=>r.boNew=false);

    arrCreate.forEach(r=>r.boNew=true); //arrCreate_T.forEach(r=>r.boNew=false);
    var [err, result]=await MultWork.getMult({arrDbSelection:arrDbOwnNew, charSide}); if(err) {debugger; return [err];}
    //var {BundXTM}=result
    return [null, result]
  }
  static async fun35FindNewMTime(arg, argGeneral, syncDb, boTarget){
    var {BundXTM}=arg
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes, charSide}=objOptSide;
    var {objCategory, arrDbOwnNew, arrDb, arrTreef}=syncDb;

    var [err, result]=await MultWork.findNewMTime({BundXTM, arrDbSelection:arrDbOwnNew, charTRes, charSide}); if(err) {debugger; return [err];}
    //var {nToChange, StrToChangeShort, nRevert, StrRevertShort, arrToChange}=result

    return [null, result]
  }

  static async fun4WriteDb(arrToChange, syncDb, argGeneral, boTarget){
    var {arrDbOwnNew}=syncDb
    var {objOptSource, objOptTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var {charTRes}=objOptSide
    
    MultWork.copyTDiff(arrDbOwnNew, arrToChange, charTRes)

    var arrDbNew=[].concat(arrDbOwnNew, syncDb.arrDb_Others);

    var argTmp=copySome({}, objOptSide, ["fsDbDir", "fsDb", "strHost"]);
    var [err]=await MultWork.mySetMTime(arrToChange, arrDbNew, argTmp); if(err) {debugger; return [err];}

    return [null]
  }
}

var createBundWExtraHashDim=function(BundIn, strB='strHash'){
  var Bund3D={}
  //var BundXTM={}, BundXT1={}, nTotXTM=0, nTotXT1=0
  for(var keyA in BundIn){
    var bundA=BundIn[keyA], objT={}
    for(var i=0;i<bundA.length;i++){
      var r=bundA[i], keyB=r[strB];
      if(!(keyB in objT)) objT[keyB]=[];
      objT[keyB].push(r);
    }
    //var ArrTmp=Object.values(objT); Bund3D[keyA]=ArrTmp;
    Bund3D[keyA]=objT;
    //var Key=Object.keys(objT); 
    //if(Key.length>1) { BundXTM[keyA]=bundA; nTotXTM+=bundA.length;}
    //else {BundXT1[keyA]=bundA; nTotXT1+=bundA.length;}
  }
  return [Bund3D]; //, BundXTM, BundXT1, nTotXTM, nTotXT1
}
// var [Bund3D, BundXTM, BundXT1, nTotXTM, nTotXT1]=createBundWExtraHashDim(BundSMMult, 'strHash');


//arrCreated, arrChanged, arrDb
class MultWork{
  static async getMult(arg){
    var {arrDbSelection, charSide}=arg;
    
    arrDbSelection.sort(funDecSM);

    var {arrMTM, arr1TM, arrMT1, arr1T1}=categorizePropertyRelation(arrDbSelection, 'sm', 'strHash')
    var Bund1TM=bundleOnProperty(arr1TM, 'sm'), BundMTM=bundleOnProperty(arrMTM, 'sm'), Bund1T1=bundleOnProperty(arr1T1, 'sm'), BundMT1=bundleOnProperty(arrMT1, 'strHash');
    var [Bund1T1_mult, nTot1T1_mult, arrSingle]=extractBundlesWMultiples(Bund1T1)
    var n1T1_single=arrSingle.length;

    var nPat1TM=Object.keys(Bund1TM).length, nPatMTM=Object.keys(BundMTM).length, nPat1T1_mult=Object.keys(Bund1T1_mult).length, nPatMT1=Object.keys(BundMT1).length;

    var BundXTM=extend({}, BundMTM); extend(BundXTM, Bund1TM);
    var nTotMTM=arrMTM.length, nTot1TM=arr1TM.length, nTotMT1=arrMT1.length, nTot1T1=arr1T1.length


    var funMatchXTM=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUniqueXTM=s=>`  ${s.strHash} ${s.strName}`;
    //var strHeadXTM=`int int64\nsize mtime_ns64Floored\nstring string\nstrHash strName`, strHeadXTMShort=`size mtime_ns64Floored\\nstrHash strName`;
    var StrHead=[`int int64`, `size mtime_ns64Floored`, `string string`, `strHash strName`];
    var strHeadXTM=StrHead.join('\n'), strHeadXTMShort=StrHead[1]+'\n'+StrHead[3];

    var StrLongList=formatListBundled(Bund1TM, funMatchXTM, funUniqueXTM), len=StrLongList.length; 
    var Str1TMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHeadXTM); Str1TMShort.unshift(strHeadXTMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collision1TM);  myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var StrLongList=formatListBundled(BundMTM, funMatchXTM, funUniqueXTM), len=StrLongList.length;
    var StrMTMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHeadXTM); StrMTMShort.unshift(strHeadXTMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collisionMTM);  myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var StrLongList=formatListBundled(BundXTM, funMatchXTM, funUniqueXTM), len=StrLongList.length;
    var StrXTMShort=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHeadXTM); StrXTMShort.unshift(strHeadXTMShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collisionXTM);  myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}


    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored} ${s.strHash}`,  funUnique=s=>`  ${s.strName}`;
    var StrLongList=formatListBundled(Bund1T1_mult, funMatch, funUnique), len=StrLongList.length;
    //var strHead=`int int64 string\nsize mtime_ns64Floored strHash\nstring\nstrName`, strHeadShort=`size mtime_ns64Floored strHash\nstrName`;
    var StrHead=[`int int64 string`, `size mtime_ns64Floored strHash`, `string`, `strName`]
    var strHead=StrHead.join('\n'), strHeadShort=StrHead[1]+'\n'+StrHead[3];
    var Str1T1_mult_Short=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead); Str1T1_mult_Short.unshift(strHeadShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collision1T1_mult);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.strHash}`,  funUnique=s=>`  ${s.mtime_ns64Floored} ${s.strName}`;
    //var strHead=`int string\nsize strHash\nint64 string\nmtime_ns64Floored strName`, strHeadShort=`size strHash\nmtime_ns64Floored strName`;
    var StrHead=[`int string`, `size strHash`, `int64 string`, `mtime_ns64Floored strName`]
    var strHead=StrHead.join('\n'), strHeadShort=StrHead[1]+'\n'+StrHead[3];
    var StrLongList=formatListBundled(BundMT1, funMatch, funUnique), len=StrLongList.length;
    var StrMT1Short=formatTitle(StrLongList); if(len) { StrLongList.unshift(strHead); StrMT1Short.unshift(strHeadShort);}
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].collisionMT1);  myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}


    //return [null, {StrConsistentShort, StrNonConsistentShort, nTotXT1, nPatXT1, nTotXTM, nPatXTM}]
    return [null, {BundXTM, BundMT1, nTot1TM, nPat1TM, nTotMTM, nPatMTM, n1T1_single, nTot1T1_mult, nPat1T1_mult, nTotMT1, nPatMT1, Str1TMShort, StrMTMShort, StrXTMShort, Str1T1_mult_Short, StrMT1Short}]
  }
  async readNonConsistantFrFile(){
    
  }
  static async findNewMTime(arg){ //XTM_2_XT1_EntriesToChangeToTurn //separateSM (ForEachHash) //keyifySM_uniquify
    var {BundXTM, arrDbSelection, charTRes, charSide}=arg

    var [Bund3D]=createBundWExtraHashDim(BundXTM, 'strHash');

    var fsTmp=gThis[`PathSingle${charSide}`].collisionXTM.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true, undefined, arr=>arr[1]); if(err) return [err]
      // Note!
      // Number of dimensions:
      //   Arr: 2D
      //   obj: 3D
      //   BundXTM: 2D.
      //   Bund3D: 3D
      // keySM (top key) in obj, BundXTM and Bund3D has the "size"-part 0-padded differently:
      //   obj: no padding
      //   BundXTM: 0-padded.
      //   Bund3D: 0-padded
      // Ex:
      //   Arr={9f6e6800cfae7749eb6c486619254b9c:[]}
      //   obj={3_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}
      //   BundXTM={000000000003_1716905274000000000:[]}
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


class MultWorkB{
  static async readData(arg){
    var {charSide, argGeneral}=arg
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {objOptSource, objOptTarget, FleSSub, FleTSub, strHostTarget}=argGeneral
    var objOptSide=boTarget?objOptTarget:objOptSource
    var FleSub=boTarget?FleTSub:FleSSub

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading database
    var argTmp=copySome({}, objOptSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, objOptSide.charTRes);

      // getRelevantForCategorizations (db)
    var [arrDb_Others, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);
    return [null, {arrDb_Others, arrDb_Own}]
  }

  static async findNewMTime(arg){ //MT1_2_1T1_EntriesToChangeToTurn //unifySM (WithinEachHash), unifySMForEachDistinctHash
    var {BundMT1, arrDbSelection, charTRes, charSide}=arg

    var [Bund3D]=createBundWExtraHashDim(BundMT1, 'sm');

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
    var [arrDb_Others, arrDb_Own]=ArrDb.selectWPrefixArr(arrDb, FleSub);
    //return [null, {arrDb_Others, arrDb_Own}]


    //var arrDb=arrDb_Own


    arrDb_Own.sort(funDecSM);
    var BundHash=bundleOnProperty(arrDb_Own, 'strHash'),  nPatHash=Object.keys(BundHash).length
    var [BundHashMult, nHashMult, arrSingle]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(BundHashMult).length;


    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=formatListBundled(BundHashMult, funMatch, funUnique)
    var StrKeepShort=formatTitle(StrLongList)
    var StrHead=[`string`, `strHash`, `int int64 string`, `size mtime_ns64 strName`];
    if(StrLongList.length) {StrLongList.unshift(...StrHead); StrKeepShort.unshift(StrHead[1], StrHead[3]);}
    var myWriter=new MyWriterSingle(PathLoose.hashCollisionKeep);
    myWriter.Str=StrLongList
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
