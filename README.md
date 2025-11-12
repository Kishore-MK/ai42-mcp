# AI42-MCP X402 Payment Server

An MCP server that automatically handles web requests with X402 payments. Fetches data from any URL and seamlessly processes payments when required (402 status). Includes payment tracking, balance checking, and spending limits.

## Features

- ✅ Automatic X402 payment handling
- ✅ GET and POST request support
- ✅ Payment history tracking
- ✅ Wallet balance checking
- ✅ Configurable spending limits
- ✅ Transparent payment processing
- ✅ Solana devnet integration

## Setup

### Prerequisites
- Node.js 18+
- Solana wallet private key (base58 format, devnet)
- Claude Desktop or MCP Inspector

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

Required packages:
- `@modelcontextprotocol/sdk`
- `x402-fetch`
- `@solana/web3.js`
- `bs58`
- `zod`

2. **Create `.env` file:**
```bash
SOLANA_PRIVATE_KEY=your_base58_private_key_here
```

**Note:** Your private key should be in base58 format (the default Solana format).

3. **Build the project:**
```bash
npm run build
```

### Configure Claude Desktop

Add to your `claude_desktop_config.json`:

**Windows (WSL):**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "node",
      "args": ["/home/username/path/to/dist/index.js"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_base58_private_key_here"
      }
    }
  }
}
```

**macOS/Linux:**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "node",
      "args": ["/full/path/to/dist/index.js"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_base58_private_key_here"
      }
    }
  }
}
```

4. **Restart Claude Desktop**

## Testing

Use MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Available Tools

### 1. Fetch Data (`fetch-with-payment`)
Fetch data from any URL with automatic payment handling.

**Examples:**
- "Get data from https://api.example.com/endpoint"
- "Fetch https://paid-service.com/premium-data"
- "POST this data to https://api.example.com: {\"message\": \"hello\"}"

### 2. Get Balance (`get-balance`)
Check your current SOL balance on Solana devnet.

**Example:**
- "What's my wallet balance?"
- "Check my SOL balance"

### 3. Payment History (`get-payment-history`)
View all payments made during the current session.

**Examples:**
- "Show me my payment history"
- "What payments have I made?"
- "Show last 5 payments"

### 4. Set Payment Limit (`set-payment-limit`)
Set a maximum amount you're willing to pay per request (in SOL).

**Examples:**
- "Set payment limit to 0.1 SOL"
- "Don't let me spend more than 0.05 SOL per request"
- "Remove payment limit" (set to 0)

## Usage Examples
```
User: Check my balance
Claude: [Uses get-balance tool] Your balance is 2.5 SOL on devnet

User: Set my payment limit to 0.1 SOL
Claude: [Uses set-payment-limit] Payment limit set to 0.1 SOL

User: Get data from https://paid-api.example.com/data
Claude: [Uses fetch-with-payment] Payment of 0.05 SOL made successfully. Here's the data...

User: Show my payment history
Claude: [Uses get-payment-history] You've made 3 payments totaling 0.15 SOL
```

## How It Works

1. **Transparent Payment:** When you fetch a URL, if it returns a 402 status, the MCP automatically processes the payment using your Solana wallet
2. **Payment Tracking:** All payments are logged with amount, recipient, timestamp, and transaction signature
3. **Limit Enforcement:** If a payment limit is set, requests exceeding that amount will be rejected
4. **Session Memory:** Payment history is stored in-memory for the current session

## Security Notes

- Private keys are stored in environment variables
- Currently uses Solana devnet (test network)
- Payment history is session-only (not persisted to disk)
- Always verify payment amounts before setting high limits

## Troubleshooting

**"Bad secret key size" error:**
- Ensure your private key is in base58 format
- You can convert from JSON array or other formats using Solana CLI

**"Module not found" error:**
- Run `npm run build` to compile TypeScript
- Verify the path in your config points to `dist/index.js`

**Connection errors:**
- Check internet connection to Solana devnet
- Verify your wallet has sufficient balance

## Future Enhancements

- Persistent payment history storage
- Mainnet support
- Payment refund mechanisms
- Multi-chain support
- Content marketplace (sell your own data)