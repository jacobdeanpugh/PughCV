/**
 * Client-safe descriptors for the candidate profiles. Keys must stay in sync
 * with `PROFILES` in `./profiles`, which is server-only (it carries contact
 * details we don't want in the browser bundle).
 */
export type ProfileId = "dean" | "marc";

export type ProfileMeta = {
  id: ProfileId;
  name: string;
  initials: string;
  tagline: string;
};

export const PROFILE_META: readonly ProfileMeta[] = [
  {
    id: "dean",
    name: "Dean Pugh",
    initials: "DP",
    tagline: "Operations, logistics, warehouse & B2B sales",
  },
  {
    id: "marc",
    name: "Marc A. Pugh",
    initials: "MP",
    tagline: "Senior sales executive, wheel design & trade shows",
  },
];
