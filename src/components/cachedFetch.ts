const baseURL = 'https://knoid.github.io/aviation-data/';

export default async function cachedFetch(url: string) {
  return await fetch(baseURL + url);
}
