import apiClient from "./apiClient";
import axios from "axios";

export const getMedia = async () => {
  const response = await apiClient.get("/media/");
  return response.data;
};

export const getMediaById = async (id) => {
  const response = await apiClient.get(`/media/${id}`);
  return response.data;
};

export const uploadMedia = async (file, altText = "") => {
  const formData = new FormData();

  formData.append("file", file);

  if (altText) {
    formData.append("alt_text", altText);
  }

  const response = await axios.post(
    "http://localhost/FarmConnect/api/media/upload",
    formData
  );

  return response.data;
};

export const updateMedia = async (id, mediaData) => {
  const response = await apiClient.put(`/media/${id}`, mediaData);
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await apiClient.delete(`/media/${id}`);
  return response.data;
};