// src/api/authorApi.js
import axiosClient from "./axiosClient";

export const authorApi = {
  getAll: (q) => axiosClient.get("/authors", { params: { q } }),
};