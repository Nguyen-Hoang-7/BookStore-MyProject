// src/api/publisherApi.js
import axiosClient from "./axiosClient";

export const publisherApi = {
  getAll: () => axiosClient.get("/publishers"),
};