
"use strict"


var appname = "buvt"
var appauthor = "Gavott"
var boAskBeforeWrite=true


var leafMyStorage='myStorage.json'
var stemPyParser='pythonInterface'
//var leafPyParser=stemPyParser+'.py'
var wPyParserOrg=stemPyParser+charF+stemPyParser+'.py';


var getDataHome=async function(){ // dataHome: the location reserved for the app/program to store memory
  let envs=await Neutralino.os.getEnvs()
  //let fsAPPDATA = await Neutralino.os.getEnv('APPDATA');
  //let fsHome = await Neutralino.os.getEnv('HOME');
  var fsDataHome=""
  if('APPDATA' in envs) {
    fsDataHome=envs['APPDATA']+charF+appname
    return fsDataHome;
  }
  if('HOME' in envs) {
    let fsHome = envs['HOME']
    //if(NL_OS=='Darwin') fsDataHome=fsHome+ '/Library/Preferences/'+appname;
    if(NL_OS=='Darwin') fsDataHome=fsHome+ '/Library/Application Support/'+appname;
    else if(NL_OS=='Linux') fsDataHome=fsHome+ '/.local/share/'+appname
    return fsDataHome
  }

  return null
}


//var IntTDiv={'n':1e9, 'u':1e6, 'm':1e3}
//var IntTDiv={'n':1, 'u':1e3, 'm':1e6, '1':1e9, '2':2e9}
var KeyTRes=['n', 'u', 'm', '1', '2']
var IntTDiv={'n':BigInt(1), 'u':BigInt(1e3), 'm':BigInt(1e6), '1':BigInt(1e9), '2':BigInt(2e9)}
var settings={
  leafDb:"buvtDb.txt", 
  leafFilter:".buvt-filter",
  charTRes:'n'
}




var StrStemT2D=[
"T2D_HL", 
"T2D_renamed",
"T2D_copiedThenRenamedToOrigin",
"T2D_changed",
"T2D_reusedName",
"T2D_reusedId",
"T2D_created",
"T2D_deleted",
"T2D_1T1NoName",
"T2D_mult1",
"T2D_mult2"]//1M_MM_M1
var StrStemT2T=[
"T2T_sum",
"T2T_changed",
"T2T_created",
"T2T_deleted",
"T2T_renamed",
"T2T_ancestor",
"T2T_renamedAdditional",
"T2T_mult1",
"T2T_mult2",
"T2T_mult3"] 

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