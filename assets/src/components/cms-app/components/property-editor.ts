import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../store';
import { Component, ComponentMetadata } from '../../../types';
import { getComponentMetadata } from '../../registry';
import { updateComponent, removeComponent } from '../../../store/pages.slice';

@customElement('cms-property-editor')
export class PropertyEditor extends connect(store)(LitElement) {
  @property({ type: Object })
  component?: Component;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @state()
  private metadata?: ComponentMetadata;

  @state()
  private loading = false;

  @state()
  private error?: string;

  static styles = css`
    .property-editor {
      padding: 20px 0;
    }
    
    h2 {
      font-size: 18px;
      margin-top: 0;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 14px;
    }
    
    input[type="text"],
    input[type="number"],
    input[type="url"],
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    input[type="checkbox"] {
      margin-right: 8px;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .array-field {
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .array-item {
      display: flex;
      margin-bottom: 8px;
    }
    
    .array-item input {
      flex: 1;
      margin-right: 8px;
    }
    
    .array-item button {
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      padding: 0 8px;
    }
    
    .add-item {
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }
    
    .save-button {
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .delete-button {
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .delete-confirm-dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background: white;
      padding: 20px;
      border-radius: 4px;
      max-width: 400px;
      width: 100%;
    }
    
    .dialog-title {
      font-size: 18px;
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .dialog-buttons button {
      margin-left: 10px;
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .cancel-button {
      background: #9e9e9e;
      color: white;
    }
    
    .confirm-button {
      background: #f44336;
      color: white;
    }
  `;
  
  @state()
  private showDeleteConfirm = false;
  
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('component') && this.component) {
      this.fetchMetadata();
    }
  }

  async fetchMetadata() {
    if (!this.component) return;
    
    this.loading = true;
    this.error = undefined;
    
    try {
      this.metadata = await getComponentMetadata({baseURL: this.baseURL, type: this.component.type as any});
      this.requestUpdate();
    } catch (err) {
      this.error = `Failed to load component metadata: ${err instanceof Error ? err.message : String(err)}`;
      console.error('Error loading component metadata:', err);
    } finally {
      this.loading = false;
    }
  }
  
  render() {
    if (!this.component) {
      return html`<div>No component selected</div>`;
    }
    
    if (this.loading) {
      return html`<div>Loading component properties...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    if (!this.metadata) {
      return html`<div>No metadata available for this component</div>`;
    }
    
    const schema = this.metadata.propertySchema;
    
    return html`
      <div class="property-editor">
        <h2>${this.component.name}</h2>
        
        <div class="form-group">
          <label for="component-name">Component Name</label>
          <input 
            type="text" 
            id="component-name" 
            .value=${this.component.name} 
            @input=${(e: InputEvent) => this.updateName((e.target as HTMLInputElement).value)}
          />
        </div>
        
        ${Object.entries(schema).map(([key, field]: [string, any]) => {
          const value = this.component!.properties[key];
          
          if (field.type === 'string') {
            return html`
              <div class="form-group">
                <label for="${key}">${field.label}</label>
                <input 
                  type="text" 
                  id="${key}" 
                  .value=${value || ''} 
                  @input=${(e: InputEvent) => this.updateProperty(key, (e.target as HTMLInputElement).value)}
                  ?required=${field.required}
                />
              </div>
            `;
          } else if (field.type === 'number') {
            return html`
              <div class="form-group">
                <label for="${key}">${field.label}</label>
                <input 
                  type="number" 
                  id="${key}" 
                  .value=${value} 
                  @input=${(e: InputEvent) => this.updateProperty(key, Number((e.target as HTMLInputElement).value))}
                  ?required=${field.required}
                />
              </div>
            `;
          } else if (field.type === 'boolean') {
            return html`
              <div class="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="${key}" 
                  .checked=${value} 
                  @change=${(e: InputEvent) => this.updateProperty(key, (e.target as HTMLInputElement).checked)}
                />
                <label for="${key}">${field.label}</label>
              </div>
            `;
          } else if (field.type === 'array') {
            return html`
              <div class="form-group">
                <label>${field.label}</label>
                <div class="array-field">
                  ${(value as string[]).map((item, index) => html`
                    <div class="array-item">
                      <input 
                        type="text" 
                        .value=${item} 
                        @input=${(e: InputEvent) => this.updateArrayItem(key, index, (e.target as HTMLInputElement).value)}
                      />
                      <button @click=${() => this.removeArrayItem(key, index)}>✕</button>
                    </div>
                  `)}
                  <button class="add-item" @click=${() => this.addArrayItem(key)}>+ Add Item</button>
                </div>
              </div>
            `;
          }
          
          return html`<div>Unsupported field type: ${field.type}</div>`;
        })}
        
        <div class="actions">
          <button class="delete-button" @click=${this.showDeleteConfirmation}>Delete Component</button>
          <button class="save-button" @click=${this.saveChanges}>Save Changes</button>
        </div>
      </div>
      
      ${this.renderDeleteConfirmDialog()}
    `;
  }
  
  renderDeleteConfirmDialog() {
    if (!this.showDeleteConfirm) return '';
    
    return html`
      <div class="delete-confirm-dialog">
        <div class="dialog-content">
          <h3 class="dialog-title">Delete Component</h3>
          <p>Are you sure you want to delete the component "${this.component?.name}"? This action cannot be undone.</p>
          <div class="dialog-buttons">
            <button class="cancel-button" @click=${() => this.showDeleteConfirm = false}>Cancel</button>
            <button class="confirm-button" @click=${this.deleteComponent}>Delete</button>
          </div>
        </div>
      </div>
    `;
  }
  
  showDeleteConfirmation() {
    this.showDeleteConfirm = true;
  }
  
  deleteComponent() {
    if (this.component) {
      store.dispatch(removeComponent(this.component.id));
      
      // Close the dialog
      this.showDeleteConfirm = false;
      
      // Dispatch a custom event to notify parent components
      this.dispatchEvent(new CustomEvent('component-deleted', {
        detail: { componentId: this.component.id },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  updateName(name: string) {
    if (this.component) {
      this.component = {
        ...this.component,
        name
      };
      this.requestUpdate();
    }
  }
  
  updateProperty(key: string, value: any) {
    if (this.component) {
      this.component = {
        ...this.component,
        properties: {
          ...this.component.properties,
          [key]: value
        }
      };
      this.requestUpdate();
    }
  }
  
  updateArrayItem(key: string, index: number, value: string) {
    if (this.component) {
      const array = [...(this.component.properties[key] as any[])];
      array[index] = value;
      
      this.updateProperty(key, array);
    }
  }
  
  addArrayItem(key: string) {
    if (this.component) {
      const array = [...(this.component.properties[key] as any[]), ''];
      this.updateProperty(key, array);
    }
  }
  
  removeArrayItem(key: string, index: number) {
    if (this.component) {
      const array = [...(this.component.properties[key] as any[])];
      array.splice(index, 1);
      
      this.updateProperty(key, array);
    }
  }
  
  saveChanges() {
    if (this.component) {
      store.dispatch(updateComponent(this.component));
      
      // Dispatch a custom event to notify parent components
      this.dispatchEvent(new CustomEvent('component-updated', {
        detail: { component: this.component },
        bubbles: true,
        composed: true
      }));
    }
  }
}