import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//добавить проверку first name
test('Student_Registration_Form_First_Name', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.getByPlaceholder('First Name').fill('Ivan');
  const FirstName = await page.getByPlaceholder('First Name').inputValue();
  expect(FirstName).toBe('Ivan');
});

test('Student_Registration_Form_Last_Name', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.getByPlaceholder('Last Name').fill('Ivanov');
  const LastName = await page.getByPlaceholder('Last Name').inputValue();
  expect(LastName).toBe('Ivanov');

  await page.getByPlaceholder('Last Name').press('Control+A');
  await page.getByPlaceholder('Last Name').press('Delete');
  //добавить проверку, что удалено
  const LastNameDeleted = await page.getByPlaceholder('Last Name').inputValue();
  await expect(LastNameDeleted).toBe('');
});

test('Student_Registration_Form_Gender', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.locator('label[for="gender-radio-1"]').check({ force: true });
  //добавить проверку, что чекнуто
  await expect(page.locator('label[for="gender-radio-1"]')).toBeChecked();
});

test('Student_Registration_Form_DateofBirth', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.locator('input#dateOfBirthInput').click();
  await expect(page.locator('.react-datepicker__month-container')).toBeVisible(); //проверяю открылся ли контейнер с календарём
});

//-blur() применение - с выпад.списком не получилось, т.к. это не дом-элемент, поэтому слайдер взяла
test('Slider', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');
  await page.locator('.range-slider.range-slider--primary').click(); //фокус на слайдере
  const value1 = Number(await page.locator('#sliderValue').getAttribute('value'));

  await page.locator('.range-slider.range-slider--primary').press('ArrowLeft');
  const value2 = Number(await page.locator('#sliderValue').getAttribute('value'));
  await expect(value2).toBe(value1 - 1);

  await page.locator('.range-slider.range-slider--primary').blur(); //расфокус
  await page.keyboard.press('ArrowLeft');
  const value3 = Number(await page.locator('#sliderValue').getAttribute('value'));
  await expect(value2).toBe(value3);
});

test('Menu', async ({ page }) => {
  await page.goto('https://demoqa.com/menu#');
  await page.getByRole('link', { name: 'Main Item 2' }).hover();
  //добавить проверку, что меню открылось и видно
  await expect(page.getByRole('link', { name: 'Sub Item' }).first()).toBeVisible();
});

test('Image_Upload', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download');
  await page.getByLabel('Select a file').setInputFiles(path.join(__dirname, 'testimage.jfif'));
  //добавить проверку, что файл загружен
  await expect(page.locator('#uploadedFilePath')).toContainText('testimage.jfif');
});

test('Drag&Drop', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable');
  await page.locator('#draggable').dragTo(page.locator('.simple-drop-container #droppable'));
  //добавить проверку
  await expect(page.locator('.drop-box.ui-droppable.ui-state-highlight p')).toHaveText('Dropped!');
});

test('All_Sections_Names', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  const names = await page.locator('.card-body').allInnerTexts();
  console.log(names);
  const count = await page.locator('.card-body').count();
  expect(count).toBe(6);
});

test('1stSection_Name', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  const name = await page.locator('.card-body').first().innerText();
  expect(name).toBe('Elements');
});

test('Multiselect drop down', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
  const autocomplete = await page.locator('#react-select-4-input').getAttribute('autocomplete');
  expect(autocomplete).toBe('off');
});

test('Select One', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
  await expect(page).toHaveURL('https://demoqa.com/select-menu');
  const Select3 = page.locator('input#react-select-3-input');
  await expect(Select3).toHaveAttribute('autocomplete', 'off');
});

//что делает тест? как проверить? - здесь был блюр, который не применялся, оставила тест .toHaveValue(), блюр в тесте "Selector"
test('Old Style Select Menu', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
  const OldStyleMenu = page.locator('#oldSelectMenu');

  //  .toHaveValue()
  await expect(OldStyleMenu).toHaveValue('red');
});

// - locator.selectOption()
test('Standart multi select Cars', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
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
