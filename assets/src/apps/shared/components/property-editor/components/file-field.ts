import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../../../components/molecules/media-library';
@customElement('cms-file-field')
export class FileField extends LitElement {
  @property({ type: String })
  label: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  fieldKey: string = '';

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @property({ type: Array })
  extensions: string[] = [];

  @property({ type: Boolean })
  highlight: boolean = false;

  static styles = css`
    .highlight {
      border: 1px solid #ffa600;
      background-color: #ffa600;
    }
  `;

  render() {
    return html`
      <cms-media-library
        label="${this.label}"
        value="${this.value}"
        fieldKey="${this.fieldKey}"
        baseURL="${this.baseURL}"
        businessUnitKey="${this.businessUnitKey}"
        .extensions="${this.extensions}"
        ?highlight="${this.highlight}"
      ></cms-media-library>
    `;
  }
}
