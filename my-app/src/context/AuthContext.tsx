




import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBranch, getcompanyinfobill } from "../api/kotService";

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
const login = async (username: string, password: string ) => {
  const baseUrl = getApi();
  const companyInfo = await getcompanyinfobill();
  const branchData = await getBranch();

  const companyCode = companyInfo.Company_code;
  const branchCode = branchData[0].Branch_Code;

  const res = await axios.post(
    `${baseUrl}/api/POS/BtnSubmitLogin`,
    {
      username,
      password,
      branch_code :branchCode, // or get from localStorage if dynamic
      company_code:companyCode
    },
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );

const response = res.data;

const user = response?.data?.user;

if (!user) {
  throw new Error("Invalid login response");
}

if (user.token) {
  localStorage.setItem("access_token", user.token);

  const payload = JSON.parse(atob(user.token.split(".")[1]));

  localStorage.setItem(
    "token_expiry",
    String(payload.exp * 1000)
  );
}

localStorage.setItem("branch_code", branchCode);
localStorage.setItem("user", JSON.stringify(user));

// Optional: Save company info if you need it later
localStorage.setItem(
  "companyInfo",
  JSON.stringify(response.data.companyInfo)
);

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









