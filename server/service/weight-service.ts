import { default as Weight } from '../models/weight';
import { percentageChange } from '../utils/percentageChange';
import { getSimpleMovingAvg } from '../utils/simpleMovingAvg';
import { calculateIdealWeight } from '../utils/idealWeight';
import logger from '../utils/logger';
import mongoose from 'mongoose';

class WeightService {
  private static readonly PAGE_LIMIT = 10;

  private toUserObjectId(userId: string) {
    return new mongoose.Types.ObjectId(userId);
  }

  private async buildWeightFeedback(currentUserId: string) {
    const userObjectId = this.toUserObjectId(currentUserId);
    const entries = (await Weight.find({ user: userObjectId }, 'weight date')
      .sort({ date: 1 })
      .lean()) as { weight: number; date: Date }[];

    if (entries.length === 1) {
      return {
        type: 'success',
        message: 'Great start! Your first weight entry is saved.',
      };
    }

    const latest = entries[entries.length - 1];
    const previous = entries[entries.length - 2];
    const delta = latest.weight - previous.weight;
    const absDelta = Math.abs(delta);
    const startWeight = entries[0].weight;

    const previousWeights = entries.slice(0, -1).map((item) => item.weight);
    const minWeightBefore = Math.min(...previousWeights);

    // Priority #1: all-time low
    if (latest.weight < minWeightBefore) {
      return {
        type: 'success',
        message: `New all-time low! ${latest.weight.toFixed(
          2
        )} kg - this is your best result so far.`,
      };
    }

    // Priority #2: best total loss from starting point
    const totalLossNow = startWeight - latest.weight;
    const previousBestTotalLoss = entries
      .slice(1, -1)
      .reduce(
        (maxLoss, item) => Math.max(maxLoss, startWeight - item.weight),
        0
      );
    if (totalLossNow > 0 && totalLossNow > previousBestTotalLoss + 0.01) {
      return {
        type: 'success',
        message: `Record milestone! You reached your biggest total loss: ${totalLossNow.toFixed(
          2
        )} kg from your starting weight.`,
      };
    }

    // Priority #3: biggest one-day drop
    const deltas: number[] = [];
    for (let i = 1; i < entries.length; i++) {
      deltas.push(entries[i].weight - entries[i - 1].weight);
    }
    const previousDeltas = deltas.slice(0, -1);
    const previousDrops = previousDeltas.filter((item) => item < 0);
    const biggestDropBefore = previousDrops.length
      ? Math.max(...previousDrops.map((item) => Math.abs(item)))
      : 0;

    if (delta < 0 && absDelta > biggestDropBefore + 0.01 && biggestDropBefore > 0) {
      return {
        type: 'success',
        message: `Wow! New personal record: biggest one-day drop (${absDelta.toFixed(
          2
        )} kg).`,
      };
    }

    // Priority #4: best 7-day drop (if enough history)
    if (entries.length >= 8) {
      const current7DayDrop = entries[entries.length - 8].weight - latest.weight;
      let best7DayDropBefore = 0;
      for (let i = 7; i < entries.length - 1; i++) {
        const drop = entries[i - 7].weight - entries[i].weight;
        if (drop > best7DayDropBefore) {
          best7DayDropBefore = drop;
        }
      }

      if (current7DayDrop > 0 && current7DayDrop > best7DayDropBefore + 0.01) {
        return {
          type: 'success',
          message: `Impressive! New best 7-day drop: ${current7DayDrop.toFixed(
            2
          )} kg.`,
        };
      }
    }

    let downtrendStreak = 0;
    for (let i = entries.length - 1; i > 0; i--) {
      if (entries[i].weight < entries[i - 1].weight) {
        downtrendStreak += 1;
      } else {
        break;
      }
    }

    if (delta < 0) {
      if (downtrendStreak >= 3) {
        return {
          type: 'success',
          message: `Amazing consistency! ${downtrendStreak} days in a row with weight going down.`,
        };
      }

      return {
        type: 'success',
        message: `Nice progress! You are down ${absDelta.toFixed(
          2
        )} kg since yesterday. Keep it up.`,
      };
    }

    if (delta > 0) {
      if (delta >= 1) {
        return {
          type: 'warn',
          message: `Weight is up by ${delta.toFixed(
            2
          )} kg today. Review water, sodium, and meal timing - you can get back on track.`,
        };
      }

      return {
        type: 'info',
        message: `Slight increase today (+${delta.toFixed(
          2
        )} kg). Stay consistent - daily fluctuations are normal.`,
      };
    }

    return {
      type: 'info',
      message:
        'Stable day: no change from yesterday. Consistency like this is a strong foundation.',
    };
  }

  async create(currentUserId: string, currentWeight: number) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.info('Creating weight entry', {
        user: currentUserId,
        weight: currentWeight,
      });

      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);

      const existingEntryForDay = await Weight.findOne({
        user: userObjectId,
        dayKey,
      }).lean();

      if (existingEntryForDay) {
        const error: any = new Error(
          'You have already added your weight today. Please come back tomorrow.'
        );
        error.status = 400;
        error.code = 'WEIGHT_ENTRY_ALREADY_EXISTS_FOR_TODAY';
        throw error;
      }

      // Оптимизированный запрос для получения последнего веса
      const lastWeight = await Weight.findOne(
        { user: userObjectId },
        { weight: 1, _id: 0 }
      )
        .sort({ date: -1 })
        .lean();

      const recentWeight = lastWeight?.weight || currentWeight;

      const newWeightObj = {
        user: userObjectId,
        weight: currentWeight,
        change: percentageChange(recentWeight, currentWeight),
        date: now,
        dayKey,
      };

      const createdWeight = await Weight.create(newWeightObj);
      const feedback = await this.buildWeightFeedback(currentUserId);
      logger.info('Weight entry created successfully', {
        id: createdWeight._id,
      });
      return {
        entry: createdWeight,
        feedback,
      };
    } catch (error: any) {
      if (error?.code === 11000 && error?.keyPattern?.dayKey) {
        const duplicateError: any = new Error(
          'You have already added your weight today. Please come back tomorrow.'
        );
        duplicateError.status = 400;
        duplicateError.code = 'WEIGHT_ENTRY_ALREADY_EXISTS_FOR_TODAY';
        throw duplicateError;
      }

      logger.error('Failed to create weight entry', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async getAll(currentUserId: string, page = 1, limit = 10) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.debug('Fetching weights with pagination', {
        user: currentUserId,
        page,
        limit,
      });

      // Валидация параметров пагинации
      const validPage = Math.max(1, parseInt(page.toString()));
      const validLimit = Math.min(
        Math.max(1, parseInt(limit.toString())),
        WeightService.PAGE_LIMIT
      );
      const skip = (validPage - 1) * validLimit;

      // Получаем данные с пагинацией
      const weights = await Weight.find({ user: userObjectId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(validLimit)
        .lean();

      // Получаем общее количество записей
      const total = await Weight.countDocuments({ user: userObjectId });

      const result = {
        data: weights,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          pages: Math.ceil(total / validLimit),
          hasNext: validPage < Math.ceil(total / validLimit),
          hasPrev: validPage > 1,
        },
      };

      logger.debug('Weights fetched successfully', {
        count: weights.length,
        total,
        page: validPage,
      });

      return result;
    } catch (error: any) {
      logger.error('Failed to fetch weights', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async getSimpleMovingAvg(currentUserId: string) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.debug('Calculating simple moving average', { user: currentUserId });

      // Оптимизированный запрос с лимитом
      const weights = (await Weight.find({ user: userObjectId }, 'weight -_id')
        .sort({ date: -1 })
        .limit(1000) // Лимит на 1000 записей
        .lean()) as { weight: number }[];

      const dataWeightsArr = weights.map((el) => el.weight);
      const simpleMovingAvgArr = getSimpleMovingAvg(dataWeightsArr);

      logger.debug('Simple moving average calculated', {
        dataPoints: dataWeightsArr.length,
      });
      return simpleMovingAvgArr;
    } catch (error: any) {
      logger.error('Failed to calculate simple moving average', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async getTrend(
    currentUserId: string,
    period: '30d' | '90d' | '180d' | '1y' | 'all' = '90d'
  ) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.debug('Fetching weight trend', { user: currentUserId, period });

      const allWeights = (await Weight.find(
        { user: userObjectId },
        'weight date -_id'
      )
        .sort({ date: 1 })
        .lean()) as { weight: number; date: Date }[];

      if (!allWeights.length) {
        return { period, points: [] };
      }

      const periodDaysMap: Record<string, number | null> = {
        '30d': 30,
        '90d': 90,
        '180d': 180,
        '1y': 365,
        all: null,
      };

      const days = periodDaysMap[period] ?? 90;
      const now = new Date();
      const startDate = days
        ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        : null;

      const filteredWeights = startDate
        ? allWeights.filter((entry) => new Date(entry.date) >= startDate)
        : allWeights;

      const byDate = new Map<string, { weight: number; date: Date }>();
      filteredWeights.forEach((entry) => {
        const dateKey = new Date(entry.date).toISOString().slice(0, 10);
        // Keep the latest value for the day if duplicates exist historically.
        byDate.set(dateKey, entry);
      });
      const uniqueDailyWeights = Array.from(byDate.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const points = uniqueDailyWeights.map((entry, index) => {
        const from = Math.max(0, index - 6);
        const window = uniqueDailyWeights.slice(from, index + 1);
        const sma7 =
          window.reduce((sum, item) => sum + item.weight, 0) / window.length;

        return {
          date: entry.date,
          weight: Number(entry.weight.toFixed(2)),
          sma7: Number(sma7.toFixed(2)),
        };
      });

      return { period, points };
    } catch (error: any) {
      logger.error('Failed to fetch weight trend', {
        user: currentUserId,
        period,
        error: error.message,
      });
      throw error;
    }
  }

  async getMetrics(currentUserId: string, userProfile?: any) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.debug('Calculating weight metrics', { user: currentUserId });

      const weights = (await Weight.find({ user: userObjectId }, 'weight date')
        .sort({ date: 1 })
        .lean()) as { weight: number; date: Date }[];

      if (!weights.length) {
        return {
          totalEntries: 0,
          startWeight: null,
          latestWeight: null,
          minWeight: null,
          maxWeight: null,
          averageWeight: null,
          medianWeight: null,
          totalChangeKg: null,
          totalChangePercent: null,
          averageWeeklyChangeKg: null,
          biggestDropKg: null,
          biggestGainKg: null,
          trackingDays: 0,
          firstEntryDate: null,
          lastEntryDate: null,
          currentBmi: null,
          idealWeight: null,
          idealStatus: null,
          distanceToIdealKg: null,
        };
      }

      const first = weights[0];
      const last = weights[weights.length - 1];
      const weightValues = weights.map((item) => item.weight);
      const sortedWeights = [...weightValues].sort((a, b) => a - b);

      const sum = weightValues.reduce((acc, value) => acc + value, 0);
      const averageWeight = sum / weightValues.length;
      const medianWeight =
        sortedWeights.length % 2 === 0
          ? (sortedWeights[sortedWeights.length / 2 - 1] +
              sortedWeights[sortedWeights.length / 2]) /
            2
          : sortedWeights[Math.floor(sortedWeights.length / 2)];

      const minWeight = Math.min(...weightValues);
      const maxWeight = Math.max(...weightValues);
      const totalChangeKg = last.weight - first.weight;
      const totalChangePercent =
        first.weight !== 0 ? (totalChangeKg / first.weight) * 100 : 0;

      const msPerDay = 1000 * 60 * 60 * 24;
      const trackingDays = Math.max(
        1,
        Math.ceil(
          (new Date(last.date).getTime() - new Date(first.date).getTime()) /
            msPerDay
        ) + 1
      );

      const averageWeeklyChangeKg = (totalChangeKg / trackingDays) * 7;

      let biggestDropKg = 0;
      let biggestGainKg = 0;

      for (let i = 1; i < weightValues.length; i++) {
        const delta = weightValues[i] - weightValues[i - 1];
        if (delta < biggestDropKg) biggestDropKg = delta;
        if (delta > biggestGainKg) biggestGainKg = delta;
      }

      const idealWeight = await this.getIdealWeightInfo(currentUserId, userProfile);

      let currentBmi: number | null = null;
      let idealStatus: 'below' | 'within' | 'above' | null = null;
      let distanceToIdealKg: number | null = null;

      if (userProfile?.height) {
        const heightInMeters = userProfile.height / 100;
        if (heightInMeters > 0) {
          currentBmi = last.weight / (heightInMeters * heightInMeters);
        }
      }

      if (idealWeight) {
        if (last.weight < idealWeight.min) {
          idealStatus = 'below';
          distanceToIdealKg = idealWeight.min - last.weight;
        } else if (last.weight > idealWeight.max) {
          idealStatus = 'above';
          distanceToIdealKg = last.weight - idealWeight.max;
        } else {
          idealStatus = 'within';
          distanceToIdealKg = 0;
        }
      }

      return {
        totalEntries: weights.length,
        startWeight: first.weight,
        latestWeight: last.weight,
        minWeight,
        maxWeight,
        averageWeight,
        medianWeight,
        totalChangeKg,
        totalChangePercent,
        averageWeeklyChangeKg,
        biggestDropKg: biggestDropKg === 0 ? null : Math.abs(biggestDropKg),
        biggestGainKg: biggestGainKg === 0 ? null : biggestGainKg,
        trackingDays,
        firstEntryDate: first.date,
        lastEntryDate: last.date,
        currentBmi,
        idealWeight,
        idealStatus,
        distanceToIdealKg,
      };
    } catch (error: any) {
      logger.error('Failed to calculate weight metrics', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async removeLastEntry(currentUserId: string) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.info('Removing last weight entry', { user: currentUserId });

      // Оптимизированный запрос для удаления последней записи
      const lastWeightEntry = await Weight.findOne({ user: userObjectId })
        .sort({ date: -1 })
        .lean();

      if (!lastWeightEntry) {
        logger.warn('No weight entries found for removal', {
          user: currentUserId,
        });
        throw new Error('No weight entries found');
      }

      const deletedEntry = await Weight.findByIdAndDelete(lastWeightEntry._id);

      // Пересчитываем проценты изменения после удаления
      if (deletedEntry) {
        await this.recalculatePercentageChanges(currentUserId, deletedEntry.date);
      }

      logger.info('Last weight entry removed successfully', {
        removedId: lastWeightEntry._id,
      });
      // Возвращаем первую страницу с серверной пагинацией (до 10 записей).
      return this.getAll(currentUserId, 1, WeightService.PAGE_LIMIT);
    } catch (error: any) {
      logger.error('Failed to remove last weight entry', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteEntry(currentUserId: string, entryId: string) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.info('Deleting weight entry', { user: currentUserId, entryId });

      // Проверяем, что запись принадлежит пользователю
      const weightEntry = await Weight.findOne({
        _id: entryId,
        user: userObjectId,
      }).lean();

      if (!weightEntry) {
        logger.warn('Weight entry not found or access denied', {
          user: currentUserId,
          entryId,
        });
        throw new Error('Weight entry not found or access denied');
      }

      const deletedEntry = await Weight.findByIdAndDelete(entryId);

      // Пересчитываем проценты изменения после удаления
      if (deletedEntry) {
        await this.recalculatePercentageChanges(currentUserId, deletedEntry.date);
      }

      logger.info('Weight entry deleted successfully', { entryId });
      return { message: 'Weight entry deleted successfully' };
    } catch (error: any) {
      logger.error('Failed to delete weight entry', {
        user: currentUserId,
        entryId,
        error: error.message,
      });
      throw error;
    }
  }

  async updateEntry(currentUserId: string, entryId: string, newWeight: number) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.info('Updating weight entry', {
        user: currentUserId,
        entryId,
        newWeight,
      });

      const entry = await Weight.findOne({
        _id: entryId,
        user: userObjectId,
      });

      if (!entry) {
        const error: any = new Error('Weight entry not found');
        error.status = 404;
        throw error;
      }

      entry.weight = newWeight;
      await entry.save();

      await this.recalculateAllPercentageChanges(currentUserId);

      logger.info('Weight entry updated successfully', {
        user: currentUserId,
        entryId,
      });
      return entry;
    } catch (error: any) {
      logger.error('Failed to update weight entry', {
        user: currentUserId,
        entryId,
        error: error.message,
      });
      throw error;
    }
  }

  private async recalculateAllPercentageChanges(currentUserId: string) {
    const userObjectId = this.toUserObjectId(currentUserId);
    const weights = await Weight.find({ user: userObjectId }).sort({ date: 1 });

    if (!weights.length) return;

    for (let i = 0; i < weights.length; i++) {
      if (i === 0) {
        weights[i].change = 0;
      } else {
        const previousWeight = weights[i - 1].weight;
        const currentWeight = weights[i].weight;
        const deltaPercent = ((currentWeight - previousWeight) / previousWeight) * 100;
        weights[i].change = Math.round(deltaPercent * 100) / 100;
      }
    }

    await Promise.all(weights.map((entry) => entry.save()));
  }

  async recalculatePercentageChanges(
    currentUserId: string,
    deletedEntryDate?: Date
  ) {
    try {
      const userObjectId = this.toUserObjectId(currentUserId);
      logger.info('Recalculating percentage changes', {
        user: currentUserId,
        deletedEntryDate,
      });

      // Получаем все записи пользователя, отсортированные по дате
      const weights = await Weight.find({ user: userObjectId })
        .sort({ date: 1 }) // Сортируем по возрастанию даты
        .lean();

      if (weights.length <= 1) {
        logger.info('Not enough entries to recalculate percentages');
        return;
      }

      // Если указана дата удаленной записи, находим запись, которая идет после неё
      let entryToUpdateIndex = -1;

      if (deletedEntryDate) {
        // Находим индекс записи, которая идет после удаленной
        for (let i = 0; i < weights.length; i++) {
          if (weights[i].date > deletedEntryDate) {
            entryToUpdateIndex = i;
            break;
          }
        }
      } else {
        // Если дата не указана, обновляем только последнюю запись
        entryToUpdateIndex = weights.length - 1;
      }

      // Если не нашли запись для обновления, ничего не делаем
      if (entryToUpdateIndex === -1) {
        logger.info('No entry found to update after deletion');
        return;
      }

      // Если это первая запись, у неё нет предыдущей для сравнения
      if (entryToUpdateIndex === 0) {
        logger.info('First entry has no previous entry to compare with');
        return;
      }

      const previousWeight = weights[entryToUpdateIndex - 1].weight;
      const currentWeight = weights[entryToUpdateIndex].weight;

      // Рассчитываем процент изменения напрямую
      const absoluteChange = currentWeight - previousWeight;
      const percentageChange = (absoluteChange / previousWeight) * 100;
      const newPercentage = Math.round(percentageChange * 100) / 100;

      // Обновляем только одну запись
      const updateResult = await Weight.findByIdAndUpdate(
        weights[entryToUpdateIndex]._id,
        {
          change: newPercentage,
        },
        { new: true }
      );

      logger.info(
        `Updated single entry: ${previousWeight} -> ${currentWeight} = ${newPercentage}% (ID: ${weights[entryToUpdateIndex]._id})`
      );

      if (!updateResult) {
        logger.warn(
          `Failed to update entry ${weights[entryToUpdateIndex]._id}`
        );
      }
    } catch (error: any) {
      logger.error('Failed to recalculate percentage changes', {
        user: currentUserId,
        error: error.message,
      });
      throw error;
    }
  }

  async getIdealWeightInfo(currentUser: string, userProfile: any) {
    try {
      logger.debug('Getting ideal weight info', {
        user: currentUser,
        hasProfile: !!userProfile,
      });

      // Проверяем, есть ли все необходимые данные для расчета
      if (
        !userProfile?.height ||
        !userProfile?.gender ||
        !userProfile?.dateOfBirth
      ) {
        logger.debug('Insufficient profile data for ideal weight calculation');
        return null;
      }

      // Рассчитываем возраст
      const today = new Date();
      const birthDate = new Date(userProfile.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();

      // Проверяем, что возраст валидный
      if (age < 13 || age > 120) {
        logger.debug('Invalid age for ideal weight calculation', { age });
        return null;
      }

      // Рассчитываем идеальный вес
      const idealWeight = calculateIdealWeight(
        userProfile.height,
        age,
        userProfile.gender
      );

      if (!idealWeight) {
        logger.debug('Failed to calculate ideal weight');
        return null;
      }

      logger.debug('Ideal weight calculated successfully', idealWeight);
      return idealWeight;
    } catch (error: any) {
      logger.error('Failed to get ideal weight info', {
        user: currentUser,
        error: error.message,
      });
      return null;
    }
  }
}

export default new WeightService();
