export const ROLE_OPERATOR = "operator";
export const ROLE_SUPERVISOR = "supervisor";
export const ROLE_MANAGER = "manager";
export const ROLE_ADMIN = "admin";

export const ROLE_RANKS = {
  [ROLE_OPERATOR]: 10,
  [ROLE_SUPERVISOR]: 20,
  [ROLE_MANAGER]: 30,
  [ROLE_ADMIN]: 40
};

export function roleRank(role) {
  return ROLE_RANKS[role] || 0;
}

export function userRoleRank(user) {
  return Math.max(roleRank(user?.role), user?.is_superuser ? ROLE_RANKS[ROLE_ADMIN] : 0);
}

export function effectiveRole(user) {
  return user?.is_superuser ? ROLE_ADMIN : user?.role;
}

export function hasRoleAtLeast(user, minimumRole) {
  return userRoleRank(user) >= roleRank(minimumRole);
}

export function hasAnyRole(user, roles = []) {
  return roles.includes(effectiveRole(user));
}

export function canManageUsers(user) {
  return hasRoleAtLeast(user, ROLE_SUPERVISOR);
}

export function canViewAllData(user) {
  return hasRoleAtLeast(user, ROLE_MANAGER);
}

export function canAccessDashboard(user) {
  return hasRoleAtLeast(user, ROLE_OPERATOR);
}

export function canUploadRecords(user) {
  return hasAnyRole(user, [ROLE_OPERATOR]);
}

export function canAccessManagerWorkspace(user) {
  return hasAnyRole(user, [ROLE_MANAGER, ROLE_ADMIN]);
}

export function canAccessAdminWorkspace(user) {
  return hasAnyRole(user, [ROLE_ADMIN]);
}

export function isOperator(user) {
  return user?.role === ROLE_OPERATOR;
}

export function creatableRolesFor(user) {
  if (hasRoleAtLeast(user, ROLE_ADMIN)) {
    return [ROLE_MANAGER];
  }
  if (user?.role === ROLE_MANAGER) {
    return [ROLE_SUPERVISOR, ROLE_OPERATOR];
  }
  if (user?.role === ROLE_SUPERVISOR) {
    return [ROLE_OPERATOR];
  }
  return [];
}

export function defaultCreatableRole(user) {
  return creatableRolesFor(user)[0] || ROLE_OPERATOR;
}

export function roleLabel(t, role) {
  return t.roles?.[role] || role;
}

export function roleLongLabel(t, user) {
  if (!user) return "";
  return t.roles?.[`${user.role}Long`] || roleLabel(t, user.role);
}

export function panelTitle(t, user) {
  if (user?.is_superuser || user?.role === ROLE_ADMIN) {
    return t.layout.adminPanel || roleLongLabel(t, user);
  }
  if (user?.role === ROLE_MANAGER) {
    return t.layout.managerPanel || roleLongLabel(t, user);
  }
  if (user?.role === ROLE_SUPERVISOR) {
    return t.layout.supervisorPanel || roleLongLabel(t, user);
  }
  return t.layout.operatorPanel;
}
