import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GridRow, ContentItem } from '../../types';
import '../shared/components/component-renderer/component-renderer';

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
      display: var(--grid-renderer__host__display, block);
      width: var(--grid-renderer__host__width, 100%);
    }

    .grid-container {
      display: var(--grid-renderer__grid-container__display, flex);
      flex-direction: var(--grid-renderer__grid-container__flex-direction, column);
      gap: var(--grid-renderer__grid-container__gap, 20px);
    }

    .grid-row {
      display: var(--grid-renderer__grid-row__display, flex);
      gap: var(--grid-renderer__grid-row__gap, 20px);
    }

    .grid-cell {
      flex: var(--grid-renderer__grid-cell__flex, 1);
      min-height: var(--grid-renderer__grid-cell__min-height, 100px);
    }

    .grid-cell[data-columns='2'] {
      flex: var(--grid-renderer__grid-cell-2__flex, 2);
    }

    .grid-cell[data-columns='3'] {
      flex: var(--grid-renderer__grid-cell-3__flex, 3);
    }

    .grid-cell[data-columns='4'] {
      flex: var(--grid-renderer__grid-cell-4__flex, 4);
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
