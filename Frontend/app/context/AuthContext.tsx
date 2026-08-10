import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface AuthUser {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        axios
            .get("/api/User/me", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = (loggedInUser: AuthUser) => {
        setUser(loggedInUser);
    };

    const logout = async () => {
        try {
            await axios.post("/api/User/logout", {}, { withCredentials: true });
        } catch (e) {
            console.error("Logout request failed", e);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return {
            user: null,
            isLoading: false,
            login: () => {},
            logout: async () => {},
        };
    }
    return context;
};
