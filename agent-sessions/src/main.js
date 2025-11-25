import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import vscode-elements
import '@vscode-elements/elements';

// Import codicons
import '@vscode/codicons/dist/codicon.css';

// Create custom element for vscode-icon if not already defined
if (!customElements.get('vscode-icon')) {
  class VscodeIcon extends HTMLElement {
    static get observedAttributes() {
      return ['name'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const name = this.getAttribute('name');
      this.innerHTML = `<i class="codicon codicon-${name}"></i>`;
    }
  }
  customElements.define('vscode-icon', VscodeIcon);
}

// Configure Vue to recognize custom elements
const app = createApp(App);

app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith('vscode-');
};

app.mount('#app')
