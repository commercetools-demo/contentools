import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Page } from '../../../types';

// Import UI components
import '../../../components/atoms/button';

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

  @state()
  private sidebarView: 'component-editor' | 'page-settings' | 'component-library' = 'page-settings';

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar-content {
      width: 350px;
      height: 100%;
      border-left: 1px solid #ddd;
      background-color: white;
      overflow-y: auto;
      transition:
        transform 0.3s,
        box-shadow 0.3s;
      padding: 20px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    :host(.hidden) .sidebar-content {
      display: none;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .sidebar-tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      gap: 5px;
    }

    .tab-container {
      position: relative;
    }

    .active-indicator {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #3498db;
    }

    .sidebar-content-body {
      flex: 1;
      overflow-y: auto;
      position: relative;
    }

    .sidebar-view {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transition: opacity 0.3s;
      height: 0;
    }

    .sidebar-view.active {
      opacity: 1;
      visibility: visible;
      position: relative;
      height: auto;
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

    if (changedProperties.has('selectedComponentId')) {
      this.updateSidebarView();
    }
  }

  private updateVisibility() {
    if (this.showSidebar) {
      this.classList.remove('hidden');
    } else {
      this.classList.add('hidden');
    }
  }

  private updateSidebarView() {
    if (this.selectedComponentId) {
      this.sidebarView = 'component-editor';
    }
  }

  private _handleCloseClick() {
    this.dispatchEvent(
      new CustomEvent('close-sidebar', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // Make this method public so it can be called from outside
  switchView(view: 'component-editor' | 'page-settings' | 'component-library') {
    this.sidebarView = view;
  }

  // Keep the private version for internal use
  private _switchView(view: 'component-editor' | 'page-settings' | 'component-library') {
    this.switchView(view);
  }

  render() {
    if (!this.currentPage) return html``;

    return html`
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h2 class="sidebar-title">
            ${this.sidebarView === 'component-editor'
              ? 'Component Properties'
              : this.sidebarView === 'component-library'
                ? 'Component Library'
                : 'Page Settings'}
          </h2>
          <ui-button variant="icon" @click=${this._handleCloseClick}>×</ui-button>
        </div>

        <div class="sidebar-tabs">
          ${this.selectedComponentId
            ? html`
                <div class="tab-container">
                  <ui-button
                    variant=${this.sidebarView === 'component-editor' ? 'primary' : 'text'}
                    size="small"
                    @click=${() => this._switchView('component-editor')}
                    >Properties</ui-button
                  >
                  ${this.sidebarView === 'component-editor'
                    ? html`<div class="active-indicator"></div>`
                    : ''}
                </div>
              `
            : ''}
          <div class="tab-container">
            <ui-button
              variant=${this.sidebarView === 'page-settings' ? 'primary' : 'text'}
              size="small"
              @click=${() => this._switchView('page-settings')}
              >Page Settings</ui-button
            >
            ${this.sidebarView === 'page-settings'
              ? html`<div class="active-indicator"></div>`
              : ''}
          </div>
          <div class="tab-container">
            <ui-button
              variant=${this.sidebarView === 'component-library' ? 'primary' : 'text'}
              size="small"
              @click=${() => this._switchView('component-library')}
              >Components</ui-button
            >
            ${this.sidebarView === 'component-library'
              ? html`<div class="active-indicator"></div>`
              : ''}
          </div>
        </div>

        <div class="sidebar-content-body">
          <div class="sidebar-view ${this.sidebarView === 'component-editor' ? 'active' : ''}">
            ${this._renderComponentEditor()}
          </div>

          <div class="sidebar-view ${this.sidebarView === 'page-settings' ? 'active' : ''}">
            ${this._renderPageSettings()}
          </div>

          <div class="sidebar-view ${this.sidebarView === 'component-library' ? 'active' : ''}">
            ${this._renderComponentLibrary()}
          </div>
        </div>
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
          .baseURL=${this.baseURL}
          .businessUnitKey=${this.businessUnitKey}
        ></cms-property-editor>
      `;
    }

    return html`<div>Component not found</div>`;
  }

  private _renderComponentLibrary() {
    return html`
      <cms-component-library
        @component-drag-start=${this._handleComponentDragStart}
        .baseURL=${this.baseURL}
        .businessUnitKey=${this.businessUnitKey}
      ></cms-component-library>
    `;
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

  private _handlePageUpdated() {
    this.dispatchEvent(new CustomEvent('page-updated'));
  }

  private _handleComponentDragStart(e: CustomEvent) {
    // Forward the component-drag-start event to the parent
    this.dispatchEvent(
      new CustomEvent('component-drag-start', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-sidebar': CmsSidebar;
  }
}
