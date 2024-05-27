
"use strict"


gThis.appname = "buvt"
gThis.appauthor = "Gavott"
gThis.boAskBeforeWrite=true


gThis.leafMyStorage='myStorage.json'
gThis.leafMyStorageMain='myStorageMain.json'
gThis.stemBuvtPyScript='buvtPyScript'
//gThis.leafBuvtPyScript=stemBuvtPyScript+'.py'
gThis.wBuvtPyScriptOrg=stemBuvtPyScript+charF+stemBuvtPyScript+'.py';

gThis.fsBuvtPyScriptRemote='/tmp/buvtPyScript.py'


//gThis.IntTDiv={'n':1e9, 'u':1e6, 'm':1e3}
//gThis.IntTDiv={'n':1, 'u':1e3, 'm':1e6, '1':1e9, '2':2e9}
gThis.KeyTRes=['n', 'u', 'm', '1', '2']
//gThis.IntTDiv={'n':BigInt(1), 'u':BigInt(1e3), 'm':BigInt(1e6), '1':BigInt(1e9), '2':BigInt(2e9)}
gThis.IntTDiv={'9':BigInt(1e0), '8':BigInt(1e1), '7':BigInt(1e2), '6':BigInt(1e3), '5':BigInt(1e4), '4':BigInt(1e5), '3':BigInt(1e6), '2':BigInt(1e7), '1':BigInt(1e8), '0':BigInt(1e9), 'd':BigInt(2e9)}
//gThis.KeyTRes=['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', 'd']
gThis.KeyTRes=[], IntTDiv={}   
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
gThis.LeafFilter={b:".buvt-filter", r:".rsync-filter", R:".rsync-filter"},




gThis.LeafFileT2D=[
"T2D_HL.txt", 
"T2D_Hash.txt", 
"T2D_untouchedWOExactMTime.txt",
"T2D_renamed.txt",
"T2D_copiedThenRenamedToOrigin.txt",
"T2D_changed.txt",
"T2D_reusedName.txt",
"T2D_reusedId.txt",
"T2D_created.txt",
"T2D_deleted.txt",
"T2D_1T1NoName.txt",
"T2D_STMatch1_02.txt",
"T2D_STMatch1_12.txt",
"T2D_STMatch1_20.txt",
"T2D_STMatch1_21.txt",
"T2D_STMatch1_22.txt",
"T2D_STMatch2"]
gThis.LeafFileT2T=[
"T2T_changed.txt",
"T2T_created.txt",
"T2T_deleted.txt",
"T2T_createdF.txt",
"T2T_deletedF.txt",
"T2T_renamed.txt",
"T2T_ancestor.txt",
"T2T_renamedAdditional.txt",
"T2T_STMatch1_02.txt",
"T2T_STMatch1_12.txt",
"T2T_STMatch1_20.txt",
"T2T_STMatch1_21.txt",
"T2T_STMatch1_22.txt",
"T2T_STMatch2_02.txt",
"T2T_STMatch2_12.txt",
"T2T_STMatch2_20.txt",
"T2T_STMatch2_21.txt",
"T2T_STMatch2_22.txt",
"T2T_STMatch3"] 


gThis.LeafFileParseNDump=[
  "ParseNDump_b.txt",
  "ParseNDump_r.txt",
  "ParseNDump_R.txt",
]
//"T2T_STMatch1", "T2T_STMatch2",

//ancestorOnlyRenamed
//nonLeaf1T1RenamedAncestor
//ancestorOfNonLeafRenamed1T1
//renamedAncestorOf1T1Renamed
//ancestrally1T1RenamedAncestor

gThis.LeafOther=['rsyncTempFile.txt', 'arg.txt', 'emptyFolders.txt']


gThis.StrStemT2D=[]
for(const leaf of LeafFileT2D) StrStemT2D.push(leaf.split('.')[0])
gThis.StrStemT2T=[]
for(const leaf of LeafFileT2T) StrStemT2T.push(leaf.split('.')[0])
gThis.StrStemParseNDump=[]
for(const leaf of LeafFileParseNDump) StrStemParseNDump.push(leaf.split('.')[0])
gThis.StrStemOther=[]
for(const leaf of LeafOther) StrStemOther.push(leaf.split('.')[0])


gThis.StrResultStem=StrStemT2D.concat(StrStemT2T, StrStemParseNDump, StrStemOther)
var StrLeafResultFile=LeafFileT2D.concat(LeafFileT2T, LeafFileParseNDump, LeafOther)
gThis.LeafResultFile={}
for(let i=0;i<StrResultStem.length;i++){
  let strStem= StrResultStem[i]
  const leafFile=strStem+'.txt'
  LeafResultFile[strStem]=leafFile
}

  // FsResultFile
gThis.calcFsResultFile=function(fsDataHome){
  var FsResultFile={}
  for(let i=0;i<StrResultStem.length;i++){
    let strStem= StrResultStem[i]
    let leafFile= LeafResultFile[strStem]
    const fsTmp=fsDataHome+charF+leafFile
    FsResultFile[strStem]=fsTmp
  }
  return FsResultFile
}
