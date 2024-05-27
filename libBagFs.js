
"use strict"


gThis.makeFunInc=function(strProp){ return (a,b)=>{var aa=a[strProp], bb=b[strProp]; return (aa < bb) ? -1 : ((aa > bb) ? 1 : 0) } }
gThis.makeFunDec=function(strProp){ return (a,b)=>{var aa=a[[strProp]], bb=b[[strProp]]; return (aa < bb) ? 1 : ((aa > bb) ? -1 : 0) } }
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
  // arrAncestorOnlyRenamed is the output of convertObjAncestorOnlyRenamedToArr
var formatAncestorOnlyRenamed=function(arrAncestorOnlyRenamed, fiDb){
  var arrDisp=[], arrMv=[], arrSed=[]
  for(var row of arrAncestorOnlyRenamed){
    var n=row.n;
    //var strSource=row[StrOrder[1]],  strTarget=row[StrOrder[0]]
    var strSource=row.Key[0],  strTarget=row.Key[1]
    arrDisp.push(`RelevantAncestor (${n} file${pluralS(n)}):`) 
    arrDisp.push(`  ${strTarget}`)
    arrDisp.push(`  ${strSource}`)
    //boUseQuote=' ' in strTmp
    arrMv.push(`  # ${n} file${pluralS(n)}:`) 
    arrMv.push(`mv  "${strTarget}" "${strSource}"`)
    arrSed.push(`sed -E 's/^( *[0-9]+ +[0-9a-f]+ +[0-9]+ +[0-9]+ +)${strTarget}(.*)/\\1${strSource}\\2/' ${fiDb} > ${fiDb}`)
  }
  return [arrDisp, arrMv, arrSed]
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



  // ArrS, ArrT are two-dimensional arrays
  // Each row contains an array of elements who matches
var formatMatchingDataWMult=function(ArrS, ArrT){
  var arrOut=[]
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    const nT=arrT.length, nS=arrS.length
    arrS.sort(funIncMTime);   arrT.sort(funIncMTime);

    var rowTmp
    if(nS) {var s0=arrS[0], sE=arrS[nS-1], boSEq=s0.mtime_ns64==sE.mtime_ns64, rowTmp=s0;} else var boSEq=true
    if(nT) {var t0=arrT[0], tE=arrT[nT-1], boTEq=t0.mtime_ns64==tE.mtime_ns64, rowTmp=t0;} else var boTEq=true
    if(nS && nT) var bo0Eq=s0.mtime_ns64==t0.mtime_ns64; else var bo0Eq=true
    var boAllEq=boSEq && boTEq && bo0Eq

    var strMTimeExact=(boAllEq && rowTmp.mtime_ns64!=rowTmp.mtime_ns64Floored)?` ${rowTmp.strMTime.padStart(19)}`:'seePrev'
    var strLab=`MatchingData ${rowTmp.size.myPadStart(10)} ${rowTmp.strMTimeFloored.padStart(19)} ${strMTimeExact}`
    arrOut.push(strLab);

    //var strId="seeAbove".padStart(lStrId); 
    for(var row of arrS){
      var {strType, mtime_ns64, id}=row;
      //var strId=id.toString(); //.padStart(lStrId);
      var strM=boAllEq?"seeAbove":mtime_ns64.toString()
      arrOut.push(`  S ${strType} ${id} ${strM.padStart(19)} ${row.strName}`)
    }
    for(var row of arrT){
      var {strType, mtime_ns64, id}=row
      //var strId=id.toString(); //.padStart(lStrId);
      var strM=boAllEq?"seeAbove":mtime_ns64.toString()
      arrOut.push(`  T ${strType} ${id} ${strM.padStart(19)} ${row.strName}`)
    }
  }
  return arrOut
}


  // Arr are two-dimensional arrays
  // Each row contains an array of elements who matches
var formatMatchingDataWMultSingleDataSetST=function(Arr, strSide){
  var arrOut=[]
  for(var i in Arr){
    var arr=Arr[i], n=arr.length; arr.sort(funIncMTime);

    var r0=arr[0], rE=arr[n-1], boAllEq=r0.mtime_ns64==rE.mtime_ns64;

    var rowTmp=r0
    var strMTimeExact=(boAllEq && rowTmp.mtime_ns64!=rowTmp.mtime_ns64Floored)?` ${rowTmp.strMTime.padStart(19)}`:'seePrev'
    var strLab=`MatchingData ${rowTmp.size.myPadStart(10)} ${rowTmp.strMTimeFloored.padStart(19)} ${strMTimeExact}`
    arrOut.push(strLab);

    //var strId="seeAbove".padStart(lStrId); 
    for(var row of arr){
      var {strType, mtime_ns64, id}=row;
      //var strId=id.toString(); //.padStart(lStrId);
      var strM=boAllEq?"seeAbove":mtime_ns64.toString()
      arrOut.push(`  ${strSide} ${strType} ${id} ${strM.padStart(19)} ${row.strName}`)
    }
  }
  return arrOut
}



  // ObjA is an object where each "key", is the matching data, and each "val" is an array of the elements that measures to that data.
var formatMatchingDataWMultSingleDataSet=function(ObjA, funMatch, funUnique){
  var arrOut=[]
  for(var key in ObjA){
    var arr=ObjA[key]
    var strTmp=funMatch(arr[0])
    arrOut.push(strTmp)
    for(var row of arr){
      var strTmp=funUnique(row)
      arrOut.push(strTmp)
    }
  }
  return arrOut
}

  



var formatMatchingData=function(arrS, arrT, funMatch, funUniqueS, funUniqueT=null){
  if(funUniqueT==null) funUniqueT=funUniqueS
  var arrOut=[]
  for(var i=0;i<arrS.length;i++){
    var rowS=arrS[i], rowT=arrT[i]
    arrOut.push(funMatch(rowS,rowT))
    arrOut.push(funUniqueS(rowS), funUniqueT(rowT))
  }
  return arrOut
}


var formatRename1T1=function(arrA11, arrB11){
  const len=arrA11.length
  arrA11.forEach((el, i)=>el.ind=i)
  var arrStmp=arrA11.toSorted(funIncStrName)

    // Create Ind
  var Ind=arrStmp.map(entry=>entry.ind)
  const arrTtmp=eInd(arrB11, Ind)

  var funMatch=(s,t)=>{
    return `MatchingData ${s.id} ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)}`;
  }
  var funUniqueS=s=>{
    var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
    return `  S ${s.strType} ${strD} ${s.strName}`
  }
  var funUniqueT=s=>{
    var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
    return `  T ${s.strType} ${strD} ${s.strName}`
  }
  var arrData=formatMatchingData(arrStmp, arrTtmp, funMatch, funUniqueS, funUniqueT)
  var strHeadMT=`string int string`, strHeadM=`id size strMTimeFloored`;
  var strHeadUT=`string string string string`, strHeadU=`side strType strMTime strName`;
  if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
  return arrData
}


