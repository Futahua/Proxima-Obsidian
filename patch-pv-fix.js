const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

// I will manually replace the exact string
const badBlock = `{#if !isFullPage}<button class="pos-back-btn" on:click={() => selectedProjectId = null}>
          ? Back
        </button>`;

const fixedBlock = `{#if !isFullPage}
        <button class="pos-back-btn" on:click={() => selectedProjectId = null}>
          ? Back
        </button>
        {/if}`;

content = content.replace(badBlock, fixedBlock);

fs.writeFileSync(file, content);
console.log('Fixed ProjectsView.svelte unclosed if block');
