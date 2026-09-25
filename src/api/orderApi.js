import apiClient from "./apiClient";

export const getOrders = async () => {
  const response = await apiClient.get("/orders/");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, order_status) => {
  const response = await apiClient.put(`/orders/${id}`, {
    order_status,
  });

  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};