

import os
import sys
import subprocess
import math
import hashlib
import settings

import traceback
import inspect

charF='\\' if(sys.platform=="win32") else '/'

ANSI_CURSOR_SAVE="\0337"
ANSI_CURSOR_RESTORE="\0338"
ANSI_CLEAR_BELOW="\033[J"

ANSI_FONT_CLEAR="\033[0m"
ANSI_FONT_BOLD="\033[1m"
def ANSI_CURSOR_UP(n):      return "\033["+str(n)+"A"
def ANSI_CURSOR_DOWN(n):    return "\033["+str(n)+"B"
ANSI_CLEAR_RIGHT="\033[K"
ANSI_CURSORUP="\033[A"
ANSI_CURSORDN="\033[B"

MAKESPACE_N_SAVE="\n\n"+ANSI_CURSOR_UP(2)+ANSI_CURSOR_SAVE
MY_RESET=ANSI_CURSOR_RESTORE+ANSI_CLEAR_BELOW

def myErrorStack(strErr):
  exc_type, exc_value, exc_traceback = sys.exc_info()
  res=traceback.extract_stack(inspect.currentframe().f_back, limit=5)
  arr=traceback.format_list(res)
  strT='\n'.join(arr)
  return strT+'\n'+strErr


class MyConsole:
  def __init__(self): pass
  def clear(self): pass  
  def save(self): print(ANSI_CURSOR_SAVE, end=''); return self
  def restore(self): print(ANSI_CURSOR_RESTORE, end=''); return self
  def clearBelow(self): print(ANSI_CLEAR_BELOW, end=''); return self
  def cursorUpN(self,n): print("\033["+str(n)+"A", end='');  return self
  def cursorUp(self): self.cursorUpN(1);  return self

  def makeSpaceNSave(self):print("\n\n"+ANSI_CURSOR_UP(2)+ANSI_CURSOR_SAVE, end='');  return self
  def myReset(self):print(ANSI_CURSOR_RESTORE+ANSI_CLEAR_BELOW, end=''); return self
  #def setCur(self):  return self   #place_info() text.see(END)
  def print(self, str): print(str, end=''); return self
  #def printNL(self, str): self.print(str+'\n'); return self
  def printNL(self, str): print(str); return self
  def log(self, str):print(str); return self
  def error(self, str): 
    if(isinstance(str, Error)):  str=str.message
    elif(type(str)=='dict' and 'message' in str): str=str.message
    #self.print("ERROR: "+str)
    print("ERROR: "+str)
    return self
  

def myMD5(strFileName):
  strhash=subprocess.check_output(['md5sum', strFileName])
  return strhash.split(None, 1)[0]

import hashlib

def md5(fname):
  with open(fname, "rb") as f:
    digest = hashlib.file_digest(f, "md5")
  return digest.hexdigest()

def myMD5W(objEntry, fsDir):
  strName=objEntry["strName"]; strType=objEntry["strType"]
  strFileName=fsDir+charF+strName
  if(sys.platform=="linux"):
    if(strType=='l'):
      #arrCmd=['realpath', '--relative-to', fsDir, strFileName]
      arrCmd=['readlink', strFileName]
      strData=subprocess.check_output(arrCmd)
      strData=strData.split(None, 1)[0].decode("utf-8")
      strhash=hashlib.md5(strData.encode('utf-8')).hexdigest()
    else: 
      #strhash=subprocess.check_output(['md5sum', strFileName])
      #strhash=strhash.split(None, 1)[0].decode("utf-8")
      strhash=md5(strFileName)
  elif(sys.platform=="win32"):
    if(objEntry["size"]==0): return 'd41d8cd98f00b204e9800998ecf8427e';  # CertUtil doesn't seam to handle empty files
    strhash=subprocess.check_output(['CertUtil', '-hashfile', strFileName, 'MD5'])
    strhash=strhash.decode("utf-8").split('\r\n')[1]
  else: return ['unhandled OS']
  
  return strhash


#######################################################################################
# parseSSV   Parse "space separated data"
#######################################################################################
  #   The header (first line) determines the number of columns. (Header-fields may not contain spaces)
  #   The remaining rows are expected to have at least as many space-separations as the first line.
  #   Last column contains all remaining data of the row (so it may contain spaces (but not newlines))
def parseSSV(fsDBFile):  
  try: fi=open(fsDBFile,'r')
  except FileNotFoundError as e:
    return {"e":e, "strTrace":myErrorStack(e.strerror)}, None    #"strErr":e.strerror, 
  strData=fi.read(); fi.close()
  arrOut=[]
  arrInp=strData.split('\n')

  nData=len(arrInp)
  if(nData<=1): return None,  []

  strHead=arrInp[0].strip()
  arrHead=strHead.split(None)
  nHead=len(arrHead)
  nSplit=nHead-1

  for strRow in arrInp[1:]:
    strRow=strRow.strip()
    if(len(strRow)==0): continue
    if(strRow.startswith('#')): continue
    arrPart=strRow.split(None, nSplit)
    obj={}
    #for i, strHead in enumerate(arrHead): obj[strHead]=arrPart[i]
    for strHead, part in zip(arrHead, arrPart): obj[strHead]=part
    arrOut.append(obj)
  
  return None, arrOut

#def pluralS(n): return "" if(n==1) else "s"
def pluralS(n,s="",p="s"): return s if(n==1) else p

#######################################################################################
# formatScalars
#######################################################################################

def roundMTime(t, charTRes):
  # if(charTRes=='d'): div=2000000000
  # else: n=int(charTRes); div=10**(9-n)
  div=settings.IntTDiv[charTRes]
  tCalc=(t//div)
  tRound=tCalc*div
  return tRound, tCalc


#######################################################################################
# formatColumnData
#######################################################################################
def createFormatInfo(Key, objType={}):
  for key in Key:
    if(key[:2]=='bo' and key[2].isupper()): strType='boolean'
    elif(key[:3]=='int' and key[3].isupper()): strType='number'
    elif(key[0]=='n' and key[1].isupper()): strType='number'
    elif(key[0]=='t' and key[1].isupper()): strType='number'
    else: strType='string'
    objType[key]=strType
  return objType

def formatColumnData(arrData, objType):
  for iRow, row in enumerate(arrData):
    for key, val in row.items():
      if(key not in objType): pass
      elif(objType[key]=='boolean'): val=val.lower()=='true'
      elif(objType[key]=='number'): val=int(val)
      row[key]=val
# objType=createFormatInfo([*arrDB[0]]);   objType.update({"size":"number", "ino":"number", "mtime":"number", "inode0":"number"})



def calcFileNameWithCounter(filename):  # Example calcFileNameWithCounter("file{}.pdf")
  counter = 0
  #filename = "file{}.pdf"
  ind=filename.find('.')
  filenameProt=mySplice(filename, "{}", ind)
  while os.path.isfile(filenameProt.format(counter)):
    counter += 1
  filenameN = filenameProt.format(counter)
  return filenameN

def mySplice(source_str, insert_str, pos):
  return source_str[:pos]+insert_str+source_str[pos:]



def formatTDiff(tDiff):
  boPos=True if(tDiff>0) else False
  tDiffAbs=abs(tDiff)
  tDay=math.floor(tDiffAbs/86400)
  ttmp=tDiffAbs%86400         # number of seconds into current day
  tHour=math.floor(ttmp/3600) # number of hours into current day
  #
  ttmp=ttmp%3600              # number of seconds into current hour
  tMin=math.floor(ttmp/60)    # number of minutes into current hour
  #
  ttmp=ttmp%60                # number of seconds into current minute (float)
  tSec=math.floor(ttmp)       # number of seconds into current minute (int)
  #
  ttmp=ttmp%1                 # number of seconds into current second (0<=ttmp<1)
  tFrac=ttmp
  ttmp=ttmp*1000              # number of ms into current second (float)
  tms=math.floor(ttmp)        # number of ms into current second (int)
  #
  ttmp=ttmp%1                 # number of ms into current ms (0<=ttmp<1)
  ttmp=ttmp*1000              # number of us into current ms (float)
  tus=math.floor(ttmp)        # number of us into current us (int)
  #
  ttmp=ttmp%1                 # number of us into current us (0<=ttmp<1)
  ttmp=ttmp*1000              # number of ns into current us (float)
  #tns=math.floor(ttmp)        # number of ns into current us (int)
  tns=ttmp
  #
  return tDay,tHour,tMin,tSec,tms,tus,tns
  #return tDay,tHour,tMin,tSec,tFrac


def getSuitableTimeUnit(t): # t in seconds
  tAbs=abs(t); tSign=+1 if(t>=0) else -1
  if(tAbs<=120): return tSign*tAbs, 's'
  tAbs/=60; # t in minutes
  if(tAbs<=120): return tSign*tAbs, 'm'
  tAbs/=60; # t in hours
  if(tAbs<=48): return tSign*tAbs, 'h'
  tAbs/=24; # t in days
  if(tAbs<=2*365): return tSign*tAbs, 'd'
  tAbs/=365; # t in years
  return tSign*tAbs, 'y'

