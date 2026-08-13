/**
 * Flags produced by systems that land after their consumers are authored.
 * The validator treats these as declared producers, while the phase field keeps
 * deferred reachability explicit until the owning system is implemented.
 */
export type SystemFlagDefinition = {
  id: string;
  producer: "wellness" | "finance" | "match";
  phase: "P6" | "P7";
};

const MATCH_TRACKS = [
  "omfs",
  "ortho",
  "pedo",
  "endo",
  "perio",
  "prostho",
  "oral_path",
  "public_health",
  "academic",
  "gpr_aegd",
  "private_practice",
  "associate_then_own",
] as const;

export const SYSTEM_FLAGS: SystemFlagDefinition[] = [
  { id: "health_crisis", producer: "wellness", phase: "P6" },
  { id: "high_debt_at_graduation", producer: "finance", phase: "P6" },
  ...MATCH_TRACKS.map((track) => ({
    id: `match_${track}_accepted`,
    producer: "match" as const,
    phase: "P7" as const,
  })),
];
