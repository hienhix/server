const authControllers = require("../controllers/auth.Controllers");
const userControllers = require("../controllers/user.Controllers");
const router = require("express").Router();

router.post("/register",authControllers.registerUser);
router.post("/login",authControllers.loginUser);
router.get("/",userControllers.getAllUser)
//router.get("/register");

module.exports = router;