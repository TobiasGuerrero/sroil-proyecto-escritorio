const log = require('electron-log')
const { contextBridge, ipcRenderer } = require('electron')

log.info('----- Preload script -----')

contextBridge.exposeInMainWorld('electronAPI', {
  openURL: (url) => ipcRenderer.send('open-url', url),
  restartApp: () => ipcRenderer.send('restart-app'),
  savePDF: (pdfData) => ipcRenderer.invoke('save-pdf', pdfData)
})

ipcRenderer.on('update-downloaded', (event) => {
  console.log('Update downloaded!')
})
