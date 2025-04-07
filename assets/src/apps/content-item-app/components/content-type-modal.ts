import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContentTypeMetaData } from '../../../types';
import '../../../components/atoms/button';

@customElement('content-type-modal')
export class ContentTypeModal extends LitElement {
  @property({ type: Array })
  contentTypesMetaData: ContentTypeMetaData[] = [];

  @property({ type: Boolean })
  open = false;

  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-title {
      font-size: 20px;
      margin: 0;
    }

    .content-type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .content-type-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .content-type-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .content-type-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .content-type-name {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
    }
  `;

  private handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private handleSelect(contentTypeMetaData: ContentTypeMetaData) {
    this.dispatchEvent(new CustomEvent('select', { detail: contentTypeMetaData }));
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Select Content Type</h2>
            <ui-button variant="secondary" @click="${this.handleClose}"> Close </ui-button>
          </div>
          <div class="content-type-grid">
            ${this.contentTypesMetaData.map(
              metadata => html`
              <div
                  class="content-type-card"
                  @click="${() => this.handleSelect(metadata)}"
                >
                  <div class="content-type-icon">
                    ${metadata.icon
                      ? html`
                    <i class="${metadata.icon}"></i>
                  `
                      : html`
                    <i class="fas fa-file"></i>
                  `}
                  </div>
                  <h3 class="content-type-name">${metadata.name}</h3>
                </div>
            `
            )}
          </div>
        </div>
      </div>
    `;
  }
}
