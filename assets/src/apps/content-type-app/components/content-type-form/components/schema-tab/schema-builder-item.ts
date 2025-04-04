import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PropertySchema } from '../../../../../../types';

@customElement('schema-builder-item')
export class SchemaBuilderItem extends LitElement {
  @property({ type: String }) propertyKey = '';
  @property({ type: Object }) propertySchema: PropertySchema = {
    type: 'string',
    label: '',
  };

  // Local editable state
  private _editedKey = '';
  private _editedSchema: PropertySchema = {
    type: 'string',
    label: '',
  };

  static styles = css`
    :host {
      display: block;
      width: 500px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    .editor-header {
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }

    .editor-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .editor-content {
      padding: 16px;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .form-description {
      font-size: 12px;
      color: #666;
      margin-top: 3px;
    }

    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-checkbox {
      margin-right: 8px;
    }

    .form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background-color: white;
    }

    .options-list {
      margin-top: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .option-item {
      display: flex;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }

    .option-item:last-child {
      border-bottom: none;
    }

    .option-input {
      flex: 1;
      margin-right: 8px;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .option-remove {
      background: none;
      border: none;
      color: #cc0000;
      cursor: pointer;
      font-size: 14px;
      padding: 0 8px;
    }

    .add-option {
      display: block;
      width: 100%;
      padding: 8px;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 8px;
      cursor: pointer;
      text-align: center;
    }

    .add-option:hover {
      background-color: #e0e0e0;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .cancel-btn {
      padding: 8px 16px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .save-btn {
      padding: 8px 16px;
      background-color: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .save-btn:hover {
      background-color: #0055aa;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Initialize the editable state with the current values
    this._editedKey = this.propertyKey;
    this._editedSchema = { ...this.propertySchema };

    // Ensure options array exists if type supports options
    if (this._supportsOptions(this._editedSchema.type) && !this._editedSchema.options) {
      this._editedSchema.options = [];
    }
  }

  render() {
    return html`
      <div class="editor-header">
        <h3 class="editor-title">Edit Property</h3>
      </div>

      <div class="editor-content">
        <div class="form-row">
          <label class="form-label">Property Key</label>
          <input
            type="text"
            class="form-input"
            .value=${this._editedKey}
            @input=${(e: InputEvent) => (this._editedKey = (e.target as HTMLInputElement).value)}
          />
          <div class="form-description">The unique identifier for this property</div>
        </div>

        <div class="form-row">
          <label class="form-label">Type</label>
          <select
            class="form-select"
            .value=${this._editedSchema.type}
            @change=${(e: Event) =>
              this._handleTypeChange((e.target as HTMLSelectElement).value as any)}
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
            <option value="object">Object</option>
            <option value="file">File</option>
          </select>
        </div>

        <div class="form-row">
          <label class="form-label">Label</label>
          <input
            type="text"
            class="form-input"
            .value=${this._editedSchema.label}
            @input=${(e: InputEvent) =>
              this._updateSchemaProperty('label', (e.target as HTMLInputElement).value)}
          />
          <div class="form-description">Display name for this property</div>
        </div>

        <div class="form-row">
          <label class="form-label">
            <input
              type="checkbox"
              class="form-checkbox"
              ?checked=${!!this._editedSchema.required}
              @change=${(e: Event) =>
                this._updateSchemaProperty('required', (e.target as HTMLInputElement).checked)}
            />
            Required
          </label>
          <div class="form-description">Whether this property must have a value</div>
        </div>

        <div class="form-row">
          <label class="form-label">Default Value</label>
          ${this._renderDefaultValueInput()}
          <div class="form-description">The initial value for this property</div>
        </div>

        ${this._supportsOptions(this._editedSchema.type) ? this._renderOptionsSection() : ''}
        ${this._editedSchema.type === 'file' ? this._renderFileExtensions() : ''}

        <div class="button-row">
          <button class="cancel-btn" @click=${this._cancel}>Cancel</button>
          <button class="save-btn" @click=${this._save}>Save</button>
        </div>
      </div>
    `;
  }

  private _renderDefaultValueInput() {
    const type = this._editedSchema.type;

    switch (type) {
      case 'string':
        return html`
          <input
            type="text"
            class="form-input"
            .value=${this._editedSchema.defaultValue || ''}
            @input=${(e: InputEvent) =>
              this._updateSchemaProperty('defaultValue', (e.target as HTMLInputElement).value)}
          />
        `;

      case 'number':
        return html`
          <input
            type="number"
            class="form-input"
            .value=${this._editedSchema.defaultValue || 0}
            @input=${(e: InputEvent) =>
              this._updateSchemaProperty(
                'defaultValue',
                Number((e.target as HTMLInputElement).value)
              )}
          />
        `;

      case 'boolean':
        return html`
          <select
            class="form-select"
            .value=${String(!!this._editedSchema.defaultValue)}
            @change=${(e: Event) =>
              this._updateSchemaProperty(
                'defaultValue',
                (e.target as HTMLSelectElement).value === 'true'
              )}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        `;

      case 'array':
      case 'object':
        return html`
          <textarea
            class="form-input"
            rows="3"
            .value=${JSON.stringify(
              this._editedSchema.defaultValue || (type === 'array' ? [] : {}),
              null,
              2
            )}
            @input=${(e: InputEvent) => this._handleJsonInput(e, 'defaultValue')}
          ></textarea>
        `;

      case 'file':
        return html`<div>File properties do not support default values</div>`;

      default:
        return html`<input type="text" class="form-input" disabled />`;
    }
  }

  private _renderOptionsSection() {
    const options = this._editedSchema.options || [];

    return html`
      <div class="form-row">
        <label class="form-label">Options</label>
        <div class="form-description">Predefined values that can be selected</div>

        <div class="options-list">
          ${options.map(
            (option, index) => html`
              <div class="option-item">
                <input
                  type="text"
                  class="option-input"
                  placeholder="Value"
                  .value=${option.value}
                  @input=${(e: InputEvent) =>
                    this._updateOption(index, 'value', (e.target as HTMLInputElement).value)}
                />
                <input
                  type="text"
                  class="option-input"
                  placeholder="Label"
                  .value=${option.label}
                  @input=${(e: InputEvent) =>
                    this._updateOption(index, 'label', (e.target as HTMLInputElement).value)}
                />
                <button class="option-remove" @click=${() => this._removeOption(index)}>✕</button>
              </div>
            `
          )}
        </div>

        <button class="add-option" @click=${this._addOption}>+ Add Option</button>
      </div>
    `;
  }

  private _renderFileExtensions() {
    return html`
      <div class="form-row">
        <label class="form-label">Allowed Extensions</label>
        <input
          type="text"
          class="form-input"
          placeholder="e.g. jpg, png, pdf (comma separated)"
          .value=${(this._editedSchema.extensions || []).join(', ')}
          @input=${this._handleExtensionsInput}
        />
        <div class="form-description">Comma-separated list of allowed file extensions</div>
      </div>
    `;
  }

  private _handleExtensionsInput(e: InputEvent) {
    const input = (e.target as HTMLInputElement).value;
    const extensions = input
      .split(',')
      .map(ext => ext.trim())
      .filter(ext => ext !== '');

    this._updateSchemaProperty('extensions', extensions);
  }

  private _supportsOptions(type: string): boolean {
    return ['string', 'number'].includes(type);
  }

  private _handleTypeChange(newType: string) {
    // Reset options if changing to a type that doesn't support them
    const updatedSchema: PropertySchema = {
      ...this._editedSchema,
      type: newType as any,
    };

    // Set an appropriate default value for the new type
    updatedSchema.defaultValue = this._getDefaultValueForType(newType);

    // Initialize options if needed
    if (this._supportsOptions(newType as any) && !updatedSchema.options) {
      updatedSchema.options = [];
    }

    // Remove options if not needed
    if (!this._supportsOptions(newType as any)) {
      delete updatedSchema.options;
    }

    // Update the schema
    this._editedSchema = updatedSchema;
    this.requestUpdate();
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

  private _handleJsonInput(e: InputEvent, field: string) {
    const value = (e.target as HTMLTextAreaElement).value;
    try {
      const parsedValue = JSON.parse(value);
      this._updateSchemaProperty(field, parsedValue);
    } catch (error) {
      // If JSON is invalid, we don't update but could show an error message
      console.error('Invalid JSON input:', error);
    }
  }

  private _updateSchemaProperty(key: string, value: any) {
    this._editedSchema = {
      ...this._editedSchema,
      [key]: value,
    };
    this.requestUpdate();
  }

  private _addOption() {
    const options = [...(this._editedSchema.options || [])];
    options.push({ value: '', label: '' });
    this._updateSchemaProperty('options', options);
  }

  private _updateOption(index: number, field: string, value: any) {
    const options = [...(this._editedSchema.options || [])];
    options[index] = { ...options[index], [field]: value };
    this._updateSchemaProperty('options', options);
  }

  private _removeOption(index: number) {
    const options = [...(this._editedSchema.options || [])];
    options.splice(index, 1);
    this._updateSchemaProperty('options', options);
  }

  private _cancel() {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _save() {
    // Validate that key is not empty
    if (!this._editedKey.trim()) {
      alert('Property key cannot be empty');
      return;
    }

    // Validate that label is not empty
    if (!this._editedSchema.label.trim()) {
      alert('Property label cannot be empty');
      return;
    }

    this.dispatchEvent(
      new CustomEvent('save', {
        detail: {
          key: this._editedKey,
          schema: this._editedSchema,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-builder-item': SchemaBuilderItem;
  }
}
