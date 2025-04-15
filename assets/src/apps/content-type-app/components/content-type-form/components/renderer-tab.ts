import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../../../../components/atoms/labeled-input';
import { generateDefaultComponentCode, generateComponentCode } from '../utils/component-generator';
import { ContentTypeData } from '../../../../../types';
import { compileAndUploadEndpoint } from '../../../../../utils/api';

@customElement('renderer-tab')
export class RendererTab extends LitElement {
  @property({ type: String }) baseURL = '';
  @property({ type: Object }) contentTypeData: ContentTypeData | undefined = undefined;
  @property({ type: Boolean }) isCompiling = false;
  @property({ type: Array }) compilationErrors: string[] = [];

  @state()
  private _code: string = '';

  @state()
  private _deployedUrl: string = '';

  @query('#editor-container')
  private editorContainer!: any; // Using any to avoid importing playground types

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    ui-labeled-input {
      margin-bottom: 15px;
      display: block;
    }

    .cm-editor {
      height: 100%;
    }
    button {
      padding: 8px 16px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background-color: #2980b9;
    }
    button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    .error-container {
      margin-top: 15px;
      color: #e74c3c;
      background-color: #fadbd8;
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid #e74c3c;
    }
    .error-item {
      margin-bottom: 5px;
    }
  `;

  protected firstUpdated() {
    this.loadComponentScript();
  }

  private async loadComponentScript(): Promise<boolean> {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/node_modules/playground-elements/playground-ide.js';

      script.onload = () => {
        // ComponentRenderer.loadedScripts.add(url); // Store original URL in the Set
        resolve(true);
      };

      script.onerror = () => {
        console.error(`Failed to load component script`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.contentTypeData) {
      // If code exists in contentTypeData, use it
      this._code = generateComponentCode(this.contentTypeData);
      this._deployedUrl = this.contentTypeData.deployedUrl || '';
    }
  }

  render() {
    return html`
      <ui-labeled-input
        label="Deployed URL"
        .value="${this._deployedUrl}"
        @input-change="${(e: CustomEvent) => this._dispatchDeployedUrlChange(e.detail.value)}"
      ></ui-labeled-input>

      <label for="editor-container">Component Code</label>

      <playground-ide id="editor-container" editable-file-system line-numbers resizable>
        ${unsafeHTML(this._code)}
      </playground-ide>

      <button ?disabled="${this.isCompiling}" @click="${this._compileAndUpload}">
        ${this.isCompiling ? 'Compiling...' : 'Compile & Upload'}
      </button>

      ${this.compilationErrors.length > 0
        ? html`
          <div class="error-container">
              <h3>Compilation Errors:</h3>
              ${this.compilationErrors.map(
                error => html`
              <div class="error-item">${error}</div>
            `
              )}
            </div>
        `
        : ''}
    `;
  }

  private _dispatchDeployedUrlChange(value: string) {
    this.dispatchEvent(
      new CustomEvent('renderer-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async _compileAndUpload() {
    try {
      this.isCompiling = true;
      const config = this.editorContainer?.config;

      return compileAndUploadEndpoint(
        this.baseURL,
        this.contentTypeData?.metadata?.type,
        config.files
      );
    } catch (error: unknown) {
      this.compilationErrors = [
        `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ];
    } finally {
      this.isCompiling = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'renderer-tab': RendererTab;
  }
}
