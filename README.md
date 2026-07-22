# Navigator

Сервис-агрегатор грантов и конкурсов: парсит новости с сайтов-источников и публикует их в Telegram-канал.

## Источники

- АТР
- ФИОП
- Минобр
- РНФ

## Как работает

1. Playwright-эмулятор открывает страницы источников
2. Парсер извлекает новые материалы
3. Telegram-бот публикует посты с изображением и описанием
4. SQLite хранит уже отправленные сообщения, чтобы не дублировать

## Стек

- Node.js / TypeScript
- Playwright, node-html-parser
- node-telegram-bot-api
- SQLite, node-cron, PM2, Sharp

## Структура

```
src/
  app/       # точка входа и скрипты (dev/prod/fill/clear)
  parser/    # парсеры источников
  bot/       # Telegram-бот
  emulator/  # браузерная эмуляция
  storage/   # SQLite
assets/      # логотипы источников
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |
| `TELEGRAM_CHANNEL_ID` | ID канала для публикации |

## Запуск

```bash
npm i
cp .env.example .env   # затем заполните секреты
npm run dev            # разовый прогон в dev
npm run fill           # наполнение без отправки (режим fill)
npm run prod           # сборка + PM2
```
