# AI42 X402 Payment MCP Server

An MCP server that automatically handles web requests with X402 payments. Fetches data from any URL and seamlessly processes payments when required (402 status).

## Setup

### Prerequisites
- Node.js 18+
- Solana wallet private key (devnet)
- Claude Desktop or MCP Inspector

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
SOLANA_PRIVATE_KEY=your_private_key_here
```

3. **Build the project:**
```bash
npm run build
```

### Configure Claude Desktop

Add to your `claude_desktop_config.json`:

**Windows:**
```json
{
  "mcpServers": {
    "x402-payment": {
      "command": "node",
      "args": ["/home/username/path/to/dist/index.js"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_private_key_here"
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
        "SOLANA_PRIVATE_KEY": "your_private_key_here"
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

## Usage

Simply ask Claude to fetch data from any URL:

- "Get data from https://api.example.com/endpoint"
- "Fetch https://paid-service.com/premium-data"
- "POST this data to https://api.example.com: {\"message\": \"hello\"}"

Payments are handled automatically when sites return 402 status.

## Features

- ✅ Automatic X402 payment handling
- ✅ Supports GET and POST requests
- ✅ Transparent payment processing
- ✅ Solana devnet integration