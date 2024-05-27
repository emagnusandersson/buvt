
"use strict"

//import fs, {promises as fsPromises} from "fs";
//import fs from "fs";
//var fsPromises=fs.promises
//const fsPromises = require('fs').promises;

//await import('./lib.js');
//const axios = require('./lib.js');

//import fs, {promises as fsPromises} from "fs";


// Executed by execCommand
// /home/magnus/progC/0NT/20230414ListFolder/main
// rsync
// stat --format="%i %.Y %f %s@%n" '+strPar+charF+strPrefix+'*'           // only in old myStatsOfDirContent

// md5sum
// echo -n strData | md5sum
// realpath --relative-to fsDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

// Todo:
// Cancel button when checking
// Dark mode
// "Save sort-order"-button, indDisplay
// MetaMatch should be called Renamed
// Check if one could have dry run on checking instead of "Check existance"
// Checkbox switching default-Include/Exclude

// T2D compare(target)-to-its-db-file (using sm only (not id))
// Change name to myBuvt

// ind stuff in argumentTab
//   afterDrag/afterSort: show butSaveOrder

// Documentation:
// Separate Video for Hard links
// Separate Video for the .buvt-filter
// Video for buvt
//   Excuses for the software
//     Comparisson with rsync)
//     Filesystems should have space (field) for a hash-code in the meta-data
//   

// var win = nw.Window.get();
// win.showDevTools()

// function onWindowClose() {
//     Neutralino.app.exit();
// }

// Neutralino.init();

// Neutralino.events.on("windowClose", onWindowClose);




// const fs = require('node:fs');
// var fsPromises = fs.promises;


// var p=fsPromises.readFile('test.txt');
// var [err, buf]=await toNBP(fsPromises.readFile('test.txt'));    if(err) {console.error(err); return}
// console.log(buf.toString())




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

var intConsoleHDefault=80

var funLoad=async function(){
  var boPython=true
  gThis.TreeParser=boPython?TreeParserPython:TreeParserJS
  //var res =await Neutralino.os.execCommand("echo ä");
  //var [err, objT] =await Neutralino.window.setSize({ width: 900, height: 700 }).toNBP();
  
  //setTray()
  //var [err, objT] =await Neutralino.window.maximize().toNBP();

  // var [err, objT] =await Neutralino.computer.getOSInfo().toNBP();
  // var StrOSTypePat=['Linux', 'Windows'];
  // var StrOSType=['linux', 'windows'];
  // gThis.strOSType='linux'
  // for(var i=0;i<StrOSType.length;i++){
  //   if(objT.name.indexOf(StrOSTypePat[i])!=-1) strOSType=StrOSType[i];
  // }
  // if(err) { debugger; console.error(err);}
  //gThis.charF=strOS=='win32'?'\\':'/'
  gThis.strExec=strOS=="win32"?"start":"xdg-open"


  //var [stdErr, stdOut] = await execMy1("unset HISTFILE");   if(stdErr) { debugger; return [stdErr];}
 
  var themeOS=gThis.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"
  console.log("(prefers-color-scheme: dark): "+themeOS);

  gThis.fsDataHome=await getDataHome();
  gThis.FsFile=await calcFsFile(fsDataHome);
  gThis.fsMyStorage=fsDataHome+charF+leafMyStorage;

  //var fsDirSource=NL_CWD;
  var flFile='resources/txt2.txt';
  //var [err, boExist]=await fileExist(flFile); if(err) return [err]

  gThis.imgBusy=createElement('img').prop({src:fiBusy, alt:"busy"});
  gThis.busyLarge=createElement('img').prop({src:fiBusyLarge, alt:"busy"}).css({position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', 'z-index':'1000', border:'solid 1px'}).addClass('invertOnDark').hide();
  elBody.append(busyLarge);

  var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
  var divMessageTextW=createElement('div').myAppend(divMessageText).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
  //elBody.append(divMessageTextW);

  //var [err]=await mkdir(fsDataHome+'/abc'); if(err) return [err];
  
  var [err, boExist]=await fileExist(fsDataHome); if(err) return [err];
  if(!boExist){
    var [err]=await myMkFolders([fsDataHome]);  if(err) {debugger; return [err]}
  }
 
  // var [err, response]=await fetch(wPyParserOrg).toNBP(); if(err) return [err];
  // var [err, strPython]=await response.text().toNBP(); if(err) return [err];
  // var hashPython=await sha256(strPython)
  // gThis.fsPyParser=fsDataHome+charF+stemPyParser+'_'+hashPython.slice(0,10)+'.py';
  // var [err, boFileExist]=await fileExist(fsPyParser); if(err) return [err];
  // if(!boFileExist){
  //   var [err, buf]=await writeFile(fsPyParser, strPython);    if(err) {console.error(err); return}
  // }
  gThis.fsPyParserOrg=__dirname+charF+wPyParserOrg

  gThis.divConsole=createElement('pre').css({'font-family':'monospace', background:'var(--bg-color)', 'white-space':'pre-wrap', margin:'0px', width:"initial", height:intConsoleHDefault+'px', 'overflow-y':'scroll', 'text-align':'left'})//.addClass('message')
  gThis.myConsole=new MyConsole(divConsole)
  //elBody.append(divConsole);
  var funDragHRStartWHeight=function(){
    viewFront.addClass('unselectable')
    return divConsole.offsetHeight;
  }
  var funDragHR=function(hNew){
    divConsole.css('height', hNew+'px');
    viewFront.setBottomMargin(hNew)
    viewCheck.setBottomMargin(hNew)
    argumentTab.setBottomMargin(hNew)
  }
  var funDragHREnd=function(){
    viewFront.removeClass('unselectable')
  }
  gThis.dragHR=dragHRExtend(createElement('hr'), funDragHRStartWHeight, funDragHR, funDragHREnd); dragHR.css({height:'0.3em',background:'var(--bg-colorEmp)',margin:0});
  gThis.butClear=createElement('button').myAppend('C').prop({title:'Clear output console (and match results)'}).css({position: 'absolute', right: '0px', 'z-index':1}).on('click',  function(){
    myConsole.clear();
    viewFront.clearColumnDivsResult()
  });

  gThis.hovHelp=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient'); //.css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'}); //on('click', function(){return false;})    //'pointer-events':'none',
  gThis.divHelpProt=createElement('div').addClass('popupHoverHelp')

  gThis.divTop=divTopCreator(createElement('div')).css({display:'block', margin:'0.2em auto 0.2em'});

  gThis.viewFront=viewFrontCreator(createElement('div')).addClass('viewDiv');
  gThis.viewCheck=viewCheckCreator(createElement('div')).addClass('viewDiv');
  gThis.argumentSetPop=argumentSetPopExtend(createElement('div'));
  gThis.argumentDeletePop=argumentDeletePopExtend(createElement('div'));
  gThis.argumentTab=argumentTabExtend(createElement('div')).addClass('viewDiv');
  argumentTab.on('myupdate', async function(){await divTop.mySetLinkNLabel()});
  await divTop.mySetLinkNLabel();


  gThis.MainDiv=[viewFront, viewCheck, argumentTab, argumentSetPop, argumentDeletePop]; //viewT2D, viewT2T , editDiv, adminDiv
  gThis.StrMainDiv=MainDiv.map(obj=>obj.toString());
  gThis.StrMainDivFlip=array_flip(StrMainDiv);

  funDragHR(intConsoleHDefault)


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
  argumentTab.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    var [err]=await this.setUpDom(); if(err) return [err]
    divTop.setButTab(this.toString())
    return [null, true];
  }

  //var MainNonDefault=AMinusB(MainDiv, [viewT2D]); MainNonDefault.forEach(ele=>ele.hide());
  MainDiv.forEach(ele=>ele.hide());
  elBody.append(...MainDiv);
  viewFront.setVis()
}


funLoad()



  
