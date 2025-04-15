import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContentItem } from '../../types';
import { getContentTypeMetaData } from '../../utils/content-type-utility';
import { convertToWebComponentName } from '../content-type-app/components/content-type-form/utils/component-generator';

@customElement('component-renderer')
export class ComponentRenderer extends LitElement {
  @property({ type: Object })
  component!: ContentItem;

  @property({ type: String })
  baseURL = '';

  @state()
  private loading = true;

  @state()
  private error: string | null = null;

  @state()
  private element: HTMLElement | null = null;

  // Track loaded scripts to avoid duplicates
  private static loadedScripts = new Set<string>();

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }

    .error {
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #e53935;
      margin-bottom: 20px;
    }

    .warning {
      padding: 15px;
      background-color: #fff3cd;
      color: #856404;
      border-radius: 4px;
      margin-bottom: 20px;
      border: 1px solid #ffeeba;
    }
  `;

  protected firstUpdated() {
    this.prepareComponent();
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('component') || changedProperties.has('baseURL')) {
      this.prepareComponent();
    }
  }

  /**
   * Load the script for an external component if it's not already loaded
   */
  private async loadComponentScript(url: string): Promise<boolean> {
    if (ComponentRenderer.loadedScripts.has(url)) {
      return true; // Script already loaded
    }

    // Create a proxy URL for external scripts to avoid CORS issues
    const proxyUrl = url.startsWith('http')
      ? `${this.baseURL}/proxy-script?url=${encodeURIComponent(url)}`
      : url;


    return new Promise(resolve => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = proxyUrl;

      script.onload = () => {
        // ComponentRenderer.loadedScripts.add(url); // Store original URL in the Set
        resolve(true);
      };

      script.onerror = () => {
        console.error(`Failed to load component script: ${url}`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Create and configure the component element
   */
  private createComponentElement(tagName: string, properties: Record<string, any>): HTMLElement {

    const elementName = convertToWebComponentName(tagName);

    const element = document.createElement(elementName);

    // Set properties on the element
    Object.entries(properties).forEach(([key, value]) => {
      // Use property setter if available, otherwise set attribute
      if (key in element) {
        // @ts-ignore: Property assignment
        element[key] = value;
      } else {
        // Convert non-string values to JSON string
        const attrValue = typeof value === 'string' ? value : JSON.stringify(value);

        element.setAttribute(key, attrValue);
      }
    });

    return element;
  }

  /**
   * Prepare the component for rendering
   */
  private async prepareComponent() {
    if (!this.component || !this.baseURL) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const { type, properties } = this.component;

      console.log('properties', properties, type);

      // Get component metadata from registry
      const metadata = await getContentTypeMetaData({
        baseURL: this.baseURL,
        type,
      });

      if (!metadata) {
        throw new Error(`Component type "${type}" not found in registry`);
      }

      // Convert camelCase to kebab-case for tag name
      const tagName = type.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

      // Check if the component is built-in or external
      if (!metadata.isBuiltIn) {
        // For external components, load the script first
        const registryModule = await import('../../utils/content-type-utility');
        const components = await registryModule.getAllContentTypes({
          baseURL: this.baseURL,
        });
        const deployedUrl = components.find(c => c.metadata.type === type)?.deployedUrl || '';

        if (!deployedUrl) {
          throw new Error(`No deployed URL found for component type: ${type}`);
        }

        // Load the script now
        await this.loadComponentScript(deployedUrl);
      }

      // Create and configure the component element
      this.element = this.createComponentElement(tagName, properties);

      // Mark loading as complete
      this.loading = false;
    } catch (error) {
      this.error = (error as Error).message;
      this.loading = false;
      console.error('Error preparing component:', error);
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading component...</div>`;
    }

    if (this.error) {
      return html` <div class="error">Failed to render component: ${this.error}</div> `;
    }

    // Render the component element
    return html`${this.element}`;
  }
}

export default ComponentRenderer;
