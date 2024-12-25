// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {ipcRenderer, contextBridge} from "electron";

// Declare types globally
declare global {
  interface Window { 
    electronAPI: typeof electronAPI
  }
}

export interface WriteToUpcFileProps {
  csvLines: string[];
  filename: string;
}

export interface OnWriteToUpcFileResult {
  data: any;
  err?: any;
}

const electronAPI = {
  writeToUpcFile: (props: WriteToUpcFileProps) => ipcRenderer.send('writeToUpcFile', props),
  onWriteToUpcFile: (callback: (event: any, values: OnWriteToUpcFileResult) => void) => 
    ipcRenderer.on('writeToUpcFileResult', (event, result) => callback(event, result)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI);