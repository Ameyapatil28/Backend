import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Fetch user profile on mount or token changes
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    localStorage.setItem("token", token);
                    const userData = await authService.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error("Auto login failed:", error.message);
                    logout();
                }
            } else {
                setUser(null);
                localStorage.removeItem("token");
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login({ email, password });
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            setLoading(false);
            throw error.response?.data?.message || "Invalid credentials. Please try again.";
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    const register = async (name, email, password, role) => {
        try {
            const data = await authService.register({ name, email, password, role });
            // Optional: Automatically login student after signup
            if (data.token) {
                setToken(data.token);
                setUser(data.user);
            }
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed. Try again.";
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
