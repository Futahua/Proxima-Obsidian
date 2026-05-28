const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace references to taskSchema
  content = content.replace(/fileManager\.plugin\.settings\.taskSchema/g, "(fileManager.plugin.settings.projectSchemas[selectedProjectId] || [])");
  // Some places might just use plugin.settings.taskSchema depending on binding
  content = content.replace(/plugin\.settings\.taskSchema/g, "(plugin.settings.projectSchemas[selectedProjectId] || [])");
  
  fs.writeFileSync(file, content);
  console.log(`Patched ${file}`);
}

patchFile('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte');
patchFile('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte');
