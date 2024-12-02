// imports
const {startTrial, stopTrial, addGazeData} = require('../controllers/trialController');

const express = require('express');

const router = express.Router();


// GET /game: Render the game page based on user group
router.get('/trial', async (req, res) => startTrial(req, res));

  
  //  handle adding data to Experiment
router.post("/addTrial", async (req, res) => stopTrial(req, res));

router.post("/addGazeData", async (req,res) => addGazeData(req, res));

module.exports =   router;


  