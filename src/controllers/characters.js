const characters = require('../repositories/character');

const  CharacterController = {
    async listAll(req, res){
        try {
            const data = await characters.findAll();
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                results: data.length,
                characters: data
            }))
        }              
        catch(error){
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
            status: 'error',
            msg: 'Tremor no Submundo! (erro de conexão)'
            }))
        }

    },

    async byId(req, res){
        try{
            const id = req.url.split('=')[1]
            const data = await characters.findById(id);
            res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                character: data
            }))
        }
        catch(error){
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
            status: 'error',
            msg: 'Personagem no Hades! (erro de conexão)'
            }))
        }
    }
}




module.exports = CharacterController