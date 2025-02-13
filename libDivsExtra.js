
var formatTitle=function(arrIn, n=nShortListMax, fun=row=>row.strName){
  var l=arrIn.length, nOut=Math.min(n,l), StrOut=Array(nOut)
  if(nOut==0) return undefined
  for(var i=0;i<nOut;i++) { var row=arrIn[i]; StrOut[i]=fun(row);}
  if(l>n) StrOut.push('⋮')
  return StrOut.join('\n')
}
// var formatTitleMult=function(ArrA, ArrB, n=nShortListMax){
//   var l=ArrA.length, StrOut=[], boBreak=false;
//   var PrefixSide=['S','  T']
//   for(var i=0;i<l;i++) {
//     var arrA=ArrA[i], arrB=ArrB[i];
//     var ArrTmp=[arrA, arrB]
//     for(var k=0;k<2;k++) {
//       var arrTmp=ArrTmp[k]
//       for(var j=0;j<arrTmp.length;j++) {
//         StrOut.push(`${PrefixSide[k]}: ${arrTmp[j].strName}`);
//         if(StrOut.length>n) {StrOut.push('⋮'); boBreak=true; break;}
//       }
//       if(boBreak) break
//     }
//   }
//   return StrOut.join('\n')
// }
