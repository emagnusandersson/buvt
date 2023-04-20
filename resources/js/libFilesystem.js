

// The following flags are defined for the st_mode field:
const S_IFMT   =  0170000   // bit mask for the file type bit fields
const S_IFSOCK =  0140000   // socket
const S_IFLNK  =  0120000   // symbolic link
const S_IFREG  =  0100000   // regular file
const S_IFBLK  =  0060000   // block device
const S_IFDIR  =  0040000   // directory
const S_IFCHR  =  0020000   // character device
const S_IFIFO  =  0010000   // FIFO
const S_ISUID  =  0004000   // set UID bit
const S_ISGID  =  0002000   // set-group-ID bit (see below)
const S_ISVTX  =  0001000   // sticky bit (see below)
const S_IRWXU  =  00700     // mask for file owner permissions
const S_IRUSR  =  00400     // owner has read permission
const S_IWUSR  =  00200     // owner has write permission
const S_IXUSR  =  00100     // owner has execute permission
const S_IRWXG  =  00070     // mask for group permissions
const S_IRGRP  =  00040     // group has read permission
const S_IWGRP  =  00020     // group has write permission
const S_IXGRP  =  00010     // group has execute permission
const S_IRWXO  =  00007     // mask for permissions for others (not in group)
const S_IROTH  =  00004     // others have read permission
const S_IWOTH  =  00002     // others have write permission
const S_IXOTH  =  00001     // others have execute permission



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
  debugger
  if(err){
    if(err.code=="NE_FS_NOPATHE") return [null, false]
    else{ debugger; return [err];}
  }
  return [null, true]
}


  // Gets: size, isFile, isDirectory, createdAt, modifiedAt
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
  var [err, objT] = await Neutralino.os.execCommand('stat --format="%i %.Y %f %s@%n" '+fsFile).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode)  return [new Error(stdErr)];
  stdOut=stdOut.trim();
  
  var indAt=stdOut.indexOf('@'), indNameStart=indAt+1;
  var indLeafStart=indNameStart+lenPar+1;
  var name=stdOut.substring(indLeafStart);
  var strMeta=stdOut.substring(0, indAt);
  var StrM=strMeta.split(" ");
  var mode=parseInt(StrM[2], 16);
  var StrTime=StrM[1].split(".")
  var flMtime=Number(StrM[1]), mtime=StrTime[0], mtime_ns=StrTime[1], flMtime_ns=flMtime*1e9
  mtime=Number(mtime); mtime_ns=Number(mtime_ns);
  var boDir=Boolean(mode&S_IFDIR), boSym=Boolean(mode&S_IFLNK&~S_IFREG), boFile=Boolean(mode&S_IFREG) && !boSym
  var objOut={boDir, boFile, boSym, name, inode:Number(StrM[0]), mtime, mtime_ns, mode, size:Number(StrM[3])}
  
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
  //if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/progBlah') debugger
  var lenPar=strPar.length
  var StrPrefix=["", "."], arrStrRow=Array(2)
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
    var name=strRow.substring(indLeafStart);
    if(name=='.' || name=='..') continue
    var strMeta=strRow.substring(0, indAt);
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

var myStatsOfDirContent_ls=async function(strPar='.'){
  //if(strPar=='/home/magnus/progPython/buvt-TargetFs/Target/progBlah') debugger
  var regFirstNonEscapedQuotationMark=/(?<!\\)"/g;
  var lenPar=strPar.length;
  var [err, objT] = await Neutralino.os.execCommand('ls -lAigoQU --time-style=+"%s.%N"  --color=never '+strPar).toNBP();
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
    var strNameWQ=strRow.substring(indFirstQuote);
    var strMeta=strRow.substring(0, indFirstQuote-1);
    var StrM=strMeta.split(" ");
    var [inode, mode, nHL, size, strMtime]=StrM;
    inode=Number(inode); size=Number(size); var type=mode[0]
    var StrTime=strMtime.split(".");
    var flMtime=Number(strMtime), mtime=StrTime[0], mtime_ns=StrTime[1], flMtime_ns=flMtime*1e9
    var boDir=type=='d', boFile=mode=='-', boSym=type=='l';
    if(boSym){
        // Getting the location of the ending quotationmark of the first string
      var strNameTmp=strNameWQ.substring(1), n = strNameTmp.search(regFirstNonEscapedQuotationMark);
      //var name=strNameTmp.substring(0,n);
      var name=JSON.parse(strNameWQ.substring(0,n+2));
    }else {
      //var name=strNameWQ.slice(1,-1);
      var name=JSON.parse(strNameWQ);
    }
    mtime=Number(mtime); mtime_ns=Number(mtime_ns);
    ObjRow[i]={boDir, boFile, boSym, name, inode, mtime, mtime_ns, size}
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
  var [err, objT] = await Neutralino.os.execCommand('realpath -s '+fiT).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {debugger; return [new Error(stdErr)]};
  stdOut=stdOut.trim()
  return [null, stdOut];
}

var isFolderEmpty=async function(fiDir){
  var [err, objT] = await Neutralino.os.execCommand('find '+fiDir+' -maxdepth 0 -empty').toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {debugger; return [new Error(stdErr)]};
  stdOut=stdOut.trim()
  var boEmpty=Boolean(stdOut)
  return [null, boEmpty];
}
