import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('schema-tab')
export class SchemaTab extends LitElement {
  @property({ type: Object }) propertySchema = {};
  @property({ type: Object }) defaultProperties = {};

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .form-row {
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
      box-sizing: border-box; /* Include padding and border in element's total width and height */
    }
  `;

  render() {
    return html`
      <div class="form-row">
        <label class="form-label">Default Properties (JSON)</label>
        <textarea 
          class="form-input" 
          rows="5"
          .value=${JSON.stringify(this.defaultProperties, null, 2)}
          @input=${(e: InputEvent) => this._dispatchJsonChange('defaultProperties', (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </div>
      
      <div class="form-row">
        <label class="form-label">Property Schema (JSON)</label>
        <textarea 
          class="form-input" 
          rows="10"
          .value=${JSON.stringify(this.propertySchema, null, 2)}
          @input=${(e: InputEvent) => this._dispatchJsonChange('propertySchema', (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </div>
    `;
  }

  private _dispatchJsonChange(field: string, jsonString: string) {
     // We dispatch the raw string and let the parent handle parsing/validation
     // This prevents losing user input if they type invalid JSON temporarily
    this.dispatchEvent(new CustomEvent('schema-change', {
      detail: { field, jsonString },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-tab': SchemaTab;
  }
}
