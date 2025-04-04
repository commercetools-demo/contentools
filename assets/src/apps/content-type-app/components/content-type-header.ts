import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../../components/atoms/button';

@customElement('content-type-header')
export class ContentTypeHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .registry-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      background-color: white;
    }
    
    .registry-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  `;

  render() {
    return html`
      <header class="registry-header">
        <h1 class="registry-title">Content Type Registry</h1>
        <ui-button 
          variant="primary"
          @click=${this._addContentType}
        >
          + Add Content Type
        </ui-button>
      </header>
    `;
  }

  private _addContentType() {
    this.dispatchEvent(new CustomEvent('add-content-type', {
      bubbles: true,
      composed: true
    }));
  }
}

export default ContentTypeHeader; 