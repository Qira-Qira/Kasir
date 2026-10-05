import { useState } from "react";
import type { AuthState, UserAccount } from "../types";
import { USER_ACCOUNTS } from "../constants";

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    const matchedUser = USER_ACCOUNTS.find(
      (user) => user.username === loginForm.username && user.password === loginForm.password
    );

    if (!matchedUser) {
      setLoginError("Username atau password salah!");
      return;
    }

    setAuth({
      username: matchedUser.username,
      name: matchedUser.name,
      role: matchedUser.role,
    });
    setLoginForm({ username: "admin", password: "admin123" });
  };

  const handleLogout = () => {
    setAuth(null);
    setLoginError("");
    setLoginForm({ username: "admin", password: "admin123" });
  };

  return {
    auth,
    setAuth,
    loginForm,
    setLoginForm,
    loginError,
    setLoginError,
    handleLogin,
    handleLogout,
  };
};
