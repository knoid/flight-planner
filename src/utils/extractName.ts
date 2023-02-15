export default function extractName(humanReadableIdentifier: string) {
  return humanReadableIdentifier.replace(/–/gu, '-').split(' - ')[0];
}
