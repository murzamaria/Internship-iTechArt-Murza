import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Student_Registration_Form', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  //- locator.fill()
  await page.getByPlaceholder('First Name').fill('Ivan');

  //- locator.inputValue()
  await page.getByPlaceholder('Last Name').fill('Ivanov');
  const LastName = await page.getByPlaceholder('Last Name').inputValue();
  expect(LastName).toBe('Ivanov');

  //- locator.press() – клавиатурные комбинации
  await page.getByPlaceholder('Last Name').press('Control+A');
  await page.getByPlaceholder('Last Name').press('Delete');

  //- locator.check() - для checkbox и radio button - https://demoqa.com/automation-practice-form
  //- locator.click()
  await page.locator('label[for="gender-radio-1"]').check({ force: true });
});

// - locator.hover() - https://demoqa.com/menu#
test('Menu', async ({ page }) => {
  await page.goto('https://demoqa.com/menu#');
  await page.getByRole('link', { name: 'Main Item 2' }).hover();
});

// - locator.setInputFiles() - https://demoqa.com/upload-download
test('Image_Upload', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download');
  await page.getByLabel('Select a file').setInputFiles(path.join(__dirname, 'testimage.jfif'));
});

//  - drag & drop - https://demoqa.com/droppable
test('Drag&Drop', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable');
  await page.locator('#draggable').dragTo(page.locator('.simple-drop-container #droppable'));
});

//- locator.allInnerTexts()
//- locator.count()
test('All_Sections_Names', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  const names = await page.locator('.card-body').allInnerTexts();
  console.log(names);
  const count = await page.locator('.card-body').count();
  expect(count).toBe(6);
});

//- locator.innerText()
test('1stSection_Name', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  const name = await page.locator('.card-body').first().innerText();
  expect(name).toBe('Elements');
});

//- locator.blur()
test('Select_Menu', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
  const Select4 = page.locator('#react-select-4-input').locator('..').locator('..').locator('..');
  await Select4.click();
  await Select4.blur();

  //  .toHaveAttribute()
  //- locator.getAttribute(name)
  const autocomplete = await page.locator('#react-select-4-input').getAttribute('autocomplete');
  expect(autocomplete).toBe('off');

  // .toHaveURL()
  await expect(page).toHaveURL('https://demoqa.com/select-menu');
  const Select3 = page.locator('input#react-select-3-input');
  await expect(Select3).toHaveAttribute('autocomplete', 'off');

  //  .toHaveValue()
  await expect(page.locator('#oldSelectMenu')).toHaveValue('red');

  // - locator.selectOption()
  await page.locator('#cars').selectOption('Volvo');
});

//- locator.setChecked(…) https://demoqa.com/checkbox
//.toBeChecked()
test('CheckBox', async ({ page }) => {
  await page.goto('https://demoqa.com/checkbox');
  await page.locator('button[aria-label="Expand all"]').click();
  await page.locator('.rct-checkbox').first().setChecked(true);
  await expect(page.locator('.rct-checkbox').first()).toBeChecked();
});

// .toBeDisabled()
// .toBeEnabled()
test('Disabled_element', async ({ page }) => {
  await page.goto('https://demoqa.com/radio-button');
  await expect(page.locator('.custom-control-label.disabled')).toBeDisabled();
  await expect(page.getByLabel('Yes')).toBeEnabled();
});

// .toBeVisible()
test('Main_Page', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await expect(page.locator('//img[@src="/images/Toolsqa.jpg"]')).toBeVisible();
  // .toHaveTitle()
  await expect(page).toHaveTitle('DEMOQA');
});

// .toHaveCount()
test('Modal_Dialogs', async ({ page }) => {
  await page.goto('https://demoqa.com/modal-dialogs');
  await expect(page.locator('#modalWrapper button')).toHaveCount(2);

  await page.locator('#showSmallModal').click();
  await page.locator('#showSmallModal').click({ force: true });

  // .toHaveText()
  await expect(page.locator('#example-modal-sizes-title-sm')).toHaveText('Small Modal', {
    timeout: 10000,
  });
  // .toContainText()
  await expect(page.locator('.modal-body')).toContainText(
    'This is a small modal. It has very less content',
  );
});
