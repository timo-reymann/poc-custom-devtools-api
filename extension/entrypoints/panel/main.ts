import { mount } from 'svelte';
import App from './App.svelte';
import { applyTheme } from './lib/theme';
import './panel.css';

// Inject theme CSS variables before mounting so they exist on first paint.
applyTheme();

const app = mount(App, { target: document.getElementById('app')! });

export default app;
