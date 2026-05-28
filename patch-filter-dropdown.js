const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte';
let content = fs.readFileSync(file, 'utf8');

const filterInputOld = `        {#if filter.operator !== 'is-empty' && filter.operator !== 'not-empty'}
          <input type="text" bind:value={filter.value} on:input={saveFilters} class="pos-grid-search-input" style="flex: 1; max-width: 200px;" placeholder="Value..." />
        {/if}`;
const filterInputNew = `        {#if filter.operator !== 'is-empty' && filter.operator !== 'not-empty'}
          {#if filter.property === 'status'}
            <select bind:value={filter.value} on:change={saveFilters} class="pos-grid-select-filter">
              <option value="backlog">Elastic Backlog</option>
              <option value="planned">Planned</option>
              <option value="running">Elastic Running</option>
              <option value="review">Finished</option>
              {#each (fileManager.plugin.settings.statuses || []) as st}
                 {#if !['backlog', 'planned', 'running', 'review'].includes(st.id)}
                   <option value={st.id}>{st.name}</option>
                 {/if}
              {/each}
            </select>
          {:else if filter.property === 'isCompleted'}
            <select bind:value={filter.value} on:change={saveFilters} class="pos-grid-select-filter">
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          {:else if schema.find(s => s.id === filter.property)?.type === 'select' || schema.find(s => s.id === filter.property)?.type === 'multi-select'}
            <select bind:value={filter.value} on:change={saveFilters} class="pos-grid-select-filter">
              <option value="">-- Select Option --</option>
              {#each (schema.find(s => s.id === filter.property)?.options || []) as opt}
                <option value={opt.id}>{opt.name}</option>
              {/each}
            </select>
          {:else}
            <input type="text" bind:value={filter.value} on:input={saveFilters} class="pos-grid-search-input" style="flex: 1; max-width: 200px;" placeholder="Value..." />
          {/if}
        {/if}`;
content = content.replace(filterInputOld, filterInputNew);

// Fix String() evaluation of 'isCompleted' true/false
const oldValChecks = `      const rVal = rule.value;`;
const newValChecks = `      const rVal = rule.value;
      if (rule.property === 'isCompleted' && typeof taskValue === 'boolean') {
        taskValue = taskValue ? 'true' : 'false';
      }`;
content = content.replace(oldValChecks, newValChecks);

fs.writeFileSync(file, content);
console.log('Patched ProjectTaskGrid.svelte select options');
