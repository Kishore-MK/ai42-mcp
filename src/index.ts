import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSigner } from "x402-fetch";
import { z } from "zod";
import { ServerPaymentClient } from "./payment.js";
  

// Create server instance
const server = new McpServer({
  name: "X402 Payment MCP Server",
  version: "1.0.0",
});

// Register weather tools
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
      const data = await response.json();
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, data })
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