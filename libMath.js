
globalThis.eInd=function(arr,ind) { // Extract the elements at indexes ind of array arr
  var n=ind.length, out=Array(n);
  ind.forEach(function(x, i) { out[i]=arr[x]; });
  return out;
}

globalThis.Mat={};
Mat.transpose=function(M) { 
  var nR=M.length, nC=M[0].length;
  var Out = Array(nC);
  for(var j=0;j<nC;j++) { 
    Out[j] = Array(nR); for(var i=0;i<nR;i++) { Out[j][i]=M[i][j]; }
  } 
  return Out;
}
Mat.transposeAlt=function(M) { // Doesn't require all rows to have equal number of columns
  var nR=M.length, nCMax=0
  for(var i=0;i<nR;i++){ nCMax=Math.max(nCMax, M[i].length)  }
  var Out = Array(nCMax);
  for(var j=0;j<nCMax;j++) { 
    Out[j] = Array(nR); for(var i=0;i<nR;i++) { Out[j][i]=M[i][j]; }
  } 
  return Out;
}


globalThis.find=function(V) { // Returns indexes of nonzero elements
  var W=[];
  V.forEach(function(x,i) { if(x) W.push(i);});
  return W;
}

globalThis.diffMy=function(a,b){ return (a<b) ? 1 : ((a>b)?-1:0) }
//globalThis.diffMy=function(a,b){ return b-a; }