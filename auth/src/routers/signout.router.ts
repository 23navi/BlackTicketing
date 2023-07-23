import express from "express";
const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send("successfully signed out");
});

export { router as signoutRouter };
