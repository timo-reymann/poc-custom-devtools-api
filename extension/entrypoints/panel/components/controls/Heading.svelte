<script lang="ts">
  import type { HeadingDescriptor } from '@/utils/protocol';

  let { el }: { el: HeadingDescriptor } = $props();
</script>

<h1 id={el.id}>{el.label}</h1>
