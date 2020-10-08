// A user-space implementation of Object.fromEntries.
// It is only available with node 12 and more, but the program supports
// down to node 8.
export const objectFromEntries = <K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> => {
  const object = {} as Record<K, V>;
  for (const [key, value] of entries) {
    object[key] = value;
  }
  return object;
}

export const zip = <T1, T2>(array1: T1[], array2: T2[]): [T1, T2][] => {
  const l = Math.min(array1.length, array2.length);
  const output: [T1, T2][] = [];
  for (let i = 0; i < l; ++i) {
    output[i] = [array1[i], array2[i]];
  }
  return output;
}
