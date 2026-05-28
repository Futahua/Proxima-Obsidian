const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

const target1 = `if (this.plugin && this.plugin.settings && this.plugin.settings.taskSchema) {
      this.plugin.settings.taskSchema.forEach(schema => {`;

const target1New = `const activeSchema = (task.project && this.plugin.settings.projectSchemas) ? (this.plugin.settings.projectSchemas[task.project] || []) : [];
    if (activeSchema.length > 0) {
      activeSchema.forEach(schema => {`;

content = content.replace(target1, target1New);

fs.writeFileSync(file, content);
console.log('Patched Modals.ts for project schemas');
