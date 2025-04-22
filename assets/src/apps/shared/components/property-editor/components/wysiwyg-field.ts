import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { debounce } from '../../../../../utils/debounce';

@customElement('cms-wysiwyg-field')
export class WysiwygField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: Boolean })
  required: boolean = false;

  @property({ type: String })
  fieldKey: string = '';

  @property({ type: Boolean })
  highlight: boolean = false;

  // Internal state to track editor content
  @state()
  private editorContent: string = '';

  // Track if initial content has been set
  private initialized = false;

  private debouncedHandleInput: (...args: any[]) => void;

  constructor() {
    super();
    // Create debounced version of handleInput with 300ms delay
    this.debouncedHandleInput = debounce(() => {
      this.handleInput();
    }, 300);
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

    .editor-toolbar {
      display: flex;
      background-color: #f5f5f5;
      padding: 5px;
      border: 1px solid #ddd;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }

    .toolbar-button {
      background: none;
      border: none;
      padding: 5px 8px;
      margin-right: 2px;
      cursor: pointer;
      border-radius: 3px;
    }

    .toolbar-button:hover {
      background-color: #e0e0e0;
    }

    .editor-content {
      height: 200px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 0 0 4px 4px;
      overflow-y: auto;
      background-color: white;
    }

    [contenteditable]:focus {
      outline: none;
    }

    .save-button {
      margin-top: 2px;
      padding: 8px 16px;
      background-color: #4caf50;
      width: 100%;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .save-button:hover {
      background-color: #45a049;
    }

    .save-button:disabled {
      background-color: #cccccc;
      color: #666666;
      cursor: not-allowed;
    }

    .highlight {
      border: 1px solid #ffa600;
      background-color: #ffa600;
    }
  `;

  firstUpdated() {
    // Initialize the editor content once
    this.initializeContent();
  }

  // Initialize content from the value property
  private initializeContent() {
    const editor = this.shadowRoot?.querySelector('.editor-content');
    if (editor && !this.initialized) {
      this.editorContent = this.value;
      editor.innerHTML = this.editorContent;
      this.initialized = true;
    }
  }

  execCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
    this.updateInternalState(); // Update internal state after command execution
  }

  // Update internal state from editor content
  private updateInternalState() {
    const editor = this.shadowRoot?.querySelector('.editor-content');
    if (editor) {
      const newContent = editor.innerHTML;

      // Only update if content actually changed
      if (this.editorContent !== newContent) {
        this.editorContent = newContent;
      }
    }
  }

  // Notify parent of changes
  private notifyChange() {
    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: this.editorContent,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleInput() {
    this.updateInternalState();
  }

  // Check if content has changed from original value
  private hasContentChanged(): boolean {
    return this.editorContent !== this.value;
  }

  render() {
    const contentChanged = this.hasContentChanged();

    return html`
      <div class="form-group ${this.highlight ? 'highlight' : ''}">
        <label for="${this.fieldKey}">${this.label}</label>
        <div class="editor-toolbar">
          <button class="toolbar-button" @click="${() => this.execCommand('bold')}" title="Bold">
            <strong>B</strong>
          </button>
          <button
            class="toolbar-button"
            @click="${() => this.execCommand('italic')}"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            class="toolbar-button"
            @click="${() => this.execCommand('underline')}"
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            class="toolbar-button"
            @click="${() => this.execCommand('formatBlock', 'h2')}"
            title="Heading"
          >
            H
          </button>
          <button
            class="toolbar-button"
            @click="${() => this.execCommand('insertUnorderedList')}"
            title="Bullet List"
          >
            •
          </button>
          <button class="toolbar-button" @click="${this.insertLink}" title="Insert Link">🔗</button>
        </div>
        <div
          class="editor-content"
          contenteditable="true"
          @input="${() => this.debouncedHandleInput()}"
          @blur="${() => this.handleInput()}"
        ></div>
        <button
          class="save-button"
          @click="${() => this.notifyChange()}"
          ?disabled="${!contentChanged}"
        >
          Save Content
        </button>
      </div>
    `;
  }

  private insertLink() {
    const url = prompt('Enter URL', 'https://');
    if (url) {
      this.execCommand('createLink', url);
    }
  }

  updated(changedProperties: Map<string, any>) {
    // Only update content if value changed and it's the first time rendering
    // This prevents wiping out user input when parent component updates
    if (changedProperties.has('value') && !this.initialized) {
      this.initializeContent();
    }
  }
}
