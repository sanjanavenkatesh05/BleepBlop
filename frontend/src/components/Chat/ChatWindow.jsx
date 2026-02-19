import React, { useContext, useEffect, useState, useRef } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import MessageInput from './MessageInput';
import { MoreVertical, Phone, Video } from 'lucide-react';
import * as CryptoService from '../../services/crypto';

// Sub-component for individual message to handle async decryption
const MessageBubble = ({ msg, isMe, partnerUsername, connectedUsersRef, keyPair }) => {
    const [decryptedContent, setDecryptedContent] = useState(msg.content);
    const [isEncrypted, setIsEncrypted] = useState(false);

    useEffect(() => {
        const decrypt = async () => {
            if (isMe && msg.isOwn) {
                // It's my message, and I have local copy of plain text
                setDecryptedContent(msg.content);
                return;
            }
            if (isMe && !msg.isOwn) {
                // My message but from other device? (not handled in this MVP)
                // Or fallback.
            }

            if (!isMe) {
                // Incoming message. Needs decryption.
                // We need Sender's public key.
                // Partner is the sender.
                const partner = connectedUsersRef.current.find(u => u.username === partnerUsername);
                if (partner && partner.publicKey && keyPair) {
                    try {
                        const importedKey = await CryptoService.importPublicKey(partner.publicKey);
                        const sharedKey = await CryptoService.deriveSharedKey(keyPair.privateKey, importedKey);
                        const decrypted = await CryptoService.decryptMessage(sharedKey, msg.content);
                        setDecryptedContent(decrypted);
                        setIsEncrypted(true); // Successfully decrypted
                    } catch (e) {
                        console.error("Decryption error", e);
                    }
                }
            }
        };
        decrypt();
    }, [msg, isMe, partnerUsername, connectedUsersRef, keyPair]);

    // If it's my message, I already see plain text. 
    // If it's incoming, we try to decrypt.

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl p-3 px-4 shadow-md ${isMe
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-100 rounded-bl-none'
                }`}>
                <p className="text-sm break-words">{decryptedContent}</p>
                <div className={`text-[10px] mt-1 text-right flex justify-end gap-1 ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                    {/* Lock Icon if encrypted/decrypted? */}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
};

const ChatWindow = () => {
    const { selectedUser, messages, connectedUsersRef, keyPair } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    const currentMessages = selectedUser ? messages[selectedUser.username] || [] : [];

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages]);

    return (
        <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-gray-900/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
                        {selectedUser?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{selectedUser?.username}</h3>
                        <p className="text-xs text-emerald-400">Online</p>
                    </div>
                </div>
                <div className="flex text-gray-400 gap-4">
                    <button className="hover:text-white"><Video size={20} /></button>
                    <button className="hover:text-white"><Phone size={20} /></button>
                    <button className="hover:text-white"><MoreVertical size={20} /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {currentMessages.map((msg, index) => {
                    const isMe = msg.sender === user?.username;
                    return (
                        <MessageBubble
                            key={index}
                            msg={msg}
                            isMe={isMe}
                            partnerUsername={selectedUser.username}
                            connectedUsersRef={connectedUsersRef}
                            keyPair={keyPair}
                        />
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <MessageInput />
        </div>
    );
};

export default ChatWindow;
