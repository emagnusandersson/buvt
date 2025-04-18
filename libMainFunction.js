
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

  var objTreef=bucketify(arrTreef, 'id'),  nIdf=Object.keys(objTreef).length
  var [objMult, nMultf]=extractBucketsWMultiples(objTreef),  nMultIdf=Object.keys(objMult).length;
  var objTreeF=bucketify(arrTreeF, 'id'),  nIdF=Object.keys(objTreeF).length
  var [objMult, nMultF]=extractBucketsWMultiples(objTreeF),  nMultIdF=Object.keys(objMult).length;

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



var getHashMultSMNonUniform=async function(arg){
  var {charTRes=settings.charTRes, fiSourceDir, charSide='S'}=arg
  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var fsDb=fsSourceDir+charF+settings.leafDb

    // Parsing fsDb (database)
  var [err, strData]=await readStrFile(fsDb);
  if(err){
    if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
    else{ debugger; return [err]}
  }
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
  var PathCur=PathHashMult
  var myResultWriter=new MyWriter(PathCur)

  arrDb.sort(funDecSM);
  var objHash=bucketify(arrDb, 'strHash'),  nPatHash=Object.keys(objHash).length
  var [objHashMult, nHashMult, arrSingle]=extractBucketsWMultiples(objHash),  nPatHashMult=Object.keys(objHashMult).length;
  var objHashMultSMNonUniform={}, objHashMultSMUniform={}, nTotNonUniform=0, nTotUniform=0
  for(var k in objHashMult){
    var arr=objHashMult[k], sm0=arr[0].sm, boNonUniformSM=false
    for(var i=1;i<arr.length;i++){
      var {sm}=arr[i];
      if(sm0!=sm) {boNonUniformSM=true; break;}
    }
    if(boNonUniformSM) { objHashMultSMNonUniform[k]=arr; nTotNonUniform+=arr.length;}
    else {objHashMultSMUniform[k]=arr; nTotUniform+=arr.length;}
  }
  var nPatNonUniform=Object.keys(objHashMultSMNonUniform).length
  var nPatUniform=Object.keys(objHashMultSMUniform).length

  var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
  var StrLongList=formatMatchingDataWMultSingleDataSet(objHashMultSMNonUniform, funMatch, funUnique)
  var StrNonUniform=formatTitle(StrLongList)
  var strHead=`string\nstrHash\nint int64 string\nsize mtime_ns64Floored strName`;
  if(StrLongList.length) StrLongList.unshift(strHead);   myResultWriter.Str.hashMultSMNonUniform=StrLongList

  var funMatch=s=>`MatchingData ${s.strHash} ${s.size.myPadStart(10)} ${s.mtime_ns64}`,  funUnique=s=>`  ${s.strName}`;
  var StrLongList=formatMatchingDataWMultSingleDataSet(objHashMultSMUniform, funMatch, funUnique)
  var StrUniform=formatTitle(StrLongList)
  var strHead=`string size mtime_ns64Floored\nstrHash int int64\nstring\nstrName`;
  if(StrLongList.length) StrLongList.unshift(strHead);   myResultWriter.Str.hashMultSMUniform=StrLongList

  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  return [null, {nTotNonUniform, nPatNonUniform, nTotUniform, nPatUniform, StrNonUniform, StrUniform}]
}


class SMMultWork{
  constructor(){ }
  async getSMMultHashNonUniform(arg){
    var {fiDir, fiDbDir, charTRes, strHostTarget, boRemote}=arg
    var [err, fsDbDir]=await myRealPath(fiDbDir, strHostTarget); if(err) {debugger; return [err];}
    var fsDb=fsDbDir+charF+settings.leafDb

    
    var fsTmp=pathSMReserved.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrReserved]=parseDb(strData, charTRes); if(err) return [err]
    var StrLongList=arrReserved.map(r=>`${r.size.myPadStart(10)} ${r.mtime_ns64Floored} ${r.strName}`)
    var StrReserved=formatTitle(StrLongList)
    var nReserved=arrReserved.length

      // Parsing fsDb (database)
    var [err, strData]=await readStrFile(fsDb);
    if(err){
      if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
      else{ debugger; return [err]}
    }
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var PathCur=PathSMMult
    var myResultWriter=new MyWriter(PathCur)

    arrDb.sort(funDecSM);
    var objSM=bucketify(arrDb, 'sm'),  nPatSM=Object.keys(objSM).length
    var [objSMMult, nSMMult, arrSingle]=extractBucketsWMultiples(objSM),  nPatSMMult=Object.keys(objSMMult).length;
    var objSMMultHashNonUniform={}, objSMMultHashUniform={}, nTotNonUniform=0, nTotUniform=0
    for(var k in objSMMult){
      var arr=objSMMult[k], hash0=arr[0].strHash, boNonUniformHash=false
      for(var i=1;i<arr.length;i++){
        var {strHash}=arr[i];
        if(hash0!=strHash) { boNonUniformHash=true; break; }
      }
      if(boNonUniformHash) { objSMMultHashNonUniform[k]=arr; nTotNonUniform+=arr.length;}
      else {objSMMultHashUniform[k]=arr; nTotUniform+=arr.length;}
    }
    var nPatNonUniform=Object.keys(objSMMultHashNonUniform).length
    var nPatUniform=Object.keys(objSMMultHashUniform).length

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUnique=s=>`  ${s.strHash} ${s.strName}`;
    var StrLongList=formatMatchingDataWMultSingleDataSet(objSMMultHashNonUniform, funMatch, funUnique)
    var StrNonUniform=formatTitle(StrLongList)
    var strHead=`int int64\nsize mtime_ns64Floored\nstring string\nstrHash strName`;
    if(StrLongList.length) StrLongList.unshift(strHead); myResultWriter.Str.smMultHashNonUniform=StrLongList

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored} ${s.strHash}`,  funUnique=s=>`  ${s.strName}`;
    var StrLongList=formatMatchingDataWMultSingleDataSet(objSMMultHashUniform, funMatch, funUnique)
    var StrUniform=formatTitle(StrLongList)
    var strHead=`int int64\nsize mtime_ns64Floored\nstring string\nstrHash strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);   myResultWriter.Str.smMultHashUniform=StrLongList

    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
    extend(this, {fsDb, arrDb, fsDbDir, boRemote, strHostTarget, charTRes})

    return [null, {StrNonUniform, StrUniform, nTotNonUniform, nPatNonUniform, nTotUniform, nPatUniform, nReserved, StrReserved}]
  }

  async calcTDiff(){
    var {fsDb, arrDb, fsDbDir, boRemote, strHostTarget, charTRes}=this

    var fsTmp=PathSMMult.smMultHashNonUniform.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true); if(err) return [err]
    var fsTmp=pathSMReserved.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrReserved]=parseSSVWType(strData); if(err) return [err]

    var BoSizeMTime={}

    arrDb.sort(funDecSM);
    var objSize=bucketify(arrDb, 'size')
    for(var s in objSize){
      var arr=objSize[s];   BoSizeMTime[s]={}
      for(var i=0;i<arr.length;i++){ var row=arr[i], {mtime_ns64Floored}=row;  BoSizeMTime[s][mtime_ns64Floored]=true; }
    }

    for(var i=0;i<arrReserved.length;i++){
      var row=arrReserved[i], {size, mtime_ns64}=row;
      funSetMTime(row, charTRes)
      if(!(size in BoSizeMTime)) BoSizeMTime[size]={}; 
      BoSizeMTime[size][row.mtime_ns64Floored]=true; 
    }
  
    var tDiffMax_ns=1e11
    var arrRewrite=[], StrMakeUniform=[]
    for(var k in obj){
      var arrArr=Object.values(obj[k])
        // Sort so that longest hash-set is first
      arrArr.sort((A,B)=>{var a=A.length, b=B.length; return (a<b) ? 1 : ((a>b)?-1:0)});
      var tDiff_ns=BigInt(0)
      var r00=arrArr[0][0], {size, mtime_ns64Floored, strName}=r00; StrMakeUniform.push(`MatchingData ${size} ${mtime_ns64Floored}`)
      for(var i=1;i<arrArr.length;i++){ // Skipping the first hash-set
          // Find mtime_ns64FlooredNew
        var row0=arrArr[i][0], {size, mtime_ns64Floored, strName}=row0; 
        while(1){
          tDiff_ns+=IntTDiv[charTRes];    if(tDiff_ns>tDiffMax_ns) {debugger; return [Error(`New time could not be calculated: tDiff_ns: ${tDiff_ns} ${strName}`)]; }
          var mtime_ns64FlooredNew=mtime_ns64Floored+tDiff_ns
          if(mtime_ns64FlooredNew in BoSizeMTime[size]) {continue;} else { BoSizeMTime[size][mtime_ns64FlooredNew]=true;  break;}
        }
          // Assign mtime_ns64FlooredNew to all files with the same hash
        for(var j=0;j<arrArr[i].length;j++){
          var row=arrArr[i][j];  
          funSetMTime(row, charTRes, mtime_ns64FlooredNew)
          arrRewrite.push(row);
          var {strHash, strName}=row;   StrMakeUniform.push(`  ${tDiff_ns} ${strHash} ${strName}`)
        } 
      }
    }
  
    var myResultWriter=new MyWriter([pathMTimeRewrite])
    var StrLongList=StrMakeUniform
    //var StrFeedBack=StrLongList.slice(0,nShortListMax); if(StrFeedBack.length==nShortListMax) StrFeedBack.push('⋮');
    var StrFeedBack=formatTitle(StrLongList)
    var strHead=`int int64\nsize mtime_ns64Floored\nint64 string string\ntDiff_ns strHash strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);     myResultWriter.Str[0]=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  
    extend(this, {arrRewrite})
    var nRewrite=arrRewrite.length
  
    return [null, {StrMakeUniform:StrFeedBack, nRewrite}]
  }
  async mySetMTime(){
    var {fsDb, fsDbDir, boRemote, strHostTarget, charTRes}=this; //, arrRewrite

      // Parsing fsDb (database)
    var [err, strData]=await readStrFile(fsDb);
    if(err){
      if(err.code==STR_ENOENT){err=null; strData=""}  //STR_NE_FS_FILRDER
      else{ debugger; return [err]}
    }
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var fsTmp=pathMTimeRewrite.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true); if(err) return [err]
    var arrRewrite=[];  for(var k in Arr){ var arr=Arr[k]; arrRewrite=arrRewrite.concat(arr); }
    arrDb.sort(funIncStrName);   arrRewrite.sort(funIncStrName)
    var [err, arrDbMatch, arrRewriteMatch, arrDbRem, arrRewriteRem]=extractMatching(arrDb, arrRewrite, ['strName']); if(err) {debugger; return [err];}
    if(arrRewriteRem.length) {debugger; return [Error("arrRewriteRem.length>0")];}

    for(var i=0;i<arrDbMatch.length;i++){
      var rowDb=arrDbMatch[i], rowNew=arrRewriteMatch[i], {tDiff_ns}=rowNew, {mtime_ns64}=rowDb;
      var mtime_ns64=mtime_ns64+tDiff_ns
      funSetMTime(rowDb, charTRes, mtime_ns64)
      extend(rowNew, {mtime_ns64, mtime_ns64Floored:rowDb.mtime_ns64Floored})
    }

    var [err]=await setMTime(arrRewrite, fsDbDir, strHostTarget);  if(err) {debugger; return [err];}

    var [err]=await writeDbWrapper(fsDb, strHostTarget, boRemote, arrDb); if(err) { return [err];}
    return [null]
  }
}
// touch -m -d '@1716905369.022141964' b1_.txt
// touch -m -d '@1716905369.022141964' b1.txt b1__.txt b1__b.txt


/****************************************************************************************
 * S_ / T_ (T2D)
 ****************************************************************************************/

class SyncDbI{
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
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    //var myResultWriter=new MyResultWriter(StrStemT2D)
    var PathCur=gThis[`Path${charSide}`]
    var myResultWriter=new MyWriter(PathCur)


        // Id match (Checking for hard links)

      // Count duplicate ids in tree
    var objTreef=bucketify(arrTreef, 'id'),  nIdf=Object.keys(objTreef).length
    var [objTreefDup, nMultf]=extractBucketsWMultiples(objTreef),  nMultIdf=Object.keys(objTreefDup).length;
    var objTreeF=bucketify(arrTreeF, 'id'),  nIdF=Object.keys(objTreeF).length
    var [objTreeFDup, nMultF]=extractBucketsWMultiples(objTreeF),  nMultIdF=Object.keys(objTreeFDup).length;

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    var objDb=bucketify(arrDb, 'id'),  nIdDb=Object.keys(objDb).length
    var [objDbDup, nMultDb]=extractBucketsWMultiples(objDb),  nMultIdDb=Object.keys(objDbDup).length;

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
      var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
      
      var Str=([].concat(StrTmpF, StrTmpf));
      //if(Str.length>nShortListMax) StrTmpShortList.push('⋮'); 
      var strHov=formatTitleStr(Str)
      this.objHL.strTmpShortList=strHov
      return [null];
    }

      // Hash match
    // var objHash=bucketify(arrDb, 'strHash'),  nPatHash=Object.keys(objHash).length
    // var [objHashDup, nHashMult]=extractBucketsWMultiples(objHash),  nPatHashMult=Object.keys(objHashDup).length;
    // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    // var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
    // this.objHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
    // myResultWriter.Str.hash=StrTmp


      // Mult 1 (Multiple SM in all files)

    arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
    var [RelationSM]=categorizeByProp(arrTreef, arrDb, row=>row.sm)
    var Mat1=this.Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(RelationSM);
    Mat1.setMTMLabel()
    formatMultiPots(myResultWriter,Mat1,1)


        // Categorize files

    var arrSource=arrTreef, arrTarget=arrDb
    arrSource.forEach(row=>row.strSide='S'); arrTarget.forEach(row=>row.strSide='T');
      // Extract untouched, inm
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrSourceUntouched, arrTargetUntouched, arrSourceRem, arrTargetRem]=extractMatching(arrSource, arrTarget, ['strName', 'id', 'sm']); if(err) {debugger; return [err];}
    this.boChanged=Boolean(arrSourceRem.length)||Boolean(arrTargetRem.length)

    var arrSourceTouched=arrSourceRem, arrTargetTouched=arrTargetRem


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
    var [RelM2]=categorizeByProp(arrSourceRem, arrTargetRem, row=>row.sm)
    var Mat2=new MatNxN();  Mat2.assignFromObjManyToMany(RelM2);
    extend(this, {RelM2, Mat2})
    var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
    var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
    var arrSourceM1T1=[].concat(Mat2.arrA[1][1]);
    var arrTargetM1T1=[].concat(Mat2.arrB[1][1]);
    var ArrSourceMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
    //var arrSourceMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    //var arrTargetMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
    // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
    //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭
  


    myResultWriter.Str.allS=formatListForFile(arrSource, ...ObjKeyList['allS']);
    myResultWriter.Str.allT=formatListForFile(arrTarget, ...ObjKeyList['allT']);

      // Copy strHash for shortcut actions (IM and NM)
    for(var i=0;i<arrTargetIM.length;i++){ arrSourceIM[i].strHash=arrTargetIM[i].strHash; }
    for(var i=0;i<arrTargetNM.length;i++){ arrSourceNM[i].strHash=arrTargetNM[i].strHash; }


    var ObjKey={
      '1T1':[['id', 'size', 'mtime_ns64Floored'], ['strSide', 'strType', 'mtime_ns64', 'strName']],
      'M1T1':[['size', 'mtime_ns64Floored'], ['strSide', 'strType', 'id', 'mtime_ns64', 'strName']],
      NM:[['size', 'strHash', 'mtime_ns64Floored', 'strName'], ['strSide', 'strType', 'id', 'mtime_ns64']],
      changed:[['id', 'strName'], ['strSide', 'strType', 'size', 'mtime_ns64']],
      reusedName:[['strName'], ['strSide', 'strType', 'id', 'size', 'mtime_ns64']],
      reusedId:[['id'], ['strSide', 'strType', 'size', 'mtime_ns64', 'strName']],
    }
    //var KeyT=Object.keys(ObjKey)

    for(var i=0;i<arrSourceUntouched.length;i++){ arrSourceUntouched[i].strHash=arrTargetUntouched[i].strHash; }
    myResultWriter.Str.untouched=formatListForFile(arrSourceUntouched, ...ObjKeyList['untouched']);
    var arrUntouched=arrSourceUntouched

  
    extend(this, {arrSource, arrTarget, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, arrUntouched}); //, arrSourceMMult, arrTargetMMult

    

    myResultWriter.Str.defragmented=formatRelationForFile(arrSourceNM, arrTargetNM, ...ObjKey['NM']);
    myResultWriter.Str.changed=formatRelationForFile(arrSourceChanged, arrTargetChanged, ...ObjKey['changed']);
    myResultWriter.Str.reusedName=formatRelationForFile(arrSourceReusedName, arrTargetReusedName, ...ObjKey['reusedName']);
    myResultWriter.Str.reusedId=formatRelationForFile(arrSourceReusedId, arrTargetReusedId, ...ObjKey['reusedId']);


      // Renamed i_m
    myResultWriter.Str.renamed=formatRename1T1(arrSourceIM, arrTargetIM, true)
    myResultWriter.Str.created=formatListForFile(arrCreate, ...ObjKeyList['created']);
    myResultWriter.Str.deleted=formatListForFile(arrDelete, ...ObjKeyList['deleted']);
    myResultWriter.Str.M1T1=formatRename1T1(arrSourceM1T1, arrTargetM1T1, false)


      // MMult
    setBestNameMatchFirst(ArrSourceMMult, ArrTargetMMult)

    //   // Sort by size
    // ArrSourceMMult.forEach((el, i)=>el.ind=i); // Set index
    // var funInc=(a,b)=>a[0].size-b[0].size;
    // var ArrAtmp=[...ArrSourceMMult].sort(funInc)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrTargetMMult, Ind)
    var ObjFeedback={}
    var Str=myResultWriter.Str.STMatch2=formatMatchingDataWMult(ArrSourceMMult, ArrTargetMMult);
    //var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=formatTitleStr(Str)
    ObjFeedback.objSTMatch2={strHov, nFile:undefined}
    extend(this, {ObjFeedback});


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
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    var PathCur=gThis[`Path${charSide}`]

      // allS, allT
    var fsTmp=PathCur.allS.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrSource]=parseSSVWType(strData); if(err) return [err]
    var fsTmp=PathCur.allT.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrTarget]=parseSSVWType(strData); if(err) return [err]
    
      // untouched
    var fsTmp=PathCur.untouched.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrUntouched]=parseSSVWType(strData); if(err) return [err]

      // M1T1
    var funForRenamed=row=>{
      if(row.strMTime=="seeAbove") row.strMTime=row.strMTimeFloored;
      row.mtime_ns64=BigInt(row.strMTime); row.mtime_ns64Floored=BigInt(row.strMTimeFloored);
    }

    

    var fsTmp=PathCur.renamed.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceIM=[], T:arrTargetIM=[]}]=parseRelations(strData); if(err) return [err]
    arrTargetIM.forEach(funForRenamed); arrSourceIM.forEach(funForRenamed)

    var fsTmp=PathCur.defragmented.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceNM=[], T:arrTargetNM=[]}]=parseRelations(strData);if(err) return [err]

    var fsTmp=PathCur.changed.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceChanged=[], T:arrTargetChanged=[]}]=parseRelations(strData); if(err) return [err]

    var fsTmp=PathCur.reusedName.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceReusedName=[], T:arrTargetReusedName=[]}]=parseRelations(strData); if(err) return [err]

    var fsTmp=PathCur.reusedId.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceReusedId=[], T:arrTargetReusedId=[]}]=parseRelations(strData); if(err) return [err]

    var fsTmp=PathCur.M1T1.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceM1T1=[], T:arrTargetM1T1=[]}]=parseRelations(strData); if(err) return [err]
    arrSourceM1T1.forEach(funForRenamed); arrTargetM1T1.forEach(funForRenamed);

      // Created/Deleted
    // var fsTmp=PathCur.created.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    // var [err, arrCreate]=parseSSVWType(strData); if(err) return [err]
    // var fsTmp=PathCur.deleted.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    // var [err, arrDelete]=parseSSVWType(strData); if(err) return [err]
    // extend(this, {arrCreate, arrDelete})

      // Mult
    // var fsTmp=PathCur.STMatch2.fsName
    // var [err, objSourceMMult, objTargetMMult, arrSourceMMult, arrTargetMMult, RelM2]=await parseMultSTFile(fsTmp); if(err) {debugger; return [err];}
    // var Mat2=new MatNxN();  Mat2.assignFromObjManyToMany(RelM2);
    // extend(this, {RelM2, Mat2})

    //extend(this, {arrSource, arrTarget, arrUntouchedWOExactMTime, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1})
    
    extend(this, {arrSource, arrTarget, arrUntouched, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrSourceM1T1, arrTargetM1T1})
    return [null]
  }

  async createSyncData(){  // Calculate hashcodes etc


    var {fsDbDir, flPrepend, arrDbNonRelevant, strHost, boRemote}=this
    var {arrDb, arrUntouchedWOExactMTime, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, RelM2, Mat2}=this; //, arrSourceMMult, arrTargetMMult
    var {arrSource, arrTarget, arrUntouched, arrSourceBF}=this;

      // Shortcut
    var arrSC=[].concat(arrSourceIM, arrSourceNM), nSC=arrSC.length;

      // arrSourceBF (Brute force)
    var arrMold=[].concat(arrUntouched, arrSC); arrMold.sort(funIncStrName);
    var [err, arrTrash, arrMoldTrash, arrSourceBF, arrMoldRemShouldBeZero]=extractMatching(arrSource, arrMold, ['strName']); if(err) return [err];
    if(arrMoldRemShouldBeZero.length) {debugger; return [Error("arrMoldRemShouldBeZero.length>0")];}
    var nBF=arrSourceBF.length;

      // arrTargetDelete (to be deleted)
    var arrMold=[].concat(arrUntouched, arrTargetIM); arrMold.sort(funIncStrName);
    var [err, arrTrash, arrMoldTrash, arrTargetDelete, arrMoldRemShouldBeZero]=extractMatching(arrTarget, arrMold, ['strName']); if(err) return [err];
    if(arrMoldRemShouldBeZero.length) {debugger; return [Error("arrMoldRemShouldBeZero.length>0")];}
    var nTargetDelete=arrTargetDelete.length;


      // Quick return
    var strMess=`Delete: ${nTargetDelete}\nHashcode-calculations: ${nBF}\nShortcut: ${nSC}`
    var boAbort=nTargetDelete==0 && nBF==0 && nSC==0
    if(boAbort) return [null, boAbort]


      // Brute force work
    var [err, StrHash]=await calcHashes(arrSourceBF, fsDbDir, strHost); if(err) { return [err];}
    if(StrHash.length!=nBF) { return [Error('StrHash.length!=nBF')];}
    for(var i=0;i<nBF;i++){
      var row=arrSourceBF[i], strHash=StrHash[i]
      if(strHash.length!=32) { return [Error('strHash.length!=32')];}
      row.strHash=strHash
    }


    var arrTargetNew=[].concat(arrUntouched, arrSC, arrSourceBF); //arrSourceUntouched, 
      // Add flPrepend to strName if appropriate
    if(flPrepend.length>0){
      for(var row of arrTargetNew) row.strName=flPrepend+row.strName
    }

      // Add Non-relevant entries
    //arrTargetNew.push(...arrDbNonRelevant)
    arrTargetNew=arrTargetNew.concat(arrDbNonRelevant)
    arrTargetNew.sort(funIncStrName)
    this.arrTargetNew=arrTargetNew

    return [null, false]

  }

  async writeDb(){
    var {fsDb, strHost, boRemote, arrTargetNew}=this

    var [err]=await writeDbWrapper(fsDb, strHost, boRemote, arrTargetNew); if(err) { return [err];}

    // var fsTmp=PathLoose.remoteFileLocally.fsName
    // var fsDbLoc=boRemote?fsTmp:fsDb
    // var strData=formatDb(arrTargetNew)
    // var [err]=await writeDbFile(strData, fsDbLoc); if(err) { return [err];}

    // if(boRemote){
    //   var arrCommand=['scp', fsDbLoc, strHost+':'+fsDb]
    //   var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    //   if(stdErr) { 
    //     if(stdErr.indexOf('No such file or directory') ){boDbRemoteExist=false} else {debugger; return [stdErr];}
    //   }
    //   else if(exitCode) { debugger; return [Error(stdErr)]; };
    // }

    return [null]
  }
}

var ClassObj={
  strSide:{type:'string'},
  strType:{type:'string'},
  strHash:{type:'string'},
  strName:{type:'string'},
  id:{type:'string'},
  size:{type:'int', toMatch:v=>v.myPadStart(10)},
  mtime_ns64:{type:'int64'},
  mtime_ns64Floored:{type:'int64', toMatch:v=>v.toString().padStart(19)},
  //strMTimeFloored:{type:'int', toMatch:v=>v.padStart(19)},
}
var formatRelationForFile=function(ArrS, ArrT, KeyM, KeyU){
  var nS=ArrS.length, nT=ArrT.length
  if(nS==0 && nT==0) return []
  var boArrInArr=false; if(nS && ArrS[0] instanceof Array) boArrInArr=true
  if(nT && ArrT[0] instanceof Array) boArrInArr=true
  var arrOut=[]

  var StrT=[], StrN=[]
  for(var k of KeyM){ var c=ClassObj[k], t=c.type??'string', n=c.name??k; StrT.push(t); StrN.push(n); }
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  var StrT=[], StrN=[]
  for(var k of KeyU){ var c=ClassObj[k], t=c.type??'string', n=c.name??k; StrT.push(t); StrN.push(n); }
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    if(!boArrInArr){arrS=[arrS]; arrT=[arrT];}
    const nT=arrT.length, nS=arrS.length
    if(nT==0 && nS==0) {debugger; continue;}
    //arrS.sort(funIncMTime);   arrT.sort(funIncMTime);

    // if(nS) {var s0=arrS[0], sE=arrS[nS-1], boSEq=s0.mtime_ns64==sE.mtime_ns64;} else var boSEq=true
    // if(nT) {var t0=arrT[0], tE=arrT[nT-1], boTEq=t0.mtime_ns64==tE.mtime_ns64;} else var boTEq=true
    // if(nS && nT) var bo0Eq=s0.mtime_ns64==t0.mtime_ns64; else var bo0Eq=true
    // var boAllEq=boSEq && boTEq && bo0Eq
    var rowHead=nS?arrS[0]:arrT[0]

    // var strMTimeExact=(boAllEq && rowHead.mtime_ns64!=rowHead.mtime_ns64Floored)?` ${rowHead.strMTime.padStart(19)}`:'seePrev'
    // var strLab=`MatchingData ${rowHead.size.myPadStart(10)} ${rowHead.strMTimeFloored.padStart(19)} ${strMTimeExact}`

    var StrT=[]
    for(var keyM of KeyM){ var f=ClassObj[keyM].toMatch, strV=rowHead[keyM]; if(f) strV=f(strV); StrT.push(strV); }
    StrT.unshift('MatchingData'); var strRow=StrT.join(' ')
    arrOut.push(strRow);

    var arrBoth=arrS.concat(arrT)

    for(var row of arrBoth){
      var StrT=[]
      for(var keyU of KeyU){ var f=ClassObj[keyU].toUnique, strV=row[keyU]; if(f) strV=f(strV); StrT.push(strV); }
      var strRow='  '+StrT.join(' ')
      arrOut.push(strRow);
    }
  }
  return arrOut
}

var formatListForFile=function(arr, Key){
  var n=arr.length
  if(n==0) return []
  var arrOut=[]

  var StrT=[], StrN=[]
  for(var k of Key){ var c=ClassObj[k], t=c.type??'string', n=c.name??k; StrT.push(t); StrN.push(n); }
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  
  for(var i in arr){
    var row=arr[i]
    var StrT=[]
    for(var k of Key){ var f=ClassObj[k].toMatch, strV=row[k]; if(f) strV=f(strV); StrT.push(strV); }
    var strRow=StrT.join(' ')
    arrOut.push(strRow);
  }
  return arrOut
}




// OK OK   Un­touched
//           SM-Combos:
// -  1T1  Renamed (1T1)
//           1T1-files not renamed in the leaf: - . Ancestors: - 
// -  ViaA Renamed (ViaA)
//           SM-Combos:
// OK  -   Changed
// -   -   (Created / Deleted)
// -  Mult Mult
//           Sum

var ObjKeyList={
  allS:[['strType', 'mtime_ns64', 'id', 'size', 'strName']],
  allT:[['strType', 'mtime_ns64', 'id', 'size', 'strName']],
  untouched:[['strType', 'mtime_ns64', 'strHash', 'id', 'size', 'strName']],
  created:[['strType', 'id', 'size', 'mtime_ns64', 'strName']],
  deleted:[['strType', 'id', 'size', 'mtime_ns64', 'strName']],
  db:[['strType', 'id', 'strHash', 'mtime_ns64', 'size', 'strName']],
  dbI:[['strType', 'id', 'strHash', 'mtime_ns64', 'size', 'strName']],
}
var ObjKey={
  //'1T1':[['id', 'size', 'mtime_ns64Floored'], ['strSide', 'strType', 'mtime_ns64', 'strName']],
  'M1T1':[['size', 'mtime_ns64Floored'], ['strSide', 'strType', 'id', 'mtime_ns64', 'strName']],
  changed:[['strName'], ['strSide', 'strType', 'size', 'mtime_ns64']],
}
class SyncDb{
  constructor(arg){
    var {charTRes=settings.charTRes, fsDbDir, fsDir}=arg
    copySome(this, arg, ["fsDir", "fsDbDir", "leafFilter", "charFilterMethod", "strHost", "boRemote", "charSide"]); 
    var fsDb=fsDbDir+charF+settings.leafDb
    var flPrepend=calcFlPrepend(fsDbDir, fsDir);
    extend(this, {charTRes, fsDb, flPrepend})
  }

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

    
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err]
    setMess(`Parsing db`, null, true)
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    //var myResultWriter=new MyResultWriter(StrStemT2D)
    var PathCur=gThis[`Path${charSide}`]
    var myResultWriter=new MyWriter(PathCur)


        // Id match (Checking for hard links)

    var objTreef=bucketify(arrTreef, 'id'),  nIdf=Object.keys(objTreef).length
    var [objTreefDup, nMultf]=extractBucketsWMultiples(objTreef),  nMultIdf=Object.keys(objTreefDup).length;
    var objTreeF=bucketify(arrTreeF, 'id'),  nIdF=Object.keys(objTreeF).length
    var [objTreeFDup, nMultF]=extractBucketsWMultiples(objTreeF),  nMultIdF=Object.keys(objTreeFDup).length;

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    var objDb=bucketify(arrDb, 'id'),  nIdDb=Object.keys(objDb).length
    var [objDbDup, nMultDb]=extractBucketsWMultiples(objDb),  nMultIdDb=Object.keys(objDbDup).length;
    var nIdDb=0, nMultDb=0, nMultIdDb=0

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(objTreefDup, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(objTreeFDup, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
      var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
      
      var Str=([].concat(StrTmpF, StrTmpf));
      //if(StrTmpShortList.length>nShortListMax) StrTmpShortList.push('⋮'); 
      var strHov=formatTitleStr(Str)
      this.objHL.strTmpShortList=strHov
      return [null];
    }

      // Hash match
    // var objHash=bucketify(arrDb, 'strHash'),  nPatHash=Object.keys(objHash).length
    // var [objHashDup, nHashMult]=extractBucketsWMultiples(objHash),  nPatHashMult=Object.keys(objHashDup).length;
    // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    // var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
    // this.objHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
    // myResultWriter.Str.hash=StrTmp


        // Mult 1 (Multiple SM in all files)
 
    arrTreef.sort(funIncSM);   arrDb.sort(funIncSM)
    var [RelationSM]=categorizeByProp(arrTreef, arrDb, row=>row.sm)
    var Mat1=this.Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(RelationSM);
    Mat1.setMTMLabel()
    formatMultiPots(myResultWriter,Mat1,1)


        // Categorize files

    var arrSource=arrTreef, arrTarget=arrDb
    arrSource.forEach(row=>row.strSide='S'); arrTarget.forEach(row=>row.strSide='T');
      // Extract untouched, nm
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrSourceUntouched, arrTargetUntouched, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) {debugger; return [err];} 
    this.boChanged=Boolean(arrSourceTouched.length)||Boolean(arrTargetTouched.length)


      // Extract 1T1 and ViaA (renamed) (M)
    arrSourceTouched.sort(funIncSM);   arrTargetTouched.sort(funIncSM);
    var [RelM2]=categorizeByProp(arrSourceTouched, arrTargetTouched, row=>row.sm)
    var Mat2=new MatNxN();  Mat2.assignFromObjManyToMany(RelM2);
    extend(this, {RelM2, Mat2})
    var arrCreate=[].concat(Mat2.arrA[1][0], Mat2.arrA[2][0]);
    var arrDelete=[].concat(Mat2.arrB[0][1], Mat2.arrB[0][2]);
    var arrSourceM1T1=[].concat(Mat2.arrA[1][1]);
    var arrTargetM1T1=[].concat(Mat2.arrB[1][1]);
    var ArrSourceMMult=[].concat(Mat2.ArrA[1][2], Mat2.ArrA[2][1], Mat2.ArrA[2][2]);
    var ArrTargetMMult=[].concat(Mat2.ArrB[1][2], Mat2.ArrB[2][1], Mat2.ArrB[2][2]);
    //var arrSourceMMult=[].concat(Mat2.arrA[1][2], Mat2.arrA[2][1], Mat2.arrA[2][2]);
    //var arrTargetMMult=[].concat(Mat2.arrB[1][2], Mat2.arrB[2][1], Mat2.arrB[2][2]);
    //    ⎧0      0    0   ⎫     ⎧0 delete delete⎫
    // A: |create 1T1  Mult|  B: |0 1T1    Mult  |
    //    ⎩create Mult Mult⎭     ⎩0 Mult   Mult  ⎭


      // Copy strHash for M1T1
    for(var i=0;i<arrTargetM1T1.length;i++){ arrSourceM1T1[i].strHash=arrTargetM1T1[i].strHash; }


    myResultWriter.Str.allS=formatListForFile(arrSource, ...ObjKeyList['allS']);
    myResultWriter.Str.allT=formatListForFile(arrTarget, ...ObjKeyList['allT']);
    

    for(var i=0;i<arrSourceUntouched.length;i++){ arrSourceUntouched[i].strHash=arrTargetUntouched[i].strHash; }
    myResultWriter.Str.untouched=formatListForFile(arrSourceUntouched, ...ObjKeyList['untouched']);
    var arrUntouched=arrSourceUntouched

  
    extend(this, {arrSource, arrTarget, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, arrUntouched}); //, arrSourceUntouched, arrTargetUntouched
      
      // Writing to category files


    //myResultWriter.Str.changed=formatRelationForFile(arrSourceChanged, arrTargetChanged, ...ObjKey['changed']);

    myResultWriter.Str.created=formatListForFile(arrCreate, ...ObjKeyList['created']);
    myResultWriter.Str.deleted=formatListForFile(arrDelete, ...ObjKeyList['deleted']);
    myResultWriter.Str.M1T1=formatRename1T1(arrSourceM1T1, arrTargetM1T1, false)

    setBestNameMatchFirst(ArrSourceMMult, ArrTargetMMult)

    //   // Sort by size
    // ArrSourceMMult.forEach((el, i)=>el.ind=i); // Set index
    // var funInc=(a,b)=>a[0].size-b[0].size;
    // var ArrAtmp=[...ArrSourceMMult].sort(funInc)
    //   // Create Ind
    // var Ind=ArrAtmp.map(entry=>entry.ind)
    // var ArrBtmp=eInd(ArrTargetMMult, Ind)
    var ObjFeedback={}
    var Str=myResultWriter.Str.STMatch2=formatMatchingDataWMult(ArrSourceMMult, ArrTargetMMult); 
    //var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=formatTitleStr(Str)
    ObjFeedback.objSTMatch2={strHov, nFile:undefined}
    extend(this, {ObjFeedback});

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
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbNonRelevant, arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    extend(this, {arrDb, arrDbNonRelevant})

    var PathCur=gThis[`Path${charSide}`]

      // allS, allT
    var fsTmp=PathCur.allS.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrSource]=parseSSVWType(strData); if(err) return [err]
    var fsTmp=PathCur.allT.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrTarget]=parseSSVWType(strData); if(err) return [err]
    
      // untouched
    var fsTmp=PathCur.untouched.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, arrUntouched]=parseSSVWType(strData); if(err) return [err]

      // M1T1
    var funForRenamed=row=>{
      if(row.strMTime=="seeAbove") row.strMTime=row.strMTimeFloored;
      row.mtime_ns64=BigInt(row.strMTime); row.mtime_ns64Floored=BigInt(row.strMTimeFloored);
    }
    var fsTmp=PathCur.M1T1.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, , {S:arrSourceM1T1=[], T:arrTargetM1T1=[]}]=parseRelations(strData); if(err) return [err]
    arrSourceM1T1.forEach(funForRenamed); arrTargetM1T1.forEach(funForRenamed);

    extend(this, {arrSource, arrTarget, arrUntouched, arrSourceM1T1, arrTargetM1T1}) // , arrCreate, arrDelete
    
    return [null]
  }
  
  async createSyncData(){  // Calculate hashcodes etc
    var {fsDbDir, flPrepend, arrDbNonRelevant, strHost, boRemote}=this
    var {arrSource, arrTarget, arrUntouched, arrSourceM1T1, arrTargetM1T1, arrSourceBF}=this; //, arrSourceUntouched, arrTargetUntouched, arrCreate, arrDelete, RelM2, Mat2

      // Shortcut
    var arrSC=[].concat(arrSourceM1T1), nSC=arrSC.length;

      // arrSourceBF (Brute force)
    var arrMold=[].concat(arrUntouched, arrSC); arrMold.sort(funIncStrName);
    var [err, arrTrash, arrMoldTrash, arrSourceBF, arrMoldRemShouldBeZero]=extractMatching(arrSource, arrMold, ['strName']); if(err) return [err];
    if(arrMoldRemShouldBeZero.length) {debugger; return [Error("arrMoldRemShouldBeZero.length>0")];}
    var nBF=arrSourceBF.length;

      // arrTargetDelete (to be deleted)
    var arrMold=[].concat(arrUntouched, arrTargetM1T1); arrMold.sort(funIncStrName);
    var [err, arrTrash, arrMoldTrash, arrTargetDelete, arrMoldRemShouldBeZero]=extractMatching(arrTarget, arrMold, ['strName']); if(err) return [err];
    if(arrMoldRemShouldBeZero.length) {debugger; return [Error("arrMoldRemShouldBeZero.length>0")];}
    var nTargetDelete=arrTargetDelete.length;

      // Quick return
    var strMess=`Delete: ${nTargetDelete}\nHashcode-calculations: ${nBF}\nRenamed: ${nSC}`
    var boAbort=nTargetDelete==0 && nBF==0 && nSC==0
    if(boAbort) return [null, boAbort]

      // Brute force work
    var [err, StrHash]=await calcHashes(arrSourceBF, fsDbDir, strHost); if(err) { return [err];}
    if(StrHash.length!=nBF) { return [Error('StrHash.length!=nBF')];}
    for(var i=0;i<nBF;i++){
      var row=arrSourceBF[i], strHash=StrHash[i]
      if(strHash.length!=32) { return [Error('strHash.length!=32')];}
      row.strHash=strHash
    }


    var arrTargetNew=[].concat(arrUntouched, arrSC, arrSourceBF); //arrSourceUntouched, 
      // Add flPrepend to strName if appropriate
    if(flPrepend.length>0){
      for(var row of arrTargetNew) row.strName=flPrepend+row.strName
    }

      // Add Non-relevant entries
    //arrTargetNew.push(...arrDbNonRelevant)
    arrTargetNew=arrTargetNew.concat(arrDbNonRelevant)
    arrTargetNew.sort(funIncStrName)
    this.arrTargetNew=arrTargetNew

    return [null, false]
  }
  async writeDb(){
    var {fsDb, strHost, boRemote, arrTargetNew}=this

    var [err]=await writeDbWrapper(fsDb, strHost, boRemote, arrTargetNew); if(err) { return [err];}

    // var fsTmp=PathLoose.remoteFileLocally.fsName
    // var fsDbLoc=boRemote?fsTmp:fsDb
    // var strData=formatDb(arrTargetNew)
    // var [err]=await writeDbFile(strData, fsDbLoc); if(err) { return [err];}

    // if(boRemote){
    //   var arrCommand=['scp', fsDbLoc, strHost+':'+fsDb]
    //   var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    //   if(stdErr) { 
    //     if(stdErr.indexOf('No such file or directory') ){boDbRemoteExist=false} else {debugger; return [stdErr];}
    //   }
    //   else if(exitCode) { debugger; return [Error(stdErr)]; };
    // }

    return [null]
  }

}


// OK OK   Un­touched
//           SM-Combos:
// -  1T1  Renamed (1T1)
//           1T1-files not renamed in the leaf: - . Ancestors: - 
// -  ViaA Renamed (ViaA)
//           SM-Combos:
// OK  -   Changed
// -   -   (Created / Deleted)
// -  Mult Mult
//           Sum

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
    arrSource.sort(funIncSM);   arrTarget.sort(funIncSM);
    var [RelationSM]=categorizeByProp(arrSource, arrTarget, row=>row.sm)
    var Mat1=new MatNxN()
    Mat1.assignFromObjManyToMany(RelationSM);
    extend(this, {Mat1})
     

      // Extract untouched files
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrA, arrB, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) return [err]
    this.arrSourceUntouched=arrA; this.arrTargetUntouched=arrB; // nm

    this.boChanged=Boolean(arrSourceTouched.length || arrTargetTouched.length || arrCreateF.length || arrDeleteF.length)

      // Extract 1T1 and ViaA (renamed) (M)
    arrSourceTouched.sort(funIncSM);   arrTargetTouched.sort(funIncSM);
    var [RelM2]=categorizeByProp(arrSourceTouched, arrTargetTouched, row=>row.sm)
    var Mat2=this.Mat2=new MatNxN();  Mat2.assignFromObjManyToMany(RelM2);


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


    var [objSourceByMTmp, objTargetByMTmp]=Mat2.toObjManyToMany(row=>row.sm)
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

    formatMultiPots(myResultWriter,Mat1,1)
    formatMultiPots(myResultWriter,Mat2,2)


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
    var funUnique=(s)=>{  return `  ${s.strSide} ${s.strName}`; }
    var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, funMatch, funUnique)
    var strHead=`int int64\nsize mtime_ns64Floored\nstring string\nstrSide strName`;
    //StrRenameAdditional.unshift(strHead)
    if(StrRenameAdditional.length) StrRenameAdditional.unshift(strHead)

      // Changed
    var funMatch=(s,t)=>`MatchingData ${s.strName}`;
    var funUnique=(s)=>`  ${s.strSide} ${s.strType} ${s.size.myPadStart(10)} ${s.strMTime}`
    var StrChanged=formatMatchingData(this.arrSourceReusedName, this.arrTargetReusedName, funMatch, funUnique)
    var strHead=`string\nstrName\nstring string int int64\nstrSide strType size mtime_ns64`;
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
    myResultWriter.Str.renamed=formatRename1T1(this.arrSource1To1, this.arrTarget1To1, true)
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
    var [err, , {S:arrNew=[], T:arrOld=[]}]=parseRelations(strData); if(err) return [err]
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
    this.boChanged=nCreate!=0 || nDelete!=0 || nCreateF!=0 || nDeleteF!=0

    return [null]
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
    //var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    var strHov=formatTitleStr(Str)
    //var strHov=lStr?StrHov.join('\n'):undefined;
    return [Str, {strHov, nFile}]; 
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
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nS, nT}]; 
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
    arrEntry.sort(funIncStrName)
    var Str=arrEntry.map(row=>row.strName)
    extend(that, {arrEntry, Str})
    return that;
  },
  createFeedback(){ 
    var {Str}=this, nFile=Str.length; 
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
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

var CopyOnTarget2={
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
      var objRel=RelationHash[key], {nCopyOn2, arrA}=objRel, lA=arrA.length
        //var boCopyTo=lenB==0, nCopyOn2=boCopyTo?lenA-1:0
      if(nCopyOn2) {
        var rowS=arrA[0], fiS=rowS.strName;   Str.push(`S ${fiS}`), nS++;
        for(var i=1;i<lA;i++) {
          var rowT=arrA[i], fiT=rowT.strName;
          if('strCat' in rowT) {debugger; return [Error("strCat already set")]}
          extend(rowT, {strCat:'copyOn2', strNameS:fiS})
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
var CopyOnTarget1={
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
      var objRel=RelationHash[key], {nCopyOn1, arrA, arrB}=objRel, lA=arrA.length, lB=arrB.length
        // var boCopyOn1=lenB>0 && lenA>lenB, nCopyOn1=boCopyOn1?lenA-lenB:0
      if(nCopyOn1) {
        var rowS=arrB[0], fiS=rowS.strName;   Str.push(`S ${fiS}`), nS++;
        for(var i=lB;i<lA;i++) {
          var rowT=arrA[i], fiT=rowT.strName;
          //var fiTmp=fiT+'_'+myUUID();
          var fiTmp=fiS+'_'+myUUID(); // Using fiS (instead of fiT) since it is certain to contain approved chars
          if('strCat' in rowT) {debugger; return [Error("strCat already set")]}
          extend(rowT, {strCat:'copyOn1', strNameS:fiS})
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
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
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
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
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
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
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
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
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
    copySome(this, arg, ["fiSourceDir", "fiTargetDir", "fiTargetDbDir", "strHostTarget", "boRemote", "charFilterMethod", "boAllowLinks", "boAllowCaseCollision", "strFsTarget"]);
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
    var {charTRes, leafFilter, leafFilterFirst, fsSourceDir, fsTargetDir, fsTargetDbDir, strHostTarget, boRemote, charFilterMethod, boAllowLinks, boAllowCaseCollision, strFsTarget}=this
 
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

      // Parsing source db
    setMess(`Fetching source db`, null, true);  
    var [err, strData]=await readStrFileWHost(fsSourceDir+charF+settings.leafDb); if(err) return [err]
    setMess(`Parsing source db`, null, true); 
    var [err, arrDbS]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    arrDbS.sort(funIncStrName);   

      // Parsing target db
    setMess(`Fetching target db`, null, true);  
    var [err, strData]=await readStrFileWHost(fsTargetDbDir+charF+settings.leafDb, strHostTarget); if(err) return [err]
    setMess(`Parsing target db`, null, true);  
    var [err, arrDbS]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    arrDbT.sort(funIncStrName)
    var [arrDbTNonRelevant, arrDbTRelevant]=selectFrArrDb(arrDbT, flPrepend)
    var arrDbTOrg=arrDbT, arrDbT=arrDbTRelevant
    extend(this, {arrDbT, arrDbTNonRelevant})



      // Make sure the databases covers all files 
    var [err, arrSourcefM, arrDbSM, arrSourcefRem, arrDbSRem]=extractMatching(arrSourcef, arrDbS, ['strName'])
    if(arrSourcefRem.length>0) {debugger; return [Error("The source db doesn't cover all files, make sure to sync the db first.")];}
    var [err, arrTargetfM, arrDbTM, arrTargetfRem, arrDbTRem]=extractMatching(arrTargetf, arrDbT, ['strName'])
    if(arrTargetfRem.length>0) {debugger; return [Error("The target db doesn't cover all files, make sure to sync the db first.")];}

    var ObjFeedback=this.ObjFeedback={}


    var myResultWriter=new MyWriter(PathT2T)

      // Links
    var arrLink=[]
    if(!boAllowLinks){
      arrDbSM=arrDbSM.filter(entry=>{ var boLink=entry.strType=='l';  if(boLink) arrLink.push(entry);   return !boLink;   })
    }
    var Str=myResultWriter.Str.link=arrLink.map(row=>row.strName)
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str), lStr=Str.length
    ObjFeedback.objLink={strHov, nFile:lStr}; 

      // CaseCollisions
    var objMult={}, nMultf=0
    if(!boAllowCaseCollision){
      var objf=bucketify(arrDbSM, r=>r.strName.toLowerCase())
      var [objMult, nMultf, arrSingle]=extractBucketsWMultiples(objf),  nMultPatf=Object.keys(objMult).length;
      arrDbSM=arrSingle;
    }
    var Str=[]
    for(var k in objMult){
      var arr=objMult[k];   Str.push(k)
      for(var i=0;i<arr.length;i++){Str.push(`  ${arr[i].strName}`)}
    }
    myResultWriter.Str.caseCollision=Str; 
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str)
    ObjFeedback.objCaseCollision={strHov, nFile:nMultf}

      // ReservedChar
      // Googled "filesystems supported char" found this: https://en.wikipedia.org/wiki/Filename  // Reserved (MS): "*/:<>?\|
    var arrLinks=[]
    var RegReservedChar={ms:/["\*\/:<>\?\\\|]/, ext4:``}
    var RegReservedCharWOFwdSlash={ms:/["\*:<>\?\\\|]/, ext4:``}
    var arrReservedChar=[], arrReservedCharF=[];
    if(strFsTarget=='ms'){
      var reg=RegReservedCharWOFwdSlash.ms
      //var arrDbSM=arrDbSM.filter(r=>{var leaf=basename(r.strName), boRes=reg.test(leaf); if(boRes) arrReservedChar.push(r); return !boRes})
      var arrDbSM=arrDbSM.filter(r=>{var boRes=reg.test(r.strName); if(boRes) arrReservedChar.push(r); return !boRes})
      //var arrCreateF=arrCreateF.filter(r=>{var leaf=basename(r.strName), boRes=reg.test(leaf); if(boRes) arrReservedCharF.push(r); return !boRes})
    }
    var Str=myResultWriter.Str.reservedChar=arrReservedChar.map(row=>row.strName)
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    var strHov=formatTitleStr(Str), lStr=Str.length
    ObjFeedback.objReservedChar={strHov, nFile:lStr}; 
    // var Str=myResultWriter.Str.reservedCharF=arrReservedCharF.map(row=>row.strName)
    // var lStr=Str.length, StrHov=Str.slice(0,nShortListMax);  if(lStr>nShortListMax) { StrHov.push('⋮');}
    // var strHov=lStr?StrHov.join('\n'):undefined;
    // ObjFeedback.objReservedCharF={strHov, nFile:lStr}; 

    //extend(this, {arrReservedChar, arrReservedCharF})


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
      //var boDelete=lB>lA, nDelete=boDelete?lB-lA:0 
      //var boDeleteAll=lA==0, nDeleteAll=boDeleteAll?lB:0 
      //var boDeleteSome=lA>0 && lB>lA, nDeleteSome=boDeleteSome?lB-lA:0 
      //var boCopyOn1=lB>0 && lA>lB, nCopyOn1=boCopyOn1?lA-lB:0
      var nDelete=boundPos(lB-lA)
      var nDeleteAll=lA==0?nDelete:0
      var nDeleteSome=lA>0?nDelete:0
      var nNewVersions=boundPos(lA-lB),  nCopyOn1=lB>0?nNewVersions:0
      var boCopyTo=lB==0, nCopyOn2=boCopyTo?lA-1:0
      var nRename=lShortest-nExactName
      if(nRename<0) {debugger; return [Error('nRename<0')];}
      nExactTot+=nExactName
      extend(objPat, {nDelete, nDeleteAll, nDeleteSome, nCopyOn1, boCopyTo, nCopyOn2, lShortest, nRename})
    }

    var objArg={RelationHash, strHostTarget, boRemote, fsSourceDir, fsTargetDir}
    var categoryDelete=new CategoryDelete(objArg)
    var copyOnTarget1=CopyOnTarget1.factory(objArg)
    var moveOnTarget=new MoveOnTarget(objArg)
    var moveOnTargetNSetMTime=new MoveOnTargetNSetMTime(objArg)
    var categorySetMTime=new CategorySetMTime(objArg);
    var copyToTarget=CopyToTarget.factory(objArg)
    var copyOnTarget2=CopyOnTarget2.factory(objArg)
    var categoryUntouched=new CategoryUntouched(objArg);
    
    var objCat=extend({}, {categoryDelete, copyOnTarget1, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, copyToTarget, copyOnTarget2, nExactTot})
    
    formatMultiPots(myResultWriter, Mat1,1)

    var Key=['categoryDelete', 'copyOnTarget1', 'moveOnTarget', 'moveOnTargetNSetMTime', 'categorySetMTime', 'copyToTarget', 'copyOnTarget2']
    var StrHov={}, objN={}
    var boAny=false
    for(var key of Key){
      var action=objCat[key];
      var [Str, objFeedback]=action.createFeedback();
      myResultWriter.Str[key]=Str;
      // StrHov['strHov'+ucfirst(key)]=strHov
      // objN['N'+ucfirst(key)]=N
      ObjFeedback['obj'+ucfirst(key)]=objFeedback
      var {strHov, nFile, nS, nT}=objFeedback
      var n=nFile??nT
      boAny||=Boolean(n)
    }
    
    var boChanged=boAny
    extend(this, {myResultWriter, boChanged}); //StrHov, objN
    
    extend(this, objCat)
    return [null]
  }

  makeConfirmMess(){
    var {objN, arrDeleteF, arrCreateF}=this;
    var nDeleteF=arrDeleteF.length, nCreateF=arrCreateF.length
    var {NCategoryDelete, NCopyOnTarget1, NMoveOnTarget, NCategorySetMTime, NCopyToTarget, NCopyOnTarget2}=objN
    var [nDelete]=NCategoryDelete
    var [nCopyToTarget]=NCopyToTarget
    var [nRename]=NMoveOnTarget
    var [nS1, nT1]=NCopyOnTarget1
    var [nS2, nT2]=NCopyOnTarget2;
    var nT=nT1+nT2
    var strMess=`Deleting: ${nDelete} file${pluralS(nDelete)} (and ${nDeleteF} folder${pluralS(nDeleteF)})
Renaming: ${nRename} file${pluralS(nRename)}
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
    var {charTRes, leafFilter, leafFilterFirst, categoryDelete, copyOnTarget1, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, copyToTarget, copyOnTarget2, arrDbS, arrDbTNonRelevant, fsSourceDir, fsTargetDir, fsTargetDbDir, flPrepend, arrSource, strHostTarget, boRemote, charFilterMethod}=this;
    var [err]=await this.createFolders(); if(err) {debugger; return [err];}
  
    await categoryDelete.delete();
    myConsole.printNL(`copyOnTarget1.copyToTemp ...`)
    await copyOnTarget1.copyToTemp(); // 
    myConsole.printNL(`moveOnTarget.renameToTemp ...`)
    await moveOnTarget.renameToTemp();  
    myConsole.printNL(`moveOnTargetNSetMTime.renameToTemp ...`)
    await moveOnTargetNSetMTime.renameToTemp();  
       // By this point, the old names (that might be reused), have been cleared.

    myConsole.printNL(`copyOnTarget1.renameToFinal ...`)
    await copyOnTarget1.renameToFinal();
    myConsole.printNL(`moveOnTarget.renameToFinal ...`)
    await moveOnTarget.renameToFinal()
    myConsole.printNL(`moveOnTargetNSetMTime.renameToFinal ...`)
    await moveOnTargetNSetMTime.renameToFinal()

    myConsole.printNL(`moveOnTargetNSetMTime.setMTime ...`)
    await moveOnTargetNSetMTime.setMTime()
    myConsole.printNL(`categorySetMTime.setMTime ...`)
    await categorySetMTime.setMTime()

    myConsole.printNL(`copyToTarget.copy ...`)
    var [err]=await copyToTarget.copy(); if(err) {debugger; return [err];}

    //await copyToTarget.renameToFinal(); // Renames to final name
    myConsole.printNL(`copyOnTarget2.copy ...`)
    await copyOnTarget2.copy()

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
//   var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
  var [err, arrDbS]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    // Parse fiDbOther
  var [err, fsDbOther]=await myRealPath(fiDbOther); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbOther);
  if(err){
    if(err.code==STR_ENOENT){err=null; strData=""} //STR_NE_FS_FILRDER
    else{debugger; return [err];}
  }
  var arrDbOther=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbNew)
  var [err]=await writeDbFile(strData, fsDb); if(err) {debugger; return [err];}

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
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
    var boOK=await myConfirmer.confirm(strMess);
    if(!boOK) return [null];
  }
  var strData=formatDb(arrDbNew)
  var [err]=await writeDbFile(strData, fsDb); if(err) {debugger; return [err];}

  setMess('utilityMatchTreeAndDbFile: Done');
  return [null];
}


var utilityMatchDbFileAndDbFile=async function(){  // For running different experiments 
  var {charTRes=settings.charTRes, leafFilterFirst, fiDbS, fiDbT, flPrepend}=arg
  debugger

    // Parse fiDbS
  var [err, fsDbS]=await myRealPath(fiDbS); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbS); if(err) return [err]
  var [err, arrDbS]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    // Parse fiDbT
  var [err, fsDbT]=await myRealPath(fiDbT); if(err) {debugger; return [err];}
  var [err, strData]=await readStrFile(fsDbT); if(err) return [err]
  var [err, arrDbS]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
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
