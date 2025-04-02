import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../../store';
import { fetchRegistryComponents } from '../../store/registry.slice';
import { Page } from '../../types';
import { fetchCustomObject, fetchCustomObjects } from '../../utils/api';
import '../registry-components/renderable-components';
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
      display: block;
      width: 100%;
      height: 100%;
      font-family: system-ui, sans-serif;
    }
    
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }
    
    .error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin-bottom: 20px;
    }
    
    .warning {
      padding: 15px;
      background-color: #fff3cd;
      color: #856404;
      border-radius: 4px;
      margin-bottom: 20px;
      border: 1px solid #ffeeba;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    
    if (!this.businessUnitKey) {
      this.error = 'The "business-unit-key" attribute is required for the CMS renderer to function properly.';
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
      await store.dispatch(fetchRegistryComponents({ baseURL: this.baseURL })).unwrap();
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
        const response = await fetchCustomObject<Page>(baseUrl, this.key);
        const page = response.value;
        
        // Get all pages with the same UUID to find all available locales
        await this.loadAvailableLocales(baseUrl, page.uuid);
        
        // Now check if we need a different locale version
        if (this.locale && page.locale !== this.locale) {
          // Try to find the page with the requested locale
          const pageWithLocale = this.findPageWithLocale(this.locale);
          if (pageWithLocale) {
            this.page = pageWithLocale;
          } else {
            // If no page with requested locale, use the default page (no locale)
            const defaultPage = this.findPageWithLocale('');
            this.page = defaultPage || page; // Fallback to original page if no default
          }
        } else {
          this.page = page;
        }
      } else if (this.route) {
        // Load all pages
        const responses = await fetchCustomObjects<Page>(baseUrl);
        const allPages = responses.map(res => res.value);
        
        // Find pages with matching route
        const pagesWithRoute = allPages.filter(page => page.route === this.route);
        
        if (pagesWithRoute.length > 0) {
          // Store all pages with this route to get available locales
          const uuid = pagesWithRoute[0].uuid;
          const pagesWithSameUuid = allPages.filter(p => p.uuid === uuid);
          this.availableLocales = pagesWithSameUuid.map(p => p.locale || '');
          
          // Determine which page to show based on locale
          if (this.locale) {
            // First try to find page with requested locale
            const pageWithLocale = pagesWithRoute.find(p => p.locale === this.locale);
            if (pageWithLocale) {
              this.page = pageWithLocale;
            } else {
              // If no page with requested locale, use the default page (no locale)
              const defaultPage = pagesWithRoute.find(p => !p.locale);
              this.page = defaultPage || pagesWithRoute[0]; // Fallback to first page if no default
            }
          } else {
            // If no locale is specified, prefer the default page or the first one
            const defaultPage = pagesWithRoute.find(p => !p.locale);
            this.page = defaultPage || pagesWithRoute[0];
          }
        } else {
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
  
  private async loadAvailableLocales(baseUrl: string, uuid: string) {
    try {
      // Load all pages
      const responses = await fetchCustomObjects<Page>(baseUrl);
      const allPages = responses.map(res => res.value);
      
      // Find pages with same UUID
      const pagesWithSameUuid = allPages.filter(p => p.uuid === uuid);
      
      // Store pages for later use
      this._allPagesWithSameUuid = pagesWithSameUuid;
      
      // Extract available locales
      this.availableLocales = pagesWithSameUuid.map(p => p.locale || '');
    } catch (error) {
      console.error('Failed to load available locales:', error);
    }
  }
  
  // Keep a reference to all pages with the same UUID
  private _allPagesWithSameUuid: Page[] = [];
  
  private findPageWithLocale(locale: string): Page | null {
    return this._allPagesWithSameUuid.find(p => {
      if (locale === '') {
        return !p.locale; // Find page with no locale
      }
      return p.locale === locale;
    }) || null;
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
        .rows=${this.page.layout.rows}
        .components=${this.page.components}
        .baseURL=${this.baseURL}
      ></grid-renderer>
    `;
  }
}

export default CmsRenderer;