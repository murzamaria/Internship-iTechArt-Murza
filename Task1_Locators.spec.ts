import { test, expect } from '@playwright/test';

test('Videocard_link', async ({ page }) => {
  //я бы не использовал href (только в крайнем случае) DONE
  await page.goto('https://www.onliner.by/');
  await page.locator('//span[text()="Видеокарты"]').click({ force: true });
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
  await expect(page.locator('//img[@class="onliner_logo"]')).toBeVisible();
});

test('Main_page_from_sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click({ force: true });
  //падает потому что, гамбургер перекрывается другим элементом и не может кликнуть надо найти решение DONE

  await page
    .locator('//span[@class ="header-style__sign" and contains(text(), "Главная страница")]')
    .click();
});

test('Catalog_from_sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click({ force: true });
  //падает потому что, гамбургер перекрывается другим элементом и не может кликнуть надо найти решение DONE
  await expect(
    page.locator(
      '//a[@class="header-style__link header-style__link_primary"]/span[text() = "Каталог"]',
    ),
  ).toBeVisible();
});

test('Search_form', async ({ page }) => {
  //непонятно, что делает тест. в мобильном виде не видно строки поиска, для десктопа не тот локатор DONE
  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('//*[@id="fast-search"]/div/input').click({ force: true });
  await expect(page.getByRole('textbox')).toBeEnabled();
});

test('Alt_selector_for_logo', async ({ page }) => {
  //тест проходит, но пример не очень. лучше поискать другой DONE

  await page.goto('https://blog.onliner.by/manifest');
  await expect(page.getByAltText('Onlíner')).toBeVisible();
});

//getByLabel()
//- на сайте не нашла текст внутри <label>

test('Houses&apartments_from_sidebar', async ({ page }) => {
  //это не работает, падает по таймауту. возможно история заказов не видна для незалоганного юзера. и опять href лучше не использовать DONE

  await page.setViewportSize({ width: 1000, height: 800 }); //sidebar появляется только, если ширина окна =<1000
  await page.goto('https://www.onliner.by/');
  await page.locator('.header-style__toggle').click({ force: true });
  await expect(
    page.getByText('Дома и квартиры', { exact: true }).and(page.locator('.header-style__sign')),
  ).toBeVisible();
});

test('Tariffs', async ({ page }) => {
  //ок кроме href DONE
  await page.goto('https://www.onliner.by/');
  await expect(
    page
      .getByText('Тарифы', { exact: true })
      .or(page.getByRole('listitem', { name: 'Тарифы', exact: true })),
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
