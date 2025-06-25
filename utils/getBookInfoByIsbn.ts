import { APIRequestContext } from '@playwright/test';
import { Book } from '../types/book';

export async function getBooksInfoByIsbn(
  request: APIRequestContext,
  fields: string[],
  isbns: string[],
): Promise<Array<Record<string, string | number | undefined>>> {
  const response = await request.get(`${process.env.BASE_URL!}/BookStore/v1/Books`);
  const json = await response.json();

  const filteredBooks = json.books.filter(
    (book: Book) => typeof book.isbn === 'string' && isbns.includes(book.isbn),
  );

  const result = filteredBooks.map((book: Book) => {
    const selected: Record<string, string | number | undefined> = {};
    for (const field of fields) {
      selected[field] = book[field];
    }
    return selected;
  });
  return result;
}
