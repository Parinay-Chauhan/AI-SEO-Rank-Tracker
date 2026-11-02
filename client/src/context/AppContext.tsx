/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  analysisCount?: number;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  api: AxiosInstance;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  (import.meta.env.PROD
    ? "https://ai-seo-rank-tracker-n0xd.onrender.com"
    : "http://localhost:8000");

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  // Setup response interceptor for token refresh (3h access token refresh, 15d logout)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;
          try {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            const res = await axios.post(
              `${BACKEND_URL}/api/v1/users/refresh-token`,
              { refreshToken: storedRefreshToken },
              { withCredentials: true }
            );

            if (res.data.success) {
              const newAccessToken = res.data.data.accessToken;
              const newRefreshToken = res.data.data.refreshToken;

              localStorage.setItem("token", newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }
              setToken(newAccessToken);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch {
            // Refresh token expired after 15 days or invalid -> logout
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setToken(null);
            setUser(null);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/api/v1/users/current-user");
      if (data.success) {
        setUser(data.data);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        const accessToken = res.data.data.accessToken;
        const refreshToken = res.data.data.refreshToken;
        setToken(accessToken);
        setUser(res.data.data.user);
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/users/register`,
        { name, email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        const accessToken = res.data.data.accessToken;
        const refreshToken = res.data.data.refreshToken;
        setToken(accessToken);
        setUser(res.data.data.user);
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/users/logout");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  const value = { user, token, loading, api, login, register, logout };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
