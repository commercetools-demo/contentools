import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../../../components/atoms/labeled-input';

@customElement('renderer-tab')
export class RendererTab extends LitElement {
  @property({ type: String }) deployedUrl = '';

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    ui-labeled-input {
      margin-bottom: 15px;
      display: block;
    }
  `;

  render() {
    return html`
      <ui-labeled-input
        label="Deployed URL"
        .value=${this.deployedUrl}
        @input-change=${(e: CustomEvent) => this._dispatchChange(e.detail.value)}
      ></ui-labeled-input>
    `;
  }

  private _dispatchChange(value: string) {
    this.dispatchEvent(
      new CustomEvent('renderer-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'renderer-tab': RendererTab;
  }
}
