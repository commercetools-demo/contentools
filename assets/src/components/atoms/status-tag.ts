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
      display: var(--ui-status-tag__host__display, inline-block);
    }

    .status-tag {
      display: var(--ui-status-tag__status-tag__display, inline-flex);
      align-items: var(--ui-status-tag__status-tag__align-items, center);
      gap: var(--ui-status-tag__status-tag__gap, 5px);
      font-size: var(--ui-status-tag__status-tag__font-size, 12px);
      font-weight: var(--ui-status-tag__status-tag__font-weight, 500);
      color: var(--ui-status-tag__status-tag__color, #333);
    }

    .status-dot {
      width: var(--ui-status-tag__status-dot__width, 10px);
      height: var(--ui-status-tag__status-dot__height, 10px);
      border-radius: var(--ui-status-tag__status-dot__border-radius, 50%);
      display: var(--ui-status-tag__status-dot__display, inline-block);
      flex-shrink: var(--ui-status-tag__status-dot__flex-shrink, 0);
    }

    .status-draft .status-dot {
      background-color: var(--ui-status-tag__status-draft-dot__background-color, #f5a623);
    }

    .status-published .status-dot {
      background-color: var(--ui-status-tag__status-published-dot__background-color, #7ed321);
    }

    .status-both .status-dot {
      background: var(--ui-status-tag__status-both-dot__background, linear-gradient(90deg, #7ed321 50%, #f5a623 50%));
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
