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
      position: var(--content-type-modal__modal-overlay__position, fixed);
      top: var(--content-type-modal__modal-overlay__top, 0);
      left: var(--content-type-modal__modal-overlay__left, 0);
      right: var(--content-type-modal__modal-overlay__right, 0);
      bottom: var(--content-type-modal__modal-overlay__bottom, 0);
      background: var(--content-type-modal__modal-overlay__background, rgba(0, 0, 0, 0.5));
      display: var(--content-type-modal__modal-overlay__display, flex);
      justify-content: var(--content-type-modal__modal-overlay__justify-content, center);
      align-items: var(--content-type-modal__modal-overlay__align-items, center);
      z-index: var(--content-type-modal__modal-overlay__z-index, 1000);
    }

    .modal {
      background: var(--content-type-modal__modal__background, white);
      padding: var(--content-type-modal__modal__padding, 20px);
      border-radius: var(--content-type-modal__modal__border-radius, 8px);
      width: var(--content-type-modal__modal__width, 80%);
      max-width: var(--content-type-modal__modal__max-width, 800px);
      max-height: var(--content-type-modal__modal__max-height, 80vh);
      overflow-y: var(--content-type-modal__modal__overflow-y, auto);
    }

    .modal-header {
      display: var(--content-type-modal__modal-header__display, flex);
      justify-content: var(--content-type-modal__modal-header__justify-content, space-between);
      align-items: var(--content-type-modal__modal-header__align-items, center);
      margin-bottom: var(--content-type-modal__modal-header__margin-bottom, 20px);
    }

    .modal-title {
      font-size: var(--content-type-modal__modal-title__font-size, 20px);
      margin: var(--content-type-modal__modal-title__margin, 0);
    }

    .content-type-grid {
      display: var(--content-type-modal__content-type-grid__display, grid);
      grid-template-columns: var(--content-type-modal__content-type-grid__grid-template-columns, repeat(auto-fill, minmax(200px, 1fr)));
      gap: var(--content-type-modal__content-type-grid__gap, 20px);
    }

    .content-type-card {
      border: var(--content-type-modal__content-type-card__border, 1px solid #ddd);
      border-radius: var(--content-type-modal__content-type-card__border-radius, 8px);
      padding: var(--content-type-modal__content-type-card__padding, 20px);
      cursor: var(--content-type-modal__content-type-card__cursor, pointer);
      transition: var(--content-type-modal__content-type-card__transition, all 0.2s);
    }

    .content-type-card:hover {
      transform: var(--content-type-modal__content-type-card-hover__transform, translateY(-2px));
      box-shadow: var(--content-type-modal__content-type-card-hover__box-shadow, 0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .content-type-icon {
      font-size: var(--content-type-modal__content-type-icon__font-size, 24px);
      margin-bottom: var(--content-type-modal__content-type-icon__margin-bottom, 10px);
    }

    .content-type-name {
      font-size: var(--content-type-modal__content-type-name__font-size, 16px);
      font-weight: var(--content-type-modal__content-type-name__font-weight, bold);
      margin: var(--content-type-modal__content-type-name__margin, 0);
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
