const fs = require('fs');

// Patch Modals.ts
let modalsFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let modalsContent = fs.readFileSync(modalsFile, 'utf8');

modalsContent = modalsContent.replace(
  /constructor\(app: App, plugin: any, projectId: string\) \{/,
  "constructor(app: App, plugin: any, projectId: string, public onCloseCallback?: () => void) {"
);

modalsContent = modalsContent.replace(
  /onClose\(\) \{\s*const \{ contentEl \} = this;\s*contentEl\.empty\(\);\s*\}/,
  "onClose() {\n    const { contentEl } = this;\n    contentEl.empty();\n    if (this.onCloseCallback) this.onCloseCallback();\n  }"
);

fs.writeFileSync(modalsFile, modalsContent);
console.log('Patched Modals.ts');

// Patch ProjectsView.svelte
let pvFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let pvContent = fs.readFileSync(pvFile, 'utf8');

pvContent = pvContent.replace(
  /let showArchived = false;/,
  "let showArchived = false;\n  let settingsVersion = 0;"
);

pvContent = pvContent.replace(
  /new ProjectSchemaModal\(app, plugin, selectedProjectId\)\.open\(\);/,
  "new ProjectSchemaModal(app, plugin, selectedProjectId, () => { settingsVersion++; }).open();"
);

pvContent = pvContent.replace(
  /<ProjectTaskBoard /g,
  "{#key settingsVersion}\n        <ProjectTaskBoard "
);

pvContent = pvContent.replace(
  /projectTasks=\{projectTasks\} \/>/g,
  "projectTasks={projectTasks} />\n        {/key}"
);

fs.writeFileSync(pvFile, pvContent);
console.log('Patched ProjectsView.svelte');

