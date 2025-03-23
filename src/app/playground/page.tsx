"use client"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <main className="flex-1 container mx-auto p-4 flex flex-col max-w-3xl">
      <div className="flex-1 p-25 overflow-y-auto mb-4 space-y-4 min-h-[calc(100vh-12rem)]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
                <span className="text-white text-4xl font-bold">!</span>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                Hey how can I help you?
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Start by typing a message in the input field below.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Write a message..."
          className="flex-1 border-0 focus-visible:ring-0"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </main>
  )
}
