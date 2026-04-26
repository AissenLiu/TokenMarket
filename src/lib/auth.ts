export const ADMIN_COOKIE = "tokencat_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "tokencat-admin";
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

export function isAdminSession(value?: string) {
  return Boolean(value && value === getAdminSessionSecret());
}
