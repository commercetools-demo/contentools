import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A reusable status tag component to display different states
 * @slot - Optional custom content (defaults to status text)
 */
@customElement('ui-status-tag')
export class StatusTag extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .status-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 500;
      color: #333;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .status-draft .status-dot {
      background-color: #f5a623;
    }

    .status-published .status-dot {
      background-color: #7ed321;
    }

    .status-both .status-dot {
      background: linear-gradient(90deg, #7ed321 50%, #f5a623 50%);
    }
  `;

  @property({ type: String })
  status: 'draft' | 'published' | 'both' = 'draft';

  @property({ type: Boolean })
  showLabel = true;

  render() {
    return html`
      <div class="status-tag status-${this.status}">
        <span class="status-dot"></span>
        ${this.showLabel ? html`<span><slot>${this.getStatusLabel()}</slot></span>` : ''}
      </div>
    `;
  }

  getStatusLabel(): string {
    switch (this.status) {
      case 'draft':
        return 'Draft';
      case 'published':
        return 'Published';
      case 'both':
        return 'Draft & Published';
      default:
        return 'Draft';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-status-tag': StatusTag;
  }
}
