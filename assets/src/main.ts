import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from './store';
import { connect } from 'lit-redux-watch';
import './apps/cms-app';
import './apps/cms-renderer';
import './styles/cms.css';

// Export the CMS App component
@customElement('cms-app')
class CMSWrapper extends connect(store)(LitElement) {
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
          <strong>Warning:</strong> The "business-unit-key" attribute is required for the CMS to
          function properly.
        </div>
      `;
    }

    return html`
      <cms-wrapper
        .baseURL="${this.baseURL}"
        .businessUnitKey="${this.businessUnitKey}"
        .locale="${this.locale}"
        .availableLocales="${JSON.parse(this.availableLocales)}"
      ></cms-wrapper>
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
        baseurl="${this.baseURL}"
        business-unit-key="${this.businessUnitKey}"
        route="${this.route}"
        key="${this.key}"
      ></cms-renderer>
    `;
  }
}

// Define custom elements
if (!customElements.get('cms-app')) {
  customElements.define('cms-app', CMSWrapper);
}

if (!customElements.get('cms-renderer-element')) {
  customElements.define('cms-renderer-element', CmsRendererElement);
}

// Export for bundling
export { CMSWrapper, CmsRendererElement };

export default {
  CMSWrapper,
  CmsRendererElement,
};
