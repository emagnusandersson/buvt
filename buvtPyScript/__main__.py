#!/usr/bin/env python

#
# For variable naming convention see https://emagnusandersson.com/prefixes_to_variables
#

# zip prog.zip __main__.py lib.py
# python3 prog.zip

import sys
import os
import stat
import argparse
import pathlib
import fnmatch

import re

import errno

import traceback
import inspect

import uuid
import enum
import subprocess

import globvar
import settings
from lib import *
from libFs import *
from libParse import *
from libCheck import *

sys.stdout.reconfigure(encoding='utf-8')  # Required on Windows 10 for utf-8 characters



def myErrorStack(strErr):
  exc_type, exc_value, exc_traceback = sys.exc_info()
  res=traceback.extract_stack(inspect.currentframe().f_back, limit=5)
  arr=traceback.format_list(res)
  strT='\n'.join(arr)
  return strT+'\n'+strErr


class KeySM:
  def __init__(self, size, tCalc):
    self.size=size
    self.tCalc=tCalc
    self.ind=0 # Used to figure out how index changes order after sorting
  def __eq__(self, other):
    #boString = isinstance(other, str)
    if(isinstance(other, KeySM)):
      #return ((self.size, self.tRound) == (other.size, other.tRound))
      return ((self.size, self.tCalc) == (other.size, other.tCalc))
    return str(self) == other
  def __lt__(self, other):
    #return ((self.size, self.tRound) < (other.size, other.tRound))
    return ((self.size, self.tCalc) < (other.size, other.tCalc))
  def __gt__(self, other):
    #return ((self.size, self.tRound) > (other.size, other.tRound))
    return ((self.size, self.tCalc) > (other.size, other.tCalc))
  def __str__(self):
    #return str(self.size)+'_'+str(self.tRound)
    return '%012d_%012d' %(self.size, self.tCalc)
  def __hash__(self):
    #return '%012d_%012d' %(self.size, self.tCalc)
    return hash(str(self.size)+'_'+str(self.tCalc))




class Rule:
  def __init__(self, strPat, boInc, charType, boIncSub=False, strReg='', intLevel=0, iCandidateStart=0): #, boRootInFilterF
    self.strPat=strPat; self.boInc=boInc; self.charType=charType; self.boIncSub=boIncSub; self.strReg=strReg; self.intLevel=intLevel; self.iCandidateStart=iCandidateStart  # self.boRootInFilterF=boRootInFilterF;
    if(strReg=='r'): self.regPat=re.compile(strPat)
  def test(self, shortname, flName, intLevelOfStr):
      # "Bail" if the pattern is at a level where it is not supposed to be used. 
    if(not self.boIncSub and intLevelOfStr>self.intLevel): return False  

      # Empty pattern matches everything
    if(len(self.strPat)==0): return True

      # Detemine strName
    #if(self.boRootInFilterF): strName=flName[self.iCandidateStart:]
    if(self.iCandidateStart is not None): strName=flName[self.iCandidateStart:]
    else: strName=shortname

      # Test pattern
    if(self.strReg=='r'):
      res=self.regPat.search(strName)
      boMatch=bool(res)
    elif(self.strReg=='g'):
      boMatch=fnmatch.fnmatch(strName, self.strPat)
    else:
      boMatch=self.strPat==strName
    return boMatch


class RuleR: # Rule for rsync
  def __init__(self, boInc, strPat, iCandidateStart=0): #, intLevel=0, charType, boFrontTied=False, strReg=''
    self.boInc=boInc; self.iCandidateStart=iCandidateStart  #  self.intLevel=intLevel;
    #if(strReg=='r'): self.regPat=re.compile(strPat)
    if strPat[-1]=='/': charType='F'; strPat=strPat[0:-1]
    else: charType='B'
    #strCtrl=strCtrl.lower()
    boFrontTied=strPat[0]=='/'
    if(boFrontTied): strPat=strPat[1:]
    boReg=any(elem in strPat for elem in "*[?")
    strType='*' if boReg else ''
    if(boReg):
      # strPat=strPat.replace('**', chr(0))
      # strPat=strPat.replace('*', '[!/]*')
      # strPat=strPat.replace('?', '[!/]')

      # strPat=strPat.replace('.', '\\.')
      #strPat=re.sub('([\\{\\}\\.\\!\\<\\=\\>\\\\])', r"\\1", strPat)
      strPat=re.sub(r'([\{\}\!\.\<\=\>\\])', r"\\\1", strPat)
      #strPat=strPat.replace('.', '\\.')
      strPat=strPat.replace('**', chr(0))
      strPat=strPat.replace('*', '[^/]*')
      strPat=strPat.replace(chr(0), '.*')
      strPat=strPat.replace('?', '[^/]')
      strPat+='$'
      if(boFrontTied): strPat='^'+strPat
      self.regPat=re.compile(strPat)
    self.strPat=strPat; self.charType=charType; self.boFrontTied=boFrontTied; self.strType=strType;

  def test(self, shortname, flName, trash): #, intLevelOfStr
    #if(not self.boFrontTied and intLevelOfStr>self.intLevel): return False  
    strPat=self.strPat; strType=self.strType; iCandidateStart=self.iCandidateStart

      # Empty pattern matches everything
    if(len(strPat)==0): return True

      # Detemine strCand
    # if(self.boFrontTied): strCand=flName[iCandidateStart:]
    # else: strCand=shortname

      # Test pattern

    if(strType=='*'):
      #strCand=flName[iCandidateStart:]
      if(self.boFrontTied): strCand=flName[iCandidateStart:]
      else:
        strCand=flName
      res=self.regPat.search(strCand)
      boMatch=bool(res)
      #boMatch=fnmatch.fnmatch(shortname, strPat)
      #boMatch=fnmatch.fnmatch(flName, strPat)
      pass
    else:
      if(self.boFrontTied): strCand=flName[iCandidateStart:]
      else:
        lenPat=len(strPat)
        strCand=flName[-lenPat:]
      boMatch=strPat==strCand
    pass
    return boMatch


#######################################################################################
# parseFilter
#######################################################################################
def parseFilter(strData, intLevel, iCandidateStart):
  arrRulef=[]
  arrRuleF=[]
  patLine=re.compile(r'^.*$', re.M)
  for i, obj in enumerate(patLine.finditer(strData)):
    strRow=obj.group(0)
    strRow=strRow.strip()
    if(strRow):
      if(strRow.startswith('#')): continue
      iSpace=strRow.find(' ')
      if(iSpace==-1): strCtrl=strRow; strPat=""
      else: strCtrl=strRow[0:iSpace]; strPat=strRow[iSpace:].strip()
      #strCtrl=strCtrl.ljust(5, '_')
      boInc=strCtrl[0]=='+'
      charType=strCtrl[1] if len(strCtrl) > 1 else 'f'
      strCtrl=strCtrl.lower()
      boIncSub=strCtrl[2]=='s' if len(strCtrl) > 2 else False
      boRootInFilterF=strCtrl[3]=='r' if len(strCtrl) > 3 else False
      iCandidateStartTmp=iCandidateStart if(boRootInFilterF) else None
      strReg='r' if len(strCtrl) > 4 and strCtrl[4]=='r' else ''
      rule = Rule(strPat, boInc, charType, boIncSub, strReg, intLevel, iCandidateStartTmp)
      if(charType=='f'): arrRulef.append(rule)
      elif(charType=='F'): arrRuleF.append(rule)
      elif(charType=='B'): arrRulef.append(rule); arrRuleF.append(rule)
      else: return {"strTrace":myErrorStack("charType!='fFB'")}, None, None
  return None, arrRulef, arrRuleF

#rule = Rule('.buvt-filter', False, 'f', False, False, 0, None); arrRulef.append(rule)
#rule = Rule('.buvt-filter', False, 'f'); arrRulef.append(rule)


def parseFilterRsync(strData, iCandidateStart): #, intLevel
  arrRulef=[]
  arrRuleF=[]
  patLine=re.compile(r'^.*$', re.M)
  for i, obj in enumerate(patLine.finditer(strData)):
    strRow=obj.group(0)
    strRow=strRow.strip()
    if(strRow):
      if(strRow.startswith('#')): continue
      iSpace=strRow.find(' ')
      if(iSpace==-1): return {"strTrace":myErrorStack("iSpace==-1")}, None, None
      else: strCtrl=strRow[0:iSpace]; strPat=strRow[iSpace:].strip()
      boInc=strCtrl[0]=='+'
      rule = RuleR(boInc, strPat, iCandidateStart) #, intLevel
      if(rule.charType=='f'): arrRulef.append(rule)
      elif(rule.charType=='F'): arrRuleF.append(rule)
      elif(rule.charType=='B'): arrRulef.append(rule); arrRuleF.append(rule)
      else: return {"strTrace":myErrorStack("charType!='fFB'")}, None, None
  return None, arrRulef, arrRuleF


#######################################################################################
# TreeParser
#######################################################################################
class TreeParser:
  def __init__(self):
    #self.charTRes=charTRes
    pass #self.boUseFilter=False
  def getBranch(self, objDir, intLevel):
    fsDir=objDir["fsDir"]
    flDir=objDir["flDir"]
    nNewf=0; nNewF=0

      # Add potetial filter rules
    leafFilterLoc=self.leafFilterFirst if(intLevel==0) else self.leafFilter
    if(leafFilterLoc):
      boFoundFilterFile=True
      try: fi=open(fsDir+charF+leafFilterLoc,'r')
      except FileNotFoundError: boFoundFilterFile=False
      if(boFoundFilterFile):
        strDataFilter=fi.read()
        fi.close()
        #iCandidateStart=len(longnameFold)+1
        if(flDir): iCandidateStart=len(flDir)+1
        else: iCandidateStart=0
        if(self.charFilterMethod=='r'):
          err, arrRulefT, arrRuleFT=parseFilterRsync(strDataFilter, iCandidateStart) #, intLevel
        elif(self.charFilterMethod=='b'):
          err, arrRulefT, arrRuleFT=parseFilter(strDataFilter, intLevel, iCandidateStart)
        else:
          return {"strTrace":myErrorStack(f"unrecognized charFilterMethod: {charFilterMethod}")}
        if(err): return err 
        nNewf=len(arrRulefT); nNewF=len(arrRuleFT)
          # The rules of this branch are added to the beginning of the rule-arrays
        self.arrRulef[0:0]=arrRulefT 
        self.arrRuleF[0:0]=arrRuleFT
      
    
    try:
      it=os.scandir(fsDir)
    except FileNotFoundError as e:
      return {"e":e, "strTrace":myErrorStack(e.strerror)}
      #return {"strTrace":myErrorStack(f'Folder not found: "{fsDir}"')}
      # if('pydevd' in sys.modules): breakpoint()
      # else: input('os.scandir error!?!?!?')
    myListUnSorted=list(it)
    myList=sorted(myListUnSorted, key=lambda x: x.name)
    boSkipLinks=not settings.boIncludeLinks
    for entry in myList:
      boFile=entry.is_file(follow_symlinks=False); boDir=entry.is_dir(follow_symlinks=False); boLink=entry.is_symlink()
      if(not boFile and not boDir and not boLink):
        continue
      if(sys.platform=='win32'):
        if(boLink==False): boLink=entry.name.endswith(('.lnk'))
      # else:
      #   if(boDir and boLink):  boFile=True; boDir=False
      if(boSkipLinks and boLink): continue
      strName=entry.name
      #strName=longnameFold+charF+strName
      if(flDir): flName=flDir+charF+strName
      else: flName=strName
      fsName=fsDir+charF+strName
      #if(flName=='progPython/bin/scannedBook.py'): breakpoint()
      #if(strName=='0Downloads'): breakpoint()
      #if(strName=='ignore'): breakpoint()
      boMatch=False
      boInc=True
      arrRuleT=self.arrRuleF if boDir else self.arrRulef
      pass
      for j, rule in enumerate(arrRuleT):
        boMatch=rule.test(strName, flName, intLevel)
        if(boMatch): break
      if(boMatch): boInc=rule.boInc
      else:
        pass
      if(not boInc): continue

      objStat=os.lstat(fsName)
      id=objStat.st_ino; mtime_ns64=objStat.st_mtime_ns; #mtime=objStat.st_mtime
      #mtime_ns64Round, tCalc=roundMTime(mtime_ns64, self.charTRes)
      objEntry={"strName":flName, "id":id, "mtime_ns64":mtime_ns64} #, "mtime":mtime  , "mtime_ns64Round":mtime_ns64Round
      if(not boDir):
        mode=objStat.st_mode;size=objStat.st_size
        #sm=str(rowA["size"])+str(rowA["mtime"])
        #sm='%012d_%012d' %(size,mtime)
        #sm=KeySM(size, tCalc)
        strType='l' if(boLink) else 'f'
        objEntry.update({"size":size, "strType":strType}) #, "sm":sm
        self.arrTreef.append(objEntry)
      else:
        self.arrTreeF.append(objEntry)
        obj={"fsDir":fsName, "flDir":flName}
        err=self.getBranch(obj, intLevel+1) 
        if(err): return err;
        
      # Remove the rules from the rule-arrays
    del self.arrRulef[:nNewf]
    del self.arrRuleF[:nNewF]
  
  # def calcKey(self, charTRes):
  #   for row in self.arrTreef:
  #     mtime_ns64Round, tCalc=roundMTime(mtime_ns64, charTRes)
  #     row["sm"]=KeySM(row["size"], tCalc)
    

  def parseTree(self, fsDir, leafFilter=None, leafFilterFirst=None, charFilterMethod='b'): #, boIncludeLeafDb=False  , charTRes
    #self.boUseFilter=bool(leafFilterFirst)
    # self.charTRes=charTRes
    #self.boUseFilter=boUseFilter
    #print(leafFilterFirst)
    self.leafFilter=leafFilter
    self.leafFilterFirst=leafFilterFirst
    self.charFilterMethod=charFilterMethod
    #self.boIncludeLeafDb=boIncludeLeafDb
    self.arrTreef=[]; self.arrTreeF=[]
    self.arrRulef=[]; self.arrRuleF=[]
    err=self.getBranch({"fsDir":fsDir, "flDir":""}, 0)  #strName, id, mtime, mtime_ns64, size, keySM

    return err, self.arrTreef, self.arrTreeF

#err, arrSourcef, arrSourceF =parseTree(myRealPathf(arg.fiDir), True)  # Parse tree

 #rsync -nrl --filter dir-merge /.rsync-filter --out-format='%n' /home/magnus/progPython/buvt-SourceFs/Source/ trash
def getRsyncList(fsDir, leafFilter, leafFilterFirst):
  arrCommand=['rsync', '-nrl']; #F
  if(leafFilter): arrCommand.extend(['--filter', f'dir-merge /{leafFilter}']) #, f"--filter='exclude ${leafFilter}'""
  if(leafFilterFirst and leafFilterFirst!=leafFilter):
    fsTmp=fsDir+charF+leafFilterFirst
    arrCommand.extend(['--filter', '!', '--filter', f'merge {fsTmp}'])
    #return {"strTrace":myErrorStack("leafFilterFirst and leafFilterFirst!=leafFilter")}, None, None, None
  arrCommand.extend(["--out-format='%n'", fsDir+charF, 'trash'])

  #arrCommand=['rsync', '-nrF', "--out-format='%n'", fsDir+charF, "/dev/false"]
  boErr=False
  try:
    strData=subprocess.check_output(arrCommand, stderr=subprocess.STDOUT)
  except subprocess.CalledProcessError as e:
    boErr=True
    stdData=e.output.decode("utf-8")
    #return {"strTrace":myErrorStack(e.output)}, None, None, None
  if(boErr): 
    sys.exit(stdData)
  strData=strData.decode("utf-8")

  arrInp=strData.split('\n')
  arrInp=arrInp[1:]
  arrf=[]; arrF=[]; arrOther=[]
  boSkipLinks=not settings.boIncludeLinks

  for flName in arrInp:
    if(len(flName)==0): continue
    flName=flName.strip("'")
    fsName=fsDir+charF+flName
    boFile=os.path.isfile(fsName)
    boDir=os.path.isdir(fsName)
    boLink=os.path.islink(fsName)
    
    if(not boFile and not boDir and not boLink):
      continue
    if(boSkipLinks and boLink): continue
    if(boFile or boDir):
      objStat=os.lstat(fsName)
      id=objStat.st_ino; mtime_ns64=objStat.st_mtime_ns; #mtime=objStat.st_mtime
    objEntry={"id":id, "mtime_ns64":mtime_ns64} #, "mtime":mtime
    if(boFile or boLink): #All links (even links to folders) are treated as files
      mode=objStat.st_mode; size=objStat.st_size
      strType='l' if(boLink) else 'f'
      objEntry.update({"strName":flName, "size":size, "strType":strType})
      arrf.append(objEntry)
    elif(boDir):
      objEntry.update({"strName":flName[:-1]})
      arrF.append(objEntry)
    else: 
      arrOther.append(flName)
  return None, arrf, arrF, arrOther



#######################################################################################
# parseTreeNDump
#######################################################################################
def castToBool(s):
  if(isinstance(s, str)): return s.lower() in ['true', '1', 't', 'y', 'yes']
  elif(isinstance(s, bool)): return s
  return bool(int(s))

def parseTreeNDump(**arg):
  fsDir=myRealPathf(arg["fiDir"])
  leafFilter=arg.get("leafFilter") or ''
  leafFilterFirst=arg.get("leafFilterFirst") or ''
  charFilterMethod=arg.get("charFilterMethod") or "b" # "b" for "buvt", "r" for "rsync parsed by buvt" or "R" for "rsync parsed by rsync"
  # charFilterMethod='r' if(leafFilter and leafFilter[0:7]=='.rsync-') else ''
  # charFilterMethodFirst='r' if(leafFilterFirst and leafFilterFirst[0:7]=='.rsync-') else ''
  # if(not charFilterMethod): charFilterMethod=charFilterMethodFirst
  # if(not charFilterMethod): charFilterMethod='b'
  
  #charTRes=arg.get("charTRes") or settings["charTRes"]

  #boUseFilter=castToBool(arg["boUseFilter"])
  #boUseFilter=bool(leafFilter)
  #if(not boUseFilter): leafFilterFirst=None
  #if(charFilterMethod=='b' or charFilterMethod=='r'):
  if(charFilterMethod in 'br'):
      # Parse tree
    treeParser=TreeParser()
    err, arrTreef, arrTreeF =treeParser.parseTree(fsDir, leafFilter, leafFilterFirst, charFilterMethod) #, charTRes
    if(err): 
      if(err["e"].errno==errno.ENOENT): print(f'No such folder: {fsDir}')
      else: print(err["strTrace"])
      return
  else:
    err, arrTreef, arrTreeF, arrOther =getRsyncList(fsDir, leafFilter, leafFilterFirst)
    if(err): print(err["strTrace"]); return 
    #arrTreef+=arrOther

  arrTreef.sort(key=lambda x: x["strName"]);

  for row in arrTreef:
    strType=row["strType"]
    #print('%s %s %s %s@%s' %(strType, row["id"], row["mtime_ns64"], row["size"], row["strName"]))
    #strTNS=row["mtime_ns64"] # Challenging testing the reader
    #strTNS=f'{row["mtime_ns64"]:019_}' # Kind to the reader (Canonical)
    strTNS=f'{row["mtime_ns64"]:019}' # Kind to the reader (Canonical)
    print(f'{strType} {row["id"]} {strTNS} {row["size"]}@{row["strName"]}')
  
  print('@')
  for row in arrTreeF:
    #print('%s %s@%s' %(row["id"], row["mtime_ns64"], row["strName"]))
    #strTNS=row["mtime_ns64"] # Challenging testing the reader
    #strTNS=f'{row["mtime_ns64"]:019_}' # Kind to the reader (Canonical)
    strTNS=f'{row["mtime_ns64"]:019}' # Kind to the reader (Canonical)
    print(f'{row["id"]} {strTNS}@{row["strName"]}')

  # ~/progPython/buvtpy/buvt.py parseTreeNDump --boUseFilter true --leafFilter .buvt-filter --leafFilterFirst .buvt-filter --fiDir "/home/magnus/progPython/buvt-SourceFs/Source"



#######################################################################################
# parseReturnSeparatedList
#######################################################################################
def parseReturnSeparatedList(fsFile):
  try: fi=open(fsFile,'r')
  except FileNotFoundError as e:
    return {"e":e, "strTrace":myErrorStack(e.strerror)}, None    #"strErr":e.strerror, 
  strData=fi.read();   fi.close()
  arrOut=[];   arrInp=strData.split('\n')
  for strRow in arrInp:
    strRow=strRow.strip()
    if(len(strRow)==0): continue
    if(strRow.startswith('#')): continue
    arrPart=strRow.split(None, 3)
    arrOut.append(strRow)
  
  return None, arrOut

#######################################################################################
# makeFolders
#######################################################################################

def makeFolders(**arg):
  fsFile=myRealPathf(arg["fiFile"])

  err, arrFolder=parseReturnSeparatedList(fsFile)
  if(err): 
    if(err["e"].errno==errno.ENOENT): print(f'No such file: {fsFile}')
    else: print(err["strTrace"])
    return

  for strDir in arrFolder:
    os.makedirs(strDir, exist_ok=True)


#######################################################################################
# parsePairList
#######################################################################################

def parsePairList(path, strStrart='MatchingData'):
  if(strStrart==None):strStrart='MatchingData'
  class EnumMode(enum.Enum): LookForStart = 1; LookForA = 2; LookForB = 3
  
  boInputFound=True
  try: fi=open(path,'r')
  except FileNotFoundError as e:
    return {"e":e, "strTrace":myErrorStack(e.strerror)}, []
  strData=fi.read(); fi.close()

  arrRename=[]
  arrInp=strData.split('\n')
  #i=0; nRows=len(arrInp)
  mode=EnumMode.LookForStart
  strA=""; strB=""; strMeta=""
  for i, strRow in enumerate(arrInp):
    strRow=strRow.strip()
    if(len(strRow)==0): continue
    if(strRow.startswith('#')): continue
    #arrPart=strRow.split()

    if(mode==EnumMode.LookForStart):
      if(strRow==strStrart): mode=EnumMode.LookForA; strMeta=strRow; continue
    elif(mode==EnumMode.LookForA):
      strA=strRow;  mode=EnumMode.LookForB; continue
    elif(mode==EnumMode.LookForB):
      strB=strRow;  mode=EnumMode.LookForStart

    arrRename.append({"strA":strA, "strB":strB, "strMeta":strMeta})
  
  return None, arrRename


def renameFiles(**arg):
  fsFile=myRealPathf(arg["fiFile"])
  err, arrRename=parsePairList(fsFile)
  n=len(arrRename); arrTmpName=[""]*n
  if(err): 
    if(err["e"].errno==errno.ENOENT): print(f'No such file: {fsFile}')
    else: print(err["strTrace"])
    return

  for i, row in enumerate(arrRename):    # Rename to temporary names
    fsOld=row["strA"]; fsNew=row["strB"];
    hex=uuid.uuid4().hex
    fsTmp=fsNew+'_'+hex
    arrTmpName[i]=fsTmp
    # fsPar=os.path.dirname(fsNew);  boExist=os.path.exists(fsPar);  boDir=os.path.isdir(fsPar)
    # if(boExist): 
    #   if(not boDir): return {"strTrace":myErrorStack("boExist and not boDir")}
    # else: pathlib.Path(fsPar).mkdir(parents=True, exist_ok=True)
    try: os.rename(fsOld, fsTmp)
    except FileNotFoundError as e:
      return {"e":e, "strTrace":myErrorStack(e.strerror)}   

  for i, row in enumerate(arrRename):    # Rename to final names
    fsTmp=arrTmpName[i]
    fsNew=row['strB']
    try: os.rename(fsTmp, fsNew)
    except FileNotFoundError as e:
      return {"e":e, "strTrace":myErrorStack(e.strerror)}   
  return None

def rmFolders(**arg):
  fsFile=myRealPathf(arg["fiFile"])
  err, arrEntry=parseReturnSeparatedList(fsFile)
  if(err): 
    if(err["e"].errno==errno.ENOENT): print(f'No such file: {fsFile}')
    else: print(err["strTrace"])
    return

  for strDir in arrEntry:
    os.rmdir(strDir)

def rmFiles(**arg):
  fsFile=myRealPathf(arg["fiFile"])
  err, arrEntry=parseReturnSeparatedList(fsFile)
  if(err): 
    if(err["e"].errno==errno.ENOENT): print(f'No such file: {fsFile}')
    else: print(err["strTrace"])
    return

  for strDir in arrEntry:
    os.remove(strDir)


#######################################################################################
# main
#######################################################################################

def main():
  argv=sys.argv[1:]
  modeMain=argv[0]
  del argv[0]
  globvar.myConsole=MyConsole()

  if(modeMain=='singleFile'):
    fsPath=argv[0]
    try:
      st = os.lstat(fsPath)
    except FileNotFoundError as e:
      print('noSuch')
      return
    mode=st.st_mode; boFile=int(stat.S_ISREG(mode)); boDir=int(stat.S_ISDIR(mode))
    print(f'OK {boFile} {boDir} {st.st_ino} {st.st_mtime_ns:019} {st.st_size}')
    #print(f'{st.st_mode} {st.st_ino} {st.st_mtime_ns:019} {st.st_size}')
    pass
  elif(modeMain=='parseTreeNDump'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', "--fiDir", default='.')
    #parser.add_argument("--boUseFilter", default=False)
    parser.add_argument("--leafFilter", default="")
    parser.add_argument("--leafFilterFirst", default="")
    parser.add_argument("--charFilterMethod", default="b")
    arg = parser.parse_args(argv)
    argsD=vars(arg)
    parseTreeNDump(**argsD)  # using "fiDir", "leafFilterFirst", "charTRes", "boUseFilter"
  elif(modeMain=='makeFolders'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', "--fiFile")
    arg = parser.parse_args(argv)
    argsD=vars(arg)
    makeFolders(**argsD)
  elif(modeMain=='renameFiles'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', "--fiFile")
    arg = parser.parse_args(argv)
    argsD=vars(arg)
    renameFiles(**argsD)
  elif(modeMain=='rmFiles'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', "--fiFile")
    arg = parser.parse_args(argv)
    argsD=vars(arg)
    rmFiles(**argsD)
  elif(modeMain=='rmFolders'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', "--fiFile")
    arg = parser.parse_args(argv)
    argsD=vars(arg)
    rmFolders(**argsD)
  elif(modeMain=='check'):
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', "--fiDir", default='.')
    parser.add_argument("--fiDb",)
    parser.add_argument( "--iStart", default=0)
    parser.add_argument( "--charTRes", default=settings.charTRes)
    args = parser.parse_args(argv)
    argsD=vars(args)
    if(argsD["fiDb"]==None): argsD["fiDb"]=argsD["fiDir"]+charF+'buvtDb.txt'
    check(**argsD)

if __name__ == "__main__":
  main()
else:
  pass
