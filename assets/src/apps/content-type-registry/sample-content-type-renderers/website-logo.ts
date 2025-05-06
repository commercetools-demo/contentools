import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('website-logo')
export class WebsiteLogo extends LitElement {
  @property({ type: String })
  logoUrl: string = '';

  @property({ type: String })
  alt: string = 'Website Logo';

  @property({ type: Number })
  width: number = 200;

  @property({ type: Number })
  height: number = 80;

  @property({ type: String })
  linkUrl: string = '';

  static styles = css`
    :host {
      display: block;
    }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    a {
      display: inline-block;
    }
  `;

  render() {
    const logoImage = html`
      <img 
        src="${this.logoUrl}" 
        alt="${this.alt}" 
        width="${this.width}" 
        height="${this.height}"
      />
    `;

    if (this.linkUrl) {
      return html`
        <a href="${this.linkUrl}" title="${this.alt}">
          ${logoImage}
        </a>
      `;
    }

    return logoImage;
  }
}

export default WebsiteLogo;
