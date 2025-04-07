import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-card')
export class Card extends LitElement {
  @property({ type: String })
  header: string = '';

  static styles = css`
    :host {
      display: block;
    }

    .card {
      width: 300px;
      height: 200px;
      border-radius: 8px;
      border: 1px solid #ddd;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 1rem;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }

    .card-title {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    .card-content {
      padding: 1rem;
    }

    ::slotted(*) {
      margin: 0;
    }
  `;

  render() {
    return html`
      <div class="card">
        ${this.header
          ? html`
              <div class="card-header">
                <h3 class="card-title">${this.header}</h3>
              </div>
            `
          : ''}
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-card': Card;
  }
}
