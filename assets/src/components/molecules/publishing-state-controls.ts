import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../components/atoms/button';

@customElement('publishing-state-controls')
export class PublishingStateControls extends LitElement {
  @property({ type: String })
  currentState: 'draft' | 'published' | 'both' | null = null;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .state-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .state-indicator {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .state-indicator.draft {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .state-indicator.published {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .state-indicator.both {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .state-actions {
      display: flex;
      gap: 10px;
    }
  `;

  render() {
    return html`
      <div class="state-controls">
        <div class="state-actions">${this._renderActions()}</div>
      </div>
    `;
  }

  private _renderActions() {
    switch (this.currentState) {
      case 'draft':
        return html`
          <ui-button variant="success" @click="${this._publish}">
            Publish
          </ui-button>
        `;
      case 'both':
        return html`
          <ui-button variant="success" @click="${this._publish}">
            Publish Changes
          </ui-button>
          <ui-button variant="outline" @click="${this._revert}">
            Revert to Published
          </ui-button>
        `;
      case 'published':
      default:
        return '';
    }
  }

  private _publish() {
    this.dispatchEvent(
      new CustomEvent('publish-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _revert() {
    this.dispatchEvent(
      new CustomEvent('revert-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
