import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../../store';
import { ContentItem, ContentTypeMetaData } from '../../../../types';
import { getContentTypeMetaData } from '../../../../utils/content-type-utility';
import { updateComponent, removeComponent } from '../../../../store/pages.slice';
import { debounce } from '../../../../utils/debounce';
import './components/string-field';
import './components/number-field';
import './components/boolean-field';
import './components/array-field';
import './components/file-field';
import './components/wysiwyg-field';
import './components/datasource-field';
import '../../../../components/atoms/button';
import '../../../../components/atoms/labeled-input';
@customElement('cms-property-editor')
export class PropertyEditor extends connect(store)(LitElement) {
  @property({ type: Object })
  component?: ContentItem;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @state()
  private metadata?: ContentTypeMetaData | null;

  @state()
  private loading = false;

  @state()
  private error?: string;

  @state()
  private showDeleteConfirm = false;

  private _debouncedHandleFieldChange = debounce((key: string, value: any) => {
    if (this.component) {
      if (key === 'name') {
        this.component = {
          ...this.component,
          name: value,
        };
      } else {
        this.component = {
          ...this.component,
          properties: {
            ...this.component.properties,
            [key]: value,
          },
        };
      }
      this.requestUpdate();
    }
  }, 500);

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

    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    .save-button {
      background: #2196f3;
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
      this.metadata = await getContentTypeMetaData({
        baseURL: this.baseURL,
        type: this.component.type as any,
      });
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
        <slot name="before-fields"></slot>

        <cms-string-field
          label="Name"
          .value="${this.component.name || ''}"
          fieldKey="name"
          ?required="${true}"
          @field-change="${this.handleFieldChange}"
        ></cms-string-field>
        ${Object.entries(schema).map(([key, field]: [string, any]) => {
          const value = this.component!.properties[key];

          switch (field.type) {
            case 'string':
              if (this.component && this.component.type === 'richText' && key === 'content') {
                return html`
                  <cms-wysiwyg-field
                    label="${field.label}"
                    .value="${value || ''}"
                    fieldKey="${key}"
                    ?required="${field.required}"
                    @field-change="${this.handleFieldChange}"
                  />
                `;
              }
              return html`
                <cms-string-field
                  label="${field.label}"
                  .value="${value || ''}"
                  fieldKey="${key}"
                  ?required="${field.required}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'number':
              return html`
                <cms-number-field
                  label="${field.label}"
                  .value="${value}"
                  fieldKey="${key}"
                  ?required="${field.required}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'boolean':
              return html`
                <cms-boolean-field
                  label="${field.label}"
                  .value="${value}"
                  fieldKey="${key}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'array':
              return html`
                <cms-array-field
                  label="${field.label}"
                  .value="${value || []}"
                  fieldKey="${key}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'file':
              return html`
                <cms-file-field
                  label="${field.label}"
                  .value="${value}"
                  fieldKey="${key}"
                  .baseURL="${this.baseURL}"
                  .extensions="${field.extensions || []}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'datasource':
              return html`
                <cms-datasource-field
                  label="${field.label}"
                  .value="${value || {}}"
                  fieldKey="${key}"
                  datasourceType="${field.datasourceType}"
                  .baseURL="${this.baseURL}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            default:
              return html`<div>Unsupported field type: ${field.type}</div>`;
          }
        })}

        <slot name="after-fields"></slot>

        <div class="actions">
          <ui-button variant="critical" @click="${this.showDeleteConfirmation}">
            Delete Component
          </ui-button>
          <ui-button @click="${this.saveChanges}">Save Changes</ui-button>
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
          <p>
            Are you sure you want to delete the component "${this.component?.name}"? This action
            cannot be undone.
          </p>
          <div class="dialog-buttons">
            <button class="cancel-button" @click="${() => (this.showDeleteConfirm = false)}">
              Cancel
            </button>
            <button class="confirm-button" @click="${this.deleteComponent}">Delete</button>
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
      this.dispatchEvent(
        new CustomEvent('component-deleted', {
          detail: { componentId: this.component.id },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  handleFieldChange(e: CustomEvent) {
    const { key, value } = e.detail;
    this._debouncedHandleFieldChange(key, value);
  }

  saveChanges() {
    if (this.component) {
      store.dispatch(updateComponent(this.component));

      // Dispatch a custom event to notify parent components
      this.dispatchEvent(
        new CustomEvent('component-updated', {
          detail: { component: this.component },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
