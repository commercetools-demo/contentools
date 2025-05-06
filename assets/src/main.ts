import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from './store';
import { connect } from 'lit-redux-watch';
import './apps/cms-app';
import CmsRenderer from './apps/cms-renderer';
import globalStyles from './styles/cms.css?raw';
import ContentItemRenderer from './apps/content-item-renderer';

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

  @property({ type: Boolean, attribute: 'pages-app-enabled' })
  pagesAppEnabled = false;

  @property({ type: Boolean, attribute: 'content-type-app-enabled' })
  contentTypeAppEnabled = false;

  @property({ type: Boolean, attribute: 'content-item-app-enabled' })
  contentItemAppEnabled = false;

  static styles = [
    unsafeCSS(globalStyles),
    css`
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
    `,
  ];

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
        .pagesAppEnabled="${this.pagesAppEnabled}"
        .contentTypeAppEnabled="${this.contentTypeAppEnabled}"
        .contentItemAppEnabled="${this.contentItemAppEnabled}"
      ></cms-wrapper>
    `;
  }
}

// Define custom elements
if (!customElements.get('cms-app')) {
  customElements.define('cms-app', CMSWrapper);
}

// Export for bundling
export { CMSWrapper, CmsRenderer, ContentItemRenderer };

export default {
  CMSWrapper,
  CmsRenderer,
  ContentItemRenderer,
};
