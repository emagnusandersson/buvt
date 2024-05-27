
"use strict"

gThis.msort=function(compare){
  var length = this.length,  middle = Math.floor(length / 2);
  //if(length < 2) return this;
  if(length==0) return [];
  if(length==1) return [this[0]];
  //return merge(    this.slice(0, middle).msort(compare),    this.slice(middle, length).msort(compare),    compare    );
  var a=this.slice(0, middle),  b=this.slice(middle, length);
  return merge(    msort.call(a,compare),    msort.call(b,compare),    compare    );
}

gThis.merge=function(left, right, compare){
  var result = [];
  while (left.length > 0 || right.length > 0){
    if(left.length > 0 && right.length > 0){
      if(compare(left[0], right[0]) <= 0){ result.push(left[0]);  left = left.slice(1);  }
      else{ result.push(right[0]); right = right.slice(1);  }
    }
    else if(left.length > 0){  result.push(left[0]);  left = left.slice(1);  }
    else if(right.length > 0){  result.push(right[0]);  right = right.slice(1);  }
  }
  return result;
}


/*******************************************************************************************************************
 * DOM handling
 *******************************************************************************************************************/

gThis.findPos=function(el) {
    var rect = el.getBoundingClientRect();
    //return {top:rect.top+document.body.scrollTop, left:rect.left + document.body.scrollLeft};
    return {top:rect.top+window.scrollY, left:rect.left + window.scrollX};
  }
  //var findPosMy=function(el) {
    //var curleft = 0, curtop = 0;
    //while(1){
      //curleft += el.offsetLeft; curtop += el.offsetTop;
      //if(el.offsetParent) el = el.offsetParent; else break;
    //}
    //return { left: curleft, top: curtop };
  //}
  
  
  gThis.removeChildren=function(myNode){
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
  }
  
  gThis.scrollTop=function(){ return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop; }
  gThis.scrollLeft=function(){ return window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft; }
  
  EventTarget.prototype.on=function(){ this.addEventListener.apply(this, [...arguments]); return this; }
  EventTarget.prototype.off=function(){ this.removeEventListener.apply(this, [...arguments]); return this; }
  //if(!Node.prototype.append) Node.prototype.append=Node.prototype.appendChild;
  if(!Node.prototype.prepend) Node.prototype.prepend=function(el){ this.insertBefore(el, this.firstChild);  }
  Node.prototype.myAppend=function(){ this.append.apply(this, [...arguments]); return this; }
  Node.prototype.myAppendHtml=function(){
    var arg=[...arguments], elTmp=null, argB=[];
    arg.forEach(ele=>{
      if(typeof ele=='string') {
        if(!elTmp) elTmp=createElement('div');
        elTmp.innerHTML=ele;  // Convert html to nodes (found in elTmp.childNodes)
        argB.push(...elTmp.childNodes);
      } else argB.push(ele);
    }); 
    this.append.call(this, ...argB); return this;
  }
  Node.prototype.myBefore=function(elN){
    this.parentNode.insertBefore(elN,this); return this;
  }
  Node.prototype.myAfter=function(elN){
    if(this.nextSibling) this.parentNode.insertBefore(elN,this.nextSibling); 
    else this.parentNode.append(elN)
    return this;
  }
  Node.prototype.myInsertAdjacentElement=function(strLoc, ...El){
    //if(strLoc=='afterbegin' || strLoc=='afterend')
    // El.forEach(ele=>{
    //   this.insertAdjacentElement(strLoc,ele);
    // })
    const fragment = createFragment();
    fragment.myAppend(...El);
    this.insertAdjacentElement(strLoc,fragment);
    return this;
  }
  Node.prototype.empty = function() {
    while (this.lastChild) {
      this.lastChild.remove();
    }
    return this;
  }
  Element.prototype.insertChildAtIndex=function(child, index){
    if(!index) index=0;
    if(index >= this.children.length){
      this.appendChild(child);
    }else{
      this.insertBefore(child, this.children[index]);
    }
  }
  Element.prototype.attr=function(attr, value) {
    if(!attr) return;
    if(typeof attr=='string') {
      if(arguments.length<2) return this.getAttribute(attr);
      attr=Object.fromEntries([[attr,value]])
    }
    for(var key in attr) { 
      var val=attr[key]
      if(val===undefined) this.removeAttribute(key);
      else this.setAttribute(key, val);
    }
    return this;
  }
  Element.prototype.prop=function(prop, value) {
    if(!prop) return;
    if(typeof prop=='string') {
      if(arguments.length<2) return this[prop];
      prop=Object.fromEntries([[prop,value]])
    }
    for(var key in prop) {
      var val=prop[key]
      if(val===undefined) this.removeAttribute(key);
      else this[key]=val;
    }
    return this;
  }
  Element.prototype.css=function(style, value) {
    if(!style) return;
    if(typeof style=='string') {
      if(arguments.length<2) return this.style[style];
      this.style[style]=value; return this;
    }
    for(var key in style) { this.style[key]=style[key];}
    for(var key in style) { this.style.setProperty[key]=style[key];}
    return this;
  }
  Element.prototype.cssExc=function(style, value) {  // (Exc=Exclamation mark) To handle !important
    if(!style) return;
    if(typeof style=='string') {
      if(arguments.length<2) return this.style[style];
      this.style[style]=value; return this;
    }
    //for(var key in style) { this.style[key]=style[key];}
    for(var key in style) {
      var val=style[key];
      var iExc=val.lastIndexOf('!')
      if(iExc==-1) {this.style[key]=style[key];}
      else{
        var valNormal=val.slice(0,iExc), valExc=val.slice(iExc+1); this.style.setProperty(key, valNormal, valExc);
      }  
        
    }
    return this;
  }
  Element.prototype.addClass=function() {this.classList.add(...arguments);return this;}
  Element.prototype.removeClass=function() {this.classList.remove(...arguments);return this;}
  Element.prototype.toggleClass=function() {this.classList.toggle(...arguments);return this;}
  Element.prototype.hasClass=function() {return this.classList.contains(...arguments);}
  Node.prototype.cssChildren=function(styles){  this.childNodes.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this;  }
  var cssChildren=function(El, styles){  El.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this;  }
  Node.prototype.myText=function(str){
    if(arguments.length==0) { return this.textContent; }
    if(typeof str!='string') { if(str==null) str=' '; str=str.toString(); }
    if(this.childNodes.length==1 && this.firstChild.nodeName=="#text" ) { this.firstChild.nodeValue=str||' ';  return this;} // Being a bit GC-friendly
    this.textContent=str||' '; return this;
  }
  Node.prototype.clear=function(){ this.innerHTML=""; return this; }
  Node.prototype.myHtml=function(str=' '){
    if(typeof str!='string') { if(str==null) str=' '; str=str.toString(); }
    this.innerHTML=str||' '; return this;
  }
  Node.prototype.hide=function(){
    if(this.style.display=='none') return this;
    this.displayLast=this.style.display;
    this.style.display='none';
    return this;
  }
  Node.prototype.show=function(){
    if(this.style.display!='none') return this;
    if(typeof this.displayLast!='undefined') var tmp=this.displayLast; else var tmp='';
    this.style.display=tmp;
    return this;
  }
  Node.prototype.toggle=function(b){
    if(typeof b=='undefined') b=this.style.display=='none'?1:0;
    if(b==0) this.hide(); else this.show();
    return this;
  }
  NodeList.prototype.toggle=function(b){
    if(typeof b=='undefined') {if(this.length) b=this[0].style.display=='none'?1:0; else return this;}
    this.forEach(function(ele){ ele.toggle(b); });
    return this;
  }
  gThis.createTextNode=function(str){ return document.createTextNode(str); }
  gThis.createElement=function(str){ return document.createElement(str); }
  gThis.createFragment=function(){ var fr=document.createDocumentFragment(); if(arguments.length) fr.append(...arguments); return fr; }
  
  gThis.getNodeIndex=function( elm ){ return [...elm.parentNode.childNodes].indexOf(elm); }
  Element.prototype.myIndex=function() {return [...this.parentNode.children].indexOf(this);}
  
  Element.prototype.offset=function() {
    var rect = this.getBoundingClientRect();
    return { top: rect.top + document.body.scrollTop,  left: rect.left + document.body.scrollLeft  };
  }
  
  Element.prototype.visible = function() {    this.style.visibility='';  return this;};
  Element.prototype.invisible = function() {    this.style.visibility='hidden'; return this; };
  Element.prototype.visibilityToggle=function(b){
    if(typeof b=='undefined') b=this.style.visibility=='hidden'?1:0;
    this.style.visibility= b?'':'hidden';
    return this;
  };
  
  Node.prototype.detach=function(){ this.remove(); return this; }
  
  gThis.isVisible=function(el) {  // Could be replaced with el.isVisible ?!?
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
  }
  


/*******************************************************************************************************************
 * popupHover: popup a elBubble when you hover over elArea
 *******************************************************************************************************************/
gThis.popupHover=function(elArea, elBubble, tClose=4){
  elBubble.css({position:'absolute', 'box-sizing':'border-box', margin:'0px', 'text-align':'left'}); //
  function setBubblePos(e){
    var xClear=6, yClear=6;
    var x = e.pageX, y = e.pageY;

    var borderMarg=10;
    var winW=window.innerWidth,winH=window.innerHeight,   bubW=elBubble.clientWidth,bubH=elBubble.clientHeight,   scrollX=scrollLeft(),scrollY=scrollTop();


    var boRight=true, boBottom=true;

    var boMounted=Boolean(elBubble.parentNode);
    if(boMounted){
      var xFar=x+xClear+bubW, xBorder=scrollX+winW-borderMarg;
      if(xFar<xBorder){ 
        x=x+xClear;
      } else {
        x=x-bubW-xClear;  // if the bubble doesn't fit on the right side then flip to the left side
        //x=x-xClear; boRight=false;
      }
        
      var yFar=y+yClear+bubH, yBorder=scrollY+winH-borderMarg;
      if(yFar<yBorder) {
        y=y+yClear;
      }else{ 
        y=y-bubH-yClear;   // if the bubble doesn't fit below then flip to above
        //y=y-yClear; boBottom=false;
      }
    } else {
      x=x+xClear;
      y=y+yClear;
    }
    if(x<scrollX) x=scrollX;
    if(y<scrollY) y=scrollY;
    //elBubble.style.top=y+'px'; elBubble.style.left=x+'px';
    elBubble.css({top:y+'px', left:x+'px'});
    //if(boRight) {elBubble.style.left=x+'px'; elBubble.style.right='';} else {elBubble.style.left=''; elBubble.style.right=x+'px'; }
    //if(boBottom) {elBubble.style.top=y+'px'; elBubble.style.bottom='';} else {elBubble.style.top=''; elBubble.style.bottom=y+'px'; } 
  };
  var closeFunc=function(){ 
    if(boTouch){ 
      elBubble.remove(); 
      if(boIOSTmp) elBlanket.remove();
      clearTimeout(timer);
    } 
    else { elBubble.remove();  }
  }
  var elBlanket, timer, boIOSTmp=boTouch;
  if(boIOSTmp){
    elBlanket=createElement('div').css({'background':'var(--bg-color)',opacity:0,'z-index': 9001,top:'0px',left:'0px',width:'100%',position:'fixed',height:'100%'});
    elBlanket.on('click', closeFunc);
  }
  if(boTouch){
    elArea.on('click', function(e){
      e.stopPropagation();
      if(elBubble.parentNode) closeFunc();
      else {
        elBody.append(elBubble); setBubblePos(e);
        clearTimeout(timer);  if(tClose) timer=setTimeout(closeFunc, tClose*1000);
        if(boIOSTmp) elBody.append(elBlanket);
      }
    });
    elBubble.on('click', closeFunc);
    elHtml.on('click', closeFunc);
    
  }else{
    elArea.on('mousemove', setBubblePos);  
    elArea.on('mouseenter', function(e){elBody.append(elBubble);});
    elArea.on('mouseleave', closeFunc);
  }
  elBubble.classList.add('popupHover'); 
}


gThis.myMenu=function(elWrap, elPar){
  var [elBut, elBubble]=elWrap.children
  //elWrap.css({position:"relative"});
  elBubble.css({position: "absolute", display:"none", 'z-index':1})
  var strEvOpen=boTouch?"focus":"mouseover", strEvClose=boTouch?"blur":"mouseout" 

  elBubble.css({left:0});  //.classList.add('popupHover'); 
  var funOpen=function() { 
    elBubble.show()
    //var elPar=elWrap.offsetParent;
    var {clientWidth:wPar, clientHeight:hPar}=elPar
    var {left, width, right, top, height, bottom} = elBut.getBoundingClientRect()
    var {clientWidth:wBub, clientHeight:hBub}=elBubble
    var topT, leftT

    var BoX=[wBub<wPar, left-wBub>0, right-wBub>0, left+wBub<wPar, right+wBub<wPar]
    var BoY=[hBub<hPar, top-hBub>0, bottom+hBub<hPar]
    labA:{
      if(BoY[2] || BoY[1]){
        topT=(BoY[2]?top+height:top-hBub) + scrollY; 
        if(BoX[2] || BoX[3]) { leftT=(BoX[3]?left:right-wBub) + scrollX;  }
        break labA;
      }
      var topT=scrollY
      if(BoX[4]) {  leftT=right + scrollX;  break labA; }
      if(BoX[1]) {  leftT=left-wBub + scrollX; break labA; }
      leftT=scrollX
    }
    var cssY={top:`${topT}px`, bottom:''}
    var cssX={left:`${leftT}px`, right:''}
    elBubble.css(cssX)
    elBubble.css(cssY);

  }
  var funClose=function() { elBubble.hide(); }
  elWrap.on(strEvOpen,funOpen).on(strEvClose,funClose)
}
