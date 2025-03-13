import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { connect, watch } from 'lit-redux-watch';
import { store } from '../../store';
import { RegistryComponentData } from '../../types';
import { fetchRegistryComponents, addRegistryComponent, updateRegistryComponentThunk, removeRegistryComponent } from '../../store/registry.slice';
import '../registry-components';
import './components/component-form';
import './components/component-table';
import './components/header';
import './components/error-message';

@customElement('registry-app')
export class RegistryApp extends connect(store)(LitElement) {
  @property({ type: String })
  baseURL: string = '';

  @watch('registry.components')
  components: RegistryComponentData[] = [];

  @watch('registry.loading')
  loading = false;

  @watch('registry.error')
  error: string | null = null;

  @state()
  private selectedComponent: RegistryComponentData | null = null;

  @state()
  private isAddingComponent = false;

  @state()
  private newComponent: RegistryComponentData = {
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {}
    },
    deployedUrl: ''
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      width: 100%;
      height: 100%;
    }
    
    .registry-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(fetchRegistryComponents({ baseURL: this.baseURL }));
  }

  render() {
    return html`
      <div class="registry-container">
        <registry-header
          @add-component=${this._toggleAddComponent}
        ></registry-header>
        
        <error-message
          .message=${this.error}
        ></error-message>
        
        ${this.isAddingComponent || this.selectedComponent 
          ? html`
            <component-form
              .component=${this.selectedComponent || this.newComponent}
              .isEdit=${!!this.selectedComponent}
              @component-change=${this._handleComponentChange}
              @cancel=${this._cancelForm}
              @save=${this._saveComponent}
            ></component-form>
          `
          : html`
            <component-table
              .components=${this.components}
              .loading=${this.loading}
              @edit=${this._handleEditComponent}
              @remove=${this._handleRemoveComponent}
            ></component-table>
          `
        }
      </div>
    `;
  }

  private _toggleAddComponent() {
    this.isAddingComponent = !this.isAddingComponent;
    this.selectedComponent = null;
    
    // Reset form
    if (this.isAddingComponent) {
      this.newComponent = {
        metadata: {
          type: '',
          name: '',
          icon: '',
          defaultProperties: {},
          propertySchema: {}
        },
        deployedUrl: ''
      };
    }
  }

  private _handleComponentChange(e: CustomEvent) {
    const { component } = e.detail;
    
    if (this.selectedComponent) {
      this.selectedComponent = component;
    } else {
      this.newComponent = component;
    }
  }

  private _handleEditComponent(e: CustomEvent) {
    const { component } = e.detail;
    this.selectedComponent = JSON.parse(JSON.stringify(component)); // Clone to avoid direct mutation
    this.isAddingComponent = false;
  }

  private _handleRemoveComponent(e: CustomEvent) {
    const { type } = e.detail;
    store.dispatch(removeRegistryComponent({ baseURL: this.baseURL, key: type }));
  }

  private _cancelForm() {
    this.isAddingComponent = false;
    this.selectedComponent = null;
  }

  private _saveComponent(e: CustomEvent) {
    const { component } = e.detail;
    
    if (this.selectedComponent) {
      // Update existing component
      store.dispatch(updateRegistryComponentThunk({
        baseURL: this.baseURL,
        key: component.metadata.type,
        component
      }));
    } else {
      // Add new component
      store.dispatch(addRegistryComponent({ baseURL: this.baseURL, component }));
    }
    
    this.isAddingComponent = false;
    this.selectedComponent = null;
  }
}

export default RegistryApp;