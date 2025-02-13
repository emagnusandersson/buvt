const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  argv: () => process.argv
  // we can also expose variables, not just functions
})
contextBridge.exposeInMainWorld('myBridge', {
  readFile: (...arg) => ipcRenderer.invoke('readFile', ...arg),
  argv: () => process.argv
  //argv: process.argv
  // we can also expose variables, not just functions
})
console.log('preload')