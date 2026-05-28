const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace the hardcoded priority and tags headers
const headerOld = `          <th class="pos-th-status" on:click={() => toggleSort('status')}>
            Status {sortBy === 'status' ? (sortOrder === 'asc' ? '?' : '?') : ''}
          </th>
          <th class="pos-th-priority" on:click={() => toggleSort('priority')}>
            Priority {sortBy === 'priority' ? (sortOrder === 'asc' ? '?' : '?') : ''}
          </th>
          <th class="pos-th-tags" on:click={() => toggleSort('tags')}>
            Tags {sortBy === 'tags' ? (sortOrder === 'asc' ? '?' : '?') : ''}
          </th>
          <th class="pos-th-weight" on:click={() => toggleSort('weight')}>`;

const headerNew = `          <th class="pos-th-status" on:click={() => toggleSort('status')}>
            Status {sortBy === 'status' ? (sortOrder === 'asc' ? '?' : '?') : ''}
          </th>
          {#each schema as prop}
            {#if (fileManager.plugin.settings.projectVisibleProps[selectedProjectId] || []).includes(prop.id)}
              <th class="pos-th-custom" on:click={() => toggleSort(prop.id)}>
                {prop.name} {sortBy === prop.id ? (sortOrder === 'asc' ? '?' : '?') : ''}
              </th>
            {/if}
          {/each}
          <th class="pos-th-weight" on:click={() => toggleSort('weight')}>`;

content = content.replace(headerOld, headerNew);

// Replace the hardcoded priority and tags cells
const cellOld = `              <td class="pos-td-status">
                <span class="pos-status-badge" style="background-color: {getStatusColor(task.status)}20; color: {getStatusColor(task.status)}; border: 1px solid {getStatusColor(task.status)}40;">
                  {getStatusName(task.status)}
                </span>
              </td>
              <td class="pos-td-priority">
                {#if getTaskCustomProp(task, 'priority')}
                  {@const p = getTaskCustomProp(task, 'priority')}
                  <span class="pos-tag-pill" style="background-color: {p.color}20; color: {p.color}; border: 1px solid {p.color}40;">
                    {p.value}
                  </span>
                {:else}
                  <span class="pos-tag-pill empty">-</span>
                {/if}
              </td>
              <td class="pos-td-tags">
                <div class="pos-grid-tags">
                  {#each getTaskCustomPropList(task, 'tags') as tag}
                    <span class="pos-tag-pill" style="background-color: {tag.color}20; color: {tag.color}; border: 1px solid {tag.color}40;">
                      {tag.value}
                    </span>
                  {/each}
                </div>
              </td>
              <td class="pos-td-weight">`;

const cellNew = `              <td class="pos-td-status">
                <span class="pos-status-badge" style="background-color: {getStatusColor(task.status)}20; color: {getStatusColor(task.status)}; border: 1px solid {getStatusColor(task.status)}40;">
                  {getStatusName(task.status)}
                </span>
              </td>
              {#each schema as prop}
                {#if (fileManager.plugin.settings.projectVisibleProps[selectedProjectId] || []).includes(prop.id)}
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
              {/each}
              <td class="pos-td-weight">`;

content = content.replace(cellOld, cellNew);

fs.writeFileSync(file, content);
console.log('Patched grid headers and cells in ProjectTaskGrid.svelte');
