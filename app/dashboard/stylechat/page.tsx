"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, User, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { chatService } from "@/lib/api/chat"
import type { ChatMessage } from "@/lib/api/chat"

const initialMessages: ChatMessage[] = [
    {
        role: "assistant",
        content: "Hi! I'm your AI style assistant. Ask me for outfit suggestions based on weather, occasions, or just tell me what you're in the mood for today!",
    },
]

const quickSuggestions = [
    "What should I wear for a job interview?",
    "Casual outfit for a weekend brunch",
    "Outfit ideas for a rainy day",
    "Date night look suggestions",
]

export default function StyleChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (message?: string) => {
        const content = message || input
        if (!content.trim() || isTyping) return

        const userMessage: ChatMessage = {
            role: "user",
            content: content.trim(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        try {
            // Send message to API with conversation history
            const response = await chatService.sendMessage(content.trim(), messages)

            const aiMessage: ChatMessage = {
                role: "assistant",
                content: response.response,
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (err: any) {
            console.error("Error sending message:", err)

            const errorMessage: ChatMessage = {
                role: "assistant",
                content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div
            className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-3rem)] flex flex-col overflow-hidden relative"
            style={{
                backgroundImage: 'url(/image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Semi-transparent overlay for readability */}
            <div className="absolute inset-0 bg-background/30"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="shrink-0 p-4 md:p-6 lg:p-8 pb-0">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
                                Style Chat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">Your personal AI stylist</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" && "flex-row-reverse"
                                )}
                            >
                                <Avatar className={cn(
                                    "h-9 w-9 shrink-0",
                                    message.role === "assistant" && "bg-primary/10"
                                )}>
                                    <AvatarFallback className={cn(
                                        message.role === "assistant"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {message.role === "assistant" ? (
                                            <span className="text-[10px] font-bold">AI</span>
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-3",
                                        message.role === "assistant"
                                            ? "bg-card border border-border"
                                            : "bg-primary text-primary-foreground"
                                    )}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3">
                                <Avatar className="h-9 w-9 shrink-0 bg-primary/10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <span className="text-[10px] font-bold">AI</span>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                    <div className="shrink-0 px-4 md:px-6 lg:px-8 pb-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-wrap gap-2">
                                {quickSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSend(suggestion)}
                                        disabled={isTyping}
                                        className="text-sm px-4 py-2 rounded-full bg-card border border-border hover:bg-muted transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="shrink-0 p-4 md:p-6 lg:p-8 pt-0">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 p-2 bg-card rounded-2xl border border-border">
                            <Input
                                placeholder="What should I wear today?"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isTyping}
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" disabled={isTyping}>
                                <Mic className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                className="shrink-0"
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                            >
                                {isTyping ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
