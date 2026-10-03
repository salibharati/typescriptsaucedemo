import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage.js';

/** SauceDemo cart page. */
export class CartPage extends BasePage {
  readonly path = '/cart.html';

  private readonly items: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }
}
