import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GridRow, ContentItem } from '../../types';
import './component-renderer';

@customElement('grid-renderer')
export class GridRenderer extends LitElement {
  @property({ type: Array })
  rows: GridRow[] = [];

  @property({ type: Array })
  components: ContentItem[] = [];

  @property({ type: String })
  baseURL = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .grid-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .grid-row {
      display: flex;
      gap: 20px;
    }

    .grid-cell {
      flex: 1;
      min-height: 100px;
    }

    .grid-cell[data-columns='2'] {
      flex: 2;
    }

    .grid-cell[data-columns='3'] {
      flex: 3;
    }

    .grid-cell[data-columns='4'] {
      flex: 4;
    }
  `;

  private getComponentForCell(componentId: string | null): ContentItem | undefined {
    if (!componentId) return undefined;
    return this.components.find(component => component.id === componentId);
  }

  render() {
    return html`
      <div class="grid-container">
        ${this.rows.map(
          row => html`
            <div class="grid-row">
              ${row.cells.map(
                cell => html`
                  <div
                    class="grid-cell"
                    data-columns="${cell.colSpan}"
                  >
                    ${(() => {
                      const component = this.getComponentForCell(cell.componentId);
                      if (component) {
                        return html`
                          <component-renderer
                            .component="${component}"
                            .baseURL="${this.baseURL}"
                          ></component-renderer>
                        `;
                      }
                      return null;
                    })()}
                  </div>
                `
              )}
            </div>
          `
        )}
      </div>
    `;
  }
}

export default GridRenderer;
