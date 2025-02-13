
"use strict"


var hardLinkCheck=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, fiSourceDir, charFilterMethod, charSide='S'}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  //var myResultWriter=new MyResultWriter(StrStemT2D)
  var PathCur=gThis[`Path${charSide}`]
  var myResultWriter=new MyWriter(PathCur)

  arrTreef.sort(funIncId);   arrTreeF.sort(funIncId);

  var BundTreef=bundleOnProperty(arrTreef, 'id'),  nIdf=Object.keys(BundTreef).length
  var [BundTreefMult, nMultf]=extractBundlesWMultiples(BundTreef),  nIdMultf=Object.keys(BundTreefMult).length;
  var BundTreeF=bundleOnProperty(arrTreeF, 'id'),  nIdF=Object.keys(BundTreeF).length
  var [BundTreeFMult, nMultF]=extractBundlesWMultiples(BundTreeF),  nIdMultF=Object.keys(BundTreeFMult).length;

  var objArg={nMultf, nIdMultf, nIdf, nTreef:arrTreef.length,   nMultF, nIdMultF, nIdF, nTreeF:arrTreeF.length}

  var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
  var StrTmpf=formatListBundled(BundTreefMult, funMatch, funUnique)
  var StrTmpF=formatListBundled(BundTreeFMult, funMatch, funUnique)
  //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
  myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  //var strSeeMore=myResultWriter.getSeeMoreMessage()
  //myConsole.log(StrSum.concat(strSeeMore).join('\n'))
  return [null]
}






// var readDbA=async function(arg){
//   var {fsSourceDb, strHostTarget, fsTargetDb, charTResS, charTResT}=arg

//   var [err, strData]=await readStrFile(fsSourceDb);
//   if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
//   var [err, arrSourceDb]=parseDb(strData); if(err) {debugger; return [err];}
//   funSetMTimeArr(arrSourceDb, charTResS);

//   var [err, strData]=await readStrFileWHost(fsTargetDb, strHostTarget);
//   if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
//   var [err, arrTargetDb]=parseDb(strData); if(err) {debugger; return [err];}
//   funSetMTimeArr(arrTargetDb, charTResT);
//   //extend(this, {arrSourceDb, arrTargetDb})
//   return [null, arrSourceDb, arrTargetDb]
// }


  // Read dbB and make sure fleTargetDataDir exist in it.
var readNSyncDbB=async function(arg){
  var {strHostTarget, flTargetDataDir, fsTargetDbDir, fleTargetDataDir}=arg; //, fsTargetDataDir
  var FleF=[], BoExist=[], indCur
  if(flTargetDataDir){
    var fsDbB=fsTargetDbDir+charF+settings.leafDbB
    var [err, strData, boFileExist]=await readStrFileWHost(fsDbB, strHostTarget); if(err) return [err]
    var strData=strData.trim(), FleF;
    if(strData) FleF=strData.split('\n'); else FleF=[];
      // Make sure each entry ends with charF and removing multiples.
    var obj={}; for(var i=0;i<FleF.length;i++){ var flef=trim(FleF[i], charF)+charF; obj[flef]=1; }; FleF=Object.keys(obj)
      // Making sure fleTargetDataDir is in FleF and setting indCur.
    var indCur; for(var i=0;i<FleF.length;i++){ if(FleF[i]==fleTargetDataDir){ indCur=i; break;}}
    if(typeof indCur=='undefined') {FleF.push(fleTargetDataDir); indCur=FleF.length-1;}
      // Checking if the folders exist.
    var FsF=FleF.map(fleFTmp=>fsTargetDbDir+charF+fleFTmp);
    var [err, BoExist]=await fileExistArr(FsF); if(err) {debugger; return [err];}

    var strData=FleF.join('\n')
    var [err]=await writeFileRemote(fsDbB, strData, strHostTarget); if(err) {debugger; return [err];}
  }
  //extend(this, {FleF, BoExist, indCur, fleTargetDataDir})
  return [null, FleF, BoExist, indCur]
}




var treeParserW=async function(arg){
  var argTmp=copySome({}, arg, ['charTRes', 'strHost', 'charFilterMethod', 'leafFilter', 'fsDir'])
  argTmp.leafFilterFirst=argTmp.leafFilter
    // Parse tree
  var treeParser=new TreeParser()
  //var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir, charFilterMethod, strHost}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(argTmp); if(err) {debugger; return [err];}
  removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
  removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)

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
  //var {charSide, boTarget}=argSide;
  //var {charTRes, fsDb, fsDataDir, fsDbDir, strHost}=argSide
  //var {flTargetDataDir, charFilterMethod, leafFilter}=arg

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
  //var {charSide}=argSide;


  // setMess(`Fetching db`, null, true)
  // var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err]
  // setMess(`Parsing db`, null, true)
  // var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
  // funSetMTimeArr(arrDb, charTRes);

  //var arg={arrDb, boTarget, fsDbDir, strHost, flTargetDataDir}
  //var [err, arrRelevant, arrReadOnly]=await separateByRelevance(arg); if(err){debugger; return [err];}
  //var arrDb=arrRelevant

  var PathCur=gThis[`Path${charSide}`],   myResultWriter=new MyWriter(PathCur)

    // Hash match
  // var BundHash=bundleOnProperty(arrDb, 'strHash'),  nPatHash=Object.keys(BundHash).length
  // var [objHashDup, nHashMult]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(objHashDup).length;
  // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
  // var StrTmp=formatListBundled(objHashDup, funMatch, funUnique)
  // var BundHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
  // myResultWriter.Str.hash=StrTmp


      // Mult 1 (Multiple SM in all files)
  arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
  var RelationSM=categorizeByProp(arrTreef, arrDb, row=>row.sm)
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
  arrTrTouched.sort(funIncSM);   arrDbTouched.sort(funIncSM);
  var RelM2=categorizeByProp(arrTrTouched, arrDbTouched, row=>row.sm)
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
  var StrTmp=myResultWriter.Str.STMatch2=formatRelationCustom(ArrTrMMult, ArrDbMMult); 
  var strHov=formatTitleStr(StrTmp.slice(4))
  ObjFeedback.objSTMatch2={strHov, nFile:undefined}

  myResultWriter.Str.hl=[]

  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

  var objOut={Mat1, boChanged, Mat2, ObjFeedback}
  extend(objOut, {arrTrUntouched, arrTrM1T1, arrTrMMult, arrDbUntouched, arrDbM1T1, arrDbMMult, arrCreate})
  return [null, objOut];
}



var addHashToCreated=async function(arrCreated, argSide){  // Read "created" and add hashcodes to it.
  var {charSide, fsDbDir, strHost}=argSide

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


class SyncDbOne{
  constructor(arg){
    Object.assign(this, arg);
  }
  async constructorB(){ // For stuff that needs await
    return [null];
  }
  async fun1Prework(){
    var {divT2DBoth, charSide, argGeneral}=this
    var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)

    var {strHostTarget, ArgSide}=argGeneral
    var [argS, argT]=ArgSide, argSide=ArgSide[iSide]
    //var {fsSourceDir, fsTargetDbDir, fsTargetDataDir, fsSourceDb, fsTargetDb, fleTargetDataDir, leafFilter}=argGeneralExtra
    //extend(argGeneral, {charSide});

    if(boTarget){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading databases
    var argTmp=copySome({}, argSide, ["fsDb", "strHost"])
    var [err, arrDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, argSide.charTRes);

    var argTmp=copySome({},argGeneral, ["strHostTarget", "flTargetDataDir", "fsTargetDbDir", "fleTargetDataDir"])
    var [err, FleF, BoExist, indCur]=await readNSyncDbB(argTmp); if(err) {debugger; return [err];}

      // getRelevantForCategorizations (db)
    if(boTarget){
      var [arrDb_TAllInside, arrDb_TAllOutside]=ArrDb.selectWPrefixArr(arrDb, FleF);
      var [arrDb_TCurInside, arrDb_TCurOutside]=ArrDb.selectWPrefix(arrDb, FleF[indCur]);
    }else{ var arrDb_SRelevantForCat=arrDb; }

      // Parsing trees
    var strMess=`Parsing ${strSide} tree`;   if(boTarget) strMess+=` (db folder)`;   setMess(strMess, null, true)
    var argTmp=copySome({}, argSide, ['charTRes', 'strHost']); copySome(argTmp, argGeneral, ['charFilterMethod', 'leafFilter']);argTmp.fsDir=argSide.fsDbDir
    var [err, arrTreef, arrTreeF] =await treeParserW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrTreef, argSide.charTRes);
    extend(this, {arrDb, arrTreef})

      // Set boNew=false
    arrTreef.forEach(r=>r.boNew=false);

      // getRelevantForCategorizations (tree)
    if(boTarget){
      var [arrTr_TAllInside, arrTr_TAllOutside]=ArrDb.selectWPrefixArr(arrTreef, FleF);
      var [arrTr_TCurInside, arrTr_TCurOutside]=ArrDb.selectWPrefix(arrTreef, FleF[indCur]);
      extend(this, {arrDb_TAllOutside, arrTr_TAllOutside, arrDb_TCurOutside, arrTr_TCurOutside})
      if(arrDb_TAllInside.length!=arrTr_TAllInside.length) {debugger; return [Error('arrDb_TAllInside.length!=arrTr_TAllInside.length')];}
      extend(this, {arrDb_TAllInside});
    }else {var arrTr_SRelevantForCat=arrTreef; }


    var [err, objHL]=await checkingForMultipleIds(arrTreef, arrTreeF, arrDb, charSide); if(err) {debugger; return [err];}
    if(objHL) {divT2DBoth.setHLVal(objHL, iSide); debugger; return [err, {objHL}];}

    var ArgTmp=boTarget?[arrTr_TAllOutside, arrDb_TAllOutside]:[arrTr_SRelevantForCat, arrDb_SRelevantForCat]
    var [err, objCategory]=await categorizeSMRelations(...ArgTmp, charSide); if(err) {debugger; return [err];}
    extend(this, {objCategory, argGeneral, ArgSide});
    divT2DBoth.setVal(objCategory, iSide);

      // boChanged
    var {arrCreate, boChanged}=objCategory, boCreated=Boolean(arrCreate.length)
    extend(this, {boCreated, boChanged})

    return [null]
  }
}

var fun1_5CreateNewDb= function(charSide, argGeneral, syncDb){
  var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)
  var {strHostTarget, ArgSide}=argGeneral
  var [argS, argT]=ArgSide, argSide=ArgSide[iSide]

  var {objCategory}=syncDb
  var boTarget=charSide=='T', iSide=Number(boTarget)
  var {arrTrUntouched, arrTrM1T1, arrTrMMult, arrCreate}=objCategory;

  var arrDbTmp=[].concat(arrTrUntouched, arrTrM1T1, arrTrMMult, arrCreate);
  if(boTarget) arrDbTmp=arrDbTmp.concat(syncDb.arrDb_TAllInside)

  extend(syncDb, {arrDbTmp})
}

var fun2AddHash= async function(charSide, argGeneral, syncDb){
  var boTarget=charSide=='T', strSide=boTarget?'target':'source', iSide=Number(boTarget)
  var {strHostTarget, ArgSide}=argGeneral
  var [argS, argT]=ArgSide, argSide=ArgSide[iSide]

  var {objCategory}=syncDb
  var boTarget=charSide=='T', iSide=Number(boTarget)
  var {arrCreate}=objCategory;
  var [err]=await addHashToCreated(arrCreate, argSide); if(err) {debugger; return [err];}
    // Write temporary db
  //var [err]=await writeTmpDb(arrDbTmp, argSide); if(err) {debugger; return [err];}
  return [null]
}


class SyncDbBoth{
  constructor(arg){
    Object.assign(this, arg);
  }
  async constructorB(){ // For stuff that needs await
    return [null];
  }
  async fun1Prework(){
    var {divT2DBoth, argGeneral}=this

    var {strHostTarget, ArgSide}=argGeneral
    var [argS, argT]=ArgSide;

    if(1){ //boRemote
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
      // Reading databases
    //var [err, arrSourceDb, arrTargetDb]=await readDbA(argGeneral); if(err) {debugger; return [err];}
    var argTmp=copySome({}, argS, ["fsDb", "strHost"])
    var [err, arrSourceDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    var argTmp=copySome({}, argT, ["fsDb", "strHost"])
    var [err, arrTargetDb]=await parseDbW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrSourceDb, argS.charTRes); funSetMTimeArr(arrTargetDb, argT.charTRes);

    var argTmp=copySome({},argGeneral, ["strHostTarget", "flTargetDataDir", "fsTargetDbDir", "fleTargetDataDir"])
    var [err, FleF, BoExist, indCur]=await readNSyncDbB(argTmp); if(err) {debugger; return [err];}

      // getRelevantForCategorizations (db)
    var arrDb_SRelevantForCat=arrSourceDb;
    var [arrDb_TAllInside, arrDb_TAllOutside]=ArrDb.selectWPrefixArr(arrTargetDb, FleF);
    var [arrDb_TCurInside, arrDb_TCurOutside]=ArrDb.selectWPrefix(arrTargetDb, FleF[indCur]);

      // Parsing trees
    setMess(`Parsing source tree`, null, true)
    //var argTmp=extend({}, argS); argTmp.fsDb=argS.fsDbDir
    var argTmp=copySome({}, argS, ['charTRes', 'strHost']); copySome(argTmp, argGeneral, ['charFilterMethod', 'leafFilter']);argTmp.fsDir=argS.fsDbDir
    var [err, arrTreef_S, arrTreeF_S] =await treeParserW(argTmp); if(err) {debugger; return [err];}
    setMess(`Parsing target tree (db-folder)`, null, true)
    var argTmp=copySome({}, argT, ['charTRes', 'strHost']); copySome(argTmp, argGeneral, ['charFilterMethod', 'leafFilter']);argTmp.fsDir=argT.fsDbDir
    var [err, arrTreef_T, arrTreeF_T] =await treeParserW(argTmp); if(err) {debugger; return [err];}
    funSetMTimeArr(arrTreef_S, argS.charTRes); funSetMTimeArr(arrTreef_T, argT.charTRes);
    //extend(this, {arrTreef_S, arrTreef_T})

      // Set boNew=false
    arrTreef_S.forEach(r=>r.boNew=false); //arrCreate_S.forEach(r=>r.boNew=true);
    arrTreef_T.forEach(r=>r.boNew=false); //arrCreate_T.forEach(r=>r.boNew=true);

      // getRelevantForCategorizations (tree)
    var arrTr_SRelevantForCat=arrTreef_S;
    var [arrTr_TAllInside, arrTr_TAllOutside]=ArrDb.selectWPrefixArr(arrTreef_T, FleF);
    var [arrTr_TCurInside, arrTr_TCurOutside]=ArrDb.selectWPrefix(arrTreef_T, FleF[indCur]);

    if(arrDb_TAllInside.length!=arrTr_TAllInside.length) {debugger; return [Error('arrDb_TAllInside.length!=arrTr_TAllInside.length')];}

    var [err, objHL]=await checkingForMultipleIds(arrTreef_S, arrTreeF_S, arrSourceDb, 'S'); if(err) {debugger; return [err];}
    if(objHL) {divT2DBoth.setHLVal(objHL, 0); debugger; return [err, {objHL}];}
    var [err, objHL]=await checkingForMultipleIds(arrTreef_T, arrTreeF_T, arrTargetDb, 'T'); if(err) {debugger; return [err];}
    if(objHL) {divT2DBoth.setHLVal(objHL, 1); debugger; return [err, {objHL}];}

    //var [err, ]=await checkingForMultipleSMInDb(argGeneral, argS); if(err) {debugger; return [err];}

    var [err, objCategory]=await categorizeSMRelations(arrTr_SRelevantForCat, arrDb_SRelevantForCat, 'S'); if(err) {debugger; return [err];}
    var {boChanged, arrCreate}=objCategory, boCreated=Boolean(arrCreate.length)
    var syncDb_S={objCategory, arrDb:arrSourceDb, arrTreef:arrTreef_S, boChanged, boCreated};
    var [err, objCategory]=await categorizeSMRelations(arrTr_TAllOutside, arrDb_TAllOutside, 'T'); if(err) {debugger; return [err];}
    var {boChanged, arrCreate}=objCategory, boCreated=Boolean(arrCreate.length)
    var syncDb_T={objCategory, arrDb:arrTargetDb, arrTreef:arrTreef_T, boChanged, boCreated, arrDb_TAllOutside, arrTr_TAllOutside, arrDb_TCurOutside, arrTr_TCurOutside, arrDb_TAllInside};

    extend(this, {argGeneral, ArgSide, arrDb_TAllInside});
    divT2DBoth.setVal(syncDb_S.objCategory, 0);
    divT2DBoth.setVal(syncDb_T.objCategory, 1);

    var arrSyncDb=[syncDb_S, syncDb_T];
    //var boCreated=syncDb_S.boCreated || syncDb_T.boCreated;
    extend(this, {arrSyncDb})
    return [null]
  }
}


var createBundWExtraHashDim=function(BundA){
  var Bund3D={}
  var BundSMMultHashNonConsistent={}, BundSMMultHashConsistent={}, nTotNonConsistent=0, nTotConsistent=0
  for(var keySM in BundA){
    var bundA=BundA[keySM], objT={}
    for(var i=0;i<bundA.length;i++){
      var r=bundA[i], {strHash}=r;
      if(!(strHash in objT)) objT[strHash]=[];
      objT[strHash].push(r);
    }
    //var ArrTmp=Object.values(objT); Bund3D[keySM]=ArrTmp;
    var Key=Object.keys(objT); 
    Bund3D[keySM]=objT;
    if(Key.length>1) { BundSMMultHashNonConsistent[keySM]=bundA; nTotNonConsistent+=bundA.length;}
    else {BundSMMultHashConsistent[keySM]=bundA; nTotConsistent+=bundA.length;}
  }
  return [Bund3D, BundSMMultHashNonConsistent, BundSMMultHashConsistent, nTotNonConsistent, nTotConsistent]
}
// var [Bund3D, BundSMMultHashNonConsistent, BundSMMultHashConsistent, nTotNonConsistent, nTotConsistent]=createBundWExtraHashDim(BundSMMult);


class SMMultWorkBoth{
  constructor(arg){
    copySome(this, arg, ["divT2DBoth", "arrSyncDb", "argGeneral"])
  }

}

var fun3CalcMult=async function(arg){
  var {divT2DBoth, argGeneral, arrSyncDb}=arg

  var {ArgSide}=argGeneral, [argS, argT]=ArgSide, {charTResCollision}=argGeneral

  var [syncDb_S, syncDb_T]=arrSyncDb
  var {objCategory:objCategoryS, arrDbTmp:arrDbTmp_S, arrDb:arrSourceDb, arrTreef:arrTreef_S}=syncDb_S;
  var {objCategory:objCategoryT, arrDbTmp:arrDbTmp_T, arrDb:arrTargetDb, arrTreef:arrTreef_T, arrDb_TAllOutside, arrTr_TAllOutside, arrDb_TCurOutside, arrTr_TCurOutside}=syncDb_T;
  var {arrCreate:arrCreate_S}=objCategoryS,  {arrCreate:arrCreate_T}=objCategoryT;


  funSetMTimeArr(arrSourceDb, charTResCollision)
  funSetMTimeArr(arrTargetDb, charTResCollision)
  funSetMTimeArr(arrTreef_S, charTResCollision)
  funSetMTimeArr(arrTreef_T, charTResCollision)

  funSetMTimeArr(arrCreate_S, charTResCollision)
  funSetMTimeArr(arrCreate_T, charTResCollision)

  funSetMTimeArr(arrDbTmp_S, charTResCollision)
  funSetMTimeArr(arrDbTmp_T, charTResCollision)


    // SM collision check for new SM
    // Get Relevant For SM Collision Check
  arrTreef_S.forEach(r=>r.boNew=false); arrTreef_T.forEach(r=>r.boNew=false);
  arrSourceDb.forEach(r=>r.boNew=false); arrTargetDb.forEach(r=>r.boNew=false);

  arrCreate_S.forEach(r=>r.boNew=true); //arrCreate_T.forEach(r=>r.boNew=false);
  var arrRelevant=[].concat(arrDbTmp_S);
  //var arrBase=[].concat(arrDbTmp_S, arrTr_TCurOutside);
  var arrBase=[].concat(arrDbTmp_S, arrCreate_T, arrDb_TCurOutside);    //arrDb_TCurOutside.forEach(r=>r.boNew=false);
  var argTmp={arrRelevant, arrBase};
  copySome(argTmp, argS, ['charSide', 'charTRes']); extend(argTmp, {charTResCollision}) 
  var smMultWork=new SMMultWork(argTmp);
  var [err, result]=await smMultWork.getMult(); if(err) {debugger; return [err];}
  var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent}=result;
  divT2DBoth.MiniViewSMMatch[0].setUI_SMMultiples(result)

  var [err, result]=await smMultWork.findNewMTime(); if(err) {debugger; return [err];}
  var {nToChange, StrToChangeShort, nRevert, StrRevertShort, arrToChange:arrToChangeS}=result
  divT2DBoth.MiniViewSMMatch[0].setUI_NewMTime(result)
  //smMultWork.addTDiff()
  smMultWork.copyTDiff(arrDbTmp_S, arrToChangeS)


  arrTreef_S.forEach(r=>r.boNew=false); arrTreef_T.forEach(r=>r.boNew=false);
  arrSourceDb.forEach(r=>r.boNew=false); arrTargetDb.forEach(r=>r.boNew=false);

  var arrRelevant=[].concat(arrDb_TAllOutside);   // arrDb_TAllOutside.forEach(r=>r.boNew=false);
  //arrCreate_S.forEach(r=>r.boNew=false);
  arrCreate_T.forEach(r=>r.boNew=true);
  var arrBase=[].concat(arrDbTmp_T, arrCreate_S);
  var argTmp={arrRelevant, arrBase};
  copySome(argTmp, argT, ['charSide', 'charTRes']); extend(argTmp, {charTResCollision})
  var smMultWork=new SMMultWork(argTmp);
  var [err, result]=await smMultWork.getMult(); if(err) {debugger; return [err];}
  var {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent}=result;
  divT2DBoth.MiniViewSMMatch[1].setUI_SMMultiples(result)

  var [err, result]=await smMultWork.findNewMTime(); if(err) {debugger; return [err];}
  var {nToChange, StrToChangeShort, nRevert, StrRevertShort, arrToChange:arrToChangeT}=result
  divT2DBoth.MiniViewSMMatch[1].setUI_NewMTime(result)
  //smMultWork.addTDiff()
  smMultWork.copyTDiff(arrDbTmp_T, arrToChangeT)

  return [null, {arrToChangeS, arrToChangeT}]
}

var fun4WriteDbBoth=async function(arg){
  var {arrToChangeS, arrToChangeT, arrSyncDb, argGeneral}=arg
  var {ArgSide}=argGeneral, [argS, argT]=ArgSide;

  var [syncDb_S, syncDb_T]=arrSyncDb
  var {arrDbTmp:arrDbTmp_S}=syncDb_S;
  var {arrDbTmp:arrDbTmp_T}=syncDb_T;

  var argTmp=copySome({}, argS, ["fsDbDir", "fsDb", "strHost"]);
  var [err]=await SMMultWork.mySetMTime(arrToChangeS, arrDbTmp_S, argTmp); if(err) {debugger; return [err];}

  var argTmp=copySome({}, argT, ["fsDbDir", "fsDb", "strHost"]);
  var [err]=await SMMultWork.mySetMTime(arrToChangeT, arrDbTmp_T, argTmp); if(err) {debugger; return [err];}

  return [null]
}

//arrCreated, arrChanged, arrDb
class SMMultWork{
  constructor(arg){
    var {arrRelevant, arrBase}=arg
    copySome(this, arg, ['arrRelevant', 'arrBase', 'charSide', 'charTRes', 'charTResCollision'])
    arrBase.forEach(r=>r.boRelevant=false); arrRelevant.forEach(r=>r.boRelevant=true);   
    //var arrBase=arrRelevant.concat(arrReadOnly);  extend(this, {arrBase});
  }
  async getMult(){
    var {charSide, arrBase}=this;
    
    arrBase.sort(funDecSM);
    var BundSM=bundleOnProperty(arrBase, 'sm'),  nPatSM=Object.keys(BundSM).length
    var [BundSMMult, nSMMult, arrSingle]=extractBundlesWMultiples(BundSM),  nPatSMMult=Object.keys(BundSMMult).length;
    var BundSMMultHashNonConsistent={}, BundSMMultHashConsistent={}, nTotNonConsistent=0, nTotConsistent=0
    for(var keySM in BundSMMult){
      var bundSMMult=BundSMMult[keySM], hash0=bundSMMult[0].strHash, boNonConsistentHash=false
      for(var i=1;i<bundSMMult.length;i++){
        var {strHash}=bundSMMult[i];
        if(hash0!=strHash) { boNonConsistentHash=true; break; }
      }
      if(boNonConsistentHash) { BundSMMultHashNonConsistent[keySM]=bundSMMult; nTotNonConsistent+=bundSMMult.length;}
      else {BundSMMultHashConsistent[keySM]=bundSMMult; nTotConsistent+=bundSMMult.length;}
    }
    var nPatConsistent=Object.keys(BundSMMultHashConsistent).length
    var nPatNonConsistent=Object.keys(BundSMMultHashNonConsistent).length

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored} ${s.strHash}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.strName}`;
    var StrLongList=formatListBundled(BundSMMultHashConsistent, funMatch, funUnique)
    var StrConsistentShort=formatTitle(StrLongList)
    var strHead=`int int64 string\nsize mtime_ns64Floored strHash\nbool string\nboRelevant strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.smMultHashConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].smMultHashConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.strHash} ${s.strName}`;
    var StrLongList=formatListBundled(BundSMMultHashNonConsistent, funMatch, funUnique)
    var StrNonConsistentShort=formatTitle(StrLongList)
    var strHead=`int int64\nsize mtime_ns64Floored\nbool string string\nboRelevant strHash strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.smMultHashNonConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].smMultHashNonConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    extend(this, {BundSMMultHashNonConsistent})

    return [null, {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent}]
  }
  async readNonConsistantFrFile(){
    
  }
  async findNewMTime(){
    var {BundSMMultHashNonConsistent, arrBase, charTResCollision, charSide}=this

    var [Bund3D]=createBundWExtraHashDim(BundSMMultHashNonConsistent);

    var fsTmp=gThis[`PathSingle${charSide}`].smMultHashNonConsistent.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true, undefined, arr=>arr[1]); if(err) return [err]
      // Note!
      // Number of dimensions:
      //   Arr: 2D
      //   obj: 3D
      //   BundSMMultHashNonConsistent: 2D.
      //   Bund3D: 3D
      // keySM (top key) in obj, BundSMMultHashNonConsistent and Bund3D has the "size"-part 0-padded differently:
      //   obj: no padding
      //   BundSMMultHashNonConsistent: 0-padded.
      //   Bund3D: 0-padded
      // Ex:
      //   Arr={9f6e6800cfae7749eb6c486619254b9c:[]}
      //   obj={3_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}
      //   BundSMMultHashNonConsistent={000000000003_1716905274000000000:[]}
      //   Bund3D={000000000003_1716905274000000000:{9f6e6800cfae7749eb6c486619254b9c:[]}}

      // Create BoSizeMTime
    var BoSizeMTime={}
    arrBase.sort(funDecSM);
    var BundSize=bundleOnProperty(arrBase, 'size')
    for(var s in BundSize){
      var bundSize=BundSize[s];   BoSizeMTime[s]={}
      for(var i=0;i<bundSize.length;i++){ var row=bundSize[i], {mtime_ns64Floored}=row;  BoSizeMTime[s][mtime_ns64Floored]=true; }
    }
  
    var tDiffMax_ns=1e11

      // Create BoAnyExtra
    var obj=Bund3D, BoAnyExtra={}
    for(var keySM in obj){ 
      var BundHash=Object.values(obj[keySM]), boAnyExtra=false;
      BundHash.forEach(bundHash=>{
          // Add nRelevant and nExtra as properties to each array
        var nRelevant=0, nExtra=0, nNew=0; bundHash.forEach(r=>{ 
          if(r.boRelevant) nRelevant++; else nExtra++;
          if(r.boNew) nNew++
         });
        extend(bundHash, {nRelevant, nExtra, nNew});
          // Sort so the extras comes last
        bundHash.sort((A,B)=>{return Number(A.boExtra)-Number(B.boExtra)})
        boAnyExtra||=nExtra>0
      }); 
      BoAnyExtra[keySM]=boAnyExtra;
    }

    var StrToChange=[], nToChange=0, StrRevert=[], arrToChange=[]; //, Bund3ToChange={}
    for(var keySM in obj){
      var BundHash=Object.values(obj[keySM]), boAnyExtra=BoAnyExtra[keySM];
      if(!boAnyExtra){
          // If there are no extras (nExtra==0) one can skip one bundHash (the first).
          // Sort so that the bundHash you want to skip comes first
        BundHash.sort((A,B)=>{var a=A.nRelevant, b=B.nRelevant; return (a<b) ? 1 : ((a>b)?-1:0)}); // Sort that so the most nRelevant is first
        BundHash.sort((A,B)=>{var a=A.nNew, b=B.nNew; return (a<b) ? -1 : ((a>b)?1:0)}); // Sort so that the least nNew is first
          // In other words low nNew comes first, if multiple entries has the same nNew, then the entries with highest nRelevant comes first.
          // BundHash=[{nNew:0, nRelevant:5}, {nNew:0, nRelevant:1}, {nNew:1, nRelevant:2}]
      }
      var tDiff_ns=BigInt(0)
      var bundHash0=BundHash[0], {nRelevant, nExtra}=bundHash0, r00=bundHash0[0], {size, mtime_ns64Floored, strName}=r00;
      StrToChange.push(`MatchingData ${size} ${mtime_ns64Floored}`);  StrRevert.push(`MatchingData ${size} ${mtime_ns64Floored}`)
      var keyBund=`${size}_${mtime_ns64Floored}`; 
      var iStart=boAnyExtra?0:1; // If no extras, then one can leave one (the first) bundHash unchanged
      for(var i=iStart;i<BundHash.length;i++){ 
        var bundHash=BundHash[i], {nRelevant, nExtra}=bundHash, row0=bundHash[0], {size, mtime_ns64Floored, strName}=row0;
        if(nRelevant==0) continue
          // Find mtime_ns64FlooredNew
        while(1){
          tDiff_ns+=IntTDiv[charTResCollision];    if(tDiff_ns>tDiffMax_ns) {debugger; return [Error(`New time could not be calculated: tDiff_ns: ${tDiff_ns} ${strName}`)]; }
          var mtime_ns64FlooredNew=mtime_ns64Floored+tDiff_ns
          if(mtime_ns64FlooredNew in BoSizeMTime[size]) {continue;} else { BoSizeMTime[size][mtime_ns64FlooredNew]=true;  break;}
        }
          // For all the boRelevant entries: Assign mtime_ns64FlooredNew
        for(var j=nExtra;j<bundHash.length;j++){
          var row=bundHash[j], {boRelevant, strHash, strName}=row;
          funSetMTime(row, charTResCollision, mtime_ns64FlooredNew)
          StrToChange.push(`  ${tDiff_ns} ${strHash} ${strName}`);  nToChange++,  StrRevert.push(`  0 ${strHash} ${strName}`)
          // if(!(keyBund in Bund3ToChange)) Bund3ToChange[keyBund]={};
          // if(!(strHash in Bund3ToChange[keyBund])) Bund3ToChange[keyBund][strHash]=[];
          // Bund3ToChange[keyBund][strHash].push(row)
          arrToChange.push(row)
        } 
      }
    }
    var nRevert=nToChange

    var strHead=`int int64\nsize mtime_ns64Floored\nint64 string string\ntDiff_ns strHash strName`;
  
    var StrToChangeShort=formatTitle(StrToChange)
    if(StrToChange.length) StrToChange.unshift(strHead);
    var [err]=await writeFile(gThis[`PathSingle${charSide}`].smToChange.fsName, StrToChange.join('\n')); if(err) {debugger; return [err];}
  
    var StrRevertShort=formatTitle(StrRevert)
    if(StrRevert.length) StrRevert.unshift(strHead);
    var [err]=await writeFile(gThis[`PathSingle${charSide}`].smRevert.fsName, StrRevert.join('\n')); if(err) {debugger; return [err];}
  
    return [null, {nToChange, StrToChangeShort, nRevert, StrRevertShort, arrToChange}]
  }

  // addTDiff(){
  //   var {arrCreated:arrRow, charTResCollision}=this;
  //   for(var i=0;i<arrRow.length;i++){
  //     var row=arrRow[i], {tDiff_ns, mtime_ns64Floored:mtime_ns64}=row; //, {mtime_ns64}=rowDb;
  //     row.mtime_ns64=mtime_ns64+tDiff_ns
  //     funSetMTime(row, charTResCollision)
  //   }
  // }
  copyTDiff(arrDb, arrToChange){ // Copy modtime from arrToChange to arrDb (matched by strName)
    var { charTResCollision}=this;

    //var arrToChange=[];  for(var k in BundSMMultHashNonConsistent){ var arr=BundSMMultHashNonConsistent[k]; arrToChange=arrToChange.concat(arr); }

    arrDb.sort(funIncStrName);   arrToChange.sort(funIncStrName)
    var [err, arrDbMatch, arrToChangeMatch, arrDbRem, arrToChangeRem]=extractMatching(arrDb, arrToChange, ['strName']); if(err) {debugger; return [err];}
    if(arrToChangeRem.length) {debugger; return [Error("arrToChangeRem.length>0")];}

    for(var i=0;i<arrDbMatch.length;i++){
      var rowDb=arrDbMatch[i], rowToChange=arrToChangeMatch[i], {mtime_ns64Floored:mtime_ns64}=rowToChange;
      //extend(rowDb, rowToChange)
      funSetMTime(rowDb, charTResCollision, mtime_ns64)
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
*/


class HashMultWork{
  constructor(){ }
  async getMult(arg){
    var {fsSourceDir, strHostTarget, fsTargetDbDir, flTargetDataDir, charTRes, charSide, FleF}=arg;
    var boTarget=charSide=='T'

    //var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    //var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    var fsSourceDb=fsSourceDir+charF+settings.leafDb,  fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    var [strHost, fsDbDir, fsDb]=boTarget?[strHostTarget, fsTargetDbDir, fsTargetDb]:[null, fsSourceDir, fsSourceDb]
    extend(this, {fsDbDir, fsDb, strHost})

    var [err, strData]=await readStrFile(fsSourceDb);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrSourceDb]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrSourceDb, charTRes);

    var [err, strData]=await readStrFile(fsTargetDb);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrTargetDb]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrTargetDb, charTRes);

    var [arrRelevant, arrReadOnly]=separateByRelevance(arrTargetDb, FleF);
    var arrBase=arrRelevant.concat(arrReadOnly)

    var StrLongList=arrReadOnly.map(r=>`${r.size.myPadStart(10)} ${r.mtime_ns64Floored} ${r.strName}`)
    var StrReadOnlyShort=formatTitle(StrLongList)
    var nReadOnly=arrReadOnly.length

    arrBase.sort(funDecSM);
    var BundHash=bundleOnProperty(arrBase, 'strHash'),  nPatHash=Object.keys(BundHash).length
    var [BundHashMult, nHashMult, arrSingle]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(BundHashMult).length;
    var BundHashMultSMNonConsistent={}, BundHashMultSMConsistent={}, nTotNonConsistent=0, nTotConsistent=0
    for(var h in BundHashMult){
      var bundHashMult=BundHashMult[h], sm0=bundHashMult[0].sm, boNonConsistentSM=false
      for(var i=1;i<bundHashMult.length;i++){
        var {sm}=bundHashMult[i];
        if(sm0!=sm) {boNonConsistentSM=true; break;}
      }
      if(boNonConsistentSM) { BundHashMultSMNonConsistent[h]=bundHashMult; nTotNonConsistent+=bundHashMult.length;}
      else {BundHashMultSMConsistent[h]=bundHashMult; nTotConsistent+=bundHashMult.length; }
    }
    var nPatConsistent=Object.keys(BundHashMultSMConsistent).length
    var nPatNonConsistent=Object.keys(BundHashMultSMNonConsistent).length

    
    var funMatch=s=>`MatchingData ${s.strHash} ${s.size.myPadStart(10)} ${s.mtime_ns64}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.strName}`;
    var StrLongList=formatListBundled(BundHashMultSMConsistent, funMatch, funUnique)
    var StrConsistentShort=formatTitle(StrLongList)
    var strHead=`string int int64\nstrHash size mtime_ns64\nbool string\nboRelevant strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.hashMultSMConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hashMultSMConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=formatListBundled(BundHashMultSMNonConsistent, funMatch, funUnique)
    var StrNonConsistentShort=formatTitle(StrLongList)
    var strHead=`string\nstrHash\nbool int int64 string\nboRelevant size mtime_ns64 strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.hashMultSMNonConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hashMultSMNonConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    

      // Creating obj
    var obj={}
    for(var h in BundHashMultSMNonConsistent){
      var bundT=BundHashMultSMNonConsistent[h]; obj[h]={};
      for(var i=0;i<bundT.length;i++){
        var r=bundT[i], {sm}=r;    if(!(sm in obj[h])) obj[h][sm]=[];    obj[h][sm].push(r)
      }
    }

    var NBundWExtra={}  //BoAnyExtra={},
    for(var kHash in obj){ 
      var BundSM=Object.values(obj[kHash]), boAnyExtra=false, nBundWExtra=0;
      BundSM.forEach(bundSM=>{
          // Add nRelevant and nExtra as properties to each array
        var nRelevant=0, nExtra=0; bundSM.forEach(r=>{ if(r.boRelevant) nRelevant++; else nExtra++ });
        extend(bundSM, {nRelevant, nExtra});
          // Sort so the extras comes last
        bundSM.sort((A,B)=>{return Number(A.boExtra)-Number(B.boExtra)}) //◢
        //for(var i=bundSM.length;i;i--){ if()}
        //boAnyExtra=boAnyExtra||nExtra>0
        //boAnyExtra||=nExtra>0
        if(nExtra) nBundWExtra++
      }); 
      //BoAnyExtra[kHash]=boAnyExtra;
      NBundWExtra[kHash]=nBundWExtra;
    }

    var StrToChange=[], StrRevert=[]
    for(var h in obj){
      var BundSM=Object.values(obj[h]), nBundWExtra=NBundWExtra[h]; //, boAnyExtra=BoAnyExtra[h]
      BundSM.sort((A,B)=>{var a=A.nRelevant, b=B.nRelevant; return (a<b) ? 1 : ((a>b)?-1:0)}); // ◣ Sort that so the most nRelevant is first
      BundSM.sort((A,B)=>{var a=A.nExtra, b=B.nExtra; return (a<b) ? -1 : ((a>b)?1:0)}); // ◢ Sort so that the least nExtra is first
        // Example [{nExtra:0, nRelevant:5}, {nExtra:0, nRelevant:1}, {nExtra:1, nRelevant:5}, {nExtra:1, nRelevant:1}, {nExtra:0, nRelevant:1}]
      //var bund0=BundSM[0], r00=bund0[0], {size}=r00;
      //if(nBundWExtra==0) 
      //var iStart=nBundWExtra?0:1; // If no extras, then one can leave one (the first) bundSM unchanged
      var iRef, iStart, iEnd
      if(nBundWExtra==0) {iRef=0; iStart=1; iEnd=BundSM.length} else{ iRef=BundSM.length-nBundWExtra; iStart=0; iEnd=iRef;}
      var bundRef=BundSM[iRef], rRef0=bundRef[0], {size, mtime_ns64}=rRef0;
      for(var i=iStart;i<iEnd;i++){ 
        var bundSM=BundSM[i], {nRelevant, nExtra}=bundSM;
        if(nRelevant==0) continue
        //var iRef=(nExtra)?nRelevant:0, rRef=bundSM[iRef], {size, mtime_ns64}=rRef;
          // For all the boRelevant entries: Assign mtime_ns64FlooredNew
        for(var j=nExtra;j<bundSM.length;j++){
          var row=bundSM[j], {mtime_ns64:mtime_ns64Old, strName}=row, tDiff=mtime_ns64-mtime_ns64Old;
          funSetMTime(row, charTRes, mtime_ns64)
          StrToChange.push(`${mtime_ns64} ${tDiff} ${strName}`);    StrRevert.push(`${mtime_ns64Old} ${strName}`)
        } 
      }
    }


    //var strHead=`int64 string\nmtime_ns64 strName`;
    var strHead=`int64 int64 string\nmtime_ns64 tDiff strName`;

    var nToChange=StrToChange.length, StrToChangeShort=formatTitle(StrToChange)
    if(StrToChange.length) StrToChange.unshift(strHead);
    var myWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hsmToChange); myWriter.Str=StrToChange
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

    var nRevert=StrRevert.length, StrRevertShort=formatTitle(StrRevert)
    if(StrRevert.length) StrRevert.unshift(strHead);
    var myWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hsmRevert); myWriter.Str=StrRevert
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

    extend(this, {arrRelevant, charTRes, arrBase, charSide})
    return [null, {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent, nToChange, nRevert, StrToChangeShort, StrRevertShort, nReadOnly, StrReadOnlyShort}]
  }

  async mySetMTime(pathInput){
    var {fsDbDir, fsDb, strHost, charTRes}=this;

      // Parsing fsDb (database)
    var [err, strData]=await readStrFileWHost(fsDb, strHost);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, charTRes);

    var [err, strData]=await readStrFile(pathInput.fsName);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrToChange]=parseSSVWType(strData); if(err) {debugger; return [err];}

    arrDb.sort(funIncStrName);   arrToChange.sort(funIncStrName)
    var [err, arrDbMatch, arrToChangeMatch, arrDbRem, arrToChangeRem]=extractMatching(arrDb, arrToChange, ['strName']); if(err) {debugger; return [err];}
    if(arrToChangeRem.length) {debugger; return [Error("arrToChangeRem.length>0")];}

    for(var i=0;i<arrDbMatch.length;i++){
      var rowDb=arrDbMatch[i], rowNew=arrToChangeMatch[i], {mtime_ns64}=rowNew;
      funSetMTime(rowDb, charTRes, mtime_ns64)
    }

    var [err]=await setMTime(arrToChange, fsDbDir, strHost);  if(err) {debugger; return [err];}
    var [err]=await writeDbWrapper(arrDb, fsDb, strHost); if(err) { return [err];}
    return [null]
  }
}



class HashMultWorkDelete{
  constructor(){ }
  async getMult(arg){
    var {fiSourceDir, strHostTarget, fiTargetDbDir, flTargetDataDir, charTRes, charSide}=arg
    var boTarget=charSide=='T'

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err]; }
    var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
    var fsSourceDb=fsSourceDir+charF+settings.leafDb, fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    var [strHost, fsDbDir, fsDb]=boTarget?[strHostTarget, fsTargetDbDir, fsTargetDb]:[null, fsSourceDir, fsSourceDb]
    extend(this, {fsDbDir, fsDb, strHost})

      // Parsing fsDb (database)
    //var [err, strData]=await readStrFile(fsDb);
    var [err, strData]=await readStrFileWHost(fsDb, strHost);
    
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDb, charTRes);


    arrDb.sort(funDecSM);
    var BundHash=bundleOnProperty(arrDb, 'strHash'),  nPatHash=Object.keys(BundHash).length
    var [BundHashMult, nHashMult, arrSingle]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(BundHashMult).length;


    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=formatListBundled(BundHashMult, funMatch, funUnique)
    var StrKeepShort=formatTitle(StrLongList)
    var strHead=`string\nstrHash\nint int64 string\nsize mtime_ns64 strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    var myWriter=new MyWriterSingle(PathLoose.hashCollisionKeep);
    myWriter.Str=StrLongList
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

  
    extend(this, {fsDb, arrDb, BundHashMult, fsDbDir, charTRes})
    return [null, {StrKeepShort, nPat:nPatHashMult, nTot:nHashMult}]
  }

  async delete(){
    var {fsDbDir, fsDb, strHost, charTRes, arrDb, BundHashMult}=this;


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
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, charFilterMethod}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
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
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, charFilterMethod}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
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
  var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; return [err];}
  var {fiSourceDir}=result
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
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
  removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
  removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)
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
  removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
  removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)
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
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, fiTargetDbDir, flTargetDataDir, charFilterMethod}=arg

  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err]; }
  var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
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
