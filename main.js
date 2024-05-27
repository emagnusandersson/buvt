
// Install electron
// Windows:
//   npx electron .
//   npm i -g electron
//   electron .
// Linux:
//   npx electron28 .
//   npm start
//   electron28 .




// Executed by execCommand
// /home/magnus/progC/0NT/20230414ListFolder/main
// rsync
// stat "--format=%i %.Y %f %s@%n" '+strPar+charF+strPrefix+'*'           // only in old myStatsOfDirContent

// md5sum
// echo -n strData | md5sum
// realpath --relative-to fsDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

// Todo:
// Write data to windows


// ssh l750.local python /home/magnus/progJS/buvt/buvtPyScript/buvtPyScript.py parseTreeNDump --leafFilter .buvt-filter --leafFilterFirst .buvt-filter --fiDir /home/magnus/progPython/buvt-SourceFs/Source

// rsync -rtvzPi --files-from="/home/magnus/progPython/buvt-SourceFs/list.txt" --delete /home/magnus/progPython/buvt-SourceFs/Source/ /home/magnus/progPython/buvt-SourceFs/Target/

// When hovering settings row it should be enlighted
// Continue-button in bottom-bar.
// Settings: drag: scroll when close to top or bottom
// List/count soft links
// Window starts with the lowest part outside of screen
// Stream data when parsing from pythonscript
// divDisclaimer
// Separate settings (table) for T2D and T2T
// boSkippSoftLinks in settings
// getLeafDb method on ArgumentTab
// mT1, mTm, 1Tm rows instead of Mult
//   python output on separate stream
// T2D->"Do actions" should copy all timestamps from all files (even unchanged) (The tricky thing is that then one would have to list all the unchanged files in file too (not only those who require an action))
// Checkbox switching default-Include/Exclude

// Selectable Result-folder in settings
// T2D compare(target)-to-its-db-file (using sm only (not id))

// In SyncTreeToDb one could refer to "Source" as "Tree" instead. Although it would break conformity with SyncTreeToTree.
// NM could be renamed to Defragmented

// Windows softlinks points back to the source
// Tried to implement remote backing up using ssh and scp, unfortunately scp copies files with timestamp without decimals.

// Documentation:
// Separate Video for Hard links
// Separate Video for the .buvt-filter
// Video for buvt
//   Excuses for the software
//     Comparisson with rsync
//     Filesystems should have space (field) for a hash-code in the meta-data
//   
/*
T2T
T2D
These links jumps you to an other program.
  (Examining a file)
  The actual lists starts on the forth row
Hardlink check...
.. So I have these filterfiles...
SM-Matching...
Sync is the same as Comapare+DoActions...
Check...
Settings...
Mainly tested on Linux...
*/

// Flaws:
//   As the scanning is done in python, there is no good way to interupt, which can be a bit awkward


//globalThis.appMy=globalThis;
const {app, BrowserWindow, ipcMain}=require('electron')
//const minimist=require('minimist')
const path = require('node:path')
// const fs = require('node:fs');
// appMy.fsPromises = fs.promises;
const objLibSettingsPre = require('./libSettingsPre.js');
const objSettings = require('./settings.js');
const objLib = require('./lib.js');
const objLibFs = require('./libFs.js');

// globalThis.strOS=process.platform
// globalThis.charF=strOS=='win32'?'\\':'/';

// ipcMain.handle('readFile', async (ev, fiName) =>{
//   var p=fsPromises.readFile(fiName);
//   try{var buf=await p;}catch(err){console.error(err); return}
//   return buf.toString()
// })
var intWidthDefault=900, intHeightDefault=700

var argv=process.argv
//var argv = minimist(process.argv.slice(2));

app.on('ready', async ()=>{
  var fsDataHome=await getDataHome();
  var fsMyStorageMain=fsDataHome+charF+leafMyStorageMain;
  var myStorageMain=new objLibFs.MyStorage(fsMyStorageMain)

  var [err, objBound]=await myStorageMain.getItem('objBound');  if(err) return [err];
  var [err, boMaximized]=await myStorageMain.getItem('boMaximized');  if(err) return [err];
  console.log('g')


  ipcMain.handle('getArgv', async () =>process.argv)

  const myWindow=new BrowserWindow({
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false,
      //preload: path.join(__dirname, 'preload.js')
      // width:intWidthDefault,
      // height:intHeightDefault,
      // icon: __dirname + '/icons/iconWhite24.png',
    }
  });
  if(argv.indexOf('--dbg')!=-1) myWindow.webContents.openDevTools()
  myWindow.loadFile('index.html')
  myWindow.setIcon(__dirname + '/icons/iconWhite24.png')

  //console.log(`objBound ${JSON.stringify(objBound)}`)
  if(!objBound) {objBound={width:intWidthDefault, height:intHeightDefault};}
  myWindow.setBounds(objBound)
  if(boMaximized) myWindow.maximize()

  var cbStoreWindowBound=async function(ev){
    var objBound=myWindow.getBounds()
    //console.log(`objBound ${JSON.stringify(objBound)}`)
    var boMaximized=myWindow.isMaximized()
    timerStoreWindowBound=null
    var [err]=await myStorageMain.setItemPre('boMaximized',boMaximized); if(err) console.error(err) //Sets the variable in cache only
    var [err]=await myStorageMain.setItem('objBound',objBound); if(err) console.error(err)
    //console.log(`Stored objBound: ${JSON.stringify(objBound)}, boMaximized: ${boMaximized}`)
  }
  var timerStoreWindowBound=null
  myWindow.on('move', async function(ev){
    //console.log(`move`)
    if(timerStoreWindowBound) clearTimeout(timerStoreWindowBound)
    timerStoreWindowBound=setTimeout(cbStoreWindowBound, 300)
  })
  myWindow.on('resize', async function(ev){
    //console.log(`resize`)
    if(timerStoreWindowBound) clearTimeout(timerStoreWindowBound)
    timerStoreWindowBound=setTimeout(cbStoreWindowBound, 300)
  })
  myWindow.on('maximize', async function(ev){
    //console.log(`maximize`)
    var boMaximized=myWindow.isMaximized()
    var [err]=await myStorageMain.setItem('boMaximized',boMaximized); if(err) console.error(err)
    if(timerStoreWindowBound) { clearTimeout(timerStoreWindowBound); timerStoreWindowBound=null;}
  })
  


})

