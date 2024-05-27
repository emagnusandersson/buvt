
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
      var [err, strDataFilter]=await readStrFile(fsFilter); 
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
      //var [err, DirEnt]=await readdir(fsDir); if(err) return [err];
      var [err, DirEnt]=await fs.promises.readdir(fsDir).toNBP(); if(err) {debugger; return [err];}
      var funInc=(a,b)=>{if(a.entry>b.entry) return 1; else if(a.entry<b.entry) return -1; return 0;};
    } else if(enumReadDir=='statOfMulti'){
      var [err, DirEnt]=await myStatsOfDirContent_c(fsDir);
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
        //var [err, stats]=await myGetStats_js(fsName); // Note!! mtime_ns64 has only 6 decimal resolution
        var [err, stats]=await myGetStats(fsName);
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
    var {fsDir, charTRes, leafFilter=null, leafFilterFirst=null, strHost=null, boRemote, charFilterMethod}=arg
    if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';

    //setMess(`Parsing tree: ${fsDir}`, null, true)
    if(boRemote) {
      if(strOS=='win32') {debugger; return [Error('On windows only local access is allowed')];}
      //var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'parseTreeNDump']
      var arrCommand=['ssh', strHost, 'python', interfacePython.fsScriptRemote, 'parseTreeNDump']
    }else{
      //var arrCommand=['python', fsBuvtPyScriptMain, 'parseTreeNDump'];
      //var arrCommand=['python', fsBuvtPyScriptLocal, 'parseTreeNDump'];
      var arrCommand=['python', interfacePython.fsScriptLocal, 'parseTreeNDump'];
    }
    
    //arrCommand.push('--boUseFilter', boUseFilter)
    if(leafFilter) arrCommand.push('--leafFilter', leafFilter);
    if(leafFilterFirst) arrCommand.push('--leafFilterFirst', leafFilterFirst);
    if(charFilterMethod) arrCommand.push('--charFilterMethod', charFilterMethod);
    arrCommand.push('--fiDir', fsDir)

    var tStart=unixNow();   
    var arrData=[], nReceivedTot=0
    var cbData=function(data){
      //term.write(data);
      arrData.push(data);
      // var n=0; data.forEach(v => {if(v==10) n++});
      // nReceivedTot+=n
      // myConsole.myReset()
      // myConsole.printNL(nReceivedTot.toString());
    }
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) {
      debugger; return [Error(stdErr)];
    }
    var tStop=unixNow();   myConsole.printNL(`parseTree: time ${(tStop-tStart)}ms`)

    var buf = Buffer.concat(arrData), stdOut=buf.toString()
    //var StrGroup=stdOut.split('@\n');
    var StrGroup=stdOut.split(RegExp("^@$",'m'));
    
    var nGroup=StrGroup.length
    if(nGroup==1) {
      var nMax=500, strTruncMess=stdOut.length>nMax?'...(error message truncated)':'';
      var strErr=`nGroup==1: ${stdOut.slice(0,nMax)} ${strTruncMess}`;
      debugger
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


/*****************************************************************
 * parseRelations
*****************************************************************/

// funCreateKey creates a key from the Matching-data-array
// funSide returns 0 or 1, 0 and it is added to objA/arrA, 1 for objB/arrB
// Usage example:
// var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
// var [err, strData]=await readStrFile(fsInpFile); if(err) return [err]
// var [arrA, arrB]=parseRelations(strData)
var parseRelations=function(strData, boAssignObj=false, funCreateKey=arr=>arr.join('_'), funSide=arr=>arr[0]=='T'){
  strData=strData.trim();  if(strData.length==0) return [null,{},{},[],[]]
  var arrInp=strData.split('\n'), n=arrInp.length;    
  if(n<4) return [Error("n<4")]
  var [strColTypeM, strColM, strColTypeU, strColU]=arrInp.slice(0, 4) // M=Matching, U=Unique
  var StrColTypeM=strColTypeM.trim().split(' '), StrColM=strColM.trim().split(' ')
  var StrColTypeU=strColTypeU.trim().split(' '), StrColU=strColU.trim().split(' ')

  var funCast=function(strType, strVal){
    if(strType=="int") return Number(strVal)
    else if(strType=="int64") {
      try{strVal=BigInt(strVal);}
      catch{strVal=null;}
    }
    return strVal
  }

  arrInp=arrInp.slice(4); n=arrInp.length
  var nColM=StrColM.length, nSplitM=nColM-1, nColU=StrColU.length, nSplitU=nColU-1
  var objA={}, objB={}, arrA=[], arrB=[]
  for(var strRow of arrInp){
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var indSpace=strRow.indexOf(" ")
    var strFirst=strRow.slice(0, indSpace)
    var strPost=strRow.slice(indSpace).trim()

    if(strFirst=="MatchingData"){
      var arrPartM=mySplit(strPost, /\s+/g, nSplitM), nPartM=arrPartM.length
      if(nPartM<nColM) {debugger; return [Error("nPartM<nColM")];}
      var key=funCreateKey(arrPartM)
      if(boAssignObj) {
        if(!(key in objA)) objA[key]=[]
        if(!(key in objB)) objB[key]=[]
      }
      continue
    } else {
      var arrPartU=mySplit(strRow, /\s+/g, nSplitU), nPartU=arrPartU.length;
      if(nPartU<nColU) {debugger; return [Error("nPartU<nColU")];}
      
      var row={};
      for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i], val=funCast(strType, arrPartM[i]); row[strCol]=val; }
      for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i], val=funCast(strType, arrPartU[i]); row[strCol]=val; }

      var intSide=funSide(arrPartU), arrTmp=intSide?arrB:arrA, objTmp=intSide?objB:objA;
      arrTmp.push(row);
      if(boAssignObj) objTmp[key].push(row);
    }
  }
  
  return [null, objA, objB, arrA, arrB]
  //return [null, arrA, arrB, objA, objB]
}



  // parseMultSTFile: For parsing files with nTn relations, n>=0
  // This should probably be replaced with "parseRelations" somehow.
var parseMultSTFile=async function(fiInpFile){
  var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) {debugger; return [err]; }
  var [err, strData]=await readStrFile(fsInpFile);
  strData=strData.trim()
  var arrS=[], arrT=[], objS={}, objT={}
  var arrInp=strData.split('\n')
  for(var i in arrInp){
    var strRow=arrInp[i]
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var indSpace=strRow.indexOf(" ")
    var strFirst=strRow.slice(0, indSpace)
    var strPost=strRow.slice(indSpace).trim()
    if(strFirst.length==0) {debugger; return [Error("strFirst.length==0")];}
    //var charType=strFirst[0]
    if(strFirst=='MatchingData'){
      //var arrPart=strPost.split(/\s+/)
      var arrPartMatching=mySplit(strPost, /\s+/g, 2), nPartMatching=arrPartMatching.length
      if(nPartMatching<3) {debugger; return [Error("nPartMatching<3")];}
      var size=parseInt(arrPartMatching[0]), strMTimeFloored=arrPartMatching[1], mtime_ns64Floored=BigInt(strMTimeFloored)
      var sm=createSM64(size, mtime_ns64Floored)
      if(!(sm in objS)) objS[sm]=[]
      if(!(sm in objT)) objT[sm]=[]
        // Exact time
      //var strMTime=nPartMatching==3?trim(arrPartMatching[2],'()'):arrPartMatching[1] 
      //var mtime_ns64=BigInt(strMTime)
      var strMTimeExact=arrPartMatching[2]
    } else if(strFirst=='T' || strFirst=='S'){
      var arrPartT=mySplit(strPost, /\s+/g, 3), nPartT=arrPartT.length
      if(nPartT<4) {debugger; return [Error("nPartT<4")];}
      //var strType=arrPartT[0], id=arrPartT[1], strName=arrPartT[3];  //id=parseInt(id)
      var [strType, id, strMTimeTmp, strName]=arrPartT;
      if(strMTimeTmp=='seeAbove'){ var strMTime=strMTimeExact=='seePrev'?strMTimeFloored:strMTimeExact; }  else  { var strMTime=strMTimeTmp; }
      var mtime_ns64=BigInt(strMTime)
      var row={strType, size, id, mtime_ns64, mtime_ns64Floored, strName, strMTime, strMTimeFloored}
      
      if(strFirst=='T') {objT[sm].push(row); arrT.push(row);} 
      else {objS[sm].push(row); arrS.push(row);}
    } 
  }
  return [null, objS, objT, arrS, arrT]
  //return [null, arrS, arrT, objS, objT]
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
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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

//var parseDb=async function(fsDb, charTRes){
var parseDb=function(strData, charTRes){
  //var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseSSV(strData)
  var nData=arrDb.length
  //if(nData==0)  return [null, arrDb]
  if(nData==0) return arrDb
    // Cast some properties 
  formatColumnData(arrDb, {"size":"number"}) //, "id":"number"

  var strOSTypeDbFile=checkPathFormat(arrDb)
  if(strOSTypeDbFile=='linux' && strOS=='win32'){
    for(var obj of arrDb) obj["strName"]=obj["strName"].replaceAll('/','\\')
  }
  else if(strOSTypeDbFile=='win32' && (strOS=='linux' || strOS=='darwin')){
    //var strE="strOSTypeDbFile=='win32' && (strOS=='linux' || strOS=='darwin')"
    //return [Error(strE)]
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
  //return [null, arrDb]
  return arrDb
}

/*******************************************************
 * parseHashFile
 *******************************************************/
var parseHashFile=async function(fsHashFile){
  var [err, strData]=await readStrFile(fsHashFile); if(err) return [err]
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
