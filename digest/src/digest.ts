import type { DigestResponse, NewsItem } from './types'

export async function loadDigest(url: string): Promise<NewsItem[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Дайджест не загрузился: код ${response.status}.`)
  }
  const data: DigestResponse = await response.json()
  return data.news
    .map((item) => ({
      ...item,
      tags: Array.isArray(item.tags)
        ? item.tags
        : String(item.tags ?? '')
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ''),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
