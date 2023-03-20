export class ErrorMessageDTO {
  message: string;
  detailedMessage: string;
}

export class RequestTokenDTO {
  address: string;
  amount: string;
}

export class TransactionResponseDTO {
  message: string;
  transactionHash: string;
  etherscanLink: string;
}

export class AmountDTO {
  amount: string;
}

export class AddressDTO { 
  address: string;
}