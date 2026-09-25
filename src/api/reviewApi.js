import apiClient from "./apiClient";

export const getReviews = async () => {
  const response = await apiClient.get("/reviews/");
  return response.data;
};

export const getReview = async (id) => {
  const response = await apiClient.get(`/reviews/${id}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await apiClient.post("/reviews/", reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await apiClient.put(
    `/reviews/${id}`,
    reviewData
  );
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};