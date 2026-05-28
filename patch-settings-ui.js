const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let content = fs.readFileSync(file, 'utf8');

// The section starts at: containerEl.createEl('h3', { text: 'Database Properties' });
// And ends at the end of renderSchema(); before Color Rules.
// I'll use a regex to strip it.
const regex = /containerEl\.createEl\('h3', \{ text: 'Database Properties' \}\);[\s\S]*?renderSchema\(\);\n\n/g;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Stripped Database Properties editor from settings.ts');
