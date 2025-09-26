import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@lib/axios";
import { useAuthStore } from "./useAuthStore";

type Tab = "chats" | "contacts";

interface ChatType {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

interface MessageType {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  isOptimistic?: boolean;
}

interface MessageData {
  text: string;
  image?: string;
}

interface ChatState {
  isSoundEnabled: boolean;
  allContacts: ChatType[];
  chats: ChatType[];
  messages: MessageType[];
  activeTab: Tab;
  selectedUser: ChatType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: Tab) => void;
  setSelectedUser: (user: ChatType | null) => void;

  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessageByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
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

  setActiveTab: (tab: Tab) => set({ activeTab: tab }),
  setSelectedUser: (user: ChatType | null) => set({ selectedUser: user }),

  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.filteredUsers });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.chatPartners });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessageByUserId: async (userId: string) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({
        messages: Array.isArray(res.data)
          ? res.data
          : res.data.messages ?? [],
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    if (!authUser?._id || !selectedUser?._id) {
      toast.error("User information is missing.");
      return;
    }

    const optimisticMessage: MessageType = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add optimistic message
    set((state) => ({ messages: [...state.messages, optimisticMessage] }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const newMessage: MessageType = res.data.newMessage ?? res.data;

      // Replace optimistic message with real one
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? newMessage : msg
        ),
      }));
    } catch (error: any) {
      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
}));
