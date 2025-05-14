import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../components/atoms/button';
import '../../../components/atoms/table';
import '../../../components/atoms/status-tag';
import { ContentItem, StateInfo } from '../../../types';

@customElement('content-item-list')
export class ContentItemList extends LitElement {
  @property({ type: Array })
  items: ContentItem[] = [];

  @property({ type: Object })
  states: Record<string, StateInfo> = {};

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @property({ type: Boolean })
  loading = false;

  @property({ type: String })
  error: string | null = null;

  @property({ type: Boolean })
  showContentTypeModal = false;

  static styles = css`
    .header {
      display: var(--content-item-list__header__display, flex);
      justify-content: var(--content-item-list__header__justify-content, space-between);
      align-items: var(--content-item-list__header__align-items, center);
      margin-bottom: var(--content-item-list__header__margin-bottom, 20px);
    }

    .title {
      font-size: var(--content-item-list__title__font-size, 24px);
      margin: var(--content-item-list__title__margin, 0);
    }

    .content {
      background: var(--content-item-list__content__background, white);
      border-radius: var(--content-item-list__content__border-radius, 4px);
      box-shadow: var(--content-item-list__content__box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: var(--content-item-list__content__padding, 20px);
    }

    .action-buttons {
      display: var(--content-item-list__action-buttons__display, flex);
      gap: var(--content-item-list__action-buttons__gap, 8px);
    }
  `;

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    return html`
      <div>
        <div class="header">
          <h1 class="title">Content Items</h1>
          <ui-button
            @click="${() => {
              this.dispatchEvent(new CustomEvent('create-new'));
            }}"
          >
            Create New
          </ui-button>
        </div>

        <div class="content">
          <ui-table
            .headers="${['Name', 'Type', 'Slot', 'Status', 'Actions']}"
            .rows="${this.items.map(item => ({
              cells: [
                item.name,
                item.type,
                item.properties?.slot,
                html`
                  <ui-status-tag
                    status="${this.formatStatusClass(this.states[item.key])}"
                  ></ui-status-tag>
                `,
                html`
                  <div class="action-buttons">
                    <ui-button
                      variant="secondary"
                      size="small"
                      @click="${() => {
                        this.dispatchEvent(new CustomEvent('edit', { detail: item }));
                      }}"
                    >
                      Edit
                    </ui-button>
                    <ui-button
                      variant="critical"
                      size="small"
                      @click="${() => {
                        this.dispatchEvent(new CustomEvent('delete', { detail: item.key }));
                      }}"
                    >
                      Delete
                    </ui-button>
                    <ui-button variant="icon" size="small" @click="${() => this.handleCopy(item)}">
                      <span style="font-size: 8px;">📋</span>
                    </ui-button>
                    <ui-button variant="icon" size="small" @click="${() => this.handleJson(item)}">
                      <span style="font-size: 8px;">↗︎</span>
                    </ui-button>
                  </div>
                `,
              ],
            }))}"
            .loading="${this.loading}"
          ></ui-table>
        </div>
      </div>
    `;
  }

  formatStatus(status?: StateInfo): string {
    if (!status) {
      return 'Draft';
    }

    if (status.draft && status.published) {
      return 'Draft & Published';
    }

    if (status.draft) {
      return 'Draft';
    }

    return 'Published';
  }

  formatStatusClass(status?: StateInfo): string {
    if (!status) {
      return 'draft';
    }

    if (status.draft && status.published) {
      return 'both';
    }

    return status.draft ? 'draft' : 'published';
  }

  handleCopy(item: ContentItem) {
    navigator.clipboard.writeText(item.key);
    alert('Item ID copied to clipboard');
  }

  handleJson(item: ContentItem) {
    // open new tab
    window.open(
      `${this.baseURL}/${this.businessUnitKey}/published/content-items/${item.key}`,
      '_blank'
    );
  }
}
