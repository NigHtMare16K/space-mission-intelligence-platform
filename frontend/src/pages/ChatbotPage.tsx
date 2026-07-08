import { useCallback, useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MarkdownContent } from '@/components/shared/MarkdownContent'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/StateMessages'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { chatbotApi, getErrorMessage } from '@/services/api'
import type { ChatMessage } from '@/types/mission'
import { cn } from '@/lib/utils'

const SESSION_KEY = 'space-mission-chat-history'

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(messages: ChatMessage[]) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await chatbotApi.chat(trimmed)
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        sourceMissions: response.source_missions,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-4xl flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        icon={Bot}
        title="AI Chatbot"
        description="Ask questions about space missions. Conversation is preserved for this browser session."
      />

      {error && (
        <div className="mb-4">
          <ErrorState message={error} onRetry={() => setError(null)} />
        </div>
      )}

      <Card className="glass-card-hover flex-1 flex flex-col min-h-0 mb-4">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Bot className="h-12 w-12 text-purple-400 mb-4" />
              <p className="text-slate-400">Ask anything about space missions, agencies, or history.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  msg.role === 'user' ? 'bg-purple-500/30' : 'bg-cyan-500/20',
                )}
              >
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-purple-300" />
                ) : (
                  <Bot className="h-4 w-4 text-cyan-300" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-purple-500/20 border border-purple-500/30 text-slate-100'
                    : 'bg-[#0a0a1a]/80 border border-purple-500/20',
                )}
              >
                {msg.role === 'assistant' ? (
                  <MarkdownContent content={msg.content} className="text-sm" />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.sourceMissions && msg.sourceMissions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/20">
                    <p className="text-xs text-slate-500 mb-1">Source Missions</p>
                    <div className="flex flex-wrap gap-1">
                      {msg.sourceMissions.map((m) => (
                        <span
                          key={m}
                          className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                <Bot className="h-4 w-4 text-cyan-300" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#0a0a1a]/80 border border-purple-500/20">
                <LoadingState variant="inline" message="Thinking..." />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about space missions..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-purple-500/30 bg-[#0a0a1a]/80 px-4 py-3 text-sm text-slate-200 outline-none focus:border-purple-500/60 placeholder:text-slate-500"
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon" className="shrink-0 h-12 w-12">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
