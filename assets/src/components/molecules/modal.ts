import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Modal component with configurable size, close button, and backdrop click behavior.
 * Provides slots for header, content, and actions.
 */
@customElement('cms-modal')
export class Modal extends LitElement {
  /**
   * Controls whether the close button (X) is displayed in the top-right corner.
   */
  @property({ type: Boolean })
  showCloseButton = true;

  /**
   * Controls whether clicking on the backdrop closes the modal.
   */
  @property({ type: Boolean })
  closeOnClickOutside = true;

  /**
   * Controls the width of the modal.
   * - sm: 400px
   * - md: 600px
   * - lg: 800px
   */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Modal is open or closed.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  static styles = css`
    :host {
      --modal-width-sm: 400px;
      --modal-width-md: 600px;
      --modal-width-lg: 800px;
      --modal-border-radius: 4px;
      --modal-background: #ffffff;
      --modal-backdrop-color: rgba(0, 0, 0, 0.5);
      --modal-z-index: 1000;
      --modal-box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--modal-backdrop-color);
      z-index: var(--modal-z-index);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background-color: var(--modal-background);
      border-radius: var(--modal-border-radius);
      box-shadow: var(--modal-box-shadow);
      max-height: 60vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-sm {
      width: var(--modal-width-sm);
    }

    .modal-md {
      width: var(--modal-width-md);
    }

    .modal-lg {
      width: var(--modal-width-lg);
    }

    .modal-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
    }

    .modal-content {
      padding: 16px;
      overflow-y: auto;
    }

    .modal-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid #eee;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 0;
      margin-left: 8px;
    }

    :host(:not([open])) .modal-backdrop {
      display: none;
    }
  `;

  /**
   * Handles clicks on the backdrop to close the modal if closeOnClickOutside is true.
   */
  private handleBackdropClick(e: MouseEvent) {
    // Only close if the click was directly on the backdrop
    if (e.target === e.currentTarget && this.closeOnClickOutside) {
      this.close();
    }
  }

  /**
   * Close the modal.
   */
  public close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-close'));
  }

  /**
   * Open the modal.
   */
  public show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('modal-open'));
  }

  render() {
    return html`
      <div class="modal-backdrop" @click="${this.handleBackdropClick}">
        <div class="modal modal-${this.size}">
          <div class="modal-header">
            <slot name="header"></slot>
            ${this.showCloseButton
              ? html`<button class="close-button" @click="${this.close}">×</button>`
              : ''}
          </div>
          <div class="modal-content">
            <slot name="content"></slot>
          </div>
          <div class="modal-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-modal': Modal;
  }
}
