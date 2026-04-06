import type { AppGroup } from "@/features/groups/types";

const memberCountFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function getCommunityInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "?";
  }

  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getCommunitySummary(group: AppGroup) {
  return group.shortDescription?.trim() || group.description;
}

export function getCommunityAccent(category: string) {
  switch (category.toLocaleLowerCase("tr")) {
    case "teknoloji":
      return {
        accent: "#0f766e",
        accentSoft: "rgba(15, 118, 110, 0.12)",
        banner: "rgba(15, 118, 110, 0.14)",
      };
    case "akademik":
      return {
        accent: "#1d4ed8",
        accentSoft: "rgba(29, 78, 216, 0.12)",
        banner: "rgba(29, 78, 216, 0.14)",
      };
    case "kariyer":
      return {
        accent: "#c2410c",
        accentSoft: "rgba(194, 65, 12, 0.12)",
        banner: "rgba(194, 65, 12, 0.14)",
      };
    case "sanat":
      return {
        accent: "#be185d",
        accentSoft: "rgba(190, 24, 93, 0.12)",
        banner: "rgba(190, 24, 93, 0.14)",
      };
    case "spor":
      return {
        accent: "#4338ca",
        accentSoft: "rgba(67, 56, 202, 0.12)",
        banner: "rgba(67, 56, 202, 0.14)",
      };
    default:
      return {
        accent: "#334155",
        accentSoft: "rgba(51, 65, 85, 0.12)",
        banner: "rgba(51, 65, 85, 0.14)",
      };
  }
}

export function filterGroups(groups: AppGroup[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");

  if (!normalizedQuery) {
    return groups;
  }

  return groups.filter((group) =>
    [group.name, group.category, group.shortDescription, group.description, group.creatorName]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr")
      .includes(normalizedQuery),
  );
}

export function dedupeGroups(groups: AppGroup[]) {
  const seen = new Set<string>();

  return groups.filter((group) => {
    if (seen.has(group.id)) {
      return false;
    }

    seen.add(group.id);
    return true;
  });
}

export function formatCommunityMemberCount(memberCount: number) {
  return `${memberCountFormatter.format(memberCount)} Uye`;
}
