import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../store';
import { GridRow, GridCell, Component } from '../types';
import { addRow, removeRow, updateCellSpan, moveComponent } from '../store/pages.slice';
import { selectComponent } from '../store/editor.slice';
import { renderComponentPreview } from './templates';
import { createComponent, ComponentType } from './registry';
import { initComponentDragDrop } from '../utils/drag-drop';
import Sortable from 'sortablejs';

@customElement('cms-layout-grid')
export class LayoutGrid extends connect(store)(LitElement) {
  @property({ type: Array })
  rows: GridRow[] = [];

  @property({ type: Array })
  components: Component[] = [];

  @property({ type: Object })
  selectedCell: { rowId: string, cellId: string } | null = null;

  @state()
  private _sortableInstances: Sortable[] = [];

  static styles = css`
    .layout-grid {
      margin-bottom: 30px;
    }
    
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .grid-header h2 {
      font-size: 1.2rem;
      margin: 0;
    }
    
    .grid-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .grid-row {
      display: flex;
      gap: 15px;
      min-height: 100px;
      position: relative;
    }
    
    .row-header {
      background: rgba(0,0,0,0.05);
      padding: 5px 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .row-delete {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 16px;
    }
    
    .grid-cell {
      flex: 1;
      border: 1px dashed #ddd;
      border-radius: 4px;
      padding: 15px;
      background-color: #f9f9f9;
      min-height: 100px;
      position: relative;
      transition: all 0.2s;
    }
    
    .grid-cell.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    }
    
    .grid-cell.has-component {
      border-style: solid;
      background-color: white;
    }
    
    .grid-cell.selected {
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    .cell-resize {
      position: absolute;
      bottom: 5px;
      right: 5px;
      display: flex;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .grid-cell:hover .cell-resize {
      opacity: 1;
    }
    
    .cell-resize button {
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }
    
    .cell-resize button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    .add-row-btn {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .add-row-btn:hover {
      background-color: #2980b9;
    }
    
    .grid-info {
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
    }
    
    .sortable-ghost {
      opacity: 0.5;
    }
    
    .sortable-chosen {
      outline: 2px dashed #3498db;
    }
  `;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroySortable();
  }

  updated() {
    this._setupDragDrop();
  }

  render() {
    return html`
      <div class="layout-grid">
        <div class="grid-header">
          <h2>Layout Grid</h2>
          <button class="add-row-btn" @click=${this._handleAddRow}>+ Add Row</button>
        </div>
        
        <div class="grid-info">
          Drag components from the component library to place them on the grid.
          Click on a component to edit its properties.
        </div>
        
        <div class="grid-container">
          ${this.rows.map((row, rowIndex) => html`
            <div class="grid-row" data-row-id=${row.id}>
              <div class="row-header">
                <span>Row ${rowIndex + 1}</span>
                <button 
                  class="row-delete" 
                  @click=${() => this._handleRemoveRow(row.id)}
                  ?disabled=${this.rows.length === 1}
                  title=${this.rows.length === 1 ? 'Cannot remove the last row' : 'Remove row'}
                >
                  ✕
                </button>
              </div>
              
              ${row.cells.map(cell => {
                const component = this.getComponentForCell(cell.componentId);
                const colWidth = (cell.colSpan / 12) * 100;
                
                return html`
                  <div 
                    class="grid-cell ${component ? 'has-component' : 'empty'} ${this.isSelected(row.id, cell.id) ? 'selected' : ''}"
                    style="flex: 0 0 ${colWidth}%;"
                    data-row-id=${row.id}
                    data-cell-id=${cell.id}
                    data-component-id=${component?.id || ''}
                    @click=${() => this._handleCellClick(row.id, cell.id, component?.id)}
                  >
                    ${component 
                      ? renderComponentPreview(component) 
                      : html`<span>Drop component here</span>`
                    }
                    
                    <div class="cell-resize">
                      <button 
                        @click=${(e: Event) => this._handleDecreaseWidth(e, row.id, cell.id)}
                        ?disabled=${cell.colSpan <= 1}
                        title="Decrease width"
                      >
                        -
                      </button>
                      <button 
                        @click=${(e: Event) => this._handleIncreaseWidth(e, row.id, cell.id)}
                        ?disabled=${cell.colSpan >= 12}
                        title="Increase width"
                      >
                        +
                      </button>
                    </div>
                  </div>
                `;
              })}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private getComponentForCell(componentId: string | null): Component | undefined {
    if (!componentId) return undefined;
    return this.components.find(c => c.id === componentId);
  }

  private isSelected(rowId: string, cellId: string): boolean {
    return !!(this.selectedCell && this.selectedCell.rowId === rowId && this.selectedCell.cellId === cellId);
  }

  private _handleAddRow() {
    store.dispatch(addRow());
  }

  private _handleRemoveRow(rowId: string) {
    if (this.rows.length <= 1) return; // Don't remove the last row
    store.dispatch(removeRow(rowId));
  }

  private _handleCellClick(rowId: string, cellId: string, componentId?: string) {
    this.selectedCell = { rowId, cellId };
    
    // If the cell has a component, select it for editing
    if (componentId) {
      store.dispatch(selectComponent(componentId));
    } else {
      store.dispatch(selectComponent(null));
    }
  }

  private _handleIncreaseWidth(e: Event, rowId: string, cellId: string) {
    e.stopPropagation(); // Prevent cell selection
    
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;
    
    const cell = row.cells.find(c => c.id === cellId);
    if (!cell || cell.colSpan >= 12) return;
    
    store.dispatch(updateCellSpan({ rowId, cellId, colSpan: cell.colSpan + 1 }));
  }

  private _handleDecreaseWidth(e: Event, rowId: string, cellId: string) {
    e.stopPropagation(); // Prevent cell selection
    
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;
    
    const cell = row.cells.find(c => c.id === cellId);
    if (!cell || cell.colSpan <= 1) return;
    
    store.dispatch(updateCellSpan({ rowId, cellId, colSpan: cell.colSpan - 1 }));
  }

  private _setupDragDrop() {
    // Need to wait for the DOM to update
    setTimeout(() => {
      // Get all the grid cells
      const cells = Array.from(this.renderRoot.querySelectorAll('.grid-cell:not(.has-component)')) as HTMLElement[];
      
      // Get component items from parent
      const componentItems = Array.from(document.querySelectorAll('.cms-component-item')) as HTMLElement[];
      
      // Set up drag and drop
      initComponentDragDrop(componentItems, cells, this._handleComponentDrop.bind(this));
      
      // Set up Sortable for each row
      this._setupSortable();
    }, 0);
  }

  private _setupSortable() {
    this._destroySortable();
    
    const rows = Array.from(this.renderRoot.querySelectorAll('.grid-row')) as HTMLElement[];
    
    this._sortableInstances = rows.map(row => {
      return new Sortable(row, {
        group: 'grid-components',
        animation: 150,
        draggable: '.grid-cell.has-component',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: evt => {
          const componentId = evt.item.getAttribute('data-component-id') || '';
          const sourceRowId = evt.from.getAttribute('data-row-id') || '';
          const sourceCellId = evt.item.getAttribute('data-cell-id') || '';
          const targetRowId = evt.to.getAttribute('data-row-id') || '';
          const targetCellId = evt.item.getAttribute('data-cell-id') || '';
          
          if (componentId && sourceRowId && sourceCellId && targetRowId && targetCellId) {
            store.dispatch(moveComponent({
              componentId,
              sourceRowId,
              sourceCellId,
              targetRowId,
              targetCellId
            }));
          }
        }
      });
    });
  }

  private _destroySortable() {
    this._sortableInstances.forEach(instance => {
      if (instance && instance.destroy) {
        instance.destroy();
      }
    });
    this._sortableInstances = [];
  }

  private _handleComponentDrop(componentType: ComponentType, cellElement: HTMLElement) {
    const rowId = cellElement.getAttribute('data-row-id');
    const cellId = cellElement.getAttribute('data-cell-id');
    
    if (!rowId || !cellId) return;
    
    // Create a new component from the component type
    const newComponent = createComponent(componentType);
    
    // Dispatch action to add the component
    store.dispatch({
      type: 'pages/addComponent',
      payload: {
        component: newComponent,
        rowId,
        cellId
      }
    });
    
    // Select the new component
    this.selectedCell = { rowId, cellId };
    store.dispatch(selectComponent(newComponent.id));
  }
}