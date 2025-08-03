import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import McpChat from './McpChat';

export default function McpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full shadow-xl"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && <McpChat onClose={() => setIsOpen(false)} />}
    </>
  );
}