
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
    else arrData.push(data.toString());
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
    var [err, strData] = await readStrFile(this.fsFile);
    if(err){
      if(err.code==STR_ENOENT) { strData="" }  //return [null, {}]
      else{ debugger; return [err];}
    }
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




gThis.fileExist=async function(fiPath, strHost=null){
  if(!strHost){
    var [err, stats] = await fs.promises.lstat(fiPath).toNBP();
    if(err){
      if(err.code==STR_ENOENT) return [null, false]
      else{ debugger; return [err];}
    }
    return [null, true]
  }else{
    //var arrCommand=[`ssh`, strHost, `stat`, fiPath]
    var arrCommand=[`ssh`, strHost, `[ ! -e`, `${fiPath}`, `] || echo "1"`]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
    var boExist=stdOut.trim()=="1"
    return [null, boExist]
  }
}

gThis.readFile = async function(){
  var [err, buf] = await fs.promises.readFile(...arguments).toNBP(); if(err) {debugger; return [err];}
  return [err, buf]
}
gThis.readStrFile = async function(){
  var [err, buf] = await fs.promises.readFile(...arguments).toNBP(); if(err) {debugger; return [err];}
  return [err, buf.toString()]
}
gThis.writeFile=async function(path, data){
  var [err]=await fs.promises.writeFile(path, data).toNBP();
  return [err]
}
gThis.getStats=async function(path){
  var [err, stats]=await fs.promises.lstat(path).toNBP(); if(err) {debugger; return [err];}  // Only millisecond resolution
  return [err, stats]
}
// gThis.mkdir=async function(path){
//   var [err]=await fs.promises.mkdir(path).toNBP();
//   return [err]
// }
// gThis.removeFile=async function(path){
//   var [err]=await fs.promises.unlink(path).toNBP();
//   return [err]
// }
// gThis.readdir=async function(path){
//   var [err, files]=await fs.promises.readdir(path).toNBP(); if(err) {debugger; return [err];}
//   return [err, files]
// }



  // Note! Only 6-decimal resolution (the least significant figures of fs.promises.lstat can not be trusted)
// gThis.myGetStats_js=async function(fsFile){ //_nodejs
//   var [err, stats] = await fs.promises.lstat(fsFile).toNBP();
//   if(err){
//     if(err.code==STR_ENOENT) return [null, false];
//     else{ debugger; return [err];}
//   }
//   return [null, stats]
// }
  // Note! Only 6-decimal resolution (the least significant figures of fs.promises.lstat can not be trusted)
gThis.myGetStats_js=async function(fsFile){
  // var [err, stats] = await fs.promises.lstat(fsFile).toNBP(); if(err) {debugger; return [err];}
  // var {mtime, mtimeMs, size, ino:id}=stats
  // var mtimeMsInt=Math.floor(mtimeMs), mtimeMsFracTmp=mtimeMs-mtimeMsInt; mtimeMsFracTmp=mtimeMsFracTmp*1000; mtimeMsFracTmp=Math.floor(mtimeMsFracTmp)
  // var mtime_ns64=BigInt(mtimeMsInt.toString()+mtimeMsFracTmp.myPad0(3)+'000')

  var [err, stats] = await fs.promises.lstat(fsFile, {bigint:true}).toNBP(); if(err) {debugger; return [err];}
  var {mtimeNs:mtime_ns64, size, ino:id}=stats

  var boLink=stats.isSymbolicLink(), boFile=stats.isFile(), boDir=stats.isDirectory()
  var objOut={boDir, boFile, id, mtime_ns64, size:Number(size)}
  return [null, objOut]
}

gThis.myGetStats_python=async function(fsFile){
  var arrCommand=['python', fsBuvtPyScriptMain, 'singleFile', fsFile]; debugger
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
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
    var [err, objOut] = await myGetStats_js(); return [err, objOut]
    //var [err, objOut] = await myGetStats_python(); return [err, objOut]; 
  }else{
    var arrCommand=['stat', '--format=%i %.Y %f %s', fsFile];
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

var myStatsOfDirContent_ls=async function(strPar='.'){  // Not used
  if(strPar=='/home/magnus/progPython/buvt-SourceFs/Source/Downloads/backup') debugger
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  // var strParEsc=escInQ(strPar)
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


  // fs.realpath:
  //   On Linux one can't disable resolving of links
  //   On Windows it resolves with an error "ENOENT" when used on links. fs.realpath as well as fs.realpath.native
var myRealPath=async function(fiIn, strHost=null){
  if(strOS=='win32' && strHost) {debugger; return [Error('On windows only local access is allowed')];}
  var fsOut
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
    if(strHost) { arrCommand.unshift('ssh', strHost) }
    var strCommand=arrCommand.join(' ');
      // execMy(arrCommand) doesn't resolve "~" correctly !!!
    var [err, objT]=await exec(strCommand).toNBP(); if(err) { debugger; return [err];}
    var {stdout:stdOut, stderr:stdErr}=objT;   if(stdErr) { debugger; return [Error(stdErr)];}
    //var [stdErr, stdOut] = await execMy1(strCommand);   if(stdErr) { debugger; return [Error(stdErr)];}
    //var arrCommand=['realpath', '-s', fiIn];
    //var [exitCode, stdErr, stdOut] = await execMy(arrCommand); // <-- This doesn't resolve "~" correctly
    //var objT=await exec(strCommand), {stdout:stdOut, stderr:stdErr}=objT;   if(stdErr) { debugger; return [Error(stdErr)];}
    //if(exitCode) {debugger; return [Error(stdErr)]};
    fsOut=stdOut.trim()
  } 
  return [null, fsOut];
}

////////////////////////////////////////////////////////////
// Higher level fs interfaces
////////////////////////////////////////////////////////////

var fsMoveWrapper=async function(fsSource, fsDest, strHost=null){
  if(!strHost) {
    var [err, result]=await fs.promises.rename(fsSource, fsDest).toNBP(); if(err) {debugger; return [err];}
    return [err, result]
  }else{
    var arrCommand=[`ssh`, strHost, `mv`, fsSource, fsDest]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand); 
    if(stdErr || exitCode) { debugger; return [Error(stdErr)];}
    return [null]
  }
}

/*****************************************************************
 * renameFiles (or folders)
 *****************************************************************/
var renameFiles=async function(fsDir, arrRename, strHost=null){
  var n=arrRename.length;
  var FsNew=Array(n)
    // Create parent folders and FsNew
  var objFlDir={}
  for(var i=0;i<n;i++){
    var row=arrRename[i], {strNew, strOld}=row;
    var fsNew=fsDir+charF+strNew; FsNew[i]=fsNew
    var flPar=dirname(strNew);
    if(flPar) objFlDir[flPar]=true
  }
  var FlDir=Object.keys(objFlDir), nDir=FlDir.length, FsDir=Array(nDir)
  for(var i=0;i<nDir;i++){
    FsDir[i]=fsDir+charF+FlDir[i]
  }
  //if(!strHost) strHost="localhost"
  var [err, result]=await myMkFolders(FsDir, strHost); if(err) {debugger; return [err];}

  if(strHost) {
    var Str=Array(3*n)
    for(var i=0;i<n;i++){
      var {strNew, strOld}=arrRename[i];
      var fsOld=fsDir+charF+strOld, fsNew=fsDir+charF+strNew
      Str[3*i]="MatchingData"
      Str[3*i+1]=fsOld
      Str[3*i+2]=fsNew
    }
    const fsArg=FsResultFile['arg']
    var [err]=await writeFile(fsArg, Str.join('\n')); if(err) {debugger; return [err];}
    
    var arrCommand=['ssh', strHost, 'mktemp']
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var fsTmp=stdOut.trim()
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'renameFiles', "--fiFile", fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'rm', fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

  }else {
      // Rename to temporary names
    var arrTmpName=Array(n)
    for(var i in arrRename){  
      var {strNew, strOld}=arrRename[i]
      var fsOld=fsDir+charF+strOld, fsNew=fsDir+charF+strNew, fsTmp=fsNew+'_'+myUUID()
      arrTmpName[i]=fsTmp
      var [err, result]=await fsMoveWrapper(fsOld, fsTmp, strHost); if(err) {debugger; return [err];}
    }
      // Rename to final names
    for(var i in arrRename){
      var {strNew, strOld}=arrRename[i], fsTmp=arrTmpName[i]
      var fsNew=fsDir+charF+strNew
      var [err, result]=await fsMoveWrapper(fsTmp, fsNew, strHost); if(err) {debugger; return [err];}
    }
  }

  return [null]
}


var myRmFiles=async function(FsName, strHost=null){ //, fsDir
  // Todo: possibly use fs.promises.unlink instead.
  if(FsName.length==0) return [null]

  if(strHost) { 
    const fsArg=FsResultFile['arg']
    var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
    
    var arrCommand=['ssh', strHost, 'mktemp']
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    var fsTmp=stdOut.trim()
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'rmFiles', "--fiFile", fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'rm', fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    if(strOS=='win32'){
      var arrMore=[{shell:true}];
      for(var fsName of FsName){
        var arrCommand=['del', fsName]
        var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore);   if(stdErr) { debugger; return [stdErr];}
        if(exitCode) { debugger; return [Error(stdErr)]; };
      }
    }else{
      var arrCommand=['rm', '-f']
      for(var fsName of FsName){ arrCommand.push(fsName); }
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }
  }
  return [null]
}

var myRmFolders=async function(FsName, strHost=null){  
  if(FsName.length==0) return [null]
  if(strHost) { 
    const fsArg=FsResultFile['arg']
    var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
    
    var arrCommand=['ssh', strHost, 'mktemp']
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    var fsTmp=stdOut.trim()
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'rmFolders', "--fiFile", fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'rm', fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    if(strOS=='win32'){
      var arrMore=[{shell:true}];
      for(var fsName of FsName){
        var arrCommand=['rmdir', fsName]
        var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore);   if(stdErr) { debugger; return [stdErr];}
        if(exitCode) { debugger; return [Error(stdErr)]; };
      }
    }else{
      var arrCommand=['rmdir']
      if(strHost) { arrCommand.unshift('ssh', strHost) }
      for(var fsName of FsName){ arrCommand.push(fsName); }
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      if(exitCode) { debugger; return [Error(stdErr)]; };
    }
  }
  return [null]
}



var myMkFolders=async function(FsName, strHost=null){ //, fsDir
  // Todo: possibly use node.js-api instead.
  if(FsName.length==0) return [null]
  if(strOS=='win32' && strHost) {debugger; return [Error('On windows only local access is allowed')];}

  if(strHost) { 
    const fsArg=FsResultFile['arg']
    var [err]=await writeFile(fsArg, FsName.join('\n')); if(err) {debugger; return [err];}
    
    var arrCommand=['ssh', strHost, 'mktemp']
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    var fsTmp=stdOut.trim()
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['scp', '-p', fsArg, strHost+':'+fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    var arrCommand=['ssh', strHost, 'python', fsBuvtPyScriptRemote, 'makeFolders', "--fiFile", fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };

    var arrCommand=['ssh', strHost, 'rm', fsTmp]
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
    
  }else {
    var arrCommand=['mkdir']
    if(strOS!='win32') arrCommand.push('-p')
      // Note! Using ssh and special characters in the arguments doesn't seem to play well.
    //if(strHost) { arrCommand.unshift('ssh', strHost) }
    for(var fsName of FsName){ arrCommand.push(fsName); }
    var objOpt=strOS=='win32'?{shell:true}:undefined,  arrMore=[objOpt]; 
    var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore);   if(stdErr) { debugger; return [stdErr];}
    if(exitCode) { debugger; return [Error(stdErr)]; };
  }
  
  return [null]
}

//const copySymlink = require('copy-symlink');
var myCopyEntries=async function(arrEntry, fsDirSource, fsDirTarget, strHost=null){
  myConsole.makeSpaceNSave()
  if(strHost && strOS=='win32'){debugger; return [Error('On windows only local access is allowed')];}
  if(strOS!='win32' && strHost){
    var [err, result]=await myCopyEntriesWHost(arrEntry, fsDirSource, fsDirTarget, strHost); if(err) {debugger; return [err];}
    return [null]
  }
  var len=arrEntry.length;  if(len==0) return [null]
  var nCopied=0
  for(var i=0;i<len;i++){
    var entry=arrEntry[i]
    var {strType, strName}=entry
    var fsSouceName=fsDirSource+charF+strName
    var fsTargetName=fsDirTarget+charF+strName
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
      // var [exitCode, stdErr, stdOut] = await execMy(arrCommand);   if(stdErr) { debugger; return [stdErr];}
      // if(exitCode) { debugger; return [Error(stdErr)]; };
      
      var objOpt=strOS=='win32'?{shell:true}:undefined,  arrMore=[objOpt]; 
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore); 
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
      
      if(strHost) { var arrCommand=['scp', '-p', fsSouceName, strHost+':'+fsTargetName] }  // Note!!! this will not copy symlinks but instead the target of the symlink
      else{ var arrCommand=[`cp`, `-pP`, fsSouceName, fsTargetName] }
      var objOpt=strOS=='win32'?{shell:true}:undefined,  arrMore=[objOpt]; 
      var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore); 
      if(stdErr || exitCode) {
        if(strType=='f') { debugger; return [Error(stdErr)];}
        myConsole.error(stdErr);
        myConsole.makeSpaceNSave()
      } else {nCopied++}

      if(strHost) {
        var {mtime_ns64}=entry, strMTime=mtime_ns64.toString()
        var strMTimeWDec=strMTime.slice(0,-9)+'.'+strMTime.slice(-9);
        var arrCommand=['ssh', strHost, 'touch', '-d', `'@${strMTimeWDec}'`, fsTargetName] 
        var [exitCode, stdErr, stdOut] = await execMy(arrCommand); 
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

var myCopyEntriesWHost=async function(arrEntry, fsDirSource, fsDirTarget, strHost=null){
  myConsole.makeSpaceNSave()
  if(strOS=='win32' && strHost) {debugger; return [Error('On windows only local access is allowed')];}
  var len=arrEntry.length;  if(len==0) return [null]
  var Str=Array(len)
  for(var i=0;i<len;i++){
    var entry=arrEntry[i]
    var {strName}=entry
    Str[i]=strName
  }
  const fsList=FsResultFile['rsyncTempFile']
  if(Str.length) Str.push('') // End the last line with a newline
  var [err]=await writeFile(fsList, Str.join('\n')); if(err) {debugger; return [err];}
  
  var target=fsDirTarget;  if(strHost) target=strHost+':'+target
  var arrCommand=[`rsync`, `-rtzil`, `--delete`]
  if(strHost) arrCommand.push(`-e`, `ssh`)
  arrCommand.push(`--files-from=${fsList}`, fsDirSource, target); //Pv
  var nTot=0;
  var cbData=function(data){
    data=data.toString(); 
    var n=data.split('\n').length-1
    nTot+=n
    //myConsole.myReset(); myConsole.printNL(nTot)
    //myConsole.print(data)
    term.write(data);
  }
  var arrMore=[undefined, cbData];
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand, ...arrMore); 
  if(stdErr || exitCode) {
    myConsole.error(stdErr);
    myConsole.makeSpaceNSave()
  } 

  //myConsole.myReset();
  var strTmp=`myCopyEntriesWHost Done`;  myConsole.printNL(strTmp)
  return [null]
}

var writeDbFile=async function(arrDb, fsDb){
    // If fsDb exist then rename it
  var [err, objStats]=await myGetStats_js(fsDb);
  if(err) {
    if(err.message=='noSuch') objStats={}
    else {debugger; return [err];}
  } 
  var boExist=Boolean(objStats),  {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsDbWithCounter]=await calcFileNameWithCounter(fsDb); if(err) {debugger; return [err];}
    var [err, result]=await fsMoveWrapper(fsDb, fsDbWithCounter); if(err) {debugger; return [err];}
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
  var [err]=await writeFile(fsDb, strOut); if(err) {debugger; return [err];}
  return [null]
}

  // Not really used
var writeHashFile=async function(arrDb, fsHash){
    // If fsHash exist then rename it
  var [err, objStats]=await myGetStats_js(fsHash);
  if(err) {
    if(err.message=='noSuch') objStats={}
    else {debugger; return [err];}
  }
  var boExist=Boolean(objStats),  {boDir=false, boFile=false}=objStats;
  if(boFile){
    var [err, fsHashWithCounter]=await calcFileNameWithCounter(fsHash); if(err) {debugger; return [err];}
    var [err, result]=await fsMoveWrapper(fsHash, fsHashWithCounter); if(err) {debugger; return [err];}
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
  var [err]=await writeFile(fsHash, strOut); if(err) {debugger; return [err];}
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
  constructor(StrResultStem){
    this.StrResultStem=StrResultStem
    this.StrStemWScreen=StrResultStem.concat('screen') 
    this.StrStemWOSum=StrResultStem.slice(1)  
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
      let Str=this.Str[strStem], fsTmp=FsResultFile[strStem]
      if(Str.length) StrSeeMoreIn.push(basename(fsTmp))
    }
    var strSeeMore=StrSeeMoreIn.length?"More info in these files: "+StrSeeMoreIn.join(', '):""
    return strSeeMore
  }
  async writeToFile(){
    for(const strStem of this.StrResultStem){
      let Str=this.Str[strStem], fsTmp=FsResultFile[strStem]
      if(Str.length) Str.push('') // End the last line with a newline
      var strOut=Str.join('\n')
      //var strOut=Str.length?Str.join('\n')+'\n': ""
      var [err]=await writeFile(fsTmp, strOut); if(err) {debugger; return [err];}
    }
  }
}

//var openInBrowser = require('open');
gThis.openInBrowserF=function(url){
  //Neutralino.os.open(url)
  //openInBrowser(url)
  exec(`${strExec} ${url}`);
}



gThis.libPythonSyncZip=async function(){ // "Re-zip" (Create zip-file) if any of the containing files have been modified.
  var fsBuvtPyScriptF=__dirname+charF+stemBuvtPyScript
  //gThis.wBuvtPyScriptOrg=stemBuvtPyScript+charF+'__main__.py';
  gThis.fsBuvtPyScriptMain=fsBuvtPyScriptF+charF+'__main__.py'
  gThis.fsBuvtPyScriptLocal=fsBuvtPyScriptF+charF+stemBuvtPyScript+`.zip`

  //gThis.leafBuvtPyScript=stemBuvtPyScript+'.py'
  //gThis.fsBuvtPyScriptRemote='/tmp/buvtPyScript.py'
  gThis.fsBuvtPyScriptRemote=`/tmp/${stemBuvtPyScript}.zip`

    // LeafFile / FsFile:  files to include in the zip-file
  //var LeafFile=['lib.py','__main__.py'];
  var LeafFile=['globvar.py', 'lib.py', 'libCheck.py', 'libFs.py', 'libParse.py', '__main__.py', 'settings.py'];
  var l=LeafFile.length, FsFile=Array(l)
  for(var i=0;i<l;i++){ FsFile[i]=fsBuvtPyScriptF+charF+LeafFile[i]; }
  
    // Files to check (compare the modification time of)
  var FsFileToCheck=FsFile.concat(__dirname+charF+'libFs.js'), lToCheck=l+1
  var mtime_latest=0
  for(var i=0;i<lToCheck;i++){
    var [err, stats] = await fs.promises.lstat(FsFileToCheck[i]).toNBP(); if(err) {debugger; return [err];}
    var {mtime, mtimeMs}=stats
    if(mtime_latest<mtimeMs) mtime_latest=mtimeMs
  }

    // Checking if the zip-file is up to date
  var leafZip=stemBuvtPyScript+'.zip'
  var fsFile=fsBuvtPyScriptF+charF+leafZip
  var [err, stats] = await fs.promises.lstat(fsFile).toNBP();
  if(err){
    if(err.code==STR_ENOENT) var boReZip=true
    else{ debugger; return [err];}
  }else {
    var {mtime, mtimeMs}=stats
    var boReZip=mtime_latest>mtimeMs
  }
  if(!boReZip) return [null, boReZip]
 
  process.chdir(fsBuvtPyScriptF)
  var arrCommand=['zip', leafZip, ...LeafFile];
  var [exitCode, stdErr, stdOut] = await execMy(arrCommand);
  process.chdir(__dirname)
  if(stdErr) { debugger; return [stdErr];}
  if(exitCode) { debugger; return [Error(exitCode)]; } 
  return [null, boReZip]
}

