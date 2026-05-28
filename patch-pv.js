const fs = require('fs');

const pv = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
if(fs.existsSync(pv)){
  let c = fs.readFileSync(pv, 'utf8');
  c = c.replace(
    /\{\@const projectTasks = \$tasksStore\.filter\(t => t\.project === selectedProject\.id\)/g,
    "{@const projectTasks = $tasksStore.filter(t => t.project === selectedProject.id && selectedProject.status !== 'archived')"
  );
  fs.writeFileSync(pv, c);
  console.log('ProjectsView updated');
} else {
  console.log('ProjectsView not found');
}
