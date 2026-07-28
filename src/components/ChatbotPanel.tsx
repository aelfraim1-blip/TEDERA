import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage, HealthDataContext } from '../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  healthContext: HealthDataContext;
  initialPrompt?: string;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  isOpen,
  onClose,
  onOpen,
  healthContext,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your **TPHIS Health Assistant** powered by **Google Gemini AI**.

I have real-time access to Koronadal City's disease analytics, including:
- **${healthContext.totalHistoricalCases}** total historical cases (${healthContext.overallPositivityRate}% positivity rate)
- **${healthContext.projectedTotalCases}** projected cases for the ${healthContext.projectionMonths}-month horizon
- Highest risk zone: **${healthContext.topRiskBarangay.name}** (${healthContext.topRiskBarangay.riskScore}/100 Risk Index)

How can I assist your health team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Handle external initial prompt trigger (e.g. from buttons on cards)
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history format
      const history = messages
        .filter((m) => !m.isError)
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          healthData: healthContext,
          conversationHistory: history,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reach TPHIS Gemini assistant service.');
      }

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error communicating with Gemini Assistant:** ${
          err.message || 'Server error'
        }. Please check that the GEMINI_API_KEY is configured or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. I'm ready to answer any new queries about Koronadal City's health analytics and projections!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    `📊 Analyze top risk area (${healthContext.topRiskBarangay.name})`,
    `🔮 Explain the ${healthContext.projectionMonths}-month case projection`,
    `🚰 Recommended water sanitation checklist`,
    `📍 How is the 0–100 Risk Index computed?`,
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-3 group border border-white/20"
          aria-label="Open Gemini Health Assistant"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>
          <span className="text-sm font-bold pr-1 hidden sm:inline">TPHIS AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 w-auto h-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-[#0a0a0f] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl backdrop-blur-md">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <span>TPHIS Gemini Health AI</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-indigo-200 opacity-90">
                  Real-time analytics for Koronadal City
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize size' : 'Expand window'}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                title="Close chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none border border-white/10'
                      : msg.isError
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 rounded-tl-none'
                      : 'bg-white/[0.04] text-slate-100 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-white/10 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-white/[0.04] text-slate-300 border border-white/10 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-slate-400 ml-1">Analyzing TPHIS data with Gemini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#0a0a0f] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Quick:
            </span>
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 hover:text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0a0a0f] border-t border-white/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Koronadal City risks, water sanitation, projections..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.05] text-white placeholder-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:bg-white/5 text-white disabled:text-slate-600 rounded-xl transition-colors cursor-pointer shadow-md disabled:cursor-not-allowed shrink-0 border border-white/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
