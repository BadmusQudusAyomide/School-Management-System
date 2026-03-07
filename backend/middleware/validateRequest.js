import { validationResult } from "express-validator";

import { badRequest } from "../utils/errors.js";

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(badRequest("Validation failed", errors.array()));
  }

  return next();
};

export default validateRequest;
