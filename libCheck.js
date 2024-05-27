
"use strict"

// import secrets
// import string
// from lib import *
// import time
// import stat
// import uuid


  // Google for "ansi vt100 codes" to learn about the codes in the printf-strings
const charEsc='\u001b'
//const charEsc=`\033` // Legacy octal escape sequence.
//const charEsc=`\x1b` // This would work too.
//const charEsc=`\u{1b}` // This would also work.
//const charEscA=`${0o33}` 
  // No way to enter it with decimal number (27 (=0x1b)) though
const CSI=charEsc+"["
//const ANSI_CURSOR_SAVE='\0337'
const ANSI_CURSOR_SAVE=   charEsc+'7'
const ANSI_CURSOR_RESTORE=charEsc+'8'
const ANSI_CLEAR_BELOW=CSI+'J'


var ANSI_FONT_CLEAR=CSI+'0m'
var ANSI_FONT_BOLD= CSI+'1m'
var ANSI_CURSOR_UP=  function(n){return CSI+n+'A'}
//var ANSI_CURSOR_DOWN=function(n){return CSI+n+'B'}
//const ANSI_CLEAR_RIGHT=CSI+'K'
const ANSI_CURSORUP=CSI+'A'
//const ANSI_CURSORDN=CSI+'B'

const MAKESPACE_N_SAVE="\n\n"+ANSI_CURSOR_UP(2)+ANSI_CURSOR_SAVE
const MY_RESET=ANSI_CURSOR_RESTORE+ANSI_CLEAR_BELOW


// N files could be categorized as renameable after matching size and time (N OTM, N MTO, N MTM) (See list in duplicateInitial.txt)
// After looking at renamed folders (N), a further N files can be categorized as renameable. (See list in renameAdditional.txt)
//   So a final N renameables after matching size and time and folder belonging (N OTM, N MTO, N MTM) (See list in duplicateFinal.txt)


// var myRandBase63=function(n){
//   return ''.join(secrets.choice(string.ascii_lowercase +string.ascii_uppercase + string.digits+'_') for _ in range(n))
// }

// var myUUID=function(){
//   return myRandBase63(22)
// }



// var formatF_Check_Missing_In_Folder=(strPar, iStartPar, iStopPar, nSum)=>`In ${strPar} (spanning ${iStopPar-iStartPar} rows (${iStartPar}-${iStopPar-1})), ${nSum} files are missing.\n`
// var formatF_Check_Missing_Single=(iRow, strMissing, strName)=>`Row: ${iRow}, ${ANSI_FONT_BOLD}${strMissing}${ANSI_FONT_CLEAR} ${strName}\n`
// var formatF_Check_Missing_Range=(iStart, n, strMissing, strName)=>`Row: ${iStart}-${iStart+n-1} (${n}), ${ANSI_FONT_BOLD}${strMissing}${ANSI_FONT_CLEAR} ${strName}\n`

var formatF_Check_Missing_In_Folder=(strPar, iStartPar, iStopPar, nSum)=>`In ${strPar} (spanning ${iStopPar-iStartPar} rows (${iStartPar}-${iStopPar-1})), ${nSum} files are missing.\n`
var formatF_Check_Missing_Single=(iRow, strMissing, strName)=>`Row: ${iRow}, <b>${strMissing}</b> ${strName}\n`
var formatF_Check_Missing_Range=(iStart, n, strMissing, strName)=>`Row: ${iStart}-${iStart+n-1} (${n}), <b>${strMissing}</b> ${strName}\n`



class MyStatsCache{
  constructor(){ this.obj={}; }
  async stats(fiPath){
    if(!(fiPath in this.obj)) {
      var [err, fsPath]=await myRealPath(fiPath); if(err) {debugger; return [err];}
      //var [err, objStats]=await myGetStats(fiPath); 
      var [err, objStats]=await myGetStats_js(fiPath);  
      if(err) {
        if(err.code==STR_ENOENT || err.message=='noSuch') objStats={}
        else {debugger; return [err];}
      } 
      var {boDir=false, boFile=false}=objStats;
      this.obj[fiPath]={fsPath, boDir, boFile}
    }
    return [null, this.obj[fiPath]]
  }
}
gThis.myStatsCache=new MyStatsCache()

  // getHighestMissing
  // The input strFile is assumed to be a missing file.
  // Returns [err, boFile, strPar, strPath]
  //   strPath: is the highest missing
  //   strPar: is parent of strPath
  //   boFile: signifies if strPath is a file or a folder
var getHighestMissing=async function(fsDir, strFile){
  var boFile=true;
  var strPath=strFile
  while(1){
    var strPar=dirname(strPath);
    if(strPar=='') return [null, boFile, strPar, strPath]
    var [err, result]=await myStatsCache.stats(fsDir+charF+strPar); if(err) {debugger; return [err];}  
    var {fsPar, boDir}=result
    if(boDir) return [null, boFile, strPar, strPath] 
    strPath=strPar
    boFile=false
  }
}

  // For all the files in arrDb: missing files are checked if they also have missing parents.
  // Returned array ObjMissing has the same size as arrDb. ObjMissing[i] contains info about arrDb[i].
  // arrDb entries (files) that exists in fsDir has a null entry in ObjMissing.
  // arrDb entries (files) that does not exist in fsDir, has an object with info about highest missing parent.
var checkHighestMissingArr=async function(arrDb, fsDir){
  var lenDb=arrDb.length, ObjMissing=Array(lenDb).fill(null); //   [null]*lenDb
  for(var i in arrDb){
    var row=arrDb[i], strName=row.strName;
    var fsFile=fsDir+charF+strName;
    var [err, boFileFound]=await fileExist(fsFile); if(err) {debugger; return [err];}
    var obj;
    if(boFileFound) obj=null; //{"strPar":null, "strChild":null}
    else{
      var [err, boFile, strPar, strChild]= await getHighestMissing(fsDir, strName); if(err) {debugger; return [err];}
      obj={"boFile":boFile, "strPar":strPar, "strChild":strChild}
    }
    ObjMissing[i]=obj;
  }
  return [null, ObjMissing]
}



var summarizeMissing=async function(arrDb, fsDir){
  //arrDb=arrDb.slice(0,8)
  //tStop=time.time();    myConsole.printNL('checkHighestMissingArr starts, elapsed time '+str(round((tStop-tStart)*1000))+'ms')
  var [err, ObjMissing]=await checkHighestMissingArr(arrDb, fsDir); if(err) {debugger; return [err];}
  //tStop=time.time();   myConsole.printNL('checkHighestMissingArr: Done, elapsed time '+str(round((tStop-tStart)*1000))+'ms')

  // For debugging:
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


  var lenDb=ObjMissing.length

    // Create objArrRangePar
  var strChildL=null, strParL=null
  var iStart=0, iStop=0, iStartPar=0, iStopPar=0, objArrRangePar={}, ArrRange=[]
  var arrRangePar
  for(var i=0;i<lenDb+1;i++){
    var objMissing=i<lenDb?ObjMissing[i]:null; 
    objMissing=objMissing??{"strPar":null, "strChild":null}
    var {strChild, strPar}=objMissing;
    if(strPar!=strParL){
      if(strChildL!=null) strChildL=myUUID(); // If parent changed then force on-going child range to end.
    }
    if(strChild!=strChildL){
      if(strChildL!=null) {iStop=i; ArrRange.push([iStart,iStop])}
      if(strChild!=null) iStart=i
    }
    if(strPar!=strParL){
      if(strParL!=null){ // parent range ended
        iStopPar=i; 
        if(!(strParL in objArrRangePar)) objArrRangePar[strParL]={"iStartPar":iStartPar, "ArrRange":[]}
        arrRangePar=objArrRangePar[strParL];
        // arrRangePar.ArrRange.push(...ArrRange); // The spread operator may cause stackoverflow in ArrRange is long.
        arrRangePar.ArrRange=arrRangePar.ArrRange.concat(ArrRange); // Same as above, but without spread operator.
        arrRangePar.iStopPar=iStopPar
        ArrRange=[]
      }
      if(strPar!=null) iStartPar=i;
    }
    strChildL=strChild
    strParL=strPar
  }

    // Calculate nSum (number of missing in each arrRangePar)
  for(var strPar in objArrRangePar){
    var arrRangePar=objArrRangePar[strPar]
    var {ArrRange}=arrRangePar;
    var nSum=0
    for(var arrRange of ArrRange){
      var [iStart, iStop]=arrRange, n=iStop-iStart
      nSum+=n
    }
    arrRangePar.nSum=nSum
  }

    // Write objArrRangePar to output
  var StrOut=[]
  for(var strPar in objArrRangePar){
    var arrRangePar=objArrRangePar[strPar]
    var {ArrRange, iStartPar, iStopPar, nSum}=arrRangePar
    if(strPar=="") strPar="(top folder)"
    StrOut.push(formatF_Check_Missing_In_Folder(strPar, iStartPar, iStopPar, nSum))
    for(var arrRange of ArrRange){
      var [iStart, iStop]=arrRange, n=iStop-iStart
      var objMissingStart=ObjMissing[iStart]
      //objMissingStop=ObjMissing[iStop-1]
      var {strChild, strPar, boFile}=objMissingStart
      if(strPar=='') strPar="(top folder)"
      if(n==1){
        var strMissing=boFile?"file":"folder";  strMissing=`Missing ${strMissing}:`;
        StrOut.push("  "+formatF_Check_Missing_Single(iStart, strMissing, strChild))
      }
      else{
        StrOut.push("  "+formatF_Check_Missing_Range(iStart, n, "Missing folder:", strChild))
      }
    }
  }
  //StrOut.push(("Summarize missing: Done"))
  var strOut=StrOut.join('')
  return [null, strOut]
}


  // Go through the db-file, for each row (file), check if the file exist, and report those in a summaristic way.
var checkSummarizeMissing=async function(arg){
  var {fiDir, charTRes, myConsole}=arg
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var fsDb=fsDir+charF+settings.leafDb

  setMess("Parse db...",null,true)
  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);
  setMess("summarizeMissing...",null,true)
  var [err, strSum]=await summarizeMissing(arrDb, fsDir); if(err) {debugger; return [err];}
  myConsole.log(strSum)
  setMess("Summarize missing: Done")
  return [null]
}






var categorizeFile=async function(fsDir, strName){
  var fsFile=fsDir+charF+strName;
  //var boFileFound=os.path.exists(fsFile)
  var [err, boFileFound]=await fileExist(fsFile); if(err) {debugger; return [err];}
  if(boFileFound) return [null, ' ', null, null]
  else{
    var [err, boFile, strPar, flChild]= await getHighestMissing(fsDir, strName); if(err) {debugger; return [err];}
    var charMissing=boFile?'f':'d'
    return [null, charMissing, strPar, flChild]
  }
}

  // Go through the db-file, for each row (file), check if the hashcode matches the actual files hashcode  
var check=async function(arg){
  var {fiDir='.', charTRes, iStart=0, myConsole}=arg
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; return [err];}
  var fsDb=fsDir+charF+settings.leafDb
  var tStart=unixNow()
  var nNotFound=0, nMisMatchTimeSize=0, nMisMatchHash=0, nOK=0

  var [err, strData]=await readStrFile(fsDb); if(err) return [err]
  var arrDb=parseDb(strData, charTRes);

  var lenDb=arrDb.length
  var leafFileDbOld= basename(fsDb)



  //printNoNL(MAKESPACE_N_SAVE)
  myConsole.makeSpaceNSave()

    // Variables for "missing streaks"
  var flMissingFile="", iNotFoundFirst=0, lenFlChildL=0, charMissingL=' ', flChildL=""
  
  var nHour=0, nMin=0, nSec=0
  
  //for iRowCount, row in enumerate(arrDb):
  //for iRowCount in range(intStart,lenDb):
  for(var iRowCount=iStart;iRowCount<lenDb;iRowCount++) {
    //if(viewCheck.boCheckCancel) {setMess('Canceled'); viewCheck.boCheckCancel=false; viewCheck.butCheckCancel.hide(); return [null]}
    if(viewCheck.boCheckCancel) { return [null, "cancelled"]}
    var row=arrDb[iRowCount]
    //var {strHash:strHashOld, size:intSizeOld, mtime:intTimeOld, strName}=row;
    var {strHash:strHashOld, size:intSizeOld, mtime_ns64:intTimeOld, strName}=row;

    var fsFile=fsDir+charF+strName;   
    var [err, charMissing, strPar, flChild]=await categorizeFile(fsDir, strName); if(err) {debugger; return [err];}

    //printNoNL(MY_RESET)
    myConsole.myReset()
    
      // If streak starts
    if(charMissing=='f' && charMissingL!='f') iNotFoundFirst=iRowCount
    else if(charMissing=='d' && charMissingL!='d') iNotFoundFirst=iRowCount
    else if(charMissing=='d' && charMissingL=='d' && flChild!=flChildL) iNotFoundFirst=iRowCount

      // If streak continues
    if(charMissing=='f' && charMissingL=='f') {
      myConsole.cursorUp(); myConsole.clearBelow()
    }
    else if(charMissing=='d' && charMissingL=='d' && flChild==flChildL) {
      myConsole.cursorUp(); myConsole.clearBelow()
    }


    var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(unixNow()-tStart)
    if(charMissing=='f'){
      var nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1) {
        myConsole.print(formatF_Check_Missing_Single(iNotFoundFirst, "Missing file:", strName))
        myConsole.makeSpaceNSave()
      }
      else{
        //var strTmp=os.path.dirname(strName)
        var strTmp=dirname(strName);
        if(strTmp=="") strTmp="(top folder)"
        myConsole.print(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing files in:", strTmp))
        myConsole.makeSpaceNSave()
      }
    } else if(charMissing=='d'){
      nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1){
        myConsole.print(formatF_Check_Missing_Single(iNotFoundFirst, "Missing folder:", flChild))
        myConsole.makeSpaceNSave()
      }
      else{
        myConsole.print(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing folder:", flChild))
        myConsole.makeSpaceNSave()
      }
    } else{
      var strTmp=`${nHour.myPad0(2)}:${nMin.myPad0(2)}:${nSec.myPad0(2)}`
      myConsole.printNL(`${strTmp}, Checking row: ${iRowCount} ${strName}`)
    }
    charMissingL=charMissing; flChildL=flChild
    if(charMissing!=' ') {nNotFound+=1; continue}


      // Calculate hash
    var [err, strHash]=await myMD5(row, fsDir, false); //.decode("utf-8")   
    if(strHash!=strHashOld){ // If hashes mismatches
        // Check modTime and size (perhaps the user forgott to run sync before running check
      var [err, objT]=await myGetStats(fsFile); if(err) {debugger; return [err];}
      //var {size:intSizeNew, mtime:intTimeNew}=objT;
      var {size:intSizeNew, mtime_ns64:intTimeNew}=objT;
      var boTMatch=intTimeNew==intTimeOld,    boSizeMatch=intSizeNew==intSizeOld
      myConsole.myReset()
      var StrTmp=[]
      if(!boTMatch || !boSizeMatch ){// If meta data mismatches
        var strBase=basename(strName)
        if(strBase==leafFileDbOld){
          //var strTmp=`${MY_RESET}Row: ${iRowCount}, (${strName} is ignored)`;      StrTmp.push(strTmp)
          var strTmp=`Row: ${iRowCount}, (${strName} is ignored)`;      StrTmp.push(strTmp)
        }
        else{
          //var strTmp = `${MY_RESET}Row: ${iRowCount}`;      StrTmp.push(strTmp)
          var strTmp = `Row: ${iRowCount}`;      StrTmp.push(strTmp)

          var StrLab=[];
          if(!boSizeMatch) StrLab.push("SIZE")
          if(!boTMatch) StrLab.push("MTIME")
          var strLab=StrLab.join(' and ');
          StrTmp.push(`<b>${strLab} MISMATCH!!!</b> (remember to <b>SYNC</b> the database before checking)`)

          if(!boSizeMatch) {
            var strTmp=`<b>size</b> (db/tree): ${intSizeOld}/${intSizeNew}`;    StrTmp.push(strTmp)
          }
          if(!boTMatch) {
            var tDiff64=intTimeNew-intTimeOld;
            var tDiffS=Number(tDiff64/BigInt(1e9));
            if(tDiffS==0){var tDiffHuman=Number(tDiff64%BigInt(1e9)), charUnit='ns' }
            else { var [tDiffHuman, charUnit]=getSuitableTimeUnit(tDiffS) }
            var strTmp=`<b>tDiff</b> (tree-db): ${tDiffHuman}${charUnit}`;    StrTmp.push(strTmp)
          }
          
          var strTmpB=strName;    StrTmp.push(strTmpB)
        }
        
        nMisMatchTimeSize+=1
      }
      else{// Meta data matches
        //var strTmp = (`${MY_RESET}Row: ${iRowCount}, `+"<b>Hash Mismatch</b>");    StrTmp.push(strTmp)
        var strTmp = (`Row: ${iRowCount}, <b>Hash Mismatch</b>`);    StrTmp.push(strTmp)
        StrTmp.push(`(db/tree): ${strHashOld} / ${strHash}`);   
        StrTmp.push(strName);    
        nMisMatchHash+=1
      }
      
      var strTmp=StrTmp.join(", ")+"\n"
      myConsole.print(strTmp); myConsole.makeSpaceNSave()
    }
    
    else nOK+=1;  // Hashes match
  }
  var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(unixNow()-tStart)
  var StrSum=[]
  StrSum.push(`RowCount: ${iRowCount}`)
  var strTmp=`NotFound: ${nNotFound}`;   if(nNotFound) strTmp=`<b>${strTmp}</b>`;      StrSum.push(strTmp)
  var strTmp=`MisMatchTimeSize: ${nMisMatchTimeSize}`;   if(nMisMatchTimeSize) strTmp=`<b>${strTmp}</b>`;      StrSum.push(strTmp)
  var strTmp=`MisMatchHash: ${nMisMatchHash}`;   if(nMisMatchHash) strTmp=`<b>${strTmp}</b>`;     StrSum.push(strTmp)
  StrSum.push(`OK: ${nOK}`)
  var strSum=StrSum.join(', ')

  var strTmp=`${nHour.myPad0(2)}:${nMin.myPad0(2)}:${nSec.myPad0(2)}`
  myConsole.myReset()
  myConsole.printNL(`Time: ${strTmp}, Done (${strSum})`); //resetMess()
  if(nMisMatchTimeSize) myConsole.printNL(`<b>META (SIZE/MTIME) MISMATCHES!!!</b> (on ${nMisMatchTimeSize} file${pluralS(nMisMatchTimeSize)}) This happens when the db wasn't <b>SYNCED</b> before checking.`)

  return [null, "Check finished"]
}

