
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


const fs = require( 'fs' );
const {spawn}=require('node:child_process')
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);




gThis.execMy=function(arg){
  var sp = spawn(arg[0], arg.slice(1));
  var arrData=[], arrErr=[]
  sp.stdout.on('data', (data) => {
    arrData.push(data.toString());
  });
  
  sp.stderr.on('data', (data) => {
    arrErr.push(data.toString());
  });
  
  // sp.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  var p=new Promise((resolve, _) => {
    sp.on('close', (code) => {
      var exitCode=code, stdOut=arrData.join(''), stdErr=arrErr.join('')
      resolve([exitCode, stdErr, stdOut])
    });
  })
  return p
}
gThis.execMy1=async function(strArg){
  var objT=await exec(strArg);
  var {stdout, stderr}=objT
  return [stderr, stdout]
}

//
// Storage
//

// gThis.getItemN=async function(name){
//   var [err,val]=await Neutralino.storage.getData(name).toNBP();   
//   if(err && err.code=="NE_ST_NOSTKEX") val=null
//   if(val!==null) val=JSON.parse(val);  return val;
// }
// gThis.setItemN=async function(name,value){
//   if(typeof value=='undefined') value=null;
//   await Neutralino.storage.setData(name, JSON.stringify(value));
// }

class MyStorage{
  constructor(fsFile){ 
    this.fsFile=fsFile;
  }
  async readFrFile(){
    var [err, strData] = await readStrFile(this.fsFile);
    if(err){
      if(err.code==STR_ENOENT) {  return [null, {}]}  //STR_NE_FS_FILRDER
      else{ debugger; return [err];}
    }
    strData=strData.trim()
    var objData=JSON.parse(strData)
    //objData=copyDeep(objData);
    return [null, objData]
  }
  async getItem(name){
    if(!('cache' in this)) {
      var [err, objData]=await this.readFrFile(); if(err) return [err];
      this.cache=objData
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
      var [err, objData]=await this.readFrFile(); if(err) return [err];
      this.cache=objData
    }
    //if(typeof value=='undefined') value=null;
    this.cache[name]=value
    var strT=JSON.stringify(this.cache, null, 2)
    var [err]=await writeFile(this.fsFile, strT); if(err) return [err];
    return [null]
  }

}



gThis.checkPathFormat=function(arr){
  var boFWDSlash=false, charFWDSlash='/'; 
  for(var row of arr){
    if(row.strName.indexOf(charFWDSlash)!=-1) {boFWDSlash=true; break}  
  }
  if(boFWDSlash) return 'linux'; // If a forward slash is found, then assume linux
  return 'win32';
}

gThis.dirname=function(fl){
  var ind=fl.lastIndexOf(charF);
  if(ind==-1) return "";
  else return fl.slice(0, ind)
}
gThis.basename=function(fl){
  var ind=fl.lastIndexOf(charF);
  if(ind==-1) return fl;
  else return fl.slice(ind+1)
}

//const NE_FS_NOPATHE="NE_FS_NOPATHE"
const STR_ENOENT="ENOENT"




// gThis.fileExist=async function(fsFile){
//   var [err, stats] = await fs.promises.stat(fsFile).toNBP();
//   if(err){
//     if(err.code==STR_ENOENT) return [null, false]  //STR_NE_FS_NOPATHE
//     else{ debugger; return [err];}
//   }
//   return [null, true]
// }
gThis.fileExist = async function(path){
  try{const stats=await fs.promises.stat(path)}
  catch(err){
    if(err.code==STR_ENOENT) return [null, false]  //STR_NE_FS_NOPATHE
    else{ debugger; return [err];}
  };
  return [null, true]
}  

gThis.readFile = async function(){
  //var [err, buf] = await Neutralino.filesystem.readFile(path).toNBP();
  var [err, buf] = await fs.promises.readFile(...arguments).toNBP(); if(err) return [err];
  return [err, buf]
}
gThis.readStrFile = async function(){
  //var [err, buf] = await Neutralino.filesystem.readFile(path).toNBP();
  var [err, buf] = await fs.promises.readFile(...arguments).toNBP(); if(err) return [err];
  return [err, buf.toString()]
}
gThis.writeFile=async function(path, data){
  //var [err]=await Neutralino.filesystem.writeFile(path, data).toNBP();
  var [err]=await fs.promises.writeFile(path, data).toNBP();
  return [err]
}
gThis.getStats=async function(path){
  //var [err]=await Neutralino.filesystem.getStats(path).toNBP();
  var [err, stats]=await fs.promises.stat(path).toNBP(); if(err) return [err];
  return [err, stats]
}
gThis.mkdir=async function(path){
  //var [err]=await Neutralino.filesystem.createDirectory(path).toNBP();
  var [err]=await fs.promises.mkdir(path).toNBP();
  return [err]
}
gThis.removeFile=async function(path){
  //var [err]=await Neutralino.filesystem.removeFile(path).toNBP();
  var [err]=await fs.promises.unlink(path).toNBP();
  return [err]
}
gThis.readdir=async function(path){
  //var [err]=await Neutralino.filesystem.readDirectory(path).toNBP();
  var [err, files]=await fs.promises.readdir(path).toNBP(); if(err) return [err];
  return [err, files]
}




  // Gets: size, boFile, boDir, createdAt, modifiedAt
gThis.myGetStats_neu=async function(fsFile){
  var [err, stats] = await getStats(fsFile);
  debugger
  if(err){
    if(err.code==STR_ENOENT) return [null, false];  //STR_NE_FS_NOPATHE
    else{ debugger; return [err];}
  }
  return [null, stats]
}


gThis.myGetStats=async function(fsFile){
  // var fsFileEsc=escInQ(fsFile)
  if(strOS=='win32'){
    // var arrCommand=['python', fsPyParser, 'singleFile', fsFileEsc];
    // var strCommand=arrCommand.join(' ')
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();  if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    //var arrCommand=['python', fsPyParser, 'singleFile', fsFile];
    var arrCommand=['python', fsPyParserOrg, 'singleFile', fsFile]; debugger
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; } 
    //if(!boExist) return [Error('noSuch')]
    var StrM=stdOut.trim().split(' ');
    var [strErr, boFile, boDir, id, mtime_ns64, size]=StrM
    if(strErr=='noSuch') return [Error('noSuch')]
    var objOut={boDir:Boolean(boDir), boFile:Boolean(boFile), id, mtime_ns64:BigInt(mtime_ns64), size:Number(size)}
    //return [Error('myGetStats for Windows is not supported')];
  }else{
    // var strCommand='stat --format="%i %.Y %f %s" '+fsFile;
    // var arrCommand=['stat', '--format="%i %.Y %f %s"', fsFileEsc];
    // var strCommand=arrCommand.join(' ')
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    var arrCommand=['stat', '--format="%i %.Y %f %s"', fsFile];
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode)  {
      if(stdErr.indexOf('No such')==-1)  {debugger; return [Error(stdErr)];}
      return [Error('noSuch')]
    }
    stdOut=stdOut.trim();
    var StrM=stdOut.split(" ");
    var [id, strTime, mode, size]=StrM;
    var mode=parseInt(mode, 16),  size=Number(size);
    var StrTime=strTime.split(".")
    if(StrTime.length==1) StrTime=strTime.split(",")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    //mtime=Number(mtime); mtime_ns=Number(mtime_ns); debugger // mtime_ns (the string) should be right padded with zeros to the length of 9 before converting to a number.
    var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
    var objOut={boDir, boFile, boSym, id, mtime_ns64, mode, size}
  }
  return [null, objOut];
}


gThis.calcFileNameWithCounter=async function(filename){  // Example "file.pdf" => "file.bak0.pdf"
  var counter = 0
  //filename = "file{}.pdf"
  var ind=filename.lastIndexOf('.')
  var strWOExt=filename.slice(0, ind),  strExt=filename.slice(ind+1)
  while(1){
    //var filenameT=strWOExt+counter+'.'+strExt
    var filenameT=strWOExt+'.bak'+counter+'.'+strExt
    var [err, boExist]=await fileExist(filenameT); if(err) return [err]
    if(boExist) counter++;
    else return [null, filenameT];
  }
}

  // The problem with Neutralino.filesystem.getStats no id, only milliseconds (no nano second resolution)
  // What meta data:  filename, id, type (file, directory or link), size, mtime 

  // This version of myStatsOfDirContent doesn't work if strPar only has hidden files. 
var myStatsOfDirContent_stat=async function(strPar='.'){
  var lenPar=strPar.length
  var StrPrefix=["", "."], arrStrRow=Array(2)
  strPar=escBashChar(strPar)
  for(var i in StrPrefix){
    var strPrefix=StrPrefix[i]
    // var strCommand=`stat --format="%i %.Y %f %s@%n" ${strPar}/${strPrefix}*`;
    var arrCommand=[`stat`, `--format="%i %.Y %f %s@%n"`, `${strPar}/${strPrefix}*`];
    // var strCommand=arrCommand.join(' ')
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();
    // if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    var [id, strTime, mode, size]=StrM;
    var mode=parseInt(mode, 16), size=Number(size);
    var StrTime=strTime.split(".")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
    ObjRow.push({boDir, boFile, boSym, name, id, mtime_ns64, mode, size})
  }
  return [null, ObjRow];
}

//var regString=/"(.*?)(?<!\\)"/g

var myStatsOfDirContent_ls=async function(strPar='.'){
  if(strPar=='/home/magnus/progPython/buvt-SourceFs/Source/Downloads/backup') debugger
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  // var strParEsc=escInQ(strPar)
  // var strCommand=`ls -lAigoQU --time-style=+"%s.%N"  --color=never ${strParEsc}`;
  // var strCommand=arrCommand.join(' ')
  // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  // var {exitCode, pid, stdErr, stdOut}=objT;
  var arrCommand=['ls', '-lAigoQU', '--time-style=+"%s.%N"', '--color=never', strPar];
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    size=Number(size); var type=mode[0]
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

var myStatsOfDirContent_c=async function(strPar='.'){
  //if(strPar=='/home/magnus/progPython/buvt-SourceFs/Source/Downloads/backup') debugger
  var strCmd='/home/magnus/progC/0NT/20230414ListFolder/main'
  // var strParEsc=escInQ(strPar)
  // var strCommand=`${strCmd} ${strParEsc}`;
  // var strCommand=arrCommand.join(' ')
  // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  // var {exitCode, pid, stdErr, stdOut}=objT;
  var arrCommand=[strCmd, strPar]
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    mode=Number(mode); size=Number(size);
    var StrTime=strTime.split(".")
    var strMTimeS=StrTime[0], strMTimeNS=StrTime[1].padEnd('0',9)
    var mtime_ns64=BigInt(strMTimeS+strMTimeNS)
    var boDir=Boolean(mode&S_IFDIR>>12), boSym=Boolean(mode&(S_IFLNK>>12&~(S_IFREG>>12))), boFile=Boolean(mode&S_IFREG>>12) && !boSym
    //var boDir=Boolean(mode==4), boSym=Boolean(mode==10), boFile=Boolean(mode==8) && !boSym
    ObjRow[i]={boDir, boFile, boSym, name, id, mtime_ns64, mode, size}
  }
  return [null, ObjRow];
}





var myRealPath=async function(fiIn){
  var fsOut
  //fiIn=escInQ(fiIn)
  if(strOS=='linux' || strOS=='darwin') {
    var fiInEsc=escBashChar(fiIn);  // Note if the path has (single/double) quotes surrounding it then "~" is not resolved  !!!
    // //var arrCommand=['readlink --canonicalize', fiInEsc];
    var arrCommand=['realpath', '-s', fiInEsc];
    var strCommand=arrCommand.join(' ');
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();  if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    var [stdErr, stdOut] = await execMy1(strCommand);   if(stdErr) { debugger; return [Error(stdErr)];}
    //var objT=await exec(strCommand), {stdout:stdOut, stderr:stdErr}=objT; if(stdErr) { debugger; return [Error(stdErr)];}
    //if(exitCode) {debugger; return [Error(stdErr)]};
    fsOut=stdOut.trim()
  } else if(strOS=='win32') {
    // var regRoot=new RegExp(`^[A-Za-z]:`)
    // var boRoot=regRoot.test(fiIn)
    // if(boRoot) fsOut=fiIn;
    // else fsOut=NL_CWD+charF+fiIn;
    // return [null, fsOut]

    var fsOut=await fs.promises.realpath(fiIn)
  }
  else return [Error(`unknown strOS ${strOS}`)]
  return [null, fsOut];
}
var myRealPathProj=function(fiIn){
  var p=fs.promises.realpath(fiIn).toNBP();
  return p
}

// var isFolderEmpty=async function(fiDir){ // Doesn't appear to be used (could be removed ?!?)
//   fiDir=escInQ(fiDir)
//   //var strCommand=`find ${fiDir} -maxdepth 0 -empty`
//   var arrCommand=[`find`, fiDir, `-maxdepth`, `0`, `-empty`]
//   //var strCommand=arrCommand.join(' ');
//   //var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
//   //var {exitCode, pid, stdErr, stdOut}=objT;
//   var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
//   if(exitCode) {debugger; return [Error(stdErr)]};
//   stdOut=stdOut.trim()
//   var boEmpty=Boolean(stdOut)
//   return [null, boEmpty];
// }



gThis.createDirectoryWAncestors=async function(fsDirT){
  var fsDir=fsDirT;
  var FsDirMissing=[]
  while(1){
    var [err, result]=await getStats(fsDir);
    if(err){
      if(err.code==STR_ENOENT) {FsDirMissing.push(fsDir); fsDir=dirname(fsDir);} else {debugger; return [err]; }  //STR_NE_FS_NOPATHE
    } else { break; }
  }

  for(var i=FsDirMissing.length-1; i>=0; i--){
    var fsDir=FsDirMissing[i]
    var [err, result]=await mkdir(fsDir); if(err) {debugger; return [err]; }
  }

  return [null]
}

////////////////////////////////////////////////////////////
// Higher level fs interfaces
////////////////////////////////////////////////////////////

var fsMoveWrapper=async function(fsSource, fsDest){  // Neutralinojs 5.0.0 stops supporting moveFile.
  // if(Neutralino.filesystem.move){
  //   var [err, result]=await Neutralino.filesystem.move(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
  // }else{
  //   var [err, result]=await Neutralino.filesystem.moveFile(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
  // }
  var [err, result]=await fs.promises.rename(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
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
  if(FsName.length==0) return [null]
  var arrCommand
  switch(strOS){
    case('linux'): arrCommand=['rm', '-f']; break;
    case('darwin'): arrCommand=['rm', '-f']; break;
    case('win32'): arrCommand=['del']; break;
    default: return [Error(`strOS (${strOS}) is not recognized`)]
  }
  if(strOS=='win32'){
    for(var fsName of FsName){
      //var fsName=fsDir+charF+row.strName
      fsName=escInQ(fsName);
      arrCommand.push(fsName)
    }
    var strCommand=arrCommand.join(' ');
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    var [err, objT] = await exec(strCommand).toNBP();   if(err) { debugger; return [err];}
  }else{
    for(var fsName of FsName){
      //var fsName=fsDir+charF+row.strName
      //if(boNeutralino) fsName=escInQ(fsName);
      arrCommand.push(fsName)
    }
    // var strCommand=arrCommand.join(' ');
    // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
    // var {exitCode, pid, stdErr, stdOut}=objT;
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

  }
  return [null]
}
var myRmFolders=async function(FsName){  //, fsDir
  // Todo: possibly use Neutralino.filesystem.removeDirectory instead.
  if(FsName.length==0) return [null]
  var arrCommand=['rmdir']
  for(var fsName of FsName){
    //var fsName=fsDir+charF+row.strName
    //if(boNeutralino) fsName=escInQ(fsName);
    arrCommand.push(fsName)
  }
  // var strCommand=arr.join(' ');
  // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
  // var {exitCode, pid, stdErr, stdOut}=objT;
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };
  
  return [null]
}

var myMkFolders=async function(FsName){ //, fsDir
  // Todo: possibly use Neutralino.filesystem.... instead.
  if(FsName.length==0) return [null]
  var arrCommand=['mkdir']
  //if(strOSType=='linux' || strOSType=='linux')
  if(strOS=='linux' || strOS=='darwin') arrCommand.push('-p')
  for(var fsName of FsName){
    //var fsName=fsDir+charF+strEntry
    //if(boNeutralino) fsName=escInQ(fsName);
    arrCommand.push(fsName)
  }
  // var strCommand=arrCommand.join(' ');
  // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP();  if(err) { debugger; return [err];}
  // var {exitCode, pid, stdErr, stdOut}=objT;
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };
  
  return [null]
}

//const copySymlink = require('copy-symlink');
var myCopyEntries=async function(arrEntry, fsDirSource, fsDirTarget){
  for(var entry of arrEntry){
    var {strType, strName}=entry
    var fsSouceName=fsDirSource+charF+strName
    var fsTargetName=fsDirTarget+charF+strName
    var fsPar=dirname(fsTargetName);

    var [err]=await createDirectoryWAncestors(fsPar); if(err) return [err];

    //var [err]=await fs.promises.cp(fsSouceName, fsTargetName, {preserveTimestamps:true}).toNBP(); if(err) { debugger; return [err];} // Doesn't copy timestamp with nanosecond resolution
    //var [err]=await fs.promises.copyFile(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}  // Doesn't copy timestamp

    // if(strType=='f'){
    //   var [err]=await fs.promises.copyFile(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}
    // }else if(strType=='l'){
    //   var [err]=await copySymlink(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}
    // }else{debugger}

    //if(boNeutralino) {fsSouceName=escInQ(fsSouceName); fsTargetName=escInQ(fsTargetName);}
    if(strOS=='win32'){
      //var strCommand=`copy /l ${fsSouceName} ${fsTargetName}`;
      //var arrCommand=[`copy`, `/l`, fsSouceName, fsTargetName]
      // var strCommand=arrCommand.join(' ');
      // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
      // var {exitCode, pid, stdErr, stdOut}=objT;
      // var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      // if(exitCode) { debugger; return [Error(stdErr)]; };
      
      fsSouceName=escInQ(fsSouceName); fsTargetName=escInQ(fsTargetName);
      var arrCommand=[`copy`, `/l`, fsSouceName, fsTargetName]
      var strCommand=arrCommand.join(' ');
      var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
      
    }else{
      //var strCommand=`cp -pP ${fsSouceName} ${fsTargetName}`;
      var arrCommand=[`cp`, `-pP`, fsSouceName, fsTargetName]
      // var strCommand=arrCommand.join(' ');
      // var [err, objT] = await Neutralino.os.execCommand(strCommand).toNBP(); if(err) { debugger; return [err];}
      // var {exitCode, pid, stdErr, stdOut}=objT;
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; };
      //var [err]=await fs.promises.cp(fsSouceName, fsTargetName, {preserveTimestamps:true}).toNBP(); if(err) { debugger; return [err];}
    }
  }
  return [null]
}

var writeDbFile=async function(arrDb, fsDb){
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

  var nPadId=strOS=='linux'?10:20
  var StrOut=Array(arrDb.length)
    // Write fsDb
  for(var i in arrDb){
    var row=arrDb[i], {strType, id, strHash, strMTime, size, strName}=row;
    if(typeof strMTime=='undefined') strMTime=row.mtime_ns64.toString()
    
    //fo.write('%10s %32s %10s %10s %s\n' %(row.id, row.strHash, Math.floor(row.mtime), row.size, row.strName))
    //var strType=row.boLink?'l':'f';
    //StrOut[i]=`${strType} ${id.myPadStart(10)} ${strHash.padStart(32)} ${mtime.myPadStart(10)}${mtime_ns.myPadStart(9,'0')} ${size.myPadStart(10)} ${strName}`
    StrOut[i]=`${strType} ${id.padStart(nPadId)} ${strHash.padStart(32)} ${strMTime} ${size.myPadStart(10)} ${strName}`
  }
  StrOut.unshift('strType id strHash mtime size strName')  //uuid 
  //fo.close();
  var strOut=StrOut.join('\n')
  var [err]=await writeFile(fsDb, strOut); if(err) return [err];
  return [null]
}

var writeHashFile=async function(arrDb, fsHash){
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

  var StrOut=Array(arrDb.length)
    // Write fsHash
  //var fo=open(fsHash,'w')
  //fo.write('strHash mtime size strName\n')
  for(var i in arrDb){
    var row=arrDb[i]
    //fo.write('%32s %10s %10s %s\n' %(row.strHash, Math.floor(row.mtime), row.size, row.strName))
    StrOut[i]=`${row.strHash.padStart(32)} ${Math.floor(row.mtime_ns64).myPadStart(10)} ${row.size.myPadStart(10)} ${row.strName}`
  }
  var strOut=StrOut.join('\n')
  var [err]=await writeFile(fsHash, strOut); if(err) return [err];
  //fo.close()
  return [null]
}


  // Extract files that starts with flPrepend, remove the flPrepend part and return in arrDbRelevant.
  // Remaining files are returned in arrDbNonRelevant
  // arrDbRelevant elements are (shallowly) copied from the elements in arrDb (so the can be changed)
  // arrDbNonRelevant elements are NOT copies (So if they are changed, the elements in arrDb are also changed)
var selectFrArrDb=function(arrDb, flPrepend){
  var arrDbNonRelevant=[],  arrDbRelevant=[]
  var nPrepend=flPrepend.length
  for(var row of arrDb){
    //var rowCopy=copy.copy(row)
    var rowCopy=extend({},row)
    
    if(row.strName.slice(0,nPrepend)!=flPrepend) arrDbNonRelevant.push(rowCopy)
    else{
      rowCopy.strName=rowCopy.strName.slice(nPrepend)
      //strNameCrop=rowCopy.strName.slice(nPrepend)
      //extend(rowCopy, {"strName":strNameCrop})
      arrDbRelevant.push(rowCopy)
    }
  }
  return [arrDbNonRelevant, arrDbRelevant]
}
// var [arrDbNonRelevant, arrDbRelevant] =selectFrArrDb(arrDb, flPrepend)




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
      var [err]=await writeFile(fsTmp, strOut); if(err) return [err];
    }
  }
}

//var openInBrowser = require('open');
gThis.openInBrowserF=function(url){
  //Neutralino.os.open(url)
  //openInBrowser(url)
  exec(`${strExec} ${url}`);
}