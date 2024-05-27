
class MyConsole{
    constructor(div){ this.div=div; this.indMark=0; this.indCur=0;}
    clear(){this.div.textContent="";}
    save(){ this.indMark=this.indCur; return this; }
    restore(){ this.indCur=this.indMark; return this; }
    clearBelow(){this.div.innerHTML=this.div.innerHTML.slice(0, this.indCur); return this;}
    cursorUp(){
      var indLastEnd=this.div.innerHTML.lastIndexOf('\n', this.indCur-1); if(indLastEnd==-1) return Error('on top line');
      var x=this.indCur-indLastEnd-1;
      if(indLastEnd==0) var indLastStart=0;
      else{
        var indLastLastEnd=this.div.innerHTML.lastIndexOf('\n', indLastEnd-1);
        var indLastStart=indLastLastEnd==-1?0:indLastLastEnd+1
      } 
      this.indCur=indLastStart+x;
      return null;
    }
    makeSpaceNSave(){this.print('\n\n'); this.cursorUp(); this.cursorUp(); this.save(); return this;}
    myReset(){this.restore(); this.clearBelow(); return this;}
    setCur(){this.indCur=this.div.innerHTML.length; return this;}
    print(str) {
      var {div:el}=this
      var boBottom=Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1
      el.innerHTML=el.innerHTML.slice(0,this.indCur)+str; this.setCur(); 
      if(boBottom) el.scrollTop=el.scrollHeight
      return this;
    }
    printNL(str) { this.print(str+'\n'); return this;}
    log(str){this.print(str+'\n'); return this;}
    error(str) { 
      if(str instanceof Error) {console.error(str); str=str.message;} 
      else if(typeof str=='object' && 'message' in str) {console.error(str.message); str=str.message;} 
      this.print(`<font style="color:var(--text-red)">Error: ${str}</font>\n`);
      return this;
    }
  }
  
