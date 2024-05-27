
"use strict"







//var strcmp = new Intl.Collator(undefined, {numeric:false, sensitivity:'base'}).compare;
// var strcmp = new Intl.Collator().compare;
// var makeCompFun=function(strProp){
//   return (a,b)=>strcmp(a[strProp],b[strProp])
// }
// var funIncByStrName=makeCompFun('strName')


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



class TreeParserJS{
  constructor(){ }
  async getBranch(objDir, intLevel){
    var fsDir=objDir.fsDir
    var flDir=objDir.flDir
    var nNewf=0, nNewF=0

      // Add potetial filter rules
    var leafFilterLoc=intLevel==0?this.leafFilterFirst:this.leafFilter
    if(leafFilterLoc){
      var boFoundFilterFile=true
      var fsFilter=fsDir+charF+leafFilterLoc
      var [err, strDataFilter] = await readStrFile(fsFilter); 
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

    //var [err, DirEnt]=await fs.promises.readdir(fsDir, {withFileTypes:true}).toNBP(); if(err) return [err];
    
    
    var enumReadDir='statOfMulti'
    if(enumReadDir=='statOfSingle'){
      //var [err, DirEnt] = await readdir(fsDir); if(err) return [err];
      var [err, DirEnt]=await fs.promises.readdir(fsDir).toNBP(); if(err) {debugger; return [err];}
      var funInc=(a,b)=>{if(a.entry>b.entry) return 1; else if(a.entry<b.entry) return -1; return 0;};
    } else if(enumReadDir=='statOfMulti'){
      var [err, DirEnt] = await myStatsOfDirContent_c(fsDir);
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
        //var [err, stats] = await myGetStats_js(fsName); // Note!! mtime_ns64 has only 6 decimal resolution
        var [err, stats] = await myGetStats(fsName);
        var {mtime_ns64, size}=stats; 
        var id="0", boSym=false;
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

      var mtime_ns64Floored=floorMTime64(mtime_ns64, charTRes);
      var strMTime=calcStrTime(mtime_ns64)
      var strMTimeFloored=calcStrTime(mtime_ns64Floored);
      var strMTimeSnake=calcStrTimeSnake(strMTime);
      var strMTimeFlooredSnake=calcStrTimeSnake(strMTimeFloored);
      var objEntry={strName:flName, id,   strMTime, strMTimeFloored, strMTimeSnake, strMTimeFlooredSnake, mtime_ns64, mtime_ns64Floored}
      if(!boDir){
        var sm=createSM64(size, mtime_ns64Floored)
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

  async parseTree(arg){
    var {fsDir, charTRes, leafFilter=null, leafFilterFirst=null}=arg
    //this.boUseFilter=Boolean(leafFilterFirst)
    extend(this, {leafFilter, leafFilterFirst})
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


//python /home/magnus/progJS/buvt/buvtPyScript/buvtPyScript.py parseTreeNDump --leafFilter .rsync-filter --leafFilterFirst .rsync-filter --charFilterMethod r --fiDir /home/magnus/progPython/buvt-SourceFs/Source
class TreeParserPython{
  constructor(){ }
  async parseTree(arg){
    var {fsDir, charTRes, leafFilter=null, leafFilterFirst=null, strHost=null, charFilterMethod}=arg

    //setMess(`Parsing tree: ${fsDir}`, null, true)
    if(strHost) {
      if(strOS=='win32') {debugger; return [Error('On windows only local access is allowed')];}
      var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'parseTreeNDump']
    }else{
      var arrCommand=['python', fsBuvtPyScriptOrg, 'parseTreeNDump'];
    }
    
    //arrCommand.push('--boUseFilter', boUseFilter)
    if(leafFilter) arrCommand.push('--leafFilter', leafFilter);
    if(leafFilterFirst) arrCommand.push('--leafFilterFirst', leafFilterFirst);
    if(charFilterMethod) arrCommand.push('--charFilterMethod', charFilterMethod);
    if(strOS=='win32'){
      //fsDir=escInQ(fsDir)
      arrCommand.push('--fiDir', fsDir)
      var strCommand=arrCommand.join(' ')
      // var [err, objT] = await exec(strCommand).toNBP();   if(err) { debugger; return [err];}
      // var stdOut=objT.stdout
        // Googled "node RangeError: stdout maxBuffer length exceeded" found: "use spawn when you expect huge amount of data to come back"


      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) {
        debugger; return [Error(stdErr)];
      }

    }else{
      arrCommand.push('--fiDir', fsDir)
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) {
        debugger; return [Error(stdErr)];
      }
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
        //id=Number(id)
        if(strMTime.length!=19) {debugger; throw Error(`strMTimeOrg.length!=19 (${strMTime} (${flName}))`);}
        
        var mtime_ns64=BigInt(strMTime)
        var mtime_ns64Floored=floorMTime64(mtime_ns64, charTRes);
        var strMTimeFloored=calcStrTime(mtime_ns64Floored)
        var strMTimeSnake=calcStrTimeSnake(strMTime);
        var strMTimeFlooredSnake=calcStrTimeSnake(strMTimeFloored);
        var objTmp={strName:flName, id,   strMTime, strMTimeFloored, strMTimeSnake, strMTimeFlooredSnake, mtime_ns64, mtime_ns64Floored}
        if(j==0) {
          var sm=createSM64(size, mtime_ns64Floored)
          extend(objTmp, { strType, size, sm});
        }
        arrGroup[i]=objTmp
      }
      ArrGroup[j]=arrGroup
    }

    return [null, ...ArrGroup]
  }
}

const EnumMode={ExpectingStart:1, ExpectingA:2, ExpectingB:3}

/*****************************************************************
 * parseRenameFile
*****************************************************************/
var parseRenameFile=async function(fiInpFile){ // Not used
  
  var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
  var [err, strData] = await readStrFile(fsInpFile);
  strData=strData.trim()

  var arrRename=[]
  var arrInp=strData.split('\n')
  //i=0; nRows=arrInp.length
  var mode=EnumMode.ExpectingStart
  var strOld="", strNew="", strMeta=""
  for(var i in arrInp){
    var strRow=arrInp[i]
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var arrPart=strRow.split(/\s+/)

    if(mode==EnumMode.ExpectingStart){
      if(arrPart[0]=="MatchingData") {mode=EnumMode.ExpectingA; strMeta=strRow; continue}
    }
    else if(mode==EnumMode.ExpectingA){
      strOld=strRow;  mode=EnumMode.ExpectingB; continue
    }
    else if(mode==EnumMode.ExpectingB){
      strNew=strRow;  mode=EnumMode.ExpectingStart
    }

    arrRename.push({strOld, strNew, strMeta})
  }
  
  return [null, arrRename]
}

var parseMatchingPair=async function(fiInpFile, StrColMatching, StrColUnique){ // Not used
  var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
  var [err, strData] = await readStrFile(fsInpFile);
  strData=strData.trim()
  var nColMatching=StrColMatching.length, nSplitMatching=nColMatching-1
  var nColUnique=StrColUnique.length, nSplitUnique=nColUnique-1
  var arrOld=[], arrNew=[]
  var arrInp=strData.split('\n')
  var mode=EnumMode.ExpectingStart
  for(var strRow of arrInp){
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var indSpace=strRow.indexOf(" ")
    var strFirst=strRow.slice(0, indSpace)
    var strPost=strRow.slice(indSpace).trim()

    if(mode==EnumMode.ExpectingStart){
      if(strFirst!="MatchingData") {continue}
      mode=EnumMode.ExpectingA;
      var arrPartMatching=mySplit(strPost, /\s+/g, nSplitMatching)
      continue
    } else if(mode==EnumMode.ExpectingA){
      mode=EnumMode.ExpectingB; //strUniqueOld=strRow;  
      var arrPartOld=mySplit(strRow, /\s+/g, nSplitUnique)
      continue
    } else if(mode==EnumMode.ExpectingB){
      mode=EnumMode.ExpectingStart;  //strUniqueNew=strRow;  
      var arrPartNew=mySplit(strRow, /\s+/g, nSplitUnique)
    }

    var objOld={}, objNew={}
    for(var i in StrColMatching) { var strCol=StrColMatching[i];   objOld[strCol]=arrPartMatching[i];   }
    for(var i in StrColMatching) { var strCol=StrColMatching[i];   objNew[strCol]=arrPartMatching[i];   }
    for(var i in StrColUnique) { var strCol=StrColUnique[i];   objOld[strCol]=arrPartOld[i];   }
    for(var i in StrColUnique) { var strCol=StrColUnique[i];   objNew[strCol]=arrPartNew[i];   }
    arrOld.push(objOld); arrNew.push(objNew)
  }
  
  return [null, arrOld, arrNew]
}


// var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
// var [err, strData] = await readStrFile(fsInpFile); if(err) return [err]
// var [arrA, arrB]=parseMatchingPairWHead(strData)
var parseMatchingPairWHead=function(strData){
  strData=strData.trim();  if(strData.length==0) return [null,[],[]]
  var arrInp=strData.split('\n'), n=arrInp.length;    
  if(n<4) return [Error("n<4")]
  var [strColTypeM, strColM, strColTypeU, strColU]=arrInp.slice(0, 4)
  var StrColTypeM=strColTypeM.trim().split(' '), StrColM=strColM.trim().split(' ')
  var StrColTypeU=strColTypeU.trim().split(' '), StrColU=strColU.trim().split(' ')

  arrInp=arrInp.slice(4); n=arrInp.length
  var nColM=StrColM.length, nSplitM=nColM-1, nColU=StrColU.length, nSplitU=nColU-1
  var arrA=[], arrB=[]
  var mode=EnumMode.ExpectingStart
  for(var strRow of arrInp){
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var indSpace=strRow.indexOf(" ")
    var strFirst=strRow.slice(0, indSpace)
    var strPost=strRow.slice(indSpace).trim()

    if(mode==EnumMode.ExpectingStart){
      if(strFirst!="MatchingData") {continue}
      mode=EnumMode.ExpectingA;
      var arrPartM=mySplit(strPost, /\s+/g, nSplitM)
      continue
    } else if(mode==EnumMode.ExpectingA){
      mode=EnumMode.ExpectingB; //strUA=strRow;  
      var arrPartA=mySplit(strRow, /\s+/g, nSplitU)
      continue
    } else if(mode==EnumMode.ExpectingB){
      mode=EnumMode.ExpectingStart;  //strUB=strRow;  
      var arrPartB=mySplit(strRow, /\s+/g, nSplitU)
    }
    var funCast=function(strType, strVal){
      if(strType=="int") return Number(strVal)
      else if(strType=="int64") {
        try{strVal=BigInt(strVal);}
        catch{strVal=null;}
      }
      return strVal
    }
    var objA={}, objB={}
    for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i];   objA[strCol]=funCast(strType, arrPartM[i]);   }
    for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i];   objB[strCol]=funCast(strType, arrPartM[i]);   }
    for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i];   objA[strCol]=funCast(strType, arrPartA[i]);   }
    for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i];   objB[strCol]=funCast(strType, arrPartB[i]);   }
    // for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i];   objA[strCol]=arrPartM[i];   }
    // for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i];   objB[strCol]=arrPartM[i];   }
    // for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i];   objA[strCol]=arrPartA[i];   }
    // for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i];   objB[strCol]=arrPartB[i];   }
    arrA.push(objA); arrB.push(objB)
  }
  
  return [null, arrA, arrB]
}


// b=0, c=0, f=(flPath), i=">f+++++++++", l=4096, o="send", p=775452, t="2024/08/14 18:49:57"
// B="rw-r--r--", C=00000000000000000000000000000000, G=DEFAULT, L="", M="2022/09/16-00:34:17", U=0
var getRsyncList=async function(arg){
  var {fsDir, charTRes, leafFilter, leafFilterFirst}=arg
  var [err, fsDir]=await myRealPath(fsDir); if(err) {debugger; return [err];}
  setMess(`Parsing tree`, null, true)
  
  if(strOS=='win32'){ debugger; return [Error("Windows not supported")]; }
  //var arrCommand=[`rsync`, `-nrF`, `--out-format='%n'`, fsDir, `trash`]
  var arrCommand=[`rsync`, `-nrl`]; //F
  if(leafFilter) arrCommand.push(`--filter`, `dir-merge /${leafFilter}`) //, `--filter='exclude ${leafFilter}'`
  if(leafFilterFirst && leafFilterFirst!=leafFilter) {
    var fsTmp=fsDir+charF+leafFilterFirst
    arrCommand.push(`--filter`, `merge ${fsTmp}`)
  }
  arrCommand.push(`--out-format='%n'`, fsDir+charF, `trash`)
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };

  var strData=stdOut.trim()

  var arrInp=strData.split('\n')
  arrInp=arrInp.slice(1)
  var arrf=[], arrF=[]

  for(var flName of arrInp){
    if(flName.length==0) continue
    var flName=trim(flName,"'"); 
    var n=flName.length, boDir=flName[n-1]==charF

    var objEntry={}
    if(boDir){
      extend(objEntry, {"strName":flName.slice(0,-1)})
      arrF.push(objEntry)
    }else {
      extend(objEntry, {"strName":flName})
      arrf.push(objEntry)
    }
  }
  return [null, arrf, arrF]
}

var parseDb=async function(fsDb, charTRes){
  var [err, arrDb]=await parseSSV(fsDb)
  if(err) return [err]
  var nData=arrDb.length
  if(nData==0)  return [null, arrDb]
    // Cast some properties 
  formatColumnData(arrDb, {"size":"number"}) //, "id":"number"

  var strOSTypeDbFile=checkPathFormat(arrDb)
  if(strOSTypeDbFile=='linux' && strOS=='win32'){
    for(var obj of arrDb) obj["strName"]=obj["strName"].replaceAll('/','\\')
  }
  else if(strOSTypeDbFile=='win32' && (strOS=='linux' || strOS=='darwin')){
    //var strE="strOSTypeDbFile=='win32' && (strOS=='linux' || strOS=='darwin')"
    //return [Error(strE)]
    debugger; // Haven't tested this yet
    for(var obj of arrDb) obj["strName"]=obj["strName"].replaceAll('\\','/')
  }

    // If any mtime is longer than 10 char, then assume ns
  var boNs=false
  for(obj of arrDb){
    if(obj.mtime.length>10) {boNs=true; break;}
  }
  if(boNs){
    for(obj of arrDb){
      obj.mtime_ns64=BigInt(obj.mtime)
    }
  } else{
    for(obj of arrDb){
      obj.mtime_ns64=BigInt(obj.mtime)*BigInt(1e9)
    }
  }

    // Create sm
  for(obj of arrDb){
    var {size, mtime_ns64}=obj
    var strMTime=calcStrTime(mtime_ns64)
    var mtime_ns64Floored=floorMTime64(mtime_ns64, charTRes);
    var strMTimeFloored=calcStrTime(mtime_ns64Floored)
    var sm=createSM64(size, mtime_ns64Floored)
    var strMTimeSnake=calcStrTimeSnake(strMTime);
    var strMTimeFlooredSnake=calcStrTimeSnake(strMTimeFloored);
    //extend(obj,{strMTime, strMTimeFloored, mtime_ns64, mtime_ns64Floored, sm})
    extend(obj, {strMTime, strMTimeFloored, mtime_ns64, mtime_ns64Floored, strMTimeSnake, strMTimeFlooredSnake, sm})
  }
  return [null, arrDb]
}

/*******************************************************
 * parseHashFile
 *******************************************************/
var parseHashFile=async function(fsHashFile){
  var [err, strData] = await readStrFile(fsHashFile); if(err) return [err]
  strData=strData.trim()
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
