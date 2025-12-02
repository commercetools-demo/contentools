export interface GridCell {
  id: string;
  contentItemKey: string | null;
  colSpan: number;
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

export interface Layout {
  rows: GridRow[];
}

export interface MoveContentItemParams {
  sourceRowId: string;
  sourceCellId: string;
  targetRowId: string;
  targetCellId: string;
  contentItemKey: string;
}
