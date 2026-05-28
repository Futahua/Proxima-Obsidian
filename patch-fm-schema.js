const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

const target1 = `if (this.plugin && this.plugin.settings && this.plugin.settings.taskSchema) {
            // First pass: basic properties and rollups
            for (const schema of this.plugin.settings.taskSchema) {`;

const target1New = `const activeSchema = (fm.project && this.plugin?.settings?.projectSchemas) ? (this.plugin.settings.projectSchemas[fm.project] || []) : [];
          if (activeSchema.length > 0) {
            // First pass: basic properties and rollups
            for (const schema of activeSchema) {`;
content = content.replace(target1, target1New);

// Replace all subsequent 'this.plugin.settings.taskSchema' within the closure with 'activeSchema'
const oldContent = content;
content = content.replace(/this\.plugin\.settings\.taskSchema/g, 'activeSchema');

// Make sure we didn't replace it in places where it shouldn't be (though in FileManager it's only in this loadAll block)
fs.writeFileSync(file, content);
console.log('Patched FileManager.ts for project schemas');
