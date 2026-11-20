# Доска заявок — мой проект по модулю 1

Проект на **Vite + React 19 + TypeScript**, который я собрала по главам
[1.1–1.7](https://maximbytecamp.github.io/angular_react_makarov/) учебника
«Справочник по Angular и React» М. Н. Макарова. Это финальное состояние доски
после главы 1.7: сохранение в localStorage и отправка заявки на вебхук n8n.

[Ссылка на мой мониторинг сайтов](https://github.com/alessstft/monitoring/)

Автоматизация (Docker + n8n + Telegram) лежит в соседней папке `..\avtomatizaciya`.

## Как я запускаю

```powershell
cd zayavki
npm install      # один раз, если нет папки node_modules
npm run dev      # http://localhost:5173
```

Остановка сервера — `Ctrl+C` в терминале.

| Команда | Что делает |
| --- | --- |
| `npm run dev` | сервер разработки с HMR, `localhost:5173` |
| `npm run build` | `tsc -b` (проверка типов) + сборка в `dist/` |
| `npm run lint` | проверка Oxlint, в том числе правил хуков React |
| `npm run preview` | просмотр собранной версии |

> У меня стоит **Node.js 26.13.1 / npm 11.20.0** (LTS с 28 октября 2026 года).
> После установки я перезапустила VS Code: терминал подхватывает PATH только
> при открытии редактора (глава 1.1 §2). В PowerShell ещё понадобилось
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` — без него `npm.ps1`
> блокируется политикой выполнения. Vite 8 требует Node.js не ниже 20.19 / 22.12.

Я прогнала `npm run build` и `npm run lint` — обе без ошибок и предупреждений,
а потом открыла доску в браузере и проверила все сценарии из чек-листа ниже.

## Структура, как я её выстроила

```
zayavki/
├── index.html                     пустой #root, подключение main.tsx   (1.1)
├── package.json                   пакеты и команды проекта            (1.1)
├── src/
│   ├── main.tsx                   createRoot(...).render(<App />)     (1.1)
│   ├── App.tsx                    состояние, map, фильтр, localStorage, fetch (1.4–1.7)
│   ├── index.css                  все стили доски                     (1.2–1.7)
│   ├── requests.ts                типы Status/Category, 5 заявок, nextStatus (1.5, 1.6)
│   ├── storage.ts                 loadRequests / saveRequests         (1.7)
│   ├── notify.ts                  POST на вебхук n8n                  (1.7)
│   └── components/
│       ├── Header.tsx             шапка + счётчик новых заявок        (1.2, 1.4)
│       ├── RequestForm.tsx        управляемые поля, отправка, проверка (1.2, 1.6)
│       └── RequestCard.tsx        props, статус, подробности, удаление (1.2–1.6)
└── avtomatizaciya/                compose.yaml и процесс n8n          (А1)
```

## Чек-лист требований (сверила перед сдачей)

- [x] Шапка с названием службы и числом новых заявок.
- [x] Форма: что случилось, кабинет, категория из четырёх, подробности.
- [x] Пять начальных заявок разных статусов, у каждой свой `id`.
- [x] Карточки из массива через `map` с ключом `key={r.id}`.
- [x] Кнопка переводит «Новая → В работе → Готово», готовую можно убрать с доски.
- [x] Подробности раскрываются по кнопке «Подробнее».
- [x] Фильтр «Все / Новая / В работе / Готово» и сообщение при пустом списке.
- [x] Новая заявка появляется первой, форма очищается.
- [x] Пустые название и кабинет не принимаются, под формой сообщение.
- [x] Заявки и статусы сохраняются после перезагрузки (localStorage, ключ `zayavki`).
- [x] Новая заявка уходит на `http://localhost:5678/webhook/zayavka`;
      доска сообщает, удалось ли отправить уведомление.
- [x] `npm run build` и `npm run lint` проходят без ошибок и предупреждений.

## Задание П1: как я буду переделывать под свой вариант

На странице [«Проект: доска заявок»](https://maximbytecamp.github.io/angular_react_makarov/temy/19-proekt-doska-zayavok/index.html)
нужно сделать такую же доску для другой службы — общежития, студсовета или своей.
Сейчас у меня основа после главы 1.7, вариант «ИТ-отдел колледжа». Когда
преподаватель подтвердит вариант, скопирую папку `zayavki` (например, в
`zayavki-obshchezhitie`) и заменю только данные и тексты:

| Файл | Что заменю |
| --- | --- |
| `src/components/Header.tsx` | заголовок и подпись |
| `src/requests.ts` | тип `Category` и пять заявок в `initialRequests` |
| `src/components/RequestForm.tsx` | подпись поля места, `placeholder`, `<option>`, начальную категорию (в `useState` и при очистке), текст ошибки |
| `src/components/RequestCard.tsx` | «каб.» → «комн.», «гр.» и т. п. |
| `src/storage.ts` | ключ `'zayavki'` на свой, иначе прочитаются старые данные |

`App.tsx` и механизмы трогать не буду: по условию задания вариант задаётся
данными, а не кодом. К работе прикладываю `ai-log.md` и снимок уведомления
в Telegram.

## Сброс данных

Пока в localStorage есть ключ `zayavki`, начальные пять заявок из `requests.ts`
не используются. DevTools → **Application** → **Local Storage** →
`http://localhost:5173` → удалить строку `zayavki` → обновить страницу.
Этим я пользовалась, когда перепроверяла сценарии с чистой доски.

# Модуль 1 · React: первый проект и первый бот

Моя работа по первому модулю учебника
[«Справочник по Angular и React» М. Н. Макарова](https://maximbytecamp.github.io/angular_react_makarov/).
Проверочную работу (Тест 1) сдаю отдельно, в эту папку не включала.

## Что я сделала

Прошла главы 1.1–1.7, собрала доску заявок на Vite + React 19 + TypeScript
и подготовила автоматизацию «заявка → n8n → Telegram». Все механизмы доводила
пошагово, от заготовки проекта до сохранения данных и отправки уведомления.

| Глава | Тема | Что получилось у меня |
| --- | --- | --- |
| [1.1](https://maximbytecamp.github.io/angular_react_makarov/temy/11-node-npm-vite/index.html) | Node.js, npm и проект на Vite | создала каркас `zayavki`, разобралась с `package.json`, `index.html`, `main.tsx` |
| [1.2](https://maximbytecamp.github.io/angular_react_makarov/temy/12-jsx-i-komponenty/index.html) | JSX и компоненты | вынесла `Header`, `RequestForm`, `RequestCard`, написала базовые стили |
| [1.3](https://maximbytecamp.github.io/angular_react_makarov/temy/13-props/index.html) | Props | описала типы props, три разные карточки, тип `Status` |
| [1.4](https://maximbytecamp.github.io/angular_react_makarov/temy/14-sostoyanie-i-sobytiya/index.html) | Состояние и события | `useState`, подъём состояния в `App`, счётчик новых заявок в шапке |
| [1.5](https://maximbytecamp.github.io/angular_react_makarov/temy/15-spiski-i-usloviya/index.html) | Списки, ключи, условия | `requests.ts`, `map` + `key={r.id}`, подробности, удаление, фильтр |
| [1.6](https://maximbytecamp.github.io/angular_react_makarov/temy/16-formy/index.html) | Формы | управляемые поля, `onSubmit` + `preventDefault`, проверка полей |
| [1.7](https://maximbytecamp.github.io/angular_react_makarov/temy/17-sohranenie-i-otpravka/index.html) | Сохранение и отправка | `storage.ts` (localStorage), `notify.ts` (`fetch` → n8n) |
| [П1 / 1.9](https://maximbytecamp.github.io/angular_react_makarov/temy/19-proekt-doska-zayavok/index.html) | Проект: доска заявок | сверила работу с чек-листом требований, расписала переделку под свой вариант |
| [А1 / 1.8](https://maximbytecamp.github.io/angular_react_makarov/temy/18-avtomatizaciya/index.html) | Заявка → n8n → Telegram | `compose.yaml`, шаблон процесса, порядок настройки бота |

## Структура папки

```
Angular и react/
├── README.md                       ← этот файл
├── Отчёт по модулю 1.md            титул, ход работы, проверка, выводы
├── zayavki/                        мой React-проект «Доска заявок»
│   ├── src/                        App.tsx, components/, requests.ts, storage.ts, notify.ts, index.css
│   ├── README.md                   запуск, структура, чек-лист, задание П1
│   └── ai-log.md                   журнал работы с ИИ (режим Р1)
└── avtomatizaciya/                 автоматизация А1
    ├── compose.yaml                Docker Compose для n8n 2.45.4
    ├── zayavka-telegram.json       шаблон процесса из двух узлов
    └── README.md                   моя пошаговая настройка бота и n8n
```

## Как я запускаю

```powershell
cd "C:\Users\aless\OneDrive\Desktop\Angular и react\zayavki"
npm install
npm run dev
```

Открываю `http://localhost:5173`. Останавливаю сервер сочетанием `Ctrl+C`.

Перед сдачей проверяю:

```powershell
npm run build
npm run lint
```

Я запустила обе команды — ошибок и предупреждений нет. Сборка прошла на
Node.js 26.13.1 / npm 11.20.0, Vite 8.3.8, React 19.3.1, TypeScript 7.0.2,
Oxlint 1.94.0; папка `dist/` собралась успешно. Доску открывала в браузере:
пять заявок, счётчик, форма, смена статуса, фильтр и сохранение после
перезагрузки работают, в консоли ошибок нет.

## Что осталось перед защитой

1. Node.js 26 LTS я установила с [nodejs.org](https://nodejs.org/en/download)
   17 ноября. Сразу после установки `npm` в уже открытом VS Code не находился —
   закрыла редактор и открыла заново: терминал читает PATH только при запуске
   (глава 1.1 §2). В PowerShell ещё разрешила сценарии
   `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, иначе блокируется `npm.ps1`.
2. Docker Desktop у меня уже стоит (`docker --version` → 29.9.3). n8n поднимаю
   по своей инструкции в `avtomatizaciya/README.md`.
3. Бота создаю в @BotFather вручную: токен и Chat ID ввожу только в n8n,
   в коде доски их нет.
4. Вариант служба (общежитие / студсовет / своя) уточню у преподавателя.
   Основу оставила для ИТ-отдела; что и в каких файлах менять, расписала
   в `zayavki/README.md`.
5. К архиву приложу снимок уведомления в Telegram и `ai-log.md`.
   Перед архивацией удалю `node_modules` и `dist`, их восстановят
   `npm install` и `npm run build`.
