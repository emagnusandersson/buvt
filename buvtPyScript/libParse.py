

import globvar
from lib import *
from libFs import *


class KeyST:
  def __init__(self, size, tCalc):
    self.size=size
    self.tCalc=tCalc
    self.ind=0 # Used to figure out how index changes order after sorting
  def __eq__(self, other):
    #boString = isinstance(other, str)
    if(isinstance(other, KeyST)):
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


def parseDb(fsDb, charTRes):
  err, arrDB=parseSSV(fsDb)
  if(err):  return err, None
  nData=len(arrDB)
  if(nData==0):  return None, arrDB
    # Cast some properties 
  formatColumnData(arrDB, {"size":"number", "id":"number", "inode":"number", "ino":"number"})

  strOSTypeMeta=checkPathFormat(arrDB)
  if(strOSTypeMeta=='linux' and sys.platform=='win32'):
    for obj in arrDB: obj["strName"]=obj["strName"].replace('/','\\')
  elif(strOSTypeMeta=='win32' and sys.platform=='linux'):
    #globvar.myConsole.error("strOSTypeMeta=='win32' and sys.platform=='linux'")
    for obj in arrDB: obj["strName"]=obj["strName"].replace('\\','/')

    # Rename inode to ino
  if('inode' in arrDB[0]):
    for obj in arrDB: obj["ino"]=obj.pop("inode")
    # Rename id to ino
  if('id' in arrDB[0]):
    for obj in arrDB: obj["ino"]=obj.pop("id")
  
    # If any mtime is longer than 10 char, then assume ns
  boNs=False
  for obj in arrDB:
    if(len(obj["mtime"])>10): boNs=True; break
  if(boNs):
    for obj in arrDB:
      obj["mtime_ns64"]=int(obj["mtime"])
      #obj["mtime"]=int(obj["mtime"][:-9])
  else:
    for obj in arrDB:
      mtimeS=int(obj["mtime"])
      #obj["mtime"]=mtimeS
      obj["mtime_ns64"]=mtimeS*1e9

    # Create st
  for obj in arrDB:
    mtime_ns64Round, tCalc=roundMTime(obj["mtime_ns64"], charTRes)
    obj["mtime_ns64Round"]=mtime_ns64Round
    obj["st"]=KeyST(obj["size"], tCalc)
  return None, arrDB


