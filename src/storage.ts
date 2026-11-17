import { initialRequests, type RequestItem } from './requests'

// В localStorage можно писать только текст, поэтому массив гоняю через JSON
const KEY = 'zayavki'

export function loadRequests(): RequestItem[] {
  const saved = localStorage.getItem(KEY)
  if (saved === null) {
    return initialRequests
  }
  return JSON.parse(saved)
}

export function saveRequests(list: RequestItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}
