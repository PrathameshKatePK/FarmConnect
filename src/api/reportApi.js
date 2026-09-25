import apiClient from "./apiClient";

export const getReports = async () => {
  const response = await apiClient.get("/reports/");
  return response.data;
};