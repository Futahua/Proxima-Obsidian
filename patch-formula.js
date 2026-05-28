const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { Parser }")) {
  content = content.replace("import { Notice, TFile, TFolder }", "import { Notice, TFile, TFolder } from 'obsidian';\nimport { Parser } from 'expr-eval'");
}

const oldLogic = `const prop = (propName: string) => {
                          const s = this.plugin.settings.taskSchema.find(x => x.name === propName);
                          return s ? props[s.id] : undefined;
                       };
                       const evaluator = new Function('prop', \`return \\${schema.expression}\`);
                       props[schema.id] = evaluator(prop);`;

const newLogic = `const scope: Record<string, any> = {};
                       for (const s of this.plugin.settings.taskSchema) {
                         if (s.name && props[s.id] !== undefined) {
                           scope[s.name] = props[s.id];
                         }
                       }
                       props[schema.id] = Parser.evaluate(schema.expression || '', scope);`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content);
console.log('FileManager.ts formula logic updated');
