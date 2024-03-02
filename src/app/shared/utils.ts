export function getRandomElements<T>(arr: T[], amount = 3): T[] {
  let result = [...arr];
  let m = result.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  return result.slice(0, amount);
}
