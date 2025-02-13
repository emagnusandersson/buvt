"use strict"






var FilePropMethods={
  boNew:{type:'bool'},
  strSide:{type:'string'},
  strType:{type:'string'},
  strHash:{type:'string'},
  strName:{type:'string'},
  id:{type:'string', toMatch:v=>v.padStart(10)},
  size:{type:'int', toMatch:v=>v.myPadStart(10)},
  mtime_ns64:{type:'int64'},
  mtime_ns64Floored:{type:'int64', toMatch:v=>v.toString().padStart(19)},
  //strMTimeFloored:{type:'int', toMatch:v=>v.padStart(19)},
}

var ObjKeyList={
  allTr:[['strType', 'mtime_ns64', 'id', 'size', 'strName']],
  allDb:[['strType', 'mtime_ns64', 'id', 'size', 'strName']],
  untouched:[['strType', 'mtime_ns64', 'strHash', 'id', 'size', 'strName']],
  created:[['strType', 'id', 'size', 'mtime_ns64', 'strName']],
  deleted:[['strType', 'id', 'size', 'mtime_ns64', 'strName']],
  db:[['strType', 'id', 'strHash', 'mtime_ns64', 'size', 'strName']],
  //dbI:[['strType', 'id', 'strHash', 'mtime_ns64', 'size', 'strName']],
}
var ObjKey={
  //'1T1':[['id', 'size', 'mtime_ns64Floored'], ['strSide', 'strType', 'mtime_ns64', 'strName']],
  'M1T1':[['size', 'mtime_ns64Floored', 'mtime_ns64'], ['strSide', 'strType', 'id', 'mtime_ns64', 'strName']],  //'strHash', 
  changed:[['strName'], ['strSide', 'strType', 'size', 'mtime_ns64']],
}


  // Note! Some lacking conformance regarding the callback (and its argument):
  //   formatRelation (The inputs are arrays of elements)
  //     callbacks called for each property (property names given in KeyM and KeyU)
  //   formatRelationCustom (The input is two-dimensional (an object of arrays (or array of arrays)))
  //     No callbacks
  //   formatRelation1T1 (The inputs are arrays of elements)
  //     one callback funMatch
  //     one callback funUnique 
  //   formatList (The input is an array of elements)
  //     callbacks called for each property (property names given in Key)
  //   formatListBundled (The input is two-dimensional (an object of arrays))
  //     one callback funMatch for the first element in every sub-array
  //     one callback funUnique for every sub-array-element

var formatRelation=function(ArrS, ArrT, KeyM, KeyU){ // Not used (Other than testing with M1T1)
  var nS=ArrS.length, nT=ArrT.length
  if(nS==0 && nT==0) return []
  var boArrInArr=false;
  if(nS && ArrS[0] instanceof Array) boArrInArr=true
  if(nT && ArrT[0] instanceof Array) boArrInArr=true
  var arrOut=[]

    // Add headers
  var StrT=[], StrN=[]
  for(var k of KeyM){ var {type, name}=FilePropMethods[k], t=type??'string', n=name??k; StrT.push(t); StrN.push(n); }
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  var StrT=[], StrN=[]
  for(var k of KeyU){ var {type, name}=FilePropMethods[k], t=type??'string', n=name??k; StrT.push(t); StrN.push(n); }
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  
    // Add data
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    if(!boArrInArr){arrS=[arrS]; arrT=[arrT];}
    const nT=arrT.length, nS=arrS.length
    if(nT==0 && nS==0) {debugger; continue;}
    //arrS.sort(funIncMTime);   arrT.sort(funIncMTime);

    // if(nS) {var s0=arrS[0], sE=arrS[nS-1], boSEq=s0.mtime_ns64==sE.mtime_ns64;} else var boSEq=true
    // if(nT) {var t0=arrT[0], tE=arrT[nT-1], boTEq=t0.mtime_ns64==tE.mtime_ns64;} else var boTEq=true
    // if(nS && nT) var bo0Eq=s0.mtime_ns64==t0.mtime_ns64; else var bo0Eq=true
    // var boAllEq=boSEq && boTEq && bo0Eq
    var rowHead=nS?arrS[0]:arrT[0]

    // var strMTimeExact=(boAllEq && rowHead.mtime_ns64!=rowHead.mtime_ns64Floored)?` ${rowHead.strMTime.padStart(19)}`:'seePrev'
    // var strLab=`MatchingData ${rowHead.size.myPadStart(10)} ${rowHead.strMTimeFloored.padStart(19)} ${strMTimeExact}`

    var StrT=[]
    for(var keyM of KeyM){ var f=FilePropMethods[keyM].toMatch, strV=rowHead[keyM]; if(f) strV=f(strV); StrT.push(strV); }
    StrT.unshift('MatchingData'); var strRow=StrT.join(' ')
    arrOut.push(strRow);

    var arrBoth=arrS.concat(arrT)

    for(var row of arrBoth){
      var StrT=[]
      for(var keyU of KeyU){ var f=FilePropMethods[keyU].toUnique, strV=row[keyU]; if(f) strV=f(strV); StrT.push(strV); }
      var strRow='  '+StrT.join(' ')
      arrOut.push(strRow);
    }
  }
  return arrOut
}

  // ArrS, ArrT are two-dimensional arrays
  // Each row contains an array of elements who matches (in some sense)
var formatRelationCustom=function(ArrS, ArrT){
  // More readable than formatRelation (with seePrev and seeAbove) (never read)
  // Used for `STMatch${k}_${i}${j}` and STMatch2 (And for testing with M1T1)

  var arrOut=[]
  for(var i in ArrS){
    var arrS=ArrS[i], arrT=ArrT[i]
    const nT=arrT.length, nS=arrS.length
    arrS.sort(funIncMTime);   arrT.sort(funIncMTime);

    var rowHead
    if(nS) {var s0=arrS[0], sE=arrS[nS-1], boSEq=s0.mtime_ns64==sE.mtime_ns64, rowHead=s0;} else var boSEq=true
    if(nT) {var t0=arrT[0], tE=arrT[nT-1], boTEq=t0.mtime_ns64==tE.mtime_ns64, rowHead=t0;} else var boTEq=true
    if(nS && nT) var bo0Eq=s0.mtime_ns64==t0.mtime_ns64; else var bo0Eq=true
    var boAllEq=boSEq && boTEq && bo0Eq

    var strMTimeExact=(boAllEq && rowHead.mtime_ns64!=rowHead.mtime_ns64Floored)?` ${rowHead.strMTime.padStart(19)}`:'seePrev'
    var strLab=`MatchingData ${rowHead.size.myPadStart(10)} ${rowHead.strMTimeFloored.padStart(19)} ${strMTimeExact}`
    arrOut.push(strLab);

    for(var row of arrS){
      var {strType, mtime_ns64, id}=row;
      var strM=boAllEq?"seeAbove":mtime_ns64.toString()
      arrOut.push(`  Tr ${strType} ${id} ${strM.padStart(19)} ${row.strName}`)
    }
    for(var row of arrT){
      var {strType, mtime_ns64, id}=row
      var strM=boAllEq?"seeAbove":mtime_ns64.toString()
      arrOut.push(`  Db ${strType} ${id} ${strM.padStart(19)} ${row.strName}`)
    }
  }

  var strHeadMT=`int string string`, strHeadM=`size strMTimeFloored strMTimeExact`;
  var strHeadUT=`string string string string string`, strHeadU=`strSide strType id strMTime strName`;
  if(arrOut.length) arrOut.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)

  return arrOut
}


var formatRelation1T1=function(arrA11, arrB11, boIdInMatch=true){
    // Unlike formatRelation and formatRelationCustom:
    //   it is read back by the software
    //   it contains the hash-code
  const len=arrA11.length
  arrA11.forEach((el, i)=>el.ind=i)
  var arrStmp=arrA11.toSorted(funIncStrName)

    // Create Ind
  var Ind=arrStmp.map(entry=>entry.ind)
  const arrTtmp=eInd(arrB11, Ind)

  var funMatch=(s,t)=>{
    var strId=boIdInMatch?` ${s.id}`:''
    return `MatchingData${strId} ${s.strHash} ${s.size.myPadStart(10)} ${s.strMTimeFloored.padStart(19)}`;
  }
  var funUnique=(s)=>{
    var strId=boIdInMatch?'':` ${s.id}`
    var d=s.mtime_ns64-s.mtime_ns64Floored, strD=d?`${s.strMTime}`:'seeAbove';
    return `  ${s.strSide} ${s.strType}${strId} ${strD} ${s.strName}`
  }
  //var arrData=formatMatchingData(arrStmp, arrTtmp, funMatch, funUnique)

  var arrData=[]
  for(var i=0;i<arrStmp.length;i++){
    var rowS=arrStmp[i], rowT=arrTtmp[i]
    arrData.push(funMatch(rowS,rowT))
    arrData.push(funUnique(rowS), funUnique(rowT))
  }

    // Using strMTime etc so that one can use expressions like "seeAbove" etc
  if(boIdInMatch){
    var strHeadMT=`string string int string`, strHeadM=`id strHash size strMTimeFloored`;
    var strHeadUT=`string string string string`, strHeadU=`strSide strType strMTime strName`;
  }else{
    var strHeadMT=`string int string`, strHeadM=`strHash size strMTimeFloored`;
    var strHeadUT=`string string string string string`, strHeadU=`strSide strType id strMTime strName`;
  }
  if(arrData.length) arrData.unshift(strHeadMT, strHeadM, strHeadUT, strHeadU)
  return arrData
}


var formatList=function(arr, Key){
  var n=arr.length
  if(n==0) return []
  var arrOut=[]

    // Add headers
  var StrT=[], StrN=[]
  for(var k of Key){ var prop=FilePropMethods[k], t=prop.type??'string', n=prop.name??k; StrT.push(t); StrN.push(n); } // ?? = nullish coalescing 
  var strT=StrT.join(' '), strN=StrN.join(' ');   arrOut.push(strT, strN);
  
    // Add data
  for(var i in arr){
    var row=arr[i]
    var StrT=[]
    for(var k of Key){ var f=FilePropMethods[k].toMatch, strV=row[k]; if(f) strV=f(strV); StrT.push(strV); }
    var strRow=StrT.join(' ')
    arrOut.push(strRow);
  }
  return arrOut
}

  // ObjA is an object where each "key", is the matching data, and each "val" is an array of the elements that measures to that data.
var formatListBundled=function(ObjA, funMatch, funUnique){
    // Headers should probably be added.
    // In most uses of the function, headers are added outside the function.
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


var formatDb=function(arrDb){ // Could possibly be simply replaced with formatList
  var tStart=unixNow()
  //'strType', 'id', 'strHash', 'mtime_ns64', 'size', 'strName'
  var StrOut=formatList(arrDb, ...ObjKeyList['db'])
  var strOut=StrOut.join('\n')

  var strTmp=unixNow()-tStart; console.log(`Time: ${strTmp}`);
  return strOut;
}
var formatDbQuick=function(arrDb){ // This one may be quicker than formatDb
  var tStart=unixNow()
  var nPadId=strOS=='linux'?10:20
  var StrOut=Array(arrDb.length)
    // Write fsDb
  for(var i in arrDb){
    var row=arrDb[i], {strType, id, strHash, strMTime, size, strName}=row;
    if(typeof strMTime=='undefined') strMTime=row.mtime_ns64.toString()
    StrOut[i]=`${strType} ${id.padStart(nPadId)} ${strHash.padStart(32)} ${strMTime} ${size.myPadStart(10)} ${strName}`
  }
  StrOut.unshift('string string string int64 int string', 'strType id strHash mtime_ns64 size strName')
  var strOut=StrOut.join('\n')

  var strTmp=unixNow()-tStart; console.log(`Time: ${strTmp}`);
  return strOut;
}


//
// Should this be a method of MatNxN ?!?!
//
var formatMultiPots=function(myResultWriter, Mat, k){
  Mat.ShortList=[]
  var ArrPot=[[0,2],[1,2],[2,0],[2,1],[2,2]]
  //var ArrPot=[[1,2],[2,1],[2,2]]
  for(var arrPot of ArrPot){
    var [i,j]=arrPot
    var ArrAMult=[].concat(Mat.ArrA[i][j]);
    var ArrBMult=[].concat(Mat.ArrB[i][j]);
    //setBestNameMatchFirst(ArrAMult, ArrBMult)
      // Sort by size
    var funVal=(a,b)=>b[0].size-a[0].size; // Dec
    //var funVal=(a,b)=>a[0].size-b[0].size; // Inc
    if(i && j){
      ArrAMult.forEach((el, ii)=>el.ind=ii); // Set index
      var ArrAtmp=ArrAMult.toSorted(funVal)
      var Ind=ArrAtmp.map(entry=>entry.ind),  ArrBtmp=eInd(ArrBMult, Ind)
    }else if(i){
      var ArrAtmp=ArrAMult.toSorted(funVal), ArrBtmp=ArrBMult
    }else{
      var ArrBtmp=ArrBMult.toSorted(funVal), ArrAtmp=ArrAMult
    }
    var StrDuplicateM=formatRelationCustom(ArrAtmp, ArrBtmp);
    myResultWriter.Str[`STMatch${k}_${i}${j}`]=StrDuplicateM
    // var StrT=StrDuplicateM.slice(0,nShortListMax);
    // if(StrDuplicateM.length>nShortListMax) StrT.push('⋮')
    // var strTmp=StrT.length?StrT.join('\n'):undefined;
    // Mat.ShortList[`${i}${j}`]=strTmp;
    Mat.ShortList[`${i}${j}`]=formatTitleStr(StrDuplicateM.slice(4))
  }
}





/*****************************************************************
 * parseRelations
*****************************************************************/
// The four first rows:
//   The type of MatchingData properties
//   The name of MatchingData properties
//   The type of unique properties
//   The name of unique properties
// funKey creates a key from the Matching-data-array (the array that comes from splitting (at space) the "MatchingData"-rows)
// funKeySub creates a subkey from the unique-data-array (the array that comes from splitting (at space) the other rows)
// Usage example:
// var [err, fsInpFile]=await myRealPath(fiInpFile); if(err) return [err]
// var [err, strData]=await readStrFile(fsInpFile); if(err) return [err]
// var [err, obj, Arr]=parseRelations(strData)

// obj={key0:{subKey0:[row, ...], ...}, ...}
// Arr={subKey0:[row, ...], ...}
var parseRelations=function(strData, boAssignObj=false, funKey=arr=>arr.join('_'), funKeySub=arr=>arr[0]){
  strData=strData.trim();  if(strData.length==0) return [null,{},{}]
  var arrInp=strData.split('\n'), n=arrInp.length;    
  if(n<4) return [Error("n<4")]
  var [strColTypeM, strColM, strColTypeU, strColU]=arrInp.slice(0, 4) // M=Matching, U=Unique
  var StrColTypeM=strColTypeM.trim().split(' '), StrColM=strColM.trim().split(' ')
  var StrColTypeU=strColTypeU.trim().split(' '), StrColU=strColU.trim().split(' ')

  arrInp=arrInp.slice(4); n=arrInp.length
  var nColM=StrColM.length, nSplitM=nColM-1, nColU=StrColU.length, nSplitU=nColU-1
  var obj={}, Arr={}
  for(var strRow of arrInp){
    strRow=strRow.trim()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    var indSpace=strRow.indexOf(" ")
    var strFirst=strRow.slice(0, indSpace)
    var strPost=strRow.slice(indSpace).trim()

    if(strFirst=="MatchingData"){
      var arrPartM=mySplit(strPost, /\s+/g, nSplitM), nPartM=arrPartM.length
      if(nPartM<nColM) {debugger; return [Error("nPartM<nColM")];}
      var key=funKey(arrPartM)
      if(boAssignObj) {
        if(!(key in obj)) obj[key]={}
        //if(!(key in objB)) objB[key]=[]
      }
      continue
    } else {
      var arrPartU=mySplit(strRow, /\s+/g, nSplitU), nPartU=arrPartU.length;
      if(nPartU<nColU) {debugger; return [Error("nPartU<nColU")];}
      
      var row={};
      for(var i in StrColM) { var strCol=StrColM[i], strType=StrColTypeM[i], val=funCast(strType, arrPartM[i]); row[strCol]=val; }
      for(var i in StrColU) { var strCol=StrColU[i], strType=StrColTypeU[i], val=funCast(strType, arrPartU[i]); row[strCol]=val; }

      var keySub=funKeySub(arrPartU);
      if(!(keySub in Arr)) Arr[keySub]=[];    Arr[keySub].push(row);
      if(boAssignObj) {
        if(!(keySub in obj[key])) obj[key][keySub]=[];    obj[key][keySub].push(row);
      }
    }
  }
  
  return [null, obj, Arr]
}

var funSetMTime=function(obj, charTRes, mtime_ns64){
  var {size}=obj
  if(typeof mtime_ns64=='undefined') {var {mtime_ns64}=obj} 
  if(typeof mtime_ns64=='string') {mtime_ns64=BigInt(mtime_ns64)}
  var strMTime=calcStrTime(mtime_ns64)
  var mtime_ns64Floored=floorMTime64(mtime_ns64, charTRes);
  var strMTimeFloored=calcStrTime(mtime_ns64Floored)
  var sm=createSM64(size, mtime_ns64Floored)
  extend(obj, {strMTime, strMTimeFloored, mtime_ns64, mtime_ns64Floored, sm})
}
var funSetMTimeArr=function(arr, charTRes){
  for(var obj of arr){ funSetMTime(obj, charTRes); }
}

var parseDb=function(strData){ //, charTRes
  var [err, arrDb]=parseSSVWType(strData); if(err) {debugger; return [err];}
  var nData=arrDb.length
  if(nData==0) return [null, arrDb]

  var strOSTypeDbFile=checkPathFormat(arrDb)
  if(strOSTypeDbFile=='linux' && strOS=='win32'){
    for(var obj of arrDb) obj.strName=obj.strName.replaceAll('/','\\')
  }
  else if(strOSTypeDbFile=='win32' && (strOS=='linux' || strOS=='darwin')){
    for(var obj of arrDb) obj.strName=obj.strName.replaceAll('\\','/')
  }

  //for(obj of arrDb){ obj.mtime_ns64=BigInt(obj.mtime);     delete obj.mtime; }
  //for(obj of arrDb){ funSetMTime(obj, charTRes); }
  //if(typeof charTRes!=undefined) funSetMTimeArr(arrDb, charTRes)
  return [null, arrDb]
}
var parseDbW=async function(arg){
  var {fsDb, strHost}=arg
  var [err, strData]=await readStrFileWHost(fsDb, strHost);
  if(err){    if(err.code==STR_ENOENT){err=null; strData=""} else{ debugger; return [err]}    }
  var [err, arrDb]=parseDb(strData); if(err) {debugger; return [err];}
  return [null, arrDb]
}
