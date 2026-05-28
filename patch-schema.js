const fs = require('fs');

// PATCH types.ts
let typesFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/types.ts';
let typesContent = fs.readFileSync(typesFile, 'utf8');

const filterInterface = `
export interface FilterRule {
  id: string;
  property: string;
  operator: 'is' | 'is-not' | 'contains' | 'not-contains' | 'gt' | 'lt' | 'is-empty' | 'not-empty';
  value: any;
}
`;

if (!typesContent.includes('export interface FilterRule')) {
  typesContent += filterInterface;
  fs.writeFileSync(typesFile, typesContent);
}

// PATCH settings.ts
let settingsFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');

if (!settingsContent.includes('FilterRule } from')) {
  settingsContent = settingsContent.replace(/ColorRule \} from '\.\/types';/, `ColorRule, FilterRule } from './types';`);
}

if (!settingsContent.includes('projectFilters: Record<string, FilterRule[]>')) {
  settingsContent = settingsContent.replace(/taskSchema: PropertySchema\[\];\n\}/, `taskSchema: PropertySchema[];\n  projectFilters: Record<string, FilterRule[]>;\n}`);
}

if (!settingsContent.includes('projectFilters: {}')) {
  settingsContent = settingsContent.replace(/taskSchema: \[\n/, `projectFilters: {},\n  taskSchema: [\n`);
}

fs.writeFileSync(settingsFile, settingsContent);
console.log('Added FilterRule schema to types and settings');
