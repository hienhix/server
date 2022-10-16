
const middleware = require("../controllers/middleware.Controllers");
const userControllers = require("../controllers/user.Controllers");
const router = require("express").Router();


router.get("/",middleware.verifyToken,userControllers.getAllUser);
router.delete("/:id",middleware.verifyTokenAndAdmin,userControllers.deleteUser);
router.get("/getRooms",userControllers.getListRooms);
//router.get("/register");

module.exports = router;