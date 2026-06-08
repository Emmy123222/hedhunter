"use client";
import { useEffect, useState } from "react";
import type { ApplicationWithDetails } from "@/types/application";

export function useApplicationStatus(applicationId: string) {
  const [application, setApplication] = useState<ApplicationWithDetails | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error,   setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    fetch(`/api/applications/${applicationId}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setApplication(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [applicationId]);

  return { application, loading, error };
}
