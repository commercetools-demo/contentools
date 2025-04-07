import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './schema-builder';
import { PropertySchema } from '../../../../../../types';

@customElement('schema-tab')
export class SchemaTab extends LitElement {
  @property({ type: Object }) propertySchema: Record<string, PropertySchema> = {};
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
    .section-header {
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 10px;
    }
  `;

  render() {
    return html`
      <div class="form-row">
        <div class="form-row">
          <h3 class="section-header">Property Schema</h3>
          <schema-builder .schemaObject="${this.propertySchema}"></schema-builder>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-tab': SchemaTab;
  }
}
