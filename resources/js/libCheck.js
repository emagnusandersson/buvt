
"use strict"

// import secrets
// import string
// from lib import *
// import time
// import stat
// import uuid


  // Google for "ansi vt100 codes" to learn about the codes in the printf-strings
const charEsc='\u001b'
const charEscA=`${0o33}`
const charEscB=`${27}`
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
// var formatF_Check_Missing_Single=(iRow, strMissing, strName)=>`Row: ${iRow}, ` +ANSI_FONT_BOLD+strMissing+ANSI_FONT_CLEAR+` ${strName}\n`
// var formatF_Check_Missing_Range=(iStart, n, strMissing, strName)=>`Row: ${iStart}-${iStart+n-1} (${n}), ` +ANSI_FONT_BOLD+strMissing+ANSI_FONT_CLEAR+` ${strName}\n`

var formatF_Check_Missing_In_Folder=(strPar, iStartPar, iStopPar, nSum)=>`In ${strPar} (spanning ${iStopPar-iStartPar} rows (${iStartPar}-${iStopPar-1})), ${nSum} files are missing.\n`
var formatF_Check_Missing_Single=(iRow, strMissing, strName)=>`Row: ${iRow}, <b>${strMissing}</b> ${strName}\n`
var formatF_Check_Missing_Range=(iStart, n, strMissing, strName)=>`Row: ${iStart}-${iStart+n-1} (${n}), <b>${strMissing}</b> ${strName}\n`



class MyStatsCache{
  constructor(){ this.obj={}; }
  async stats(fiPath){
    if(!(fiPath in this.obj)) {
      var [err, fsPath]=await myRealPath(fiPath); if(err) {debugger; return [err];}
      var [err, objStats]=await myGetStats(fiPath); // Can't use Neutralino.filesystem.getStats cause links to folders look like folders
      if(err) {
        if(err.message=='noSuch') objStats={}
        else return [err];
      } 
      var {boDir=false, boFile=false}=objStats;
      this.obj[fiPath]={fsPath, boDir, boFile}
    }
    return [null, this.obj[fiPath]]
  }
}
app.myStatsCache=new MyStatsCache()

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
    var [err, result]=await myStatsCache.stats(fsDir+'/'+strPar); if(err) return [err]  
    var {fsPar, boDir}=result
    if(boDir) return [null, boFile, strPar, strPath] 
    strPath=strPar
    boFile=false
  }
}

  // For all the files in arrDB: missing files are checked if they also have missing parents.
  // Returned array ObjMissing has the same size as arrDB. ObjMissing[i] contains info about arrDB[i].
  // arrDB entries (files) that exists in fsDir has a null entry in ObjMissing.
  // arrDB entries (files) that does not exist in fsDir, has an object with info about highest missing parent.
var checkHighestMissingArr=async function(arrDB, fsDir){
  var lenDB=arrDB.length, ObjMissing=Array(lenDB).fill(null); //   [null]*lenDB
  for(var i in arrDB){
    var row=arrDB[i], strName=row.strName;
    var fsFile=fsDir+'/'+strName;
    var [err, boFileFound]=await fileExist(fsFile); if(err) return [err]
    var obj;
    if(boFileFound) obj=null; //{"strPar":null, "strChild":null}
    else{
      var [err, boFile, strPar, strChild]= await getHighestMissing(fsDir, strName); if(err) return [err]
      obj={"boFile":boFile, "strPar":strPar, "strChild":strChild}
    }
    ObjMissing[i]=obj;
  }
  return [null, ObjMissing]
}



var summarizeMissing=async function(arrDB, fsDir){
  //arrDB=arrDB.slice(0,8)
  //tStop=time.time();    myConsole.printNL('checkHighestMissingArr starts, elapsed time '+str(round((tStop-tStart)*1000))+'ms')
  var [err, ObjMissing]=await checkHighestMissingArr(arrDB, fsDir); if(err) return [err]
  //tStop=time.time();   myConsole.printNL('checkHighestMissingArr done, elapsed time '+str(round((tStop-tStart)*1000))+'ms')

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


  var lenDB=ObjMissing.length

    // Create objArrRangePar
  var strChildL=null, strParL=null
  var iStart=0, iStop=0, iStartPar=0, iStopPar=0, objArrRangePar={}, ArrRange=[]
  var arrRangePar
  for(var i=0;i<lenDB+1;i++){
    var objMissing=i<lenDB?ObjMissing[i]:null; 
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
        arrRangePar=objArrRangePar[strParL];  arrRangePar.ArrRange.push(...ArrRange);  arrRangePar.iStopPar=iStopPar
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

    // Write objArrRangePar to myConsole
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
        var strMissing=boFile?"file":"folder";  strMissing="Missing "+strMissing+':';
        StrOut.push("  "+formatF_Check_Missing_Single(iStart, strMissing, strChild))
      }
      else{
        StrOut.push("  "+formatF_Check_Missing_Range(iStart, n, "Missing folder:", strChild))
      }
    }
  }
  var strOut=StrOut.join('')
  myConsole.log(strOut)
  return
}


  // Go through the meta-file, for each row (file), check if the file exist, and report those in a summaristic way.
var checkSummarizeMissingInterior=async function(fsMeta, fsDir){
  var [err, arrDB]=await parseMeta(fsMeta); if(err) return [err]
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

  // Go through the meta-file, for each row (file), check if the hashcode matches the actual files hashcode  
var checkHash=async function(fsMeta, fsDir, intStart){
  var tStart=new Date()
  var nNotFound=0, nMisMatchTimeSize=0, nMisMatchHash=0, nOK=0

  var [err, arrDB]=await parseMeta(fsMeta); if(err) return [err]

  var lenDB=arrDB.length
  var leafFileMetaOld= basename(fsMeta)



  //printNoNL(MAKESPACE_N_SAVE)
  myConsole.makeSpaceNSave()

    // Variables for "missing streaks"
  var flMissingFile="", iNotFoundFirst=0, lenFlChildL=0, charMissingL=' ', flChildL=""
  
  var nHour=0, nMin=0, nSec=0
  
  //for iRowCount, row in enumerate(arrDB):
  //for iRowCount in range(intStart,lenDB):
  for(var iRowCount=intStart;iRowCount<lenDB;iRowCount++) {
    var row=arrDB[iRowCount]
    var {strHash:strHashOld, size:intSizeOld, mtime:intTimeOld, strName}=row;

    var fsFile=fsDir+'/'+strName;   
    var [err, charMissing, strPar, flChild]=await categorizeFile(fsDir, strName); if(err) return [err]

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


    var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(new Date()-tStart)
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
      var strTmp=nHour.myPad0(2)+':'+nMin.myPad0(2)+':'+nSec.myPad0(2)
      myConsole.print(`${strTmp}, Checking row: ${iRowCount} (${strName})\n`)
    }
    charMissingL=charMissing; flChildL=flChild
    if(charMissing!=' ') {nNotFound+=1; continue}


      // Calculate hash
    //var [err, strHash]=await myMD5(fsFile); //.decode("utf-8")   
    var [err, strHash]=await myMD5W(row, fsDir); //.decode("utf-8")   
    if(strHash!=strHashOld){ // If hashes mismatches
        // Check modTime and size (perhaps the user forgott to run sync before running check
      var [err, objT]=await myGetStats(fsFile); if(err) return [err]
      var {size:intSizeNew, mtime:intTimeNew}=objT;
      var boTMatch=intTimeNew==intTimeOld,    boSizeMatch=intSizeNew==intSizeOld
      myConsole.myReset()
      var StrTmp=[]
      if(!boTMatch || !boSizeMatch ){// If meta data mismatches
        var strBase=basename(strName)
        if(strBase==leafFileMetaOld){
          //var strTmp=MY_RESET+`Row: ${iRowCount}, (${strName} is ignored)`;      StrTmp.push(strTmp)
          var strTmp=`Row: ${iRowCount}, (${strName} is ignored)`;      StrTmp.push(strTmp)
        }
        else{
          //var strTmp = MY_RESET+`Row: ${iRowCount}`;      StrTmp.push(strTmp)
          var strTmp = `Row: ${iRowCount}`;      StrTmp.push(strTmp)

          var StrLab=[];
          if(!boSizeMatch) StrLab.push("SIZE")
          if(!boTMatch) StrLab.push("MTIME")
          var strLab=StrLab.join(' and ');
          StrTmp.push(`<b>${strLab} MISMATCH!!!</b> (remember: run <b>HASHBERT SYNC</b> first)`)

          if(!boSizeMatch) {
            var strTmp=`<b>size</b> (db/tree): ${intSizeOld}/${intSizeNew}`;    StrTmp.push(strTmp)
          }
          if(!boTMatch) {
            var tDiff=intTimeNew-intTimeOld, [tDiffHuman, charUnit]=getSuitableTimeUnit(tDiff)
            var strTmp=`<b>tDiff</b> (tree-db): ${tDiffHuman}${charUnit}`;    StrTmp.push(strTmp)
          }
          
          var strTmpB=strName;    StrTmp.push(strTmpB)
        }
        
        nMisMatchTimeSize+=1
      }
      else{// Meta data matches
        //var strTmp = (MY_RESET+`Row: ${iRowCount}, `+"<b>Hash Mismatch</b>");    StrTmp.push(strTmp)
        var strTmp = (`Row: ${iRowCount}, <b>Hash Mismatch</b>`);    StrTmp.push(strTmp)
        StrTmp.push("(db/tree): "+strHashOld+" / "+strHash);   
        StrTmp.push(strName);    
        nMisMatchHash+=1
      }
      
      var strTmp=StrTmp.join(", ")+"\n"
      myConsole.print(strTmp); myConsole.makeSpaceNSave()
    }
    
    else nOK+=1;  // Hashes match
  }
  var [tDay,nHour,nMin,nSec,tms,tus,tns]=formatTDiff(new Date()-tStart)
  var StrSum=[]
  StrSum.push(`RowCount: `+iRowCount)
  var strTmp=`NotFound: `+nNotFound;   if(nNotFound) strTmp="<b>"+strTmp+"</b>";      StrSum.push(strTmp)
  var strTmp=`MisMatchTimeSize: `+nMisMatchTimeSize;   if(nMisMatchTimeSize) strTmp="<b>"+strTmp+"</b>";      StrSum.push(strTmp)
  var strTmp=`MisMatchHash: `+nMisMatchHash;   if(nMisMatchHash) strTmp="<b>"+strTmp+"</b>";     StrSum.push(strTmp)
  StrSum.push(`OK: `+nOK)
  var strSum=StrSum.join(', ')

  var strTmp=nHour.myPad0(2)+':'+nMin.myPad0(2)+':'+nSec.myPad0(2)
  myConsole.myReset()
  myConsole.printNL(`Time: ${strTmp}, Done (`+strSum+`)`)
  if(nMisMatchTimeSize) myConsole.printNL(`<b>META (SIZE/MTIME) MISMATCHES!!!</b> (on ${nMisMatchTimeSize} file(s)) This happens when <b>HASHBERT SYNC</b> wasn't called before checking. (So call <b>HASHBERT SYNC</b> before running <b>HASHBERT CHECK</b>)`)

  return ""
}

