// Centralized configuration for API endpoints
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.PROD
    ? "https://certifyme-70gy.onrender.com"
    : "http://localhost:8000");
