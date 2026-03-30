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
    
    async findBy(req, res){
        try{
            const value = req.params.value;
            const data = await characters.find(value);
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