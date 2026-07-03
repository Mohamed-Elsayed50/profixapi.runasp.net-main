"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2, Send } from "lucide-react";
import { useChats, useChatMessages, useNewChat, useSendMessage, useDeleteChat, type ChatMessage } from "@/src/hooks/use-chatbot";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

const normalizeText = (value?: string) => value?.trim().toLowerCase() ?? "";
const normalizeSender = (sender?: string) => sender?.trim().toLowerCase() ?? "";
const isUserLikeSender = (sender?: string) => {
  const normalized = normalizeSender(sender);
  return ["you", "user", "me"].includes(normalized);
};

const isAssistantLikeSender = (sender?: string) => {
  const normalized = normalizeSender(sender);
  return ["assistant", "ai", "bot", "system"].includes(normalized) || normalized.includes("assistant") || normalized.includes("ai");
};

const renderMessageContent = (text: string) => {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span
          key={`${part}-${index}`}
          className="rounded-md bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800"
        >
          {part.slice(2, -2)}
        </span>
      );
    }

    return (
      <span key={`${part}-${index}`} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
};

const getMessageKey = (message: ChatMessage) => {
  const senderKey = isUserLikeSender(message.sender) ? "user" : normalizeSender(message.sender) || "unknown";
  return `${senderKey}:${normalizeText(message.message)}`;
};

export default function ChatbotPage() {
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);

  const { data: chats, isLoading: chatsLoading } = useChats(search);
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedChat || undefined);
  const { mutate: createChat, isPending: creatingChat } = useNewChat();
  const { mutate: sendMessage, isPending: sendingMessage } = useSendMessage();
  const { mutate: deleteChat, isPending: deletingChat } = useDeleteChat();

  const currentChat = useMemo(
    () => chats?.find((chat) => chat.id === selectedChat) ?? null,
    [chats, selectedChat]
  );

  const filteredPendingMessages = useMemo(() => {
    const fetchedMessages = messages ?? [];

    return pendingMessages.filter((pendingMessage) => {
      if (!isUserLikeSender(pendingMessage.sender)) return true;

      return !fetchedMessages.some((existingMessage) => {
        const sameText = normalizeText(existingMessage.message) === normalizeText(pendingMessage.message);
        return sameText && isUserLikeSender(existingMessage.sender);
      });
    });
  }, [messages, pendingMessages]);

  const displayMessages = useMemo(() => {
    const baseMessages = [...(messages ?? [])];
    const mergedMessages = [...baseMessages];

    filteredPendingMessages.forEach((pendingMessage) => {
      const key = getMessageKey(pendingMessage);
      const alreadyExists =
        baseMessages.some((existingMessage) => getMessageKey(existingMessage) === key) ||
        mergedMessages.some((existingMessage) => getMessageKey(existingMessage) === key);

      if (!alreadyExists) {
        mergedMessages.push(pendingMessage);
      }
    });

    return mergedMessages.sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? 0).getTime();
      return aTime - bTime;
    });
  }, [messages, filteredPendingMessages]);

  const handleCreateChat = () => {
    setPendingMessages([]);

    createChat(undefined, {
      onSuccess: (data) => {
        setSelectedChat(data?.id ?? null);
      },
    });
  };

  const handleSendMessage = () => {
    if (!selectedChat || !message.trim() || sendingMessage) return;

    const text = message.trim();
    const optimisticUserMessage: ChatMessage = {
      id: `pending-user-${Date.now()}`,
      message: text,
      sender: "You",
      createdAt: new Date().toISOString(),
    };

    setPendingMessages((prev) => [...prev, optimisticUserMessage]);
    setMessage("");

    sendMessage(
      { ChatId: selectedChat, message: text },
      {
        onError: () => {
          setPendingMessages((prev) => prev.filter((msg) => msg.id !== optimisticUserMessage.id));
        },
      }
    );
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId, {
      onSuccess: () => {
        if (selectedChat === chatId) setSelectedChat(null);
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-black">Chatbot</h1>
            <p className="text-sm text-slate-500">Manage your chatbot conversations.</p>
          </div>
          <Button
            size="sm"
            className="bg-amber-500 text-white hover:bg-amber-600 border-transparent"
            onClick={handleCreateChat}
            disabled={creatingChat}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={chatsLoading}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            {chatsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              </div>
            ) : chats?.length ? (
              <div className="space-y-3">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${selectedChat === chat.id ? "border-amber-300 bg-amber-50" : "border-transparent hover:border-slate-200 hover:bg-white"}`}
                  >
                    <button
                      type="button"
                      className="text-left flex-1"
                      onClick={() => {
                        setPendingMessages([]);
                        setSelectedChat(chat.id);
                      }}
                    >
                      <p className="font-semibold text-black">{chat.title || `Chat ${chat.id.substring(0, 8)}`}</p>
                      <p className="text-sm text-slate-500 truncate">{chat.lastMessage || "No messages yet"}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteChat(chat.id)}
                      className="rounded-full p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      disabled={deletingChat}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-slate-500">No chats found.</div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-black">{currentChat?.title || "Select a chat"}</h2>
            <p className="text-sm text-slate-500">{currentChat?.lastMessage || "Conversation details appear here."}</p>
          </div>
          <Badge className="bg-slate-100 text-slate-600">{currentChat ? "Active" : "Idle"}</Badge>
        </div>

        <div className="min-h-[420px] rounded-3xl border border-slate-200 bg-slate-50 p-5">
          {selectedChat ? (
            messagesLoading ? (
              <div className="flex h-[320px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : displayMessages.length ? (
              <div className="space-y-4 pb-4">
                {displayMessages.map((msg) => {
                  const isAssistantMessage = isAssistantLikeSender(msg.sender);

                  return (
                    <div key={msg.id} className={`flex ${isAssistantMessage ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] rounded-3xl border p-4 shadow-sm ${
                          isAssistantMessage
                            ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                            : "border-slate-200 bg-slate-900 text-white"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                              isAssistantMessage ? "text-amber-700" : "text-slate-300"
                            }`}
                          >
                            {isAssistantMessage ? "AI Assistant" : msg.sender || "You"}
                          </span>
                          {isAssistantMessage && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              Smart
                            </span>
                          )}
                        </div>
                        <div className={`text-sm leading-7 ${isAssistantMessage ? "text-slate-800" : "text-white"}`}>
                          {renderMessageContent(msg.message)}
                        </div>
                        <p className={`mt-2 text-right text-[11px] ${isAssistantMessage ? "text-slate-400" : "text-slate-300"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {sendingMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">AI Assistant</span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Smart
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-sm text-slate-500">No messages in this chat yet.</div>
            )
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-slate-500">Select a chat to view messages.</div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedChat || sendingMessage}
          />
          <Button
            size="sm"
            className="bg-amber-500 text-white hover:bg-amber-600 border-transparent"
            onClick={handleSendMessage}
            disabled={!selectedChat || sendingMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
