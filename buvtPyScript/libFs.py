
import sys
import os

def checkPathFormat(arr):
  boFWDSlash=False
  for row in arr:
    if('/' in row["strName"]): boFWDSlash=True; break
  if(boFWDSlash): return 'linux'
  return 'win32'


def myRealPathf(fiPath):
  if(sys.platform=="win32"): flPath=os.path.expandvars(fiPath)
  else: flPath=fiPath
  fsPath=os.path.expanduser(flPath)
  return fsPath
