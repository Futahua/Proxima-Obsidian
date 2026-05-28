const fs = require('fs');

// Update types.ts
const typesFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/types.ts';
let typesContent = fs.readFileSync(typesFile, 'utf8');

if (!typesContent.includes('ColorRule')) {
  typesContent += `
export interface ColorRule {
  id: string;
  targetDate: 'deadline' | 'createdAt';
  condition: 'is relative to today';
  value: 'overdue' | 'today' | 'next 2 days' | 'next 3 days' | 'next week' | 'next month';
  color: string;
}
`;
  fs.writeFileSync(typesFile, typesContent);
}

// Update settings.ts
const settingsFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');

if (!settingsContent.includes('colorRules: ColorRule[]')) {
  settingsContent = settingsContent.replace(/import type \{ PropertySchema, PropertyType, SelectOption \} from '\.\/types';/, "import type { PropertySchema, PropertyType, SelectOption, ColorRule } from './types';");
  settingsContent = settingsContent.replace(/statuses: SelectOption\[\];/, "statuses: SelectOption[];\n  colorRules: ColorRule[];");
  
  const defaultRules = `colorRules: [
    { id: '1', targetDate: 'deadline', condition: 'is relative to today', value: 'overdue', color: '#E5484D' },
    { id: '2', targetDate: 'deadline', condition: 'is relative to today', value: 'today', color: '#FFB224' },
    { id: '3', targetDate: 'deadline', condition: 'is relative to today', value: 'next 3 days', color: '#FFD60A' },
    { id: '4', targetDate: 'deadline', condition: 'is relative to today', value: 'next week', color: '#A7C957' }
  ],`;
  
  settingsContent = settingsContent.replace(/statuses: \[\n[\s\S]*?\n  \],/, `$& \n  ${defaultRules}`);
  fs.writeFileSync(settingsFile, settingsContent);
}

console.log('types.ts and settings.ts updated with ColorRule');
