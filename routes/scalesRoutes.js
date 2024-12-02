//  imports
const express = require('express');
const {createScalesArray, addScaleToDB} = require("../controllers/scalesController");


const router = express.Router();


//  get scales views
router.get("/getScale", (req, res) => createScalesArray(req, res));
  
  // handle scale posts
router.post("/addScale", async (req, res) => addScaleToDB(req, res));

// get TIAS view
router.get("/tias", (req,res) => {
    res.render("tias.ejs");
});
  
  // get sart view
router.get("/sart", (req,res) => {
    res.render("sart.ejs");
});
  
  // get nasa view
router.get("/nasa", (req,res) => {
    res.render("nasa.ejs");
});

router.get("/nmrq", (req, res) => {
  res.render("nmrq.ejs")
})

module.exports = router;
