const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/style="width: \{progress \* 100\}%; background: \{getRuleColor\(task, diff\)\};" style="width: \{progress \* 100\}%;"/g, 'style="width: {progress * 100}%; background: {getRuleColor(task, diff)};"');

// also let's check Gantt bar for duplicate style
content = content.replace(/style="background: \{getRuleColor\(task, diffMs\)\}; border-color: \{getRuleColor\(task, diffMs\)\}; left: \{draggingTaskId === task\.id \? tempDragLeft : pos\.leftPx\}px; width: \{draggingTaskId === task\.id \? tempDragWidth : pos\.widthPx\}px;"\s*style=".*?"/g, 'style="background: {getRuleColor(task, diffMs)}; border-color: {getRuleColor(task, diffMs)}; left: {draggingTaskId === task.id ? tempDragLeft : pos.leftPx}px; width: {draggingTaskId === task.id ? tempDragWidth : pos.widthPx}px;"');

fs.writeFileSync(file, content);
console.log('Fixed duplicate style tags');
