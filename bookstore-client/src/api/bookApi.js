// src/api/bookApi.js
import axiosClient from "./axiosClient";

export const bookApi = {
  getAll: (params) => axiosClient.get("/products", { params }),
  getById: (id) => axiosClient.get(`/products/${id}`),
  create: (data) => axiosClient.post("/admin/products", data),
  update: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
  remove: (id) => axiosClient.delete(`/admin/products/${id}`),
};