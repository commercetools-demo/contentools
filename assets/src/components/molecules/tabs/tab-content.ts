import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-tab-content')
export class TabContent extends LitElement {
  @property({ type: Boolean, reflect: true })
  active = false;

  static styles = css`
    :host {
      display: block;
    }

    :host(:not([active])) {
      display: none;
    }

    .tab-content {
      padding: 20px;
    }
  `;

  render() {
    return html`
      <div class="tab-content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab-content': TabContent;
  }
}
