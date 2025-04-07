import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type TabItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

@customElement('ui-tabs')
export class Tabs extends LitElement {
  @property({ type: Array })
  tabs: TabItem[] = [];

  @property({ type: String })
  selectedTab = '';

  @property({ type: Boolean })
  fullWidth = false;

  @state()
  private _effectiveSelectedTab = '';

  static styles = css`
    :host {
      display: block;
    }
    .tabs-container-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: #f0f0f0;
    }

    .tabs-container {
      display: flex;
      border-bottom: 1px solid #ddd;
    }

    .tab-button {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background-color: transparent;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.2s ease;
    }

    .tab-button[active] {
      color: #007bff;
      border-bottom-color: #007bff;
      font-weight: 600;
    }

    .tab-button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tab-button:hover:not([disabled]):not([active]) {
      color: #0056b3;
      border-bottom-color: #0056b3;
    }

    .full-width .tab-button {
      flex: 1;
      text-align: center;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (!this.selectedTab && this.tabs.length > 0) {
      this._effectiveSelectedTab = this.tabs[0].key;
    } else {
      this._effectiveSelectedTab = this.selectedTab;
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('selectedTab')) {
      this._effectiveSelectedTab = this.selectedTab;
    }
    if (changedProperties.has('tabs') && this.tabs.length > 0 && !this._effectiveSelectedTab) {
      this._effectiveSelectedTab = this.tabs[0].key;
    }
  }

  render() {
    return html`
      <div class="tabs-container-wrapper">
        <div class="tabs-container ${this.fullWidth ? 'full-width' : ''}">
          ${this.tabs.map(
            tab => html`
              <button
                class="tab-button"
                ?active="${this._effectiveSelectedTab === tab.key}"
                ?disabled="${tab.disabled}"
                @click="${() => this._selectTab(tab.key)}"
              >
                ${tab.label}
              </button>
            `
          )}
        </div>
        <slot name="actions"></slot>
      </div>
    `;
  }

  private _selectTab(key: string) {
    const tab = this.tabs.find(t => t.key === key);
    if (tab && !tab.disabled) {
      this._effectiveSelectedTab = key;
      this.dispatchEvent(
        new CustomEvent('tab-change', {
          detail: { selectedTab: key },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tabs': Tabs;
  }
}
