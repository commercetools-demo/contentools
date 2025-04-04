import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable input component with label
 */
@customElement('ui-labeled-input')
export class LabeledInput extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .input-container {
      margin-bottom: 15px;
    }

    .form-label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .form-input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  `;

  @property({ type: String })
  label = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  type = 'text';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  render() {
    return html`
      <div class="input-container">
        <label class="form-label">${this.label}${this.required ? ' *' : ''}</label>
        <input
          class="form-input"
          type="${this.type}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          @input="${this._handleInput}"
        />
      </div>
    `;
  }

  private _handleInput(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;

    this.dispatchEvent(
      new CustomEvent('input-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-labeled-input': LabeledInput;
  }
}
