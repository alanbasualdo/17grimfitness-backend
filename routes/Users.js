const { Router } = require("express");
const { validateJWT } = require("../middlewares/jwt");
const { adminRol } = require("../middlewares/roles");
const { userGet, userPut } = require("../controllers/Users");

const router = Router();

router.get("/get", [validateJWT, adminRol], userGet);

router.put("/put/:id", validateJWT, userPut);

module.exports = router;
