
"use strict"

// The following flags are defined for the st_mode field:
const S_IFMT   =  0o170000   // bit mask for the file type bit fields
const S_IFSOCK =  0o140000   // socket
const S_IFLNK  =  0o120000   // symbolic link
const S_IFREG  =  0o100000   // regular file
const S_IFBLK  =  0o060000   // block device
const S_IFDIR  =  0o040000   // directory
const S_IFCHR  =  0o020000   // character device
const S_IFIFO  =  0o010000   // FIFO
const S_ISUID  =  0o004000   // set UID bit
const S_ISGID  =  0o002000   // set-group-ID bit (see below)
const S_ISVTX  =  0o001000   // sticky bit (see below)
const S_IRWXU  =  0o0700     // mask for file owner permissions
const S_IRUSR  =  0o0400     // owner has read permission
const S_IWUSR  =  0o0200     // owner has write permission
const S_IXUSR  =  0o0100     // owner has execute permission
const S_IRWXG  =  0o0070     // mask for group permissions
const S_IRGRP  =  0o0040     // group has read permission
const S_IWGRP  =  0o0020     // group has write permission
const S_IXGRP  =  0o0010     // group has execute permission
const S_IRWXO  =  0o0007     // mask for permissions for others (not in group)
const S_IROTH  =  0o0004     // others have read permission
const S_IWOTH  =  0o0002     // others have write permission
const S_IXOTH  =  0o0001     // others have execute permission



app.dirname=function(fl){
  var ind=fl.lastIndexOf('/');
  if(ind==-1) return "";
  else return fl.slice(0, ind)
}
app.basename=function(fl){
  var ind=fl.lastIndexOf('/');
  if(ind==-1) return fl;
  else return fl.slice(ind+1)
}


app.fileExist=async function(fsFile){
  var [err, stats] = await Neutralino.filesystem.getStats(fsFile).toNBP();
  if(err){
    if(err.code=="NE_FS_NOPATHE") return [null, false]
    else{ debugger; return [err];}
  }
  return [null, true]
}


  // Gets: size, boFile, boDir, createdAt, modifiedAt
app.myGetStats_neu=async function(fsFile){
  var [err, stats] = await Neutralino.filesystem.getStats(fsFile).toNBP();
  debugger
  if(err){
    if(err.code=="NE_FS_NOPATHE") return [null, false]
    else{ debugger; return [err];}
  }
  return [null, stats]
}


app.myGetStats=async function(fsFile){
  fsFile=escBashChar(fsFile)
  var [err, objT] = await Neutralino.os.execCommand('stat --format="%i %.Y %f %s" '+fsFile+'').toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode)  {
    if(stdErr.indexOf('No such')==-1)  {debugger; return [new Error(stdErr)];}
    return [new Error('noSuch')]
  }
  stdOut=stdOut.trim();
  var StrM=stdOut.split(" ");
  var mode=parseInt(StrM[2], 16);
  var StrTime=StrM[1].split(".")
  var flMtime=Number(StrM[1]), mtime=StrTime[0], mtime_ns=StrTime[1], flMtime_ns=flMtime*1e9
  mtime=Number(mtime); mtime_ns=Number(mtime_ns);
  var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
  var objOut={boDir, boFile, boSym, inode:Number(StrM[0]), mtime, mtime_ns, mode, size:Number(StrM[3])}
  return [null, objOut];
}


app.calcFileNameWithCounter=async function(filename){  // Example calcFileNameWithCounter("file{}.pdf")
  var counter = 0
  //filename = "file{}.pdf"
  var ind=filename.lastIndexOf('.')
  var strWOExt=filename.slice(0, ind),  strExt=filename.slice(ind+1)
  while(1){
    var filenameT=strWOExt+counter+'.'+strExt
    var [err, boExist]=await fileExist(filenameT); if(err) return [err]
    if(boExist) counter++;
    else return [null, filenameT];
  }
}

  // The problem with Neutralino.filesystem.getStats no inode, only milliseconds (no nano second resolution)
  // What meta data:  filename, inode, type (file, directory or link), size, mtime 

  // This version of myStatsOfDirContent doesn't work if strPar only has hidden files. 
var myStatsOfDirContent=async function(strPar='.'){
  var lenPar=strPar.length
  var StrPrefix=["", "."], arrStrRow=Array(2)
  strPar=escBashChar(strPar)
  for(var i in StrPrefix){
    var strPrefix=StrPrefix[i]
    var [err, objT] = await Neutralino.os.execCommand('stat --format="%i %.Y %f %s@%n" '+strPar+'/'+strPrefix+'*').toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) {
      if(stdErr.indexOf('No such')==-1)  {debugger; return [new Error(stdErr)];}
      var StrRowT=[]
    } else {
      stdOut=stdOut.trim();  var StrRowT=stdOut.split('\n');
    }
    arrStrRow[i]=StrRowT
  }
  var StrRow=arrStrRow[0].concat(arrStrRow[1])

  var len=StrRow.length;
  var ObjRow=[];
  for(var i=0;i<len;i++){
    var strRow=StrRow[i];
    //if(strRow.length==0) continue
    var indAt=strRow.indexOf('@'), indNameStart=indAt+1;
    var indLeafStart=indNameStart+lenPar+1;
    var name=strRow.slice(indLeafStart);
    if(name=='.' || name=='..') continue
    var strMeta=strRow.slice(0, indAt);
    var StrM=strMeta.split(" ");
    var mode=parseInt(StrM[2], 16);
    var StrTime=StrM[1].split(".")
    var flMtime=Number(StrM[1]), mtime=StrTime[0], mtime_ns=StrTime[1], flMtime_ns=flMtime*1e9
    mtime=Number(mtime); mtime_ns=Number(mtime_ns);
    var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
    ObjRow.push({boDir, boFile, boSym, name, inode:Number(StrM[0]), mtime, mtime_ns, mode, size:Number(StrM[3])})
  }
  return [null, ObjRow];
}

//var regString=/"(.*?)(?<!\\)"/g

var myStatsOfDirContent_=async function(strPar='.'){
  if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/Downloads/backup') debugger
  strPar=escDoubleQuote(strPar)
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  var lenPar=strPar.length;
  var [err, objT] = await Neutralino.os.execCommand('ls -lAigoQU --time-style=+"%s.%N"  --color=never "'+strPar+'"').toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    if(stdErr.indexOf('No such')!=-1) return [null, []];
    debugger; return [new Error(stdErr)]
  };
  stdOut=stdOut.trim()
  var StrRow=stdOut.split('\n'); StrRow.shift()
  var len=StrRow.length;
  var ObjRow=Array(len);
  for(var i=0;i<len;i++){
    var strRow=StrRow[i];
    //if(strRow.length==0) continue
    var indFirstQuote=strRow.indexOf('"');
    var strNameWQ=strRow.slice(indFirstQuote);
    var strMeta=strRow.slice(0, indFirstQuote-1);
    var strMeta=strMeta.trim()
    var StrM=strMeta.split(/\s+/);
    var [inode, mode, nHL, size, strMtime]=StrM;
    inode=Number(inode); size=Number(size); var type=mode[0]
    var StrTime=strMtime.split(".");
    var flMtime=Number(strMtime), mtime=StrTime[0], mtime_ns=StrTime[1], flMtime_ns=flMtime*1e9
    var boDir=type=='d', boFile=type=='-', boSym=type=='l';
    if(boSym){
        // Getting the location of the ending quotationmark of the first string
      var strNameTmp=strNameWQ.slice(1), n = strNameTmp.search(regFirstNonEscapedQuotationMark);
      //var name=strNameTmp.slice(0,n);
      var name=JSON.parse(strNameWQ.slice(0,n+2));
    }else {
      //var name=strNameWQ.slice(1,-1);
      var name=JSON.parse(strNameWQ);
    }
    mtime=Number(mtime); mtime_ns=Number(mtime_ns);
    ObjRow[i]={boDir, boFile, boSym, name, inode, mtime, mtime_ns, size}
  }
  return [null, ObjRow];
}

var myStatsOfDirContent=async function(strPar='.'){
  //if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/Downloads/backup') debugger
  strPar=escDoubleQuote(strPar)
  var strCmd='/home/magnus/progC/0NT/20230414ListFolder/main'
  var [err, objT] = await Neutralino.os.execCommand(strCmd+' "'+strPar+'"').toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    debugger; return [new Error(stdErr)]
  };
  stdOut=stdOut.trim()
  if(stdOut.length==0) return [null, []];
  var StrRow=stdOut.split('\n');
  var len=StrRow.length;
  var ObjRow=Array(len);
  for(var i=0;i<len;i++){
    var strRow=StrRow[i];
    var indAt=strRow.indexOf('@'), indNameStart=indAt+1;
    var name=strRow.slice(indNameStart);
    var strMeta=strRow.slice(0, indAt);
    var strMeta=strMeta.trim()
    var StrM=strMeta.split(/\s+/);
    //var StrM=strMeta.split(" ");
    var [inode, mode, strTime, size]=StrM;
    //var inode=StrM[0], mode=StrM[1], strTime=StrM[2], size=StrM[3];
    inode=Number(inode); mode=Number(mode); size=Number(size); 
    var flMtime=Number(strTime), flMtime_ns=flMtime*1e9;
    var StrTime=strTime.split(".");
    var [mtime, mtime_ns]=StrTime; 
    //var mtime=StrTime[0], mtime_ns=StrTime[1]; 
    mtime=Number(mtime); mtime_ns=Number(mtime_ns);
    var boDir=Boolean(mode&S_IFDIR>>12), boSym=Boolean(mode&(S_IFLNK>>12&~(S_IFREG>>12))), boFile=Boolean(mode&S_IFREG>>12) && !boSym
    //var boDir=Boolean(mode==4), boSym=Boolean(mode==10), boFile=Boolean(mode==8) && !boSym
    ObjRow[i]={boDir, boFile, boSym, name, inode, mtime, mtime_ns, mode, size}
  }
  return [null, ObjRow];
}



//Promise.prototype.toNBP=function(){   return this.then(a=>{return [null,a];}).catch(e=>{return [e];});   }  // toNodeBackPromise
var myRead=async function(strFile='.'){
  if(typeof strFile!='string' || strFile.length==0) strFile='.'
  var flFile;
  if(strFile[0]=='/') {
    var fsRoot=NL_CWD, lRoot=fsRoot.length;
    flFile=strFile.substring(lRoot+1);
  } else flFile=strFile;
  flFile=strFile
  //var buf = await Neutralino.filesystem.readFile(flFile); 
  var [err, strOut] = await Neutralino.filesystem.readFile(flFile).toNBP(); 
  //var [err, buf] = await toNBP(Neutralino.filesystem.readFile(flFile)); 

  return [err, strOut]
}

var myRealPath=async function(fiT){
  //fiT=escDoubleQuote(fiT)
  fiT=escBashChar(fiT)
  var [err, objT] = await Neutralino.os.execCommand('realpath -s '+fiT).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {debugger; return [new Error(stdErr)]};
  stdOut=stdOut.trim()
  return [null, stdOut];
}

// var isFolderEmpty=async function(fiDir){ // Doesn't appear to be used (could be removed ?!?)
//   fiDir=escDoubleQuote(fiDir)
//   var [err, objT] = await Neutralino.os.execCommand('find "'+fiDir+'" -maxdepth 0 -empty').toNBP();
//   if(err) { debugger; return [err];}
//   var {exitCode, pid, stdErr, stdOut}=objT;
//   if(exitCode) {debugger; return [new Error(stdErr)]};
//   stdOut=stdOut.trim()
//   var boEmpty=Boolean(stdOut)
//   return [null, boEmpty];
// }



app.createDirectoryWAncestors=async function(fsDirT){
  var fsDir=fsDirT;
  var FsDirMissing=[]
  while(1){
    var [err, result]=await Neutralino.filesystem.getStats(fsDir).toNBP();
    if(err){
      if(err.code=="NE_FS_NOPATHE") {FsDirMissing.push(fsDir); fsDir=dirname(fsDir);} else return [err]; 
    } else {break; }
  }

  for(var i=FsDirMissing.length-1; i>=0; i--){
    var fsDir=FsDirMissing[i]
    var [err, result]=await Neutralino.filesystem.createDirectory(fsDir).toNBP(); if(err) return [err]; 
  }

  return [null]
}

////////////////////////////////////////////////////////////
// Higher level fs interfaces
////////////////////////////////////////////////////////////


/*****************************************************************
 * renameFiles (or folders)
 *****************************************************************/
var renameFiles=async function(fsDir, arrRename){
  var arrTmpName=[]
  for(var row of arrRename){    // Rename to temporary names
    var {strNew, strOld}=row
    var fsOld=fsDir+'/'+strOld, fsNew=fsDir+'/'+strNew, fsTmp=fsNew+'_'+myUUID()
    var fsPar=dirname(fsNew);
    arrTmpName.push(fsTmp)

    //var fsPar='/home/magnus/progPython/buvt-TargetFs/Target/progBlahh'
    var [err]=await createDirectoryWAncestors(fsPar); if(err) return [err];
    
    var [err, result]=await Neutralino.filesystem.moveFile(fsOld, fsTmp).toNBP(); if(err) return [err];
  }
  for(var i in arrRename){    // Rename to final names
    var row=arrRename[i]
    var fsTmp=arrTmpName[i]
    var fsNew=fsDir+'/'+row.strNew

    var [err, result]=await Neutralino.filesystem.moveFile(fsTmp, fsNew).toNBP(); if(err) return [err];
  }
  return [null]
}

   
var myRmFiles=async function(arrEntry, fsDir){ 
  // Todo: possibly use Neutralino.filesystem.removeFile instead.
  if(arrEntry.length){
    var arr=['rm']
    for(var row of arrEntry){
      var fsName=fsDir+'/'+row.strName
      fsName=escDoubleQuote(fsName);
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
var myRmFolders=async function(arrEntry, fsDir){
  // Todo: possibly use Neutralino.filesystem.removeDirectory instead.
  if(arrEntry.length){
    var arr=['rmdir']
    for(var row of arrEntry){
      var fsName=fsDir+'/'+row.strName
      fsName=escDoubleQuote(fsName);
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
var myMkFolders=async function(arrEntry, fsDir){
  // Todo: possibly use Neutralino.filesystem.removeDirectory instead.
  if(arrEntry.length){
    var arr=['mkdir']
    for(var row of arrEntry){
      var fsName=fsDir+'/'+row.strName
      fsName=escDoubleQuote(fsName);
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


var myCopyEntries=async function(arrEntry, fsDirSource, fsDirTarget){
  for(var row of arrEntry){
    var fsSouceName=fsDirSource+'/'+row.strName
    var fsTargetName=fsDirTarget+'/'+row.strName
    var fsPar=dirname(fsTargetName);

    var [err]=await createDirectoryWAncestors(fsPar); if(err) return [err];

    fsSouceName=escDoubleQuote(fsSouceName); fsTargetName=escDoubleQuote(fsTargetName);
    var [err, objT] = await Neutralino.os.execCommand('cp -pP "'+fsSouceName+'" "'+fsTargetName+'"').toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [new Error(stdErr)]; };
  }
  return [null]
}

// var myCopyEntries=async function(arrEntry, fsDirSource, fsDirTarget){  // Using Neutralino.filesystem.copyFile will not perserv modTime
//   for(var row of arrEntry){
//     var fsSouceName=fsDirSource+'/'+row.strName
//     var fsTargetName=fsDirTarget+'/'+row.strName
//     var fsPar=dirname(fsTargetName); 
//     var [err]=await createDirectoryWAncestors(fsPar); if(err) return [err];

//     var [err, objT] = await Neutralino.filesystem.copyFile(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}
//   }
//   return [null]
// }

var writeMetaFile=async function(arrDB, fsMeta){
    // If fsMeta exist then rename it
  var [err, objStats]=await myGetStats(fsMeta);
  if(err) {
    if(err.message=='noSuch') objStats={}
    else return [err];
  } 
  var boExist=Boolean(objStats),  {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsMetaWithCounter]=await calcFileNameWithCounter(fsMeta); if(err) return [err];
    var [err, result]=await Neutralino.filesystem.moveFile(fsMeta, fsMetaWithCounter).toNBP(); if(err) return [err];
  }

  var StrOut=Array(arrDB.length)
    // Write fsMeta
  for(var i in arrDB){
    var row=arrDB[i], {strType, inode, strHash, mtime, mtime_ns, size, strName}=row;
    //fo.write('%10s %32s %10s %10s %s\n' %(row.inode, row.strHash, Math.floor(row.mtime), row.size, row.strName))
    //var strType=row.boLink?'l':'f';
    //StrOut[i]=strType+' '+inode.myPadStart(10)+' '+strHash.padStart(32)+' '+mtime.myPadStart(10)+''+mtime_ns.myPadStart(9,'0')+' '+size.myPadStart(10)+' '+strName
    StrOut[i]=`${strType} ${inode.myPadStart(10)} ${strHash.padStart(32)} ${mtime.myPadStart(10)}${mtime_ns.myPadStart(9,'0')} ${size.myPadStart(10)} ${strName}`
  }
  StrOut.unshift('strType inode strHash mtime size strName')  //uuid 
  //fo.close();
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(fsMeta, strOut).toNBP(); if(err) return [err];
  return [null]
}

var writeHashFile=async function(arrDB, fsHash){
    // If fsHash exist then rename it
  var [err, objStats]=await myGetStats(fsHash);
  if(err) {
    if(err.message=='noSuch') objStats={}
    else return [err];
  }
  var boExist=Boolean(objStats),  {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsHashWithCounter]=await calcFileNameWithCounter(fsHash); if(err) return [err];
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


  // Extract files that starts with flPrepend, remove the flPrepend part and return in arrDBRelevant.
  // Remaining files are returned in arrDBNonRelevant
  // arrDBRelevant elements are (shallowly) copied from the elements in arrDB (so the can be changed)
  // arrDBNonRelevant elements are NOT copies (So if they are changed, the elements in arrDB are also changed)
var selectFrArrDB=function(arrDB, flPrepend){
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
}
// var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, flPrepend)



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
  var strTmp=StrScreen.join('\n');   
  //myConsole.log("%c"+strTmp, 'font-family:monospace')
  myConsole.log(strTmp)
  return [false]
}

