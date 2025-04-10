import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PropertySchema } from '../../../../../../types';
import './schema-builder-item';

@customElement('schema-builder')
export class SchemaBuilder extends LitElement {
  @property({ type: Object }) schemaObject: Record<string, PropertySchema> = {};

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }

    .schema-builder {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .schema-list {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .schema-item {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      background-color: white;
      transition: background-color 0.2s;
    }

    .schema-item:hover {
      background-color: #f9f9f9;
    }

    .schema-item.dragging {
      opacity: 0.5;
      background-color: #f0f0f0;
    }

    .drag-handle {
      cursor: grab;
      margin-right: 12px;
      color: #999;
    }

    .item-label {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .type-badge {
      font-size: 12px;
      background-color: #e0e0e0;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 8px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .edit-btn,
    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .edit-btn {
      color: #0066cc;
    }

    .edit-btn:hover {
      background-color: rgba(0, 102, 204, 0.1);
    }

    .delete-btn {
      color: #cc0000;
    }

    .delete-btn:hover {
      background-color: rgba(204, 0, 0, 0.1);
    }

    .add-property {
      padding: 12px 16px;
      text-align: center;
    }

    .add-btn {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .add-btn:hover {
      background-color: #0055aa;
    }

    .property-types {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      background-color: #f0f0f0;
      border-radius: 4px;
    }

    .property-type-btn {
      background-color: white;
      border: 1px solid #ddd;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .property-type-btn:hover {
      background-color: #f0f0f0;
    }

    .edit-dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  `;

  private _propertyTypeOptions = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
    { value: 'file', label: 'File' },
    { value: 'datasource', label: 'Datasource' },
  ];

  private _editingProperty: string | null = null;
  private _showTypeSelector = false;
  private _draggedItem: string | null = null;

  render() {
    // Sort property entries by order property
    const propertyEntries = Object.entries(this.schemaObject).sort(
      ([, a], [, b]) => (a.order ?? Infinity) - (b.order ?? Infinity)
    );

    return html`
      <div class="schema-builder">
        <div class="add-property">
          <ui-button size="small" @click="${this._toggleTypeSelector}">Add Property</ui-button>
        </div>
        <ul class="schema-list" @dragover="${this._handleDragOver}">
          ${propertyEntries.map(
            ([key, schema]) => html`
              <li
                class="schema-item ${this._draggedItem === key ? 'dragging' : ''}"
                draggable="true"
                @dragstart="${(e: DragEvent) => this._handleDragStart(e, key)}"
                @dragend="${this._handleDragEnd}"
                @drop="${(e: DragEvent) => this._handleDrop(e, key)}"
              >
                <div class="drag-handle">⋮⋮</div>
                <div class="item-label">
                  ${key}
                  <span class="type-badge">${schema.type}</span>
                </div>
                <div class="actions">
                  <button class="edit-btn" @click="${() => this._editProperty(key)}">Edit</button>
                  <button class="delete-btn" @click="${() => this._deleteProperty(key)}">
                    Delete
                  </button>
                </div>
              </li>
            `
          )}
        </ul>
      </div>

      ${this._editingProperty
        ? html`
            <div class="edit-dialog">
              <schema-builder-item
                .propertyKey="${this._editingProperty}"
                .propertySchema="${this.schemaObject[this._editingProperty]}"
                @save="${this._handlePropertySave}"
                @cancel="${this._closeEditDialog}"
              ></schema-builder-item>
            </div>
          `
        : ''}
      ${this._showTypeSelector
        ? html`
            <div class="edit-dialog">
              <div class="property-types">
                ${this._propertyTypeOptions.map(
                  type => html`
                    <ui-button
                      @click="${() => this._addNewProperty(type.value)}"
                    >
                      ${type.label}
                    </ui-button>
                  `
                )}
              </div>
            </div>
          `
        : ''}
    `;
  }

  private _toggleTypeSelector() {
    this._showTypeSelector = !this._showTypeSelector;
    this.requestUpdate();
  }

  private _addNewProperty(type: string) {
    const newKey = `property${Object.keys(this.schemaObject).length + 1}`;
    // Find the maximum order and add 10 to it
    const maxOrder = Object.values(this.schemaObject).reduce(
      (max, schema) => Math.max(max, schema.order ?? 0),
      0
    );

    const newSchema: PropertySchema = {
      type: type as any,
      label: `New ${type} Property`,
      defaultValue: this._getDefaultValueForType(type),
      order: maxOrder + 10,
    };

    this._dispatchSchemaChange({
      ...this.schemaObject,
      [newKey]: newSchema,
    });

    this._showTypeSelector = false;
    // Open the editor immediately for the new property
    setTimeout(() => {
      this._editProperty(newKey);
    }, 0);
  }

  private _getDefaultValueForType(type: string): any {
    switch (type) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'array':
        return [];
      case 'object':
        return {};
      case 'file':
        return null;
      default:
        return null;
    }
  }

  private _editProperty(key: string) {
    this._editingProperty = key;
    this.requestUpdate();
  }

  private _closeEditDialog() {
    this._editingProperty = null;
    this.requestUpdate();
  }

  private _handlePropertySave(e: CustomEvent) {
    const { key, schema } = e.detail;
    const oldKey = this._editingProperty;

    if (!oldKey) return;

    // Create new schema object with updated or renamed property
    const newSchemaObject = { ...this.schemaObject };

    // If key has changed, delete the old key and add with new key
    if (oldKey !== key) {
      // Preserve the order when renaming
      const oldOrder = newSchemaObject[oldKey].order;
      delete newSchemaObject[oldKey];
      newSchemaObject[key] = {
        ...schema,
        order: oldOrder,
      };
    } else {
      // Preserve the order when updating other properties
      newSchemaObject[key] = {
        ...schema,
        order: newSchemaObject[key].order,
      };
    }

    // Dispatch updated schema
    this._dispatchSchemaChange(newSchemaObject);
    this._closeEditDialog();
  }

  private _deleteProperty(key: string) {
    const newSchemaObject = { ...this.schemaObject };
    delete newSchemaObject[key];
    this._dispatchSchemaChange(newSchemaObject);
  }

  // Drag and drop functionality
  private _handleDragStart(e: DragEvent, key: string) {
    this._draggedItem = key;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', key);
    }
    this.requestUpdate();
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }

  private _handleDrop(e: DragEvent, targetKey: string) {
    e.preventDefault();
    if (!this._draggedItem || this._draggedItem === targetKey) return;

    // Get the dragged item's key
    const sourceKey = this._draggedItem;

    // Get current sorted entries
    const sortedEntries = Object.entries(this.schemaObject).sort(
      ([, a], [, b]) => (a.order ?? Infinity) - (b.order ?? Infinity)
    );

    // Find indices
    const sourceIndex = sortedEntries.findIndex(([key]) => key === sourceKey);
    const targetIndex = sortedEntries.findIndex(([key]) => key === targetKey);

    if (sourceIndex === -1 || targetIndex === -1) return;

    // Create new schema object with updated orders
    const newSchemaObject = { ...this.schemaObject };

    // Determine the new order value
    let newOrder: number;

    if (sourceIndex > targetIndex) {
      // Moving up
      const targetOrder = sortedEntries[targetIndex][1].order ?? 0;
      const prevOrder = targetIndex > 0 ? (sortedEntries[targetIndex - 1][1].order ?? 0) : 0;
      newOrder = prevOrder + (targetOrder - prevOrder) / 2;
    } else {
      // Moving down
      const targetOrder = sortedEntries[targetIndex][1].order ?? 0;
      const nextOrder =
        targetIndex < sortedEntries.length - 1
          ? (sortedEntries[targetIndex + 1][1].order ?? 0)
          : targetOrder + 20;
      newOrder = targetOrder + (nextOrder - targetOrder) / 2;
    }

    // Update the order of the dragged item
    newSchemaObject[sourceKey] = {
      ...newSchemaObject[sourceKey],
      order: newOrder,
    };

    // Dispatch updated schema
    this._dispatchSchemaChange(newSchemaObject);

    this._draggedItem = null;
    this.requestUpdate();
  }

  private _handleDragEnd() {
    // Clear the dragged item reference
    this._draggedItem = null;
    this.requestUpdate();
  }

  private _dispatchSchemaChange(newSchemaObject: Record<string, PropertySchema>) {
    // Pass the object directly without converting to JSON string
    this.dispatchEvent(
      new CustomEvent('schema-change', {
        detail: { field: 'propertySchema', value: newSchemaObject },
        bubbles: true,
        composed: true,
      })
    );

    // Update local state
    this.schemaObject = newSchemaObject;
  }

  private _ensureOrderValues() {
    // Check if any property is missing an order value
    const needsOrderValues = Object.values(this.schemaObject).some(
      schema => schema.order === undefined
    );

    if (needsOrderValues) {
      // Get existing entries in the current order
      const entries = Object.entries(this.schemaObject);
      const newSchemaObject = { ...this.schemaObject };

      // Assign incrementing order values (0, 10, 20, etc.)
      entries.forEach(([key, schema], index) => {
        if (schema.order === undefined) {
          newSchemaObject[key] = {
            ...schema,
            order: index * 10,
          };
        }
      });

      // Update the schema without triggering an event
      // Just update internal state - no event dispatch
      this.schemaObject = newSchemaObject;

      // Schedule a re-render
      this.requestUpdate();
    }
  }

  updated(changedProperties: Map<string, any>) {
    // Check if schemaObject property changed
    if (changedProperties.has('schemaObject')) {
      // Ensure all properties have order values
      this._ensureOrderValues();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-builder': SchemaBuilder;
  }
}
