"use strict"

//var app;  if(typeof window!=='undefined') app=window; else if(typeof global!=='undefined') app=global; else app=self;  // if browser else if server else serviceworker

globalThis.app=globalThis;


// declare global {
//   interface Promise {
//     toNBP(): Array;
//   }
// }
Promise.prototype.toNBP=function(){   return this.then(a=>{return [null,a];}).catch(e=>{return [e];});   }  // toNodeBackPromise


app.toNBP=function(p){  
  var pN=p.then(a=>{return [null,a];}).catch(e=>{return [e];}); 
  return pN;
}  // toNodeBackPromise


//
// Object
//

app.extend=Object.assign;
app.copySome=function(a,b,Str){for(var i=0;i<Str.length;i++) { var name=Str[i]; a[name]=b[name]; } return a; }
app.object_values=function(obj){
  var arr=[];      for(var name in obj) arr.push(obj[name]);
  return arr;
}
app.removeProp=function(obj, arrProp){
  if(typeof arrProp=='string') arrProp=[arrProp];
  for(var i=0;i<arrProp.length;i++)  delete obj[arrProp[i]];
}
app.copyDeep=function(objI) { return JSON.parse(JSON.stringify(objI));};
app.copyDeepB=function(o, isdeep=true){
  if (o===undefined || o===null || ['string', 'number', 'boolean'].indexOf(typeof o)!==-1) return o;
  if(o instanceof Date) return new Date(o.getTime());
  var n= o instanceof Array? [] :{};
  for (var k in o)
      if (o.hasOwnProperty(k))
          n[k]= isdeep? copyDeepB(o[k], isdeep) : o[k];
  return n;
}

/*JSON.myParse=function(str){
    try{
        return [null, JSON.parse(str)];
    }catch(err){
        return [err, undefined];
    }
}*/
app.isEmpty=function(v){ 
  if(typeof v=='undefined') return true;
  if(typeof v=='number') return v==0;
  if(typeof v=='string') return v.length==0;
  if(typeof v=='object') {
    if(v===null) return true;
    if(v instanceof Array) return v.length==0;
    return Object.keys(v).length==0;
  }
}
app.isSet=function(v){ return !isEmpty(v); }



//
// Array
//

app.arr_max=function(arr){return Math.max.apply(null, arr);}
app.arr_min=function(arr){return Math.min.apply(null, arr);}
app.indexOfMax=function(arr) {
  if (arr.length===0) return -1;
  var valBest=arr[0], iBest=0;      for (var i=1; i<arr.length; i++) {      if(arr[i]>valBest) { iBest=i; valBest=arr[i]; }         }
  return iBest;
}
app.indexOfMin=function(arr) {
  if (arr.length===0) return -1;
  var valBest=arr[0], iBest=0;      for (var i=1; i<arr.length; i++) {      if(arr[i]<valBest) { iBest=i; valBest=arr[i]; }         }
  return iBest;
}

app.arrArrange=function(arrV,arrI){
  var n=arrI.length, arrNew;
  if(typeof arrV=='string') arrNew=" ".repeat(n); else arrNew=Array(n);
  for(var i=0;i<arrI.length;i++){    arrNew[i]=arrV[arrI[i]];    }
  return arrNew;
}

//app.intersectionAB=function(A,B){return A.filter(function(ai){return B.indexOf(ai)!=-1;});}  // Loop through A; remove ai that is not in B
//app.AmB=function(A,B){return A.filter(function(ai){return B.indexOf(ai)==-1;});}  // Loop through A; remove ai that is in B
app.intersectionAB=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) A.splice(i,1); else Rem.push(a);} return Rem.reverse();}  // Changes A, returns the remainder
app.AMinusB=function(A,B){var ANew=[]; for(var i=0;i<A.length;i++){var a=A[i]; if(B.indexOf(a)==-1) ANew.push(a);} return ANew;}  // Does not change A, returns ANew
app.AMMinusB=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) Rem.push(a); else A.splice(i,1);} return Rem.reverse();}  // Changes A, returns the remainder
app.myIntersect=function(A,B){var arrY=[],arrN=[]; for(var i=0; i<A.length; i++){var a=A[i]; if(B.indexOf(a)==-1) arrN.push(a); else arrY.push(a);} return [arrY,arrN];}  
app.intersectBool=function(A,B){for(var i=0; i<A.length; i++){if(B.indexOf(A[i])!=-1) return true;} return false;}  //  If any 'a' within B
app.isAWithinB=function(A,B){ for(var i=0; i<A.length; i++){if(B.indexOf(A[i])==-1) return false;} return true;}  
app.AMUnionB=function(A,B){ // Modifies A
  for(var i=0;i<B.length;i++) { var b=B[i]; if(A.indexOf(b)==-1) A.push(b); return A; } 
}

app.mySplice1=function(arr,iItem){ var item=arr[iItem]; for(var i=iItem, len=arr.length-1; i<len; i++)  arr[i]=arr[i+1];  arr.length = len; return item; }  // GC-friendly splice
app.myCopy=function(arr,brr){ var len=brr.length; if(typeof arr=="undefined") arr=Array(len); else arr.length = len; for(var i=0; i<len; i++)  arr[i]=brr[i];   return arr; }  // GC-friendly copy
//app.myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; arr.length=0; arr.push.apply(arr,brr);  }  // GC-friendly copy
app.myCompare=function(arr,brr){  var la=arr.length,lb=brr.length; if(la!=lb) return false; for(var i=0; i<la; i++)  if(arr[i]!=brr[i]) return false;  return true;}  // compare
  

app.addIndexColumn=function(M){    var Mt=Array();     for(var i=0;i<M.length;i++){  var tmp=[(i+1).toString()];   Mt[i]=tmp.concat(M[i]);  }       return Mt;      }
app.arrCopy=function(A){return [].concat(A);}

app.arrarrCopy=function(B){var A=[]; for(var i=0;i<B.length;i++){ A[i]=[].concat(B[i]);} return A; }

app.array_removeInd=function(a,i){a.splice(i,1);}
app.array_removeVal1=function(a,v){var i=a.indexOf(v); if(i!=-1) a.splice(i,1);}
//app.array_removeVal=function(a,v){ while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}}
//app.array_removeVal=function(a){
  //var t=[], b=t.slice.call(arguments, 1), Val=t.concat.apply([],b);
  //for(var j=0;j<Val.length;j++){var v=Val[j]; while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}  }
//} 
app.array_removeVal=function(a, ...Val){
  //for(var j=0;j<Val.length;j++){var v=Val[j]; while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}  }
  var j=0;
  while(j<Val.length){
    var v=Val[j]; j++;
    if(v instanceof Array) Val=Val.push(v);
    else {
      while(1) {
        var i=a.indexOf(v);   if(i!=-1) a.splice(i,1);else break;
      }
    }
  }
}

app.array_splice=function(arr,st,len,arrIns){
  [].splice.apply(arr, [st,len].concat(arrIns));
}
app.array_merge=function(){  return Array.prototype.concat.apply([],arguments);  } // Does not modify origin
//app.array_mergeM=function(a,b){  a.push.apply(a,b); return a; } // Modifies origin (first argument)
app.array_mergeM=function(){var t=[], a=arguments[0], b=t.slice.call(arguments, 1), c=t.concat.apply([],b); t.push.apply(a,c); return a; } // Modifies origin (first argument)

app.array_flip=function(A){ var B={}; for(var i=0;i<A.length;i++){B[A[i]]=i;} return B;}
app.array_fill=function(n, val){ return Array.apply(null, new Array(n)).map(String.prototype.valueOf,val); }

app.is_array=function(a){return a instanceof Array;}
app.in_array=function(needle,haystack){ return haystack.indexOf(needle)!=-1;}
app.array_filter=function(A,f){f=f||function(a){return a;}; return A.filter(f);}


app.range=function(min,max,step){ var n=(max-min)/step; return Array.apply(null, Array(n)).map(function(trash, i){return min+i*step;}); }

app.eliminateDuplicates=function(arr){
  var i, len=arr.length, out=[], obj={};
  for (i=0;i<len;i++){ obj[arr[i]]=0; }
  for (i in obj){ out.push(i); }
  return out;
}
app.arrValMerge=function(arr,val){  var indOf=arr.indexOf(val); if(indOf==-1) arr.push(val); }
//app.arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) arr.splice(indOf,1); }
app.arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) mySplice1(arr,indOf); }

app.stepN=function(start,n,step){ if(typeof step=='undefined') step=1;  var arr=Array(n),ii=start; for(var i=0;i<n;i++){ arr[i]=ii;ii+=step;} return arr; }


//
// Str (Array of Strings)
//

app.StrComp=function(A,B){var lA=A.length; if(lA!==B.length) return false; for(var i=0;i<lA;i++){ if(A[i]!==B[i]) return false;} return true;}
app.Str_insertM=function(arr,strRefVal,arrIns,boBefore=0){
  var i=arr.indexOf(strRefVal); if(i==-1) throw 'bla';  if(boBefore==0) i++; 
  if(!(arrIns instanceof Array)) arrIns=[arrIns];
  array_splice(arr, i, 0, arrIns);
}
app.Str_insertMObj=function(arr,inp){
  if(inp.after) {var i=arr.indexOf(inp.after); if(i==-1) throw 'bla';  i++; }
  else if(inp.before) {var i=arr.indexOf(inp.before); if(i==-1) throw 'bla';}
  var arrIns=inp.ins;
  if(!(arrIns instanceof Array)) arrIns=[arrIns];
  array_splice(arr, i, 0, arrIns);
}
app.Str_moveM=function(arr,strRefVal,arrMove,boBefore){
  if(!(arrMove instanceof Array)) arrMove=[arrMove];
  removeBFrA(arr,arrMove);
  Str_insertM(arr,strRefVal,arrMove,boBefore);
  //return arrRem;
}
app.Str_addUnique=function(arr,str){ if(arr.indexOf(str)==-1) arr.push(str); return arr; } // Add if str does not exist in arr else do nothing
app.Str_changeOne=function(arr,strO,strN){ var ind=arr.indexOf(strO); if(ind==-1) arr.push(strN); else arr[ind]=strN; return arr; } // Change strO to strN.



//
// String
//

app.isupper=function(a){ return a>='A' && a<='Z'}
app.ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  }
app.lcfirst=function(string){  return string.charAt(0).toLowerCase() + string.slice(1);  }
app.isAlpha=function(star){  var regEx = /^[a-zA-Z0-9]+$/;  return str.match(regEx); } 
//String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g,"");}
if(!String.format){
  String.format = function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number){ 
      return typeof args[number]!='undefined' ? args[number]:match;
    });
  };
}

app.ltrim=function(str,charlist=String.raw`\s`){
  return str.replace(new RegExp("^[" + charlist + "]+"), "");
};
app.rtrim=function(str,charlist=String.raw`\s`){
  return str.replace(new RegExp("[" + charlist + "]+$"), "");
};
app.trim=function(str,charlist=String.raw`\s`){
  return str.replace(new RegExp("^[" + charlist + "]+([^" + charlist + "]*)[" + charlist + "]+$"), function(m,n){return n;});
}

//app.pad2=function(n){ return ('0'+n).slice(-2);}
app.pad2=function(n){return (n<10?'0':'')+n;}


app.myParser=function(strText,obj){
  var StrKey=Object.keys(obj);
  for(var i=0;i<StrKey.length;i++){
    var strKey=StrKey[i];
    var regKey=new RegExp('\\$'+strKey, 'g');
    strText.replace(regKey, obj[strKey]);
  }
  return strText;
}



//
// Number
//

Number.prototype.myPad0 = function(){ return this.toString().padStart(...arguments, '0'); }
//Number.prototype.myPad2 = function(){ return this.toString().padStart(2, '0'); }
Number.prototype.myPadStart = function(){ return this.toString().padStart(...arguments); }

/////////////////////////////////////////////////////////////////////


//
// Math
//

app.minKeepType=function(){var valBest=Infinity; for(var i=0;i<arguments.length;i++){ if(arguments[i]<valBest) valBest=arguments[i];} return valBest;} // Keeping the type as opposed to Math.min
app.maxKeepType=function(){var valBest=-Infinity; for(var i=0;i<arguments.length;i++){ if(arguments[i]>valBest) valBest=arguments[i];} return valBest;} // Keeping the type as opposed to Math.max

app.isNumber=function(n){ return !isNaN(parseFloat(n)) && isFinite(n);}
app.sign=function(val){if(val<0) return -1; else if(val>0) return 1; else return 0;}

app.round=Math.round; app.sqrt=Math.sqrt;
app.log2=function(x){return Math.log(x)/Math.log(2);}
app.twoPi=2*Math.PI;
app.r2deg=180/Math.PI;
app.deg2r=Math.PI/180;
if(typeof(Number.prototype.toRad) === "undefined"){  Number.prototype.toRad = function(){  return this * Math.PI / 180; }   }
Math.log2=function(val) {  return Math.log(val) / Math.LN2; }
Math.log10=function(val) {  return Math.log(val) / Math.LN10; }

app.bound=function(value, opt_min=null, opt_max=null){
  if(opt_min != null) value = Math.max(value, opt_min);
  if(opt_max != null) value = Math.min(value, opt_max);
  return value;
}

app.closest2Val=function(v, val){
  var bestFit=Number.MAX_VALUE, curFit, len=v.length, best_i;
  for(var i=0;i<len;i++){
    curFit=Math.abs(v[i]-val);
    if(curFit<bestFit){bestFit=curFit; best_i=i;}
  }
  return [v[best_i], best_i];
}
app.normalizeAng=function(angIn, angCenter=0, lapSize=twoPi){
  var lapSizeHalf=lapSize/2;

  //var upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf, angInRelative=angIn-angCenter;
  //var tmp, nLapsCorrection;
  //if(angIn>=upper){tmp=angInRelative+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
  //else if(angIn<lower){tmp=angInRelative+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
  //else return [angIn,0];
  
  var upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf;   if(angIn<upper && angIn>=lower){return [angIn,0];}
  var angInRelative=angIn-angCenter;  // angInRelative: angIn relative to angCenter
  var angIn_InCycle=angInRelative+lapSizeHalf, nLapsCorrection=Math.floor(angIn_InCycle/lapSize);

  var angOut=angIn-nLapsCorrection*lapSize;  
  return [angOut,nLapsCorrection];
}

app.distCalc=function(lng1,lat1,lng2,lat2){
  var R = 6371; // km
  //var dLat = (lat2-lat1).toRad();
  //var dLng = (lng2-lng1).toRad();
  var lng1 = Number(lng1).toRad(),  lat1 = Number(lat1).toRad();
  var lng2 = Number(lng2).toRad(),  lat2 = Number(lat2).toRad();
  var dLat = lat2-lat1,   dLng = lng2-lng1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

app.approxDist=function(mWhole,boArr=0){  
  //if(typeof boArr !='undefined' && boArr==1){} else boArr=0;
  var n, u; 
  var aMWhole=Math.abs(mWhole);
  if(mWhole>=1000){n=Math.round(mWhole/(1000)); u='km';} 
  else{n=mWhole;  u='m';} 
  if(boArr==1) return Array(n,u); else return n+' '+u;
}

app.makeOrdinalEndingEn=function(n){
  var ones=n%10, tmp=Math.floor(n/10), tens=tmp%10;
  var ending='th';
  if(tens!=1){ // if not in the teens
    if(ones==1){ ending='st';} else if(ones==2){ ending='nd';} else if(ones==3){ ending='rd';}
  }
  return ending;
}
//app.ordinal_suffix_of=function(i) {
    //var j = i % 10,  k = i % 100;
    //if (j == 1 && k != 11) {  return i + "st"; }
    //if (j == 2 && k != 12) {  return i + "nd"; }
    //if (j == 3 && k != 13) {  return i + "rd"; }
    //return i + "th";
//}


//
// Random
//

app.randomInt=function(min, max){    return min + Math.floor(Math.random() * (max - min + 1));  } // Random integer in the intervall [min, max] (That is including both min and max)
app.randomHash=function(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);}


app.gauss=function(){   // returns random number with normal distribution N(0,1)  (mean=0,  std dev=1)
  var x=Math.random(), y=Math.random();

  // two independent variables with normal distribution N(0,1)
  var u=Math.sqrt(-2*Math.log(x))*Math.cos(2*Math.PI*y);
  var v=Math.sqrt(-2*Math.log(x))*Math.sin(2*Math.PI*y);

  // i will return only one, couse only one needed
  return u;
}

app.gauss_ms=function(m=0,s=1){  // returns random number with normal distribution: N(m,s)  (mean=m,  std dev=s)
  return gauss()*s+m;
}
app.genRandomString=function(len) {
  //var characters = 'abcdefghijklmnopqrstuvwxyz';
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var str ='';    
  for(var p=0; p<len; p++) {
    str+=characters[randomInt(0, characters.length-1)];
  }
  return str;
}

app.myUUID=function(){
  var array = new Uint32Array(4);
  app.crypto.getRandomValues(array);
  var Str=Array(4);
  for (var i = 0; i < array.length; i++) { Str[i]=array[i].toString(16).padStart(8,"0"); }
  return Str.join("");
}


//
// Dates and time
//

app.mySleepMS=async function(t){      await new Promise(resolve=>{setTimeout(resolve,t); });    }

Date.prototype.toUnix=function(){return Math.round(this.valueOf()/1000);}
Date.prototype.toISOStringMy=function(){return this.toISOString().substr(0,19);}
app.swedDate=function(tmp){ if(tmp){tmp=UTC2JS(tmp);  tmp=tmp.getFullYear()+'-'+pad2(tmp.getMonth()+1)+'-'+pad2(tmp.getDate());}  return tmp;}
app.UTC2JS=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);  return tmp;  }
app.UTC2Readable=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);   return tmp.toLocaleString();  }
//myISODATE=function(d){ return d.toISOString().substr(0,19);}
//unixNowMS=function(){var tmp=new Date(); return Number(tmp);}
//unixNow=function(){return Math.round(unixNowMS()/1000);}
app.unixNow=function(){return (new Date()).toUnix();}

app.getSuitableTimeUnit=function(t){ // t in seconds
  var tabs=Math.abs(t), tsign=t>=0?+1:-1;
  if(tabs<=90) return [tsign*tabs,'s'];
  tabs/=60; // t in minutes
  if(tabs<=90) return [tsign*tabs,'m']; 
  tabs/=60; // t in hours
  if(tabs<=36) return [tsign*tabs,'h'];
  tabs/=24; // t in days
  if(tabs<=2*365) return [tsign*tabs,'d'];
  tabs/=365; // t in years
  return [tsign*tabs,'y'];
}
app.getSuitableTimeUnitStr=function(tdiff,objLang=langHtml.timeUnit,boLong=0,boArr=0){
  var [ttmp,u]=getSuitableTimeUnit(tdiff), n=Math.round(ttmp);
  var strU=objLang[u][boLong][Number(n!=1)];
  if(boArr){  return [n,strU];  } else{  return n+' '+strU;   }
}

//
// Data Formatting
//

app.arrObj2TabNStrCol=function(arrObj){ //  Ex: [{abc:0,def:1},{abc:2,def:3}] => {tab:[[0,1],[2,3]],StrCol:['abc','def']}
    // Note! empty arrObj returns {tab:[]}
  var Ou={tab:[]}, lenI=arrObj.length, StrCol=[]; if(!lenI) return Ou;
  StrCol=Object.keys(arrObj[0]);  var lenJ=StrCol.length;
  for(var i=0;i<lenI;i++) {
    var row=arrObj[i], rowN=Array(lenJ);
    for(var j=0;j<lenJ;j++){ var key=StrCol[j]; rowN[j]=row[key]; }
    Ou.tab.push(rowN);
  }
  Ou.StrCol=StrCol;
  return Ou;
}
app.tabNStrCol2ArrObj=function(tabNStrCol){  //Ex: {tab:[[0,1],[2,3]],StrCol:['abc','def']}    =>    [{abc:0,def:1},{abc:2,def:3}] 
    // Note! An "empty" input should look like this:  {tab:[]}
  var tab=tabNStrCol.tab, StrCol=tabNStrCol.StrCol, arrObj=Array(tab.length);
  for(var i=0;i<tab.length;i++){
    var row={};
    for(var j=0;j<StrCol.length;j++){  var key=StrCol[j]; row[key]=tab[i][j];  }
    arrObj[i]=row;
  }
  return arrObj;
}

app.deserialize=function(serializedJavascript){
  return eval('(' + serializedJavascript + ')');
}

app.parseQS=function(str){
  var params = {},      regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(str)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
}

app.filterPropKeyByB=function(Prop, iBit){ // Check all Prop[strKey].b[iBit] for each strKey. Create an array with all strKey where Prop[strKey].b[iBit] is true.
  var KeyAll=Object.keys(Prop)
  var KeyOut=[];  for(var i=0;i<KeyAll.length;i++) { var key=KeyAll[i], b=Prop[key].b;   if(Number(b[iBit])) KeyOut.push(key);  }
  return KeyOut;
}


app.b64UrlDecode=function(b64UrlString, boUint8Array=false){  // boUint8Array==true => output is in Uint8Array
  const padding='='.repeat((4-b64UrlString.length%4) % 4);
  const base64=(b64UrlString+padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData=globalThis.atob(base64);
  //const rawData=Buffer.from(base64, 'base64').toString();
  if(!boUint8Array) return rawData;
  const outputArray=new Uint8Array(rawData.length);

  for(let i=0; i<rawData.length; ++i){ outputArray[i]=rawData.charCodeAt(i); }
  return outputArray;
}

app.blobToBase64=function(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

app.parseQS2=function(qs){
  var objQS={}, objTmp=new URLSearchParams(qs);
  for(const [name, value] of objTmp) {  objQS[name]=value;  }
  return objQS;
}

//
// Escaping data
//

app.myJSEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;");}
  // myAttrEscape
  // Only one of " or ' must be escaped depending on how it is wrapped when on the client.
app.myAttrEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\//g,"&#47;");} // This will keep any single quataions.
app.myLinkEscape=function(str){ str=myAttrEscape(str); if(str.startsWith('javascript:')) str='javascript&#58;'+str.substr(11); return str; }




/**********************************************************
 * Added with buvt
 **********************************************************/

  
var myMD5=async function(strFileName){
  //strhash=subprocess.check_output(['md5sum', strFileName])
  //return strhash.split(null, 1)[0]
  var [err, objT] = await Neutralino.os.execCommand('md5sum '+strFileName).toNBP();
  if(err) { debugger; return [err];}
  var {exitCode, pid, stdErr, stdOut}=objT;
  if(exitCode) {
    debugger; return [new Error(stdErr)]
  };
  stdOut=stdOut.trim()
  return [null, stdOut]
}

var mySplit=function(str, sep, n) {
  var out = [];
  while(n--) out.push(str.slice(sep.lastIndex, sep.exec(str).index));
  out.push(str.slice(sep.lastIndex));
  return out;
}
//console.log(mySplit("a=b=c=d", /=/g, 2)); // ['a', 'b', 'c=d']

/*******************************************************
 * parseSSV   Parse "space separated data"
 *******************************************************/
  //   The header (first line) determines the number of columns. (Header-fields may not contain spaces)
  //   The remaining rows are expected to have at least as many space-separations as the first line.
  //   Last column contains all remaining data of the row (so it may contain spaces (but not newlines))
//var parseSSV=function(strData){
var parseSSV=async function(fsFile){
  var [err, buf] = await Neutralino.filesystem.readFile(fsFile).toNBP(); if(err) return [err]
  var strData=buf.toString()
  var arrOut=[]
  var arrInp=strData.split('\n')

  var nData=arrInp.length
  //if(nData<=1) return [null, arrOut]

  var strHead=arrInp[0].strip()
  var arrCol=strHead.split(' ')
  var nCol=arrCol.length
  var nSplit=nCol-1

  for(var strRow of arrInp.slice(1)){
    var strRow=strRow.strip()
    if(strRow.length==0) continue
    if(strRow.startsWith('#')) continue
    //var arrPart=strRow.split(null, nSplit)
    var arrPart=mySplit(strRow, /\s+/g, nSplit)
    var obj={}
    for(var i in arrCol) {
      var strCol=arrCol[i]
      obj[strCol]=arrPart[i]
    }
    arrOut.push(obj)
  }
  
  return [null, arrOut]
}


/*******************************************************
 * formatColumnData
 *******************************************************/
var createFormatInfo=function(arrKey, objType={}){
  for(var key of arrKey){
    if(key.slice(0,2)=='bo' && isupper(key[2])) strType='boolean'
    else if(key.slice(0,3)=='int' && isupper(key[3])) strType='number'
    else if(key[0]=='n' && isupper(key[1])) strType='number'
    else if(key[0]=='t' && isupper(key[1])) strType='number'
    else strType='string'
    objType[key]=strType
  }
  return objType
}

var formatColumnData=function(arrData, objType){
  for(var row of arrData){
    for(var key in row){
      var val=row[key]
      if(!(key in objType)) ;
      else if(objType[key]=='boolean') val=val.toLowerCase()=='true'
      else if(objType[key]=='number') val=Number(val)
      row[key]=val
    }
  }
// objType=createFormatInfo([*arrDB[0]]);   extend(objType, {"size":"number", "inode":"number", "mtime":"number", "inode0":"number"})
}



var formatTDiff=function(tDiff){
  var boPos=tDiff>0
  var tDiffAbs=Math.abs(tDiff)
  var tDay=Math.floor(tDiffAbs/86400)
  var ttmp=tDiffAbs%86400         // number of seconds into current day
  var tHour=Math.floor(ttmp/3600) // number of hours into current day
  //
  ttmp=ttmp%3600              // number of seconds into current hour
  var tMin=Math.floor(ttmp/60)    // number of minutes into current hour
  //
  ttmp=ttmp%60                // number of seconds into current minute (float)
  var tSec=Math.floor(ttmp)       // number of seconds into current minute (int)
  //
  ttmp=ttmp%1                 // number of seconds into current second (0<=ttmp<1)
  var tFrac=ttmp
  ttmp=ttmp*1000              // number of ms into current second (float)
  var tms=Math.floor(ttmp)        // number of ms into current second (int)
  //
  ttmp=ttmp%1                 // number of ms into current ms (0<=ttmp<1)
  ttmp=ttmp*1000              // number of us into current ms (float)
  var tus=Math.floor(ttmp)        // number of us into current us (int)
  //
  ttmp=ttmp%1                 // number of us into current us (0<=ttmp<1)
  ttmp=ttmp*1000              // number of ns into current us (float)
  //tns=Math.floor(ttmp)        // number of ns into current us (int)
  var tns=ttmp
  //
  return [tDay,tHour,tMin,tSec,tms,tus,tns]
  //return tDay,tHour,tMin,tSec,tFrac
}

var formatTDiffStr=function(tDiff){
  var [tDay,tHour,tMin,tSec,tms,tus,tns]=formatTDiff(tDiff)
  //tDay,tHour,tMin,tSec,tFrac=formatTdiff(tDiff)
  //return "%d %02d:%02d:%02d.%03d %03d %03d" %(tDay,tHour,tMin,tSec,tms,tus,tns)
  return tDay+' '+tHour.myPad0(2)+':'+tMin.myPad0(2)+':'+tSec.myPad0(2)+'.'+tms.myPad0(3)+' '+tus.myPad0(3)+' '+tns.myPad0(3)
  //return "%d %d:%d:%d.%s" %(tDay,tHour,tMin,tSec,tFrac)
}




app.my_bisect_right=function(a, x, lo=0, hi=null, key=null, argExtra=null){
  `Return the index where to insert item x in list a, assuming a is sorted.
  The return value i is such that all e in a.slice(0,i) have e <= x, and all e in
  a.slice(i) have e > x.  So if x already appears in the list, a.insert(i, x) will
  insert just after the rightmost x already there.
  Optional args lo (default 0) and hi (default a.length) bound the
  slice of a to be searched.
  `

  if(lo < 0) throw new Error('lo must be non-negative')
  if(hi === null)  hi = a.length
  // Note, the comparison uses "<" to match the
  // __lt__() logic in list.sort() and in heapq.
  if(key===null){
    while(lo < hi){
      var mid = (lo + hi) >> 1
      if(x < a[mid])
        hi = mid
      else
        lo = mid + 1
    }
  }
  else{
    while(lo < hi){
      var mid = (lo + hi) >> 1
      // if(x < key(a[mid]))
      //   hi = mid
      // else
      //   lo = mid + 1
      if(key(x, a[mid], argExtra)>0)
        hi = mid
      else
        lo = mid + 1
    }
  }
  return lo
}


app.my_bisect_left=function(a, x, lo=0, hi=null, key=null, argExtra=null){
  `Return the index where to insert item x in list a, assuming a is sorted.
  The return value i is such that all e in a.slice(0,i) have e < x, and all e in
  a.slice(i) have e >= x.  So if x already appears in the list, a.insert(i, x) will
  insert just before the leftmost x already there.
  Optional args lo (default 0) and hi (default a.length) bound the
  slice of a to be searched.
  `

  if(lo < 0) throw new Error('lo must be non-negative')
  if(hi===null)  hi = a.length
  // Note, the comparison uses "<" to match the
  // __lt__() logic in list.sort() and in heapq.
  if(key===null){
    while(lo < hi){
      var mid = (lo + hi) >> 1
      if(a[mid] < x)
        lo = mid + 1
      else
        hi = mid
    }
  }
  else{
    while(lo < hi){
      var mid = (lo + hi) >> 1
      // if key(a[mid]) < x:
      //   lo = mid + 1
      // else:
      //   hi = mid
      if(key(x, a[mid], argExtra)>=0)
        hi = mid
      else
        lo = mid + 1
    }
  }
  return lo
}


//
// Obsolete
//
/*
reload=function(){ confirm('reload'); window.location.reload(); }
getColor = function(val, range){  var s=100, l=50, a=1,    h = 240-Math.round((240 / range) * val);      return "hsla("+h+","+s+"%,"+l+"%,"+a+")";    };
*/
