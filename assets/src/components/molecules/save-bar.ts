import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable save bar component that appears at the bottom of the screen
 */
@customElement('ui-save-bar')
export class SaveBar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .save-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 20px;
      background-color: #2c3e50;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transform: translateY(100%);
      transition: transform 0.3s;
      z-index: 999;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .save-bar.visible {
      transform: translateY(0);
    }

    .save-message {
      font-size: 14px;
    }

    .save-actions {
      display: flex;
      gap: 10px;
    }

    ::slotted(button) {
      /* Default styling for slotted buttons if no styling is provided */
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
    }
  `;

  @property({ type: Boolean })
  visible = false;

  @property({ type: String })
  message = 'You have unsaved changes';

  render() {
    return html`
      <div class="save-bar ${this.visible ? 'visible' : ''}">
        <div class="save-message">
          <slot name="message">${this.message}</slot>
        </div>
        <div class="save-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-save-bar': SaveBar;
  }
}
