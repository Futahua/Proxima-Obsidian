const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/main.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `          if (this.settings.taskSchema && this.settings.taskSchema.length > 0) {`;

const migration = `          // Status Migration
          if (this.settings.statuses && this.settings.statuses.length > 0) {
            const projects = get(projectsStore);
            if (!this.settings.globalStatuses) this.settings.globalStatuses = {};
            if (!this.settings.projectStatuses) this.settings.projectStatuses = {};
            
            // Extract the global overrides if any
            const coreIds = ['backlog', 'running', 'review'];
            for (const s of this.settings.statuses) {
               if (coreIds.includes(s.id)) {
                 this.settings.globalStatuses[s.id] = s;
               }
            }
            
            // Extract the custom ones and copy to all projects as legacy
            const custom = this.settings.statuses.filter(s => !coreIds.includes(s.id));
            if (custom.length > 0) {
              for (const p of projects) {
                 if (!this.settings.projectStatuses[p.id]) {
                   this.settings.projectStatuses[p.id] = JSON.parse(JSON.stringify(custom));
                 }
              }
            }
            
            delete this.settings.statuses;
            await this.saveSettings();
          }

          if (this.settings.taskSchema && this.settings.taskSchema.length > 0) {`;

content = content.replace(target, migration);
fs.writeFileSync(file, content);
console.log("Patched main.ts migration");
