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

  @property({ type: String })
  locale: string = 'en-US';

  @state()
  private loading: boolean = false;

  @state()
  private error: string | null = null;

  @state()
  private contentItem: ContentItem | null = null;

  static styles = css`
    :host {
      display: var(--content-item-preview__host__display, block);
      width: var(--content-item-preview__host__width, 100%);
    }

    .preview-container {
      border: var(--content-item-preview__preview-container__border, 1px solid #e0e0e0);
      border-radius: var(--content-item-preview__preview-container__border-radius, 4px);
      padding: var(--content-item-preview__preview-container__padding, 16px);
      min-height: var(--content-item-preview__preview-container__min-height, 200px);
      margin-top: var(--content-item-preview__preview-container__margin-top, 0px);
    }

    h3 {
      margin-top: var(--content-item-preview__h3__margin-top, 0);
    }

    .loading {
      display: var(--content-item-preview__loading__display, flex);
      align-items: var(--content-item-preview__loading__align-items, center);
      justify-content: var(--content-item-preview__loading__justify-content, center);
      height: var(--content-item-preview__loading__height, 200px);
    }

    .error {
      padding: var(--content-item-preview__error__padding, 15px);
      background-color: var(--content-item-preview__error__background-color, #ffebee);
      border-radius: var(--content-item-preview__error__border-radius, 4px);
      color: var(--content-item-preview__error__color, #e53935);
      margin-bottom: var(--content-item-preview__error__margin-bottom, 20px);
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
          .locale="${this.locale}"
        ></component-renderer>
      </div>
    `;
  }
}
