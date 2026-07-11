<script lang="ts">
  import type { ButtonDescriptor } from '@/utils/protocol';
  import { sendMessage } from '../../lib/messaging';

  let { el }: { el: ButtonDescriptor } = $props();
</script>

<button onclick={() => sendMessage(`event:${el.id}:action`)}>{el.label}</button>
