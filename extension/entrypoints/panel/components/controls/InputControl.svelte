<script lang="ts">
  import type { InputDescriptor } from '@/utils/protocol';
  import { sendMessage } from '../../lib/messaging';

  let { el }: { el: InputDescriptor } = $props();

  // Using a ref instead of bind:value because Svelte forbids two-way binding on an
  // input whose `type` is dynamic (the demo registers a `color` input).
  let inputEl: HTMLInputElement;

  function submit() {
    sendMessage(`event:${el.id}:action`, { value: inputEl.value || '' });
    inputEl.value = '';
  }

  function onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      submit();
    }
  }
</script>

<input bind:this={inputEl} placeholder={el.label} type={el.inputType || 'text'} onkeyup={onKeyup} />
<button class="devtools--submit-button" onclick={submit}>Submit</button>
