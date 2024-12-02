const {startTrial, stopTrial} = require("../controllers/trialControllers");
const request = require('supertest');


jest.mock("../services/flaskServices", () => ({
    handleRecording: jest.fn(),
    downloadVideo: jest.fn().mockResolvedValue('mock-video')
}));
jest.mock("../services/dbServices", () => ({
    insertTrial: jest.fn(),
    insertPacket: jest.fn()
}));

const flaskServices = require('../services/flaskServices');
const dbServices = require("../services/dbServices");

describe('startTrial function', () => {
    let mockReq, mockRes, mockNext, flaskServices;

    beforeEach(() => {
        mockReq = {
            session: {
                trialNumber: 1,
                participant: 1,
                trialStartTime: '2023-01-01T00:00:00.000Z',
                condition: 'aiAdvisor',
                packetArray: [{id:1, value: 'packet-1'}],
                censoredInfo: "RIO",
                censoredArrayNumber:2,
                group: "A"
            },
            flaskServices,
        };
        mockRes = {
            redirect: jest.fn(),
            render: jest.fn()
        };
        mockNext = jest.fn();
        flaskServices = require('../services/flaskServices');

    });
    
    test('should redirect to "/" if req.session.condition is false or undefined', async () => {
        
        // set condition to undefined
        mockReq.session.condition = undefined;
        await startTrial(mockReq, mockRes, mockNext);

        // Assert that redirect was called with correct URL
        expect(mockRes.redirect).toHaveBeenCalledWith('/');

    });

    test('should call handleRecording with "start"', async () => {
        await startTrial(mockReq, mockRes, mockNext);

        //  Assert flask server start recording
        expect(flaskServices.handleRecording).toHaveBeenCalledWith('start');
    });

    test('should render trial view', async () => {

        await startTrial(mockReq, mockRes, mockNext);

        // Assert render trial view gets called
        expect(mockRes.render).toHaveBeenCalledWith('trial.ejs', {
            conditionText: 'AI Advisor',
            group: 'A',
            censorship: 'RIO',
            censoredArrayNumber: 2,
            packetArray: JSON.stringify([{ id: 1, value: 'packet-1' }])
        })

    });

    test('should handle errors', async () => {
        const errorMessage = new Error('Error connecting to flask server');
        mockReq.flaskServices.handleRecording.mockRejectedValue(errorMessage);

        console.error = jest.fn();

        await startTrial(mockReq, mockRes, mockNext);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
        expect(mockRes.render).not.toHaveBeenCalled();
    })
});

describe('stopTrial function', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        flaskServices.handleRecording.mockReset();
        flaskServices.downloadVideo.mockReset();
        dbServices.insertTrial.mockReset();
        mockReq = {
            body : {
                input : [{
                    user: "trusted",
                    advisor: "suspect",
                    accepted: false,
                    time: '2023-01-01T00:00:00.000Z'
                }],
                trialEndTime : '2023-01-01T00:00:00.000Z'
            },
            session: {
                trialNumber: 0,
                username: 1,
                trialStartTime: '2023-01-01T00:00:00.000Z',
                condition: 'aiAdvisor',
                packetArray: [{id:1, value: 'packet-1'}],
                censoredInfo: "RIO",
                censoredArrayNumber:2,
                group: "A",
                trialEndTime: '2023-01-01T00:00:00.000Z',
                trialVideoUrl : "mock-video"
            },
            flaskServices,
            dbServices
        };
        mockRes = {
            redirect: jest.fn()
        };
        mockNext= jest.fn();

        // jest.spyOn(global, 'Date').mockImplementation(() => ({
        //     toISOString: () => '2023-01-01T00:00:00.000Z'
        // }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test('should call handleRecording with "stop"', async () => {
        await stopTrial(mockReq, mockRes, mockNext);
        expect(flaskServices.handleRecording).toHaveBeenCalledWith('stop');
    });
    test('should call downloadVideo', async () => {
        await stopTrial(mockReq, mockRes, mockNext);
        expect(flaskServices.downloadVideo).toHaveBeenCalled();
    })

    test('should call insertTrial with correct arguments then insertPacket with correct arguments', async () => {
        dbServices.insertTrial.mockResolvedValue(1);
        await stopTrial(mockReq, mockRes, mockNext);

        const expectedTrialType = 'test'; // Based on trialNumber = 0
        const expectedTrialEndTime = mockReq.body['trialEndTime'];
        const expectedTrialVideoUrl = "trial-url";
        expect(dbServices.insertTrial).toHaveBeenCalledWith(
            1,
            expectedTrialType,
            0, 
            mockReq.session.trialStartTime,
            expectedTrialEndTime,
            expectedTrialVideoUrl
        );

        const trialId = 1;

        expect(dbServices.insertPacket).toHaveBeenCalledWith(
            trialId,
            "trusted",
            "suspect",
            false,
            '2023-01-01T00:00:00.000Z'
        );
    });

    test('should redirect to "/information/rules" after db operations', async () => {
        await stopTrial(mockReq,mockRes,mockNext);
        expect(mockRes.redirect).toHaveBeenCalledWith("/information/rules");
    })
});