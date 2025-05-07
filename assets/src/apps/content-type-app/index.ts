import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { connect, watch } from 'lit-redux-watch';
import { store } from '../../store';
import { ContentTypeData } from '../../types';
import {
  fetchContentTypesThunk,
  addContentTypeThunk,
  updateContentTypeThunk,
  removeContentTypeThunk,
} from '../../store/content-type.slice';
import '../content-type-registry/sample-content-type-renderers';
import './components/content-type-form';
import './components/content-type-table';
import './components/content-type-header';
import './components/error-message';

@customElement('content-type-app')
export class ContentTypeApp extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @watch('contentType.contentTypes')
  contentTypes: ContentTypeData[] = [];

  @watch('contentType.loading')
  loading = false;

  @watch('contentType.error')
  error: string | null = null;

  @state()
  private selectedContentType: ContentTypeData | null = null;

  @state()
  private isAddingContentType = false;

  @state()
  private newContentType: ContentTypeData = {
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {},
    },
    deployedUrl: '',
  };

  static styles = css`
    :host {
      display: var(--content-type-app__host__display, block);
      font-family: var(--content-type-app__host__font-family, system-ui, sans-serif);
      width: var(--content-type-app__host__width, 100%);
      height: var(--content-type-app__host__height, 100%);
    }

    .content-type-container {
      display: var(--content-type-app__content-type-container__display, flex);
      flex-direction: var(--content-type-app__content-type-container__flex-direction, column);
      height: var(--content-type-app__content-type-container__height, 100%);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(fetchContentTypesThunk({ baseURL: this.baseURL }));
  }

  render() {
    return html`
      <div class="content-type-container">
        <content-type-header
          .hideAddButton="${this.isAddingContentType || this.selectedContentType}"
          @add-content-type="${this._toggleAddContentType}"
        ></content-type-header>

        <error-message .message="${this.error}"></error-message>

        ${this.isAddingContentType || this.selectedContentType
          ? html`
              <content-type-form
                .contentType="${this.selectedContentType || this.newContentType}"
                .isEdit="${!!this.selectedContentType}"
                .baseURL="${this.baseURL}"
                @content-type-change="${this._handleContentTypeChange}"
                @cancel="${this._cancelForm}"
                @save="${this._saveContentType}"
              ></content-type-form>
            `
          : html`
              <content-type-table
                .contentTypes="${this.contentTypes}"
                .loading="${this.loading}"
                @edit="${this._handleEditContentType}"
                @remove="${this._handleRemoveContentType}"
              ></content-type-table>
            `}
      </div>
    `;
  }

  private _toggleAddContentType() {
    this.isAddingContentType = !this.isAddingContentType;
    this.selectedContentType = null;
    this.dispatchEvent(
      new CustomEvent('edit-content-type', {
        detail: { view: 'new' },
        bubbles: true,
        composed: true,
      })
    );

    // Reset form
    if (this.isAddingContentType) {
      this.newContentType = {
        metadata: {
          type: '',
          name: '',
          icon: '',
          defaultProperties: {},
          propertySchema: {},
        },
        deployedUrl: '',
      };
    }
  }

  private _handleContentTypeChange(e: CustomEvent) {
    const { contentType } = e.detail;

    if (this.selectedContentType) {
      this.selectedContentType = contentType;
    } else {
      this.newContentType = contentType;
    }
  }

  private _handleEditContentType(e: CustomEvent) {
    const { contentType } = e.detail;
    this.selectedContentType = JSON.parse(JSON.stringify(contentType)); // Clone to avoid direct mutation
    this.isAddingContentType = false;
    this.dispatchEvent(
      new CustomEvent('edit-content-type', {
        detail: { view: 'editor' },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleRemoveContentType(e: CustomEvent) {
    const { type } = e.detail;
    store.dispatch(removeContentTypeThunk({ baseURL: this.baseURL, key: type }));
  }

  private _cancelForm() {
    this.isAddingContentType = false;
    this.selectedContentType = null;
  }

  private _saveContentType(e: CustomEvent) {
    const { contentType } = e.detail;

    if (this.selectedContentType) {
      // Update existing contentType
      store.dispatch(
        updateContentTypeThunk({
          baseURL: this.baseURL,
          key: contentType.metadata.type,
          contentType,
        })
      );
    } else {
      // Add new contentType
      store.dispatch(addContentTypeThunk({ baseURL: this.baseURL, contentType }));
    }

    this.isAddingContentType = false;
    this.selectedContentType = null;
  }
}

export default ContentTypeApp;
