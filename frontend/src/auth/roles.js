export const ROLE_OPERATOR = "operator";
export const ROLE_SUPERVISOR = "supervisor";
export const ROLE_MANAGER = "manager";
export const ROLE_ADMIN = "admin";

const ROLE_RANKS = {
  [ROLE_OPERATOR]: 10,
  [ROLE_SUPERVISOR]: 20,
  [ROLE_MANAGER]: 30,
  [ROLE_ADMIN]: 40
};

export function roleRank(role) {
  return ROLE_RANKS[role] || 0;
}

export function canManageUsers(user) {
  return roleRank(user?.role) >= ROLE_RANKS[ROLE_SUPERVISOR] || Boolean(user?.is_superuser);
}

export function canViewAllData(user) {
  return roleRank(user?.role) >= ROLE_RANKS[ROLE_MANAGER] || Boolean(user?.is_superuser);
}

export function isOperator(user) {
  return user?.role === ROLE_OPERATOR;
}

export function creatableRolesFor(user) {
  if (roleRank(user?.role) >= ROLE_RANKS[ROLE_ADMIN] || user?.is_superuser) {
    return [ROLE_OPERATOR, ROLE_SUPERVISOR, ROLE_MANAGER, ROLE_ADMIN];
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
