import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MonitoringProvider from './MonitoringProvider'
import SitesPage from './pages/SitesPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MonitoringProvider', () => {
  it('сообщает, какой файл не загрузился', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })))
    render(
      <MemoryRouter>
        <MonitoringProvider>
          <SitesPage />
        </MonitoringProvider>
      </MemoryRouter>,
    )
    const message = await screen.findByRole('alert')
    expect(message).toHaveTextContent('Файл sites.json не загрузился: код 404.')
  })
})
