import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../store';
import { Page } from '../types';
import { setCurrentPage, deletePage } from '../store/pages.slice';

@customElement('cms-page-list')
export class PageList extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @property({ type: Array })
  pages: Page[] = [];

  @property({ type: String })
  selectedPageKey: string | null = null;

  @state()
  private showDeleteConfirm: string | null = null;

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
    
    .create-page-btn {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .create-page-btn:hover {
      background-color: #2980b9;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
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
    }
    
    .page-actions button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .page-actions button:hover {
      background-color: rgba(0,0,0,0.05);
    }
    
    .page-actions .edit-btn {
      color: #3498db;
    }
    
    .page-actions .delete-btn {
      color: #e74c3c;
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
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
    
    .delete-confirm-actions button {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      border: none;
      cursor: pointer;
    }
    
    .delete-confirm-actions .confirm-btn {
      background-color: #e74c3c;
      color: white;
    }
    
    .delete-confirm-actions .cancel-btn {
      background-color: #eee;
    }
  `;

  render() {
    return html`
      <div class="page-list">
        <div class="page-list-header">
          <h2>Pages</h2>
          <button class="create-page-btn" @click=${this._handleCreatePage}>+ Create Page</button>
        </div>
        
        ${this.pages.length === 0 
          ? html`<div class="no-pages">No pages created yet. Click "Create Page" to get started.</div>`
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
                ${this.pages.map(page => html`
                  <tr class=${this.selectedPageKey === page.key ? 'selected' : ''}>
                    <td @click=${() => this._handleSelectPage(page.key)}>${page.name}</td>
                    <td @click=${() => this._handleSelectPage(page.key)}>${page.route}</td>
                    <td @click=${() => this._handleSelectPage(page.key)}>${page.components.length}</td>
                    <td>
                      <div class="page-actions">
                        <button class="edit-btn" @click=${() => this._handleEditPage(page.key)}>Edit</button>
                        <button class="delete-btn" @click=${(e: Event) => this._handleOpenDeleteConfirm(e, page.key)}>Delete</button>
                        
                        ${this.showDeleteConfirm === page.key 
                          ? html`
                            <div class="delete-confirm">
                              <div class="delete-confirm-message">Are you sure you want to delete this page?</div>
                              <div class="delete-confirm-actions">
                                <button class="cancel-btn" @click=${this._handleCancelDelete}>Cancel</button>
                                <button class="confirm-btn" @click=${() => this._handleConfirmDelete(page.key)}>Delete</button>
                              </div>
                            </div>
                          ` 
                          : ''
                        }
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          `
        }
      </div>
    `;
  }

  private _handleCreatePage() {
    this.dispatchEvent(new CustomEvent('create-page', {
      bubbles: true,
      composed: true
    }));
  }

  private _handleSelectPage(key: string) {
    store.dispatch(setCurrentPage(key));
    this.selectedPageKey = key;
    
    this.dispatchEvent(new CustomEvent('select-page', {
      detail: { key },
      bubbles: true,
      composed: true
    }));
  }

  private _handleEditPage(key: string) {
    this._handleSelectPage(key);
    
    this.dispatchEvent(new CustomEvent('edit-page', {
      detail: { key },
      bubbles: true,
      composed: true
    }));
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
      await store.dispatch(deletePage({baseUrl: this.baseURL, key})).unwrap();
      this.showDeleteConfirm = null;
      
      if (this.selectedPageKey === key) {
        this.selectedPageKey = null;
      }
      
      this.dispatchEvent(new CustomEvent('page-deleted', {
        detail: { key },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Error deleting page:', error);
      this.showDeleteConfirm = null;
    }
  }
}