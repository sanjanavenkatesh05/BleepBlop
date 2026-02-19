import React, { useState, useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { Send, Smile, Paperclip } from 'lucide-react';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, selectedUser } = useContext(ChatContext);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() && selectedUser) {
            sendMessage(message, selectedUser.username);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSend} className="p-4 bg-gray-900/50 border-t border-gray-700 flex items-center gap-2">
            <button type="button" className="text-gray-400 hover:text-emerald-400 p-2">
                <Smile size={20} />
            </button>
            <button type="button" className="text-gray-400 hover:text-emerald-400 p-2">
                <Paperclip size={20} />
            </button>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white border-none rounded-full px-4 py-2 focus:ring-1 focus:ring-emerald-500 placeholder-gray-500"
            />

            <button
                type="submit"
                className="p-3 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!message.trim()}
            >
                <Send size={18} />
            </button>
        </form>
    );
};

export default MessageInput;
