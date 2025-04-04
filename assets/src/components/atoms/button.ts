import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable button component with variant support
 * @slot - Content of the button
 */
@customElement('ui-button')
export class Button extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      text-align: center;
      border: 1px solid transparent;
    }

    /* Primary variant */
    .button.primary {
      background-color: #3498db;
      color: white;
      border: none;
    }

    .button.primary:hover {
      background-color: #2980b9;
    }

    /* Secondary variant */
    .button.secondary {
      background-color: #f5f5f5;
      color: #555;
      border: 1px solid #ddd;
    }

    .button.secondary:hover {
      background-color: #e8e8e8;
    }

    /* Success variant */
    .button.success {
      background-color: #2ecc71;
      color: white;
      border: none;
    }

    .button.success:hover {
      background-color: #27ae60;
    }

    /* Warning variant */
    .button.warning {
      background-color: #f39c12;
      color: white;
      border: none;
    }

    .button.warning:hover {
      background-color: #e67e22;
    }

    /* Critical variant */
    .button.critical {
      background-color: #e74c3c;
      color: white;
      border: none;
    }

    .button.critical:hover {
      background-color: #c0392b;
    }

    /* Outline variant */
    .button.outline {
      background-color: transparent;
      color: #3498db;
      border: 1px solid currentColor;
    }

    .button.outline:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }

    /* Text variant (no background, no border) */
    .button.text {
      background: none;
      border: none;
      color: #3498db;
      padding: 8px 10px;
    }

    .button.text:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }

    /* Icon only variant */
    .button.icon {
      padding: 8px;
      border-radius: 4px;
    }

    /* Size variations */
    .button.small {
      padding: 4px 10px;
      font-size: 12px;
    }

    .button.large {
      padding: 10px 20px;
      font-size: 16px;
    }

    /* Disabled state */
    .button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  @property({ type: String })
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'critical'
    | 'outline'
    | 'text'
    | 'icon' = 'primary';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html`
      <button
        class="button ${this.variant} ${this.size}"
        ?disabled=${this.disabled}
        type=${this.type}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': Button;
  }
}
