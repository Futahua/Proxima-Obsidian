const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

// For QuickEditTaskModal
const targetEditOld = `if (this.plugin && this.plugin.settings && this.plugin.settings.taskSchema) {
      this.plugin.settings.taskSchema.forEach(schema => {`;

const targetEditNew = `const activeSchema = (this.task.project && this.plugin.settings.projectSchemas) ? (this.plugin.settings.projectSchemas[this.task.project] || []) : [];
    if (activeSchema.length > 0) {
      activeSchema.forEach(schema => {`;

content = content.replace(targetEditOld, targetEditNew);

// What about TaskModal.ts? I think TaskModal is deprecated or Modals.ts contains it.
// Oh wait, QuickEditTaskModal IS in Modals.ts, but let's check if there are other occurrences of taskSchema.
content = content.replace(/this\.plugin\.settings\.taskSchema/g, 'activeSchema');

fs.writeFileSync(file, content);
console.log('Patched Modals.ts for QuickEditTaskModal');
