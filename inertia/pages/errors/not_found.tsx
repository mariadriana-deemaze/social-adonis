export default function NotFound({
  error: { title = 'Not found', message = 'Resource not found' },
}: {
  error: {
    title: string
    message: string
  }
}) {
  return (
    <div className="container">
      <div className="title">{title}</div>
      <span>{message}</span>
    </div>
  )
}
