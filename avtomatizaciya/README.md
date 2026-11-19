# Автоматизация: n8n → Telegram, PocketBase и ИИ-диспетчер

Моя папка с серверной частью проекта. Здесь лежат три службы Docker и
шаблоны процессов n8n для модулей 1 и 2:

- [А1 «Заявка → n8n → Telegram»](https://maximbytecamp.github.io/angular_react_makarov/temy/18-avtomatizaciya/index.html) — простое уведомление о заявке;
- [А2 «ИИ-диспетчер и кнопка «Взять»»](https://maximbytecamp.github.io/angular_react_makarov/temy/28-ii-dispetcher/index.html) — модель определяет категорию, бот присылает кнопку.

Код доски я не меняла: `zayavki/src/notify.ts` по-прежнему отправляет заявку
методом `POST` на `http://localhost:5678/webhook/zayavka`.

## Что лежит в папке

| Файл | Назначение |
| --- | --- |
| `compose.yaml` | три службы: n8n 2.45.4, PocketBase (сборка из `Dockerfile`), Ollama 0.40.12; тома `n8n_data`, `pb_data`, `ollama_data` |
| `pocketbase/Dockerfile` | Alpine 3.20 + PocketBase 0.40.6, порт 8090 |
| `.env.example` | образец файла с токеном бота (сам `.env` в Git не коммитится) |
| `zayavka-telegram.json` | процесс модуля 1: Webhook + Telegram |
| `ii-dispetcher.json` | процесс А2: Webhook → Модель → Ответ модели → Категория в базу → Telegram |
| `knopka-vzyat.json` | процесс А2: опрос нажатий раз в 10 с → статус «В работе» → правка сообщения |

## Подготовка (один раз)

1. Скопировала `.env.example` в `.env` и вписала токен бота от @BotFather
   без пробелов и кавычек:

   ```
   TELEGRAM_TOKEN=токен-от-BotFather
   ```

   `.env` добавлен в `.gitignore` — пароль бота в репозиторий не попадает.

2. Подняла службы:

   ```powershell
   cd "C:\Users\aless\OneDrive\Desktop\Angular и react\avtomatizaciya"
   docker compose up -d --build
   docker compose ps
   ```

3. Создала суперпользователя PocketBase (почта — только имя для входа,
   письма не приходят):

   ```powershell
   docker compose exec pocketbase /pb/pocketbase superuser upsert ПОЧТА ПАРОЛЬ --dir=/pb/pb_data
   ```

4. В панели `http://localhost:8090/_/` завела коллекцию `requests`: поля
   `title`, `room` (Plain text, Required), `category` и `status` (Select со
   своими вариантами, Required), `details` (Plain text), плюс служебные
   `created` / `updated`. Добавила пять заявок разных статусов и настроила
   правила из `modul-2/README.md`.

5. Скачала модель для диспетчера:

   ```powershell
   docker compose exec ollama ollama pull qwen2.5:3b
   docker compose exec ollama ollama list
   ```

## Процессы n8n

1. Открыла `http://localhost:5678`. Процесс модуля 1 «Заявка → Telegram»
   **сняла с публикации** (меню рядом с Publish → Unpublish): новый процесс
   слушает тот же адрес `/webhook/zayavka`, а один адрес может занимать
   только один опубликованный процесс.
2. Создала два процесса, вставила в каждый содержимое `ii-dispetcher.json`
   и `knopka-vzyat.json` на холст (Ctrl+V, служебное окно — Skip), сохранила.
3. В узле **Telegram** процесса «ИИ-диспетчер» выбрала учётные данные
   «Telegram account» и вписала Chat ID из `getUpdates`.
4. Опубликовала оба процесса. Второй сразу начал раз в 10 секунд спрашивать
   Telegram о нажатиях кнопки.

Токен в шаблонах не лежит: в узле «Нажатия» адрес собраны как
`https://api.telegram.org/bot{{ $env.TELEGRAM_TOKEN }}/getUpdates`, значение
подставляется из `.env` благодаря `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`.

## Команды

| Действие | Команда |
| --- | --- |
| Поднять всё | `docker compose up -d --build` |
| Состояние | `docker compose ps` |
| Остановить / запустить PocketBase | `docker compose stop pocketbase` / `start pocketbase` |
| Панель PocketBase | `http://localhost:8090/_/` |
| n8n | `http://localhost:5678` |
| Ollama | `http://localhost:11434` |
| Рабочий вебхук | `http://localhost:5678/webhook/zayavka` |
| Список моделей | `docker compose exec ollama ollama list` |

## Проверка

- GET `http://localhost:8090/api/collections/requests/records` без токена
  отдаёт пять записей — правило List открыто всем;
- создание заявки сразу со статусом «Готово» даёт 400, правка названия — 404,
  смена только статуса — 200;
- доска на `http://localhost:5173` показывает заявки из базы, а изменение
  записи через API приходит на неё без F5;
- при остановленном PocketBase доска показывает ошибку и «Повторить»;
- при выключенном n8n заявка всё равно сохраняется, а над списком я вижу
  честное «уведомление не отправлено».

## Частые ошибки

| Симптом | Причина | Что сделала |
| --- | --- | --- |
| `Only superusers can perform this action`, код 403 | правило действия закрыто замком | сняла замок, оставила поле пустым или вписала условие |
| `The requested webhook "POST zayavka" is not registered` | старый процесс ещё опубликован или новый не опубликован | Unpublish у А1, Publish у А2 |
| `net::ERR_CONNECTION_REFUSED` на 8090 | контейнер PocketBase остановлен | `docker compose start pocketbase` |
| `Узел «Нажатия»: Not Found` | нет `.env` или n8n поднят до его создания | проверила `.env`, повторила `docker compose up -d` |
| `$env` недоступен в узле | нет `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` | сверила `compose.yaml` |
| `model 'qwen2.5:3b' not found` | модель не скачана | `ollama pull qwen2.5:3b` |
| `blocked by CORS policy` | доска открыта не с `localhost:5173` | вернулась на `http://localhost:5173` |
| `message is not modified` | кнопку нажали дважды | ничего: у двух последних узлов включён On Error → Continue |

Секреты — токен бота и пароль суперпользователя — в коде доски и в файлах
процессов не встречаются. Перед сдачей я выгружаю процессы через
**… → Export JSON** и стираю `chatId` в файле «ИИ-диспетчера».

## Автоматизация А3 (модуль 3)

Оповещение о ночной проверке сайтов НЕ лежит в этой папке: оно живёт в
`..\monitoring\scripts\check.mjs` и в `..\monitoring\.github\workflows\check.yml`.
Скрипт сравнивает две последние проверки и вызывает `sendMessage` Bot API
только когда сайт перестал открываться или снова заработал.

Токен и номер чата для него я создаю уже не в `.env`, а в секретах репозитория
`monitoring`: Settings → Secrets and variables → Actions →
`TELEGRAM_TOKEN` и `TELEGRAM_CHAT_ID`. Шаг «Проверить сайты» получает их
через раздел `env`, в журнале запуска они видны как `***`. Здесь, в
`avtomatizaciya`, токен по-прежнему нужен процессам n8n из модулей 1 и 2.

Подробности ночной проверки и публикации — в `..\monitoring\README.md`.
