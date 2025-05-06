import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fetchMediaLibrary, uploadFile } from '../../utils/api';
import { MediaFile } from '../../types';

@customElement('cms-media-library')
export class MediaLibrary extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  fieldKey: string = '';

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @property({ type: Array })
  extensions: string[] = [];

  @property({ type: Boolean })
  highlight: boolean = false;

  @state()
  private uploadModalOpen: boolean = false;

  @state()
  private selectModalOpen: boolean = false;

  @state()
  private selectedFile: File | null = null;

  @state()
  private selectedMediaFile: MediaFile | null = null;

  @state()
  private mediaFiles: MediaFile[] = [];

  @state()
  private loading: boolean = false;

  @state()
  private currentPage: number = 1;

  @state()
  private totalPages: number = 1;

  @state()
  private fileTitle: string = '';

  @state()
  private fileDescription: string = '';

  get hydratedUrl() {
    return `${this.baseURL}/${this.businessUnitKey}`;
  }

  static styles = css`
    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 14px;
    }

    .media-library {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-selector {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .file-preview {
      margin-top: 10px;
    }

    .file-preview img {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }

    .file-preview a {
      word-break: break-all;
      font-size: 14px;
      color: #2196f3;
      text-decoration: none;
    }

    .file-preview a:hover {
      text-decoration: underline;
    }

    /* Upload Modal Styles */
    .upload-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    input[type='text'],
    textarea {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .file-input-container {
      border: 2px dashed #ccc;
      padding: 20px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }

    .file-input {
      display: none;
    }

    /* Media Grid Styles */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
      gap: 15px;
      margin-top: 15px;
      margin-bottom: 15px;
      max-height: 400px;
      overflow-y: auto;
    }

    .media-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      border: 2px solid transparent;
      padding: 5px;
      border-radius: 4px;
    }

    .media-item.selected {
      border-color: #2196f3;
      background-color: rgba(33, 150, 243, 0.1);
    }

    .media-thumbnail {
      width: 75px;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .media-thumbnail img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .media-thumbnail .file-icon {
      font-size: 32px;
      color: #666;
    }

    .media-name {
      font-size: 12px;
      margin-top: 5px;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 2px;
      line-height: 1.2;
    }

    .modal-actions {
      width: 100%;
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }

    .file-info {
      margin-right: auto;
      width: 50%;
      display: block;
    }

    .file-info-title {
      font-weight: bold;
      margin-bottom: 4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .file-info-description {
      font-size: 12px;
      color: #666;
    }

    .button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .primary {
      background-color: #2196f3;
      color: white;
    }

    .primary:disabled {
      background-color: #b0b0b0;
      cursor: not-allowed;
    }

    .secondary {
      background-color: #f0f0f0;
      color: #333;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
    }

    .pagination button {
      padding: 5px 10px;
      cursor: pointer;
    }

    .highlight {
      border: 1px solid #ffa600;
      background-color: #fff8e9;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('modal-close', this._handleModalClose);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('modal-close', this._handleModalClose);
  }

  private _handleModalClose = () => {
    this.uploadModalOpen = false;
    this.selectModalOpen = false;
    this.selectedFile = null;
    this.fileTitle = '';
    this.fileDescription = '';
    this.selectedMediaFile = null;
  };

  private _handleOptionChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value as 'upload' | 'select' | '';

    if (value === 'upload') {
      this.uploadModalOpen = true;
    } else if (value === 'select') {
      this._loadMediaLibrary();
      this.selectModalOpen = true;
    }

    // Reset the select after modal is opened
    setTimeout(() => {
      select.value = '';
    }, 100);
  }

  private async _loadMediaLibrary(page: number = 1) {
    this.loading = true;
    try {
      const result = await fetchMediaLibrary(this.hydratedUrl, this.extensions, page);
      this.mediaFiles = result.files;
      this.currentPage = result.pagination.currentPage;
      this.totalPages = result.pagination.totalPages;
    } catch (error) {
      console.error('Error loading media library:', error);
    } finally {
      this.loading = false;
    }
  }

  private _getFileTooltip(file: MediaFile): string {
    const parts: string[] = [];

    if (file.title) {
      parts.push(`Title: ${file.title}`);
    }

    if (file.description) {
      parts.push(`Description: ${file.description}`);
    }

    if (!file.title && !file.description) {
      parts.push(file.name);
    }

    return parts.join('\n');
  }

  private _handleFileSelect(file: MediaFile) {
    this.selectedMediaFile = file;
  }

  private _handleConfirmSelection() {
    if (this.selectedMediaFile) {
      this.dispatchEvent(
        new CustomEvent('field-change', {
          detail: {
            key: this.fieldKey,
            value: this.selectedMediaFile.url,
          },
          bubbles: true,
          composed: true,
        })
      );
      this.value = this.selectedMediaFile.url;
      this.selectModalOpen = false;
      this.selectedMediaFile = null;
    }
  }

  private _handleFileInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  private async _handleFileUpload() {
    if (!this.selectedFile || !this.baseURL) return;

    try {
      const result = await uploadFile(
        this.hydratedUrl,
        this.selectedFile,
        this.fileTitle,
        this.fileDescription
      );

      this.dispatchEvent(
        new CustomEvent('field-change', {
          detail: {
            key: this.fieldKey,
            value: result.url,
          },
          bubbles: true,
          composed: true,
        })
      );

      this.value = result.url;
      this.uploadModalOpen = false;
      this.selectedFile = null;
      this.fileTitle = '';
      this.fileDescription = '';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  render() {
    const isImage = this.value && /\.(jpg|jpeg|png|gif|webp)$/i.test(this.value);

    return html`
      <div class="form-group ${this.highlight ? 'highlight' : ''}">
        <label for="${this.fieldKey}">${this.label}</label>
        <div class="media-library">
          <select
            class="option-selector"
            @change="${this._handleOptionChange}"
            aria-label="Select an option"
          >
            <option value="">-- Select an option --</option>
            <option value="upload">Upload a new file</option>
            <option value="select">Select from library</option>
          </select>

          ${this.value
            ? html`
                <div class="file-preview">
                  ${isImage
                    ? html`
                        <img
                          src="${this.value}"
                          alt="Preview"
                          title="${this._getFileTooltip({
                            url: this.value,
                            name: this.value.split('/').pop() || '',
                            isImage: true,
                          })}"
                        />
                      `
                    : html`<span>${this.value.split('/').pop() || ''}</span>`}
                </div>
              `
            : ''}
        </div>

        <!-- Upload Modal -->
        <cms-modal
          ?open="${this.uploadModalOpen}"
          @modal-close="${this._handleModalClose}"
          size="md"
        >
          <h2 slot="header">Upload a new file</h2>
          <div slot="content">
            <div class="upload-form">
              <div class="form-field">
                <label for="file-title">Title</label>
                <input
                  type="text"
                  id="file-title"
                  .value="${this.fileTitle}"
                  @input="${(e: InputEvent) =>
                    (this.fileTitle = (e.target as HTMLInputElement).value)}"
                />
              </div>
              <div class="form-field">
                <label for="file-description">Description</label>
                <textarea
                  id="file-description"
                  rows="3"
                  .value="${this.fileDescription}"
                  @input="${(e: InputEvent) =>
                    (this.fileDescription = (e.target as HTMLTextAreaElement).value)}"
                ></textarea>
              </div>
              <div
                class="file-input-container"
                @click="${() => {
                  const input = this.shadowRoot?.querySelector('#file-input') as HTMLInputElement;
                  if (input) input.click();
                }}"
              >
                ${this.selectedFile
                  ? html`<p>Selected: ${this.selectedFile.name}</p>`
                  : html`<p>Click to select a file</p>`}
                <input
                  type="file"
                  id="file-input"
                  class="file-input"
                  accept="${this.extensions?.map(ext => `.${ext}`).join(',')}"
                  @change="${this._handleFileInputChange}"
                />
              </div>
            </div>
          </div>
          <div slot="actions" class="modal-actions">
            ${this.selectedFile
              ? html`
              <div class="file-info">
                    <div></div>
                    <div class="file-info-title">${this.selectedFile.name}</div>
                  </div>
            `
              : ''}
            <button class="button secondary" @click="${this._handleModalClose}">Cancel</button>
            <button
              class="button primary"
              ?disabled="${!this.selectedFile}"
              @click="${this._handleFileUpload}"
            >
              Upload
            </button>
          </div>
        </cms-modal>

        <!-- Select Modal -->
        <cms-modal
          ?open="${this.selectModalOpen}"
          @modal-close="${this._handleModalClose}"
          size="lg"
        >
          <h2 slot="header">Select from Media Library</h2>
          <div slot="content">
            ${this.loading
              ? html`<p>Loading media files...</p>`
              : this.mediaFiles.length === 0
                ? html`<p>No files found with the extension ${this.extensions.join(', ')}.</p>`
                : html`
                  <div class="media-grid">
                      ${this.mediaFiles.map(
                        file => html`
                        <div
                            class="media-item ${this.selectedMediaFile?.url === file.url
                              ? 'selected'
                              : ''}"
                            @click="${() => this._handleFileSelect(file)}"
                            title="${this._getFileTooltip(file)}"
                          >
                            <div class="media-thumbnail">
                              ${file.isImage
                                ? html`<img src="${file.url}" alt="${file.title || file.name}" />`
                                : html`<div class="file-icon">📄</div>`}
                            </div>
                            <div class="media-name">${file.title || file.name}</div>
                          </div>
                      `
                      )}
                    </div>
                    ${this.totalPages > 1
                      ? html`
                        <div class="pagination">
                            <button
                              ?disabled="${this.currentPage === 1}"
                              @click="${() => this._loadMediaLibrary(this.currentPage - 1)}"
                            >
                              Previous
                            </button>
                            <span>${this.currentPage} of ${this.totalPages}</span>
                            <button
                              ?disabled="${this.currentPage === this.totalPages}"
                              @click="${() => this._loadMediaLibrary(this.currentPage + 1)}"
                            >
                              Next
                            </button>
                          </div>
                      `
                      : ''}
                `}
          </div>
          <div slot="actions" class="modal-actions">
            ${this.selectedMediaFile
              ? html`
              <div class="file-info">
                    <div class="file-info-title">
                      ${this.selectedMediaFile.title || this.selectedMediaFile.name}
                    </div>
                    ${this.selectedMediaFile.description
                      ? html`
                  <div class="file-info-description">
                            ${this.selectedMediaFile.description}
                          </div>
                `
                      : ''}
                  </div>
            `
              : ''}
            <button class="button secondary" @click="${this._handleModalClose}">Cancel</button>
            <button
              class="button primary"
              ?disabled="${!this.selectedMediaFile}"
              @click="${this._handleConfirmSelection}"
            >
              Select
            </button>
          </div>
        </cms-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-media-library': MediaLibrary;
  }
}
