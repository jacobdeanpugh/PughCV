"use client";

import { PROFILE_META, type ProfileId } from "@/data/profile-meta";

type Props = {
  value: ProfileId;
  onChange: (id: ProfileId) => void;
  disabled?: boolean;
};

export function ProfilePicker({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Candidate profile" className="grid gap-3 sm:grid-cols-2">
      {PROFILE_META.map((profile) => {
        const selected = profile.id === value;

        return (
          <button
            key={profile.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(profile.id)}
            className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              selected
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span
              aria-hidden
              className={`grid size-9 shrink-0 place-items-center rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                selected
                  ? "bg-accent text-white"
                  : "bg-surface-2 text-ink-faint group-hover:text-ink-muted"
              }`}
            >
              {profile.initials}
            </span>

            <span className="min-w-0">
              <span className={`block text-sm font-semibold ${selected ? "text-ink" : "text-ink-muted"}`}>
                {profile.name}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-faint">
                {profile.tagline}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
