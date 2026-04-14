const http = require ('node:http');
const routes = require('./src/router');


const server = http.createServer(async (req, res) => {
    const {url, method} = req
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

