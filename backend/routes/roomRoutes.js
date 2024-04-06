const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");


router.post('/create',roomController.createRoom); // Requires participants and admins.
router.delete('/:roomid',roomController.deleteRoom);
router.put('/:roomid/setAdmin/:userid',roomController.setAdmin);
router.put('/:roomid/kick/:adminid/:userid',roomController.kickUser);
router.put('/:roomid/removeAdmin/:userid',roomController.removeAdmin);
router.put('/:roomid/message',roomController.sendMessage);
router.get('/:roomid',roomController.fetchRoom);

module.exports = router;
