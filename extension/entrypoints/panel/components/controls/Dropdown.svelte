<script lang="ts">
  import type { DropdownDescriptor } from '@/utils/protocol';
  import { sendMessage } from '../../lib/messaging';

  let { el }: { el: DropdownDescriptor } = $props();

  function onChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    sendMessage(`event:${el.id}:action`, { value: value || '' });
  }
</script>

<select onchange={onChange}>
  <option selected disabled>{el.label}</option>
  {#each el.options as option}
    <option value={option}>{option}</option>
  {/each}
</select>

<style>
  select {
    width: 100%;
  }
</style>
