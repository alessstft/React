# Модуль 2 · Данные с сервера и ИИ-диспетчер

Продолжение проекта «Доска заявок». Первый модуль уже залит на GitHub,
этот коммит — та же папка `zayavki`, переведённая с localStorage на сервер.
Тексты и категории оставила прежними (вариант «ИТ-отдел колледжа»).

## Что изменилось

| Что | Модуль 1 | Модуль 2 | Глава |
| --- | --- | --- | --- |
| Хранение заявок | localStorage одного браузера | коллекция `requests` в PocketBase | 2.2, 2.3 |
| Начало работы | список готов сразу | загрузка / ошибка с «Повторить» / список | 2.3 |
| Код данных | прямо в `App.tsx` | хук `useRequests` + `api.ts` | 2.4 |
| Чужие изменения | видны только после F5 | приходят по подписке без F5 | 2.5 |
| Уведомление | текст заявки в Telegram | категория и срочность от модели, кнопка «Взять» | А2 |
| `id` заявки | число `Date.now()` | строка из 15 символов от PocketBase | 2.3 |

Файл `storage.ts` я удалила: localStorage в проекте больше нет.

## Главы

| Глава | Тема | Что у меня получилось |
| --- | --- | --- |
| [2.1](https://maximbytecamp.github.io/angular_react_makarov/temy/21-effekty/index.html) | Эффекты | три эффекта: число новых в заголовке вкладки, таймер сообщения на 5 секунд, Esc сбрасывает фильтр |
| [2.2](https://maximbytecamp.github.io/angular_react_makarov/temy/22-pocketbase/index.html) | PocketBase | Dockerfile, служба в compose, коллекция `requests`, пять правил доступа |
| [2.3](https://maximbytecamp.github.io/angular_react_makarov/temy/23-zagruzka/index.html) | Загрузка данных | `api.ts`, `loading` / `error`, кнопка «Повторить», POST/PATCH/DELETE на сервер |
| [2.4](https://maximbytecamp.github.io/angular_react_makarov/temy/24-sobstvennyy-huk/index.html) | Собственный хук | `useRequests.ts`: список, загрузка и действия в одном месте |
| [2.5](https://maximbytecamp.github.io/angular_react_makarov/temy/25-obnovlenie-po-sobytiyam/index.html) | События | `realtime.ts` на библиотеке `pocketbase`, `upsertRequest` против повторов |
| [П2](https://maximbytecamp.github.io/angular_react_makarov/temy/29-proekt-doska-s-bazoy/index.html) | Проект | чек-лист требований, порядок переделки под свой вариант |
| [А2](https://maximbytecamp.github.io/angular_react_makarov/temy/28-ii-dispetcher/index.html) | Автоматизация | Ollama + qwen2.5:3b, два процесса n8n, кнопка «Взять» |

## Как я поднимала сервер

```powershell
cd "C:\Users\aless\OneDrive\Desktop\Angular и react\avtomatizaciya"
# один раз: скопировать .env.example в .env и вписать токен бота
docker compose up -d --build
docker compose ps
docker compose exec pocketbase /pb/pocketbase superuser upsert ПОЧТА ПАРОЛЬ --dir=/pb/pb_data
docker compose exec ollama ollama pull qwen2.5:3b
```

Панель PocketBase — `http://localhost:8090/_/`, n8n — `http://localhost:5678`.
В панели я создала коллекцию `requests` с полями `title`, `room`, `category`,
`details`, `status` (обязательные отмечены Required, у Select — свои варианты)
и настроила пять правил:

| Правило | Значение |
| --- | --- |
| List / View | пустые — читать можно всем |
| Create | `@request.body.status = "Новая"` |
| Update | `@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false` |
| Delete | `status = "Готово"` |

Токен бота лежит только в `.env`, который не коммитится: я добавила `.env`
в `.gitignore`. Пароль суперпользователя в файлах проекта тоже не встречается.

## Как запускаю доску

```powershell
cd "C:\Users\aless\OneDrive\Desktop\Angular и react\zayavki"
npm install
npm run dev          # http://localhost:5173
npm run build
npm run lint
```

`pocketbase@0.28.1` добавила в `dependencies` командой `npm install pocketbase@0.28.1`.

## Структура кода

```
src/
├── App.tsx            экран: фильтр, сообщения, Esc, заголовок вкладки
├── useRequests.ts     хук: список, loading/error, retry, add/next/remove, подписка
├── api.ts             fetchRequests / createRequest / updateStatus / deleteRequest
├── realtime.ts        клиент PocketBase и subscribeRequests
├── requests.ts        типы, nextStatus, upsertRequest
├── notify.ts          POST на вебхук n8n (остался от модуля 1)
├── index.css          стили + .load-error
└── components/        Header, RequestForm, RequestCard (без изменений)
```

## Чек-лист требований П2

- [x] Шапка, форма, карточка и категории своего варианта
- [x] Коллекция `requests` с обязательными полями и своими вариантами Select
- [x] Пять правил доступа как в главе 2.2
- [x] Не меньше пяти заявок разных статусов в коллекции
- [x] Список грузится из PocketBase, пока нет ответа — «Загрузка заявок…»
- [x] Остановленный сервер — сообщение и кнопка «Повторить»
- [x] Добавление, статус и удаление уходят на сервер и переживают F5
- [x] Код данных в хуке, в `App.tsx` нет `fetch` и эффекта загрузки
- [x] Изменения приходят без F5 и без повторов (`upsertRequest`)
- [x] `localStorage` и `storage.ts` удалены
- [x] `npm run build` и `npm run lint` без ошибок и предупреждений
- [ ] ИИ-диспетчер с кнопкой «Взять» — шаблоны готовы, нужен токен бота и модель

## Что я проверила в браузере

- пять карточек из базы, счётчик новых и заголовок вкладки;
- изменение записи через API пришло на доску **без F5**: счётчик 2 → 1,
  кнопка карточки сменилась на «Завершить»;
- заявка из формы появилась первой, без дубля, счётчик вырос, форма очистилась;
- фильтр «Новая» оставил две карточки, Esc вернул «Все»;
- при остановленном PocketBase — «Сервер заявок не отвечает…» и «Повторить»;
  после `docker compose start pocketbase` кнопка загрузила список без F5;
- консоль без ошибок React.

## Что осталось сделать вручную

1. Создать `.env` из `.env.example` и вписать токен бота от @BotFather.
2. Скачать модель `qwen2.5:3b` (около 2,1 ГБ, образ Ollama — около 7 ГБ).
3. В n8n снять с публикации процесс модуля 1, вставить два шаблона из
   `avtomatizaciya/`, подключить бота, указать Chat ID и опубликовать оба.
4. Уточнить у преподавателя вариант службы; что менять под «Общежитие» или
   «Студсовет», расписано на странице проекта П2 (меняются только тексты,
   `Category`, имя коллекции в `api.ts` и `realtime.ts`, адреса в двух узлах n8n).
5. Приложить снимки сообщения бота с кнопкой и после нажатия «Взять».

Подробная инструкция по автоматизации — в `..\avtomatizaciya\README.md`.
