#!/usr/bin/env node

// Simple test to verify the MCP server can start
import { spawn } from 'child_process';

console.log('Testing BeforeAfterUI MCP Server...');

// Set environment variable for testing
process.env.GEMINI_API_KEY = 'test-key-for-startup-test';

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('Server stderr:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  console.log('Output:', output);
  console.log('Error output:', errorOutput);
});

// Send a simple test message to see if server responds
setTimeout(() => {
  console.log('Sending test message...');
  server.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  }) + '\n');
}, 1000);

// Kill server after 5 seconds
setTimeout(() => {
  console.log('Terminating server...');
  server.kill();
}, 5000);
