import apiClient from "./apiClient";

export const getSettings = async () => {
  const response = await apiClient.get("/settings/");
  return response.data;
};

export const updateSetting = async (id, settingData) => {
  const response = await apiClient.put(
    `/settings/${id}`,
    settingData
  );

  return response.data;
};

export const createSetting = async (settingData) => {
  const response = await apiClient.post(
    "/settings/",
    settingData
  );

  return response.data;
};

export const deleteSetting = async (id) => {
  const response = await apiClient.delete(
    `/settings/${id}`
  );

  return response.data;
};