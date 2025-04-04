import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../components/atoms/error-message';

@customElement('error-message')
export class ErrorMessage extends LitElement {
  @property({ type: String })
  message: string | null = null;

  render() {
    if (!this.message) return html``;
    
    return html`
      <ui-error-message type="error">${this.message}</ui-error-message>
    `;
  }
}

export default ErrorMessage; 