import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContentItem } from '../../types';
import { fetchPreviewContentItemEndpoint } from '../../utils/api';
import '../shared/components/component-renderer/component-renderer';

@customElement('content-item-preview')
export class ContentItemPreview extends LitElement {
  @property({ type: String })
  contentItemKey: string = '';

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @state()
  private loading: boolean = false;

  @state()
  private error: string | null = null;

  @state()
  private contentItem: ContentItem | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .preview-container {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      min-height: 200px;
    }

    h3 {
      margin-top: 0;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
    }

    .error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin-bottom: 20px;
    }
  `;

  protected async updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('contentItemKey') ||
      changedProperties.has('baseURL') ||
      changedProperties.has('businessUnitKey')
    ) {
      if (this.contentItemKey && this.baseURL) {
        await this.fetchContentItem();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.contentItemKey && this.baseURL) {
      this.fetchContentItem();
    }
  }

  private async fetchContentItem() {
    if (!this.contentItemKey || !this.baseURL) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      this.contentItem = await fetchPreviewContentItemEndpoint<ContentItem>(
        `${this.baseURL}/${this.businessUnitKey}`,
        this.contentItemKey
      );
      console.log(this.contentItem);
    } catch (err) {
      this.error = `Error fetching content item: ${(err as Error).message}`;
      console.error('Error fetching content item:', err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading content item...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    if (!this.contentItem) {
      return html`<div>No content item to display</div>`;
    }

    return html`
      <div class="preview-container">
        <h3>Preview</h3>
        <component-renderer
          .baseURL="${this.baseURL}"
          .businessUnitKey="${this.businessUnitKey}"
          .component="${this.contentItem}"
        ></component-renderer>
      </div>
    `;
  }
}
