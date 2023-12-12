export default function reverse<T>(arr: T[]) {
  const copy = [...arr];
  copy.reverse();
  return copy;
}
