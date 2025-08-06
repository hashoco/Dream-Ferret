import { useState } from 'react';

export default function McpChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
const API_BASE = import.meta.env.VITE_API_BASE_URL;


  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.answer || '⚠️ GPT 응답을 받을 수 없어요. 나중에 다시 시도해주세요.';
      setMessages((prev) => [...prev, { sender: 'gpt', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'gpt', text: '⚠️ 서버와 통신 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-sky-200 flex flex-col z-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-teal-300 to-sky-400 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
        <span className="font-semibold">아이들에게 물어보세요 🐾</span>
        <button onClick={onClose} className="text-white text-xl font-bold hover:text-sky-100">×</button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm" >
        {messages.map((msg, idx) => (
          <div
          
            key={idx}
            className={`max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'ml-auto bg-sky-100 text-right'
                : 'mr-auto bg-teal-50'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs">로딩 중...</div>}
      </div>

      {/* 입력창 */}
      <div className="p-2 border-t flex gap-2">
        <textarea
          rows={1}
          className="flex-1 resize-none border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="무엇이든 물어보세요!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-br from-teal-300 to-sky-400 hover:brightness-110 text-white px-3 py-1 rounded-md text-sm font-semibold"
        >
          전송
        </button>
      </div>
    </div>
  );
}