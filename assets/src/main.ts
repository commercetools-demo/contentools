import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from './store';
import { connect } from 'lit-redux-watch';
import './components/cms-app';
import './components/cms-renderer';
import './components/content-type-app';
import './styles/cms.css';

// Export the CMS App component
@customElement('layout-cms')
class LayoutCMS extends connect(store)(LitElement) {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = ''; 
  
  @property({ type: String, attribute: 'business-unit-key' })
  businessUnitKey = '';

  @property({ type: String, attribute: 'locale' })
  locale = '';

  @property({ type: String, attribute: 'available-locales' })
  availableLocales = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .warning {
      background-color: #fff3cd;
      color: #856404;
      padding: 15px;
      border-radius: 4px;
      margin: 15px;
      border: 1px solid #ffeeba;
      font-size: 14px;
    }
  `;

  render() {
    if (!this.businessUnitKey) {
      return html`
        <div class="warning">
          <strong>Warning:</strong> The "business-unit-key" attribute is required for the CMS to function properly.
        </div>
      `;
    }
    
    
    return html`
      <cms-app .baseURL=${this.baseURL} .businessUnitKey=${this.businessUnitKey} .locale=${this.locale} .availableLocales=${JSON.parse(this.availableLocales)}></cms-app>
    `;
  }
}

// Export the CMS Renderer component
@customElement('cms-renderer-element')
class CmsRendererElement extends LitElement {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = '/service'; 
  
  @property({ type: String, attribute: 'business-unit-key' })
  businessUnitKey = '';
  
  @property({ type: String, attribute: 'route' })
  route = '';
  
  @property({ type: String, attribute: 'key' })
  key = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .warning {
      background-color: #fff3cd;
      color: #856404;
      padding: 15px;
      border-radius: 4px;
      margin: 15px;
      border: 1px solid #ffeeba;
      font-size: 14px;
    }
  `;

  render() {
   
    return html`
      <cms-renderer 
        baseurl=${this.baseURL}
        business-unit-key=${this.businessUnitKey}
        route=${this.route}
        key=${this.key}
      ></cms-renderer>
    `;
  }
}

// Export the ContentType App component
@customElement('content-type-app-element')
class ContentTypeAppElement extends LitElement {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <content-type-app baseurl=${this.baseURL}></content-type-app>
    `;
  }
}



// Define custom elements
if (!customElements.get('layout-cms')) {
  customElements.define('layout-cms', LayoutCMS);
}

if (!customElements.get('cms-renderer-element')) {
  customElements.define('cms-renderer-element', CmsRendererElement);
}

if (!customElements.get('content-type-app-element')) {
  customElements.define('content-type-app-element', ContentTypeAppElement);
}


// Export for bundling
export { 
  LayoutCMS, 
  CmsRendererElement, 
  ContentTypeAppElement, 
};

export default {
  LayoutCMS,
  CmsRendererElement,
  ContentTypeAppElement,
};