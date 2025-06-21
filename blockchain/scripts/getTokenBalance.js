require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

const contractAddress = process.env.CONTRACTADDRESS;

async function getTokenBalance(accountAddress) {
  const contract = await ethers.getContractAt("RuzukuToken", contractAddress);
  const balance = await contract.balanceOf(accountAddress);

  console.log("Ruzuku Tokens: ", ethers.formatEther(balance));
  return ethers.formatEther(balance);
}

getTokenBalance('0x70997970C51812dc3A010C7d01b50e0d17dc79C8').catch(console.error);
