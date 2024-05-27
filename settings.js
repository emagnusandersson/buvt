
"use strict"


var appname = "buvt"
var appauthor = "Gavott"
var boAskBeforeWrite=true


var leafMyStorage='myStorage.json'
var stemPyParser='pythonInterface'
//var leafPyParser=stemPyParser+'.py'
var wPyParserOrg=stemPyParser+charF+stemPyParser+'.py';


var getDataHome=async function(){ // dataHome: the location reserved for the app/program to store memory
  //let envs=await Neutralino.os.getEnvs()
  let envs=process.env;
  //let fsAPPDATA = await Neutralino.os.getEnv('APPDATA');
  //let fsHome = await Neutralino.os.getEnv('HOME');
  var fsDataHome=""
  if('APPDATA' in envs) {
    fsDataHome=envs['APPDATA']+charF+appname
    return fsDataHome;
  }
  if('HOME' in envs) {
    let fsHome = envs['HOME']
    //if(strOS=='darwin') fsDataHome=fsHome+ '/Library/Preferences/'+appname;
    if(strOS=='darwin') fsDataHome=fsHome+ '/Library/Application Support/'+appname;
    else if(strOS=='linux') fsDataHome=fsHome+ '/.local/share/'+appname
    return fsDataHome
  }

  return null
}


//var IntTDiv={'n':1e9, 'u':1e6, 'm':1e3}
//var IntTDiv={'n':1, 'u':1e3, 'm':1e6, '1':1e9, '2':2e9}
var KeyTRes=['n', 'u', 'm', '1', '2']
//var IntTDiv={'n':BigInt(1), 'u':BigInt(1e3), 'm':BigInt(1e6), '1':BigInt(1e9), '2':BigInt(2e9)}
var IntTDiv={'9':BigInt(1e0), '8':BigInt(1e1), '7':BigInt(1e2), '6':BigInt(1e3), '5':BigInt(1e4), '4':BigInt(1e5), '3':BigInt(1e6), '2':BigInt(1e7), '1':BigInt(1e8), '0':BigInt(1e9), 'd':BigInt(2e9)}
//var KeyTRes=['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', 'd']
var KeyTRes=[], IntTDiv={}   
for(var i=0;i<10;i++) {
  var strI=i.toString();
  KeyTRes[i]=strI
  IntTDiv[strI]=BigInt(Math.pow(10,9-i))
}
KeyTRes.push('d'); IntTDiv['d']=BigInt(2e9);

var settings={
  leafDb:"buvtDb.txt", 
  leafFilter:".buvt-filter",
  charTRes:'9'
}




var StrStemT2D=[
"T2D_HL", 
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
var StrStemT2T=[
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

var StrStem=StrStemT2D.concat(StrStemT2T)
var StrLeafFile=LeafFileT2D.concat(LeafFileT2T)
var LeafFile={}
for(let i=0;i<StrStem.length;i++){
  let strStem= StrStem[i]
  const leafFile=strStem+'.txt'
  LeafFile[strStem]=leafFile
}

var calcFsFile=function(fsDataHome){
  var FsFile={}
  for(let i=0;i<StrStem.length;i++){
    let strStem= StrStem[i]
    let leafFile= LeafFile[strStem]
    const fsTmp=fsDataHome+charF+leafFile
    FsFile[strStem]=fsTmp
  }
  return FsFile
}
