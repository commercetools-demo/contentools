import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable button component with variant support
 * @slot - Content of the button
 */
@customElement('ui-button')
export class Button extends LitElement {
  static styles = css`
    :host {
      display: var(--ui-button__host__display, inline-block);
    }

    .button {
      display: var(--ui-button__button__display, inline-flex);
      align-items: var(--ui-button__button__align-items, center);
      justify-content: var(--ui-button__button__justify-content, center);
      gap: var(--ui-button__button__gap, 6px);
      border-radius: var(--ui-button__button__border-radius, 4px);
      padding: var(--ui-button__button__padding, 8px 15px);
      font-size: var(--ui-button__button__font-size, 14px);
      cursor: var(--ui-button__button__cursor, pointer);
      transition: var(--ui-button__button__transition, all 0.2s);
      font-family: var(--ui-button__button__font-family, inherit);
      text-align: var(--ui-button__button__text-align, center);
      border: var(--ui-button__button__border, 1px solid transparent);
    }

    /* Primary variant */
    .button.primary {
      background-color: var(--ui-button__button-primary__background-color, #3498db);
      color: var(--ui-button__button-primary__color, white);
      border: var(--ui-button__button-primary__border, none);
    }

    .button.primary:hover {
      background-color: var(--ui-button__button-primary-hover__background-color, #2980b9);
    }

    /* Secondary variant */
    .button.secondary {
      background-color: var(--ui-button__button-secondary__background-color, #f5f5f5);
      color: var(--ui-button__button-secondary__color, #555);
      border: var(--ui-button__button-secondary__border, 1px solid #ddd);
    }

    .button.secondary:hover {
      background-color: var(--ui-button__button-secondary-hover__background-color, #e8e8e8);
    }

    /* Success variant */
    .button.success {
      background-color: var(--ui-button__button-success__background-color, #2ecc71);
      color: var(--ui-button__button-success__color, white);
      border: var(--ui-button__button-success__border, none);
    }

    .button.success:hover {
      background-color: var(--ui-button__button-success-hover__background-color, #27ae60);
    }

    /* Warning variant */
    .button.warning {
      background-color: var(--ui-button__button-warning__background-color, #f39c12);
      color: var(--ui-button__button-warning__color, white);
      border: var(--ui-button__button-warning__border, none);
    }

    .button.warning:hover {
      background-color: var(--ui-button__button-warning-hover__background-color, #e67e22);
    }

    /* Critical variant */
    .button.critical {
      background-color: var(--ui-button__button-critical__background-color, #e74c3c);
      color: var(--ui-button__button-critical__color, white);
      border: var(--ui-button__button-critical__border, none);
    }

    .button.critical:hover {
      background-color: var(--ui-button__button-critical-hover__background-color, #c0392b);
    }

    /* Outline variant */
    .button.outline {
      background-color: var(--ui-button__button-outline__background-color, transparent);
      color: var(--ui-button__button-outline__color, #3498db);
      border: var(--ui-button__button-outline__border, 1px solid currentColor);
    }

    .button.outline:hover {
      background-color: var(--ui-button__button-outline-hover__background-color, rgba(52, 152, 219, 0.1));
    }

    /* Text variant (no background, no border) */
    .button.text {
      background: var(--ui-button__button-text__background, none);
      border: var(--ui-button__button-text__border, none);
      color: var(--ui-button__button-text__color, #3498db);
      padding: var(--ui-button__button-text__padding, 8px 10px);
    }

    .button.text:hover {
      background-color: var(--ui-button__button-text-hover__background-color, rgba(52, 152, 219, 0.1));
    }

    /* Icon only variant */
    .button.icon {
      padding: var(--ui-button__button-icon__padding, 8px);
      border-radius: var(--ui-button__button-icon__border-radius, 4px);
    }

    /* Size variations */
    .button.small {
      padding: var(--ui-button__button-small__padding, 4px 10px);
      font-size: var(--ui-button__button-small__font-size, 12px);
    }

    .button.large {
      padding: var(--ui-button__button-large__padding, 10px 20px);
      font-size: var(--ui-button__button-large__font-size, 16px);
    }

    .button.full-width {
      width: var(--ui-button__button-full-width__width, 100%);
    }

    /* Disabled state */
    .button:disabled {
      opacity: var(--ui-button__button-disabled__opacity, 0.6);
      cursor: var(--ui-button__button-disabled__cursor, not-allowed);
    }
  `;

  @property({ type: String })
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'critical'
    | 'outline'
    | 'text'
    | 'icon' = 'primary';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' | 'full-width' = 'medium';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html`
      <button
        class="button ${this.variant} ${this.size}"
        ?disabled="${this.disabled}"
        type="${this.type}"
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': Button;
  }
}
