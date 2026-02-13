import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loggedIn: boolean;
 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
 const navi=useNavigate()

  const getApi = () => {
    const baseUrl = localStorage.getItem("BASE_URL");
    if (!baseUrl) throw new Error("BASE_URL not set");
    return baseUrl;
  };

  const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", "password");

    const res = await axios.post(`${getApi()}/postoken`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = res.data;

    localStorage.setItem("access_token", data.access_token);
    const expiryTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem("token_expiry", expiryTime.toString());

 
    setLoggedIn(true);
  };

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_expiry");

  setLoggedIn(false);
  navi("/")
};


  return (
    <AuthContext.Provider value={{ login, logout, loggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
