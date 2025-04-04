import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BreadcrumbItem } from '../../components/atoms/breadcrumbs';

// Import atomic components
import '../../components/atoms/breadcrumbs';
import '../../components/atoms/toggle-button';

// Import the cms-app component
import '../pages-app/index.js';
import '../content-type-app/index.js';

@customElement('cms-wrapper')
export class CmsWrapper extends LitElement {
  @property({ type: String })
  baseURL: string = '';
  
  @property({ type: String })
  locale: string = '';

  @property({ type: Array })
  availableLocales: string[] = [];

  @property({ type: String })
  businessUnitKey: string = '';
  
  @state()
  private activeApp: 'welcome' | 'cms' | 'content-type' = 'welcome';

  @state()
  private cmsView: 'list' | 'editor' | 'new' = 'list';

  @state()
  private showSidebar = false;

  @state()
  private cmsTitle = '<PUT NAME HERE>';

  @state()
  private breadcrumbItems: BreadcrumbItem[] = [];

  static styles = css`
    :host {
      display: block;
      height: 100%;
      font-family: system-ui, sans-serif;
    }
    
    .wrapper-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem;
    }
    
    .welcome-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .welcome-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .welcome-subtitle {
      font-size: 1.2rem;
      color: #666;
    }
    
    .card-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-top: 2rem;
    }
    
    .app-card {
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
    
    .app-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      border-color: #3498db;
    }
    
    .card-header {
      padding: 1rem;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    
    .card-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }
    
    .card-body {
      padding: 1rem;
      flex: 1;
    }
    
    .card-description {
      margin: 0;
      color: #666;
    }
    
    .back-button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    
    .back-button:hover {
      background-color: #2980b9;
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
  `;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('activeApp')) {
      this._updateBreadcrumbItems();
    }
  }

  render() {
    
    switch (this.activeApp) {
      case 'cms':
        return html`
          ${this._renderHeader()}
          
          <pages-app
            .baseURL=${this.baseURL}
            .locale=${this.locale}
            .availableLocales=${this.availableLocales}
            .businessUnitKey=${this.businessUnitKey}
            .headerInWrapper=${true}
            @view-changed=${this._handleViewChanged}
            @sidebar-toggled=${this._handleSidebarToggled}
          ></pages-app>
        `;
        
      case 'content-type':
        return html`
          ${this._renderHeader()}
          
          <content-type-app 
            .baseURL=${this.baseURL}
          ></content-type-app>
        `;
        
      default: // welcome view
        return html`
          <div class="wrapper-container">
            <div class="welcome-header">
              <h1 class="welcome-title">Welcome to the CMS Platform</h1>
              <p class="welcome-subtitle">Choose an application to get started</p>
            </div>
            
            <div class="card-container">
              <div class="app-card" @click=${() => this._setActiveApp('cms')}>
                <div class="card-header">
                  <h3 class="card-title">Page Builder</h3>
                </div>
                <div class="card-body">
                  <p class="card-description">Create and manage pages with a flexible layout system. Add components and customize content.</p>
                </div>
              </div>
              
              <div class="app-card" @click=${() => this._setActiveApp('content-type')}>
                <div class="card-header">
                  <h3 class="card-title">Content Type Manager</h3>
                </div>
                <div class="card-body">
                  <p class="card-description">Define and manage content types. Create structured content models for your site.</p>
                </div>
              </div>
            </div>
          </div>
        `;
    }
  }

  private _setActiveApp(app: 'welcome' | 'cms' | 'content-type') {
    this.activeApp = app;
  }

  private _handleViewChanged(e: CustomEvent) {
    this.cmsView = e.detail.view;
  }

  private _handleSidebarToggled(e: CustomEvent) {
    this.showSidebar = e.detail.visible;
  }

  private _handleBreadcrumbClick(view: 'list' | 'editor' | 'new') {
    this.cmsView = view;
    const pagesAppEl = this.shadowRoot?.querySelector('pages-app') as any;
    if (pagesAppEl && typeof pagesAppEl.setView === 'function') {
      pagesAppEl.setView(view);
    }
  }

  private _handleToggleSidebar(e: CustomEvent) {
    this.showSidebar = e.detail.active;
    const pagesAppEl = this.shadowRoot?.querySelector('pages-app') as any;
    if (pagesAppEl && typeof pagesAppEl.toggleSidebar === 'function') {
      pagesAppEl.toggleSidebar(e.detail.active);
    }
  }

  private _updateBreadcrumbItems() {
    if (this.activeApp === 'cms') {
    this.breadcrumbItems = [
      { text: 'Pages', path: 'list' }
    ];
    
    if (this.cmsView === 'editor') {
      this.breadcrumbItems.push({ text: 'Page Editor' });
    } else if (this.cmsView === 'new') {
        this.breadcrumbItems.push({ text: 'New Page' });
      }
    } else if (this.activeApp === 'content-type') {
      this.breadcrumbItems = [
        { text: 'Content Types', path: 'list' }
      ];
    } else {
      this.breadcrumbItems = [];
    }
  }

  private _renderHeader() {
    return html`      
          <header class="cms-header">
            <h1 class="cms-title" @click=${() => this._setActiveApp('welcome')}>
            ${this.cmsTitle}
            </h1>
            
            <ui-breadcrumbs 
              .items=${this.breadcrumbItems}
              @breadcrumb-click=${(e: CustomEvent) => this._handleBreadcrumbClick(e.detail.item.path as any)}
            ></ui-breadcrumbs>
            
            <div>
              ${this.cmsView === 'editor' 
                ? html`
                  <ui-toggle-button
                    .active=${this.showSidebar}
                    .title=${this.showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                    @toggle=${this._handleToggleSidebar}
                  ></ui-toggle-button>
                ` 
                : ''
              }
            </div>
          </header>
    `;
  }
} 