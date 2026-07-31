import { startServer } from './src/server.js';
import { runCLI } from './src/cli.js';

// Check if launched with --cli flag
if (process.argv.includes('--cli')) {
    runCLI();
} else {
    startServer();
}
