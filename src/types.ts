


export interface PaymentInfo {
    amount: number;
    recipient: string;
    signature: string;
    wallet: string;
} 

export interface PaymentClient {
    fetch(url: string, options?: RequestInit): Promise<Response>;
}

export interface PaymentClientConfig {
    network: 'solana-mainnet' | 'solana-devnet' | 'base-sepolia';
    maxPaymentAmount?: bigint;
}



export type ErrorCode =
    | 'INVALID_REQUEST'
    | 'PAYMENT_REQUIRED'
    | 'PAYMENT_FAILED'
    | 'INTERNAL_ERROR';