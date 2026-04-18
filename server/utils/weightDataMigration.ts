import mongoose from 'mongoose';
import UserModel from '../models/User';
import logger from './logger';

const WEIGHTS_COLLECTION = 'weights';

const toDayKey = (value: Date | string) => {
  return new Date(value).toISOString().slice(0, 10);
};

export async function migrateWeightDataStructure() {
  const collection = mongoose.connection.collection(WEIGHTS_COLLECTION);

  logger.info('Starting weight data migration to userId/dayKey structure');

  const users = await UserModel.find({}, '_id email').lean();
  const emailToId = new Map<string, mongoose.Types.ObjectId>();
  users.forEach((user) => {
    if (user.email) {
      emailToId.set(user.email.toLowerCase(), user._id);
    }
  });

  const legacyWeights = await collection
    .find({ user: { $type: 'string' } })
    .project({ _id: 1, user: 1, date: 1 })
    .toArray();

  if (legacyWeights.length) {
    const bulkOps = legacyWeights
      .map((doc) => {
        const legacyUser = String(doc.user || '').trim();

        let userId: mongoose.Types.ObjectId | undefined;
        if (/^[a-fA-F0-9]{24}$/.test(legacyUser)) {
          userId = new mongoose.Types.ObjectId(legacyUser);
        } else {
          userId = emailToId.get(legacyUser.toLowerCase());
        }

        if (!userId) {
          return null;
        }

        return {
          updateOne: {
            filter: { _id: doc._id },
            update: {
              $set: {
                user: userId,
                dayKey: toDayKey(doc.date as Date),
              },
            },
          },
        };
      })
      .filter(Boolean) as any[];

    if (bulkOps.length) {
      await collection.bulkWrite(bulkOps, { ordered: false });
      logger.info('Legacy weight user references migrated', {
        migrated: bulkOps.length,
      });
    }
  }

  await collection.updateMany(
    { dayKey: { $exists: false } },
    [
      {
        $set: {
          dayKey: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
              timezone: 'UTC',
            },
          },
        },
      },
    ]
  );

  // Remove duplicate records for same user/day to satisfy unique index.
  const duplicates = await collection
    .aggregate([
      {
        $match: {
          dayKey: { $exists: true },
        },
      },
      { $sort: { date: -1, _id: -1 } },
      {
        $group: {
          _id: { user: '$user', dayKey: '$dayKey' },
          ids: { $push: '$_id' },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  if (duplicates.length) {
    const idsToDelete = duplicates.flatMap((item: any) => item.ids.slice(1));
    if (idsToDelete.length) {
      await collection.deleteMany({ _id: { $in: idsToDelete } });
      logger.warn('Removed duplicate same-day weight entries', {
        deleted: idsToDelete.length,
      });
    }
  }

  try {
    await collection.dropIndex('user_1');
  } catch (error) {
    // index may not exist, safe to ignore
  }

  await collection.createIndex({ user: 1, date: -1 }, { name: 'user_1_date_-1' });
  await collection.createIndex(
    { user: 1, dayKey: 1 },
    {
      name: 'user_1_dayKey_1_unique',
      unique: true,
      partialFilterExpression: {
        dayKey: { $exists: true },
        user: { $type: 'objectId' },
      },
    }
  );

  logger.info('Weight data migration completed successfully');
}
