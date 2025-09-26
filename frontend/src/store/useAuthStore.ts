import { create } from "zustand";

interface AuthUser {
  name: string;
  _id: string;
  age: number;
}

interface AuthState {
  authUser: AuthUser | null;
  isLoading: boolean;
  isLoggedin: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
 authUser: { name: "Prince", _id: "123", age: 22 },
  isLoading: false,
  isLoggedin: false,
  login: (user) => {
    
  },

  logout: () => {
    
  },
}))