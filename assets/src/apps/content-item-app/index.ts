import { LitElement, css, html } from 'lit';
import { connect, watch } from 'lit-redux-watch';
import { customElement, property, state } from 'lit/decorators.js';
import '../../components/atoms/button';
import '../../components/atoms/labeled-input';
import '../../components/atoms/table';
import { store } from '../../store';
import {
  clearError,
  createContentItem,
  deleteContentItem,
  fetchContentItems,
  updateContentItem,
} from '../../store/content-item.slice';
import { ContentItem, ContentTypeData, ContentTypeMetaData } from '../../types';
import { getAllContentTypesMetaData } from '../../utils/content-type-utility';
import '../shared/components/property-editor';
import './components/content-type-modal';
import './components/content-item-list';
import './components/content-item-editor';
@customElement('content-item-app')
export class ContentItemApp extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @state()
  private view: 'list' | 'editor' | 'new' = 'list';

  @state()
  private selectedItem: ContentItem | null = null;

  @state()
  private showContentTypeModal = false;

  @state()
  private contentTypesMetaData: ContentTypeMetaData[] = [];

  @watch('contentItem.items')
  private items: ContentItem[] = [];

  @watch('contentItem.loading')
  private loading = false;

  @watch('contentItem.error')
  private error: string | null = null;

  stateChanged(state: any) {
    this.contentTypesMetaData = state.contentType.contentTypes.map(
      (contentType: ContentTypeData) => contentType.metadata
    );
  }
  get hydratedUrl() {
    return `${this.baseURL}/${this.businessUnitKey}`;
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .title {
      font-size: 24px;
      margin: 0;
    }

    .content {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    .error {
      color: red;
      margin-bottom: 20px;
    }

    .loading {
      text-align: center;
      padding: 20px;
    }

    .back-button {
      margin-bottom: 20px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadItems();
    this.loadContentTypes();
  }

  async loadItems() {
    store.dispatch(clearError());
    store.dispatch(fetchContentItems(this.hydratedUrl));
  }

  async loadContentTypes() {
    try {
      this.contentTypesMetaData = await getAllContentTypesMetaData({ baseURL: this.baseURL });
      this.loading = false;
      // Set up drag events after component types are loaded and rendered
      this.requestUpdate();
    } catch (err) {
      this.error = `Failed to load component types: ${err instanceof Error ? err.message : String(err)}`;
      this.loading = false;
      console.error('Error loading component types:', err);
    }
  }

  async handleSave(item: { component: ContentItem }) {
    store.dispatch(clearError());
    if (item) {
      const component = {
        ...this.selectedItem,
        ...item.component,
      };
      if (component) {
        console.log('handleSave', component);

        if (this.view === 'new') {
          store.dispatch(
            createContentItem({
              baseURL: this.hydratedUrl,
              businessUnitKey: this.businessUnitKey,
              item: component,
            })
          );

          this.view = 'list';
        } else {
          await store.dispatch(
            updateContentItem({ baseURL: this.hydratedUrl, key: component.key, item: component })
          );
        }
        store.dispatch(fetchContentItems(this.hydratedUrl));
      }
    } else {
      console.error('No item to save');
    }
  }

  async handleDelete(key: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    store.dispatch(clearError());
    await store.dispatch(deleteContentItem({ baseURL: this.hydratedUrl, key: key }));
    store.dispatch(fetchContentItems(this.hydratedUrl));
  }

  private handleContentTypeSelect(contentTypeMetaData: ContentTypeMetaData) {
    this.showContentTypeModal = false;
    this.view = 'new';
    this.selectedItem = {
      type: contentTypeMetaData.type,
      name: '',
      properties: contentTypeMetaData.defaultProperties,
      businessUnitKey: this.businessUnitKey,
    } as ContentItem;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    if (this.view === 'editor' || this.view === 'new') {
      return html`
        <content-item-editor
          .item="${this.selectedItem}"
          .baseURL="${this.baseURL}"
          .businessUnitKey="${this.businessUnitKey}"
          .isNew="${this.view === 'new'}"
          @back="${() => {
            this.view = 'list';
            this.selectedItem = null;
          }}"
          @save="${(e: CustomEvent) => this.handleSave(e.detail)}"
        ></content-item-editor>
      `;
    }

    return html`
      <div>
        <content-item-list
          .items="${this.items}"
          .baseURL="${this.baseURL}"
          .businessUnitKey="${this.businessUnitKey}"
          .loading="${this.loading}"
          .error="${this.error}"
          @create-new="${() => {
            this.showContentTypeModal = true;
          }}"
          @edit="${(e: CustomEvent) => {
            this.view = 'editor';
            this.selectedItem = e.detail;
          }}"
          @delete="${(e: CustomEvent) => this.handleDelete(e.detail)}"
        ></content-item-list>

        <content-type-modal
          .contentTypesMetaData="${this.contentTypesMetaData}"
          .open="${this.showContentTypeModal}"
          @close="${() => (this.showContentTypeModal = false)}"
          @select="${(e: CustomEvent) => this.handleContentTypeSelect(e.detail)}"
        ></content-type-modal>
      </div>
    `;
  }
}
