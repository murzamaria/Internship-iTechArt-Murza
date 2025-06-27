import { test, expect } from '../config/fixtures';
import { BookstorePage } from '../pages/bookstorePage';
import { DeletionDialog } from '../pages/deletionDialog';
import { getRandom } from '../utils/getRandom';
import { getCookies } from '../utils/getCookies';
import { getBooksInfoByIsbn } from '../utils/getBookInfoByIsbn';
import { checkMessageOfConfirmDialog } from '../utils/checkConfirmDialogMessage';
import { Book } from '../types/book';
import { getRandomSlice } from '../utils/getRandomSlice';

test.afterEach(async ({ context, request }) => {
  const cookies = await context.cookies();
  const userID = cookies.find((c) => c.name === 'userID')?.value;
  const token = cookies.find((c) => c.name === 'token')?.value;
  if (userID && token) {
    await request.delete(`https://demoqa.com/BookStore/v1/Books?UserId=${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
});

test('Adding books to profile and deleting them', async ({ startPage, request }) => {
  const bookstorePage = new BookstorePage(startPage.page);
  const deletionDialog = new DeletionDialog(startPage.page);
  const { userID, token } = await getCookies(startPage.page, ['userID', 'token']);

  let responseBookstore;
  let nBooks;

  await test.step('Capture response from a Bookstore', async () => {
    await expect(startPage.page.getByText('No rows found')).toBeVisible();
    responseBookstore = await bookstorePage.getBookstoreResponse();
  });

  await test.step('Get amount of books to add to profile', async () => {
    nBooks = await getRandom(2, 5);
  });

  let isbnsArray: string[] = [];
  await test.step('Get random isbns of nBooks', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();

    const allIsbns = json.books.map((book: Book) => book.isbn);
    isbnsArray = await getRandomSlice(allIsbns, nBooks);
  });

  await test.step('Adding books to profile using API', async ({}) => {
    await bookstorePage.addBookToProfile(request, token!, userID!, isbnsArray);
  });

  await test.step('Refresh profile page', async () => {
    await startPage.goto();
    await expect(startPage.bookItem.first()).toBeVisible();
  });

  await test.step('Check added books amount', async () => {
    await expect(startPage.bookItem).toHaveCount(nBooks);
  });

  let booksInfo;
  await test.step('Get title, author, publisher from Bookstore response', async () => {
    booksInfo = await getBooksInfoByIsbn(
      startPage.page.request,
      ['title', 'author', 'publisher'],
      isbnsArray,
    );
  });

  await test.step('Check title, author, publisher for each book', async () => {
    for (const book of booksInfo) {
      const row = await startPage.getRowIndexByTitle(book.title.valueOf());
      if (row === undefined) {
        throw new Error(`Book with title "${book.title}" not found in profile`);
      }
      await expect(startPage.getTableCellLocator(row!, 3)).toContainText(book.author.valueOf());
      await expect(startPage.getTableCellLocator(row!, 4)).toContainText(book.publisher.valueOf());
    }
  });

  let title2ndBook;
  await test.step('Delete the 2nd book', async () => {
    title2ndBook = await startPage.getTableCellLocator(2, 2).textContent();
    await startPage.deleteBook(2);
  });

  await test.step('Check dialog after deleting a book', async () => {
    await expect(deletionDialog.modalHeader).toContainText('Delete Book');
    await expect(deletionDialog.modalBody).toContainText('Do you want to delete this book?');
    await expect(deletionDialog.okButton).toBeEnabled();
    await expect(deletionDialog.cancelButton).toBeEnabled();
  });

  await test.step('Check browser confirmation dialog after deleting a book', async () => {
    const dialogPromise = checkMessageOfConfirmDialog(startPage.page, 'Book deleted.');
    await deletionDialog.okButton.click();
    await dialogPromise;
  });

  await test.step('Make sure the 2nd book was deleted', async () => {
    await expect(startPage.getTableCellLocator(2, 2)).not.toContainText(title2ndBook.valueOf());
  });

  await test.step('Delete all books', async () => {
    await startPage.deleteAllBooksButton.click();
  });

  await test.step('Check dialog after deleting all books', async () => {
    await expect(deletionDialog.modalHeader).toContainText('Delete All Books');
    await expect(deletionDialog.modalBody).toContainText('Do you want to delete all books?');
    await expect(deletionDialog.okButton).toBeEnabled();
    await expect(deletionDialog.cancelButton).toBeEnabled();
  });

  await test.step('Check browser confirmation dialog after deleting all books', async () => {
    const dialogPromise = checkMessageOfConfirmDialog(startPage.page, 'All Books deleted.');
    await deletionDialog.okButton.click();
    await dialogPromise;
  });

  await test.step('Make sure all books were deleted', async () => {
    await expect(startPage.page.getByText('No rows found')).toBeVisible();
  });
});
