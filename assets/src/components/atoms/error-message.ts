import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable error message component
 */
@customElement('ui-error-message')
export class ErrorMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .error-message {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .error-message.error {
      background-color: #ffebee;
      color: #e53935;
      border-left: 4px solid #e53935;
    }

    .error-message.warning {
      background-color: #fff8e1;
      color: #f57f17;
      border-left: 4px solid #f57f17;
    }

    .error-message.info {
      background-color: #e3f2fd;
      color: #1976d2;
      border-left: 4px solid #1976d2;
    }

    .error-message.success {
      background-color: #e8f5e9;
      color: #388e3c;
      border-left: 4px solid #388e3c;
    }

    .close-button {
      margin-left: auto;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: inherit;
      opacity: 0.7;
    }

    .close-button:hover {
      opacity: 1;
    }
  `;

  @property({ type: String })
  message = '';

  @property({ type: String })
  type: 'error' | 'warning' | 'info' | 'success' = 'error';

  @property({ type: Boolean })
  dismissible = false;

  render() {
    return html`
      <div class="error-message ${this.type}">
        <slot>${this.message}</slot>
        ${this.dismissible
          ? html`<button class="close-button" @click=${this._handleDismiss}>×</button>`
          : ''}
      </div>
    `;
  }

  private _handleDismiss() {
    this.dispatchEvent(
      new CustomEvent('dismiss', {
        bubbles: true,
        composed: true,
      })
    );

    // Optionally hide the element when dismissed
    this.style.display = 'none';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-error-message': ErrorMessage;
  }
}
