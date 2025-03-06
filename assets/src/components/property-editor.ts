import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../store';
import { Component } from '../types';
import { getComponentMetadata } from './registry';
import { updateComponent } from '../store/pages.slice';

@customElement('cms-property-editor')
export class PropertyEditor extends connect(store)(LitElement) {
  @property({ type: Object })
  component?: Component;

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
      justify-content: flex-end;
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
  `;
  
  render() {
    if (!this.component) {
      return html`<div>No component selected</div>`;
    }
    
    const metadata = getComponentMetadata(this.component.type as any);
    const schema = metadata.propertySchema;
    
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
        
        ${Object.entries(schema).map(([key, field]) => {
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
          <button class="save-button" @click=${this.saveChanges}>Save Changes</button>
        </div>
      </div>
    `;
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