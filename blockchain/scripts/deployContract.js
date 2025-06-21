const hre = require("hardhat");
const { ethers } = hre;
async function deployContract() {
	const accounts = await hre.ethers.getSigners();
 	console.log(`Deployer Address: ${accounts[0].address}`);

  	const contract = await hre.ethers.getContractFactory("RuzukuToken");
  	const initialSupply = hre.ethers.parseEther("100000");

  	const token = await contract.deploy(initialSupply);
  	await token.waitForDeployment();

  	const contractAddress = await token.getAddress();
  	console.log("Contract Address: ", contractAddress);
}

deployContract().catch(console.error);
