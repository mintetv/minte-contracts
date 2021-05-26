var path = require('path');
require('dotenv').config();
const { ethers, upgrades } = require("hardhat");


const main = async () => {

	var timelock = path.join(process.env.TIMELOCK_CONTRACT);

  const signer = await ethers.getSigner();
  console.log("The signer is... ", signer.address);

  // Set proxy admin privilages
  console.log("Setting ProxyAdmin...");
  await upgrades.admin.transferProxyAdminOwnership(timelock); // The owner of the proxy is the GnosisSafeTimelock Address
  console.log("ProxyAdmin is set as: ", timelock);

}

main();
