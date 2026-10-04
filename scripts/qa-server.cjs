/* Test-only static server; loopback and repository files only. No dependencies. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };

async function startServer() {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((request, response) => {
    let file;
    try { file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`); }
    catch { response.writeHead(400).end(); return; }
    if (!file.startsWith(`${root}${path.sep}`) && file !== root) { response.writeHead(403).end(); return; }
    const relative = path.relative(root, file);
    if (relative.split(path.sep).some(part => part.startsWith('.'))) { response.writeHead(403).end(); return; }
    fs.stat(file, (error, stat) => {
      if (error) { response.writeHead(404).end(); return; }
      if (stat.isDirectory()) file = path.join(file, 'index.html');
      const stream = fs.createReadStream(file);
      stream.on('error', () => { if (!response.headersSent) response.writeHead(404); response.end(); });
      stream.on('open', () => {
        response.setHeader('Content-Type', mimeTypes[path.extname(file)] || 'application/octet-stream');
        response.setHeader('Cache-Control', 'no-store');
        stream.pipe(response);
      });
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

module.exports = { startServer };
