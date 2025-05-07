import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../../store';
import { fetchContentTypesThunk } from '../../store/content-type.slice';
import { Page } from '../../types';
import { fetchPageEndpoint, fetchPagesEdnpoint } from '../../utils/api';
import '../content-type-registry/sample-content-type-renderers';
import './grid-renderer';

@customElement('cms-renderer')
export class CmsRenderer extends LitElement {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = '/service';

  @property({ type: String, attribute: 'business-unit-key' })
  businessUnitKey = '';

  @property({ type: String, attribute: 'route' })
  route = '';

  @property({ type: String, attribute: 'key' })
  key = '';

  @property({ type: String, attribute: 'locale' })
  locale = '';

  @property({ type: Array })
  availableLocales: string[] = [];

  @state()
  private page: Page | null = null;

  @state()
  private loading = false;

  @state()
  private error: string | null = null;

  @state()
  private registryLoaded = false;

  static styles = css`
    :host {
      display: var(--cms-renderer__host__display, block);
      width: var(--cms-renderer__host__width, 100%);
      height: var(--cms-renderer__host__height, 100%);
      font-family: var(--cms-renderer__host__font-family, system-ui, sans-serif);
    }

    .loading {
      display: var(--cms-renderer__loading__display, flex);
      align-items: var(--cms-renderer__loading__align-items, center);
      justify-content: var(--cms-renderer__loading__justify-content, center);
      height: var(--cms-renderer__loading__height, 100px);
    }

    .error {
      padding: var(--cms-renderer__error__padding, 15px);
      background-color: var(--cms-renderer__error__background-color, #ffebee);
      border-radius: var(--cms-renderer__error__border-radius, 4px);
      color: var(--cms-renderer__error__color, #e53935);
      margin-bottom: var(--cms-renderer__error__margin-bottom, 20px);
    }

    .warning {
      padding: var(--cms-renderer__warning__padding, 15px);
      background-color: var(--cms-renderer__warning__background-color, #fff3cd);
      color: var(--cms-renderer__warning__color, #856404);
      border-radius: var(--cms-renderer__warning__border-radius, 4px);
      margin-bottom: var(--cms-renderer__warning__margin-bottom, 20px);
      border: var(--cms-renderer__warning__border, 1px solid #ffeeba);
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    if (!this.businessUnitKey) {
      this.error =
        'The "business-unit-key" attribute is required for the CMS renderer to function properly.';
      return;
    }

    if (!this.key && !this.route) {
      this.error = 'Either "key" or "route" attribute must be provided to render content.';
      return;
    }

    // Load registry components first
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
      this.loadPage(hydratedBaseUrl);
    } catch (error) {
      this.error = `Failed to load registry components: ${(error as Error).message}`;
      console.error('Failed to load registry components:', error);
    }
  }

  private async loadPage(baseUrl: string) {
    this.loading = true;
    this.error = null;

    try {
      if (this.key) {
        // Load by key
        const response = await fetchPageEndpoint<Page>(baseUrl, this.key);
        this.page = response.value;
      } else if (this.route) {
        // Load all pages
        const responses = await fetchPagesEdnpoint<Page>(baseUrl);
        const pages = responses.map(res => res.value);
        this.page = pages.find(page => page.route === this.route) || null;

        if (!this.page) {
          console.warn(`No page found for route: ${this.route}`);
        }
      }
    } catch (error) {
      this.error = `Failed to load page: ${(error as Error).message}`;
      console.error('Failed to load page:', error);
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

    if (!this.page) {
      return null;
    }

    return html`
      <grid-renderer
        .rows="${this.page.layout.rows}"
        .components="${this.page.components}"
        .baseURL="${this.baseURL}"
      ></grid-renderer>
    `;
  }
}

export default CmsRenderer;
