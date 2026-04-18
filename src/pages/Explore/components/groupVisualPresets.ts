export interface GroupVisualPreset {
  id: string;
  label: string;
  path: string;
}

export const avatarPresets: GroupVisualPreset[] = [
  {
    id: "avatar-code",
    label: "Kod",
    path: "/community-presets/avatars/avatar-code.svg",
  },
  {
    id: "avatar-orbit",
    label: "Orbit",
    path: "/community-presets/avatars/avatar-orbit.svg",
  },
  {
    id: "avatar-library",
    label: "Kutuphane",
    path: "/community-presets/avatars/avatar-library.svg",
  },
  {
    id: "avatar-dialog",
    label: "Sohbet",
    path: "/community-presets/avatars/avatar-dialog.svg",
  },
];

export const coverPresets: GroupVisualPreset[] = [
  {
    id: "cover-grid",
    label: "Grid",
    path: "/community-presets/covers/cover-grid.svg",
  },
  {
    id: "cover-campus",
    label: "Kampüs",
    path: "/community-presets/covers/cover-campus.svg",
  },
  {
    id: "cover-forum",
    label: "Forum",
    path: "/community-presets/covers/cover-forum.svg",
  },
  {
    id: "cover-studio",
    label: "Studyo",
    path: "/community-presets/covers/cover-studio.svg",
  },
];

export function resolveGroupPresetUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}
