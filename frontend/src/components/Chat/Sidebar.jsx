import React, { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { Search, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { connectedUsers, setSelectedUser, selectedUser } = useContext(ChatContext);
    const { user, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = connectedUsers.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        u.username !== user?.username
    );

    return (
        <div className="flex flex-col h-full bg-gray-900/50">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white">{user?.username}</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-emerald-500 placeholder-gray-500 transition-all"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredUsers.map(u => (
                    <div
                        key={u.username}
                        onClick={() => setSelectedUser(u)}
                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all hover:bg-white/5 ${selectedUser?.username === u.username ? 'bg-white/10' : ''}`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-semibold border border-gray-600">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${u.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-medium truncate text-gray-100">{u.username}</h4>
                                <span className="text-xs text-emerald-400">12:30 PM</span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">Tap to chat securely</p>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
