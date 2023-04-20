
// import secrets
// import string
// from lib import *
// import time
// import stat
// import uuid


const ANSI_CURSOR_SAVE="\0337"
const ANSI_CURSOR_RESTORE="\0338"
const ANSI_CLEAR_BELOW="\033[J"


const ANSI_FONT_CLEAR="\033[0m"
const ANSI_FONT_BOLD="\033[1m"
var ANSI_CURSOR_UP=function(n)      {return "\033["+str(n)+"A"}
var ANSI_CURSOR_DOWN=function(n)    {return "\033["+str(n)+"B"}
const ANSI_CLEAR_RIGHT="\033[K"
const ANSI_CURSORUP="\033[A"
const ANSI_CURSORDN="\033[B"

const MAKESPACE_N_SAVE="\n\n"+ANSI_CURSOR_UP(2)+ANSI_CURSOR_SAVE
const MY_RESET=ANSI_CURSOR_RESTORE+ANSI_CLEAR_BELOW




var tStart=new Date()


// N files could be categorized as renameable after matching size and time (N OTM, N MTO, N MTM) (See list in duplicateInitial.txt)
// After looking at renamed folders (N), a further N files can be categorized as renameable. (See list in renameAdditional.txt)
//   So a final N renameables after matching size and time and folder belonging (N OTM, N MTO, N MTM) (See list in duplicateFinal.txt)


// var myRandBase63=function(n){
//   return ''.join(secrets.choice(string.ascii_lowercase +string.ascii_uppercase + string.digits+'_') for _ in range(n))
// }

// var myUUID=function(){
//   return myRandBase63(22)
// }




//var FMT_Check_Missing_In_Folder=   "In %s (spanning %d rows (%d-%d)), %d files are missing.\n"

//var FMT_Check_Missing_Single=    "Row: %d, " +ANSI_FONT_BOLD+"%s"+ANSI_FONT_CLEAR+" %s\n"
//var FMT_Check_Missing_Range=   "Row: %d-%d (%d), " +ANSI_FONT_BOLD+"%s"+ANSI_FONT_CLEAR+" %s\n"



var formatF_Check_Missing_In_Folder=(strPar, iStartPar, iStopPar, nSum)=>`In ${strPar} (spanning ${iStopPar-iStartPar} rows (${iStartPar}-${iStopPar-1})), ${nSum} files are missing.\n`
var formatF_Check_Missing_Single=(iRow, strMissing, strName)=>`Row: ${iRow}, ` +ANSI_FONT_BOLD+strMissing+ANSI_FONT_CLEAR+` ${strName}\n`
var formatF_Check_Missing_Range=(iStart, n, strMissing, strName)=>`Row: ${iStart}-${iStart+n-1} (${n}), ` +ANSI_FONT_BOLD+strMissing+ANSI_FONT_CLEAR+` ${strName}\n`

var parseSSVCustom=async function(fsMeta){
  var [err, arrDB]=await parseSSV(fsMeta)
  if(err) return [err]
  formatColumnData(arrDB, {"size":"number", "inode":"number", "mtime":"number"})
  //formatColumnData(arrDB, {"size":"number", "inode":"number", "mtime":"number", "mtime_ns":'number'})
  return [null, arrDB]
}


var getSuitableTimeUnit=function(t){ // t in seconds
  var tAbs=Math.abs(t), tSign=t>=0?1:-1
  if(tAbs<=120) return [tSign*tAbs, 's']
  tAbs/=60; // t in minutes
  if(tAbs<=120) return [tSign*tAbs, 'm']
  tAbs/=60; // t in hours
  if(tAbs<=48) return [tSign*tAbs, 'h']
  tAbs/=24; // t in days
  if(tAbs<=2*365) return [tSign*tAbs, 'd']
  tAbs/=365; // t in years
  return [tSign*tAbs, 'y']
}



/*******************************************************
 * parseHashFile
 *******************************************************/
var parseHashFile=async function(fsHashFile){
  var [err, buf] = await Neutralino.filesystem.readFile(fsHashFile).toNBP(); if(err) return [err]
  var strData=buf.toString()
  var arrOut=[],   arrInp=strData.split('\n')
  for(var strRow of arrInp){
    strRow=strRow.strip()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var arrPart=mySplit(strRow, /\s+/g, 3)
    arrOut.push({"strHash":arrPart[0], "mtime":Number(arrPart[1]), "size":Number(arrPart[2]), "strName":arrPart[3]})
  }
  return [null, arrOut]
}


class MyStatsCache{
  constructor(){ this.obj={}; }
  async stats(fiPath){
    if(!(fiPath in this.obj)) {
      var [err, fsPath]=await myRealPath(fiPath); if(err) return [err]
      var [err, objStats]=await myGetStats(fiPath); if(err) return [err]
      var boExist=Boolean(objStats)
      var {isDirectory=false, isFile=false}=objStats;
      this.obj[fiPath]={fsPath, isDirectory, isFile}
    }
    return [null, this.obj[fiPath]]
  }
}
myStatsCache=MyStatsCache()


var getHighestMissing=async function(fsDir, strPath){ // It is assumed that strPath is a file (not a folder) and is missing
  var boFirst=true
  while(1){
    var strPar=dirname(strPath); debugger
    if(strPar=='') return [null, boFirst, strPar, strPath]
    //fsPar=os.path.realpath(fsDir+'/'+strPar)
    var [err, result]=await myStatsCache.stats(fsDir+'/'+strPar); if(err) return [err]
    var {fsPar, isDirectory}=result
    if(isDirectory) return [null, boFirst, strPar, strPath] 
    strPath=strPar
    boFirst=false
  }
}


var checkHighestMissingArr=async function(arrDB, fsDir){
  var lenDB=arrDB.length, ObjMissing=Array(lenDB).fill(null); //   [null]*lenDB
  for(var i in arrDB){
    var row=arrDB[i], strName=row.strName;
    var fsFile=fsDir+'/'+strName;
    var [err, boFileFound]=await fileExist(fsFile); if(err) return [err]
    var obj;
    if(boFileFound) obj={"strPar":null, "strChild":null}
    else{
      var [err, boFile, strPar, strChild]= await getHighestMissing(fsDir, strName); if(err) return [err]
      obj={"boFile":boFile, "strPar":strPar, "strChild":strChild}
    }
    ObjMissing[i]=obj;
  }
  return [null, ObjMissing]
}


  // MyPrinter, printNoNL, printNL are only used in summarizeMissing and checkInterior
class MyPrinter{
  constructor(){ this.Str=[]; }
  add(str){ this.Str.push(str) }
  flush(){ console.log(this.Str.join('')); this.Str=[]; }
}
app.myPrinter=new MyPrinter()
var printNoNL=function(str) { myPrinter.add(str); }
var printNL=function(str) { myPrinter.add(str); myPrinter.flush(); }

var summarizeMissing=async function(arrDB, fsDir){
  //arrDB=arrDB.slice(0,8)
  //tStop=time.time();    printNL('checkHighestMissingArr starts, elapsed time '+str(round((tStop-tStart)*1000))+'ms')
  var lenDB=arrDB.length
  var [err, ObjMissing]=await checkHighestMissingArr(arrDB, fsDir)
  //extend(ObjMissing[0], {"strPar":'a'})
  //tStop=time.time();   printNL('checkHighestMissingArr done, elapsed time '+str(round((tStop-tStart)*1000))+'ms')

//   ObjMissing=[
// {'boFile': false, 'strPar': null, 'strChild': null},
// {'boFile': false, 'strPar': '', 'strChild': 'progC'},
// {'boFile': false, 'strPar': '', 'strChild': 'progC'},
// {'boFile': false, 'strPar': null, 'strChild': null},
// {'boFile': false, 'strPar': '', 'strChild': 'progD'},
// {'boFile': false, 'strPar': '', 'strChild': 'progD'},
// {'boFile': false, 'strPar': null, 'strChild': null},
// {'boFile': true, 'strPar': '', 'strChild': "a.txt"},
// {'boFile': false, 'strPar': 'a', 'strChild': 'progD'},
// {'boFile': false, 'strPar': 'a', 'strChild': 'progD'}]
  ObjMissing.push({"strPar":null, "strChild":null})


    // Create ArrRangePar
  var strChildL=null, strParL=null
  var iStart=0, iStop=0, iStartPar=0, iStopPar=0, ArrRangePar={}, ArrRange=[]
  var arrRangePar
  //for i in range(0,lenDB+1):
  for(var i in ObjMissing){
    var {strChild, strPar}=ObjMissing[i];
    if(strPar!=strParL){
      if(strChildL!=null) strChildL=uuid.uuid4().hex
    }
    if(strChild!=strChildL){
      if(strChildL!=null) {iStop=i; ArrRange.push([iStart,iStop])}
      if(strChild!=null) iStart=i
    }
    if(strPar!=strParL){
      if(strParL!=null){ // parent range ended
        iStopPar=i; 
        if(!(strParL in ArrRangePar)) ArrRangePar[strParL]={"iStartPar":iStartPar, "ArrRange":[]}
        arrRangePar=ArrRangePar[strParL];  arrRangePar.ArrRange.push(...ArrRange);  arrRangePar.iStopPar=iStopPar
        ArrRange=[]
      }
      if(strPar!=null) iStartPar=i;
    }
    strChildL=strChild
    strParL=strPar
  }

    // Calculate nSum (number of missing in each arrRangePar)
  for(var arrRangePar of ArrRangePar){
    //ArrRange=arrRangePar.ArrRange; iStartPar=arrRangePar.iStartPar; iStopPar=arrRangePar.iStopPar
    ({ArrRange, iStartPar, iStopPar}=arrRangePar);

    var nSum=0
    for(var arrRange of ArrRange){
      var [iStart, iStop]=arrRange, n=iStop-iStart
      nSum+=n
    }
    arrRangePar.nSum=nSum
  }

  
  printNoNL(MAKESPACE_N_SAVE)
  for(var strPar in ArrRangePar){
    var arrRangePar=ArrRangePar[strPar]
    var {ArrRange}=arrRangePar, {iStartPar, iStopPar, nSum}=arrRangePar
    if(strPar=="") strPar="(top folder)"
    printNL(MY_RESET+formatF_Check_Missing_In_Folder(strPar, iStartPar, iStopPar, nSum)+MAKESPACE_N_SAVE)
    for(var arrRange in ArrRange){
      var [iStart, iStop]=arrRange, n=iStop-iStart
      var objMissingStart=ObjMissing[iStart]
      //objMissingStop=ObjMissing[iStop-1]
      var {strChild, strPar, boFile}=objMissingStart
      if(strPar=='') strPar="(top folder)"
      if(n==1){
        var strMissing=boFile?"file":"folder";  strMissing="Missing "+strMissing+':';
        //printNL((MY_RESET+"  "+FMT_Check_Missing_Single+MAKESPACE_N_SAVE) %(iStart, strMissing, strChild))
        printNL(MY_RESET+"  "+formatF_Check_Missing_Single(iStart, strMissing, strChild)+MAKESPACE_N_SAVE)
      }
      else{
        //printNL((MY_RESET+"  "+FMT_Check_Missing_Range+MAKESPACE_N_SAVE) %(iStart, iStop-1, n, "Missing folder:", strChild))
        printNL(MY_RESET+"  "+formatF_Check_Missing_Range(iStart, n, "Missing folder:", strChild)+MAKESPACE_N_SAVE)
      }
    }
  }
  return
}


var checkSummarizeMissingInterior=async function(fsMeta, fsDir){  // Go through the hashcode-file, for each row (file), check if the hashcode matches the actual files hashcode  
  var [err, arrDB]=await parseSSVCustom(fsMeta); if(err) return [err]
  //if(err): printNL(err.strTrace); return
  await summarizeMissing(arrDB, fsDir)
  return [null]
}


var categorizeFile=async function(fsDir, strName){
  var fsFile=fsDir+'/'+strName;
  //var boFileFound=os.path.exists(fsFile)
  var [err, boFileFound]=await fileExist(fsFile); if(err) return [err]
  if(boFileFound) return [null, ' ', null, null]
  else{
    var [err, boFile, strPar, flChild]= await getHighestMissing(fsDir, strName); if(err) return [err]
    var charMissing=boFile?'f':'d'
    return [null, charMissing, strPar, flChild]
  }
}


var checkInterior=async function(fsMeta, fsDir, intStart){  // Go through the hashcode-file, for each row (file), check if the hashcode matches the actual files hashcode  
  var nNotFound=0, nMisMatchTimeSize=0, nMisMatchHash=0, nOK=0

  var [err, arrDB]=await parseSSVCustom(fsMeta); if(err) return [err]

  var lenDB=arrDB.length
  var leafFileMetaOld= basename(fsMeta)

  printNoNL(MAKESPACE_N_SAVE)

    // Variables for "missing streaks"
  var flMissingFile="", iNotFoundFirst=0, lenFlChildL=0, charMissingL=' ', flChildL=""
  
  var nHour=0, nMin=0, nSec=0
  
  //for iRowCount, row in enumerate(arrDB):
  //for iRowCount in range(intStart,lenDB):
  for(var iRowCount=intStart;i<lenDB;i++) {
    var row=arrDB[iRowCount]
    var {strHash:strHashOld, size:intSizeOld, mtime:intTimeOld, strName}=row;

    var fsFile=fsDir+'/'+strName;   
    var [charMissing, strPar, flChild]=categorizeFile(fsDir, strName)

    printNoNL(MY_RESET)
    
      // If streak starts
    if(charMissing=='f' && charMissingL!='f') iNotFoundFirst=iRowCount
    else if(charMissing=='d' && charMissingL!='d') iNotFoundFirst=iRowCount
    else if(charMissing=='d' && charMissingL=='d' && flChild!=flChildL) iNotFoundFirst=iRowCount

      // If streak continues
    if(charMissing=='f' && charMissingL=='f') printNoNL(ANSI_CURSORUP+ANSI_CLEAR_BELOW)
    else if(charMissing=='d' && charMissingL=='d' && flChild==flChildL) printNoNL(ANSI_CURSORUP+ANSI_CLEAR_BELOW)


    var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(time.time()-tStart)
    if(charMissing=='f'){
      var nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1) {
        //printNoNL((FMT_Check_Missing_Single+MAKESPACE_N_SAVE) %(iNotFoundFirst, "Missing file:", strName))
        printNoNL(formatF_Check_Missing_Single(iNotFoundFirst, "Missing file:", strName)+MAKESPACE_N_SAVE)
      }
      else{
        //var strTmp=os.path.dirname(strName)
        var strTmp=dirname(strName); debugger
        if(strTmp=="") strTmp="(top folder)"
        //printNoNL((FMT_Check_Missing_Range+MAKESPACE_N_SAVE) %(iNotFoundFirst, iRowCount, nNotFoundLoc, "Missing files in:", strTmp))
        printNoNL(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing files in:", strTmp)+MAKESPACE_N_SAVE)
      }
    } else if(charMissing=='d'){
      nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1){
        //printNoNL((FMT_Check_Missing_Single+MAKESPACE_N_SAVE) %(iNotFoundFirst, "Missing folder:", flChild))
        printNoNL(formatF_Check_Missing_Single(iNotFoundFirst, "Missing folder:", flChild)+MAKESPACE_N_SAVE)
      }
      else{
        //printNoNL((FMT_Check_Missing_Range+MAKESPACE_N_SAVE) %(iNotFoundFirst, iRowCount, nNotFoundLoc, "Missing folder:", flChild))
        printNoNL(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing folder:", flChild)+MAKESPACE_N_SAVE)
      }
    } else{
      //printNoNL(("%d:%02d:%02d, "+ANSI_FONT_BOLD+"Checking row:"+ANSI_FONT_CLEAR+" %d (%s)\n") %(nHour, nMin, nSec, iRowCount, strName))
      var strTmp=tHour.myPad0(2)+':'+tMin.myPad0(2)+':'+tSec.myPad0(2)
      printNoNL(`${strTmp}, `+ANSI_FONT_BOLD+`Checking row:`+ANSI_FONT_CLEAR+` ${iRowCount} (${strName})\n`)
    }
    charMissingL=charMissing; flChildL=flChild
    if(charMissing!=' ') {nNotFound+=1; continue}


      // Calculate hash
    var [err, strHash]=myMD5(fsFile); //.decode("utf-8")   
    if(strHash!=strHashOld){ // If hashes mismatches
        // Check modTime and size (perhaps the user forgott to run sync before running check
      //var st = os.stat(fsFile); st_size=st.st_size; st_mtime=st.st_mtime
      var [err, st]=await myGetStats(fsFile), {size:st_size, mtime:st_mtime}=st; debugger
      var intTimeNew=Math.floor(st_mtime)
      var boTMatch=intTimeNew==intTimeOld,    boSizeMatch=st_size==intSizeOld
      var StrTmp=[]
      if(!boTMatch || !boSizeMatch ){// If meta data mismatches
        var strBase=basename(strName)
        if(strBase==leafFileMetaOld){
          var strTmp=MY_RESET+`Row: ${iRowCount}, (${strName} is ignored)`;      StrTmp.push(strTmp)
        }
        else{
          var strTmp = MY_RESET+`Row: ${iRowCount}`;      StrTmp.push(strTmp)
          StrTmp.push(ANSI_FONT_BOLD+"META MISMATCH (RUN HASHBERT SYNC)"+ANSI_FONT_CLEAR)
          var tDiff=intTimeNew-intTimeOld
          var [tDiffHuman, charUnit]=getSuitableTimeUnit(tDiff)
          if(!boTMatch) {strTmp = (ANSI_FONT_BOLD+"tDiff"+ANSI_FONT_CLEAR+` (new-old): ${tDiffHuman}${charUnit}`);    StrTmp.push(strTmp)}
          if(!boSizeMatch) {strTmp = (ANSI_FONT_BOLD+"size"+ANSI_FONT_CLEAR+` (old/new): ${intSizeOld}/${st_size}`);    StrTmp.push(strTmp)}
          
          var strTmpB = strName;    StrTmp.push(strTmpB)
        }
        
        nMisMatchTimeSize+=1
      }
      else{// Meta data matches
        var strTmp = (MY_RESET+`Row: ${iRowCount}, `+ANSI_FONT_BOLD+"Hash Mismatch"+ANSI_FONT_CLEAR);    StrTmp.push(strTmp)
        StrTmp.push("(old/new): "+strHashOld+" / "+strHash);   
        StrTmp.push(strName);    
        nMisMatchHash+=1
      }
      
      var strTmp=StrTmp.join(", ")+"\n"
      printNoNL(strTmp)
      printNoNL(MAKESPACE_N_SAVE)
    }
    
    else nOK+=1;  // Hashes match
  }
  var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(time.time()-tStart)
  var StrSum=[]
  StrSum.push(`RowCount: `+iRowCount)
  var strTmp=`NotFound: `+nNotFound;   if(nNotFound) strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR;      StrSum.push(strTmp)
  var strTmp=`MisMatchTimeSize: `+nMisMatchTimeSize;   if(nMisMatchTimeSize) strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR;      StrSum.push(strTmp)
  var strTmp=`MisMatchHash: `+nMisMatchHash;   if(nMisMatchHash) strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR;     StrSum.push(strTmp)
  StrSum.push(`OK: `+nOK)
  var strSum=StrSum.join(', ')

  var strTmp=nHour.myPad0(2)+':'+nMin.myPad0(2)+':'+nSec.myPad0(2)
  printNL(MY_RESET+`Time: ${strTmp}, Done (`+strSum+`)`)
  if(nMisMatchTimeSize) printNL(ANSI_FONT_BOLD+"SINCE META (SIZE/TIME) MISMATCHES, IT IS OBVIOUS THAT HASHBERT SYNC WASN'T CALLED (CALL HASHBERT SYNC BEFORE RUNNING HASHBERT CHECK)"+ANSI_FONT_CLEAR)


  return ""
}

