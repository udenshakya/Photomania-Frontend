import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  decoded: any | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<any | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1] || ""));
      setToken(token);
      setDecoded(decoded);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, decoded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
