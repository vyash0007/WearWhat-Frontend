"use client";

import React from "react";
import { FiSend, FiMic } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatService, type ChatMessage } from "@/lib/api/chat";
import ShirtLoader from "@/components/ui/ShirtLoader";

type Message = {
  from: 'bot' | 'user';
  text: string;
  images?: string[];
};

export default function StyleChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { from: 'bot', text: "Hi! I'm your AI style assistant. Ask me for outfit suggestions based on weather, occasions, or just tell me what you're in the mood for today!" }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Convert messages to chat history format for API
  const getChatHistory = (): ChatMessage[] => {
    return messages.map(msg => ({
      role: msg.from === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }));
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(msgs => [...msgs, { from: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const history = getChatHistory();
      const response = await chatService.sendMessage(userMessage, history);

      if (response.success && response.response) {
        setMessages(msgs => [...msgs, { from: 'bot', text: response.response }]);
      } else {
        setMessages(msgs => [...msgs, {
          from: 'bot',
          text: "Sorry, I couldn't process your request. Please try again."
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(msgs => [...msgs, {
        from: 'bot',
        text: "Sorry, something went wrong. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          StyleChat
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Your personal AI stylist. Ask anything about fashion.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.from === 'bot' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-lg rounded-2xl px-4 py-3 shadow-sm ${
                  msg.from === "user"
                    ? "rounded-br-none bg-gray-900 text-white dark:bg-blue-600"
                    : "rounded-bl-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.images && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {msg.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img
                          src={img}
                          alt="outfit suggestion"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
               {msg.from === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
                <ShirtLoader size="sm" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <Input
            type="text"
            placeholder="What should I wear today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2 h-11 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500"
          />
           <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <ShirtLoader size="sm" />
            ) : (
              <FiSend className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
