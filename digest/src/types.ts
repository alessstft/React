export type NewsItem = {
  id: string
  date: string
  source: string
  title: string
  summary: string
  tags: string[]
  link: string
}

export type DigestResponse = {
  news: RawNews[]
}

export type RawNews = Omit<NewsItem, 'tags'> & { tags: string | string[] }
