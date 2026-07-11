<script lang="ts">
  import type { TableDescriptor } from '@/utils/protocol';

  let { el }: { el: TableDescriptor } = $props();
</script>

<div class="devtools--table-wrapper">
  <h2>{el.label}</h2>
  <table id={el.id}>
    <thead>
      <tr>
        {#each el.columns as column}
          <th>{column}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if !el.rows || el.rows.length === 0}
        <tr>
          <td class="devtools--table-no-data" colspan="999">No data</td>
        </tr>
      {:else}
        {#each el.rows as row, rowIndex}
          <tr class:devtools--table-row-striped={rowIndex % 2 === 1}>
            {#each row as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
