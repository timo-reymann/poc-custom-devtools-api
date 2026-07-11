<script lang="ts">
  import { store } from '../lib/store.svelte';
</script>

<div class="devtools--tab-bar">
  {#each store.tabs as tab (tab.id)}
    <button
      class="devtools--tab"
      class:devtools--tab-active={store.activeTabId === tab.id}
      onclick={() => store.setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>
