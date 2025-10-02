# Решение проблемы с localhost в Dashboard

## Проблема
Dashboard ссылался на `localhost:8000` вместо внешнего IP-адреса сервера.

## Причина
В файле `.env` (с точкой) в корне проекта была установлена переменная `DOMAIN=your-domain.com`. Docker Compose автоматически загружает файл `.env` из корня проекта, и он имеет приоритет над другими файлами конфигурации.

## Решение

### 1. Измените файл `.env` в корне проекта
```bash
# Замените строку:
DOMAIN=your-domain.com

# На:
DOMAIN=164.90.133.149
```

### 2. Перезапустите сервисы
```bash
docker-compose down
docker-compose up -d
```

## Проверка
После перезапуска проверьте конфигурацию:
```bash
docker-compose config | Select-String -Pattern "(API_URI|DASHBOARD_URL|STOREFRONT_URL|VITE_SALEOR_API_URL)"
```

Должны увидеть:
- `API_URI: http://164.90.133.149:8000/graphql/`
- `DASHBOARD_URL: http://164.90.133.149:9000/`
- `STOREFRONT_URL: http://164.90.133.149:3000/`
- `VITE_SALEOR_API_URL: http://164.90.133.149:8000/graphql/`

## Доступ к сервисам
- Dashboard: `http://164.90.133.149:9000`
- API: `http://164.90.133.149:8000/graphql/`
- Storefront: `http://164.90.133.149:3000`

## Важно
Docker Compose автоматически загружает файл `.env` из корня проекта. Этот файл имеет приоритет над другими файлами конфигурации, поэтому важно правильно настроить переменные именно в нем.
