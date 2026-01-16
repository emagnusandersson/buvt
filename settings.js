
"use strict"


gThis.appname = "buvt"
gThis.appauthor = "Gavott"
gThis.boAskBeforeWrite=true


gThis.leafMyStorage='myStorage.json'
gThis.leafMyStorageMain='myStorageMain.json'
gThis.stemBuvtPyScript='buvtPyScript'

gThis.fsTmp="/tmp/buvt"
//gThis.fsTmpTarget=fsTmp+charF+"tmpTarget"
gThis.fsResultFolderDefault=fsTmp+charF+"result"

gThis.nShortListMax=10

//gThis.IntTDiv={'9':BigInt(1e0), '8':BigInt(1e1), '7':BigInt(1e2), '6':BigInt(1e3), '5':BigInt(1e4), '4':BigInt(1e5), '3':BigInt(1e6), '2':BigInt(1e7), '1':BigInt(1e8), '0':BigInt(1e9), 'd':BigInt(2e9)}
//gThis.KeyTRes=['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', 'd']
gThis.KeyTRes=[]; gThis.IntTDiv={}   
for(var i=0;i<10;i++) {
  var strI=i.toString();
  KeyTRes[i]=strI
  IntTDiv[strI]=BigInt(Math.pow(10,9-i))
}
KeyTRes.push('d'); IntTDiv['d']=BigInt(2e9);

gThis.settings={
  leafDb:"buvtDb.txt", 
  charTRes:'9'
}
gThis.LeafFilter={b:".buvt-filter", r:".rsync-filter", R:".rsync-filter"};


  // Creating S_ and T_
var KeyD=[
  "hl", 
  "hash", 
  "allTr",
  "allDb",
  "untouched",
  "renamed",
  "defragmented",
  "changed",
  //"reusedName",
  //"reusedId",
  "created",
  "deleted",
  "M1T1",
  //"M1T1Relation",
  //"M1T1RelationCustom",
  "STMatch1_02",
  "STMatch1_12",
  "STMatch1_20",
  "STMatch1_21",
  "STMatch1_22",
  "STMatch2",
  "dbTmp"]

var KeyT2T=[
"changed",
"created",
"deleted",
"createdF",
"deletedF",
"renamed",
//"ancestor",
//"renamedAdditional",
"STMatch1_02",
"STMatch1_12",
"STMatch1_20",
"STMatch1_21",
"STMatch1_22",
//"STMatch2_02",
//"STMatch2_12",
//"STMatch2_20",
//"STMatch2_21",
//"STMatch2_22",
//"STMatch3",
"copyToTarget",
"copyOnTarget1",
"copyOnTarget2",
"moveOnTarget",
"moveOnTargetNSetMTime",
"categoryDelete",
"categorySetMTime",
"link",
"caseCollision",
"reservedChar",
"reservedCharF"] 

class MyTextFile{
  constructor(fsF, stem){
    var leaf=stem+'.txt', fsName=fsF+charF+leaf; extend(this,{leaf,fsName})
  }
}

var KeyParseNDump=[ "b", "r", "R"]


var StemLoose=['rsyncTempFile', 'arg', 'emptyFolders', 'remoteFileLocally', 'tmp', 'hashCollisionKeep'];
// var StemHashMult=["hashMultSMConsistent", "hashMultSMNonConsistent"]
// var StemSMMult=["smMultHashConsistent", "smMultHashNonConsistent"]
var KeySingle=["hashMultSMConsistent", "hashMultSMNonConsistent", "smMultHashConsistent", "smMultHashNonConsistent", 'hsmRevert', 'hsmToChange', 'smToChange', 'smRevert', 'smReadOnly'];

gThis.calcFs=function(fsF){
  gThis.PathS={};  gThis.PathT={}
  for(let i=0;i<KeyD.length;i++){
    var key=KeyD[i];
    var stem='S_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;    PathS[key]={fsName, leaf}
    var stem='T_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;    PathT[key]={fsName, leaf}
  }
  gThis.PathT2T={}
  for(let i=0;i<KeyT2T.length;i++){
    var key=KeyT2T[i], stem='T2T_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;   //stem=leaf.split('.')[0]
    PathT2T[key]={fsName, leaf}
  }
  gThis.PathParseNDump={}
  for(let i=0;i<KeyParseNDump.length;i++){
    var key=KeyParseNDump[i], stem='parseNDump_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;   //stem=leaf.split('.')[0]
    PathParseNDump[key]={fsName, leaf}
  }
  gThis.PathLoose={};  for(let i=0;i<StemLoose.length;i++){ var stem=StemLoose[i];  PathLoose[stem]=new MyTextFile(fsF, stem); }
  //gThis.PathHashMult={};  for(let i=0;i<StemHashMult.length;i++){ var stem=StemHashMult[i];  PathHashMult[stem]=new MyTextFile(fsF, stem); }
  //gThis.PathSMMult={};  for(let i=0;i<StemSMMult.length;i++){ var stem=StemSMMult[i];  PathSMMult[stem]=new MyTextFile(fsF, stem); }

  // gThis.pathHashMultSMConsistent=new MyTextFile(fsF, 'hashMultSMConsistent');
  // gThis.pathHashMultSMNonConsistent=new MyTextFile(fsF, 'hashMultSMNonConsistent');
  // gThis.pathSMMultHashConsistent=new MyTextFile(fsF, 'smMultHashConsistent');
  // gThis.pathSMMultHashNonConsistent=new MyTextFile(fsF, 'smMultHashNonConsistent');
  // gThis.pathHSMRevert=new MyTextFile(fsF, 'hsmRevert');
  // gThis.pathHSMToChange=new MyTextFile(fsF, 'hsmToChange');
  // gThis.pathSMToChange=new MyTextFile(fsF, 'smToChange');
  // gThis.pathSMRevert=new MyTextFile(fsF, 'smRevert');
  // gThis.pathSMReadOnly=new MyTextFile(fsF, 'smReadOnly');
  
  gThis.PathSingleS={}; gThis.PathSingleT={}
  for(let i=0;i<KeySingle.length;i++){
    var key=KeySingle[i];
    var stem='S_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;    PathSingleS[key]={fsName, leaf}
    var stem='T_'+key, leaf=stem+'.txt', fsName=fsF+charF+leaf;    PathSingleT[key]={fsName, leaf}
  }

  //gThis.PathHashCollision={keep:new MyTextFile(fsF, 'hashCollisionKeep'), ref:new MyTextFile(fsF, 'hashCollisionRef')};
}


var strExist='✓', strNotExist='✗', strCurrent='✦'
//var strExist='Exist', strNotExist='Does not exist', strCurrent='✦'
