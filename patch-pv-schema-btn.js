const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

const importOld = `import { projectsStore, tasksStore } from '../../stores/data';`;
const importNew = `import { projectsStore, tasksStore } from '../../stores/data';\n  import { ProjectSchemaModal } from '../../modals/Modals';`;
content = content.replace(importOld, importNew);

const btnOld = `<div style="width: 40px;"></div>`;
const btnNew = `<div class="pos-editor-header-right" style="padding-right: 20px;">
        <button class="pos-ptc-start-btn" on:click={() => {
          new ProjectSchemaModal(app, plugin, selectedProjectId).open();
        }}>? Properties</button>
      </div>`;
content = content.replace(btnOld, btnNew);

fs.writeFileSync(file, content);
console.log('Added Edit Properties button to ProjectsView');
