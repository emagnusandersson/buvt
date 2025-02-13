
"use strict"

//
// File categories in T2T: CopyToTarget, CategoryDelete, CopyOnTarget1, CopyOnTarget2, MoveOnTarget, CategorySetMTime, MoveOnTargetNSetMTime, CategoryUntouched
//



class CategoryDelete{ 
  constructor(arg){
    var {RelationHash}=arg;
    copySome(this, arg, ["RelationHash", "fsSourceDir", "strHostTarget", "fsTargetDataDir"]);

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
    var strHov=formatTitleStr(Str)
    //var strHov=lStr?StrHov.join('\n'):undefined;
    return [Str, {strHov, nFile}]; 
  }
  getFiOfDeleted(){ 
    var {Str}=this; 
    return Str; 
  }
  async delete(){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir, arrEntry}=this
    var StrTmp=arrEntry.map(row=>fsTargetDataDir+charF+row.strName)
    var [err]=await myRmFiles(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}


var CopyProt={
  getId:async function(){
    var {arrEntry, strHostTarget, fsTargetDataDir}=this, n=arrEntry.length
    var StrName=arrEntry.map(row=>row.strName)
    var [err, Id]=await getId(StrName, fsTargetDataDir, strHostTarget);  if(err) {debugger; return [err];}
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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nS, nT}]; 
  }
}
var CopyToTarget={ // For dealing with all files that needs to be copied TO the target (such as via a slow network)
  factory(arg){
    var that={}
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst

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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
  },
  async copy(){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir, arrEntry}=this
    //var {fsTmpTarget}=gThis
    var fsTmpTarget=fsTargetDataDir+charF+'tmp_'+myUUID()
    extend(this, {fsTmpTarget})

    // var [err, result]=await myMkFolders([fsTmpTarget], strHostTarget); if(err) {debugger; return [err];}
    // var [err, result]=await myCopyEntriesWHost(arrEntry, fsSourceDir, fsTmpTarget, strHostTarget); if(err) {debugger; return [err];}
    var [err, result]=await myCopyEntriesWHost(arrEntry, fsSourceDir, fsTargetDataDir, strHostTarget); if(err) {debugger; return [err];}
    return [null]
  },
  // async renameToFinal(){
  //   var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir, arrEntry, fsTargetTmpDir}=this
  //   //var {fsTmpTarget}=gThis
  //   var {fsTmpTarget}=this
  //   var len=arrEntry.length, arrArg=Array(len)
  //   for(var i=0;i<len;i++){
  //     var {strName}=arrEntry[i], fsOld=fsTmpTarget+charF+strName, fsNew=fsTargetDataDir+charF+strName;    arrArg[i]={fsOld, fsNew}
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
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst

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
    var {fsSourceDir, strHostTarget, fsTargetDataDir, arrPairCopy}=this
    var [err, Id]=await copyLocally(fsTargetDataDir, arrPairCopy, strHostTarget);  if(err) {debugger; return [err];}
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
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(that, arg, ["strHostTarget"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(that, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst

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
          var fsNew=fsTargetDataDir+charF+fiT, fsTmp=fsTargetDataDir+charF+fiTmp;
          FsNew.push(fsNew); FsTmp.push(fsTmp); arrPairCopy.push([rowS, rowTTmp]); arrPairFinal.push([rowTTmp, rowT])
        }
      }
    }
    extend(that, {Str, FsNew, FsTmp, arrPairCopy, nS, nT:arrPairCopy.length, arrPairFinal}); 
    return that;
  },
  async copyToTemp(){
    var {fsSourceDir, strHostTarget, fsTargetDataDir, arrPairCopy, arrPairFinal}=this
    var [err, Id]=await copyLocally(fsTargetDataDir, arrPairCopy, strHostTarget);  if(err) {debugger; return [err];}
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
    var {fsSourceDir, strHostTarget, fsTargetDataDir, FsNew, FsTmp}=this
    var len=FsTmp.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsTmp[i], fsNew=FsNew[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}


class MoveOnTargetProt{
  constructor(arg, boWhenMTimeIsMatching){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst
  }
  async renameToTemp(){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir, arrRename, FsOld, FsNew, FsTmp}=this
    var len=FsOld.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsOld[i], fsNew=FsTmp[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
  async renameToFinal(){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir, arrRename, FsOld, FsNew, FsTmp}=this
    var len=FsTmp.length, arrArg=Array(len)
    for(var i=0;i<len;i++){
      var fsOld=FsTmp[i], fsNew=FsNew[i];    arrArg[i]={fsOld, fsNew}
    }
    var [err]=await renameFiles(arrArg, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}

class MoveOnTarget extends MoveOnTargetProt{
  constructor(arg){
    super(arg)
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst
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
          var fsOld=fsTargetDataDir+charF+strNameOld, fsNew=fsTargetDataDir+charF+strNameNew, fsTmp=fsNew+'_'+myUUID();
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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
  }
}

class MoveOnTargetNSetMTime extends MoveOnTargetProt{
  constructor(arg){
    super(arg)
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst
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
          var fsOld=fsTargetDataDir+charF+strNameOld, fsNew=fsTargetDataDir+charF+strNameNew, fsTmp=fsNew+'_'+myUUID();
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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
  }
  async setMTime(){
    var {RelationHash, strHostTarget, fsTargetDataDir, arrRename}=this
    var arrFile=arrRename.map(obj=>obj.rowN)
    var [err]=await setMTime(arrFile, fsTargetDataDir, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}

class CategorySetMTime{
  constructor(arg){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fsTargetDataDir", "fiTargetDbDir", , "charFilterMethod"
    extend(this, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst

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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
  }
  async setMTime(){
    var {RelationHash, strHostTarget, fsTargetDataDir, arrMTimeDiff}=this
    var arrFile=arrMTimeDiff.map(obj=>obj.rowN)
    var [err]=await setMTime(arrFile, fsTargetDataDir, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}

class CategoryUntouched{
  constructor(arg){
    var {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}=arg;
    //copySome(this, arg, ["RelationHash"]); //"fiSourceDir", "fiTargetDbDir", "fsTargetDataDir",  , "charFilterMethod"
    extend(this, {RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}); //charTRes, leafFilter, leafFilterFirst
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
    var strHov=formatTitleStr(Str)
    return [Str, {strHov, nFile}]; 
  }
}




class SyncT2TUsingHash{
  constructor(arg){
    var {charTRes, leafFilter, leafFilterFirst, fsTargetDbDir, flTargetDataDir}=arg
    copySome(this, arg, ["fsSourceDir", "strHostTarget", "charFilterMethod", "boAllowLinks", "boAllowCaseCollision", "strTargetCharSet"]);
    var fsTargetDataDir=fsTargetDbDir; if(flTargetDataDir) fsTargetDataDir=fsTargetDbDir+charF+flTargetDataDir
    extend(this, {charTRes, leafFilter, leafFilterFirst, fsTargetDbDir, flTargetDataDir, fsTargetDataDir})
  }
  
  async compare(){
    var {charTRes, leafFilter, leafFilterFirst, fsSourceDir, strHostTarget, fsTargetDbDir, flTargetDataDir, fsTargetDataDir, charFilterMethod, boAllowLinks, boAllowCaseCollision, strTargetCharSet}=this
 
      // Quick return if target doesn't exists. (It would have been detected when parsing, but this way one doesn't have to wait.)
    var [err, boExist]=await fileExist(fsTargetDataDir, strHostTarget); if(err) {debugger; return [err]; }
    if(!boExist){var strExtra=strHostTarget?' on '+strHostTarget:'';  return [Error(`${fsTargetDataDir} does not exist${strExtra}`)];}

    if(1){ //boRemote
        // Load python-script to host
      var [err]=await interfacePython.uploadZip(strHostTarget); if(err) { debugger; return [err];}
    }
    
    
    //var fleData=calcFleChild(fsTargetDbDir, fsTargetDataDir); extend(this, {fleData})


      // Parsing source tree
    var treeParser=new TreeParser()
    setMess(`Parsing source tree`, null, true)
    var arg={charTRes, leafFilter, leafFilterFirst, fsDir:fsSourceDir, charFilterMethod}
    var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    removeLeafFileFromArrTreef(arrSourcef, settings.leafDb); // Note this does not remove the .bak.txt files
    removeLeafFileFromArrTreef(arrSourcef, settings.leafDbB)
    var tStop=unixNow();   //myConsole.log(`Source parsed, elapsed time ${(tStop-tStart)}ms`)
    //arrSourcef.sort(funIncId)

      // Parsing target tree
    setMess(`Parsing target tree`, null, true);  
    var arg={charTRes, leafFilter, leafFilterFirst, strHost:strHostTarget, fsDir:fsTargetDataDir, charFilterMethod}
    var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    //removeLeafFileFromArrTreef(arrTargetf, settings.leafDb); // Note! this arrTargetf is not used (so this line could be deleted)
    //removeLeafFileFromArrTreef(arrTargetf, settings.leafDbB)
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
    var [err, arrDbS]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDbS, charTRes);
    arrDbS.sort(funIncStrName);   

      // Parsing target db
    setMess(`Fetching target db`, null, true);  
    var [err, strData]=await readStrFileWHost(fsTargetDbDir+charF+settings.leafDb, strHostTarget); if(err) return [err]
    setMess(`Parsing target db`, null, true);  
    var [err, arrDbT]=parseDb(strData); if(err) {debugger; return [err];}
    funSetMTimeArr(arrDbT, charTRes);
    arrDbT.sort(funIncStrName)

    var fleTargetDataDir=flTargetDataDir.length?flTargetDataDir+charF:""
    var [arrDbTRelevant, arrDbTNonRelevant]=ArrDb.selectFrArrDbOld(arrDbT, fleTargetDataDir)
    // var fleTargetDataDir=flTargetDataDir+charF
    // //var [arrDbRelevant, arrDbNonRelevant]=selectFrArrDb(arrDbT, fleTargetDataDir);
    // var [arrSelected, arrDbTNonRelevant] =ArrDb.selectWPrefix(arrDbT, fleTargetDataDir)
    // var arrDbTRelevant=ArrDb.copy(arrSelected), arrDbTRelevant=ArrDb.removePrefix(arrDbTRelevant, fleTargetDataDir)
    

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
    var strHov=formatTitleStr(Str), lStr=Str.length
    ObjFeedback.objLink={strHov, nFile:lStr}; 

      // CaseCollisions
    var BundMult={}, nMultf=0
    if(!boAllowCaseCollision){
      var Bundf=bundleOnProperty(arrDbSM, r=>r.strName.toLowerCase())
      var [BundMult, nMultf, arrSingle]=extractBundlesWMultiples(Bundf),  nMultPatf=Object.keys(BundMult).length;
      arrDbSM=arrSingle;
    }
    var Str=[]
    for(var k in BundMult){
      var bundT=BundMult[k];   Str.push(k)
      for(var i=0;i<bundT.length;i++){Str.push(`  ${bundT[i].strName}`)}
    }
    myResultWriter.Str.caseCollision=Str; 
    var strHov=formatTitleStr(Str)
    ObjFeedback.objCaseCollision={strHov, nFile:nMultf}

      // ReservedChar
      // Googled "filesystems supported char" found this: https://en.wikipedia.org/wiki/Filename  // Reserved (MS): "*/:<>?\|
    var arrLinks=[]
    var RegReservedChar={ms:/["\*\/:<>\?\\\|]/, ext4:``}
    var RegReservedCharWOFwdSlash={ms:/["\*:<>\?\\\|]/, ext4:``}
    var arrReservedChar=[], arrReservedCharF=[];
    if(strTargetCharSet=='ms'){
      var reg=RegReservedCharWOFwdSlash.ms
      //var arrDbSM=arrDbSM.filter(r=>{var leaf=basename(r.strName), boRes=reg.test(leaf); if(boRes) arrReservedChar.push(r); return !boRes})
      var arrDbSM=arrDbSM.filter(r=>{var boRes=reg.test(r.strName); if(boRes) arrReservedChar.push(r); return !boRes})
      //var arrCreateF=arrCreateF.filter(r=>{var leaf=basename(r.strName), boRes=reg.test(leaf); if(boRes) arrReservedCharF.push(r); return !boRes})
    }
    var Str=myResultWriter.Str.reservedChar=arrReservedChar.map(row=>row.strName)
    var strHov=formatTitleStr(Str), lStr=Str.length
    ObjFeedback.objReservedChar={strHov, nFile:lStr}; 

    //extend(this, {arrReservedChar, arrReservedCharF})


    var arrSource=arrDbSM, arrTarget=arrDbTM
    extend(this, {arrSource, arrTarget})

      // Categorize by Hash
    setMess(`Categorize by Hash`, null, true);  
    arrSource.sort(funIncHash);   arrTarget.sort(funIncHash)
    var funHash=row=>row.strHash
    var RelationHash=categorizeByProp(arrSource, arrTarget, funHash)
    rearrangeByBestNameMatchArr(RelationHash); // Note! this will add "nExactName" and "nExactNameNMTime" as a properties on each relation
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

    var objArg={RelationHash, fsSourceDir, strHostTarget, fsTargetDataDir}
    var categoryDelete=new CategoryDelete(objArg)
    var copyOnTarget1=CopyOnTarget1.factory(objArg)
    var moveOnTarget=new MoveOnTarget(objArg)
    var moveOnTargetNSetMTime=new MoveOnTargetNSetMTime(objArg)
    var categorySetMTime=new CategorySetMTime(objArg);
    var copyToTarget=CopyToTarget.factory(objArg)
    var copyOnTarget2=CopyOnTarget2.factory(objArg)
    var categoryUntouched=new CategoryUntouched(objArg);
    
    var objCat=extend({}, {categoryDelete, copyOnTarget1, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, copyToTarget, copyOnTarget2, nExactTot})
    
    formatMultiPots(myResultWriter, Mat1, 1)

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
    var {charTRes, leafFilter, leafFilterFirst, categoryDelete, copyOnTarget1, moveOnTarget, moveOnTargetNSetMTime, categorySetMTime, copyToTarget, copyOnTarget2, arrDbS, arrDbTNonRelevant, fsSourceDir, strHostTarget, fsTargetDbDir, flTargetDataDir, fsTargetDataDir, arrSource, charFilterMethod}=this;
    var [err]=await this.createFolders(); if(err) {debugger; return [err];}
  
    var [err]=await categoryDelete.delete(); if(err) {debugger; return [err];}
    myConsole.printNL(`copyOnTarget1.copyToTemp ...`)
    var [err]=await copyOnTarget1.copyToTemp(); if(err) {debugger; return [err];}
    myConsole.printNL(`moveOnTarget.renameToTemp ...`)
    var [err]=await moveOnTarget.renameToTemp(); if(err) {debugger; return [err];}
    myConsole.printNL(`moveOnTargetNSetMTime.renameToTemp ...`)
    var [err]=await moveOnTargetNSetMTime.renameToTemp(); if(err) {debugger; return [err];}
       // By this point, the old names (that might be reused), have been cleared.

    myConsole.printNL(`copyOnTarget1.renameToFinal ...`)
    var [err]=await copyOnTarget1.renameToFinal(); if(err) {debugger; return [err];}
    myConsole.printNL(`moveOnTarget.renameToFinal ...`)
    var [err]=await moveOnTarget.renameToFinal(); if(err) {debugger; return [err];}
    myConsole.printNL(`moveOnTargetNSetMTime.renameToFinal ...`)
    var [err]=await moveOnTargetNSetMTime.renameToFinal(); if(err) {debugger; return [err];}

    myConsole.printNL(`moveOnTargetNSetMTime.setMTime ...`)
    var [err]=await moveOnTargetNSetMTime.setMTime(); if(err) {debugger; return [err];}
    myConsole.printNL(`categorySetMTime.setMTime ...`)
    var [err]=await categorySetMTime.setMTime(); if(err) {debugger; return [err];}

    myConsole.printNL(`copyToTarget.copy ...`)
    var [err]=await copyToTarget.copy(); if(err) {debugger; return [err];}

    //var [err]=await copyToTarget.renameToFinal(); if(err) {debugger; return [err];} // Renames to final name
    myConsole.printNL(`copyOnTarget2.copy ...`)
    var [err]=await copyOnTarget2.copy(); if(err) {debugger; return [err];}

    myConsole.printNL(`deleteFolders ...`)
    var [err]=await this.deleteFolders(); if(err) {debugger; return [err];}

    myConsole.printNL(`copyToTarget.getId ...`)
    var [err]=await copyToTarget.getId(); if(err) {debugger; return [err];}
    // await copyOnTarget1.getId(); 
    // await copyOnTarget2.getId(); 

    // setMess(`Parsing target tree`, null, true)
    // var treeParser=new TreeParser()
    // var arg={charTRes, leafFilter, leafFilterFirst, strHost:strHostTarget, fsDir:fsTargetDataDir, charFilterMethod}
    // var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(arg); if(err) {debugger; return [err];}
    // removeLeafFileFromArrTreef(arrTargetf, settings.leafDb)
    // removeLeafFileFromArrTreef(arrTargetf, settings.leafDbB)
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
    
    // if(fleData.length>0){
    //   for(var row of arrTargetUntouched) row.strName=fleData+row.strName
    // }
    // var arrDbTNew=arrTargetUntouched.concat(arrDbTNonRelevant)

    if(flTargetDataDir){
      for(var row of arrSource) row.strName=flTargetDataDir+charF+row.strName
    }
    var arrDbTNew=arrSource.concat(arrDbTNonRelevant)

    arrDbTNew.sort(funIncStrName)
    var strData=formatDb(arrDbTNew)
    myConsole.printNL(`writeFileRemote ...`)
    var [err]=await writeFileRemote(fsTargetDbDir+charF+settings.leafDb, strData, strHostTarget); if(err) {debugger; return [err];}
    return [null]
  }
  
  async createFolders(){
    var {arrCreateF, strHostTarget, fsTargetDataDir}=this;
    var StrTmp=arrCreateF.map(row=>fsTargetDataDir+charF+row.strName)
    var [err]=await myMkFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
  async deleteFolders(){
    var {arrDeleteF, strHostTarget, fsTargetDataDir}=this;
    var StrTmp=arrDeleteF.map(row=>fsTargetDataDir+charF+row.strName)
    StrTmp.sort().reverse()
    var [err]=await myRmFolders(StrTmp, strHostTarget);  if(err) {debugger; return [err];}
    return [null]
  }
}

