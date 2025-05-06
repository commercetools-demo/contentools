import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BreadcrumbItem } from '../../components/atoms/breadcrumbs.js';

// Import atomic components
import '../../components/atoms/breadcrumbs.js';
import '../../components/atoms/toggle-button.js';
import '../../components/atoms/card.js';

// Import the cms-app component
import '../pages-app/index.js';
import '../content-type-app/index.js';
import '../content-item-app/index.js';

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

  @property({ type: Boolean })
  pagesAppEnabled: boolean = false;

  @property({ type: Boolean })
  contentTypeAppEnabled: boolean = false;

  @property({ type: Boolean })
  contentItemAppEnabled: boolean = false;

  @state()
  private activeApp: 'welcome' | 'cms' | 'content-type' | 'content-item' = 'welcome';

  @state()
  private cmsView: 'list' | 'editor' | 'new' = 'list';

  @state()
  private contentTypeView: 'list' | 'editor' | 'new' = 'list';

  @state()
  private contentItemView: 'list' | 'editor' | 'new' = 'list';

  @state()
  private showSidebar = false;

  @property({ type: String })
  cmsTitle = 'contentools';

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
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      background-color: white;
    }

    .cms-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      width: 350px;
      cursor: pointer;
      transition: color 0.2s;
      position: relative;
    }

    .cms-title:hover {
      color: #2980b9;
      text-decoration: underline;
    }

    .cms-title:hover .original-title {
      display: none;
    }

    .cms-title:hover .hover-title {
      display: inline;
    }

    .hover-title {
      display: none;
    }

    .toggle-sidebar-button {
      margin-left: auto;
    }

    ui-breadcrumbs {
      margin: 0 auto;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // If only one app is enabled, set it as active
    if (this.pagesAppEnabled && !this.contentTypeAppEnabled && !this.contentItemAppEnabled) {
      this.activeApp = 'cms';
    } else if (!this.pagesAppEnabled && this.contentTypeAppEnabled && !this.contentItemAppEnabled) {
      this.activeApp = 'content-type';
    } else if (!this.pagesAppEnabled && !this.contentTypeAppEnabled && this.contentItemAppEnabled) {
      this.activeApp = 'content-item';
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('cmsView') || changedProperties.has('contentTypeView')) {
      this._updateBreadcrumbItems();
    }
  }

  render() {
    switch (this.activeApp) {
      case 'cms':
        return html`
          ${this._renderHeader()}

          <pages-app
            .baseURL="${this.baseURL}"
            .locale="${this.locale}"
            .availableLocales="${this.availableLocales}"
            .businessUnitKey="${this.businessUnitKey}"
            .headerInWrapper="${true}"
            @view-changed="${this._handleViewChanged}"
            @sidebar-toggled="${this._handleSidebarToggled}"
          ></pages-app>
        `;

      case 'content-type':
        return html`
          ${this._renderHeader()}

          <content-type-app
            .baseURL="${this.baseURL}"
            @edit-content-type="${this._handleEditContentType}"
          ></content-type-app>
        `;

      case 'content-item':
        return html`
          ${this._renderHeader()}

          <content-item-app
            .baseURL="${this.baseURL}"
            .businessUnitKey="${this.businessUnitKey}"
            @view-changed="${this._handleContentItemViewChanged}"
          ></content-item-app>
        `;

      default: // welcome view
        return html`
          <div class="wrapper-container">
            <div class="welcome-header">
              <h1 class="welcome-title">Welcome to the CMS Platform</h1>
              <p class="welcome-subtitle">Choose an application to get started</p>
            </div>

            <div class="card-container">
              ${this.pagesAppEnabled
                ? html`
                    <ui-card header="Page Builder" @click="${() => this._setActiveApp('cms')}">
                      <div class="card-body">
                        <p class="card-description">
                          Create and manage pages with a flexible layout system. Add components and
                          customize content.
                        </p>
                      </div>
                    </ui-card>
                  `
                : ''}
              ${this.contentTypeAppEnabled
                ? html`
                    <ui-card
                      header="Content Type Manager"
                      @click="${() => this._setActiveApp('content-type')}"
                    >
                      <div class="card-body">
                        <p class="card-description">
                          Define and manage content types. Create structured content models for your
                          site.
                        </p>
                      </div>
                    </ui-card>
                  `
                : ''}
              ${this.contentItemAppEnabled
                ? html`
                    <ui-card
                      header="Content Items"
                      @click="${() => this._setActiveApp('content-item')}"
                    >
                      <div class="card-body">
                        <p class="card-description">
                          Create and manage content items. Use predefined content types to structure
                          your content.
                        </p>
                      </div>
                    </ui-card>
                  `
                : ''}
            </div>
          </div>
        `;
    }
  }

  private _setActiveApp(app: 'welcome' | 'cms' | 'content-type' | 'content-item') {
    this.activeApp = app;
  }

  private _handleViewChanged(e: CustomEvent) {
    this.cmsView = e.detail.view;
  }

  private _handleEditContentType(e: CustomEvent) {
    this.contentTypeView = e.detail.view;
  }

  private _handleSidebarToggled(e: CustomEvent) {
    this.showSidebar = e.detail.visible;
  }

  private _handleContentItemViewChanged(e: CustomEvent) {
    this.contentItemView = e.detail.view;
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
      this.breadcrumbItems = [{ text: 'Pages', path: 'list' }];

      if (this.cmsView === 'editor') {
        this.breadcrumbItems.push({ text: 'Page Editor' });
      } else if (this.cmsView === 'new') {
        this.breadcrumbItems.push({ text: 'New Page' });
      }
    } else if (this.activeApp === 'content-type') {
      this.breadcrumbItems = [{ text: 'Content Types', path: 'list' }];
      if (this.contentTypeView === 'editor') {
        this.breadcrumbItems.push({ text: 'Content Type Editor' });
      } else if (this.contentTypeView === 'new') {
        this.breadcrumbItems.push({ text: 'New Content Type' });
      }
    } else if (this.activeApp === 'content-item') {
      this.breadcrumbItems = [{ text: 'Content Items', path: 'list' }];
      if (this.contentItemView === 'editor') {
        this.breadcrumbItems.push({ text: 'Content Item Editor' });
      } else if (this.contentItemView === 'new') {
        this.breadcrumbItems.push({ text: 'New Content Item' });
      }
    } else {
      this.breadcrumbItems = [];
    }
  }

  private _renderHeader() {
    return html`
      <header class="cms-header">
        <h1 class="cms-title" @click="${() => this._setActiveApp('welcome')}">
          <span class="original-title">${this.cmsTitle}</span>
          <span class="hover-title">Back to Welcome</span>
        </h1>

        <ui-breadcrumbs
          .items="${this.breadcrumbItems}"
          @breadcrumb-click="${(e: CustomEvent) =>
            this._handleBreadcrumbClick(e.detail.item.path as any)}"
        ></ui-breadcrumbs>

        <div class="toggle-sidebar-button">
          ${this.cmsView === 'editor'
            ? html`
                <ui-toggle-button
                  .active="${this.showSidebar}"
                  .title="${this.showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}"
                  @toggle="${this._handleToggleSidebar}"
                ></ui-toggle-button>
              `
            : ''}
        </div>
      </header>
    `;
  }
}
