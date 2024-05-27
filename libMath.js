
globalThis.eInd=function(arr,ind) { // Extract the elements at indexes ind of array arr
  var n=ind.length, out=Array(n);
  ind.forEach(function(x, i) { out[i]=arr[x]; });
  return out;
}

globalThis.Mat={};
Mat.transpose=function(M) { 
  var rows=M.length, cols=M[0].length;
  var Out = Array(cols);
  for(var j=0;j<cols;j++) { 
    Out[j] = Array(rows); for(var i=0;i<rows;i++) { Out[j][i]=M[i][j]; }
  } 
  return Out;
}