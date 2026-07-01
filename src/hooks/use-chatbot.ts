import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";

export type ChatSummary = {
  id: string;
  title?: string;
  lastMessage?: string;
  updatedAt?: string;
};

export type ChatMessage = {
  id: string;
  message: string;
  sender?: string;
  createdAt?: string;
};

type RawChatSummary = {
  id?: string;
  ChatId?: string;
  chatId?: string;
  title?: string;
  Title?: string;
  lastMessage?: string;
  LastMessage?: string;
  updatedAt?: string;
  UpdatedAt?: string;
};

type RawChatMessage = {
  id?: string;
  MessageId?: string;
  chatId?: string;
  ChatId?: string;
  role?: string;
  Role?: string;
  content?: string;
  Content?: string;
  message?: string;
  Message?: string;
  sender?: string;
  Sender?: string;
  createdAt?: string;
  CreatedAt?: string;
};

const normalizeChatSummary = (raw: RawChatSummary): ChatSummary => ({
  id: raw.ChatId || raw.chatId || raw.id || "",
  title:
    raw.title ||
    raw.Title ||
    `Chat ${String(raw.ChatId || raw.chatId || raw.id || "").substring(0, 8)}`,
  lastMessage: raw.lastMessage || raw.LastMessage || "",
  updatedAt: raw.updatedAt || raw.UpdatedAt,
});

const normalizeChatMessage = (raw: RawChatMessage): ChatMessage => ({
  id: raw.MessageId || raw.id || "",
  message:
    raw.content ||
    raw.Content ||
    raw.message ||
    raw.Message ||
    "",
  sender: raw.role || raw.Role || raw.sender || raw.Sender,
  createdAt: raw.createdAt || raw.CreatedAt,
});

const extractArray = <T>(source: unknown, keys: string[]): T[] => {
  if (!source || typeof source !== "object") return [];
  if (Array.isArray(source)) return source as T[];

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }

  const dataValue = record.data;
  if (Array.isArray(dataValue)) return dataValue as T[];

  if (typeof dataValue === "object" && dataValue !== null) {
    const nested = dataValue as Record<string, unknown>;
    if (Array.isArray(nested.data)) return nested.data as T[];
  }

  return [];
};

export const useChats = (search?: string) => {
  return useQuery<ChatSummary[], Error>({
    queryKey: ["chats", search],
    queryFn: async () => {
      const res = await apiClient.get("/api/Chatbot/GetChats", {
        params: {
          ChatSearch: search,
        },
      });

      return extractArray<RawChatSummary>(res.data, ["chats"]).map(normalizeChatSummary);
    },
  });
};

export const useChatMessages = (chatId?: string) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];

      const res = await apiClient.get("/api/Chatbot/ChatMessages", {
        params: {
          ChatId: chatId,
        },
      });

      return extractArray<RawChatMessage>(res.data, ["messages"]).map(normalizeChatMessage);
    },
    enabled: Boolean(chatId),
  });
};

export const useNewChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/api/Chatbot/NewChat");
      const rawChat = res.data?.data || res.data;
      return normalizeChatSummary(rawChat);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ChatId: string; message: string }) => {
      const res = await apiClient.post("/api/Chatbot/SendMessage", payload);
      const rawMessage = res.data?.data || res.data;
      return normalizeChatMessage(rawMessage);
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", payload.ChatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      const res = await apiClient.delete("/api/Chatbot", {
        params: {
          ChatId: chatId,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
