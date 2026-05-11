# SHSH Panel

Админ-панель для управления объявлениями о продаже техники на внешнем домене, с встроенным Live Chat и Telegram-уведомлениями.

---

## О проекте

SHSH Panel — это веб-панель, через которую оператор (поддержка) создаёт объявления о продаже техники. Объявления публикуются на **внешнем сервере/домене** (другой сайт). Каждое объявление получает уникальную ссылку вида:

```
https://www.EXAMPLE.COM/iad/kaufen-und-verkaufen/d/iphone-12-pro-256-gb-1441954182/
```

На этом внешнем сайте клиент может написать в чат — сообщение попадает в панель, оператор отвечает. При новом сообщении от клиента приходит уведомление в Telegram.

**Панель и внешний сайт находятся на разных серверах/доменах.** Связь между ними — через API.

---

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Frontend + Backend | **Next.js 16** (App Router, TypeScript) |
| UI | **Tailwind CSS v4**, шрифт **Satoshi** |
| База данных | **PostgreSQL** + **Prisma ORM v7** |
| Авторизация | **NextAuth.js v4** (Credentials + JWT) |
| HTTP-клиент | **Axios** (для запросов к внешнему серверу) |
| Иконки | **Lucide React** |
| Хеширование | **bcryptjs** |
| Уведомления | **Telegram Bot API** |

---

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx              # Корневой layout (Satoshi шрифт, providers)
│   ├── page.tsx                # Редирект на /login
│   ├── providers.tsx           # SessionProvider обёртка
│   ├── globals.css             # Тема: тёмная, #0A0A0A, акцент #A8A29E
│   │
│   ├── login/page.tsx          # Страница входа (чёрный фон + светлая карточка)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout с header-навигацией
│   │   └── page.tsx            # Статистика + последние объявления
│   │
│   ├── listings/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Таблица всех объявлений (поиск, удаление, публикация)
│   │   └── new/page.tsx        # Форма создания объявления
│   │
│   ├── chat/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Список чатов с непрочитанными
│   │   └── [listingId]/page.tsx # Окно чата с конкретным клиентом
│   │
│   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Настройки: внешний сервер + Telegram
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│       ├── seed/route.ts                # Создание админа
│       ├── listings/route.ts            # GET/POST объявлений
│       ├── listings/[id]/route.ts       # PATCH/DELETE объявления
│       ├── listings/[id]/publish/route.ts # Публикация на внешний сервер
│       ├── settings/route.ts            # GET/PUT настроек
│       ├── chat/[listingId]/route.ts    # GET/POST сообщений (CORS, публичный)
│       ├── chat/[listingId]/read/route.ts # Пометка прочитанным
│       └── chat/unread/route.ts         # Список чатов с непрочитанными
│
├── components/
│   └── Sidebar.tsx             # Header-навигация (горизонтальная, вверху)
│
├── lib/
│   ├── auth.ts                 # Конфигурация NextAuth
│   ├── prisma.ts               # Prisma клиент (singleton + PrismaPg adapter)
│   ├── cors.ts                 # CORS-хелперы для публичных эндпоинтов
│   ├── telegram.ts             # Отправка уведомлений в Telegram
│   └── utils.ts                # cn(), generateSlug()
│
├── middleware.ts                # Защита роутов (auth required)
└── generated/prisma/           # Авто-сгенерированный Prisma client
```

---

## База данных (Prisma Schema)

### User
Администратор панели.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (CUID) | PK |
| username | String (unique) | Логин |
| password | String | Хеш пароля (bcrypt) |
| listings | Listing[] | Связь |
| settings | Settings? | Связь |

### Listing
Объявление о продаже.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (CUID) | PK |
| sellerName | String | Полное имя продавца |
| address | String | Адрес продавца |
| template | String | Шаблон: default / premium / minimal |
| title | String | Название объявления |
| price | Float | Цена в EUR |
| mainImage | String | URL главного изображения |
| images | String[] | URL дополнительных изображений |
| slug | String | ЧПУ для URL |
| status | String | draft / published |
| externalUrl | String? | Ссылка на внешнем сайте после публикации |
| userId | String | FK на User |
| messages | Message[] | Связь (cascade delete) |

### Message
Сообщение в чате.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (CUID) | PK |
| content | String | Текст сообщения |
| sender | String | "client" или "support" |
| read | Boolean | Прочитано оператором |
| listingId | String | FK на Listing |

### Settings
Настройки подключения к внешнему серверу.

| Поле | Тип | Описание |
|------|-----|----------|
| externalDomain | String | Домен внешнего сайта |
| apiKey | String | API ключ (Bearer token) |
| apiEndpoint | String | Эндпоинт на внешнем сервере |
| telegramBotToken | String | Токен Telegram бота |
| telegramChatId | String | Chat ID для уведомлений |

---

## API Endpoints

### Защищённые (требуют авторизацию)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/listings` | Все объявления текущего юзера |
| POST | `/api/listings` | Создать объявление (draft) |
| PATCH | `/api/listings/[id]` | Обновить объявление |
| DELETE | `/api/listings/[id]` | Удалить объявление |
| POST | `/api/listings/[id]/publish` | Опубликовать на внешнем сервере |
| GET | `/api/settings` | Получить настройки |
| PUT | `/api/settings` | Сохранить настройки |
| GET | `/api/chat/unread` | Список чатов с непрочитанными |
| POST | `/api/chat/[listingId]/read` | Пометить сообщения прочитанными |

### Публичные (CORS, для внешнего сайта)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/chat/[listingId]` | Получить сообщения чата |
| GET | `/api/chat/[listingId]?after=ISO_DATE` | Получить новые сообщения (polling) |
| POST | `/api/chat/[listingId]` | Отправить сообщение: `{ content, sender: "client" }` |
| POST | `/api/seed` | Создать admin-пользователя (одноразово) |

---

## Дизайн-система

- **Палитра:** чёрный `#0A0A0A` / тёмно-серый `#141414` / `#1E1E1E` / `#252525`
- **Акцент:** тёплый нейтральный `#A8A29E` (камень/бетон)
- **Текст:** белый `#FAFAFA`, приглушённый `#6B6B6B`, тусклый `#4A4A4A`
- **Шрифт:** Satoshi (Fontshare CDN)
- **Правила:** БЕЗ теней, БЕЗ обводок (border), БЕЗ градиентов, БЕЗ glow-эффектов
- **Скругления:** `rounded-2xl` для карточек и инпутов, `rounded-full` для pill-кнопок навигации
- **Кнопки действий:** белый фон `bg-white` + чёрный текст
- **Навигация:** горизонтальный header (не sidebar)

---

## Установка и запуск

### Требования
- Node.js 20+
- PostgreSQL (запущен и доступен)

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка .env

Создать файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/shsh_panel"
NEXTAUTH_SECRET="сгенерируй-длинный-случайный-ключ"
NEXTAUTH_URL="http://localhost:8500"
```

### 3. Создание базы данных

```bash
# Создать БД (если ещё нет)
createdb shsh_panel

# Применить миграции
npx prisma migrate dev

# Сгенерировать клиент
npx prisma generate
```

### 4. Запуск

```bash
npm run dev -- -p 8500
```

### 5. Создание админа

```bash
curl -X POST http://localhost:8500/api/seed
```

**Данные для входа:** `admin` / `Admin@2024!Secure`

---

## Что сделано

- [x] Авторизация (логин + пароль, JWT, защита роутов)
- [x] CRUD объявлений (создание, список, удаление)
- [x] Публикация на внешний сервер через API
- [x] Генерация ЧПУ-ссылок (slug)
- [x] Live Chat (список чатов, переписка, polling 3-4 сек)
- [x] Публичные CORS-эндпоинты для чата (для внешнего виджета)
- [x] Telegram-уведомления при новом сообщении от клиента
- [x] Настройки подключения (домен, API, Telegram)
- [x] Премиально-минималистичный тёмный UI (Satoshi, #A8A29E акцент)
- [x] Горизонтальная навигация в header
- [x] Кастомные селекторы (не нативный `<select>`)

---

## Что НЕ сделано (план на доработку)

### Приоритет 1 — Критично
- [ ] **Виджет чата для внешнего сайта** — JS-скрипт, который встраивается на внешний домен и использует публичные API `/api/chat/[listingId]`. API готово, нужен фронтенд-виджет
- [ ] **Интеграция с реальным внешним сервером** — сейчас publish отправляет POST на настроенный URL, нужно адаптировать формат данных под реальный API внешнего сайта
- [ ] **Rate limiting** на публичных эндпоинтах чата (защита от спама)

### Приоритет 2 — Важно
- [ ] Загрузка изображений (сейчас только URL)
- [ ] WebSocket вместо polling для чата (масштабируемость)
- [ ] Шифрование API-ключей и токенов в БД
- [ ] Валидация входных данных на API (zod или аналог)
- [ ] Редактирование существующих объявлений (PATCH endpoint есть, UI нет)
- [ ] Пагинация в списке объявлений

### Приоритет 3 — Улучшения
- [ ] Мульти-пользовательская система (роли: admin, operator)
- [ ] Email-уведомления
- [ ] Индикатор "печатает..." в чате
- [ ] Статус прочтения (read receipts) в чате
- [ ] Массовые операции (bulk publish/delete)
- [ ] Аналитика по объявлениям
- [ ] Экспорт данных
- [ ] Логирование действий (audit trail)
- [ ] Тесты (unit, integration, e2e)

---

## Архитектура взаимодействия

```
┌─────────────────────┐          ┌──────────────────────┐
│   SHSH Panel        │          │   Внешний сайт       │
│   (этот проект)     │          │   (другой домен)     │
│                     │          │                      │
│   Next.js + PG      │◄────────►│   Виджет чата        │
│                     │  CORS    │   (JS скрипт)        │
│   /api/chat/*       │  API     │                      │
│   /api/listings/*   │─────────►│   Создание           │
│                     │  POST    │   объявлений          │
└─────────────────────┘          └──────────────────────┘
         │
         │ Telegram Bot API
         ▼
┌─────────────────────┐
│   Telegram          │
│   (уведомления)     │
└─────────────────────┘
```

**Поток данных:**
1. Оператор создаёт объявление в панели -> сохраняется в PostgreSQL (статус: draft)
2. Оператор нажимает "Publish" -> POST-запрос на внешний сервер -> статус: published, сохраняется externalUrl
3. Клиент на внешнем сайте пишет в чат -> POST `/api/chat/[listingId]` -> сохраняется в БД -> Telegram-уведомление
4. Оператор открывает Live Chat -> видит непрочитанные -> отвечает -> клиент получает ответ через polling

---

## Заметки для разработчика

- **Prisma 7** требует адаптер (`@prisma/adapter-pg` + `PrismaPg`). Нельзя использовать `url` в schema — только в `prisma.config.ts`
- **Файл `src/components/Sidebar.tsx`** на самом деле экспортирует компонент `Header` (горизонтальная навигация). Имя файла осталось от первой версии — можно переименовать в `Header.tsx`
- **Публичные чат-эндпоинты** (`/api/chat/[listingId]`) не защищены middleware — это намеренно, они нужны для внешнего виджета
- **`suppressHydrationWarning`** в layout.tsx — обходит конфликт с расширением DuckDuckGo в браузере (добавляет data-ddg-* атрибуты к input)
- Seed-эндпоинт `/api/seed` создаёт пользователя с захардкоженным паролем — в продакшене стоит заменить на переменную окружения или убрать после первого использования
