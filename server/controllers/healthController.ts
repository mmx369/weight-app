import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      database: {
        status:
          mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    if (mongoose.connection.readyState !== 1) {
      health.status = 'DEGRADED';
      health.database.status = 'disconnected';
    }

    const statusCode = health.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error: any) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

export const readinessCheck = async (req: Request, res: Response) => {
  try {
    const checks = {
      database: mongoose.connection.readyState === 1,
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024,
    };

    const isReady = Object.values(checks).every((check) => check === true);

    if (isReady) {
      res.status(200).json({
        status: 'READY',
        checks,
      });
    } else {
      res.status(503).json({
        status: 'NOT_READY',
        checks,
      });
    }
  } catch (error: any) {
    res.status(503).json({
      status: 'ERROR',
      error: error.message,
    });
  }
};

export const livenessCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};


