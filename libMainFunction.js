
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
  // var [nIdf, nMultIdf, nMultf, objTreefDup]=bucketifyByKeyMultSum(arrTreef, 'id')
  // var [nIdF, nMultIdF, nMultF, objTreeFDup]=bucketifyByKeyMultSum(arrTreeF, 'id')

  var objTreef=bucketifyByKey(arrTreef, 'id'),  nIdf=Object.keys(objTreef).length
  var [nMultf, objMult]=extractBucketsWMultiples(objTreef),  nMultIdf=Object.keys(objMult).length;
  var objTreeF=bucketifyByKey(arrTreeF, 'id'),  nIdF=Object.keys(objTreeF).length
  var [nMultF, objMult]=extractBucketsWMultiples(objTreeF),  nMultIdF=Object.keys(objMult).length;

  var objArg={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length}

  var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
  var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
  var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
  //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
  myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  //var strSeeMore=myResultWriter.getSeeMoreMessage()
  //myConsole.log(StrSum.concat(strSeeMore).join('\n'))
  return [null]
}

var hashMultipleCheck=async function(arg){
  var {charTRes=settings.charTRes, fiSourceDir, charSide='S'}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var fsDb=fsSourceDir+charF+settings.leafDb

    // Parsing fsDb (database)
  var [err, strData]=await readStrFile(fsDb);
  if(err){
    if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
    else{ debugger; return [err]}
  }
  var arrDb=parseDb(strData, charTRes)
  // var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
  // var arrDbOrg=arrDb, arrDb=arrDbRelevant

  //var myResultWriter=new MyResultWriter(StrStemT2D)
  var PathCur=gThis[`Path${charSide}`]
  var myResultWriter=new MyWriter(PathCur)

  arrDb.sort(funDecSM);
  var objHash=bucketifyByKey(arrDb, 'strHash'),  nPatHash=Object.keys(objHash).length
  var [nHashMult, objHashDup]=extractBucketsWMultiples(objHash),  nPatHashMult=Object.keys(objHashDup).length;
  for(var k in objHashDup){
    var arr=objHashDup[k];
    var s=arr[0].size
    for(var i=1;i<arr.length;i++){
      var ds=s-arr[i].size
      if(ds!=0) {debugger; arr[i].boSizeDiffers=true; myConsole.error(`Size differs (diff:${ds}): ${arr[i].strName}`)}
    }
  }
  var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
  var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
  var objHashOut={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
  myResultWriter.Str.hash=StrTmp

  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

  return [null, objHashOut]
}



/****************************************************************************************
 * S_ / T_ (T2D)
 ****************************************************************************************/

class SyncDb{
  constructor(arg){
    var {charTRes=settings.charTRes, fsDbDir, fsDir}=arg
    copySome(this, arg, ["fsDir", "fsDbDir", "leafFilter", "charFilterMethod", "strHost", "boRemote", "charSide"]); 
    var fsDb=fsDbDir+charF+settings.leafDb
    var flPrepend=calcFlPrepend(fsDbDir, fsDir);
    extend(this, {charTRes, fsDb, flPrepend})
  }

  //async loadRemoteDbToLocalCopy(){ }
  async compare(){
    var {fsDir, fsDbDir, fsDb, charTRes, leafFilter, charFilterMethod, strHost, boRemote, charSide, flPrepend}=this

    if(1){ //boRemote
      var [err]=await interfacePython.uploadZip(strHost); if(err) { debugger; return [err];}
    }

      // Parse tree
    var treeParser=new TreeParser()
    setMess(`Parsing tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir, charFilterMethod, strHost}
    var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    removeLeafDbFromArrTreef(arrTreef, settings.leafDb)



    // var boDbRemoteExist=true;

    //   // Assign fsDbLoc
    // if(boRemote){
    //     // Fetch remote db-file
    //   var fsDbTmp=FsResultFile['remoteFileLocally'];
    //   var arrCommand=['scp', strHost+':'+fsDb, fsDbTmp]
    //   var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    //   if(stdErr) { 
    //     if(stdErr.indexOf('No such file or directory') ){boDbRemoteExist=false}
    //     else {debugger; return [stdErr];}
    //   }
    //   else if(exitCode) { debugger; return [Error(stdErr)]; };
    //   var fsDbLoc=fsDbTmp;
    // }else {var fsDbLoc=fsDb;}

    //   // Assign strData
    // var strData=""
    // if(boDbRemoteExist || !boRemote){
    //     // Read file
    //   var [err, strData]=await readStrFile(fsDbLoc); if(err) return [err]
    //   if(err){
    //     if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
    //     else{ debugger; return [err]}
    //   }
    // }else {strData=""}


    
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err]
    setMess(`Parsing db`, null, true)
    var arrDb=parseDb(strData, charTRes)
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    //var myResultWriter=new MyResultWriter(StrStemT2D)
    var PathCur=gThis[`Path${charSide}`]
    var myResultWriter=new MyWriter(PathCur)


        // Id match (Checking for hard links)

      // Count duplicate ids in tree
    // var [nIdf, nMultIdf, nMultf, objTreefDup]=bucketifyByKeyMultSum(arrTreef, 'id')
    // var [nIdF, nMultIdF, nMultF, objTreeFDup]=bucketifyByKeyMultSum(arrTreeF, 'id')

    var objTreef=bucketifyByKey(arrTreef, 'id'),  nIdf=Object.keys(objTreef).length
    var [nMultf, objTreefDup]=extractBucketsWMultiples(objTreef),  nMultIdf=Object.keys(objTreefDup).length;
    var objTreeF=bucketifyByKey(arrTreeF, 'id'),  nIdF=Object.keys(objTreeF).length
    var [nMultF, objTreeFDup]=extractBucketsWMultiples(objTreeF),  nMultIdF=Object.keys(objTreeFDup).length;

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    //var [nIdDb, nMultIdDb, nMultDb, objDbDup]=bucketifyByKeyMultSum(arrDb, 'id')

    var objDb=bucketifyByKey(arrDb, 'id'),  nIdDb=Object.keys(objDb).length
    var [nMultDb, objDbDup]=extractBucketsWMultiples(objDb),  nMultIdDb=Object.keys(objDbDup).length;

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
      var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
      
      var StrTmpShortList=([].concat(StrTmpF, StrTmpf)).slice(0,nShortListMax);
      if(StrTmpF.length+StrTmpf.length>nShortListMax) StrTmpShortList.push('⋮'); 
      this.objHL.strTmpShortList=StrTmpShortList.join('\n')
      return [null];
    }

      // Hash match
    // var objHash=bucketifyByKey(arrDb, 'strHash'),  nPatHash=Object.keys(objHash).length
    // var [nHashMult, objHashDup]=extractBucketsWMultiples(objHash),  nPatHashMult=Object.keys(objHashDup).length;
    // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    // var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
    // this.objHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
    // myResultWriter.Str.hash=StrTmp


        // Mult 1 (Multiple SM in all files)
 
    arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
    var funSM=row=>row.sm
    var [objTreeM, objDbM]=categorizeByPropOld(arrTreef, arrDb, funSM)
    var Mat1=this.Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(objTreeM, objDbM);
    Mat1.setMTMLabel()

    Mat1.ShortList=[]
    var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    //var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat1.ArrA[i][j]);
      var ArrBMult=[].concat(Mat1.ArrB[i][j]);
      //setBestNameMatchFirst(ArrAMult, ArrBMult)

        // Sort by size
      var funVal=(a,b)=>b[0].size-a[0].size; // Dec
      //var funVal=(a,b)=>a[0].size-b[0].size; // Inc
      if(i && j){
        ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
        var ArrAtmp=ArrAMult.toSorted(funVal)
        var Ind=ArrAtmp.map(entry=>entry.ind),  ArrBtmp=eInd(ArrBMult, Ind)
      }else if(i){
        var ArrAtmp=ArrAMult.toSorted(funVal), ArrBtmp=ArrBMult
      }else{
        var ArrBtmp=ArrBMult.toSorted(funVal), ArrAtmp=ArrAMult
      }
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      //myResultWriter.Str["T2D_STMatch1_"+i+j]=StrDuplicateM
      myResultWriter.Str[`STMatch1_${i}${j}`]=StrDuplicateM
      
      var StrT=StrDuplicateM.slice(0,nShortListMax);
      if(StrDuplicateM.length>nShortListMax) StrT.push('⋮')
      var strTmp=StrT.length?StrT.join('\n'):undefined;
      Mat1.ShortList[`${i}${j}`]=strTmp
    }


        // Categorize files

    var arrSource=arrTreef, arrTarget=arrDb
      // Extract untouched, inm
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrSourceUntouched, arrTargetUntouched, arrSourceRem, arrTargetRem]=extractMatching(arrSource, arrTarget, ['strName', 'id', 'sm']); if(err) {debugger; return [err];}
    //extend(this, {arrSourceUntouched})
    var boChanged=this.boChanged=Boolean(arrSourceRem.length)||Boolean(arrTargetRem.length)
    //var boNothingToDo=arrSourceRem.length==0

      // Extract renamed (IM), i_m
    arrSourceRem.sort(funIncId);   arrTargetRem.sort(funIncId);
    var [err, arrSourceIM, arrTargetIM, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['id', 'sm']); if(err) {debugger; return [err];}

      // Extract Defragmented (NM) (file-copied-then-renamed-to-origin), _nm
    arrSourceRem.sort(funIncStrName);   arrTargetRem.sort(funIncStrName)
    var [err, arrSourceNM, arrTargetNM, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ["strName", 'sm']); if(err) {debugger; return [err];}

      // Extract changed, in_
    var [err, arrSourceChanged, arrTargetChanged, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName', 'id']); if(err) {debugger; return [err];}

      // Extract reusedName, _n_
    var [err, arrSourceReusedName, arrTargetReusedName, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName']); if(err) {debugger; return [err];}

      // Extract reusedId (MatchingId), i__
    arrSourceRem.sort(funIncId);   arrTargetRem.sort(funIncId)
    var [err, arrSourceReusedId, arrTargetReusedId, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['id']); if(err) {debugger; return [err];}


      // Matching SM (Copy)
    arrSourceRem.sort(funIncSM);   arrTargetRem.sort(funIncSM);
    var [objSourceByIM, objTargetByIM]=categorizeByPropOld(arrSourceRem, arrTargetRem, row=>row.sm)
    var Mat2=this.Mat2=new MatNxN()
    Mat2.assignFromObjManyToMany(objSourceByIM, objTargetByIM);
    var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
    var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
    var arrSource1T1NoName=[].concat(Mat2.arrA[1][1]);
    var arrTarget1T1NoName=[].concat(Mat2.arrB[1][1]);
    var ArrSourceMultNoName=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMultNoName=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
    //var arrSourceMultNoName=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    //var arrTargetMultNoName=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
    // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
    //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭
  
    extend(this, {arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName}); //, arrSourceMultNoName, arrTargetMultNoName

    //if(boNothingToDo) return [null]

      // Writing UntouchedWOExactMTime
    var arrO=[]
    for(var i=0;i<arrSourceUntouched.length;i++){
      var rowS=arrSourceUntouched[i], rowT=arrTargetUntouched[i]
      if(rowS.mtime_ns64!=rowT.mtime_ns64) arrO.push(`${rowS.id} ${rowS.mtime_ns64}`)
    }
    myResultWriter.Str.untouchedWOExactMTime=arrO;
      
      // Writing to category files

      // Renamed i_m
    //myResultWriter.Str.renamed=formatRename1T1(arrSourceIM, arrTargetIM)

    myResultWriter.Str.renamed=T2DCategory1T1.formatForFile(arrSourceIM, arrTargetIM)
    myResultWriter.Str.defragmented=T2DCategoryNM.formatForFile(arrSourceNM, arrTargetNM)
    myResultWriter.Str.changed=T2DCategoryChanged.formatForFile(arrSourceChanged, arrTargetChanged)
    myResultWriter.Str.reusedName=T2DCategoryReusedName.formatForFile(arrSourceReusedName, arrTargetReusedName)
    myResultWriter.Str.reusedId=T2DCategoryReusedId.formatForFile(arrSourceReusedId, arrTargetReusedId)

      // Created
    var StrTmp=[]
    for(var row of arrCreate) StrTmp.push(`${row.strType} ${row.id} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str.created=StrTmp

      // Deleted
    var StrTmp=[]
    for(var row of arrDelete) StrTmp.push(`${row.strType} ${row.id} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str.deleted=StrTmp

      // 1T1NoName
    //var [arrSource1To1NoName, arrTarget1To1NoName, objSourceRem2, objTargetRem2]=extract1To1(objSourceByIM, objTargetByIM)
    myResultWriter.Str[`1T1NoName`]=T2DCategory1T1NoName.formatForFile(arrSource1T1NoName, arrTarget1T1NoName)


      // MultNoName
    setBestNameMatchFirst(ArrSourceMultNoName, ArrTargetMultNoName)

    //   // Sort by size
    // ArrSourceMultNoName.forEach((el, i)=>el.ind=i); // Set index
    // var funInc=(a,b)=>a[0].size-b[0].size;
    // var ArrAtmp=[...ArrSourceMultNoName].sort(funInc)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrTargetMultNoName, Ind)
    myResultWriter.Str.STMatch2=formatMatchingDataWMult(ArrSourceMultNoName, ArrTargetMultNoName); 

    myResultWriter.Str.hl=[]

    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    return [null];
  }


  async readAction(){
    var {fsDb, charTRes, flPrepend, strHost, boRemote, charSide}=this

      // Parsing fsDb (database)
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err];
    //var [err, strData]=await readStrFile(fsDb); if(err) return [err];
    if(err){
      if(err.code==STR_ENOENT){err=null; strData=""} //STR_NE_FS_FILRDER
      else{ debugger;return [err]}
    }
    setMess(`Parsing db`, null, true)
    var arrDb=parseDb(strData, charTRes);
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    var PathCur=gThis[`Path${charSide}`]

      // untouchedWOExactMTime
    var fsTmp=PathCur.untouchedWOExactMTime.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrUntouchedWOExactMTime=parseSSV(strData, ['id', 'mtime_ns64']); 

    var fSetMTime=row=>{row.mtime_ns64==BigInt(row.strMTime); row.mtime_ns64Floored==BigInt(row.strMTimeFloored)}
    var funForRenamed=row=>{
      if(row.strMTime=="seeAbove") row.strMTime=row.strMTimeFloored;
      row.mtime_ns64=BigInt(row.strMTime); row.mtime_ns64Floored=BigInt(row.strMTimeFloored);
    }

    var fsTmp=PathCur.renamed.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSourceIM, arrTargetIM]=parseRelations(strData); if(err) return [err]
    arrTargetIM.forEach(funForRenamed); arrSourceIM.forEach(funForRenamed)
    //arrTargetIM.forEach(fSetMTime); arrSourceIM.forEach(fSetMTime)

    var fsTmp=PathCur.defragmented.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSourceNM, arrTargetNM]=parseRelations(strData);if(err) return [err]
    //arrTargetNM.forEach(fSetMTime); arrSourceNM.forEach(fSetMTime)

    var fsTmp=PathCur.changed.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSourceChanged, arrTargetChanged]=parseRelations(strData); if(err) return [err]
    //arrTargetChanged.forEach(fSetMTime); arrSourceChanged.forEach(fSetMTime)

    var fsTmp=PathCur.reusedName.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSourceReusedName, arrTargetReusedName]=parseRelations(strData); if(err) return [err]
    //arrTargetReusedName.forEach(fSetMTime); arrSourceReusedName.forEach(fSetMTime)

    var fsTmp=PathCur.reusedId.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSourceReusedId, arrTargetReusedId]=parseRelations(strData); if(err) return [err]
    //arrTargetReusedId.forEach(fSetMTime); arrSourceReusedId.forEach(fSetMTime)

    var fsTmp=PathCur['1T1NoName'].fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrSource1T1NoName, arrTarget1T1NoName]=parseRelations(strData); if(err) return [err]
    arrTarget1T1NoName.forEach(funForRenamed); arrSource1T1NoName.forEach(funForRenamed)
    //arrTarget1T1NoName.forEach(fSetMTime); arrSource1T1NoName.forEach(fSetMTime)

      // Created/Deleted
    var fsTmp=PathCur.created.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrCreate=parseSSV(strData, ['strType', 'id', 'size', 'strMTime', 'strName']);
    var fsTmp=PathCur.deleted.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrDelete=parseSSV(strData, ['strType', 'id', 'size', 'strMTime', 'strName']);
    extend(this, {arrCreate, arrDelete})

    var fT=row=>{
      row.id=row.id; row.size=Number(row.size); row.mtime_ns64=BigInt(row.strMTime)
    }
    arrCreate.forEach(fT); arrDelete.forEach(fT)


      // Mult
    var fsTmp=PathCur.STMatch2.fsName
    var [err, objSourceMultNoName, objTargetMultNoName, arrSourceMultNoName, arrTargetMultNoName]=await parseMultSTFile(fsTmp); if(err) {debugger; return [err];}
    var MatRem=this.MatRem=new MatNxN()
    MatRem.assignFromObjManyToMany(objSourceMultNoName, objTargetMultNoName);

    extend(this, {arrUntouchedWOExactMTime, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName}) // arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched
    //, arrSourceMultNoName, arrTargetMultNoName
    return [null]
  }
  getMess(){
    var {arrTargetChanged, arrTargetIM, arrTargetNM, arrTargetReusedName, arrTargetReusedId, arrCreate, arrDelete, arrTarget1T1NoName, MatRem}=this; //arrSourceMultNoName, arrTargetMultNoName

    var arrSourceMultNoName=[].concat(MatRem.arrA[1][2], MatRem.arrA[2][1], MatRem.arrA[2][2]);
    var arrTargetMultNoName=[].concat(MatRem.arrB[1][2], MatRem.arrB[2][1], MatRem.arrB[2][2]);

    var nTmp=arrTargetChanged.length+arrTargetReusedName.length+arrTargetReusedId.length+arrTarget1T1NoName.length
    var nDeleteB=nTmp+arrDelete.length+arrTargetMultNoName.length
    var nCreateB=nTmp+arrCreate.length+arrSourceMultNoName.length
    var nRenamed=arrTargetIM.length
    var nReIdd=arrTargetNM.length
    var strMess=`Delete: ${nDeleteB}\nHashcode-calculations: ${nCreateB}\nRenamed: ${nRenamed}\nRe-Idd: ${nReIdd}`
    var boAbort=nDeleteB==0 && nCreateB==0 && nRenamed==0 && nReIdd==0
    return [boAbort, strMess]
  }
  async doSCChanges(){ // SC=Short cut
    var {arrDb, arrUntouchedWOExactMTime, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, MatRem}=this; //, arrSourceMultNoName, arrTargetMultNoName

    var arrSourceMultNoName=[].concat(MatRem.arrA[1][2], MatRem.arrA[2][1], MatRem.arrA[2][2]);
    var arrTargetMultNoName=[].concat(MatRem.arrB[1][2], MatRem.arrB[2][1], MatRem.arrB[2][2]);

    // var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    // var arrDbOrg=arrDb, arrDb=arrDbRelevant
    // this.arrDb=arrDb;   this.arrDbNonRelevant=arrDbNonRelevant

      // Set exact time of files in arrUntouchedWOExactMTime
    arrUntouchedWOExactMTime.sort(funIncId);   arrDb.sort(funIncId)
    var [err, arrSourceM, arrDbM, arrTrashA, arrTrashB]=extractMatching(arrUntouchedWOExactMTime, arrDb, ['id']); if(err) return [err];
    for(var i=0;i<arrSourceM.length;i++){ var rowS=arrSourceM[i], rowT=arrDbM[i]; rowT.mtime_ns64=rowS.mtime_ns64; }

    
    var arrDeleteB=[].concat(arrTargetChanged, arrTargetReusedName, arrTargetReusedId, arrDelete, arrTarget1T1NoName, arrTargetMultNoName);
    var arrSCNew=[].concat(arrTargetIM, arrTargetNM)
    var arrMold=[].concat(arrDeleteB, arrSCNew)

      // Recreate arrTargetUntouched
    arrMold.sort(funIncId);
    var [err, arrTrash, arrMoldTrash, arrTargetUntouched, arrMoldRemShouldBeZero]=extractMatching(arrDb, arrMold, ['id']); if(err) return [err];
    if(arrMoldRemShouldBeZero.length) {debugger; return [Error("arrMoldRemShouldBeZero.length>0")];}
    var arrSourceUntouched=arrTargetUntouched
    extend(this, {arrSourceUntouched, arrTargetUntouched})

      // Copy hashes to arrSCNew
    arrSCNew.sort(funIncId);
    var [err, arrSCOld, arrSCTrash, arrTrash, arrSCShouldBeZero]=extractMatching(arrDb, arrSCNew, ['id']); if(err) return [err];
    if(arrSCShouldBeZero.length) return [Error("arrSCShouldBeZero.length>0")]
    for(var i=0;i<arrSCNew.length;i++){ arrSCNew[i].strHash=arrSCOld[i].strHash; }

    //var [err]=await T2DCreateSyncData.call(this);  if(err) return [err];
    return [null]
  }

  async createSyncData(){  // Calculate hashcodes etc
    var {fsDbDir, flPrepend, arrDbNonRelevant, strHost, boRemote}=this
    var { arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, MatRem}=this; //, arrSourceMultNoName, arrTargetMultNoName

    var arrSourceMultNoName=[].concat(MatRem.arrA[1][2], MatRem.arrA[2][1], MatRem.arrA[2][2]);
    var arrTargetMultNoName=[].concat(MatRem.arrB[1][2], MatRem.arrB[2][1], MatRem.arrB[2][2]);

      // Copy hash to S
    var arrCopyHashS=[].concat(arrSourceUntouched, arrSourceIM, arrSourceNM)
    var arrCopyHashT=[].concat(arrTargetUntouched, arrTargetIM, arrTargetNM)
    for(var i in arrCopyHashS){  copySome(arrCopyHashS[i], arrCopyHashT[i], ["strHash"]) }

    var arrTmp=[].concat(arrSourceChanged, arrSourceReusedName, arrSourceReusedId, arrSource1T1NoName, arrSourceMultNoName, arrCreate)
    var n=arrTmp.length;

    var [err, StrHash]=await calcHashes(arrTmp, fsDbDir, strHost); if(err) { return [err];}
    if(StrHash.length!=n) { return [Error('StrHash.length!=n')];}
    for(var i=0;i<n;i++){
      var row=arrTmp[i], strHash=StrHash[i]
      if(strHash.length!=32) { return [Error('strHash.length!=32')];}
      row.strHash=strHash
    }

    var arrTargetNew=[].concat(arrCopyHashS, arrSourceChanged, arrSourceReusedName, arrSourceReusedId, arrSource1T1NoName, arrCreate, arrSourceMultNoName); //arrSourceUntouched, 
      // Add flPrepend to strName if appropriate
    if(flPrepend.length>0){
      for(var row of arrTargetNew) row.strName=flPrepend+row.strName
    }

      // Add Non-relevant entries
    //arrTargetNew.push(...arrDbNonRelevant)
    arrTargetNew=arrTargetNew.concat(arrDbNonRelevant)
    arrTargetNew.sort(funIncStrName)
    this.arrTargetNew=arrTargetNew

    //var tStop=unixNow();   myConsole.log(`elapsed time ${(tStop-tStart)}ms`)
    return [null]
  }
  async makeChanges(){
    var {fsDb, strHost, boRemote, arrTargetNew}=this

    var fsTmp=PathLoose.remoteFileLocally.fsName
    var fsDbLoc=boRemote?fsTmp:fsDb
    var [err]=await writeDbFile(arrTargetNew, fsDbLoc); if(err) { return [err];}

    if(boRemote){
      var arrCommand=['scp', fsDbLoc, strHost+':'+fsDb]
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
      if(stdErr) { 
        if(stdErr.indexOf('No such file or directory') ){boDbRemoteExist=false}
        else {debugger; return [stdErr];}
      }
      else if(exitCode) { debugger; return [Error(stdErr)]; };
    }


    return [null]
  }

}

var formatTitle=function(arrIn, n=nShortListMax, fun=row=>row.strName){
  var l=arrIn.length, nOut=Math.min(n,l), StrOut=Array(nOut)
  if(nOut==0) return undefined
  for(var i=0;i<nOut;i++) { var row=arrIn[i]; StrOut[i]=fun(row);}
  if(l>n) StrOut.push('⋮')
  return StrOut.join('\n')
}
var formatTitleMult=function(ArrA, ArrB, n=nShortListMax){
  var l=ArrA.length, StrOut=[], boBreak=false;
  var PrefixSide=['S','  T']
  for(var i=0;i<l;i++) {
    var arrA=ArrA[i], arrB=ArrB[i];
    var ArrTmp=[arrA, arrB]
    for(var k=0;k<2;k++) {
      var arrTmp=ArrTmp[k]
      for(var j=0;j<arrTmp.length;j++) {
        StrOut.push(`${PrefixSide[k]}: ${arrTmp[j].strName}`);
        if(StrOut.length>n) {StrOut.push('⋮'); boBreak=true; break;}
      }
      if(boBreak) break
    }
  }
  return StrOut.join('\n')
}


var T2DCategory1T1={ //renamed
  formatForFile(arrA11, arrB11){
    const len=arrA11.length
    arrA11.forEach((el, i)=>el.ind=i)
    var arrStmp=arrA11.toSorted(funIncStrName)
  
      // Create Ind
    var Ind=arrStmp.map(entry=>entry.ind)
    const arrTtmp=eInd(arrB11, Ind)
  
    var funMatch=(s,t)=>{
      return `MatchingData ${s.id} ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)}`;
    }
    var funUniqueS=s=>{
      var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
      return `  S ${s.strType} ${strD} ${s.strName}`
    }
    var funUniqueT=s=>{
      var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
      return `  T ${s.strType} ${strD} ${s.strName}`
    }
    var arrData=formatMatchingData(arrStmp, arrTtmp, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string int string`, strHeadM=`id size strMTimeFloored`;
    var strHeadUT=`string string string string`, strHeadU=`side strType strMTime strName`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}
var T2DCategoryNM={  // File copied, then renamed to origin, _nm
  formatForFile:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)} ${s.strName}`;
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.id.padStart(10)} ${s.strMTime}`;  }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.id.padStart(10)} ${s.strMTime}`;  }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`int int64 string`, strHeadM=`size mtime_ns64Floored strName`;
    var strHeadUT=`string string string int64`, strHeadU=`side strType id mtime_ns64`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

var T2DCategoryChanged={
  formatForFile:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.id} ${s.strName}`;
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime}` }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime}` }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string string`, strHeadM=`id strName`;
    var strHeadUT=`string string int int64`, strHeadU=`side strType size mtime_ns64`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

var T2DCategoryReusedName={
  formatForFile:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.strName}`
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.id.padStart(10)} ${s.size.myPadStart(10)} ${s.strMTime}`; }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.id.padStart(10)} ${s.size.myPadStart(10)} ${s.strMTime}`; }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string`, strHeadM=`strName`, strHeadUT=`string string string int int64`, strHeadU=`side strType id size mtime_ns64`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

var T2DCategoryReusedId={
  formatForFile:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.id}`;
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime} ${s.strName}`;  }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime} ${s.strName}`;  }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string`, strHeadM=`id`, strHeadUT=`string string int int64 string`, strHeadU=`side strType size mtime_ns64 strName`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}
var T2DCategory1T1NoName={ //format1T1NoName
  formatForFile(arrA11, arrB11){
    const len=arrA11.length
    arrA11.forEach((el, i)=>el.ind=i)
    var arrStmp=arrA11.toSorted(funIncStrName)
  
      // Create Ind
    var Ind=arrStmp.map(entry=>entry.ind)
    const arrTtmp=eInd(arrB11, Ind)
  
    var funMatch=(s,t)=>{
      return `MatchingData ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)}`;
    }
    var funUniqueS=s=>{
      var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
      return `  S ${s.strType} ${s.id} ${strD} ${s.strName}`
    }
    var funUniqueT=s=>{
      var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
      return `  T ${s.strType} ${s.id} ${strD} ${s.strName}`
    }
    var arrData=formatMatchingData(arrStmp, arrTtmp, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`int string`, strHeadM=`size strMTimeFloored`;
    var strHeadUT=`string string string string string`, strHeadU=`side strType id strMTime strName`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}


class DoDCActionsToTree{
  constructor(arg){
    copySome(this, arg, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "strHostTarget", "boRemote"]); 
  }
  async read(){
    var {fiSourceDir, fiTargetDir, fiTargetDbDir, strHostTarget, boRemote}=this

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDir]=await myRealPath(fiTargetDir, strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    extend(this, {fsSourceDir, fsTargetDir, fsTargetDbDir})

    var fsTmp=PathT2T.changed.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , , arrChangeNew, arrChangeOld]=parseRelations(strData); if(err) return [err]
    var arrChange=arrChangeNew; //debugger // This could be new and SM would be set correct
    extend(this, {arrChange})

    var fsTmp=PathT2T.created.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrCreate=parseSSV(strData, ['strType', 'size', 'mtime_ns64', 'strName']); 
    var fsTmp=PathT2T.deleted.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrDelete=parseSSV(strData, ['strType', 'size', 'mtime_ns64', 'strName']);
    extend(this, {arrCreate, arrDelete})

      // Folders
    var fsTmp=PathT2T.createdF.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrCreateF=parseSSV(strData, ['strName']);
    var fsTmp=PathT2T.deletedF.fsName
    var [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var arrDeleteF=parseSSV(strData, ['strName']);
    extend(this, {arrCreateF, arrDeleteF})


    var fsTmp=PathT2T.STMatch3.fsName
    var [err, objS, objT, arrSourceMultNoName, arrTargetMultNoName]=await parseMultSTFile(fsTmp); if(err) {debugger; return [err];}
    extend(this, {arrSourceMultNoName, arrTargetMultNoName})
    var nDelete=arrChange.length+arrDelete.length+arrTargetMultNoName.length
    var nCreate=arrChange.length+arrCreate.length+arrSourceMultNoName.length
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    return [null, {nDelete, nCreate, nDeleteF, nCreateF}]
  }
  getMess(){
    var {arrChange, arrCreate, arrDelete, arrSourceMultNoName, arrTargetMultNoName, arrCreateF, arrDeleteF}=this
    var nDelete=arrChange.length+arrDelete.length+arrTargetMultNoName.length
    var nCreate=arrChange.length+arrCreate.length+arrSourceMultNoName.length
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    //var strMess=`Delete: ${nDelete}\nCreate: ${nCreate}`
    var strMess=`Deleting: ${nDelete} file${pluralS(nDelete)} (and ${nDeleteF} folder${pluralS(nDeleteF)})
Writing: ${nCreate} file${pluralS(nCreate)} (and ${nCreateF} folder${pluralS(nCreateF)})`
    return strMess
  }
  async makeChanges(){
    var {fsSourceDir, fsTargetDir, fsTargetDbDir, arrChange, arrCreate, arrDelete, arrSourceMultNoName, arrTargetMultNoName, arrCreateF, arrDeleteF, strHostTarget, boRemote}=this

      // Create Folders
    var StrTmp=arrCreateF.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myMkFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}

      // Changed
    var StrTmp=arrChange.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrChange, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}

      // Deleted / Created
    var StrTmp=arrDelete.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrCreate, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}

      // Mult
    var StrTmp=arrTargetMultNoName.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrSourceMultNoName, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}

      // Delete Folders
    var StrTmp=arrDeleteF.map(row=>fsTargetDir+charF+row.strName);
    StrTmp.sort().reverse()
    var [err]=await myRmFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}


class SyncT2T{
  constructor(arg){
    copySome(this, arg, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "strHostTarget", "boRemote", "charFilterMethod", "charTRes", "leafFilter", "leafFilterFirst"]);
  }
  async constructorPart2(){ // For stuff that needs await
    var [err, fsSourceDir]=await myRealPath(this.fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDir]=await myRealPath(this.fiTargetDir, this.strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(this.fiTargetDbDir, this.strHostTarget); if(err) {debugger; return [err];}

    extend(this, {fsSourceDir, fsTargetDir, fsTargetDbDir})
    return [null]
  }
  
  async compare(){  //runOps
    var {fsSourceDir, fsTargetDir, fsTargetDbDir, charTRes, leafFilter, leafFilterFirst, strHostTarget, boRemote, charFilterMethod}=this
 
      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, boExist]=await fileExist(fsTargetDir, strHostTarget); if(err) {debugger; return [err]; }
    if(!boExist){var strExtra=strHostTarget?' on '+strHostTarget:'';  return [Error(`${fsTargetDir} does not exist${strExtra}`)];}

    if(1){ //boRemote
        // Load python-script to host
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }

    var treeParser=new TreeParser()
    setMess(`Parsing source tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    var tStop=unixNow();   //myConsole.log(`Source parsed, elapsed time ${(tStop-tStart)}ms`)
    //arrSourcef.sort(funIncId)

    setMess(`Parsing target tree`, null, true)
    //if(0) var strHost='l750.local'; else var strHost=null
    var arg={charTRes, fsDir:fsTargetDir, strHost:strHostTarget, charFilterMethod}
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    //arrTargetf.sort(funIncId)

    
      //
      // Folders
      //
      
    arrSourceF.sort(funIncStrName);   arrTargetF.sort(funIncStrName)
    var [err, arrSourceFUntouched, arrTargetFUntouched, arrSourceFRem, arrTargetFRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])
    var arrCreateF=arrSourceFRem, arrDeleteF=arrTargetFRem

    //arrCreateF.sort(funIncStrName) // So that root-most folders come before its children
    //arrDeleteF.sort(funDecStrName) // So that leaf-most folders come before its parents
    extend(this, {arrCreateF, arrDeleteF})


      //
      // Files
      //

    var arrSource=arrSourcef, arrTarget=arrTargetf
    extend(this, {arrSource, arrTarget})
    

      // Search for multiples
    arrSource.sort(funIncSM);   arrTarget.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceM, objTargetM]=categorizeByPropOld(arrSource, arrTarget, funSM)
    var Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(objSourceM, objTargetM);
    extend(this, {Mat1})
    

      // Extract untouched files
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrA, arrB, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) return [err]
    this.arrSourceUntouched=arrA; this.arrTargetUntouched=arrB; // nm

    var boChanged=this.boChanged=Boolean(arrSourceTouched.length || arrTargetTouched.length || arrCreateF.length || arrDeleteF.length)

      // Extract 1T1 and ViaA (renamed) (M)

    arrSourceTouched.sort(funIncSM);   arrTargetTouched.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceByM, objTargetByM]=categorizeByPropOld(arrSourceTouched, arrTargetTouched, funSM)

      // Calculate Mat2
    var Mat2=new MatNxN()
    Mat2.assignFromObjManyToMany(objSourceByM, objTargetByM);
    extend(this, {Mat2})


      // Create collections (obj/arr) of files only renamed in ancestor. (Just noting down renamed ancestor would really be enough (only the keys(2-dim) of objAncestorOnlyRenamed are used))
    var [nAncestorOnlyRenamed, objAncestorOnlyRenamed]=summarizeAncestorOnlyRename(Mat2.arrA[1][1], Mat2.arrB[1][1])
      // Create arrAncestorOnlyRenamed, more suitable for listing (all renamed parents)
    var arrAncestorOnlyRenamed=convertObjAncestorOnlyRenamedToArr(objAncestorOnlyRenamed)
    var funDecN=(a,b)=>b.n-a.n;         arrAncestorOnlyRenamed.sort(funDecN);
    var funDecLev=(a,b)=>b.lev-a.lev;     arrAncestorOnlyRenamed.sort(funDecLev)
    extend(this, {arrAncestorOnlyRenamed, nAncestorOnlyRenamed})

    //var MatSec=Mat2.shallowCopy()

      // From the files matching in SM, find files that matches 1T1-files that has only been renamed in ancestor.
      // Extract files Idd by ancestor folder from multiples
    //var [arrSourceIddByFolder, arrTargetIddByFolder, objSourceByMAfterExtraIDing, objTargetByMAfterExtraIDing]=extractExtraByFolder(objSourceByM, objTargetByM, objAncestorOnlyRenamed)


    var [objSourceByMTmp, objTargetByMTmp]=Mat2.toObjManyToMany(funSM)
    var [arrSourceIddByFolder, arrTargetIddByFolder, objSourceByMAfterExtraIDing, objTargetByMAfterExtraIDing]=extractExtraByFolder(objSourceByMTmp, objTargetByMTmp, objAncestorOnlyRenamed); //objSourceByM, objTargetByM

    extend(this, {arrSourceIddByFolder, arrTargetIddByFolder}) // _ma (meta and ancestor)



    var [arrSource1To1, arrTarget1To1, objSourceRem2, objTargetRem2]=extract1To1(objSourceByMAfterExtraIDing, objTargetByMAfterExtraIDing)
    extend(this, {arrSource1To1, arrTarget1To1})

    
      // Recalculate Mat3
    objManyToManyRemoveEmpty(objSourceRem2, objTargetRem2)  // Modifies the arguments
    var Mat3=new MatNxN()
    //Mat3.assignFromObjManyToMany(objSourceByMAfterExtraIDing, objTargetByMAfterExtraIDing);
    Mat3.assignFromObjManyToMany(objSourceRem2, objTargetRem2);
    extend(this, {Mat3})

      // Changed (NoM with matching strName)
    var arrSourceNoM=[].concat(Mat3.arrA[2][0], Mat3.arrA[1][0]);
    var arrTargetNoM=[].concat(Mat3.arrB[0][1], Mat3.arrB[0][2]);
    arrSourceNoM.sort(funIncStrName); arrTargetNoM.sort(funIncStrName);
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceNoM, arrTargetNoM, ['strName']); if(err) return [err]
    this.arrSourceReusedName=arrA; this.arrTargetReusedName=arrB

    var arrCreate=arrSourceRem, arrDelete=arrTargetRem


    extend(this, {arrCreate, arrDelete})
    return [null]
  }

  format(fiDb){ //fsDir, 
    var {Mat1, Mat2, Mat3}=this

    //var myResultWriter=new MyResultWriter(StrStemT2T)
    var myResultWriter=new MyWriter(PathT2T)



    Mat1.ShortList=[]
    var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    //var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat1.ArrA[i][j]);
      var ArrBMult=[].concat(Mat1.ArrB[i][j])
      //setBestNameMatchFirst(ArrAMult, ArrBMult)
        // Sort by size
      var funVal=(a,b)=>b[0].size-a[0].size; // Dec
      //var funVal=(a,b)=>a[0].size-b[0].size; // Inc
      if(i && j){
        ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
        var ArrAtmp=ArrAMult.toSorted(funVal)
        var Ind=ArrAtmp.map(entry=>entry.ind),  ArrBtmp=eInd(ArrBMult, Ind)
      }else if(i){
        var ArrAtmp=ArrAMult.toSorted(funVal), ArrBtmp=ArrBMult
      }else{
        var ArrBtmp=ArrBMult.toSorted(funVal), ArrAtmp=ArrAMult
      }
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["STMatch1_"+i+j]=StrDuplicateM
      var StrT=StrDuplicateM.slice(0,nShortListMax);
      if(StrDuplicateM.length>nShortListMax) StrT.push('⋮')
      var strTmp=StrT.length?StrT.join('\n'):undefined;
      Mat1.ShortList[`${i}${j}`]=strTmp
    }


    Mat2.ShortList=[]
    var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    //var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat2.ArrA[i][j]);
      var ArrBMult=[].concat(Mat2.ArrB[i][j])
      //setBestNameMatchFirst(ArrAMult, ArrBMult)

        // Sort by size
      var funVal=(a,b)=>b[0].size-a[0].size; // Dec
      //var funVal=(a,b)=>a[0].size-b[0].size; // Inc
      if(i && j){
        ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
        var ArrAtmp=ArrAMult.toSorted(funVal)
        var Ind=ArrAtmp.map(entry=>entry.ind),  ArrBtmp=eInd(ArrBMult, Ind)
      }else if(i){
        var ArrAtmp=ArrAMult.toSorted(funVal), ArrBtmp=ArrBMult
      }else{
        var ArrBtmp=ArrBMult.toSorted(funVal), ArrAtmp=ArrAMult
      }
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["STMatch2_"+i+j]=StrDuplicateM
      var StrT=StrDuplicateM.slice(0,nShortListMax);
      if(StrDuplicateM.length>nShortListMax) StrT.push('⋮')
      var strTmp=StrT.length?StrT.join('\n'):undefined;
      Mat2.ShortList[`${i}${j}`]=strTmp;
    }

    // var ArrBMult=[].concat(Mat2.ArrB[0][2]);
    //   // Sort by size
    // var funDec=(a,b)=>b[0].size-a[0].size;
    // var ArrBtmp=ArrBMult.toSorted(funDec)
    // var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrBtmp, 'T');
    // myResultWriter.Str["STMatch2_02"]=StrDuplicateM

    // var ArrAMult=[].concat(Mat2.ArrA[2][0]);
    //   // Sort by size
    // var funDec=(a,b)=>b[0].size-a[0].size;
    // var ArrAtmp=ArrAMult.toSorted(funDec)
    // var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrAtmp, 'S');
    // myResultWriter.Str["T2T_STMatch2_20"]=StrDuplicateM


    var ArrAMult=[].concat(Mat3.ArrA[1][2],Mat3.ArrA[2][1],Mat3.ArrA[2][2]);
    var ArrBMult=[].concat(Mat3.ArrB[1][2],Mat3.ArrB[2][1],Mat3.ArrB[2][2])
    setBestNameMatchFirst(ArrAMult, ArrBMult)
    var StrDuplicateFinal=formatMatchingDataWMult(ArrAMult, ArrBMult);


      // Leaf- vs Parent- changes 
    var [StrRenameAncestorOnly, StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed]=formatAncestorOnlyRenamed(this.arrAncestorOnlyRenamed, fiDb)

    var funMatch=(s,t)=>`MatchingData ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)}`;
    var funUniqueS=s=>{  return `  S ${s.strName}`; }
    var funUniqueT=s=>{  return `  T ${s.strName}`; }
    var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, funMatch, funUniqueS, funUniqueT)
    var strHead=`int int64\nsize mtime_ns64Floored\nstring string\nside strName`;
    //StrRenameAdditional.unshift(strHead)
    if(StrRenameAdditional.length) StrRenameAdditional.unshift(strHead)

      // Changed
    var funMatch=(s,t)=>`MatchingData ${s.strName}`;
    var funUniqueS=s=>`  S ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime}`
    var funUniqueT=s=>`  T ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime}`
    var StrChanged=formatMatchingData(this.arrSourceReusedName, this.arrTargetReusedName, funMatch, funUniqueS, funUniqueT)
    var strHead=`string\nstrName\nstring string int int64\nside strType size mtime_ns64`;
    //StrChanged.unshift(strHead)
    if(StrChanged.length) StrChanged.unshift(strHead)


      // Created/Deleted
    var StrCreated=[], nCreate=this.arrCreate.length;
    if(nCreate){
      //var strTmp=`#Remaining in source only (created): ${nCreate}`;  StrCreated.push('\n'+strTmp)
      for(var row of this.arrCreate) StrCreated.push(`${row.strType} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    }
    var StrDeleted=[], nDelete=this.arrDelete.length
    if(nDelete){
      //var strTmp=`#Remaining in target only (deleted): ${nDelete}`;  StrDeleted.push('\n'+strTmp)
      for(var row of this.arrDelete) StrDeleted.push(`${row.strType} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    }


      // Created/Deleted Folders
    var StrCreatedF=[];    for(var row of this.arrCreateF) StrCreatedF.push(`${row.strName}`) //${row.strMTime} 
    var StrDeletedF=[];    for(var row of this.arrDeleteF) StrDeletedF.push(`${row.strName}`) //${row.strMTime} 
    


    // var [err, StrSum]=this.formatScreen(); if(err) return [err]
    // this.myResultWriter.Str["screen"]=StrSum
    // this.myResultWriter.Str.sum=StrSum
    //this.myResultWriter.Str.resultMore=this.formatResultMore()
    myResultWriter.Str.changed=StrChanged;
    myResultWriter.Str.created=StrCreated;
    myResultWriter.Str.deleted=StrDeleted;
    myResultWriter.Str.createdF=StrCreatedF;
    myResultWriter.Str.deletedF=StrDeletedF;
    myResultWriter.Str.renamed=formatRename1T1(this.arrSource1To1, this.arrTarget1To1)
    myResultWriter.Str.ancestor=StrRenameAncestorOnly
    //myResultWriter.Str.STMatch1=StrDuplicateM
    //myResultWriter.Str.STMatch2=StrDuplicateInitial
    myResultWriter.Str.STMatch3=StrDuplicateFinal
    myResultWriter.Str.renamedAdditional=StrRenameAdditional
    this.myResultWriter=myResultWriter
  }
  makeConfirmMess(){

    var {arrSource, arrTarget, arrSourceUntouched, arrSourceReusedName, arrCreate, arrDelete, arrSourceIddByFolder, arrAncestorOnlyRenamed, Mat1, Mat2, Mat3, nAncestorOnlyRenamed,   arrSource1To1, arrChange, arrCreateF, arrDeleteF}=this

    var nReusedName=arrSourceReusedName.length
    var nCreate=arrCreate.length,  nDelete=arrDelete.length

    var nIddByFolder=arrSourceIddByFolder.length
    var n1T1=arrSource1To1.length

    var {NA, NB}=Mat3.getN()
    var nAMult = NA[1][2] + NA[2][1] + NA[2][2]
    var nBMult = NB[1][2] + NB[2][1] + NB[2][2]

    var nCreateB=nReusedName+nCreate+nAMult
    var nDeleteB=nReusedName+nDelete+nBMult

    var nRename=n1T1+nIddByFolder
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    var strMess=`Renaming: ${nRename} file${pluralS(nRename)}
Deleting: ${nDeleteB} file${pluralS(nDeleteB)} (and ${nDeleteF} folder${pluralS(nDeleteF)})
Writing: ${nCreateB} file${pluralS(nCreateB)} (and ${nCreateF} folder${pluralS(nCreateF)})`


    return strMess
  }
  async writeToFile(){
    var {myResultWriter}=this
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    return [null];
  }
  async makeRenameChanges(){
      // 1T1
    var {arrSource1To1, arrTarget1To1, arrSourceIddByFolder, arrTargetIddByFolder, arrSourceReusedName, arrTargetReusedName, fsSourceDir, arrCreate, arrDelete, fsTargetDir, fsTargetDbDir, strHostTarget, boRemote}=this;
    var len=arrSource1To1.length, arrRename=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=fsTargetDir+charF+arrTarget1To1[i].strName
      var fsNew=fsTargetDir+charF+arrSource1To1[i].strName
      arrRename[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrRename, strHostTarget, true);  if(err) {debugger; return [err];}

      // IddByFolder
    var len=arrSourceIddByFolder.length, arrRename=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=fsTargetDir+charF+arrTargetIddByFolder[i].strName
      var fsNew=fsTargetDir+charF+arrSourceIddByFolder[i].strName
      arrRename[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrRename, strHostTarget, true);  if(err) {debugger; return [err];}
    return [null]
  }
  async makeDeleteNWriteChanges(){
      // 1T1
    var {arrSource1To1, arrTarget1To1, arrSourceIddByFolder, arrTargetIddByFolder, arrSourceReusedName, arrTargetReusedName, fsSourceDir, arrCreate, arrDelete, fsTargetDir, fsTargetDbDir, Mat3, strHostTarget, boRemote}=this;
 

      // Changed
    var StrTmp=arrTargetReusedName.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrSourceReusedName, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}

      // Deleted / Created
    var StrTmp=arrDelete.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrCreate, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}


      // Mult
    var arrBMult=[].concat(Mat3.arrB[1][2],Mat3.arrB[2][1],Mat3.arrB[2][2])
    var StrTmp=arrBMult.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var arrAMult=[].concat(Mat3.arrA[1][2],Mat3.arrA[2][1],Mat3.arrA[2][2]);
    var [err]=await myCopyEntries(arrAMult, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}

    return [null]
  }
  
  async createFolders(){
    var {arrCreateF, fsTargetDir, strHostTarget, boRemote}=this;
    var StrTmp=arrCreateF.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myMkFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
  async deleteFolders(){
    var {arrDeleteF, fsTargetDir, strHostTarget, boRemote}=this;
    var StrTmp=arrDeleteF.map(row=>fsTargetDir+charF+row.strName)
    StrTmp.sort().reverse()
    var [err]=await myRmFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
  async makeChanges(){
    var [err]=await this.createFolders(); if(err) {debugger; return [err];}

    var [err]=await this.makeRenameChanges(); if(err) {debugger; return [err];}
    var [err]=await this.makeDeleteNWriteChanges(); if(err) {debugger; return [err];}

    var [err]=await this.deleteFolders(); if(err) {debugger; return [err];}
    return [null]
  }
}



/****************************************************************************************
 * T2T
 ****************************************************************************************/



class RenameFinishToTree{
  constructor(arg){
    var {boDir=false}=arg
    copySome(this, arg, ["fiDir", "fsRenameFile", "strHostTarget", "boRemote"])
    extend(this, {boDir})
  }
  async read(){
    var {fiDir, fsRenameFile, strHostTarget, boRemote}=this

    var [err, fsDir]=await myRealPath(fiDir, strHostTarget); if(err) {debugger; return [err];}
    this.fsDir=fsDir

    var [err, strData]=await readStrFile(fsRenameFile); if(err) return [err]
    var [err, , , arrNew, arrOld]=parseRelations(strData); if(err) return [err]
    var arrRename=Array(arrOld.length)
    for(var i in arrOld){
      var fsOld=fsDir+charF+arrOld[i].strName, fsNew=fsDir+charF+arrNew[i].strName;
      arrRename[i]={fsOld, fsNew}
    }
    
    var funInc=(a,b)=>{if(a.fsOld>b.fsOld) return 1; else if(a.fsOld<b.fsOld) return -1; return 0;};
    arrRename.sort(funInc)
    this.arrRename=arrRename
    return [null];
  }
  async makeChanges(){
    var {fsDir, arrRename, strHostTarget, boRemote}=this
    var [err]=await renameFiles(arrRename, strHostTarget, true);  if(err) {debugger; return [err];}
    return [null];
  }
}



class SyncT2TBrutal{
  constructor(arg){
    copySome(this, arg, ["fiSourceDir", "fiTargetDir", "fiTargetDir", "charTRes", "leafFilter", "leafFilterFirst", "strHostTarget", "boRemote", "charFilterMethod"])
  }
  async constructorPart2(){ // For stuff that needs await
    var {fiSourceDir, fiTargetDir, fiTargetSbDir, charTRes, leafFilter, leafFilterFirst, strHostTarget}=this
    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDir]=await myRealPath(fiTargetDir, strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    //this.fsSourceDir=fsSourceDir; this.fsTargetDir=fsTargetDir
    extend(this, {fsSourceDir, fsTargetDir, fsTargetDbDir})
    return [null];
  }
  async compare(){ 
    var {fiSourceDir, fsSourceDir, fiTargetDir, fsTargetDir, fiTargetDbDir, fsTargetDbDir, charTRes, leafFilter, leafFilterFirst, strHostTarget, boRemote, charFilterMethod}=this
    var tStart=unixNow()

      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, boExist]=await fileExist(fsTargetDir, strHostTarget); if(err) {debugger; return [err]; }
    if(!boExist){var strExtra=strHostTarget?' on '+strHostTarget:'';  return [Error(`${fsTargetDir} does not exist${strExtra}`)];}

      // Parse trees
    var treeParser=new TreeParser()
    setMess(`Parsing source tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) { return [err];}
    setMess(`Parsing target tree`, null, true)
    var arg={charTRes, fsDir:fsTargetDir, strHost:strHostTarget, boRemote} // Leaving out leafFilter/leafFilterFirst means that all files are included
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) { return [err];}

      // Extract untouched files
    arrSourcef.sort(funIncStrName);   arrTargetf.sort(funIncStrName);
    var [err, arrSourcefUntouched, arrTargetfUntouched, arrSourcefRem, arrTargetfRem]=extractMatching(arrSourcef, arrTargetf, ['strName', 'sm'])

      // Extract existing Folders
    arrSourceF.sort(funIncStrName);   arrTargetF.sort(funIncStrName)
    var [err, arrSourceFUntouched, arrTargetFUntouched, arrSourceFRem, arrTargetFRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])

    var arrCreate=arrSourcefRem, arrDelete=arrTargetfRem, arrCreateF=arrSourceFRem, arrDeleteF=arrTargetFRem


    //arrCreateF.sort(funIncStrName) // So that root-most folders come before its children
    //arrDeleteF.sort(funDecStrName) // So that leaf-most folders come before its parents

    extend(this,{arrCreate, arrDelete, arrCreateF, arrDeleteF})
    
    //if(boDryRun) {print("(Dry run) exiting"); return}
    
    //myConsole.log(`elapsed time ${(unixNow()-tStart)}ms`)

    var nCreate=arrCreate.length, nDelete=arrDelete.length
    var nCreateF=arrCreateF.length, nDeleteF=arrDeleteF.length
    var boChanged=nCreate!=0 || nDelete!=0 || nCreateF!=0 || nDeleteF!=0

    return [null, boChanged]
  }
  makeConfirmMess(){
    var {arrCreate, arrDelete, arrCreateF, arrDeleteF}=this
    var nCreate=arrCreate.length, nDelete=arrDelete.length
    var nCreateF=arrCreateF.length, nDeleteF=arrDeleteF.length
    var strMess=`Deleting: ${nDelete} file${pluralS(nDelete)} (and ${nDeleteF} folder${pluralS(nDeleteF)})
Writing: ${nCreate} file${pluralS(nCreate)} (and ${nCreateF} folder${pluralS(nCreateF)})` // 🗎🗀  
    return strMess
  }
  async makeChanges(){
    var {fsSourceDir, fsTargetDir, arrCreate, arrCreateF, arrDelete, arrDeleteF, strHostTarget, boRemote}=this
    var StrTmp=arrDelete.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var StrTmp=arrDeleteF.map(row=>fsTargetDir+charF+row.strName)
    StrTmp.sort().reverse()
    var [err]=await myRmFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var StrTmp=arrCreateF.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myMkFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrCreate, fsSourceDir, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}
    return [null];
  }
}

//
// File categories in T2T: CopyToTarget, CategoryDelete, CopyOnTarget1, CopyOnTarget2, MoveOnTarget, CategorySetMTime
//

class CategoryDelete{ 
  constructor(arg){
    var {RelationHash}=arg;
    copySome(this, arg, ["RelationHash", "strHostTarget", "boRemote", "fsSourceDir", "fsTargetDir"]);

    var arrEntry=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {nDelete, nDeleteAll, nDeleteSome, arrA, arrB}=objRel, lA=arrA.length, lB=arrB.length
      if(nDelete) {
        for(var i=lA;i<lB;i++) { var row=arrB[i]; 
          if('strCat' in row) {debugger; return [Error("strCat already set")]}
          row.strCat='delete'; arrEntry.push(row);
        }
      }
    }
    var Str=arrEntry.map(row=>row.strName)
    extend(this, {arrEntry, Str})
  }
  createFeedback(){ 
    var {Str}=this, nFile=Str.length; 
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}}; 
  }
  getFiOfDeleted(){ 
    var {Str}=this; 
    return Str; 
  }
  async delete(){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrEntry}=this
    var StrTmp=arrEntry.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}


var CopyProt={
  getId:async function(){
    var {arrEntry, fsTargetDir, strHostTarget}=this, n=arrEntry.length
    var StrName=arrEntry.map(row=>row.strName)
    var [err, Id]=await getId(StrName, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}
    if(Id.length!=n) {debugger; return [Error("Id.length!=n")]}
    var arrNoSuch=[]
    for(var i=0;i<n;i++){
      var row=arrEntry[i], {id:idRef}=row, id=Id[i];
      if(id=='noSuch') {id=myUUID(); row.strErr='copyFailed'; arrNoSuch.push(row);}
      extend(row, {id,idRef})
    }
    return [null, arrNoSuch]
  }
}
var CopyOnProt={
  createFeedback(){ 
    var {Str, nS, nT}=this;
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nS, nT}}; 
  }
}
var CopyToTarget={ // For dealing with all files that needs to be copied TO the target (such as via a slow network)
  factory(arg){
    var that={}
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, strHostTarget, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst

    var Fac=this, Key=Object.keys(Fac); Key=AMinusB(Key, ['factory']); copySome(that, Fac, Key)
    var Fac=CopyProt, Key=Object.keys(Fac); Key=AMinusB(Key, []); copySome(that, Fac, Key)

    var arrEntry=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {boCopyTo, arrA}=objRel, rowA=arrA[0]
      if(boCopyTo) { 
        if('strCat' in rowA) {debugger; return [Error("strCat already set")]}
        arrEntry.push(rowA);rowA.strCat='copyTo';
      }
    }
    var Str=arrEntry.map(row=>row.strName)
    extend(that, {arrEntry, Str})
    return that;
  },
  createFeedback(){ 
    var {Str}=this, nFile=Str.length; 
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}}; 
  },
  async copy(){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrEntry}=this
    //var {fsTmpTarget}=gThis
    var fsTmpTarget=fsTargetDir+charF+'tmp_'+myUUID()
    extend(this, {fsTmpTarget})

    // var [err, result]=await myMkFolders([fsTmpTarget], strHostTarget); if(err) {debugger; return [err];}
    // var [err, result]=await myCopyEntriesWHost(arrEntry, fsSourceDir, fsTmpTarget, strHostTarget); if(err) {debugger; return [err];}
    var [err, result]=await myCopyEntriesWHost(arrEntry, fsSourceDir, fsTargetDir, strHostTarget); if(err) {debugger; return [err];}
    return [null]
  },
  // async renameToFinal(){
  //   var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrEntry, fsTargetTmpDir}=this
  //   //var {fsTmpTarget}=gThis
  //   var {fsTmpTarget}=this
  //   var len=arrEntry.length, arrArg=Array(len)
  //   for(var i=0;i<len;i++){
  //     var {strName}=arrEntry[i], fsOld=fsTmpTarget+charF+strName, fsNew=fsTargetDir+charF+strName;    arrArg[i]={fsOld, fsNew}
  //   }
  //   var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}

  //     // Deleteing remaining folders
  //   var StrOld=Array(len)
  //   for(var i=0;i<len;i++){
  //     var {strName}=arrEntry[i];   StrOld[i]=strName
  //   }
  //   //var FsDir=extractDir(FsOld)
  //   var FlDir=extractDir(StrOld, fsTmpTarget)
  //   FlDir.sort().reverse()
  //   var FsDir=FlDir.map(flDir=>fsTmpTarget+charF+flDir)
  //   var [err]=await myRmFolders(FsDir, strHostTarget);  if(err) {debugger; return [err];}
  //   var [err]=await myRmFolders([fsTmpTarget], strHostTarget);  if(err) {debugger; return [err];}
    
  // }
}

var CopyOnTarget1={
  factory(arg){
    var that={}
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst

    var Fac=this, Key=Object.keys(Fac); Key=AMinusB(Key, ['factory']); copySome(that, Fac, Key)
    var Fac=CopyProt, Key=Object.keys(Fac); Key=AMinusB(Key, []); copySome(that, Fac, Key)
    var Fac=CopyOnProt, Key=Object.keys(Fac); Key=AMinusB(Key, []); copySome(that, Fac, Key)

    var Str=[], arrPairCopy=[], nS=0
    for(var key in RelationHash){
      var objRel=RelationHash[key], {nCopyOn1, arrA}=objRel, lA=arrA.length
        //var boCopyTo=lenB==0, nCopyOn1=boCopyTo?lenA-1:0
      if(nCopyOn1) {
        var rowS=arrA[0], fiS=rowS.strName;   Str.push(`S ${fiS}`), nS++;
        for(var i=1;i<lA;i++) {
          var rowT=arrA[i], fiT=rowT.strName;
          if('strCat' in rowT) {debugger; return [Error("strCat already set")]}
          extend(rowT, {strCat:'copyOn1', strNameS:fiS})
          Str.push(`  T ${fiT}`);
          arrPairCopy.push([rowS, rowT])
        }
      }
    }
    extend(that, {arrPairCopy, Str, nS, nT:arrPairCopy.length})
    return that;
  },
  async copy(){
    var {strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrPairCopy}=this
    var [err, Id]=await copyLocally(fsTargetDir, arrPairCopy, strHostTarget);  if(err) {debugger; return [err];}
    if(Id.length!=arrPairCopy.length) {debugger; return [Error("Id.length!=arrPairCopy.length")]}
    var arrCouldNotCopy=[], n=arrPairCopy.length
    for(var i=0;i<n;i++){
      var [rowS, rowT]=arrPairCopy[i], {id:idRef}=rowT, id=Id[i];
      if(id=='couldNotCopy') {id=myUUID(); rowT.strErr='copyFailed'; arrCouldNotCopy.push(rowT);}
      extend(rowT, {id, idRef})
    }
    return [null, arrCouldNotCopy]
  }
}
var CopyOnTarget2={
  factory(arg){
    var that={}
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst

    var Fac=this, Key=Object.keys(Fac); Key=AMinusB(Key, ['factory']); copySome(that, Fac, Key)
    var Fac=CopyProt, Key=Object.keys(Fac); Key=AMinusB(Key, []); copySome(that, Fac, Key)
    var Fac=CopyOnProt, Key=Object.keys(Fac); Key=AMinusB(Key, []); copySome(that, Fac, Key)

    var Str=[], FsNew=[], FsTmp=[], arrPairCopy=[], nS=0, arrPairFinal=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {nCopyOn2, arrA, arrB}=objRel, lA=arrA.length, lB=arrB.length
        // var boCopyOn2=lenB>0 && lenA>lenB, nCopyOn2=boCopyOn2?lenA-lenB:0
      if(nCopyOn2) {
        var rowS=arrB[0], fiS=rowS.strName;   Str.push(`S ${fiS}`), nS++;
        for(var i=lB;i<lA;i++) {
          var rowT=arrA[i], fiT=rowT.strName;
          //var fiTmp=fiT+'_'+myUUID();
          var fiTmp=fiS+'_'+myUUID(); // Using fiS (instead of fiT) since it is certain to contain approved chars
          if('strCat' in rowT) {debugger; return [Error("strCat already set")]}
          extend(rowT, {strCat:'copyOn2', strNameS:fiS})
          Str.push(`  T ${fiT}`);
          var rowTTmp={strName:fiTmp, mtime_ns64:rowT.mtime_ns64};
          var fsNew=fsTargetDir+charF+fiT, fsTmp=fsTargetDir+charF+fiTmp;
          FsNew.push(fsNew); FsTmp.push(fsTmp); arrPairCopy.push([rowS, rowTTmp]); arrPairFinal.push([rowTTmp, rowT])
        }
      }
    }
    extend(that, {Str, FsNew, FsTmp, arrPairCopy, nS, nT:arrPairCopy.length, arrPairFinal}); 
    return that;
  },
  async copyToTemp(){
    var {strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrPairCopy, arrPairFinal}=this
    var [err, Id]=await copyLocally(fsTargetDir, arrPairCopy, strHostTarget);  if(err) {debugger; return [err];}
    if(Id.length!=arrPairCopy.length) {debugger; return [Error("Id.length!=arrPairCopy.length")]}
    var arrCouldNotCopy=[], n=arrPairCopy.length
    for(var i=0;i<n;i++){
      var [rowS, rowT]=arrPairFinal[i], {id:idRef}=rowT, id=Id[i];
      if(id=='couldNotCopy') {id=myUUID(); rowT.strErr='copyFailed'; arrCouldNotCopy.push(rowT);}
      extend(rowT, {id, idRef})
    }
    return [null, arrCouldNotCopy]
  },
  async renameToFinal(){
    var {strHostTarget, boRemote, fsSourceDir, fsTargetDir, FsNew, FsTmp}=this
    var len=FsTmp.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsTmp[i], fsNew=FsNew[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
  }
}


class MoveOnTargetProt{
  constructor(arg, boWhenMTimeIsMatching){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst
  }
  async renameToTemp(){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrRename, FsOld, FsNew, FsTmp}=this
    var len=FsOld.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsOld[i], fsNew=FsTmp[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
  }
  async renameToFinal(){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir, arrRename, FsOld, FsNew, FsTmp}=this
    var len=FsTmp.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsTmp[i], fsNew=FsNew[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
  }
}

class MoveOnTarget extends MoveOnTargetProt{
  constructor(arg){
    super(arg)
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst
    var arrRename=[], FsOld=[], FsNew=[], FsTmp=[]; //, FiNew=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {arrA, arrB, nExactName, lShortest}=objRel, lA=arrA.length, lB=arrB.length;
      for(var i=nExactName;i<lShortest;i++) {
        var rowN=arrA[i], rowO=arrB[i],  {strName:strNameNew, id:idRef}=rowN, strNameOld=rowO.strName; 
        if(rowO.mtime_ns64==rowN.mtime_ns64) {
          if('strCat' in rowN || 'strCat' in rowO) {debugger; return [Error("strCat already set")]}
          extend(rowN, {strCat:'moveOnTarget', strNameOld, id:rowO.id, idRef});
          extend(rowO, {strCat:'moveOnTarget', strNameNew})
          arrRename.push({rowN, rowO})
          var fsOld=fsTargetDir+charF+strNameOld, fsNew=fsTargetDir+charF+strNameNew, fsTmp=fsNew+'_'+myUUID();
          FsOld.push(fsOld); FsNew.push(fsNew); FsTmp.push(fsTmp); //FiNew.push(strNameNew)
        }
      }
    }
    extend(this, {arrRename, FsOld, FsNew, FsTmp}); //, FiNew
  }
  createFeedback(){
    var {arrRename}=this, nFile=arrRename.length, Str=Array(2*nFile);
    for(var k in arrRename){
      var {rowN, rowO}=arrRename[k];
      var {strName}=rowO;     Str[2*k]=`S   ${strName}`;
      var {strName}=rowN;   Str[2*k+1]=`  T ${strName}`;
    }
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}};
  }
}

class MoveOnTargetNSetMTime extends MoveOnTargetProt{
  constructor(arg){
    super(arg)
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst
    var arrRename=[], FsOld=[], FsNew=[], FsTmp=[]; //, FiNew=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {arrA, arrB, nExactName, lShortest}=objRel, lA=arrA.length, lB=arrB.length;
      for(var i=nExactName;i<lShortest;i++) {
        var rowN=arrA[i], rowO=arrB[i],  {strName:strNameNew, id:idRef}=rowN, strNameOld=rowO.strName;
        if(rowO.mtime_ns64!=rowN.mtime_ns64) {
          if('strCat' in rowN || 'strCat' in rowO) {debugger; return [Error("strCat already set")]}
          extend(rowN, {strCat:'moveOnTargetNSetMTime', strNameOld, id:rowO.id, idRef});
          extend(rowO, {strCat:'moveOnTargetNSetMTime', strNameNew, mtime_ns64New:rowN.mtime_ns64})
          arrRename.push({rowN, rowO})
          var fsOld=fsTargetDir+charF+strNameOld, fsNew=fsTargetDir+charF+strNameNew, fsTmp=fsNew+'_'+myUUID();
          FsOld.push(fsOld); FsNew.push(fsNew); FsTmp.push(fsTmp); //FiNew.push(strNameNew)
        }
      }
    }
    extend(this, {arrRename, FsOld, FsNew, FsTmp}); //, FiNew
  }
  createFeedback(){
    var {arrRename}=this, nFile=arrRename.length, Str=Array(2*nFile)
    for(var k in arrRename){
      var {rowN, rowO}=arrRename[k];
      var {strName, mtime_ns64}=rowO;   Str[2*k]=`S   ${mtime_ns64} ${strName}`;
      var {strName, mtime_ns64}=rowN;   Str[2*k+1]=`  T ${mtime_ns64} ${strName}`;
    }
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}};
  }
  async setMTime(){
    var {RelationHash, strHostTarget, fsTargetDir, arrRename}=this
    var arrFile=arrRename.map(obj=>obj.rowN)
    var [err]=await setMTime(arrFile, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}
  }
}

class CategorySetMTime{
  constructor(arg){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst

    var arrMTimeDiff=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {arrA, arrB, nExactName, nExactNameNMTime}=objRel, lA=arrA.length, lB=arrB.length;
      for(var i=nExactNameNMTime;i<nExactName;i++) {
        var rowN=arrA[i], rowO=arrB[i],  {mtime_ns64:mtime_ns64New, id:idRef}=rowN, mtime_ns64Old=rowO.mtime_ns64;
        if('strCat' in rowN || 'strCat' in rowO) {debugger; return [Error("strCat already set")]}
        extend(rowN, {strCat:'setMTime', mtime_ns64Old, id:rowO.id, idRef});
        extend(rowO, {strCat:'setMTime', mtime_ns64New})
        arrMTimeDiff.push({rowN, rowO});
      }
    }
    extend(this, {arrMTimeDiff})
  }
  createFeedback(){
    var {arrMTimeDiff}=this, nFile=arrMTimeDiff.length, Str=Array(nFile)
    for(var k in arrMTimeDiff){
      var {rowN, rowO}=arrMTimeDiff[k], {strName, mtime_ns64, mtime_ns64New}=rowO;
      Str[k]=`${mtime_ns64} ${mtime_ns64New} ${strName}`;
    }
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}};
  }
  async setMTime(){
    var {RelationHash, strHostTarget, fsTargetDir, arrMTimeDiff}=this
    var arrFile=arrMTimeDiff.map(obj=>obj.rowN)
    var [err]=await setMTime(arrFile, fsTargetDir, strHostTarget);  if(err) {debugger; return [err];}
  }
}

class CategoryUntouched{
  constructor(arg){
    var {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}); //charTRes, leafFilter, leafFilterFirst
    var arrUntouched=[]
    for(var key in RelationHash){
      var objRel=RelationHash[key], {arrA, arrB, nExactName, nExactNameNMTime}=objRel, lA=arrA.length, lB=arrB.length;
      for(var i=0;i<nExactNameNMTime;i++) {
        var rowN=arrA[i], rowO=arrB[i],  {id:idRef}=rowN;
        if('strCat' in rowN || 'strCat' in rowO) {debugger; return [Error("strCat already set")]}
        extend(rowN, {strCat:'untouched', id:rowO.id, idRef});
        extend(rowO, {strCat:'untouched'})
        arrUntouched.push({rowN, rowO});
      }
    }
    extend(this, {arrUntouched})
  }
  createFeedback(){
    var {arrUntouched}=this, nFile=arrUntouched.length, Str=Array(nFile)
    for(var k in arrUntouched){
      var {rowN, rowO}=arrUntouched[k], {strName}=rowO;
      Str[k]=`${strName}`;
    }
    var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=lStr?StrHov.join('\n'):undefined;
    return {Str, obj:{strHov, nFile}};
  }
}


var calcFlPrepend=function(fsPar, fsChild){
  fsPar=rtrim(fsPar, charF)
  fsChild=rtrim(fsChild, charF)
  var nPar=fsPar.length, nChild=fsChild.length;
  var fsChildCrop=fsChild.slice(0, nPar)
  if(fsPar!=fsChildCrop) throw Error('fsPar!=fsChildCrop')
  var flPrepend=fsChild.slice(nPar)+charF;
  flPrepend=ltrim(flPrepend, charF)
  return flPrepend
}

class SyncT2TUsingHash{
  constructor(arg){
    var {charTRes, leafFilter, leafFilterFirst}=arg
    copySome(this, arg, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "strHostTarget", "boRemote", "charFilterMethod"]);
    extend(this, {charTRes, leafFilter, leafFilterFirst})
  }
  async constructorPart2(){ // Must be awaited
    var {strHostTarget, boRemote, fiTargetDir}=this
    var [err, fsSourceDir]=await myRealPath(this.fiSourceDir); if(err) {debugger; return [err];}
    var [err, fsTargetDir]=await myRealPath(fiTargetDir, strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(this.fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}

    extend(this, {fsSourceDir, fsTargetDir, fsTargetDbDir})
    return [null]
  }
  
  async compare(){  //runOps
    var {charTRes, leafFilter, leafFilterFirst, fsSourceDir, fsTargetDir, fsTargetDbDir, strHostTarget, boRemote, charFilterMethod}=this
 
      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, boExist]=await fileExist(fsTargetDir, strHostTarget); if(err) {debugger; return [err]; }
    if(!boExist){var strExtra=strHostTarget?' on '+strHostTarget:'';  return [Error(`${fsTargetDir} does not exist${strExtra}`)];}

    if(1){ //boRemote
        // Load python-script to host
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
    
    var flPrepend=calcFlPrepend(fsTargetDbDir, fsTargetDir); extend(this, {flPrepend})


      // Parsing source tree
    var treeParser=new TreeParser()
    setMess(`Parsing source tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod, boRemote}
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    //removeLeafDbFromArrTreef(arrSourcef, settings.leafDb)
    var tStop=unixNow();   //myConsole.log(`Source parsed, elapsed time ${(tStop-tStart)}ms`)
    //arrSourcef.sort(funIncId)

      // Parsing target tree
    setMess(`Parsing target tree`, null, true);  
    var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsTargetDir, strHost:strHostTarget, boRemote, charFilterMethod}
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    //removeLeafDbFromArrTreef(arrTargetf, settings.leafDb); // Note! this arrTargetf is not used (so this line could be deleted)
    //arrTargetf.sort(funIncId)

    arrSourceF.sort(funIncStrName);   arrTargetF.sort(funIncStrName)
    var [err, arrSourceFUntouched, arrTargetFUntouched, arrSourceFRem, arrTargetFRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])
    var arrCreateF=arrSourceFRem, arrDeleteF=arrTargetFRem

    //arrCreateF.sort(funIncStrName) // So that root-most folders come before its children
    //arrDeleteF.sort(funDecStrName) // So that leaf-most folders come before its parents
    extend(this, {arrCreateF, arrDeleteF})

    //var arrSource=arrSourcef, arrTarget=arrTargetf
    //extend(this, {arrSource, arrTarget})

      // Parsing source db
    setMess(`Fetching source db`, null, true);  
    var [err, strData]=await readStrFileWHost(fsSourceDir+charF+settings.leafDb); if(err) return [err]
    setMess(`Parsing source db`, null, true); 
    var arrDbS=parseDb(strData, charTRes)
    arrDbS.sort(funIncStrName);   

      // Parsing target db
    setMess(`Fetching target db`, null, true);  
    var [err, strData]=await readStrFileWHost(fsTargetDbDir+charF+settings.leafDb, strHostTarget); if(err) return [err]
    setMess(`Parsing target db`, null, true);  
    var arrDbT=parseDb(strData, charTRes);
    arrDbT.sort(funIncStrName)
    var [arrDbTNonRelevant, arrDbTRelevant]=selectFrArrDb(arrDbT, flPrepend)
    var arrDbTOrg=arrDbT, arrDbT=arrDbTRelevant
    extend(this, {arrDbT, arrDbTNonRelevant})



      // Make sure the databases covers all files 
    var [err, arrSourcefM, arrDbSM, arrSourcefRem, arrDbSRem]=extractMatching(arrSourcef, arrDbS, ['strName'])
    if(arrSourcefRem.length>0) {debugger; return [Error("The source db doesn't cover all files, make sure to sync the db first.")];}
    var [err, arrTargetfM, arrDbTM, arrTargetfRem, arrDbTRem]=extractMatching(arrTargetf, arrDbT, ['strName'])
    if(arrTargetfRem.length>0) {debugger; return [Error("The target db doesn't cover all files, make sure to sync the db first.")];}

    var boIncLinks=0, arrLinks=[]
    if(!boIncLinks){
      arrDbSM=arrDbSM.filter(entry=>{
        var boLink=entry.strType=='l';
        if(boLink) arrLinks.push(entry)
        return !boLink
      })
    }

    var boCaseSensitive=1, arrCaseCollision=[];  // boAbortOnCaseCollision=1
    if(!boCaseSensitive){
      var nCollision=seperateOutCaseCollisions(arrDbSM)
      if(nCollision){debugger; return [Error(`Aborting since there are collision${pluralS(nCollision)} because of case (${nCollision}).`)]}
    }

    var arrSource=arrDbSM, arrTarget=arrDbTM
    extend(this, {arrSource, arrTarget})

      // Categorize by Hash
    setMess(`Categorize by Hash`, null, true);  
    arrSource.sort(funIncHash);   arrTarget.sort(funIncHash)
    var funHash=row=>row.strHash
    var [RelationHash]=categorizeByProp(arrSource, arrTarget, funHash)
    rearrangeByBestNameMatchArr(RelationHash); // This will add "nExactName" and "nExactNameNMTime" as a properties on each relation
    var Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(RelationHash);
    extend(this, {Mat1})

    var nExactTot=0
    for(var key in RelationHash){
      var objPat=RelationHash[key], {arrA, arrB, nExactName}=objPat, lA=arrA.length, lB=arrB.length, lShortest=Math.min(lA,lB);
      var boDelete=lB>lA, nDelete=boDelete?lB-lA:0 
      var boDeleteAll=lA==0, nDeleteAll=boDeleteAll?lB:0 
      var boDeleteSome=lA>0 && lB>lA, nDeleteSome=boDeleteSome?lB-lA:0 
      var boCopyTo=lB==0, nCopyOn1=boCopyTo?lA-1:0
      var boCopyOn2=lB>0 && lA>lB, nCopyOn2=boCopyOn2?lA-lB:0
      var nRename=lShortest-nExactName
      if(nRename<0) {debugger; return [Error('nRename<0')];}
      nExactTot+=nExactName
      extend(objPat, {nDelete, nDeleteAll, nDeleteSome, boCopyTo, nCopyOn1, nCopyOn2, lShortest, nRename})
    }

    var objArg={RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}
    var copyToTarget=CopyToTarget.factory(objArg)
    var categoryDelete=new CategoryDelete(objArg)
    var copyOnTarget1=CopyOnTarget1.factory(objArg)
    var copyOnTarget2=CopyOnTarget2.factory(objArg)
    var moveOnTarget=new MoveOnTarget(objArg)
    var moveOnTargetNSetMTime=new MoveOnTargetNSetMTime(objArg)
    var categorySetMTime=new CategorySetMTime(objArg);
    var categoryUntouched=new CategoryUntouched(objArg);
    
    
    
    extend(this, {copyToTarget, categoryDelete, copyOnTarget1, copyOnTarget2, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, nExactTot})

    return [null]
  }

  format(fiDb){ //fsDir, 
    var {Mat1, Mat2, Mat3}=this
    //var myResultWriter=new MyResultWriter(StrStemT2T)
    var myResultWriter=new MyWriter(PathT2T)

    Mat1.ShortList=[]
    var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    //var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat1.ArrA[i][j]);
      var ArrBMult=[].concat(Mat1.ArrB[i][j])
      //setBestNameMatchFirst(ArrAMult, ArrBMult)
        // Sort by size
      var funVal=(a,b)=>b[0].size-a[0].size; // Dec
      //var funVal=(a,b)=>a[0].size-b[0].size; // Inc
      if(i && j){
        ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
        var ArrAtmp=ArrAMult.toSorted(funVal)
        var Ind=ArrAtmp.map(entry=>entry.ind),  ArrBtmp=eInd(ArrBMult, Ind)
      }else if(i){
        var ArrAtmp=ArrAMult.toSorted(funVal), ArrBtmp=ArrBMult
      }else{
        var ArrBtmp=ArrBMult.toSorted(funVal), ArrAtmp=ArrAMult
      }
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["STMatch1_"+i+j]=StrDuplicateM
      var StrT=StrDuplicateM.slice(0,nShortListMax);
      if(StrDuplicateM.length>nShortListMax) StrT.push('⋮')
      var strTmp=StrT.length?StrT.join('\n'):undefined;
      Mat1.ShortList[`${i}${j}`]=strTmp
    }

    var Key=['copyToTarget', 'categoryDelete', 'copyOnTarget1', 'copyOnTarget2', 'moveOnTarget', 'moveOnTargetNSetMTime', 'categorySetMTime']
    var StrHov={}, objN={}, ObjFeedback={}
    var boAny=false
    for(var key of Key){
      var action=this[key];
      var objA=action.createFeedback();
      //var {Str, strHov, N}=objA
      var {Str, obj:objFeedback}=objA
      myResultWriter.Str[key]=Str;
      // StrHov['strHov'+ucfirst(key)]=strHov
      // objN['N'+ucfirst(key)]=N
      ObjFeedback['obj'+ucfirst(key)]=objFeedback
      var {strHov, nFile, nS, nT}=objFeedback
      var n=nFile??nT
      boAny||=Boolean(n)
    }
    var boChanged=boAny
    extend(this, {myResultWriter, ObjFeedback, boChanged}); //StrHov, objN
  }


  makeConfirmMess(){
    var {objN, arrDeleteF, arrCreateF}=this;
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    var {NCopyToTarget, NCategoryDelete, NCopyOnTarget1, NCopyOnTarget2, NMoveOnTarget, NCategorySetMTime}=objN
    var [nDelete]=NCategoryDelete
    var [nCopyToTarget]=NCopyToTarget
    var [nRename]=NMoveOnTarget
    var [nS1, nT1]=NCopyOnTarget1
    var [nS2, nT2]=NCopyOnTarget2;
    var nT=nT1+nT2
    var strMess=`Renaming: ${nRename} file${pluralS(nRename)}
Deleting: ${nDelete} file${pluralS(nDelete)} (and ${nDeleteF} folder${pluralS(nDeleteF)})
Creating: ${nCreateF} folder${pluralS(nCreateF)}
CopyToTarget: ${nCopyToTarget} file${pluralS(nCopyToTarget)} 
CopyOnTarget: ${nT} file${pluralS(nT)}`
    return strMess
  }

  async writeToFile(){
    var {myResultWriter}=this
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    return [null];
  }

  async makeChanges(){
    var {charTRes, leafFilter, leafFilterFirst, copyToTarget, categoryDelete, copyOnTarget1, copyOnTarget2, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, arrDbS, arrDbTNonRelevant, fsSourceDir, fsTargetDir, fsTargetDbDir, flPrepend, arrSource, strHostTarget, boRemote, charFilterMethod}=this;
    var [err]=await this.createFolders(); if(err) {debugger; return [err];}
  
    await categoryDelete.delete();
    myConsole.printNL(`copyOnTarget2.copyToTemp ...`)
    await copyOnTarget2.copyToTemp(); // 
    myConsole.printNL(`moveOnTarget.renameToTemp ...`)
    await moveOnTarget.renameToTemp();  
    myConsole.printNL(`moveOnTargetNSetMTime.renameToTemp ...`)
    await moveOnTargetNSetMTime.renameToTemp();  
       // By this point, the old names (that might be reused), have been cleared.

    myConsole.printNL(`copyToTarget.copy ...`)
    var [err]=await copyToTarget.copy(); if(err) {debugger; return [err];}

    myConsole.printNL(`copyOnTarget2.renameToFinal ...`)
    await copyOnTarget2.renameToFinal();
    myConsole.printNL(`moveOnTarget.renameToFinal ...`)
    await moveOnTarget.renameToFinal()
    myConsole.printNL(`moveOnTargetNSetMTime.renameToFinal ...`)
    await moveOnTargetNSetMTime.renameToFinal()
    //await copyToTarget.renameToFinal(); // Renames to final name
    myConsole.printNL(`copyOnTarget1.copy ...`)
    await copyOnTarget1.copy()
    myConsole.printNL(`moveOnTargetNSetMTime.setMTime ...`)
    await moveOnTargetNSetMTime.setMTime()
    myConsole.printNL(`categorySetMTime.setMTime ...`)
    await categorySetMTime.setMTime()

    myConsole.printNL(`deleteFolders ...`)
    var [err]=await this.deleteFolders(); if(err) {debugger; return [err];}

    myConsole.printNL(`copyToTarget.getId ...`)
    await copyToTarget.getId(); 
    // await copyOnTarget1.getId(); 
    // await copyOnTarget2.getId(); 

    // setMess(`Parsing target tree`, null, true)
    // var treeParser=new TreeParser()
    // var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsTargetDir, strHost:strHostTarget, boRemote, charFilterMethod}
    // var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    // removeLeafDbFromArrTreef(arrTargetf, settings.leafDb)
    // var arrTarget=arrTargetf

      // Categorize by strName
    arrSource.sort(funIncStrName);
    // arrTarget.sort(funIncStrName)

    //   // Extract untouched files
    // var [err, arrSourceUntouched, arrTargetUntouched, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) return [err];
    // if(arrSourceTouched.length || arrTargetTouched.length) {debugger; return [Error('arrSourceTouched.length || arrTargetTouched.length')];}
    
    // for(var i=0;i<arrSourceUntouched.length;i++){
    //   var rS=arrSourceUntouched[i], rT=arrTargetUntouched[i]
    //   rT.strHash=rS.strHash
    // }
    
    // if(flPrepend.length>0){
    //   for(var row of arrTargetUntouched) row.strName=flPrepend+row.strName
    // }
    // var arrDbTNew=arrTargetUntouched.concat(arrDbTNonRelevant)

    if(flPrepend.length>0){
      for(var row of arrSource) row.strName=flPrepend+row.strName
    }
    var arrDbTNew=arrSource.concat(arrDbTNonRelevant)

    arrDbTNew.sort(funIncStrName)
    var strData=formatDb(arrDbTNew)
    myConsole.printNL(`writeFileRemote ...`)
    var [err]=await writeFileRemote(fsTargetDbDir+charF+settings.leafDb, strData, strHostTarget); if(err) {debugger; return [err];}
    return [null]
  }
  
  async createFolders(){
    var {arrCreateF, fsTargetDir, strHostTarget, boRemote}=this;
    var StrTmp=arrCreateF.map(row=>fsTargetDir+charF+row.strName)
    var [err]=await myMkFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
  async deleteFolders(){
    var {arrDeleteF, fsTargetDir, strHostTarget, boRemote}=this;
    var StrTmp=arrDeleteF.map(row=>fsTargetDir+charF+row.strName)
    StrTmp.sort().reverse()
    var [err]=await myRmFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}





var parseNDump=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, charFilterMethod}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  setMess(`Parsing tree`, null, true)
  var treeParser=new TreeParser()
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  var Str=arrTreef.map(row=>row.strName)

  var fsTmp=PathLoose.parseNDump[charFilterMethod].fsName;
  if(Str.length) Str.push('') // End the last line with a newline
  var strOut=Str.join('\n')
  var [err]=await writeFile(fsTmp, strOut); if(err) {debugger; return [err];}
  return [null]
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
  // var StrEmpty=[], str=Str[0], l=str.length, boF=str[l-1]==charF
  // for(var i=1;i<Str.length;i++){
  //   var strNext=Str[i], lNext=strNext.length;
  //   var boFNext=strNext[lNext-1]==charF
  //   if(boF && boFNext) {StrEmpty.push(str);}
  //   boF=boFNext; str=strNext
  // }

  var StrEmpty=[];
  for(var i=0;i<Str.length-1;i++){
    var str=Str[i], l=str.length, lm1=l-1, boF=str[lm1]==charF
    if(boF){
      var strNext=Str[i+1];
      var boDirMatch=str.slice(0, lm1)==strNext.slice(0, lm1)
      if(!boDirMatch) StrEmpty.push(str);
    }
  }
  var str=Str[Str.length-1], l=str.length, lm1=l-1, boF=str[lm1]==charF
  if(boF) StrEmpty.push(str);
  var nEmpty=StrEmpty.length

  var fsTmp=PathLoose.emptyFolders.fsName;
  if(StrEmpty.length) StrEmpty.push('') // End the last line with a newline
  var strOut=StrEmpty.join('\n')
  var [err]=await writeFile(fsTmp, strOut); if(err) {debugger; return [err];}
  return [null, nEmpty]
}


var checkViaPython=async function(arg){
  var {fiDir='.', fiDb, charTRes, iStart=0, myConsole, strHost, boRemote}=arg


  var arrCommand=[];
  if(boRemote) {
    if(strOS=='win32') {debugger; return [Error('On windows only local access is allowed')];}
    var arrCommand=['ssh', strHost, 'python', interfacePython.fsScriptRemote]
  }else{
    var arrCommand=['python', interfacePython.fsScriptLocal]
  }
  arrCommand.push('check', '--fiDir', fiDir, '--charTRes', charTRes);
  
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

// var compareT2DSMOnly=async function(arg){
//   var {fiDir, flPrepend, charTRes=settings.charTRes, leafFilter, charFilterMethod}=arg
//   var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
//   var fsDb=fsDir+charF+settings.leafDb

//     // Parse tree
//   var treeParser=new TreeParser()
//   setMess(`Parsing tree`, null, true
//   var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir, charFilterMethod}
//   var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
//   removeLeafDbFromArrTreef(arrTreef, settings.leafDb)
//     // Parse fsDb
//    var [err, strData]=await readStrFile(fsDb); if(err) return [err]
//   if(err){
//     if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
//     else{debugger; return [err];}
//   }
//   var arrDb=parseDb(strData, charTRes)

//   var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
//   var arrDbOrg=arrDb, arrDb=arrDbRelevant


//   var myResultWriter=new MyResultWriter(StrStemT2T)
//   var myResultWriter=new MyWriter(PathT2T)
//   var comparisonWOID=new ComparisonWOID(arrTreef, arrDb, myResultWriter)
//   var [err]=comparisonWOID.runOps(); if(err) {debugger; return [err];}
//   comparisonWOID.format(fsDb) //fsDir, 
//   var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
//   var strSeeMore=myResultWriter.getSeeMoreMessage()
//   myConsole.log(myResultWriter.Str['screen'].concat(strSeeMore).join('\n'))
//   return [null];
// }






/*********************************************************************
 * moveMeta
 *********************************************************************/
var moveMeta=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, flPrepend, fiDbS, fiDirT, fiDbOther, charFilterMethod}=arg

  debugger

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(fiDbS); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbS); if(err) return [err]
  var arrDbS=parseDb(strData, charTRes);

    // Parse fiDbOther
  var [err, fsDbOther]=await myRealPath(fiDbOther); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbOther);
  if(err){
    if(err.code==STR_ENOENT){err=null; strData=""} //STR_NE_FS_FILRDER
    else{debugger; return [err];}
  }
  var arrDbOther=parseDb(strData, charTRes)

    // Parse tree
  var [err, fsDir]=await myRealPath(fiDirT); if(err) {debugger; return [err];}
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  var [arrDbOtherNonRelevant, arrDbOtherRelevant] =selectFrArrDb(arrDbOther, flPrepend)
  var arrDbOtherOrg=arrDbOther,   arrDbOther=arrDbOtherRelevant

  // var [arrTreefNonRelevant, arrTreefRelevant] =selectFrArrDb(arrTreef, flPrepend)
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
  if(flPrepend.length>0){
    for(var row of arrDbOtherNew) row.strName=flPrepend+row.strName
  }

  arrDbOtherNew=arrDbOtherNonRelevant+arrDbOtherNew
  arrDbOtherNew.sort(funIncStrName)
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbOtherNew.length} entries to db-file.`;
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeDbFile(arrDbOtherNew, fsDbOther); if(err) {debugger; return [err];}

  return [null];
}


/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(arg){
  var {leafFilter, leafFilterFirst, charFilterMethod}=arg
  var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; return [err];}
  var {fiSourceDir}=result
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var arg={fsDir:fsSourceDir, charTRes, leafFilter, leafFilterFirst}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(arg); if(err) {debugger; return [err];}

  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  arrSourcef.sort(funIncStrName)
  arrSourceF.sort(funIncStrName)
  arrRsf.sort(funIncStrName)
  arrRsF.sort(funIncStrName)
  var nRsf=arrRsf.length, nRsF=arrRsF.length
  var nf=arrSourcef.length, nF=arrSourceF.length
  var leafResult='resultFrTestFilter.txt'
  var StrOut=[]
  for(var row of arrSourcef) StrOut.push(row.strName)
  for(var row of arrSourceF) StrOut.push(row.strName)
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



var convertHashcodeFileToDb=async function(arg){  // Add id and create uuid
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiDir, fiHash, charFilterMethod}=arg
  debugger

    // Parse tree
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
      // boUseFilter should perhaps be false (although it might be slow)
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  
    // Parse fiHash
  var [err, fsHash]=await myRealPath(fiHash); if(err) {debugger; return [err];}
  var [err, arrDb]=await parseHashFile(fsHash); if(err) {debugger; return [err];}

    // fiDb
  var fsDb=fsDir+charF+settings.leafDb
  //var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; return [err];}


  arrTreef.sort(funIncStrName);   arrDb.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbMatch, arrTreeRem, arrDbRem]=extractMatching(arrTreef, arrDb, ['strName'], ['strName'])

  //if(arrTreeRem.length || arrDbRem.length) return "Error: "+"arrTreeRem.length OR arrDbRem.length"
  if(arrTreeRem.length) {var err=Error("Error: "+"arrTreeRem.length"); debugger; return [err];}  

  for(var i in arrDbMatch){
    //if(!("uuid" in rowDb)) rowDb.uuid=myUUID() // Add uuid if it doesn't exist
    var rowDb=arrDbMatch[i]
    var row=arrTreeMatch[i]
    rowDb.id=row.id // Copy id
  }

  var arrDbNew=arrDbMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to db-file.`;
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; return [err];}
  setMess('convertHashcodeFileToDb: Done');
  return [null];
}



var convertDbFileToHashcodeFile=async function(arg){ // Add id and create uuid
  var {fsDir, fiHash}=arg
  debugger

    // Parse fiDb
  var fsDb=fsDir+charF+settings.leafDb
  //var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);

    // Parse fiHash
  var [err, fsHash]=await myRealPath(fiHash); if(err) {debugger; return [err];}

  var arrDbNew=arrDb
  
  //if(boDryRun) {print("(Dry run) exiting"); return [null];}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to hash-file.`;
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeHashFile(arrDbNew, fsHash)
  setMess('convertDbFileToHashcodeFile: Done')
  return [null];
}





var sortHashcodeFile=async function(){
  var {fiHash}=arg

    // Parse fiHash
  var [err, fsHash]=await myRealPath(fiHash); if(err) {debugger; return [err];}
  var [err, arrDb]=await parseHashFile(fsHash); if(err) {debugger; return [err];}

  arrDb.sort(funIncStrName)

  var [err]=await writeHashFile(arrDb, fsHash); if(err) {debugger; return [err];}
  setMess('sortHashcodeFile: Done')
  return [null];
}


var changeIno=async function(arg){
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiDir, flPrepend, charFilterMethod}=arg
  debugger
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var leafDb=settings.fiDb
  var fsDb=fsDir+charF+settings.leafDb

    // Parse tree
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);

  var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, flPrepend)
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
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; return [err];}

  setMess('changeIno: Done');
  return [null];
}

var utilityMatchTreeAndDbFile=async function(arg){ // For running different experiments 
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, flPrepend, fiDir, charFilterMethod}=arg
  debugger
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var leafDb=settings.fiDb
  var fsDb=fsDir+charF+settings.leafDb

    // Parse tree
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);

  var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, flPrepend)
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
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; return [err];}

  setMess('utilityMatchTreeAndDbFile: Done');
  return [null];
}


var utilityMatchDbFileAndDbFile=async function(){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst, fiDbS, fiDbT, flPrepend}=arg
  debugger

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(fiDbS); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbS); if(err) return [err]
  var arrDbS=parseDb(strData, charTRes);

    // Parse fiDbT
  var [err, fsDbT]=await myRealPath(fiDbT); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbT); if(err) return [err]
  var arrDbT=parseDb(strData, charTRes);

  var [arrDbTNonRelevant, arrDbTRelevant] =selectFrArrDb(arrDbT, flPrepend)
  var arrDbTOrg=arrDbT,   arrDbT=arrDbTRelevant


  arrDbS.sort(funIncStrName);   arrDbT.sort(funIncStrName)
  var [err, arrDbSMatch, arrDbTMatch, arrDbSRem, arrDbTRem]=extractMatching(arrDbS, arrDbT, ['strName'])

    // Move uuid to arrDbMatch
  // for(var i in arrDbSMatch){
  //   var row=arrDbSMatch[i]
  //   rowT=arrDbTMatch[i]
  //   rowT.uuid=row.uuid
  // }

  for(var row of arrDbT){
    row.strName=flPrepend+row.strName
  }

  var arrDbNew=arrDbTNonRelevant.concat(arrDbTMatch, arrDbTRem)
  
  //if(boDryRun) {print("(Dry run) exiting"); return [null];}
  if(boAskBeforeWrite){
    var strMess=`Writing ${arrDbNew.length} entries to db-file.`;
    //var boOK=confirm(strMess);
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var [err]=await writeDbFile(arrDbNew, fsDbT); if(err) {debugger; return [err];}

  setMess('utilityMatchDbFileAndDbFile: Done')
  return [null];
}

var replacePrefix=async function(arg){  // For running different experiments 
  var {charTRes=settings.charTRes, fiDb, strOldPrefix, strNewPrefix}=arg
  if(strOldPrefix==strNewPrefix) {setMess('replacePrefix: strOldPrefix==strNewPrefix, Nothing to do.'); return [null]}

    // Parse fiDbS
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);
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
  var [err]=await writeDbFile(arrDb, fsDb); if(err) {debugger; return [err];}

  setMess('replacePrefix: Done');
  return [null]
}


var utilityT2T=async function(arg){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, fiTargetDir, fiTargetDbDir, charFilterMethod}=arg

  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var [err, fsTargetDir]=await myRealPath(fiTargetDir); if(err) {debugger; return [err];}
  var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir); if(err) {debugger; return [err];}
  var treeParser=new TreeParser()
  setMess(`Parsing source tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
  setMess(`Parsing target tree`, null, true)
  var arg={charTRes, fsDir:fsTargetDir}
  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

    // Extract untouched files  // nm
  arrSourcef.sort(funIncStrName);   arrTargetf.sort(funIncStrName)
  var [err, arrSourceUntouched, arrTargetUntouched, arrSourceTouched, arrTargetTouched]=extractMatching(arrSourcef, arrTargetf, ['strName', 'sm']); if(err) return [err];   

  var boChanged=Boolean(arrSourceTouched.length)||Boolean(arrTargetTouched.length)
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
      var arrCommand=['touch', '-mr', fsTargetDir+charF+rT.strName, fsSourceDir+charF+rS.strName];
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; } 
    } 
  }
  for(var i=0; i<arrS.length; i++ ){
    var rS=arrS[i], rT=arrT[i]
    var tS=rS.mtime_ns64, tT=rT.mtime_ns64
    var d=tT-tS
    if(d<0){ 
      var arrCommand=['touch', '-mr', fsSourceDir+charF+rS.strName, fsTargetDir+charF+rT.strName];
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