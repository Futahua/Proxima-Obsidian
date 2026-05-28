const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

// I need to properly close the key block
content = content.replace(
  /\{#key settingsVersion\}\s*<ProjectTaskBoard\s*\{app\}\s*\{fileManager\}\s*projectId=\{selectedProject\.id\}\s*\{projectTasks\}\s*\/>/g,
  "{#key settingsVersion}\n            <ProjectTaskBoard \n              {app} \n              {fileManager} \n              projectId={selectedProject.id} \n              {projectTasks} \n            />\n          {/key}"
);
// Also remove any stray {/key}
content = content.replace(
  /\/>\s*\{\/key\}\s*\{:else\}/g,
  "/>\n          {/key}\n          {:else}"
);

// Wait, the regex was:
// projectTasks={projectTasks} />\n        {/key}
content = content.replace(/\{projectTasks\} \/>\s*\{\/key\}\s*\{:else\}/g, "{projectTasks} />\n          {/key}\n          {:else}");

fs.writeFileSync(file, content);
console.log("Fixed key block");
