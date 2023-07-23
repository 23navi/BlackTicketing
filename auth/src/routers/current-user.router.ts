import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

import { currentUserMiddleware } from "../middlewares/current-user";

router.get("/api/users/currentuser", currentUserMiddleware, (req, res) => {
  if (!req.currentUser) {
    return res.send({ currentUser: null });
  }
  return {
    currentUser: req.currentUser,
  };
});

export { router as currentUserRouter };
