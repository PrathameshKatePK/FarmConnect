import apiClient from "./apiClient";

export const getLocations = async () => {
  const response = await apiClient.get("/locations/");
  return response.data;
};

export const getLocation = async (id) => {
  const response = await apiClient.get(`/locations/${id}`);
  return response.data;
};