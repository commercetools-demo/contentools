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
      margin-bottom: var(--cms-page-list__page-list__margin-bottom, 30px);
    }

    .page-list-header {
      display: var(--cms-page-list__page-list-header__display, flex);
      justify-content: var(--cms-page-list__page-list-header__justify-content, space-between);
      align-items: var(--cms-page-list__page-list-header__align-items, center);
      margin-bottom: var(--cms-page-list__page-list-header__margin-bottom, 15px);
    }

    .page-list-header h2 {
      font-size: var(--cms-page-list__page-list-header-h2__font-size, 1.2rem);
      margin: var(--cms-page-list__page-list-header-h2__margin, 0);
    }

    table {
      width: var(--cms-page-list__table__width, 100%);
      border-collapse: var(--cms-page-list__table__border-collapse, collapse);
    }

    th,
    td {
      padding: var(--cms-page-list__th-td__padding, 10px);
      text-align: var(--cms-page-list__th-td__text-align, left);
      border-bottom: var(--cms-page-list__th-td__border-bottom, 1px solid #ddd);
    }

    th {
      font-weight: var(--cms-page-list__th__font-weight, 500);
      color: var(--cms-page-list__th__color, #777);
      font-size: var(--cms-page-list__th__font-size, 0.9rem);
    }

    tr:hover {
      background-color: var(--cms-page-list__tr-hover__background-color, #f9f9f9);
    }

    tr.selected {
      background-color: var(--cms-page-list__tr-selected__background-color, rgba(52, 152, 219, 0.1));
    }

    .page-actions {
      display: var(--cms-page-list__page-actions__display, flex);
      gap: var(--cms-page-list__page-actions__gap, 10px);
      position: var(--cms-page-list__page-actions__position, relative);
    }

    .no-pages {
      padding: var(--cms-page-list__no-pages__padding, 20px);
      text-align: var(--cms-page-list__no-pages__text-align, center);
      background-color: var(--cms-page-list__no-pages__background-color, #f9f9f9);
      border-radius: var(--cms-page-list__no-pages__border-radius, 4px);
      color: var(--cms-page-list__no-pages__color, #777);
    }

    .delete-confirm {
      position: var(--cms-page-list__delete-confirm__position, absolute);
      right: var(--cms-page-list__delete-confirm__right, 0);
      background-color: var(--cms-page-list__delete-confirm__background-color, white);
      border: var(--cms-page-list__delete-confirm__border, 1px solid #ddd);
      border-radius: var(--cms-page-list__delete-confirm__border-radius, 4px);
      padding: var(--cms-page-list__delete-confirm__padding, 10px 15px);
      display: var(--cms-page-list__delete-confirm__display, flex);
      flex-direction: var(--cms-page-list__delete-confirm__flex-direction, column);
      gap: var(--cms-page-list__delete-confirm__gap, 5px);
      box-shadow: var(--cms-page-list__delete-confirm__box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
      z-index: var(--cms-page-list__delete-confirm__z-index, 10);
    }

    .delete-confirm-message {
      font-size: var(--cms-page-list__delete-confirm-message__font-size, 14px);
      margin-bottom: var(--cms-page-list__delete-confirm-message__margin-bottom, 5px);
    }

    .delete-confirm-actions {
      display: var(--cms-page-list__delete-confirm-actions__display, flex);
      gap: var(--cms-page-list__delete-confirm-actions__gap, 10px);
      justify-content: var(--cms-page-list__delete-confirm-actions__justify-content, flex-end);
    }

    .locale-badge {
      display: var(--cms-page-list__locale-badge__display, inline-block);
      background-color: var(--cms-page-list__locale-badge__background-color, #e1f5fe);
      color: var(--cms-page-list__locale-badge__color, #0288d1);
      padding: var(--cms-page-list__locale-badge__padding, 2px 6px);
      border-radius: var(--cms-page-list__locale-badge__border-radius, 4px);
      font-size: var(--cms-page-list__locale-badge__font-size, 12px);
      margin-left: var(--cms-page-list__locale-badge__margin-left, 5px);
    }

    .default-locale {
      background-color: var(--cms-page-list__default-locale__background-color, #e8f5e9);
      color: var(--cms-page-list__default-locale__color, #388e3c);
    }

    .clickable {
      cursor: var(--cms-page-list__clickable__cursor, pointer);
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
      await store.dispatch(
        deletePage({
          baseUrl: `${this.baseURL}/${this.businessUnitKey}`,
          key,
        })
      );
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
