"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface AccommodationRequestProps {
  applicationId: string;
  currentAccommodation: string | null;
  onSave: (type: string, notes: string) => Promise<void>;
}

const TYPES = [
  { value: "untimed_written", label: "Untimed written response" },
  { value: "extended_time",   label: "Extended time (2×)" },
  { value: "written_only",    label: "Written only (no audio recording)" },
];

export function AccommodationRequest({ applicationId, currentAccommodation, onSave }: AccommodationRequestProps) {
  const [enabled, setEnabled]   = useState(!!currentAccommodation);
  const [type, setType]         = useState(currentAccommodation ?? "untimed_written");
  const [notes, setNotes]       = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  async function handleSave() {
    if (!enabled) return;
    setSaving(true);
    await onSave(type, notes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-4 rounded-xl" style={{ border: "1px solid rgba(0,0,0,.07)", background: "rgba(0,0,0,.03)" }}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)}
          className="w-4 h-4 rounded accent-[#3ce8ff]" />
        <span className="text-sm font-medium" style={{ color: "#0f172a" }}>Request interview accommodation</span>
      </label>

      {enabled && (
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            {TYPES.map(t => (
              <label key={t.value} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="accom-type" value={t.value} checked={type === t.value}
                  onChange={() => setType(t.value)} className="accent-[#3ce8ff]" />
                <span className="text-sm" style={{ color: "#475569" }}>{t.label}</span>
              </label>
            ))}
          </div>
          <Textarea label="Additional notes (optional)" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Describe your accommodation needs..." rows={3} />
          <Button variant="accent" size="sm" loading={saving} onClick={handleSave}>
            {saved ? "Saved ✓" : "Save accommodation request"}
          </Button>
        </div>
      )}
    </div>
  );
}
