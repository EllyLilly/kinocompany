# КиноКомпания 🎬

Платформа для коллективного просмотра видео с друзьями в реальном времени.

## ✨ Возможности

- 🔐 **Авторизация** — регистрация и вход через Laravel Breeze + Fortify
- 🎥 **Создание комнат** — создай комнату, поделись ссылкой с друзьями
- 👥 **Синхронный просмотр** — пауза/плей синхронизируется у всех
- 💬 **Чат в комнате** — общайся с друзьями во время просмотра
- 📱 **Личный кабинет** — аватарка, редактирование профиля
- 🔔 **Личные сообщения** — общайся с другими пользователями
- 🎬 **Мои комнаты** — история созданных комнат (доступна без авторизации)

## 🛠 Технологии

- **Backend**: Laravel 12, MySQL
- **Frontend**: React 19, TypeScript, Inertia.js
- **Стили**: TailwindCSS, glassmorphism
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
# DB_DATABASE=kinocompany_db
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Запустить миграции
php artisan migrate

# Создать символическую ссылку для аватарок
php artisan storage:link

# Запустить сервер разработки (в двух терминалах)
php artisan serve
npm run dev
```

## 📄 Лицензия

MIT
