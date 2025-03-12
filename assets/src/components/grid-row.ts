import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GridRow, Component } from '../types';
import { store } from '../store';
import { updateCellSpan, moveComponent } from '../store/pages.slice';
import { renderComponentPreview } from './templates';
import { NUMBER_OF_COLUMNS } from '../constants';
import Sortable from 'sortablejs';

@customElement('cms-grid-row')
export class GridRowComponent extends LitElement {
  @property({ type: Object })
  row!: GridRow;
  
  @property({ type: Number })
  rowIndex!: number;
  
  @property({ type: Array })
  components: Component[] = [];
  
  @property({ type: Object })
  selectedCell: { rowId: string, cellId: string } | null = null;
  
  @property({ type: String })
  activeComponentType: string | null = null;
  
  private _sortableInstance: Sortable | null = null;
  
  static styles = css`
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
    
    .sortable-ghost {
      opacity: 0.5;
    }
    
    .sortable-chosen {
      outline: 2px dashed #3498db;
    }
    
    .grid-cell.drag-over {
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.5);
      background-color: rgba(52, 152, 219, 0.1);
    }
  `;
  
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => this._setupSortable());
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroySortable();
  }
  
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('row') || changedProperties.has('components')) {
      // Update sortable when row or components change
      this.updateComplete.then(() => {
        this._destroySortable();
        this._setupSortable();
      });
    }
  }
  
  render() {
    // Calculate filled and empty cells
    const filledCells = this.row.cells.filter(cell => 
      this.components.some(c => c.id === cell.componentId)
    ).length;
    
    const emptyCells = this.row.cells.length - filledCells;
    
    return html`
      <div class="grid-row" data-row-id=${this.row.id}>
        <div class="row-header">
          <span>Row ${this.rowIndex + 1} (${filledCells} filled, ${emptyCells} empty)</span>
          <button 
            class="row-delete" 
            @click=${this._handleRemoveRow}
            title="Remove row"
          >
            ✕
          </button>
        </div>
        
        ${this.row.cells.map(cell => {
          const component = this.getComponentForCell(cell.componentId);
          const colWidth = (cell.colSpan / NUMBER_OF_COLUMNS) * 100;
          
          return html`
            <div 
              class="grid-cell ${component ? 'has-component' : 'empty'} ${this.isSelected(cell.id) ? 'selected' : ''}"
              style="flex: 0 0 ${colWidth}%;"
              data-row-id=${this.row.id}
              data-cell-id=${cell.id}
              data-component-id=${component?.id || ''}
              @click=${() => this._handleCellClick(cell.id, component?.id)}
              @dragover=${this._handleDragOver}
              @dragleave=${this._handleDragLeave}
              @drop=${(e: DragEvent) => this._handleDrop(e, cell.id)}
            >
              ${component 
                ? renderComponentPreview(component) 
                : html`<span>Drop component here</span>`
              }
              
              <div class="cell-resize">
                <button 
                  @click=${(e: Event) => this._handleDecreaseWidth(e, cell.id)}
                  ?disabled=${cell.colSpan <= 1}
                  title="Decrease width"
                >
                  -
                </button>
                <button 
                  @click=${(e: Event) => this._handleIncreaseWidth(e, cell.id)}
                  ?disabled=${cell.colSpan >= NUMBER_OF_COLUMNS}
                  title="Increase width"
                >
                  +
                </button>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
  
  private getComponentForCell(componentId: string | null): Component | undefined {
    if (!componentId) return undefined;
    return this.components.find(c => c.id === componentId);
  }
  
  private isSelected(cellId: string): boolean {
    return !!(this.selectedCell && this.selectedCell.rowId === this.row.id && this.selectedCell.cellId === cellId);
  }
  
  private _handleRemoveRow() {
    // Dispatch a custom event to notify parent
    this.dispatchEvent(new CustomEvent('remove-row', {
      detail: { rowId: this.row.id },
      bubbles: true,
      composed: true
    }));
  }
  
  private _handleCellClick(cellId: string, componentId?: string) {
    // Update selected cell
    this.dispatchEvent(new CustomEvent('cell-selected', {
      detail: { rowId: this.row.id, cellId, componentId },
      bubbles: true,
      composed: true
    }));
  }
  
  private _handleIncreaseWidth(e: Event, cellId: string) {
    e.stopPropagation(); // Prevent cell selection
    
    const cell = this.row.cells.find(c => c.id === cellId);
    if (!cell || cell.colSpan >= NUMBER_OF_COLUMNS) return;
    
    store.dispatch(updateCellSpan({ 
      rowId: this.row.id, 
      cellId, 
      colSpan: cell.colSpan + 1 
    }));
  }
  
  private _handleDecreaseWidth(e: Event, cellId: string) {
    e.stopPropagation(); // Prevent cell selection
    
    const cell = this.row.cells.find(c => c.id === cellId);
    if (!cell || cell.colSpan <= 1) return;
    
    store.dispatch(updateCellSpan({ 
      rowId: this.row.id, 
      cellId, 
      colSpan: cell.colSpan - 1 
    }));
  }
  
  private _setupSortable() {
    const rowElement = this.renderRoot.querySelector('.grid-row') as HTMLElement;
    if (!rowElement) return;
    
    this._sortableInstance = new Sortable(rowElement, {
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
  }
  
  private _destroySortable() {
    if (this._sortableInstance) {
      this._sortableInstance.destroy();
      this._sortableInstance = null;
    }
  }
  
  private _handleDragOver(e: DragEvent) {
    // Only allow drop if we have an active component type and the cell is empty
    if (this.activeComponentType && !((e.currentTarget as HTMLElement).classList.contains('has-component'))) {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).classList.add('drag-over');
    }
  }
  
  private _handleDragLeave(e: Event) {
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
  }
  
  private _handleDrop(e: DragEvent, cellId: string) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    
    if (this.activeComponentType && !((e.currentTarget as HTMLElement).classList.contains('has-component'))) {
      // Dispatch event to parent to handle component creation
      this.dispatchEvent(new CustomEvent('component-dropped', {
        detail: { 
          rowId: this.row.id, 
          cellId, 
          componentType: this.activeComponentType 
        },
        bubbles: true,
        composed: true
      }));
    }
  }
} 