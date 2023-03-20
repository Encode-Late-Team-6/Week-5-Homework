import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/lib/ethers';
import * as dotenv from 'dotenv';
dotenv.config();

import * as myTokenJson from './assets/LotteryToken.json';
import * as lotteryJson from './assets/Lottery.json';
import { TransactionResponseDTO, ErrorMessageDTO } from './dto';
import { stat } from 'fs';

const LOT_TOKEN_CONTRACT_ADDRESS = '0xABED7b9374e4e027371457285854d03E3E098991';
const LOTTERY_CONTRACT_ADDRESS = '0xfF7c49034eC99156298a9776F38FBD5e64FD628c';

@Injectable()
export class AppService {
  myTokenContract = null;
  lotteryContract = null;
  provider = null;
  signer = null;

  constructor() {
    this.provider = new ethers.providers.InfuraProvider(
      "goerli",
      process.env.INFURA_API_KEY);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

    this.myTokenContract = new ethers.Contract(
      LOT_TOKEN_CONTRACT_ADDRESS,
      myTokenJson.abi,
      this.provider
    );
    this.lotteryContract = new ethers.Contract(
      LOTTERY_CONTRACT_ADDRESS,
      lotteryJson.abi,
      this.provider
    );
  }

  getLotteryContractAddress(): string {
    return LOTTERY_CONTRACT_ADDRESS;
  }

  async checkState(): Promise<boolean>{
    const state = await this.lotteryContract.betsOpen();
    

    return state;
  }

  async openBets(duration: number):Promise<string>{
    const currentBlock = await this.provider.getBlock("latest");
    const tx = await this.lotteryContract.connect(this.signer).openBets(currentBlock.timestamp + Number(duration));
    const receipt = await tx.wait();

    return receipt.transactionHash;
  }

  async ethBalance(address: string):Promise<string>{
    const balanceBN = await this.provider.getBalance(
      address
    );
    const balance = ethers.utils.formatEther(balanceBN);

    return balance;

  }

  async buyTokens(address:string,amount:string):Promise<string>{

    const ratio = await this.lotteryContract.purchaseRatio();
    const tx = await this.lotteryContract.connect(this.signer).purchaseTokens({
      value: ethers.utils.parseEther(amount).div(ratio),
    });
    const receipt = await tx.wait();

    return receipt.transactionHash;

  }

  async tokenBalance(address:string): Promise<string>{
    const balanceBN = await this.myTokenContract.balanceOf(address);
    const balance = ethers.utils.formatEther(balanceBN);
    return balance;
  }

  async bet(address:string,amount:string):Promise<string>{
    const allowTx = await this.myTokenContract
    .connect(this.signer)
    .approve(this.lotteryContract.address, ethers.constants.MaxUint256);
    await allowTx.wait();
    const tx = await this.lotteryContract.connect(this.signer).betMany(amount);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  async closeLottery():Promise<string>{
    const tx = await this.lotteryContract.connect(this.signer).closeLottery();
    const receipt = await tx.wait();
    return receipt.transactionHash
  }

  async displayPrize(address: string): Promise<string> {
    const prizeBN = await this.lotteryContract.prize(address);
    const prize = ethers.utils.formatEther(prizeBN);
    return prize;
  }

  async claimPrize(address: string, amount: string): Promise<string> {
    const tx = await this.lotteryContract
      .connect(this.signer)
      .prizeWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }


  async displayOwnerPool() : Promise<string>{
    const balanceBN = await this.lotteryContract.ownerPool();
    const balance = ethers.utils.formatEther(balanceBN);
    return balance;
  }
  
  async withdrawTokens(amount: string): Promise<string> {
    const tx = await this.lotteryContract.connect(this.signer).ownerWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }
  
  async burnTokens(address: string, amount: string): Promise<string> {
    const allowTx = await this.myTokenContract
      .connect(this.signer)
      .approve(this.lotteryContract.address, ethers.constants.MaxUint256);
    const receiptAllow = await allowTx.wait();
    const tx = await this.lotteryContract
      .connect(this.signer)
      .returnTokens(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  
  getTokenAddress(): string {
    return LOT_TOKEN_CONTRACT_ADDRESS;
  }

  async getTransactionStatus(txnHash: string): Promise<string> {
    const txnReceipt = await this.provider.getTransaction(txnHash);
    return txnReceipt?.blockNumber ? 'Success' : 'Fail';
  }

  async getTransactionReceipt(txnHash: string): Promise<string> {
    const txnReceipt = await this.provider.getTransaction(txnHash);
    return JSON.stringify(txnReceipt);
  }

 
}