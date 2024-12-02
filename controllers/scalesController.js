
//  helper functions

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getScaleCategory(req) {
    let category;
    switch (req.session.trialNumber) {
        case 1:
          category = "pre-trials";
          break;
        case 3:
          category = "mid-trials";
          break;
        case 5:
          category = "post-trials";
          break;
        default:
          category = "error-finding-stage";
    }
    return category;

}

function getScaleType(data) {
    const firstDataEle = Object.keys(data)[0];
    const typeOfScale = firstDataEle.slice(0,4);
    return typeOfScale
   
}

exports.createScalesArray = (req, res) => {
    let scales = ['/scales/sart', '/scales/nasa'];
    req.session.condition !== 'noAdvisor' ? scales.push('/scales/tias') : scales.push('/scales/nmrq');
    shuffleArray(scales);
    req.session.scales = scales;
    let nextScale = scales.pop();
    req.session.currentScale = nextScale;
    res.redirect(nextScale);
};

exports.addScaleToDB = async (req, res) => {
    let data = req.body;    
    const category = getScaleCategory(req);
    const typeOfScale = getScaleType(data);
    const inputs = Object.values(data);

    let scaleId = await req.dbServices.insertScale(req.session.participantId, typeOfScale, category);

    for (let i = 0; i < inputs.length; i++){
      await req.dbServices.insertItem(i+1, scaleId, inputs[i]);
    }
    
    if (req.session.scales.length === 0) { // check if scales complete
      res.redirect("/information/rules")
    } else {
      let scales = req.session.scales
      let nextScale = scales.pop();
      req.session.currentScale = nextScale;
      res.redirect(nextScale);
    }
}