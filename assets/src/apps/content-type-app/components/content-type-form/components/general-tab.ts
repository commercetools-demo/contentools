import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../../../components/atoms/labeled-input';

@customElement('general-tab')
export class GeneralTab extends LitElement {
  @property({ type: String }) type = '';
  @property({ type: String }) name = '';
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) isEdit = false;

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    ui-labeled-input {
        margin-bottom: 15px;
        display: block;
    }
  `;

  render() {
    return html`
      <ui-labeled-input
        label="Content Type"
        .value=${this.type}
        @input-change=${(e: CustomEvent) => this._dispatchChange('type', e.detail.value)}
        ?disabled=${this.isEdit}
      ></ui-labeled-input>
      
      <ui-labeled-input
        label="Content Type Name"
        .value=${this.name}
        @input-change=${(e: CustomEvent) => this._dispatchChange('name', e.detail.value)}
      ></ui-labeled-input>
      
      <ui-labeled-input
        label="Icon (emoji)"
        .value=${this.icon || ''}
        @input-change=${(e: CustomEvent) => this._dispatchChange('icon', e.detail.value)}
      ></ui-labeled-input>
    `;
  }

  private _dispatchChange(field: string, value: string) {
    this.dispatchEvent(new CustomEvent('general-change', {
      detail: { field, value },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'general-tab': GeneralTab;
  }
}
