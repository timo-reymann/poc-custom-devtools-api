<script lang="ts">
  import type { SliderDescriptor } from '@/utils/protocol';
  import { sendMessage } from '../../lib/messaging';

  let { el }: { el: SliderDescriptor } = $props();

  let { id, label, min, max, step, value: init } = el;
  let value = $state(init);

  function onInput() {
    sendMessage(`event:${id}:action`, { value });
  }
</script>

<div class="devtools--slider">
  <span class="devtools--slider-label">{label}</span>
  <div class="devtools--slider-row">
    <input
      type="range"
      {min}
      {max}
      {step}
      bind:value
      oninput={onInput}
    />
    <span class="devtools--slider-value">{value}</span>
  </div>
</div>

<style>
  .devtools--slider {
    width: 100%;
    min-height: 39px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .devtools--slider-label {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .devtools--slider-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .devtools--slider-row input[type="range"] {
    flex: 1;
    height: 100%;
    cursor: pointer;
    accent-color: var(--accent);
    background: transparent;
  }

  .devtools--slider-value {
    flex-shrink: 0;
    min-width: 36px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
