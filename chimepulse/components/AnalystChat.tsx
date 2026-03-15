import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles } from 'lucide-react';
import { sendMessageToAnalyst } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AnalystChatProps {
    isOpen: boolean;
    onClose: () => void;
    initialContext?: string; // Optional context from dashboard clicks
}

export const AnalystChat: React.FC<AnalystChatProps> = ({ isOpen, onClose, initialContext }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'I am your Strategic Narrative Analyst. Click any metric on the dashboard or ask me directly to analyze trends.', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // If context is provided (e.g., user clicked a chart), automatically send a prompt
    useEffect(() => {
        if (isOpen && initialContext) {
            handleSend(`Analyze this specific data point: ${initialContext}`);
        }
    }, [initialContext, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const responseText = await sendMessageToAnalyst(text);
            const newModelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
            setMessages(prev => [...prev, newModelMsg]);
        } catch (e) {
            // Error handled in service, but we can add UI feedback here
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl z-50 border border-chime-green/30 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-chime-deep/80 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-chime-green/20 flex items-center justify-center text-chime-green">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white">Analyst Core</h3>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-chime-green text-black rounded-tr-none font-medium' 
                                : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Ask about metrics..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-chime-green/50 placeholder:text-gray-500"
                    />
                    <button 
                        onClick={() => handleSend(input)}
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-chime-green rounded-lg text-black hover:bg-[#32b57d] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
