import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable loading spinner component with customizable size and color
 */
@customElement('ui-loading-spinner')
export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
      border-width: 2px;
      border-style: solid;
      border-color: var(--spinner-color, #3498db) transparent var(--spinner-color, #3498db)
        transparent;
    }

    .spinner.small {
      width: 16px;
      height: 16px;
    }

    .spinner.medium {
      width: 24px;
      height: 24px;
    }

    .spinner.large {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .spinner.xlarge {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    .label {
      margin-left: 10px;
      color: var(--spinner-color, #3498db);
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';

  @property({ type: String })
  color = '#3498db';

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  centered = false;

  render() {
    return html`
      <div
        class="spinner-container"
        style="${this.centered ? 'height: 100%; width: 100%;' : ''}"
      >
        <div class="spinner ${this.size}" style="--spinner-color: ${this.color};"></div>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-loading-spinner': LoadingSpinner;
  }
}
