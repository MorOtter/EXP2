exports.startTrial = async (req, res, next) => {
    try {
        if (!req.session.condition) {
            return res.redirect('/');
        }
        
        // Retrieve experiment info
        
        const condition = req.session.condition;
        const group = req.session.groupName;
        const censorship = req.session.censoredInfo;
        let conditionText = '';
        const censoredArrayNumber = req.session.censoredArrayNumber;
        req.session.trialStartTime = new Date().toISOString();
        
        const packetArray = req.session.packetArray.map(x => x);
    
        // set condition text to be more user friendly
        switch (condition) {
        case "noAdvisor":
            conditionText = ""; 
            break;
        case "aiAdvisor":
            conditionText = "This is the recommendation of an A.I Expert";
            break;
        case "humanAdvisor":
            conditionText = "This is the recommendation of a human expert";
            break;
        default:
            conditionText = ''; // Default to no text
        }
        res.render('trial.ejs', { conditionText, group, censorship, censoredArrayNumber, packetArray: JSON.stringify(packetArray)})
    } catch (err) {
        console.error(err);
    }
}

exports.stopTrial = async (req, res, next) => {
    try {
        const trialEndTime = req.body["trialEndTime"];
        const trialType = req.session.trialNumber === 0 ? 'test' : 'main';
        const trialId = await req.dbServices.insertTrial(req.session.participantId, trialType, req.session.trialNumber, req.session.trialStartTime, trialEndTime);
        req.session.trialNumber++;

        for (let input of req.body["input"]) {
            input['time'] = input['time'] ? input['time'] : new Date().toISOString();
            await req.dbServices.insertPacket(trialId, input.user, input.advisor, input.accepted, input.time);
        }
        res.status(200).json({ message: 'Regular data received successfully' });

    } catch (err) {
        console.error("Error caught :",err);
    }
}

const zlib = require('zlib');


// Helper function for base64 gzip decompression
function decompressBase64Gzip(data) {
    return new Promise((resolve, reject) => {
        try {
            const binaryString = Buffer.from(data, 'base64').toString('binary');
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            zlib.gunzip(Buffer.from(bytes), (err, decompressedBuffer) => {
                if (err) return reject(err);

                try {
                    const json = JSON.parse(decompressedBuffer.toString());
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Route handler function
exports.addGazeData = async (req, res) => {

    try {
        const decompressedData = await decompressBase64Gzip(req.body.data);
        const trialId = await req.dbServices.getLastTrialId();

        res.status(200).json({ message: "Gaze Data stored" });

        // Perform database operations asynchronously in the background.
        (async () => {
            try {
                await Promise.all(decompressedData.map(gazeData =>
                    req.dbServices.insertGazeData(trialId, parseFloat(gazeData.x), parseFloat(gazeData.y), gazeData.time)
                ));
            } catch (error) {
                console.error("Error inserting gaze data:", error);
            }
        })();
    } catch (err) {
        console.log("Error at the endpoint:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



