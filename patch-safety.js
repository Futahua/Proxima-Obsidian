const fs = require('fs');

function safePatch(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Safe projectSchemas
  content = content.replace(/fileManager\.plugin\.settings\.projectSchemas\[selectedProjectId\]/g, "(fileManager.plugin.settings.projectSchemas || {})[selectedProjectId]");
  content = content.replace(/plugin\.settings\.projectSchemas\[selectedProjectId\]/g, "(plugin.settings.projectSchemas || {})[selectedProjectId]");
  
  // Safe projectVisibleProps
  content = content.replace(/fileManager\.plugin\.settings\.projectVisibleProps\[selectedProjectId\]/g, "(fileManager.plugin.settings.projectVisibleProps || {})[selectedProjectId]");
  content = content.replace(/plugin\.settings\.projectVisibleProps\[selectedProjectId\]/g, "(plugin.settings.projectVisibleProps || {})[selectedProjectId]");

  fs.writeFileSync(file, content);
  console.log(`Patched safety in ${file}`);
}

safePatch('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte');
safePatch('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte');
safePatch('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts');
safePatch('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts');
