import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fetchCustomObject, fetchCustomObjects } from '../../utils/api';
import { Page } from '../../types';
import '../cms-app/components/layout-grid';
import '../registry-components';

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

  @state()
  private page: Page | null = null;

  @state()
  private loading = false;

  @state()
  private error: string | null = null;

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
    
    // Hydrate the baseURL with businessUnitKey
    const hydratedBaseUrl = `${this.baseURL}/${this.businessUnitKey}`;
    
    // Load page data
    this.loadPage(hydratedBaseUrl);
  }

  private async loadPage(baseUrl: string) {
    this.loading = true;
    this.error = null;
    
    try {
      if (this.key) {
        // Load by key
        const response = await fetchCustomObject<Page>(baseUrl, this.key);
        this.page = response.value;
      } else if (this.route) {
        // Load by route
        const responses = await fetchCustomObjects<Page>(baseUrl);
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
      return html`<div class="error">${this.error}</div>`;
    }
    
    if (this.loading) {
      return html`<div class="loading">Loading page content...</div>`;
    }
    
    if (!this.page) {
      return html`
        <div class="warning">
          No page content found. Please check the provided route or key.
        </div>
      `;
    }
    
    return html`
      <cms-layout-grid
        .rows=${this.page.layout.rows}
        .components=${this.page.components}
        .readonly=${true}
      ></cms-layout-grid>
    `;
  }
}

export default CmsRenderer;