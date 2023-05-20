
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




//
// Storage
//

// app.getItemN=async function(name){
//   var [err,val]=await Neutralino.storage.getData(name).toNBP();   
//   if(err && err.code=="NE_ST_NOSTKEX") val=null
//   if(val!==null) val=JSON.parse(val);  return val;
// }
// app.setItemN=async function(name,value){
//   if(typeof value=='undefined') value=null;
//   await Neutralino.storage.setData(name, JSON.stringify(value));
// }

class MyStorage{
  constructor(fsFile){ 
    this.fsFile=fsFile;
  }
  async readCache(){
    var [err, buf] = await Neutralino.filesystem.readFile(this.fsFile).toNBP(); //if(err) return [err]
    if(err){
      if(err.code=="NE_FS_FILRDER") {  return [null, {}]}
      else{ debugger; return [err];}
    }
    var strData=buf.toString().trim()
    var cache=JSON.parse(strData)
    //cache=copyDeep(cache);
    return [null, cache]
  }
  async getItem(name){
    if(!('cache' in this)) {
      var [err, cache]=await this.readCache(); if(err) return [err];
      this.cache=cache
    }
    //var [err,val]=await Neutralino.storage.getData(name).toNBP();   
    //if(err && err.code=="NE_ST_NOSTKEX") val=null
    //if(val!==null) val=JSON.parse(val);  return val;
    //var strData=buf.toString().trim()
    var val=this.cache[name]
    //this.abc={a:[{a:""}]}
    return [null, val]
  }
  async setItem(name,value){
    if(!('cache' in this)) {
      var [err, cache]=await this.readCache(); if(err) return [err];
      this.cache=cache
    }
    //if(typeof value=='undefined') value=null;
    this.cache[name]=value
    var strT=JSON.stringify(this.cache, null, 2)
    var [err]=await Neutralino.filesystem.writeFile(this.fsFile, strT).toNBP(); if(err) return [err];
    return [null]
  }

}



app.checkPathFormat=function(arr){
  var boFWDSlash=false, charFWDSlash='/'; 
  for(var row of arr){
    if(row.strName.indexOf(charFWDSlash)!=-1) {boFWDSlash=true; break}  
  }
  if(boFWDSlash) return 'linux'; // If a forward slash is found, then assume linux
  return 'win32';
}

app.dirname=function(fl){
  var ind=fl.lastIndexOf(charF);
  if(ind==-1) return "";
  else return fl.slice(0, ind)
}
app.basename=function(fl){
  var ind=fl.lastIndexOf(charF);
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
  //fsFile=escBashChar(fsFile)
  fsFile=escInQ(fsFile)
  if(NL_OS=='Windows'){
    var arrCommand=['python', fsPyParser, 'singleFile', fsFile], strCommand=arrCommand.join(' ')
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();  if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [Error(stdErr)]; } 
    //if(!boExist) return [Error('noSuch')]
    var StrM=stdOut.trim().split(' ');
    var [strErr, boFile, boDir, id, mtime_ns64, size]=StrM
    if(strErr=='noSuch') return [Error('noSuch')]
    var objOut={boDir:Boolean(boDir), boFile:Boolean(boFile), id:Number(id), mtime_ns64:BigInt(mtime_ns64), size:Number(size)}
    //return [Error('myGetStats for Windows is not supported')];
  }else{
    var strCommand='stat --format="%i %.Y %f %s" '+fsFile;
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode)  {
      if(stdErr.indexOf('No such')==-1)  {debugger; return [Error(stdErr)];}
      return [Error('noSuch')]
    }
    stdOut=stdOut.trim();
    var StrM=stdOut.split(" ");
    var mode=parseInt(StrM[2], 16);
    var StrTime=StrM[1].split(".")
    if(StrTime.length==1) StrTime=StrM[1].split(",")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    //mtime=Number(mtime); mtime_ns=Number(mtime_ns); debugger // mtime_ns (the string) should be right padded with zeros to the length of 9 before converting to a number.
    var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
    var objOut={boDir, boFile, boSym, id:Number(StrM[0]), mtime_ns64, mode, size:Number(StrM[3])}
  }
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

  // The problem with Neutralino.filesystem.getStats no id, only milliseconds (no nano second resolution)
  // What meta data:  filename, id, type (file, directory or link), size, mtime 

  // This version of myStatsOfDirContent doesn't work if strPar only has hidden files. 
var myStatsOfDirContent=async function(strPar='.'){
  var lenPar=strPar.length
  var StrPrefix=["", "."], arrStrRow=Array(2)
  strPar=escBashChar(strPar)
  for(var i in StrPrefix){
    var strPrefix=StrPrefix[i]
    var strCommand=`stat --format="%i %.Y %f %s@%n" ${strPar}/${strPrefix}*`;
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) {
      if(stdErr.indexOf('No such')==-1)  {debugger; return [Error(stdErr)];}
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
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
    ObjRow.push({boDir, boFile, boSym, name, id:Number(StrM[0]), mtime_ns64, mode, size:Number(StrM[3])})
  }
  return [null, ObjRow];
}

//var regString=/"(.*?)(?<!\\)"/g

var myStatsOfDirContent_=async function(strPar='.'){
  if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/Downloads/backup') debugger
  strPar=escInQ(strPar)
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  var lenPar=strPar.length;
  var strCommand=`ls -lAigoQU --time-style=+"%s.%N"  --color=never ${strPar}`;
  var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    if(stdErr.indexOf('No such')!=-1) return [null, []];
    debugger; return [Error(stdErr)]
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
    var [id, mode, nHL, size, strMtime]=StrM;
    id=Number(id); size=Number(size); var type=mode[0]
    var StrTime=strMtime.split(".")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
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
    //mtime=Number(mtime); mtime_ns=Number(mtime_ns); debugger// mtime_ns (the string) should be right padded with zeros to the length of 9 before converting to a number.
    ObjRow[i]={boDir, boFile, boSym, name, id, mtime_ns64, size}
  }
  return [null, ObjRow];
}

var myStatsOfDirContent=async function(strPar='.'){
  //if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/Downloads/backup') debugger
  strPar=escInQ(strPar)
  var strCmd='/home/magnus/progC/0NT/20230414ListFolder/main'
  var strCommand=`${strCmd} ${strPar}`;
  var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    debugger; return [Error(stdErr)]
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
    var [id, mode, strTime, size]=StrM;
    //var id=StrM[0], mode=StrM[1], strTime=StrM[2], size=StrM[3];
    id=Number(id); mode=Number(mode); size=Number(size);
    var StrTime=strTime.split(".")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    var boDir=Boolean(mode&S_IFDIR>>12), boSym=Boolean(mode&(S_IFLNK>>12&~(S_IFREG>>12))), boFile=Boolean(mode&S_IFREG>>12) && !boSym
    //var boDir=Boolean(mode==4), boSym=Boolean(mode==10), boFile=Boolean(mode==8) && !boSym
    ObjRow[i]={boDir, boFile, boSym, name, id, mtime_ns64, mode, size}
  }
  return [null, ObjRow];
}



//Promise.prototype.toNBP=function(){   return this.then(a=>{return [null,a];}).catch(e=>{return [e];});   }  // toNodeBackPromise
var myRead=async function(fsFile){ //='.'
  if(NL_OS=="Windows") {
    var [err, strOut] = await Neutralino.filesystem.readFile(fsFile).toNBP();  if(err) { debugger; return [err];}
  } else{
    var [err, strOut] = await Neutralino.filesystem.readFile(fsFile).toNBP();  if(err) { debugger; return [err];}
  } 

  return [err, strOut]
}

var myRealPath=async function(fiIn){
  var fsOut
  //fiIn=escInQ(fiIn)
  if(NL_OS=='Linux' || NL_OS=='Darwin') {
    var fiInEsc=escBashChar(fiIn);  // Note quote surrounded paths doesn't work with realpath !!!
    var arrCommand=['realpath -s', fiInEsc];
    var strCommand=arrCommand.join(' ');
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) {debugger; return [Error(stdErr)]};
    fsOut=stdOut.trim()
  } else if(NL_OS=='Windows') {
    var regRoot=new RegExp(`^[A-Za-z]:`)
    var boRoot=regRoot.test(fiIn)
    if(boRoot) fsOut=fiIn;
    else fsOut=NL_CWD+charF+fiIn;
    return [null, fsOut]
    //var arrCommand=[`Resolve-Path(${fiIn})`];
  }
  else return [Error(`unknown NL_OS ${NL_OS}`)]
  return [null, fsOut];
}

// var isFolderEmpty=async function(fiDir){ // Doesn't appear to be used (could be removed ?!?)
//   fiDir=escInQ(fiDir)
//   var strCommand=`find ${fiDir} -maxdepth 0 -empty`
//   var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
//   if(err) { debugger; return [err];}
//   var {exitCode, pid, stdErr, stdOut}=objT;
//   if(exitCode) {debugger; return [Error(stdErr)]};
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
      if(err.code=="NE_FS_NOPATHE") {FsDirMissing.push(fsDir); fsDir=dirname(fsDir);} else {debugger; return [err]; }
    } else { break; }
  }

  for(var i=FsDirMissing.length-1; i>=0; i--){
    var fsDir=FsDirMissing[i]
    var [err, result]=await Neutralino.filesystem.createDirectory(fsDir).toNBP(); if(err) {debugger; return [err]; }
  }

  return [null]
}

////////////////////////////////////////////////////////////
// Higher level fs interfaces
////////////////////////////////////////////////////////////

var fsMoveWrapper=async function(fsSource, fsDest){  // Neutralinojs 5.0.0 stops supporting moveFile.
  if(Neutralino.filesystem.move){
    var [err, result]=await Neutralino.filesystem.move(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
  }else{
    var [err, result]=await Neutralino.filesystem.moveFile(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
  }
  return [err, result]
}

/*****************************************************************
 * renameFiles (or folders)
 *****************************************************************/
var renameFiles=async function(fsDir, arrRename){
  var arrTmpName=[]
  for(var row of arrRename){    // Rename to temporary names
    var {strNew, strOld}=row
    var fsOld=fsDir+charF+strOld, fsNew=fsDir+charF+strNew, fsTmp=fsNew+'_'+myUUID()
    var fsPar=dirname(fsNew);
    arrTmpName.push(fsTmp)

    //var fsPar='/home/magnus/progPython/buvt-TargetFs/Target/progBlahh'
    var [err]=await createDirectoryWAncestors(fsPar); if(err) {debugger; return [err];}
    
    var [err, result]=await fsMoveWrapper(fsOld, fsTmp); if(err) {debugger; return [err];}
  }
  for(var i in arrRename){    // Rename to final names
    var row=arrRename[i]
    var fsTmp=arrTmpName[i]
    var fsNew=fsDir+charF+row.strNew

    var [err, result]=await fsMoveWrapper(fsTmp, fsNew); if(err) {debugger; return [err];}
  }
  return [null]
}


var myRmFiles=async function(FsName){ //, fsDir
  // Todo: possibly use Neutralino.filesystem.removeFile instead.
  if(FsName.length){
    var arrCommand
    switch(NL_OS){
      case('Linux'): arrCommand=['rm', '-f']; break;
      case('Darwin'): arrCommand=['rm', '-f']; break;
      case('Windows'): arrCommand=['del']; break;
      default: return [Error(`NL_OS (${NL_OS}) is not recognized`)]
    }
    for(var fsName of FsName){
      //var fsName=fsDir+charF+row.strName
      var fsNameEsc=escInQ(fsName);
      arrCommand.push(fsNameEsc)
    }
    var strCommand=arrCommand.join(' ');
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [Error(stdErr)]; };
  }
  return [null]
}
var myRmFolders=async function(FsName){  //, fsDir
  // Todo: possibly use Neutralino.filesystem.removeDirectory instead.
  if(FsName.length){
    var arr=['rmdir']
    for(var fsName of FsName){
      //var fsName=fsDir+charF+row.strName
      var fsNameEsc=escInQ(fsName);
      arr.push(fsNameEsc)
    }
    var strCommand=arr.join(' ');
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [Error(stdErr)]; };
  }
  return [null]
}

var myMkFolders=async function(FsName){ //, fsDir
  // Todo: possibly use Neutralino.filesystem.... instead.
  if(FsName.length){
    var arr=['mkdir']
    //if(strOSType=='linux' || strOSType=='linux')
    if(NL_OS=='Linux' || NL_OS=='Darwin') arr.push('-p')
    for(var fsName of FsName){
      //var fsName=fsDir+charF+strEntry
      var fsNameEsc=escInQ(fsName);
      arr.push(fsNameEsc)
    }
    var strCommand=arr.join(' ');
    var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    if(err) { debugger; return [err];}
    var {exitCode, pid, stdErr, stdOut}=objT;
    if(exitCode) { debugger; return [Error(stdErr)]; };
  }
  return [null]
}
var myCopyEntries=async function(FlEntry, fsDirSource, fsDirTarget){
  for(var flEntry of FlEntry){
    var fsSouceName=fsDirSource+charF+flEntry
    var fsTargetName=fsDirTarget+charF+flEntry
    var fsPar=dirname(fsTargetName);

    var [err]=await createDirectoryWAncestors(fsPar); if(err) return [err];

    fsSouceName=escInQ(fsSouceName); fsTargetName=escInQ(fsTargetName);
    if(NL_OS=='Windows'){
      var strCommand=`copy /l ${fsSouceName} ${fsTargetName}`;
      var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
      if(err) { debugger; return [err];}
      var {exitCode, pid, stdErr, stdOut}=objT;
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }else{
      var strCommand=`cp -pP ${fsSouceName} ${fsTargetName}`;
      var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
      if(err) { debugger; return [err];}
      var {exitCode, pid, stdErr, stdOut}=objT;
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }
  }
  return [null]
}

var writeDbFile=async function(arrDB, fsDb){
    // If fsDb exist then rename it
  var [err, objStats]=await myGetStats(fsDb);
  if(err) {
    if(err.message=='noSuch') objStats={}
    else return [err];
  } 
  var boExist=Boolean(objStats),  {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsDbWithCounter]=await calcFileNameWithCounter(fsDb); if(err) return [err];
    // if(!Neutralino.filesystem.move) Neutralino.filesystem.move=Neutralino.filesystem.moveFile
    // var [err, result]=await Neutralino.filesystem.move(fsDb, fsDbWithCounter).toNBP(); if(err) return [err];
    var [err, result]=await fsMoveWrapper(fsDb, fsDbWithCounter); if(err) return [err];
  }

  var StrOut=Array(arrDB.length)
    // Write fsDb
  for(var i in arrDB){
    var row=arrDB[i], {strType, id, strHash, strMTime, size, strName}=row;
    //fo.write('%10s %32s %10s %10s %s\n' %(row.id, row.strHash, Math.floor(row.mtime), row.size, row.strName))
    //var strType=row.boLink?'l':'f';
    //StrOut[i]=`${strType} ${id.myPadStart(10)} ${strHash.padStart(32)} ${mtime.myPadStart(10)}${mtime_ns.myPadStart(9,'0')} ${size.myPadStart(10)} ${strName}`
    StrOut[i]=`${strType} ${id.myPadStart(10)} ${strHash.padStart(32)} ${strMTime} ${size.myPadStart(10)} ${strName}`
  }
  StrOut.unshift('strType id strHash mtime size strName')  //uuid 
  //fo.close();
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(fsDb, strOut).toNBP(); if(err) return [err];
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
    var [err, result]=await fsMoveWrapper(fsHash, fsHashWithCounter); if(err) return [err];
  }

  var StrOut=Array(arrDB.length)
    // Write fsHash
  //var fo=open(fsHash,'w')
  //fo.write('strHash mtime size strName\n')
  for(var i in arrDB){
    var row=arrDB[i]
    //fo.write('%32s %10s %10s %s\n' %(row.strHash, Math.floor(row.mtime), row.size, row.strName))
    StrOut[i]=`${row.strHash.padStart(32)} ${Math.floor(row.mtime_ns64).myPadStart(10)} ${row.size.myPadStart(10)} ${row.strName}`
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




class MyResultWriter{
  constructor(StrStem){
    this.StrStem=StrStem
    this.StrStemWScreen=StrStem.concat('screen') 
    this.StrStemWOSum=StrStem.slice(1)  
    this.myInit()
  }
  myInit(){
    this.Str={}
    for(const strStem of this.StrStemWScreen){
      if(strStem in this.Str) this.Str[strStem].length=0
      else this.Str[strStem]=[]
    }
  }
  getSeeMoreMessage(){
    let StrSeeMoreIn=[]
    for(const strStem of this.StrStemWOSum){
      let Str=this.Str[strStem], fsTmp=FsFile[strStem]
      if(Str.length) StrSeeMoreIn.push(basename(fsTmp))
    }
    var strSeeMore=StrSeeMoreIn.length?"More info in these files: "+StrSeeMoreIn.join(', '):""
    return strSeeMore
  }
  async writeToFile(){
    for(const strStem of this.StrStem){
      let Str=this.Str[strStem], fsTmp=FsFile[strStem]
      if(Str.length) Str.push('') // End every line with a newline
      var strOut=Str.join('\n')
      //var strOut=Str.length?Str.join('\n')+'\n': ""
      var [err]=await Neutralino.filesystem.writeFile(fsTmp, strOut).toNBP(); if(err) return [err];
    }
  }
}

