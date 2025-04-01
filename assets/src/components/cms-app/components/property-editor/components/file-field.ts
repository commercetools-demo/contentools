import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';

@customElement('cms-file-field')
export class FileField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  fieldKey: string = '';

  @property({ type: String })
  baseURL: string = '';

  @property({ type: Array })
  extensions: string[] = [];

  @state()
  private selectedFile: File | null = null;

  @state()
  private uploading = false;

  @state()
  private inputRef = createRef<HTMLInputElement>();

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
    
    .file-upload {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .file-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .file-input {
      display: none;
    }

    .browse-button {
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
    }

    .upload-button {
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
    }

    .file-url {
      word-break: break-all;
      font-size: 14px;
      color: #666;
    }

    .file-preview {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }
  `;

  render() {
    const isImage = this.extensions?.some(ext => 
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase())
    );

    return html`
      <div class="form-group">
        <label for="${this.fieldKey}">${this.label}</label>
        <div class="file-upload">
          <div class="file-input-wrapper">
            <input
              type="file"
              id="${this.fieldKey}"
              class="file-input"
              ${ref(this.inputRef)}
              accept=${this.extensions?.map(ext => `.${ext}`).join(',')}
              @change=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                if (input.files?.[0]) {
                  this.selectedFile = input.files[0];
                  this.requestUpdate();
                }
              }}
            />
            <button class="browse-button" @click=${() => this.inputRef.value?.click()}>
              Browse
            </button>
            ${this.selectedFile ? html`
              <button 
                class="upload-button" 
                ?disabled=${this.uploading}
                @click=${() => this.handleFileUpload()}
              >
                ${this.uploading ? 'Uploading...' : 'Upload'}
              </button>
            ` : ''}
          </div>
          ${this.value ? html`
            <div class="file-url">
              ${isImage ? html`
                <img src=${this.value} alt="Preview" class="file-preview" />
              ` : html`
                <a href=${this.value} target="_blank" rel="noopener noreferrer">${this.value}</a>
              `}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private async handleFileUpload() {
    if (!this.selectedFile || !this.baseURL) return;

    this.uploading = true;

    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const response = await fetch(`${this.baseURL}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { url } = await response.json();
      
      this.dispatchEvent(new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: url
        },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      this.uploading = false;
    }
  }
} 