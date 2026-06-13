export function isNewMeetingActive(pathname: string): boolean {
  return pathname === "/meetings/new";
}

export function isMeetingsActive(pathname: string): boolean {
  if (pathname === "/meetings") return true;
  if (pathname.startsWith("/meetings/") && pathname !== "/meetings/new") {
    return true;
  }
  return false;
}

export function isProfileActive(pathname: string): boolean {
  return pathname === "/profile";
}

export function isSpaceSettingsActive(pathname: string): boolean {
  return pathname.startsWith("/space/settings");
}
