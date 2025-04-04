import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('hero-banner')
export class HeroBanner extends LitElement {
  @property({ type: String })
  title = 'Hero Title';

  @property({ type: String })
  subtitle = 'Hero Subtitle';

  @property({ type: String })
  imageUrl = '';

  @property({ type: String })
  ctaText = 'Learn More';

  @property({ type: String })
  ctaUrl = '#';

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      border-radius: 8px;
    }

    .hero-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
      padding: 20px;
      box-sizing: border-box;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }

    .hero-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 16px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    }

    .hero-subtitle {
      font-size: 24px;
      margin-bottom: 32px;
      max-width: 600px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .hero-cta {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      transition: background-color 0.3s;
    }

    .hero-cta:hover {
      background-color: #2980b9;
    }

    .hero-placeholder {
      background-color: #f5f5f5;
      color: #333;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      ${this.imageUrl
        ? html`
            <div class="hero-container">
              <img src="${this.imageUrl}" alt="${this.title}" class="hero-background" />
              <div class="hero-overlay"></div>
              <h1 class="hero-title">${this.title}</h1>
              <p class="hero-subtitle">${this.subtitle}</p>
              <a href="${this.ctaUrl}" class="hero-cta">${this.ctaText}</a>
            </div>
          `
        : html`
            <div class="hero-placeholder">
              <h1 class="hero-title" style="color: #333;">${this.title}</h1>
              <p class="hero-subtitle" style="color: #555;">${this.subtitle}</p>
              <a href="${this.ctaUrl}" class="hero-cta">${this.ctaText}</a>
            </div>
          `}
    `;
  }
}

export default HeroBanner;
