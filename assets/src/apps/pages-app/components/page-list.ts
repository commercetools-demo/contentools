import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../store';
import { Page } from '../../../types';
import { setCurrentPage, deletePage } from '../../../store/pages.slice';

// Import UI components
import '../../../components/atoms/button';
import '../../../components/atoms/error-message';

@customElement('cms-page-list')
export class PageList extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @property({ type: Array })
  pages: Page[] = [];

  @property({ type: String })
  selectedPageKey: string | null = null;

  @state()
  private showDeleteConfirm: string | null = null;

  @state()
  private error: string | null = null;

  static styles = css`
    .page-list {
      margin-bottom: 30px;
    }

    .page-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .page-list-header h2 {
      font-size: 1.2rem;
      margin: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      font-weight: 500;
      color: #777;
      font-size: 0.9rem;
    }

    tr:hover {
      background-color: #f9f9f9;
    }

    tr.selected {
      background-color: rgba(52, 152, 219, 0.1);
    }

    .page-actions {
      display: flex;
      gap: 10px;
      position: relative;
    }

    .no-pages {
      padding: 20px;
      text-align: center;
      background-color: #f9f9f9;
      border-radius: 4px;
      color: #777;
    }

    .delete-confirm {
      position: absolute;
      right: 0;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px 15px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .delete-confirm-message {
      font-size: 14px;
      margin-bottom: 5px;
    }

    .delete-confirm-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .locale-badge {
      display: inline-block;
      background-color: #e1f5fe;
      color: #0288d1;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 5px;
    }

    .default-locale {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .clickable {
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <div class="page-list">
        ${this.error
          ? html`
              <ui-error-message
                message="${this.error}"
                dismissible
                @dismiss="${() => (this.error = null)}"
              ></ui-error-message>
            `
          : ''}

        <div class="page-list-header">
          <h2>Pages</h2>
          <ui-button variant="primary" @click="${this._handleCreatePage}">+ Create Page</ui-button>
        </div>

        ${this.pages.length === 0
          ? html`<div class="no-pages">
                No pages created yet. Click "Create Page" to get started.
              </div>`
          : html`
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Components</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.pages.map(
                    page => html`
                      <tr
                        class="${this.selectedPageKey === page.key ? 'selected' : ''}"
                      >
                        <td class="clickable" @click="${() => this._handleSelectPage(page.key)}">
                          ${page.name}
                        </td>
                        <td class="clickable" @click="${() => this._handleSelectPage(page.key)}">
                          ${page.route}
                        </td>
                        <td class="clickable" @click="${() => this._handleSelectPage(page.key)}">
                          ${page.components.length}
                        </td>
                        <td>
                          <div class="page-actions">
                            <ui-button
                              variant="text"
                              size="small"
                              @click="${() => this._handleEditPage(page.key)}"
                              >Edit</ui-button
                            >
                            <ui-button
                              variant="text"
                              size="small"
                              @click="${(e: Event) => this._handleOpenDeleteConfirm(e, page.key)}"
                              >Delete</ui-button
                            >

                            ${this.showDeleteConfirm === page.key
                              ? html`
                                  <div class="delete-confirm">
                                    <div class="delete-confirm-message">
                                      Are you sure you want to delete this page?
                                    </div>
                                    <div class="delete-confirm-actions">
                                      <ui-button
                                        variant="secondary"
                                        size="small"
                                        @click="${this._handleCancelDelete}"
                                        >Cancel</ui-button
                                      >
                                      <ui-button
                                        variant="critical"
                                        size="small"
                                        @click="${() => this._handleConfirmDelete(page.key)}"
                                        >Delete</ui-button
                                      >
                                    </div>
                                  </div>
                                `
                              : ''}
                          </div>
                        </td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            `}
      </div>
    `;
  }

  private _handleCreatePage() {
    this.dispatchEvent(
      new CustomEvent('create-page', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSelectPage(key: string) {
    store.dispatch(setCurrentPage(key));
    this.selectedPageKey = key;

    this.dispatchEvent(
      new CustomEvent('select-page', {
        detail: { key },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleEditPage(key: string) {
    this._handleSelectPage(key);

    this.dispatchEvent(
      new CustomEvent('edit-page', {
        detail: { key },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleOpenDeleteConfirm(e: Event, key: string) {
    e.stopPropagation();
    this.showDeleteConfirm = key;
  }

  private _handleCancelDelete() {
    this.showDeleteConfirm = null;
  }

  private async _handleConfirmDelete(key: string) {
    try {
      await store
        .dispatch(
          deletePage({
            baseUrl: `${this.baseURL}/${this.businessUnitKey}`,
            key,
          })
        )
        .unwrap();
      this.showDeleteConfirm = null;

      if (this.selectedPageKey === key) {
        this.selectedPageKey = null;
      }

      this.dispatchEvent(
        new CustomEvent('page-deleted', {
          detail: { key },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = `Failed to delete page: ${err instanceof Error ? err.message : String(err)}`;
      console.error('Error deleting page:', err);
    }
  }
}
