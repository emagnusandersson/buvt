
"use strict"







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

var createST=function(size,mtime,mtime_ns){
  return size.myPad0(12)+'_'+mtime.myPadStart(9,'0')+'_'+mtime_ns.myPadStart(9,'0');
}

class TreeParser{
  constructor(){ }
  async getBranch(objDir, intLevel){
    var fsDir=objDir.fsDir
    var flDir=objDir.flDir
    var nNewf=0, nNewF=0

      // Add potetial filter rules
    if(this.boUseFilter){
      var boFoundFilterFile=true
      var leafFilterLoc=intLevel==0?this.leafFilterFirst:leafFilter
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
        if(err) {debugger; myConsole.log(err.strTrace); return [err]}
        var [arrRulefT, arrRuleFT]=result;
        nNewf=arrRulefT.length;  nNewF=arrRuleFT.length
        this.arrRulef.unshift(...arrRulefT)
        this.arrRuleF.unshift(...arrRuleFT)
      }
    }
    // var it=os.scandir(fsDir)
    // var myListUnSorted=list(it)
    //var [err, DirEnt]=await fsPromises.readdir(fsDir, {withFileTypes:true}).toNBP(); if(err) return [err];
    
    var enumReadDir='statOfMulti'
    if(enumReadDir=='statOfSingle'){
      var [err, DirEnt] = await Neutralino.filesystem.readDirectory(fsDir).toNBP(); if(err) return [err];
      var funSorterNeg=(a,b)=>{if(a.entry>b.entry) return 1; else if(a.entry<b.entry) return -1; return 0;};
    } else if(enumReadDir=='statOfMulti'){
      var [err, DirEnt] = await myStatsOfDirContent(fsDir);
      var funSorterNeg=(a,b)=>{if(a.name>b.name) return 1; else if(a.name<b.name) return -1; return 0;};
    }
    if(err) {debugger; return [err];}
    var myList=DirEnt.sort(funSorterNeg);
    for(var entry of myList){
      if(enumReadDir=='statOfSingle'){
        var {type, entry:strName}=entry;
        if(strName=='.' || strName=='..') continue
        var boDir=type=='DIRECTORY'
        var boFile=type=='FILE'
      } else if(enumReadDir=='statOfMulti'){
        var {boDir, boFile, boSym, name:strName, mtime, mtime_ns, size, inode}=entry;
      }
      if(!boFile && !boDir) continue
      var flName=flDir?flDir+'/'+strName:strName
      var fsName=fsDir+'/'+strName
      //var {boDir, boFile, boSym, name:strName, mtime, mtime_ns, size, inode}=entry;
      if(enumReadDir=='statOfSingle'){
        var [err, stats] = await Neutralino.filesystem.getStats(fsName).toNBP();
        var {modifiedAt, size}=stats;
        var flMtime=modifiedAt/1000, mtime=Math.floor(flMtime), mtime_ns=(flMtime-mtime)*1e6
        var inode=0, boSym=false;
        // var [err, objT] = await myGetStats(fsName); if(err) {debugger; return [err];}
        // var {boSym, inode, mtime, mtime_ns, size}=objT;
      }
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
        var st=createST(size, mtime, mtime_ns)
        var myFile={"strName":flName, inode, mtime, mtime_ns, size, st}
        this.arrTreef.push(myFile)
      } else{
        // var [err, stats]= await fsPromises.lstat(fsName).toNBP();  if(err) return [err];
        // var {inode, mtime, mtimeMs}=stats
        // var mtime_ns=Math.round(mtimeMs*1e6)
        var myFold={"strName":flName, inode, mtime, mtime_ns}
        this.arrTreeF.push(myFold)
        var objDirChild={"fsDir":fsName, "flDir":flName}
        var [err]=await this.getBranch(objDirChild, intLevel+1);
        if(err) {debugger; return [err];}
      }
    }
    this.arrRulef.splice(0,nNewf)
    this.arrRuleF.splice(0,nNewF)
    return [null]
  }

  async parseTree(fsDir, boUseFilter=false, leafFilterFirst=leafFilter){
    this.boUseFilter=boUseFilter;
    this.leafFilterFirst=leafFilterFirst
    this.arrTreef=[]; this.arrTreeF=[]
    this.arrRulef=[]; this.arrRuleF=[]
    var [err]=await this.getBranch({"fsDir":fsDir, "flDir":""}, 0)  //strName, inode, mtime, mtime_ns, size, keyST
    if(err) {debugger; return [err];}
    return [null, this.arrTreef, this.arrTreeF]
  }
}

var parseTreePython=async function(fsDir, boUseFilter=false, leafFilterFirst=leafFilter){
  fsDir=escDoubleQuote(fsDir)
  var progName='~/progPython/buvt/buvt.py'
  var [err, objT] = await Neutralino.os.execCommand(`${progName} parseTreeNDump --boUseFilter ${boUseFilter} --leafFilterFirst ${leafFilterFirst} --fiDir "${fsDir}"`).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    debugger; return [new Error(stdErr)];
  } 
  var StrGroup=stdOut.split('@\n'), nGroup=StrGroup.length
  
  var ArrGroup=Array(nGroup)
  for(var j=0;j<nGroup;j++){
    var strGroup=StrGroup[j].trim();
    if(strGroup.length==0) var StrRow=[];
    else var StrRow=strGroup.split('\n')
    var nRow=StrRow.length, arrGroup=Array(nRow)
    for(var i=0;i<nRow;i++){
      var strRow=StrRow[i];
      var indAt=strRow.indexOf('@'), indNameStart=indAt+1;
      var flName=strRow.slice(indNameStart);
      var strMeta=strRow.slice(0, indAt);
      if(j==0) {
        var [strType, inode, mtime_ns, size]=strMeta.split(" ");
      }else {
        var [inode, mtime_ns, size]=strMeta.split(" ");
      }
      inode=Number(inode)
      var mtime=mtime_ns.slice(0,-9), mtime_ns=mtime_ns.slice(-9)
      mtime=Number(mtime); mtime_ns=Number(mtime_ns);
      if(j==0) {
        size=Number(size);
        var st=createST(size, mtime, mtime_ns);
        arrGroup[i]={strName:flName, inode, mtime, mtime_ns, size, strType, st}
      }else {
        arrGroup[i]={strName:flName, inode, mtime, mtime_ns}
      }
    }
    ArrGroup[j]=arrGroup
  }

  return [null, ...ArrGroup]
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
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var arrPart=strRow.split(/\s+/)

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


  fsDir=escDoubleQuote(fsDir)
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
    var [err, objStats]=await myGetStats(fsName);
    if(err) {
      if(err.message=='noSuch') objStats={}
      else return [err];
    }
    var boExist=Boolean(objStats)
    var {boDir=false, boFile=false}=objStats;
    if(boFile){
      // var tmp=os.stat(fsName)
      // var inode=tmp.st_ino, mode=tmp.st_mode, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns, size=tmp.st_size
      var [err, objStats]=await myGetStats(fsName);
      if(err) {
        if(err.message=='noSuch') objStats={}
        else return [err];
      }
      var {inode, size, mtime, mtime_ns}=objStats; debugger
      //myFile=MyFile(flName, inode, mtime, mtime_ns, size, 's')
      var myFile={"strName":flName, "inode":inode, "mtime":mtime, "mtime_ns":mtime_ns, "size":size}
      arrf.push(myFile)
    }
    else if(boDir){
      // var tmp=os.stat(fsName)
      // var inode=tmp.st_ino, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns
      var [err, objStats]=await myGetStats(fsName);
      if(err) {
        if(err.message=='noSuch') objStats={}
        else return [err];
      }
      var {inode, size, mtime, mtime_ns}=objStats; 
      //myFold=MyFold(flName.slice(0,-1), inode, mtime, mtime_ns)
      var myFold={"strName":flName.slice(0,-1), "inode":inode, "mtime":mtime, "mtime_ns":mtime_ns}
      arrF.push(myFold)
    }
    else arrOther.push(flName)
  }
  return [null, arrf, arrF, arrOther]
}

var parseMeta=async function(fsMeta){
  var [err, arrDB]=await parseSSV(fsMeta)
  if(err) return [err]
  var nData=arrDB.length
  if(nData==0)  return [null, arrDB]
    // Cast some properties 
  formatColumnData(arrDB, {"size":"number", "inode":"number"})

    // Rename ino to inode
  if('ino' in arrDB[0]){
    for(var obj of arrDB){
      obj.inode=obj.ino; delete obj.ino;
    }
  }
    // If any mtime is longer than 10 char, then assume ns
  var boNs=false
  for(obj of arrDB){
    if(obj.mtime.length>10) {boNs=true; break;}
  }
  if(boNs){
    for(obj of arrDB){
      obj.mtime_ns=Number(obj.mtime.slice(-9))
      obj.mtime=Number(obj.mtime.slice(0,-9))
    }
  } else{
    for(obj of arrDB){
      obj.mtime=Number(obj.mtime)
      obj.mtime_ns=0
    }
  }

    // Create st
  for(obj of arrDB){
    obj.st=createST(obj.size, obj.mtime, obj.mtime_ns);
  }
  return [null, arrDB]
}

/*******************************************************
 * parseHashFile
 *******************************************************/
var parseHashFile=async function(fsHashFile){
  var [err, buf] = await Neutralino.filesystem.readFile(fsHashFile).toNBP(); if(err) return [err]
  var strData=buf.toString()
  var arrOut=[],   arrInp=strData.split('\n')
  for(var strRow of arrInp){
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var arrPart=mySplit(strRow, /\s+/g, 3)
    arrOut.push({"strHash":arrPart[0], "mtime":Number(arrPart[1]), "size":Number(arrPart[2]), "strName":arrPart[3]})
  }
  return [null, arrOut]
}