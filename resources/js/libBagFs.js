
"use strict"

var funSorterStrNameNeg=(a,b)=>{if(a.strName>b.strName) return 1; else if(a.strName<b.strName) return -1; return 0;};
var funSorterStrNameNegNeg=(a,b)=>{if(a.strName>b.strName) return -1; else if(a.strName<b.strName) return 1; return 0;};


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
    if(a=='/') iLastSlash=i
  }
  if(iLastSlash==null) return [null, null]  //, null
  return [strA.slice(0,iLastSlash), strB.slice(0,iLastSlash)]  //, strA[iLastSlash-1:]
}

//[strAO, strBO]=extractDivergingParents("aaa/bbb/ccc/ddd.txt","aaa/bxb/ccc/ddd.txt")
//[strAO, strBO]=extractDivergingParents("aaa/bbb/ccc/ddd.txt","aaa/bbb/ccc/dxd.txt")


// Ex: objAncestorOnlyRenamed={myFoldA:{myFoldB:[{"elA":rowA, "elB":rowB}, {"elA":rowA, "elB":rowB}]}}
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
    objAncestorOnlyRenamed[strParA][strParB].push({"elA":rowA, "elB":rowB})
  }
  return [n, objAncestorOnlyRenamed]  //, arrALeafRenamed, arrBLeafRenamed
}


// Ex: objAncestorOnlyRenamed={myFoldA:{myFoldB:[{"elA":rowA, "elB":rowB}, {"elA":rowA, "elB":rowB}]}}
// Ex: arrAncestorOnlyRenamed=[{"n":1, "lev":0, "keyA":"myFoldA", "keyB":"myFoldB", "arrRel":[{"elA":rowA, "elB":rowB}, {"elA":rowA, "elB":rowB}]} ]
var convertObjAncestorOnlyRenamedToArr=function(objAncestorOnlyRenamed, StrKey=["keyA","keyB"]){
  var arrAncestorOnlyRenamed=[]
  for(var keyA in objAncestorOnlyRenamed){
    var objInner=objAncestorOnlyRenamed[keyA]
    //var lev=keyA.count("/")
    var nSlash=(keyA.match(/\//g) || []).length, lev=nSlash;
    for(var keyB in objInner){
      var arrRel=objInner[keyB]
      var n=arrRel.length
      var objTmp={"n":n, "lev":lev, "arrRel":arrRel}
      objTmp[StrKey[0]]=keyA
      objTmp[StrKey[1]]=keyB
      arrAncestorOnlyRenamed.push(objTmp)
    }
  }
  return arrAncestorOnlyRenamed
}

var formatAncestorOnlyRenamed=function(arrAncestorOnlyRenamed, fiMeta, StrOrder=["keyA","keyB"]){
  var arrDisp=[], arrMv=[], arrSed=[]
  for(var row of arrAncestorOnlyRenamed){
    var n=row.n,  strSource=row[StrOrder[1]],  strTarget=row[StrOrder[0]]
    arrDisp.push(`RelevantAncestor (${n} file(s)):`) 
    arrDisp.push(`  ${strTarget}`)
    arrDisp.push(`  ${strSource}`)
    //boUseQuote=' ' in strTmp
    arrMv.push(`  # ${n} file(s):`) 
    arrMv.push(`mv  "${strTarget}" "${strSource}"`)
    arrSed.push(`sed -E 's/^( *[0-9]+ +[0-9a-f]+ +[0-9]+ +[0-9]+ +)${strTarget}(.*)/\\1${strSource}\\2/' ${fiMeta} > ${fiMeta}`)
  }
  return [arrDisp, arrMv, arrSed]
}

  // Moves "rows" (entries) from objAMetaMatch and objBMetaMatch to objAncestorOnlyRenamed and arrAIdd, arrBIdd
var extractExtraByFolder=function(objAMetaMatch, objBMetaMatch, objAncestorOnlyRenamed){
  var arrAIdd=[], arrBIdd=[]
  var objAMetaMatchWExtraIDing={}, objBMetaMatchWExtraIDing={}
  var objAncestorOnlyRenamedDiff={}
  for(var key in objAMetaMatch){
    var arrAMetaMatch=[].concat(objAMetaMatch[key])
    var arrBMetaMatch=[].concat(objBMetaMatch[key])
    objAMetaMatchWExtraIDing[key]=arrAMetaMatch; objBMetaMatchWExtraIDing[key]=arrBMetaMatch
    if(arrAMetaMatch.length==1 && arrBMetaMatch.length==1) continue
    //for j, rowA in reversed(list(enumerate(arrAMetaMatch))){
    for(var j=arrAMetaMatch.length-1;j>=0;j--){
      var rowA=arrAMetaMatch[j], strA=rowA.strName;
      //for k, rowB in reversed(list(enumerate(arrBMetaMatch))){
      for(var k=arrBMetaMatch.length-1;k>=0;k--){
        var rowB=arrBMetaMatch[k], strB=rowB.strName
        var [strParA, strParB]=extractDivergingParents(strA, strB)
        if(strParA==null) continue
        if(strParA in objAncestorOnlyRenamed && strParB in objAncestorOnlyRenamed[strParA]){
          arrAIdd.push(rowA); arrBIdd.push(rowB)
          //delete arrAMetaMatch[j]; delete arrBMetaMatch[k]
          arrAMetaMatch.splice(j,1); arrBMetaMatch.splice(k,1);
        }
        if(!(strParA in objAncestorOnlyRenamedDiff)) objAncestorOnlyRenamedDiff[strParA]={}
        if(!(strParB in objAncestorOnlyRenamedDiff[strParA])) objAncestorOnlyRenamedDiff[strParA][strParB]=[]
        objAncestorOnlyRenamedDiff[strParA][strParB].push({"elA":rowA, "elB":rowB}) 
      }
    }
  } 
  return [arrAIdd, arrBIdd, objAMetaMatchWExtraIDing, objBMetaMatchWExtraIDing]
}


var formatMatrix=function(Mat, nOTOAdd=0){
  var nPatOTO=Mat.ArrAOTO.length, nPatMTO=Mat.ArrAMTO.length, nPatOTM=Mat.ArrAOTM.length, nPatMTM=Mat.ArrAMTM.length, nPatOTNull=Mat.ArrAOTNull.length, nPatMTNull=Mat.ArrAMTNull.length, nPatNullTO=Mat.ArrBNullTO.length, nPatNullTM=Mat.ArrBNullTM.length

  var nOTO=Mat.arrAOTO.length, nAMTO=Mat.arrAMTO.length, nBMTO=Mat.arrBMTO.length, nAOTM=Mat.arrAOTM.length, nBOTM=Mat.arrBOTM.length, nAMTM=Mat.arrAMTM.length, nBMTM=Mat.arrBMTM.length, nAOTNull=Mat.arrAOTNull.length, nAMTNull=Mat.arrAMTNull.length, nBNullTO=Mat.arrBNullTO.length, nBNullTM=Mat.arrBNullTM.length
  var strNullTO=`${nBNullTO}`
  var strNullTM=`${nBNullTM}(ST:${nPatNullTM})`
  var strOTM=`${nAOTM}\\${nBOTM}`
  var strOTNull=`${nAOTNull}`
  var strMTNull=`${nAMTNull}(ST:${nPatMTNull})`
  var strMTO=`${nAMTO}\\${nBMTO}`
  var strMTM=`${nAMTM}\\${nBMTM}(ST:${nPatMTM})`
  if(nPatNullTO!=nBNullTO) {debugger; return [new Error("nPatNullTO!=nBNullTO")];}
  if(nPatOTNull!=nAOTNull) {debugger; return [new Error("nPatOTNull!=nAOTNull")];}
  if(nPatOTM!=nAOTM) {debugger; return [new Error("nPatOTM!=nAOTM")];}
  if(nPatMTO!=nBMTO) {debugger; return [new Error("nPatMTO!=nBMTO")];}
  var nFileChangedNDeleted=nBNullTO+nBNullTM
  var nPatChangedNDeleted=nBNullTO+nPatNullTM
  var strChangedNDeleted=`${nFileChangedNDeleted} (ST:${nPatChangedNDeleted})`
  var nFileChangedNCreated=nAOTNull+nAMTNull
  var nPatChangedNCreated=nAOTNull+nPatMTNull
  var strChangedNCreated=`${nFileChangedNCreated} (ST:${nPatChangedNCreated})`
  var strOut=`Source⇣ \\ Target⇢  Null          One         Many
Null ${"-".padStart(18)} ${strNullTO.padStart(12)} ${strNullTM.padStart(12)} ⇠Deleted+Changed: ${strChangedNDeleted}
One  ${strOTNull.padStart(18)} ${(nOTO+nOTOAdd).myPadStart(12)} ${strOTM.padStart(12)}
Many ${strMTNull.padStart(18)} ${strMTO.padStart(12)} ${strMTM.padStart(12)}
       Created+Changed⇡ ${strChangedNCreated}`
  return [null, strOut]
}


var formatMatchingDataWDup=function(ArrS, ArrT, boIno){
  var arrOut=[]
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    var {size, mtime, inode}=arrS[0]
    var strIno=boIno?inode.toString():""

    var strTmp=`  MatchingData ${strIno} ${size.myPadStart(10)} ${mtime.myPadStart(10)}`
    arrOut.push(strTmp)
    var boTDup=arrT.length>1,    boSDup=arrS.length>1
    var boAny=boTDup || boSDup

    if(!boTDup){
      if(boAny) arrOut.push('      # Target');
      arrOut.push("    "+arrT[0].strName)
    } else{
      arrOut.push('      # Targets');
      var boFirst=true
      for(var rowDup of arrT){
        var strComment=boFirst?" ":"#"; 
        arrOut.push('    '+strComment+rowDup.strName); boFirst=false
      }
    }
    if(!boSDup){
      if(boAny) arrOut.push('      # Source')
      arrOut.push("    "+arrS[0].strName)
    }
    else{
      arrOut.push('      # Sources')
      boFirst=true
      for(var rowDup of arrS){
        var strComment=boFirst?" ":"#"
        arrOut.push('    '+strComment+rowDup.strName); boFirst=false
      }
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



class ComparisonWOID{
  constructor( arrSource, arrTarget){
    this.arrSource=arrSource; this.arrTarget=arrTarget
  }
  
  compare(){
    var {arrSource, arrTarget}=this
      // Remove untouched files
    //var funSorterNeg=(a,b)=>a.strName.localeCompare(b.strName);
    arrSource=arrSource.sort(funSorterStrNameNeg);   arrTarget=arrTarget.sort(funSorterStrNameNeg)
    var [err, arrA, arrB, arrSourceTouched, arrTargetTouched]=extractMatching(arrSource, arrTarget, ['strName', 'size', 'mtime']); if(err) return [err]
    this.arrSourceUnTouched=arrA; this.arrTargetUnTouched=arrB

      // Rename (MetaMatch)
    var funSorterNeg=(a,b)=>a.size-b.size || a.mtime-b.mtime;
    arrSourceTouched=arrSourceTouched.sort(funSorterNeg);   arrTargetTouched=arrTargetTouched.sort(funSorterNeg)

    //var funST=function(rowA) {debugger; return rowA.size.toString()+rowA.mtime.toString()}
    var funST=function(rowA) { return rowA.st}
    var [objSourceMetaMatch, objTargetMetaMatch]=extractMatchingManyToManyF(arrSourceTouched, arrTargetTouched, funST)

    var [err, MatIni]=convertObjManyToManyToMat(objSourceMetaMatch, objTargetMetaMatch); if(err) return [err]
    extend(this, {MatIni})

      // Extract files not renamed in leaf 
    var [nAncestorOnlyRenamed, objAncestorOnlyRenamed]=summarizeAncestorOnlyRename(MatIni.arrAOTO, MatIni.arrBOTO)  //, arrSourceLeafRenamed, arrTargetLeafRenamed
    var arrAncestorOnlyRenamed=convertObjAncestorOnlyRenamedToArr(objAncestorOnlyRenamed, ['s', 't'])
    //arrAncestorOnlyRenamed=sorted(arrAncestorOnlyRenamed, key=lambda x: -x.n);   arrAncestorOnlyRenamed=sorted(arrAncestorOnlyRenamed, key=lambda x: -x.lev)
    var funSorterNeg=(a,b)=>b.n-a.n;
    arrAncestorOnlyRenamed=arrAncestorOnlyRenamed.sort(funSorterNeg);
    var funSorterNeg=(a,b)=>b.lev-a.lev;
    arrAncestorOnlyRenamed=arrAncestorOnlyRenamed.sort(funSorterNeg)
    extend(this, {arrAncestorOnlyRenamed, nAncestorOnlyRenamed})

      // From the files matching in st, find files that matches OTO-files that has only been renamed in ancestor.
      // Extract files Idd by ancestor folder from duplicates
    var [arrSourceIddByFolder, arrTargetIddByFolder, objSourceMetaMatchWExtraIDing, objTargetMetaMatchWExtraIDing]=extractExtraByFolder(objSourceMetaMatch, objTargetMetaMatch, objAncestorOnlyRenamed)
    extend(this, {arrSourceIddByFolder, arrTargetIddByFolder})

    objManyToManyRemoveEmpty(objSourceMetaMatchWExtraIDing, objTargetMetaMatchWExtraIDing)  // Modifies the arguments
    var [err, MatFin]=convertObjManyToManyToMat(objSourceMetaMatchWExtraIDing, objTargetMetaMatchWExtraIDing); if(err) return [err]
    extend(this, {MatFin})


        // Changed (NoMetaMatch with matching strName)
    //arrSourceNoMetaMatch=MatFin.arrARem.sort(funSorterStrNameNeg);   arrTargetNoMetaMatch=MatFin.arrBRem.sort(funSorterStrNameNeg)
    //var funSorterNeg=(a,b)=>a.strName.localeCompare(b.strName);
    var arrSourceNoMetaMatch=MatFin.arrARem.sort(funSorterStrNameNeg),   arrTargetNoMetaMatch=MatFin.arrBRem.sort(funSorterStrNameNeg)
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceNoMetaMatch, arrTargetNoMetaMatch, ['strName']); if(err) return [err]
    this.arrSourceMatchingStrName=arrA; this.arrTargetMatchingStrName=arrB

    //arrCreate, arrDelete = arrSourceRem, arrTargetRem
    extend(this, {arrSourceRem, arrTargetRem})
    return [null]
  }

  format(strCommandName, fsDir, fiMeta){
    var nSource=this.arrSource.length, nTarget=this.arrTarget.length
    var nUnTouched=this.arrSourceUnTouched.length
    var nMatchingStrName=this.arrSourceMatchingStrName.length
    var nSourceRem=this.arrSourceRem.length,  nTargetRem=this.arrTargetRem.length
    var {MatIni, MatFin}=this
    var nIddByFolder=this.arrSourceIddByFolder.length

    var StrScreen=[], StrResultFile=[], StrRenameOTO=[]; //StrRenameLeaf=[]; StrRenameAncestorOnly=[]; StrDuplicateInitial=[]; StrDuplicateFinal=[]

    var [err, strIni]=formatMatrix(MatIni); if(err) return [err]
    var ArrADup=[].concat(MatIni.ArrAOTM,MatIni.ArrAMTO,MatIni.ArrAMTM), ArrBDup=[].concat(MatIni.ArrBOTM,MatIni.ArrBMTO,MatIni.ArrBMTM)
    markRelBest(ArrADup, ArrBDup)
    var StrDuplicateInitial=formatMatchingDataWDup(ArrADup, ArrBDup, false)
    var lenOTO=MatIni.ArrAOTO.length,   lenOTM=MatIni.ArrAOTM.length,   lenMTO=MatIni.ArrAMTO.length,   lenMTM=MatIni.ArrAMTM.length

      // Leaf- vs Parent- changes 
    var [StrRenameAncestorOnly, StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed]=formatAncestorOnlyRenamed(this.arrAncestorOnlyRenamed, fiMeta, ["t", "s"])
    var StrRenameAncestorOnlyCmd=[].concat(StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed)
    if(StrRenameAncestorOnlyCmd.length) StrRenameAncestorOnlyCmd=["cd "+fsDir].concat(StrRenameAncestorOnlyCmd)


    var [err, strFin]=formatMatrix(MatFin, nIddByFolder); if(err) return [err]
    var ArrADup=[].concat(MatFin.ArrAOTM,MatFin.ArrAMTO,MatFin.ArrAMTM), ArrBDup=[].concat(MatFin.ArrBOTM,MatFin.ArrBMTO,MatFin.ArrBMTM)
    markRelBest(ArrADup, ArrBDup)
    var StrDuplicateFinal=formatMatchingDataWDup([].concat(MatFin.ArrAOTM,MatFin.ArrAMTO,MatFin.ArrAMTM), [].concat(MatFin.ArrBOTM,MatFin.ArrBMTO,MatFin.ArrBMTM), false)

    //var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, ['size', 'mtime'], ['strName'], '  MatchingData %10d %20d', '    %s')
    var funMatch=(s,t)=>`  MatchingData ${s.size.myPadStart(10)} ${s.mtime.myPadStart(20)}`,  funUnique=s=>`    ${s.strName}`
    var StrRenameAdditional=formatMatchingData(this.arrSourceIddByFolder, this.arrTargetIddByFolder, funMatch, funUnique)


      // Format OTO
    //var StrTmp=formatMatchingData(MatFin.arrAOTO, MatFin.arrBOTO, ['size', 'mtime'], ['strName'], '  MatchingData %10d %20d', '    %s')
    var funMatch=(s,t)=>`  MatchingData ${s.size.myPadStart(10)} ${s.mtime.myPadStart(20)}`,  funUnique=s=>`    ${s.strName}`
    var StrTmp=formatMatchingData(MatFin.arrAOTO, MatFin.arrBOTO, funMatch, funUnique)
    if(StrTmp.length) StrRenameOTO.push("# Rename (MetaMatch) one-to-one match of size and time")
    StrRenameOTO.push(...StrTmp)

    StrResultFile.push(`Result from running ${strCommandName}`)

    var strTmp=`Files in Source/Target: ${nSource}/${nTarget}`;    StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)
    var strTmp=`Untouched (Matching strName and ST (ST=size and time)): ${nUnTouched}`;    StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)

    var strTmp="Identification table: (after matching ST)";   StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)
    StrScreen.push(strIni);   StrResultFile.push(strIni)
    
    var StrTmp=[];
    StrTmp.push(`OTO files only renamed in folder: ${this.nAncestorOnlyRenamed}. (${this.arrAncestorOnlyRenamed.length} folders)`);
    StrScreen.push(...StrTmp);    StrResultFile.push("", ...StrTmp)

    if(nIddByFolder){
      var StrTmp=[];
      StrTmp.push(`${nIddByFolder} files can be futher be identified by looking at renamed folders.`);
      var lenOTO=MatFin.ArrAOTO.length,   lenOTM=MatFin.ArrAOTM.length,   lenMTO=MatFin.ArrAMTO.length,   lenMTM=MatFin.ArrAMTM.length

      StrScreen.push(...StrTmp);    StrResultFile.push("", ...StrTmp)

      var strTmp="Modified identification table after recategorizing files identified via renamed folders:";   StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)
      StrScreen.push(strFin);   StrResultFile.push(strFin)
    }

    var strDupExtra=ArrADup.length?" (others may be found among those with duplicate ST)":""
    var strTmp=`Changed (Matching strName): ${nMatchingStrName}${strDupExtra}`;  StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)
    //arrData=formatMatchingData(this.arrSourceMatchingStrName, this.arrTargetMatchingStrName, ['strName'], ['size', 'mtime'], '  MatchingData %s', '    %10d %10d')
    var funMatch=(s,t)=>`  MatchingData ${s.strName}`,  funUnique=s=>`    ${s.size.myPadStart(10)} ${s.mtime.myPadStart(10)}`
    var arrData=formatMatchingData(this.arrSourceMatchingStrName, this.arrTargetMatchingStrName, funMatch, funUnique)
    StrResultFile.push(...arrData)

    var strTmp=`Created: ${nSourceRem}${strDupExtra}`; StrScreen.push(strTmp);  StrResultFile.push('\n'+strTmp)
    for(var row of this.arrSourceRem) StrResultFile.push(row.size.myPadStart(10)+' '+row.mtime.myPadStart(10)+' '+row.strName)
    var strTmp=`Deleted: ${nTargetRem}${strDupExtra}`; StrScreen.push(strTmp);  StrResultFile.push('\n'+strTmp)
    for(var row of this.arrTargetRem) StrResultFile.push(row.size.myPadStart(10)+' '+row.mtime.myPadStart(10)+' '+row.strName)

    return [null, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional]
  }
}
    


class ComparisonWID{
  constructor(strIdType, arrSource, arrTarget){
    this.strIdType=strIdType; this.arrSource=arrSource; this.arrTarget=arrTarget
  }
  
  compare(){
    var {strIdType, arrSource, arrTarget}=this
        // Remove untouched files
    arrSource=arrSource.sort(funSorterStrNameNeg);   arrTarget=arrTarget.sort(funSorterStrNameNeg)
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSource, arrTarget, ['strName', strIdType, 'size', 'mtime']); if(err) return [err]
    this.arrSourceUnTouched=arrA; this.arrTargetUnTouched=arrB

        // Changed
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName', strIdType]); if(err) return [err]
    this.arrSourceChanged=arrA; this.arrTargetChanged=arrB

        // Rename (MetaMatch)
    //var funSorterNeg=(a,b)=>{if(a[strIdType]>b[strIdType]) return 1; else if(a[strIdType]<b[strIdType]) return -1; return 0;};
    var funSorterNeg=(a,b)=>a[strIdType]-b[strIdType]
    arrSourceRem=arrSourceRem.sort(funSorterNeg);   arrTargetRem=arrTargetRem.sort(funSorterNeg)
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, [strIdType, 'size', 'mtime']); if(err) return [err]
    this.arrSourceMetaMatch=arrA; this.arrTargetMetaMatch=arrB
    
    var [nAncestorOnlyRenamed, objAncestorOnlyRenamed]=summarizeAncestorOnlyRename(this.arrSourceMetaMatch, this.arrTargetMetaMatch)
    var arrAncestorOnlyRenamed=convertObjAncestorOnlyRenamedToArr(objAncestorOnlyRenamed, ['s', 't'])
    var funSorterNeg=(a,b)=>b.n-a.n;
    arrAncestorOnlyRenamed=arrAncestorOnlyRenamed.sort(funSorterNeg);
    var funSorterNeg=(a,b)=>b.lev-a.lev;
    arrAncestorOnlyRenamed=arrAncestorOnlyRenamed.sort(funSorterNeg)
    extend(this, {arrAncestorOnlyRenamed});

        // Copy renamed to origin
    arrSourceRem=arrSourceRem.sort(funSorterStrNameNeg);   arrTargetRem=arrTargetRem.sort(funSorterStrNameNeg)
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ["strName", 'size', 'mtime']); if(err) return [err]
    this.arrSourceNST=arrA; this.arrTargetNST=arrB

        // Matching id
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, [strIdType]); if(err) return [err]
    this.arrSourceMatchingId=arrA; this.arrTargetMatchingId=arrB

        // Matching strName
    arrSourceRem=arrSourceRem.sort(funSorterStrNameNeg);   arrTargetRem=arrTargetRem.sort(funSorterStrNameNeg)
    var [err, arrA, arrB, arrSourceRem, arrTargetRem]=extractMatching(arrSourceRem, arrTargetRem, ['strName']); if(err) return [err]
    this.arrSourceMatchingStrName=arrA; this.arrTargetMatchingStrName=arrB

        // Matching ST (Copy)
    //arrSourceRem=sorted(arrSourceRem, key=lambda x:(x.size, x.mtime));   arrTargetRem=sorted(arrTargetRem, key=lambda x:(x.size, x.mtime))
    //def funST(rowA): return str(rowA.size)+str(rowA.mtime)
    //var funST=function(rowA) {debugger; return rowA.size.myPad0(10)+rowA.mtime.myPad0(10)}
    //var [objSourceMetaMatch, objTargetMetaMatch]=extractMatchingManyToManyF(arrSourceRem, arrTargetRem, funST)

    extend(this,{arrSourceRem,arrTargetRem})
    return [null]
  }

  format( strCommandName, fsDir, fiMeta){
    var strIdType=this.strIdType
    var nSource=this.arrSource.length, nTarget=this.arrTarget.length
    var nUnTouched=this.arrSourceUnTouched.length
    var nChanged=this.arrSourceChanged.length
    var nMetaMatch=this.arrSourceMetaMatch.length
    var nNST=this.arrSourceNST.length
    var nMatchingId=this.arrSourceMatchingId.length
    var nMatchingStrName=this.arrSourceMatchingStrName.length
    var nSourceRem=this.arrSourceRem.length,  nTargetRem=this.arrTargetRem.length

      // Format info data
    var StrScreen=[], StrResultFile=[], StrRenameOTO=[], StrDuplicateInitial=[], StrDuplicateFinal=[], StrRenameAdditional=[]
    StrResultFile.push(`Result from running ${strCommandName}`)

    var strTmp=`Files in Source/Target: ${nSource}/${nTarget}`;    StrScreen.push(strTmp);   StrResultFile.push('\n'+strTmp)
    var strTmp=`                                  Matching meta data`;    StrScreen.push(strTmp)
    var strTmp=`    Categorized as:                ${strIdType}, strName, ST`;    StrScreen.push(strTmp)
    var strTmp=`Untouched                           ✔️      ✔️     ✔️ : ${nUnTouched}`;    StrScreen.push(strTmp);
    var strTmp=`Untouched: (Matching: ${strIdType}, strName, ST): ${nUnTouched}`;    StrResultFile.push(`\n`+strTmp)
    
    var strTmp=`Changed                             ✔️      ✔️     - : ${nChanged}`;    StrScreen.push(strTmp)
    var strTmp=`Changed: (Matching: ${strIdType}, strName, - ): ${nChanged}`;    StrResultFile.push(`\n`+strTmp)
    var funMatch=(s,t)=>"  MatchingData "+s[strIdType]+" "+s.strName,  funUnique=s=>"    "+s.size.myPadStart(10)+" "+s.mtime.myPadStart(20)
    var arrData=formatMatchingData(this.arrSourceChanged, this.arrTargetChanged, funMatch, funUnique)

    StrResultFile.push(...arrData)

    var strTmp=`Renamed                             ✔️      -     ✔️ : ${nMetaMatch}`;   StrScreen.push(strTmp)
    var strTmp=`Renamed: (Matching: ${strIdType},    -   , ST): ${nMetaMatch}`;   StrResultFile.push(`\n`+strTmp)
    //strTmp=`  Leafs: ${arrSourceLeafRenamed.length}`;   StrScreen.push(strTmp);   StrResultFile.push(strTmp)
    //StrRenameOTO.push("#All except duplicates")

    var funMatch=(s,t)=>`  MatchingData `+s[strIdType]+' '+s.size.myPadStart(10)+' '+s.mtime.myPadStart(20);
    var funUnique=s=>`    `+s.strName
    var StrTmp=formatMatchingData(this.arrSourceMetaMatch, this.arrTargetMetaMatch, funMatch, funUnique)
    StrRenameOTO.push(...StrTmp)

    var [StrRenameAncestorOnly, StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed]=formatAncestorOnlyRenamed(this.arrAncestorOnlyRenamed, fiMeta, ["t", "s"])
    var StrRenameAncestorOnlyCmd=[].concat(StrRenameAncestorOnlyMv, StrRenameAncestorOnlySed)
    if(StrRenameAncestorOnlyCmd.length) StrRenameAncestorOnlyCmd=["cd "+fsDir].concat(StrRenameAncestorOnlyCmd)

    var strTmp=`File copied, then renamed to origin -      ✔️     ✔️ : ${nNST}`;   StrScreen.push(strTmp)
    var strTmp=`File copied, then renamed to origin: (Matching:  -, strName, ST): ${nNST}`;   StrResultFile.push(`\n`+strTmp)
    var funMatch=(s,t)=>'  MatchingData '+s.strName+' '+s.size.myPadStart(10)+' '+s.mtime.myPadStart(20);
    var funUnique=s=>`    `+s[strIdType]
    var arrData=formatMatchingData(this.arrSourceNST, this.arrTargetNST, funMatch, funUnique)
    StrResultFile.push(...arrData)

    var strTmp=`Reused id (or renamed and changed)  ✔️      -     - : ${nMatchingId}`;   StrScreen.push(strTmp)
    var strTmp=`Reused id (or renamed and changed): (Matching: ${strIdType},    -   , - ): ${nMatchingId}`;   StrResultFile.push(`\n`+strTmp)
    var funMatch=(s,t)=>`  MatchingData `+s[strIdType],  funUnique=s=>'   '+s.size.myPadStart(10)+' '+s.mtime.myPadStart(20)+' '+s.strName
    var arrData=formatMatchingData(this.arrSourceMatchingId, this.arrTargetMatchingId, funMatch, funUnique)
    StrResultFile.push(...arrData)

    var strTmp=`Deleted+recreated                   -      ✔️     - : ${nMatchingStrName}`;  StrScreen.push(strTmp)
    var strTmp=`Deleted+recreated: (Matching:  - , strName, - ): ${nMatchingStrName}`;  StrResultFile.push(`\n`+strTmp)
    var funMatch=(s,t)=>`  MatchingData `+s.strName,  funUnique=s=>'    '+s[strIdType]+' '+s.size.myPadStart(10)+' '+s.mtime.myPadStart(20)
    var arrData=formatMatchingData(this.arrSourceMatchingStrName, this.arrTargetMatchingStrName, funMatch, funUnique)
    StrResultFile.push(...arrData)

    //strTmp=`Copy                                -      -     ✔️ : ${-1}`;   StrScreen.push(strTmp)

    var strTmp=`Created/Deleted (source/target)     -      -     - : ${nSourceRem}/${nTargetRem}`; StrScreen.push(strTmp);
    //strTmp=`WO any matching: ${nSourceRem}/${nTargetRem} (source(created)/target(deleted))`; StrResultFile.push('\n'+strTmp);
    var strTmp=`Created: ${nSourceRem}`; StrResultFile.push('\n'+strTmp)
    for(var row of this.arrSourceRem) StrResultFile.push(row[strIdType]+' '+row.size.myPadStart(10)+' '+row.mtime.myPadStart(10)+' '+row.strName)
    var strTmp=`Deleted: ${nTargetRem}`; StrResultFile.push('\n'+strTmp)
    for(var row of this.arrTargetRem) StrResultFile.push(row[strIdType]+' '+row.size.myPadStart(10)+' '+row.mtime.myPadStart(10)+' '+row.strName)
    
    var nSomeKindOfMatching=nUnTouched+nChanged+nMetaMatch+nNST+nMatchingId+nMatchingStrName
    var nSourceCheck=nSomeKindOfMatching+nSourceRem, nTargetCheck=nSomeKindOfMatching+nTargetRem
          // Checking the sums
    var boSourceOK=nSource==nSourceCheck, boTargetOK=nTarget==nTargetCheck
    var boBoth=boSourceOK && boTargetOK
    var strOK="OK", strNOK="NOK" // strOK="✔️"; strNOK="✗"
    var strNSourceMatch=boSourceOK?strOK:strNOK;
    var strNTargetMatch=boTargetOK?strOK:strNOK

    if(boBoth) var strCheck="OK (matching the numbers of files in source/target (seen above))"
    else var strCheck=`Source: ${nSourceCheck} (${strNSourceMatch}), Target: ${nTargetCheck} (${strNTargetMatch}) (when comparing to the number of files in source/target (seen above)`
    var strTmp=`                Checking the sums of the categories: ${strCheck}`;   StrScreen.push(strTmp)

    if(!boSourceOK || !boTargetOK){ var strTmp='!!ERROR the sums does not match with the number of files';  StrScreen.push(strTmp)}
    
    return [null, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd]
  }

  getCategoryArrays=function(){
    var {arrSourceUnTouched, arrTargetUnTouched,
    arrSourceChanged, arrTargetChanged,
    arrSourceMetaMatch, arrTargetMetaMatch,
    arrSourceNST, arrTargetNST,
    arrSourceMatchingId, arrTargetMatchingId,
    arrSourceMatchingStrName, arrTargetMatchingStrName,
    arrSourceRem, arrTargetRem}=this;
    return [arrSourceUnTouched, arrTargetUnTouched, arrSourceChanged, arrTargetChanged, arrSourceMetaMatch, arrTargetMetaMatch, arrSourceNST, arrTargetNST, arrSourceMatchingId, arrTargetMatchingId, arrSourceMatchingStrName, arrTargetMatchingStrName, arrSourceRem, arrTargetRem]
  }
}


