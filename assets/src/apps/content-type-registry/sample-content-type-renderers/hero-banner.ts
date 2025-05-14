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
      display: var(--hero-banner__host__display, block);
      position: var(--hero-banner__host__position, relative);
      width: var(--hero-banner__host__width, 100%);
      height: var(--hero-banner__host__height, 400px);
      overflow: var(--hero-banner__host__overflow, hidden);
      border-radius: var(--hero-banner__host__border-radius, 8px);
    }

    .hero-container {
      position: var(--hero-banner__hero-container__position, relative);
      width: var(--hero-banner__hero-container__width, 100%);
      height: var(--hero-banner__hero-container__height, 100%);
      display: var(--hero-banner__hero-container__display, flex);
      flex-direction: var(--hero-banner__hero-container__flex-direction, column);
      justify-content: var(--hero-banner__hero-container__justify-content, center);
      align-items: var(--hero-banner__hero-container__align-items, center);
      text-align: var(--hero-banner__hero-container__text-align, center);
      color: var(--hero-banner__hero-container__color, white);
      padding: var(--hero-banner__hero-container__padding, 20px);
      box-sizing: var(--hero-banner__hero-container__box-sizing, border-box);
    }

    .hero-background {
      position: var(--hero-banner__hero-background__position, absolute);
      top: var(--hero-banner__hero-background__top, 0);
      left: var(--hero-banner__hero-background__left, 0);
      width: var(--hero-banner__hero-background__width, 100%);
      height: var(--hero-banner__hero-background__height, 100%);
      object-fit: var(--hero-banner__hero-background__object-fit, cover);
      z-index: var(--hero-banner__hero-background__z-index, -1);
    }

    .hero-overlay {
      position: var(--hero-banner__hero-overlay__position, absolute);
      top: var(--hero-banner__hero-overlay__top, 0);
      left: var(--hero-banner__hero-overlay__left, 0);
      width: var(--hero-banner__hero-overlay__width, 100%);
      height: var(--hero-banner__hero-overlay__height, 100%);
      background-color: var(--hero-banner__hero-overlay__background-color, rgba(0, 0, 0, 0.5));
      z-index: var(--hero-banner__hero-overlay__z-index, -1);
    }

    .hero-title {
      font-size: var(--hero-banner__hero-title__font-size, 48px);
      font-weight: var(--hero-banner__hero-title__font-weight, bold);
      margin-bottom: var(--hero-banner__hero-title__margin-bottom, 16px);
      text-shadow: var(--hero-banner__hero-title__text-shadow, 1px 1px 3px rgba(0, 0, 0, 0.5));
    }

    .hero-subtitle {
      font-size: var(--hero-banner__hero-subtitle__font-size, 24px);
      margin-bottom: var(--hero-banner__hero-subtitle__margin-bottom, 32px);
      max-width: var(--hero-banner__hero-subtitle__max-width, 600px);
      text-shadow: var(--hero-banner__hero-subtitle__text-shadow, 1px 1px 2px rgba(0, 0, 0, 0.5));
    }

    .hero-cta {
      display: var(--hero-banner__hero-cta__display, inline-block);
      padding: var(--hero-banner__hero-cta__padding, 12px 24px);
      background-color: var(--hero-banner__hero-cta__background-color, #3498db);
      color: var(--hero-banner__hero-cta__color, white);
      text-decoration: var(--hero-banner__hero-cta__text-decoration, none);
      border-radius: var(--hero-banner__hero-cta__border-radius, 4px);
      font-weight: var(--hero-banner__hero-cta__font-weight, bold);
      text-transform: var(--hero-banner__hero-cta__text-transform, uppercase);
      transition: var(--hero-banner__hero-cta__transition, background-color 0.3s);
    }

    .hero-cta:hover {
      background-color: var(--hero-banner__hero-cta-hover__background-color, #2980b9);
    }

    .hero-placeholder {
      background-color: var(--hero-banner__hero-placeholder__background-color, #f5f5f5);
      color: var(--hero-banner__hero-placeholder__color, #333);
      display: var(--hero-banner__hero-placeholder__display, flex);
      flex-direction: var(--hero-banner__hero-placeholder__flex-direction, column);
      justify-content: var(--hero-banner__hero-placeholder__justify-content, center);
      align-items: var(--hero-banner__hero-placeholder__align-items, center);
      width: var(--hero-banner__hero-placeholder__width, 100%);
      height: var(--hero-banner__hero-placeholder__height, 100%);
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
              ${this.ctaText
                ? html`<a href="${this.ctaUrl}" class="hero-cta">${this.ctaText}</a>`
                : ''}
            </div>
          `
        : html`
            <div class="hero-placeholder">
              <h1 class="hero-title" style="color: #333;">${this.title}</h1>
              <p class="hero-subtitle" style="color: #555;">${this.subtitle}</p>
              ${this.ctaText
                ? html`<a href="${this.ctaUrl}" class="hero-cta">${this.ctaText}</a>`
                : ''}
            </div>
          `}
    `;
  }
}

export default HeroBanner;
