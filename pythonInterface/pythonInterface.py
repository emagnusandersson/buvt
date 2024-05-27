#!/usr/bin/env python

#
# For variable naming convention see https://emagnusandersson.com/prefixes_to_variables
#


import sys
import os
import stat
import argparse
import pathlib

import re

import errno

import traceback
import inspect

sys.stdout.reconfigure(encoding='utf-8')  # Required on Windows 10 for utf-8 characters

charF='\\' if(sys.platform=="win32") else '/'
# charTRes='u'  # 'n', 'u', 'm', '1' or '2'
boIncludeLinks=True
leafFilter=".buvt-filter"
settings={"boIncludeLinks":boIncludeLinks, "leafFilter":leafFilter} #"charTRes":charTRes, 

def myErrorStack(strErr):
  exc_type, exc_value, exc_traceback = sys.exc_info()
  res=traceback.extract_stack(inspect.currentframe().f_back, limit=5)
  arr=traceback.format_list(res)
  strT='\n'.join(arr)
  return strT+'\n'+strErr


# def roundMTime(t, charTRes):
#   if(charTRes=='n'): div=1
#   elif(charTRes=='u'): div=1000
#   elif(charTRes=='m'): div=1000000
#   elif(charTRes=='1'):   div=1000000000
#   elif(charTRes=='2'): div=2000000000
#   tCalc=(t//div)
#   tRound=tCalc*div
#   return tRound, tCalc



def myRealPathf(fiPath):
  if(sys.platform=="win32"): flPath=os.path.expandvars(fiPath)
  else: flPath=fiPath
  fsPath=os.path.expanduser(flPath)
  return fsPath




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
  def __init__(self, strPat, boInc, charType, boIncSub=False, boReg=False, intLevel=0, iCandidateStart=0): #, boRootInFilterF
    self.strPat=strPat; self.boInc=boInc; self.charType=charType; self.boIncSub=boIncSub; self.boReg=boReg; self.intLevel=intLevel; self.iCandidateStart=iCandidateStart  # self.boRootInFilterF=boRootInFilterF;
    if(boReg): self.regPat=re.compile(strPat)
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
    if(self.boReg):
      res=self.regPat.match(strName)
      boMatch=bool(res)
    else:
      boMatch=self.strPat==strName
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
      boReg=strCtrl[4]=='r' if len(strCtrl) > 4 else False
      #rule = Rule(strPat, boInc, charType, boIncSub, boRootInFilterF, boReg, intLevel, iCandidateStart)
      rule = Rule(strPat, boInc, charType, boIncSub, boReg, intLevel, iCandidateStartTmp)
      if(charType=='f'): arrRulef.append(rule)
      elif(charType=='F'): arrRuleF.append(rule)
      elif(charType=='B'): arrRulef.append(rule); arrRuleF.append(rule)
      else: return {"strTrace":myErrorStack("charType!='fFB'")}, None, None
  
  return None, arrRulef, arrRuleF


#rule = Rule('.buvt-filter', False, 'f', False, False, 0, None); arrRulef.append(rule)
#rule = Rule('.buvt-filter', False, 'f'); arrRulef.append(rule)


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
    if(self.boUseFilter):
      boFoundFilterFile=True
      leafFilterLoc=self.leafFilterFirst if(intLevel==0) else settings["leafFilter"]
      try: fi=open(fsDir+charF+leafFilterLoc,'r')
      except FileNotFoundError: boFoundFilterFile=False
      if(boFoundFilterFile):
        strDataFilter=fi.read()
        fi.close()
        #iCandidateStart=len(longnameFold)+1
        if(flDir): iCandidateStart=len(flDir)+1
        else: iCandidateStart=0
        err, arrRulefT, arrRuleFT=parseFilter(strDataFilter, intLevel, iCandidateStart)
        if(err): return err 
        nNewf=len(arrRulefT)
        nNewF=len(arrRuleFT)
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
    boSkipLinks=not settings["boIncludeLinks"]
    for entry in myList:
      boFile=entry.is_file(); boDir=entry.is_dir()
      if(not boFile and not boDir):
        continue
      if(sys.platform=='win32'):
        boLink=entry.name.endswith(('.lnk'))
      else:
        boLink=entry.is_symlink()
        if(boDir and boLink):  boFile=True; boDir=False
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
      for j, rule in enumerate(arrRuleT):
        boMatch=rule.test(strName, flName, intLevel)
        if(boMatch): break
      if(boMatch): boInc=rule.boInc
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
         
    del self.arrRulef[:nNewf]
    del self.arrRuleF[:nNewF]
  
  # def calcKey(self, charTRes):
  #   for row in self.arrTreef:
  #     mtime_ns64Round, tCalc=roundMTime(mtime_ns64, charTRes)
  #     row["sm"]=KeySM(row["size"], tCalc)
    

  #def parseTree(self, fsDir, boUseFilter=False, leafFilterFirst=""):
  #def parseTree(self, fsDir, boUseFilter=False, leafFilterFirst="", arrRulefStart=[]):
  #def parseTree(self, fsDir, boUseFilter=False, leafFilterFirst=""): #, boIncludeLeafDb=False
  def parseTree(self, fsDir, leafFilterFirst=None): #, boIncludeLeafDb=False  , charTRes
    self.boUseFilter=bool(leafFilterFirst)
    # self.charTRes=charTRes
    #self.boUseFilter=boUseFilter
    #print(leafFilterFirst)
    self.leafFilterFirst=leafFilterFirst if(leafFilterFirst!="") else settings["leafFilter"]
    #self.boIncludeLeafDb=boIncludeLeafDb
    self.arrTreef=[]; self.arrTreeF=[]
    self.arrRulef=[]; self.arrRuleF=[]
    err=self.getBranch({"fsDir":fsDir, "flDir":""}, 0)  #strName, id, mtime, mtime_ns64, size, keySM

    return err, self.arrTreef, self.arrTreeF

#arrSourcef, arrSourceF =parseTree(myRealPathf(args.fiDir), True)  # Parse tree

  


#######################################################################################
# parseTreeNDump
#######################################################################################
def castToBool(s):
  if(isinstance(s, str)): return s.lower() in ['true', '1', 't', 'y', 'yes']
  elif(isinstance(s, bool)): return s
  return bool(int(s))

def parseTreeNDump(**args):
  fsDir=myRealPathf(args["fiDir"])
  leafFilterFirst=args.get("leafFilterFirst") or settings["leafFilter"]
  #charTRes=args.get("charTRes") or settings["charTRes"]

  boUseFilter=castToBool(args["boUseFilter"])
  if(not boUseFilter): leafFilterFirst=None
    # Parse tree
  treeParser=TreeParser()
  err, arrTreef, arrTreeF =treeParser.parseTree(fsDir, leafFilterFirst) #, charTRes
  if(err): 
    if(err["e"].errno==errno.ENOENT): print(f'No such folder: {fsDir}')
    else: print(err["strTrace"])
    return

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

  # ~/progPython/buvtpy/buvt.py parseTreeNDump --boUseFilter true --leafFilterFirst .buvt-filter --fiDir "/home/magnus/progPython/buvt-SourceFs/Source"




#######################################################################################
# main
#######################################################################################

def main():
  argv=sys.argv[1:]
  modeMain=argv[0]
  del argv[0]

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
    parser.add_argument("--boUseFilter", default=False)
    parser.add_argument("--leafFilterFirst", default=settings["leafFilter"])
    args = parser.parse_args(argv)
    argsD=vars(args)
    #argsD["charTRes"]=settings["charTRes"]
    parseTreeNDump(**argsD)  # using "fiDir", "leafFilterFirst", "charTRes", "boUseFilter"

if __name__ == "__main__":
  main()
else:
  pass
