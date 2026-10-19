// src/api/uploadApi.js
import axiosClient from "./axiosClient";

export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/admin/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return axiosClient.post("/admin/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};