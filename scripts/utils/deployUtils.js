const fs = require("fs");

function saveContractAddress(name, address) {
  const addresses = fs.existsSync("contractAddresses.json")
    ? JSON.parse(fs.readFileSync("contractAddresses.json"))
    : {};
  addresses[name] = address;
  fs.writeFileSync("contractAddresses.json", JSON.stringify(addresses, null, 2));
}

module.exports = { saveContractAddress };