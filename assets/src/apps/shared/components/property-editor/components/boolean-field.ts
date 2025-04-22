import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cms-boolean-field')
export class BooleanField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: Boolean })
  value: boolean = false;

  @property({ type: String })
  fieldKey: string = '';

  @property({ type: Boolean })
  highlight: boolean = false;

  static styles = css`
    .form-group {
      margin-bottom: 15px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    input[type='checkbox'] {
      margin-right: 8px;
    }

    label {
      font-weight: 500;
      font-size: 14px;
    }

    .highlight {
      border: 1px solid #ffa600;
      background-color: #ffa600;
    }
  `;

  render() {
    return html`
      <div class="form-group checkbox-group ${this.highlight ? 'highlight' : ''}">
        <input
          type="checkbox"
          id="${this.fieldKey}"
          .checked="${this.value}"
          @change="${(e: InputEvent) => this.handleChange(e)}"
        />
        <label for="${this.fieldKey}">${this.label}</label>
      </div>
    `;
  }

  private handleChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: input.checked,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}
