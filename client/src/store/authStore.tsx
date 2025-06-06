import { action, makeObservable, observable } from "mobx";
import type { IRootStore } from "./rootStore";

export default class AuthStore {
  BASE_URL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, "") + "/auth";
  isAuthenticated: boolean = false;
  token: string | null = null;
  userRole: string | null = null;
  isLoading: boolean = true;
  rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      isAuthenticated: observable,
      token: observable,
      userRole: observable,
      isLoading: observable,
      setIsAuthenticated: action,
      setToken: action,
      setUserRole: action,
      setIsLoading: action,
      login: action,
      logout: action,
    });
    this.rootStore = rootStore;

    // Set initial state directly (don't trigger MobX actions here!)
    this.token = localStorage.getItem("_token");
    this.userRole = localStorage.getItem("_user_role");
    this.isAuthenticated = !!this.token;
    this.isLoading = false; // Set to false immediately if sync, or after any async check
  }

  setIsLoading = (value: boolean) => {
    this.isLoading = value;
  };

  setIsAuthenticated = (value: boolean) => {
    this.isAuthenticated = value;
    if (!value) {
      this.setToken(null);
      this.setUserRole(null);
    }
  };

  setToken = (value: string | null) => {
    if (value) {
      localStorage.setItem("_token", value);
    } else {
      localStorage.removeItem("_token");
    }
    this.token = value;
  };

  setUserRole = (role: string | null) => {
    if (role) {
      localStorage.setItem("_user_role", role);
    } else {
      localStorage.removeItem("_user_role");
    }
    this.userRole = role;
  };

  login = async (postData: any) => {
    this.setIsLoading(true);
    try {
      const response = await fetch(this.BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        this.setIsLoading(false);
        return Promise.reject(data);
      } else {
        this.setIsAuthenticated(true);
        this.setToken(data.access_token);
        if (data.user && data.user.role) {
          this.setUserRole(data.user.role);
        }
        this.setIsLoading(false);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong", error);
      this.setIsLoading(false);
    }
  };

  logout = async () => {
    this.setIsLoading(true);
    try {
      const response = await fetch(this.BASE_URL + "/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        this.setIsLoading(false);
        return Promise.reject(data);
      } else {
        this.setIsAuthenticated(false);
        this.setUserRole(null);
        this.setIsLoading(false);
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something goes wrong", error);
      this.setIsLoading(false);
    }
  };
}
