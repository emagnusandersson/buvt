
var eInd=function(arr,ind) { // Extract the elements at indexes ind of array arr
  var n=ind.length, out=Array(n);
  ind.forEach(function(x, i) { out[i]=arr[x]; });
  return out;
}