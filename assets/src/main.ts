import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from './store';
import { connect } from 'lit-redux-watch';
import './components/cms-app';
import './styles/cms.css';

@customElement('layout-cms')
export class LayoutCMS extends connect(store)(LitElement) {
  @property({ type: String, attribute: 'baseurl' })
  baseURL = '/service'; 
  
  @property({ type: String, attribute: 'business-unit-key' })
  businessUnitKey = '';

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
    
    // Hydrate the baseURL with businessUnitKey
    const hydratedBaseUrl = `${this.baseURL}/${this.businessUnitKey}`;
    
    return html`
      <cms-app .baseURL=${hydratedBaseUrl}></cms-app>
    `;
  }
}

// Make sure we export the custom element
export default LayoutCMS;

// Define custom element on window if not already defined
if (!customElements.get('layout-cms')) {
  customElements.define('layout-cms', LayoutCMS);
}