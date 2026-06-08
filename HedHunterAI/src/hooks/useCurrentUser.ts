"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { UserWithProfile } from "@/types/user";

export function useCurrentUser() {
  const { user, loading: authLoading } = useAuth();
  const [dbUser, setDbUser]            = useState<UserWithProfile | null>(null);
  const [loading, setLoading]          = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDbUser(null); setLoading(false); return; }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { setDbUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, authLoading]);

  return { firebaseUser: user, dbUser, loading, isSignedIn: !!user };
}
