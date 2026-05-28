const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `async updateTask(id: string, updates: Partial<TaskData>): Promise<void> {`;
const insert = `async deleteTask(id: string): Promise<void> {
      const notePath = \`tasks/\${id}.md\`;
      const file = this.app.vault.getAbstractFileByPath(notePath);
      if (file instanceof TFile) {
         await this.app.vault.delete(file);
      }
      this.tasksCache = this.tasksCache.filter(t => t.id !== id);
      tasksStore.set([...this.tasksCache]);
   }

   `;

content = content.replace(target, insert + target);
fs.writeFileSync(file, content);
console.log('Added deleteTask');
