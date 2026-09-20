import { spawn } from 'node:child_process';
import path from 'node:path';

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '3000';
const hostname = '0.0.0.0';

console.log(`[King's Platter] Starting Next.js server on ${hostname}:${port}...`);
console.log(`[King's Platter] Catalyst AppSail listen port: ${process.env.X_ZOHO_CATALYST_LISTEN_PORT || 'not set (using default/PORT)'}`);

const nextBin = path.resolve('node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn(process.execPath, [nextBin, 'start', '-H', hostname, '-p', String(port)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (err) => {
  console.error("[King's Platter] Failed to start server:", err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (code !== null) {
    process.exit(code);
  } else if (signal) {
    process.kill(process.pid, signal);
  }
});
