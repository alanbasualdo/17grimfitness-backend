const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/jwt");
const { validateFields } = require("../middlewares/fields");
const { adminRol } = require("../middlewares/roles");
const { postClass, getAllClasses } = require("../controllers/Classes");

const router = Router();

router.post(
  "/post",
  [
    check("day", "El nombre es obligatorio").not().isEmpty(),
    check("from", "El nombre es obligatorio").not().isEmpty(),
    check("to", "El nombre es obligatorio").not().isEmpty(),
    check("about", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  postClass
);

router.get("/get", validateJWT, getAllClasses);

router.put(
  "/:id",
  [validateJWT, check("id", "No es un ID válido").isMongoId(), validateFields]
  /* userPut */
);

router.delete(
  "/:id",
  [
    validateJWT,
    adminRol,
    check("id", "No es un ID válido").isMongoId(),
    validateFields,
  ]
  /* userDelete */
);

module.exports = router;
