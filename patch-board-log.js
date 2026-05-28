const fs = require('fs');

let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('console.log("PROJECT TASKS UPDATED:", projectTasks)')) {
  content = content.replace(
    /export let projectTasks: TaskData\[\];/,
    "export let projectTasks: TaskData[];\n  $: console.log('PROJECT TASKS UPDATED:', projectTasks.length, 'columns:', columns.length);"
  );
  fs.writeFileSync(file, content);
  console.log('Added projectTasks logger');
}
