import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('back-button')
export class BackButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    
    .back-button {
      display: flex;
      align-items: center;
      background: none;
      border: none;
      color: #3498db;
      font-size: 14px;
      padding: 8px 12px;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .back-button:hover {
      color: #3498db;
    }
    
    .back-icon {
      margin-right: 6px;
    }
  `;

  @property({ type: String })
  text = 'Back';

  render() {
    return html`
      <button class="back-button">
        <span class="back-icon">←</span>
        ${this.text}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'back-button': BackButton;
  }
}
