import rateLimit from 'express-rate-limit';

const isDevelopment = process.env.NODE_ENV === 'development';

// В разработке можно полностью отключить rate limiting
const DISABLE_RATE_LIMIT_IN_DEV = process.env.DISABLE_RATE_LIMIT === 'true';

// Функция для создания rate limiter с возможностью отключения в разработке
const createRateLimiter = (config: any) => {
  if (isDevelopment && DISABLE_RATE_LIMIT_IN_DEV) {
    console.log('Rate limiting disabled in development mode');
    // Возвращаем middleware, который ничего не делает
    return (req: any, res: any, next: any) => next();
  }

  if (isDevelopment) {
    console.log(
      `Rate limiting enabled in development mode: max ${
        config.max
      } requests per ${config.windowMs / 1000 / 60} minutes`
    );
  }

  return rateLimit(config);
};

// Rate limiting для аутентификации (более мягкий в разработке)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isDevelopment ? 50 : 5, // 50 попыток в разработке, 5 в продакшене
  message: {
    error: 'Too many authentication attempts, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // не считаем успешные запросы
});

// Rate limiting для API (более мягкий в разработке)
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isDevelopment ? 1000 : 100, // 1000 запросов в разработке, 100 в продакшене
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting для создания записей веса
export const weightCreateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 минута
  max: isDevelopment ? 100 : 10, // 100 записей в разработке, 10 в продакшене
  message: {
    error: 'Too many weight entries created, please slow down',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting для удаления записей
export const weightDeleteLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 минута
  max: isDevelopment ? 50 : 5, // 50 удалений в разработке, 5 в продакшене
  message: {
    error: 'Too many deletions, please slow down',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
