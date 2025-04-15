import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ABC')
export class ABC extends LitElement {
  @property({ type: String }) property1 = 'asd';
  @property({ type: Number }) property2 = 0;
  @property({ type: String }) property3 = '';
  @property({ type: Object }) property4 = '';

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }
  `;

  render() {
    return html` <!-- Add your template here --> `;
  }
}

export default ABC;
