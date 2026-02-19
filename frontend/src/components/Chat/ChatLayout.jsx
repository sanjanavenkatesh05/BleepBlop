import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { ChatContext } from '../../context/ChatContext';

const ChatLayout = () => {
    const { selectedUser } = useContext(ChatContext);

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-emerald-900/20 z-0"></div>

            <div className="w-full h-full z-10 flex p-4 gap-4">
                {/* Sidebar */}
                <div className="w-1/3 min-w-[320px] max-w-[420px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                    <Sidebar />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 glass rounded-2xl overflow-hidden shadow-2xl relative">
                    {selectedUser ? (
                        <ChatWindow />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-20 h-20 bg-gray-800 rounded-full mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold">Welcome to BleepBloop</h3>
                            <p className="mt-2 text-sm">Select a chat to start messaging securely.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
