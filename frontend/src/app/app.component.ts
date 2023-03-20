import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ethers, BigNumber, Contract, Wallet } from 'ethers';
import * as tokenJson from '../assets/LotteryToken.json'
import { TransactionResponseDTO, ErrorMessageDTO } from '../dto';

declare global {
  interface Window {
    ethereum: any;
  }
}

const enum API_URLS {
  STATE = 'http://localhost:3000/check-state',
  MY_TOKEN_ADDRESS = 'http://localhost:3000/token-contract-address',
  CONTRACT_ADDRESS = 'http://localhost:3000/contract-address',
  BUYING = 'http://localhost:3000/buy-tokens',
  BETTING = 'http://localhost:3000/bet',
  CLOSING = 'http://localhost:3000/close-lottery',
  PRIZE = 'http://localhost:3000/display-prize',
  CLAIM = 'http://localhost:3000/claim-prize',
  BURNING = 'http://localhost:3000/burn-tokens',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  blockNumber: number | string | undefined;
  provider: ethers.providers.BaseProvider;
  tokenContract: Contract | undefined;
  totalSupply: number | undefined;
  bettingOpen = false;

  myTokenContractAddress: string | undefined;
  ContractAddress: string | undefined;

  isWalletConnected = false;
  userWallet: Wallet | undefined;
  userAddress: string | undefined;
  userETHBalance: number | undefined;
  userTokenBalance: string | number | undefined;

  // mintingInfo: TransactionResponseDTO | undefined;
  mintingInfo:string | undefined;
  bettingInfo:string | undefined;
  burningInfo:string | undefined;
  claimingInfo:string | undefined;
  closingInfo:string | undefined;
  prizeInfo:string | undefined;
  delegatingInfo: TransactionResponseDTO | undefined;
  votingInfo: TransactionResponseDTO |  undefined;
  winningProposalInfo: TransactionResponseDTO |  undefined;

  mintingError: ErrorMessageDTO | undefined;
  delegatingError: ErrorMessageDTO | undefined;
  votingError: ErrorMessageDTO |  undefined;
  winningProposalError: ErrorMessageDTO |  undefined;

  loadingMintingTxnInfo = false;
  loadingBettingTxnInfo = false;
  loadingBurningTxnInfo = false;
  loadingClaimingTxnInfo = false;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli');
  }

  getContractAddress() {
    this.http
      .get<{ result: string }>(API_URLS.CONTRACT_ADDRESS)
      .subscribe((answer) => {
        this.ContractAddress = answer.result
      });
  }

  getMyTokenContractAddress() {
    this.http
      .get<{ result: string }>(API_URLS.MY_TOKEN_ADDRESS)
      .subscribe((answer) => {
        this.myTokenContractAddress = answer.result
        this.getTokenInfo();
      });
  }


  getTokenInfo() {
    if (!this.myTokenContractAddress) return;
    const { abi } = tokenJson;

    this.tokenContract = new Contract(
      this.myTokenContractAddress,
      abi,
      this.userWallet ?? this.provider
    );

    this.tokenContract['totalSupply']().then((totalSupplyBN: BigNumber) => {
      const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
      const totalSupplyNumber = parseFloat(totalSupplyString);

      this.totalSupply = totalSupplyNumber;
    })
  }

  async connectWallet() {
    if (!window?.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    this.userAddress = await signer.getAddress();

    const balanceBN = await signer.getBalance();
    const balanceString = ethers.utils.formatEther(balanceBN);
    const balance = parseFloat(balanceString);
    this.userETHBalance = balance;

    this.isWalletConnected = true;

    this.userTokenBalance = await this.tokenContract?.['balanceOf']?.(this.userAddress) || 'Cannot load the token balance data';
  }

  checkstate(){
    this.http
    .get<boolean>(API_URLS.STATE)
    .subscribe((answer) => {
      this.bettingOpen = answer
    });
  }
  closebets(){
    this.http
    .get<{ result: string }>(API_URLS.CLOSING)
    .subscribe((answer) => {
      this.closingInfo = answer.result
    });
  }
  requestTokens(value: string) {
    const mintValue = value;

    const body = {
      address: this.userAddress,
      amount: mintValue,
    }
    this.loadingMintingTxnInfo = true;

    this.http.post<{result: string}>(API_URLS.BUYING, body).subscribe((ans) => {
      this.loadingMintingTxnInfo = false;
      this.mintingInfo = ans.result;
    });
  }

  bet(value: string){
    const betValue = value;
    const body = {
      address: this.userAddress,
      amount: betValue,
    }
    this.loadingBettingTxnInfo = true;

    this.http.post<string>(API_URLS.BETTING, body).subscribe((ans) => {
      this.bettingInfo = ans;
      this.loadingBettingTxnInfo = false;
    });
  }

  burn(value: string){
    const burnValue = value;
    const body = {
      address: this.userAddress,
      amount: burnValue,
    }
    this.loadingBurningTxnInfo = true;

    this.http.post<string>(API_URLS.BURNING, body).subscribe((ans) => {
      this.burningInfo = ans;
      this.loadingBurningTxnInfo = false;
    });
  }
  claim(value: string){
    const claimValue = value;
    const body = {
      address: this.userAddress,
      amount: claimValue,
    }
    this.loadingClaimingTxnInfo = true;

    this.http.post<string>(API_URLS.CLAIM, body).subscribe((ans) => {
      this.claimingInfo = ans;
      this.loadingClaimingTxnInfo = false;
    });
  }

  displayPrize(){
    const body ={address: this.userAddress,}
    this.http
    .post<string >(API_URLS.PRIZE,body)
    .subscribe((answer) => {
      this.prizeInfo = answer
    });
  }

}