
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
const realpathP = util.promisify(fs.realpath.native); //Pesumably better for windows
var mv = require('mv');
const mvP = util.promisify(mv); 



gThis.execMy=function(arg, options, cbData=null){
  try{
    var sp = spawn(arg[0], arg.slice(1), options);
  }catch(err){
    debugger
    myConsole.error(err)
  }
  var arrData=[], arrErr=[]
  sp.stdout.on('data', (data) => {
    if(cbData) cbData(data);
    //else arrData.push(data.toString());
    else arrData.push(data);
  });
  
  sp.stderr.on('data', (data) => {
    arrErr.push(data);
  });
  
  // sp.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  var p=new Promise((resolve, _) => {
    sp.on('close', (code) => {
      var exitCode=code;
      var stdErr=arrErr.join('');
      //var stdOut=arrData.join('')
      var buf = Buffer.concat(arrData), stdOut=buf.toString()
      var buf = Buffer.concat(arrErr), stdErr=buf.toString()
      resolve([exitCode, stdErr, stdOut])
    });
  })
  return p
}
gThis.execMy1=async function(strArg){
  var [err, objT]=await exec(strArg).toNBP();
  var {stdout, stderr}=objT
  return [stderr, stdout]
}

//
// Storage
//


class MyStorage{
  constructor(fsFile){ 
    this.fsFile=fsFile;
  }
  async readFrFile(){
    var [err, strData]=await readStrFile(this.fsFile);
    if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
    strData=strData.trim()
    var objData
    if(strData.length) objData=JSON.parse(strData)
    else objData={}
    //objData=copyDeep(objData);
    return [null, objData]
  }
  async syncFileToCache(){
    if(!('cache' in this)) {
      var [err, objData]=await this.readFrFile(); if(err) {debugger; return [err];}
      this.cache=objData
    }
    return [null]
  }
  async getItem(name){
    var [err]=await this.syncFileToCache(); if(err) {debugger; return [err];}
    var val=this.cache[name]
    //this.abc={a:[{a:""}]}
    return [null, val]
  }
  async setItemPre(name,value){
    var [err]=await this.syncFileToCache(); if(err) {debugger; return [err];}
    //if(typeof value=='undefined') value=null;
    this.cache[name]=value
    return [null]
  }
  async setItemFin(){
    var strT=JSON.stringify(this.cache, null, 2)
    var [err]=await writeFile(this.fsFile, strT); if(err) {debugger; return [err];}
    return [null]
  }
  async setItem(name,value){
    var [err]=await this.setItemPre(name,value); if(err) {debugger; return [err];}
    var [err]=await this.setItemFin(); if(err) {debugger; return [err];}
    return [null]
  }

}

module.exports ={MyStorage}

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



gThis.myTouch=async function(fiPath, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(boRemote){
    //var arrCommand=[`ssh`, strHost, `stat`, fiPath]
    var arrCommand=[`ssh`, strHost, `touch`, `${fiPath}`]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
    return [null]
  }else{
    var arrCommand=[`touch`, `${fiPath}`]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
    return [null]
  }
}

gThis.fileExist=async function(fiPath, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(boRemote){
    //var arrCommand=[`ssh`, strHost, `stat`, fiPath]
    var arrCommand=[`ssh`, strHost, `[ ! -e`, `${fiPath}`, `] || echo "1"`]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
    var boExist=stdOut.trim()=="1"
    return [null, boExist]
  }else{
    var [err, stats]=await fs.promises.lstat(fiPath).toNBP();
    if(err){
      if(err.code==STR_ENOENT) return [null, false]
      else{ debugger; return [err];}
    }
    return [null, true]
  }
}

gThis.fileExistArr=async function(FiPath, strHost=null){
  if(typeof FiPath=='string') FiPath=[FiPath]; // Allowing for string entries too
  var l=FiPath.length, BoExist=Array(l)
  for(var i=0;i<l;i++){
    var [err, boExist]=await fileExist(FiPath[i]); if(err) {debugger; return [err];}
    BoExist[i]=boExist;
  }
  return [null, BoExist]
}
gThis.getModtime_remote=async function(fiPath, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  //var arrCommand=[`ssh`, strHost, `stat`, fiPath]
  var arrCommand=[`ssh`, strHost, `date +%s.%N -r`, fiPath]
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
  if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
  stdOut=stdOut.trim()
  return [null, stdOut]
}



gThis.readFile=async function(){
  var [err, buf]=await fs.promises.readFile(...arguments).toNBP(); if(err) {debugger; return [err];}
  return [err, buf]
}
gThis.readStrFile=async function(){
  var [err, buf]=await fs.promises.readFile(...arguments).toNBP(); if(err) { return [err];}
  return [err, buf.toString()]
}
gThis.writeFile=async function(path, data){
  var [err]=await fs.promises.writeFile(path, data).toNBP();
  return [err]
}
gThis.getStats=async function(path){ // never used
  var [err, stats]=await fs.promises.lstat(path).toNBP(); if(err) {debugger; return [err];}  // Only millisecond resolution
  return [err, stats]
}
gThis.mkdir=async function(){
  var [err]=await fs.promises.mkdir(...arguments).toNBP();
  return [err]
}
// gThis.removeFile=async function(path){
//   var [err]=await fs.promises.unlink(path).toNBP();
//   return [err]
// }
// gThis.readdir=async function(path){
//   var [err, files]=await fs.promises.readdir(path).toNBP(); if(err) {debugger; return [err];}
//   return [err, files]
// }

var readStrFileWHost=async function(fsFile, strHost='localhost'){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';

  if(boRemote){
      // Fetch remote file
    var fsFileTmp=PathLoose.remoteFileLocally.fsName;
    var arrCommand=['scp', strHost+':'+fsFile, fsFileTmp]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    if(stdErr) { 
      if(stdErr.indexOf('No such file or directory') ){ return [null, "", false]; }
      else {debugger; return [stdErr];}
    }
    else if(exitCode) { debugger; return [Error(stdErr)]; };

    setMess(`Reading file`, null, true)
    var [err, strData]=await readStrFile(fsFileTmp);
    if(err){    if(err.code==STR_ENOENT){ return [null, "", false]}
    else{ debugger; return [err]}    }

  }else{
    setMess(`Reading file`, null, true)
    var [err, strData]=await readStrFile(fsFile);
    if(err){    if(err.code==STR_ENOENT){ return [null, "", false]}
    else{ debugger; return [err]}    }
  }

  return [null, strData, true]; // [err, strData, boFileExist]
}

  // Note! Only 6-decimal resolution (the least significant figures of fs.promises.lstat can not be trusted)
// gThis.myGetStats_js=async function(fsFile){ //_nodejs
//   var [err, stats]=await fs.promises.lstat(fsFile).toNBP();
//   if(err){
//     if(err.code==STR_ENOENT) return [null, false];
//     else{ debugger; return [err];}
//   }
//   return [null, stats]
// }
  // Note! Only 6-decimal resolution (the least significant figures of fs.promises.lstat can not be trusted)
gThis.myGetStats_js=async function(fsFile){
  var [err, stats]=await fs.promises.lstat(fsFile, {bigint:true}).toNBP(); if(err) {return [err];} //debugger; 
  var {mtimeNs:mtime_ns64, size, ino:id}=stats

  var boLink=stats.isSymbolicLink(), boFile=stats.isFile(), boDir=stats.isDirectory()
  var objOut={boDir, boFile, id, mtime_ns64, size:Number(size)}
  return [null, objOut]
}

gThis.myGetStats_python=async function(fsFile){
  //var arrCommand=['python', fsBuvtPyScriptMain, 'singleFile', fsFile]; debugger
  //var arrCommand=['python', fsBuvtPyScriptLocal, 'singleFile', fsFile]; debugger
  var arrCommand=['python', interfacePython.fsScriptLocal, 'singleFile', fsFile]; debugger
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; } 
  //if(!boExist) return [Error('noSuch')]
  var StrM=stdOut.trim().split(' ');
  var [strErr, boFile, boDir, id, mtime_ns64, size]=StrM
  if(strErr=='noSuch') return [Error('noSuch')]
  var objOut={boDir:Boolean(boDir), boFile:Boolean(boFile), id, mtime_ns64:BigInt(mtime_ns64), size:Number(size)}
  return [null, objOut]
}

gThis.myGetStats=async function(fsFile){
  // var fsFileEsc=escInQ(fsFile)
  //if(strOS=='win32'){
  if(1){
    var [err, objOut]=await myGetStats_js(); return [err, objOut]
    //var [err, objOut]=await myGetStats_python(); return [err, objOut]; 
  }else{
    var arrCommand=['stat', '--format=%i %.Y %f %s', fsFile];
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    var [err, boExist]=await fileExist(filenameT); if(err) {debugger; return [err];}
    if(boExist) counter++;
    else return [null, filenameT];
  }
}

  // Other apis for stat:
  // Neutralino.filesystem.getStats: seconds with 3 decimal resolution, no id
  // fs.stat: seconds with 7 decimal resolution
  // What meta data:  filename, id, type (file, directory or link), size, mtime 

  // This version of myStatsOfDirContent doesn't work if strPar only has hidden files. 
var myStatsOfDirContent_stat=async function(strPar='.'){  // Not used
  var lenPar=strPar.length
  var StrPrefix=["", "."], arrStrRow=Array(2)
  strPar=escBashChar(strPar)
  for(var i in StrPrefix){
    var strPrefix=StrPrefix[i]
    var arrCommand=[`stat`, `--format=%i %.Y %f %s@%n`, `${strPar}/${strPrefix}*`];
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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

var myStatsOfDirContent_ls=async function(strPar='.'){  // Not used
  if(strPar=='/home/magnus/progPython/buvt-SourceFs/Source/Downloads/backup') debugger
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  // var strParEsc=escInQ(strPar)
  var arrCommand=['ls', '-lAigoQU', '--time-style=+"%s.%N"', '--color=never', strPar];
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    ObjRow[i]={boDir, boFile, boSym, name, id, mtime_ns64, size}
  }
  return [null, ObjRow];
}

var myStatsOfDirContent_c=async function(strPar='.'){
  //if(strPar=='/home/magnus/progPython/buvt-SourceFs/Source/Downloads/backup') debugger
  var strCmd='/home/magnus/progC/0NT/20230414ListFolder/main'
  // var strParEsc=escInQ(strPar)
  var arrCommand=[strCmd, strPar]
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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


  // fs.realpath:
  //   On Linux one can't disable resolving of links
  //   On Windows it resolves with an error "ENOENT" when used on links. fs.realpath as well as fs.realpath.native
var myRealPath=async function(fiIn, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(strOS=='win32' && boRemote) {debugger; return [Error('On windows only local access is allowed')];}
  var fsOut
  //if(typeof fiIn!='string')
  //fiIn=escInQ(fiIn)
  if(strOS=='win32') {
    var [err, fsOut]=await realpathP(fiIn).toNBP(); // realpathP: Promisify on fs.realpath.native
    if(err){
      if(err.code=='ENOENT') {
        var regRoot=new RegExp(`^[A-Za-z]:`)
        var boRoot=regRoot.test(fiIn)
        if(boRoot) fsOut=fiIn;
        else fsOut=process.cwd()+charF+fiIn;
        return [null, fsOut]
      }
      else {debugger; return[err];}
    }
  }else {
    var fiInEsc=escBashChar(fiIn);  // Note if the path has (single/double) quotes surrounding it then "~" is not resolved  !!!
    // //var arrCommand=['readlink --canonicalize', fiInEsc];
    var arrCommand=['realpath', '-s', fiInEsc];
    if(boRemote) { arrCommand.unshift('ssh', strHost) }
    var strCommand=arrCommand.join(' ');
      // execMy(arrCommand) doesn't resolve "~" correctly !!!
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    var {stdout:stdOut, stderr:stdErr}=objT;   if(stdErr) { debugger; return [Error(stdErr)];}
    //var [stdErr, stdOut]=await execMy1(strCommand);   if(stdErr) { debugger; return [Error(stdErr)];}
    //var arrCommand=['realpath', '-s', fiIn];
    //var [exitCode, stdErr, stdOut]=await execMy(arrCommand); // <-- This doesn't resolve "~" correctly
    //var objT=await exec(strCommand), {stdout:stdOut, stderr:stdErr}=objT;   if(stdErr) { debugger; return [Error(stdErr)];}
    //if(exitCode) {debugger; return [Error(stdErr)]};
    fsOut=stdOut.trim()
  } 
  return [null, fsOut];
}

var myRealPathArr=async function(FiEntry, strHost=null){ // Not used
  if(typeof FiEntry=='string') FiEntry=[FiEntry]; // Allowing for string entries too
  var l=FiEntry.length, FsEntry=Array(l)
  for(var i=0;i<l;i++){
    var [err, fsT]=await myRealPath(FiEntry[i], strHost); if(err) {debugger; return [err];}
    FsEntry[i]=fsT;
  }
  return [null, FsEntry]
}

////////////////////////////////////////////////////////////
// Higher level fs interfaces
////////////////////////////////////////////////////////////

var fsMoveWrapper=async function(fsSource, fsDest, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(boRemote){
    var arrCommand=[`ssh`, strHost, `mv`, fsSource, fsDest]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
  }else{
    //var [err, result]=await fs.promises.rename(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
    //var [err, result]=await mvP(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}  // does not  preserve timestamp
    var arrCommand=[`mv`, fsSource, fsDest]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
  }
  return [null]
}




//var copyLocally=async function(fsDir, arrS, arrT, strHost=null, boViaTmpName=false){
var copyLocally=async function(fsDir, arrPair, strHost=null, boViaTmpName=false){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(arrPair.length==0) return [null, []];
  var Str=[]
  for(var i in arrPair){
    Str.push(`MatchingData ${i}`);
    var [rowS,rowT]=arrPair[i];
    var {strName, mtime_ns64}=rowS, fsS=fsDir+charF+strName;   Str.push(`  S ${mtime_ns64} ${fsS}`);
    var {strName, mtime_ns64}=rowT, fsT=fsDir+charF+strName;   Str.push(`  T ${mtime_ns64} ${fsT}`);
  }

  var strHeadT=`string string string`, strHead=`strSide mtimeNs strName`;   Str.unshift(strHeadT, strHead);

  var {fsScriptRemote, fsArgRemote}=interfacePython
  var [err]=await writeFileRemote(fsArgRemote, Str.join('\n'), strHost); if(err) {debugger; return [err];}

  // const fsArg=FsResultFile['arg']
  // var [err]=await writeFile(fsArg, Str.join('\n')); if(err) {debugger; return [err];}
  
  // var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
  // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  // if(exitCode) { debugger; return [Error(stdErr)]; };


  var arrData=[], nReceivedTot=0, nTot=arrPair.length;
  var cbData=function(data){
    data=data.toString(); // This should be fine since no multibyte data is expected
    var n=data.split('\n').length-1;  nReceivedTot+=n
    arrData.push(data);
    //term.write(data);
    term.writeln(`${nReceivedTot}/${nTot}`)
  }

  var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'copyLocally', "--fiDir", fsDir, "--fiFile", fsArgRemote]
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; }; 

  var stdOut=arrData.join('').trim()
  if(stdOut.length==0) return [null, []];
  var StrO=stdOut.split('\n');

  return [null, StrO]
}



var extractDir=function(StrName){
  var n=StrName.length;
    // Create parent folders and FsNew
  var objFlDir={}
  for(var i=0;i<n;i++){
    var strName=StrName[i];
    while(1){
      var strName=dirname(strName);
      if(strName.length==0) break
      objFlDir[strName]=true
    }
  }
  var FlDir=Object.keys(objFlDir)
  return FlDir
}


var extractDirToBeCreated=function(FsFile){
  var n=FsFile.length;
    // Create parent folders and FsNew
  var objFsDir={}
  for(var i=0;i<n;i++){
    var fsFile=FsFile[i]
    var fsPar=dirname(fsFile);
    if(fsPar) objFsDir[fsPar]=true
  }
  var FsDir=Object.keys(objFsDir)
  return FsDir
}


/*****************************************************************
 * renameFiles (or folders)
 *****************************************************************/
var renameFiles=async function(arrRename, strHost=null, boViaTmpName=false){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  var n=arrRename.length;
  if(n==0) return [null]
  var FsNew=Array(n);
  for(var i=0;i<n;i++){
    var row=arrRename[i], {fsNew, fsOld}=row; FsNew[i]=fsNew;
  }
  var FsDir=extractDirToBeCreated(FsNew)
  // FsDir.sort()


  var [err, result]=await myMkFolders(FsDir, strHost); if(err) {debugger; return [err];}

  //if(boRemote) {
  if(1) {
    var Str=Array(3*n)
    for(var i=0;i<n;i++){
      var {fsNew, fsOld}=arrRename[i];
      Str[3*i]="MatchingData"
      Str[3*i+1]=fsOld
      Str[3*i+2]=fsNew
    }
    Str.unshift('string', 'strName')

    var {fsScriptRemote, fsArgRemote}=interfacePython
    var [err]=await writeFileRemote(fsArgRemote, Str.join('\n'), strHost); if(err) {debugger; return [err];}

    // const fsArg=FsResultFile['arg']
    // var [err]=await writeFile(fsArg, Str.join('\n')); if(err) {debugger; return [err];}
    
    // var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    // if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'renameFiles', "--fiFile", fsArgRemote]
    if(boViaTmpName) arrCommand.push("--boViaTmpName", "true")
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

  }else {
      // Rename to temporary names
    var arrTmpName=Array(n)
    if(boViaTmpName){
      for(var i in arrRename){  
        var {fsNew, fsOld}=arrRename[i], fsTmp=fsNew+'_'+myUUID()
        arrTmpName[i]=fsTmp
        var [err, result]=await fsMoveWrapper(fsOld, fsTmp, strHost); if(err) {debugger; return [err];}
      }
    }else { 
      for(var i in arrRename){   var {fsNew, fsOld}=arrRename[i]; arrTmpName[i]=fsOld;  }
    }
      // Rename to final names
    for(var i in arrRename){
      var {fsNew, fsOld}=arrRename[i], fsTmp=arrTmpName[i]
      var [err, result]=await fsMoveWrapper(fsTmp, fsNew, strHost); if(err) {debugger; return [err];}
    }
  }

  return [null]
}


/*****************************************************************
 * setMTime
 *****************************************************************/
var setMTime=async function(arrFile, fsDir, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';

  var StrData=arrFile.map(row=>`${row.mtime_ns64} ${row.strName}`)
  StrData.unshift('mtimeNs strName')

    // Write argumets to fsArg
  const fsArg=PathLoose.arg.fsName
  var [err]=await writeFile(fsArg, StrData.join('\n')); if(err) {debugger; return [err];}

  var {fsScriptLocal, fsScriptRemote, fsArgRemote}=interfacePython

  if(boRemote) { 
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    //var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'setMTime', "--fiFile", fsArgRemote];
    var fsScriptTmp=fsScriptRemote, fsArgTmp=fsArgRemote
  }else{  
    //var arrCommand=['python', fsScriptLocal, 'setMTime', "--fiFile", fsArg];
    var fsScriptTmp=fsScriptLocal, fsArgTmp=fsArg
  }

  var arrCommand=['python', fsScriptTmp, 'setMTime', "--fiFile", fsArgTmp];
  if(boRemote) {arrCommand.unshift('ssh', strHost);}
  arrCommand.push("--fiDir", fsDir)

  var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };


  return [null]
}


var writeFileRemote=async function(fsName, strData, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(boRemote){
    const fsTmp=PathLoose.tmp.fsName
    var [err]=await writeFile(fsTmp, strData); if(err) {debugger; return [err];}
  
    var {fsScriptRemote, fsArgRemote}=interfacePython
    
    var arrCommand=['scp', '-p', fsTmp, strHost+':'+fsName]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  }else{
    var [err]=await writeFile(fsName, strData); if(err) {debugger; return [err];}
  }
  return [null]
}


var myRmFiles=async function(FsName, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  // Todo: possibly use fs.promises.unlink instead.
  if(FsName.length==0) return [null]

  if(boRemote) { 
    var {fsScriptRemote, fsArgRemote}=interfacePython
    var [err]=await writeFileRemote(fsArgRemote, FsName.join('\n'), strHost); if(err) {debugger; return [err];}
    ////const fsArg=FsResultFile['arg']
    //const fsArg=PathLoose.arg.fsName
    //var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
    // var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    // if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'rmFiles', "--fiFile", fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    if(strOS=='win32'){
      var objOpt={shell:true};
      for(var fsName of FsName){
        var arrCommand=['del', fsName]
        var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt);   if(stdErr) { debugger; return [stdErr];}
        if(exitCode) { debugger; return [Error(stdErr)]; };
      }
    }else{
      var arrCommand=['rm', '-f']
      for(var fsName of FsName){ arrCommand.push(fsName); }
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }
  }
  return [null]
}

var myRmFolders=async function(FsName, strHost=null){  
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  if(FsName.length==0) return [null]
  if(boRemote) {

    var {fsScriptRemote, fsArgRemote}=interfacePython
    var [err]=await writeFileRemote(fsArgRemote, FsName.join('\n'), strHost); if(err) {debugger; return [err];}

    // const fsArg=FsResultFile['arg']
    // var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
  
    // var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    // if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'rmFolders', "--fiFile", fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    if(strOS=='win32'){
      var objOpt={shell:true};
      for(var fsName of FsName){
        var arrCommand=['rmdir', fsName]
        var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt);   if(stdErr) { debugger; return [stdErr];}
        if(exitCode) { debugger; return [Error(stdErr)]; };
      }
    }else{
      var arrCommand=['rmdir']
      if(boRemote) { arrCommand.unshift('ssh', strHost) }
      for(var fsName of FsName){ arrCommand.push(fsName); }
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }
  }
  return [null]
}



var myMkFolders=async function(FsName, strHost=null){
  if(!strHost) strHost='localhost';     var boRemote=strHost!='localhost';
  // Todo: possibly use node.js-api instead.
  if(FsName.length==0) return [null]
  if(strOS=='win32' && boRemote) {debugger; return [Error('On windows only local access is allowed')];}

  if(1) { //boRemote
    var {fsScriptRemote, fsArgRemote}=interfacePython
    var [err]=await writeFileRemote(fsArgRemote, FsName.join('\n'), strHost); if(err) {debugger; return [err];}

    // const fsArg=FsResultFile['arg']
    // var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
  
    // var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    // if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'makeFolders', "--fiFile", fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    var arrCommand=['mkdir']
    if(strOS!='win32') arrCommand.push('-p')
      // Note! Using ssh and special characters in the arguments doesn't seem to play well.
    //if(boRemote) { arrCommand.unshift('ssh', strHost) }
    for(var fsName of FsName){ arrCommand.push(fsName); }
    var objOpt=strOS=='win32'?{shell:true}:undefined; 
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
  }
  
  return [null, stdOut]
}

//const copySymlink = require('copy-symlink');
var myCopyEntries=async function(arrEntry, fsSourceDir, fsTargetDataDir, strHost=null){ // Not used
  debugger // Not used since switching to SyncT2TUsingHash
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  myConsole.makeSpaceNSave()
  if(strOS=='win32' && boRemote){debugger; return [Error('On windows only local access is allowed')];}
  if(strOS!='win32' && boRemote){
    var [err, result]=await myCopyEntriesWHost(arrEntry, fsSourceDir, fsTargetDataDir, strHost); if(err) {debugger; return [err];}
    return [null]
  }
  var len=arrEntry.length;  if(len==0) return [null]
  var nCopied=0
  for(var i=0;i<len;i++){
    var entry=arrEntry[i]
    var {strType, strName}=entry
    var fsSouceName=fsSourceDir+charF+strName
    var fsTargetName=fsTargetDataDir+charF+strName
    var fsPar=dirname(fsTargetName);
    myConsole.myReset();
    myConsole.printNL(`${i}/${len}, ${strName}`)

    var [err, result]=await myMkFolders([fsPar], strHost); if(err) {debugger; return [err];}


    //var [err]=await fs.promises.cp(fsSouceName, fsTargetName, {preserveTimestamps:true}).toNBP(); if(err) { debugger; return [err];} // Only copies timestamp with millisecond resolution
    //var [err]=await fs.promises.copyFile(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}  // Doesn't copy timestamp

    // if(strType=='f'){
    //   var [err]=await fs.promises.copyFile(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}
    // }else if(strType=='l'){
    //   var [err]=await copySymlink(fsSouceName, fsTargetName).toNBP(); if(err) { debugger; return [err];}
    // }else{debugger}

    if(strOS=='win32'){  // This "if" might be unnecessary, using shell:true (like below) may work
      //var [err]=await fs.promises.cp(fsSouceName, fsTargetName, {preserveTimestamps:true}).toNBP(); if(err) { debugger; return [err];} // Only copies timestamp with millisecond resolution
      fsSouceName=escInQ(fsSouceName); fsTargetName=escInQ(fsTargetName);
      var arrCommand=[`copy`, `/l`, fsSouceName, fsTargetName]
      // var strCommand=arrCommand.join(' ');
      // var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      // if(exitCode) { debugger; return [Error(stdErr)]; };
      
      var objOpt=strOS=='win32'?{shell:true}:undefined; 
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt); 
      if(stdErr || exitCode) {
        //if(strType=='f') { debugger; return [Error(stdErr)];}
        var strMess=(strType=='l')?`${stdErr} (Symbolic link)`:stdErr
        myConsole.error(strMess);
        myConsole.makeSpaceNSave()
      } else {nCopied++}

      // fsSouceName=escInQ(fsSouceName); fsTargetName=escInQ(fsTargetName);
      // var arrCommand=[`copy`, `/l`, fsSouceName, fsTargetName]
      // var strCommand=arrCommand.join(' ');
      // var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
      
    }else{
      //fsSouceName=escBashChar(fsSouceName); fsTargetName=escBashChar(fsTargetName);
      
      if(boRemote) { var arrCommand=['scp', '-p', fsSouceName, strHost+':'+fsTargetName] }  // Note!!! this will not copy symlinks but instead the target of the symlink
      else{ var arrCommand=[`cp`, `-pP`, fsSouceName, fsTargetName] }
      var objOpt=strOS=='win32'?{shell:true}:undefined; 
      var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt); 
      if(stdErr || exitCode) {
        if(strType=='f') { debugger; return [Error(stdErr)];}
        myConsole.error(stdErr);
        myConsole.makeSpaceNSave()
      } else {nCopied++}

      if(boRemote) {
        var {mtime_ns64}=entry, strMTime=mtime_ns64.toString()
        var strMTimeWDec=strMTime.slice(0,-9)+'.'+strMTime.slice(-9);
        var arrCommand=['ssh', strHost, 'touch', '-d', `'@${strMTimeWDec}'`, fsTargetName] 
        var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
        if(stdErr || exitCode)  { debugger; return [Error(stdErr)];}
      }  
      //var [err]=await fs.promises.cp(fsSouceName, fsTargetName, {preserveTimestamps:true}).toNBP(); if(err) { debugger; return [err];}  // Only copies timestamp with millisecond resolution
    }
  }
  myConsole.myReset();
  var strTmp=`Copied ${nCopied} file${pluralS(nCopied)}`; if(nCopied!=len) strTmp+=`, (${len-nCopied} errors)`
  myConsole.printNL(strTmp)
  return [null]
}

var myCopyEntriesWHost=async function(arrEntry, fsSourceDir, fsTargetDataDir, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  myConsole.makeSpaceNSave()
  if(strOS=='win32' && boRemote) {debugger; return [Error('On windows only local access is allowed')];}
  var len=arrEntry.length;  if(len==0) return [null]
  var Str=Array(len)
  for(var i=0;i<len;i++){
    var entry=arrEntry[i]
    var {strName}=entry
    Str[i]=strName
  }
  const fsList=PathLoose.rsyncTempFile.fsName
  if(Str.length) Str.push('') // End the last line with a newline
  var [err]=await writeFile(fsList, Str.join('\n')); if(err) {debugger; return [err];}
  
  var target=fsTargetDataDir;  if(boRemote) target=strHost+':'+target
  var arrCommand=[`rsync`, `-rtzil`, `--delete`]
  if(boRemote) arrCommand.push(`-e`, `ssh`)
  arrCommand.push(`--files-from=${fsList}`, fsSourceDir, target); //Pv
  var nTot=0;
  var cbData=function(data){
    //data=data.toString(); 
    //var n=data.split('\n').length-1;  nTot+=n
    term.write(data);
  }
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData); 
  if(stdErr || exitCode) {
    //myConsole.error(stdErr);
    //myConsole.makeSpaceNSave();
    debugger
    return [Error(stdErr)]
  } 

  //myConsole.myReset();
  //var strTmp=`myCopyEntriesWHost Done`;  myConsole.printNL(strTmp)
  return [null]
}


var getId=async function(StrName, fsDir, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  var nTot=StrName.length
  if(nTot==0) return [null, []];

  StrName.unshift('strName')

  const fsArg=PathLoose.arg.fsName
  var [err]=await writeFile(fsArg, StrName.join('\n')); if(err) {debugger; return [err];}
  var {fsScriptLocal, fsScriptRemote, fsArgRemote}=interfacePython

  if(boRemote) { 
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'getId', "--fiFile", fsArgRemote];
  }else{  var arrCommand=['python', fsScriptLocal, 'getId', "--fiFile", fsArg]; }
   
  arrCommand.push(...["--fiDir", fsDir])


  var arrData=[], nReceivedTot=0;
  var cbData=function(data){
    data=data.toString(); // This should be fine since no multibyte data is expected
    var n=data.split('\n').length-1;  nReceivedTot+=n
    arrData.push(data);
    //term.write(data);
    term.writeln(`${nReceivedTot}/${nTot}`)
  }
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };
  var stdOut=arrData.join('').trim()
  if(stdOut.length==0) return [null, []];
  var StrO=stdOut.split('\n');

  return [null, StrO]
}



var calcHashes=async function(arrEntry, fsDir, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  var nTot=arrEntry.length
  if(nTot==0) return [null, []];

  var StrData=arrEntry.map(row=>`${row.strType} ${row.strName}`)
  StrData.unshift('strType strName')

  const fsArg=PathLoose.arg.fsName
  var [err]=await writeFile(fsArg, StrData.join('\n')); if(err) {debugger; return [err];}
  var {fsScriptLocal, fsScriptRemote, fsArgRemote}=interfacePython

  if(boRemote) { 
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsArgRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsScriptRemote, 'calcHashes', "--fiFile", fsArgRemote];
  }else{  var arrCommand=['python', fsScriptLocal, 'calcHashes', "--fiFile", fsArg]; }
  arrCommand.push(...["--fiDir", fsDir])


  var arrData=[], nReceivedTot=0;
  var cbData=function(data){
    data=data.toString(); // This should be fine since no multibyte data is expected
    var n=data.split('\n').length-1;  nReceivedTot+=n
    arrData.push(data);
    //term.write(data);
    term.writeln(`${nReceivedTot}/${nTot}`)
  }
  var [exitCode, stdErr, stdOut]=await execMy(arrCommand, undefined, cbData);   if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(stdErr)]; };
  var stdOut=arrData.join('').trim()
  var StrO=stdOut.split('\n');

  // if(!boRemote){ 
  //   if(strOS=='win32'){
  //     var objOpt={shell:true};
  //     for(var fsName of FsName){
  //       var arrCommand=['del', fsName]
  //       var [exitCode, stdErr, stdOut]=await execMy(arrCommand, objOpt);   if(stdErr) { debugger; return [stdErr];}
  //       if(exitCode) { debugger; return [Error(stdErr)]; };
  //     }
  //   }else{
  //     var arrCommand=['rm', '-f']
  //     for(var fsName of FsName){ arrCommand.push(fsName); }
  //     var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
  //     if(exitCode) { debugger; return [Error(stdErr)]; };
  //   }
  // }
  return [null, StrO]
}


var writeDbFile=async function(strData, fsDb){
    // If fsDb exist then rename it
  var boExist=true
  var [err, objStats]=await myGetStats_js(fsDb);
  if(err) {
    if(err.code=='ENOENT') {boExist=false; objStats={};}
    else {debugger; return [err];}
  } 
  var {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsDbWithCounter]=await calcFileNameWithCounter(fsDb); if(err) {debugger; return [err];}
    var [err, result]=await fsMoveWrapper(fsDb, fsDbWithCounter); if(err) {debugger; return [err];}
  }

  var [err]=await writeFile(fsDb, strData); if(err) {debugger; return [err];}
  return [null]
}
var writeDbWrapper=async function(arrData, fsDb, strHost=null){
  if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
  var strData=formatDb(arrData)

  if(boRemote){
    var fsTmp=PathLoose.remoteFileLocally.fsName
    var [err]=await writeDbFile(strData, fsTmp); if(err) { return [err];}
    var arrCommand=['scp', fsTmp, strHost+':'+fsDb]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    if(stdErr) { 
      if(stdErr.indexOf('No such file or directory') ){boDbRemoteExist=false} else {debugger; return [stdErr];}
    }
    else if(exitCode) { debugger; return [Error(stdErr)]; };
  }else{
    var [err]=await writeDbFile(strData, fsDb); if(err) { return [err];}
  }

  return [null]
}


var ArrDb={
    // Extract files that starts with strPrefix.
    // Remaining files are returned in arrRem
    // arrSelected elements are (shallowly) copied from the elements in arrDb (so the can be changed)
    // arrRem elements are NOT copies (So if they are changed, the elements in arrDb are also changed)
  selectWPrefix:function(arrDb, strPrefix=""){
    var arrRem=[],  arrSelected=[], nPrepend=strPrefix.length
    for(var i=0;i<arrDb.length;i++){
      var row=arrDb[i]
      if(row.strName.slice(0,nPrepend)==strPrefix) arrSelected.push(row);
      else{ arrRem.push(row); }
    }
    return [arrSelected, arrRem]
  },
  selectWPrefixArr(arrDb, StrPrefix){ // Select those entries that start by anything in StrPrefix
    var arrRem=arrDb, arrSel=[];
    for(var i=0;i<StrPrefix.length;i++){
      var strPrefix=StrPrefix[i]
      var [arrSel1, arrRem] =ArrDb.selectWPrefix(arrRem, strPrefix)
      arrSel=arrSel.concat(arrSel1)
    }
    return [arrSel, arrRem]
  },
  makeCopy:function(arrDb){
    var arrCopy=[]
    for(var i=0;i<arrDb.length;i++){
      var row=arrDb[i]
      var rowCopy=extend({},row)
      arrCopy.push(rowCopy)
    }
    return arrCopy
  },
  removePrefix:function(arrDb, strPrefix){
    var arrCopy=[], nPrefix=strPrefix.length
    for(var i=0;i<arrDb.length;i++){
      var row=arrDb[i]
      //var rowCopy=copy.copy(row)
      var rowCopy=extend({},row)
      rowCopy.strName=rowCopy.strName.slice(nPrefix)
      arrCopy.push(rowCopy)
    }
    return arrCopy
  },
  selectFrArrDbOld:function(arrDb, strPrefix){  // It might be better if the user uses a boilerplate instead
    var [arrSelected, arrRem] =ArrDb.selectWPrefix(arrDb, strPrefix)
    var arrCopy=ArrDb.makeCopy(arrSelected), arrCopy=ArrDb.removePrefix(arrSelected, strPrefix)
    return [arrCopy, arrRem]
  }
}
// var [arrSelected, arrDbRem] =ArrDb.selectWPrefix(arrDb, flePattern)
// var arrCopy=ArrDb.makeCopy(arrSelected), arrCopy=ArrDb.removePrefix(arrSelected, strPrefix)



class MyWriter{
  constructor(PathFile){
    this.PathFile=PathFile
    this.myInit()
  }
  myInit(){
    this.Str={}
    for(const key in this.PathFile){
      if(key in this.Str) this.Str[key].length=0
      else this.Str[key]=[]
    }
  }
  async writeToFile(){
    for(const key in this.PathFile){
      var {leaf, fsName}=this.PathFile[key]
      let Str=this.Str[key]
      if(Str.length) Str.push('') // End the last line with a newline
      var strOut=Str.join('\n')
      //var strOut=Str.length?Str.join('\n')+'\n': ""
      var [err]=await writeFile(fsName, strOut); if(err) {debugger; return [err];}
    }
    return [null]
  }
}
class MyWriterSingle{
  constructor(pathFile){
    this.pathFile=pathFile
    this.myInit()
  }
  myInit(){
    if('Str' in this) this.Str.length=0; else this.Str=[]
  }
  async writeToFile(){
    var {leaf, fsName}=this.pathFile
    let Str=this.Str
    if(Str.length) Str.push('') // End the last line with a newline
    var strOut=Str.join('\n')
    //var strOut=Str.length?Str.join('\n')+'\n': ""
    var [err]=await writeFile(fsName, strOut); if(err) {debugger; return [err];}
    return [null]
  }
}

//var openInBrowser = require('open');
gThis.openInBrowserF=function(url){
  //Neutralino.os.open(url)
  //openInBrowser(url)
  exec(`${strExec} ${url}`);
}


class InterfacePython{
  constructor(){

  }
  async syncZip(){ // "Re-zip" (Create zip-file) if any of the containing files have been modified.
    var fsBuvtPyScriptF=__dirname+charF+stemBuvtPyScript
    //gThis.wBuvtPyScriptOrg=stemBuvtPyScript+charF+'__main__.py';
    //var fsBuvtPyScriptMain=fsBuvtPyScriptF+charF+'__main__.py'
    //gThis.fsBuvtPyScriptLocal=fsBuvtPyScriptF+charF+stemBuvtPyScript+`.zip`
    this.fsScriptLocal=fsBuvtPyScriptF+charF+stemBuvtPyScript+`.zip`

    //gThis.leafBuvtPyScript=stemBuvtPyScript+'.py'
    //gThis.fsBuvtPyScriptRemote='/tmp/buvtPyScript.py'
    this.fsScriptRemote=`/tmp/${stemBuvtPyScript}.zip`
    this.fsArgRemote=`/tmp/buvtArg.txt`
    //gThis.fsBuvtPyScriptRemote=FsRemote[stemBuvtPyScript]



      // LeafFile / FsFile:  files to include in the zip-file
    //var LeafFile=['lib.py','__main__.py'];
    var LeafFile=['globvar.py', 'lib.py', 'libCheck.py', 'libFs.py', 'libParse.py', '__main__.py', 'settings.py'];
    var l=LeafFile.length, FsFile=Array(l)
    for(var i=0;i<l;i++){ FsFile[i]=fsBuvtPyScriptF+charF+LeafFile[i]; }
    
      // Files to check (compare the modification time of)
    var FsFileToCheck=FsFile.concat(__dirname+charF+'libFs.js'), lToCheck=l+1
    var mtimeMs_latest=0
    for(var i=0;i<lToCheck;i++){
      var [err, stats]=await fs.promises.lstat(FsFileToCheck[i]).toNBP(); if(err) {debugger; return [err];}
      var {mtime, mtimeMs}=stats
      if(mtimeMs_latest<mtimeMs) mtimeMs_latest=mtimeMs
    }
    extend(this, {mtimeMs_latest})

      // Checking if the zip-file is up to date
    var leafZip=stemBuvtPyScript+'.zip'
    var fsFile=fsBuvtPyScriptF+charF+leafZip
    var [err, stats]=await fs.promises.lstat(fsFile).toNBP();
    if(err){
      if(err.code==STR_ENOENT) var boReZip=true
      else{ debugger; return [err];}
    }else {
      var {mtime, mtimeMs}=stats
      var boReZip=mtimeMs_latest>mtimeMs
    }
    if(!boReZip) return [null, boReZip]
  
    process.chdir(fsBuvtPyScriptF)
    var arrCommand=['zip', leafZip, ...LeafFile];
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);
    process.chdir(__dirname)
    if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(exitCode)]; } 
    return [null, boReZip]
  }

  async uploadZip(strHost=null){
    if(!strHost) strHost='localhost';  var boRemote=strHost!='localhost';
    var {mtimeMs_latest}=this
    //var [err, stdOut]=await getModtime_remote(this.fsScriptRemote, strHost);   if(err) { debugger; return [err];}

      // Get mtime of remote script
    var arrCommand=[`ssh`, strHost, `date +%s.%N -r`, this.fsScriptRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand); 
    if(stdErr || exitCode) {
      if(stdErr.indexOf('No such file')!=-1) var boUpload=true;
      else {debugger; return [Error(stdErr)];}
    }
    var mtimeMsRemote=Number(stdOut.trim())*1000
    var boUpload=mtimeMsRemote<mtimeMs_latest;
    if(!boUpload) return [null, boUpload]; 

    
    //date +%s%N -r b1.txt
      // Load python-script to host
    var arrCommand=['scp', '-p', this.fsScriptLocal, strHost+':'+this.fsScriptRemote]
    var [exitCode, stdErr, stdOut]=await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    return [null, boUpload]
  }
}



