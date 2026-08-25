import { createServer } from 'node:http';
import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = createServer(createApp());
server.listen(port, '127.0.0.1', () => {
  console.log(`Synthetic KorailLive API listening on http://127.0.0.1:${port}`);
});
