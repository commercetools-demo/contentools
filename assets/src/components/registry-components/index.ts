import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('registry-components')
export class RegistryComponents extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <slot></slot>
    `;
  }
}

export default RegistryComponents;