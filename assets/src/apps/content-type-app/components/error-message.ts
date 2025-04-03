import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('error-message')
export class ErrorMessage extends LitElement {
  @property({ type: String })
  message: string | null = null;

  static styles = css`
    .error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin: 20px;
    }
  `;

  render() {
    if (!this.message) return html``;
    
    return html`
      <div class="error">${this.message}</div>
    `;
  }
}

export default ErrorMessage; 