const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import { DropdownComponent } from 'obsidian';/g, "import { DropdownComponent, ButtonComponent, TextComponent } from 'obsidian';");

fs.writeFileSync(file, content);
console.log('Fixed Modals.ts imports');
