const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

const targetFunc = `  function createPlannedTask(statusId: string) {
    new NewTaskModal(app, fileManager, projectId, statusId).open();
  }`;

const replaceFunc = `  function createPlannedTask(statusId: string) {
    new NewTaskModal(app, async (name) => {
      let pid = projectId;
      if (pid === '-- All Projects --') pid = '';
      await fileManager.createTask(name, pid, { status: statusId });
    }).open();
  }`;

content = content.replace(targetFunc, replaceFunc);
fs.writeFileSync(file, content);
console.log('Fixed NewTaskModal invocation');
