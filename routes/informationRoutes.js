//  imports
const express = require('express');


// middleware

// check for routing purposes trial number
const checkStageOfExperiment = (req, res, next) => {
    if ((req.session.trialNumber === 1 || req.session.trialNumber === 3)) {
        console.log("trial number check passed")
        req.session.getScales = !req.session.getScales;
        console.log(req.session.getScales)
        if (req.session.getScales) {
            console.log("get scales check passed");
            return res.redirect('/scales/getScale');
            
        } else {
            return next();
        }
    } else if (req.session.trialNumber === 5) {
        req.session.getScales = !req.session.getScales;
        if (req.session.getScales) {
            return res.redirect('/scales/getScale');
             
        } else {
            return res.redirect('/participant/feedback');
        }
    } else {
        return next();
    }
}
    

const router = express.Router();


// Information view as home
router.get("/", (req, res) => {
    res.render("information.ejs");
});
  

// Consent routes
router.get("/consent", (req, res) => {
    res.render("consent.ejs");
});

router.post("/consent", (req,res) => {
    res.redirect("/login");
});


// description of experiment
router.get("/description", (req, res) => {
  res.render("description.ejs");
});


// rules view
router.get("/rules", checkStageOfExperiment, (req, res) => {
    res.render("rules.ejs");
});

// instructions view
router.get("/instructions", (req, res) => {
    const condition = req.session.condition
    res.render("instructions.ejs", {condition:condition})
})

// debrief routes
router.get("/debrief", (req, res) => {
    res.render("debrief.ejs");
});
  
router.post("/debrief", (req, res) => {
    
    res.render("thanks.ejs");
})

router.get("/webgazerconfig", (req, res) => {
    res.render("webgazerConfig.ejs");
})

module.exports = router;
