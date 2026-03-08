import { forbidden } from "../utils/errors.js";

const ensureAuthenticatedUser = (req) => {
  if (!req.user) {
    throw forbidden("Authentication context is required before role authorization");
  }
};

const requireRole = (role) => (req, _res, next) => {
  ensureAuthenticatedUser(req);

  if (req.user.role !== role) {
    throw forbidden(`Access denied. ${role} role required.`);
  }

  next();
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  ensureAuthenticatedUser(req);

  if (!roles.includes(req.user.role)) {
    throw forbidden(`Access denied. Allowed roles: ${roles.join(", ")}`);
  }

  next();
};

export const adminOnly = requireRole("admin");
export const teacherOnly = requireRole("teacher");
export const studentOnly = requireRole("student");
export const accountantOnly = requireRole("accountant");

export default requireRole;
