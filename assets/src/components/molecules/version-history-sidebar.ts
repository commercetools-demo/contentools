import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { VersionInfo } from '../../types';
import '../../components/atoms/button';

@customElement('version-history-sidebar')
export class VersionHistorySidebar extends LitElement {
  @property({ type: Array })
  versions: VersionInfo[] = [];

  @property({ type: String })
  selectedVersionId: string | null = null;

  static styles = css`
    :host {
      display: block;
      width: 300px;
      border-left: 1px solid #e0e0e0;
      padding: 0 15px;
      max-height: 100%;
      overflow-y: auto;
    }

    .version-sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .version-sidebar h3 {
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .version-list {
      flex: 1;
      overflow-y: auto;
    }

    .version-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .version-item:hover {
      background-color: #f5f5f5;
    }

    .version-item.selected {
      background-color: #f0f7ff;
      border-left: 3px solid #3498db;
    }

    .version-date {
      font-size: 12px;
      color: #777;
      margin-bottom: 5px;
    }

    .version-summary {
      font-size: 14px;
      color: #333;
    }

    .version-author {
      font-size: 12px;
      color: #777;
      margin-top: 5px;
      font-style: italic;
    }

    .version-actions {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #eee;
    }
  `;

  render() {
    return html`
      <div class="version-sidebar">
        <h3>Version History</h3>
        <div class="version-list">
          ${this.versions.length === 0
            ? html`<div class="no-versions">No versions available</div>`
            : this.versions.map(
                version => html`
                  <div
                    class="version-item ${this.selectedVersionId === this._getVersionId(version)
                      ? 'selected'
                      : ''}"
                    @click="${() => this._selectVersion(this._getVersionId(version))}"
                  >
                    <div class="version-date">${new Date(version.timestamp).toLocaleString()}</div>
                  </div>
                `
              )}
        </div>
        ${this.selectedVersionId
          ? html`
              <div class="version-actions">
                <ui-button variant="primary" @click="${this._applyVersion}">
                  Apply This Version
                </ui-button>
                <ui-button variant="outline" @click="${this._cancelSelection}"> Cancel </ui-button>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _selectVersion(id: string) {
    this.selectedVersionId = id;
    this.dispatchEvent(
      new CustomEvent('version-selected', {
        detail: id,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _applyVersion() {
    if (this.selectedVersionId) {
      this.dispatchEvent(
        new CustomEvent('apply-version', {
          detail: this.selectedVersionId,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _cancelSelection() {
    this.selectedVersionId = null;
    this.dispatchEvent(
      new CustomEvent('selection-cancelled', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _getVersionId(version: VersionInfo) {
    if ('id' in version) {
      return version.id;
    }
    return version.uuid;
  }
}
