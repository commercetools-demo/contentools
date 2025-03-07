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

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <cms-app .baseURL=${this.baseURL}></cms-app>
    `;
  }
}

// Make sure we export the custom element
export default LayoutCMS;

// Define custom element on window if not already defined
if (!customElements.get('layout-cms')) {
  customElements.define('layout-cms', LayoutCMS);
}