const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('debug.log')) {
  content = content.replace(
    /async function handleDrop\(e: DragEvent, status: string\) \{/,
    "async function handleDrop(e: DragEvent, status: string) {\n      require('fs').appendFileSync('c:/Users/admin/proxima-debug.log', `[handleDrop] status=${status} dragId=${dragId}\\n`);"
  );
  content = content.replace(
    /function createPlannedTask\(statusId: string\) \{/,
    "function createPlannedTask(statusId: string) {\n    require('fs').appendFileSync('c:/Users/admin/proxima-debug.log', `[createPlannedTask] status=${statusId}\\n`);"
  );
  content = content.replace(
    /await fileManager\.createTask\(\{ name, project: pid, status: statusId \}\);/,
    "await fileManager.createTask({ name, project: pid, status: statusId });\n        require('fs').appendFileSync('c:/Users/admin/proxima-debug.log', `[createPlannedTask] SUCCESS name=${name}\\n`);"
  );
  fs.writeFileSync(file, content);
  console.log('Added diagnostic loggers');
}
