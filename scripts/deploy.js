const main = async () => {
  const signer = await ethers.getSigner();

  console.log("The signer is... ", signer.address);

  const Token = await ethers.getContractFactory("MinteToken");
  const token = await upgrades.deployProxy(Token, [signer.address, signer.address, ethers.utils.parseEther('1000000000000')], { initializer: 'initialize' });
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const MinteVestCliff = await ethers.getContractFactory("MinteVestCliff");
  const vestCliff = await MinteVestCliff.deploy(token.address); // set vest cliff to token address
  console.log("MinteVestCliff deployed: ", vestCliff.address);

  // const lockerAddress = await token.getContractAddress(ethers.utils.formatBytes32String("TokenLocker"));
  // console.log("Locker is set as: ", lockerAddress);

  console.log("Setting admin...");
  await upgrades.admin.transferProxyAdminOwnership(signer.address);
  console.log("Admin is set as: ", signer.address);

  const ownerBalance = await token.balanceOf(signer.address);
  console.log("Balance of Admin is: ", BigInt(ownerBalance));

  let toTransfer = ethers.utils.parseEther('3000000000');
  await token.transfer(vestCliff.address, toTransfer);
  const balance = await token.balanceOf(vestCliff.address);
  console.log("Balance of address VestCliff is: ", BigInt(balance));

  // await token.transfer('0xdd2fd4581271e230360230f9337d5c0430bf44c0', 2000000000);
  // const balance19 = await token.balanceOf('0xdd2fd4581271e230360230f9337d5c0430bf44c0');
  // console.log("Balance of address 19 is: ", BigInt(balance19));

  let salary = ethers.utils.parseEther('1000000000');
  await token.approve(vestCliff.address, ethers.utils.parseEther('2000000000')); // need to approve transfer for cliff contract
  await vestCliff.createClaim('0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b', [1000, 5000], [salary, salary]);
  const vestedAddress = await vestCliff.beneficiaryClaims('0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b');
  console.log("Vested beneficiaryClaims: ", BigInt(vestedAddress));

  const amount = await vestCliff.tokenAmounts(0);
  console.log("Token amount to claim: ", BigInt(amount[0]), BigInt(amount[1]));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const amount2 = await vestCliff.tokenAmounts(0);
  console.log("Token amount to claim2: ", BigInt(amount2[0]), BigInt(amount2[1]));




}

main();
