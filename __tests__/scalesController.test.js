const {createScalesArray, addScaleToDB} = require("../controllers/scalesController");
const request = require("supertest");

jest.mock("../services/dbServices", () => ({
    insertScale : jest.fn(),
    insertItem : jest.fn() 
}));

const dbServices = require("../services/dbServices");

describe('createScalesArray function', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        
        mockReq = {
            session : {
                condition : 'noAdvisor'
            }
        };
        mockRes = {redirect:jest.fn()};
        mockNext = jest.fn();
    });
    test('should create an array consisting of sart, nasa, and tias scales and redirect to one of them', async () => {
        await createScalesArray(mockReq, mockRes);

        expect(mockReq.session.scales).toBeDefined();
        expect(mockReq.session.scales.length).toBe(2);
        expect(mockRes.redirect).toHaveBeenCalledWith(expect.any(String))
    })
});

describe('addScaleToDB function', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            dbServices,
            session : {
                trialNumber : 3,
                scales : ['/scales/sart', '/scales/nasa'],
                username : 2
            },
            body : {
                "sart-1" : 4,
                "sart-2" : 5,
                "sart-3" : 6 
            }
        };
        mockRes = {redirect:jest.fn()};
        mockNext = jest.fn();  
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should add scale to db', async () => {
        await addScaleToDB(mockReq, mockRes);

        expect(dbServices.insertScale).toHaveBeenCalledWith(
            2,
            "sart",
            "mid-trials"
        );
    });
    test('should use scale id to add items to db', async () => {
        dbServices.insertScale.mockResolvedValue(2);
        await addScaleToDB(mockReq, mockRes);

        expect(dbServices.insertItem).toHaveBeenCalledTimes(3);
        expect(dbServices.insertItem).toHaveBeenNthCalledWith(1,1,2,4);
        expect(dbServices.insertItem).toHaveBeenNthCalledWith(2,2,2,5);
        expect(dbServices.insertItem).toHaveBeenNthCalledWith(3,3,2,6);
    });

    test('should redirect to "/scales/nasa"', async () => {
        await addScaleToDB(mockReq, mockRes);
        expect(mockRes.redirect).toHaveBeenCalledWith('/scales/nasa');
    });
    test('should redirect to "/information/rules"', async () => {
        mockReq.session.scales = []; // create condition where last scale has been added to db
        await addScaleToDB(mockReq, mockRes);
        expect(mockRes.redirect).toHaveBeenCalledWith('/information/rules');
    })
})
