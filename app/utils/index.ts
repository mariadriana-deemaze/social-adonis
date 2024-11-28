export function errorsReducer(
  error: { field: string; message: string }[]
): Record<string, [{ message: string }]> {
  const reducedErrors = error.reduce((acc: any, cur: any) => {
    if (!acc[cur.field]) {
      acc[cur.field] = cur.message
    }
    return acc
  }, {})
  return reducedErrors
}

/**
 * From a given string content, it matches the first matching link and returns it.
 */
export function extractFirstLink(content: string): string | null {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/g
  const matches = content.match(urlRegex)
  return matches ? matches[0] : null
}

/**
 * Replace last occurrence of a match from a string.
 */
export function replaceLast(text: string, searchValue: string, replaceValue: string) {
  const lastOccurrenceIndex = text.lastIndexOf(searchValue)
  return `${text.slice(0, lastOccurrenceIndex)}${replaceValue}${text.slice(
    lastOccurrenceIndex + searchValue.length
  )}`
}

/**
 *
 */
export function sanitizePostContent(content: string): string {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }
  // @ts-ignore
  return content.replace(/[&<>]/g, (m) => map[m])
}

export const REGEX = {
  ALPHA_STRING: /^[A-z]+$/,
  ALPHANUMERIC_STRING: /^[A-z0-9]+$/,
  MENTIONS: /@[a-zA-Z0-9_-]+/g,
}
