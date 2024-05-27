
"use strict"





var summarizeHLInfo=function(arrA){
  var objMult={}, nMult=0
  var objEntryByKey=bucketifyByKey(arrA, "id");
  for(var k in objEntryByKey) { var arr=objEntryByKey[k]; if(arr.length>1) {objMult[k]=arr; nMult+=arr.length;} }
  var nMultId=Object.keys(objMult).length;
  var nId=Object.keys(objEntryByKey).length
  return [nId, nMultId, nMult, objMult]
}

//var hardLinkCheck=async function(fiDirSource, charTRes, leafFilterFirst=settings.leafFilter){
var hardLinkCheck=async function(args){
  var {fiDirSource, charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  var myResultWriter=new MyResultWriter(StrStemT2D)

  arrTreef.sort(funIncId);   arrTreeF.sort(funIncId);
  var [nIdf, nMultIdf, nMultf, objTreefDup]=summarizeHLInfo(arrTreef)
  var [nIdF, nMultIdF, nMultF, objTreeFDup]=summarizeHLInfo(arrTreeF)
  var objArg={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length}

  var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
  var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
  var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
  //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
  myResultWriter.Str['T2D_HL']=myResultWriter.Str['T2D_HL'].concat(StrTmpF, StrTmpf)
  myResultWriter.writeToFile()
  var strSeeMore=myResultWriter.getSeeMoreMessage()
  myConsole.log(StrSum.concat(strSeeMore).join('\n'))

}


/****************************************************************************************
 * T2D
 ****************************************************************************************/

class SyncTreeToDb{
  constructor(args){
    var {leafDb=settings.leafDb, charTRes=settings.charTRes, flPrepend=""}=args
    copySome(this, args, ["fsDirSource", "leafFilterFirst"]);
    extend(this, {leafDb, charTRes, flPrepend})
    this.fsDb=this.fsDirSource+charF+this.leafDb
  }

  async compare(){
    var {fsDirSource, charTRes, leafFilterFirst, leafDb, fsDb, flPrepend}=this

      // Parse tree
    var treeParser=new TreeParser()
    var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {return [err];}
    removeLeafDbFromArrTreef(arrTreef, leafDb)

      // Parsing fsDb (database)
    var [err, arrDb]=await parseDb(fsDb, charTRes)
    if(err){
      if(err.code==STR_ENOENT){err=null; arrDb=[]}  //STR_NE_FS_FILRDER
      else{ return [err]}
    }
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    this.arrDb=arrDb;   this.arrDbNonRelevant=arrDbNonRelevant

    var myResultWriter=new MyResultWriter(StrStemT2D)


        // Checking for hard links

      // Count duplicate ids in tree
    var [nIdf, nMultIdf, nMultf, objTreefDup]=summarizeHLInfo(arrTreef)
    var [nIdF, nMultIdF, nMultF, objTreeFDup]=summarizeHLInfo(arrTreeF)

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    var [nIdDb, nMultIdDb, nMultDb, objDbDup]=summarizeHLInfo(arrDb)

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str['T2D_HL']=myResultWriter.Str['T2D_HL'].concat(StrTmpF, StrTmpf)
      myResultWriter.writeToFile()
      return [null];
    }

        // Mult 1 (Multiple SM in all files)
 
    arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
    var funSM=row=>row.sm
    var [objTreeM, objDbM]=unTangleManyToManyF(arrTreef, arrDb, funSM)
    var Mat1=this.Mat1=new Mat()
    Mat1.assignFromObjManyToMany(objTreeM, objDbM);
    Mat1.setMTMLabel()

    // var ArrAMult=[].concat(Mat1.ArrA[1][2],Mat1.ArrA[2][1],Mat1.ArrA[2][2]);
    // var ArrBMult=[].concat(Mat1.ArrB[1][2],Mat1.ArrB[2][1],Mat1.ArrB[2][2])
    // setBestNameMatchFirst(ArrAMult, ArrBMult)
    //   // Sort by size
    // ArrAMult.forEach((el, i)=>el.ind=i); // Set index
    // //var funInc=(a,b)=>a[0].size-b[0].size;
    // var funDec=(a,b)=>b[0].size-a[0].size;
    // var ArrAtmp=ArrAMult.toSorted(funDec)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrBMult, Ind)
    // var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
    // myResultWriter.Str["T2D_STMatch1"]=StrDuplicateM


    //var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat1.ArrA[i][j]);
      var ArrBMult=[].concat(Mat1.ArrB[i][j]);
      //setBestNameMatchFirst(ArrAMult, ArrBMult)
        // Sort by size
      ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
      //var funInc=(a,b)=>a[0].size-b[0].size;
      var funDec=(a,b)=>b[0].size-a[0].size;
      var ArrAtmp=ArrAMult.toSorted(funDec)
        // Create Ind
      var Ind=ArrAtmp.map(entry=>entry.ind)
      var ArrBtmp=eInd(ArrBMult, Ind)
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["T2D_STMatch1_"+i+j]=StrDuplicateM
    }


    var ArrBMult=[].concat(Mat1.ArrB[0][2]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrBtmp=ArrBMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrBtmp, 'T');
    myResultWriter.Str["T2D_STMatch1_02"]=StrDuplicateM

    var ArrAMult=[].concat(Mat1.ArrA[2][0]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrAtmp=ArrAMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrAtmp, 'S');
    myResultWriter.Str["T2D_STMatch1_20"]=StrDuplicateM

        // Categorize files

    var arrSource=arrTreef, arrTarget=arrDb
      // Extract untouched, inm
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrSourceUntouched, arrTargetUntouched, arrSourceRem, arrTargetRem]=extractMatching(arrSource, arrTarget, ['strName', 'id', 'sm']); if(err) return [err];
    //extend(this, {arrSourceUntouched})
    var boChanged=this.boChanged=Boolean(arrSourceRem.length)||Boolean(arrTargetRem.length)
    //var boNothingToDo=arrSourceRem.length==0

      // Extract renamed (MetaMatch), i_m
    arrSourceRem.sort(funIncId);   arrTargetRem.sort(funIncId);
    var [err, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['id', 'sm']); if(err) return [err];

      // Extract Defragged (NSM) (file-copied-then-renamed-to-origin), _nm
    arrSourceRem.sort(funIncStrName);   arrTargetRem.sort(funIncStrName)
    var [err, arrSourceNSM, arrTargetNSM, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ["strName", 'sm']); if(err) return [err];

      // Extract changed, in_
    var [err, arrSourceChanged, arrTargetChanged, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName', 'id']); if(err) return [err];

      // Extract reusedName, _n_
    var [err, arrSourceReusedName, arrTargetReusedName, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName']); if(err) return [err];

      // Extract reusedId (MatchingId), i__
    arrSourceRem.sort(funIncId);   arrTargetRem.sort(funIncId)
    var [err, arrSourceReusedId, arrTargetReusedId, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['id']); if(err) return [err];


      // Matching SM (Copy)
    arrSourceRem.sort(funIncSM);   arrTargetRem.sort(funIncSM);
    var [objSourceMetaMatch, objTargetMetaMatch]=unTangleManyToManyF(arrSourceRem, arrTargetRem, row=>row.sm)
    var Mat2=this.Mat2=new Mat()
    Mat2.assignFromObjManyToMany(objSourceMetaMatch, objTargetMetaMatch);
    var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
    var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
    var arrSource1T1NoName=[].concat(Mat2.arrA[1][1]);
    var arrTarget1T1NoName=[].concat(Mat2.arrB[1][1]);
    var ArrSourceMultNoName=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMultNoName=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
    var arrSourceMultNoName=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrTargetMultNoName=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
    // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
    //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭
  
    extend(this, {arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, arrSourceMultNoName, arrTargetMultNoName, ArrSourceMultNoName, ArrTargetMultNoName})

    //if(boNothingToDo) return [null]

      // Writing UntouchedWOExactMTime
    var arrO=[]
    for(var i=0;i<arrSourceUntouched.length;i++){
      var rowS=arrSourceUntouched[i], rowT=arrTargetUntouched[i]
      if(rowS.mtime_ns64!=rowT.mtime_ns64) arrO.push(`${rowS.id} ${rowS.mtime_ns64}`)
    }
    myResultWriter.Str["T2D_untouchedWOExactMTime"]=arrO;
      
      // Writing to category files

      // Renamed i_m
    myResultWriter.Str["T2D_renamed"]=formatRename1T1(arrSourceMetaMatch, arrTargetMetaMatch)

    //myResultWriter.Str["T2D_renamed"]=Category1T1.format(arrSourceMetaMatch, arrTargetMetaMatch)
    myResultWriter.Str["T2D_copiedThenRenamedToOrigin"]=CategoryT2DNSM.format(arrSourceNSM, arrTargetNSM)
    myResultWriter.Str["T2D_changed"]=CategoryT2DChanged.format(arrSourceChanged, arrTargetChanged)
    myResultWriter.Str["T2D_reusedName"]=CategoryT2DReusedName.format(arrSourceReusedName, arrTargetReusedName)
    myResultWriter.Str["T2D_reusedId"]=CategoryT2DReusedId.format(arrSourceReusedId, arrTargetReusedId)

      // Created
    var StrTmp=[]
    for(var row of arrCreate) StrTmp.push(`${row.strType} ${row.id} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str["T2D_created"]=StrTmp

      // Deleted
    var StrTmp=[]
    for(var row of arrDelete) StrTmp.push(`${row.strType} ${row.id} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str["T2D_deleted"]=StrTmp

      // 1T1NoName
    //var [arrSource1To1NoName, arrTarget1To1NoName, objSourceRem2, objTargetRem2]=extract1To1(objSourceMetaMatch, objTargetMetaMatch)
    myResultWriter.Str["T2D_1T1NoName"]=CategoryT2D1T1NoName.format(arrSource1T1NoName, arrTarget1T1NoName)


      // MultNoName
    setBestNameMatchFirst(ArrSourceMultNoName, ArrTargetMultNoName)

    //   // Sort by size
    // ArrSourceMultNoName.forEach((el, i)=>el.ind=i); // Set index
    // var funInc=(a,b)=>a[0].size-b[0].size;
    // var ArrAtmp=[...ArrSourceMultNoName].sort(funInc)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrTargetMultNoName, Ind)
    myResultWriter.Str["T2D_STMatch2"]=formatMatchingDataWMult(ArrSourceMultNoName, ArrTargetMultNoName); 

    myResultWriter.Str["T2D_HL"]=[]

    await myResultWriter.writeToFile()


      // Values for screen
    var nChanged=arrSourceChanged.length, nMetaMatch=arrSourceMetaMatch.length, nNSM=arrSourceNSM.length, nReusedName=arrSourceReusedName.length, nReusedId=arrSourceReusedId.length, nCreate=arrCreate.length, nDelete=arrDelete.length,    nSource=arrSource.length, nTarget=arrTarget.length, nUntouched=arrSourceUntouched.length,    n1T1NoName=arrSource1T1NoName.length, nSourceMultNoName=arrSourceMultNoName.length, nTargetMultNoName=arrTargetMultNoName.length

    var objArgForScreen={nChanged, nMetaMatch, nNSM, nReusedName, nReusedId, nCreate, nDelete,   nSource, nTarget, nUntouched,   n1T1NoName, nSourceMultNoName, nTargetMultNoName}
    extend(this,objArgForScreen) 

    return [null];
  }



  async readAction(){ //leafDb
    var {fsDb, charTRes, flPrepend}=this


      // Parsing fsDb (database)
    var [err, arrDb]=await parseDb(fsDb, charTRes)
    if(err){
      if(err.code==STR_ENOENT){err=null; arrDb=[]} //STR_NE_FS_FILRDER
      else{ return [err]}
    }
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

      // Created/Deleted
    var [err, arrUntouchedWOExactMTime]=await parseSSV(FsFile["T2D_untouchedWOExactMTime"], ['id', 'mtime_ns64']); if(err) {debugger; return [err];}

    var fSetMTime=row=>{row.mtime_ns64==BigInt(row.strMTime); row.mtime_ns64R==BigInt(row.strMTimeR)}
    var funForRenamed=row=>{
      if(row.strMTime=="NaN") row.strMTime=row.strMTimeR;
      row.mtime_ns64=BigInt(row.strMTime); row.mtime_ns64R=BigInt(row.strMTimeR);
    }

    var [err, strData] = await readStrFile(FsFile["T2D_renamed"]); if(err) return [err]
    var [err, arrTargetMetaMatch, arrSourceMetaMatch]=parseMatchingPairWHead(strData); if(err) return [err]
    arrTargetMetaMatch.forEach(funForRenamed); arrSourceMetaMatch.forEach(funForRenamed)
    //arrTargetMetaMatch.forEach(fSetMTime); arrSourceMetaMatch.forEach(fSetMTime)

    var [err, strData] = await readStrFile(FsFile["T2D_copiedThenRenamedToOrigin"]); if(err) return [err]
    var [err, arrTargetNSM, arrSourceNSM]=parseMatchingPairWHead(strData);if(err) return [err]
    //arrTargetNSM.forEach(fSetMTime); arrSourceNSM.forEach(fSetMTime)

    var [err, strData] = await readStrFile(FsFile["T2D_changed"]); if(err) return [err]
    var [err, arrTargetChanged, arrSourceChanged]=parseMatchingPairWHead(strData); if(err) return [err]
    //arrTargetChanged.forEach(fSetMTime); arrSourceChanged.forEach(fSetMTime)

    var [err, strData] = await readStrFile(FsFile["T2D_reusedName"]); if(err) return [err]
    var [err, arrTargetReusedName, arrSourceReusedName]=parseMatchingPairWHead(strData); if(err) return [err]
    //arrTargetReusedName.forEach(fSetMTime); arrSourceReusedName.forEach(fSetMTime)

    var [err, strData] = await readStrFile(FsFile["T2D_reusedId"]); if(err) return [err]
    var [err, arrTargetReusedId, arrSourceReusedId]=parseMatchingPairWHead(strData); if(err) return [err]
    //arrTargetReusedId.forEach(fSetMTime); arrSourceReusedId.forEach(fSetMTime)

    var [err, strData] = await readStrFile(FsFile["T2D_1T1NoName"]); if(err) return [err]
    var [err, arrTarget1T1NoName, arrSource1T1NoName]=parseMatchingPairWHead(strData); if(err) return [err]
    arrTarget1T1NoName.forEach(funForRenamed); arrSource1T1NoName.forEach(funForRenamed)
    //arrTarget1T1NoName.forEach(fSetMTime); arrSource1T1NoName.forEach(fSetMTime)

      // Created/Deleted
    var [err, arrCreate]=await parseSSV(FsFile["T2D_created"], ['strType', 'id', 'size', 'strMTime', 'strName']); if(err) {debugger; return [err];}
    var [err, arrDelete]=await parseSSV(FsFile["T2D_deleted"], ['strType', 'id', 'size', 'strMTime', 'strName']); if(err) {debugger; return [err];}
    extend(this, {arrCreate, arrDelete})

    var fT=row=>{
      row.id=row.id; row.size=Number(row.size); row.mtime_ns64=BigInt(row.strMTime)
    }
    arrCreate.forEach(fT); arrDelete.forEach(fT)


      // Mult
    var [err, ArrSourceMultNoName, ArrTargetMultNoName, arrSourceMultNoName, arrTargetMultNoName]=await parseMultSTFile(FsFile["T2D_STMatch2"]); if(err) {debugger; return [err];}
    extend(this, {arrSourceMultNoName, arrTargetMultNoName})

    extend(this, {arrUntouchedWOExactMTime, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, arrSourceMultNoName, arrTargetMultNoName, ArrSourceMultNoName, ArrTargetMultNoName}) // arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched
    return [null]
  }
  getMess(){
    var {arrTargetChanged, arrTargetMetaMatch, arrTargetNSM, arrTargetReusedName, arrTargetReusedId, arrCreate, arrDelete, arrTarget1T1NoName, arrSourceMultNoName, arrTargetMultNoName}=this
    var nTmp=arrTargetChanged.length+arrTargetReusedName.length+arrTargetReusedId.length+arrTarget1T1NoName.length
    var nDeleteB=nTmp+arrDelete.length+arrTargetMultNoName.length
    var nCreateB=nTmp+arrCreate.length+arrSourceMultNoName.length
    var nRenamed=arrTargetMetaMatch.length
    var nReIdd=arrTargetNSM.length
    var strMess=`Delete: ${nDeleteB}\nHashcode-calculations: ${nCreateB}\nRenamed: ${nRenamed}\nRe-Idd: ${nReIdd}`
    var boAbort=nDeleteB==0 && nCreateB==0 && nRenamed==0 && nReIdd==0
    return [boAbort, strMess]
  }
  async doSCChanges(){
    var {arrDb, arrUntouchedWOExactMTime, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, arrSourceMultNoName, arrTargetMultNoName, ArrSourceMultNoName, ArrTargetMultNoName}=this
    // var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    // var arrDbOrg=arrDb, arrDb=arrDbRelevant
    // this.arrDb=arrDb;   this.arrDbNonRelevant=arrDbNonRelevant

      // Set exact time of files in arrUntouchedWOExactMTime
    arrUntouchedWOExactMTime.sort(funIncId);   arrDb.sort(funIncId)
    var [err, arrSourceM, arrDbM, arrTrashA, arrTrashB]=extractMatching(arrUntouchedWOExactMTime, arrDb, ['id']); if(err) return [err];
    for(var i=0;i<arrSourceM.length;i++){ var rowS=arrSourceM[i], rowT=arrDbM[i]; rowT.mtime_ns64=rowS.mtime_ns64; }

    
    var arrDeleteB=[].concat(arrTargetChanged, arrTargetReusedName, arrTargetReusedId, arrDelete, arrTarget1T1NoName, arrTargetMultNoName);
    var arrSCNew=[].concat(arrTargetMetaMatch, arrTargetNSM)
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

  async createSyncData(){  // Calculate hashcodes etc  //createSyncData
    var {fsDirSource, flPrepend, arrDbNonRelevant}=this
    var { arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSource1T1NoName, arrTarget1T1NoName, arrSourceMultNoName, arrTargetMultNoName, ArrSourceMultNoName, ArrTargetMultNoName}=this

      // Copy hash to S
    var arrCopyHashS=[].concat(arrSourceUntouched, arrSourceMetaMatch, arrSourceNSM)
    var arrCopyHashT=[].concat(arrTargetUntouched, arrTargetMetaMatch, arrTargetNSM)
    for(var i in arrCopyHashS){  copySome(arrCopyHashS[i], arrCopyHashT[i], ["strHash"]) }

      // Calculate hash to S
    var StrCalcHashCategories=['changed', 'ReusedName', 'ReusedId', '1T1NoName', 'MultNoName', 'created']
    var ArrTmp=[arrSourceChanged, arrSourceReusedName, arrSourceReusedId, arrSource1T1NoName, arrSourceMultNoName, arrCreate]
    for(var i=0;i<StrCalcHashCategories.length;i++){
      var arrS=ArrTmp[i], strCategory=StrCalcHashCategories[i]
      for(var j in arrS){
        var rowS=arrS[j];  
        myConsole.log(`Calculating hash for ${strCategory} file: ${rowS.strName}`)
        var [err, strHash]=await myMD5(rowS, fsDirSource); if(err) { return [err];} 
        extend(rowS, {strHash});
      }
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
    var [err]=await writeDbFile(this.arrTargetNew, this.fsDb); if(err) { return [err];}
    return [null]
  }

}



var CategoryT2DNSM={  // File copied, then renamed to origin, _nm
  format:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)} ${s.strName}`;
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.id} ${s.strMTime}`;  }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.id} ${s.strMTime}`;  }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`int int64 string`, strHeadM=`size mtime_ns64R strName`;
    var strHeadUT=`string string string int64`, strHeadU=`side strType id mtime_ns64`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

var CategoryT2DChanged={
  format:function(arrS, arrT){
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

var CategoryT2DReusedName={
  format:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.strName}`
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.id} ${s.size.myPadStart(10)} ${s.strMTime}`; }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.id} ${s.size.myPadStart(10)} ${s.strMTime}`; }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string`, strHeadM=`strName`, strHeadUT=`string string string int int64`, strHeadU=`side strType id size mtime_ns64`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

var CategoryT2DReusedId={
  format:function(arrS, arrT){
    var funMatch=(s,t)=>`MatchingData ${s.id}`;
    var funUniqueS=s=>{ return `  S ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime} ${s.strName}`;  }
    var funUniqueT=s=>{ return `  T ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime} ${s.strName}`;  }
    var arrData=formatMatchingData(arrS, arrT, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`string`, strHeadM=`id`, strHeadUT=`string string int int64 string`, strHeadU=`side strType size mtime_ns64 strName`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}
var CategoryT2D1T1NoName={ //format1T1NoName
  format(arrA11, arrB11){
    const len=arrA11.length
    arrA11.forEach((el, i)=>el.ind=i)
    var arrStmp=arrA11.toSorted(funIncStrName)
  
      // Create Ind
    var Ind=arrStmp.map(entry=>entry.ind)
    const arrTtmp=eInd(arrB11, Ind)
  
    var funMatch=(s,t)=>{
      return `MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`;
    }
    var funUniqueS=s=>{
      var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`${s.strMTime}`:'NaN';
      return `  S ${s.strType} ${s.id} ${strD} ${s.strName}`
    }
    var funUniqueT=s=>{
      var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`${s.strMTime}`:'NaN';
      return `  T ${s.strType} ${s.id} ${strD} ${s.strName}`
    }
    var arrData=formatMatchingData(arrStmp, arrTtmp, funMatch, funUniqueS, funUniqueT)
    var strHeadMT=`int string`, strHeadM=`size strMTimeR`;
    var strHeadUT=`string string string string string`, strHeadU=`side strType id strMTime strName`;
    if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
    return arrData
  }
}

class DoDCActionsToTree{
  constructor(args){
    var {fiDirSource, fiDirTarget}=args
    extend(this, {fiDirSource, fiDirTarget})
  }
  async read(){
    var {fiDirSource, fiDirTarget}=this

    var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; return [err];}
    var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; return [err];}
    extend(this, {fsDirSource, fsDirTarget})

    //var [err, arrChange]=await parseMatchingPair(FsFile["T2T_changed"], ["strName"], ["size", "mtime"]); if(err) {debugger; return [err];}
    var [err, strData] = await readStrFile(FsFile["T2T_changed"]); if(err) return [err]
    var [err, arrChangeOld, arrChangeNew]=parseMatchingPairWHead(strData); if(err) return [err]
    var arrChange=arrChangeOld;
    extend(this, {arrChange})

    var [err, arrCreate]=await parseSSV(FsFile["T2T_created"], ['strType', 'size', 'mtime_ns64', 'strName']); if(err) {debugger; return [err];} // 'strType', 'id', 
    var [err, arrDelete]=await parseSSV(FsFile["T2T_deleted"], ['strType', 'size', 'mtime_ns64', 'strName']); if(err) {debugger; return [err];}
    extend(this, {arrCreate, arrDelete})


    var [err, objS, objT, arrSourceMultNoName, arrTargetMultNoName]=await parseMultSTFile(FsFile["T2T_STMatch3"]); if(err) {debugger; return [err];}
    extend(this, {arrSourceMultNoName, arrTargetMultNoName})
    var nDelete=arrChange.length+arrDelete.length+arrTargetMultNoName.length
    var nCreate=arrChange.length+arrCreate.length+arrSourceMultNoName.length
    return [null, {nDelete, nCreate}]
  }
  getMess(){
    var {arrChange, arrCreate, arrDelete, arrSourceMultNoName, arrTargetMultNoName}=this
    var nDelete=arrChange.length+arrDelete.length+arrTargetMultNoName.length
    var nCreate=arrChange.length+arrCreate.length+arrSourceMultNoName.length
    return `Delete: ${nDelete}\nCreate: ${nCreate}`
  }
  async makeChanges(){
    var {fsDirSource, fsDirTarget, arrChange, arrCreate, arrDelete, arrSourceMultNoName, arrTargetMultNoName}=this

      // Changed
    var StrTmp=arrChange.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrChange, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}

      // Deleted / Created
    var StrTmp=arrDelete.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrCreate, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}


      // Mult
    var StrTmp=arrTargetMultNoName.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrSourceMultNoName, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}


class SyncTreeToTree{
  constructor(args){
    var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend=""}=args
    copySome(this, args, ["fiDirSource", "fiDirTarget"]);
    extend(this, {charTRes, flPrepend, leafFilterFirst})
  }
  async constructorPart2(){ // Must be awaited
    var [err, fsDirSource]=await myRealPath(this.fiDirSource); if(err) {debugger; return [err];}
    var [err, fsDirTarget]=await myRealPath(this.fiDirTarget); if(err) {debugger; return [err];}

    extend(this, {fsDirSource, fsDirTarget})
    return [null]
  }
  
  async compare(){  //runOps
    var {fsDirSource, fsDirTarget, charTRes, leafFilterFirst}=this
 
      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, stats] = await getStats(fsDirTarget); if(err) return [err];

    var treeParser=new TreeParser()
    myConsole.log("Parsing source tree...")
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; return [err];}
    var tStop=unixNow();   //myConsole.log(`Source parsed, elapsed time ${(tStop-tStart)}ms`)
    //arrSourcef.sort(funIncId)

    myConsole.log("Parsing target tree...")
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, charTRes); if(err) {debugger; return [err];}
    //arrTargetf.sort(funIncId)

    //var comparisonWOID=new ComparisonWOID(arrSourcef, arrTargetf, myResultWriter)

    //var [err]=comparisonWOID.runOps(); if(err) {debugger; return [err];}

    var arrSource=arrSourcef, arrTarget=arrTargetf
    extend(this, {arrSource, arrTarget})
    

      // Search for multiples
    arrSource.sort(funIncSM);   arrTarget.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceM, objTargetM]=unTangleManyToManyF(arrSource, arrTarget, funSM)
    var Mat1=new Mat()
    Mat1.assignFromObjManyToMany(objSourceM, objTargetM);
    extend(this, {Mat1})
    

      // Extract untouched files
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrA, arrB, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) return [err]
    this.arrSourceUntouched=arrA; this.arrTargetUntouched=arrB; // nm

    var boChanged=this.boChanged=Boolean(arrSourceTouched.length)||Boolean(arrTargetTouched.length)

      // Extract 1T1 and ViaA (renamed) (MetaMatch)

    arrSourceTouched.sort(funIncSM);   arrTargetTouched.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceMetaMatch, objTargetMetaMatch]=unTangleManyToManyF(arrSourceTouched, arrTargetTouched, funSM)

      // Calculate Mat2
    var Mat2=new Mat()
    Mat2.assignFromObjManyToMany(objSourceMetaMatch, objTargetMetaMatch);
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
    var [arrSourceIddByFolder, arrTargetIddByFolder, objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing]=extractExtraByFolder(objSourceMetaMatch, objTargetMetaMatch, objAncestorOnlyRenamed)
    extend(this, {arrSourceIddByFolder, arrTargetIddByFolder}) // _ma (meta and ancestor)


    var [arrSource1To1, arrTarget1To1, objSourceRem2, objTargetRem2]=extract1To1(objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing)
    extend(this, {arrSource1To1, arrTarget1To1})

    
      // Recalculate Mat3
    objManyToManyRemoveEmpty(objSourceRem2, objTargetRem2)  // Modifies the arguments
    var Mat3=new Mat()
    //Mat3.assignFromObjManyToMany(objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing);
    Mat3.assignFromObjManyToMany(objSourceRem2, objTargetRem2);
    extend(this, {Mat3})

      // Changed (NoMetaMatch with matching strName)
    var arrSourceNoMetaMatch=[].concat(Mat3.arrA[2][0], Mat3.arrA[1][0]);
    var arrTargetNoMetaMatch=[].concat(Mat3.arrB[0][1], Mat3.arrB[0][2]);
    arrSourceNoMetaMatch.sort(funIncStrName); arrTargetNoMetaMatch.sort(funIncStrName);
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceNoMetaMatch, arrTargetNoMetaMatch, ['strName']); if(err) return [err]
    this.arrSourceReusedName=arrA; this.arrTargetReusedName=arrB

    var arrCreate=arrSourceRem, arrDelete=arrTargetRem


    extend(this, {arrCreate, arrDelete})
    return [null]
  }

  format(fiDb){ //fsDir, 
    var {Mat1, Mat2, Mat3}=this

    var myResultWriter=new MyResultWriter(StrStemT2T)

    // var ArrAMult=[].concat(Mat1.ArrA[1][2],Mat1.ArrA[2][1],Mat1.ArrA[2][2]);
    // var ArrBMult=[].concat(Mat1.ArrB[1][2],Mat1.ArrB[2][1],Mat1.ArrB[2][2])
    // setBestNameMatchFirst(ArrAMult, ArrBMult)
    //   // Sort by size
    // ArrAMult.forEach((el, i)=>el.ind=i); // Set index
    // //var funInc=(a,b)=>a[0].size-b[0].size;
    // var funDec=(a,b)=>b[0].size-a[0].size;
    // var ArrAtmp=ArrAMult.toSorted(funDec)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrBMult, Ind)
    // var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);

    //var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat1.ArrA[i][j]);
      var ArrBMult=[].concat(Mat1.ArrB[i][j])
      //setBestNameMatchFirst(ArrAMult, ArrBMult)
        // Sort by size
      ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
      //var funInc=(a,b)=>a[0].size-b[0].size;
      var funDec=(a,b)=>b[0].size-a[0].size;
      var ArrAtmp=ArrAMult.toSorted(funDec)
        // Create Ind
      var Ind=ArrAtmp.map(entry=>entry.ind)
      var ArrBtmp=eInd(ArrBMult, Ind)
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["T2T_STMatch1_"+i+j]=StrDuplicateM
    }

    var ArrBMult=[].concat(Mat1.ArrB[0][2]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrBtmp=ArrBMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrBtmp, 'T');
    myResultWriter.Str["T2T_STMatch1_02"]=StrDuplicateM

    var ArrAMult=[].concat(Mat1.ArrA[2][0]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrAtmp=ArrAMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrAtmp, 'S');
    myResultWriter.Str["T2T_STMatch1_20"]=StrDuplicateM

    // var ArrAMult=[].concat(Mat2.ArrA[1][2],Mat2.ArrA[2][1],Mat2.ArrA[2][2]);
    // var ArrBMult=[].concat(Mat2.ArrB[1][2],Mat2.ArrB[2][1],Mat2.ArrB[2][2])
    // setBestNameMatchFirst(ArrAMult, ArrBMult)
    // var StrDuplicateInitial=formatMatchingDataWMult(ArrAMult, ArrBMult);

    //var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
    var ArrPot=[[1,2],[2,1],[2,2]]
    for(var arrPot of ArrPot){
      var [i,j]=arrPot
      var ArrAMult=[].concat(Mat2.ArrA[i][j]);
      var ArrBMult=[].concat(Mat2.ArrB[i][j])
      //setBestNameMatchFirst(ArrAMult, ArrBMult)
        // Sort by size
      ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
      //var funInc=(a,b)=>a[0].size-b[0].size;
      var funDec=(a,b)=>b[0].size-a[0].size;
      var ArrAtmp=ArrAMult.toSorted(funDec)
        // Create Ind
      var Ind=ArrAtmp.map(entry=>entry.ind)
      var ArrBtmp=eInd(ArrBMult, Ind)
      var StrDuplicateM=formatMatchingDataWMult(ArrAtmp, ArrBtmp);
      myResultWriter.Str["T2T_STMatch2_"+i+j]=StrDuplicateM
    }

    var ArrBMult=[].concat(Mat2.ArrB[0][2]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrBtmp=ArrBMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrBtmp, 'T');
    myResultWriter.Str["T2T_STMatch2_02"]=StrDuplicateM

    var ArrAMult=[].concat(Mat2.ArrA[2][0]);
      // Sort by size
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrAtmp=ArrAMult.toSorted(funDec)
    var StrDuplicateM=formatMatchingDataWMultSingleDataSetST(ArrAtmp, 'S');
    myResultWriter.Str["T2T_STMatch2_20"]=StrDuplicateM


    var ArrAMult=[].concat(Mat3.ArrA[1][2],Mat3.ArrA[2][1],Mat3.ArrA[2][2]);
    var ArrBMult=[].concat(Mat3.ArrB[1][2],Mat3.ArrB[2][1],Mat3.ArrB[2][2])
    setBestNameMatchFirst(ArrAMult, ArrBMult)
    var StrDuplicateFinal=formatMatchingDataWMult(ArrAMult, ArrBMult);


      // Leaf- vs Parent- changes 
    var [StrRenameAncestorOnly, StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed]=formatAncestorOnlyRenamed(this.arrAncestorOnlyRenamed, fiDb)

    var funMatch=(s,t)=>`MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`;
    var funUniqueS=s=>{  return `  S ${s.strName}`; }
    var funUniqueT=s=>{  return `  T ${s.strName}`; }
    var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, funMatch, funUniqueS, funUniqueT)
    var strHead=`int int64\nsize mtime_ns64R\nstring string\nside strName`;
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


    // var [err, StrSum]=this.formatScreen(); if(err) return [err]
    // this.myResultWriter.Str["screen"]=StrSum
    // this.myResultWriter.Str["T2T_sum"]=StrSum
    //this.myResultWriter.Str["T2T_resultMore"]=this.formatResultMore()
    myResultWriter.Str["T2T_changed"]=StrChanged;
    myResultWriter.Str["T2T_created"]=StrCreated;
    myResultWriter.Str["T2T_deleted"]=StrDeleted;
    myResultWriter.Str["T2T_renamed"]=formatRename1T1(this.arrSource1To1, this.arrTarget1To1)
    myResultWriter.Str["T2T_ancestor"]=StrRenameAncestorOnly
    //myResultWriter.Str["T2T_STMatch1"]=StrDuplicateM
    //myResultWriter.Str["T2T_STMatch2"]=StrDuplicateInitial
    myResultWriter.Str["T2T_STMatch3"]=StrDuplicateFinal
    myResultWriter.Str["T2T_renamedAdditional"]=StrRenameAdditional
    this.myResultWriter=myResultWriter
  }
  makeConfirmMess(){

    var {arrSource, arrTarget, arrSourceUntouched, arrSourceReusedName, arrCreate, arrDelete, arrSourceIddByFolder, arrAncestorOnlyRenamed, Mat1, Mat2, Mat3, nAncestorOnlyRenamed,   arrSource1To1, arrChange, arrCreate, arrDelete}=this

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
    var strMess=`Renaming ${nRename} file${pluralS(nRename)}
    Deleting ${nDeleteB} file${pluralS(nDeleteB)}
    Creating ${nCreateB} file${pluralS(nCreateB)}`
    return strMess
  }
  writeToFile(){
    this.myResultWriter.writeToFile()
  }
  async makeRenameChanges(){
      // 1T1
    var {arrSource1To1, arrTarget1To1, arrSourceIddByFolder, arrTargetIddByFolder, arrSourceReusedName, arrTargetReusedName, fsDirSource, arrCreate, arrDelete, fsDirTarget}=this;
    var len=arrSource1To1.length, arrRename=Array(len)
    for(var i=0;i<len;i++){
      var strOld=arrTarget1To1[i].strName
      var strNew=arrSource1To1[i].strName
      arrRename[i]={strOld, strNew}
    }
    var [err]=await renameFiles(fsDirTarget, arrRename);  if(err) {debugger; return [err];}

      // IddByFolder
    var len=arrSourceIddByFolder.length, arrRename=Array(len)
    for(var i=0;i<len;i++){
      var strOld=arrTargetIddByFolder[i].strName
      var strNew=arrSourceIddByFolder[i].strName
      arrRename[i]={strOld, strNew}
    }
    var [err]=await renameFiles(fsDirTarget, arrRename);  if(err) {debugger; return [err];}
    return [null]
  }
  async makeDeleteNCreateChanges(){
      // 1T1
    var {arrSource1To1, arrTarget1To1, arrSourceIddByFolder, arrTargetIddByFolder, arrSourceReusedName, arrTargetReusedName, fsDirSource, arrCreate, arrDelete, fsDirTarget, Mat3}=this;
 

      // Changed
    var StrTmp=arrTargetReusedName.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrSourceReusedName, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}

      // Deleted / Created
    var StrTmp=arrDelete.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var [err]=await myCopyEntries(arrCreate, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}


      // Mult
    var arrBMult=[].concat(Mat3.arrB[1][2],Mat3.arrB[2][1],Mat3.arrB[2][2])
    var StrTmp=arrBMult.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; return [err];}
    var arrAMult=[].concat(Mat3.arrA[1][2],Mat3.arrA[2][1],Mat3.arrA[2][2]);
    var [err]=await myCopyEntries(arrAMult, fsDirSource, fsDirTarget);  if(err) {debugger; return [err];}

    return [null]
  }
  async makeChanges(){
    var [err]=await this.makeRenameChanges(); if(err) {debugger; return [err];}
    var [err]=await this.makeDeleteNCreateChanges(); if(err) {debugger; return [err];}
    return [null]
  }
}


/****************************************************************************************
 * check
 ****************************************************************************************/

var check=async function(args){ // buCopyUnlessNameSMMatch
  // var {fiDir='.', leafDb=settings.leafDb, charTRes, intStart=0}=args
  // var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
  // var fsDb=fsDir+charF+leafDb
  
  //checkHash(fsDir, fsDb, charTRes, intStart)
  checkInterior(args)
}

//var checkSummarizeMissing=async function(fiDir='.', leafDb=settings.leafDb){
var checkSummarizeMissing=async function(args){
  //var [err]=await checkSummarizeMissingInterior(fsDir, fsDb); if(err) {debugger; myConsole.error(err); return;}
  var [err]=await checkSummarizeMissingInterior(args); if(err) {debugger; myConsole.error(err); return;}
}

/****************************************************************************************
 * T2T
 ****************************************************************************************/



class RenameFinishToTree{
  constructor(args){
    var {boDir=false}=args
    copySome(this, args, ["fiDir", "fsRenameFile"])
    extend(this, {boDir})
  }
  async read(){
    var {fiDir, fsRenameFile}=this

    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
    this.fsDir=fsDir

    //var [err, arrOld, arrNew]=await parseMatchingPair(fsRenameFile, ["size", "mtime"], ["strName"]); if(err) {debugger; myConsole.error(err); return}
    var [err, strData] = await readStrFile(fsRenameFile); if(err) return [err]
    var [err, arrOld, arrNew]=parseMatchingPairWHead(strData); if(err) return [err]
    var arrRename=Array(arrOld.length)
    for(var i in arrOld){
      var rowO=arrOld[i], rowN=arrNew[i];
      arrRename[i]={strOld:rowO.strName, strNew:rowN.strName}
    }
    
    var funInc=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
    arrRename.sort(funInc)
    this.arrRename=arrRename

  }
  async makeChanges(){
    var {fsDir, arrRename}=this
    var [err]=await renameFiles(fsDir, arrRename);  if(err) {debugger; myConsole.error(err); return}
  }
}



// {fiDirSource, fiDirTarget, leafFilterFirst:settings.leafFilter}
class SyncTreeToTreeBrutal{
  constructor(args){
    copySome(this, args, ["fiDirSource", "fiDirTarget", "charTRes", "leafFilterFirst"])
  }
  async constructorPart2(){ // Must be awaited
    var {fiDirSource, fiDirTarget, charTRes, leafFilterFirst}=this
    var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
    var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; myConsole.error(err); return;}
    this.fsDirSource=fsDirSource; this.fsDirTarget=fsDirTarget
  }
  async compare(){ // buCopyUnlessNameSMMatch
    var {fiDirSource, fsDirSource, fiDirTarget, fsDirTarget, charTRes, leafFilterFirst}=this
    var tStart=unixNow()

      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, stats] = await getStats(fsDirTarget); if(err) return [err];

      // Parse trees
    var treeParser=new TreeParser()
    myConsole.log("Parsing source tree...")
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) { return [err];}
    myConsole.log("Parsing target tree...")
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, charTRes); if(err) { return [err];}

      // Extract untouched files
    arrSourcef.sort(funIncStrName);   arrTargetf.sort(funIncStrName);
    var [err, arrSourcefUntouched, arrTargetfUntouched, arrSourcefRem, arrTargetfRem]=extractMatching(arrSourcef, arrTargetf, ['strName', 'sm'])

      // Extract existing Folders
    arrSourceF.sort(funIncStrName);   arrTargetF.sort(funIncStrName)
    var [err, arrSourceFUntouched, arrTargetFUntouched, arrSourceFRem, arrTargetFRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])

      
    //if(lenSource==0 && lenTarget==0) {print('Everything is up to date, aborting.'); return}


    arrSourceFRem.sort(funIncStrName) // So that root-most folders come before its children
    arrTargetFRem.sort(funDecStrName) // So that leaf-most folders come before its parents

    extend(this,{arrSourcefRem, arrTargetfRem, arrSourceFRem, arrTargetFRem})
    
    //if(boDryRun) {print("(Dry run) exiting"); return}
    
    //myConsole.log(`elapsed time ${(unixNow()-tStart)}ms`)

    var lenSourcef=arrSourcefRem.length, lenTargetf=arrTargetfRem.length
    var lenSourceF=arrSourceFRem.length, lenTargetF=arrTargetFRem.length
    var boChanged=lenSourcef!=0 || lenTargetf!=0 || lenSourceF!=0 || lenTargetF!=0

    return [null, boChanged]
  }
  makeConfirmMess(){
    var {arrSourcefRem, arrTargetfRem, arrSourceFRem, arrTargetFRem}=this
    var lenSourcef=arrSourcefRem.length, lenTargetf=arrTargetfRem.length
    var lenSourceF=arrSourceFRem.length, lenTargetF=arrTargetFRem.length
    var strMess=`Deleting ${lenTargetf} file${pluralS(lenTargetf)} (and ${lenTargetF} folder${pluralS(lenTargetF)})
Creating ${lenSourcef} file${pluralS(lenSourcef)} (and ${lenSourceF} folder${pluralS(lenSourceF)})` // 🗎🗀  file${pluralS(lenTargetf)}.  folder${pluralS(lenSourceF)}  file${pluralS(lenSourcef)} folder${pluralS(lenTargetF)}.
    return strMess
  }
  async makeChanges(){
    var {fsDirSource, fsDirTarget, arrSourcefRem, arrSourceFRem, arrTargetfRem, arrTargetFRem}=this
    var StrTmp=arrTargetfRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrTargetFRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFolders(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrSourceFRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myMkFolders(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var [err]=await myCopyEntries(arrSourcefRem, fsDirSource, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  }
}



// var compareTreeToDbSMOnly=async function(args){
//   var {fiDir, leafDb=settings.leafDb, flPrepend, charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
//   var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
//   // var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
//   // var leafDb=basename(fiDb)
//   var fsDb=fsDir+charF+leafDb

//     // Parse tree
//   var treeParser=new TreeParser()
//   var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
//   removeLeafDbFromArrTreef(arrTreef, leafDb)
//     // Parse fsDb
//   var [err, arrDb]=await parseDb(fsDb, charTRes)
//   if(err){
//     if(err.code==STR_ENOENT){err=null; arrDb=[]}  //STR_NE_FS_FILRDER
//     else{debugger; myConsole.error(err); return}
//   }

//   var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
//   var arrDbOrg=arrDb, arrDb=arrDbRelevant


//   var myResultWriter=new MyResultWriter(StrStemT2T)
//   var comparisonWOID=new ComparisonWOID(arrTreef, arrDb, myResultWriter)
//   var [err]=comparisonWOID.runOps(); if(err) {debugger; myConsole.error(err); return;}
//   comparisonWOID.format(fsDb) //fsDir, 
//   myResultWriter.writeToFile()
//   var strSeeMore=myResultWriter.getSeeMoreMessage()
//   myConsole.log(myResultWriter.Str['screen'].concat(strSeeMore).join('\n'))

// }






/*********************************************************************
 * moveMeta
 *********************************************************************/
var moveMeta=async function(args){
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiDbS", default='buvtDb.txt')
  // parser.add_argument("-o", "--fiDbOther", required=true)
  // parser.add_argument("-d", "--fiDirT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(args.fiDbS); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDbS]=await parseDb(fsDbS, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiDbOther
  var [err, fsDbOther]=await myRealPath(args.fiDbOther); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDbOther]=await parseDb(fsDbOther, charTRes)
  if(err){
    if(err.code==STR_ENOENT){err=null; arrDbOther=[]} //STR_NE_FS_FILRDER
    else{debugger; myConsole.error(err); return}
  }

    // Parse tree
  var [err, fsDir]=await myRealPath(args.fiDirT); if(err) {debugger; myConsole.error(err); return;}
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  var [arrDbOtherNonRelevant, arrDbOtherRelevant] =selectFrArrDb(arrDbOther, flPrepend)
  var arrDbOtherOrg=arrDbOther,   arrDbOther=arrDbOtherRelevant

  // var [arrTreefNonRelevant, arrTreefRelevant] =selectFrArrDb(arrTreef, flPrepend)
  // arrTreefOrg=arrTreef;   arrTreef=arrTreefRelevant


  arrTreef.sort(funIncStrName);   arrDbS.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbSMatch, arrTreeRem, arrDbSRem]=extractMatching(arrTreef, arrDbS, ['strName'], ['strName']);
  if(err) {debugger; myConsole.error(err); return;}

  //if(arrTreeRem.length || arrDbRem.length) return "Error "+"arrTreeRem.length OR arrDbRem.length"
  //if(arrTreeRem.length) return "Error: "+"arrTreeRem.length"

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
    var boOK=confirm(`Writing ${arrDbOtherNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDbOtherNew, fsDbOther); if(err) {debugger; myConsole.error(err); return;}
}


/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(leafFilterFirst=settings.leafFilter){
  var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDirSource}=result
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(fsDirSource); if(err) {debugger; myConsole.error(err); return}

  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

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
  var [err]=await writeFile(leafResult, strTmp); if(err) {debugger; myConsole.error(err); return;}

  var leafResultRs='resultFrTestFilterRs.txt'
  var StrOut=[]
  for(var row of arrRsf) StrOut.push(row.strName)
  for(var row of arrRsF) StrOut.push(row.strName)
  StrOut.push('  arrRsOther:\n')
  for(var row of arrRsOther) StrOut.push(row)
  var strOut=StrOut.join('\n')
  var [err]=await writeFile(leafResultRs, strTmp); if(err) {debugger; myConsole.error(err); return;}


  myConsole.log(`${leafResult} and ${leafResultRs} written`)
}



var convertHashcodeFileToDb=async function(args){  // Add id and create uuid
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-d", "--fiDir", default='.')
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse tree
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}
      // boUseFilter should perhaps be false (although it might be slow)
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  
    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDb]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

    // fiDb
  //var fiDb=inpDb.value.trim()
  var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDb}=result
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, args.flPrepend)
  // arrDbOrg=arrDb;   arrDb=arrDbRelevant

  arrTreef.sort(funIncStrName);   arrDb.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbMatch, arrTreeRem, arrDbRem]=extractMatching(arrTreef, arrDb, ['strName'], ['strName'])

  //if(arrTreeRem.length || arrDbRem.length) return "Error: "+"arrTreeRem.length OR arrDbRem.length"
  if(arrTreeRem.length) {var err=Error("Error: "+"arrTreeRem.length"); debugger; myConsole.error(err); return;}  

  for(var i in arrDbMatch){
    //if(!("uuid" in rowDb)) rowDb.uuid=myUUID() // Add uuid if it doesn't exist
    var rowDb=arrDbMatch[i]
    var row=arrTreeMatch[i]
    rowDb.id=row.id // Copy id
  }

  var arrDbNew=arrDbMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDbNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('convertHashcodeFileToDb: Done')
}



var convertDbFileToHashcodeFile=async function(){ // Add id and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDb
  //var fiDb=inpDb.value.trim()
  var [err, result]=await argumentTab.getSelectedFrFile(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDb}=result
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDb]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, args.flPrepend)
  // arrDbOrg=arrDb;   arrDb=arrDbRelevant

  var arrDbNew=arrDb
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDbNew.length} entries to hash-file.`)
    if(!boOK) return
  }
  var [err]=await writeHashFile(arrDbNew, fsHash)
  myConsole.log('convertDbFileToHashcodeFile: Done')
}





var sortHashcodeFile=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDb]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

  arrDb.sort(funIncStrName)

  var [err]=await writeHashFile(arrDb, fsHash); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('sortHashcodeFile: Done')
}


var changeIno=async function(args){
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsDb]=await myRealPath(args.fiDb); if(err) {debugger; myConsole.error(err); return;}
  var leafDb=basename(args.fiDb)

    // Parse tree
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fiDb
  var [err, arrDb]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, args.flPrepend)
  var arrDbOrg=arrDb,   arrDb=arrDbRelevant

  arrTreef.sort(funIncStrName);  arrDb.sort(funIncStrName)
  var [err, arrTreeMatch, arrDbMatch, arrTreeRem, arrDbRem]=extractMatching(arrTreef, arrDb, ['strName'], ['strName'])
  if(err) {debugger; myConsole.error(err); return;}


  for(var i in arrDbMatch){
    var rowDb=arrDbMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDb)) rowDb.uuid=myUUID()
    rowDb.id=rowTree.id
  }

  var arrDbNew=arrDbMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDbNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('changeIno: Done')
}

var utilityMatchTreeAndDbFile=async function(args){ // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsDb]=await myRealPath(args.fiDb); if(err) {debugger; myConsole.error(err); return;}
  var leafDb=basename(args.fiDb)

    // Parse tree
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fiDb
  var [err, arrDb]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, args.flPrepend)
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
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDbNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDbNew, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('utilityMatchTreeAndDbFile: Done')
}


var utilityMatchDbFileAndDbFile=async function(){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiDbS", default='buvtDb.txt')
  // parser.add_argument('-t', "--fiDbT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(args.fiDbS); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDbS]=await parseDb(fsDbS, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiDbT
  var [err, fsDbT]=await myRealPath(args.fiDbT); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDbT]=await parseDb(fsDbT, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDbTNonRelevant, arrDbTRelevant] =selectFrArrDb(arrDbT, args.flPrepend)
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
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDbNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDbNew, fsDbT); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('utilityMatchDbFileAndDbFile: Done')
}

var utilityAddToDbStrName=async function(){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDbS
  var [err, fsDb]=await myRealPath(args.fiDb); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDb]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}
  arrDb.sort(funIncStrName)



  //flPrependTmp=flPrepend+"/" if(flPrepend.length) else ""
  for(var row of arrDb){
    row.strName=flPrepend+row.strName
  }
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDb.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDb, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('utilityAddToDbStrName: Done')
}


var utilityT2T=async function(args){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, fiDirSource, fiDirTarget}=args

  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; return [err];}
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; return [err];}
  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; return [err];}
  
  myConsole.log("Parsing target tree...")
  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, charTRes); if(err) {debugger; return [err];}

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
      var arrCommand=['touch', '-mr', fsDirTarget+charF+rT.strName, fsDirSource+charF+rS.strName];
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; } 
    } 
  }
  for(var i=0; i<arrS.length; i++ ){
    var rS=arrS[i], rT=arrT[i]
    var tS=rS.mtime_ns64, tT=rT.mtime_ns64
    var d=tT-tS
    if(d<0){ 
      var arrCommand=['touch', '-mr', fsDirSource+charF+rS.strName, fsDirTarget+charF+rT.strName];
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; }
    }
  }
  return [null]
    
}


var deleteResultFilesasync=async function(){ 
  for(const strTmp of StrStemReport){
    let fsFile=FsFile[strTmp]

    var [err, result]=await removeFile(fsFile);
    if(err) {
      if(err.code==STR_ENOENT) myConsole.log("Couldn't delete: "+fsFile)  //STR_NE_FS_FILRMER
      else {debugger; myConsole.error(err); return}
    }
    myConsole.log("Deleted: "+basename(fsFile))
  }
}