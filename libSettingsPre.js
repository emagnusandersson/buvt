
globalThis.gThis=globalThis;
gThis.strOS=process.platform
gThis.charF=strOS=='win32'?'\\':'/';

gThis.getDataHome=async function(){ // dataHome: the location reserved for the app/program to store memory
  let envs=process.env;
  var fsDataHome=""
  if('APPDATA' in envs) {
    fsDataHome=envs['APPDATA']+charF+appname
    return fsDataHome;
  }
  if('HOME' in envs) {
    let fsHome = envs['HOME']
    //if(strOS=='darwin') fsDataHome=fsHome+ '/Library/Preferences/'+appname;
    if(strOS=='darwin') fsDataHome=fsHome+ '/Library/Application Support/'+appname;
    else if(strOS=='linux') fsDataHome=fsHome+ '/.local/share/'+appname
    return fsDataHome
  }

  return null
}  