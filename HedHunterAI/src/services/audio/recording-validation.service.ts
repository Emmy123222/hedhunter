export function validateRecordingDuration(durationSec: number, timeLimitSec: number, hasAccommodation: boolean): boolean {
  if (hasAccommodation) return true;
  return durationSec <= timeLimitSec + 10;
}

export function checkAudioQuality(durationSec: number): { acceptable: boolean; reason?: string } {
  if (durationSec < 2) return { acceptable: false, reason: "Recording too short (minimum 2 seconds)" };
  if (durationSec > 600) return { acceptable: false, reason: "Recording too long (maximum 10 minutes)" };
  return { acceptable: true };
}
