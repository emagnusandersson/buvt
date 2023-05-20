
"use strict"





var summarizeHLInfo=function(arrA){
  var objDup={}, nMult=0
  var objEntryByKey=bucketifyByKey(arrA, "id");
  for(var k in objEntryByKey) { var arr=objEntryByKey[k]; if(arr.length>1) {objDup[k]=arr; nMult+=arr.length;} }
  var nMultId=Object.keys(objDup).length;
  var nId=Object.keys(objEntryByKey).length
  return [nId, nMultId, nMult, objDup]
}

//var hardLinkCheck=async function(fiDirSource, charTRes, leafFilterFirst=settings.leafFilter){
var hardLinkCheck=async function(args){
  var {fiDirSource, charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var treeParser=new TreeParserPython()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  var myResultWriter=new MyResultWriter(StrStemT2D)

  var funIncId=(a,b)=>a.id-b.id;  arrTreef.sort(funIncId);   arrTreeF.sort(funIncId);
  var [nIdf, nMultIdf, nMultf, objTreefDup]=summarizeHLInfo(arrTreef)
  var [nIdF, nMultIdF, nMultF, objTreeFDup]=summarizeHLInfo(arrTreeF)
  var objArg={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length}

  var funMatch=s=>`  fileId ${s.id.myPadStart(20)}`,  funUnique=s=>`    ${s.strName}`;
  var StrTmpf=formatMatchingDataWDupSingleDataSet(objTreefDup, funMatch, funUnique)
  var StrTmpF=formatMatchingDataWDupSingleDataSet(objTreeFDup, funMatch, funUnique)
  myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
  myResultWriter.writeToFile()
  var strSeeMore=myResultWriter.getSeeMoreMessage()
  myConsole.log(StrSum.concat(strSeeMore).join('\n'))

}


/****************************************************************************************
 * T2D
 ****************************************************************************************/

class SyncTreeToDb{
  constructor(strCommandName, args){
    var {leafDb=settings.leafDb, charTRes=settings.charTRes, flPrepend=""}=args
    this.strCommandName=strCommandName
    this.boCompareOnly=strCommandName=='compareTreeToDb';
    //copySome(this, args, ["fiDir", "charTRes", "leafFilterFirst", "leafDb", "flPrepend"]);
    copySome(this, args, ["fiDir", "leafFilterFirst"]);
    extend(this, {leafDb, charTRes, flPrepend})
    this.nPrepend=flPrepend.length
  }
  async constructorPart2(){ // Must be awaited
    var [err, fsDir]=await myRealPath(this.fiDir); if(err) {debugger; myConsole.error(err); return;}
    this.fsDir=fsDir
    this.fsDb=fsDir+charF+this.leafDb
  }

  async compare(){
    var {strCommandName, fiDir, fsDir, charTRes, leafFilterFirst, leafDb, fsDb, flPrepend, nPrepend}=this
    var tStart=unixNow();

      // Parse tree
    var treeParser=new TreeParserPython()
    var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {return [err];}
    removeLeafDbFromArrTreef(arrTreef, leafDb)

      // Parsing fsDb (database)
    var [err, arrDB]=await parseDb(fsDb, charTRes)
    if(err){
      if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
      else{ return [err]}
    }
    var [arrDBNonRelevant, arrDBRelevant]=selectFrArrDB(arrDB, flPrepend)
    var arrDBOrg=arrDB, arrDB=arrDBRelevant
    this.arrDB=arrDB;   this.arrDBNonRelevant=arrDBNonRelevant

      // Count duplicate ids in tree
    var [nIdf, nMultIdf, nMultf, objTreefDup]=summarizeHLInfo(arrTreef)
    var [nIdF, nMultIdF, nMultF, objTreeFDup]=summarizeHLInfo(arrTreeF)

      // Count duplicate ids in db
    var funIncId=(a,b)=>a.id-b.id;   arrDB.sort(funIncId)
    var [nIdDB, nMultIdDB, nMultDB, objDBDup]=summarizeHLInfo(arrDB)

    var boHL=Boolean(nMultf || nMultF || nMultDB)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDB, nMultIdDB, nIdDB, nDB:arrDB.length,  boHL}

    var myResultWriter=new MyResultWriter(StrStemT2D)

    if(nMultIdf || nMultIdF || nMultIdDB) {
      var funMatch=s=>`  fileId ${s.id.myPadStart(20)}`,  funUnique=s=>`    ${s.strName}`;
      var StrTmpf=formatMatchingDataWDupSingleDataSet(objTreefDup, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWDupSingleDataSet(objTreeFDup, funMatch, funUnique)
      myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.writeToFile()
      return [null];
    }


    var funIncSM=(a,b)=>a.sm-b.sm;   arrTreef.sort(funIncSM);   arrDB.sort(funIncSM)
    var funSM=row=>row.sm
    var [objTreeM, objDBM]=unTangleManyToManyF(arrTreef, arrDB, funSM)
    var Mat1=this.Mat1=new Mat()
    Mat1.assignFromObjManyToMany(objTreeM, objDBM);
    Mat1.setMTMLabel()


    var funMatch=(s,t)=>{ return `  MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`; }
    var funUnique=s=>{ var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';        return `    ${s.strName}${strD}`; }
    var funUniqueC=s=>{var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';        return `    #${s.strName}${strD}`; }

    var ArrADup=[].concat(Mat1.ArrA[1][2],Mat1.ArrA[2][1],Mat1.ArrA[2][2]);
    var ArrBDup=[].concat(Mat1.ArrB[1][2],Mat1.ArrB[2][1],Mat1.ArrB[2][2])
    setBestNameMatchFirst(ArrADup, ArrBDup)


      // Sort by size
    ArrADup.forEach((el, i)=>el.ind=i); // Set index
    //var funInc=(a,b)=>a[0].size-b[0].size;
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrAtmp=[...ArrADup].sort(funDec)
      // Create Ind
    var Ind=ArrAtmp.map(entry=>entry.ind)
    var ArrBtmp=eInd(ArrBDup, Ind)
    var StrDuplicateM=formatMatchingDataWDup(ArrAtmp, ArrBtmp, funMatch, funUnique, funUniqueC)

    myResultWriter.Str["T2D_mult1"]=StrDuplicateM



    var strIdType='id', arrSource=arrTreef, arrTarget=arrDB
      // Untouched, inm
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrSourceUnTouched, arrTargetUnTouched, arrSourceRem, arrTargetRem]=extractMatching(arrSource, arrTarget, ['strName', strIdType, 'sm']); if(err) return [err];
    //extend(this, {arrSourceUnTouched})
    var boChanged=this.boChanged=Boolean(arrSourceRem.length)
    //var boNothingToDo=arrSourceRem.length==0

      // Changed, in_
    var [err, arrSourceChanged, arrTargetChanged, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName', strIdType]); if(err) return [err];
    
      // Renamed (MetaMatch), i_m
    var funInc=(a,b)=>a[strIdType]-b[strIdType]; arrSourceRem.sort(funInc);   arrTargetRem.sort(funInc);
    var [err, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, [strIdType, 'sm']); if(err) return [err];

      // File copied, then renamed to origin, _nm
    arrSourceRem.sort(funIncStrName);   arrTargetRem.sort(funIncStrName)
    var [err, arrSourceNSM, arrTargetNSM, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ["strName", 'sm']); if(err) return [err];

      // Reused name, _n_
    arrSourceRem.sort(funIncStrName);   arrTargetRem.sort(funIncStrName)
    var [err, arrSourceMatchingStrName, arrTargetMatchingStrName, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName']); if(err) return [err];

      // Matching id, i__
    var [err, arrSourceMatchingId, arrTargetMatchingId, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, [strIdType]); if(err) return [err];


        // Matching SM (Copy)
    arrSourceRem.sort(funIncSM);   arrTargetRem.sort(funIncSM);
    var [objSourceMetaMatch, objTargetMetaMatch]=unTangleManyToManyF(arrSourceRem, arrTargetRem, row=>row.sm)
    var Mat2=this.Mat2=new Mat()
    Mat2.assignFromObjManyToMany(objSourceMetaMatch, objTargetMetaMatch);
    var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
    var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
    var arrA1T1NoName=[].concat(Mat2.arrA[1][1]);
    var arrB1T1NoName=[].concat(Mat2.arrB[1][1]);
    var ArrAMultNoName=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrBMultNoName=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
    var arrAMultNoName=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    var arrBMultNoName=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
    // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
    //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭
  
    extend(this, {arrSource, arrTarget, arrSourceUnTouched, arrTargetUnTouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceMatchingStrName, arrTargetMatchingStrName, arrSourceMatchingId, arrTargetMatchingId, arrCreate, arrDelete, arrA1T1NoName, arrB1T1NoName, arrAMultNoName, arrBMultNoName, ArrAMultNoName, ArrBMultNoName})

    //if(boNothingToDo) return [null]

      //
      // Write to files
      //

      // Renamed i_m
    myResultWriter.Str["T2D_renamed"]=formatRename1T1(arrSourceMetaMatch, arrTargetMetaMatch, strIdType)

      // File copied, then renamed to origin, _nm
    var funMatch=(s,t)=>{
      return `  MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)} ${s.strName}`;
    }
    var funUnique=s=>{
      var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n#(${s.strMTime})`:'';
      return `    ${s[strIdType]}${strD}`
    }
    var arrData=formatMatchingData(arrSourceNSM, arrTargetNSM, funMatch, funUnique)
    myResultWriter.Str["T2D_copiedThenRenamedToOrigin"]=arrData

      // Changed
    var funMatch=(s,t)=>`  MatchingData ${s[strIdType]} ${s.strName}`;
    var funUnique=s=>`    ${s.size.myPadStart(10)} ${s.strMTime}`
    var arrData=formatMatchingData(arrSourceChanged, arrTargetChanged, funMatch, funUnique)
    myResultWriter.Str["T2D_changed"]=arrData

      // Reused name
    var funMatch=(s,t)=>`  MatchingData ${s.strName}`
    var funUnique=s=>`    ${s[strIdType]} ${s.size.myPadStart(10)} ${s.strMTime}`
    var arrData=formatMatchingData(arrSourceMatchingStrName, arrTargetMatchingStrName, funMatch, funUnique)
    myResultWriter.Str["T2D_reusedName"]=arrData

      // Reused Id
    var funMatch=(s,t)=>`  MatchingData ${s[strIdType]}`;
    var funUnique=s=>`    ${s.size.myPadStart(10)} ${s.strMTime} ${s.strName}`
    var arrData=formatMatchingData(arrSourceMatchingId, arrTargetMatchingId, funMatch, funUnique)
    myResultWriter.Str["T2D_reusedId"]=arrData

      // Created
    var StrTmp=[]
    for(var row of arrCreate) StrTmp.push(`${row[strIdType]} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str["T2D_created"]=StrTmp

      // Deleted
    var StrTmp=[]
    for(var row of arrDelete) StrTmp.push(`${row[strIdType]} ${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    myResultWriter.Str["T2D_deleted"]=StrTmp

      // 1T1NoName
    //var [arrSource1To1NoName, arrTarget1To1NoName, objSourceRem2, objTargetRem2]=extract1To1(objSourceMetaMatch, objTargetMetaMatch)
    myResultWriter.Str["T2D_1T1NoName"]=formatRename1T1(arrA1T1NoName, arrB1T1NoName)


      // MultNoName
    var funMatch=(s,t)=>{ return `  MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`; }
    var funUnique=s=>{
      var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';
      return `    ${s.strName}${strD}`
    }
    var funUniqueC=s=>{
      var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';
      return `    #${s.strName}${strD}`
    }

    setBestNameMatchFirst(ArrAMultNoName, ArrBMultNoName)

    //   // Sort by size
    // ArrAMultNoName.forEach((el, i)=>el.ind=i); // Set index
    // var funInc=(a,b)=>a[0].size-b[0].size;
    // var ArrAtmp=[...ArrAMultNoName].sort(funInc)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrBMultNoName, Ind)
    myResultWriter.Str["T2D_mult2"]=formatMatchingDataWDup(ArrAMultNoName, ArrBMultNoName, funMatch, funUnique, funUniqueC)


    myResultWriter.Str["T2D_HL"]=[]

    await myResultWriter.writeToFile()

    // var nChanged=arrSourceChanged.length, nMetaMatch=arrSourceMetaMatch.length, nNSM=arrSourceNSM.length, nMatchingStrName=arrSourceMatchingStrName.length, nMatchingId=arrSourceMatchingId.length, nSourceRem=arrSourceRem.length, nTargetRem=arrTargetRem.length;
    // var nCreate=nSourceRem, nDelete=nTargetRem;
    

    // var nSource=arrSource.length, nTarget=arrTarget.length, nUnTouched=arrSourceUnTouched.length
    // var objArgForScreen={nSource, nTarget, nUnTouched, nChanged, nMetaMatch, nNSM, nMatchingStrName, nMatchingId, nSourceRem, nTargetRem}
    //extend(objArgForScreen,{objHL}) 
    // this.storedArrays=[arrSourceUnTouched, arrTargetUnTouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceMatchingStrName, arrTargetMatchingStrName, arrSourceMatchingId, arrTargetMatchingId, arrSourceRem, arrTargetRem]

    return [null]; //objArgForScreen
  }

  async createSyncData(){  // Calculate hashcodes etc
    var {strCommandName, fiDir, fsDir, charTRes, leafFilterFirst, leafDb, flPrepend, nPrepend, arrDB, arrDBNonRelevant}=this

    
    var {arrSource, arrTarget, arrSourceUnTouched, arrTargetUnTouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNSM, arrTargetNSM, arrSourceMatchingStrName, arrTargetMatchingStrName, arrSourceMatchingId, arrTargetMatchingId, arrCreate, arrDelete, arrA1T1NoName, arrB1T1NoName, arrAMultNoName, arrBMultNoName, ArrAMultNoName, ArrBMultNoName}=this

    //var arrCreate=arrSourceRem, arrDelete=arrTargetRem
    if(this.boCompareOnly) {
      //var tStop=unixNow();   myConsole.log(`elapsed time ${(tStop-tStart)}ms`)
      return [null]
    }

      // "Reuse"-suffix: With reusable data (all except arrCreate/arrDelete and arrAMultNoName, arrBMultNoName)
    var arrSourceReuse=[].concat(arrSourceUnTouched,arrSourceChanged,arrSourceMetaMatch,arrSourceNSM,arrSourceMatchingStrName,arrSourceMatchingId, arrA1T1NoName); 
    var arrTargetReuse=[].concat(arrTargetUnTouched,arrTargetChanged,arrTargetMetaMatch,arrTargetNSM,arrTargetMatchingStrName,arrTargetMatchingId, arrB1T1NoName);

    // Data in db-file:  strType id strHash mtime size strName

      //  Update:
      //    strMTime: incase lower resolution was used on the old db-file
      //    strType: incase it was not set in old db-file
      //    strName:
      //      incase it directory-format (linux or windows) was different in old db-file
      //      for MetaMatch-cases (changed name)
    var arrOutReuse=arrTargetReuse
    for(var i=0;i<arrSourceReuse.length;i++){
      copySome(arrOutReuse[i], arrSourceReuse[i], ["strMTime", "size", "strType", "strName"])
    }

      // Rename arrTargetMetaMatch (strName is already overwritten above)

      // Copy renamed to origin
    for(var i in arrSourceNSM){
      var row=arrSourceNSM[i],   rowTarget=arrTargetNSM[i]
      rowTarget.id=row.id
    }

      // Changed
    for(var i in arrSourceChanged){
      var row=arrSourceChanged[i],   rowTarget=arrTargetChanged[i]
      myConsole.log(`Calculating hash for changed file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(rowTarget, {"strHash":strHash})
    }

      // Reused name
    for(var i in arrSourceMatchingStrName){
      var row=arrSourceMatchingStrName[i],   rowTarget=arrTargetMatchingStrName[i]
      myConsole.log(`Calculating hash for ReusedName file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(rowTarget, {"id":row.id, "strHash":strHash})
    }

      // Reused id
    for(var i in arrSourceMatchingId){
      var row=arrSourceMatchingId[i],   rowTarget=arrTargetMatchingId[i]
      myConsole.log(`Calculating hash for ReusedId file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(rowTarget, {"strHash":strHash})
    }

      // 1T1NoName
    for(var i in arrA1T1NoName){
      var row=arrA1T1NoName[i],   rowTarget=arrB1T1NoName[i]
      myConsole.log(`Calculating hash for 1T1NoName file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(rowTarget, {"strHash":strHash})
    }

      // MultNoName
    for(var i in arrAMultNoName){
      var row=arrAMultNoName[i]
      myConsole.log(`Calculating hash for MultNoName file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(row, {"strHash":strHash}) 
    }

      // Create
    for(var i in arrCreate){
      var row=arrCreate[i]
      myConsole.log(`Calculating hash for created file: ${row.strName}`)
      var [err, strHash]=await myMD5(row, fsDir); if(err) { return [err];} 
      extend(row, {"strHash":strHash}) 
    }

    var arrTargetNew=arrOutReuse.concat(arrCreate, arrAMultNoName)
      // Add flPrepend to strName if appropriate
    if(nPrepend>0){
      for(var row of arrTargetNew) row.strName=flPrepend+row.strName
    }

      // Add Non-relevant entries
    arrTargetNew.push(...arrDBNonRelevant)
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


/*********************************************************************
 * renameFinish functions
 *********************************************************************/

class RenameFinishToDb{
  constructor(args){
    copySome(this, args, ["fiDb", "charTRes"])
  }
  async read(){
    var {fiDb, charTRes}=this
      // Parse T2D_renamed
    var [err, arrRename]=await parseRenameInput(FsFile["T2D_renamed"]); if(err) {debugger; myConsole.error(err); return}
    var funInc=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
    arrRename.sort(funInc)

      // Parse fiDb
    var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
    var [err, arrDB]=await parseDb(fsDb, charTRes)
    if(err){
      if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
      else{debugger; myConsole.error(err); return}
    }
    arrDB.sort(funIncStrName)

    var [err, arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatching(arrRename, arrDB, ['strOld'], ['strName']);
    if(err) {debugger; myConsole.error(err); return;}

      // Rename arrDBMatch
    for(var i in arrRenameMatch){
      var row=arrRenameMatch[i]
      var rowDB=arrDBMatch[i]
      rowDB.strName=row.strNew
    }

    var arrDBNew=arrDBRem.concat(arrDBMatch)
    arrDBNew.sort(funIncStrName)
    
    extend(this, {fsDb, arrDBNew})

  }
  async makeChanges(){
    var {arrDBNew, fsDb}=this
    var [err]=await writeDbFile(arrDBNew, fsDb); if(err) {debugger; myConsole.error(err); return;}
  }
}


class RenameFinishToDbByFolder{
  constructor(args){
    copySome(this, args, ["fiDb", "charTRes"])
  }
  async read(args){
    var {fiDb, charTRes}=this

      // Parse leafRenameSuggestionsAncestorOnly
    var [err, arrRename]=await parseRenameInput(FsFile["T2T_ancestor"], "RelevantAncestor")
    if(err) {debugger; myConsole.error(err); return}
    var funInc=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
    arrRename.sort(funInc)

      // Parse fiDb
    //var fiDb=inpDb.value.trim()
    var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
    var {fiDb}=result
    var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
    var [err, arrDB]=await parseDb(fsDb, charTRes)
    if(err){
      if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
      else{debugger; myConsole.error(err); return}
    }
    arrDB.sort(funIncStrName)


    var funVal=function(val) {return val.strOld}
    var funB=function(rowB, l) {return rowB.strName.slice(0,l)}
    var funExtra=function(val) {return val.strOld.length}
    var [arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatchingOneToManyUnsortedFW(arrRename, arrDB, funVal, funB, funExtra)

    if(arrRenameMatch.length!=arrDBMatch.length) {var err=Error("Error: arrRenameMatch.length!=arrDBMatch.length"); debugger; myConsole.error(err); return;}

      // Rename arrDBMatch
    for(var i in arrRenameMatch){
      var row=arrRenameMatch[i]
      var rowDB=arrDBMatch[i]
      var strOld=row.strOld, l=strOld.length;
      rowDB.strName=row.strNew+rowDB.strName.slice(l)
    }

    var arrDBNew=arrDBRem.concat(arrDBMatch)
    arrDBNew.sort(funIncStrName)
    
    extend(this, {fsDb, arrDBNew})

  }
  async makeChanges(){
    var {arrDBNew, fsDb}=this
    var [err]=await writeDbFile(arrDBNew, fsDb); if(err) {debugger; myConsole.error(err); return;}
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

var compareTreeToTree=async function(args){
  var {fiDirSource, fiDirTarget, charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend}=args
  var tStart=unixNow()
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; return [err];}
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; return [err];}

  var treeParser=new TreeParserPython()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) {debugger; return [err];}
  var tStop=unixNow();   //myConsole.log(`Source parsed, elapsed time ${(tStop-tStart)}ms`)
  var funIncId=(a,b)=>a.id-b.id;
  //arrSourcef.sort(funIncId)

  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, charTRes); if(err) {debugger; return [err];}
  //arrTargetf.sort(funIncId)

  var strCommandName='compareTreeToTree'
  var myResultWriter=new MyResultWriter(StrStemT2T)
  var comparisonWOID=new ComparisonWOID(arrSourcef, arrTargetf, strCommandName, myResultWriter)
  var [err]=comparisonWOID.runOps(); if(err) {debugger; return [err];}

  comparisonWOID.format(settings.leafDb) //fsDirTarget, 
  myResultWriter.writeToFile()
  var objArgForScreen=comparisonWOID.getArgForScreen()
  //var strSeeMore=myResultWriter.getSeeMoreMessage()
  //var boRemaining=myResultWriter.Str['T2T_resultMore'].length
  //myConsole.log(myResultWriter.Str['screen'].concat(strSeeMore).join('\n'))
  divT2T.setVal(objArgForScreen); //boRemaining

  //myConsole.log(`elapsed time ${(unixNow()-tStart)}s`)
  return [null]
}


class RenameFinishToTree{
  constructor(args){
    var {boDir=false, strStartToken=null}=args
    copySome(this, args, ["fiDir", "fsRenameFile"])
    extend(this, {boDir, strStartToken})
  }
  async read(){
    var {fiDir, fsRenameFile, strStartToken}=this

    var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
    this.fsDir=fsDir

    var [err, arrRename]=await parseRenameInput(fsRenameFile, strStartToken); if(err) {debugger; myConsole.error(err); return}
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

      // Parse trees
    var treeParser=new TreeParserPython()
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, charTRes, leafFilterFirst); if(err) { return [err];}
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, charTRes); if(err) { return [err];}

      // Separate out untouched files
    arrSourcef.sort(funIncStrName);   arrTargetf.sort(funIncStrName);
    var [err, arrSourcefUntouched, arrTargetfUntouched, arrSourcefRem, arrTargetfRem]=extractMatching(arrSourcef, arrTargetf, ['strName', 'sm'])

      // Separate out existing Folders
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
    var strMess=`Deleting ${lenTargetf} 🗎, ${lenTargetF} 🗀
Creating ${lenSourceF} 🗀, ${lenSourcef} 🗎` // file${pluralS(lenTargetf)}.  folder${pluralS(lenSourceF)}  file${pluralS(lenSourcef)} folder${pluralS(lenTargetF)}.
    return strMess
  }
  async makeChanges(){
    var {fsDirSource, fsDirTarget, arrSourcefRem, arrSourceFRem, arrTargetfRem, arrTargetFRem}=this
    //var [err]=await myRmFiles(arrTargetfRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
    //var [err]=await myMkFolders(arrSourceFRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
    //var [err]=await myCopyEntries(arrSourcefRem, fsDirSource, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
    //var [err]=await myRmFolders(arrTargetFRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrTargetfRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFiles(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrTargetFRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myRmFolders(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrSourceFRem.map(row=>fsDirTarget+charF+row.strName)
    var [err]=await myMkFolders(StrTmp);  if(err) {debugger; myConsole.error(err); return;}
    var StrTmp=arrSourcefRem.map(row=>row.strName)
    var [err]=await myCopyEntries(StrTmp, fsDirSource, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  }
}



// var compareTreeToDbSMOnly=async function(args){
//   var {fiDir, leafDb=settings.leafDb, flPrepend, charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter}=args
//   var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
//   // var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
//   // var leafDb=basename(fiDb)
//   var fsDb=fsDir+charF+leafDb

//     // Parse tree
//   var treeParser=new TreeParserPython()
//   var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
//   removeLeafDbFromArrTreef(arrTreef, leafDb)
//     // Parse fsDb
//   var [err, arrDB]=await parseDb(fsDb, charTRes)
//   if(err){
//     if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
//     else{debugger; myConsole.error(err); return}
//   }

//   var [arrDBNonRelevant, arrDBRelevant]=selectFrArrDB(arrDB, flPrepend)
//   var arrDBOrg=arrDB, arrDB=arrDBRelevant


//   var strCommandName='compareTreeToDbSMOnly'
//   var myResultWriter=new MyResultWriter(StrStemT2T)
//   var comparisonWOID=new ComparisonWOID(arrTreef, arrDB, strCommandName, myResultWriter)
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
  var [err, arrDBS]=await parseDb(fsDbS, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiDbOther
  var [err, fsDbOther]=await myRealPath(args.fiDbOther); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBOther]=await parseDb(fsDbOther, charTRes)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDBOther=[]}
    else{debugger; myConsole.error(err); return}
  }

    // Parse tree
  var [err, fsDir]=await myRealPath(args.fiDirT); if(err) {debugger; myConsole.error(err); return;}
  var treeParser=new TreeParserPython()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  var nPrepend=flPrepend.length
  var [arrDBOtherNonRelevant, arrDBOtherRelevant] =selectFrArrDB(arrDBOther, flPrepend)
  var arrDBOtherOrg=arrDBOther,   arrDBOther=arrDBOtherRelevant

  // var [arrTreefNonRelevant, arrTreefRelevant] =selectFrArrDB(arrTreef, flPrepend)
  // arrTreefOrg=arrTreef;   arrTreef=arrTreefRelevant


  arrTreef.sort(funIncStrName);   arrDBS.sort(funIncStrName)
  var [err, arrTreeMatch, arrDBSMatch, arrTreeRem, arrDBSRem]=extractMatching(arrTreef, arrDBS, ['strName'], ['strName']);
  if(err) {debugger; myConsole.error(err); return;}

  //if(arrTreeRem.length || arrDBRem.length) return "Error "+"arrTreeRem.length OR arrDBRem.length"
  //if(arrTreeRem.length) return "Error: "+"arrTreeRem.length"

  for(var i in arrDBSMatch){
    var rowDBS=arrDBSMatch[i]
    var rowTree=arrTreeMatch[i]
    rowDBS.id=rowTree.id
  }

  var arrDBOtherNew=arrDBSMatch
  if(nPrepend>0){
    for(var row of arrDBOtherNew) row.strName=flPrepend+row.strName
  }

  arrDBOtherNew=arrDBOtherNonRelevant+arrDBOtherNew
  arrDBOtherNew.sort(funIncStrName)
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBOtherNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDBOtherNew, fsDbOther); if(err) {debugger; myConsole.error(err); return;}
}


/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(leafFilterFirst=settings.leafFilter){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-s', "--fiDirSource", default='.')
  //var fiDirSource=inpSource.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDirSource}=result
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(fsDirSource); if(err) {debugger; myConsole.error(err); return}

  var treeParser=new TreeParserPython()
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
  var [err]=await Neutralino.filesystem.writeFile(leafResult, strTmp).toNBP(); if(err) {debugger; myConsole.error(err); return;}

  var leafResultRs='resultFrTestFilterRs.txt'
  var StrOut=[]
  for(var row of arrRsf) StrOut.push(row.strName)
  for(var row of arrRsF) StrOut.push(row.strName)
  StrOut.push('  arrRsOther:\n')
  for(var row of arrRsOther) StrOut.push(row)
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(leafResultRs, strTmp).toNBP(); if(err) {debugger; myConsole.error(err); return;}


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
  var treeParser=new TreeParserPython()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  
    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

    // fiDb
  //var fiDb=inpDb.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDb}=result
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  arrTreef.sort(funIncStrName);   arrDB.sort(funIncStrName)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])

  //if(arrTreeRem.length || arrDBRem.length) return "Error: "+"arrTreeRem.length OR arrDBRem.length"
  if(arrTreeRem.length) {var err=Error("Error: "+"arrTreeRem.length"); debugger; myConsole.error(err); return;}  

  for(var i in arrDBMatch){
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID() // Add uuid if it doesn't exist
    var rowDB=arrDBMatch[i]
    var row=arrTreeMatch[i]
    rowDB.id=row.id // Copy id
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDBNew, fsDb); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('Done')
}



var convertDbFileToHashcodeFile=async function(){ // Add id and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDb
  //var fiDb=inpDb.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDb}=result
  var [err, fsDb]=await myRealPath(fiDb); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  var arrDBNew=arrDB
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to hash-file.`)
    if(!boOK) return
  }
  var [err]=await writeHashFile(arrDBNew, fsHash)
  myConsole.log('Done')
}





var sortHashcodeFile=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

  arrDB.sort(funIncStrName)

  var [err]=await writeHashFile(arrDB, fsHash); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('Done')
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
  var treeParser=new TreeParserPython()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fiDb
  var [err, arrDB]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  arrTreef.sort(funIncStrName);  arrDB.sort(funIncStrName)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])
  if(err) {debugger; myConsole.error(err); return;}


  for(var i in arrDBMatch){
    var rowDB=arrDBMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID()
    rowDB.id=rowTree.id
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDBNew, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('Done')
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
  var treeParser=new TreeParserPython()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, charTRes, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  removeLeafDbFromArrTreef(arrTreef, leafDb)
    // Parse fiDb
  var [err, arrDB]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  arrTreef.sort(funIncStrName);  arrDB.sort(funIncStrName)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])


  for(var i in arrDBMatch){
    var rowDB=arrDBMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID()
    rowDB.id=rowTree.id
  }

  var arrDBNew=arrDB
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDBNew, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('Done')
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
  var [err, arrDBS]=await parseDb(fsDbS, charTRes); if(err) {debugger; myConsole.error(err); return}

    // Parse fiDbT
  var [err, fsDbT]=await myRealPath(args.fiDbT); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBT]=await parseDb(fsDbT, charTRes); if(err) {debugger; myConsole.error(err); return}

  var [arrDBTNonRelevant, arrDBTRelevant] =selectFrArrDB(arrDBT, args.flPrepend)
  var arrDBTOrg=arrDBT,   arrDBT=arrDBTRelevant


  arrDBS.sort(funIncStrName);   arrDBT.sort(funIncStrName)
  var [err, arrDBSMatch, arrDBTMatch, arrDBSRem, arrDBTRem]=extractMatching(arrDBS, arrDBT, ['strName'])

    // Move uuid to arrDBMatch
  // for(var i in arrDBSMatch){
  //   var row=arrDBSMatch[i]
  //   rowT=arrDBTMatch[i]
  //   rowT.uuid=row.uuid
  // }

  for(var row of arrDBT){
    row.strName=flPrepend+row.strName
  }

  var arrDBNew=arrDBTNonRelevant.concat(arrDBTMatch, arrDBTRem)
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDBNew, fsDbT); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('Done')
}

var utilityAddToDbStrName=async function(){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst=settings.leafFilter, flPrepend}=args
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiDb", default='buvtDb.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiDbS
  var [err, fsDb]=await myRealPath(args.fiDb); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseDb(fsDb, charTRes); if(err) {debugger; myConsole.error(err); return}
  arrDB.sort(funIncStrName)

  var nPrepend=flPrepend.length


  //flPrependTmp=flPrepend+"/" if(nPrepend) else ""
  for(var row of arrDB){
    row.strName=flPrepend+row.strName
  }
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDB.length} entries to db-file.`)
    if(!boOK) return
  }
  var [err]=await writeDbFile(arrDB, fsDb); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('Done')
}


var deleteResultFilesasync=async function(){ 
  for(const strTmp of StrStemReport){
    let fsFile=FsFile[strTmp]

    var [err, result]=await Neutralino.filesystem.removeFile(fsFile).toNBP();
    if(err) {
      if(err.code=='NE_FS_FILRMER') myConsole.log("Couldn't delete: "+fsFile)
      else {debugger; myConsole.error(err); return}
    }
    myConsole.log("Deleted: "+basename(fsFile))
  }
}