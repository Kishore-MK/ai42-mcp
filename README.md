# AI42 MCP Server

<div align="center">

**X402 Payment MCP Server for Claude Desktop**

[![npm version](https://img.shields.io/npm/v/@ai42/mcp.svg)](https://www.npmjs.com/package/@ai42/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

[Quick Start](#quick-start) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## Overview

AI42 MCP Server enables Claude Desktop to automatically handle web requests with X402 payments. Fetch data from any URL and seamlessly process cryptocurrency payments when required (402 status). Includes payment tracking, balance checking, and spending limits.

### ✨ Features

- 🌐 **Automatic Payment Handling**: Transparent X402 payment processing on 402 responses
- 🔄 **GET & POST Support**: Full HTTP method support for API interactions
- 💰 **Payment Management**: Track history, check balance, set spending limits
- ⚡ **Solana Integration**: Built on Solana devnet/mainnet
- 🔒 **Type-safe**: Full TypeScript support
- 🎯 **Zero Configuration**: Works out of the box with Claude Desktop

### 🛠️ Available Tools

| Tool                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| `fetch-with-payment`  | Fetch data from URLs with automatic payments     |
| `get-balance`         | Check wallet SOL balance                         |
| `get-payment-history` | View all payments made during session            |
| `set-payment-limit`   | Set maximum spending limit per request           |

---

## Installation

### Prerequisites

- Node.js 18+
- Solana wallet private key (base58 format)
- Claude Desktop

### Quick Install

No manual installation needed! Just configure Claude Desktop:

**Add to `claude_desktop_config.json`:**

**Windows:**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "npx",
      "args": ["-y", "@ai42/mcp"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_base58_private_key_here"
      }
    }
  }
}
```

**macOS:**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "npx",
      "args": ["-y", "@ai42/mcp"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_base58_private_key_here"
      }
    }
  }
}
```

**Linux:**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "npx",
      "args": ["-y", "@ai42/mcp"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_base58_private_key_here"
      }
    }
  }
}
```

### Config File Locations

| Platform | Path                                                      |
| -------- | --------------------------------------------------------- |
| Windows  | `%APPDATA%\Claude\claude_desktop_config.json`             |
| macOS    | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux    | `~/.config/Claude/claude_desktop_config.json`             |

**After adding config:** Restart Claude Desktop!

---

## Quick Start

### Getting Your Private Key

**Generate Solana Keypair:**
```bash
solana-keygen new --outfile ~/.config/solana/id.json
solana-keygen pubkey ~/.config/solana/id.json
```

**Export Private Key (base58 format):**
```bash
cat ~/.config/solana/id.json
# Copy the array, then convert to base58
```

⚠️ **Never commit private keys to version control!**

### First Request

Once configured and Claude Desktop is restarted, simply ask:

```
You: Check my wallet balance

Claude: [Uses get-balance tool] Your balance is 2.5 SOL on devnet
```

---

## Usage

### Example Conversations

#### Fetch Data from URL

```
You: Get data from https://api.example.com/endpoint

Claude: [Uses fetch-with-payment] Here's the data from the API...
```

#### Fetch with Payment

```
You: Fetch https://paid-service.com/premium-data

Claude: [Uses fetch-with-payment] Payment of 0.05 SOL made successfully. 
Here's the premium data...
```

#### POST Request

```
You: POST this data to https://api.example.com: {"message": "hello"}

Claude: [Uses fetch-with-payment] Successfully posted. Response: {...}
```

#### Check Balance

```
You: What's my SOL balance?

Claude: [Uses get-balance] Your current balance:
- Balance: 2.5 SOL
- Network: devnet
- Address: 7xK...abc
```

#### Set Payment Limit

```
You: Set payment limit to 0.1 SOL

Claude: [Uses set-payment-limit] Payment limit set to 0.1 SOL. 
Any request exceeding this amount will be rejected.
```

#### View Payment History

```
You: Show my payment history

Claude: [Uses get-payment-history] 
Total payments: 3
Total spent: 0.15 SOL

Recent payments:
1. 0.05 SOL to xyz...abc at 2025-11-12T10:30:00Z
2. 0.08 SOL to def...123 at 2025-11-12T11:45:00Z
3. 0.02 SOL to ghi...789 at 2025-11-12T12:15:00Z
```

---

## Tool Reference

### 1. `fetch-with-payment`

Fetch data from any URL with automatic payment handling.

**Parameters:**
- `url` (string, required): URL to fetch
- `method` (string, optional): HTTP method - "GET" or "POST" (default: "GET")
- `body` (string, optional): JSON string for POST requests

**Returns:**
```typescript
{
  success: boolean;
  data: any;
  payment_made: boolean;
  payment_amount: number; // in SOL
}
```

**Example:**
```
Get data from https://api.weather.com/current
```

### 2. `get-balance`

Check current SOL balance in your wallet.

**Parameters:** None

**Returns:**
```typescript
{
  balance: number;      // SOL amount
  unit: "SOL";
  network: string;      // "devnet" or "mainnet"
  address: string;      // Public key
}
```

**Example:**
```
Check my wallet balance
```

### 3. `get-payment-history`

View all payments made during the current session.

**Parameters:**
- `limit` (number, optional): Maximum records to return (default: all)

**Returns:**
```typescript
{
  total_payments: number;
  total_spent: number;     // Total SOL spent
  records: Array<{
    url: string;
    amount: number;        // in SOL
    recipient: string;
    timestamp: string;
    signature: string;
  }>;
}
```

**Example:**
```
Show last 5 payments
```

### 4. `set-payment-limit`

Set maximum spending limit per request. Set to 0 to remove limit.

**Parameters:**
- `limit` (number, required): Maximum SOL amount (0 to remove)

**Returns:**
```typescript
{
  message: string;
  current_limit: number | null;
}
```

**Example:**
```
Don't let me spend more than 0.05 SOL per request
```

---

## How It Works

### The X402 Payment Flow

1. **Request**: Claude makes a request to a URL
2. **402 Response**: If the endpoint requires payment, it returns HTTP 402
3. **Automatic Payment**: The MCP server automatically processes the payment using your Solana wallet
4. **Retry**: The request is retried with payment proof
5. **Success**: Data is returned to Claude

### Payment Tracking

- All payments are logged in-memory during the session
- Track amounts, recipients, timestamps, and transaction signatures
- View history anytime with `get-payment-history`

### Spending Limits

- Set a maximum amount per request to prevent overspending
- Requests exceeding the limit are automatically rejected
- Remove limits by setting to 0

---

## Advanced Usage

### Testing with MCP Inspector

For development and debugging:

```bash
# Install globally or use npx
npx @modelcontextprotocol/inspector npx @ai42/mcp
```

This opens a web UI where you can:
- See all registered tools
- Test tool calls with custom inputs
- View request/response JSON
- Debug payment flows

### Environment Variables

If running locally (not via npx in Claude config):

```bash
# .env file
SOLANA_PRIVATE_KEY=your_base58_private_key_here
```

### Network Configuration

Currently supports:
- **Solana Devnet** (default): For testing with test SOL
- **Solana Mainnet**: For production (update in source)

---

## Security Best Practices

### Private Key Safety

✅ **DO:**
- Store private keys in environment variables
- Use separate wallets for testing (devnet) and production (mainnet)
- Set reasonable payment limits
- Regularly check payment history

❌ **DON'T:**
- Commit private keys to git
- Share private keys in chat or screenshots
- Use production wallets without payment limits
- Ignore payment history

### Payment Limits

Recommended limits based on usage:

| Use Case        | Recommended Limit |
| --------------- | ----------------- |
| Testing         | 0.01 SOL          |
| Light Usage     | 0.1 SOL           |
| Regular Usage   | 0.5 SOL           |
| Heavy Usage     | 1.0 SOL           |

---

## Troubleshooting

### "Bad secret key size" error

Your private key format is incorrect. Ensure it's in base58 format:

```bash
# Convert from JSON array to base58
node -e "console.log(require('bs58').encode(Buffer.from([your,array,here])))"
```

### "Module not found" error

Clear npx cache and reinstall:

```bash
npx clear-npx-cache
# Restart Claude Desktop
```

### "Payment failed" error

Check:
1. Wallet has sufficient balance (`get-balance`)
2. Network connectivity to Solana RPC
3. Private key is valid
4. Payment limit not exceeded

### Tool not appearing in Claude

1. Verify config file location and syntax
2. Restart Claude Desktop completely
3. Check Claude Desktop logs for errors
4. Test with MCP Inspector

---

## Development

### Local Development

```bash
# Clone repository
git clone https://github.com/Kishore-MK/ai42-mcp
cd ai42-mcp

# Install dependencies
npm install

# Create .env file
echo "SOLANA_PRIVATE_KEY=your_key" > .env

# Build
npm run build

# Test locally
node dist/index.js
```

### Project Structure

```
ai42-mcp/
├── src/
│   ├── index.ts          # Main MCP server
|   ├── payment.ts        # Payment client wrapper
│   └── types.ts          # Types file
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

---

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Links

- 📦 **NPM Package**: [@ai42/mcp](https://www.npmjs.com/package/@ai42/mcp)
- 💻 **GitHub Repository**: [ai42-mcp](https://github.com/Kishore-MK/ai42-mcp)
- 📖 **X402 Protocol**: [x402.org](https://x402.org)
- 🔧 **MCP SDK**: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Acknowledgments

Built with:

- [X402 Protocol](https://x402.org) - HTTP 402 payment standard
- [x402-fetch](https://github.com/x402/x402-fetch) - Payment wrapper for Node.js
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP SDK
- [@solana/web3.js](https://solana.com) - Solana blockchain interaction

---

<div align="center">

**Made with ❤️ by keyaru**

[NPM](https://www.npmjs.com/package/@ai42/mcp) • [GitHub](https://github.com/Kishore-MK/ai42-mcp) • [Issues](https://github.com/Kishore-MK/ai42-mcp/issues)

</div>