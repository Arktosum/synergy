const express = require("express");

const friendController = require("../controllers/friendController");
const friendRouter = express.Router();

friendRouter.post("/", friendController.createFriend);
friendRouter.put("/:id", friendController.updateFriend);
friendRouter.delete("/:id", friendController.deleteFriend);
friendRouter.get("/:id", friendController.fetchFriendById);
friendRouter.get("/", friendController.fetchAllFriends);
friendRouter.get("/regex/:regex", friendController.fetchFriendsRegex);

module.exports = friendRouter;
