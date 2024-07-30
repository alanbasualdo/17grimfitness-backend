const { Router } = require("express");
const { validateJWT } = require("../middlewares/jwt");
const {
  getAllClasses,
  getInscribedUsersByClass,
  getAllClassesByUser,
  subscribeUserToClass,
} = require("../controllers/UserClass");

const router = Router();

router.get("/", validateJWT, getAllClasses);
router.get("/:classId/inscribed", validateJWT, getInscribedUsersByClass);
router.get("/classes", validateJWT, getAllClassesByUser);
router.post("/subscribe", validateJWT, subscribeUserToClass);

module.exports = router;
