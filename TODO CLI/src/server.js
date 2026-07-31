import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as taskManager from './taskManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DEFAULT_PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Invalid JSON payload'));
            }
        });
        req.on('error', reject);
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

async function serveStaticFile(req, res, filePath) {
    try {
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'text/plain';
        const content = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Server Error');
        }
    }
}

export function createServer() {
    return http.createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const method = req.method.toUpperCase();
        const pathname = url.pathname;

        // Handle CORS Preflight
        if (method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            return res.end();
        }

        // --- API ROUTES ---
        if (pathname.startsWith('/api/tasks')) {
            try {
                const idMatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
                const taskId = idMatch ? idMatch[1] : null;

                // GET /api/tasks
                if (method === 'GET') {
                    if (taskId) {
                        const task = taskManager.getTaskById(taskId);
                        if (!task) return sendJSON(res, 404, { error: 'Task not found' });
                        return sendJSON(res, 200, task);
                    }
                    const tasks = taskManager.getAllTasks();
                    return sendJSON(res, 200, tasks);
                }

                // POST /api/tasks
                if (method === 'POST') {
                    const body = await parseBody(req);
                    const newTask = await taskManager.createTask(body);
                    return sendJSON(res, 201, newTask);
                }

                // PATCH or PUT /api/tasks/:id
                if ((method === 'PATCH' || method === 'PUT') && taskId) {
                    const body = await parseBody(req);
                    const updatedTask = await taskManager.updateTask(taskId, body);
                    return sendJSON(res, 200, updatedTask);
                }

                // DELETE /api/tasks/:id
                if (method === 'DELETE' && taskId) {
                    const result = await taskManager.deleteTask(taskId);
                    return sendJSON(res, 200, result);
                }

                return sendJSON(res, 405, { error: 'Method Not Allowed' });
            } catch (err) {
                return sendJSON(res, 400, { error: err.message });
            }
        }

        // --- STATIC FILES ROUTING ---
        let targetFile = pathname === '/' || pathname === '/index.html' || pathname === '/task.html' ? 'index.html' : pathname.replace(/^\//, '');
        const safePath = path.normalize(path.join(PUBLIC_DIR, targetFile));

        // Prevent directory traversal outside of public folder
        if (!safePath.startsWith(PUBLIC_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('403 Forbidden');
        }

        await serveStaticFile(req, res, safePath);
    });
}

export async function startServer(targetPort = DEFAULT_PORT) {
    await taskManager.loadTasksFromFile();
    const server = createServer();
    
    function tryListen(portToTry) {
        server.removeAllListeners('error');
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️  Port ${portToTry} is in use, trying port ${portToTry + 1}...`);
                tryListen(portToTry + 1);
            } else {
                console.error("Server error:", err);
            }
        });
        server.listen(portToTry, () => {
            const actualPort = server.address().port;
            console.log(`\n==================================================`);
            console.log(`🚀 Task Manager Web Server running at:`);
            console.log(`👉 http://localhost:${actualPort}/`);
            console.log(`==================================================\n`);
        });
    }

    tryListen(Number(targetPort));
    return server;
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'))) {
    startServer();
}
