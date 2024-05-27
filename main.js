
// Install electron
// Windows:
//   npx electron .
//   npm i -g electron
//   electron .
// Linux:
//   npx electron32 .
//   npm start
//   electron32 .

// ssh-keygen
// ssh-copy-id YOURUSERNAME@localhost




// rsync
// stat "--format=%i %.Y %f %s@%n" '+strPar+charF+strPrefix+'*'           // only in old myStatsOfDirContent

// md5sum
// echo -n strData | md5sum
// realpath --relative-to fsDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

// Todo:
// Write data to windows

// scp -r sleek15.local:progJS/buvt ~/progJS/buvt

// ssh l750.local python /home/magnus/progJS/buvt/buvtPyScript/buvtPyScript.py parseTreeNDump --leafFilter .buvt-filter --leafFilterFirst .buvt-filter --fiDir /home/magnus/progPython/buvt-SourceFs/Source

// rsync -rtvzPi --files-from="/home/magnus/progPython/buvt-SourceFs/list.txt" --delete /home/magnus/progPython/buvt-SourceFs/Source/ /home/magnus/progPython/buvt-SourceFs/Target/

// Trying to find a bug in rsync:
// 2Gb of data, about 32000 files (no links, no files with case-collisions)
//   fat32
//     c660:
//       rsync via buvt: BUG: kernel NULL pointer dereference,  address: 0000000000000137
//       rsync with textfileinput: OK
//       rsync running normally: OK
//     r50:
//       rsync via buvt: general protection fault, probably for non-canonical address 0xffac1343feb908ff: 0000 [#1] PREEMPT SMP PTI
//       rsync with textfileinput: OK
//     sleek15:
//       rsync via buvt: error (forgot to write down error message)
//       rsync with textfileinput: OK
//   exfat
//     c660: (Also tested OK with 16G (although I don't remember the conditions.))
//       rsync via buvt: general protection fault, probably for non-canonical address 0xff9ee6950916c0de: 0000 [#1] PREEMPT SMP PTI
//       rsync with textfileinput: OK
//     r50: (Once OK (although I don't remember the conditions.))
//       rsync via buvt: BUG: kernel NULL pointer dereference,  address: 0000000000000030
//       rsync with textfileinput: general protection fault, probably for non-canonical address 0xff9c758324d6c0de: 0000 [#1] PREEMPT SMP PTI
//       rsync running normally: Kernel panic
//     sleek15:
//       rsync via buvt: OK
//     l750: Segmentation fault
//     cq61: Segmentation fault
//     easynote: Segmentation fault
// linktest, 2 files (one normal file and one link):
//   exfat:
//     r50: Killed, rsync: [generator] write error: Broken pipe (23), rsync error: error in socked IO (code 10) at io.c(848) [generator=3.3.0]
//     l750: (error (exact message not recorded, (but like above sort of)))
//     cq61: not tested
//     easynote: not tested

// ^([fl] +[0-9]+ +[0-9a-f]+ +[0-9]+ +[0-9]+) (.+)$
// \1 sync/\2

// boIncludeLinks
// boAbortIfEntryNamesOnlyDifferingInCaseAreFound, boCheckCaseCollision
// "do action"-button should be disabled after it is clicked
// T2T "deleted" should be first 
// Elegantly skipp links when target doesn't support them
// List/count soft links
// boIncLinks in settings
// make buvt-filter work as rsync-filter
// Stream data when parsing from pythonscript
// Create .bak-file when updating target db through T2T
// Window starts with the lowest part outside of screen
// send python kill signal
// Red cells when value is non-zero.
// divDisclaimer
// Separate settings (table) for T2D and T2T
// getLeafDb method on ArgumentTab
// mT1, mTm, 1Tm rows instead of Mult
//   python output on separate stream
// Checkbox switching default-Include/Exclude

// Selectable Result-folder in settings
// T2D compare(target)-to-its-db-file (using sm only (not id))

// In SyncDb one could refer to "Source" as "Tree" instead. Although it would break conformity with SyncT2T.

// Windows softlinks points back to the source

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
  //console.log('g')


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
  var boDbg=argv.indexOf('--dbg')!=-1; 
  if(boDbg) myWindow.webContents.openDevTools()
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

