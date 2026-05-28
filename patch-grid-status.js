const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the statuses loop in the filter
content = content.replace(
  /{#each \(fileManager\.plugin\.settings\.statuses \|\| \[\]\) as st}/g,
  "{#each ((fileManager.plugin.settings.projectStatuses || {})[projectId] || []) as st}"
);
content = content.replace(
  /<option value="backlog">Elastic Backlog<\/option>/g,
  "<option value=\"backlog\">{(fileManager.plugin.settings.globalStatuses || {})['backlog']?.name || 'Elastic Backlog'}</option>"
);
content = content.replace(
  /<option value="running">Elastic Running<\/option>/g,
  "<option value=\"running\">{(fileManager.plugin.settings.globalStatuses || {})['running']?.name || 'Elastic Running'}</option>"
);
content = content.replace(
  /<option value="review">Finished<\/option>/g,
  "<option value=\"review\">{(fileManager.plugin.settings.globalStatuses || {})['review']?.name || 'Finished'}</option>"
);


// 2. Add getStatusName and getStatusColor
const functions = `
  function getStatusName(statusId) {
    if (['backlog', 'running', 'review'].includes(statusId)) {
       const g = (fileManager.plugin.settings.globalStatuses || {})[statusId] || {};
       if (statusId === 'backlog') return g.name || 'Elastic Backlog';
       if (statusId === 'running') return g.name || 'Elastic Running';
       if (statusId === 'review') return g.name || 'Finished';
    }
    const ps = (fileManager.plugin.settings.projectStatuses || {})[projectId] || [];
    const col = ps.find(s => s.id === statusId);
    return col ? col.name : statusId;
  }
  
  function getStatusColor(statusId) {
    if (['backlog', 'running', 'review'].includes(statusId)) {
       const g = (fileManager.plugin.settings.globalStatuses || {})[statusId] || {};
       if (statusId === 'backlog') return g.color || '#636e72';
       if (statusId === 'running') return g.color || '#00b894';
       if (statusId === 'review') return g.color || '#fdcb6e';
    }
    if (statusId === 'planned') return '#0984e3';
    const ps = (fileManager.plugin.settings.projectStatuses || {})[projectId] || [];
    const col = ps.find(s => s.id === statusId);
    return col ? (col.color || '#a29bfe') : '#a29bfe';
  }
`;

content = content.replace(/function getTaskCustomProp/, functions + '\n  function getTaskCustomProp');

// 3. Fix headers
const headerOld = `          <th class="pos-th-priority" on:click={() => toggleSort('priority')}>
            Priority {sortBy === 'priority' ? (sortOrder === 'asc' ? '-' : '-') : ''}
          </th>
          <th class="pos-th-tags" on:click={() => toggleSort('tags')}>
            Tags {sortBy === 'tags' ? (sortOrder === 'asc' ? '-' : '-') : ''}
          </th>`;

const headerNew = `          {#each schema as prop}
            {#if (fileManager.plugin.settings.projectVisibleProps[projectId] || []).includes(prop.id)}
              <th class="pos-th-custom" on:click={() => toggleSort(prop.id)}>
                {prop.name} {sortBy === prop.id ? (sortOrder === 'asc' ? '-' : '-') : ''}
              </th>
            {/if}
          {/each}`;
content = content.replace(headerOld, headerNew);

// 4. Fix cells
const cellOld = `              <td class="pos-td-priority">
                {#if task.priority === 1}
                  <span class="pos-priority-badge high">High</span>
                {:else if task.priority === 2}
                  <span class="pos-priority-badge medium">Medium</span>
                {:else}
                  <span class="pos-priority-badge low">Low</span>
                {/if}
              </td>
              <td class="pos-td-tags">
                <div class="pos-card-meta">
                  {#if task.tags}
                    {#each task.tags as tag}
                      <span class="pos-tag-pill" style="cursor: pointer;" on:click|stopPropagation={() => tagFilter = tag}>{tag}</span>
                    {/each}
                  {/if}
                </div>
              </td>`;

const cellNew = `              {#each schema as prop}
                {#if ((fileManager.plugin.settings.projectVisibleProps || {})[projectId] || []).includes(prop.id)}
                  <td class="pos-td-custom">
                    {#if prop.type === 'multi-select' || prop.type === 'relation'}
                       <div class="pos-grid-tags">
                         {#each getTaskCustomPropList(task, prop.id) as tag}
                           <span class="pos-tag-pill" style="background-color: {tag.color || '#cccccc'}20; color: {tag.color || '#cccccc'}; border: 1px solid {tag.color || '#cccccc'}40;">
                             {tag.value}
                           </span>
                         {/each}
                       </div>
                    {:else}
                       {@const p = getTaskCustomProp(task, prop.id)}
                       {#if p}
                         {#if p.color}
                           <span class="pos-tag-pill" style="background-color: {p.color}20; color: {p.color}; border: 1px solid {p.color}40;">
                             {p.value}
                           </span>
                         {:else}
                           <span class="pos-text-cell">{p.value}</span>
                         {/if}
                       {:else}
                         <span class="pos-text-cell" style="color: var(--text-muted);">-</span>
                       {/if}
                    {/if}
                  </td>
                {/if}
              {/each}`;
content = content.replace(cellOld, cellNew);

const statusOld = `<td class="pos-td-status">
                <span class="pos-ptc-status-badge {task.status}">
                  {task.status.toUpperCase()}
                </span>
              </td>`;

const statusNew = `<td class="pos-td-status">
                <span class="pos-status-badge" style="background-color: {getStatusColor(task.status)}20; color: {getStatusColor(task.status)}; border: 1px solid {getStatusColor(task.status)}40; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; font-weight: bold;">
                  {getStatusName(task.status)}
                </span>
              </td>`;
content = content.replace(statusOld, statusNew);


fs.writeFileSync(file, content);
console.log('Patched grid filtering and custom cells');
