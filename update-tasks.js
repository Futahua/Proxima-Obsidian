const fs = require('fs');
const path = require('path');

function updateDummyTasks(vaultPath) {
  const tasksDir = path.join(vaultPath, 'tasks');
  if (!fs.existsSync(tasksDir)) return;
  
  const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(tasksDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('project: demo-project')) {
      // Add custom properties if not exist
      if (!content.includes('energy:')) {
        content = content.replace('status: backlog\n', 'status: backlog\nenergy: high\nclient_ready: false\neffort: 5\ntags:\n  - bug\n  - ui\n');
        content = content.replace('status: running\n', 'status: running\nenergy: medium\nclient_ready: true\neffort: 12\ntags:\n  - feature\n');
        content = content.replace('status: review\n', 'status: review\nenergy: low\nclient_ready: true\neffort: 2\ntags:\n  - ui\n');
        
        // Remove empty tags array if it exists
        content = content.replace('tags: []\n', '');
        content = content.replace('tags: \n', '');
        
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

updateDummyTasks('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop');
updateDummyTasks('D:/Letters/Vault/Local');
console.log('Dummy tasks updated!');
