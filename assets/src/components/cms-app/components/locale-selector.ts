import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('cms-locale-selector')
export class LocaleSelector extends LitElement {

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  pageLocale: string = '';
  @property({ type: String })
  currentLocale: string = '';

  @property({ type: Array })
  availableLocales: string[] = [];

  @state()
  private isDropdownOpen = false;

  static styles = css`
    .locale-selector {
      display: flex;
      align-items: center;
      margin-right: 15px;
    }
    
    .globe-icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px;
      border-radius: 4px;
      background-color: #f5f5f5;
      margin-right: 10px;
    }
    
    .globe-icon:hover {
      background-color: #eaeaea;
    }
    
    .locale-dropdown {
      position: relative;
    }
    
    .current-locale {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      border-radius: 4px;
      min-width: 120px;
      display: none;
    }
    
    .dropdown-menu.open {
      display: block;
    }
    
    .locale-item {
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .locale-item:hover {
      background-color: #f5f5f5;
    }
    
    .create-locale-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background-color: #e3f2fd;
      color: #1976d2;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .create-locale-btn:hover {
      background-color: #bbdefb;
    }
    
    .create-locale-btn .icon {
      font-size: 16px;
    }
  `;

  render() {

    const pageLocale = this.pageLocale || 'default';
    const showCreateButton = this.currentLocale && pageLocale !== this.currentLocale;

    return html`
      <div class="locale-selector">
        <div class="globe-icon" @click=${this._toggleDropdown}>
          <span class="material-icons">language: ${pageLocale}</span>
        </div>
        
        <div class="locale-dropdown">
      
          <div class="dropdown-menu ${this.isDropdownOpen ? 'open' : ''}">
            ${this.availableLocales.map(locale => html`
              <div class="locale-item" @click=${() => this._onLocaleChange(locale)}>
                ${locale || 'default'}
              </div>
            `)}
          </div>
        </div>
        
        ${showCreateButton ? html`
          <button class="create-locale-btn" @click=${this._createPageForCurrentLocale}>
            <span>Create for ${this.currentLocale}</span>
          </button>
        ` : ''}
      </div>
    `;
  }

  private _toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  private _onLocaleChange(locale: string) {
    this.isDropdownOpen = false;
    this.dispatchEvent(new CustomEvent('locale-change', {
      detail: { locale },
      bubbles: true, 
      composed: true
    }));
  }

  private async _createPageForCurrentLocale() {
    
    try {
      this.dispatchEvent(new CustomEvent('page-localized', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Failed to create page for locale:', error);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-locale-selector': LocaleSelector;
  }
} 