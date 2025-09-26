import { create } from "zustand";
import type { LoginData } from "./useAuthStore";
import toast from "react-hot-toast";
import { axiosInstacnce } from "@lib/axios";

type Tab = "chats" | "contacts";

interface SoundState {
  isSoundEnabled: boolean;
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: Tab;
  selectedUser: null | LoginData,
  isUsersLoading: boolean,
  isMessagesLoading: boolean,
  toggleSound: () => void;
  setActiveTab: (tab: Tab) => void ;
  setSelectedUser: (selectedUser: LoginData) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
}

export const useChatStore = create<SoundState>((set,get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
     const next = !get().isSoundEnabled;
  localStorage.setItem("isSoundEnabled", String(next));
  set({ isSoundEnabled: next });
  },

  setActiveTab: (tab: Tab) => set({ activeTab: tab}),

  setSelectedUser: (selectedUser: LoginData) => set({ selectedUser: selectedUser}),

  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstacnce.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstacnce.get("/messages/chats");
      set({ chats: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false });
    }
  },
}))