const fs = require('fs');

function patchVisibility(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  const targetOld = `(fileManager.plugin.settings.projectSchemas[selectedProjectId] || []).forEach(schema => {`;
  
  const targetNew = `const visibleIds = fileManager.plugin.settings.projectVisibleProps[selectedProjectId] || [];
      (fileManager.plugin.settings.projectSchemas[selectedProjectId] || []).forEach(schema => {
        if (!visibleIds.includes(schema.id)) return;`;
        
  content = content.replace(targetOld, targetNew);
  
  fs.writeFileSync(file, content);
  console.log(`Patched visibility in ${file}`);
}

patchVisibility('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte');
patchVisibility('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte');
