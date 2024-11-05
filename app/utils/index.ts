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
