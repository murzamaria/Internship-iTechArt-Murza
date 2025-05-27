import { test, expect } from '@playwright/test';

test('Videocard_link', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await page.locator('css=a[href="https://catalog.onliner.by/videocard"]').click();
});

test('Cat_logo', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page.locator('picture > img[src$="logo_cat.png"]')).toBeVisible();
});

test('All_about_people_page', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page.getByText('Все статьи о людях', { exact: true })).toBeVisible();
});

test('Main_logo', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page.locator('//img[contains(@class, "onliner_logo")]')).toBeVisible();
});

test('Main_page_from_sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click(); //не находит иконку
  await page
    .locator('//span[@class ="header-style__sign" and contains(text(), "Главная страница")]')
    .click();
});

test('Catalog_from_sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click();
  await expect(page.getByRole('link', { name: 'Каталог' })).toBeVisible();
});

test('Search_form', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.fast-search__form').click();
  await page.getByPlaceholder('Поиск').and(page.locator('.search__input.ym-record-keys')).click();
});

test('Not_visible_element_with_alt', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page.getByAltText('').locator('img[src$="1911064"]')).toBeHidden();
});

//getByLabel()
//- на сайте не нашла текст внутри <label>

test('OrderHistory_from_sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click();
  await expect(
    page
      .getByRole('link', { name: 'История заказов' })
      .and(page.locator('a[href="https://cart.onliner.by/orders"]')),
  ).toBeVisible();
});

test('Tariffs', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(
    page
      .getByText('Тарифы', { exact: true })
      .or(
        page.locator(
          '[href="https://docs.google.com/spreadsheets/d/1SGFaTkV_Ru4vI29ml9yvR-dMz9rOl7DVVpKk64w5lqM/preview"]',
        ),
      ),
  ).toBeVisible();
});

//filter by another locator
test('All_sections_button', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Все разделы форума' }),
  ).toBeVisible();
});

//filter by text
test('New_for_24hs_section', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await page.getByRole('link').filter({ hasText: 'Новое за 24 часа' }).click();
});

//const secondElement = items.nth(2);

test('List_of__footer-style_items', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  const items = page.locator('.footer-style__item');
  const count = await items.count();
  await expect(items).toHaveCount(12);
});
