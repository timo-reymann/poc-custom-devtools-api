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
  import Toggle from './components/controls/Toggle.svelte';
  import Slider from './components/controls/Slider.svelte';

  onMount(() => initMessaging());

  function span(cols: number | undefined): string {
    return `grid-column: span ${cols ?? 12}; width: 100%; display: flex; align-items: stretch`;
  }
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
              <div style={span(element.cols)}><Button el={element} /></div>
            {:else if element.type === 'input'}
              <div style={span(element.cols)}><InputControl el={element} /></div>
            {:else if element.type === 'dropdown'}
              <div style={span(element.cols)}><Dropdown el={element} /></div>
            {:else if element.type === 'heading'}
              <div style={span(element.cols)}><Heading el={element} /></div>
            {:else if element.type === 'table'}
              <div style={span(element.cols)}><Table el={element} /></div>
            {:else if element.type === 'toggle'}
              <div style={span(element.cols)}><Toggle el={element} /></div>
            {:else if element.type === 'slider'}
              <div style={span(element.cols)}><Slider el={element} /></div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
