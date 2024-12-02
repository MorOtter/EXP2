const {setUpParticipant, addFeedback} = require("../controllers/participantDetailsController");
const request = require('supertest');
// const { insertParticipant, getNextId, insertFeedback } = require("../services/dbServices");

jest.mock("../services/dbServices", () => ({
    insertParticipant : jest.fn(),
    getNextId : jest.fn(),
    insertFeedback : jest.fn()
}));

const dbServices = require("../services/dbServices");

describe('setUpParticipant function', () => {

    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        dbServices.getNextId.mockResolvedValue(2);
        mockReq = {
            session : {},
            dbServices
        };
        mockRes = {
            redirect: jest.fn(),
        };
        mockNext = jest.fn();
    });
    
    test('should return the id of the next row and assign to participant', async () => {

        await setUpParticipant(mockReq, mockRes, mockNext);

        expect(dbServices.getNextId).toHaveBeenCalled();
    });
    
    test('should call insertParticipant with correct information and redirect to "/information/description"', async () => {

        // mock configure conditions
        const mockConfigureConditions = participantId => {
            // set up experiment parameters
            const conditionNumber = participantId % 3;
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

        const participantId = 2;

        const {condition, groupName, censorGroup, censoredArrayNumber} = mockConfigureConditions(participantId);

        await setUpParticipant(mockReq, mockRes, mockNext);

        expect(dbServices.insertParticipant).toHaveBeenCalledWith(participantId, condition, groupName, censorGroup, expect.any(Number));
        expect(mockRes.redirect).toHaveBeenCalledWith('/information/description')
    })
});

describe('addFeedback function', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            session : {
                participantId : 2
            },
            body : {
                feedback : "feedback here"
            },
            dbServices
        };
        mockRes = {
            redirect : jest.fn()
        };
        mockNext = jest.fn();

    });

    test('call insertFeedback with data from req and redirect to "/information/debrief', async () => {
        await addFeedback(mockReq, mockRes, mockNext);

        expect(dbServices.insertFeedback).toHaveBeenCalledWith(2, "feedback here");
        expect(mockRes.redirect).toHaveBeenCalledWith('/information/debrief');
    })
})