
"use client";

import React from "react";
import { FiSend } from "react-icons/fi";

type Message = {
  from: 'bot' | 'user';
  text: string;
  images?: string[];
};

const demoResponses: Message[] = [
  {
    from: 'bot',
    text: "Based on your style preferences, here are some outfit suggestions that would look great on you!",
    images: ['/outfits/083b5947-291e-4f39-addf-f823019d22a0.jpg', '/outfits/23341bf6-c03a-410b-b6b8-e45468bcb73f.webp']
  },
  {
    from: 'bot',
    text: "For a casual day out, I'd recommend this relaxed yet stylish look:",
    images: ['/outfits/3577a4f2-85a1-4fb6-927d-eb812645eaa1.webp']
  },
  {
    from: 'bot',
    text: "This outfit would be perfect for a business casual setting. The colors complement each other well!",
    images: ['/outfits/700437e7-ea90-426e-a344-4e2fd6a037ca.jpg', '/outfits/79c9112a-dc64-47e5-b777-da25425a148e.jpg']
  },
  {
    from: 'bot',
    text: "I love your taste! Here's something similar from your wardrobe that you might want to try:",
    images: ['/outfits/b7357618-a6cd-4c61-b117-2b0fce2d583b.jpg']
  },
];

export default function StyleChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { from: 'bot', text: 'Hi! I am StyleChat. Ask me anything about fashion or your outfits!' }
  ]);
  const [input, setInput] = React.useState('');
  const [responseIndex, setResponseIndex] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      const response = demoResponses[responseIndex % demoResponses.length];
      setMessages(msgs => [...msgs, response]);
      setResponseIndex(i => i + 1);
    }, 700);
  };

  return (
    <div style={{
      background: '#fafdff',
      height: '100%',
      fontFamily: 'Poppins, Arial, sans-serif',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 32px 8px', color: '#222', letterSpacing: -1, flexShrink: 0 }}>StyleChat</h2>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginRight: -32,
        paddingRight: 32,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 0 24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              background: msg.from === 'user' ? '#0095da' : '#fff',
              color: msg.from === 'user' ? '#fff' : '#222',
              borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '13px 20px',
              fontSize: 16,
              maxWidth: 540,
              boxShadow: msg.from === 'user' ? '0 2px 8px rgba(0,149,218,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
              marginBottom: 2,
              wordBreak: 'break-word',
              border: msg.from === 'user' ? 'none' : '1.5px solid #e3eaf2',
              position: 'relative',
            }}>
              {msg.text}
              {msg.images && msg.images.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 12,
                  flexWrap: 'wrap',
                }}>
                  {msg.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Outfit suggestion"
                      style={{
                        width: msg.images!.length === 1 ? 180 : 140,
                        height: msg.images!.length === 1 ? 240 : 180,
                        objectFit: 'cover',
                        borderRadius: 12,
                        border: '1px solid #e3eaf2',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSend} style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 0 24px 0',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 700,
          background: '#fff',
          borderRadius: 32,
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          padding: '0 12px 0 20px',
          border: '1.5px solid #e3eaf2',
          gap: 0,
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 17,
              padding: '18px 0',
              background: 'transparent',
              color: '#222',
              borderRadius: 32,
            }}
          />
          <button type="submit" style={{
            background: '#0095da',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 44,
            height: 44,
            marginLeft: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 22,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,149,218,0.10)',
            transition: 'background 0.15s, color 0.15s',
            outline: 'none',
          }}>
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}
