import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('rich-text')
export class RichText extends LitElement {
  @property({ type: String })
  content = '<p>Enter your content here...</p>';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        'Open Sans',
        sans-serif;
    }

    .rich-text-container {
      width: 100%;
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .rich-text-container h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .rich-text-container h2 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      line-height: 1.3;
    }

    .rich-text-container h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .rich-text-container p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .rich-text-container a {
      color: #0066cc;
      text-decoration: none;
      transition: color 0.2s;
    }

    .rich-text-container a:hover {
      color: #004080;
      text-decoration: underline;
    }

    .rich-text-container ul,
    .rich-text-container ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }

    .rich-text-container li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .rich-text-container blockquote {
      border-left: 4px solid #e0e0e0;
      margin-left: 0;
      margin-right: 0;
      padding-left: 1rem;
      color: #555;
      font-style: italic;
    }

    .rich-text-container img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .rich-text-container table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
    }

    .rich-text-container table th,
    .rich-text-container table td {
      border: 1px solid #e0e0e0;
      padding: 0.5rem;
    }

    .rich-text-container table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
  `;

  render() {
    return html` <div class="rich-text-container">${unsafeHTML(this.content)}</div> `;
  }
}

export default RichText;
