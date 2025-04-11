import { ContentTypeData, PropertySchema } from '../../../../../types';

/**
 * Generates default web component code for a content type
 * @param contentTypeData The content type data including property schema
 * @returns A string containing the TypeScript code for a web component
 */
export function generateDefaultComponentCode(contentTypeData: ContentTypeData): string {
  if (!contentTypeData) {
    return getDefaultEmptyComponent('default-component');
  }

  const componentName = contentTypeData.metadata?.type || 'custom-component';
  const className = convertToClassName(componentName);
  
  // Generate property declarations from schema
  const propertyDeclarations = generatePropertyDeclarations(contentTypeData.metadata?.propertySchema || {});
  
  return `import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('${componentName}')
export class ${className} extends LitElement {
${propertyDeclarations}

  static styles = css\`
    :host {
      display: block;
      padding: 10px;
    }
  \`;

  render() {
    return html\`
      <!-- Add your template here -->
    \`;
  }
}

export default ${className};
`;
}

/**
 * Generates property declarations based on content type property schema
 */
function generatePropertyDeclarations(propertySchema: Record<string, PropertySchema>): string {
  if (!propertySchema || Object.keys(propertySchema).length === 0) {
    return '  @property({ type: String }) exampleProp = \'Example Value\';\n';
  }

  return Object.entries(propertySchema).map(([key, prop]) => {
    const type = getPropertyType(prop.type);
    const defaultValue = getDefaultValueByType(prop.type, prop.defaultValue);
    return `  @property({ type: ${type} }) ${key} = ${defaultValue};\n`;
  }).join('');
}

/**
 * Maps content type property types to Lit property types
 */
function getPropertyType(propType: string): string {
  switch (propType?.toLowerCase()) {
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'object':
    case 'array':
      return 'Object';
    case 'datasource':
      return 'Object';
    default:
      return 'String';
  }
}

/**
 * Provides default values based on property type
 */
function getDefaultValueByType(propType: string, defaultValue: any): string {
  if (defaultValue !== undefined && defaultValue !== null) {
    if (propType?.toLowerCase() === 'string') {
      return `'${defaultValue}'`;
    }
    return JSON.stringify(defaultValue);
  }

  switch (propType?.toLowerCase()) {
    case 'number':
      return '0';
    case 'boolean':
      return 'false';
    case 'object':
      return '{}';
    case 'array':
      return '[]';
    default:
      return "''";
  }
}

/**
 * Converts a kebab-case component name to a PascalCase class name
 */
function convertToClassName(componentName: string): string {
  return componentName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Returns a default empty component if no content type data is available
 */
function getDefaultEmptyComponent(name: string = 'default-component'): string {
  const className = convertToClassName(name);
  
  return `import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('${name}')
export class ${className} extends LitElement {
  @property({ type: String }) title = 'Default Component';

  static styles = css\`
    :host {
      display: block;
      padding: 10px;
    }
  \`;

  render() {
    return html\`
      <div>\${this.title}</div>
    \`;
  }
}

export default ${className};
`;
} 