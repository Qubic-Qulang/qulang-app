"use client"

import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

export default function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/playground"
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [scrolled, setScrolled] = useState(false)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            if (messagesEndRef.current) {
                const container = messagesEndRef.current.parentElement
                if (container) {
                    setScrolled(container.scrollTop > 0)
                }
            }
        }

        const container = messagesEndRef.current?.parentElement
        if (container) {
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div className="flex flex-col min-h-[60dvh] mt-24 bg-black text-white">
            {/* Header */}
            <div
                className={`sticky top-0 z-10 transition-colors duration-300 ${scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"}`}
            >
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="container mx-auto max-w-4xl">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <p className="text-2xl font-thin mb-4">Welcome to the conversation</p>
                            <p className="text-zinc-400 max-w-md">
                                Start chatting with the AI assistant. Ask questions, get information, or just have a conversation.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`mb-6 ${message.role === "user" ? "ml-auto" : ""}`}>
                                <div className="flex items-start gap-3">
                                    {message.role !== "user" && (
                                        <div className="w-8 h-8 bg-primary-50 flex items-center justify-center text-black">AI</div>
                                    )}
                                    <div className={`max-w-[80%] ${message.role === "user" ? "ml-auto bg-zinc-900" : "bg-zinc-800"} p-4`}>
                                        <div className="text-sm">
                                            {message.content.split("\n").map((text, i) => (
                                                <p key={i} className={i > 0 ? "mt-2" : ""}>
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-8 h-8 bg-zinc-700 flex items-center justify-center">You</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-800 bg-black">
                <div className="container mx-auto max-w-4xl px-4 py-4">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="flex-1 bg-zinc-900 p-4 text-white outline-none focus:ring-1 focus:ring-primary-50"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary-50 hover:bg-primary-70 transition-colors p-4 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
