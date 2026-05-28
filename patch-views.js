const fs = require('fs');

const elastic = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ElasticView.svelte';
let c = fs.readFileSync(elastic, 'utf8');
c = c.replace(/import \{ tasksStore, getProjectTasks \} from '\.\.\/\.\.\/stores\/data';/, "import { tasksStore, projectsStore, getProjectTasks } from '../../stores/data';");
c = c.replace(/getProjectTasks\(\$tasksStore, projectId\)/g, "getProjectTasks($tasksStore, projectId, $projectsStore)");
fs.writeFileSync(elastic, c);

const deadlines = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte';
let d = fs.readFileSync(deadlines, 'utf8');
d = d.replace(/import \{ tasksStore, getProjectTasks \} from '\.\.\/\.\.\/\.\.\/stores\/data';/, "import { tasksStore, projectsStore, getProjectTasks } from '../../../stores/data';");
d = d.replace(/getProjectTasks\(\$tasksStore, projectId\)/g, "getProjectTasks($tasksStore, projectId, $projectsStore)");
fs.writeFileSync(deadlines, d);

console.log('Views updated to use $projectsStore for filtering');
