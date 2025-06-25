import { getRandom } from './getRandom';

export async function getRandomSlice<T>(array: T[], n: number): Promise<T[]> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = await getRandom(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, n);
}
