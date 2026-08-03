import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as taskManager from './src/taskManager.ts';
import * as tdo from './src/tdo.ts'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, './public');
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

async function parseBody<T = Record<string, any>>(req: http.IncomingMessage): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let body = '';
            req.on('data', (chunk: Buffer) => { 
                body += chunk.toString(); 
            });
            req.on('end', () => {
                if (!body) return resolve({} as T);
                try {
                    const parsed: T = JSON.parse(body);
                    resolve(parsed);
                } catch (err) {
                    reject(new Error('Invalid JSON payload'));
                }
            });
            req.on('error', reject);
        });
    
}

function sendJSON<T>(res: http.ServerResponse, statusCode: tdo.HttpStatus, data: T): void {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

async function serveStaticFile(req: http.IncomingMessage, res: http.ServerResponse, filePath: string) {
    try {
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'text/plain';
        const content = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            res.writeHead(tdo.HttpStatus.NOT_FOUND, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(tdo.HttpStatus.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
            res.end('500 Server Error');
        }
    }
}

export function createServer() {
    return http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
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
                        const task = taskManager.getTaskById(Number(taskId));
                        if (!task) return sendJSON(res, tdo.HttpStatus.NOT_FOUND, { error: 'Task not found' });
                        return sendJSON(res, tdo.HttpStatus.OK, task);
                    }
                    const tasks = taskManager.getAllTasks();
                    return sendJSON(res, tdo.HttpStatus.OK, tasks);
                }

                // POST /api/tasks
                if (method === 'POST') {
                    const body = await parseBody(req);
                    const newTask = await taskManager.createTask(body as tdo.CreateTaskDTO);
                    return sendJSON(res, tdo.HttpStatus.CREATED, newTask);
                }

                // PATCH or PUT /api/tasks/:id
                if ((method === 'PATCH' || method === 'PUT') && taskId) {
                    const body = await parseBody(req);
                    const updatedTask = await taskManager.updateTask(Number(taskId), body);
                    return sendJSON(res, tdo.HttpStatus.OK, updatedTask);
                }

                // DELETE /api/tasks/:id
                if (method === 'DELETE' && taskId) {
                    const result = await taskManager.deleteTask(Number(taskId));
                    return sendJSON(res, tdo.HttpStatus.OK, result);
                }

                return sendJSON(res, tdo.HttpStatus.METHOD_NOT_ALLOWED, { error: 'Method Not Allowed' });
            } catch (err: any) {
                return sendJSON(res, tdo.HttpStatus.BAD_REQUEST, { error: err.message });
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

    function tryListen(portToTry: number) {
        server.removeAllListeners('error');
        server.on('error', (err: any) => {
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
            console.log(`Task Manager Web Server running at:`);
            console.log(`http://localhost:${actualPort}/`);
            console.log(`==================================================\n`);
        });
    }

    tryListen(Number(targetPort));
    return server;
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'))) {
    startServer();
}


startServer();