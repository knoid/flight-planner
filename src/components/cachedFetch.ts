export default function cachedFetch(url: string) {
  return fetch(url, { cache: 'force-cache' });
}
