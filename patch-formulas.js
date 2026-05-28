const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject prop() function into Formula evaluation scope
const oldScope = `                    const scope: Record<string, any> = {};
                    for (const s of this.plugin.settings.taskSchema) {
                      if (s.name && props[s.id] !== undefined) {
                        scope[s.name] = props[s.id];
                      }
                    }`;
const newScope = `                    const scope: Record<string, any> = {
                      prop: (name: string) => {
                        const s = this.plugin.settings.taskSchema.find(x => x.name === name || x.id === name);
                        return s ? props[s.id] : undefined;
                      }
                    };
                    // Also spread properties directly for backwards compatibility
                    for (const s of this.plugin.settings.taskSchema) {
                      if (s.name && props[s.id] !== undefined) {
                        scope[s.name] = props[s.id];
                      }
                    }`;
content = content.replace(oldScope, newScope);

fs.writeFileSync(file, content);
console.log('Patched FileManager.ts formula scope');
