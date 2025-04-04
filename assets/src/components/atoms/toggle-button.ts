import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable toggle button component
 */
@customElement('ui-toggle-button')
export class ToggleButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    
    .toggle-button {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #777;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .toggle-button:hover {
      background-color: #f5f5f5;
      color: #333;
    }
    
    .toggle-button.active {
      color: #3498db;
    }
    
    .toggle-button.small {
      font-size: 16px;
      padding: 3px 8px;
    }
    
    .toggle-button.large {
      font-size: 24px;
      padding: 8px 12px;
    }
  `;

  @property({ type: Boolean })
  active = false;

  @property({ type: String })
  activeIcon = '⇢';

  @property({ type: String })
  inactiveIcon = '⇠';

  @property({ type: String })
  title = '';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  render() {
    return html`
      <button 
        class="toggle-button ${this.active ? 'active' : ''} ${this.size}"
        title=${this.title || (this.active ? 'Hide' : 'Show')}
        @click=${this._handleClick}
      >
        ${this.active ? this.activeIcon : this.inactiveIcon}
      </button>
    `;
  }

  private _handleClick() {
    this.active = !this.active;
    
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { active: this.active },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-toggle-button': ToggleButton;
  }
} 