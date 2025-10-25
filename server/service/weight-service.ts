import { default as Weight } from '../models/weight';
import { percentageChange } from '../utils/percentageChange';
import { getSimpleMovingAvg } from '../utils/simpleMovingAvg';
import { calculateIdealWeight } from '../utils/idealWeight';
import logger from '../utils/logger';

class WeightService {
  async create(currentUser: string, currentWeight: number) {
    try {
      logger.info('Creating weight entry', {
        user: currentUser,
        weight: currentWeight,
      });

      // Оптимизированный запрос для получения последнего веса
      const lastWeight = await Weight.findOne(
        { user: currentUser },
        { weight: 1, _id: 0 }
      )
        .sort({ date: -1 })
        .lean();

      const recentWeight = lastWeight?.weight || currentWeight;

      const newWeightObj = {
        user: currentUser,
        weight: currentWeight,
        change: percentageChange(recentWeight, currentWeight),
        date: new Date(),
      };

      const createdWeight = await Weight.create(newWeightObj);
      logger.info('Weight entry created successfully', {
        id: createdWeight._id,
      });
      return createdWeight;
    } catch (error: any) {
      logger.error('Failed to create weight entry', {
        user: currentUser,
        error: error.message,
      });
      throw error;
    }
  }

  async getAll(currentUser: string, page = 1, limit = 10) {
    try {
      logger.debug('Fetching weights with pagination', {
        user: currentUser,
        page,
        limit,
      });

      // Валидация параметров пагинации
      const validPage = Math.max(1, parseInt(page.toString()));
      const validLimit = Math.min(Math.max(1, parseInt(limit.toString())), 100); // максимум 100 записей
      const skip = (validPage - 1) * validLimit;

      // Получаем данные с пагинацией
      const weights = await Weight.find({ user: currentUser })
        .sort({ date: -1 })
        .skip(skip)
        .limit(validLimit)
        .lean();

      // Получаем общее количество записей
      const total = await Weight.countDocuments({ user: currentUser });

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
        user: currentUser,
        error: error.message,
      });
      throw error;
    }
  }

  async getSimpleMovingAvg(currentUser: string) {
    try {
      logger.debug('Calculating simple moving average', { user: currentUser });

      // Оптимизированный запрос с лимитом
      const weights = (await Weight.find({ user: currentUser }, 'weight -_id')
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
        user: currentUser,
        error: error.message,
      });
      throw error;
    }
  }

  async removeLastEntry(currentUser: string) {
    try {
      logger.info('Removing last weight entry', { user: currentUser });

      // Оптимизированный запрос для удаления последней записи
      const lastWeightEntry = await Weight.findOne({ user: currentUser })
        .sort({ date: -1 })
        .lean();

      if (!lastWeightEntry) {
        logger.warn('No weight entries found for removal', {
          user: currentUser,
        });
        throw new Error('No weight entries found');
      }

      const deletedEntry = await Weight.findByIdAndDelete(lastWeightEntry._id);

      // Пересчитываем проценты изменения после удаления
      if (deletedEntry) {
        await this.recalculatePercentageChanges(currentUser, deletedEntry.date);
      }

      // Возвращаем обновленный список
      const weights = await Weight.find({ user: currentUser })
        .sort({ date: -1 })
        .limit(1000)
        .lean();

      logger.info('Last weight entry removed successfully', {
        removedId: lastWeightEntry._id,
      });
      return weights;
    } catch (error: any) {
      logger.error('Failed to remove last weight entry', {
        user: currentUser,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteEntry(currentUser: string, entryId: string) {
    try {
      logger.info('Deleting weight entry', { user: currentUser, entryId });

      // Проверяем, что запись принадлежит пользователю
      const weightEntry = await Weight.findOne({
        _id: entryId,
        user: currentUser,
      }).lean();

      if (!weightEntry) {
        logger.warn('Weight entry not found or access denied', {
          user: currentUser,
          entryId,
        });
        throw new Error('Weight entry not found or access denied');
      }

      const deletedEntry = await Weight.findByIdAndDelete(entryId);

      // Пересчитываем проценты изменения после удаления
      if (deletedEntry) {
        await this.recalculatePercentageChanges(currentUser, deletedEntry.date);
      }

      logger.info('Weight entry deleted successfully', { entryId });
      return { message: 'Weight entry deleted successfully' };
    } catch (error: any) {
      logger.error('Failed to delete weight entry', {
        user: currentUser,
        entryId,
        error: error.message,
      });
      throw error;
    }
  }

  async recalculatePercentageChanges(
    currentUser: string,
    deletedEntryDate?: Date
  ) {
    try {
      logger.info('Recalculating percentage changes', {
        user: currentUser,
        deletedEntryDate,
      });

      // Получаем все записи пользователя, отсортированные по дате
      const weights = await Weight.find({ user: currentUser })
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
        user: currentUser,
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
