import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage.js';

/** SauceDemo products/inventory page. */
export class InventoryPage extends BasePage {
  readonly path = '/inventory.html';

  private readonly title: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addToCart(productName: string): Promise<void> {
    const item = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }
}
