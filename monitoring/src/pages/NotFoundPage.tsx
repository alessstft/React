import { Link, useLocation } from 'react-router'

function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <>
      <title>Страница не найдена · Мониторинг сайтов группы</title>
      <h2>Страница не найдена</h2>
      <p>Адреса {pathname} в приложении нет.</p>
      <Link to="/" className="back">← Все сайты</Link>
    </>
  )
}

export default NotFoundPage
