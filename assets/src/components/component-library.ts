import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getAllComponentTypes, ComponentType } from './registry';

@customElement('cms-component-library')
export class ComponentLibrary extends LitElement {
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

  firstUpdated() {
    this._setupDragEvents();
  }

  private _setupDragEvents() {
    const componentItems = this.renderRoot.querySelectorAll('.component-item');
    componentItems.forEach(item => {
      item.addEventListener('dragstart', this._handleDragStart.bind(this));
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
    const componentTypes = getAllComponentTypes();
    
    return html`
      <div class="component-library">
        <h2>Component Library</h2>
        <div class="component-list">
          ${componentTypes.map(type => html`
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