
"use strict"

var funIncStrName=(a,b)=>{if(a.strName>b.strName) return 1; else if(a.strName<b.strName) return -1; return 0;};
var funDecStrName=(a,b)=>{if(a.strName>b.strName) return -1; else if(a.strName<b.strName) return 1; return 0;};


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

  // Moves "rows" (entries) from objAMetaMatch and objBMetaMatch to either (objAMetaMatchAfterExtraIDing, objBMetaMatchAfterExtraIDing) or (arrAIdd, arrBIdd)
  // Ex of input:
  //   objAMetaMatch={"0000000001_123487081324":[{id:..., name:...}, {id:..., name:...}], "0000000002_123487081324":[]}
  //   objBMetaMatch={"0000000001_123487081324":[{id:..., name:...}], "0000000002_123487081324":[{id:..., name:...}]}
  //     objAMetaMatch and objBMetaMatch has the same keys.
  //   objAncestorOnlyRenamed is the second output from summarizeAncestorOnlyRename
  // Output arrAIdd and arrBIdd, are file that can be identified using this method
  // objAMetaMatchAfterExtraIDing and objBMetaMatchAfterExtraIDing are corresponds to objAMetaMatch, objBMetaMatch with extra idd files removed.
var extractExtraByFolder=function(objAMetaMatch, objBMetaMatch, objAncestorOnlyRenamed){
  var arrAIdd=[], arrBIdd=[]
  var objAMetaMatchAfterExtraIDing={}, objBMetaMatchAfterExtraIDing={}
  //var objAncestorOnlyRenamedDiff={}
  for(var key in objAMetaMatch){
    var arrAMetaMatch=[].concat(objAMetaMatch[key])
    var arrBMetaMatch=[].concat(objBMetaMatch[key])
    objAMetaMatchAfterExtraIDing[key]=arrAMetaMatch; objBMetaMatchAfterExtraIDing[key]=arrBMetaMatch
    if(arrAMetaMatch.length * arrBMetaMatch.length<=1) continue // If one of them is empty or if both are singleton
    for(var j=arrAMetaMatch.length-1;j>=0;j--){
      var fileA=arrAMetaMatch[j], strA=fileA.strName;
      for(var k=arrBMetaMatch.length-1;k>=0;k--){
        var fileB=arrBMetaMatch[k], strB=fileB.strName
        var [strParA, strParB]=extractDivergingParents(strA, strB)
        if(strParA==null) continue
        if(strParA in objAncestorOnlyRenamed && strParB in objAncestorOnlyRenamed[strParA]){
          arrAIdd.push(fileA); arrBIdd.push(fileB)
          //delete arrAMetaMatch[j]; delete arrBMetaMatch[k]
          arrAMetaMatch.splice(j,1); arrBMetaMatch.splice(k,1); // So: if file is in a folder that has been renamed then removed from objAMetaMatchAfterExtraIDing and objBMetaMatchAfterExtraIDing
          break
        }
          // The below lines (in this for loop) are really unnecessary since objAncestorOnlyRenamedDiff is never outputed
        // if(!(strParA in objAncestorOnlyRenamedDiff)) objAncestorOnlyRenamedDiff[strParA]={}
        // if(!(strParB in objAncestorOnlyRenamedDiff[strParA])) objAncestorOnlyRenamedDiff[strParA][strParB]=[]
        // objAncestorOnlyRenamedDiff[strParA][strParB].push([fileA, fileB]) // if fileA and fileB have a common ancestor
      }
    }
  } 
  return [arrAIdd, arrBIdd, objAMetaMatchAfterExtraIDing, objBMetaMatchAfterExtraIDing]
}

var extract1To1=function(objAMetaMatch, objBMetaMatch){
  var arrA1To1=[], arrB1To1=[]
  var objAOut={}, objBOut={}
  for(var key in objAMetaMatch){
    var arrAMetaMatch=[].concat(objAMetaMatch[key])
    var arrBMetaMatch=[].concat(objBMetaMatch[key])
    objAOut[key]=arrAMetaMatch; objBOut[key]=arrBMetaMatch
    if(arrAMetaMatch.length==1 && arrBMetaMatch.length==1) {
      arrA1To1.push(arrAMetaMatch[0]); arrB1To1.push(arrBMetaMatch[0])
      arrAMetaMatch.length=0; arrBMetaMatch.length=0; // Thus removed from objAOut and objBOut
    }
  } 
  return [arrA1To1, arrB1To1, objAOut, objBOut]
}



  // ArrS, ArrT are two-dimensional arrays
  // Each row contains an array of elements who matches
var formatMatchingDataWDup=function(ArrS, ArrT){
  var arrOut=[]
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    var s0=arrS[0], t0=arrT[0]

    var tSMax=0n, tSMin=s0.mtime_ns64, iMax=0, iMin=0
    for(var i in arrS){
      var row=arrS[i]
      if(row.mtime_ns64>tSMax) {tSMax=row.mtime_ns64, iMax=i;}
      if(row.mtime_ns64<tSMin) {tSMin=row.mtime_ns64, iMin=i;}
    }
    var dtS=tSMax-tSMin, boLabIndividualS=Boolean(dtS)
    var tTMax=0n, tTMin=t0.mtime_ns64, iMax=0, iMin=0
    for(var i in arrT){
      var row=arrT[i]
      if(row.mtime_ns64>tTMax) {tTMax=row.mtime_ns64, iMax=i;}
      if(row.mtime_ns64<tTMin) {tTMin=row.mtime_ns64, iMin=i;}
    }
    var dtT=tTMax-tTMin, boLabIndividualT=Boolean(dtT)
    var tMax=BI.max(tSMax, tTMax), tMin=BI.min(tSMin, tTMin)
    var dt=tMax-tMin, boDt=Boolean(dt)
    var dtR=s0.mtime_ns64-s0.mtime_ns64R, boDtR=Boolean(dtR)


    //var boLabExtend=boDtR && !boDt 
    var boLabSExtend=!boLabIndividualS && boLabIndividualT 
    var boLabTExtend=!boLabIndividualT && boLabIndividualS 
    var boLabExtend=!boLabIndividualS && !boLabIndividualT && boDtR
    

    var strLab=`MatchingData ${s0.size.myPadStart(10)} ${s0.strMTimeR.padStart(19)}`
    if(boLabExtend) strLab+=` (${s0.strMTime.padStart(19)})`
    arrOut.push(strLab);

    const nT=arrT.length, nS=arrS.length
    var boTUniq=nT==1,    boSUniq=nS==1
    var boBothUniq=boTUniq && boSUniq, boUseGroupLab=!boBothUniq
    
    if(boUseGroupLab){
      var strTmp=' # Target'+pluralS(nT)
      if(boLabTExtend) strTmp+=` ${t0.strMTime.padStart(19)}`
      arrOut.push(strTmp)
    } 
    var strCom=''
    for(var row of arrT){
      arrOut.push(`    ${strCom}${row.strName}`)
      if(boLabIndividualT) arrOut.push(`      #(${row.strMTime})`)
      strCom="#"
    }
    
    if(boUseGroupLab){
      var strTmp=' # Source'+pluralS(nS)
      if(boLabSExtend) strTmp+=` ${s0.strMTime.padStart(19)}`
      arrOut.push(strTmp)
    } 
    var strCom=''
    for(row of arrS){
      arrOut.push(`    ${strCom}${row.strName}`)
      if(boLabIndividualS) arrOut.push(`      #(${row.strMTime})`)
      strCom="#"
    }
  }
  return arrOut
}


  // ObjA is an object where each "key", is the matching data, and each "val" is an array of the elements that measures to that data.
var formatMatchingDataWDupSingleDataSet=function(ObjA, funMatch, funUnique){
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
    arrOut.push(funUniqueT(rowT));    arrOut.push(funUniqueS(rowS))
  }
  return arrOut
}


var formatRename1T1=function(arrA11, arrB11, strIdType=""){
  const len=arrA11.length
  arrA11.forEach((el, i)=>el.ind=i)
  var arrStmp=[...arrA11].sort(funIncStrName)

    // Create Ind
  //var Ind=Array(len); for(let i=0;i<len;i++) Ind[i]=arrStmp[i].ind;
  var Ind=arrStmp.map(entry=>entry.ind)
  const arrTtmp=eInd(arrB11, Ind)

  // var funMatch=(s,t)=>{
  //   return `  MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`;
  // }

  var funMatch=(s,t)=>{
    var strId=strIdType?s[strIdType]:""
    return `  MatchingData ${strId} ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`;
  }
  var funUnique=s=>{
    var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n#(${s.strMTime})`:'';
    return `    ${s.strName}${strD}`
  }
  var StrTmp=formatMatchingData(arrStmp, arrTtmp, funMatch, funUnique)
  return StrTmp
}



class ComparisonWOID{
  constructor( arrSource, arrTarget, strCommandName, myResultWriter){
    this.arrSource=arrSource; this.arrTarget=arrTarget
    this.strCommandName=strCommandName; this.myResultWriter=myResultWriter
  }
  
  runOps(){
    var {arrSource, arrTarget}=this

      // Search for duplicates
    var funIncSM=(a,b)=>a.sm-b.sm;   arrSource.sort(funIncSM);   arrTarget.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceM, objTargetM]=unTangleManyToManyF(arrSource, arrTarget, funSM)
    var Mat1=new Mat()
    Mat1.assignFromObjManyToMany(objSourceM, objTargetM);
    extend(this, {Mat1})
    
      // Remove untouched files
    arrSource.sort(funIncStrName);   arrTarget.sort(funIncStrName)
    var [err, arrA, arrB, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'sm']); if(err) return [err]
    this.arrSourceUnTouched=arrA; this.arrTargetUnTouched=arrB; // nm

      // Rename (MetaMatch)
    var funIncSM=(a,b)=>a.sm-b.sm;   arrSourceTouched.sort(funIncSM);   arrTargetTouched.sort(funIncSM)
    var funSM=row=>row.sm
    var [objSourceMetaMatch, objTargetMetaMatch]=unTangleManyToManyF(arrSourceTouched, arrTargetTouched, funSM)

      // Calculate Mat2
    var Mat2=new Mat()
    Mat2.assignFromObjManyToMany(objSourceMetaMatch, objTargetMetaMatch);
    extend(this, {Mat2})


      // Create collections (obj/arr) of files only renamed in ancestor. (Just noting down renamed ancestor would be enough (only the keys(2-dim) of objAncestorOnlyRenamed are used))
    var [nAncestorOnlyRenamed, objAncestorOnlyRenamed]=summarizeAncestorOnlyRename(Mat2.arrA[1][1], Mat2.arrB[1][1])
      // Create arrAncestorOnlyRenamed, more suitable for listing (all renamed parents)
    var arrAncestorOnlyRenamed=convertObjAncestorOnlyRenamedToArr(objAncestorOnlyRenamed)
    var funDecN=(a,b)=>b.n-a.n;         arrAncestorOnlyRenamed.sort(funDecN);
    var funDecLev=(a,b)=>b.lev-a.lev;     arrAncestorOnlyRenamed.sort(funDecLev)
    extend(this, {arrAncestorOnlyRenamed, nAncestorOnlyRenamed})

    //var MatSec=Mat2.shallowCopy()

      // From the files matching in SM, find files that matches 1T1-files that has only been renamed in ancestor.
      // Extract files Idd by ancestor folder from duplicates
    var [arrSourceIddByFolder, arrTargetIddByFolder, objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing]=extractExtraByFolder(objSourceMetaMatch, objTargetMetaMatch, objAncestorOnlyRenamed)
    extend(this, {arrSourceIddByFolder, arrTargetIddByFolder}) // _ma (meta and ancestor)


    var [arrSource1To1, arrTarget1To1, objSourceRem2, objTargetRem2]=extract1To1(objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing)
    extend(this, {arrSource1To1, arrTarget1To1})

      // Recalculate Mat3
    objManyToManyRemoveEmpty(objSourceRem2, objTargetRem2)  // Modifies the arguments
    var Mat3=new Mat()
    //Mat3.assignFromObjManyToMany(objSourceMetaMatchAfterExtraIDing, objTargetMetaMatchAfterExtraIDing);
    Mat3.assignFromObjManyToMany(objSourceRem2, objTargetRem2);
    extend(this, {Mat3})

      // Changed (NoMetaMatch with matching strName)
    var arrSourceNoMetaMatch=[].concat(Mat3.arrA[2][0], Mat3.arrA[1][0]);
    var arrTargetNoMetaMatch=[].concat(Mat3.arrB[0][1], Mat3.arrB[0][2]);
    arrSourceNoMetaMatch.sort(funIncStrName); arrTargetNoMetaMatch.sort(funIncStrName);
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceNoMetaMatch, arrTargetNoMetaMatch, ['strName']); if(err) return [err]
    this.arrSourceMatchingStrName=arrA; this.arrTargetMatchingStrName=arrB

    //arrCreate, arrDelete = arrSourceRem, arrTargetRem
    extend(this, {arrSourceRem, arrTargetRem})
    return [null]
  }
  getArgForScreen(){
    var nSource=this.arrSource.length, nTarget=this.arrTarget.length
    var nUnTouched=this.arrSourceUnTouched.length
    var nMatchingStrName=this.arrSourceMatchingStrName.length
    var nSourceRem=this.arrSourceRem.length,  nTargetRem=this.arrTargetRem.length
    var nIddByFolder=this.arrSourceIddByFolder.length
    var nAncestorOnlyRenamedFolder=this.arrAncestorOnlyRenamed.length
    var {Mat1, Mat2, Mat3, nAncestorOnlyRenamed}=this


    return {nSource, nTarget, nUnTouched, nMatchingStrName, nSourceRem, nTargetRem, nIddByFolder, Mat1, Mat2, Mat3, nAncestorOnlyRenamed, nAncestorOnlyRenamedFolder} //, nAWDupRem, nBWDupRem
  }
  format(fiDb){ //fsDir, 
    var {Mat1, Mat2, Mat3}=this

    var funMatch=(s,t)=>{ return `  MatchingData ${s.size.myPadStart(10)} ${s.strMTimeR.padStart(19)}`; }
    var funUnique=s=>{ var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';        return `    ${s.strName}${strD}`; }
    var funUniqueC=s=>{var d=s.mtime_ns64-s.mtime_ns64R, strD=d?`\n        #(${s.strMTime})`:'';        return `    #${s.strName}${strD}`; }

    var ArrADup=[].concat(Mat1.ArrA[1][2],Mat1.ArrA[2][1],Mat1.ArrA[2][2]);
    var ArrBDup=[].concat(Mat1.ArrB[1][2],Mat1.ArrB[2][1],Mat1.ArrB[2][2])
    setBestNameMatchFirst(ArrADup, ArrBDup)


      // Sort by size
    ArrADup.forEach((el, i)=>el.ind=i); // Set index
    //var funInc=(a,b)=>a[0].size-b[0].size;
    var funDec=(a,b)=>b[0].size-a[0].size;
    var ArrAtmp=[...ArrADup].sort(funDec)
      // Create Ind
    var Ind=ArrAtmp.map(entry=>entry.ind)
    var ArrBtmp=eInd(ArrBDup, Ind)
    var StrDuplicateM=formatMatchingDataWDup(ArrAtmp, ArrBtmp, funMatch, funUnique, funUniqueC)


    var ArrADup=[].concat(Mat2.ArrA[1][2],Mat2.ArrA[2][1],Mat2.ArrA[2][2]);
    var ArrBDup=[].concat(Mat2.ArrB[1][2],Mat2.ArrB[2][1],Mat2.ArrB[2][2])
    setBestNameMatchFirst(ArrADup, ArrBDup)
    var StrDuplicateInitial=formatMatchingDataWDup(ArrADup, ArrBDup, funMatch, funUnique, funUniqueC)

    var ArrADup=[].concat(Mat3.ArrA[1][2],Mat3.ArrA[2][1],Mat3.ArrA[2][2]);
    var ArrBDup=[].concat(Mat3.ArrB[1][2],Mat3.ArrB[2][1],Mat3.ArrB[2][2])
    setBestNameMatchFirst(ArrADup, ArrBDup)
    var StrDuplicateFinal=formatMatchingDataWDup(ArrADup, ArrBDup, funMatch, funUnique, funUniqueC)


      // Leaf- vs Parent- changes 
    var [StrRenameAncestorOnly, StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed]=formatAncestorOnlyRenamed(this.arrAncestorOnlyRenamed, fiDb)
      
    var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, funMatch, funUnique)

      // Changed
    var funMatch=(s,t)=>`  MatchingData ${s.strName}`;
    var funUnique=s=>`    ${s.size.myPadStart(10)} ${s.strMTime}`
    var StrChanged=formatMatchingData(this.arrSourceMatchingStrName, this.arrTargetMatchingStrName, funMatch, funUnique)

      // Created/Deleted
    var StrCreated=[], nSourceRem=this.arrSourceRem.length;
    if(nSourceRem){
      var strTmp=`Remaining in source only (created): ${nSourceRem}`;  StrCreated.push('\n'+strTmp)
      for(var row of this.arrSourceRem) StrCreated.push(`${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    }
    var StrDeleted=[], nTargetRem=this.arrTargetRem.length
    if(nTargetRem){
      var strTmp=`Remaining in target only (deleted): ${nTargetRem}`;  StrDeleted.push('\n'+strTmp)
      for(var row of this.arrTargetRem) StrDeleted.push(`${row.size.myPadStart(10)} ${row.strMTime} ${row.strName}`)
    }

    // var [err, StrSum]=this.formatScreen(); if(err) return [err]
    // this.myResultWriter.Str["screen"]=StrSum
    // this.myResultWriter.Str["T2T_sum"]=StrSum
    //this.myResultWriter.Str["T2T_resultMore"]=this.formatResultMore()
    this.myResultWriter.Str["T2T_changed"]=StrChanged;
    this.myResultWriter.Str["T2T_created"]=StrCreated;
    this.myResultWriter.Str["T2T_deleted"]=StrDeleted;
    this.myResultWriter.Str["T2T_renamed"]=formatRename1T1(this.arrSource1To1, this.arrTarget1To1)
    this.myResultWriter.Str["T2T_ancestor"]=StrRenameAncestorOnly
    this.myResultWriter.Str["T2T_mult1"]=StrDuplicateM
    this.myResultWriter.Str["T2T_mult2"]=StrDuplicateInitial
    this.myResultWriter.Str["T2T_mult3"]=StrDuplicateFinal
    this.myResultWriter.Str["T2T_renamedAdditional"]=StrRenameAdditional
  }
}
    
