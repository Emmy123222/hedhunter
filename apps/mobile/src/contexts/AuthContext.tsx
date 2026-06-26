import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { clearSession, getStoredUser, saveSession, saveUser } from "@/lib/auth";
import type { SessionPayload, UserRole } from "@hedhunter/shared";

interface AuthContextValue {
  user: SessionPayload | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, companyName?: string) => Promise<void>;
  loginWithGoogle: (idToken: string, uid: string, email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with that email. Please sign up first.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return `Authentication error: ${code}`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getStoredUser<SessionPayload>();
      if (stored) setUser(stored);
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    let cred;
    try {
      cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (e: any) {
      throw new Error(firebaseErrorMessage(e.code ?? "auth/unknown"));
    }

    const idToken = await cred.user.getIdToken();
    let res;
    try {
      res = await api.post("/api/auth/session", { token: idToken });
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? e?.message ?? "Server error. Please try again.";
      throw new Error(msg);
    }

    const { token, role } = res.data as { token: string; role: UserRole };
    const sessionUser: SessionPayload = { uid: cred.user.uid, email, role };
    await saveSession(token);
    await saveUser(sessionUser);
    setUser(sessionUser);
    redirectByRole(role);
  }, []);

  const register = useCallback(async (
    email: string, password: string, role: UserRole, companyName?: string
  ) => {
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (e: any) {
      throw new Error(firebaseErrorMessage(e.code ?? "auth/unknown"));
    }

    const idToken = await cred.user.getIdToken();
    let res;
    try {
      res = await api.post("/api/auth/register", { token: idToken, role, companyName });
    } catch (e: any) {
      // Clean up the Firebase account if backend registration fails
      await cred.user.delete().catch(() => {});
      const msg = e?.response?.data?.error ?? e?.message ?? "Server error. Please try again.";
      throw new Error(msg);
    }

    const { token } = res.data as { token: string; role: UserRole };
    const sessionUser: SessionPayload = { uid: cred.user.uid, email, role };
    await saveSession(token);
    await saveUser(sessionUser);
    setUser(sessionUser);
    redirectByRole(role, true);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string, uid: string, email: string, role?: UserRole) => {
    let res;
    try {
      if (role) {
        res = await api.post("/api/auth/register", { token: idToken, role });
      } else {
        res = await api.post("/api/auth/session", { token: idToken });
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? e?.message ?? "Google sign-in failed. Please try again.";
      throw new Error(msg);
    }

    const { token, role: assignedRole } = res.data as { token: string; role: UserRole };
    const sessionUser: SessionPayload = { uid, email, role: assignedRole };
    await saveSession(token);
    await saveUser(sessionUser);
    setUser(sessionUser);
    redirectByRole(assignedRole, !!role);
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    await clearSession();
    setUser(null);
    router.replace("/(auth)/login");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function redirectByRole(role: UserRole, onboarding = false) {
  if (role === "JOB_SEEKER") {
    router.replace(onboarding ? "/(job-seeker)/onboarding" : "/(job-seeker)/dashboard");
  } else if (role === "COMPANY") {
    router.replace(onboarding ? "/(company)/onboarding" : "/(company)/dashboard");
  } else {
    router.replace("/(admin)/dashboard");
  }
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
