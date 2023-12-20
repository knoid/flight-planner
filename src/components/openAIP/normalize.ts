export default function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '');
}
