import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { connect, watch } from 'lit-redux-watch';
import { store } from '../../store';
import { RegistryComponentData } from '../../types';
import { fetchRegistryComponents, addRegistryComponent, updateRegistryComponentThunk, removeRegistryComponent } from '../../store/registry.slice';
import '../registry-components';

@customElement('registry-app')
export class RegistryApp extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @watch('registry.components')
  components: RegistryComponentData[] = [];

  @watch('registry.loading')
  loading = false;

  @watch('registry.error')
  error: string | null = null;

  @state()
  private selectedComponent: RegistryComponentData | null = null;

  @state()
  private isAddingComponent = false;

  @state()
  private newComponent: RegistryComponentData = {
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {}
    },
    deployedUrl: ''
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      width: 100%;
      height: 100%;
    }
    
    .registry-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .registry-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      background-color: white;
    }
    
    .registry-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
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
    
    .error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin: 20px;
    }
    
    .empty-state {
      padding: 40px;
      text-align: center;
      color: #7f8c8d;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(fetchRegistryComponents({ baseURL: this.baseURL }));
  }

  render() {
    return html`
      <div class="registry-container">
        <header class="registry-header">
          <h1 class="registry-title">Component Registry</h1>
          <button 
            class="registry-button primary-button" 
            @click=${() => this._toggleAddComponent()}
          >
            + Add Component
          </button>
        </header>
        
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
        
        ${this.isAddingComponent || this.selectedComponent 
          ? this._renderComponentForm()
          : this._renderComponentsTable()
        }
      </div>
    `;
  }

  private _renderComponentsTable() {
    if (this.loading) {
      return html`<div class="loading">Loading components...</div>`;
    }

    if (this.components.length === 0) {
      return html`
        <div class="empty-state">
          <p>No components registered yet. Click "Add Component" to create your first component.</p>
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
          ${this.components.map(component => html`
            <tr>
              <td>${component.metadata.type}</td>
              <td>${component.metadata.name}</td>
              <td>${component.deployedUrl}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="registry-button secondary-button" 
                    @click=${() => this._editComponent(component)}
                  >
                    Edit
                  </button>
                  <button 
                    class="registry-button danger-button" 
                    @click=${() => this._removeComponent(component.metadata.type)}
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

  private _renderComponentForm() {
    const component = this.selectedComponent || this.newComponent;
    const isEdit = !!this.selectedComponent;

    return html`
      <div class="component-form">
        <h2>${isEdit ? 'Edit Component' : 'Add New Component'}</h2>
        
        <div class="form-row">
          <label class="form-label">Component Type</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${component.metadata.type}
            @input=${(e: InputEvent) => this._updateFormField('type', (e.target as HTMLInputElement).value)}
            ?disabled=${isEdit}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Component Name</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${component.metadata.name}
            @input=${(e: InputEvent) => this._updateFormField('name', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Icon (emoji)</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${component.metadata.icon || ''}
            @input=${(e: InputEvent) => this._updateFormField('icon', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Deployed URL</label>
          <input 
            class="form-input" 
            type="text" 
            .value=${component.deployedUrl}
            @input=${(e: InputEvent) => this._updateFormField('deployedUrl', (e.target as HTMLInputElement).value)}
          >
        </div>
        
        <div class="form-row">
          <label class="form-label">Default Properties (JSON)</label>
          <textarea 
            class="form-input" 
            rows="5"
            .value=${JSON.stringify(component.metadata.defaultProperties, null, 2)}
            @input=${(e: InputEvent) => this._updateJsonField('defaultProperties', (e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </div>
        
        <div class="form-row">
          <label class="form-label">Property Schema (JSON)</label>
          <textarea 
            class="form-input" 
            rows="10"
            .value=${JSON.stringify(component.metadata.propertySchema, null, 2)}
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
            @click=${this._saveComponent}
          >
            ${isEdit ? 'Update' : 'Add'} Component
          </button>
        </div>
      </div>
    `;
  }

  private _toggleAddComponent() {
    this.isAddingComponent = !this.isAddingComponent;
    this.selectedComponent = null;
    
    // Reset form
    if (this.isAddingComponent) {
      this.newComponent = {
        metadata: {
          type: '',
          name: '',
          icon: '',
          defaultProperties: {},
          propertySchema: {}
        },
        deployedUrl: ''
      };
    }
  }

  private _editComponent(component: RegistryComponentData) {
    this.selectedComponent = JSON.parse(JSON.stringify(component)); // Clone to avoid direct mutation
    this.isAddingComponent = false;
  }

  private _removeComponent(type: string) {
    if (confirm(`Are you sure you want to delete the "${type}" component?`)) {
      store.dispatch(removeRegistryComponent({ baseURL: this.baseURL, key: type }));
    }
  }

  private _updateFormField(field: string, value: string) {
    if (this.selectedComponent) {
      // Editing existing component
      if (field === 'deployedUrl') {
        this.selectedComponent = {
          ...this.selectedComponent,
          deployedUrl: value
        };
      } else {
        this.selectedComponent = {
          ...this.selectedComponent,
          metadata: {
            ...this.selectedComponent.metadata,
            [field]: value
          }
        };
      }
    } else {
      // Adding new component
      if (field === 'deployedUrl') {
        this.newComponent = {
          ...this.newComponent,
          deployedUrl: value
        };
      } else {
        this.newComponent = {
          ...this.newComponent,
          metadata: {
            ...this.newComponent.metadata,
            [field]: value
          }
        };
      }
    }
  }

  private _updateJsonField(field: string, jsonString: string) {
    try {
      const parsedJson = JSON.parse(jsonString);
      
      if (this.selectedComponent) {
        this.selectedComponent = {
          ...this.selectedComponent,
          metadata: {
            ...this.selectedComponent.metadata,
            [field]: parsedJson
          }
        };
      } else {
        this.newComponent = {
          ...this.newComponent,
          metadata: {
            ...this.newComponent.metadata,
            [field]: parsedJson
          }
        };
      }
    } catch (e) {
      // Don't update if JSON is invalid
      console.error('Invalid JSON:', e);
    }
  }

  private _cancelForm() {
    this.isAddingComponent = false;
    this.selectedComponent = null;
  }

  private _saveComponent() {
    const component = this.selectedComponent || this.newComponent;
    
    // Basic validation
    if (!component.metadata.type || !component.metadata.name || !component.deployedUrl) {
      alert('Type, name, and deployed URL are required fields');
      return;
    }
    
    if (this.selectedComponent) {
      // Update existing component
      store.dispatch(updateRegistryComponentThunk({
        baseURL: this.baseURL,
        key: component.metadata.type,
        component
      }));
    } else {
      // Add new component
      store.dispatch(addRegistryComponent({ baseURL: this.baseURL, component }));
    }
    
    this.isAddingComponent = false;
    this.selectedComponent = null;
  }
}

export default RegistryApp;