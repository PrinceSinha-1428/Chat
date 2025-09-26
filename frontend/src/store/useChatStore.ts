import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstacnce } from "@lib/axios";

type Tab = "chats" | "contacts";

interface ChatType {
  _id: string,
  name: string,
  email: string,
  profilePic: string
}


interface SoundState {
  isSoundEnabled: boolean;
  allContacts: ChatType[];
  chats: ChatType[];
  messages: any[];
  activeTab: Tab;
  selectedUser: null | ChatType,
  isUsersLoading: boolean,
  isMessagesLoading: boolean,
  toggleSound: () => void;
  setActiveTab: (tab: Tab) => void ;
  setSelectedUser: (selectedUser: ChatType) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
}

export const useChatStore = create<SoundState>((set,get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: true,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(next));
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab: Tab) => set({ activeTab: tab}),

  setSelectedUser: (selectedUser: ChatType) => set({ selectedUser: selectedUser}),

  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstacnce.get("/messages/contacts");
      set({ allContacts: res.data.filteredUsers });
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
      set({ chats: res.data.chatPartners });
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false });
    }
  },
}))