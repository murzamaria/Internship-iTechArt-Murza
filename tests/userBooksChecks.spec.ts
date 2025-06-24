import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookstorePage } from '../pages/bookstorePage';
import { ProfilePage } from '../pages/profilePage';
import { DeletionDialog } from '../pages/deletionDialog';
import { getRandom } from '../utils/getRandom';
import { getCookies } from '../utils/getCookies';
import { getBooksInfoIsbn } from '../utils/getBookInfoIsbn';
import { checkMessageOfConfirmDialog } from '../utils/checkConfirmDialogMessage';

test('Adding books to profile and deleting them', async ({ page }) => {
  const bookstorePage = new BookstorePage(page);
  const profilePage = new ProfilePage(page);
  const deletionDialog = new DeletionDialog(page);
  const { userID, token } = await getCookies(page, ['userID', 'token']);

  let responseBookstore;
  let nBooks;

  await test.step('Capture response from a Bookstore', async () => {
    await profilePage.goto(); //начинаю с профайл педж как после логина, чтобы дальше перейти на букстор и словить респонс
    await expect(page.getByText('No rows found')).toBeVisible(); //проверяю, что в профайле нет книг перед добавлением
    responseBookstore = await bookstorePage.getBookstoreResponse(); //внутри метода переход на букстор и перехват респонса
  });

  await test.step('Get amount of books to add to profile', async () => {
    nBooks = await getRandom(2, 5);
  });

  let isbnsArray: string[] = [];
  await test.step('Get isbns of nBooks ', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    for (let i = 0; i < nBooks; i++) {
      isbnsArray[i] = json.books[i].isbn;
    }
  });

  await test.step('Adding books to profile using API', async ({}) => {
    const apiContext = await playwrightRequest.newContext({
      storageState: './.auth/user.json',
    });
    await bookstorePage.addBookToProfile(apiContext, token!, userID!, isbnsArray);
  });

  await test.step('Refresh profile page', async () => {
    await profilePage.goto();
    await expect(profilePage.bookItem.first()).toBeVisible();
  });

  await test.step('Check added books amount', async () => {
    await expect(profilePage.bookItem).toHaveCount(nBooks);
  });

  let booksInfo;
  await test.step('Get title, author, publisher from Bookstore response', async () => {
    booksInfo = await getBooksInfoIsbn(page.request, ['title', 'author', 'publisher'], isbnsArray);
  });

  await test.step('Check title for each book', async () => {
    for (let i = 0; i < nBooks; i++) {
      await expect(profilePage.getTableCell(i + 1, 2)).toContainText(booksInfo[i].title.valueOf());
    }
  });

  await test.step('Check author for each book', async () => {
    for (let i = 0; i < nBooks; i++) {
      await expect(profilePage.getTableCell(i + 1, 3)).toContainText(booksInfo[i].author.valueOf());
    }
  });

  await test.step('Check publisher for each book', async () => {
    for (let i = 0; i < nBooks; i++) {
      await expect(profilePage.getTableCell(i + 1, 4)).toContainText(
        booksInfo[i].publisher.valueOf(),
      );
    }
  });

  await test.step('Delete the 2nd book', async () => {
    await profilePage.deleteBook(2);
  });

  await test.step('Check dialog after deleting a book', async () => {
    await expect(deletionDialog.modalHeader).toContainText('Delete Book');
    await expect(deletionDialog.modalBody).toContainText('Do you want to delete this book?');
    await expect(deletionDialog.okButton).toBeEnabled();
    await expect(deletionDialog.cancelButton).toBeEnabled();
  });

  await test.step('Check browser confirmation dialog after deleting a book', async () => {
    const dialogPromise = checkMessageOfConfirmDialog(page, 'Book deleted.');
    await deletionDialog.okButton.click();
    await dialogPromise;
  });

  await test.step('Make sure the 2nd book was deleted', async () => {
    await expect(profilePage.getTableCell(2, 2)).not.toContainText(booksInfo[1].title.valueOf());
  });

  await test.step('Delete all books', async () => {
    await profilePage.deleteAllBooksButton.click();
  });

  await test.step('Check dialog after deleting all books', async () => {
    await expect(deletionDialog.modalHeader).toContainText('Delete All Books');
    await expect(deletionDialog.modalBody).toContainText('Do you want to delete all books?');
    await expect(deletionDialog.okButton).toBeEnabled();
    await expect(deletionDialog.cancelButton).toBeEnabled();
  });

  await test.step('Check browser confirmation dialog after deleting all books', async () => {
    const dialogPromise = checkMessageOfConfirmDialog(page, 'All Books deleted.');
    await deletionDialog.okButton.click();
    await dialogPromise;
  });

  await test.step('Make sure all books were deleted', async () => {
    await expect(page.getByText('No rows found')).toBeVisible();
  });
});
