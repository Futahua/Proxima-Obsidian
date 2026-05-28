const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/AgingView.svelte';
let content = fs.readFileSync(file, 'utf8');

const oldHandle = `  function handleSelectProject(id: string) {
    if (isFullPage) {
      onSelect(id, 'elastic');
    } else {
      plugin.activateWorkspaceView(id);
    }
  }`;

const newHandle = `  function handleSelectProject(id: string) {
    const pFile = fileManager.getProjectNoteFile(id);
    if (pFile) {
      app.workspace.getLeaf('tab').openFile(pFile);
    } else {
      new Notice('Project note not found');
    }
  }`;

content = content.replace(oldHandle, newHandle);
content = content.replace(`import { Notice, TFile } from 'obsidian';`, `import { Notice, TFile } from 'obsidian';`); // ensure Notice is imported

fs.writeFileSync(file, content);
console.log('Patched AgingView to open native note');
