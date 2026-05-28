const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/style="background: \{getRuleColor\(pt\.task, pt\.diffMs\)\}; border-color: \{getRuleColor\(pt\.task, pt\.diffMs\)\};"([\s\S]*?)style="left: \{pt\.leftPct\}%; width: \{pt\.widthPct\}%; top: \{pt\.row \* 28 \+ 4\}px;"/g, '$1style="background: {getRuleColor(pt.task, pt.diffMs)}; border-color: {getRuleColor(pt.task, pt.diffMs)}; left: {pt.leftPct}%; width: {pt.widthPct}%; top: {pt.row * 28 + 4}px;"');

// Now let's check the other duplicate attributes `task` and `tags`
// "Duplicate attribute found: task in tag <div> at index 28543"
content = content.replace(/<div\s+([^>]*?)(task="[^"]*")([^>]*?)(task="[^"]*")/g, '<div $1$2$3');
content = content.replace(/<div\s+([^>]*?)(tags="[^"]*")([^>]*?)(tags="[^"]*")/g, '<div $1$2$3');

fs.writeFileSync(file, content);
console.log('Fixed duplicate attributes');
