import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../store';
import { createEmptyPage, updatePage, createPage } from '../../../store/pages.slice';
import { Page } from '../../../types';

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
        
        <div class="form-group">
          <label for="page-name">Page Name</label>
          <input 
            type="text" 
            id="page-name" 
            .value=${this.formData.name} 
            @input=${this._handleNameInput}
            required
          />
        </div>
        
        <div class="form-group">
          <label for="page-route">Page Route</label>
          <input 
            type="text" 
            id="page-route" 
            .value=${this.formData.route} 
            @input=${this._handleRouteInput}
            required
          />
          <div class="hint">Example: /products/category</div>
        </div>
        
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

  private _handleNameInput(e: InputEvent) {
    this.formData = {
      ...this.formData,
      name: (e.target as HTMLInputElement).value,
    };
  }

  private _handleRouteInput(e: InputEvent) {
    let route = (e.target as HTMLInputElement).value;
    
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
          await store.dispatch(createPage({baseUrl: this.baseURL, page: store.getState().pages.currentPage as Page})).unwrap();
        }
        
        // Dispatch event to notify parent
        this.dispatchEvent(new CustomEvent('page-created', {
          bubbles: true,
          composed: true,
        }));
      }
      
      // Reset form
      this.formData = {
        name: '',
        route: '',
      };
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}