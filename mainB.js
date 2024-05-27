
"use strict"


//await import('./lib.js');
//const axios = require('./lib.js');



// Executed by execCommand
// /home/magnus/progC/0NT/20230414ListFolder/main
// rsync
// stat "--format=%i %.Y %f %s@%n" '+strPar+charF+strPrefix+'*'           // only in old myStatsOfDirContent

// md5sum
// echo -n strData | md5sum
// realpath --relative-to fsDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

//const response=await window.myBridge.readFile('test.txt')

const { contextBridge, ipcRenderer } = require('electron/renderer')

const normalizePath = path => path.replace(/[\\/]+/g, '/');


gThis.elHtml=document.documentElement; gThis.elBody=document.body;
gThis.boTouch = Boolean('ontouchstart' in document.documentElement);
//var uLibImageFolder='./icons/'
var fieImageFolder='./icons/'
var fiBusy=fieImageFolder+'busy.gif';
var fiBusyLarge=fieImageFolder+'busyLarge.gif';
var fiIncreasing=fieImageFolder+'blackTriangleUp.png';
var fiDecreasing=fieImageFolder+'blackTriangleDown.png';
var fiUnsorted=fieImageFolder+'blackTriangleUpDown.png';


var charBackSymbol='◄';
var charDelete='✖'; //x, ❌, X, ✕, ☓, ✖, ✗, ✘

var intConsoleHDefault=70

var funLoad=async function(){
  const argv=await ipcRenderer.invoke('getArgv')
  //gThis.boAllowRemoteTarget=(argv.indexOf('--allowRemoteTarget')!=-1) 
  //gThis.boExperiment=(argv.indexOf('--experiment')!=-1) 
  //gThis.boWSeparateTargetDb=(argv.indexOf('--wSeparateTargetDb')!=-1) 
  gThis.boWNonSeparateTargetDb=(argv.indexOf('--wNonSeparateTargetDb')!=-1)
  //gThis.boWSeparateTargetDb=!boWNonSeparateTargetDb
  
  gThis.boDbg=(argv.indexOf('--dbg')!=-1) 
  ArgumentTabRow.extendClass()


  var boPython=true
  gThis.TreeParser=boPython?TreeParserPython:TreeParserJS
  // var StrOSTypePat=['Linux', 'Windows'];
  // var StrOSType=['linux', 'windows'];
  // gThis.strOSType='linux'
  // for(var i=0;i<StrOSType.length;i++){
  //   if(objT.name.indexOf(StrOSTypePat[i])!=-1) strOSType=StrOSType[i];
  // }
  // if(err) { debugger; console.error(err);}
  //gThis.charF=strOS=='win32'?'\\':'/'
  gThis.strExec=strOS=="win32"?"start":"xdg-open"


  //var [stdErr, stdOut]=await execMy1("unset HISTFILE");   if(stdErr) { debugger; return [stdErr];}
 
  var themeOS=gThis.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"
  console.log("(prefers-color-scheme: dark): "+themeOS);


  gThis.fsDataHome=await getDataHome();
  gThis.fsMyStorage=fsDataHome+charF+leafMyStorage;
  gThis.myStorage=new MyStorage(fsMyStorage)


  var [err, fiResultFolder]=await myStorage.getItem('fiResultFolder');  if(err) return [err];
  if(fiResultFolder) {
    var [err, fsResultFolder]=await myRealPath(fiResultFolder); if(err){debugger; return [err]}
  }else var fsResultFolder=fsResultFolderDefault;
  extend(gThis, {fsResultFolder})
  var [err]=await mkdir(fsResultFolder, {recursive:true});if(err) {debugger; return [err];}  

  await calcFs(fsResultFolder);

  //var fsSourceDir=NL_CWD;

  gThis.imgBusy=createElement('img').prop({src:fiBusy, alt:"busy"});
  //gThis.busyLarge=createElement('img').prop({src:fiBusyLarge, alt:"busy"}).css({position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', 'z-index':'1000', border:'solid 1px'}).addClass('invertOnDark').hide();
  //elBody.append(busyLarge);

  var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
  var divMessageTextW=createElement('div').myAppend(divMessageText).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
  elBody.append(divMessageTextW);


  gThis.interfacePython=new InterfacePython()
  var [err, boReZip]=await interfacePython.syncZip(); if(err) {debugger; return [err]}

  //var [err]=await mkdir(fsDataHome+'/abc'); if(err) return [err];
  
  var [err, boExist]=await fileExist(fsDataHome); if(err) return [err];
  if(!boExist){
    var [err]=await myMkFolders([fsDataHome]);  if(err) {debugger; return [err]}
  }


 
  gThis.myConfirmer=myConfirmerCreate(createElement('div'))
  

  gThis.divConsole=createElement('pre').css({'font-family':'monospace', background:'var(--bg-color)', 'white-space':'pre-wrap', margin:'0px', height:intConsoleHDefault+'px', 'overflow-y':'scroll', 'text-align':'left'})//.addClass('message')
  //gThis.myConsole=new MyConsole(divConsole)
  gThis.myConsole=new MyConsoleTerm()
  //elBody.append(divConsole);

  gThis.elTerminal=createElement('div').prop({'id':'terminal'}).css({'overflow-y':'auto', width:"100%"})
  

  gThis.term=new Terminal({convertEol: true});

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  
  term.open(elTerminal);
  //term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

  var funDragHRStartWHeight=function(){
    viewFront.addClass('unselectable')
    return elTerminal.offsetHeight;
  }
  var funDragHR=function(hNew){
    //divConsole.css('height', hNew+'px');
    elTerminal.css('height', hNew+'px');
    viewFront.setBottomMargin(hNew)
    viewCheck.setBottomMargin(hNew)
    viewExperiment.setBottomMargin(hNew)
    argumentTab.setBottomMargin(hNew)
    fitAddon.fit();
  }
  var funDragHREnd=function(){
    viewFront.removeClass('unselectable')
    fitAddon.fit();
  }
  gThis.dragHR=dragHRExtend(createElement('hr'), funDragHRStartWHeight, funDragHR, funDragHREnd); dragHR.css({height:'0.3em',background:'var(--bg-colorEmp)',margin:0});
  gThis.butClear=createElement('button').myAppend('C').prop({title:'Clear output console and tables.'}).css({}).on('click',  function(){
    myConsole.clear();
    viewFront.clearColumnDivsResult()
  }); //position: 'absolute', right: '0px', bottom:'18px', 'z-index':1

  gThis.elConsoleContainerTop=createElement('div')
  var elConsoleContainer=createElement('div').css({overflow:'auto', position:'fixed', bottom:'0px', width:'100%', opacity:'0.8', display:'flex', 'flex-direction':'column'})
  elConsoleContainer.myAppend(elConsoleContainerTop, dragHR, elTerminal); //, divConsole, butClear
  elBody.append(elConsoleContainer);

  gThis.hovHelp=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient'); //.css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'}); //on('click', function(){return false;})    //'pointer-events':'none',
  gThis.divHelpProt=createElement('div').addClass('popupHoverHelp')

  gThis.divTop=divTopCreator(createElement('div')).css({display:'block', margin:'0.2em auto 0.2em'});

  gThis.viewFront=viewFrontCreator(createElement('div')).addClass('viewDiv');
  gThis.viewCheck=viewCheckCreator(createElement('div')).addClass('viewDiv');
  gThis.viewExperiment=viewExperimentCreator(createElement('div')).addClass('viewDiv');
  gThis.argumentSetPop=argumentSetPopExtend(createElement('div'));
  gThis.argumentDeletePop=argumentDeletePopExtend(createElement('div'));
  gThis.argumentTab=argumentTabExtend(createElement('div')).addClass('viewDiv');
  argumentTab.on('myupdate', async function(){await divTop.mySetLinkNLabel()});
  var [err]=await argumentTab.constructorPart2();
  if(err){
    console.error()
    if(err.message=='no-argument-selected') { console.log(err.message); }
    else {debugger; console.error(err); return}
  }
  await divTop.mySetLinkNLabel();

  gThis.blanket=createElement('div').addClass("blanket").hide();

  gThis.MainDiv=[viewFront, viewCheck, viewExperiment, argumentTab, argumentSetPop, argumentDeletePop]; //viewT2D, viewT2T , editDiv, adminDiv
  gThis.StrMainDiv=MainDiv.map(obj=>obj.toString());
  gThis.StrMainDivFlip=array_flip(StrMainDiv);

  funDragHR(intConsoleHDefault)
  fitAddon.fit();


  viewFront.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    await this.setUp();
    divTop.setButTab(this.toString())
    return true;
  }
  // viewT2D.setVis=async function(){
  //   MainDiv.forEach(ele=>ele.hide()); this.show();
  //   await this.setUp();
  //   return true;
  // }
  // viewT2T.setVis=async function(){
  //   MainDiv.forEach(ele=>ele.hide()); this.show();
  //   await this.setUp();
  //   return true;
  // }
  viewCheck.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    await this.setUp();
    divTop.setButTab(this.toString())
    return true;
  }
  viewExperiment.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    await this.setUp();
    divTop.setButTab(this.toString())
    return true;
  }
  argumentTab.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    var [err]=await this.setUp(); if(err) return [err]
    divTop.setButTab(this.toString())
    return [null, true];
  }

  //var MainNonDefault=AMinusB(MainDiv, [viewT2D]); MainNonDefault.forEach(ele=>ele.hide());
  MainDiv.forEach(ele=>ele.hide());
  elBody.append(...MainDiv, blanket, myConfirmer, elConsoleContainer);
  viewFront.setVis()

}


funLoad()



  
