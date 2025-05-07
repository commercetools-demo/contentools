import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../components/atoms/button';

@customElement('content-type-header')
export class ContentTypeHeader extends LitElement {
  @property({ type: Boolean })
  hideAddButton = false;

  static styles = css`
    :host {
      display: var(--content-type-header__host__display, block);
      width: var(--content-type-header__host__width, 100%);
    }

    .registry-header {
      display: var(--content-type-header__registry-header__display, flex);
      align-items: var(--content-type-header__registry-header__align-items, center);
      justify-content: var(--content-type-header__registry-header__justify-content, space-between);
      padding: var(--content-type-header__registry-header__padding, 15px 20px);
    }

    .registry-title {
      font-size: var(--content-type-header__registry-title__font-size, 20px);
      font-weight: var(--content-type-header__registry-title__font-weight, 600);
      margin: var(--content-type-header__registry-title__margin, 0);
    }
  `;

  render() {
    return html`
      <header class="registry-header">
        <h1 class="registry-title">Content Type Manager</h1>
        ${this.hideAddButton
          ? ''
          : html`
              <ui-button variant="primary" @click="${this._addContentType}">
                + Add Content Type
              </ui-button>
            `}
      </header>
    `;
  }

  private _addContentType() {
    this.dispatchEvent(
      new CustomEvent('add-content-type', {
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default ContentTypeHeader;
