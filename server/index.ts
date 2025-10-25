import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'node:path';
import errorMiddleware from './middleware/errorMiddleware';
import apiRouter from './routers';
import logger from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_URI_DEV;

logger.info('Starting server', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
  mongoUri: MONGO_URI ? 'configured' : 'not configured',
});

// Security middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", 'data:', 'https:'],
//       },
//     },
//     crossOriginEmbedderPolicy: false, // Отключаем для совместимости с некоторыми браузерами
//   })
// );

app.use(express.json({ limit: '10mb' })); // Ограничиваем размер JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Настройка CORS для продакшена
const corsOptions = {
  credentials: true,
  origin: (origin: string | undefined, callback: Function) => {
    // Разрешенные домены
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.PROD_CLIENT_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter(Boolean);

    // В разработке разрешаем все origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // В продакшене проверяем origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 часа
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware для логирования запросов
// app.use((req: Request, res: Response, next) => {
//   const start = Date.now();

//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     const logData = {
//       method: req.method,
//       url: req.url,
//       status: res.statusCode,
//       duration: `${duration}ms`,
//       userAgent: req.get('User-Agent'),
//       ip: req.ip || req.connection.remoteAddress,
//     };

//     if (res.statusCode >= 400) {
//       logger.warn('HTTP Request', logData);
//     } else {
//       logger.info('HTTP Request', logData);
//     }
//   });

//   next();
// });

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/index.html'));
});

app.use('/api', apiRouter);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.use(errorMiddleware);

async function startApp() {
  try {
    // Оптимизированное подключение к MongoDB
    await mongoose.connect(MONGO_URI as string, {
      maxPoolSize: 10, // максимум 10 соединений в пуле
      serverSelectionTimeoutMS: 5000, // таймаут выбора сервера
      socketTimeoutMS: 45000, // таймаут сокета
      retryWrites: true, // повторные записи
      retryReads: true, // повторные чтения
    });

    // Обработчики событий MongoDB
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Gracefully shutting down...');
      await mongoose.connection.close();
      process.exit(0);
    });

    app.listen(PORT, () => {
      logger.info('Server started successfully', {
        port: PORT,
        healthCheck: `http://localhost:${PORT}/api/health`,
        environment: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error: any) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startApp();
