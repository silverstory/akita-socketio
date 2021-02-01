/* -  -  -  -  -  -  -  -  -  -  */

/* THIS FILE IS FOR TESTING ONLY */


const express = require('express');
const router = express.Router();

// router.post('/notification', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
//   await notificationService.postNotification(req, res, next);
// });

// heroes

// Send Notification API
router.post('/notification', async (req, res, next) => {
  const notify = { data: req.body };
  await console.log(notify.data);
  // await socket.emit('notification', notify); // Updates Live Notification
  await res.send(notify);
});

module.exports = router;







