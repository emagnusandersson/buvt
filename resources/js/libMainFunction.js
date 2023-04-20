

var hardLinkCheck=async function(ev){
  var [err, fsDirSource]=await myRealPath(inpSource.value.trim()); if(err) {debugger; console.error(err); return;}
  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true); if(err) {debugger; console.error(err); return;}
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  var arrSourcef=arrSourcef.sort(funSorterNeg);
  var [arrUniq, objDup]= extractUniques(arrSourcef, "inode")
  divOut.myText('Number of inodes with multiple references: '+Object.keys(objDup).length)
}
var compareTreeToTree=async function(){

  var [err, fsDirSource]=await myRealPath(inpSource.value.trim()); if(err) {debugger; console.error(err); return;}
  var [err, fsDirTarget]=await myRealPath(inpTarget.value.trim()); if(err) {debugger; console.error(err); return;}

  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true); if(err) {debugger; console.error(err); return;}
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  var arrSourcef=arrSourcef.sort(funSorterNeg)

  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, false); if(err) {debugger; console.error(err); return;}
  var arrTargetf=arrTargetf.sort(funSorterNeg)

  var comparisonWOID=new ComparisonWOID(arrSourcef, arrTargetf)
  var [err]=comparisonWOID.compare(); if(err) {debugger; console.error(err); return;}
  //if(err) {console.log(err.strTrace); debugger; return}
  //   var strCommandName=sys._getframe().f_code.co_name
  var strCommandName='compareTreeToTree'
  var [err, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional]=comparisonWOID.format(strCommandName, fsDirTarget, 'buvt-meta.txt');
  if(err) {debugger; console.error(err); return;}
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional);
  if(err) {debugger; console.error(err); return;}
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


// print

// os.path.realpath
// os.path

//mtime=Math.floor

//.count


app.boAskBeforeWrite=true


var compareTreeToST=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')

  // args = parser.parse_args(argv)

    // Parse tree
  //fsDir=os.path.realpath(args.fiDir)
  var fiDir=inpSource.value.trim()
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; console.error(err); return;}
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime) // Floor mtime

    // Parse DB
  // fiMeta=args.fiMeta
  // fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err, arrDB]=await parseSSVCustom(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; console.error(err); return}
  }

  //var flPrepend=args.flPrepend;
  var flPrepend=inpFlPrepend.value.trim()
  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  var comparisonWOID=new ComparisonWOID(arrTreef, arrDB)
  var [err]=comparisonWOID.compare(); if(err) {debugger; console.error(err); return;}
  //strCommandName=sys._getframe().f_code.co_name
  var strCommandName='compareTreeToST'
  var [err, StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional]=comparisonWOID.format(strCommandName, fsDir, fiMeta)
  if(err) {debugger; console.error(err); return;}
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd, StrDuplicateInitial, StrDuplicateFinal, StrRenameAdditional)
  if(err) {debugger; console.error(err); return;}
}


var syncTreeToTreeBrutal=async function(){ // buCopyUnlessNameSTMatch
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-s', "--fiDirSource", default='.')
  // parser.add_argument('-t', "--fiDirTarget", required=true)
  // args = parser.parse_args(argv)
  // fsDirSource=os.path.realpath(args.fiDirSource)
  // fsDirTarget=os.path.realpath(args.fiDirTarget)
  var fiDirSource=inpSource.value.trim()
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; console.error(err); return;}
  var fiDirTarget=inpTarget.value.trim()
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; console.error(err); return;}


    // Parse trees
  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true); if(err) {debugger; console.error(err); return;}
  var [err, arrTargetf, arrTargetF] =await treeParser.parseTree(fsDirTarget, false); if(err) {debugger; console.error(err); return;}
  // for(var row of arrSourcef) row.mtime=Math.floor(row.mtime) // Floor mtime
  // for(var row of arrTargetf) row.mtime=Math.floor(row.mtime) // Floor mtime

    // Remove untouched
  arrSourcef=arrSourcef.sort(funSorterStrNameNeg);   arrTargetf=arrTargetf.sort(funSorterStrNameNeg);
  var [err, arrSourceUntouched, arrTargetUntouched, arrSourceRem, arrTargetRem]=extractMatching(arrSourcef, arrTargetf, ['strName', 'size', 'mtime'])
  var lenSource=arrSourceRem.length, lenTarget=arrTargetRem.length
  //if(lenSource==0 && lenTarget==0) {print('Nothing to do, aborting'); return}

  //var funSorterNeg=(a,b)=>a.size-b.size || a.mtime-b.mtime;
  //arrSourceRem=arrSourceRem.sort(funSorterNeg);   arrTargetRem=arrTargetRem.sort(funSorterNeg)

  //alert(`Deleting ${lenTarget} then creating ${lenSource} file(s). Press enter to continue.`)
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Deleting ${lenTarget} then creating (copying) ${lenSource} file(s). Press enter to continue.`)
  }
  var [err]=await myRmFiles(arrTargetRem, fsDirTarget);  if(err) {debugger; console.error(err); return;}
  var [err]=await myCopyEntries(arrSourceRem, fsDirSource, fsDirTarget);  if(err) {debugger; console.error(err); return;}

    // Delete remaining Folders
  arrSourceF=arrSourceF.sort(funSorterStrNameNeg);   arrTargetF=arrTargetF.sort(funSorterStrNameNeg)
  var [err, arrSourceUntouched, arrTargetUntouched, arrSourceRem, arrTargetRem]=extractMatching(arrSourceF, arrTargetF, ['strName'])
  var lenSource=arrSourceRem.length, lenTarget=arrTargetRem.length

  if(lenSource==0 && lenTarget==0) {debugger; var err=new Error("lenSource==0 && lenTarget==0"); console.error(err); return;}

  arrSourceRem=arrSourceRem.sort(funSorterStrNameNegNeg)
  arrTargetRem=arrTargetRem.sort(funSorterStrNameNegNeg)
  if(boAskBeforeWrite){
    debugger
    alert(`Deleting ${lenTarget} then creating (making sure they exist) ${lenSource} Folder(s). Press enter to continue.`)
  }
  var [err]=await myRmFolders(arrTargetRem, fsDirTarget);  if(err) {debugger; console.error(err); return;}
}





/*********************************************************************
 * "sync" functions
 *********************************************************************/

/*********************************************************************
 * With Id
 *********************************************************************/

var syncTreeToMeta=async function(strCommandName){
  var boSync=strCommandName=='syncTreeToMeta'
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument('-m', "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse tree
  //fsDir=os.path.realpath(args.fiDir)
  var fiDir=inpSource.value.trim()
  var [err, fsDir]=await myRealPath(fiDir); if(err) {debugger; console.error(err); return;}
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime)  // Floor mtime

    // Parse fiMeta
  //fiMeta=args.fiMeta
  //fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err, arrDB]=await parseSSVCustom(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; console.error(err); return}
  }

  //flPrepend=args.flPrepend;
  var flPrepend=inpFlPrepend.value.trim()
  var nPrepend=flPrepend.length
  var [arrDBNonRelevant, arrDBRelevant]=selectFrArrDB(arrDB, flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant


      // Check for duplicate inode
  var funSorterNeg=(a,b)=>a.inode-b.inode;
  arrTreef=arrTreef.sort(funSorterNeg);   arrDB=arrDB.sort(funSorterNeg)
  var [arrTreefUniqueIno, objTreeDup]=extractUniques(arrTreef,"inode")
  var [arrDBUniqueIno, objDBDup]=extractUniques(arrDB,"inode")
  var lenTreeDup=objTreeDup.length,   lenDBDup=objDBDup.length
  if(lenTreeDup) {
    var strTmp=`Duplicate inode, in tree:${lenTreeDup} (hard links? (Note! hard links are !allowed))`, err=new Error(strTmp);
    debugger; console.error(err);  return
  }
  if(lenDBDup) { var strTmp=`Duplicate inode, in meta:${lenDBDup}`, err=new Error(strTmp); debugger; console.error(err);  return }


  var comparisonWID=ComparisonWID('inode', arrTreef, arrDB)
  var [err]=comparisonWID.compare(); if(err) {debugger; console.error(err); return;}
  //if(err) {debugger; console.error(err); return}
  var [StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd]=comparisonWID.format(strCommandName, fsDir, fiMeta)
  var [err]=await writeResultInfo(StrScreen, StrResultFile, StrRenameOTO, StrRenameAncestorOnly, StrRenameAncestorOnlyCmd)
  if(err) {debugger; console.error(err); return;}

  var [err, arrTreeUnTouched, arrDBUnTouched, arrTreeChanged, arrDBChanged, arrTreeMetaMatch, arrDBMetaMatch, arrTreeNST, arrDBNST, arrTreeMatchingId, arrDBMatchingId, arrTreeMatchingStrName, arrDBMatchingStrName, arrSourceRem, arrTargetRem]=comparisonWID.getCategoryArrays();
  if(err) {debugger; console.error(err); return;}

  var arrCreate=arrSourceRem, arrDelete=arrTargetRem
  //boAllOK=arrCreate.length==0 && arrDelete.length==0
  //if(boAllOK) {print('No changes, aborting'); return}
  if(!boSync) return


    // Change arrDBChanged
  for(var i in arrTreeChanged){
  //for(var [i, row] of arrTreeChanged){
    var row=arrTreeChanged[i]
    var rowDB=arrDBChanged[i]
    console.log(`Calculating hash for changed file: ${row.strName}`)
    var [err, strHash]=myMD5(fsDir+'/'+row.strName); if(err) {debugger; console.error(err); return;}
    extend(rowDB, {"strHash":strHash, "size":row.size, "mtime":row.mtime})
  }

    // Rename arrDBMetaMatch
  for(var i in arrTreeMetaMatch){
    var row=arrTreeMetaMatch[i]
    var rowDB=arrDBMetaMatch[i]
    rowDB.strName=row.strName
  }

    // Rename Copy renamed to origin
  for(var i in arrTreeNST){
    var row=arrTreeNST[i]
    var rowDB=arrDBNST[i]
    rowDB.inode=row.inode
  }

    // Matching inode
  for(var i in arrTreeMatchingId){
    var row=arrTreeMatchingId[i]
    var rowDB=arrDBMatchingId[i]
    console.log(`Calculating hash for changed+renamed file: ${row.strName}`)
    var [err, strHash]=myMD5(fsDir+'/'+row.strName); if(err) {debugger; console.error(err); return;}
    extend(rowDB, {"strHash":strHash, "size":row.size, "mtime":row.mtime, "strName":row.strName})
  }

    // Matching strName
  for(var i in arrTreeMatchingStrName){
    var row=arrTreeMatchingStrName[i]
    var rowDB=arrDBMatchingStrName[i]
    console.log(`Calculating hash for deleted+recreated file: ${row.strName}`)
    var [err, strHash]=myMD5(fsDir+'/'+row.strName); if(err) {debugger; console.error(err); return;}
    extend(rowDB, {"inode":row.inode, "strHash":strHash, "size":row.size, "mtime":row.mtime})
  }

      // Remaining
  for(var i in arrCreate){
    var row=arrCreate[i]
    console.log(`Calculating hash for created file: ${row.strName}`)
    var [err, strHash]=myMD5(fsDir+'/'+row.strName); if(err) {debugger; console.error(err); return;}
    extend(row, {"strHash":strHash}) //, "uuid":myUUID()
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
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}
}




/*********************************************************************
 * compare functions
 *********************************************************************/



/*********************************************************************
 * renameFinish functions
 *********************************************************************/

var renameFinishToTree=async function(boDir=false, strStartToken=null){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", required=true)
  // parser.add_argument('-f', "--file")

  // args = parser.parse_args(argv)
  //fsRenameFold=os.path.realpath(args.fiDir)
  var fiDirTarget=inpTarget.value.trim()
  var [err, fsDirTarget]=await myRealPath(fiDirTarget); if(err) {debugger; console.error(err); return;}

  // var leafFile;
  // if(args.file) leafFile=args.file
  // else if(boDir) leafFile=leafRenameSuggestionsAncestorOnly
  // else leafFile=leafRenameSuggestionsOTO

  var leafFile=this.leafRenameFile||leafRenameSuggestionsOTO
  //fsFile=os.path.realpath(leafFile)
  

  var [err, arrRename]=await parseRenameInput(leafFile, strStartToken); if(err) {debugger; console.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

  //alert(`Renaming ${arrRename.length} files. Press enter to continue.`)
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Renaming ${arrRename.length} entry/entries. Press enter to continue.`)
  }
  var [err]=renameFiles(fsDirTarget, arrRename)
  if(err) {debugger; console.error(err); return}
}

var renameFinishToMeta=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // args = parser.parse_args(argv)

    // Parse leafRenameSuggestionsOTO
  var [err, arrRename]=await parseRenameInput(leafRenameSuggestionsOTO); if(err) {debugger; console.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

    // Parse fiMeta
  //fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err, arrDB]=await parseSSVCustom(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; console.error(err); return}
  }
  arrDB=arrDB.sort(funSorterStrNameNeg)

  var [err, arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatching(arrRename, arrDB, ['strOld'], ['strName']);
  if(err) {debugger; console.error(err); return;}

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
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}

  console.log('done')
}

var renameFinishToMetaByFolder=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // args = parser.parse_args(argv)

    // Parse leafRenameSuggestionsAncestorOnly
  var [err, arrRename]=await parseRenameInput(leafRenameSuggestionsAncestorOnly, "RelevantAncestor")
  if(err) {debugger; console.error(err); return}
  var funSorterNeg=(a,b)=>{if(a.strOld>b.strOld) return 1; else if(a.strOld<b.strOld) return -1; return 0;};
  arrRename=arrRename.sort(funSorterNeg)

    // Parse fiMeta
  //fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err, arrDB]=await parseSSVCustom(fsMeta)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDB=[]}
    else{debugger; console.error(err); return}
  }
  arrDB=arrDB.sort(funSorterStrNameNeg)


  var funVal=function(val) {return val.strOld}
  var funB=function(rowB, l) {return rowB.strName.slice(0,l)}
  var funExtra=function(val) {return val.strOld.length}
  var [arrRenameMatch, arrDBMatch, arrRenameRem, arrDBRem]=extractMatchingOneToManyUnsortedFW(arrRename, arrDB, funVal, funB, funExtra)

  if(arrRenameMatch.length!=arrDBMatch.length) {var err=new Error("Error: arrRenameMatch.length!=arrDBMatch.length"); debugger; console.error(err); return;}

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
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}

  console.log('done')
}



/*********************************************************************
 * testFilter
 *********************************************************************/
var testFilter=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-s', "--fiDirSource", default='.')
  // args = parser.parse_args(argv)
  //fsDirSource=os.path.realpath(args.fiDirSource)
  var fiDirSource=inpSource.value.trim()
  var [err, fsDirSource]=await myRealPath(fiDirSource); if(err) {debugger; console.error(err); return;}
  var [err, arrRsf, arrRsF, arrRsOther]=await getRsyncList(fsDirSource); if(err) {debugger; console.error(err); return}

  var treeParser=new TreeParser()
  var [err, arrSourcef, arrSourceF] =await treeParser.parseTree(fsDirSource, true); if(err) {debugger; console.error(err); return;}

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
  var [err]=await Neutralino.filesystem.writeFile(leafResult, strTmp).toNBP(); if(err) {debugger; console.error(err); return;}

  var leafResultRs='resultFrTestFilterRs.txt'
  var StrOut=[]
  for(var row of arrRsf) StrOut.push(row.strName)
  for(var row of arrRsF) StrOut.push(row.strName)
  StrOut.push('  arrRsOther:\n')
  for(var row of arrRsOther) StrOut.push(row)
  var strOut=StrOut.join('\n')
  var [err]=await Neutralino.filesystem.writeFile(leafResultRs, strTmp).toNBP(); if(err) {debugger; console.error(err); return;}


  console.log(`${leafResult} and ${leafResultRs} written`)
}



var convertHashcodeFileToMeta=async function(){ // Add inode and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-d", "--fiDir", default='.')
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse tree
  var fsDir=os.path.realpath(args.fiDir)
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}  // boUseFilter should perhaps be false (although it might be slow)
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime) // Floor mtime

    // Parse fiHash
  var fsHash=os.path.realpath(args.fiHash)
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; console.error(err); return}

    // fiMeta
  //fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  arrTreef=arrTreef.sort(funSorterStrNameNeg);   arrDB=arrDB.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])

  //if(arrTreeRem.length || arrDBRem.length) return "Error: "+"arrTreeRem.length OR arrDBRem.length"
  if(arrTreeRem.length) {var err=new Error("Error: "+"arrTreeRem.length"); debugger; console.error(err); return;}  

  for(var i in arrDBMatch){
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID() // Add uuid if it doesn't exist
    var rowDB=arrDBMatch[i]
    var row=arrTreeMatch[i]
    rowDB.inode=row.inode // Copy inode
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}
  console.log('done')
}



var convertMetaToHashcodeFile=async function(){ // Add inode and create uuid
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMeta
  //fsMeta=os.path.realpath(args.fiMeta)
  var fiMeta=inpMeta.value.trim()
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err, arrDB]=await parseSSVCustom(fsMeta); if(err) {debugger; console.error(err); return}

    // Parse fiHash
  //var fsHash=os.path.realpath(args.fiHash)
  var [err, fsHash]=await myRealPath(fiHash); if(err) {debugger; console.error(err); return;}

  // var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  // arrDBOrg=arrDB;   arrDB=arrDBRelevant

  var arrDBNew=arrDB
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Writing ${arrDBNew.length} entries to hash-file. Press enter to continue.`)
  }
  var [err]=await writeHashFile(arrDBNew, fsHash)
  console.log('done')
}



var moveMeta=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiMetaS", default='buvt-meta.txt')
  // parser.add_argument("-o", "--fiMetaOther", required=true)
  // parser.add_argument("-d", "--fiDirT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var fsMetaS=os.path.realpath(args.fiMetaS)
  var [err, arrDBS]=await parseSSVCustom(fsMetaS); if(err) {debugger; console.error(err); return}

    // Parse fiMetaOther
  var fsMetaOther=os.path.realpath(args.fiMetaOther)
  var [err, arrDBOther]=await parseSSVCustom(fsMetaOther)
  if(err){
    if(err.code=="NE_FS_FILRDER"){err=null; arrDBOther=[]}
    else{debugger; console.error(err); return}
  }

    // Parse tree
  var fsDir=os.path.realpath(args.fiDirT)
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime) // Floor mtime

  var flPrepend=args.flPrepend,    nPrepend=flPrepend.length
  var [arrDBOtherNonRelevant, arrDBOtherRelevant] =selectFrArrDB(arrDBOther, flPrepend)
  var arrDBOtherOrg=arrDBOther,   arrDBOther=arrDBOtherRelevant

  // var [arrTreefNonRelevant, arrTreefRelevant] =selectFrArrDB(arrTreef, flPrepend)
  // arrTreefOrg=arrTreef;   arrTreef=arrTreefRelevant


  arrTreef=arrTreef.sort(funSorterStrNameNeg);   arrDBS=arrDBS.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBSMatch, arrTreeRem, arrDBSRem]=extractMatching(arrTreef, arrDBS, ['strName'], ['strName']);
  if(err) {debugger; console.error(err); return;}

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
    debugger
    alert(`Writing ${arrDBOtherNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBOtherNew, fsMetaOther); if(err) {debugger; console.error(err); return;}
}



var sortHashcodeFile=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-h", "--fiHash", default='hashcodes.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiHash
  var fsHash=os.path.realpath(args.fiHash)
  var [err, arrDB]=await parseHashFile(fsHash); if(err) {debugger; console.error(err); return}

  arrDB=arrDB.sort(funSorterStrNameNeg)

  var [err]=await writeHashFile(arrDB, fsHash); if(err) {debugger; console.error(err); return;}
  console.log('done')
}


var changeIno=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var fsDir=os.path.realpath(args.fiDir)

    // Parse tree
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime) // Floor mtime

    // Parse fiMeta
  var fsMeta=os.path.realpath(args.fiMeta)
  var [err, arrDB]=await parseSSVCustom(fsMeta); if(err) {debugger; console.error(err); return}

  var [arrDBNonRelevant, arrDBRelevant] =selectFrArrDB(arrDB, args.flPrepend)
  var arrDBOrg=arrDB,   arrDB=arrDBRelevant

  arrTreef=arrTreef.sort(funSorterStrNameNeg);  arrDB=arrDB.sort(funSorterStrNameNeg)
  var [err, arrTreeMatch, arrDBMatch, arrTreeRem, arrDBRem]=extractMatching(arrTreef, arrDB, ['strName'], ['strName'])
  if(err) {debugger; console.error(err); return;}


  for(var i in arrDBMatch){
    var rowDB=arrDBMatch[i]
    var rowTree=arrTreeMatch[i]
    //if(!("uuid" in rowDB)) rowDB.uuid=myUUID()
    rowDB.inode=rowTree.inode
  }

  var arrDBNew=arrDBMatch
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}

  console.log('done')
}

var utilityMatchTreeAndMeta=async function(){ // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)
  var fsDir=os.path.realpath(args.fiDir)

    // Parse tree
  var treeParser=new TreeParser()
  var [err, arrTreef, arrTreeF] =await treeParser.parseTree(fsDir, true); if(err) {debugger; console.error(err); return;}
  //for(var row of arrTreef) row.mtime=Math.floor(row.mtime) // Floor mtime

    // Parse fiMeta
  var fsMeta=os.path.realpath(args.fiMeta)
  var [err, arrDB]=await parseSSVCustom(fsMeta);if(err) {debugger; console.error(err); return}

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
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMeta); if(err) {debugger; console.error(err); return;}

  console.log('done')
}


var utilityMatchMetaAndMeta=async function(){  // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-s", "--fiMetaS", default='buvt-meta.txt')
  // parser.add_argument('-t', "--fiMetaT", required=true)
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var fsMetaS=os.path.realpath(args.fiMetaS)
  var [err, arrDBS]=await parseSSVCustom(fsMetaS); if(err) {debugger; console.error(err); return}

    // Parse fiMetaT
  var fsMetaT=os.path.realpath(args.fiMetaT)
  var [err, arrDBT]=await parseSSVCustom(fsMetaT); if(err) {debugger; console.error(err); return}

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
    debugger
    alert(`Writing ${arrDBNew.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDBNew, fsMetaT); if(err) {debugger; console.error(err); return;}

  console.log('done')
}

var utilityAddToMetaStrName=async function(){  // For running different experiments 
  // parser = argparse.ArgumentParser()
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument("--flPrepend", default='')
  // args = parser.parse_args(argv)

    // Parse fiMetaS
  var fsMeta=os.path.realpath(args.fiMeta)
  var [err, arrDB]=await parseSSVCustom(fsMeta); if(err) {debugger; console.error(err); return}
  arrDB=arrDB.sort(funSorterStrNameNeg)

  var flPrepend=args.flPrepend, nPrepend=flPrepend.length


  //flPrependTmp=flPrepend+"/" if(nPrepend) else ""
  for(var row of arrDB){
    row.strName=flPrepend+row.strName
  }
  
  //if(boDryRun) {print("(Dry run) exiting"); return}
  if(boAskBeforeWrite){
    debugger
    alert(`Writing ${arrDB.length} entries to meta-file. Press enter to continue.`)
  }
  var [err]=await writeMetaFile(arrDB, fsMeta); if(err) {debugger; console.error(err); return;}

  console.log('done')
}


var check=async function(){ // buCopyUnlessNameSTMatch
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // parser.add_argument( "--start", default=0)
  // args = parser.parse_args(argv)
  var fsDir=os.path.realpath(args.fiDir)
  var fsMeta=os.path.realpath(args.fiMeta)
  var intStart=int(args.start)
  checkInterior(fsMeta, fsDir, intStart)
}

var checkSummarizeMissing=async function(){
  // parser = argparse.ArgumentParser()
  // parser.add_argument('-d', "--fiDir", default='.')
  // parser.add_argument("-m", "--fiMeta", default='buvt-meta.txt')
  // args = parser.parse_args(argv)
  var fsDir=os.path.realpath(args.fiDir)
  //var fsMeta=os.path.realpath(args.fiMeta)
  var [err, fsMeta]=await myRealPath(fiMeta); if(err) {debugger; console.error(err); return;}
  var [err]=await checkSummarizeMissingInterior(fsMeta, fsDir); if(err) {debugger; console.error(err); return;}
}

var deleteResultFiles=async function(){ 
  var arr=[leafResultCompare, leafRenameSuggestionsAncestorOnly, leafDuplicateInitial, leafDuplicateFinal, leafRenameSuggestionsAdditional, leafRenameSuggestionsOTO]
  for(var leafTmp of arr){
    // try {os.remove(leafTmp); print("Deleted: "+leafTmp)}
    // except FileNotFoundError as e{ print("Couldn't delete: "+leafTmp) }  
    var [err, result]=await Neutralino.filesystem.removeFile(leafTmp).toNBP();
    if(err) {
      if(err.code=='NE_FS_FILRMER') console.log("Couldn't delete: "+leafTmp)
      else {debugger; console.error(err); return}
    }
    console.log("Deleted: "+leafTmp)
  }
}

