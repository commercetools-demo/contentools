import Sortable from 'sortablejs';
import { ComponentType } from '../components/registry';

// Initialize drag and drop between component library and grid
export const initComponentDragDrop = (
  componentItems: HTMLElement[],
  gridCells: HTMLElement[],
  onDrop: (componentType: ComponentType, cellElement: HTMLElement) => void
): void => {
  // Make components draggable
  componentItems.forEach(item => {
    item.draggable = true;
    item.addEventListener('dragstart', (e) => {
      if (e.dataTransfer) {
        const componentType = item.getAttribute('data-component-type') as ComponentType;
        e.dataTransfer.setData('application/component-type', componentType);
        e.dataTransfer.effectAllowed = 'copy';
      }
    });
  });

  // Make grid cells droppable
  gridCells.forEach(cell => {
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cell.classList.add('drag-over');
    });

    cell.addEventListener('dragleave', () => {
      cell.classList.remove('drag-over');
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cell.classList.remove('drag-over');

      if (e.dataTransfer) {
        const componentType = e.dataTransfer.getData('application/component-type') as ComponentType;
        if (componentType) {
          onDrop(componentType, cell);
        }
      }
    });
  });
};

// Initialize sortable for components within a grid
export const initGridSortable = (
  gridContainer: HTMLElement,
  onMove: (componentId: string, sourceRowId: string, sourceCellId: string, targetRowId: string, targetCellId: string) => void
): Sortable[] => {
  const sortables: Sortable[] = [];
  
  // Get all rows
  const rows = gridContainer.querySelectorAll('.cms-grid-row');
  
  rows.forEach(row => {
    const rowId = row.getAttribute('data-row-id') || '';
    
    // Create sortable instance for each row
    const sortable = new Sortable(row as HTMLElement, {
      group: 'grid-components',
      animation: 150,
      draggable: '.cms-grid-cell.has-component',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: (evt) => {
        const componentId = evt.item.getAttribute('data-component-id') || '';
        const sourceCellId = evt.item.getAttribute('data-cell-id') || '';
        const targetCellId = evt.to.getAttribute('data-cell-id') || '';
        const targetRowId = evt.to.closest('.cms-grid-row')?.getAttribute('data-row-id') || '';
        
        if (componentId && sourceRowId && sourceCellId && targetRowId && targetCellId) {
          onMove(componentId, rowId, sourceCellId, targetRowId, targetCellId);
        }
      }
    });
    
    sortables.push(sortable);
  });
  
  return sortables;
};