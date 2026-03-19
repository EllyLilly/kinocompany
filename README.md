# КиноКомпания - Коллективный просмотр видео

Платформа для коллективного просмотра видео с друзьями в реальном времени.
Поддерживает Rutube, чат в реальном времени, комнаты для гостей и авторизованных пользователей.

## ✨  Функционал

- Создание комнат для просмотра (гости и авторизованные)
- Синхронизация видео (play/pause/seek) через WebSockets
- Поддержка пока Rutube (для VK только парсинг ссылки и плеер реализован)
- Чат в реальном времени
- Личные сообщения между пользователями (в перспективе)
- Авторизация через Laravel Breeze
- Аватарки пользователей
- Удаление комнат
- Очистка истории чата (только для владельца)

## 🛠 Технологии

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, TypeScript, Inertia.js
- **База данных:** MySQL
- **Real-time:** Pusher, Laravel Echo
- **Стили**: Tailwind CSS
- **Авторизация**: Laravel Breeze + Fortify
- **Аватарки**: Laravel Storage

## 🚀 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/EllyLilly/kinocompany.git
cd kinocompany

# Установить зависимости PHP
composer install

# Установить зависимости Node.js
npm install

# Настроить окружение
cp .env.example .env
php artisan key:generate

# Настроить базу данных (отредактировать .env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kinocompany
DB_USERNAME=root
DB_PASSWORD=

# Создание базы данных
mysql -u root -p
CREATE DATABASE kinocompany;
exit;

# Запустить миграции и сидеры
php artisan migrate --seed

# Настройка Pusher (для real-time)
# Зарегистрируйся на pusher.com, создай приложение и добавь в .env:

PUSHER_APP_ID=твой_app_id
PUSHER_APP_KEY=твой_key
PUSHER_APP_SECRET=твой_secret
PUSHER_APP_CLUSTER=eu
BROADCAST_CONNECTION=pusher
BROADCAST_DRIVER=pusher

# Создать символическую ссылку для аватарок
php artisan storage:link

# Сборка фронтенда
npm run build

# Запустить сервер разработки (в двух терминалах)
php artisan serve
npm run dev

# Тестовые пользователи
# После запуска php artisan migrate --seed будут созданы два тестовых пользователя:
Email	        Пароль	    Роль
test@test.com	12345678	Обычный пользователь
test2@test.com	87654321	Обычный пользователь

#Структура проекта

app/
├── Events/
│   ├── MessageSent.php          # Событие нового сообщения
│   ├── VideoControl.php          # Событие управления видео
│   └── ChatCleared.php           # Событие очистки чата
├── Http/
│   ├── Controllers/
│   │   ├── RoomController.php    # Управление комнатами
│   │   ├── RoomChatController.php # Чат в комнатах
│   │   ├── MessageController.php  # Личные сообщения
│   │   └── ChatClearController.php # Очистка чата
│   └── Requests/
│       └── ProfileUpdateRequest.php
├── Models/
│   ├── User.php
│   ├── Room.php
│   └── Message.php
resources/
├── js/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── RoomChat.tsx          # Компонент чата
│   └── pages/
│       ├── Rooms/
│       │   ├── Show.tsx          # Страница комнаты
│       │   └── MyRooms.tsx       # Список комнат
│       ├── Messages/
│       │   ├── Index.tsx         # Список диалогов
│       │   └── Show.tsx          # Переписка
│       └── Profile/
│           └── Edit.tsx
routes/
├── web.php                       # Маршруты
└── channels.php                   # Каналы для broadcast

# Синхронизация видео
1. Пользователь нажимает play/pause/seek
2. Запрос уходит в VideoControlController
3. Состояние сохраняется в БД
4. Событие VideoControl отправляется через Pusher
5. Все участники получают команду и выполняют её

# Чат в реальном времени
1. Отправка сообщения → RoomChatController@store
2. Сохранение в БД
3. Событие MessageSent → Pusher (канал chat.{roomId})
4. Фронт получает событие и добавляет сообщение
5. Автоматический скролл вниз

# Очистка чата
Доступна только владельцу комнаты. Удаляет все сообщения из БД и отправляет событие chat.cleared всем участникам.

# Личные сообщения (в перспективе)
Доступны по URL /messages
Отображаются непрочитанные сообщения (бейдж в шапке)
При открытии диалога сообщения помечаются прочитанными

#Возможные проблемы
Ошибка SSL с Pusher
Если возникает ошибка SSL, отключи защиту антивируса или добавь в .env:
PUSHER_SCHEME=http
PUSHER_PORT=80

# Сообщения не приходят в реальном времени
Проверь что в .env:
BROADCAST_CONNECTION=pusher
BROADCAST_DRIVER=pusher

# Ошибка 419 при отправке сообщений
Обнови страницу или проверь CSRF токен в meta-тегах.

```

## 📄 Лицензия

MIT
