/**
 *
 * @param word  - Singular form.
 * @param count  - Count to pluralize from.
 */
export function pluralize(word: string, count: number): string {
  if (count === 1) return word
  if (word.endsWith('y')) {
    return word.substring(0, word.length - 1) + 'ies'
  } else if (word.endsWith('to')) {
    return word + 'es'
  } else {
    return word + 's'
  }
}
