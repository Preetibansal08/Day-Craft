import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('daycraft_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In a real app, validate against backend
                // For now, accept any non-empty input or check simulated users
                if (email && password) {
                    const newUser = { email, name: email.split('@')[0], id: Date.now() };
                    setUser(newUser);
                    localStorage.setItem('daycraft_user', JSON.stringify(newUser));
                    resolve(newUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };

    const signup = (name, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password && name) {
                    const newUser = { email, name, id: Date.now() };
                    setUser(newUser);
                    localStorage.setItem('daycraft_user', JSON.stringify(newUser));
                    resolve(newUser);
                } else {
                    reject(new Error('Please fill in all fields'));
                }
            }, 500);
        });
    };

    const googleLogin = (email = 'user@gmail.com') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { email: email, name: email.split('@')[0], id: 'google_123', provider: 'google' };
                setUser(newUser);
                localStorage.setItem('daycraft_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('daycraft_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
