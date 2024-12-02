// Generate a random IP address
const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Generate random CheckSum value
const generateRandomCheckSum = () => {
  const values = ['Valid', 'Invalid', 'Zero'];
  return values[Math.floor(Math.random() * values.length)];
}

//  Generate random 24hr clock time
const generateRandomTime = () => {
  let hours = Math.floor(Math.random() * 24);
  let minutes = Math.floor(Math.random() * 60);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours} : ${minutes}`;
}

// Generate a random country from a predefined list
const generateRandomCountry = () => {
  const countries = [
    "Itarnia",
    "Dinlan",
    "Audadstan",
    "Norlandmar",
    "Crentotaninia",
    "Axphain",
    "The Republic of Hraintiasey",
    "Fisker",
    "Andri Caba",
    "United Nitreareia",
    "Isanuai Island",
    "Slandsprus",
    "Belgardia",
    "Hansland",
    "Adol",
    "The Democratic Republic of Eastern Barando",
    "Cogo",
    "Donovia",
    "Novoselic",
    "Limenisland"
];

  return countries[Math.floor(Math.random() * countries.length)];
};

module.exports = {
  generateRandomCheckSum,
  generateRandomCountry,
  generateRandomIP,
  generateRandomTime
};