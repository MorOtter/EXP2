// imports
const express = require('express');
const setPacketArray = require('../public/scripts/packet');
const {setUpParticipant, addFeedback} = require('../controllers/participantDetailsController');

// set router const
const router = express.Router();

router.post("/login", async (req, res) => { 
  setUpParticipant(req, res);
  const packetArray = setPacketArray();
  req.session.packetArray = packetArray;
});

// get feedback view
router.get("/feedback", (req,res) => {
  res.render("feedback.ejs");
})

router.post("/feedback", async (req, res) => {
  addFeedback(req, res);
})


module.exports = router;