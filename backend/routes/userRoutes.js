const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/request", userController.userFriendRequest);

module.exports = router;
