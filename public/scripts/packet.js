// import dataGenerator functions
const { generateRandomCheckSum, generateRandomTime, generateRandomIP, generateRandomCountry } = require('./dataGenerators.js');

// create overall packet - parameter = type of packet [hostile, trusted , suspect]
function PacketFactory(type) {
    let packet = {
        checkSum : generateRandomCheckSum(),
        time : generateRandomTime(),
        ipAddress : generateRandomIP(),
        country : generateRandomCountry(),
        classification: 'unclassified',
        packetType : type,
    };
    let relevantInformation = getRelevantInformation(type);
    for (let key in relevantInformation) {
        packet[key] = relevantInformation[key];
    }
    return packet;
} 

// create relevant information (RIO - group) according to the type of packet and return the object
function getRelevantInformation(type) {
    // When adding fourth RIO data add to this object
    let values = {
        portNumber : {trusted: 80, hostile: 4444},
        protocol : {trusted: 'HTTPS', hostile: 'ICMP'},
        certificates : {trusted: 'Valid', hostile: 'Expired'}
    };
    let keys = Object.keys(values);
    keys = keys.sort(() => Math.random() - 0.5);
    let relevantInfo = {};
    switch (type) {
        case 'trusted':
            keys.forEach(key => relevantInfo[key] = values[key].trusted);
            break;
        case 'suspect':
            let numHostileMin1 = Math.floor(Math.random() * 2) + 1;
            keys.forEach(key => relevantInfo[key] = numHostileMin1-- > 0 ? values[key].hostile : values[key].trusted);

            break;
        case 'hostile':
            let numHostileMin3 = Math.floor(Math.random() * 2) + 3;
            keys.forEach(key => relevantInfo[key] = numHostileMin3-- > 0 ? values[key].hostile : values[key].trusted);
            break;
    
        default:
            break;
    }
    return relevantInfo;
}

function getLocationValues(quadrant) {
    let top;
    let left;
    const horizontalEdge = Math.random() < 0.5;
    switch (quadrant) {
        case "topLeft":
            if (horizontalEdge) {
                top = 0;
                left = Math.floor(Math.random() * 51);
            } else {
                top = Math.floor(Math.random() * 51);
                left = 0;
            }
            break;
        case "topRight":
            if (horizontalEdge) {
                top = 0;
                left = Math.floor(Math.random() * 50) + 51;
            } else {
                top = Math.floor(Math.random() * 51);
                left = 100;
            }
            break;
        case "bottomLeft":
            if (horizontalEdge) {
                top = 100;
                left = Math.floor(Math.random() * 51);
            } else {
                top = Math.floor(Math.random() * 50) + 51;
                left = 0;
            }
            break;
        case "bottomRight":
            if (horizontalEdge) {
                top = 100;
                left = Math.floor(Math.random() * 50) + 51;
            } else {
                top = Math.floor(Math.random() * 50) + 51;
                left = 100;
            }
            break;
         default:
            break;
    }
    return [left, top]
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function setPacketArray() {
    let packets = [];
    let quadrants = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
    let types = ["suspect", "suspect", "trusted", "trusted", "hostile","hostile"];

    for (let q of quadrants) {
        for (let t of types) {
        let packet = PacketFactory(t);
        packet['location'] = getLocationValues(q);
        packets.push(packet);
        }
    }
    shuffleArray(packets);
    return packets.map((x) => x);    
}


module.exports = setPacketArray;