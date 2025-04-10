// Create a new file: assets/src/apps/content-item-app/components/content-item-editor.ts
// with the following content:

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../components/atoms/button';
import { ContentItem } from '../../../types';
import '../../../apps/cms-renderer/component-renderer';
@customElement('content-item-editor')
export class ContentItemEditor extends LitElement {
  @property({ type: Object })
  item: ContentItem | null = null;

  @property({ type: Boolean })
  isNew: boolean = false;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  static styles = css`
    :host {
      display: block;
    }

    .content-item-edit {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .content-item-edit-editor {
      flex-basis: 50%;
    }

    .content-item-edit-preview {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `;

  render() {
    if (!this.item) {
      return html`<div>No item selected</div>`;
    }

    return html`
      <div>
        <ui-back-button
          @click="${() => {
            this.dispatchEvent(new CustomEvent('back'));
          }}"
        >
          Back to List
        </ui-back-button>
        ${this.isNew
          ? html`
          <cms-property-editor
                .component="${this.item}"
                .baseURL="${this.baseURL}"
                .businessUnitKey="${this.businessUnitKey}"
                @component-updated="${(e: CustomEvent) => {
                  this.dispatchEvent(new CustomEvent('save', { detail: e.detail }));
                }}"
              >
              </cms-property-editor>
        `
          : html`<div class="content-item-edit">
                <cms-property-editor
                  class="content-item-edit-editor"
                  .component="${this.item}"
                  .baseURL="${this.baseURL}"
                  .businessUnitKey="${this.businessUnitKey}"
                  @component-updated="${(e: CustomEvent) => {
                    this.dispatchEvent(new CustomEvent('save', { detail: e.detail }));
                  }}"
                >
                </cms-property-editor>
                <div class="content-item-edit-preview">
                  <h3>Preview</h3>
                  <component-renderer
                    .baseURL="${this.baseURL}"
                    .businessUnitKey="${this.businessUnitKey}"
                    .component="${this.item}"
                  ></component-renderer>
                </div>
              </div>
          `}
      </div>
    `;
  }
}
