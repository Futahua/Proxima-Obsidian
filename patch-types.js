const fs = require('fs');

// Patch types.ts
let typesFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/types.ts';
let typesContent = fs.readFileSync(typesFile, 'utf8');

typesContent = typesContent.replace(/export type TaskStatus = 'planned' \| 'backlog' \| 'running' \| 'review';/, "export type TaskStatus = string;");

typesContent = typesContent.replace(/statuses: \{ id: string, name: string, color\?: string \}\[\];/, 
`statuses?: { id: string, name: string, color?: string }[];
  globalStatuses: Record<string, { id: string, name: string, color?: string }>;
  projectStatuses: Record<string, { id: string, name: string, color?: string }[]>;`);

fs.writeFileSync(typesFile, typesContent);
console.log("Patched types.ts");

// Patch settings.ts (Remove UI sections, update DEFAULT_SETTINGS)
let settingsFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');

const defaultTarget = `  statuses: [],`;
const defaultReplacement = `  globalStatuses: {},
  projectStatuses: {},`;
settingsContent = settingsContent.replace(defaultTarget, defaultReplacement);

const uiRemoveTarget = /const statusHeader = containerEl\.createEl\('h3', \{ text: 'Kanban Statuses' \}\);[\s\S]*?renderSchema\(\);\s*\}\s*$/m;
settingsContent = settingsContent.replace(uiRemoveTarget, "    }");

fs.writeFileSync(settingsFile, settingsContent);
console.log("Patched settings.ts");
