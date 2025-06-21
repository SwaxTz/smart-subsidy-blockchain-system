require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

const contractAddress = process.env.CONTRACTADDRESS;

async function getAddresses() {
  const accounts = await hre.ethers.getSigners();
	const contract = await ethers.getContractAt("RuzukuToken", contractAddress);

	accounts.map(async (account) => {
		const address = await account.address;
		const ruzBalace = await contract.balanceOf(account.address);
		console.log("Account: ", address);
		console.log("RZK Tokens: ", ethers.formatEther(ruzBalace));
		console.log("\n");
	})
}

getAddresses();