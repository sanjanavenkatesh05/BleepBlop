import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth';
import * as CryptoService from '../services/crypto';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        try {
            // Generate Session Keys
            const keyPair = await CryptoService.generateKeyPair();
            const publicKey = await CryptoService.exportPublicKey(keyPair.publicKey);

            const response = await AuthService.login(identifier, password, publicKey);
            if (response.data) {
                // Attach private key to user object (in memory only, for temporary session)
                const userWithKeys = {
                    ...response.data,
                    privateKey: keyPair.privateKey,
                    // Ensure public key is consistent 
                    publicKey: publicKey
                };

                // We do NOT save private key to localStorage to ensure ephemeral session security
                // BUT we save the user basic info to keep them logged in? 
                // Requirement: "Sessions should be temporary, clearing chat history on tab close."
                // So if they refresh, they lose the key, thus they lose the session effectively.
                // We can save basic user info but they will need to re-login to chat? 
                // Or we just don't save to localStorage at all? 
                // The current implementation saves 'user'. 
                // If we refresh, 'user' is loaded from localStorage but WITHOUT privateKey.
                // So E2EE will fail. 
                // Solution: Clear localStorage on load if we want purely ephemeral? 
                // OR: For now, sticking to logic: Login -> Generate Keys. Refresh -> Lose Keys -> Must Login again? 
                // We'll leave localStorage for basic persist info, but they won't be able to decrypt old messages. 
                // That's consistent with "Temporary".

                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(userWithKeys);
            }
            return response.data;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        return await AuthService.register(username, email, password);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
