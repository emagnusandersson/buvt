
"use strict"

// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

//import fs, {promises as fsPromises} from "fs";
//import fs from "fs";
//var fsPromises=fs.promises
//const fsPromises = require('fs').promises;

//await import('./lib.js');
//const axios = require('./lib.js');

//import fs, {promises as fsPromises} from "fs";

function onWindowClose() {
    Neutralino.app.exit();
}


Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);



globalThis.app=globalThis;
app.leafFilter=".buvt-filter"
//app.leafFilterFirst=leafFilter



const normalizePath = path => path.replace(/[\\/]+/g, '/');


window.elHtml=document.documentElement; window.elBody=document.body;
window.boTouch = Boolean('ontouchstart' in document.documentElement);

var uLibImageFolder='./icons/'
var uBusy=uLibImageFolder+'busy.gif';
var uBusyLarge=uLibImageFolder+'busyLarge.gif';
var uIncreasing=uLibImageFolder+'blackTriangleUp.png';
var uDecreasing=uLibImageFolder+'blackTriangleDown.png';
var uUnsorted=uLibImageFolder+'blackTriangleUpDown.png';

var charBackSymbol='◄';
var charDelete='✖'; //x, ❌, X, ✕, ☓, ✖, ✗, ✘


var funLoad=async function(){
  var [err, objT] =await Neutralino.computer.getOSInfo().toNBP();
  var StrOSTypePat=['Linux', 'Windows'];
  var StrOSType=['linux', 'windows'], strOSType='linux'
  for(var i=0;i<StrOSType.length;i++){
    if(objT.name.indexOf(StrOSTypePat[i])!=-1) strOSType=StrOSType[i];
  }
  if(err) { debugger; console.error(err);}
  //var fsDirSource=NL_CWD;
  var flFile='resources/txt2.txt';
  //var [err, boExist]=await fileExist(flFile); if(err) return [err]

  app.imgBusy=createElement('img').prop({src:uBusy, alt:"busy"});

  var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
  var divMessageTextW=createElement('div').myAppend(divMessageText).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
  elBody.append(divMessageTextW);

  app.hovHelpMy=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient').css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'}); //on('click', function(){return false;})    //'pointer-events':'none',
  app.imgHelp=hovHelpMy;

  app.viewFront=viewFrontCreator(createElement('div'))
  app.argumentSetPop=argumentSetPopExtend(createElement('div'));
  app.argumentDeletePop=argumentDeletePopExtend(createElement('div'));
  app.argumentTab=argumentTabExtend(createElement('div')).addClass('viewDiv');


  app.MainDiv=[viewFront, argumentSetPop, argumentDeletePop, argumentTab]; //, editDiv, adminDiv
  app.StrMainDiv=MainDiv.map(obj=>obj.toString());
  app.StrMainDivFlip=array_flip(StrMainDiv);

  var MainNonDefault=AMinusB(MainDiv, [viewFront]); MainNonDefault.forEach(ele=>ele.hide());
  elBody.append(...MainDiv);

  viewFront.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    await this.setUp();
    return true;
  }
  argumentTab.setVis=async function(){
    MainDiv.forEach(ele=>ele.hide()); this.show();
    this.setUp();
    return true;
  }
}


funLoad()