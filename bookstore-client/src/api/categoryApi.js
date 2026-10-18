// src/api/categoryApi.js
import axiosClient from "./axiosClient";

export const categoryApi = {
  getAll: (type) => axiosClient.get("/categories", { params: { type } }),
};