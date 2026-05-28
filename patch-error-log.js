const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/main.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('unhandledrejection')) {
  content = content.replace(
    /async onload\(\) \{/,
    "async onload() {\n    window.addEventListener('error', e => require('fs').appendFileSync('c:/Users/admin/proxima-debug.log', `[ERROR] ${e.message} at ${e.filename}:${e.lineno}\\n`));\n    window.addEventListener('unhandledrejection', e => require('fs').appendFileSync('c:/Users/admin/proxima-debug.log', `[PROMISE_ERROR] ${e.reason}\\n`));"
  );
  fs.writeFileSync(file, content);
  console.log('Added global error logger');
}
