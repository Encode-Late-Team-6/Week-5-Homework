import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Lottery__factory, LotteryToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
    // input proposals
    // const args = process.argv.slice(2);
    // const tokenName = args[0];
    // const tokenSymbol= args[1];

    // input proposals
    const args = process.argv.slice(2);
    const tokenAddress = args[0];
    const purchaseRatio = args[1];
    const betPrice = args[2];
    const betFee = args[3];

    // Provider and wallet
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY)
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic || mnemonic.length <= 12) throw new Error("Missing environment: Mnemonic seed")
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(wallet.address)
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Ẁallet balance: ${balance} Wei`);

    // Deploy contract
    // const lotteryTokenFactory = new LotteryToken__factory(signer);
    // const lotteryTokenContract = await lotteryTokenFactory.deploy(tokenName, tokenSymbol);
    // const deployTxReceipt = await lotteryTokenContract.deployTransaction.wait();
    // console.log({ deployTxReceipt });
    // Deploy contract
    const lotteryFactory = new Lottery__factory(signer);
    const lotteryContract = await lotteryFactory.deploy(tokenAddress, purchaseRatio, betPrice, betFee);
    const deployTxReceipt = await lotteryContract.deployTransaction.wait();
    console.log({ deployTxReceipt });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});