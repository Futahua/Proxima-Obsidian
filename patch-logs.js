const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Add console logs to drag and click handlers
content = content.replace(
  /function handleDragStart\(e: DragEvent, id: string\) \{/g,
  "function handleDragStart(e: DragEvent, id: string) {\n    console.log('Drag started:', id);"
);

content = content.replace(
  /async function handleDrop\(e: DragEvent, status: string\) \{/g,
  "async function handleDrop(e: DragEvent, status: string) {\n    console.log('Dropped on status:', status);"
);

content = content.replace(
  /function createPlannedTask\(statusId: string\) \{/g,
  "function createPlannedTask(statusId: string) {\n    console.log('Creating task in status:', statusId);"
);

content = content.replace(
  /function editTask\(task: TaskData\) \{/g,
  "function editTask(task: TaskData) {\n    console.log('Editing task:', task.id);"
);

fs.writeFileSync(file, content);
console.log('Added console logs');
