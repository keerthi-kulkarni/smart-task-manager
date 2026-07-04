import ActivityLog from "../models/ActivityLog.js";

export const createActivityLog = async ({ userId, action, entity, entityId, message, metadata = {} }) => {
  await ActivityLog.create({
    userId,
    action,
    entity,
    entityId,
    message,
    metadata
  });
};

export const getRecentActivity = (userId, limit = 8) =>
  ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
