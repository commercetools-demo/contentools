import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../../../components/atoms/button';
import './components/general-tab';
import './components/schema-tab';
import './components/renderer-tab';
import { ContentTypeData } from '../../../../types';
import { TabItem } from '../../../../components/molecules/tabs';
import '../../../../components/molecules/tabs';
import '../../../../components/molecules/tabs/tab-content';
type TabKey = 'general' | 'schema' | 'renderer';

@customElement('content-type-form')
export default class ContentTypeForm extends LitElement {
  @property({ type: Object })
  contentType: ContentTypeData = {
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {},
    },
    deployedUrl: '',
  };

  @property({ type: Boolean })
  isEdit = false;

  @state()
  private _selectedTab: TabKey = 'general';

  @state()
  private _originalContentType: ContentTypeData | null = null;

  private _tabs: TabItem[] = [
    { key: 'general', label: 'General' },
    { key: 'schema', label: 'Schema' },
    { key: 'renderer', label: 'Renderer' },
  ];

  static styles = css`
    .component-form {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 0; /* Remove padding here, add to content */
      margin: 20px;
      overflow: hidden; /* Contain border radius */
    }

    .tab-header {
      width: 100%;
    }

    .tab-button {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background-color: transparent;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px; /* Overlap border */
    }

    .tab-button[active] {
      color: #007bff;
      border-bottom-color: #007bff;
      font-weight: 600;
    }

    .tab-content {
      /* Padding moved from .component-form to here */
      /* The specific tab components also have padding, review if needed */
    }

    .form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin: auto 0;
      padding: 0 10px;
    }
  `;

  firstUpdated() {
    // Store the original content type when component is first initialized
    this._originalContentType = JSON.parse(JSON.stringify(this.contentType));
  }

  render() {
    const isButtonEnabled = this._isFormValid() && this._hasContentTypeChanged();

    return html`
      <div class="component-form">
        <div class="tab-header">
          <ui-tabs
            .tabs="${this._tabs}"
            .selectedTab="${this._selectedTab}"
            @tab-change="${this._selectTab}"
            fullWidth
          >
            <div class="form-buttons" slot="actions">
              <ui-button variant="secondary" size="small" @click="${this._cancelForm}">
                Cancel
              </ui-button>
              <ui-button
                variant="primary"
                size="small"
                ?disabled="${!isButtonEnabled}"
                @click="${this._saveContentType}"
              >
                ${this.isEdit ? 'Update' : 'Add'} Content Type
              </ui-button>
            </div></ui-tabs
          >
        </div>

        <div class="tab-content">${this._renderTabContent()}</div>
      </div>
    `;
  }

  private _renderTabContent() {
    return html`
      <ui-tab-content ?active="${this._selectedTab === 'general'}">
        <general-tab
          .type="${this.contentType.metadata.type}"
          .name="${this.contentType.metadata.name}"
          .icon="${this.contentType.metadata.icon}"
          ?isEdit="${this.isEdit}"
          @general-change="${this._handleGeneralChange}"
        ></general-tab>
      </ui-tab-content>

      <ui-tab-content ?active="${this._selectedTab === 'schema'}">
        <schema-tab
          .propertySchema="${this.contentType.metadata.propertySchema}"
          .defaultProperties="${this.contentType.metadata.defaultProperties}"
          @schema-change="${this._handleSchemaChange}"
        ></schema-tab>
      </ui-tab-content>

      <ui-tab-content ?active="${this._selectedTab === 'renderer'}">
        <renderer-tab
          .deployedUrl="${this.contentType.deployedUrl}"
          @renderer-change="${this._handleRendererChange}"
        ></renderer-tab>
      </ui-tab-content>
    `;
  }

  private _selectTab(e: CustomEvent) {
    const { selectedTab } = e.detail;
    this._selectedTab = selectedTab as TabKey;
  }

  private _handleGeneralChange(e: CustomEvent) {
    const { field, value } = e.detail;
    const updatedMetadata = { ...this.contentType.metadata, [field]: value };
    this._dispatchContentTypeChange({ ...this.contentType, metadata: updatedMetadata });
  }

  private _handleSchemaChange(e: CustomEvent) {
    const { field, value } = e.detail;
    const updatedMetadata = { ...this.contentType.metadata, [field]: value };
    this._dispatchContentTypeChange({ ...this.contentType, metadata: updatedMetadata });
  }

  private _handleRendererChange(e: CustomEvent) {
    const { value } = e.detail;
    this._dispatchContentTypeChange({ ...this.contentType, deployedUrl: value });
  }

  private _dispatchContentTypeChange(contentType: ContentTypeData) {
    // Update internal state first
    this.contentType = contentType;

    // Then dispatch the event
    this.dispatchEvent(
      new CustomEvent('content-type-change', {
        detail: { contentType },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _isFormValid(): boolean {
    // Basic validation: type and name are required
    // We could add JSON validation state here later
    return !!this.contentType.metadata.type && !!this.contentType.metadata.name;
  }

  private _hasContentTypeChanged(): boolean {
    if (!this._originalContentType) return true;

    // Convert both objects to strings for deep comparison
    const currentStr = JSON.stringify(this.contentType);
    const originalStr = JSON.stringify(this._originalContentType);

    return currentStr !== originalStr;
  }

  private _cancelForm() {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _saveContentType() {
    if (!this._isFormValid()) {
      // This check might be redundant if button is disabled, but good practice
      alert('Type and name are required fields');
      return;
    }

    this.dispatchEvent(
      new CustomEvent('save', {
        detail: { contentType: this.contentType },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'content-type-form': ContentTypeForm;
  }
}
