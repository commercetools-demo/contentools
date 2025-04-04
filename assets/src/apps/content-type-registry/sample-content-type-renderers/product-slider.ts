import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('product-slider')
export class ProductSlider extends LitElement {
  @property({ type: String })
  title = 'Featured Products';

  @property({ type: Array })
  skus = [];

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
      display: block;
      margin: 30px 0;
    }

    .slider-container {
      width: 100%;
    }

    .slider-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333;
    }

    .slider-wrapper {
      position: relative;
      overflow: hidden;
    }

    .slider-track {
      display: flex;
      transition: transform 0.5s ease;
    }

    .slider-slide {
      flex: 0 0 calc(100% / var(--slides-to-show, 4));
      padding: 0 10px;
      box-sizing: border-box;
    }

    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }

    .product-details {
      padding: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }

    .product-sku {
      font-size: 12px;
      color: #777;
      margin-bottom: 15px;
    }

    .product-price {
      font-weight: bold;
      color: #3498db;
      margin-top: auto;
    }

    .slider-controls {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .slider-arrow {
      background: #3498db;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 0 5px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .slider-arrow:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .empty-slider {
      padding: 40px;
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 8px;
      color: #777;
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
                  ${this.skus.map(
                    sku => html`
                      <div class="slider-slide">
                        <div class="product-card">
                          <div class="product-image">Product Image</div>
                          <div class="product-details">
                            <div class="product-name">Product Name</div>
                            <div class="product-sku">SKU: ${sku}</div>
                            <div class="product-price">$99.99</div>
                          </div>
                        </div>
                      </div>
                    `
                  )}
                </div>
              </div>

              <div class="slider-controls">
                <button
                  class="slider-arrow"
                  @click=${this.prevSlide}
                  ?disabled=${this.currentSlide === 0}
                >
                  ←
                </button>
                <button
                  class="slider-arrow"
                  @click=${this.nextSlide}
                  ?disabled=${this.currentSlide >=
                  Math.max(0, this.skus?.length - this.slidesToShow)}
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
