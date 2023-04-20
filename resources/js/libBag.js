
// import bisect
// import copy
// from lib import *

  // Some cb functions for testing
var funStrShortest=function(rowA,rowB){
  var strA=rowA, l=strA.length, strB=rowB.substring(0, l);
  if(strA<strB) return 1
  else if(strA>strB) return -1
  else if(strA==strB) return 0
  else console.log("Error not lt, not gt and not equal???")
}
function funInt(a,b){
  if(a<b) return 1
  else if(a>b) return -1
  else if(a==b) return 0
  else console.log("Error not lt, not gt and not equal???")
}

/***************************************************************************************
 * extractMatchingF: Comparing two arrays
 *   Inputs:
 *     funM101: (function-Minus1-0-1) A function that compares two array elements (from the below mentioned arrays). The output of funM101(element0, element1) ∈ [-1,0,1] where
 *       -1: descending slope (element0 > element1)
 *        0: equal (element0 == element1)
 *        1: ascending slope (element0 < element1)
 *     arrA and arrB: Arrays. 
 *       Each element must be unique and sorted ascendingly within its array (Ex: funM101(arrA[n],arrA[n+1]) is always 1).
 *   The extractMatchingF-function compares the elements in arrA with elements in arrB and puts matching pairs in arrAMatching and arrBMatching (which will be of equal length). The remaining elements are equally put in containers arrARem and arrBRem
 ***************************************************************************************/



/***************************************************************************************
 * extractMatching: (Wrapper for extractMatchingF)
 *   Works as extractMatchingF although each element is an object and the comparission is made using the object-properties given in KeyA and KeyB (which should be of equal length):
 *   In the below text, this notation is used: X ∈ [A, B]
 *   Uniqueness constraint: An object within arrX can not have all (KeyX-) properties be equal.
 *   Sorted strictly ascendingly constraint: The first property (within KeyX) that is different must be larger in the preceding object.
 *     So in other words, the elements of KeyX have falling priority.
 *   Ex: Assume KeyA=['m','n'] then
 *     arrA=[{m:0,n:0}, {m:0,n:0}] is NOT OK (not unique (nor strictly ascending))
 *     arrA=[{m:0,n:0}, {m:0,n:1}] is OK
 *     arrA=[{m:1,n:0}, {m:0,n:1}] is NOT OK (not ascending, because m has higher priority)
 *     arrA=[{m:0,n:1}, {m:1,n:0}] is OK
 *   If KeyB is omitted, KeyA will be used in its place. 
 *       
 ***************************************************************************************/

app.extractMatchingF=function(arrA, arrB, funM101){ 
  var iA=0, iB=0
  var lenA=arrA.length, lenB=arrB.length
  var arrAMatching=[], arrBMatching=[]
  var arrARem=[], arrBRem=[]
  while(1){
    var boEndA=iA==lenA, boEndB=iB==lenB
    if(boEndA && !boEndB) {arrBRem.push(...arrB.slice(iB)); break}
    else if(!boEndA && boEndB) {arrARem.push(...arrA.slice(iA)); break}
    else if(boEndA && boEndB) break
    var rowA=arrA[iA], rowB=arrB[iB]
    var intVal=funM101(rowA,rowB)
    if(intVal>0) {arrARem.push(rowA); iA+=1}     // The row exist in arrA but not in arrB
    else if(intVal<0) {arrBRem.push(rowB); iB+=1}   // The row exist in arrB but not in arrA
    else if(intVal==0) {arrAMatching.push(rowA); arrBMatching.push(rowB); iB+=1; iA+=1}
    else console.log("error when comparing strings")
  }
  return [arrAMatching, arrBMatching, arrARem, arrBRem]
}

app.extractMatching=function(arrA, arrB, KeyA, KeyB=null){
  if(KeyB==null) KeyB=KeyA
  var lenKeyA=KeyA.length,  lenKeyB=KeyB.length;  
  if(lenKeyA!=lenKeyB) {debugger; return [new Error("lenKeyA!=lenKeyB")]} 
  if(lenKeyA==0 || lenKeyB==0)  {debugger; return [new Error("lenKeyA==0 || lenKeyB==0")]}

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

//extractMatchingF([3,6,9], [2,3,8], funInt)


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
    // iBStart = bisect.bisect_left(arrBWork, rowA['strOld'], 0, lenB, key=lambda x: x['strName'][:l])
    // iBEnd = bisect.bisect_right(arrBWork, rowA['strOld'], iBStart, lenB, key=lambda x: x['strName'][:l])
    var iBStart = my_bisect_left(arrBWork, valA, 0, lenBWork, key=funB, argExtra=argExtra)
    var iBEnd = my_bisect_right(arrBWork, valA, iBStart, lenBWork, key=funB, argExtra=argExtra)
    if(iBStart!=iBEnd){
      arrAMatching.push(rowA);
      debugger; alert() // Note to self, shouldn't the next line be  arrBMatching.push(...arrBWork.slice(iBStart,iBEnd));
      arrBMatching.push(arrBWork.slice(iBStart,iBEnd)); 
      arrBWork=[].concat(...arrBWork.slice(0,iBStart), ...arrBWork.slice(iBEnd))
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
    arrAMatchingMod.push(...Array(l).fill(row))
    arrBMatchingMod.push(rowB)
  }
  return [arrAMatchingMod, arrBMatchingMod, arrARem, arrBRem]
}


// Note 1!! The below test fails (in python): funB is called with three arguments in my_bisect_left/my_bisect_right
// Note 2!! extractMatchingOneToManyUnsortedF is only used in renameFinishToMetaByFolder (which is not used in any launch.json-commands)

// var funB=function(strB, l) {return strB.slice(0,l)}
// var funExtra=function(strA) {return strA.length}
// [arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatchingOneToManyUnsortedFW(["qrs", "aa","progC"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], null, funB, funExtra)



  // An arrA element  may match multiple arrB elements (but not the other way around)
  // arrA and arrB must both be sorted
var extractMatchingOneToManyF=function(arrA, arrB, fun){
  var iA=0, iB=0
  var lenA=arrA.length, lenB=arrB.length
  
  var arrAMatching=[], arrBMatching=[]
  var arrARem=[], arrBRem=[]
  while(1){
    var boEndA=iA==lenA, boEndB=iB==lenB
    if(boEndA && !boEndB) {arrBRem.push(...arrB.slice(iB)); break}
    else if(!boEndA && boEndB){arrARem.push(...arrA.slice(iA)); break}
    else if(boEndA && boEndB) break

    var rowA=arrA[iA], rowB=arrB[iB]
    var intVal=fun(rowA,rowB)
    if(intVal>0) {arrARem.push(rowA); iA+=1}     // B is ahead of A
    else if(intVal<0) {arrBRem.push(rowB); iB+=1}   // A is ahead of B
    else if(intVal==0) {arrAMatching.push(rowA); arrBMatching.push(rowB); iB+=1;} //iA+=1
    else {return [new Error("error when comparing strings")]; }
  }
    
  return [null, arrAMatching, arrBMatching, arrARem, arrBRem]
}

// Note! as it is never used it is untested
//extractMatchingOneToManyF(["aa","progC","qrs"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], funStrShortest)



/***********************************************************
 * extractMatchingManyToManyF
 ***********************************************************/
  // arrA and arrB are arrays of dicts. Ex: arrA=[{a:1,b:1}, {a:1,b:1}] 
  // arrA and arrB must both be sorted, in a way so that calling "funVal" on each element gives an increasing (although not necessarily strictly increasing) order.
  // The returned values (objAMatching, objBMatching) consists of all the rows (of arrA and arrB) although arranged by their output when called through "funVal".
  // That is each property key (of objAMatching and objBMatching) are the output of funVal. The corresponding value is an array of the rows that outputted that key. 
  // That array may be empty, then that property key (funVal-value) only exist in the opposite arrA/arrB.
  // Output Examples:
  //   objAMatching={blahblah:[{a:1,b:1}, {a:1,b:1}], blahblahblah:[]}
  //   objAMatching={"0000000001_123487081324":[{inode:..., name:...}, {inode:..., name:...}], "0000000002_123487081324":[]}
var extractMatchingManyToManyF=function(arrA, arrB, funVal){
  var iA=0, iB=0
  var lenA=arrA.length, lenB=arrB.length
  var objAMatching={}, objBMatching={}
  //arrARem=[]; arrBRem=[]
  while(1){
      // If the end of any array has been reached, then everything ends here (this below part should really be outside the loop. (on todo list))
    var boEndA=iA==lenA, boEndB=iB==lenB
    if(boEndA && !boEndB){
      var iBTmp=iB
      while(1){
        var rowBTmp=arrB[iBTmp],  valB=funVal(rowBTmp)
        if(!(valB in objAMatching)) objAMatching[valB]=[]
        if(!(valB in objBMatching)) objBMatching[valB]=[]
        objBMatching[valB].push(rowBTmp)
        iBTmp=iBTmp+1
        if(iBTmp==lenB) {iB=iBTmp; break}
      }
      break
    }
    else if(!boEndA && boEndB){
      iATmp=iA
      while(1){
        var rowATmp=arrA[iATmp],  valA=funVal(rowATmp)
        if(!(valA in objAMatching)) objAMatching[valA]=[]
        if(!(valA in objBMatching)) objBMatching[valA]=[]
        objAMatching[valA].push(rowATmp)
        iATmp=iATmp+1
        if(iATmp==lenA) {iA=iATmp; break}
      }
      break
    } else if(boEndA && boEndB) break

    var rowA=arrA[iA], rowB=arrB[iB],  valA=funVal(rowA), valB=funVal(rowB)
    if(!(valA in objAMatching)) objAMatching[valA]=[]
    if(!(valA in objBMatching)) objBMatching[valA]=[]
    if(!(valB in objAMatching)) objAMatching[valB]=[]
    if(!(valB in objBMatching)) objBMatching[valB]=[]
    if(valA<valB)   // B is ahead of A
      {objAMatching[valA].push(rowA); iA+=1}     
    else if(valA>valB)  // A is ahead of B
      {objBMatching[valB].push(rowB); iB+=1}  
    else if(valA==valB){
      objAMatching[valA].push(rowA); objBMatching[valB].push(rowB)
      var iATmp=iA, iBTmp=iB
      while(1){
        iATmp=iATmp+1
        if(iATmp==lenA) {iA=iATmp; break}
        var rowATmp=arrA[iATmp], valATmp=funVal(rowATmp)
        if(valATmp==valB) {objAMatching[valATmp].push(rowATmp);}
        else {iA=iATmp; break}
      }
      while(1){
        iBTmp=iBTmp+1
        if(iBTmp==lenB) {iB=iBTmp; break}
        var rowBTmp=arrB[iBTmp], valBTmp=funVal(rowBTmp)
        if(valA==valBTmp) {objBMatching[valBTmp].push(rowBTmp);}
        else {iB=iBTmp; break}
      }
    }
    //else return [new Error("error when comparing strings")]
  }
    
  return [objAMatching, objBMatching]
}


//extractMatchingManyToManyF([3,6,9], [2,3,8], x=>x)
//extractMatchingManyToManyF([3,6,9], [2,3,3,8], x=>x)
//extractMatchingManyToManyF([1,3,3,6,9], [2,3,3], x=>x)
//extractMatchingManyToManyF(["aa","progC","qrs"], ["abc", "progC/abc", "progC/def", "progC/ghi", "ss"], funStrShortest)



/***************************************************************************************
 * extractUniques
 *   extract uniques within a single array arr
 ***************************************************************************************/
var extractUniques=function(arr,arrKey){
  if(!(arrKey instanceof Array)) arrKey=[arrKey]
  var objDup={},  arrUniq=[];  //,  arrUniqified=[];
  var lenArr=arr.length
  if(lenArr==0) return [arrUniqified, arrUniq, objDup]
  for(var i=0;i<lenArr;i++){
    var row=arr[i], iNext=i+1
    var boMatch=true
    if(iNext!=lenArr){
      var rowNext=arr[iNext]
      for(var key of arrKey){
        var attr=row[key], attrNext=rowNext[key]
        if(attrNext!=attr) boMatch=false
      }
    } else boMatch=false
      // Create strAttr (key in objDup)
    var strAttr=""
    for(var key of arrKey){
      var attr=row[key];
      strAttr+=attr.toString();
    }

    if(boMatch){
      if(strAttr in objDup) objDup[strAttr].push(row)
      else objDup[strAttr]=[row]
    }
    else{
      //arrUniqified.push(extend({},row))
      if(strAttr in objDup) objDup[strAttr].push(row)
      else arrUniq.push(row)
    }

    // Adding the last row.
    //   If it had a duplicate, then it hasn't been added yet.
    //   If it's unique, then it should be added.
  }

  // rowNext=arr[lenArr-1]
  // arrUniqified.push(rowNext)  
  //return [arrUniq, objDup, arrUniqified]
  return [arrUniq, objDup]
}

// var [arrUniq, objDup]= extractUniques([{"a":1}, {"a":1}, {"a":2}], "a")
// var [arrUniq, objDup]= extractUniques([{"a":1}, {"a":1}, {"a":2}, {"a":2}], "a")



// OTO=OneToOne, OTM=OneToMany, MTO=ManyToOne, MTM=ManyToMany
// T\S    Null    One     Many
// Null           Created Created
// One    Deleted OTO     MTO
// Many   Deleted OTM     MTM


var objManyToManyRemoveEmpty=function(objA, objB){  // Modifies objA and objB
  var KeyDel=[]
  for(var key in objA){
    var arrA=objA[key], arrB=objB[key], lenA=arrA.length; lenB=arrB.length;
    if(lenA==0 && lenB==0) KeyDel.push(key)
  }
  for(var key of KeyDel){
    delete objA[key]; delete objB[key]
  }
}


  // objA, objB is the output of extractMatchingManyToManyF.
  // Thus objA, objB has the same property keys.
var convertObjManyToManyToMat=function(objA, objB){
  var ArrAOTO=[], ArrBOTO=[], ArrAOTM=[], ArrBOTM=[], ArrAMTO=[], ArrBMTO=[], ArrAMTM=[], ArrBMTM=[]
  var ArrAOTNull=[], ArrAMTNull=[], ArrBNullTO=[], ArrBNullTM=[]
  var arrAOTNull=[], arrAMTNull=[], arrBNullTO=[], arrBNullTM=[]
  var arrAOTO=[], arrBOTO=[], arrAOTM=[], arrBOTM=[], arrAMTO=[], arrBMTO=[], arrAMTM=[], arrBMTM=[]
  for(var key in objA){
    var arrA=objA[key], arrB=objB[key];
    var lenA=arrA.length, lenB=arrB.length
    if(lenA==0){
      if(lenB==0) {debugger; return [new Error("lenA==0 && lenB==0")]; } //del objA[key]; objB[key] 
      else if(lenB==1) {ArrBNullTO.push(arrB);  arrBNullTO.push(...arrB)}
      else {ArrBNullTM.push(arrB);  arrBNullTM.push(...arrB)}
    } else if(lenA==1){
      if(lenB==0) {ArrAOTNull.push(arrA);  arrAOTNull.push(...arrA)}
      else if(lenB==1) {ArrAOTO.push(arrA); ArrBOTO.push(arrB);    arrAOTO.push(...arrA); arrBOTO.push(...arrB)}
      else {ArrAOTM.push(arrA); ArrBOTM.push(arrB);    arrAOTM.push(...arrA); arrBOTM.push(...arrB)}
    } else{
      if(lenB==0) {ArrAMTNull.push(arrA);  arrAMTNull.push(...arrA)}
      else if(lenB==1) {ArrAMTO.push(arrA); ArrBMTO.push(arrB);    arrAMTO.push(...arrA); arrBMTO.push(...arrB)}
      else {ArrAMTM.push(arrA); ArrBMTM.push(arrB);    arrAMTM.push(...arrA); arrBMTM.push(...arrB)}
    }
  }
  var arrARem=[].concat(arrAMTNull, arrAOTNull);
  var arrBRem=[].concat(arrBNullTO,arrBNullTM)
  var objOut={ArrAOTO, ArrBOTO, ArrAOTM, ArrBOTM, ArrAMTO, ArrBMTO, ArrAMTM, ArrBMTM, arrARem, arrBRem, arrAOTO, arrBOTO, arrAOTM, arrBOTM, arrAMTO, arrBMTO, arrAMTM, arrBMTM, ArrAOTNull, ArrAMTNull, ArrBNullTO, ArrBNullTM, arrAOTNull, arrAMTNull, arrBNullTO, arrBNullTM}
  return [null, objOut]

}



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


var markRelBest=function(ArrA, ArrB){
  for(var i in ArrA){
    var arrA=ArrA[i], arrB=ArrB[i], lenA=arrA.length, lenB=arrB.length
    var jBest=-1, kBest=-1, fitBest=0
    for(var j in arrA){
      var elA=arrA[j];
      var strNameA=elA.strName
      //bestAByB=[None]*lenB
      for(var k in arrB){
        var elB=arrB[k];
        var strNameB=elB.strName
        var rat=similarity(strNameA, strNameB)
        if(rat>fitBest) {fitBest=rat; jBest=j; kBest=k}
      }
    }
    // if(jBest>0) {var elABest=arrA.pop(jBest);  arrA.insert(0, elABest)}
    // if(kBest>0) {var elBBest=arrB.pop(kBest);  arrB.insert(0, elBBest)}
    if(jBest>0) {var arrTmp=arrA.splice(jBest,1);  arrA.unshift(arrTmp[0])}
    if(kBest>0) {var arrTmp=arrB.splice(kBest,1);  arrB.unshift(arrTmp[0])}
  }
}
