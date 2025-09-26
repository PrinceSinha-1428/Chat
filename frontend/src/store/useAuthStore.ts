import { axiosInstance } from "@lib/axios";
import type { FormDataType } from "@pages/SignUpPage";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export interface LoginData {
  email: string;
  password?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  createdAt: string;
}

interface AuthState {
  socket: any;
  authUser: User | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isUpdatingProfilePic: boolean;
  onlineUsers: string[]; // Add this line
  login: (user: LoginData) => Promise<void>;
  signup: (user: FormDataType) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth:  () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfilePic: false,
  socket: null,
   onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
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
      const res = await axiosInstance.post("/auth/signup", data);
      console.log(res.data)
      set({ authUser: res.data.user});
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
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser:  res.data.user });
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
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (data: any) => {
    try {
      set({ isUpdatingProfilePic: true });
      const res = await axiosInstance.put("/auth/update-profile",data);
      set({ authUser: res.data.success ? res.data.user : null });
      toast.success("Profile updated succesfully");
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },
  connectSocket: async () => {
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}))