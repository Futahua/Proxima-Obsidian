const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix local array in loadTasks
content = content.replace(
  /async loadTasks\(\) \{\s*this\.tasks = \[\];\s*const files =/g,
  "async loadTasks() {\n    const newTasks: TaskData[] = [];\n    const files ="
);
content = content.replace(
  /this\.tasks\.push\(\{/g,
  "newTasks.push({"
);
content = content.replace(
  /tasks\.sort\(\(a, b\) => a\.orderIndex - b\.orderIndex\);\s*tasksStore\.set\(\tasks\);/g,
  "newTasks.sort((a, b) => a.orderIndex - b.orderIndex);\n    this.tasks = newTasks;\n    tasksStore.set(this.tasks);"
);

// In serializeFrontmatter, wrap dates in quotes just in case!
content = content.replace(
  /str \+= \`\$\{k\}: \$\{fm\[k\]\}\\n\`;/,
  "str += `${k}: \"${fm[k]}\"\\n`;"
);

fs.writeFileSync(file, content);
console.log('Fixed race conditions');
