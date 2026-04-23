const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const routes = require('./src/router');
const { sendJson } = require('./src/utils/responses');

const PORT = Number(process.env.PORT) || 3000;

function getPathname(url = '/') {
    return new URL(url, 'http://localhost').pathname;
}

function serveAvatar(pathname, res) {
    const relativePath = pathname.replace(/^\/+/, '');
    const filePath = path.join(__dirname, 'public', relativePath);

    fs.readFile(filePath, (error, data) => {
        if (error) {
            return sendJson(res, 404, {
                status: 'error',
                message: 'Asset not found'
            });
        }

        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const method = req.method ?? 'GET';
    const pathname = getPathname(req.url);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    if (pathname.startsWith('/avatars/')) {
        serveAvatar(pathname, res);
        return;
    }

    if (pathname === '/') {
        return sendJson(res, 200, {
            status: 'success',
            message: 'Lorepsum API online'
        });
    }

    for (const route of routes) {
        const match = pathname.match(route.pattern);

        if (!match || method !== route.method) {
            continue;
        }

        req.params = route.getParams ? route.getParams(match) : {};
        req.pathname = pathname;

        return route.handler(req, res);
    }

    return sendJson(res, 404, {
        status: 'error',
        message: 'Route not found'
    });
});

server.listen(PORT, () => {
    console.log(`API online on port ${PORT}`);
});
