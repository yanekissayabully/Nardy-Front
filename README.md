# Nardiki — Длинные Нарды

Премиум-платформа для игры в длинные нарды с AI-коучем, мультиплеером и глобальным рейтингом.

## Возможности

-  Полная логика длинных нард (без ударов, блокировки 2+)
-  AI Coach с анализом партий через OpenAI
-  Мультиплеер по ссылке (WebSocket)
-  Глобальный лидерборд с фильтрацией по городам
-  Кастомные скины для фишек (Premium)
-  Stripe интеграция для PRO-подписки
-  Статистика игрока и история ходов
-  Тёмная/светлая тема

##  Технологии

**Frontend:**
- Next.js 16 (App Router)
- Tailwind CSS + CSS Variables
- Zustand (state management)
- Framer Motion (анимации)
- Socket.IO Client

**Backend:**
- Express.js
- Socket.IO
- Supabase (аутентификация + БД)
- OpenAI API
- Stripe API

## 🛠️ Установка и запуск

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Заполните .env
npm run dev
```

Frontend: [https://nardipro.vercel.app](https://nardy-front.vercel.app/)

Backend API: nardy-back.railway.internal


Очень мало времени дали, и к сожалению много работы накинулось на меня. Все что успел.
