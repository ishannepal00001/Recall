import { useState, useRef, useEffect } from 'react'
import { MessageBox, Input } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react'

type ChatMsg = {
  id: string
  position: 'left' | 'right'
  type: 'text'
  text: string
  date: Date
  title?: string
}

const initialMessages: ChatMsg[] = [
  {
    id: 'welcome',
    position: 'left',
    type: 'text',
    text: 'Hi, I am Recall AI. Ask me about your wardrobe, plans, or let me help you organize.',
    date: new Date(),
    title: '',
  },
]

function mockAiReply(userText: string): string {
  const t = userText.toLowerCase()
  if (t.includes('wardrobe') || t.includes('clothes') || t.includes('wash')) {
    return 'Your wardrobe has items marked in_use for 3+ days will be moved to Needs Wash at midnight by the check_wear_due cron. Want me to list items needing wash?'
  }
  if (t.includes('plan')) return 'You have 5 active plans and 2 in review. Want to create a new plan?'
  if (t.includes('hello') || t.includes('hi')) return 'Hello! How can I help you with Recall today?'
  return `You said: "${userText}". I am a demo AI chat built with react-chat-elements. Connect me to your backend /api/v1/ai for real responses.`
}

export default function AiPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      position: 'right',
      type: 'text',
      text,
      date: new Date(),
      title: '',
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply: ChatMsg = {
        id: crypto.randomUUID(),
        position: 'left',
        type: 'text',
        text: mockAiReply(text),
        date: new Date(),
        title: '',
      }
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 700)
  }

  const prompts = [
    'What is in my wardrobe?',
    'What are the pending tasks for today?',
    'Show my plans',
    'What needs to be washed?',
  ]

  const sendPrompt = (text: string) => {
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      position: 'right',
      type: 'text',
      text,
      date: new Date(),
      title: '',
    }
    setMessages((m) => [...m, userMsg])
    setTyping(true)
    setTimeout(() => {
      const reply: ChatMsg = {
        id: crypto.randomUUID(),
        position: 'left',
        type: 'text',
        text: mockAiReply(text),
        date: new Date(),
        title: '',
      }
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 700)
  }

  const clear = () => setMessages(initialMessages)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center text-white shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              AI <span className="text-white/60 font-normal text-xl">Assistant</span>
            </h1>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <Sparkles size={12} className="text-secondary" /> Powered by react-chat-elements
            </p>
          </div>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* chat container - no background per design */}
      <div className="flex-1 flex flex-col rounded-md bg-transparent overflow-hidden min-h-0">
        {/* messages area - overrides for react-chat-elements to match dark theme */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-transparent rce-dark-override">
          {messages.map((m) => (
            <MessageBox
              key={m.id}
              position={m.position}
              type={m.type}
              text={m.text}
              title=""
              notch={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({} as any)}
            />
          ))}
          {typing && (
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-white/50">
              <span className="w-2 h-2 rounded-sm bg-secondary animate-pulse" /> Recall AI is typing...
            </div>
          )}
        </div>

        {/* prompt bubbles above input - reduced width, centered */}
        <div className="shrink-0 flex justify-center border-t border-white/10 bg-transparent px-3 pt-3 pb-1">
          <div className="flex flex-wrap justify-center gap-2 w-full max-w-[640px]">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => sendPrompt(p)}
                disabled={typing}
                className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-xs text-white/80 hover:text-white transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* input bar - using react-chat-elements Input + Button - reduced width */}
        <div className="shrink-0 flex justify-center p-3 bg-transparent">
          <div className="flex items-center gap-2 w-full max-w-[640px]">
          <div className="flex-1 rce-input-override">
            <Input
              placeholder="Ask Recall AI..."
              value={input}
              onChange={(e: unknown) => {
                if (typeof e === 'string') setInput(e)
                else if (e && typeof e === 'object' && 'target' in e) setInput((e as React.ChangeEvent<HTMLInputElement>).target.value)
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              multiline={false}
              maxHeight={60}
            />
          </div>
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className="inline-flex w-9 h-9 rounded-sm bg-primary hover:bg-[#6b4ee6] disabled:opacity-50 disabled:cursor-not-allowed text-white items-center justify-center shrink-0 transition-colors"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* overrides: transparent chat space + rounded-md bubbles, no title/arrow */}
      <style>{`
        .rce-dark-override .rce-mbox { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: none !important; border-radius: 0.375rem !important; }
        .rce-dark-override .rce-mbox.rce-mbox-right { background: #7c5cff !important; border-color: rgba(124,92,255,0.4) !important; border-radius: 0.375rem !important; }
        .rce-dark-override .rce-mbox-text { color: #fff !important; }
        .rce-dark-override .rce-mbox-title { display: none !important; }
        .rce-dark-override .rce-mbox-time { display: none !important; }
        .rce-dark-override .rce-mbox-right-notch, .rce-dark-override .rce-mbox-left-notch { display: none !important; }
        .rce-dark-override svg[viewBox] { display: none !important; }
        .rce-input-override .rce-input { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; border-radius: 0.375rem !important; color: #fff !important; }
        .rce-input-override .rce-input-textarea { color: #fff !important; }
        .rce-container-input { background: transparent !important; border: none !important; }
        .rce-button { border-radius: 0.375rem !important; }
        .rce-container-mbox { background: transparent !important; }
      `}</style>
    </div>
  )
}
