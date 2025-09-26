import { axiosInstacnce } from "@lib/axios";
import type { FormDataType } from "@pages/SignUpPage";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface LoginData {
  email: string;
  password: string;
}



interface AuthState {
  authUser: LoginData | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  login: (user: LoginData) => Promise<void>;
  signup: (user: FormDataType) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth:  () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
   isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstacnce.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Auth check error",error);
      set({ authUser: null})
    } finally {
      set({ isCheckingAuth: false });
    }
  },

 

  signup: async (data: FormDataType) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstacnce.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signed Up Succesfully")
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: LoginData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstacnce.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged In Succesfully")
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoggingOut: true })
      await axiosInstacnce.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingOut: false });
    }
  },
}))