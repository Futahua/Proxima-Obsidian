const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte';
let content = fs.readFileSync(file, 'utf8');

const functions = `
  function getTaskCustomProp(task, propId) {
    const val = task.properties ? task.properties[propId] : undefined;
    if (val === undefined || val === null || val === '') return null;
    const propSchema = schema.find(s => s.id === propId);
    if (!propSchema) return { value: String(val) };
    
    if (propSchema.type === 'select') {
       const opt = (propSchema.options || []).find(o => o.id === val);
       if (opt) return { value: opt.name, color: opt.color };
    }
    return { value: String(val) };
  }

  function getTaskCustomPropList(task, propId) {
    const val = task.properties ? task.properties[propId] : undefined;
    if (val === undefined || val === null || val === '') return [];
    const propSchema = schema.find(s => s.id === propId);
    if (!propSchema) return [{ value: String(val) }];
    
    const vals = Array.isArray(val) ? val : [val];
    const res = [];
    vals.forEach(v => {
       if (propSchema.type === 'multi-select' || propSchema.type === 'select') {
         const opt = (propSchema.options || []).find(o => o.id === v);
         if (opt) res.push({ value: opt.name, color: opt.color });
         else res.push({ value: String(v) });
       } else {
         res.push({ value: String(v) });
       }
    });
    return res;
  }
`;

const target = `  function openTaskFile(taskId: string) {`;
content = content.replace(target, functions + '\n' + target);

fs.writeFileSync(file, content);
console.log('Injected custom prop helper functions');
