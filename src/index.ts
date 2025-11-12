#!/usr/bin/env node


import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSigner } from "x402-fetch";
import { z } from "zod";
import { ServerPaymentClient } from "./payment.js";
import { Connection, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import bs58 from 'bs58';

interface PaymentRecord {
  url: string;
  amount: number;
  recipient: string;
  timestamp: string;
  signature: string;
}

let paymentHistory: PaymentRecord[] = [];
let paymentLimit: number | null = null;

// Create server instance
const server = new McpServer({
  name: "X402 Payment MCP Server",
  version: "1.0.0",
});

// Get wallet balance
server.registerTool(
  "get-balance",
  {
    title: "Get Wallet Balance",
    description: "Check the current SOL balance in your wallet",
    inputSchema: {},
  },
  async () => {
    try {
      const signer = await createSigner("solana-devnet", process.env.SOLANA_PRIVATE_KEY || " ");
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      const privateKeyBytes = bs58.decode(process.env.SOLANA_PRIVATE_KEY || "");
 

      const keypair = Keypair.fromSecretKey(privateKeyBytes);
      const publicKey = keypair.publicKey;

      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            balance: solBalance,
            unit: "SOL",
            network: "devnet",
            address: publicKey
          }, null, 2)
        }]
      };
    } catch (err: any) {
      return {
        content: [{
          type: "text",
          text: `Error: ${err.message || "Failed to get balance"}`
        }],
        isError: true
      };
    }
  }
);

// Get payment history
server.registerTool(
  "get-payment-history",
  {
    title: "Get Payment History",
    description: "View all payments made during this session",
    inputSchema: {
      limit: z.number().optional().describe("Maximum number of records to return (default: all)")
    },
  },
  async ({ limit }) => {
    try {
      const records = limit ? paymentHistory.slice(-limit) : paymentHistory;

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            total_payments: paymentHistory.length,
            records: records,
            total_spent: paymentHistory.reduce((sum, r) => sum + r.amount, 0)
          }, null, 2)
        }]
      };
    } catch (err: any) {
      return {
        content: [{
          type: "text",
          text: `Error: ${err.message || "Failed to get payment history"}`
        }],
        isError: true
      };
    }
  }
);

// Set payment limit
server.registerTool(
  "set-payment-limit",
  {
    title: "Set Payment Limit",
    description: "Set maximum amount willing to pay per request (in SOL). Set to 0 to remove limit.",
    inputSchema: {
      limit: z.number().describe("Maximum payment amount in SOL (0 to remove limit)")
    },
  },
  async ({ limit }) => {
    try {
      if (limit < 0) {
        throw new Error("Limit must be non-negative");
      }

      paymentLimit = limit === 0 ? null : limit;

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: paymentLimit === null
              ? "Payment limit removed"
              : `Payment limit set to ${paymentLimit} SOL`,
            current_limit: paymentLimit
          }, null, 2)
        }]
      };
    } catch (err: any) {
      return {
        content: [{
          type: "text",
          text: `Error: ${err.message || "Failed to set payment limit"}`
        }],
        isError: true
      };
    }
  }
);

 
// Modified fetch-with-payment to track payments and enforce limits
server.registerTool(
  "fetch-with-payment",
  {
    title: "Fetch Data",
    description: "Fetch data from a website or API. Automatically handles payment if required (402 status).",
    inputSchema: {
      url: z.string().describe("The URL to fetch data from"),
      method: z.enum(["GET", "POST"]).optional().describe("HTTP method (default: GET)"),
      body: z.string().optional().describe("Request body for POST requests (JSON string)")
    },
  },
  async ({ url, method = "GET", body }) => {
    try {
      const signer = await createSigner("solana-devnet", process.env.SOLANA_PRIVATE_KEY || " ");
      const paymentClient = new ServerPaymentClient({ network: 'solana-devnet', signer });

      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (method === "POST" && body) {
        options.body = body;
      }

      const response = await paymentClient.fetch(url, options);

      // Track payment if one was made
      const paymentInfo = (paymentClient as any).extractPaymentInfo?.(response);
      if (paymentInfo) {
        const amountInSol = paymentInfo.amount / LAMPORTS_PER_SOL;

        // Check payment limit
        if (paymentLimit !== null && amountInSol > paymentLimit) {
          throw new Error(`Payment amount (${amountInSol} SOL) exceeds limit (${paymentLimit} SOL)`);
        }

        paymentHistory.push({
          url,
          amount: amountInSol,
          recipient: paymentInfo.recipient,
          timestamp: new Date().toISOString(),
          signature: paymentInfo.signature
        });
      }

      const data = await response.json();

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            data,
            payment_made: !!paymentInfo,
            payment_amount: paymentInfo ? paymentInfo.amount / LAMPORTS_PER_SOL : 0
          })
        }]
      };
    } catch (err: any) {
      return {
        content: [{
          type: "text",
          text: `Error: ${err.message || "Request failed"}`
        }],
        isError: true
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("X402 Payment MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});