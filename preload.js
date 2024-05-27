const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  argv: () => process.argv
  // we can also expose variables, not just functions
})
contextBridge.exposeInMainWorld('myBridge', {
  readFile: (...args) => ipcRenderer.invoke('readFile', ...args),
  argv: () => process.argv
  //argv: process.argv
  // we can also expose variables, not just functions
})
console.log('preload')