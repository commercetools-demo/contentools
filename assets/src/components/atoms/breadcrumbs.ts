import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface BreadcrumbItem {
  text: string;
  path?: string;
}

/**
 * A reusable breadcrumbs navigation component
 */
@customElement('ui-breadcrumbs')
export class Breadcrumbs extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .breadcrumbs {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
    }

    .breadcrumb-item {
      color: #777;
      cursor: pointer;
      text-decoration: none;
    }

    .breadcrumb-item:hover {
      color: #333;
      text-decoration: underline;
    }

    .breadcrumb-item.active {
      color: #333;
      font-weight: 500;
      cursor: default;
    }

    .breadcrumb-item.active:hover {
      text-decoration: none;
    }

    .separator {
      color: #ccc;
      user-select: none;
    }
  `;

  @property({ type: Array })
  items: BreadcrumbItem[] = [];

  @property({ type: String })
  separator = '/';

  render() {
    return html`
      <div class="breadcrumbs">
        ${this.items.map(
          (item, index) => html`
            ${index > 0
              ? html`<span class="separator">${this.separator}</span>`
              : ''}
            ${item.path
              ? html`
                  <span
                    class="breadcrumb-item"
                    @click="${() => this._handleItemClick(item)}"
                  >
                    ${item.text}
                  </span>
                `
              : html`<span class="breadcrumb-item active">${item.text}</span>`}
          `
        )}
      </div>
    `;
  }

  private _handleItemClick(item: BreadcrumbItem) {
    if (item.path) {
      this.dispatchEvent(
        new CustomEvent('breadcrumb-click', {
          detail: { item },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-breadcrumbs': Breadcrumbs;
  }
}
