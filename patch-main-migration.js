const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/main.ts';
let content = fs.readFileSync(file, 'utf8');

const onReadyOld = `      this.app.workspace.onLayoutReady(async () => {
        try {
          await this.fileManager.initialize();
          console.log("Proxima: data initialized successfully!");
        } catch (e) {`;

const onReadyNew = `      this.app.workspace.onLayoutReady(async () => {
        try {
          await this.fileManager.initialize();
          console.log("Proxima: data initialized successfully!");
          
          // Schema Migration
          let didMigrate = false;
          if (this.settings.taskSchema && this.settings.taskSchema.length > 0) {
            const projects = get(projectsStore);
            if (!this.settings.projectSchemas) this.settings.projectSchemas = {};
            if (!this.settings.projectVisibleProps) this.settings.projectVisibleProps = {};
            
            for (const p of projects) {
               if (!this.settings.projectSchemas[p.id]) {
                 this.settings.projectSchemas[p.id] = JSON.parse(JSON.stringify(this.settings.taskSchema));
                 this.settings.projectVisibleProps[p.id] = this.settings.taskSchema.map(s => s.id);
                 didMigrate = true;
               }
            }
            if (didMigrate) {
               delete this.settings.taskSchema;
               await this.saveSettings();
            }
          }
          
        } catch (e) {`;

content = content.replace(onReadyOld, onReadyNew);

fs.writeFileSync(file, content);
console.log('Patched main.ts with migration logic');
