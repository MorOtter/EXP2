

const configureConditions = participantId => {
    // set up experiment parameters
    const conditionNumber= participantId % 3;
    const groupNumber = parseInt(participantId) % 2;
    const censorGroupNumber = Math.floor(participantId / 4) % 2;
    
    let condition = '';
    switch (conditionNumber) {
        case 0:
        condition = "noAdvisor";
        break;
        case 1:
        condition = "humanAdvisor";
        break;
        case 2:
        condition = "aiAdvisor";
        break;
        default:
        condition = "noAdvisor"; // Default to noAdvisor
    }
    
    const groupName = groupNumber === 0 ? "A" : 'B';
    const censorGroup = censorGroupNumber === 0 ? 'RIO' : 'SIO';

    const censoredArrayNumber = censorGroup === 'RIO' ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4); 

    return {condition, groupName, censorGroup, censoredArrayNumber}
};

exports.setUpParticipant = async (req, res) => {

    const participantId = await req.dbServices.getNextId();

    const {condition, groupName, censorGroup, censoredArrayNumber} = configureConditions(participantId);

    req.session.participantId = participantId;
    req.session.condition = condition;
    req.session.groupName = groupName;
    req.session.censorGroup = censorGroup;
    req.session.censoredArrayNumber = censoredArrayNumber;
    req.session.trialNumber = 0;
    req.session.getScales = false;

    const gender = req.body.gender;
    const age = parseInt(req.body.age, 10);

    await req.dbServices.insertParticipant(participantId, condition, groupName, censorGroup, censoredArrayNumber, gender, age);

    res.redirect('/information/description');
};

exports.addFeedback = async (req, res) => {
    const feedback = req.body['feedback'];

    await req.dbServices.insertFeedback(req.session.participantId, feedback);

    res.redirect('/information/debrief');
}