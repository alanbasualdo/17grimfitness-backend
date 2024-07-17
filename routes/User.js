const { Router } = require("express");
const { check } = require("express-validator");
const {
  userGet,
  userPost,
  userPut,
  userDelete,
} = require("../controllers/User");
const { validateJWT } = require("../middlewares/jwt");
const { validateFields } = require("../middlewares/fields");
const { adminRol } = require("../middlewares/roles");

const router = Router();

router.get("/", [validateJWT, adminRol], userGet);

router.post("/new", userPost);

router.put("/edit", validateJWT, userPut);

router.delete(
  "/:id",
  [
    validateJWT,
    adminRol,
    check("id", "No es un ID válido").isMongoId(),
    validateFields,
  ],
  userDelete
);

module.exports = router;
