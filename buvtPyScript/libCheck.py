
from lib import *
import time
import stat
import uuid

import globvar
from lib import *
from libFs import *
from libParse import *



ANSI_FONT_CLEAR=""
ANSI_FONT_BOLD=""
def formatF_Check_Missing_In_Folder(strPar, iStartPar, iStopPar, nSum):
  nSpan=iStopPar-iStartPar
  charS=pluralS(nSpan)
  #strFileIs='file is' if(nSum==1) else 'files are'
  strFileIs=pluralS(nSum, 'file is', 'files are')
  return f"In {strPar} (spanning {nSpan} row{charS} ({iStartPar}-{iStopPar-1})), {nSum} {strFileIs} missing.\n"
def formatF_Check_Missing_Single(iRow, strMissing, strName):
  return f"Row: {iRow}, {strMissing.upper()}: {strName}\n"
def formatF_Check_Missing_Range(iStart, n, strMissing, strName):
  return f"Row: {iStart}-{iStart+n-1} ({n}), {strMissing.upper()}: {strName}\n"



# N files could be categorized as renameable after matching size and time (N OTM, N MTO, N MTM) (See list in duplicateInitial.txt)
# After looking at renamed folders (N), a further N files can be categorized as renameable. (See list in renameAdditional.txt)
#   So a final N renameables after matching size and time and folder belonging (N OTM, N MTO, N MTM) (See list in duplicateFinal.txt)


# FMT_Check_Missing_In_Folder=   "In %s (spanning %d rows (%d-%d)), %d file(s) are missing.\n"
# FMT_Check_Missing_Single=    "Row: %d, " +ANSI_FONT_BOLD+"%s"+ANSI_FONT_CLEAR+" %s\n"
# FMT_Check_Missing_Range=   "Row: %d-%d (%d), " +ANSI_FONT_BOLD+"%s"+ANSI_FONT_CLEAR+" %s\n"





class MyRealPath:
  def __init__(self):
    self.obj={}
  def realPath(self, fsPath):
    if(fsPath not in self.obj): 
      self.obj[fsPath]=myRealPathf(fsPath)
    return self.obj[fsPath]
myRealPath=MyRealPath()

  # getHighestMissing
  # The input strFile is assumed to be a missing file.
  # Returns boFile, strPar, strPath
  #   strPath: is the highest missing
  #   strPar: is parent of strPath
  #   boFile: signifies if strPath is a file or a folder
def getHighestMissing(fsDir, strFile): 
  boFile=True
  strPath=strFile
  while(1):
    strPar=os.path.dirname(strPath)
    if(strPar==''): return boFile, strPar, strPath
    fsPar=myRealPath.realPath(fsDir+charF+strPar)
    if( os.path.isdir(fsPar)): return boFile, strPar, strPath 
    strPath=strPar
    boFile=False


def categorizeFile(fsDir, strName):
  fsFile=fsDir+charF+strName;     boFileFound=os.path.lexists(fsFile) # lexists: doesn't follow links (returns true on broken links)
  if(boFileFound): return ' ', None, None
  else:
    boFile, strPar, flChild= getHighestMissing(fsDir, strName)
    charMissing='f' if(boFile) else 'd'
    return charMissing, strPar, flChild


  # Go through the db-file, for each row (file), check if the hashcode matches the actual files hashcode  
def check(**args):
  fiDbDir=myRealPathf(args["fiDbDir"])
  fiDb=args["fiDb"]
  fsDb=myRealPathf(fiDb) 
  iStart=int(args["iStart"])
  charTRes=args["charTRes"]

  tStart=time.time()
  myConsole=globvar.myConsole
  nNotFound=0; nMisMatchTimeSize=0; nMisMatchHash=0; nOK=0

  #myConsole.print(MAKESPACE_N_SAVE)
  myConsole.makeSpaceNSave()
  
  myConsole.print('parsing db...')
  err, arrDb=parseDbWType(fsDb, charTRes)
  if(err): print(err["strTrace"], file=sys.stderr); return
  #if(err): myConsole.error(err["strTrace"]); return

  lenDb=len(arrDb)
  leafFileDbOld= os.path.basename(fsDb)


    # Variables for "missing streaks"
  flMissingFile=""
  iNotFoundFirst=0
  lenFlChildL=0
  charMissingL=' '; flChildL=""
  
  nHour=0; nMin=0; nSec=0
  
  #for iRowCount, row in enumerate(arrDb):
  for iRowCount in range(iStart,lenDb):
    row=arrDb[iRowCount]
    strHashOld=row["strHash"]; intSizeOld=row["size"]; intTimeOld=row["mtime_ns64Floored"]; strName=row["strName"]

    fsFile=fiDbDir+charF+strName;   
    charMissing, strPar, flChild=categorizeFile(fiDbDir, strName)

    #myConsole.print(MY_RESET)
    myConsole.myReset()
    
      # If streak starts
    if(charMissing=='f' and charMissingL!='f'): iNotFoundFirst=iRowCount
    elif(charMissing=='d' and charMissingL!='d'): iNotFoundFirst=iRowCount
    elif(charMissing=='d' and charMissingL=='d' and flChild!=flChildL): iNotFoundFirst=iRowCount

      # If streak continues
    if(charMissing=='f' and charMissingL=='f'):
      myConsole.cursorUp(); myConsole.clearBelow()
      #myConsole.print(ANSI_CURSORUP+ANSI_CLEAR_BELOW)
    elif(charMissing=='d' and charMissingL=='d' and flChild==flChildL):
      myConsole.cursorUp(); myConsole.clearBelow()
      #myConsole.print(ANSI_CURSORUP+ANSI_CLEAR_BELOW)


    tDay,nHour,nMin,nSec,tms,tus,tns=formatTDiff(time.time()-tStart)
    if(charMissing=='f'):
      nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1):
        #myConsole.print((FMT_Check_Missing_Single+MAKESPACE_N_SAVE) %(iNotFoundFirst, "Missing file:", strName))
        myConsole.print(formatF_Check_Missing_Single(iNotFoundFirst, "Missing file", strName))
        myConsole.makeSpaceNSave()
      else:
        strTmp=os.path.dirname(strName)
        if(strTmp==""): strTmp="(top folder)"
        #myConsole.print((FMT_Check_Missing_Range+MAKESPACE_N_SAVE) %(iNotFoundFirst, iRowCount, nNotFoundLoc, "Missing files in:", strTmp))
        myConsole.print(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing files in", strTmp))
        myConsole.makeSpaceNSave()
    elif(charMissing=='d'):
      nNotFoundLoc=iRowCount-iNotFoundFirst+1
      if(nNotFoundLoc==1):
        #myConsole.print((FMT_Check_Missing_Single+MAKESPACE_N_SAVE) %(iNotFoundFirst, "Missing folder:", flChild))
        myConsole.print(formatF_Check_Missing_Single(iNotFoundFirst, "Missing folder", flChild))
        myConsole.makeSpaceNSave()
      else:
        #myConsole.print((FMT_Check_Missing_Range+MAKESPACE_N_SAVE) %(iNotFoundFirst, iRowCount, nNotFoundLoc, "Missing folder:", flChild))
        myConsole.print(formatF_Check_Missing_Range(iNotFoundFirst, nNotFoundLoc, "Missing folder", flChild))
        myConsole.makeSpaceNSave()
    else: 
      #myConsole.print(("%d:%02d:%02d, "+ANSI_FONT_BOLD+"Checking row:"+ANSI_FONT_CLEAR+" %d %s\n") %(nHour, nMin, nSec, iRowCount, strName))
      myConsole.printNL(("%d:%02d:%02d, Checking row: %d %s") %(nHour, nMin, nSec, iRowCount, strName))
    
    charMissingL=charMissing; flChildL=flChild
    if(charMissing!=' '): nNotFound+=1; continue


      # Calculate hash
    #strHash=myMD5(fsFile).decode("utf-8")
    strHash=myMD5W(row, fiDbDir)
    if(strHash!=strHashOld):  # If hashes mismatches
        # Check modTime and size (perhaps the user forgott to run sync before running check
      st = os.lstat(fsFile); st_size=st.st_size; st_mtime=st.st_mtime; st_mtime_ns=st.st_mtime_ns
      #intTimeNew=math.floor(st_mtime)
      intTimeNew=st_mtime_ns
      boTMatch=intTimeNew==intTimeOld;    boSizeMatch=st_size==intSizeOld
      myConsole.myReset()
      StrTmp=[]
      if(not boTMatch or not boSizeMatch ): # If meta data mismatches
        strBase=os.path.basename(strName)
        if(strBase==leafFileDbOld):
          #strTmp=(MY_RESET+"Row: %d, (%s is ignored)") %(iRowCount, strName);   StrTmp.append(strTmp)
          strTmp=("Row: %d, (%s is ignored)") %(iRowCount, strName);   StrTmp.append(strTmp)
        else:
          #strTmp = (MY_RESET+"Row: %d") %(iRowCount);   StrTmp.append(strTmp)
          strTmp = ("Row: %d") %(iRowCount);   StrTmp.append(strTmp)
          

          StrLab=[]
          if(not boSizeMatch): StrLab.append("SIZE")
          if(not boTMatch): StrLab.append("MTIME")
          strLab=' and '.join(StrLab)
          #strLabB=ANSI_FONT_BOLD+strLab+" MISMATCH!!!"+ANSI_FONT_CLEAR+" (run SYNC before checking)"
          strLabB="(Run SYNC before checking)"
          #StrTmp.append(strLabB)
          if(not boSizeMatch): strTmp = (ANSI_FONT_BOLD+"size"+ANSI_FONT_CLEAR+" (db/file): %d/%d") %(intSizeOld, st_size);    StrTmp.append(strTmp)
          if(not boTMatch): 
            tDiffNs=intTimeNew-intTimeOld; tDiff=tDiffNs/1e9; tDiffHuman, charUnit=getSuitableTimeUnit(tDiff)
            #strTmp = (ANSI_FONT_BOLD+"tDiff"+ANSI_FONT_CLEAR+" (file-db): %i%c") %(tDiffHuman, charUnit);
            strTmp='behind' if(tDiffNs>0) else 'ahead'
            strTmp = f'mtime: db is {str(math.floor(abs(tDiffHuman)))}{charUnit} {strTmp}';
            StrTmp.append(strTmp)
          
          StrTmp.append(strLabB)
          strTmpB = "%s" %(strName);    StrTmp.append(strTmpB)
        
        nMisMatchTimeSize+=1
      else: # Meta data matches
        #strTmp = (MY_RESET+"Row: %d, "+ANSI_FONT_BOLD+"Hash Mismatch"+ANSI_FONT_CLEAR) %(iRowCount);    StrTmp.append(strTmp)
        strTmp = ("Row: %d, Hash Mismatch!!!") %(iRowCount);    StrTmp.append(strTmp)
        StrTmp.append("(db/file): "+strHashOld+" / "+strHash);   
        StrTmp.append(strName);    
        nMisMatchHash+=1
      
      strTmp=", ".join(StrTmp)
      myConsole.printNL(strTmp)
      #myConsole.print(MAKESPACE_N_SAVE)
      myConsole.makeSpaceNSave()
    
    else: nOK+=1;  # Hashes match

  tDay,nHour,nMin,nSec,tms,tus,tns=formatTDiff(time.time()-tStart)
  StrSum=[]
  StrSum.append("nRowTested/nRowTot: %d/%d")
  strTmp="NotFound: %d";
  if(nNotFound): strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR
  StrSum.append(strTmp)
  strTmp="MisMatchTimeSize: %d";
  if(nMisMatchTimeSize): strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR
  StrSum.append(strTmp)
  strTmp="MisMatchHash: %d";
  if(nMisMatchHash): strTmp=ANSI_FONT_BOLD+strTmp+ANSI_FONT_CLEAR
  StrSum.append(strTmp)
  StrSum.append("OK: %d")
  strSum=', '.join(StrSum)

  myConsole.myReset()
  myConsole.printNL(("Time: %d:%02d:%02d, Done ("+strSum+")") %(nHour,nMin,nSec, lenDb-iStart, lenDb, nNotFound, nMisMatchTimeSize, nMisMatchHash, nOK))
  if(nMisMatchTimeSize):
    #strLab=ANSI_FONT_BOLD+"META (SIZE/MTIME) MISMATCHES!!!"+ANSI_FONT_CLEAR+" (on "+str(nMisMatchTimeSize)+" files) This happens when the db-file hasn't been SYNC-ed before checking"
    strLab=str(nMisMatchTimeSize)+" cases where meta-data (size/mtime) mismatches. This happens when the db hasn't been SYNC-ed before checking."
    myConsole.printNL(strLab)


  return ""


