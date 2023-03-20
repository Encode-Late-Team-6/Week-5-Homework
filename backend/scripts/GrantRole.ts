import { ethers } from "hardhat";
import { LotteryToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
async function main() {
    const args = process.argv.slice(2);
    const tokenAddress = "0xe8a8EC4C12E387De454cd8e06c8513c294f36798";
    const account = args[0];

    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    );
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) {
        throw new Error("Private key missing");
    }

    const wallet = new ethers.Wallet(privateKey);
    console.log("Connected to the wallet address", wallet.address);
    const signer = wallet.connect(provider);

    const contractFactory = new LotteryToken__factory(signer);

    //Attach an address to the contract
    console.log("Attaching to ERC20TokenVotes contract at address", tokenAddress);
    const contract = await contractFactory.attach(tokenAddress);
    console.log("Successfully attached");

    //The deployer mint token for the account 1
    const mintTx = await contract.grantRole(ROLE, account);
    const mintTransactionReceipt = await mintTx.wait();
    console.log(mintTransactionReceipt)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});