import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect, watch } from 'lit-redux-watch';
import { store } from '../store';
import { RootState, Component, Page } from '../types';
import { fetchPages, updatePage } from '../store/pages.slice';
import { selectComponent, setSidebarVisibility } from '../store/editor.slice';
import { ComponentType } from './registry';

import './page-list';
import './page-form';
import './component-library';
import './layout-grid';
import './property-editor';

@customElement('cms-app')
export class CmsApp extends connect(store)(LitElement) {
  

  @property({ type: String })
  baseURL: string = '';

  @watch('pages.pages')
  pages: Page[] = [];

  @watch('pages.currentPage')
  currentPage: Page | null = null;

  @watch('pages.loading')
  loading = false;

  @watch('pages.error')
  error: string | null = null;

  @watch('pages.unsavedChanges')
  unsavedChanges = false;

  @watch('editor.selectedComponentId')
  selectedComponentId: string | null = null;

  @watch('editor.showSidebar')
  showSidebar = true;
    
  @state()
  private view: 'list' | 'editor' | 'new' = 'list';
  
  @state()
  private _activeComponentType: ComponentType | null = null;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      font-family: system-ui, sans-serif;
    }
    
    .cms-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .cms-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      background-color: white;
    }
    
    .cms-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .cms-breadcrumbs {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
    }
    
    .cms-breadcrumbs span {
      color: #777;
    }
    
    .cms-breadcrumbs .separator {
      color: #ccc;
    }
    
    .cms-main {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    
    .cms-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      transition: margin-right 0.3s;
    }
    
    .cms-content.with-sidebar {
      margin-right: 300px;
    }
    
    .cms-sidebar {
      width: 300px;
      border-left: 1px solid #ddd;
      background-color: white;
      position: fixed;
      right: 0;
      top: 61px;
      bottom: 0;
      overflow-y: auto;
      transition: transform 0.3s;
      padding: 20px;
      transform: translateX(0);
    }
    
    .cms-sidebar.hidden {
      transform: translateX(100%);
    }
    
    .cms-back {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 20px;
      color: #3498db;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
    }
    
    .cms-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }
    
    .cms-error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin-bottom: 20px;
    }
    
    .cms-save-bar {
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
    }
    
    .cms-save-bar.visible {
      transform: translateY(0);
    }
    
    .cms-save-message {
      font-size: 14px;
    }
    
    .cms-save-actions {
      display: flex;
      gap: 10px;
    }
    
    .cms-save-btn {
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .cms-discard-btn {
      background-color: transparent;
      color: white;
      border: 1px solid white;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .cms-action-btn {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
      margin-left: 10px;
    }
    
    .cms-toggle-sidebar {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #777;
      margin-left: 10px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(fetchPages(this.baseURL));
  }

  render() {
    return html`
      <div class="cms-container">
        <header class="cms-header">
          <h1 class="cms-title">CMS</h1>
          
          <div class="cms-breadcrumbs">
            <span @click=${() => this._setView('list')} style="cursor: pointer;">Pages</span>
            ${this.currentPage && (this.view === 'editor') 
              ? html`
                <span class="separator">/</span>
                <span>${this.currentPage.name}</span>
              ` 
              : ''
            }
            ${this.view === 'new' 
              ? html`
                <span class="separator">/</span>
                <span>New Page</span>
              ` 
              : ''
            }
          </div>
          
          <div>
            ${this.view === 'editor' && this.currentPage 
              ? html`
                <button 
                  class="cms-toggle-sidebar" 
                  @click=${this._toggleSidebar}
                  title=${this.showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                >
                  ${this.showSidebar ? '⇢' : '⇠'}
                </button>
              ` 
              : ''
            }
          </div>
        </header>
        
        <div class="cms-main">
          <div class="cms-content ${this.showSidebar && this.view === 'editor' ? 'with-sidebar' : ''}">
            ${this.error ? html`<div class="cms-error">${this.error}</div>` : ''}
            
            ${this.loading && !this.pages.length 
              ? html`
                <div class="cms-loading">
                  <div class="cms-spinner"></div>
                </div>
              ` 
              : this._renderCurrentView()
            }
          </div>
          
          ${this.view === 'editor' && this.showSidebar 
            ? html`
              <div class="cms-sidebar ${this.showSidebar ? '' : 'hidden'}">
                ${this._renderSidebar()}
              </div>
            ` 
            : ''
          }
        </div>
        
        <div class="cms-save-bar ${this.unsavedChanges ? 'visible' : ''}">
          <div class="cms-save-message">You have unsaved changes</div>
          <div class="cms-save-actions">
            <button class="cms-discard-btn" @click=${this._handleDiscardChanges}>Discard</button>
            <button class="cms-save-btn" @click=${this._handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderCurrentView() {
    switch (this.view) {
      case 'list':
        return html`
          <cms-page-list 
            .pages=${this.pages}
            .selectedPageKey=${this.currentPage?.key || null}
            .baseURL=${this.baseURL}
            @create-page=${() => this._setView('new')}
            @select-page=${() => this._setView('editor')}
          ></cms-page-list>
        `;
        
      case 'editor':
        if (!this.currentPage) {
          return html`<div>No page selected</div>`;
        }
        
        return html`
          <a class="cms-back" @click=${() => this._setView('list')}>← Back to Pages</a>
          
          <cms-component-library
            @component-drag-start=${this._handleComponentDragStart}
          ></cms-component-library>
          
          <cms-layout-grid
            .rows=${this.currentPage.layout.rows}
            .components=${this.currentPage.components}
            .activeComponentType=${this._activeComponentType}
            @component-dropped=${this._handleComponentDropped}
          ></cms-layout-grid>
        `;
        
      case 'new':
        return html`
          <a class="cms-back" @click=${() => this._setView('list')}>← Back to Pages</a>
          
          <cms-page-form
            .baseURL=${this.baseURL}
            @page-created=${() => this._setView('editor')}
          ></cms-page-form>
        `;
        
      default:
        return html`<div>Unknown view</div>`;
    }
  }

  private _renderSidebar() {
    if (!this.currentPage) return html``;
    
    if (this.selectedComponentId) {
      const component = this.currentPage.components.find(c => c.id === this.selectedComponentId);
      
      if (component) {
        return html`
          <cms-property-editor
            .component=${component}
            @component-updated=${this._handleComponentUpdated}
            .baseURL=${this.baseURL}
          ></cms-property-editor>
        `;
      }
    }
    
    return html`
      <h2>Page Settings</h2>
      <cms-page-form
        .isEdit=${true}
        .page=${this.currentPage}
        @page-updated=${this._handlePageUpdated}
      ></cms-page-form>
    `;
  }

  private _setView(view: 'list' | 'editor' | 'new') {
    this.view = view;
    
    if (view !== 'editor') {
      store.dispatch(selectComponent(null));
    }
  }

  private _toggleSidebar() {
    store.dispatch(setSidebarVisibility(!this.showSidebar));
  }

  private _handleComponentUpdated(e: CustomEvent) {
    this.requestUpdate();
  }

  private _handlePageUpdated(e: CustomEvent) {
    this.requestUpdate();
  }

  private async _handleSaveChanges() {
    if (this.currentPage) {
      try {
        await store.dispatch(updatePage({baseUrl: this.baseURL, page: this.currentPage})).unwrap();
      } catch (error) {
        console.error('Failed to save changes:', error);
      }
    }
  }

  private _handleDiscardChanges() {
    store.dispatch(fetchPages(this.baseURL));
  }
  
  private _handleComponentDragStart(e: CustomEvent) {
    this._activeComponentType = e.detail.componentType;
    
    // Add a global dragend listener to reset activeComponentType when drag ends without a drop
    const handleDragEnd = () => {
      this._activeComponentType = null;
      document.removeEventListener('dragend', handleDragEnd);
    };
    
    document.addEventListener('dragend', handleDragEnd);
  }
  
  private _handleComponentDropped() {
    this._activeComponentType = null;
  }
}