import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import '../../../../../components/atoms/labeled-input';
import { generateDefaultComponentCode } from '../utils/component-generator';
import { ContentTypeData } from '../../../../../types';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { ViewUpdate } from '@codemirror/view';

@customElement('renderer-tab')
export class RendererTab extends LitElement {
  @property({ type: String }) baseURL = '';
  @property({ type: Object }) contentTypeData: ContentTypeData | null = null;
  @property({ type: Boolean }) isCompiling = false;
  @property({ type: Array }) compilationErrors: string[] = [];

  @state()
  private _code: string = '';

  @state()
  private _deployedUrl: string = '';

  @query('#editor-container')
  private _editorContainer!: HTMLElement;

  private _editor?: EditorView;

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    ui-labeled-input {
      margin-bottom: 15px;
      display: block;
    }
    #editor-container {
      width: 100%;
      height: 400px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 15px;
      overflow: hidden;
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

  connectedCallback() {
    super.connectedCallback();
    if (this.contentTypeData) {
      // If code exists in contentTypeData, use it
      if (this.contentTypeData.code) {
        this._code = this.contentTypeData.code;
      } else {
        // Generate default code based on content type properties
        this._code = generateDefaultComponentCode(this.contentTypeData);
      }
      this._deployedUrl = this.contentTypeData.deployedUrl || '';
    }
  }

  firstUpdated() {
    this._initCodeEditor();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('contentTypeData') && this.contentTypeData) {
      if (this._editor) {
        this._editor.dispatch({
          changes: {
            from: 0,
            to: this._editor.state.doc.length,
            insert: this._code
          }
        });
      } else {
        this._initCodeEditor();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._editor?.destroy();
  }

  private _initCodeEditor() {
    if (!this._editorContainer) return;
    
    // Destroy previous instance if it exists
    this._editor?.destroy();
    
    // Create a new editor
    this._editor = new EditorView({
      doc: this._code,
      extensions: [
        basicSetup,
        javascript({ typescript: true }),
        oneDark,
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            this._code = update.state.doc.toString();
            this._dispatchCodeChange(this._code);
          }
        })
      ],
      parent: this._editorContainer
    });
  }

  render() {
    return html`
      <ui-labeled-input
        label="Deployed URL"
        .value="${this._deployedUrl}"
        @input-change="${(e: CustomEvent) => this._dispatchDeployedUrlChange(e.detail.value)}"
      ></ui-labeled-input>

      <label for="editor-container">Component Code</label>
      <div id="editor-container"></div>

      <button 
        ?disabled="${this.isCompiling}" 
        @click="${this._compileAndUpload}"
      >
        ${this.isCompiling ? 'Compiling...' : 'Compile & Upload'}
      </button>

      ${this.compilationErrors.length > 0 
        ? html`
          <div class="error-container">
            <h3>Compilation Errors:</h3>
            ${this.compilationErrors.map(error => html`
              <div class="error-item">${error}</div>
            `)}
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

  private _dispatchCodeChange(code: string) {
    this.dispatchEvent(
      new CustomEvent('code-change', {
        detail: { code },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async _compileAndUpload() {
    if (!this._code.trim()) return;
    
    try {
      this.isCompiling = true;
      this.compilationErrors = [];
      
      const response = await fetch(`${this.baseURL}/compile-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: this._code,
          key: this.contentTypeData?.metadata?.type || 'unknown-component'
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        this.compilationErrors = Array.isArray(result.errors) 
          ? result.errors 
          : [result.error || 'Compilation failed'];
        return;
      }
      
      // Update the deployed URL if successful
      if (result.url) {
        this._deployedUrl = result.url;
        this._dispatchDeployedUrlChange(result.url);
      }
      
    } catch (error: unknown) {
      this.compilationErrors = [`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`];
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
