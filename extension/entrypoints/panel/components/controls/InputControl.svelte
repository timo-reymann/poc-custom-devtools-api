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

<div class="devtools--input-wrapper">
  <span class="devtools--input-label">{el.label}</span>
  <div class="devtools--input-row">
    <input bind:this={inputEl} type={el.inputType || 'text'} onkeyup={onKeyup} />
    <button class="devtools--submit-button" onclick={submit} aria-label="Submit">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  </button>
  </div>
</div>

<style>
  .devtools--input-wrapper {
    width: 100%;
    min-height: 39px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .devtools--input-row {
    display: flex;
    gap: 10px;
    width: 100%;
    flex: 1;
  }

  .devtools--input-label {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .devtools--input-row input {
    flex: 1;
  }

  .devtools--submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: #2e7d32;
    border-color: #2e7d32;
    color: #fff;
  }

  .devtools--submit-button:hover {
    filter: brightness(0.85);
  }
</style>
