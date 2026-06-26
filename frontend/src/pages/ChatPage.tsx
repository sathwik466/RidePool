import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../api/stats';
import { useStomp } from '../hooks/useStomp';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { ChatMessage } from '../types';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const bookingId = Number(id);
  const { connected, subscribe, publish } = useStomp(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatApi.history(bookingId).then(({ data }) => setMessages(data)).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
    });
  }, [bookingId]);

  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe<ChatMessage>(`/topic/chat/${bookingId}`, (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    return unsub;
  }, [connected, bookingId, subscribe]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    publish(`/app/chat/${bookingId}`, {
      senderEmail: user.email,
      senderName: user.name,
      content: content.trim(),
    });
    setContent('');
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col space-y-4" style={{ height: 'calc(100vh - 180px)' }}>
      <h1 className="text-2xl font-bold">Trip Chat</h1>
      {error && <ErrorAlert message={error} />}
      <p className="text-xs text-slate-500">{connected ? 'Live' : 'Connecting...'}</p>

      <div className="card flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && !error && <LoadingSpinner />}
        {messages.map((msg) => {
          const isMe = msg.senderEmail === user?.email;
          return (
            <div
              key={msg.id ?? `${msg.sentAt}-${msg.content}`}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isMe ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {!isMe && <p className="text-xs font-medium opacity-70">{msg.senderName}</p>}
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={!connected}>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
