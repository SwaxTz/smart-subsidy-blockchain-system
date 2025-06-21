require("dotenv").config();
const { ethers } = require("ethers");

const contractJson = require("../blockchain/artifacts/contracts/RuzukuToken.sol/RuzukuToken.json");
const contractABI = contractJson.abi;
const contractAddress = process.env.CONTRACTADDRESS;
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(process.env.DEPLOYERPRIVATEKEY, provider);

async function issueTokens(recipientAddress, amount) {
  const parsedAmount = ethers.parseEther(String(amount));

  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  const tx = await contract.transfer(recipientAddress, parsedAmount);
  await tx.wait();

  const senderBalance = await contract.balanceOf(wallet.address);
  const recipientBalance = await contract.balanceOf(recipientAddress);

  console.log(`Transaction Hash: ${tx.hash}`);
  console.log(`From: ${process.env.DEPLOYERADDRESS}`);
  console.log(`To: ${recipientAddress}`);
  console.log(`Amount: ${amount}`);
  console.log(`Senders balance: ${ethers.formatEther(senderBalance)}`);
  console.log(`Recipient balance: ${ethers.formatEther(recipientBalance)}`);
}

// issueTokens("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 100).catch(console.error);

module.exports = { issueTokens };