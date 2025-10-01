# 147 Pacific - Premium Auto Accessories

Современное React приложение для продажи премиальных автомобильных аксессуаров, изготовленных в США.

## 🚀 Технологический стек

- **Vite** - Быстрый сборщик и dev-сервер
- **React 18** - Современная библиотека для UI
- **TypeScript** - Строгая типизация
- **CSS Modules** - Изолированные стили
- **React Router** - Клиентская маршрутизация
- **Swiper** - Слайдеры и карусели
- **Chart.js** - Графики и диаграммы
- **ESLint + Prettier** - Линтинг и форматирование
- **Husky** - Git hooks

## 📁 Архитектура проекта

```
src/
├── components/           # React компоненты
│   ├── common/          # Переиспользуемые UI компоненты
│   │   ├── Button/      # Кнопки
│   │   ├── Input/       # Поля ввода
│   │   ├── Modal/       # Модальные окна
│   │   ├── LazyImage/   # Ленивая загрузка изображений
│   │   ├── VirtualList/ # Виртуализированные списки
│   │   └── ...
│   ├── layout/          # Компоненты макета
│   │   ├── Header/      # Шапка сайта
│   │   └── Footer/      # Подвал сайта
│   └── features/        # Бизнес-компоненты
│       ├── HeroSection/ # Главная секция
│       ├── AboutSection/# Секция "О нас"
│       └── ...
├── hooks/               # Кастомные React хуки
│   ├── useCart.ts      # Управление корзиной
│   ├── useLocalStorage.ts # Работа с localStorage
│   ├── useDebounce.ts  # Дебаунсинг
│   └── ...
├── types/               # TypeScript типы
├── utils/               # Вспомогательные функции
├── assets/              # Статические ресурсы
│   ├── images/         # Изображения
│   ├── fonts/          # Шрифты
│   └── libs/           # Внешние библиотеки
├── styles/              # Стили
│   ├── global/         # Глобальные стили
│   └── modules/        # CSS Modules
└── pages/               # Страницы приложения
```

## 🛠 Установка и запуск

### Требования
- Node.js 18+ 
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 📋 Доступные скрипты

- `npm run dev` - Запуск dev-сервера
- `npm run build` - Сборка для продакшена
- `npm run preview` - Предварительный просмотр сборки
- `npm run lint` - Проверка кода линтером
- `npm run lint:fix` - Автоисправление ошибок линтера
- `npm run format` - Форматирование кода
- `npm run format:check` - Проверка форматирования
- `npm run type-check` - Проверка типов TypeScript

## 🎨 Особенности дизайна

### Цветовая палитра
- **Основной**: #F58220 (оранжевый)
- **Фон**: #0E0E0F (темный)
- **Текст**: #FFFFFF (белый)
- **Вторичный**: #42474B (серый)

### Типографика
- **Основной шрифт**: Myriad Pro
- **Адаптивные размеры**: Fluid typography
- **Поддержка**: Мобильные устройства

### Компоненты
- **Кнопки**: 5 вариантов (primary, secondary, accent, text, dark)
- **Поля ввода**: С валидацией и ошибками
- **Модальные окна**: С focus trap и accessibility
- **Слайдеры**: Swiper.js интеграция
- **Ленивая загрузка**: Оптимизация изображений

## ⚡ Оптимизации производительности

### Code Splitting
- Автоматическое разделение кода по роутам
- Lazy loading компонентов
- Динамические импорты

### Оптимизация изображений
- LazyImage компонент с Intersection Observer
- WebP формат для лучшего сжатия
- Placeholder'ы во время загрузки

### Виртуализация
- VirtualList для больших списков
- useVirtualization хук
- Оптимизированный рендеринг

### Кэширование
- Service Worker (PWA)
- LocalStorage для состояния
- Мемоизация компонентов

## ♿ Accessibility (A11y)

### ARIA атрибуты
- `aria-label` для иконок
- `aria-expanded` для меню
- `aria-modal` для модальных окон
- `role` атрибуты

### Навигация с клавиатуры
- Tab navigation
- Focus trap в модальных окнах
- Skip links для быстрого доступа
- Escape key для закрытия

### Screen readers
- Announcer компонент
- Семантическая разметка
- Alt тексты для изображений
- Скрытый контент для screen readers

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: ≥ 1024px

### Адаптивные компоненты
- Мобильное меню
- Адаптивные слайдеры
- Fluid typography
- Responsive images

## 🔧 Конфигурация

### Vite
- Path aliases (@/ для src/)
- CSS Modules
- PWA plugin
- Code splitting

### TypeScript
- Strict mode
- Path mapping
- ES2020 target
- React JSX

### ESLint
- TypeScript rules
- React hooks rules
- Accessibility rules
- Import order

## 🚀 Деплой

### Production сборка
```bash
npm run build
```

### Оптимизации
- Минификация CSS/JS
- Tree shaking
- Gzip compression
- CDN для статических ресурсов

### PWA
- Service Worker
- Web App Manifest
- Offline support
- Install prompt

## 📊 Мониторинг

### Performance
- Core Web Vitals
- Lighthouse audits
- Bundle analyzer
- Performance budgets

### Analytics
- Google Analytics 4
- Custom events
- User journey tracking
- Error monitoring

## 🤝 Разработка

### Git workflow
- Feature branches
- Pull requests
- Code review
- Automated testing

### Code quality
- Pre-commit hooks
- Lint-staged
- Type checking
- Format validation

## 📝 Лицензия

© 2024 147 Pacific. Все права защищены.

---

**Создано с ❤️ для премиальных автомобильных аксессуаров Made in USA**

