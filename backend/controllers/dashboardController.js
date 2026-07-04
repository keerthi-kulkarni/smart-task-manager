import { getDashboardStats } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user._id);

  res.status(200).json(stats);
});
