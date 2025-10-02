# Инструкция по развертыванию на удаленном сервере

## Проблема
Dashboard и другие сервисы ссылаются на `localhost:8000` вместо внешнего IP-адреса сервера.

## Решение

### 1. Создайте файл `.env` в корне проекта

```bash
# Замените YOUR_SERVER_IP на IP-адрес вашего сервера
DOMAIN=YOUR_SERVER_IP

# Или если у вас есть доменное имя:
# DOMAIN=your-domain.com

# Для локальной разработки оставьте:
# DOMAIN=localhost
```

### 2. Примеры настройки

**Для IP-адреса:**
```bash
DOMAIN=192.168.1.100
```

**Для доменного имени:**
```bash
DOMAIN=yourstore.com
```

### 3. Перезапустите сервисы

```bash
docker-compose down
docker-compose up -d
```

### 4. Проверьте доступность

- Dashboard: `http://YOUR_SERVER_IP:9000`
- API: `http://YOUR_SERVER_IP:8000/graphql/`
- Storefront: `http://YOUR_SERVER_IP:3000`

## Что изменилось

В `docker-compose.yml` обновлены следующие переменные:

- `API_URI` в dashboard: `http://${DOMAIN:-localhost}:8000/graphql/`
- `DASHBOARD_URL` в api: `http://${DOMAIN:-localhost}:9000/`
- `STOREFRONT_URL` в api: `http://${DOMAIN:-localhost}:3000/`
- `VITE_SALEOR_API_URL` в storefront: `http://${DOMAIN:-localhost}:8000/graphql/`

## Безопасность

Убедитесь, что:
1. Файрвол настроен правильно
2. Используется HTTPS в продакшене
3. Пароли и токены хранятся в безопасном месте
