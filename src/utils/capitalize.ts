export function capitalize(value: string) {
  return value
    .normalize('NFD')
    .replace(
      /[A-Z\p{Diacritic}]{4,}/gu,
      (substring) => substring[0].toUpperCase() + substring.slice(1).toLowerCase(),
    )
    .replace(/[A-Z]{2,3}/gu, (substring) => substring.toLowerCase())
    .replace(/[^a-zA-Z]\s+[a-z]/u, (substring) => substring.toUpperCase())
    .replace(/^[a-z]/u, (substring) => substring.toUpperCase());
}
