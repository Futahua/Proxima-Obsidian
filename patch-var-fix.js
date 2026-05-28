const fs = require('fs');

function fixVar(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/selectedProjectId/g, "projectId");
  fs.writeFileSync(file, content);
  console.log(`Fixed variable name in ${file}`);
}

fixVar('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte');
fixVar('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte');
