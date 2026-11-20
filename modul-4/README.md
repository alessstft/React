# Модуль 4 · Работа с ИИ-агентом и обзор Angular

Продолжение моей работы. Четвёртый модуль делаю локально, в этой папке, на GitHub не отправляю — залью сама. Проверочную работу сдаю отдельно, в репозиторий не включаю.

Режим **Р2**: код пишет ИИ-агент, я ставлю задачи, проверяю результат и принимаю или возвращаю работу.

## Главы

| Глава | Тема | Что у меня получилось |
| --- | --- | --- |
| [4.1](https://maximbytecamp.github.io/angular_react_makarov/temy/41-testy-komponentov/index.html) | Тесты компонентов | Vitest + Testing Library, 5 файлов тестов, **23 теста**, две ошибки страницы найдены и исправлены |
| [4.2](https://maximbytecamp.github.io/angular_react_makarov/temy/42-dostupnost/index.html) | Доступность | Lighthouse 100, контраст, роли `status`/`alert`, названия ссылок, `<title>` у страниц, `jsx-a11y` в линтере |
| [4.3](https://maximbytecamp.github.io/angular_react_makarov/temy/43-zadacha-agentu/index.html) | Задача агенту | `AGENTS.md`, `ai-log.md`, поиск и флажок на странице «Сайты», правки агента отклонены и переписаны |
| [4.4](https://maximbytecamp.github.io/angular_react_makarov/temy/44-angular/index.html) | Angular | проект `monitoring-ng`: та же страница на сигналах, службе и шаблонах, 4 теста, сборка 258 КБ |
| [П4](https://maximbytecamp.github.io/angular_react_makarov/temy/49-proekt-daydzhest/index.html) | Проект: дайджест | приложение `digest` с лентой новостей, поиском, тегом, «прочитано», 5 тестов, `tasks/` и `AGENTS.md` |
| [А4](https://maximbytecamp.github.io/angular_react_makarov/temy/48-avtomatizaciya/index.html) | Автоматизация | Apps Script + два процесса n8n: утром новости в таблицу, вечером дайджест в Telegram |

## Где что лежит

```
Angular и react/
├── monitoring/                       React-версия монитора (модули 3–4)
│   ├── AGENTS.md                     правила проекта для агента
│   ├── ai-log.md                     журнал: попытки агента, доступность, решения
│   ├── src/status.test.ts            4 теста функции statusText
│   ├── src/plural.ts                 склонение «сайт/сайта/сайтов»
│   ├── src/plural.test.ts            8 тестов на числах
│   ├── src/setupTests.ts             jest-dom + cleanup
│   ├── src/App.test.tsx              щелчок по карточке + заголовок вкладки
│   ├── src/MonitoringProvider.test.tsx  ошибка загрузки, подменённый fetch
│   ├── src/pages/SitesPage.test.tsx 9 тестов страницы
│   ├── src/pages/SitesPage.tsx       сводка, поиск, флажок, карточки-ссылки
│   ├── src/pages/SitePage.tsx        история, заголовок, role="status", caption
│   ├── src/index.css                 контрастные цвета, доступная разметка
│   ├── .oxlintrc.json                плагин jsx-a11y
│   ├── vite.config.ts                test: jsdom + setupFiles
│   └── .github/workflows/deploy.yml  линтер и тесты перед сборкой
├── monitoring-ng/                    Angular-версия той же страницы
│   ├── src/app/monitoring.ts         @Service + httpResource
│   ├── src/app/pages/sites-page.ts   signal / computed / inject
│   ├── src/app/pages/sites-page.html @if, @for, [routerLink], class bindings
│   ├── src/app/pages/site-page.ts    input.required, inline-шаблон
│   ├── src/app/app.routes.ts         маршруты с title
│   └── src/app/pages/sites-page.spec.ts  4 теста через TestBed
├── digest/                           проект П4
│   ├── AGENTS.md, ai-log.md
│   ├── tasks/01-zagruzka.md, 02-filtry.md, 03-prochitano.md
│   ├── src/digest.ts                 загрузка, теги строкой → массив, сортировка
│   ├── src/App.tsx                  поиск, тег, «только непрочитанные», localStorage
│   ├── src/App.test.tsx             5 тестов с подменённой сетью
│   └── .github/workflows/deploy.yml  линтер, тесты, сборка
└── avtomatizaciya/                   А4
    ├── apps-script/Code.gs          doGet / doPost, ключ KEY
    ├── digest-sbor.json             утренний процесс n8n
    ├── digest-telegram.json         вечерний процесс n8n
    ├── compose.yaml                 DIGEST_URL, DIGEST_KEY, TELEGRAM_CHAT_ID
    └── .env.example                 образцы переменных
```

## Проверка

```
monitoring:     npx tsc -b ✓ · lint --deny-warnings ✓ · CI=true npm test — 23 теста ✓ · build ✓
monitoring-ng:  CI=true npm test — 4 теста ✓ · ng build — 258 КБ ✓
digest:         npx tsc -b ✓ · lint --deny-warnings ✓ · CI=true npm test — 5 тестов ✓ · build ✓
```

## Как это сделано

**4.1.** Поставила Vitest, jsdom и Testing Library в `devDependencies`, добавила `npm test`. Сначала тесты `statusText` (чистая функция), потом страница: `MonitoringContext` с придуманными данными + `MemoryRouter`. Два теста по требованиям — «все сайты открываются» и «проверок ещё не было» — упали и нашли две ошибки, которые руками не видны: «Все 3 сайтов» и «Не открываются: 3 из 3» при пустой истории. Добавила `sitesWord`, переписала сводку. Тесты щелчка и ошибки загрузки (`vi.stubGlobal`) довели набор до 20, затем до 23.

**4.2.** Lighthouse показал 94 и 91 из-за контраста; заменила зелёный на `#1e7a46`, синий на `#2563d0`. Опыт с карточкой на `div` показал, что Lighthouse ставит 100, а Tab до карточки не доходит — спасли тесты `getByRole('link')` и плагин `jsx-a11y`. Поставила название сайта первым внутри ссылки, добавила `<title>` каждой странице, `role="status"`/`role="alert"`, `<caption>` таблице. В `deploy.yml` перед сборкой теперь линтер с `--deny-warnings` и тесты.

**4.3.** Написала `AGENTS.md` с правилами проекта и задание с разделом «Готово, когда». Агент трижды отвечал «изменения не нужны», потом допустил пять ошибок (нет импорта `useState`, хук после `return`, поле под карточками, лишний пробел, тесты без `await`). Вернула с замечаниями — не исправил. Правки отменила, поиск и флажок написала вручную, оставив из его ответа `filter` и сценарии тестов; всё записала в `ai-log.md`.

**4.4.** `monitoring-ng` создан Angular CLI. Файлы без обращений к React (`types.ts`, `status.ts`, `plural.ts`), данные и стили перенесены копированием. Провайдер с контекстом заменила служба `@Service()` на двух `httpResource`, состояние — `signal`, вычисления — `computed`, разметка — шаблон с `@if`/`@for`. Заголовки вкладок заданы свойством `title` маршрута. Тест создаёт страницу через `TestBed` с подменённой службой.

**П4 и А4.** `digest` собран по трём заданиям в `tasks/`: загрузка с состояниями, фильтры (вычисляются, не хранятся), `localStorage` для прочитанного. Адрес веб-приложения — `VITE_DIGEST_URL` в `.env`, ключа в коде нет. Автоматизация: Google Таблица → Apps Script (`doGet` читает, `doPost` пишет по ключу) → два процесса n8n, модель пересказывает новости и ставит теги, вечером бот шлёт список в Telegram.

## Что осталось сделать самой

1. Google: создать таблицу, вставить `Code.gs`, задать `KEY`, опубликовать веб-приложение и скопировать `/exec` — без моего доступа к аккаунту это не сделать.
2. Вписать адрес в `digest\.env` и `.env` в `avtomatizaciya`, поднять n8n, вставить и опубликовать оба процесса, снять снимок сообщения бота.
3. Прогнать Lighthouse на `digest` и клавиатуру; при находках — новое задание агенту с записью в журнал.
4. Создать отдельные репозитории `digest` и `monitoring-ng` и залить код (включая `projects/p4-digest` в репозитории курса).
5. Отправить четвёртый модуль в Git — я держу всё локально.
