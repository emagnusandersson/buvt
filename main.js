
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
// realpath --relative-to fsDataDir strFilename


// Note!!! max file size is 999999999999 bytes (So 1 TB is too big) (createSM64 should be rewritten if one needs bigger sizes)

// Todo:
// Write data to windows

// scp -r sleek15.local:progJS/buvt ~/progJS/buvt

// ssh l750.local python /home/magnus/progJS/buvt/buvtPyScript/buvtPyScript.py parseTreeNDump --leafFilter .buvt-filter --leafFilterFirst .buvt-filter --fiDataDir /home/magnus/progPython/buvt-SourceFs/Source

// rsync -rtvzPi --files-from="/home/magnus/progPython/buvt-SourceFs/list.txt" --delete /home/magnus/progPython/buvt-SourceFs/Source/ /home/magnus/progPython/buvt-SourceFs/Target/

// rsync -nrl --filter "dir-merge /.buvt-filter" --filter ! --filter "merge /run/media/magnus/myPassport/.rsync-filter-linkTest" --out-format='%n' /run/media/magnus/myPassport/ trash




// ^([fl] +[0-9]+ +[0-9a-f]+ +[0-9]+ +[0-9]+) (.+)$
// \1 sync/\2

// TargetOther should be targetB
// [Find relevant tree SM not found in relevant local Db] or [Find new SM] [categorize SM-occurancies]
//   created_SM.txt
//   deleted_SM.txt
//   inc_number_of_certain_SM.txt (copiesAdded.txt)
//   dec_number_of_certain_SM.txt (copiesDeleted.txt)
//   NSMMatch.txt (untouched.txt)
//   1T1.txt
//   NTN.txt (remainer)
// [Calc hashes of created_SM.txt] 
//   created_SM.txt
// [Find SM collision without consistent hash]
//   smMultHashNonConsistent_S.txt
// [Find new mtimes]
//   smToChange_S.txt,  smRevert_S.txt
// [Write new mtimes], [Revert]
//   (to created_SM.txt as well as to actual files)
// [Merge created_SM.txt to db]


// When syncing T2T from myPassport to c660 with tResT=9 lots of files gets a timestamp with 9 significant decimals. Though on the source (myPassport) (both actual file as well as in the database) they have only 7 significant decimals (last two being zero). Example .buvt-filter
// "CopyToTarget" should be right after "Deleted" (Unchanged on the top perhaps)
// Source/Target switch in miniViewHashMatchDeleteCreator ?!?!?
// tDiffMax-input in miniViewSMMatchCreator
// ST should be SD source/destination
//   SM collisions
//   TRes
//   Source / Target
//   Extra entries
//
// strSide should be Tr(Tree)/Db on T2D and S/T on T2T CopyOn/MoveOn/CopyTo
// List/count soft links
// make buvt-filter work as rsync-filter
// Stream data when parsing from pythonscript
// Create .bak-file when updating target db through T2T
// Window starts with the lowest part outside of screen
// send python kill signal
// divDisclaimer
// Separate settings (table) for T2D and T2T
// getLeafDb method on ArgumentTab
// mT1, mTm, 1Tm rows instead of Mult
//   python output on separate stream
// Checkbox switching default-Include/Exclude

// create new db first, then run rsync
// In SyncDbI one could refer to "Source" as "Tree" instead. Although it would break conformity with SyncT2T.

// Windows softlinks points back to the source

// Documentation:
// Separate Video for Hard links
// Separate Video for the .buvt-filter
// Video for buvt
//   Why does buvt exist:
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

// coderabbit.link/veritasium


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

