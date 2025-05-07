import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContentItem } from '../../types';
import {
  fetchPreviewContentItemEndpoint,
  fetchPublishedContentItemEndpoint,
} from '../../utils/api';
import '../shared/components/component-renderer/component-renderer';
import { fetchContentTypesThunk } from '../../store/content-type.slice';
import { store } from '../../store';
@customElement('content-item-renderer')
export class ContentItemRenderer extends LitElement {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = '/service';

  @property({ type: String, attribute: 'business-unit-key' })
  businessUnitKey = '';

  @property({ type: String, attribute: 'key' })
  key = '';

  @property({ type: String, attribute: 'state' })
  state = 'published';

  @property({ type: String, attribute: 'locale' })
  locale = 'en-US';

  @state()
  private contentItem: ContentItem | null = null;

  @state()
  private loading = false;

  @state()
  private error: string | null = null;

  @state()
  private registryLoaded = false;

  static styles = css`
    :host {
      display: var(--content-item-renderer__host__display, block);
      width: var(--content-item-renderer__host__width, 100%);
      height: var(--content-item-renderer__host__height, 100%);
      font-family: var(--content-item-renderer__host__font-family, system-ui, sans-serif);
    }

    .loading {
      display: var(--content-item-renderer__loading__display, flex);
      align-items: var(--content-item-renderer__loading__align-items, center);
      justify-content: var(--content-item-renderer__loading__justify-content, center);
      height: var(--content-item-renderer__loading__height, 100px);
    }

    .error {
      padding: var(--content-item-renderer__error__padding, 15px);
      background-color: var(--content-item-renderer__error__background-color, #ffebee);
      border-radius: var(--content-item-renderer__error__border-radius, 4px);
      color: var(--content-item-renderer__error__color, #e53935);
      margin-bottom: var(--content-item-renderer__error__margin-bottom, 20px);
    }

    .warning {
      padding: var(--content-item-renderer__warning__padding, 15px);
      background-color: var(--content-item-renderer__warning__background-color, #fff3cd);
      color: var(--content-item-renderer__warning__color, #856404);
      border-radius: var(--content-item-renderer__warning__border-radius, 4px);
      margin-bottom: var(--content-item-renderer__warning__margin-bottom, 20px);
      border: var(--content-item-renderer__warning__border, 1px solid #ffeeba);
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    if (!this.businessUnitKey) {
      this.error =
        'The "business-unit-key" attribute is required for the CMS renderer to function properly.';
      return;
    }

    if (!this.key) {
      this.error =
        'The "key" attribute is required for the content item renderer to function properly.';
      return;
    }

    // After registry is loaded, load the page
    this.loadRegistryComponents();
  }

  private async loadRegistryComponents() {
    try {
      // Dispatch the fetch action
      await store.dispatch(fetchContentTypesThunk({ baseURL: this.baseURL }));
      this.registryLoaded = true;

      // Hydrate the baseURL with businessUnitKey
      const hydratedBaseUrl = `${this.baseURL}/${this.businessUnitKey}`;

      // After registry is loaded, load the page
      this.loadContentItem(hydratedBaseUrl);
    } catch (error) {
      this.error = `Failed to load registry components: ${(error as Error).message}`;
      console.error('Failed to load registry components:', error);
    }
  }

  private async loadContentItem(baseUrl: string) {
    this.loading = true;
    this.error = null;

    try {
      if (this.key) {
        // Load by key
        const response =
          this.state === 'published'
            ? await fetchPublishedContentItemEndpoint<ContentItem>(baseUrl, this.key)
            : await fetchPreviewContentItemEndpoint<ContentItem>(baseUrl, this.key);
        this.contentItem = response;
      }
    } catch (error) {
      this.error = `Failed to load content item: ${(error as Error).message}`;
      console.error('Failed to load content item:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.error) {
      console.error(this.error);
      return null;
    }

    if (this.loading || !this.registryLoaded) {
      return null;
    }

    if (!this.contentItem) {
      return null;
    }

    return html`
      <component-renderer
        .component="${this.contentItem}"
        .baseURL="${this.baseURL}"
        .locale="${this.locale}"
      ></component-renderer>
    `;
  }
}

export default ContentItemRenderer;
