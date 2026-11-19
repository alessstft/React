# Модуль 3 · Несколько экранов, публикация, расписание

Продолжение моей работы: первый модуль уже на GitHub, второй — в отдельной
ветке, третий добавила этой папкой. Занималась главами 3.1–3.4, проектом П3
и автоматизацией А3. Проверочную работу сдаю отдельно, в репозиторий не включаю.

В модуле две части: доска заявок `zayavki` получает страницы и контекст,
и отдельно появляется приложение `monitoring`, которому не нужен свой сервер.

## Главы

| Глава | Тема | Что у меня получилось |
| --- | --- | --- |
| [3.1](https://maximbytecamp.github.io/angular_react_makarov/temy/31-marshrutizaciya/index.html) | Маршрутизация | `react-router@8.5.1`, страницы `/`, `/stats`, `/requests/:id`, `*`, меню на `NavLink` |
| [3.2](https://maximbytecamp.github.io/angular_react_makarov/temy/32-kontekst/index.html) | Контекст | `board.ts` и `BoardProvider.tsx`, хук `useBoard`, `App.tsx` сократился до маршрутов |
| [3.3](https://maximbytecamp.github.io/angular_react_makarov/temy/33-github-pages/index.html) | Сборка и Pages | приложение `monitoring`, `dist`, `base`, `BASE_URL`, конвейер `deploy.yml` |
| [3.4](https://maximbytecamp.github.io/angular_react_makarov/temy/34-github-actions/index.html) | Расписание | `scripts/check.mjs`, `results.json`, `check.yml` с ночным запуском и публикацией |
| [П3](https://maximbytecamp.github.io/angular_react_makarov/temy/39-proekt-monitoring/index.html) | Проект | многостраничный монитор с контекстом, историей проверок и тремя дополнительными заданиями |
| [А3](https://maximbytecamp.github.io/angular_react_makarov/temy/38-opoveshchenie/index.html) | Автоматизация | сообщение в Telegram только при изменениях, секреты репозитория |

## Доска заявок: что изменилось

| Было | Стало |
| --- | --- |
| Один экран, всё в `App.tsx` | Страницы в `src/pages`, маршруты в `App.tsx` |
| 14 props через `App` | Контекст `BoardContext`, страницы читают `useBoard()` |
| Счётчик в шапке из props | Шапка сама берёт `newCount` из контекста |
| Заголовок карточки — текст | Ссылка `Link` на страницу заявки |

Новые файлы: `board.ts`, `BoardProvider.tsx`, `pages/BoardPage.tsx`,
`pages/StatsPage.tsx`, `pages/RequestPage.tsx`, `pages/NotFoundPage.tsx`.
В `index.css` добавила меню, страницы, таблицы статистики и страницу заявки.
`main.tsx` теперь оборачивает приложение в `BrowserRouter` и `BoardProvider`.

## Приложение «Мониторинг сайтов группы»

Лежит в `..\monitoring`. Это отдельный проект: у доски заявок есть PocketBase
на `localhost:8090`, поэтому её не опубликовать на Pages, а монитор читает
обычные JSON-файлы из `public/data`.

```
monitoring/
├── .github/workflows/deploy.yml    публикация + 404.html + workflow_call
├── .github/workflows/check.yml     ночная проверка, секреты, задание publish
├── scripts/check.mjs               обход сайтов, история, notify в Telegram
├── public/data/sites.json          семь сайтов, у каждого id латиницей
├── public/data/results.json        три пробные проверки
├── src/monitoring.ts               контекст и useMonitoring
├── src/MonitoringProvider.tsx      загрузка sites.json и results.json
├── src/status.ts                   текст статуса
├── src/pages/                     SitesPage, SitePage, AboutPage, NotFoundPage
└── vite.config.ts                 base: '/monitoring/'
```

Маршруты: `/` — сводка «Не открываются: N из M» и карточки, `/site/:id` —
история проверок сайта, `/about` — как устроена проверка, `*` — «Не найдено».
`BrowserRouter` получил `basename={import.meta.env.BASE_URL}`, а в конвейере
после сборки делается `cp dist/index.html dist/404.html` — так прямые ссылки
открываются на Pages.

Дополнительно сделала три задания из §4: долю удачных проверок на карточке,
кнопку «Только неработающие» и полосы времени ответа в таблице истории.

## Проверка

```
npm run build   → успешно в zayavki и monitoring
npm run lint    → 0 ошибок, 0 предупреждений в обоих
node scripts/check.mjs → 6 сайтов ответили 200, один дал 404, история из 3 проверок
```

В браузере прошла: доску `/`, статистику `/stats` с двумя таблицами,
страницу заявки `/requests/…`, «Страница не найдена» на `/abc`;
в собранном мониторе — сводку, фильтр, страницу сайта с историей,
«О проверке» и неизвестный адрес. Консоль без ошибок.

## Что осталось сделать перед защитой

1. Создать в репозитории `monitoring` секреты `TELEGRAM_TOKEN` и
   `TELEGRAM_CHAT_ID` и запустить «Ночную проверку сайтов» кнопкой
   **Run workflow** — появится коммит бота и новая публикация.
2. Снять снимок сообщения бота о неработающем сайте.
3. После публикации открыть прямую ссылку на страницу сайта в новой
   вкладке и проверить F5.
4. Отправить изменения на GitHub — я держу их локально.
5. Если преподаватель попросит именно мониторы однокурсников, заменить
   две-три строки в `sites.json` на их адреса.

Ответы на вопросы защиты — в
`..\projects\p3-monitoring\Подготовка к защите.md`.
