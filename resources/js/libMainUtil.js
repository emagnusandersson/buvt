







//var strcmp = new Intl.Collator(undefined, {numeric:false, sensitivity:'base'}).compare;
var strcmp = new Intl.Collator().compare;
var makeCompFun=function(strProp){
  return (a,b)=>strcmp(a[strProp],b[strProp])
}
var funSorterByStrName=makeCompFun('strName')
var funSorterByInode=makeCompFun('inode')


class Rule{
  constructor( strPat, boInc, charType, boIncSub, boRootInFilterF, boReg, intLevel, iStartOfRuleFileRootInFlName){
    this.strPat=strPat; this.boInc=boInc; this.charType=charType; this.boIncSub=boIncSub; this.boRootInFilterF=boRootInFilterF; this.boReg=boReg; this.intLevel=intLevel; this.iStartOfRuleFileRootInFlName=iStartOfRuleFileRootInFlName
    if(boReg) this.regPat=RegExp(strPat)
  }
  test( shortname, flName, intLevelOfStr){
      // "Bail" if the pattern is at a level where it is not supposed to be used. 
    if(!this.boIncSub && intLevelOfStr>this.intLevel) return false  

      // Empty pattern matches everything
    if(this.strPat.length==0) return true

      // Detemine strName
    var strName
    if(this.boRootInFilterF) strName=flName.slice(this.iStartOfRuleFileRootInFlName)
    else strName=shortname

      // Test pattern
    var boMatch
    if(this.boReg) boMatch=this.regPat.test(strName)
    else boMatch=this.strPat==strName
    return boMatch
  }
}

   // parseFilter
var parseFilter=function(strData, intLevel, iStartOfRuleFileRootInFlName){
  var arrRulef=[]
  var arrRuleF=[]
  //var patLine=re.compile(r'^.*$', re.M)
  var StrLine=strData.split(/\r?\n/);
  for(var strRow of StrLine){
    //strRow=obj.group(0)
    strRow=strRow.trim()
    if(strRow){
      if(strRow[0]=='#') continue
      var iSpace=strRow.indexOf(' ')
      if(iSpace==-1) {var strCtrl=strRow, strPat="";}
      else {var strCtrl=strRow.slice(0, iSpace), strPat=strRow.slice(iSpace).trim(); }
      var boInc=strCtrl[0]=='+'
      var charType=strCtrl.length>1?strCtrl[1]:'f'
      var boIncSub=strCtrl.length>2?strCtrl[2]=='S':false
      var boRootInFilterF=strCtrl.length>3?strCtrl[3]=='R':false
      var boReg=strCtrl.length>4?strCtrl[4]=='R':false
      var rule = new Rule(strPat, boInc, charType, boIncSub, boRootInFilterF, boReg, intLevel, iStartOfRuleFileRootInFlName)
      if(charType=='f') arrRulef.push(rule)
      else if(charType=='F') arrRuleF.push(rule)
      else if(charType=='B') {arrRulef.push(rule); arrRuleF.push(rule)}
      else return [new Error("charType!='fFB'")]
    }
  }
  
  return [null, [arrRulef, arrRuleF]]
}

class TreeParser{
  constructor(){ 
  }
  async getBranch(objDir, intLevel, leafFilterLoc){
    var fsDir=objDir.fsDir
    var flDir=objDir.flDir
    var nNewf=0, nNewF=0

      // Add potetial filter rules
    if(this.boUseFilter){
      var boFoundFilterFile=true
      var fsFilter=fsDir+'/'+leafFilterLoc
      //var [err, buf]=await fsPromises.readFile(fsFilter).toNBP();    //if(err) return [err];
      //var [err, buf] = await Neutralino.filesystem.readFile(fsFilter).toNBP(); 
      var [err, strDataFilter] = await myRead(fsFilter); 
      var boFoundFilterFile=!err;
      if(boFoundFilterFile){
        // strDataFilter=fi.read()
        // fi.close()
        //var strDataFilter=buf.toString();
        //var strDataFilter=strOut;
        
        var iStartOfRuleFileRootInFlName=flDir?flDir.length+1:0
        var [err, result]=parseFilter(strDataFilter, intLevel, iStartOfRuleFileRootInFlName);
        if(err) {debugger; console.log(err.strTrace); return [err]}
        var [arrRulefT, arrRuleFT]=result;
        nNewf=arrRulefT.length;  nNewF=arrRuleFT.length
        this.arrRulef.unshift(...arrRulefT)
        this.arrRuleF.unshift(...arrRuleFT)
      }
    }
    // var it=os.scandir(fsDir)
    // var myListUnSorted=list(it)
    //var [err, DirEnt]=await fsPromises.readdir(fsDir, {withFileTypes:true}).toNBP(); if(err) return [err];
    
    var enumReadDir='existingTools'
    if(enumReadDir=='neu'){
      var [err, DirEnt] = await Neutralino.filesystem.readDirectory(fsDir).toNBP(); if(err) return [err];
      var funSorterNeg=(a,b)=>{if(a.entry>b.entry) return 1; else if(a.entry<b.entry) return -1; return 0;};
    } else if(enumReadDir=='existingTools'){
      var [err, DirEnt] = await myStatsOfDirContent(fsDir);
      var funSorterNeg=(a,b)=>{if(a.name>b.name) return 1; else if(a.name<b.name) return -1; return 0;};
    }
    if(err) {debugger; return [err];}
    var myList=DirEnt.sort(funSorterNeg);
    for(var entry of myList){
      if(enumReadDir=='neu'){
        var {type, entry:strName}=entry;
        var boDir=type=='DIRECTORY'
        var boFile=type=='FILE'
      } else if(enumReadDir=='existingTools'){
        var {boDir, boFile, boSym, name:strName, mtime, mtime_ns, size, inode}=entry;
      }
      if(!boFile && !boDir) continue
      var flName=flDir?flDir+'/'+strName:strName
      var fsName=fsDir+'/'+strName
      //var {boDir, boFile, boSym, name:strName, mtime, mtime_ns, size, inode}=entry;

      if(boSym) continue
      //strName=longnameFold+'/'+strName
      var boMatch=false,  boInc=true
      var arrRuleT=boDir?this.arrRuleF:this.arrRulef
      for(var j=0;j<arrRuleT.length;j++){
        var rule=arrRuleT[j];
        boMatch=rule.test(strName, flName, intLevel)
        if(boMatch) break
      }
      if(boMatch) boInc=rule.boInc
      if(!boInc) continue
 
      if(!boDir){
        // var [err, stats]= await fsPromises.lstat(fsName).toNBP();  if(err) return [err];
        // var {inode, mtime, mtimeMs, size}=stats
        // var mtime_ns=Math.round(mtimeMs*1e6)
        //var st=size.myPad0(12)+'_'+mtime.myPadStart(9,'0')+'_'+mtime_ns.myPadStart(9,'0')
        var st=size.myPad0(12)+'_'+mtime.myPadStart(9,'0');  //+'_'+mtime_ns.myPadStart(9,'0')
        var myFile={"strName":flName, inode, mtime, mtime_ns, size, st} //, "keyST":KeyST(size, mtime_ns, 's')
        this.arrTreef.push(myFile)
      } else{
        // var [err, stats]= await fsPromises.lstat(fsName).toNBP();  if(err) return [err];
        // var {inode, mtime, mtimeMs}=stats
        // var mtime_ns=Math.round(mtimeMs*1e6)
        var myFold={"strName":flName, inode, mtime, mtime_ns}
        this.arrTreeF.push(myFold)
        var objDirChild={"fsDir":fsName, "flDir":flName}
        var [err]=await this.getBranch(objDirChild, intLevel+1, leafFilter);
        if(err) {debugger; return [err];}
      }
    }
    this.arrRulef.splice(0,nNewf)
    this.arrRuleF.splice(0,nNewF)
    return [null]
  }

  async parseTree(fsDir, boUseFilter=false){
    this.boUseFilter=boUseFilter;
    this.arrTreef=[]; this.arrTreeF=[]
    this.arrRulef=[]; this.arrRuleF=[]
    var [err]=await this.getBranch({"fsDir":fsDir, "flDir":""}, 0, leafFilterFirst)  //strName, inode, mtime, mtime_ns, size, keyST
    if(err) {debugger; return [err];}
    //for row in arrTreef: row.mtime=Math.floor(row.mtime)  // Floor mtime
    return [null, this.arrTreef, this.arrTreeF]
  }
}


const EnumMode={LookForStart:1, LookForOld:2, LookForNew:3}

/*****************************************************************
 * parseRenameInput
*****************************************************************/
//var parseRenameInput=function(fiInpFile)
var parseRenameInput=async function(fiInpFile, strStrart='MatchingData'){
  if(strStrart==null) strStrart='MatchingData'
  //class EnumMode(enum.Enum): LookForStart = 1; LookForOld = 2; LookForNew = 3
  
  var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
  var [err, strData] = await myRead(fsInpFile);
  //var strData=buf.toString()

  var arrRename=[]
  var arrInp=strData.split('\n')
  //i=0; nRows=arrInp.length
  var mode=EnumMode.LookForStart
  var strOld="", strNew="", strMeta=""
  //#while(1){
  for(var i in arrInp){
    var strRow=arrInp[i]
    //if(i==nRows) break
    //strRow=arrInp[i]
    //i+=1
    strRow=strRow.strip()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var arrPart=strRow.split()

    if(mode==EnumMode.LookForStart){
      if(arrPart[0]==strStrart) {mode=EnumMode.LookForOld; strMeta=strRow; continue}
    }
    else if(mode==EnumMode.LookForOld){
      strOld=strRow;  mode=EnumMode.LookForNew; continue
    }
    else if(mode==EnumMode.LookForNew){
      strNew=strRow;  mode=EnumMode.LookForStart
    }

    arrRename.push({"strOld":strOld, "strNew":strNew, "strMeta":strMeta})
  }
  
  return [null, arrRename]

}



/*****************************************************************
 * renameFiles (or folders)
 *****************************************************************/
var renameFiles=async function(fsDir, arrRename){
  var arrTmpName=[]
  for(var row of arrRename){    // Rename to temporary names
    var hex=uuid.uuid4().hex
    var fsTmp=fsDir+'/'+row.strNew+'_'+hex
    arrTmpName.push(fsTmp)
    var fsOld=fsDir+'/'+row.strOld
    //var fsPar=os.path.dirname(fsTmp);
    var fsPar=dirname(fsTmp); debugger
    // var boExist=os.path.exists(fsPar);
    // var [err, boExist]=await fileExist(fsPar); if(err) return [err]
    // var boIsDir=os.path.isdir(fsPar)
    var [err, objStats]=await myGetStats(fsPar); if(err) return [err]
    var boExist=Boolean(objStats)
    var {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
    
    if(boExist){
      if(!boIsDir) return [new Error("boExist && !boIsDir")]
    }
    else {
      //Path(fsPar).mkdir(parents=true, exist_ok=true)
      var [err, result]=await Neutralino.filesystem.createDirectory(fsPar).toNBP(); if(err) {debugger; return [err]};
      // var [err, objT] = await Neutralino.os.execCommand('mkdir --parents "'+fsPar+'"').toNBP();
      // if(err) { debugger; return [err];}
      // var {exitCode, pid, stdErr, stdOut}=objT;
      // if(exitCode) { debugger; return [new Error(stdErr)]; };
    }
    var [err, result]=await Neutralino.filesystem.moveFile(fsOld, fsTmp).toNBP(); if(err) return [err];
  }
  for(var i in arrRename){    // Rename to final names
    var row=arrRename[i]
    var fsTmp=arrTmpName[i]
    var fsNew=fsDir+'/'+row.strNew
    //var fsPar=os.path.dirname(fsNew);
    var fsPar=dirname(fsNew); debugger
    //var boExist=os.path.exists(fsPar);
    //var [err, boExist]=await fileExist(fsPar); if(err) return [err]
    //var boIsDir=os.path.isdir(fsPar)
    var [err, objStats]=await myGetStats(fsPar); if(err) return [err]
    var boExist=Boolean(objStats)
    var {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
    if(boExist){
      if(!boIsDir) return [new Error("boExist && !boIsDir")]
    }
    else {
      //Path(fsPar).mkdir(parents=true, exist_ok=true)
      var [err, result]=await Neutralino.filesystem.createDirectory(fsPar).toNBP(); if(err) {debugger; return [err]};
      // var [err, objT] = await Neutralino.os.execCommand('mkdir --parents "'+fsPar+'"').toNBP();
      // if(err) { debugger; return [err];}
      // var {exitCode, pid, stdErr, stdOut}=objT;
      // if(exitCode) { debugger; return [new Error(stdErr)]; };
    }
    var [err, result]=await Neutralino.filesystem.moveFile(fsTmp, fsNew).toNBP(); if(err) return [err];
  }
  return [null]
}

   
var myRmFiles=async function(arrTargetRem, fsDirTarget){
  if(arrTargetRem.length){
    var arr=['rm']
    for(var row of arrTargetRem){
      var fsName=fsDirTarget+'/'+row.strName
      arr.push('"'+fsName+'"')
    }
    //subprocess.run(arr)  // check_output   arr.insert(0,'rm');
    var [err, objT] = await Neutralino.os.execCommand(arr.join(' ')).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [new Error(stdErr)]; };
  }
  return [null]
}
var myRmFolders=async function(arrTargetRem, fsDirTarget){
  if(arrTargetRem.length){
    var arr=['rmdir']
    for(var row of arrTargetRem){
      var fsName=fsDirTarget+'/'+row.strName
      arr.push('"'+fsName+'"')
    }
    //subprocess.run(arr)  // check_output   arr.insert(0,'rm');
    var [err, objT] = await Neutralino.os.execCommand(arr.join(' ')).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [new Error(stdErr)]; };
  }
  return [null]
}
var myCopyEntries=async function(arrSourceRem, fsDirSource, fsDirTarget){
  for(var row of arrSourceRem){
    var fsSouceName=fsDirSource+'/'+row.strName
    var fsTargetName=fsDirTarget+'/'+row.strName
    // var fsPar=os.path.dirname(fsTargetName);  
    var fsPar=dirname(fsTargetName); debugger
    //var boExist=os.path.exists(fsPar);
    //var [err, boExist]=await fileExist(fsPar); if(err) return [err]
    //var boIsDir=os.path.isdir(fsPar)
    var [err, objStats]=await myGetStats(fsPar); if(err) return [err]
    var boExist=Boolean(objStats)
    var {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
    if(boExist) {
      if(!boIsDir) { debugger; return [new Error("boExist && !boIsDir")]; }
    }
    //else Path(fsPar).mkdir(parents=true, exist_ok=true)
    var [err, result]=await Neutralino.filesystem.createDirectory(fsPar).toNBP(); if(err) {debugger; return [err]};
    // var [err, objT] = await Neutralino.os.execCommand('mkdir --parents "'+fsPar+'"').toNBP();
    // if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    // if(exitCode) { debugger; return [new Error(stdErr)]; };

    //subprocess.run(['cp', '-p', fsSouceName,fsTargetName])
    var [err, objT] = await Neutralino.os.execCommand('cp -p "'+fsSouceName+'" "'+fsTargetName+'"').toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [new Error(stdErr)]; };
  }
  return [null]
}

var getRsyncList=async function(fsDir){
  //leafOutputRsync='outputRsync.txt'
  //subprocess.run(['DIR=`mktemp -d /tmp/rsync.XXXXXX`'])
  //dirpath = tempfile.mkdtemp()
  
  //temp_dir = tempfile.TemporaryDirectory()
  //subprocess.run(['rsync', '-nr', "--out-format='%n'", fsDir, dirpath, '>', leafOutputRsync])
  //strData=subprocess.check_output(['rsync', '-nr', "--out-format='%n'", fsDir+'/', temp_dir.name])
  
  //var strData=subprocess.check_output(['rsync', '-nrF', "--out-format='%n'", fsDir+'/', "/dev/false"])
  //var strData=strData.decode("utf-8")

  //subprocess.run(['rmdir', '$DIR'])
  //subprocess.run(['rmdir', dirpath])
  //temp_dir.cleanup()


  var [err, objT] = await Neutralino.os.execCommand(`rsync -nrF --out-format='%n' "`+fsDir+'/" /dev/false').toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) { debugger; return [new Error(stdErr)]; };

  var strData=stdOut

  var arrInp=strData.split('\n')
  arrInp=arrInp.slice(1)
  var arrf=[], arrF=[], arrOther=[]

  for(var flName of arrInp){
    if(flName.length==0) continue
    var flName=trim(flName,"'")
    var fsName=fsDir+'/'+flName
    //var boIsFile=os.path.isfile(fsName)
    //var boIsDir=os.path.isdir(fsName)
    var [err, objStats]=await myGetStats(fsName); if(err) return [err]
    var boExist=Boolean(objStats)
    var {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
    if(boIsFile){
      // var tmp=os.stat(fsName)
      // var inode=tmp.st_ino, mode=tmp.st_mode, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns, size=tmp.st_size
      var [err, tmp]=await myGetStats(fsName), {inode, size, mtime, mtime_ns}=tmp; debugger
      //myFile=MyFile(flName, inode, mtime, mtime_ns, size, 's')
      var myFile={"strName":flName, "inode":inode, "mtime":mtime, "mtime_ns":mtime_ns, "size":size} //, "keyST":KeyST(size, mtime_ns, 's')
      arrf.push(myFile)
    }
    else if(boIsDir){
      // var tmp=os.stat(fsName)
      // var inode=tmp.st_ino, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns
      var [err, tmp]=await myGetStats(fsName), {inode, size, mtime, mtime_ns}=tmp; debugger
      //myFold=MyFold(flName.slice(0,-1), inode, mtime, mtime_ns)
      var myFold={"strName":flName.slice(0,-1), "inode":inode, "mtime":mtime, "mtime_ns":mtime_ns}
      arrF.push(myFold)
    }
    else arrOther.push(flName)
  }
  return [null, arrf, arrF, arrOther]
}


var writeMetaFile=async function(arrDB, fsMeta){
    // If fsMeta exist then rename it
  var [err, objStats]=await myGetStats(fsMeta); if(err) return [err]
  var boExist=Boolean(objStats),  {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
  if(boIsFile){
    var fsMetaWithCounter=await calcFileNameWithCounter(fsMeta)
    var [err, result]=await Neutralino.filesystem.moveFile(fsMeta, fsMetaWithCounter).toNBP(); if(err) return [err];
  }

  var StrOut=Array(arrDB.length+1)
    // Write fsMeta
  //var fo=open(fsMeta,'w')
  StrOut.push('inode strHash mtime size strName')  //uuid 
  for(var i in arrDB){
    var row=arrDB[i]
    //fo.write('%10s %32s %10s %10s %s\n' %(row.inode, row.strHash, Math.floor(row.mtime), row.size, row.strName))
    StrOut[i]=row.inode.myPadStart(10)+' '+row.strHash.padStart(32)+' '+row.mtime.myPadStart(10)+' '+row.size.myPadStart(10)+' '+row.strName
  }
  //fo.close();
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(fsMeta, strOut).toNBP(); if(err) return [err];
  return [null]
}

var writeHashFile=async function(arrDB, fsHash){
    // If fsHash exist then rename it
  var [err, objStats]=await myGetStats(fsHash); if(err) return [err]
  var boExist=Boolean(objStats),  {isDirectory:boIsDir=false, isFile:boIsFile=false}=objStats;
  if(boIsFile){
    var fsHashWithCounter=await calcFileNameWithCounter(fsHash)
    var [err, result]=await Neutralino.filesystem.moveFile(fsHash, fsHashWithCounter).toNBP(); if(err) return [err];
  }

  var StrOut=Array(arrDB.length)
    // Write fsHash
  //var fo=open(fsHash,'w')
  //fo.write('strHash mtime size strName\n')
  for(var i in arrDB){
    var row=arrDB[i]
    //fo.write('%32s %10s %10s %s\n' %(row.strHash, Math.floor(row.mtime), row.size, row.strName))
    StrOut[i]=row.strHash.myPadStart(32)+' '+Math.floor(row.mtime).myPadStart(10)+' '+row.size.myPadStart(10)+' '+row.strName
  }
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(fsHash, strOut).toNBP(); if(err) return [err];
  //fo.close()
  return [null]
}



var selectFrArrDB=function(arrDB, flPrepend){   // Separate relevant from non-relevant entries in arrDB
  var arrDBNonRelevant=[],  arrDBRelevant=[]
  var nPrepend=flPrepend.length
  for(var row of arrDB){
    //var rowCopy=copy.copy(row)
    var rowCopy=extend({},row)
    
    if(row.strName.slice(0,nPrepend)!=flPrepend) arrDBNonRelevant.push(rowCopy)
    else{
      rowCopy.strName=rowCopy.strName.slice(nPrepend)
      //strNameCrop=rowCopy.strName.slice(nPrepend)
      //extend(rowCopy, {"strName":strNameCrop})
      arrDBRelevant.push(rowCopy)
    }
  }
  return [arrDBNonRelevant, arrDBRelevant]
// var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, flPrepend)
}


var writeResultInfo=async function(StrScreen=[], StrResultFile=[], StrRenameOTO=[], StrRenameAncestorOnly=[], StrRenameAncestorOnlyCmd=[], StrDuplicateInitial=[], StrDuplicateFinal=[], StrRenameAdditional=[]){
  var StrWrittenFiles=[]

  var strTmp=StrResultFile.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafResultCompare)}
  //var fof=open(leafResultCompare,'w');   fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafResultCompare, strTmp).toNBP(); if(err) return [err];
  
  var strTmp=StrRenameOTO.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafRenameSuggestionsOTO)}
  //var fof=open(leafRenameSuggestionsOTO,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafRenameSuggestionsOTO, strTmp).toNBP(); if(err) return [err];

  var strTmp=StrRenameAncestorOnly.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafRenameSuggestionsAncestorOnly)}
  //var fof=open(leafRenameSuggestionsAncestorOnly,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafRenameSuggestionsAncestorOnly, strTmp).toNBP(); if(err) return [err];

  var strTmp=StrRenameAncestorOnlyCmd.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafRenameSuggestionsAncestorOnlyCmd)}
  //var fof=open(leafRenameSuggestionsAncestorOnlyCmd,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafRenameSuggestionsAncestorOnlyCmd, strTmp).toNBP(); if(err) return [err];

  var strTmp=StrDuplicateInitial.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafDuplicateInitial)}
  //var fof=open(leafDuplicateInitial,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafDuplicateInitial, strTmp).toNBP(); if(err) return [err];

  var strTmp=StrDuplicateFinal.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafDuplicateFinal)}
  //var fof=open(leafDuplicateFinal,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafDuplicateFinal, strTmp).toNBP(); if(err) return [err];

  var strTmp=StrRenameAdditional.join('\n')
  if(strTmp) {strTmp+='\n'; StrWrittenFiles.push(leafRenameSuggestionsAdditional)}
  //var fof=open(leafRenameSuggestionsAdditional,'w'); fof.write(strTmp);   fof.close()
  var [err]=await Neutralino.filesystem.writeFile(leafRenameSuggestionsAdditional, strTmp).toNBP(); if(err) return [err];
  
  if(StrWrittenFiles) StrScreen.push("More data written to these files: "+StrWrittenFiles.join(', '))
  var strTmp=StrScreen.join('\n');   console.log("%c"+strTmp, 'font-family:monospace')
  return [false]
}
