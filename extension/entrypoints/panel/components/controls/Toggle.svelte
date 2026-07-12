<script lang="ts">
  import type { ToggleDescriptor } from '@/utils/protocol';
  import { sendMessage } from '../../lib/messaging';

  let { el }: { el: ToggleDescriptor } = $props();

  let checked = $state(el.checked ?? false);

  function onChange() {
    sendMessage(`event:${el.id}:action`, { value: checked });
  }
</script>

<label class="devtools--toggle">
  <input type="checkbox" bind:checked onchange={onChange} />
  <div class="devtools--toggle-track">
    <span class="devtools--toggle-thumb"></span>
  </div>
  <span class="devtools--toggle-label">{el.label}</span>
</label>

<style>
  .devtools--toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    min-height: 39px;
    height: 100%;
    user-select: none;
    width: 100%;
  }

  .devtools--toggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
  }

  .devtools--toggle-track {
    position: relative;
    flex-shrink: 0;
    width: 40px;
    height: 22px;
    background: var(--border-color, #888);
    border-radius: 11px;
    transition: background 0.2s;
  }

  .devtools--toggle input:checked + .devtools--toggle-track {
    background: var(--accent, #1a73e8);
  }

  .devtools--toggle input:checked + .devtools--toggle-track .devtools--toggle-thumb {
    transform: translateX(18px);
  }

  .devtools--toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    background: var(--bg-primary, #fff);
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .devtools--toggle-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
