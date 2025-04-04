import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cms-array-field')
export class ArrayField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: Array })
  value: string[] = [];

  @property({ type: String })
  fieldKey: string = '';

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

    .array-field {
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .array-item {
      display: flex;
      margin-bottom: 8px;
    }

    .array-item input {
      flex: 1;
      margin-right: 8px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .array-item button {
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      padding: 0 8px;
    }

    .add-item {
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }
  `;

  render() {
    return html`
      <div class="form-group">
        <label>${this.label}</label>
        <div class="array-field">
          ${this.value.map(
            (item, index) => html`
              <div class="array-item">
                <input
                  type="text"
                  .value=${item}
                  @input=${(e: InputEvent) => this.handleItemChange(e, index)}
                />
                <button @click=${() => this.removeItem(index)}>✕</button>
              </div>
            `
          )}
          <button class="add-item" @click=${this.addItem}>+ Add Item</button>
        </div>
      </div>
    `;
  }

  private handleItemChange(e: InputEvent, index: number) {
    const input = e.target as HTMLInputElement;
    const newValue = [...this.value];
    newValue[index] = input.value;

    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: newValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private addItem() {
    const newValue = [...this.value, ''];
    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: newValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private removeItem(index: number) {
    const newValue = [...this.value];
    newValue.splice(index, 1);

    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: newValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}
