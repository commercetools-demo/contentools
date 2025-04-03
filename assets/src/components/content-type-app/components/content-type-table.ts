import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContentTypeData } from '../../../types';

@customElement('content-type-table')
export class ContentTypeTable extends LitElement {
  @property({ type: Array })
  contentTypes: ContentTypeData[] = [];

  @property({ type: Boolean })
  loading = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .registry-list {
      width: 100%;
      border-collapse: collapse;
    }
    
    .registry-list th {
      text-align: left;
      padding: 12px 15px;
      background-color: #f8f9fa;
      border-bottom: 2px solid #ddd;
    }
    
    .registry-list td {
      padding: 10px 15px;
      border-bottom: 1px solid #ddd;
    }
    
    .registry-list tr:hover {
      background-color: #f5f5f5;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .registry-button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .secondary-button {
      background-color: #ecf0f1;
      color: #7f8c8d;
    }
    
    .secondary-button:hover {
      background-color: #dfe6e9;
    }
    
    .danger-button {
      background-color: #e74c3c;
      color: white;
    }
    
    .danger-button:hover {
      background-color: #c0392b;
    }
    
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }
    
    .empty-state {
      padding: 40px;
      text-align: center;
      color: #7f8c8d;
    }
  `;

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading content types...</div>`;
    }

    if (this.contentTypes.length === 0) {
      return html`
        <div class="empty-state">
          <p>No content types registered yet. Click "Add Content Type" to create your first content type.</p>
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
          ${this.contentTypes.map(contentType => html`
            <tr>
              <td>${contentType.metadata.type}</td>
              <td>${contentType.metadata.name}</td>
              <td>${contentType.deployedUrl}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="registry-button secondary-button" 
                    @click=${() => this._editContentType(contentType)}
                  >
                    Edit
                  </button>
                  <button 
                    class="registry-button danger-button" 
                    @click=${() => this._removeContentType(contentType.metadata.type)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  private _editContentType(contentType: ContentTypeData) {
    this.dispatchEvent(new CustomEvent('edit', {
      detail: { contentType },
      bubbles: true,
      composed: true
    }));
  }

  private _removeContentType(type: string) {
    if (confirm(`Are you sure you want to delete the "${type}" content type?`)) {
      this.dispatchEvent(new CustomEvent('remove', {
        detail: { type },
        bubbles: true,
        composed: true
      }));
    }
  }
}

export default ContentTypeTable; 