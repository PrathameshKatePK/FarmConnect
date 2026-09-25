import apiClient from "./apiClient";


// GET ALL USERS
export const getUsers = async () => {
  const response = await apiClient.get("/users/");
  return response.data;
};


// GET SINGLE USER
export const getUser = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};


// CREATE USER
export const createUser = async (userData) => {
  const response = await apiClient.post("/users/", userData);
  return response.data;
};


// UPDATE USER
export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};


// DELETE USER
export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};