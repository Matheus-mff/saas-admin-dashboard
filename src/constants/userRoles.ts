export const USER_ROLES = ["Admin", "Manager", "User"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_FILTERS = ["All", ...USER_ROLES] as const;

export type UserRoleFilter = (typeof USER_ROLE_FILTERS)[number];
