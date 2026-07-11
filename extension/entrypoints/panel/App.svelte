<script lang="ts">
  import { onMount } from 'svelte';
  import { store } from './lib/store.svelte';
  import { initMessaging } from './lib/messaging';
  import TabBar from './components/TabBar.svelte';
  import Button from './components/controls/Button.svelte';
  import Heading from './components/controls/Heading.svelte';
  import InputControl from './components/controls/InputControl.svelte';
  import Dropdown from './components/controls/Dropdown.svelte';
  import Table from './components/controls/Table.svelte';

  onMount(() => initMessaging());
</script>

<div class="devtool--host">
  {#if store.tabs.length === 0}
    <h1>No Dev tools registered or still loading</h1>
  {:else}
    <TabBar />
    <div class="devtools--tab-content">
      {#each store.tabs as tab (tab.id)}
        <div
          class="devtools--tab-panel"
          class:devtools--tab-panel-active={store.activeTabId === tab.id}
        >
          {#each store.elementsByTab[tab.id] ?? [] as element (element.id)}
            {#if element.type === 'button'}
              <div class="devtools--row"><Button el={element} /></div>
            {:else if element.type === 'input'}
              <div class="devtools--row"><InputControl el={element} /></div>
            {:else if element.type === 'dropdown'}
              <div class="devtools--row"><Dropdown el={element} /></div>
            {:else if element.type === 'heading'}
              <Heading el={element} />
            {:else if element.type === 'table'}
              <Table el={element} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
