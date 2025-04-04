import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../store';
import { createEmptyPage, updatePage, createPage } from '../../../store/pages.slice';
import { Page } from '../../../types';
import '../../../components/atoms/labeled-input';

@customElement('cms-page-form')
export class PageForm extends connect(store)(LitElement) {
  @property({ type: Boolean })
  isEdit = false;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @property({ type: Object })
  page?: Page;

  @state()
  private formData = {
    name: '',
    route: '',
  };

  @state()
  private isSubmitting = false;

  static styles = css`
    .page-form {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .page-form h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    button {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 15px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #2980b9;
    }
    
    button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
    
    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .hint {
      font-size: 12px;
      color: #777;
      margin-top: 5px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    
    if (this.isEdit && this.page) {
      this.formData = {
        name: this.page.name,
        route: this.page.route,
      };
    }
  }

  render() {
    return html`
      <div class="page-form">
        <h2>${this.isEdit ? 'Edit Page' : 'Create New Page'}</h2>
        
        <ui-labeled-input
          label="Page Name"
          .value=${this.formData.name}
          @input-change=${this._handleNameInput}
          required
        ></ui-labeled-input>
        
        <ui-labeled-input
          label="Page Route"
          .value=${this.formData.route}
          @input-change=${this._handleRouteInput}
          required
        ></ui-labeled-input>
        <div class="hint">Example: /products/category</div>
        
        <div class="actions">
          <button 
            @click=${this._handleSubmit} 
            ?disabled=${this.isSubmitting || !this._isFormValid()}
          >
            ${this.isSubmitting ? 'Saving...' : this.isEdit ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </div>
    `;
  }

  private _handleNameInput(e: CustomEvent) {
    this.formData = {
      ...this.formData,
      name: e.detail.value,
    };
  }

  private _handleRouteInput(e: CustomEvent) {
    let route = e.detail.value;
    
    // Ensure route starts with a slash
    if (route && !route.startsWith('/')) {
      route = '/' + route;
    }
    
    this.formData = {
      ...this.formData,
      route,
    };
  }

  private _isFormValid() {
    return this.formData.name.trim() !== '' && this.formData.route.trim() !== '';
  }

  private async _handleSubmit() {
    if (!this._isFormValid()) return;
    
    this.isSubmitting = true;
    
    try {
      if (this.isEdit && this.page) {
        const updatedPage = {
          ...this.page,
          name: this.formData.name,
          route: this.formData.route,
        };
        
        await store.dispatch(updatePage({baseUrl: `${this.baseURL}/${this.businessUnitKey}`, page: updatedPage})).unwrap();
        
        // Dispatch event to notify parent
        this.dispatchEvent(new CustomEvent('page-updated', {
          detail: { page: updatedPage },
          bubbles: true,
          composed: true,
        }));
      } else {
        // Create a new page
        store.dispatch(createEmptyPage({
          name: this.formData.name,
          route: this.formData.route,
          businessUnitKey: this.businessUnitKey,
        }));
        
        // Save to API
        if (store.getState().pages.currentPage) {
          const currentPage = store.getState().pages.currentPage;
          await store.dispatch(createPage({
            baseUrl: `${this.baseURL}/${this.businessUnitKey}`,
            page: currentPage!
          })).unwrap();
        }
        
        // Dispatch event to notify parent
        this.dispatchEvent(new CustomEvent('page-created', {
          bubbles: true,
          composed: true,
        }));
      }
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}