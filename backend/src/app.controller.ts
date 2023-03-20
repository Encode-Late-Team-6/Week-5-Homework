import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { RequestTokenDTO, AmountDTO, AddressDTO, TransactionResponseDTO, ErrorMessageDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/contract-address')
  getLotteryContractAddress(): { result: string } {
    return { result: this.appService.getLotteryContractAddress() };
  }

  @Get('/token-contract-address')
  getTokenAddress(): { result: string } {
    return { result: this.appService.getTokenAddress() };
  }

  @Get('/check-state')
  getCheckState(): Promise<boolean>  {
    return this.appService.checkState() ;
  }

  @Get('/openbets')
  getOpenBets(
    @Query('duration') duration: number,
  ): Promise<string> {
    return this.appService.openBets(duration);
  }

  @Get('transaction-status/:txnHash')
  getTransactionStatus(@Param('txnHash') txnHash: string): Promise<string> {
    return this.appService.getTransactionStatus(txnHash);
  }

  @Get('transaction-receipt/:txnHash')
  getTransactionReceipt(@Param('txnHash') txnHash: string): Promise<string> {
    return this.appService.getTransactionReceipt(txnHash);
  }

  @Get('/eth-balance')
  getEthBalance(
    @Query('address') address: string,
  ): Promise<string> {
    return this.appService.ethBalance(address);
  }

  @ApiBody({ description: 'Example payload (Address, amount)', type: RequestTokenDTO })
  @Post('/buy-tokens')
  getbuyTokens(
    @Body() body: RequestTokenDTO
  ): Promise<string> {
    const { address, amount } = body;
    return this.appService.buyTokens(address,amount);
  }

  @Get('/token-balance')
  gettokenBalance(
    @Query('address') address: string,
  ): Promise<string> {
    return this.appService.tokenBalance(address);
  }


  @ApiBody({ description: 'Example payload (Address, amount)', type: RequestTokenDTO })
  @Post('/bet')
  getbet(
    @Body() body: RequestTokenDTO
  ): Promise<string> {

    const { address, amount } = body;
    return this.appService.bet(address,amount);
  }

  @Get('/close-lottery')
  getcloseLottery(): Promise<string>  {
    return this.appService.closeLottery() ;
  }

  @ApiBody({ description: 'Example payload (Address, amount)', type: RequestTokenDTO })
  @Post('/display-prize')
  getprize(
    @Body() body: AddressDTO
  ): Promise<string> {
    const { address } = body;
    return this.appService.displayPrize(address);
  }

  @ApiBody({ description: 'Example payload (Address, amount)', type: RequestTokenDTO })
  @Post('/claim-prize')
  getClaimPrize(
    @Body() body: RequestTokenDTO
  ): Promise<string> {

    const { address, amount } = body;
    return this.appService.claimPrize(address,amount);
  }

  @Get('/owner-pool')
  getownerPool(): Promise<string>  {
    return this.appService.displayOwnerPool() ;
  }

  @ApiBody({ description: 'Example payload (amount)', type: AmountDTO })
  @Post('/withdraw-tokens')
  getWithdraw(
    @Body() body: AmountDTO
  ): Promise<string> {

    const { amount } = body;
    return this.appService.withdrawTokens(amount);
  }

  @ApiBody({ description: 'Example payload (Address, amount)', type: RequestTokenDTO })
  @Post('/burn-tokens')
  getburnTokens(
    @Body() body: RequestTokenDTO
  ): Promise<string> {

    const { address, amount } = body;
    return this.appService.burnTokens(address,amount);
  }

}