
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
  var [BundTreefMult, nMultf]=extractBundlesWMultiples(BundTreef),  nMultIdf=Object.keys(BundTreefMult).length;
  var BundTreeF=bundleOnProperty(arrTreeF, 'id'),  nIdF=Object.keys(BundTreeF).length
  var [BundTreeFMult, nMultF]=extractBundlesWMultiples(BundTreeF),  nMultIdF=Object.keys(BundTreeFMult).length;

  var objArg={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length}

  var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
  var StrTmpf=formatMatchingDataWMultSingleDataSet(BundTreefMult, funMatch, funUnique)
  var StrTmpF=formatMatchingDataWMultSingleDataSet(BundTreeFMult, funMatch, funUnique)
  //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
  myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
  var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
  //var strSeeMore=myResultWriter.getSeeMoreMessage()
  //myConsole.log(StrSum.concat(strSeeMore).join('\n'))
  return [null]
}

// EntryAll=EntryRelevant+EntryReadOnly
// EntryTS=(Entries in the dir on the target that is the backup of the source-dir )
// On source:
//   EntryRelevant=EntryDB_S
//   EntryReadOnly=(calculated (=EntryDB_T-EntryTS))
//   EntryAll=(calculated (=EntryRelevant+EntryReadOnly))
// On target: 
//   EntryAll=EntryDB_T
//   EntryReadOnly=EntryTS
//   EntryRelevant=(calculated (=EntryAll-EntryReadOnly))



class SMMultWork{
  constructor(){ }
  async getMult(arg){
    var {fiSourceDir, fiTargetDbDir, fiTargetDataDir, charTRes, strHostTarget, charSide, FlExtraF}=arg;
    var boTarget=charSide=='T'

    var [err, fsSourceDir]=await myRealPath(fiSourceDir, strHostTarget); if(err) {debugger; return [err];}
    //var [err, fsTargetDataDir]=await myRealPath(fiTargetDataDir, strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    var fsSourceDb=fsSourceDir+charF+settings.leafDb, fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    var [fsDbDir, fsDb, strHost]=boTarget?[fsTargetDbDir, fsTargetDb, strHostTarget]:[fsSourceDir, fsSourceDb, null]
    extend(this, {fsDbDir, fsDb, strHost})


    var [err, strData]=await readStrFile(fsSourceDb);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrSourceDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var [err, strData]=await readStrFileWHost(fsTargetDb, strHostTarget);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrTargetDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var flPrepend=calcFlPrepend(fiTargetDbDir, fiTargetDataDir);

    if(boTarget){
      // var arrTExtraRem=arrTargetDb;
      // for(var i=0;i<FlExtraF.length;i++){
      //   var flTmp=FlExtraF[i]
      //   var [arrTSel, arrTRem]=selectFrArrDb(arrTExtraRem, flTmp)
      //   arrTExtraRem=arrTRem
      // }
      // var [arrTSel, arrTRem]=selectFrArrDb(arrTExtraRem, flPrepend)
      // var arrRelevant=arrTRem;
      // var arrReadOnly=arrTExtraRem.concat(arrSourceDb)

      var FlT=FlExtraF.concat(flPrepend), arrTRem=arrTargetDb, arrT=[];
      for(var i=0;i<FlT.length;i++){
        var flTmp=FlT[i]
        var [arrTSel, arrTRem]=selectFrArrDb(arrTRem, flTmp);
        arrT=arrT.concat(arrTSel)
        arrTRem=arrTRem
      }
      var arrRelevant=arrTRem;
      var arrReadOnly=arrT
    }else{ 
      var [arrTSel, arrTRem]=selectFrArrDb(arrTargetDb, flPrepend)
      var arrRelevant=arrSourceDb, arrReadOnly=arrTRem;
    } 
    arrReadOnly.forEach(r=>r.boRelevant=false);
    arrRelevant.forEach(r=>r.boRelevant=true); 
    var arrAll=arrRelevant.concat(arrReadOnly)

    var StrLongList=arrReadOnly.map(r=>`${r.size.myPadStart(10)} ${r.mtime_ns64Floored} ${r.strName}`)
    var StrReadOnlyShort=formatTitle(StrLongList)
    var nReadOnly=arrReadOnly.length

    arrAll.sort(funDecSM);
    var BundSM=bundleOnProperty(arrAll, 'sm'),  nPatSM=Object.keys(BundSM).length
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
    var StrLongList=formatMatchingDataWMultSingleDataSet(BundSMMultHashConsistent, funMatch, funUnique)
    var StrConsistentShort=formatTitle(StrLongList)
    var strHead=`int int64 string\nsize mtime_ns64Floored strHash\nbool string\nboRelevant strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.smMultHashConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].smMultHashConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.size.myPadStart(10)} ${s.mtime_ns64Floored}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.strHash} ${s.strName}`;
    var StrLongList=formatMatchingDataWMultSingleDataSet(BundSMMultHashNonConsistent, funMatch, funUnique)
    var StrNonConsistentShort=formatTitle(StrLongList)
    var strHead=`int int64\nsize mtime_ns64Floored\nbool string string\nboRelevant strHash strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.smMultHashNonConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].smMultHashNonConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    extend(this, {arrRelevant, strHostTarget, charTRes, arrAll, charSide})

    return [null, {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent, nReadOnly, StrReadOnlyShort}]
  }

  async findNewMTime(){
    var {arrRelevant, charTRes, arrAll, charSide}=this

    var fsTmp=gThis[`PathSingle${charSide}`].smMultHashNonConsistent.fsName, [err, strData]=await readStrFile(fsTmp); if(err) return [err]
    var [err, obj, Arr]=parseRelations(strData, true, undefined, arr=>arr[1]); if(err) return [err]
      // obj is 3D unlike BundSMMultHashNonConsistent which is 2D.
      //   keySM (top key) in BundSMMultHashNonConsistent has the "size"-part 0-padded (unlike obj (which has no padding))

    var BoSizeMTime={}

    arrAll.sort(funDecSM);
    var BundSize=bundleOnProperty(arrAll, 'size')
    for(var s in BundSize){
      var bundSize=BundSize[s];   BoSizeMTime[s]={}
      for(var i=0;i<bundSize.length;i++){ var row=bundSize[i], {mtime_ns64Floored}=row;  BoSizeMTime[s][mtime_ns64Floored]=true; }
    }
  
    var tDiffMax_ns=1e11

    var BoAnyExtra={}
    for(var keySM in obj){ 
      var BundHash=Object.values(obj[keySM]), boAnyExtra=false;
      BundHash.forEach(bundHash=>{
          // Add nRelevant and nExtra as properties to each array
        var nRelevant=0, nExtra=0; bundHash.forEach(r=>{ if(r.boRelevant) nRelevant++; else nExtra++ });
        extend(bundHash, {nRelevant, nExtra});
          // Sort so the extras comes last
        bundHash.sort((A,B)=>{return Number(A.boExtra)-Number(B.boExtra)})
        boAnyExtra||=nExtra>0
      }); 
      BoAnyExtra[keySM]=boAnyExtra;
    }

    var StrToChange=[], nToChange=0, StrRevert=[]
    for(var keySM in obj){
      var BundHash=Object.values(obj[keySM]), boAnyExtra=BoAnyExtra[keySM];
      //BundHash.sort((A,B)=>{var a=A.length, b=B.length; return (a<b) ? 1 : ((a>b)?-1:0)}); // Sort so that the longest bundHash is first
      BundHash.sort((A,B)=>{var a=A.nRelevant, b=B.nRelevant; return (a<b) ? 1 : ((a>b)?-1:0)}); // Sort that so the most nRelevant is first
      BundHash.sort((A,B)=>{var a=A.nExtra, b=B.nExtra; return (a<b) ? -1 : ((a>b)?1:0)}); // Sort so that the least nExtra is first
      var tDiff_ns=BigInt(0)
      var bundHash0=BundHash[0], {nRelevant, nExtra}=bundHash0, r00=bundHash0[0], {size, mtime_ns64Floored, strName}=r00;
      StrToChange.push(`MatchingData ${size} ${mtime_ns64Floored}`);  StrRevert.push(`MatchingData ${size} ${mtime_ns64Floored}`)
      var iStart=boAnyExtra?0:1; // If no extras, then one can leave one (the first) bundHash unchanged
      for(var i=iStart;i<BundHash.length;i++){ 
        var bundHash=BundHash[i], {nRelevant, nExtra}=bundHash, row0=bundHash[0], {size, mtime_ns64Floored, strName}=row0;
        if(nRelevant==0) continue
          // Find mtime_ns64FlooredNew
        while(1){
          tDiff_ns+=IntTDiv[charTRes];    if(tDiff_ns>tDiffMax_ns) {debugger; return [Error(`New time could not be calculated: tDiff_ns: ${tDiff_ns} ${strName}`)]; }
          var mtime_ns64FlooredNew=mtime_ns64Floored+tDiff_ns
          if(mtime_ns64FlooredNew in BoSizeMTime[size]) {continue;} else { BoSizeMTime[size][mtime_ns64FlooredNew]=true;  break;}
        }
          // For all the boRelevant entries: Assign mtime_ns64FlooredNew
        for(var j=nExtra;j<bundHash.length;j++){
          var row=bundHash[j], {boRelevant, strHash, strName}=row;
          funSetMTime(row, charTRes, mtime_ns64FlooredNew)
          StrToChange.push(`  ${tDiff_ns} ${strHash} ${strName}`);  nToChange++,  StrRevert.push(`  0 ${strHash} ${strName}`)
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
  
    return [null, {nToChange, StrToChangeShort, nRevert, StrRevertShort}]
  }

  async mySetMTime(pathInput){
    var {fsDbDir, fsDb, strHost, charTRes}=this;

      // Parsing fsDb (database)
    var [err, strData]=await readStrFileWHost(fsDb, strHost);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var [err, strData]=await readStrFile(pathInput.fsName);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, obj, Arr]=parseRelations(strData, true); if(err) return [err]
    
    var arrToChange=[];  for(var k in Arr){ var arr=Arr[k]; arrToChange=arrToChange.concat(arr); }
    arrDb.sort(funIncStrName);   arrToChange.sort(funIncStrName)
    var [err, arrDbMatch, arrToChangeMatch, arrDbRem, arrToChangeRem]=extractMatching(arrDb, arrToChange, ['strName']); if(err) {debugger; return [err];}
    if(arrToChangeRem.length) {debugger; return [Error("arrToChangeRem.length>0")];}

    for(var i=0;i<arrDbMatch.length;i++){
      var rowDb=arrDbMatch[i], rowNew=arrToChangeMatch[i], {tDiff_ns, mtime_ns64Floored:mtime_ns64}=rowNew; //, {mtime_ns64}=rowDb;
      var mtime_ns64=mtime_ns64+tDiff_ns
      funSetMTime(rowDb, charTRes, mtime_ns64)
      extend(rowNew, {mtime_ns64, mtime_ns64Floored:rowDb.mtime_ns64Floored})
    }

    var [err]=await setMTime(arrToChange, fsDbDir, strHost);  if(err) {debugger; return [err];}
    var [err]=await writeDbWrapper(arrDb, fsDb, strHost); if(err) { return [err];}
    return [null]
  }
}
// cd ~/progPython/buvt-TargetFs/OtherStuff
// cd ~/progPython/buvt-SourceFs/Source
// ls -lAigoQUv --time-style=+"%s.%N"
// touch -m -d '@1716905269.022141964' a0.txt a1.txt a1a.txt a2.txt a2a.txt a2b.txt ../../buvt-TargetFs/OtherStuff/stuffa.txt
// touch -m -d '@1716905369.022141964' b0.txt b1.txt b1a.txt b2.txt b2a.txt b2b.txt ../../buvt-TargetFs/OtherStuff/stuffb.txt
// touch -m -d '@1746873142.792115391' c0.txt c1.txt
// touch -m -d '@1746873242.792115391' c2.txt


class HashMultWork{
  constructor(){ }
  async getMult(arg){
    var {fiSourceDir, fiTargetDbDir, fiTargetDataDir, charTRes, strHostTarget, charSide, FlExtraF}=arg;
    var boTarget=charSide=='T'

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    //var [err, fsTargetDataDir]=await myRealPath(fiTargetDataDir, strHostTarget); if(err) {debugger; return [err];}
    var [err, fsTargetDbDir]=await myRealPath(fiTargetDbDir, strHostTarget); if(err) {debugger; return [err];}
    var fsSourceDb=fsSourceDir+charF+settings.leafDb,  fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    var [fsDbDir, fsDb, strHost]=boTarget?[fsTargetDbDir, fsTargetDb, strHostTarget]:[fsSourceDir, fsSourceDb, null]
    extend(this, {fsDbDir, fsDb, strHost})

    var [err, strData]=await readStrFile(fsSourceDb);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrSourceDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var [err, strData]=await readStrFile(fsTargetDb);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrTargetDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    var flPrepend=calcFlPrepend(fiTargetDbDir, fiTargetDataDir);
    if(boTarget){
      // var arrTExtraRem=arrTargetDb;
      // for(var i=0;i<FlExtraF.length;i++){
      //   var flTmp=FlExtraF[i]
      //   var [arrTSel, arrTRem]=selectFrArrDb(arrTExtraRem, flTmp)
      //   arrTExtraRem=arrTRem
      // }
      // var [arrTSel, arrTRem]=selectFrArrDb(arrTExtraRem, flPrepend)
      // var arrRelevant=arrTRem;
      // var arrReadOnly=arrTExtraRem.concat(arrSourceDb)

      var FlT=FlExtraF.concat(flPrepend), arrTRem=arrTargetDb, arrT=[];
      for(var i=0;i<FlT.length;i++){
        var flTmp=FlT[i]
        var [arrTSel, arrTRem]=selectFrArrDb(arrTRem, flTmp);
        arrT=arrT.concat(arrTSel)
        arrTRem=arrTRem
      }
      var arrRelevant=arrTRem;
      var arrReadOnly=arrT
    }else{ 
      var [arrTSel, arrTRem]=selectFrArrDb(arrTargetDb, flPrepend)
      var arrRelevant=arrSourceDb, arrReadOnly=arrTRem;
    }
    
    arrReadOnly.forEach(r=>r.boRelevant=false);
    arrRelevant.forEach(r=>r.boRelevant=true); 
    var arrAll=arrRelevant.concat(arrReadOnly)

    var StrLongList=arrReadOnly.map(r=>`${r.size.myPadStart(10)} ${r.mtime_ns64Floored} ${r.strName}`)
    var StrReadOnlyShort=formatTitle(StrLongList)
    var nReadOnly=arrReadOnly.length

    arrAll.sort(funDecSM);
    var BundHash=bundleOnProperty(arrAll, 'strHash'),  nPatHash=Object.keys(BundHash).length
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
    var StrLongList=formatMatchingDataWMultSingleDataSet(BundHashMultSMConsistent, funMatch, funUnique)
    var StrConsistentShort=formatTitle(StrLongList)
    var strHead=`string int int64\nstrHash size mtime_ns64\nbool string\nboRelevant strName`;
    if(StrLongList.length) StrLongList.unshift(strHead);
    //myResultWriter.Str.hashMultSMConsistent=StrLongList
    var myResultWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hashMultSMConsistent);
    myResultWriter.Str=StrLongList
    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.boRelevant.toString().padStart(5)} ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=formatMatchingDataWMultSingleDataSet(BundHashMultSMNonConsistent, funMatch, funUnique)
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
          var row=bundSM[j], {mtime_ns64:mtime_ns64Old, strName}=row;
          funSetMTime(row, charTRes, mtime_ns64)
          StrToChange.push(`${mtime_ns64} ${strName}`);    StrRevert.push(`${mtime_ns64Old} ${strName}`)
        } 
      }
    }


    var strHead=`int64 string\nmtime_ns64 strName`;

    var nToChange=StrToChange.length, StrToChangeShort=formatTitle(StrToChange)
    if(StrToChange.length) StrToChange.unshift(strHead);
    var myWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hsmToChange); myWriter.Str=StrToChange
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

    var nRevert=StrRevert.length, StrRevertShort=formatTitle(StrRevert)
    if(StrRevert.length) StrRevert.unshift(strHead);
    var myWriter=new MyWriterSingle(gThis[`PathSingle${charSide}`].hsmRevert); myWriter.Str=StrRevert
    var [err]=await myWriter.writeToFile();  if(err) {debugger; return [err];}

    extend(this, {arrRelevant, charTRes, arrAll, charSide})
    return [null, {StrConsistentShort, StrNonConsistentShort, nTotConsistent, nPatConsistent, nTotNonConsistent, nPatNonConsistent, nToChange, nRevert, StrToChangeShort, StrRevertShort, nReadOnly, StrReadOnlyShort}]
  }

  async mySetMTime(pathInput){
    var {fsDbDir, fsDb, strHost, charTRes}=this;

      // Parsing fsDb (database)
    var [err, strData]=await readStrFileWHost(fsDb, strHost);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

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
    var {fiSourceDir, fiTargetDbDir, fiTargetDataDir, charTRes, strHostTarget, charSide}=arg
    var boTarget=charSide=='T'

    var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
    var [err, [fsTargetDbDir, fsTargetDataDir]]=await myRealPathArr([fiTargetDbDir, fiTargetDataDir], strHostTarget); if(err) {debugger; return [err]; }
    var fsSourceDb=fsSourceDir+charF+settings.leafDb, fsTargetDb=fsTargetDbDir+charF+settings.leafDb;
    var [fsDbDir, fsDb, strHost]=boTarget?[fsTargetDbDir, fsTargetDb, strHostTarget]:[fsSourceDir, fsSourceDb, null]
    extend(this, {fsDbDir, fsDb, strHost})

      // Parsing fsDb (database)
    //var [err, strData]=await readStrFile(fsDb);
    var [err, strData]=await readStrFileWHost(fsDb, strHost);
    
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}


    arrDb.sort(funDecSM);
    var BundHash=bundleOnProperty(arrDb, 'strHash'),  nPatHash=Object.keys(BundHash).length
    var [BundHashMult, nHashMult, arrSingle]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(BundHashMult).length;


    var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    var StrLongList=formatMatchingDataWMultSingleDataSet(BundHashMult, funMatch, funUnique)
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
// -   -   Created / Deleted
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

/****************************************************************************************
 * SyncDbI
 ****************************************************************************************/

class SyncDbI{
  constructor(arg){
    var {charTRes=settings.charTRes, fsDbDir, fsDir}=arg
    copySome(this, arg, ["fsDir", "fsDbDir", "leafFilter", "charFilterMethod", "strHost", "charSide"]); 
    var fsDb=fsDbDir+charF+settings.leafDb
    var flPrepend=calcFlPrepend(fsDbDir, fsDir);
    extend(this, {charTRes, fsDb, flPrepend})
  }

  //async loadRemoteDbToLocalCopy(){ }
  async compare(){
    var {fsDir, fsDbDir, fsDb, charTRes, leafFilter, charFilterMethod, strHost, charSide, flPrepend}=this
    if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';

    if(1){ //boRemote
      var [err]=await interfacePython.uploadZip(strHost); if(err) { debugger; return [err];}
    }

      // Parse tree
    var treeParser=new TreeParser()
    setMess(`Parsing tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir, charFilterMethod, strHost}
    var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
    removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)



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
    //   if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    // }else {strData=""}


    
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err]
    setMess(`Parsing db`, null, true)
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant
    //extend(this, {arrDb, arrDbNonRelevant})

    //var myResultWriter=new MyResultWriter(StrStemT2D)
    var PathCur=gThis[`Path${charSide}`]
    var myResultWriter=new MyWriter(PathCur)


        // Id match (Checking for hard links)

      // Count duplicate ids in tree
    var BundTreef=bundleOnProperty(arrTreef, 'id'),  nIdf=Object.keys(BundTreef).length
    var [BundTreefMult, nMultf]=extractBundlesWMultiples(BundTreef),  nMultIdf=Object.keys(BundTreefMult).length;
    var BundTreeF=bundleOnProperty(arrTreeF, 'id'),  nIdF=Object.keys(BundTreeF).length
    var [BundTreeFMult, nMultF]=extractBundlesWMultiples(BundTreeF),  nMultIdF=Object.keys(BundTreeFMult).length;

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    var BundId=bundleOnProperty(arrDb, 'id'),  nIdDb=Object.keys(BundId).length
    var [objDbDup, nMultDb]=extractBundlesWMultiples(BundId),  nMultIdDb=Object.keys(objDbDup).length;

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(BundTreefMult, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(BundTreeFMult, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
      var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
      
      var Str=([].concat(StrTmpF, StrTmpf));
      var strHov=formatTitleStr(Str)
      this.objHL.strTmpShortList=strHov
      return [null];
    }

      // Hash match
    // var BundHash=bundleOnProperty(arrDb, 'strHash'),  nPatHash=Object.keys(BundHash).length
    // var [objHashDup, nHashMult]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(objHashDup).length;
    // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    // var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
    // this.BundHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
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
    var strHov=formatTitleStr(Str)
    ObjFeedback.objSTMatch2={strHov, nFile:undefined}
    extend(this, {ObjFeedback});


    myResultWriter.Str.hl=[]

    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    return [null];
  }


  async readAction(){
    var {fsDb, charTRes, flPrepend, strHost, charSide}=this

      // Parsing fsDb (database)
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err];
    //var [err, strData]=await readStrFile(fsDb); if(err) return [err];
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    setMess(`Parsing db`, null, true)
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbRelevant, arrDbNonRelevant]=selectFrArrDb(arrDb, flPrepend)
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
    //var [err, , {F:arrSourceIM=[], D:arrTargetIM=[]}]=parseRelations(strData); if(err) return [err]
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
    var {fsDir, fsDbDir, flPrepend, arrDbNonRelevant, strHost}=this
    var {arrDb, arrUntouchedWOExactMTime, arrSourceUntouched, arrTargetUntouched, arrSourceChanged, arrTargetChanged, arrSourceIM, arrTargetIM, arrSourceNM, arrTargetNM, arrSourceReusedName, arrTargetReusedName, arrSourceReusedId, arrTargetReusedId, arrCreate, arrDelete, arrSourceM1T1, arrTargetM1T1, RelM2, Mat2}=this; //, arrSourceMMult, arrTargetMMult
    var {arrSource, arrTarget, arrUntouched}=this;

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
    var [err, StrHash]=await calcHashes(arrSourceBF, fsDir, strHost); if(err) { return [err];}
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
    var {fsDb, strHost, arrTargetNew}=this

    var [err]=await writeDbWrapper(arrTargetNew, fsDb, strHost); if(err) { return [err];}

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


class SyncDb{
  constructor(arg){
    var {charTRes=settings.charTRes, fsDbDir, fsDir}=arg
    copySome(this, arg, ["fsDir", "fsDbDir", "leafFilter", "charFilterMethod", "strHost", "charSide"]); 
    var fsDb=fsDbDir+charF+settings.leafDb
    var flPrepend=calcFlPrepend(fsDbDir, fsDir);
    extend(this, {charTRes, fsDb, flPrepend})
  }

  async compare(){
    var {fsDir, fsDbDir, fsDb, charTRes, leafFilter, charFilterMethod, strHost, charSide, flPrepend}=this

    if(1){ //boRemote
      var [err]=await interfacePython.uploadZip(strHost); if(err) { debugger; return [err];}
    }

      // Parse tree
    var treeParser=new TreeParser()
    setMess(`Parsing tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst:leafFilter, fsDir, charFilterMethod, strHost}
    var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
    removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)

    
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err]
    setMess(`Parsing db`, null, true)
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
    var arrDbOrg=arrDb, arrDb=arrDbRelevant

    //var myResultWriter=new MyResultWriter(StrStemT2D)
    var PathCur=gThis[`Path${charSide}`]
    var myResultWriter=new MyWriter(PathCur)


        // Id match (Checking for hard links)

    var BundTreef=bundleOnProperty(arrTreef, 'id'),  nIdf=Object.keys(BundTreef).length
    var [BundTreefMult, nMultf]=extractBundlesWMultiples(BundTreef),  nMultIdf=Object.keys(BundTreefMult).length;
    var BundTreeF=bundleOnProperty(arrTreeF, 'id'),  nIdF=Object.keys(BundTreeF).length
    var [BundTreeFMult, nMultF]=extractBundlesWMultiples(BundTreeF),  nMultIdF=Object.keys(BundTreeFMult).length;

      // Count duplicate ids in db
    arrDb.sort(funIncId)
    var BundId=bundleOnProperty(arrDb, 'id'),  nIdDb=Object.keys(BundId).length
    var [objDbDup, nMultDb]=extractBundlesWMultiples(BundId),  nMultIdDb=Object.keys(objDbDup).length;
    var nIdDb=0, nMultDb=0, nMultIdDb=0

    var boHL=Boolean(nMultf || nMultF || nMultDb)
    this.objHL={nMultf, nMultIdf, nIdf, nTreef:arrTreef.length,   nMultF, nMultIdF, nIdF, nTreeF:arrTreeF.length,   nMultDb, nMultIdDb, nIdDb, nDb:arrDb.length,  boHL,  strTmpShortList:undefined}

    if(nMultIdf || nMultIdF || nMultIdDb) {
      var funMatch=s=>`MatchingData ${s.id.padStart(20)}`,  funUnique=s=>`  ${s.strName}`;
      var StrTmpf=formatMatchingDataWMultSingleDataSet(BundTreefMult, funMatch, funUnique)
      var StrTmpF=formatMatchingDataWMultSingleDataSet(BundTreeFMult, funMatch, funUnique)
      //myResultWriter.Str['T2D_HL'].push(...StrTmpF, ...StrTmpf)
      myResultWriter.Str.hl=myResultWriter.Str.hl.concat(StrTmpF, StrTmpf)
      var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}
      
      var Str=([].concat(StrTmpF, StrTmpf));
      var strHov=formatTitleStr(Str)
      this.objHL.strTmpShortList=strHov
      return [null];
    }

      // Hash match
    // var BundHash=bundleOnProperty(arrDb, 'strHash'),  nPatHash=Object.keys(BundHash).length
    // var [objHashDup, nHashMult]=extractBundlesWMultiples(BundHash),  nPatHashMult=Object.keys(objHashDup).length;
    // var funMatch=s=>`MatchingData ${s.strHash}`,  funUnique=s=>`  ${s.size.myPadStart(10)} ${s.mtime_ns64} ${s.strName}`;
    // var StrTmp=formatMatchingDataWMultSingleDataSet(objHashDup, funMatch, funUnique)
    // this.BundHash={n:arrDb.length, nPatHash, nPatHashMult, nHashMult}
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
    var strHov=formatTitleStr(Str)
    ObjFeedback.objSTMatch2={strHov, nFile:undefined}
    extend(this, {ObjFeedback});

    myResultWriter.Str.hl=[]

    var [err]=await myResultWriter.writeToFile();  if(err) {debugger; return [err];}

    return [null];
  }

  async readAction(){
    var {fsDb, charTRes, flPrepend, strHost, charSide}=this

      // Parsing fsDb (database)
    setMess(`Fetching db`, null, true)
    var [err, strData]=await readStrFileWHost(fsDb, strHost); if(err) return [err];
    //var [err, strData]=await readStrFile(fsDb); if(err) return [err];
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    setMess(`Parsing db`, null, true)
    var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}
    var [arrDbRelevant, arrDbNonRelevant]=selectFrArrDb(arrDb, flPrepend)
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
    var {fsDbDir, flPrepend, arrDbNonRelevant, strHost}=this
    var {arrSource, arrTarget, arrUntouched, arrSourceM1T1, arrTargetM1T1}=this; //, arrSourceUntouched, arrTargetUntouched, arrCreate, arrDelete, RelM2, Mat2

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
    var {fsDb, strHost, arrTargetNew}=this

    var [err]=await writeDbWrapper(arrTargetNew, fsDb, strHost); if(err) { return [err];}

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




/****************************************************************************************
 * T2T
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
  var {fiDir='.', fiDb, charTRes, iStart=0, myConsole, strHost}=arg
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';


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
//   removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
//   removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)
//     // Parse fsDb
//   var [err, strData]=await readStrFile(fsDb); if(err) return [err]
//   if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
//   var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

//   var [arrDbRelevant]=selectFrArrDb(arrDb, flPrepend)
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
  if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
  var [err, arrDbOther]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

    // Parse tree
  var [err, fsDir]=await myRealPath(fiDirT); if(err) {debugger; return [err];}
  var treeParser=new TreeParser()
  setMess(`Parsing tree`, null, true)
  var arg={charTRes, leafFilter, leafFilterFirst, fsDir, charFilterMethod}
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}

  var [arrDbOtherRelevant, arrDbOtherNonRelevant] =selectFrArrDb(arrDbOther, flPrepend)
  var arrDbOtherOrg=arrDbOther,   arrDbOther=arrDbOtherRelevant

  // var [arrTreefRelevant, arrTreefNonRelevant] =selectFrArrDb(arrTreef, flPrepend)
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
  removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
  removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

  var [arrDbRelevant] =selectFrArrDb(arrDb, flPrepend)
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
  removeLeafFileFromArrTreef(arrTreef, settings.leafDb)
  removeLeafFileFromArrTreef(arrTreef, settings.leafDbB)
    // Parse fsDb
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var [err, arrDb]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

  var [arrDbRelevant] =selectFrArrDb(arrDb, flPrepend)
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
  var [err, arrDbT]=parseDb(strData, charTRes); if(err) {debugger; return [err];}

  var [arrDbTRelevant, arrDbTNonRelevant] =selectFrArrDb(arrDbT, flPrepend)
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
  var {charTRes=settings.charTRes, leafFilter, leafFilterFirst, fiSourceDir, fiTargetDbDir, fiTargetDataDir, charFilterMethod}=arg

  var [err, fsSourceDir]=await myRealPath(fiSourceDir); if(err) {debugger; return [err];}
  var [err, [fsTargetDbDir, fsTargetDataDir]]=await myRealPathArr([fiTargetDbDir, fiTargetDataDir], strHostTarget); if(err) {debugger; return [err]; }
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
