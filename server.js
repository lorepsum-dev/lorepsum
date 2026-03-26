const http = require ('node:http');
const CharacterController = require('./src/controllers/characters');

const server = http.createServer(async (req, res) => {
    const url = req.url
    if (url === '/'){
        res.writeHead(200, ({'Content-Type': 'application/json; charset=utf-8'}))
        return res.end(JSON.stringify({
            message:'success'
        }))
    }

    if(url === '/characters'){
        return CharacterController.listAll(req, res);
    }

    if(url.startsWith(`/characters/id`)){
        return CharacterController.byId(req,res)
    }
})

server.listen(3000, () => {
    console.log('API ONLINE!')
})