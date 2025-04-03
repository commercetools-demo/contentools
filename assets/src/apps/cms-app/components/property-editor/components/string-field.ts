import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cms-string-field')
export class StringField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: Boolean })
  required: boolean = false;

  @property({ type: String })
  fieldKey: string = '';

  static styles = css`
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 14px;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
  `;

  render() {
    return html`
      <div class="form-group">
        <label for="${this.fieldKey}">${this.label}</label>
        <input 
          type="text" 
          id="${this.fieldKey}" 
          .value=${this.value} 
          @input=${(e: InputEvent) => this.handleInput(e)}
          ?required=${this.required}
        />
      </div>
    `;
  }

  private handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: {
        key: this.fieldKey,
        value: input.value
      },
      bubbles: true,
      composed: true
    }));
  }
} 