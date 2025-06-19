export function decodeTime(expires?: string): number {
  const decodedTime = expires?.valueOf() ? decodeURIComponent(expires.valueOf()) : '';
  const expiresTime = decodedTime ? new Date(decodedTime).getTime() : 0;
  return expiresTime;
}
