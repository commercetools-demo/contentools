import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContentTypeData } from '../../../types';
import '../../../components/atoms/button';
import '../../../components/atoms/loading-spinner';

@customElement('content-type-table')
export class ContentTypeTable extends LitElement {
  @property({ type: Array })
  contentTypes: ContentTypeData[] = [];

  @property({ type: Boolean })
  loading = false;

  static styles = css`
    :host {
      display: var(--content-type-table__host__display, block);
      width: var(--content-type-table__host__width, 100%);
    }

    .registry-list {
      width: var(--content-type-table__registry-list__width, 100%);
      border-collapse: var(--content-type-table__registry-list__border-collapse, collapse);
    }

    .registry-list th {
      text-align: var(--content-type-table__registry-list-th__text-align, left);
      padding: var(--content-type-table__registry-list-th__padding, 12px 15px);
      background-color: var(--content-type-table__registry-list-th__background-color, #f8f9fa);
      border-bottom: var(--content-type-table__registry-list-th__border-bottom, 2px solid #ddd);
    }

    .registry-list td {
      padding: var(--content-type-table__registry-list-td__padding, 10px 15px);
      border-bottom: var(--content-type-table__registry-list-td__border-bottom, 1px solid #ddd);
    }

    .registry-list tr:hover {
      background-color: var(--content-type-table__registry-list-tr-hover__background-color, #f5f5f5);
    }

    .action-buttons {
      display: var(--content-type-table__action-buttons__display, flex);
      gap: var(--content-type-table__action-buttons__gap, 8px);
    }

    .loading {
      display: var(--content-type-table__loading__display, flex);
      align-items: var(--content-type-table__loading__align-items, center);
      justify-content: var(--content-type-table__loading__justify-content, center);
      height: var(--content-type-table__loading__height, 100px);
    }

    .empty-state {
      padding: var(--content-type-table__empty-state__padding, 40px);
      text-align: var(--content-type-table__empty-state__text-align, center);
      color: var(--content-type-table__empty-state__color, #7f8c8d);
    }
  `;

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <ui-loading-spinner></ui-loading-spinner>
        </div>
      `;
    }

    if (this.contentTypes.length === 0) {
      return html`
        <div class="empty-state">
          <p>
            No content types registered yet. Click "Add Content Type" to create your first content
            type.
          </p>
        </div>
      `;
    }

    return html`
      <table class="registry-list">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Deployed URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.contentTypes.map(
            contentType => html`
              <tr>
                <td>${contentType.metadata.type}</td>
                <td>${contentType.metadata.name}</td>
                <td>${contentType.deployedUrl}</td>
                <td>
                  <div class="action-buttons">
                    <ui-button
                      variant="secondary"
                      size="small"
                      @click="${() => this._editContentType(contentType)}"
                    >
                      Edit
                    </ui-button>
                    <ui-button
                      variant="critical"
                      size="small"
                      @click="${() => this._removeContentType(contentType.metadata.type)}"
                    >
                      Delete
                    </ui-button>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  private _editContentType(contentType: ContentTypeData) {
    this.dispatchEvent(
      new CustomEvent('edit', {
        detail: { contentType },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _removeContentType(type: string) {
    if (confirm(`Are you sure you want to delete the "${type}" content type?`)) {
      this.dispatchEvent(
        new CustomEvent('remove', {
          detail: { type },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

export default ContentTypeTable;
