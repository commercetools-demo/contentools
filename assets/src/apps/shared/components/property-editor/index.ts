import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../../store';
import { ContentItem, ContentTypeMetaData } from '../../../../types';
import { getContentTypeMetaData } from '../../../../utils/content-type-utility';
import { removeComponent } from '../../../../store/pages.slice';
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

  @property({ type: Boolean })
  isContentVersion: boolean = false;

  @property({ type: Object })
  versionedContent: ContentItem | null = null;

  @state()
  private _component?: ContentItem;

  @state()
  private metadata?: ContentTypeMetaData | null;

  @state()
  private loading = false;

  @state()
  private error?: string;

  @state()
  private showDeleteConfirm = false;

  @state()
  private diff: string[] = [];

  private _debouncedHandleFieldChange = debounce((key: string, value: any) => {
    if (this._component) {
      if (key === 'name') {
        this._component = {
          ...this._component,
          name: value,
        };
      } else {
        this._component = {
          ...this._component,
          properties: {
            ...this._component.properties,
            [key]: value,
          },
        };
      }
      this.requestUpdate();
    }
  }, 500);

  static styles = css`
    .property-editor {
      padding: var(--property-editor__property-editor__padding, 20px 0);
    }

    h2 {
      font-size: var(--property-editor__h2__font-size, 18px);
      margin-top: var(--property-editor__h2__margin-top, 0);
      margin-bottom: var(--property-editor__h2__margin-bottom, 20px);
      padding-bottom: var(--property-editor__h2__padding-bottom, 10px);
      border-bottom: var(--property-editor__h2__border-bottom, 1px solid #ddd);
    }

    .actions {
      margin-top: var(--property-editor__actions__margin-top, 20px);
      display: var(--property-editor__actions__display, flex);
      justify-content: var(--property-editor__actions__justify-content, space-between);
    }

    .save-button {
      background: var(--property-editor__save-button__background, #2196f3);
      color: var(--property-editor__save-button__color, white);
      border: var(--property-editor__save-button__border, none);
      border-radius: var(--property-editor__save-button__border-radius, 4px);
      padding: var(--property-editor__save-button__padding, 8px 15px);
      cursor: var(--property-editor__save-button__cursor, pointer);
      font-size: var(--property-editor__save-button__font-size, 14px);
    }

    .delete-button {
      background: var(--property-editor__delete-button__background, #f44336);
      color: var(--property-editor__delete-button__color, white);
      border: var(--property-editor__delete-button__border, none);
      border-radius: var(--property-editor__delete-button__border-radius, 4px);
      padding: var(--property-editor__delete-button__padding, 8px 15px);
      cursor: var(--property-editor__delete-button__cursor, pointer);
      font-size: var(--property-editor__delete-button__font-size, 14px);
    }

    .delete-confirm-dialog {
      position: var(--property-editor__delete-confirm-dialog__position, fixed);
      top: var(--property-editor__delete-confirm-dialog__top, 0);
      left: var(--property-editor__delete-confirm-dialog__left, 0);
      right: var(--property-editor__delete-confirm-dialog__right, 0);
      bottom: var(--property-editor__delete-confirm-dialog__bottom, 0);
      background: var(--property-editor__delete-confirm-dialog__background, rgba(0, 0, 0, 0.5));
      display: var(--property-editor__delete-confirm-dialog__display, flex);
      align-items: var(--property-editor__delete-confirm-dialog__align-items, center);
      justify-content: var(--property-editor__delete-confirm-dialog__justify-content, center);
      z-index: var(--property-editor__delete-confirm-dialog__z-index, 1000);
    }

    .dialog-content {
      background: var(--property-editor__dialog-content__background, white);
      padding: var(--property-editor__dialog-content__padding, 20px);
      border-radius: var(--property-editor__dialog-content__border-radius, 4px);
      max-width: var(--property-editor__dialog-content__max-width, 400px);
      width: var(--property-editor__dialog-content__width, 100%);
    }

    .dialog-title {
      font-size: var(--property-editor__dialog-title__font-size, 18px);
      margin-top: var(--property-editor__dialog-title__margin-top, 0);
      margin-bottom: var(--property-editor__dialog-title__margin-bottom, 15px);
    }

    .dialog-buttons {
      display: var(--property-editor__dialog-buttons__display, flex);
      justify-content: var(--property-editor__dialog-buttons__justify-content, flex-end);
      margin-top: var(--property-editor__dialog-buttons__margin-top, 20px);
      gap: var(--property-editor__dialog-buttons__gap, 10px);
    }

    .dialog-buttons button {
      margin-left: var(--property-editor__dialog-buttons-button__margin-left, 10px);
      padding: var(--property-editor__dialog-buttons-button__padding, 8px 15px);
      border: var(--property-editor__dialog-buttons-button__border, none);
      border-radius: var(--property-editor__dialog-buttons-button__border-radius, 4px);
      cursor: var(--property-editor__dialog-buttons-button__cursor, pointer);
    }

    .cancel-button {
      background: var(--property-editor__cancel-button__background, #9e9e9e);
      color: var(--property-editor__cancel-button__color, white);
    }

    .confirm-button {
      background: var(--property-editor__confirm-button__background, #f44336);
      color: var(--property-editor__confirm-button__color, white);
    }
  `;

  updated(changedProperties: Map<string, any>) {
    if (
      (changedProperties.has('component') && this.component) ||
      changedProperties.has('versionedContent')
    ) {
      if (this.versionedContent) {
        // Copy component to _component when component changes
        this._component = JSON.parse(JSON.stringify(this.versionedContent));
      } else {
        // Copy component to _component when component changes
        this._component = JSON.parse(JSON.stringify(this.component));
      }
      this.diff = this._calculateDiff();
      this.fetchMetadata();
    }
  }

  async fetchMetadata() {
    if (!this._component) return;

    this.loading = true;
    this.error = undefined;

    try {
      this.metadata = await getContentTypeMetaData({
        baseURL: this.baseURL,
        type: this._component.type as any,
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
    if (!this._component) {
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
        <h2>${this._component.name}</h2>
        <slot name="before-fields"></slot>

        <cms-string-field
          label="Name"
          .value="${this._component.name || ''}"
          .highlight="${this.diff.includes('name')}"
          fieldKey="name"
          ?required="${true}"
          @field-change="${this.handleFieldChange}"
        ></cms-string-field>
        ${Object.entries(schema).map(([key, field]: [string, any]) => {
          const value = this._component!.properties[key];

          switch (field.type) {
            case 'string':
              if (this._component && this._component.type === 'richText' && key === 'content') {
                return html`
                  <cms-wysiwyg-field
                    label="${field.label}"
                    .highlight="${this.diff.includes(key)}"
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
                  .highlight="${this.diff.includes(key)}"
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
                  .highlight="${this.diff.includes(key)}"
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
                  .highlight="${this.diff.includes(key)}"
                  fieldKey="${key}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'array':
              return html`
                <cms-array-field
                  label="${field.label}"
                  .value="${value || []}"
                  .highlight="${this.diff.includes(key)}"
                  fieldKey="${key}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'file':
              return html`
                <cms-file-field
                  label="${field.label}"
                  .value="${value}"
                  .highlight="${this.diff.includes(key)}"
                  fieldKey="${key}"
                  .baseURL="${this.baseURL}"
                  .businessUnitKey="${this.businessUnitKey}"
                  .extensions="${field.extensions || []}"
                  @field-change="${this.handleFieldChange}"
                />
              `;
            case 'datasource':
              return html`
                <cms-datasource-field
                  label="${field.label}"
                  .value="${value || {}}"
                  .highlight="${this.diff.includes(key)}"
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
            Are you sure you want to delete the component "${this._component?.name}"? This action
            cannot be undone.
          </p>
          <div class="dialog-buttons">
            <ui-button variant="outline" @click="${() => (this.showDeleteConfirm = false)}">
              Cancel
            </ui-button>
            <ui-button variant="critical" @click="${this.deleteComponent}">Delete</ui-button>
          </div>
        </div>
      </div>
    `;
  }

  _calculateDiff() {
    if (!this.versionedContent) return [];

    const nameDiff = this.versionedContent.name !== this.component?.name ? ['name'] : [];

    const diff = Object.keys(this.versionedContent.properties).filter(key => {
      // deep compare
      return (
        JSON.stringify(this.versionedContent?.properties[key]) !==
        JSON.stringify(this.component?.properties[key])
      );
    });
    return [...nameDiff, ...diff].filter(Boolean);
  }

  showDeleteConfirmation() {
    this.showDeleteConfirm = true;
  }

  deleteComponent() {
    if (this._component) {
      store.dispatch(removeComponent(this._component.id));

      // Close the dialog
      this.showDeleteConfirm = false;

      // Dispatch a custom event to notify parent components
      this.dispatchEvent(
        new CustomEvent('component-deleted', {
          detail: { componentId: this._component.id },
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

  async saveChanges() {
    if (this._component) {
      // Dispatch a custom event to notify parent components
      this.dispatchEvent(
        new CustomEvent('component-updated', {
          detail: { component: this._component },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
