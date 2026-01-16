
"use strict"

//import { stringSimilarity } from "string-similarity-js";  // type="module"
const stringSimilarity=require("string-similarity-js");  

// import bisect
// import copy
// from lib import *

  // Some cb functions for testing
var funStrShortest=function(rowA,rowB){
  var strA=rowA, l=strA.length, strB=rowB.substring(0, l);
  if(strA<strB) return 1
  else if(strA>strB) return -1
  else if(strA==strB) return 0
  else {debugger; throw Error("Error not lt, not gt and not equal???")}
}

/***************************************************************************************
 * [arrAMatching, arrBMatching, arrARem, arrBRem]=extractMatchingF(arrA, arrB, funM101): Comparing two arrays
 *   Inputs:
 *     arrA and arrB: Arrays. 
 *       arrA and arrB are strictly increasing (ascending) (That is: funM101(arrA[n],arrA[n+1]) is always 1).
 *     funM101: (function-Minus1-0-1) A function that compares two array elements (from arrA and arrB (see below)). The output of funM101(element0, element1) ∈ [-1,0,1] where
 *       -1: descending slope (element0 > element1)
 *        0: equal (element0 == element1)
 *        1: ascending slope (element0 < element1)
 *   The extractMatchingF-function compares the elements in arrA with elements in arrB and puts matching pairs in arrAMatching and arrBMatching (which will be of equal length). The remaining elements are equally put in containers arrARem and arrBRem
 ***************************************************************************************/

gThis.extractMatchingF=function(arrA, arrB, funM101){ // F means function
  var iA=0, iB=0
  var lenA=arrA.length, lenB=arrB.length
  var arrAMatching=[], arrBMatching=[]
  var arrARem=[], arrBRem=[]
  while(1){
    var boEndA=iA==lenA, boEndB=iB==lenB
    if(boEndA && !boEndB) {arrBRem=arrBRem.concat(arrB.slice(iB)); break}
    else if(!boEndA && boEndB) {arrARem=arrARem.concat(arrA.slice(iA)); break}
    else if(boEndA && boEndB) break
    var rowA=arrA[iA], rowB=arrB[iB]
    var intVal=funM101(rowA,rowB)
    if(intVal>0) {arrARem.push(rowA); iA+=1}        // The row exist in arrA but not in arrB
    else if(intVal<0) {arrBRem.push(rowB); iB+=1}   // The row exist in arrB but not in arrA
    else if(intVal==0) {arrAMatching.push(rowA); arrBMatching.push(rowB); iB+=1; iA+=1}
    else {throw Error("Error when comparing strings");}
  }
  return [arrAMatching, arrBMatching, arrARem, arrBRem]
}


/***************************************************************************************
 * extractMatching: (Wrapper for extractMatchingF)
 *   Works as extractMatchingF although each element is an object and the comparission is made using the object-properties given in KeyA and KeyB (which should be of equal length):
 *   Notation: X ∈ [A, B]
 *   Uniqueness: Object within arrX must be unique (with respect to they proprties in KeyX) (See example below).
 *   Sorted strictly ascendingly: The first key (within KeyX) that is different must be larger in the preceding element.
 *     So in other words, the elements of KeyX have falling priority.
 *   If KeyB is omitted, KeyA will be used in its place. 
 *   Ex: Assume KeyA=['m','n'] then
 *     arrA=[{m:0,n:0}, {m:0,n:0}] is NOT OK (Elements are not unique (nor strictly ascending))
 *     arrA=[{m:0,n:0}, {m:0,n:1}] is OK
 *     arrA=[{m:1,n:0}, {m:0,n:1}] is NOT OK (Elements are not ascending, because m has higher priority)
 *     arrA=[{m:0,n:1}, {m:1,n:0}] is OK
 *       
 ***************************************************************************************/

gThis.extractMatching=function(arrA, arrB, KeyA, KeyB=null){ // Wrapper of extractMatchingF
  if(KeyB==null) KeyB=KeyA
  var lenKeyA=KeyA.length,  lenKeyB=KeyB.length;  
  if(lenKeyA!=lenKeyB) {debugger; return [Error("lenKeyA!=lenKeyB")]} 
  if(lenKeyA==0 || lenKeyB==0)  {debugger; return [Error("lenKeyA==0 || lenKeyB==0")]}

  var funM101=function(rowA,rowB){
    for(var j=0;j<KeyA.length;j++){
      var keyA=KeyA[j],keyB=KeyB[j]
      var vA=rowA[keyA], vB=rowB[keyB];
      if(vA<vB) return 1
      else if(vA>vB) return -1
    }
    return 0
  }
  return [null, ...extractMatchingF(arrA, arrB, funM101)]
}

//extractMatchingF([3,6,9], [2,3,8], diffMy)


  // An arrA element may match multiple arrB elements (but not the other way around)
  // arrA may be unsorted (arrB must be sorted)
var extractMatchingOneToManyUnsortedF=function(arrA, arrB, funVal, funB, funExtra){
  var lenA=arrA.length, lenB=arrB.length
  var arrBWork=[].concat(arrB)
  var arrAMatching=[], arrBMatching=[]
  var arrARem=[];  // arrBRem=[]
  for(var rowA in arrA){
    var lenBWork=arrBWork.length
    //l=len(rowA['strOld']); x['strName'][:l]
    var valA=funVal?funVal(rowA):rowA
    var argExtra=funExtra(rowA)
    var iBStart = my_bisect_left(arrBWork, valA, 0, lenBWork, key=funB, argExtra=argExtra)
    var iBEnd = my_bisect_right(arrBWork, valA, iBStart, lenBWork, key=funB, argExtra=argExtra)
    if(iBStart!=iBEnd){
      arrAMatching.push(rowA);
      //debugger;
      arrBMatching=arrBMatching.concat(arrBWork.slice(iBStart,iBEnd));
      arrBWork=[].concat(arrBWork.slice(0,iBStart), arrBWork.slice(iBEnd)); // I think this line is better than the above, (although not tested)
    }
    else arrARem.push(rowA);
  }
  var arrBRem=arrBWork
  return [arrAMatching, arrBMatching, arrARem, arrBRem]
}
  
// l=len()
// def fun(x): return x['strName'][:l]

var extractMatchingOneToManyUnsortedFW=function(arrA, arrB, funVal, funB, funExtra){
  var [arrAMatching, arrBMatching, arrARem, arrBRem]=extractMatchingOneToManyUnsortedF(arrA, arrB, funVal, funB, funExtra);
  var arrAMatchingMod=[], arrBMatchingMod=[];
  for(var i=0;i<arrAMatching.length;i++){
    var row=arrAMatching[i];
    var rowB=arrBMatching[i], l=rowB.length
    // arrAMatchingMod.extend([row]*l)
    // arrBMatchingMod.extend(rowB)
    arrAMatchingMod.push(...Array(l).fill(row)); // !!!!! Spread operator may cause stackoverflow is l is large
    arrBMatchingMod.push(rowB)
  }
  return [arrAMatchingMod, arrBMatchingMod, arrARem, arrBRem]
}


// Note 1!! The below test fails (in python): funB is called with three arguments in my_bisect_left/my_bisect_right
// Note 2!! extractMatchingOneToManyUnsortedF is only used in renameFinishToDbByFolder (which is not used in any launch.json-commands)

// var funB=function(strB, l) {return strB.slice(0,l)}
// var funExtra=function(strA) {return strA.length}
// [arrRenameMatch, arrDbMatch, arrRenameRem, arrDbRem]=extractMatchingOneToManyUnsortedFW(["qrs", "aa","progC"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], null, funB, funExtra)



  // An arrA element  may match multiple arrB elements (but not the other way around)
  // arrA and arrB must both be sorted
var extractMatchingOneToManyF=function(arrA, arrB, fun){
  var iA=0, iB=0
  var lenA=arrA.length, lenB=arrB.length
  
  var arrAMatching=[], arrBMatching=[]
  var arrARem=[], arrBRem=[]
  while(1){
    var boEndA=iA==lenA, boEndB=iB==lenB
    if(boEndA && !boEndB) {arrBRem=arrBRem.concat(arrB.slice(iB)); break}
    else if(!boEndA && boEndB){arrARem=arrARem.concat(arrA.slice(iA)); break}
    else if(boEndA && boEndB) break

    var rowA=arrA[iA], rowB=arrB[iB]
    var intVal=fun(rowA,rowB)
    if(intVal>0) {arrARem.push(rowA); iA+=1}     // B is ahead of A
    else if(intVal<0) {arrBRem.push(rowB); iB+=1}   // A is ahead of B
    else if(intVal==0) {arrAMatching.push(rowA); arrBMatching.push(rowB); iB+=1;} //iA+=1
    else {debugger; return [Error("Error when comparing strings")]; }
  }
    
  return [null, arrAMatching, arrBMatching, arrARem, arrBRem]
}

// Note! as it is never used it is untested
//extractMatchingOneToManyF(["aa","progC","qrs"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], funStrShortest)



/***********************************************************
 * categorizeByProp
 ***********************************************************/
  // Inputs:
  //   arrA and arrB are arrays of objects. Ex: arrA=[{a:1,b:1}, {a:1,b:1}] 
  //   arrA and arrB must both be sorted non-decreasingly: meaning when calling "funVal" on each array-element, you get non-decreasing values (two consecutive elments may be equal, but not decrease).
  //   funVal takes an element as input and outputs a (sortable) value.
  // Output:
  //   objMatching:
  //     Elements from arrA resp. arrB that gets the value v when passed through the funVal, are collected in objMatching[v].arrA resp. objMatching[v].arrB.

  // Ex: Assume two arrays of objects, the object must have the property "a" (as funVal requires it)
  // var arrA=[{a:1,b:1}, {a:1,b:2}, {a:2}];
  // var arrB=[{a:1,b:1}, {a:1,b:3}, {a:3}];
  // var funVal=obj=>obj.a
  // var objMatching=categorizeByProp(arrA, arrB, funVal)
  // objAMatching={
  //   "1":{arrA:[{a:1,b:1}, {a:1,b:2}], arrB:[{a:1,b:1}, {a:1,b:3}]}, 
  //   "2":{arrA:[{a:2}], arrB:[]}, 
  //   "3":{arrA:[], arrB:[{a:3}]}
  // }

var categorizeByProp=function(arrA, arrB, funVal){
  var objMatching={};
  var Arr=[arrA,arrB], Str=['arrA','arrB']
  for(var j=0;j<2;j++){
    var arr=Arr[j], len=arr.length, strTmp=Str[j]
    for(var i=0;i<len;i++){
      var obj=arr[i]
      var val=funVal(obj)
      if(!(val in objMatching)) objMatching[val]={arrA:[],arrB:[]}
      objMatching[val][strTmp].push(obj)
    }
  }
  return objMatching
}

// debugger
// var a=categorizeByProp([3,6,9], [2,3,8], x=>x)
// var a=categorizeByProp([3,6,9], [2,3,3,8], x=>x)
// var a=categorizeByProp([1,3,3,6,9], [2,3,3], x=>x)
// var a=categorizeByProp(["aa","progC","qrs"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], x=>x)



// var BundA= bundleOnProperty([{a:1}, {a:1}, {a:2}, {a:3}], "a")
//   BundA: {"1":[{a:1},{a:1}], "2":[{a:2}], "3":[{a:3}]}
var bundleOnProperty=function(arr, arg){
  var boFun=typeof arg=='function'
  if(boFun){ var fun=arg;}
  else{ var Key=arg instanceof Array?arg:[arg] }
  var Bund={}
  var lenArr=arr.length
  for(var i=0;i<lenArr;i++){
    var row=arr[i];
      // Create strKey
    if(boFun) var strKey=fun(row);
    else{
      var strKey=""
      for(var k of Key){
        var attr=row[k];
        strKey+=attr.toString();
      }
    }
    if(strKey in Bund) Bund[strKey].push(row);  else Bund[strKey]=[row];
  }
  return Bund
}

var extractBundlesWMultiples=function(Bund){ // bundleOnProperty Multple Summary
  var BundMult={}, nMult=0, arrSingle=[]
  for(var k in Bund) {
    var arr=Bund[k], l=arr.length;
    if(l>1) {BundMult[k]=arr; nMult+=l;} 
    else if(l==1){arrSingle.push(arr[0])} 
    else {throw Error(`l==${l}`)}
  }
  return [BundMult, nMult, arrSingle]
}
// var Bund=bundleOnProperty(arrA, Key),  nPat=Object.keys(Bund).length
// var [BundMult, nMult]=extractBundlesWMultiples(Bund),  nPatMult=Object.keys(BundMult).length;


var objManyToManyRemoveEmpty=function(objA, objB){  // Modifies objA and objB
  var KeyDel=[]
  for(var key in objA){
    var arrA=objA[key], arrB=objB[key], lenA=arrA.length, lenB=arrB.length;
    if(lenA==0 && lenB==0) KeyDel.push(key)
  }
  for(var key of KeyDel){
    delete objA[key]; delete objB[key]
  }
}

  //
  // MatNxN
  // (test code (example) below)
  //

class MatNxN{
  constructor(){
    var ArrA=[[[],[],[]],[[],[],[]],[[],[],[]]]
    var ArrB=[[[],[],[]],[[],[],[]],[[],[],[]]]
    var arrA=[[[],[],[]],[[],[],[]],[[],[],[]]]
    var arrB=[[[],[],[]],[[],[],[]],[[],[],[]]]
    extend(this, {ArrA, ArrB, arrA, arrB})
  }
  assignFromObjManyToMany(objIn){
    this.nKTmp=Object.keys(objIn).length
    var {ArrA, ArrB, arrA, arrB}=this

    var [       ,ArrA01,ArrA02]=ArrA[0]
    var [ArrA10,ArrA11,ArrA12]=ArrA[1]
    var [ArrA20,ArrA21,ArrA22]=ArrA[2]
    var [       ,ArrB01,ArrB02]=ArrB[0]
    var [ArrB10,ArrB11,ArrB12]=ArrB[1]
    var [ArrB20,ArrB21,ArrB22]=ArrB[2]

    var [       ,arrA01,arrA02]=arrA[0]
    var [arrA10,arrA11,arrA12]=arrA[1]
    var [arrA20,arrA21,arrA22]=arrA[2]
    var [       ,arrB01,arrB02]=arrB[0]
    var [arrB10,arrB11,arrB12]=arrB[1]
    var [arrB20,arrB21,arrB22]=arrB[2]


    for(var key in objIn){
      var {arrA:arA, arrB:arB}=objIn[key];
      
      var nA=arA.length, nB=arB.length
      if(nA==0){
        if(nB==0) {debugger; throw Error("nA==0 && nB==0"); }
        else if(nB==1) {ArrA01.push(arA); ArrB01.push(arB); arrA01.push(...arA); arrB01.push(...arB);} // ArrA01 and arrA01 will never have entries added
        else {ArrA02.push(arA); ArrB02.push(arB); arrA02.push(...arA); arrB02.push(...arB);} // ArrA02 and arrA02 will never have entries added
      } else if(nA==1){
        if(nB==0) {ArrA10.push(arA); ArrB10.push(arB); arrA10.push(...arA); arrB10.push(...arB)} // ArrB10 and arrB10 will never have entries added
        else if(nB==1) {ArrA11.push(arA); ArrB11.push(arB);    arrA11.push(...arA); arrB11.push(...arB)}
        else {ArrA12.push(arA); ArrB12.push(arB);    arrA12.push(...arA); arrB12.push(...arB)}
      } else{
        if(nB==0) {ArrA20.push(arA); ArrB20.push(arB);  arrA20.push(...arA); arrB20.push(...arB);} // ArrB20 and arrB20 will never have entries added
        else if(nB==1) {ArrA21.push(arA); ArrB21.push(arB);    arrA21.push(...arA); arrB21.push(...arB)}
        else {ArrA22.push(arA); ArrB22.push(arB);    arrA22.push(...arA); arrB22.push(...arB)}
      }
    }

    extend(this, {ArrA, ArrB, arrA, arrB})
  }
  getN(){
    var NPat=[Array(3),Array(3),Array(3)]
    var NA=[Array(3),Array(3),Array(3)]
    var NB=[Array(3),Array(3),Array(3)]
    var {ArrA, ArrB, arrA, arrB}=this;
    var nPat=0, nA=0, nB=0, nAPat=0, nBPat=0
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        var nPatT=ArrA[i][j].length;
        NPat[i][j]=nPatT; 
        nPat+=nPatT;
        var nPatAT=i>0?nPatT:0; //if(i==0) nPatAT=0;
        var nPatBT=j>0?nPatT:0; //if(j==0) nPatBT=0;
        nAPat+=nPatAT
        nBPat+=nPatBT

        NA[i][j]=arrA[i][j].length
        NB[i][j]=arrB[i][j].length
        nA+=NA[i][j]
        nB+=NB[i][j]
      }
    }

    var [,nPatY01,nPatY02]=NPat[0]
    var [nPatY10,nPatY11,nPatY12]=NPat[1]; // Y = A or B
    var [nPatY20,nPatY21,nPatY22]=NPat[2]

    // var nPat01=nPatY01, nPat02=nPatY02
    // var nPat10=nPatY10, nPat11=nPatY11, nPat12=nPatY12
    // var nPat20=nPatY20, nPat21=nPatY21, nPat22=nPatY22

    var [nA10,nA11,nA12]=NA[1]
    var [nA20,nA21,nA22]=NA[2]
    var [,nB01,nB02]=NB[0]
    var [,nB11,nB12]=NB[1]
    var [,nB21,nB22]=NB[2]

    if(nA11!=nB11) {debugger; return [Error("nA11!=nB11")];  }

    if(nPatY01!=nB01) {debugger; return [Error("nPatY01!=nB01")];}
    if(nPatY10!=nA10) {debugger; return [Error("nPatY10!=nA10")];}
    if(nPatY12!=nA12) {debugger; return [Error("nPatY12!=nA12")];}
    if(nPatY21!=nB21) {debugger; return [Error("nPatY21!=nB21")];}
    //var objDetail={nPatY10,nPatY11,nPatY12,nPatY20,nPatY21,nPatY22, nPatY01,nPatY02,nPatY11,nPatY12,nPatY21,nPatY22,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB12,nB21,nB22}
    var objDetail={nPatY11,nPatY12,nPatY21,nPatY22, nPatY10,nPatY20,nPatY01,nPatY02,  nA10,nA11,nA12,nA20,nA21,nA22,  nB01,nB02,nB11,nB12,nB21,nB22}

    return {NPat, NA, NB, nPat, nAPat, nBPat, nA, nB, objDetail} //, NAPat, NBPat

  }
  shallowCopy(){
    var MatN=new MatNxN()
    var {ArrAN, ArrBN, arrAN, arrBN}=MatN; 
    var {ArrA, ArrB, arrA, arrB}=this;
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        var arrN=ArrAN[i][j], arrO=ArrA[i][j]
        for(var k=0;k<arrO.length;k++){ arrN[k]=arrO[k]; }
        var arrN=ArrBN[i][j], arrO=ArrB[i][j]
        for(var k=0;k<arrO.length;k++){ arrN[k]=arrO[k]; }
        var arrN=arrAN[i][j], arrO=arrA[i][j]
        for(var k=0;k<arrO.length;k++){ arrN[k]=arrO[k]; }
        var arrN=arrBN[i][j], arrO=arrB[i][j]
        for(var k=0;k<arrO.length;k++){ arrN[k]=arrO[k]; }
      }
    }
    return MatN
  }
  setMTMLabel(){ // Set many to many label
    var {ArrA, ArrB}=this;
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        var ArrAij=ArrA[i][j], ArrBij=ArrB[i][j]
        for(var k=0;k<ArrAij.length;k++){
          var arr=ArrAij[k]; 
          for(var l=0;l<arr.length;l++){ var obj=arr[l]; obj.strMTMLab=`${i}${j}`; }
          var arr=ArrBij[k]; 
          for(var l=0;l<arr.length;l++){ var obj=arr[l]; obj.strMTMLab=`${i}${j}`; }
        }
      }
    }
  }
  toObjManyToMany(funVal){
    var {ArrA, ArrB}=this;
    var ArrAT=[], ArrBT=[]
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        var ArrAij=ArrA[i][j],  ArrBij=ArrB[i][j]
        for(var k=0;k<ArrAij.length;k++){
          ArrAT.push(ArrAij[k]);  ArrBT.push(ArrBij[k])
        }
      }
    }
    
    var nPatA=ArrAT.length, nPatB=ArrBT.length, nPat=nPatA
    if(nPatA!=nPatB) {debugger; return [Error("nPatA!=nPatB")];}
    var K=Array(nPat)
    for(var i=0;i<nPat;i++){
      var rowA=ArrAT[i][0], rowB=ArrBT[i][0]
      var row=rowA||rowB
      var k=funVal(row); K[i]=k;
    }
    var objAOut=createObjFrKNV(K, ArrAT)
    var objBOut=createObjFrKNV(K, ArrBT)
    return [objAOut, objBOut]
  }
}

// Test code:
// var funVal=row=>row.a
// var arrA=[{a:1,b:1}, {a:1,b:2}, {a:2}, {a:2}, {a:3}]
// var arrB=[{a:1,b:1}, {a:1,b:3}, {a:2}, {a:2}, {a:4}]
// var Relation=categorizeByProp(arrA, arrB, funVal)

// var MatTmp=new MatNxN()
// MatTmp.assignFromObjManyToMany(Relation);
// var [objAOut, objBOut]=MatTmp.toObjManyToMany(funVal)
// debugger

// So the input is:
// objA={
//   "1":[{'a': 1, 'b': 1}, {'a': 1, 'b': 2}],
//   "2":[{'a': 2}, {'a': 2}],
//   "3":[{'a': 3}],
//   "4":[]
// }
// objB={
//   "1":[{'a': 1, 'b': 1}, {'a': 1, 'b': 3}],
//   "2":[{'a': 2}, {'a': 2}],
//   "3":[],
//   "4":[{'a': 4}]
// }

// Internal values in MatNxN (ArrA, ArrB, arrA and arrB (ij-indexes wo hook-paranthesis)):
// ArrA00:[]
// ArrA01:[[]]
// ArrA02:[]
// ArrA10:[[{'a': 3}]]
// ArrA11:[]
// ArrA12:[]
// ArrA20:[]
// ArrA21:[]
// ArrA22:[[{'a': 1, 'b': 1}, {'a': 1, 'b': 2}], [{'a': 2}, {'a': 2}]]
// ArrB00:[]
// ArrB01:[[{'a': 4}]]
// ArrB02:[]
// ArrB10:[[]]
// ArrB11:[]
// ArrB12:[]
// ArrB20:[]
// ArrB21:[]
// ArrB22:[[{'a': 1, 'b': 1}, {'a': 1, 'b': 3}],[{'a': 2}, {'a': 2}]]

// arrA00:[]
// arrA01:[]
// arrA02:[]
// arrA10:[{'a': 3}]
// arrA11:[]
// arrA12:[]
// arrA20:[]
// arrA21:[]
// arrA22:[{'a': 1, 'b': 1}, {'a': 1, 'b': 2}, {'a': 2}, {'a': 2}]
// arrB00:[]
// arrB01:[{'a': 4}]
// arrB02:[]
// arrB10:[]
// arrB11:[]
// arrB12:[]
// arrB20:[]
// arrB21:[]
// arrB22:[{'a': 1, 'b': 1}, {'a': 1, 'b': 3}, {'a': 2}, {'a': 2}]


// Dimensions:
//   Notations: X,Y={0,1,2} 
//   ArrA and ArrB are 4-dimensional array (into which objects are stored)
//     or ArrAxy, ArrBxy are 2-dimensional
//     (each element of ArrAxy, ArrBxy correspond to the key that was used in the comparission)
//   arrA and arrB are 3-dimensional array (into which objects are stored)
//     or arrAxy, arrBxy are 1-dimensional
//     (each element of arrAxy, arrBxy is an object)
// ArrAxy.length==ArrBxy.length ∀ x∈X, y∈Y
// ArrAxyz.length ∀ x∈X,y∈Y,z∈Z where Z=the elements in ArrAxy
//   ⎧ArrA00z.length ArrA01z.length ArrA02z.length⎫   ⎧0              0              0             ⎫
//   |ArrA10z.length ArrA11z.length ArrA12z.length| = |1              1              1             |
//   ⎩ArrA20z.length ArrA21z.length ArrA22z.length⎭   ⎩ArrA20z.length ArrA21z.length ArrA22z.length⎭
// ArrBxyz.length ∀ x∈X,y∈Y,z∈Z where Z=the elements in ArrBxy
//   ⎧ArrB00z.length ArrB01z.length ArrB02z.length⎫   ⎧0 1 ArrB02z.length⎫
//   |ArrB10z.length ArrB11z.length ArrB12z.length| = |0 1 ArrB12z.length|
//   ⎩ArrB20z.length ArrB21z.length ArrB12z.length⎭   ⎩0 1 ArrB12z.length⎭
// arrAxy.length ∀ x∈X,y∈Y,z∈Z where Z=the elements in ArrAxy
//   ⎧arrA00.length arrA01.length arrA02.length⎫   ⎧0                 0                 0                ⎫
//   |arrA10.length arrA11.length arrA12.length| = |ArrA10.length     ArrA11.length     ArrA12.length    |
//   ⎩arrA20.length arrA21.length arrA22.length⎭   ⎩∑(ArrA20z.length) ∑(ArrA21z.length) ∑(ArrA22z.length)⎭
//     (sums are over Z)
// arrBxy.length ∀ x∈X,y∈Y,z∈Z where Z=the elements in ArrBxy
//   ⎧arrB00.length arrB01.length arrB02.length⎫   ⎧0 ArrB01.length ∑(ArrB02z.length)⎫
//   |arrB10.length arrB11.length arrB12.length| = |0 ArrB11.length ∑(ArrB12z.length)|
//   ⎩arrB20.length arrB21.length arrB22.length⎭   ⎩0 ArrB21.length ∑(ArrB22z.length)⎭
//     (sums are over Z)



// 
// String similarity (goolged: javascript string similarity) found this: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
//


function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


var setBestNameMatchFirst=function(ArrA, ArrB){
  for(var i in ArrA){
    var arrA=ArrA[i], arrB=ArrB[i], lenA=arrA.length, lenB=arrB.length
    var jBest=-1, kBest=-1, fitBest=0
    for(var j in arrA){
      var elA=arrA[j], strNameA=elA.strName
      //bestAByB=[None]*lenB
      for(var k in arrB){
        var elB=arrB[k], strNameB=elB.strName
        //var rat=similarity(strNameA, strNameB)
        var rat=stringSimilarity.stringSimilarity(strNameA, strNameB, 2, true) 
        if(rat>fitBest) {fitBest=rat; jBest=j; kBest=k}
      }
    }
    // if(jBest>0) {var elABest=arrA.pop(jBest);  arrA.insert(0, elABest)}
    // if(kBest>0) {var elBBest=arrB.pop(kBest);  arrB.insert(0, elBBest)}
    if(jBest>0) {var arrTmp=arrA.splice(jBest,1);  arrA.unshift(arrTmp[0])}
    if(kBest>0) {var arrTmp=arrB.splice(kBest,1);  arrB.unshift(arrTmp[0])}
  }
}



var rearrangeByBestNameMatch=function(relation){ 
  var funSortDec=(a,b)=>{ var aa=a.rat, bb=b.rat; return (aa < bb) ? 1 : ((aa > bb) ? -1 : 0) } // (decreasing)
  var {arrA,arrB}=relation
  var lenA=arrA.length, lenB=arrB.length
  if(lenA==0 || lenB==0) return 0;
  var FitVal=Array(lenA*lenB), nExactName=0
  for(var i=0;i<lenA;i++){
    var elA=arrA[i], strNameA=elA.strName
    for(var j=0;j<lenB;j++){
      var elB=arrB[j], strNameB=elB.strName
      //var rat=similarity(strNameA, strNameB)
      var rat=stringSimilarity.stringSimilarity(strNameA, strNameB, 2, true) 
      FitVal[i*lenB+j]={i,j,rat}
      if(rat===1) nExactName++
    }
  }

  FitVal.sort(funSortDec);
  var BoTakenA=Array(lenA), BoTakenB=Array(lenB)
  //var cA=0, cB=0
  //var arrAN=Array(lenA), arrBN=Array(lenB)
  var arrAN=[], arrBN=[], lMin=Math.min(lenA,lenB)
    // Add first lMin elements (those for which a pair can be accomplished)
  for(var k=0; k<lMin; k++){
    var {i,j,rat}=FitVal[k];
    if(BoTakenA[i] || BoTakenB[j]) {continue}
    BoTakenA[i]=true;  BoTakenB[j]=true
    arrAN.push(arrA[i]); arrBN.push(arrB[j]);
  }
    // Add the remainders
  if(arrAN.length<lenA){
    for(var kk=0;kk<lenA;kk++) {
      if(!BoTakenA[kk]) {arrAN.push(arrA[kk]); if(arrAN.length==lenA) break;}
    }
  }
  if(arrBN.length<lenB){
    for(var kk=0;kk<lenB;kk++) {
      if(!BoTakenB[kk]) {arrBN.push(arrB[kk]); if(arrBN.length==lenB) break;}
    }
  }

    // Replace arrA, arrB with arrAN, arrBN, they reference the same elements, just in an other order.
  for(var i in arrA){ arrA[i]=arrAN[i];}
  for(var j in arrB){ arrB[j]=arrBN[j];}
  // arrA.length=0; arrB.length=0
  // arrA.push(...arrAN); arrB.push(...arrBN)  
  return nExactName
}
// var arrA=[{strName:'abc'}, {strName:'abcd'}, {strName:'abce'}, {strName:'0abcf'}]
// var arrB=[{strName:'abcg'}, {strName:'abcd'}, {strName:'abce'}, {strName:'abcfo'}, {strName:'abcf'}]
// var nExactName=rearrangeByBestNameMatch({arrA, arrB})
// debugger

var rearrangeByBestNameMatchArr=function(Relation){ // Note this function adds the properties nExactName and nExactNameNMTime to each relation
  for(var k in Relation){
    var relation=Relation[k]
    var nExactName=rearrangeByBestNameMatch(relation)
    var nExactNameNMTime=rearrangeByMatchingMTime(relation, nExactName)
    extend(relation,{nExactName, nExactNameNMTime})
  }
}

// [...arrAExactNameNMTime, ...arrAExactNameButNotMTime, ...arrARename]

var rearrangeByMatchingMTime=function(relation, nExactName){
  var {arrA,arrB}=relation
  if(nExactName==0) return 0;

  var arrAExactTime=[], arrANonExactTime=[], arrBExactTime=[], arrBNonExactTime=[]
  for(var i=0;i<nExactName;i++){
    var rowA=arrA[i], rowB=arrB[i];
    if(rowA.mtime_ns64Floored==rowB.mtime_ns64Floored) {arrAExactTime.push(rowA); arrBExactTime.push(rowB);}
    else{arrANonExactTime.push(rowA); arrBNonExactTime.push(rowB);}
  }
  var arrATmp=arrAExactTime.concat(arrANonExactTime)
  var arrBTmp=arrBExactTime.concat(arrBNonExactTime)
  arrA.splice(0,nExactName, ...arrATmp)
  arrB.splice(0,nExactName, ...arrBTmp)
  //var nNonExactTime=arrANonExactTime.length;
  var nExactNameNMTime=arrAExactTime.length;
  return nExactNameNMTime
  
}
// Create ObjByHash
  // Marking
// nUnchanged
// boCopyToTarget
// nDelete

// nCopyOnTarget
// nMoveOnTarget

// Copy of ObjByHash

  // Create result files
// copyToTarget
// copyOnTarget
// moveOnTarget



var seperateOutCaseCollisions=function(arr){
  var l=arr.length, obj={}, nCollision=0;
  for(var i=0;i<l;i++){
    var row=arr[i], {strName}=row, strNameLC=strName.toLowerCase()
    if(strNameLC in obj) {obj[strNameLC].push(row); nCollision++;}
    else {obj[strNameLC]=[row];}
  }
  var arr=Object.values(obj)
  return arr
}



var checkPropIsUniqueAmongArrayEntries=function(Obj, key){
    //var funTmp=(e)=>{var boExist=e in objTargetByMTmp; if objTmp[e]
    var objFound={}
    for(var i=0;i<Obj.length;i++){ var v=Obj[i][key]; if(v in objFound) return [false, i, v];
      objFound[v]=true;
    }
    return [true];
}
