const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/styles.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\n\.overdue \{/g, '\n.pos-dl-gantt-bar.overdue {');
content = content.replace(/\n\.critical \{/g, '\n.pos-dl-gantt-bar.critical {');
content = content.replace(/\n\.warning \{/g, '\n.pos-dl-gantt-bar.warning {');
content = content.replace(/\n\.caution \{/g, '\n.pos-dl-gantt-bar.caution {');
content = content.replace(/\n\.safe \{/g, '\n.pos-dl-gantt-bar.safe {');

fs.writeFileSync(file, content);
console.log('styles.css urgency classes patched');
