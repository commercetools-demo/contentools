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
      position: var(--cms-modal__modal-backdrop__position, fixed);
      top: var(--cms-modal__modal-backdrop__top, 0);
      left: var(--cms-modal__modal-backdrop__left, 0);
      width: var(--cms-modal__modal-backdrop__width, 100%);
      height: var(--cms-modal__modal-backdrop__height, 100%);
      background-color: var(--cms-modal__modal-backdrop__background-color, var(--modal-backdrop-color));
      z-index: var(--cms-modal__modal-backdrop__z-index, var(--modal-z-index));
      display: var(--cms-modal__modal-backdrop__display, flex);
      align-items: var(--cms-modal__modal-backdrop__align-items, center);
      justify-content: var(--cms-modal__modal-backdrop__justify-content, center);
    }

    .modal {
      background-color: var(--cms-modal__modal__background-color, var(--modal-background));
      border-radius: var(--cms-modal__modal__border-radius, var(--modal-border-radius));
      box-shadow: var(--cms-modal__modal__box-shadow, var(--modal-box-shadow));
      max-height: var(--cms-modal__modal__max-height, 60vh);
      display: var(--cms-modal__modal__display, flex);
      flex-direction: var(--cms-modal__modal__flex-direction, column);
      overflow: var(--cms-modal__modal__overflow, hidden);
    }

    .modal-sm {
      width: var(--cms-modal__modal-sm__width, var(--modal-width-sm));
    }

    .modal-md {
      width: var(--cms-modal__modal-md__width, var(--modal-width-md));
    }

    .modal-lg {
      width: var(--cms-modal__modal-lg__width, var(--modal-width-lg));
    }

    .modal-header {
      padding: var(--cms-modal__modal-header__padding, 16px);
      display: var(--cms-modal__modal-header__display, flex);
      justify-content: var(--cms-modal__modal-header__justify-content, space-between);
      align-items: var(--cms-modal__modal-header__align-items, center);
      border-bottom: var(--cms-modal__modal-header__border-bottom, 1px solid #eee);
    }

    .modal-content {
      padding: var(--cms-modal__modal-content__padding, 16px);
      overflow-y: var(--cms-modal__modal-content__overflow-y, auto);
    }

    .modal-actions {
      padding: var(--cms-modal__modal-actions__padding, 16px);
      display: var(--cms-modal__modal-actions__display, flex);
      justify-content: var(--cms-modal__modal-actions__justify-content, flex-end);
      gap: var(--cms-modal__modal-actions__gap, 8px);
      border-top: var(--cms-modal__modal-actions__border-top, 1px solid #eee);
    }

    .close-button {
      background: var(--cms-modal__close-button__background, none);
      border: var(--cms-modal__close-button__border, none);
      cursor: var(--cms-modal__close-button__cursor, pointer);
      font-size: var(--cms-modal__close-button__font-size, 20px);
      line-height: var(--cms-modal__close-button__line-height, 1);
      padding: var(--cms-modal__close-button__padding, 0);
      margin-left: var(--cms-modal__close-button__margin-left, 8px);
    }

    :host(:not([open])) .modal-backdrop {
      display: var(--cms-modal__not-open-modal-backdrop__display, none);
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
