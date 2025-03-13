import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('registry-header')
export class RegistryHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .registry-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      background-color: white;
    }
    
    .registry-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .registry-button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .primary-button {
      background-color: #3498db;
      color: white;
    }
    
    .primary-button:hover {
      background-color: #2980b9;
    }
  `;

  render() {
    return html`
      <header class="registry-header">
        <h1 class="registry-title">Component Registry</h1>
        <button 
          class="registry-button primary-button" 
          @click=${this._addComponent}
        >
          + Add Component
        </button>
      </header>
    `;
  }

  private _addComponent() {
    this.dispatchEvent(new CustomEvent('add-component', {
      bubbles: true,
      composed: true
    }));
  }
}

export default RegistryHeader; 