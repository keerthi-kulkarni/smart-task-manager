import api from "./api.js";

export const getStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};
