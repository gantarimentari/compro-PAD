import axios from "axios";

const waApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  withCredentials: false, // PENTING
  xsrfCookieName: "NO_XSRF",
  xsrfHeaderName: "NO_XSRF",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default waApi;
