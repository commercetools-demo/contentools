import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getAllComponentTypes, ComponentType } from '../../registry';
import { ComponentMetadata } from '../../../types';

@customElement('cms-component-library')
export class ComponentLibrary extends LitElement {
  @property({ type: String })
  baseURL: string = '';

  @state()
  private componentTypes: ComponentMetadata[] = [];

  @state()
  private loading = true;

  @state()
  private error?: string;

  static styles = css`
    .component-library {
      margin-bottom: 30px;
    }
    
    h2 {
      font-size: 1.2rem;
      margin-bottom: 15px;
    }
    
    .component-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .component-item {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      background-color: white;
      width: calc(50% - 5px);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: move;
      transition: all 0.2s;
      user-select: none;
    }
    
    .component-item:hover {
      border-color: #3498db;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .component-icon {
      font-size: 1.5rem;
    }
    
    .component-details {
      flex: 1;
    }
    
    .component-name {
      font-weight: 500;
    }
    
    .component-description {
      font-size: 0.8rem;
      color: #777;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadComponentTypes();
  }

  async loadComponentTypes() {
    try {
      this.componentTypes = await getAllComponentTypes({ baseURL: this.baseURL });
      this.loading = false;
    } catch (err) {
      this.error = `Failed to load component types: ${err instanceof Error ? err.message : String(err)}`;
      this.loading = false;
      console.error('Error loading component types:', err);
    }
  }

  firstUpdated() {
    this._setupDragEvents();
  }

  private _setupDragEvents() {
    const componentItems = this.renderRoot.querySelectorAll('.component-item');
    componentItems.forEach(item => {
      item.addEventListener('dragstart', (e: Event) => this._handleDragStart(e as DragEvent));
    });
  }

  private _handleDragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    const componentType = target.getAttribute('data-component-type') as ComponentType;
    
    if (e.dataTransfer && componentType) {
      // Set data for HTML5 drag and drop
      e.dataTransfer.setData('application/component-type', componentType);
      e.dataTransfer.effectAllowed = 'copy';
      
      // Dispatch custom event for component drag
      const dragEvent = new CustomEvent('component-drag-start', {
        bubbles: true,
        composed: true,
        detail: { componentType }
      });
      
      this.dispatchEvent(dragEvent);
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="component-library">
        <h2>Component Library</h2>
        <div>Loading components...</div>
      </div>`;
    }

    if (this.error) {
      return html`<div class="component-library">
        <h2>Component Library</h2>
        <div class="error">${this.error}</div>
      </div>`;
    }
    
    return html`
      <div class="component-library">
        <h2>Component Library</h2>
        <div class="component-list">
          ${this.componentTypes.map(type => html`
            <div 
              class="component-item cms-component-item" 
              data-component-type=${type.type}
              draggable="true"
            >
              <div class="component-icon">${type.icon}</div>
              <div class="component-details">
                <div class="component-name">${type.name}</div>
                <div class="component-description">Drag to add to layout</div>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}