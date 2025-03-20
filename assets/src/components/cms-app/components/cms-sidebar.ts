import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Page } from '../../../types';

@customElement('cms-sidebar')
export class CmsSidebar extends LitElement {
  @property({ type: Object })
  currentPage: Page | null = null;

  @property({ type: String })
  selectedComponentId: string | null = null;

  @property({ type: Boolean })
  showSidebar = false;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  static styles = css`
    :host {
      display: block;
    }
    
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 99;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    
    :host(:not(.hidden)) .sidebar-overlay {
      opacity: 1;
      pointer-events: auto;
    }
    
    .sidebar-content {
      width: 300px;
      border-left: 1px solid #ddd;
      background-color: white;
      position: fixed;
      right: 0;
      top: 0px;
      bottom: 0;
      overflow-y: auto;
      transition: transform 0.3s, box-shadow 0.3s;
      padding: 20px;
      transform: translateX(0);
      z-index: 100;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    }
    
    :host(.hidden) .sidebar-content {
      transform: translateX(100%);
      box-shadow: none;
    }
    
    :host(.hidden) .sidebar-overlay {
      opacity: 0;
      pointer-events: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Initialize visibility based on the showSidebar property
    requestAnimationFrame(() => this.updateVisibility());
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('showSidebar')) {
      this.updateVisibility();
    }
  }

  private updateVisibility() {
    if (this.showSidebar) {
      this.classList.remove('hidden');
    } else {
      this.classList.add('hidden');
    }
  }

  private _handleOverlayClick() {
    // Close the sidebar when clicking on the overlay
    this.dispatchEvent(new CustomEvent('close-sidebar', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.currentPage) return html``;
    
    return html`
      <div class="sidebar-overlay" @click=${this._handleOverlayClick}></div>
      <div class="sidebar-content">
        ${this.selectedComponentId 
          ? this._renderComponentEditor() 
          : this._renderPageSettings()
        }
      </div>
    `;
  }
  
  private _renderComponentEditor() {
    if (!this.currentPage || !this.selectedComponentId) return html``;
    
    const component = this.currentPage.components.find(c => c.id === this.selectedComponentId);
    
    if (component) {
      return html`
        <cms-property-editor
          .component=${component}
          @component-updated=${this._handleComponentUpdated}
          .baseURL=${this.baseURL}
          .businessUnitKey=${this.businessUnitKey}
        ></cms-property-editor>
      `;
    }
    
    return html`<div>Component not found</div>`;
  }
  
  private _renderPageSettings() {
    return html`
      <h2>Page Settings</h2>
      <cms-page-form
        .isEdit=${true}
        .page=${this.currentPage}
        .baseURL=${this.baseURL}
        .businessUnitKey=${this.businessUnitKey}
        @page-updated=${this._handlePageUpdated}
      ></cms-page-form>
    `;
  }

  private _handleComponentUpdated() {
    this.dispatchEvent(new CustomEvent('component-updated'));
  }

  private _handlePageUpdated() {
    this.dispatchEvent(new CustomEvent('page-updated'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-sidebar': CmsSidebar;
  }
} 