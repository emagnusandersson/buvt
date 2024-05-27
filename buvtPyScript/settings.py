
boIncludeLinks=True
leafFilter=".buvt-filter"

KeyTRes=[None] * 10; IntTDiv={}   
for i in range(0,10):
  strI=str(i)
  KeyTRes[i]=strI
  IntTDiv[strI]=10**(9-i)
KeyTRes.append('d'); IntTDiv['d']=2e9
charTRes='9'