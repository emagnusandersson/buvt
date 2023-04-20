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

function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

function openDocs() {
    Neutralino.os.open("https://neutralino.js.org/docs");
}

function openTutorial() {
    Neutralino.os.open("https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj");
}

function setTray() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

function onWindowClose() {
    Neutralino.app.exit();
}


Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

//showInfo();





globalThis.app=globalThis;
app.leafFilter=".buvt-filter"
app.leafFilterFirst=leafFilter



const normalizePath = path => path.replace(/[\\/]+/g, '/');


window.elHtml=document.documentElement; window.elBody=document.body;




var funLoad=async function(){
  //var fsDirSource=NL_CWD;
  //alert("f")
  var flFile='resources/txt2.txt';
  //var [err, boExist]=await fileExist(flFile); if(err) return [err]

  var fiDirSource=await getItemN('fiDirSource');  if(fiDirSource===null)  fiDirSource="";
  var fiDirTarget=await getItemN('fiDirTarget');  if(fiDirTarget===null)  fiDirTarget="";
  var fiMeta=await getItemN('fiMeta');  if(fiMeta===null)  fiMeta="";
  var flPrepend=await getItemN('flPrepend');  if(flPrepend===null)  flPrepend="";

  // var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {console.log(err.message); debugger; return;}
  // var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {console.log(err.message); debugger; return;}
  //var prom = Neutralino.filesystem.readFile(flFile); 
  // var fsFile=fsDirSource+'/'+flFile;
  // var [err, DirEnt]=await Neutralino.filesystem.readDirectory('.').toNBP();
  //var [err, stats] = await Neutralino.filesystem.getStats(flFile).toNBP(); debugger
  

  
  var labSource=createElement('b').myText('Source');
  var labTarget=createElement('b').myText('Target');
  var labMeta=createElement('b').myText('Meta');
  var labFlPrepend=createElement('b').myText('flPrepend');
  // var inpSource=createElement('input').prop({type:'text'}); inpSource.value=fiDirSource
  // var inpTarget=createElement('input').prop({type:'text'}); inpTarget.value=fiDirTarget
  app.inpSource=createElement('input').prop({type:'text'}).attr('value',fiDirSource).on('change',  function(e){ 
    setItemN('fiDirSource',this.value);return false;
  } );
  app.inpTarget=createElement('input').prop({type:'text'}).attr('value',fiDirTarget).on('change',  function(e){ 
    setItemN('fiDirTarget',this.value);return false;
  } );
  app.inpMeta=createElement('input').prop({type:'text'}).attr('value',fiMeta).on('change',  function(e){ 
    setItemN('fiMeta',this.value);return false;
  } );
  app.inpFlPrepend=createElement('input').prop({type:'text'}).attr('value',flPrepend).on('change',  function(e){ 
    setItemN('flPrepend',this.value);return false;
  } );
  var Tmp=[inpSource, inpTarget, inpMeta, inpFlPrepend]; Tmp.forEach(ele=>ele.css({width:"20em"})); // span[name=cb]
  var divSource=createElement('div').myAppend(labSource, inpSource);
  var divTarget=createElement('div').myAppend(labTarget, inpTarget);
  var divMeta=createElement('div').myAppend(labMeta, inpMeta);
  var divFlPrepend=createElement('div').myAppend(labFlPrepend, inpFlPrepend);
  var divA=createElement('div').myAppend(divSource, divTarget, divMeta, divFlPrepend);
  app.divOut=createElement('div').myAppend('output');
  var butCompareTreeToTree=createElement('button').myAppend('Compare tree to tree').on('click', compareTreeToTree);
  var butHardLinkCheck=createElement('button').myAppend('Check for hard links').on('click', hardLinkCheck);
  elBody.myAppend(divA, butHardLinkCheck, butCompareTreeToTree, divOut)

  console.log("h")

}



funLoad()