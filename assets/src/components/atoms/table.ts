import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../atoms/loading-spinner';

interface TableRow {
  cells: (string | ReturnType<typeof html>)[];
}

@customElement('ui-table')
export class Table extends LitElement {
  @property({ type: Array })
  headers: string[] = [];

  @property({ type: Array })
  rows: TableRow[] = [];

  @property({ type: Boolean })
  loading = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      text-align: left;
      padding: 12px 15px;
      background-color: #f8f9fa;
      border-bottom: 2px solid #ddd;
    }

    .table td {
      padding: 10px 15px;
      border-bottom: 1px solid #ddd;
    }

    .table tr:hover {
      background-color: #f5f5f5;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: #7f8c8d;
    }
  `;

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <ui-loading-spinner></ui-loading-spinner>
        </div>
      `;
    }

    if (this.rows.length === 0) {
      return html`
        <div class="empty-state">
          <p>No items found.</p>
        </div>
      `;
    }

    return html`
      <table class="table">
        <thead>
          <tr>
            ${this.headers.map(header => html`<th>${header}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${this.rows.map(
            row => html`
              <tr>
                ${row.cells.map(cell => html`<td>${cell}</td>`)}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}
