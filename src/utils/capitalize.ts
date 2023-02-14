export function capitalize(value: string) {
  return value
    // .normalize('NFD')
    .replace(
      /[A-ZÀ-ž]{4,}/g,
      (substring) => substring[0].toUpperCase() + substring.slice(1).toLowerCase()
    )
    .replace(/[A-Z]{2,3}/g, (substring) => substring.toLowerCase())
    .replace(/[^a-zA-Z]\s+[a-z]/, (substring) => substring.toUpperCase())
    .replace(/^[a-z]/, (substring) => substring.toUpperCase());
}
