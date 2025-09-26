import { axiosInstacnce } from "@lib/axios";
import type { FormDataType } from "@pages/SignUpPage";
import toast from "react-hot-toast";
import { create } from "zustand";

interface LoginData {
  
  name: string;
  email: string;
  
}



interface AuthState {
  authUser: LoginData | null;
  isLoading: boolean;
  isLoggedin: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  login: (user: LoginData) => void;
  signup: (user: FormDataType) => Promise<void>;
  logout: () => void;
  checkAuth:  () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,

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

  isLoading: false,
  isSigningUp: false,
  isLoggedin: false,
  login: (user) => {
    set({ authUser : user})
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

  logout: () => {
    
  },
}))