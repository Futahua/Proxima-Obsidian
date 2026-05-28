const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

const relationOld = `              const renderRelation = () => {
                tWrap.empty();
                localVals.forEach(val => {
                  const pill = tWrap.createEl('span', { cls: 'pos-tag-pill', text: String(val).replace(/\\[\\[|\\]\\]/g, '') });
                  const xBtn = pill.createEl('span', { cls: 'pos-tag-pill-remove', text: 'x', attr: { style: 'margin-left: 4px;' } });
                  xBtn.addEventListener('click', () => {
                    localVals = localVals.filter(t => t !== val);
                    customPropValues[schema.id] = localVals;
                    renderRelation();
                  });
                });
              };
              renderRelation();`;

const relationNew = `              const renderRelation = () => {
                tWrap.empty();
                localVals.forEach(val => {
                  const pill = tWrap.createEl('span', { cls: 'pos-tag-pill', text: String(val).replace(/\\[\\[|\\]\\]/g, '') });
                  const xBtn = pill.createEl('span', { cls: 'pos-tag-pill-remove', text: 'x', attr: { style: 'margin-left: 4px; cursor: pointer;' } });
                  xBtn.addEventListener('click', () => {
                    localVals = localVals.filter(t => t !== val);
                    customPropValues[schema.id] = localVals;
                    renderRelation();
                  });
                });
                
                const inp = tWrap.createEl('input', { type: 'text', cls: 'pos-modal-input', attr: { placeholder: 'Link to note...', style: 'border: none; padding: 2px 4px; min-width: 100px; flex: 1; background: transparent; outline: none; box-shadow: none;' } });
                inp.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    let val = inp.value.trim();
                    if (val) {
                      if (!val.startsWith('[[')) val = '[[' + val;
                      if (!val.endsWith(']]')) val = val + ']]';
                      if (!localVals.includes(val)) {
                        localVals.push(val);
                        customPropValues[schema.id] = localVals;
                        renderRelation();
                      }
                    }
                  }
                });
              };
              renderRelation();`;

content = content.replace(relationOld, relationNew);

fs.writeFileSync(file, content);
console.log('Patched Modals.ts relation input');
