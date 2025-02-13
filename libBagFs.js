
"use strict"


gThis.makeFunInc=function(strProp){ return (A,B)=>{var a=A[strProp], b=B[strProp]; return (a<b) ? -1 : ((a>b)?1:0) } }
gThis.makeFunDec=function(strProp){ return (A,B)=>{var a=A[[strProp]], b=B[[strProp]]; return (a<b) ? 1 : ((a>b)?-1:0) } }
var strTmp='strName'; gThis.funIncStrName=makeFunInc(strTmp); gThis.funDecStrName=makeFunDec(strTmp)
var strTmp='id'; gThis.funIncId=makeFunInc(strTmp); gThis.funDecId=makeFunDec(strTmp)
var strTmp='sm'; gThis.funIncSM=makeFunInc(strTmp); gThis.funDecSM=makeFunDec(strTmp)
var strTmp='strHash'; gThis.funIncHash=makeFunInc(strTmp); gThis.funDecHash=makeFunDec(strTmp)
var strTmp='mtime_ns64'; gThis.funIncMTime=makeFunInc(strTmp); gThis.funDecMTime=makeFunDec(strTmp)

// If the leaf-most folders (of strA and strB) look the same they are cut off.
// So the returned paths are the diverging parts.
// Ex: strA="aaa/bbb/ccc/ddd.txt" and strB="aaa/bxb/ccc/ddd.txt" then the returned values are "aaa/bbb", "aaa/bxb"
// If strA and strB are different only in the leaf, then the returned values are null, null.
// Ex: strA="aaa/bbb/ccc/ddd.txt" and strB="aaa/bbb/ccc/dcd.txt" then the returned values are null, null
var extractDivergingParents=function(strA,strB){
  var lA=strA.length, lB=strB.length, iLastSlash=null
  var lShortest=lA<lB?lA:lB
  //for i in range(-1, -lShortest, -1): // [-1, -2, ... -(lShortest-1)]
  for(var i=-1;i>-lShortest;i--){
    var iEnd=i+1;if(iEnd==0) iEnd=undefined;
    var a=strA.slice(i,iEnd), b=strB.slice(i,iEnd)
    if(b!=a) break
    if(a==charF) iLastSlash=i
  }
  if(iLastSlash==null) return [null, null]  //, null
  return [strA.slice(0,iLastSlash), strB.slice(0,iLastSlash)]  //, strA[iLastSlash-1:]
}

//[strAO, strBO]=extractDivergingParents("aaa/bbb/ccc/ddd.txt","aaa/bxb/ccc/ddd.txt")
//[strAO, strBO]=extractDivergingParents("aaa/bbb/ccc/ddd.txt","aaa/bbb/ccc/dxd.txt")


// summarizeAncestorOnlyRename(arrA, arrB)
// arrA and arrB (arrays) correspond to each other in that: For a certain i, arrA[i] and arrB[i] matches (One-To-One) (in some way (like having matching metadata)). But they have different strName (path).
//
// Ex:
//   Assume the input arrays:
// arrA=[{strName:"/abc/def/ghi/jkl.txt"}, {strName:"/abc/dQQQf/ghi/mmm.txt"},       {strName:"/abc/dQQQf/ghi/nnn.txt"},       {strName:"/stu/ooo.txt"}]
// arrB=[{strName:"/mno/pqr.txt"},         {strName:"/blah/blah/dRRRf/ghi/mmm.txt"}, {strName:"/blah/blah/dRRRf/ghi/nnn.txt"}, {strName:"/vwx/ooo.txt"}]
//   Which can also be written like this (to simplyfy the notation):
// arrA=[fileA0, fileA1, fileA2, fileA3], arrB=[fileB0, fileB1, fileB2, fileB3]
//   Or extracting only the strName (path):
// PathA=["/abc/def/ghi/jkl.txt",       "/abc/dQQQf/ghi/mmm.txt",       "/abc/dQQQf/ghi/nnn.txt", "/stu/ooo.txt"]
// PathB=[        "/mno/pqr.txt", "/blah/blah/dRRRf/ghi/mmm.txt", "/blah/blah/dRRRf/ghi/nnn.txt", "/vwx/ooo.txt"]
//
// When you compare the paths of resp index, you find:
// PathA[0] is different from PathB[0] in the leaf-part (right most part) (thus these will not be included in the output)
// PathA[1] diverges from PathB[1] in the "grandparent" (of the leaf): "/abc/dQQQf" resp "/blah/blah/dRRRf"
// PathA[2] diverges from PathB[2] in the (same as previous) "grandparent" (of the leaf): "/abc/dQQQf" resp "/blah/blah/dRRRf"
// PathA[3] diverges from PathB[3] in "/stu" resp "/vwx"
//
// Then the output becomes:
// objAncestorOnlyRenamed={
//    "/abc/dQQQf:"{"/blah/blah/dRRRf":[[fileA1, fileB1], [fileA2, fileB2]]},
//    "/stu":{"/vwx":[[fileA3, fileB3]]}
// }
// That is:
//   at the top level of objAncestorOnlyRenamed the keys are path-parts from arrA. 
//   at the second level from the top the keys are path-parts from arrB. 
//   at the third level is an array with the files entered pairwise.
var summarizeAncestorOnlyRename=function(arrA, arrB){
  var objAncestorOnlyRenamed={}, n=0
  var arrALeafRenamed=[], arrBLeafRenamed=[]
  for(var i in arrA){
    var rowA=arrA[i], rowB=arrB[i], strA=rowA.strName, strB=rowB.strName
    var [strParA, strParB]=extractDivergingParents(strA, strB)
    if(strParA==null){
      arrALeafRenamed.push(rowA)
      arrBLeafRenamed.push(rowB)
      continue
    }
    if(!(strParA in objAncestorOnlyRenamed)) objAncestorOnlyRenamed[strParA]={}
    if(!(strParB in objAncestorOnlyRenamed[strParA])) objAncestorOnlyRenamed[strParA][strParB]=[]
    n+=1
    objAncestorOnlyRenamed[strParA][strParB].push([rowA, rowB])
  }
  return [n, objAncestorOnlyRenamed]  //, arrALeafRenamed, arrBLeafRenamed
}



// Ex: objAncestorOnlyRenamed={myFoldA:{myFoldB:[[rowA, rowB], [rowA, rowB]]}}
// Ex: arrAncestorOnlyRenamed=[{"n":2, "lev":0, "keyA":"myFoldA", "keyB":"myFoldB", "arrRel":[[rowA, rowB], [rowA, rowB]]} ]
var convertObjAncestorOnlyRenamedToArr=function(objAncestorOnlyRenamed){
  var arrAncestorOnlyRenamed=[]
  for(var keyA in objAncestorOnlyRenamed){
    var objInner=objAncestorOnlyRenamed[keyA]
    //var lev=keyA.count("/")
    var nSlash=(keyA.match(/\//g) || []).length, lev=nSlash;
    for(var keyB in objInner){
      var arrRel=objInner[keyB]
      var n=arrRel.length
      var objTmp={"n":n, "lev":lev, "arrRel":arrRel, Key:[keyA, keyB]}
      arrAncestorOnlyRenamed.push(objTmp)
    }
  }
  return arrAncestorOnlyRenamed
}

  // Moves "rows" (entries) from objAByM and objBByM to either (objAByMAfterExtraIDing, objBByMAfterExtraIDing) or (arrAIdd, arrBIdd)
  // Ex of input:
  //   objAByM={"0000000001_123487081324":[{id:..., name:...}, {id:..., name:...}], "0000000002_123487081324":[]}
  //   objBByM={"0000000001_123487081324":[{id:..., name:...}], "0000000002_123487081324":[{id:..., name:...}]}
  //     objAByM and objBByM has the same keys.
  //   objAncestorOnlyRenamed is the second output from summarizeAncestorOnlyRename
  // Output arrAIdd and arrBIdd, are file that can be identified using this method
  // objAByMAfterExtraIDing and objBByMAfterExtraIDing are corresponds to objAByM, objBByM with extra idd files removed.
  // Notation: "ByM" stands for "by (size and) Modtime"
var extractExtraByFolder=function(objAByM, objBByM, objAncestorOnlyRenamed){
  var arrAIdd=[], arrBIdd=[]
  var objAByMAfterExtraIDing={}, objBByMAfterExtraIDing={}
  //var objAncestorOnlyRenamedDiff={}
  for(var key in objAByM){
    var arrATmp=[].concat(objAByM[key])
    var arrBTmp=[].concat(objBByM[key])
    objAByMAfterExtraIDing[key]=arrATmp; objBByMAfterExtraIDing[key]=arrBTmp
    if(arrATmp.length * arrBTmp.length<=1) continue // If one of them is empty or if both are singleton
    for(var j=arrATmp.length-1;j>=0;j--){
      var fileA=arrATmp[j], strA=fileA.strName;
      for(var k=arrBTmp.length-1;k>=0;k--){
        var fileB=arrBTmp[k], strB=fileB.strName
        var [strParA, strParB]=extractDivergingParents(strA, strB)
        if(strParA==null) continue
        if(strParA in objAncestorOnlyRenamed && strParB in objAncestorOnlyRenamed[strParA]){
          arrAIdd.push(fileA); arrBIdd.push(fileB)
          //delete arrATmp[j]; delete arrBTmp[k]
          arrATmp.splice(j,1); arrBTmp.splice(k,1); // So: if file is in a folder that has been renamed then removed from objAByMAfterExtraIDing and objBByMAfterExtraIDing
          break
        }
          // The below lines (in this for loop) are really unnecessary since objAncestorOnlyRenamedDiff is never outputed
        // if(!(strParA in objAncestorOnlyRenamedDiff)) objAncestorOnlyRenamedDiff[strParA]={}
        // if(!(strParB in objAncestorOnlyRenamedDiff[strParA])) objAncestorOnlyRenamedDiff[strParA][strParB]=[]
        // objAncestorOnlyRenamedDiff[strParA][strParB].push([fileA, fileB]) // if fileA and fileB have a common ancestor
      }
    }
  } 
  return [arrAIdd, arrBIdd, objAByMAfterExtraIDing, objBByMAfterExtraIDing]
}

var extract1To1=function(objAByM, objBByM){
  var arrA1To1=[], arrB1To1=[]
  var objAOut={}, objBOut={}
  for(var key in objAByM){
    var arrATmp=[].concat(objAByM[key])
    var arrBTmp=[].concat(objBByM[key])
    objAOut[key]=arrATmp; objBOut[key]=arrBTmp
    if(arrATmp.length==1 && arrBTmp.length==1) {
      arrA1To1.push(arrATmp[0]); arrB1To1.push(arrBTmp[0])
      arrATmp.length=0; arrBTmp.length=0; // Thus removed from objAOut and objBOut
    }
  } 
  return [arrA1To1, arrB1To1, objAOut, objBOut]
}


