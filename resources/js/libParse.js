
"use strict"







//var strcmp = new Intl.Collator(undefined, {numeric:false, sensitivity:'base'}).compare;
var strcmp = new Intl.Collator().compare;
var makeCompFun=function(strProp){
  return (a,b)=>strcmp(a[strProp],b[strProp])
}
var funIncByStrName=makeCompFun('strName')
var funIncById=makeCompFun('id')


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
      else return [Error("charType!='fFB'")]
    }
  }
  
  return [null, [arrRulef, arrRuleF]]
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
      var leafFilterLoc=intLevel==0?this.leafFilterFirst:settings.leafFilter
      var fsFilter=fsDir+charF+leafFilterLoc
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
        if(err) {debugger; return [err]} 
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
      var funInc=(a,b)=>{if(a.entry>b.entry) return 1; else if(a.entry<b.entry) return -1; return 0;};
    } else if(enumReadDir=='statOfMulti'){
      var [err, DirEnt] = await myStatsOfDirContent(fsDir);
      var funInc=(a,b)=>{if(a.name>b.name) return 1; else if(a.name<b.name) return -1; return 0;};
    }
    if(err) {debugger; return [err];}
    var myList=DirEnt.sort(funInc);
    for(var entry of myList){
      if(enumReadDir=='statOfSingle'){
        var {type, entry:strName}=entry;
        if(strName=='.' || strName=='..') continue
        var boDir=type=='DIRECTORY'
        var boFile=type=='FILE'
      } else if(enumReadDir=='statOfMulti'){
        var {boDir, boFile, boSym, name:strName, mtime_ns64, size, id}=entry;
      }
      if(!boFile && !boDir) continue
      var flName=flDir?flDir+charF+strName:strName
      var fsName=fsDir+charF+strName
      //var {boDir, boFile, boSym, name:strName, mtime, mtime_ns, size, id}=entry;
      if(enumReadDir=='statOfSingle'){
        var [err, stats] = await Neutralino.filesystem.getStats(fsName).toNBP();
        var {modifiedAt, size}=stats;
        var mtime_ns64=BigInt(modifiedAt)*BigInt(1e6);
        var id=0, boSym=false;
        // var [err, objT] = await myGetStats(fsName); if(err) {debugger; return [err];}
        // var {boSym, id, mtime, mtime_ns, size}=objT;
      }
      if(boSym) continue
      //strName=longnameFold+charF+strName
      var boMatch=false,  boInc=true
      var arrRuleT=boDir?this.arrRuleF:this.arrRulef
      for(var j=0;j<arrRuleT.length;j++){
        var rule=arrRuleT[j];
        boMatch=rule.test(strName, flName, intLevel)
        if(boMatch) break
      }
      if(boMatch) boInc=rule.boInc
      if(!boInc) continue

      var {charTRes}=this

      var mtime_ns64R=roundMTime64(mtime_ns64, charTRes);
      var strMTime=calcStrTime(mtime_ns64)
      var strMTimeR=calcStrTime(mtime_ns64R);
      var strMTimeSnake=calcStrTimeSnake(strMTime);
      var strMTimeRSnake=calcStrTimeSnake(strMTimeR);
      var objEntry={strName:flName, id,   strMTime, strMTimeR, strMTimeSnake, strMTimeRSnake, mtime_ns64, mtime_ns64R}
      if(!boDir){
        var sm=createSM64(size, mtime_ns64R)
        extend(objEntry, {size, sm})
        this.arrTreef.push(objEntry)
      } else{
        // var [err, stats]= await fsPromises.lstat(fsName).toNBP();  if(err) return [err];
        // var {id, mtime, mtimeMs}=stats
        // var mtime_ns=Math.round(mtimeMs*1e6)
        this.arrTreeF.push(objEntry)
        var objDirChild={"fsDir":fsName, "flDir":flName}
        var [err]=await this.getBranch(objDirChild, intLevel+1);
        if(err) {debugger; return [err];}
      }
    }
    this.arrRulef.splice(0,nNewf)
    this.arrRuleF.splice(0,nNewF)
    return [null]
  }

  async parseTree(fsDir, charTRes, leafFilterFirst=null){
    var boUseFilter=Boolean(leafFilterFirst)
    this.boUseFilter=boUseFilter;
    this.leafFilterFirst=leafFilterFirst
    this.charTRes=charTRes
    this.arrTreef=[]; this.arrTreeF=[]
    this.arrRulef=[]; this.arrRuleF=[]
    var [err]=await this.getBranch({"fsDir":fsDir, "flDir":""}, 0)  //strName, id, mtime, mtime_ns, size, keySM
    if(err) {debugger; return [err];}

    // if(!boIncludeLeafDb){
    //   removeLeafDbFromArrTreef(this.arrTreef)
    // }
    return [null, this.arrTreef, this.arrTreeF]
  }
}

var removeLeafDbFromArrTreef=function(arrTreef, leafDb){
  for(var i in arrTreef){
    if(arrTreef[i].strName==leafDb){ arrTreef.splice(i, 1); break } 
  }
  //return arr
}



class TreeParserPython{
  constructor(){ }
  async parseTree(fsDir, charTRes, leafFilterFirst=null){


    var arrCommand=['~/progPython/buvtpy/buvt.py', 'parseTreeNDump']
    var arrCommand=['python', '~/progPython/parseTreeNDump/parseTreeNDump.py']
    var arrCommand=['python', fsPyParser, 'parseTreeNDump'];
    var boUseFilter=Boolean(leafFilterFirst)
    arrCommand.push('--boUseFilter', boUseFilter)
    if(leafFilterFirst) arrCommand.push('--leafFilterFirst', leafFilterFirst);
    arrCommand.push('--fiDir', escInQ(fsDir))
    var strCommand=arrCommand.join(' ')
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) {
      debugger; return [Error(stdErr)];
    } 
    //var StrGroup=stdOut.split('@\n');
    var StrGroup=stdOut.split(RegExp("^@$",'m'));
    
    var nGroup=StrGroup.length
    if(nGroup==1) {
      var nMax=500, strTruncMess=stdOut.length>nMax?'...(error message truncated)':'', strErr=`nGroup==1: ${stdOut.slice(0,nMax)} ${strTruncMess}`;
      return [Error(strErr)];
    }
    
    var ArrGroup=Array(nGroup)
    for(var j=0;j<nGroup;j++){ // j==0 => files, j==1 => folders
      var strGroup=StrGroup[j].trim();
      if(strGroup.length==0) var StrRow=[];
      else var StrRow=strGroup.split(RegExp("\r?\n"))
      var nRow=StrRow.length, arrGroup=Array(nRow)
      for(var i=0;i<nRow;i++){
        var strRow=StrRow[i];
        var indAt=strRow.indexOf('@'), indNameStart=indAt+1;
        var flName=strRow.slice(indNameStart);
        var strMeta=strRow.slice(0, indAt);
        if(j==0) {
          var [strType, id, strMTime, size]=strMeta.split(" ");
          size=Number(size)
        }else {
          var [id, strMTime]=strMeta.split(" "); //, size
        }
        id=Number(id)
        if(strMTime.length!=19) {debugger; throw Error(`strMTimeOrg.length!=19 (${strMTime} (${flName}))`);}
        
        var mtime_ns64=BigInt(strMTime)
        var mtime_ns64R=roundMTime64(mtime_ns64, charTRes);
        var strMTimeR=calcStrTime(mtime_ns64R)
        var strMTimeSnake=calcStrTimeSnake(strMTime);
        var strMTimeRSnake=calcStrTimeSnake(strMTimeR);
        var objTmp={strName:flName, id,   strMTime, strMTimeR, strMTimeSnake, strMTimeRSnake, mtime_ns64, mtime_ns64R}
        if(j==0) {
          var sm=createSM64(size, mtime_ns64R)
          extend(objTmp, { strType, size, sm});
        }
        arrGroup[i]=objTmp
      }
      ArrGroup[j]=arrGroup
    }

    return [null, ...ArrGroup]
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
  //strData=subprocess.check_output(['rsync', '-nr', "--out-format='%n'", fsDir+charF, temp_dir.name])
  
  //var strData=subprocess.check_output(['rsync', '-nrF', "--out-format='%n'", fsDir+charF, "/dev/false"])
  //var strData=strData.decode("utf-8")

  //subprocess.run(['rmdir', '$DIR'])
  //subprocess.run(['rmdir', dirpath])
  //temp_dir.cleanup()

  if(NL_OS=='Windows'){ debugger; return [Error("Windows not supported")]; }
  var arrCommand=[`rsync -nrF --out-format='%n'`, escInQ(fsDir), `/dev/false`]
  var strCommand=arrCommand.join(' ')
  var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) { debugger; return [Error(stdErr)]; };

  var strData=stdOut

  var arrInp=strData.split('\n')
  arrInp=arrInp.slice(1)
  var arrf=[], arrF=[], arrOther=[]

  for(var flName of arrInp){
    if(flName.length==0) continue
    var flName=trim(flName,"'"); 
    var fsName=fsDir+charF+flName
    var [err, objStats]=await myGetStats(fsName);
    if(err) {
      if(err.message=='noSuch') objStats={}
      else return [err];
    }
    var boExist=Boolean(objStats)
    var {boDir=false, boFile=false, id, size, mtime_ns64}=objStats;

    var objEntry={id, mtime_ns64}
    if(boFile){
      // var tmp=os.stat(fsName)
      // var id=tmp.st_ino, mode=tmp.st_mode, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns, size=tmp.st_size
      //objEntry=MyFile(flName, id, mtime, mtime_ns, size, '1')
      extend(objEntry, {"strName":flName, size})
      arrf.push(objEntry)
    }
    else if(boDir){
      // var tmp=os.stat(fsName)
      // var id=tmp.st_ino, mtime=tmp.st_mtime, mtime_ns=tmp.st_mtime_ns
      //objEntry=MyFold(flName.slice(0,-1), id, mtime, mtime_ns)
      extend(objEntry, {"strName":flName.slice(0,-1)})
      arrF.push(objEntry)
    }
    else arrOther.push(flName)
  }
  return [null, arrf, arrF, arrOther]
}

var parseDb=async function(fsDb, charTRes){
  var [err, arrDB]=await parseSSV(fsDb)
  if(err) return [err]
  var nData=arrDB.length
  if(nData==0)  return [null, arrDB]
    // Cast some properties 
  formatColumnData(arrDB, {"size":"number", "id":"number"})

  var strOSTypeDbFile=checkPathFormat(arrDB)
  if(strOSTypeDbFile=='linux' && NL_OS=='Windows'){
    for(var obj of arrDB) obj["strName"]=obj["strName"].replaceAll('/','\\')
  }
  else if(strOSTypeDbFile=='win32' && (NL_OS=='Linux' || NL_OS=='Darwin')){
    //var strE="strOSTypeDbFile=='win32' && (NL_OS=='Linux' || NL_OS=='Darwin')"
    //return [Error(strE)]
    debugger; // Haven't tested this yet
    for(var obj of arrDB) obj["strName"]=obj["strName"].replaceAll('\\','/')
  }

    // If any mtime is longer than 10 char, then assume ns
  var boNs=false
  for(obj of arrDB){
    if(obj.mtime.length>10) {boNs=true; break;}
  }
  if(boNs){
    for(obj of arrDB){
      obj.mtime_ns64=BigInt(obj.mtime)
    }
  } else{
    for(obj of arrDB){
      obj.mtime_ns64=BigInt(obj.mtime)*BigInt(1e9)
    }
  }

    // Create sm
  for(obj of arrDB){
    var {size, mtime_ns64}=obj
    var strMTime=calcStrTime(mtime_ns64)
    var mtime_ns64R=roundMTime64(mtime_ns64, charTRes);
    var strMTimeR=calcStrTime(mtime_ns64R)
    var sm=createSM64(size, mtime_ns64R)
    var strMTimeSnake=calcStrTimeSnake(strMTime);
    var strMTimeRSnake=calcStrTimeSnake(strMTimeR);
    //extend(obj,{strMTime, strMTimeR, mtime_ns64, mtime_ns64R, sm})
    extend(obj, {strMTime, strMTimeR, mtime_ns64, mtime_ns64R, strMTimeSnake, strMTimeRSnake, sm})
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