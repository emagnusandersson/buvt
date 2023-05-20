
"use strict"

var hardLinkCheck=async function(fiDirSource, leafFilterFirst=leafFilter){
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  //var treeParser=new TreeParser()
  //var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrSourcef, arrSourceF] =await parseTreePython(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  var arrSourcef=arrSourcef.sort(funSorterNeg);
  var arrSourceF=arrSourceF.sort(funSorterNeg);
  var Str=[];
  var [arrUniq, objDupf, arrUniqifiedf]= extractUniques(arrSourcef, "inode")
  var [arrUniq, objDupF, arrUniqifiedF]= extractUniques(arrSourceF, "inode")
  Str.push(`Hard linked files (inodes with multiple names): ${Object.keys(objDupf).length}`);
  Str.push(`(inodes: ${arrUniqifiedf.length}, filenames: ${arrSourcef.length}), `);
  Str.push(`<br>Hard linked folders (inodes with multiple names): ${Object.keys(objDupF).length}`);
  Str.push(`(inodes: ${arrUniqifiedF.length}, dirnames: ${arrSourceF.length}) `);
  myConsole.log(Str.join('\n'))
}
var compareTreeToTree=async function(fiDirSource, fiDirTarget, leafFilterFirst=leafFilter){
  var tStart=new Date()
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; myConsole.error(err); return;}

  //var treeParser=new TreeParser()
  //var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrSourcef, arrSourceF] =await parseTreePython(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var tStop=new Date();   myConsole.log('Source parsed, elapsed time '+(tStop-tStart)+'ms')
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  var arrSourcef=arrSourcef.sort(funSorterNeg)

  //var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, false); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTargetf, arrTargetF] =await parseTreePython(fsDirTarget, false); if(err) {debugger; myConsole.error(err); return;}
  var arrTargetf=arrTargetf.sort(funSorterNeg)

  var comparisonWOID=new ComparisonWOID(arrSourcef, arrTargetf)
  var [err]=comparisonWOID.compare(); if(err) {debugger; myConsole.error(err); return;}
  //if(err) {myConsole.log(err.strTrace); debugger; return}
  //   var strCommandName=sys._getframe().f_code.co_name
  var strCommandName='compareTreeToTree'
  var [err, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional]=comparisonWOID.format(strCommandName, fsDirTarget, 'buvt-meta.txt');
  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional);
  if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('elapsed time '+(new Date()-tStart)+'ms')
}








// #                        //
// def\s+([^\(]+)\(         var $1=function(
// def                      var
// len\(([^)]*)\)           $1.length
// elif                     else if
// and                      &&
// or                       ||
// not                      !
// None                     null
// \[:([^\]]*)\]            .slice(0,$1)
// \[([^\]]*):\]            .slice($1)
// \['([a-zA-Z0-9]+)'\]     .$1
// \["([a-zA-Z0-9]+)"\]     .$1
// .extend(                 .push(...
// .append(                 .push(
// math                     Math
// abs                      Math.abs
// True                     true
// False                    false
// of

// print                    printNL

// null

// %(
// calcFileNameWithCounter
// parseSSV
// parseHashFile
// getHighestMissing
// checkHighestMissingArr
// parseRenameInput
// getRsyncList
// os.path.dirname  os.path.exists  os.path.isdir
// Path(fsPar).mkdir
// subprocess
// os.rename
// myErrorStack
// throw
// catch
// copy.copy
// lambda
// startswith               startsWith
// ino
// myMD5
// .decode("utf-8")
// os.path.basename
// close
// open
// write
// .update(
// writeMetaFile
// os.path.isfile
// .copy
// os.stat
// strip
// os.path.realpath
// os.path
//mtime=Math.floor
//.count


app.boAskBeforeWrite=true

var compareTreeToMetaSTOnly=async function(fiDir='.', fiMeta='buvt-meta.txt', flPrepend='', leafFilterFirst=leafFilter){
    // Parse tree
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

    // Parse fiMeta
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; myConsole.error(err); return}
  }

  var [arrDBNonRelevant, arrDBRelevant]=selectFrArrDB(arrDB, flPrepend)
  var arrDBOrg=arrDB, arrDB=arrDBRelevant

  var comparisonWOID=new ComparisonWOID(arrTreef, arrDB)
  var [err]=comparisonWOID.compare(); if(err) {debugger; myConsole.error(err); return;}
  var strCommandName='compareTreeToMetaSTOnly'
  var [err, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional]=comparisonWOID.format(strCommandName, fsDir, fiMeta)
  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional)
  if(err) {debugger; myConsole.error(err); return;}
}

var syncTreeToTreeBrutal=async function(fiDirSource, fiDirTarget, leafFilterFirst=leafFilter){ // buCopyUnlessNameSTMatch
  var tStart=new Date()
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; myConsole.error(err); return;}


    // Parse trees
  // var treeParser=new TreeParser()
  // var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrSourcef, arrSourceF] =await parseTreePython(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  //var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, false); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTargetf, arrTargetF] =await parseTreePython(fsDirTarget, false); if(err) {debugger; myConsole.error(err); return;}

    // Separate out untouched files
  arrSourcef=arrSourcef.sort(funSorterStrNameNeg);   arrTargetf=arrTargetf.sort(funSorterStrNameNeg);
  var [err, arrSourcefUntouched, arrTargetfUntouched, arrSourcefRem, arrTargetfRem]=extractMatching(arrSourcef, arrTargetf, ['strName', 'size', 'mtime'])
  var lenSourcef=arrSourcefRem.length, lenTargetf=arrTargetfRem.length

    // Separate out existing Folders
  arrSourceF=arrSourceF.sort(funSorterStrNameNeg);   arrTargetF=arrTargetF.sort(funSorterStrNameNeg)
  var [err, arrSourceFUntouched, arrTargetFUntouched, arrSourceFRem, arrTargetFRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])
  var lenSourceF=arrSourceFRem.length, lenTargetF=arrTargetFRem.length

    
  //if(lenSource==0 && lenTarget==0) {print('Nothing to do, aborting'); return}

  //var funSorterNeg=(a,b)=>a.size-b.size || a.mtime-b.mtime;
  //arrSourcefRem=arrSourcefRem.sort(funSorterNeg);   arrTargetfRem=arrTargetfRem.sort(funSorterNeg)

  arrSourceFRem=arrSourceFRem.sort(funSorterStrNameNeg) // So that root-most folders come before its children
  arrTargetFRem=arrTargetFRem.sort(funSorterStrNameNegNeg) // So that leaf-most folders come before its parents

  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`🗎 Deleting ${lenTargetf} file(s) \n🗀 Deleting ${lenTargetF} folder(s)\n🗀 Creating ${lenSourceF} folder(s).\n🗎 Creating (copying) ${lenSourcef} file(s).`)
    if(!boOK) return
  }
  var [err]=await myRmFiles(arrTargetfRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await myRmFolders(arrTargetFRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await myMkFolders(arrSourceFRem, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await myCopyEntries(arrSourcefRem, fsDirSource, fsDirTarget);  if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('elapsed time '+(new Date()-tStart)+'ms')
}





/*********************************************************************
 * "sync" functions
 *********************************************************************/

/*********************************************************************
 * With Id
 *********************************************************************/

var syncTreeToMeta=async function(fiDir='.', fiMeta='buvt-meta.txt', flPrepend='', strCommandName, leafFilterFirst=leafFilter){
  var tStart=new Date();
  var boCompareOnly=strCommandName=='compareTreeToMeta';

    // Parse tree
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

    // Parse fiMeta
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; myConsole.error(err); return}
  }

  var nPrepend=flPrepend.length
  var [arrDBNonRelevant, arrDBRelevant]=selectFrArrDB(arrDB, flPrepend)
  var arrDBOrg=arrDB, arrDB=arrDBRelevant


      // Check for duplicate inode
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  arrTreef=arrTreef.sort(funSorterNeg);   arrDB=arrDB.sort(funSorterNeg)
  var [arrTreefUniqueIno, objTreeDup]=extractUniques(arrTreef,"inode")
  var [arrDBUniqueIno, objDBDup]=extractUniques(arrDB,"inode")
  var lenTreeDup=objTreeDup.length,   lenDBDup=objDBDup.length
  if(lenTreeDup) {
    var strTmp=`Duplicate inode, in tree:${lenTreeDup} (hard links? (Note! hard links are not allowed))`, err=new Error(strTmp);
    debugger; myConsole.error(err);  return
  }
  if(lenDBDup) { var strTmp=`Duplicate inode, in meta:${lenDBDup}`, err=new Error(strTmp); debugger; myConsole.error(err);  return }


  var comparisonWID=new ComparisonWID('inode', arrTreef, arrDB)
  var [err]=comparisonWID.compare(); if(err) {debugger; myConsole.error(err); return;}
  //if(err) {debugger; myConsole.error(err); return}
  //var strCommandName=boCompareOnly?'compareTreeToMeta':'syncTreeToMeta'
  var [err, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd]=comparisonWID.format(strCommandName, fsDir, fiMeta)
  if(err) {debugger; myConsole.error(err); return;}
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd)
  if(err) {debugger; myConsole.error(err); return;}

  var [arrTreeUnTouched, arrDBUnTouched, arrTreeChanged, arrDBChanged, arrTreeMetaMatch, arrDBMetaMatch, arrTreeNST, arrDBNST, arrTreeMatchingId, arrDBMatchingId, arrTreeMatchingStrName, arrDBMatchingStrName, arrSourceRem, arrTargetRem]=comparisonWID.getCategoryArrays();

  var arrCreate=arrSourceRem, arrDelete=arrTargetRem
  //boAllOK=arrCreate.length==0 && arrDelete.length==0
  //if(boAllOK) {print('No changes, aborting'); return}
  if(boCompareOnly) {
    var tStop=new Date();   myConsole.log('elapsed time '+(tStop-tStart)+'ms')
    return
  }


    // Change arrDBUnTouched
  for(var i in arrTreeUnTouched){
    var row=arrTreeUnTouched[i],   rowDB=arrDBUnTouched[i]
    extend(rowDB, {"mtime_ns":row.mtime_ns}) // Incase lower resolution was used on the old database
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

    // Change arrDBChanged
  for(var i in arrTreeChanged){
  //for(var [i, row] of arrTreeChanged){
    var row=arrTreeChanged[i],   rowDB=arrDBChanged[i]
    myConsole.log(`Calculating hash for changed file: ${row.strName}`)
    //var [err, strHash]=await myMD5(fsDir+'/'+row.strName); if(err) {debugger; myConsole.error(err); return;}
    var [err, strHash]=await myMD5W(row, fsDir); if(err) {debugger; myConsole.error(err); return;} 
    extend(rowDB, {"strHash":strHash, "size":row.size, "mtime":row.mtime, "mtime_ns":row.mtime_ns})
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

    // Rename arrDBMetaMatch
  for(var i in arrTreeMetaMatch){
    var row=arrTreeMetaMatch[i],   rowDB=arrDBMetaMatch[i]
    rowDB.strName=row.strName
    extend(rowDB, {"mtime_ns":row.mtime_ns}) // Incase lower resolution was used on the old database
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

    // Rename Copy renamed to origin
  for(var i in arrTreeNST){
    var row=arrTreeNST[i],   rowDB=arrDBNST[i]
    rowDB.inode=row.inode
    extend(rowDB, {"mtime_ns":row.mtime_ns}) // Incase lower resolution was used on the old database
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

    // Matching inode
  for(var i in arrTreeMatchingId){
    var row=arrTreeMatchingId[i],   rowDB=arrDBMatchingId[i]
    myConsole.log(`Calculating hash for changed+renamed file: ${row.strName}`)
    //var [err, strHash]=await myMD5(fsDir+'/'+row.strName); if(err) {debugger; myConsole.error(err); return;}
    var [err, strHash]=await myMD5W(row, fsDir); if(err) {debugger; myConsole.error(err); return;} 
    extend(rowDB, {"strHash":strHash, "size":row.size, "mtime":row.mtime, "mtime_ns":row.mtime_ns, "strName":row.strName})
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

    // Matching strName
  for(var i in arrTreeMatchingStrName){
    var row=arrTreeMatchingStrName[i],   rowDB=arrDBMatchingStrName[i]
    myConsole.log(`Calculating hash for deleted+recreated file: ${row.strName}`)
    //var [err, strHash]=await myMD5(fsDir+'/'+row.strName); if(err) {debugger; myConsole.error(err); return;}
    var [err, strHash]=await myMD5W(row, fsDir); if(err) {debugger; myConsole.error(err); return;} 
    extend(rowDB, {"inode":row.inode, "strHash":strHash, "size":row.size, "mtime":row.mtime, "mtime_ns":row.mtime_ns})
    //extend(rowDB, {strType:row.strType})     // Incase strType was not set in DB
  }

      // Remaining
  for(var i in arrCreate){
    var row=arrCreate[i]
    myConsole.log(`Calculating hash for created file: ${row.strName}`)
    //var [err, strHash]=await myMD5(fsDir+'/'+row.strName); if(err) {debugger; myConsole.error(err); return;}
    var [err, strHash]=await myMD5W(row, fsDir); if(err) {debugger; myConsole.error(err); return;} 
    extend(row, {"strHash":strHash}) 
  }


  var arrDBNew=arrDBUnTouched.concat(arrDBChanged, arrDBMetaMatch, arrDBNST, arrDBMatchingId, arrDBMatchingStrName, arrCreate)
    // Add flPrepend to strName if appropriate
  if(nPrepend>0){
    for(var row of arrDBNew) row.strName=flPrepend+row.strName
  }

    // Add Non-relevant entries
  arrDBNew.push(...arrDBNonRelevant)
  arrDBNew=arrDBNew.sort(funSorterStrNameNeg)

  //for(var row of arrDBNew)  {if(!("uuid" in row)) row.uuid=myUUID()}
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var lOld=arrDB.length, lNew=arrDBNew.length,lUntouched=arrDBUnTouched.length,lChanged=arrDBChanged.length,lMetaMatch=arrDBMetaMatch.length,lNST=arrDBNST.length,lMatchingId=arrDBMatchingId.length,lMatchingStrName=arrDBMatchingStrName.length,lCreate=arrCreate.length,lDelete=arrDelete.length;
    var strOut=`Old meta-file had ${lOld} entries.\nThe new one will have ${lNew} entries:\nuntouched:${lUntouched}\nchanged:${lChanged}\nmetaMatch:${lMetaMatch}\nNST:${lNST}\nmatchingId:${lMatchingId}\nmatchingStrName:${lMatchingStrName}\ncreated:${lCreate}\ndeleted:${lDelete}`;
    var boOK=confirm(strOut)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  var tStop=new Date();   myConsole.log('elapsed time '+(tStop-tStart)+'ms')
}




/*********************************************************************
 * compare functions
 *********************************************************************/



/*********************************************************************
 * renameFinish functions
 *********************************************************************/

var renameFinishToTree=async function(fiDir, leafFile=leafRenameSuggestionsOTO, boDir=false, strStartToken=null){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", required=true)
  // parser.add_argument('-f', "--file")

  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}

  // var leafFile;
  // if(args.file) leafFile=args.file
  // else if(boDir) leafFile=leafRenameSuggestionsAncestorOnly
  // else leafFile=leafRenameSuggestionsOTO

  

  var [err, arrRename]=await parseRenameInput(leafFile, strStartToken); if(err) {debugger; myConsole.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

  //var boOK=confirm(`Renaming ${arrRename.length} files.`)
  //if(!boOK) return
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Renaming ${arrRename.length} entry/entries.`)
    if(!boOK) return
  }
  var [err]=await renameFiles(fsDir, arrRename)
  if(err) {debugger; myConsole.error(err); return}
}

var renameFinishToMeta=async function(fiMeta){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // args = parser.parse_args(argv)

    // Parse leafRenameSuggestionsOTO
  var [err, arrRename]=await parseRenameInput(leafRenameSuggestionsOTO); if(err) {debugger; myConsole.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

    // Parse fiMeta
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; myConsole.error(err); return}
  }
  arrDB=arrDB.sort(funSorterStrNameNeg)

  var [err, arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatching(arrRename, arrDB, ['strOld'], ['strName']);
  if(err) {debugger; myConsole.error(err); return;}

    // Rename arrDBMatch
  for(var i in arrRenameMatch){
    var row=arrRenameMatch[i]
    var rowDB=arrDBMatch[i]
    rowDB.strName=row.strNew
  }

  var arrDBNew=arrDBRem.concat(arrDBMatch)
  arrDBNew=arrDBNew.sort(funSorterStrNameNeg)
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  debugger
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}

var renameFinishToMetaByFolder=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // args = parser.parse_args(argv)

    // Parse leafRenameSuggestionsAncestorOnly
  var [err, arrRename]=await parseRenameInput(leafRenameSuggestionsAncestorOnly, "RelevantAncestor")
  if(err) {debugger; myConsole.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

    // Parse fiMeta
  //var fiMeta=inpMeta.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiMeta}=result
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; myConsole.error(err); return}
  }
  arrDB=arrDB.sort(funSorterStrNameNeg)


  var funVal=function(val) {return val.strOld}
  var funB=function(rowB, l) {return rowB.strName.slice(0,l)}
  var funExtra=function(val) {return val.strOld.length}
  var [arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatchingOneToManyUnsortedFW(arrRename, arrDB, funVal, funB, funExtra)

  if(arrRenameMatch.length!=arrDBMatch.length) {var err=new Error("Error: arrRenameMatch.length!=arrDBMatch.length"); debugger; myConsole.error(err); return;}

    // Rename arrDBMatch
  for(var i in arrRenameMatch){
    var row=arrRenameMatch[i]
    var rowDB=arrDBMatch[i]
    var strOld=row.strOld, l=strOld.length;
    rowDB.strName=row.strNew+rowDB.strName.slice(l)
  }

  var arrDBNew=arrDBRem.concat(arrDBMatch)
  arrDBNew=arrDBNew.sort(funSorterStrNameNeg)
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}



/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(leafFilterFirst=leafFilter){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-s', "--fiDirSource", default='.')
  //var fiDirSource=inpSource.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiDirSource}=result
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(fsDirSource); if(err) {debugger; myConsole.error(err); return}

  // var treeParser=new TreeParser()
  // var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrSourcef, arrSourceF] =await parseTreePython(fsDirSource, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  arrSourcef=arrSourcef.sort(funSorterStrNameNeg)
  arrSourceF=arrSourceF.sort(funSorterStrNameNeg)
  arrRsf=arrRsf.sort(funSorterStrNameNeg)
  arrRsF=arrRsF.sort(funSorterStrNameNeg)
  var nRsf=arrRsf.length, nRsF=arrRsF.length
  var nf=arrSourcef.length, nF=arrSourceF.length
  var leafResult='resultFrTestFilter.txt'
  var StrOut=[]
  for(var row of arrSourcef) StrOut.push(row.strName)
  for(var row of arrSourceF) StrOut.push(row.strName)
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(leafResult, strTmp).toNBP(); if(err) {debugger; myConsole.error(err); return;}

  var leafResultRs='resultFrTestFilterRs.txt'
  var StrOut=[]
  for(var row of arrRsf) StrOut.push(row.strName)
  for(var row of arrRsF) StrOut.push(row.strName)
  StrOut.push('  arrRsOther:\n')
  for(var row of arrRsOther) StrOut.push(row)
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(leafResultRs, strTmp).toNBP(); if(err) {debugger; myConsole.error(err); return;}


  myConsole.log(`${leafResult} and ${leafResultRs} written`)
}



var convertHashcodeFileToMeta=async function(leafFilterFirst=leafFilter){ // Add inode and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-d", "--fiDir", default='.')
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse tree
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}
      // boUseFilter should perhaps be false (although it might be slow)
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}  
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

    // fiMeta
  //var fiMeta=inpMeta.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiMeta}=result
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  arrTreef=arrTreef.sort(funSorterStrNameNeg);   arrDB=arrDB.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])

  //if(arrTreeRem.length || arrDBRem.length) return "Error: "+"arrTreeRem.length OR arrDBRem.length"
  if(arrTreeRem.length) {var err=new Error("Error: "+"arrTreeRem.length"); debugger; myConsole.error(err); return;}  

  for(var i in arrDBMatch){
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID() // Add uuid if it doesn't exist
    var rowDB=arrDBMatch[i]
    var row=arrTreeMatch[i]
    rowDB.inode=row.inode // Copy inode
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('done')
}



var convertMetaToHashcodeFile=async function(){ // Add inode and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMeta
  //var fiMeta=inpMeta.value.trim()
  var [err, result]=await argumentTab.getSelected(); if(err) {debugger; myConsole.error(err); return;}
  var {fiMeta}=result
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta); if(err) {debugger; myConsole.error(err); return}

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  var arrDBNew=arrDB
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to hash-file.`)
    if(!boOK) return
  }
  var [err]=await writeHashFile(arrDBNew, fsHash)
  myConsole.log('done')
}



var moveMeta=async function(leafFilterFirst=leafFilter){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiMetaS", default='buvt-meta.txt')
  // parser.add_argument("-o", "--fiMetaOther", required=true)
  // parser.add_argument("-d", "--fiDirT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var [err, fsMetaS]=await myRealPath(args.fiMetaS); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBS]=await parseMeta(fsMetaS); if(err) {debugger; myConsole.error(err); return}

    // Parse fiMetaOther
  var [err, fsMetaOther]=await myRealPath(args.fiMetaOther); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBOther]=await parseMeta(fsMetaOther)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDBOther=[]}
    else{debugger; myConsole.error(err); return}
  }

    // Parse tree
  var [err, fsDir]=await myRealPath(args.fiDirT); if(err) {debugger; myConsole.error(err); return;}
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

  var flPrepend=args.flPrepend,    nPrepend=flPrepend.length
  var [arrDBOtherNonRelevant, arrDBOtherRelevant] =selectFrArrDB(arrDBOther, flPrepend)
  var arrDBOtherOrg=arrDBOther,   arrDBOther=arrDBOtherRelevant

  // var [arrTreefNonRelevant, arrTreefRelevant] =selectFrArrDB(arrTreef, flPrepend)
  // arrTreefOrg=arrTreef;   arrTreef=arrTreefRelevant


  arrTreef=arrTreef.sort(funSorterStrNameNeg);   arrDBS=arrDBS.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBSMatch, arrTreeRem, arrDBSRem]=extractMatching(arrTreef, arrDBS, ['strName'], ['strName']);
  if(err) {debugger; myConsole.error(err); return;}

  //if(arrTreeRem.length || arrDBRem.length) return "Error "+"arrTreeRem.length OR arrDBRem.length"
  //if(arrTreeRem.length) return "Error: "+"arrTreeRem.length"

  for(var i in arrDBSMatch){
    var rowDBS=arrDBSMatch[i]
    var rowTree=arrTreeMatch[i]
    rowDBS.inode=rowTree.inode
  }

  var arrDBOtherNew=arrDBSMatch
  if(nPrepend>0){
    for(var row of arrDBOtherNew) row.strName=flPrepend+row.strName
  }

  arrDBOtherNew=arrDBOtherNonRelevant+arrDBOtherNew
  arrDBOtherNew=arrDBOtherNew.sort(funSorterStrNameNeg)
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBOtherNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBOtherNew, fsMetaOther); if(err) {debugger; myConsole.error(err); return;}
}



var sortHashcodeFile=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiHash
  var [err, fsHash]=await myRealPath(args.fiHash); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; myConsole.error(err); return}

  arrDB=arrDB.sort(funSorterStrNameNeg)

  var [err]=await writeHashFile(arrDB, fsHash); if(err) {debugger; myConsole.error(err); return;}
  myConsole.log('done')
}


var changeIno=async function(leafFilterFirst=leafFilter){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}

    // Parse tree
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

    // Parse fiMeta
  var [err, fsMeta]=await myRealPath(args.fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta); if(err) {debugger; myConsole.error(err); return}

  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  arrTreef=arrTreef.sort(funSorterStrNameNeg);  arrDB=arrDB.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])
  if(err) {debugger; myConsole.error(err); return;}


  for(var i in arrDBMatch){
    var rowDB=arrDBMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID()
    rowDB.inode=rowTree.inode
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}

var utilityMatchTreeAndMeta=async function(leafFilterFirst=leafFilter){ // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var [err, fsDir]=await myRealPath(args.fiDir); if(err) {debugger; myConsole.error(err); return;}

    // Parse tree
  // var treeParser=new TreeParser()
  // var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrTreef, arrTreeF] =await parseTreePython(fsDir, true, leafFilterFirst); if(err) {debugger; myConsole.error(err); return;}

    // Parse fiMeta
  var [err, fsMeta]=await myRealPath(args.fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta);if(err) {debugger; myConsole.error(err); return}

  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  arrTreef=arrTreef.sort(funSorterStrNameNeg);  arrDB=arrDB.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])


  for(var i in arrDBMatch){
    var rowDB=arrDBMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID()
    rowDB.inode=rowTree.inode
  }

  var arrDBNew=arrDB
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}


var utilityMatchMetaAndMeta=async function(){  // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiMetaS", default='buvt-meta.txt')
  // parser.add_argument('-t', "--fiMetaT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var [err, fsMetaS]=await myRealPath(args.fiMetaS); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBS]=await parseMeta(fsMetaS); if(err) {debugger; myConsole.error(err); return}

    // Parse fiMetaT
  var [err, fsMetaT]=await myRealPath(args.fiMetaT); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDBT]=await parseMeta(fsMetaT); if(err) {debugger; myConsole.error(err); return}

  var [arrDBTNonRelevant, arrDBTRelevant] =selectFrArrDB(arrDBT, args.flPrepend)
  var arrDBTOrg=arrDBT,   arrDBT=arrDBTRelevant


  arrDBS=arrDBS.sort(funSorterStrNameNeg);   arrDBT=arrDBT.sort(funSorterStrNameNeg)
  var [err, arrDBSMatch, arrDBTMatch, arrDBSRem, arrDBTRem]=extractMatching(arrDBS, arrDBT, ['strName'])

    // Move uuid to arrDBMatch
  // for(var i in arrDBSMatch){
  //   var row=arrDBSMatch[i]
  //   rowT=arrDBTMatch[i]
  //   rowT.uuid=row.uuid
  // }

  for(var row of arrDBT){
    row.strName=args.flPrepend+row.strName
  }

  var arrDBNew=arrDBTNonRelevant.concat(arrDBTMatch, arrDBTRem)
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDBNew.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDBNew, fsMetaT); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}

var utilityAddToMetaStrName=async function(){  // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var [err, fsMeta]=await myRealPath(args.fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err, arrDB]=await parseMeta(fsMeta); if(err) {debugger; myConsole.error(err); return}
  arrDB=arrDB.sort(funSorterStrNameNeg)

  var flPrepend=args.flPrepend, nPrepend=flPrepend.length


  //flPrependTmp=flPrepend+"/" if(nPrepend) else ""
  for(var row of arrDB){
    row.strName=flPrepend+row.strName
  }
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    var boOK=confirm(`Writing ${arrDB.length} entries to meta-file.`)
    if(!boOK) return
  }
  var [err]=await writeMetaFile(arrDB, fsMeta); if(err) {debugger; myConsole.error(err); return;}

  myConsole.log('done')
}


var check=async function(fiDir='.', fiMeta='buvt-meta.txt', intStart=0){ // buCopyUnlessNameSTMatch
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  checkHash(fsMeta, fsDir, intStart)
}

var checkSummarizeMissing=async function(fiDir='.', fiMeta='buvt-meta.txt'){
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; myConsole.error(err); return;}
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; myConsole.error(err); return;}
  var [err]=await checkSummarizeMissingInterior(fsMeta, fsDir); if(err) {debugger; myConsole.error(err); return;}
}

var deleteResultFiles=async function(){ 
  var arr=[leafResultCompare, leafRenameSuggestionsAncestorOnly, leafDuplicateInitial, leafDuplicateFinal, leafRenameSuggestionsAdditional, leafRenameSuggestionsOTO]
  for(var leafTmp of arr){
    // try {os.remove(leafTmp); print("Deleted: "+leafTmp)}
    // except FileNotFoundError as e{ print("Couldn't delete: "+leafTmp) }  
    var [err, result]=await Neutralino.filesystem.removeFile(leafTmp).toNBP();
    if(err) {
      if(err.code=='NE_FS_FILRMER') myConsole.log("Couldn't delete: "+leafTmp)
      else {debugger; myConsole.error(err); return}
    }
    myConsole.log("Deleted: "+leafTmp)
  }
}

