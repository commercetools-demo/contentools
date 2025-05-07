import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import countryToCurrency, { Countries } from 'country-to-currency';

export interface Product {
  masterVariant: {
    sku: string;
    images: {
      url: string;
    }[];
    prices: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
    }[];
  };
  name: {
    [key: string]: string;
  };
}

@customElement('product-slider')
export class ProductSlider extends LitElement {
  @property({ type: String })
  title = 'Featured Products';

  @property({ type: Array })
  skus: Product[] = [];

  @property({ type: String })
  locale?: string = 'en-US';

  @property({ type: Boolean })
  autoplay = true;

  @property({ type: Number })
  slidesToShow = 4;

  @state()
  private currentSlide = 0;

  @state()
  private interval: number | null = null;

  static styles = css`
    :host {
      display: var(--product-slider__host__display, block);
      margin: var(--product-slider__host__margin, 30px 0);
    }

    .slider-container {
      width: var(--product-slider__slider-container__width, 100%);
    }

    .slider-title {
      font-size: var(--product-slider__slider-title__font-size, 24px);
      font-weight: var(--product-slider__slider-title__font-weight, bold);
      margin-bottom: var(--product-slider__slider-title__margin-bottom, 20px);
      color: var(--product-slider__slider-title__color, #333);
    }

    .slider-wrapper {
      position: var(--product-slider__slider-wrapper__position, relative);
      overflow: var(--product-slider__slider-wrapper__overflow, hidden);
    }

    .slider-track {
      display: var(--product-slider__slider-track__display, flex);
      transition: var(--product-slider__slider-track__transition, transform 0.5s ease);
    }

    .slider-slide {
      flex: var(--product-slider__slider-slide__flex, 0 0 calc(100% / var(--slides-to-show, 4)));
      padding: var(--product-slider__slider-slide__padding, 0 10px);
      box-sizing: var(--product-slider__slider-slide__box-sizing, border-box);
    }

    .product-card {
      border: var(--product-slider__product-card__border, 1px solid #ddd);
      border-radius: var(--product-slider__product-card__border-radius, 8px);
      overflow: var(--product-slider__product-card__overflow, hidden);
      background-color: var(--product-slider__product-card__background-color, white);
      box-shadow: var(--product-slider__product-card__box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      height: var(--product-slider__product-card__height, 100%);
      display: var(--product-slider__product-card__display, flex);
      flex-direction: var(--product-slider__product-card__flex-direction, column);
    }

    .product-image {
      aspect-ratio: var(--product-slider__product-image__aspect-ratio, 1);
      object-fit: var(--product-slider__product-image__object-fit, contain);
      background-color: var(--product-slider__product-image__background-color, #f5f5f5);
      display: var(--product-slider__product-image__display, flex);
      align-items: var(--product-slider__product-image__align-items, center);
      justify-content: var(--product-slider__product-image__justify-content, center);
      color: var(--product-slider__product-image__color, #999);
    }

    .product-image img {
      max-width: var(--product-slider__product-image-img__max-width, 200px);
      object-fit: var(--product-slider__product-image-img__object-fit, contain);
    }

    .product-details {
      padding: var(--product-slider__product-details__padding, 15px);
      flex-grow: var(--product-slider__product-details__flex-grow, 1);
      display: var(--product-slider__product-details__display, flex);
      flex-direction: var(--product-slider__product-details__flex-direction, column);
    }

    .product-name {
      font-weight: var(--product-slider__product-name__font-weight, bold);
      margin-bottom: var(--product-slider__product-name__margin-bottom, 8px);
      color: var(--product-slider__product-name__color, #333);
    }

    .product-sku {
      font-size: var(--product-slider__product-sku__font-size, 12px);
      color: var(--product-slider__product-sku__color, #777);
      margin-bottom: var(--product-slider__product-sku__margin-bottom, 15px);
    }

    .product-price {
      font-weight: var(--product-slider__product-price__font-weight, bold);
      color: var(--product-slider__product-price__color, #3498db);
      margin-top: var(--product-slider__product-price__margin-top, auto);
    }

    .slider-controls {
      display: var(--product-slider__slider-controls__display, flex);
      justify-content: var(--product-slider__slider-controls__justify-content, center);
      margin-top: var(--product-slider__slider-controls__margin-top, 20px);
    }

    .slider-arrow {
      background: var(--product-slider__slider-arrow__background, #3498db);
      color: var(--product-slider__slider-arrow__color, white);
      border: var(--product-slider__slider-arrow__border, none);
      width: var(--product-slider__slider-arrow__width, 40px);
      height: var(--product-slider__slider-arrow__height, 40px);
      border-radius: var(--product-slider__slider-arrow__border-radius, 50%);
      margin: var(--product-slider__slider-arrow__margin, 0 5px);
      cursor: var(--product-slider__slider-arrow__cursor, pointer);
      font-size: var(--product-slider__slider-arrow__font-size, 16px);
      display: var(--product-slider__slider-arrow__display, flex);
      align-items: var(--product-slider__slider-arrow__align-items, center);
      justify-content: var(--product-slider__slider-arrow__justify-content, center);
    }

    .slider-arrow:disabled {
      background: var(--product-slider__slider-arrow-disabled__background, #ccc);
      cursor: var(--product-slider__slider-arrow-disabled__cursor, not-allowed);
    }

    .empty-slider {
      padding: var(--product-slider__empty-slider__padding, 40px);
      text-align: var(--product-slider__empty-slider__text-align, center);
      background-color: var(--product-slider__empty-slider__background-color, #f5f5f5);
      border-radius: var(--product-slider__empty-slider__border-radius, 8px);
      color: var(--product-slider__empty-slider__color, #777);
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (changedProperties.has('slidesToShow')) {
      this.style.setProperty('--slides-to-show', this.slidesToShow.toString());
    }

    if (changedProperties.has('autoplay')) {
      if (this.autoplay) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    }
  }

  private startAutoplay() {
    if (!this.interval) {
      this.interval = window.setInterval(() => {
        this.nextSlide();
      }, 3000);
    }
  }

  private stopAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  private nextSlide() {
    const maxSlide = Math.max(0, this.skus?.length - this.slidesToShow);
    if (this.currentSlide < maxSlide) {
      this.currentSlide++;
    } else {
      // Loop back to first slide
      this.currentSlide = 0;
    }
  }

  render() {
    return html`
      <div class="slider-container">
        <h2 class="slider-title">${this.title}</h2>

        ${this.skus && this.skus?.length
          ? html`
              <div class="slider-wrapper">
                <div
                  class="slider-track"
                  style="transform: translateX(-${this.currentSlide * (100 / this.slidesToShow)}%)"
                >
                  ${this.skus.map(sku => {
                    const countryCode = (this.locale || 'en-US').split('-')[1] as Countries;
                    const priceForLocale = sku?.masterVariant?.prices.find(
                      price => price.value.currencyCode === countryToCurrency[countryCode]
                    );
                    return html`
                    <div class="slider-slide">
                        <div class="product-card">
                          <div class="product-image">
                            <img
                              src="${sku?.masterVariant?.images[0]?.url}"
                              alt="${sku?.name?.[this.locale || 'en-US'] ||
                              sku?.name?.[this.locale || 'en-US']}"
                            />
                          </div>
                          <div class="product-details">
                            <div class="product-name">
                              ${sku?.name?.[this.locale || 'en-US'] ||
                              sku?.name?.[this.locale || 'en-US']}
                            </div>
                            <div class="product-sku">SKU: ${sku?.masterVariant?.sku}</div>
                            <div class="product-price">
                              ${priceForLocale?.value?.centAmount
                                ? priceForLocale?.value?.centAmount / 100
                                : 'N/A'}
                              ${priceForLocale?.value?.currencyCode}
                            </div>
                          </div>
                        </div>
                      </div>
                  `;
                  })}
                </div>
              </div>

              <div class="slider-controls">
                <button
                  class="slider-arrow"
                  @click="${this.prevSlide}"
                  ?disabled="${this.currentSlide === 0}"
                >
                  ←
                </button>
                <button
                  class="slider-arrow"
                  @click="${this.nextSlide}"
                  ?disabled="${this.currentSlide >=
                  Math.max(0, this.skus?.length - this.slidesToShow)}"
                >
                  →
                </button>
              </div>
            `
          : html`
              <div class="empty-slider">
                No products to display. Please add product SKUs in the properties.
              </div>
            `}
      </div>
    `;
  }
}

export default ProductSlider;
