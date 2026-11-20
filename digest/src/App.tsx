import { useEffect, useMemo, useState } from 'react'
import { loadDigest } from './digest'
import type { NewsItem } from './types'

const READ_KEY = 'digest-read'

function readIds(): string[] {
  try {
    const saved = localStorage.getItem(READ_KEY)
    return saved === null ? [] : (JSON.parse(saved) as string[])
  } catch {
    return []
  }
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('Все')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [read, setRead] = useState<string[]>(readIds)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const list = await loadDigest(import.meta.env.VITE_DIGEST_URL)
        if (!ignore) {
          setNews(list)
        }
      } catch (e) {
        if (!ignore) {
          setError((e as Error).message)
        }
      }
      if (!ignore) {
        setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const tags = useMemo(
    () => ['Все', ...Array.from(new Set(news.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b))],
    [news],
  )

  const shown = news.filter((item) => {
    const text = query.trim().toLowerCase()
    const matchesText =
      text === '' ||
      item.title.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text)
    const matchesTag = tag === 'Все' || item.tags.includes(tag)
    const matchesRead = !onlyUnread || !read.includes(item.id)
    return matchesText && matchesTag && matchesRead
  })

  function toggleRead(id: string) {
    setRead((list) => {
      const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
      localStorage.setItem(READ_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <>
      <title>Дайджест новостей</title>
      <header className="header">
        <h1>Дайджест новостей</h1>
        <p>Свежие новости из лент, пересказанные моделью</p>
      </header>
      <main className="main">
        {loading && (
          <p className="empty" role="status">
            Загрузка дайджеста…
          </p>
        )}
        {error !== '' && (
          <p className="load-error" role="alert">
            {error}
          </p>
        )}
        {!loading && error === '' && (
          <>
            <div className="filters">
              <label>
                Поиск
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <label>
                Тег
                <select value={tag} onChange={(e) => setTag(e.target.value)}>
                  {tags.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={onlyUnread}
                  onChange={(e) => setOnlyUnread(e.target.checked)}
                />
                Только непрочитанные
              </label>
            </div>
            <p className="summary">Показано {shown.length} из {news.length}</p>
            {shown.length === 0 && <p className="empty">Новостей не найдено</p>}
            <div className="news">
              {shown.map((item) => {
                const isRead = read.includes(item.id)
                return (
                  <article key={item.id} className={isRead ? 'card card--read' : 'card'}>
                    <h2>
                      <a href={item.link} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    </h2>
                    <p className="card__meta">
                      {item.source} · {new Date(item.date).toLocaleString('ru')}
                    </p>
                    <p>{item.summary}</p>
                    <div className="card__tags">
                      {item.tags.map((itemTag) => (
                        <span key={itemTag} className="tag">
                          {itemTag}
                        </span>
                      ))}
                    </div>
                    <button type="button" onClick={() => toggleRead(item.id)}>
                      {isRead ? 'Прочитано ✓' : 'Отметить прочитанным'}
                    </button>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default App
