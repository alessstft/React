# Автоматизация А1: заявка → n8n → Telegram

Мои файлы для страницы «Автоматизация» модуля 1:
[Заявка → n8n → сообщение в Telegram](https://maximbytecamp.github.io/angular_react_makarov/temy/18-avtomatizaciya/index.html).

Код доски я не меняла: `zayavki/src/notify.ts` уже отправляет заявку методом
`POST` на `http://localhost:5678/webhook/zayavka`. Токен бота в коде доски
**не храню** — он остаётся в учётных данных n8n.

## Что лежит в папке

| Файл | Назначение |
| --- | --- |
| `compose.yaml` | Описание контейнера n8n 2.45.4, порт 5678, том `n8n_data` для данных |
| `zayavka-telegram.json` | Мой шаблон процесса из двух узлов: Webhook и Telegram (вставляется на холст n8n) |

## Порядок, по которому я настраивала

1. Запустила **Docker Desktop**, дождалась `Engine running`. Проверила `docker --version`.
2. В этой папке выполнила:

   ```powershell
   docker compose up -d
   docker compose ps
   ```

   В столбце `STATUS` должно быть `Up`.
3. Открыла `http://localhost:5678`, создала учётную запись владельца,
   анкету пропустила кнопкой **Get started**.
4. Создала бота в **@BotFather**: `/newbot` → имя → адрес, заканчивающийся
   на `bot`. Токен сохранила у себя, в чат с ботом нажала **Start**.
5. Узнала номер чата через `https://api.telegram.org/botТОКЕН/getUpdates` —
   число после `"chat":{"id":`. Если пришёл `"result":[]`, значит я ещё не
   нажала Start у бота.
6. В n8n: **Build a workflow** → скопировала `zayavka-telegram.json` →
   щёлкнула по холсту и вставила Ctrl+V (если всплыло служебное окно про
   вставку — **Skip**) → Ctrl+S.
7. Двойной щелчок по узлу **Telegram** → **Connect to Telegram** → вставила
   токен в **Access Token** → **Save**. В **Chat ID** вписала номер чата.
8. Закрыла окно узла, Ctrl+S, затем **Publish** → **Publish** → **Got it**.
   Рабочий адрес `/webhook/zayavka` начинает принимать запросы только
   после публикации — это я проверила отдельно.
9. Запустила доску (`npm run dev` в `..\zayavki`), открыла
   `http://localhost:5173` и отправила заявку. Над списком появилось
   «уведомление отправлено», бот прислал сообщение в Telegram.

## Команды, которыми пользуюсь

| Действие | Команда |
| --- | --- |
| Запустить | `docker compose up -d` |
| Состояние | `docker compose ps` |
| Остановить / запустить снова | `docker compose stop` / `docker compose start` |
| Адрес n8n | `http://localhost:5678` |
| Рабочий вебхук | `http://localhost:5678/webhook/zayavka` |

## Что я держу в голове

- **Токен бота** живёт только в credential «Telegram account» внутри n8n.
  В код доски, в репозиторий и в переписку я его не вставляю.
- **Allowed Origins (CORS)** узла Webhook разрешает запросы только с
  `http://localhost:5173`, поэтому доску открываю именно по этому адресу,
  а не через `127.0.0.1`.
- Пока n8n остановлен, доска продолжает работать: заявка сохраняется, а над
  списком я вижу «уведомление не отправлено: сервер автоматизации недоступен».
  Так задумано в `handleAdd` (`src/App.tsx`, глава 1.7): сначала заявка
  на доску, потом уведомление.

## Ошибки, с которыми столкнулась

| Симптом | Причина | Что сделала |
| --- | --- | --- |
| `net::ERR_CONNECTION_REFUSED` в консоли | n8n не запущен | `docker compose start` |
| `The requested webhook "POST zayavka" is not registered` | забыла опубликовать процесс | Нажала **Publish** |
| `blocked by CORS policy` | открыла доску с другого адреса | Вернулась на `http://localhost:5173` |
| `Bad Request: chat not found` | неверный Chat ID или не нажат Start у бота | Взяла номер из `getUpdates` заново |
| `Unauthorized` | неверный или отозванный токен | Обновила credential в n8n |
