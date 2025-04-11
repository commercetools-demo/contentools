import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export interface SelectOption {
  value: string;
  label: string;
}

@customElement('ui-select')
export class Select extends LitElement {
  @property({ type: String })
  value = '';

  @property({ type: String })
  label = '';

  @property({ type: Array })
  options: SelectOption[] = [];

  @property({ type: Boolean })
  disabled = false;

  @query('select')
  private selectElement!: HTMLSelectElement;

  static styles = css`
    :host {
      display: block;
    }

    .select-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .select-label {
      font-weight: 600;
      font-size: 14px;
    }

    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background-color: white;
      cursor: pointer;
    }

    select:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    select:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
    }
  `;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value') && this.selectElement) {
      const index = this.options.findIndex(opt => opt.value === this.value);
      if (index >= 0) {
        this.selectElement.selectedIndex = index;
      }
    }
  }

  render() {
    const selectedIndex = this.options.findIndex(opt => opt.value === this.value);
    return html`
      <div class="select-container">
        ${this.label ? html`<label class="select-label">${this.label}</label>` : ''}
        <select
          .selectedIndex="${selectedIndex}"
          ?disabled="${this.disabled}"
          @change="${this._handleChange}"
        >
          ${this.options.map(
            option => html`<option value="${option.value}">${option.label}</option>`
          )}
        </select>
      </div>
    `;
  }

  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const selectedIndex = select.selectedIndex;
    if (selectedIndex >= 0 && this.options[selectedIndex]) {
      const newValue = this.options[selectedIndex].value;
      this.value = newValue;
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: newValue },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-select': Select;
  }
}
