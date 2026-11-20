import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const news = [
  {
    id: 'a',
    date: '2026-11-20T09:00:00Z',
    source: 'Хабр',
    title: 'Новость про ИИ',
    summary: 'Модель научилась пересказывать тексты.',
    tags: 'ИИ, наука',
    link: 'https://example.org/a/',
  },
  {
    id: 'b',
    date: '2026-11-19T09:00:00Z',
    source: '3DNews',
    title: 'Новость про железо',
    summary: 'Вышел новый процессор.',
    tags: 'железо',
    link: 'https://example.org/b/',
  },
]

function stubFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status,
      json: async () => body,
    })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('Дайджест', () => {
  it('показывает новости от свежих к старым и разбирает строку тегов', async () => {
    stubFetch({ news })
    render(<App />)
    const titles = await screen.findAllByRole('heading', { level: 2 })
    expect(titles.map((h) => h.textContent)).toEqual(['Новость про ИИ', 'Новость про железо'])
    const marks = Array.from(document.querySelectorAll('.tag')).map((tag) => tag.textContent)
    expect(marks).toEqual(['ИИ', 'наука', 'железо'])
  })

  it('сообщает об ошибке загрузки с кодом ответа', async () => {
    stubFetch({}, false, 500)
    render(<App />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Дайджест не загрузился: код 500.')
  })

  it('ищет по заголовку и пересказу без учёта регистра', async () => {
    const user = userEvent.setup()
    stubFetch({ news })
    render(<App />)
    await screen.findAllByRole('heading', { level: 2 })
    await user.type(screen.getByLabelText('Поиск'), 'ПРОЦЕССОР')
    expect(screen.getByText('Новость про железо')).toBeInTheDocument()
    expect(screen.queryByText('Новость про ИИ')).not.toBeInTheDocument()
  })

  it('фильтрует по тегу', async () => {
    const user = userEvent.setup()
    stubFetch({ news })
    render(<App />)
    await screen.findAllByRole('heading', { level: 2 })
    await user.selectOptions(screen.getByLabelText('Тег'), 'ИИ')
    expect(screen.getByText('Новость про ИИ')).toBeInTheDocument()
    expect(screen.queryByText('Новость про железо')).not.toBeInTheDocument()
  })

  it('сохраняет отметку прочитано после перезагрузки страницы', async () => {
    const user = userEvent.setup()
    stubFetch({ news })
    const first = render(<App />)
    await screen.findAllByRole('heading', { level: 2 })
    await user.click(screen.getAllByRole('button', { name: 'Отметить прочитанным' })[0])
    expect(screen.getByRole('button', { name: 'Прочитано ✓' })).toBeInTheDocument()
    first.unmount()
    render(<App />)
    await screen.findAllByRole('heading', { level: 2 })
    expect(screen.getByRole('button', { name: 'Прочитано ✓' })).toBeInTheDocument()
  })
})
