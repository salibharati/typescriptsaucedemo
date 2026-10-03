import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { CartPage } from '../../src/pages/saucedemo/CartPage.js';
import { CheckoutPage } from '../../src/pages/saucedemo/CheckoutPage.js';
import { PRODUCTS } from '../../src/data/products.js';

/**
 * End-to-end purchase flow on SauceDemo, run as an already-authenticated user
 * via the stored session (see auth.setup.ts). Covers a real multi-page flow:
 * inventory -> cart -> checkout -> order confirmation.
 */
test.use({
  baseURL: 'https://www.saucedemo.com',
  storageState: '.auth/user.json',
});

test.beforeEach(async () => {
  await allure.parentSuite('End-to-End (UI)');
  await allure.epic('Quality Engineering');
  await allure.feature('SauceDemo - Checkout');
  await allure.owner('salibharati');
});

test.describe(
  'SauceDemo checkout (authenticated)',
  { tag: '@regression' },
  () => {
    test(
      'completes a purchase of two items',
      { tag: '@smoke' },
      async ({ page }) => {
        const inventory = new InventoryPage(page);
        await inventory.goto();
        await inventory.expectLoaded();

        await inventory.addToCart(PRODUCTS.backpack);
        await inventory.addToCart(PRODUCTS.bikeLight);
        await inventory.expectCartCount(2);
        await inventory.openCart();

        const cart = new CartPage(page);
        await cart.expectItemCount(2);
        await cart.checkout();

        const checkout = new CheckoutPage(page);
        await checkout.fillInformation('Lewis', 'Yaka', '00237');
        await checkout.finish();
        await checkout.expectOrderComplete();
      },
    );
  },
);
