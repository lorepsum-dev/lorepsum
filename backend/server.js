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

   for (const route of routes){
        const match = url.match(route.pattern);  //characters/1
        
        if(match && method == route.method){ //characters/1 && GET
         req.params = {value: match[1]}
         return route.handler(req, res)
        }
   }
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Rota não encontrada no Lorepsum' }));

})

server.listen(3000, () => {
    console.log('API ONLINE!')
})

