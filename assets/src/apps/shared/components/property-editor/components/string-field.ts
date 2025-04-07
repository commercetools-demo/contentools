import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../../../components/atoms/labeled-input';

@customElement('cms-string-field')
export class StringField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: Boolean })
  required: boolean = false;

  @property({ type: String })
  fieldKey: string = '';

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <ui-labeled-input
        label="${this.label}"
        .value="${this.value}"
        ?required="${this.required}"
        @input-change="${this.handleInput}"
      ></ui-labeled-input>
    `;
  }

  private handleInput(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: e.detail.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}
