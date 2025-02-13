"use strict"


gThis.TDataReadNSync=async function(arg){
  var {flTargetDataDir, fsTargetDbDir, strHostTarget}=arg; //, fsTargetDataDir
  var FlF=[]
  if(flTargetDataDir){
    var fleTargetDataDir=flTargetDataDir+charF
    //if(fsTargetDataDir==fsTargetDbDir) return [null];
    if(flTargetDataDir.length==0) return [Error('flTargetDataDir.length==0')];
    var [err, strData, boFileExist]=await readStrFileWHost(fsTargetDbDir+charF+settings.leafDbB, strHostTarget); if(err) return [err]
    var strData=strData.trim(), FlF;
    if(strData) FlF=strData.split('\n'); else FlF=[];
    var obj={}; for(var i=0;i<FlF.length;i++){ var flf=trim(FlF[i], charF)+charF; obj[flf]=1; }; FlF=Object.keys(obj)
    var indCur; for(var i=0;i<FlF.length;i++){ if(FlF[i]==fleTargetDataDir){ indCur=i; break;}}
    if(typeof indCur=='undefined') {FlF.push(fleTargetDataDir); indCur=FlF.length-1;}

    var FsF=FlF.map(flTmp=>fsTargetDbDir+charF+flTmp);
    var [err, BoExist]=await fileExistArr(FsF); if(err) {debugger; return [err];}

    var strData=FlF.join('\n')
    var [err]=await writeFileRemote(fsTargetDbDir+charF+settings.leafDbB, strData, strHostTarget); if(err) {debugger; return [err];}
  }
  return [err, {FlF, BoExist, indCur}]
}

gThis.divTDataListCreator=function(el){
  el.clearUI=function(){ dl.empty(); el.hide()}
  el.setUI=function(arg){
    var {FlF, BoExist, indCur}=arg
    dl.empty();
    
    var Dd=[]
    for(var i=0;i<FlF.length;i++){
      var flF=FlF[i], boExist=BoExist[i]
      if(boExist) {var strColor='--text-green', strText=strExist, title='Exists'}else{var strColor='--text-red', strText=strNotExist, title='Does not exist'}
      if(i==indCur) {strText+=strCurrent; title+=', current';}
      var spanExist=createElement('span').css({color:`var(${strColor}`, 'margin-left':'0.5em'}).myText(strText).attr({title});
      var dd=createElement('dd').myAppend(flF, spanExist);
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
