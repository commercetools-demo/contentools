import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { connect } from 'lit-redux-watch';
import { store } from '../../../../../store';
import { DatasourceInfo, DatasourceParam } from '../../../../../types';
import { fetchDatasourceByKeyThunk } from '../../../../../store/content-type.slice';

@customElement('cms-datasource-field')
export class DatasourceField extends connect(store)(LitElement) {
  @property({ type: String })
  label = '';

  @property({ type: Object })
  value: Record<string, any> = {};

  @property({ type: String })
  fieldKey = '';

  @property({ type: String })
  datasourceType = '';

  @property({ type: String })
  baseURL = '';

  @state()
  private datasource: DatasourceInfo | null = null;

  @state()
  private loading = false;

  @state()
  private error: string | null = null;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 15px;
    }

    .field-label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .field-container {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .param-row {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
    }

    .param-label {
      font-weight: 500;
      margin-bottom: 3px;
    }

    .param-description {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    input[type='text'],
    input[type='number'] {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }

    .required {
      color: #cc0000;
      margin-left: 5px;
    }

    .loading {
      font-style: italic;
      color: #666;
    }

    .error {
      color: #cc0000;
      font-size: 14px;
      margin-top: 5px;
    }
  `;

  constructor() {
    super();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      (changedProperties.has('datasourceType') || changedProperties.has('baseURL')) &&
      this.datasourceType &&
      this.baseURL
    ) {
      this.fetchDatasource();
    }
  }

  async fetchDatasource() {
    if (!this.datasourceType || !this.baseURL) return;

    this.loading = true;
    this.error = null;

    try {
      const result = await store
        .dispatch(
          fetchDatasourceByKeyThunk({
            baseURL: this.baseURL,
            key: this.datasourceType,
          })
        )
        .unwrap();

      this.datasource = result;
    } catch (err) {
      this.error = `Failed to load datasource: ${err instanceof Error ? err.message : String(err)}`;
      console.error('Error loading datasource:', err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div>
        <label class="field-label">${this.label}</label>
        <div class="field-container">
          ${this.loading
            ? html`<div class="loading">Loading datasource...</div>`
            : this.error
              ? html`<div class="error">${this.error}</div>`
              : this.renderDatasourceParams()}
        </div>
      </div>
    `;
  }

  renderDatasourceParams() {
    if (!this.datasource) {
      return html`<div>No datasource information available</div>`;
    }

    return html`
      <div>
        <h4>Datasource: ${this.datasource.name}</h4>
        ${this.datasource.params.map(param => this.renderParam(param))}
      </div>
    `;
  }

  renderParam(param: DatasourceParam) {
    const paramValue = this.value[param.key] || '';
    const isRequired = param.required;

    return html`
      <div class="param-row">
        <label class="param-label">
          ${param.key} ${isRequired ? html`<span class="required">*</span>` : ''}
        </label>
        <div class="param-description">Type: ${param.type}</div>

        ${param.type === 'number'
          ? html`
              <input
                type="number"
                .value="${paramValue}"
                @input="${(e: InputEvent) => this.handleParamChange(param.key, e)}"
              />
            `
          : html`
              <input
                type="text"
                .value="${paramValue}"
                @input="${(e: InputEvent) => this.handleParamChange(param.key, e)}"
              />
            `}
      </div>
    `;
  }

  handleParamChange(paramKey: string, e: InputEvent) {
    const target = e.target as HTMLInputElement;
    let paramValue: any = target.value;

    // Convert to number if the param type is number
    if (target.type === 'number') {
      paramValue = target.value ? Number(target.value) : null;
    }

    const updatedValue = {
      ...this.value,
      [paramKey]: paramValue,
    };

    this.dispatchEvent(
      new CustomEvent('field-change', {
        detail: {
          key: this.fieldKey,
          value: updatedValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cms-datasource-field': DatasourceField;
  }
}
