import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { statusText } from '../status'

function SitePage() {
  const { id } = useParams()
  const { sites, history, loading } = useMonitoring()

  if (loading) {
    return (
      <p className="empty" role="status">
        Загрузка результатов…
      </p>
    )
  }

  const site = sites.find((s) => s.id === id)
  if (site === undefined) {
    return (
      <>
        <title>Страница не найдена · Мониторинг сайтов группы</title>
        <Link to="/" className="back">← Все сайты</Link>
        <p className="empty">
          Сайта «{id}» нет в списке. <Link to="/">К списку сайтов</Link>
        </p>
      </>
    )
  }

  const rows = history.map((run) => ({ run, check: run.checks.find((c) => c.id === site.id) }))
  const okCount = rows.filter((row) => row.check?.ok === true).length
  const percent = rows.length === 0 ? 0 : Math.round((okCount / rows.length) * 100)
  const maxMs = Math.max(...rows.map((row) => row.check?.ms ?? 0), 1)

  return (
    <>
      <title>{`${site.name} · Мониторинг сайтов группы`}</title>
      <Link to="/" className="back">← Все сайты</Link>
      <h2>{site.name}</h2>
      <p>
        <a href={site.url} target="_blank" rel="noreferrer">
          {site.url}
        </a>
      </p>
      <p>Открывался в {okCount} из {rows.length} последних проверок.</p>
      <p className="summary">{percent}% удачных проверок</p>
      <table className="history">
        <caption>История проверок</caption>
        <thead>
          <tr>
            <th>Проверка</th>
            <th>Результат</th>
            <th>Время ответа</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ run, check }) => (
            <tr key={run.time} className={check?.ok ? '' : 'history__bad'}>
              <td>{new Date(run.time).toLocaleString('ru')}</td>
              <td>{statusText(check)}</td>
              <td>
                <div className="bar-track">
                  <div className="bar" style={{ width: `${((check?.ms ?? 0) / maxMs) * 100}%` }} />
                </div>
                <span>{check === undefined ? '—' : `${check.ms} мс`}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default SitePage
