'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
      isUser: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      isUser: true,
    };
    setMessages([...messages, userMessage]);
    setMessage('');

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Gracias por tu mensaje. Un asesor te atenderá pronto. 📱',
        isUser: false,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform duration-200 group"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
        )}
      </button>

      {/* Ventana del chat - más compacta */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header compacto */}
          <div className="bg-black text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Soporte al cliente</h3>
                <p className="text-[11px] text-gray-300">Respuesta en minutos</p>
              </div>
            </div>
          </div>

          {/* Messages container - altura reducida */}
          <div className="h-80 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-1.5 rounded-2xl ${
                    msg.isUser
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-xs">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area compacto */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-black text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">Lun a Vie 9am - 6pm</p>
          </div>
        </div>
      )}
    </>
  );
}
