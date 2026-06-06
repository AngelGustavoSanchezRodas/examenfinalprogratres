"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "../types";

interface ChatRoomProps {
  token: string;
  currentUser: string;
  onLogout: () => void;
}

export default function ChatRoom({ token, currentUser, onLogout }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) return;

    setSending(true);
    try {
      const res = await fetch(
        "https://backcvbgtmdesa.azurewebsites.net/api/Mensajes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Cod_Sala: 0,
            Login_Emisor: currentUser,
            Contenido: newMessage,
          }),
        }
      );

      if (res.ok) {
        setNewMessage("");
        await fetchMessages();
      } else {
        const errorText = await res.text();
        console.error("Error enviando mensaje:", errorText);
        alert("Error al enviar el mensaje. Verifica tu sesión.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-slate-900 sm:rounded-3xl shadow-2xl flex flex-col h-[100dvh] sm:h-[85vh] border border-slate-800 overflow-hidden relative">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold">Sala Principal</h2>
              <p className="text-xs text-indigo-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                En línea como {currentUser}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-slate-800"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic">
              No hay mensajes todavía. ¡Escribe el primero!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.Login_Emisor === currentUser;
              return (
                <div
                  key={msg.Cod_Mensaje || idx}
                  className={`flex flex-col max-w-[80%] ${
                    isMine ? "ml-auto items-end" : "mr-auto items-start"
                  } animate-fade-in-up`}
                >
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {msg.Login_Emisor}
                  </span>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm ${
                      isMine
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.Contenido}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-2 relative"
          >
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
                placeholder="Escribe un mensaje..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 min-h-[44px] scrollbar-hide"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-full flex-shrink-0 shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 transform rotate-[-45deg] ml-1 mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Custom Styles for scrollbar and animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 20px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}} />
    </main>
  );
}
