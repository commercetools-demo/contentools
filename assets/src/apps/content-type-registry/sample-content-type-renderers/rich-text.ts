import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('rich-text')
export class RichText extends LitElement {
  @property({ type: String })
  content = '<p>Enter your content here...</p>';

  static styles = css`
    :host {
      display: var(--rich-text__host__display, block);
      width: var(--rich-text__host__width, 100%);
      font-family: var(--rich-text__host__font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif);
    }

    .rich-text-container {
      width: var(--rich-text__rich-text-container__width, 100%);
      max-width: var(--rich-text__rich-text-container__max-width, 100%);
      overflow-wrap: var(--rich-text__rich-text-container__overflow-wrap, break-word);
      word-wrap: var(--rich-text__rich-text-container__word-wrap, break-word);
    }

    .rich-text-container h1 {
      font-size: var(--rich-text__rich-text-container-h1__font-size, 2.5rem);
      margin-bottom: var(--rich-text__rich-text-container-h1__margin-bottom, 1rem);
      font-weight: var(--rich-text__rich-text-container-h1__font-weight, 700);
      line-height: var(--rich-text__rich-text-container-h1__line-height, 1.2);
    }

    .rich-text-container h2 {
      font-size: var(--rich-text__rich-text-container-h2__font-size, 2rem);
      margin-bottom: var(--rich-text__rich-text-container-h2__margin-bottom, 0.75rem);
      font-weight: var(--rich-text__rich-text-container-h2__font-weight, 600);
      line-height: var(--rich-text__rich-text-container-h2__line-height, 1.3);
    }

    .rich-text-container h3 {
      font-size: var(--rich-text__rich-text-container-h3__font-size, 1.5rem);
      margin-bottom: var(--rich-text__rich-text-container-h3__margin-bottom, 0.5rem);
      font-weight: var(--rich-text__rich-text-container-h3__font-weight, 600);
      line-height: var(--rich-text__rich-text-container-h3__line-height, 1.4);
    }

    .rich-text-container p {
      margin-bottom: var(--rich-text__rich-text-container-p__margin-bottom, 1rem);
      line-height: var(--rich-text__rich-text-container-p__line-height, 1.6);
    }

    .rich-text-container a {
      color: var(--rich-text__rich-text-container-a__color, #0066cc);
      text-decoration: var(--rich-text__rich-text-container-a__text-decoration, none);
      transition: var(--rich-text__rich-text-container-a__transition, color 0.2s);
    }

    .rich-text-container a:hover {
      color: var(--rich-text__rich-text-container-a-hover__color, #004080);
      text-decoration: var(--rich-text__rich-text-container-a-hover__text-decoration, underline);
    }

    .rich-text-container ul,
    .rich-text-container ol {
      margin-bottom: var(--rich-text__rich-text-container-lists__margin-bottom, 1rem);
      padding-left: var(--rich-text__rich-text-container-lists__padding-left, 2rem);
    }

    .rich-text-container li {
      margin-bottom: var(--rich-text__rich-text-container-li__margin-bottom, 0.5rem);
      line-height: var(--rich-text__rich-text-container-li__line-height, 1.6);
    }

    .rich-text-container blockquote {
      border-left: var(--rich-text__rich-text-container-blockquote__border-left, 4px solid #e0e0e0);
      margin-left: var(--rich-text__rich-text-container-blockquote__margin-left, 0);
      margin-right: var(--rich-text__rich-text-container-blockquote__margin-right, 0);
      padding-left: var(--rich-text__rich-text-container-blockquote__padding-left, 1rem);
      color: var(--rich-text__rich-text-container-blockquote__color, #555);
      font-style: var(--rich-text__rich-text-container-blockquote__font-style, italic);
    }

    .rich-text-container img {
      max-width: var(--rich-text__rich-text-container-img__max-width, 100%);
      height: var(--rich-text__rich-text-container-img__height, auto);
      border-radius: var(--rich-text__rich-text-container-img__border-radius, 4px);
      margin: var(--rich-text__rich-text-container-img__margin, 1rem 0);
    }

    .rich-text-container table {
      border-collapse: var(--rich-text__rich-text-container-table__border-collapse, collapse);
      width: var(--rich-text__rich-text-container-table__width, 100%);
      margin: var(--rich-text__rich-text-container-table__margin, 1rem 0);
    }

    .rich-text-container table th,
    .rich-text-container table td {
      border: var(--rich-text__rich-text-container-table-cells__border, 1px solid #e0e0e0);
      padding: var(--rich-text__rich-text-container-table-cells__padding, 0.5rem);
    }

    .rich-text-container table th {
      background-color: var(--rich-text__rich-text-container-table-th__background-color, #f5f5f5);
      font-weight: var(--rich-text__rich-text-container-table-th__font-weight, 600);
    }
  `;

  render() {
    return html` <div class="rich-text-container">${unsafeHTML(this.content)}</div> `;
  }
}

export default RichText;
