require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

const contractAddress = process.env.CONTRACTADDRESS;

async function sendTokens(senderAddress, recipientAddress, amount) {

  const signers = await ethers.getSigners();
  const senderSigner = signers.find(s =>  s.address.toLowerCase() === senderAddress.toLowerCase())

  const contract = await ethers.getContractAt("RuzukuToken", contractAddress);
  const parsedAmount = ethers.parseEther(String(amount));

  const tx = await contract.connect(senderSigner).transfer(recipientAddress, parsedAmount);
  await tx.wait();

  const senderBalance = await contract.balanceOf(senderSigner);
  const recipientBalance = await contract.balanceOf(recipientAddress);

  console.log(`From: ${senderSigner.address}`);
  console.log(`To: ${recipientAddress}`);
  console.log(`Amount: ${amount}`);
  console.log(`Senders balance: ${ethers.formatEther(senderBalance)}`);
  console.log(`Recipient balance: ${ethers.formatEther(recipientBalance)}`);
}

sendTokens( "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
            "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            100).catch(console.error);