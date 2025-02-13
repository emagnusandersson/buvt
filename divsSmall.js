"use strict"



gThis.divTDataListCreator=function(el){
  el.clearUI=function(){ dl.empty(); el.hide()}
  el.setUI=function(arg){
    var {FleF, BoExist, indCur}=arg
    dl.empty();
    
    var Dd=[]
    for(var i=0;i<FleF.length;i++){
      var fleF=FleF[i], boExist=BoExist[i]
      if(boExist) {var strColor='--text-green', strText=strExist, title='Exists'}else{var strColor='--text-red', strText=strNotExist, title='Does not exist'}
      if(i==indCur) {strText+=strCurrent; title+=', current';}
      var spanExist=createElement('span').css({color:`var(${strColor}`, 'margin-left':'0.5em'}).myText(strText).attr({title});
      var dd=createElement('dd').myAppend(fleF, spanExist);
      Dd[i]=dd
    }
    dl.myAppend(...Dd)
    el.toggle(Dd.length);
  }

  var lab=createElement('span').myAppend('Separate TData folders:').attr({title:`Other target folders from other back-ups (from other computers perhaps).
All target folders (including the current) are read-only. (Only entries outside of these folders have their mtime changed.)`}); //TData-folders
  var dl=createElement('div').css({'vertical-align':'middle'}) //.attr({disabled:true})
  el.myAppend(lab, dl).css({'grid-area':'1/2', background:'var(--bg-colorEmp)'})
  el.hide()
  return el
}
