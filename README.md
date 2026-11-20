# Справочник по Angular и React · моя работа

Учебная дисциплина «Фронтенд в эпоху ИИ», справочник
[М. Н. Макарова](https://maximbytecamp.github.io/angular_react_makarov/).
Первый модуль уже на GitHub, второй лежит в отдельной ветке, третий добавила
этой папкой и пока держу локально — отправлю сама.

## Модули

| Модуль | Тема | Что сделано |
| --- | --- | --- |
| **1** | React: первый проект и первый бот | доска заявок на Vite + React + TypeScript, localStorage, вебхук n8n → Telegram |
| **2** | Данные с сервера и ИИ-диспетчер | PocketBase, загрузка с ошибкой и повтором, хук `useRequests`, события без F5, Ollama + кнопка «Взять» |
| **3** | Несколько экранов, публикация, расписание | react-router и контекст в доске; приложение `monitoring` с GitHub Pages, ночной проверкой и оповещением в Telegram |
| **4** | Работа с ИИ-агентом и обзор Angular | 23 теста и доступность в `monitoring`, версия на Angular, приложение `digest` с заданиями агенту, сбор новостей через n8n и Apps Script |

Ссылки третьего модуля: репозиторий https://github.com/alessstft/monitoring,
сайт https://alessstft.github.io/monitoring/, бот https://t.me/FORREACT_bot.
Четвёртый модуль пока локально, на GitHub залью сама.

Проверочные работы сдаю отдельно, в репозиторий их не включаю.

## Структура

```
Angular и react/
├── README.md                        ← этот файл
├── Отчёт по модулю 1.md
├── Отчёт по модулю 2.md
├── Отчёт по модулю 3.md
├── Отчёт по модулю 4.md
├── modul-2/README.md                главы 2.1–2.5 и чек-лист П2
├── modul-3/README.md                главы 3.1–3.4, П3 и А3
├── modul-4/README.md                главы 4.1–4.4, П4 и А4
├── projects/p3-monitoring/          README, ai-log и подготовка к защите
├── zayavki/                         доска заявок, основная рабочая папка
│   ├── src/pages/                   BoardPage, StatsPage, RequestPage, NotFoundPage
│   ├── src/board.ts, BoardProvider.tsx
│   ├── src/App.tsx, main.tsx, index.css
│   ├── src/api.ts, useRequests.ts, realtime.ts, requests.ts, notify.ts
│   ├── README.md                    описание проекта модуля 1
│   └── ai-log.md                    журнал работы с ИИ (режим Р1)
├── monitoring/                      второе приложение для GitHub Pages
│   ├── .github/workflows/           deploy.yml и check.yml
│   ├── scripts/check.mjs            ночная проверка и notify
│   ├── public/data/                 sites.json и results.json
│   ├── src/pages/                   SitesPage, SitePage, AboutPage, NotFoundPage
│   ├── AGENTS.md, ai-log.md         правила агента и журнал (модуль 4)
│   └── README.md
├── monitoring-ng/                   та же страница на Angular 22 (глава 4.4)
├── digest/                          дайджест новостей (проект П4)
│   ├── AGENTS.md, ai-log.md, tasks/ режим Р2: задания агенту и решения
│   ├── src/App.test.tsx             5 тестов с подменённой сетью
│   └── .github/workflows/deploy.yml
├── avtomatizaciya/                  Docker, n8n, PocketBase, Ollama
│   ├── compose.yaml
│   ├── pocketbase/Dockerfile
│   ├── .env.example
│   ├── zayavka-telegram.json
│   ├── ii-dispetcher.json
│   ├── knopka-vzyat.json
│   ├── apps-script/Code.gs          таблица и веб-приложение (А4)
│   ├── digest-sbor.json             утренний сбор новостей
│   ├── digest-telegram.json         вечерний дайджест в Telegram
│   └── README.md
└── src/, package.json, ...          зеркало исходников доски для GitHub
```

В корне лежит копия исходников `zayavki`, чтобы код был виден сразу на главной
странице репозитория. Обе копии поддерживаю одинаковыми.

## Как запускаю

```powershell
cd "C:\Users\aless\OneDrive\Desktop\Angular и react\zayavki"
npm install
npm run dev          # http://localhost:5173
```

Монитор собирается отдельно и открывается с подпапкой:

```powershell
cd "..\monitoring"
npm install
npm run dev          # http://localhost:5173/monitoring/
npm run build
npm run preview      # http://localhost:4173/monitoring/
```

Серверная часть поднимается из `avtomatizaciya`:

```powershell
cd "..\avtomatizaciya"
docker compose up -d --build
docker compose ps
```

PocketBase — `http://localhost:8090/_/`, n8n — `http://localhost:5678`,
Ollama — `http://localhost:11434`. Перед первым запуском копирую
`.env.example` в `.env` и вписываю токен бота; сам `.env` в Git не коммитится.

## Проверка перед сдачей

```powershell
npm run build
npm run lint
```

Обе команды прогнала и в `zayavki`, и в `monitoring` на Node.js 26.13.1 /
npm 11.20.0, Vite 8.3.8, React 19.3.1, TypeScript 7.0.2, Oxlint 1.94.0 —
ошибок и предупреждений нет. В браузере проверила все страницы доски
(`/`, `/stats`, `/requests/…`, `/abc`) и монитора (сводка, страница сайта,
«О проверке», неизвестный адрес). Скрипт ночной проверки на компьютере
отработал: все семь адресов ответили 200, включая ссылку на бота оповещений.

В модуле 4 добавились тесты и Angular-версия:

```powershell
cd monitoring
npm run lint -- --deny-warnings
CI=true npm test          # 23 теста

cd ..\monitoring-ng
CI=true npm test          # 4 теста
npm run build             # 258 КБ

cd ..\digest
npm run lint -- --deny-warnings
CI=true npm test          # 5 тестов
```

Все проекты собираются и проходят проверки без ошибок и предупреждений.

## Что осталось перед защитой

1. Создать в репозитории `monitoring` секреты `TELEGRAM_TOKEN` и
   `TELEGRAM_CHAT_ID` и запустить Actions → «Ночная проверка сайтов» →
   **Run workflow**.
2. Снять снимок сообщения бота: для этого временно подставить в `sites.json`
   неработающий адрес вместо ссылки на бота и обнулить `results.json`, а после
   снимка вернуть зелёную ссылку. Затем проверить прямую ссылку на страницу
   сайта в новой вкладке и после F5.
3. Удалить `node_modules` и `dist` перед архивом.
4. Модуль 4: создать таблицу и веб-приложение Apps Script, вписать `/exec`
   в `.env`, поднять n8n с двумя процессами дайджеста, снять снимок бота,
   прогнать Lighthouse на `digest` и пройти страницу с клавиатуры.
5. Отправить изменения на GitHub — я держу их локально и залью сама.

Ответы на вопросы защиты и чек-лист показа —
в `projects\p3-monitoring\Подготовка к защите.md`; структура четвёртого модуля
и порядок действий — в `modul-4\README.md`.
