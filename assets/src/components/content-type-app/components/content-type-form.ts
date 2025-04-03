import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContentTypeData } from '../../../types';

@customElement('content-type-form')
export class ContentTypeForm extends LitElement {
  @property({ type: Object })
  contentType: ContentTypeData = {
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {}
    },
    deployedUrl: ''
  };

  @property({ type: Boolean })
  isEdit = false;

  static styles = css`
    .component-form {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin: 20px;
    }
    
    .form-row {
      margin-bottom: 15px;
    }
    
    .form-label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .registry-button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .primary-button {
      background-color: #3498db;
      color: white;
    }
    
    .primary-button:hover {
      background-color: #2980b9;
    }
    
    .secondary-button {
      background-color: #ecf0f1;
      color: #7f8c8d;
    }
    
    .secondary-button:hover {
      background-color: #dfe6e9;
    }
  `;

  render() {
    return html`
      <div class="component-form">
        <h2>${this.isEdit ? 'Edit Content Type' : 'Add New Content Type'}</h2>
        
        <div class="form-row">
          <label class="form-label">Content Type</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${this.contentType.metadata.type}
            @input=${(e: InputEvent) => this._updateFormField('type', (e.target as HTMLInputElement).value)}
            ?disabled=${this.isEdit}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Content Type Name</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${this.contentType.metadata.name}
            @input=${(e: InputEvent) => this._updateFormField('name', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Icon (emoji)</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${this.contentType.metadata.icon || ''}
            @input=${(e: InputEvent) => this._updateFormField('icon', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Deployed URL</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${this.contentType.deployedUrl}
            @input=${(e: InputEvent) => this._updateFormField('deployedUrl', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Default Properties (JSON)</label>
          <textarea 
            class="form-input" 
            rows="5"
            .value=${JSON.stringify(this.contentType.metadata.defaultProperties, null, 2)}
            @input=${(e: InputEvent) => this._updateJsonField('defaultProperties', (e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </div>
        
        <div class="form-row">
          <label class="form-label">Property Schema (JSON)</label>
          <textarea 
            class="form-input" 
            rows="10"
            .value=${JSON.stringify(this.contentType.metadata.propertySchema, null, 2)}
            @input=${(e: InputEvent) => this._updateJsonField('propertySchema', (e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </div>
        
        <div class="form-buttons">
          <button 
            class="registry-button secondary-button" 
            @click=${this._cancelForm}
          >
            Cancel
          </button>
          <button 
            class="registry-button primary-button" 
            @click=${this._saveContentType}
          >
            ${this.isEdit ? 'Update' : 'Add'} Content Type
          </button>
        </div>
      </div>
    `;
  }

  private _updateFormField(field: string, value: string) {
    const updatedContentType = { ...this.contentType };
    
    if (field === 'deployedUrl') {
      updatedContentType.deployedUrl = value;
    } else {
      updatedContentType.metadata = {
        ...updatedContentType.metadata,
        [field]: value
      };
    }
    
    this._dispatchContentTypeChange(updatedContentType);
  }

  private _updateJsonField(field: string, jsonString: string) {
    try {
      const parsedJson = JSON.parse(jsonString);
      const updatedContentType = { 
        ...this.contentType,
        metadata: {
          ...this.contentType.metadata,
          [field]: parsedJson
        }
      };
      
      this._dispatchContentTypeChange(updatedContentType);
    } catch (e) {
      // Don't update if JSON is invalid
      console.error('Invalid JSON:', e);
    }
  }

  private _dispatchContentTypeChange(contentType: ContentTypeData) {
    this.dispatchEvent(new CustomEvent('content-type-change', {
      detail: { contentType },
      bubbles: true,
      composed: true
    }));
  }

  private _cancelForm() {
    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }));
  }

  private _saveContentType() {
    // Basic validation
    if (!this.contentType.metadata.type || !this.contentType.metadata.name) {
      alert('Type and name are required fields');
      return;
    }
    
    this.dispatchEvent(new CustomEvent('save', {
      detail: { contentType: this.contentType },
      bubbles: true,
      composed: true
    }));
  }
}

export default ContentTypeForm; 