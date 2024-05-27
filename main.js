
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
// stat --format="%i %.Y %f %s@%n" '+strPar+charF+strPrefix+'*'           // only in old myStatsOfDirContent

// md5sum
// echo -n strData | md5sum
// realpath --relative-to fsDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

// Todo:
// NSM should be renamed to Defragged
// Clear table when pref is changed
// Write data to windows
// T2D->"Do actions" should copy all timestamps from all files (even unchanged) 
// remove flPrepend
// Cancel button when checking
// T2D: ManyToMany match of hashcodes
// MetaMatch should be called Renamed
// Checkbox switching default-Include/Exclude

// T2D-do-actions-confirm-button should not cover the console
// mT1, mTm, 1Tm rows instead of Mult
// Windows softlinks points back to the source
// T2D compare(target)-to-its-db-file (using sm only (not id))

// Test node.js-tree-parser (without python)

// Documentation:
// Separate Video for Hard links
// Separate Video for the .buvt-filter
// Video for buvt
//   Excuses for the software
//     Comparisson with rsync
//     Filesystems should have space (field) for a hash-code in the meta-data
//   

// Flaws:
//   As the scanning is done in python, there is no good way to interupt, which can be a bit awkward


//globalThis.appMy=globalThis;
const {app, BrowserWindow, ipcMain}=require('electron')
//const minimist=require('minimist')
// const path = require('node:path')
// const fs = require('node:fs');
// appMy.fsPromises = fs.promises;

// globalThis.strOS=process.platform
// globalThis.charF=strOS=='win32'?'\\':'/';

// ipcMain.handle('readFile', async (ev, fiName) =>{
//   var p=fsPromises.readFile(fiName);
//   try{var buf=await p;}catch(err){console.error(err); return}
//   return buf.toString()
// })
var intWidth=900, intHeight=700

var argv=process.argv
//var argv = minimist(process.argv.slice(2));

app.on('ready', ()=>{
  const myWindow=new BrowserWindow({
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false,
      //preload: path.join(__dirname, 'preload.js')
      // width:intWidth,
      // height:intHeight,
      // icon: __dirname + '/icons/iconWhite24.png',
    }
  });
  if(argv[2]=='boDbg') myWindow.webContents.openDevTools()
  myWindow.setSize(intWidth,intHeight)
  myWindow.loadFile('index.html')
  myWindow.setIcon(__dirname + '/icons/iconWhite24.png')


})

