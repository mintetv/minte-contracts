const { ethers, upgrades } = require("hardhat");
var path = require('path');
require('dotenv').config();


const main = async () => {

	// UPGRADE TIMELOCK SAFE
	var delayTime = 150; // 60*60*6 // 6 hour delay time for admin
	var executors = path.join(process.env.TIMELOCK_GNOSIS_SAFE); // env vars
	var proposers = path.join(process.env.TIMELOCK_GNOSIS_SAFE);

	// VAULT SAFE ADDRESS
	var vaultDelay = 60*60*24 // set to 24 hour delay
	var vaultExecutors = path.join(process.env.VAULT_GNOSIS_SAFE);
	var vaultProposers = path.join(process.env.VAULT_GNOSIS_SAFE);

  const signer = await ethers.getSigner();
  console.log("The signer is... ", signer.address);

  let Token = await ethers.getContractFactory("MinteToken");
  let VestStream = await ethers.getContractFactory('VestStream');
  let MultiSigWallet = await ethers.getContractFactory('MultiSigWallet');
	let Timelock = await ethers.getContractFactory('TimelockController');
  // let Timelock = await ethers.getContractFactory('Timelock'); //old timelock
  let TokenVault = await ethers.getContractFactory('TokenVault');

	const upgradeLock = await Timelock.deploy(delayTime, [proposers], [executors]); // 2.5 min wait time
  await upgradeLock.deployed();
  console.log("ERC20Upgrades Timelock deployed to: ", upgradeLock.address);
	await hre.run("verify:verify", {
		address: upgradeLock.address,
		constructorArguments: [delayTime, [proposers], [executors]],
	});

	const vaultLock = await Timelock.deploy(vaultDelay, [vaultProposers], [vaultExecutors]); // 2.5 min wait time
  await vaultLock.deployed();
  console.log("Vault Timelock deployed to: ", vaultLock.address);
	await hre.run("verify:verify", {
		address: vaultLock.address,
		constructorArguments: [vaultDelay, [vaultProposers], [vaultExecutors]],
	});

	// Mint 1 billion tokens
  const token = await upgrades.deployProxy(Token, [upgradeLock.address, signer.address, ethers.utils.parseEther('1000000000')], { initializer: 'initialize' });
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // Set proxy admin privilages
  console.log("Setting ProxyAdmin...");
  await upgrades.admin.transferProxyAdminOwnership(upgradeLock.address); // The owner of the proxy is the GnosisSafeTimelock Address
  console.log("ProxyAdmin is set as: ", upgradeLock.address);

	const ownerBalance = await token.balanceOf(signer.address);
  console.log("Balance of Admin is: ", BigInt(ownerBalance));

	// MultiSig for testing purpose
	const multiSig = await MultiSigWallet.deploy([ signer.address ], 1); // change to 2 confirmations
	await multiSig.deployed();
	console.log("MultiSig deployed to: ", multiSig.address);


	//////////////////////////////
	/// ECOSYSTEM VAULT /////////
	////////////////////////////
  ecosystemVault = await TokenVault.deploy('Ecosystem Vault', token.address, vaultLock.address, multiSig.address, 8);
  await ecosystemVault.deployed();
  console.log("EcosystemVault deployed to: ", ecosystemVault.address);
  // await ecosystemVault.transferOwnership(vaultLock.address);
  await token.transfer(ecosystemVault.address, ethers.utils.parseEther('150000000'));
	// Verify Contract
	await hre.run("verify:verify", {
		address: ecosystemVault.address,
		constructorArguments: ['Ecosystem Vault', token.address, vaultLock.address, multiSig.address, 8],
	});

	//////////////////////////////
	/// DEVELOPER VAULT /////////
	////////////////////////////
  developerVault = await TokenVault.deploy('Developer Vault', token.address, vaultLock.address, multiSig.address, 8);
  await developerVault.deployed();
  console.log("DeveloperVault deployed to: ", developerVault.address);
  // await developerVault.transferOwnership(vaultLock.address);
  await token.transfer(developerVault.address, ethers.utils.parseEther('150000000'));
	// Verify Contract
	await hre.run("verify:verify", {
		address: developerVault.address,
		constructorArguments: ['Developer Vault', token.address, vaultLock.address, multiSig.address, 8],
	});

	//////////////////////////////
	/// STAKING VAULT /////////
	////////////////////////////
  stakingVault = await TokenVault.deploy('Staking Vault', token.address, vaultLock.address, multiSig.address, 8);
  await stakingVault.deployed();
  console.log("StakingVault deployed to: ", stakingVault.address);
  // await stakingVault.transferOwnership(vaultLock.address);
  await token.transfer(stakingVault.address, ethers.utils.parseEther('150000000'));
	// Verify Contract
	await hre.run("verify:verify", {
		address: stakingVault.address,
		constructorArguments: ['Staking Vault', token.address, vaultLock.address, multiSig.address, 8],
	});


	//////////////////////////////
	/// COMMUNITY VAULT /////////
	////////////////////////////
  communityVault = await TokenVault.deploy('Community Vault', token.address, vaultLock.address, multiSig.address, 8);
  await communityVault.deployed();
  console.log("CommunityVault deployed to: ", communityVault.address);
  // await communityVault.transferOwnership(vaultLock.address);
  await token.transfer(communityVault.address, ethers.utils.parseEther('400000000'));
	// Verify Contract
	await hre.run("verify:verify", {
		address: communityVault.address,
		constructorArguments: ['Community Vault', token.address, vaultLock.address, multiSig.address, 8],
	});


	//////////////////////////////
	/// FOUNDERS VEST STREAM /////////
	////////////////////////////
  foundersVestStream = await VestStream.deploy(token.address);
  await foundersVestStream.deployed();
  console.log("FoundersVestStream deployed to: ", foundersVestStream.address);
	// Verify Contract
	await hre.run("verify:verify", {
		address: foundersVestStream.address,
		constructorArguments: [token.address],
	});

  // Mint test tokens and send them to the vesting contract.
  await token.transfer(foundersVestStream.address, ethers.utils.parseEther('150000000'));
  const foundersBalance = await token.balanceOf(foundersVestStream.address);
  console.log("Tokens in FoundersVestStream: ", BigInt(foundersBalance));

	////////////////////////////////////
	/// DEVELOPERS VEST STREAM/////////
	/////////////////////////////////
  developersVestStream = await VestStream.deploy(token.address);
  await developersVestStream.deployed();
  console.log("DevelopersVestStream deployed to: ", developersVestStream.address);
	// Verify Contract
	await hre.run("verify:verify", {
		address: developersVestStream.address,
		constructorArguments: [token.address],
	});

}

main();
