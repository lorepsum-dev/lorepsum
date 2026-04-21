const http = require ('node:http');
const fs = require('node:fs');
const path = require('node:path');
const routes = require('./src/router');


const server = http.createServer(async (req, res) => {
    const {url, method} = req

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

    if (method === 'OPTIONS') {
        res.writeHead(204)
        return res.end()
    }

    if (url.startsWith('/avatars/')) {
        const filePath = path.join(__dirname, 'public', url)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404)
                return res.end('Not found')
            }
            res.writeHead(200, { 'Content-Type': 'image/png' })
            res.end(data)
        })
        return
    }

    if (url === '/'){
        res.writeHead(200, ({'Content-Type': 'application/json; charset=utf-8'}))
        return res.end(JSON.stringify({
            message:'success'
        }))
    }

    for (const route of routes) {
      const match = url.match(route.pattern)

      if (!match || method !== route.method) {
        continue
      }
      req.params = route.getParams ? route.getParams(match) : {}

      return route.handler(req, res)
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Rota nãou encontrada no Lorepsum' }))

})

server.listen(3000, () => {
    console.log('API ONLINE!')
})

