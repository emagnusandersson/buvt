
"use strict"


gThis.appname = "buvt"
gThis.appauthor = "Gavott"
gThis.boAskBeforeWrite=true


gThis.leafMyStorage='myStorage.json'
gThis.leafMyStorageMain='myStorageMain.json'
gThis.stemPyParser='pythonInterface'
//gThis.leafPyParser=stemPyParser+'.py'
gThis.wPyParserOrg=stemPyParser+charF+stemPyParser+'.py';




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
  leafFilter:".buvt-filter",
  charTRes:'9'
}




gThis.StrStemT2D=[
"T2D_HL", 
"T2D_Hash", 
"T2D_untouchedWOExactMTime",
"T2D_renamed",
"T2D_copiedThenRenamedToOrigin",
"T2D_changed",
"T2D_reusedName",
"T2D_reusedId",
"T2D_created",
"T2D_deleted",
"T2D_1T1NoName",
"T2D_STMatch1_02",
"T2D_STMatch1_12",
"T2D_STMatch1_20",
"T2D_STMatch1_21",
"T2D_STMatch1_22",
"T2D_STMatch2"]
gThis.StrStemT2T=[
"T2T_changed",
"T2T_created",
"T2T_deleted",
"T2T_renamed",
"T2T_ancestor",
"T2T_renamedAdditional",
"T2T_STMatch1_02",
"T2T_STMatch1_12",
"T2T_STMatch1_20",
"T2T_STMatch1_21",
"T2T_STMatch1_22",
"T2T_STMatch2_02",
"T2T_STMatch2_12",
"T2T_STMatch2_20",
"T2T_STMatch2_21",
"T2T_STMatch2_22",
"T2T_STMatch3"] 

//"T2T_STMatch1", "T2T_STMatch2",

//ancestorOnlyRenamed
//nonLeaf1T1RenamedAncestor
//ancestorOfNonLeafRenamed1T1
//renamedAncestorOf1T1Renamed
//ancestrally1T1RenamedAncestor


var LeafFileT2D=[]
for(const strStem of StrStemT2D) LeafFileT2D.push(strStem+'.txt')

var LeafFileT2T=[]
for(const strStem of StrStemT2T) LeafFileT2T.push(strStem+'.txt')

gThis.StrResultStem=StrStemT2D.concat(StrStemT2T)
var StrLeafResultFile=LeafFileT2D.concat(LeafFileT2T)
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
